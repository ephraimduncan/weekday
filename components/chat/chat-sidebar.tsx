"use client";

import { useRef, useState } from "react";

import type { ToolCall, ToolInvocation, Message as UIMessage } from "ai";

import { type UseChatOptions, useChat } from "@ai-sdk/react";
import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";
import { nanoid } from "nanoid";
import { match } from "ts-pattern";
import { v7 as uuidv7 } from "uuid";

import { useCalendarContext } from "@/components/event-calendar/calendar-context";
import { ChatContainer } from "@/components/prompt-kit/chat-container";
import { Markdown } from "@/components/prompt-kit/markdown";
import { Message, MessageContent } from "@/components/prompt-kit/message";
import { ScrollButton } from "@/components/prompt-kit/scroll-button";
import { Button } from "@/components/ui/button";
import { useChat as useChatProvider } from "@/providers/chat-provider";
import { type RouterInputs, type RouterOutputs, api } from "@/trpc/react";

import { ChatPromptInput } from "./chat-prompt-input";
import { CreateEventCall, CreateEventResult } from "./tools/create-event";
import { GetEventCall, GetEventResult } from "./tools/get-event";
import { GetFreeSlotsCall, GetFreeSlotsResult } from "./tools/get-free-slots";
import {
  GetUpcomingEventCall,
  GetUpcomingEventResult,
} from "./tools/get-upcoming-event";
import { UpdateEventCall, UpdateEventResult } from "./tools/update-event";

type GetEventsQueryOutput = RouterOutputs["calendar"]["getEvents"] | undefined;
interface OptimisticEventData {
  optimisticEventId: string;
  previousEvents: GetEventsQueryOutput;
  timeArgs: { timeMax: string; timeMin: string };
}

type ProcessedEventType = RouterOutputs["calendar"]["getEvents"][number];

export function ChatSidebar() {
  const { isChatOpen } = useChatProvider();
  const { currentDate } = useCalendarContext();
  const utils = api.useUtils();

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [chatId, setChatId] = useState(nanoid());

  const optimisticEventsRef = useRef<Map<string, OptimisticEventData>>(
    new Map(),
  );

  const computeTimeArgs = (date: Date) => {
    if (!date) return null;
    const start = startOfMonth(subMonths(date, 1));
    const end = endOfMonth(addMonths(date, 1));
    return {
      timeMax: end.toISOString(),
      timeMin: start.toISOString(),
    };
  };

  const { input, messages, setInput, setMessages, status, stop, handleSubmit } =
    useChat({
      id: chatId,
      api: "/api/ai/chat",
      onFinish: (message) => {
        const currentTimeArgs = computeTimeArgs(currentDate);

        if (message.parts) {
          for (const part of message.parts) {
            if (part.type === "tool-invocation") {
              const toolInvocation = part.toolInvocation as ToolInvocation;

              if (
                toolInvocation.toolName === "createEvent" &&
                toolInvocation.state === "result"
              ) {
                const rollbackData = optimisticEventsRef.current.get(
                  toolInvocation.toolCallId,
                );

                if (toolInvocation.result.error) {
                  if (rollbackData) {
                    utils.calendar.getEvents.setData(
                      rollbackData.timeArgs,
                      (oldEvents: GetEventsQueryOutput) =>
                        oldEvents?.filter(
                          (event) =>
                            event.id !== rollbackData.optimisticEventId,
                        ) as GetEventsQueryOutput,
                    );
                    optimisticEventsRef.current.delete(
                      toolInvocation.toolCallId,
                    );
                    console.warn(
                      `Rolled back optimistic createEvent for toolCallId: ${toolInvocation.toolCallId}`,
                    );
                  }
                } else {
                  if (rollbackData) {
                    const serverEvent =
                      toolInvocation.result as ProcessedEventType;
                    utils.calendar.getEvents.setData(
                      rollbackData.timeArgs,
                      (oldEvents: GetEventsQueryOutput) =>
                        oldEvents?.map((event) =>
                          event.id === rollbackData.optimisticEventId
                            ? serverEvent
                            : event,
                        ) as GetEventsQueryOutput,
                    );
                    optimisticEventsRef.current.delete(
                      toolInvocation.toolCallId,
                    );
                  }
                }
              }

              if (
                (toolInvocation.toolName === "createEvent" ||
                  toolInvocation.toolName === "updateEvent") &&
                toolInvocation.state === "result" &&
                !toolInvocation.result.error
              ) {
                console.log(
                  "Invalidating getEvents and getFreeSlots for successful:",
                  toolInvocation.toolName,
                  toolInvocation.toolCallId,
                );
                if (currentTimeArgs) {
                  utils.calendar.getEvents.invalidate(currentTimeArgs);
                  utils.calendar.getFreeSlots.invalidate(currentTimeArgs);
                } else {
                  utils.calendar.getEvents.invalidate();
                  utils.calendar.getFreeSlots.invalidate();
                }
              }
            }
          }
        }
      },
      onToolCall: async ({
        toolCall,
      }: {
        toolCall: ToolCall<string, unknown>;
      }) => {
        const currentTimeArgs = computeTimeArgs(currentDate);
        if (!currentTimeArgs) {
          console.warn(
            `ChatSidebar: Optimistic update for tool '${toolCall.toolName}' skipped, calendar context (currentDate) not available.`,
          );
          return undefined;
        }

        if (toolCall.toolName === "createEvent" && toolCall.args) {
          try {
            const llmArgs = toolCall.args as {
              allDay?: boolean;
              calendarId?: string;
              color?: string;
              createMeetLink?: boolean;
              description?: string;
              endTime?: Date | string;
              location?: string;
              startTime?: Date | string;
              summary?: string;
            };
            const mappedArgs: RouterInputs["calendar"]["createEvent"] = {
              calendarId: llmArgs.calendarId ?? "primary",
              createMeetLink: llmArgs.createMeetLink ?? false,
              event: {
                allDay: llmArgs.allDay ?? false,
                color: llmArgs.color,
                description: llmArgs.description,
                end: llmArgs.endTime
                  ? new Date(llmArgs.endTime)
                  : new Date(Date.now() + 60 * 60 * 1000),
                location: llmArgs.location,
                start: llmArgs.startTime
                  ? new Date(llmArgs.startTime)
                  : new Date(),
                title: llmArgs.summary ?? "Untitled Event",
              },
            };
            if (
              !mappedArgs.event.start ||
              !mappedArgs.event.end ||
              !mappedArgs.event.title
            ) {
              console.warn(
                `Optimistic createEvent for toolCallId '${toolCall.toolCallId}' skipped: missing essential fields after mapping`,
                mappedArgs,
              );
              return undefined;
            }
            await utils.calendar.getEvents.cancel(currentTimeArgs);
            const previousEvents =
              utils.calendar.getEvents.getData(currentTimeArgs);
            const tempOptimisticEventId = uuidv7();
            const optimisticEvent: ProcessedEventType = {
              id: tempOptimisticEventId,
              allDay: mappedArgs.event.allDay ?? false,
              calendarId: mappedArgs.calendarId,
              color: mappedArgs.event.color ?? "#3174ad",
              description: mappedArgs.event.description,
              end: mappedArgs.event.end,
              location: mappedArgs.event.location,
              start: mappedArgs.event.start,
              title: mappedArgs.event.title,
            };
            utils.calendar.getEvents.setData(
              currentTimeArgs,
              (oldEvents: GetEventsQueryOutput) =>
                (oldEvents
                  ? [...oldEvents, optimisticEvent]
                  : [optimisticEvent]) as GetEventsQueryOutput,
            );
            optimisticEventsRef.current.set(toolCall.toolCallId, {
              optimisticEventId: tempOptimisticEventId,
              previousEvents,
              timeArgs: currentTimeArgs,
            });
          } catch (error) {
            console.error(
              `Error during optimistic event creation for toolCallId '${toolCall.toolCallId}':`,
              error,
            );
          }
        }
        return undefined;
      },
    } satisfies UseChatOptions);

  const handleFormSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!input.trim()) {
      return;
    }

    handleSubmit(e);
  };

  const handleNewChat = () => {
    setMessages([]);
    setChatId(nanoid());
  };

  const isLoading = status === "submitted" || status === "streaming";

  if (!isChatOpen) {
    return null;
  }

  console.log(messages);

  return (
    <div className="bg-background flex h-full flex-1 flex-col gap-4 rounded-2xl pt-0">
      <div className="relative flex h-[calc(100vh-1rem)] w-full flex-col overflow-hidden">
        <div className="flex w-full items-center justify-between border-b p-3">
          <div />
          <Button size="sm" onClick={handleNewChat}>
            New Chat
          </Button>
        </div>

        <ChatContainer
          ref={containerRef}
          className="flex-1 space-y-4 border-t p-4"
          scrollToRef={bottomRef}
        >
          {messages.map((message: UIMessage) => {
            const isAssistant = message.role === "assistant";

            return (
              <Message key={message.id}>
                <div className="flex-1 space-y-2">
                  {message.parts?.map((part, index) => {
                    const toolInvocation =
                      part.type === "tool-invocation"
                        ? (part.toolInvocation as ToolInvocation)
                        : undefined;
                    const toolCallId = toolInvocation?.toolCallId;

                    return match(part)
                      .with({ type: "text" }, ({ text }) =>
                        match(isAssistant)
                          .with(true, () => (
                            <div
                              key={`${message.id}-text-${index}`}
                              className="text-foreground prose rounded-lg p-2"
                            >
                              <Markdown className="prose dark:prose-invert">
                                {String(text)}
                              </Markdown>
                            </div>
                          ))
                          .with(false, () => (
                            <MessageContent
                              key={`${message.id}-text-${index}`}
                              className="bg-sidebar text-primary-foreground dark:text-foreground prose-invert"
                              markdown
                            >
                              {String(text)}
                            </MessageContent>
                          ))
                          .exhaustive(),
                      )
                      .with(
                        {
                          toolInvocation: {
                            state: "call",
                            toolName: "getEvents",
                          },
                          type: "tool-invocation",
                        },
                        () => <GetEventCall key={toolCallId} />,
                      )
                      .with(
                        {
                          toolInvocation: {
                            state: "result",
                            toolName: "getEvents",
                          },
                          type: "tool-invocation",
                        },
                        ({ toolInvocation }) => (
                          <GetEventResult
                            key={toolCallId}
                            toolInvocation={toolInvocation as ToolInvocation}
                          />
                        ),
                      )
                      .with(
                        {
                          toolInvocation: {
                            state: "call",
                            toolName: "createEvent",
                          },
                          type: "tool-invocation",
                        },
                        () => <CreateEventCall key={toolCallId} />,
                      )
                      .with(
                        {
                          toolInvocation: {
                            state: "result",
                            toolName: "createEvent",
                          },
                          type: "tool-invocation",
                        },
                        ({ toolInvocation }) => (
                          <CreateEventResult
                            key={toolCallId}
                            toolInvocation={toolInvocation as ToolInvocation}
                          />
                        ),
                      )
                      .with(
                        {
                          toolInvocation: {
                            state: "call",
                            toolName: "updateEvent",
                          },
                          type: "tool-invocation",
                        },
                        ({ toolInvocation }) => (
                          <UpdateEventCall
                            key={toolCallId}
                            toolInvocation={toolInvocation as ToolInvocation}
                          />
                        ),
                      )
                      .with(
                        {
                          toolInvocation: {
                            state: "result",
                            toolName: "updateEvent",
                          },
                          type: "tool-invocation",
                        },
                        ({ toolInvocation }) => (
                          <UpdateEventResult
                            key={toolCallId}
                            message={message}
                            toolInvocation={toolInvocation as ToolInvocation}
                          />
                        ),
                      )
                      .with(
                        {
                          toolInvocation: {
                            state: "call",
                            toolName: "getNextUpcomingEvent",
                          },
                          type: "tool-invocation",
                        },
                        () => <GetUpcomingEventCall key={toolCallId} />,
                      )
                      .with(
                        {
                          toolInvocation: {
                            state: "result",
                            toolName: "getNextUpcomingEvent",
                          },
                          type: "tool-invocation",
                        },
                        ({ toolInvocation }) => (
                          <GetUpcomingEventResult
                            key={toolCallId}
                            toolInvocation={toolInvocation as ToolInvocation}
                          />
                        ),
                      )
                      .with(
                        {
                          toolInvocation: {
                            state: "call",
                            toolName: "getFreeSlots",
                          },
                          type: "tool-invocation",
                        },
                        () => <GetFreeSlotsCall key={toolCallId} />,
                      )
                      .with(
                        {
                          toolInvocation: {
                            state: "result",
                            toolName: "getFreeSlots",
                          },
                          type: "tool-invocation",
                        },
                        ({ toolInvocation }) => (
                          <GetFreeSlotsResult
                            key={toolCallId}
                            toolInvocation={toolInvocation as ToolInvocation}
                          />
                        ),
                      )
                      .otherwise(() => null);
                  })}

                  {message.parts?.length === 0 && (
                    <>
                      {match(isAssistant)
                        .with(true, () => (
                          <div className="bg-secondary text-foreground prose rounded-lg p-2">
                            <Markdown className="prose dark:prose-invert">
                              {String(message.content || "")}
                            </Markdown>
                          </div>
                        ))
                        .with(false, () => (
                          <MessageContent
                            className="bg-primary text-primary-foreground prose-invert"
                            markdown
                          >
                            {String(message.content || "")}
                          </MessageContent>
                        ))
                        .exhaustive()}
                    </>
                  )}
                </div>
              </Message>
            );
          })}
          <div ref={bottomRef} />
        </ChatContainer>

        <div className="border-border relative border-t p-2">
          <ChatPromptInput
            value={input}
            onSubmit={handleFormSubmit}
            onValueChange={setInput}
            isLoading={isLoading}
          />
        </div>

        <div className="absolute right-7 bottom-20">
          <ScrollButton
            className="shadow-sm"
            containerRef={containerRef}
            scrollRef={bottomRef}
          />
        </div>
      </div>
    </div>
  );
}
