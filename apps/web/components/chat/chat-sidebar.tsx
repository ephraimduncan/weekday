"use client";

import { useRef, useState } from "react";

import { type UseChatOptions, useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
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

  const [input, setInput] = useState("");

  const { messages, sendMessage, setMessages, status, stop } = useChat({
    id: chatId,
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
    }),

    onFinish: (message) => {
      if (message.parts) {
        for (const part of message.parts) {
          if (part.type === "tool-createEvent" ||
              part.type === "tool-createRecurringEvent" ||
              part.type === "tool-updateEvent" ||
              part.type === "tool-deleteEvent") {
            utils.calendar.getEvents.invalidate();
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

    sendMessage({ text: input });
    setInput("");
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
                    // Handle different part types
                    if (part.type === "text") {
                      const key = `${message.id}-text-${index}`;
                      return match(isAssistant)
                        .with(true, () => (
                          <div
                            key={key}
                            className="text-foreground prose rounded-lg p-2"
                          >
                            <Markdown className="prose dark:prose-invert">
                              {String(part.text)}
                            </Markdown>
                          </div>
                        ))
                        .with(false, () => (
                          <MessageContent
                            key={key}
                            className="bg-sidebar text-primary-foreground dark:text-foreground prose-invert"
                            markdown
                          >
                            {String(part.text)}
                          </MessageContent>
                        ))
                        .exhaustive();
                    }

                    // Handle tool parts - these now use specific tool names in the type
                    return match(part.type)
                      // Handle getEvents tool
                      .with("tool-getEvents", () => {
                        if (part.state === "input-available") {
                          return <GetEventCall key={`${message.id}-${index}`} />;
                        } else if (part.state === "output-available") {
                          return (
                            <GetEventResult
                              key={`${message.id}-${index}`}
                              toolInvocation={{
                                toolName: "getEvents",
                                state: "result",
                                result: part.output,
                                toolCallId: part.toolCallId || "",
                                args: part.input
                              }}
                            />
                          );
                        }
                        return null;
                      })
                      // Handle createEvent tool
                      .with("tool-createEvent", () => {
                        if (part.state === "input-available") {
                          return <CreateEventCall key={`${message.id}-${index}`} />;
                        } else if (part.state === "output-available") {
                          return (
                            <CreateEventResult
                              key={`${message.id}-${index}`}
                              toolInvocation={{
                                toolName: "createEvent",
                                state: "result",
                                result: part.output,
                                toolCallId: part.toolCallId || "",
                                args: part.input
                              }}
                            />
                          );
                        }
                        return null;
                      })
                      // Handle createRecurringEvent tool
                      .with("tool-createRecurringEvent", () => {
                        if (part.state === "input-available") {
                          return <CreateRecurringEventCall key={`${message.id}-${index}`} />;
                        } else if (part.state === "output-available") {
                          return (
                            <CreateRecurringEventResult
                              key={`${message.id}-${index}`}
                              toolInvocation={{
                                toolName: "createRecurringEvent",
                                state: "result",
                                result: part.output,
                                toolCallId: part.toolCallId || "",
                                args: part.input
                              }}
                            />
                          );
                        }
                        return null;
                      })
                      // Handle updateEvent tool
                      .with("tool-updateEvent", () => {
                        if (part.state === "input-available") {
                          return (
                            <UpdateEventCall
                              key={`${message.id}-${index}`}
                              toolInvocation={{
                                toolName: "updateEvent",
                                state: "call",
                                result: undefined,
                                toolCallId: part.toolCallId || "",
                                args: part.input
                              }}
                            />
                          );
                        } else if (part.state === "output-available") {
                          return (
                            <UpdateEventResult
                              key={`${message.id}-${index}`}
                              message={message}
                              toolInvocation={{
                                toolName: "updateEvent",
                                state: "result",
                                result: part.output,
                                toolCallId: part.toolCallId || "",
                                args: part.input
                              }}
                            />
                          );
                        }
                        return null;
                      })
                      // Handle getNextUpcomingEvent tool
                      .with("tool-getNextUpcomingEvent", () => {
                        if (part.state === "input-available") {
                          return <GetUpcomingEventCall key={`${message.id}-${index}`} />;
                        } else if (part.state === "output-available") {
                          return (
                            <GetUpcomingEventResult
                              key={`${message.id}-${index}`}
                              toolInvocation={{
                                toolName: "getNextUpcomingEvent",
                                state: "result",
                                result: part.output,
                                toolCallId: part.toolCallId || "",
                                args: part.input
                              }}
                            />
                          );
                        }
                        return null;
                      })
                      // Handle getFreeSlots tool
                      .with("tool-getFreeSlots", () => {
                        if (part.state === "input-available") {
                          return <GetFreeSlotsCall key={`${message.id}-${index}`} />;
                        } else if (part.state === "output-available") {
                          return (
                            <GetFreeSlotsResult
                              key={`${message.id}-${index}`}
                              toolInvocation={{
                                toolName: "getFreeSlots",
                                state: "result",
                                result: part.output,
                                toolCallId: part.toolCallId || "",
                                args: part.input
                              }}
                            />
                          );
                        }
                        return null;
                      })
                      // Handle deleteEvent tool
                      .with("tool-deleteEvent", () => {
                        if (part.state === "input-available") {
                          return <DeleteEventCall key={`${message.id}-${index}`} />;
                        } else if (part.state === "output-available") {
                          return (
                            <DeleteEventResult
                              key={`${message.id}-${index}`}
                              toolInvocation={{
                                toolName: "deleteEvent",
                                state: "result",
                                result: part.output,
                                toolCallId: part.toolCallId || "",
                                args: part.input
                              }}
                            />
                          );
                        }
                        return null;
                      })
                      .otherwise(() => null);
                  })}

                  {message.parts?.length === 0 && (
                    <div className="text-muted-foreground text-sm italic p-2">
                      No content available
                    </div>
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
