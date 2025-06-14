"use client";

import { useRef, useState } from "react";

import type { ToolInvocation, Message as UIMessage } from "ai";

import { type UseChatOptions, useChat } from "@ai-sdk/react";
import { nanoid } from "nanoid";
import { match } from "ts-pattern";

import { ChatContainer } from "@/components/prompt-kit/chat-container";
import { Markdown } from "@/components/prompt-kit/markdown";
import { Message, MessageContent } from "@/components/prompt-kit/message";
import { ScrollButton } from "@/components/prompt-kit/scroll-button";
import { Button } from "@/components/ui/button";
import { useChat as useChatProvider } from "@/providers/chat-provider";
import { api } from "@/trpc/react";

import { ChatPromptInput } from "./chat-prompt-input";
import {
  CreateEventCall,
  CreateEventResult,
  CreateRecurringEventCall,
  CreateRecurringEventResult,
} from "./tools/create-event";
import { DeleteEventCall, DeleteEventResult } from "./tools/delete-event";
import { GetEventCall, GetEventResult } from "./tools/get-event";
import { GetFreeSlotsCall, GetFreeSlotsResult } from "./tools/get-free-slots";
import {
  GetUpcomingEventCall,
  GetUpcomingEventResult,
} from "./tools/get-upcoming-event";
import { UpdateEventCall, UpdateEventResult } from "./tools/update-event";

export function ChatSidebar() {
  const { isChatOpen } = useChatProvider();
  const utils = api.useUtils();

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [chatId, setChatId] = useState(nanoid());

  const { input, messages, setInput, setMessages, status, stop, handleSubmit } =
    useChat({
      id: chatId,
      api: "/api/ai/chat",

      onFinish: (message) => {
        if (message.parts) {
          for (const part of message.parts) {
            if (part.type === "tool-invocation") {
              const toolInvocation = part.toolInvocation as ToolInvocation;
              if (
                toolInvocation.toolName === "createEvent" ||
                toolInvocation.toolName === "createRecurringEvent" ||
                toolInvocation.toolName === "updateEvent" ||
                toolInvocation.toolName === "deleteEvent"
              ) {
                utils.calendar.getEvents.invalidate();
              }
            }
          }
        }
      },
      onToolCall: ({ toolCall }) => {
        if (
          toolCall.toolName === "createEvent" ||
          toolCall.toolName === "createRecurringEvent" ||
          toolCall.toolName === "updateEvent" ||
          toolCall.toolName === "deleteEvent"
        ) {
          utils.calendar.getEvents.invalidate();
        }
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

  return (
    <div className="bg-background flex h-full flex-1 flex-col gap-4 rounded-lg pt-0">
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
                            toolName: "createRecurringEvent",
                          },
                          type: "tool-invocation",
                        },
                        () => <CreateRecurringEventCall key={toolCallId} />,
                      )
                      .with(
                        {
                          toolInvocation: {
                            state: "result",
                            toolName: "createRecurringEvent",
                          },
                          type: "tool-invocation",
                        },
                        ({ toolInvocation }) => (
                          <CreateRecurringEventResult
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
                      .with(
                        {
                          toolInvocation: {
                            state: "call",
                            toolName: "deleteEvent",
                          },
                          type: "tool-invocation",
                        },
                        () => <DeleteEventCall key={toolCallId} />,
                      )
                      .with(
                        {
                          toolInvocation: {
                            state: "result",
                            toolName: "deleteEvent",
                          },
                          type: "tool-invocation",
                        },
                        ({ toolInvocation }) => (
                          <DeleteEventResult
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
