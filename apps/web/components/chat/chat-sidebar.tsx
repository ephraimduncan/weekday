"use client";

import { useRef, useState } from "react";

import type { ToolUIPart, UIMessage } from "ai";

import { type UseChatOptions, useChat } from "@ai-sdk/react";
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

    onFinish: ({ message }: { message: UIMessage }) => {
      if (message.parts) {
        for (const part of message.parts) {
          if (
            part.type === "tool-createEvent" ||
            part.type === "tool-createRecurringEvent" ||
            part.type === "tool-updateEvent" ||
            part.type === "tool-deleteEvent"
          ) {
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
  } satisfies UseChatOptions<UIMessage>);

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

            console.log(message);

            return (
              <Message key={message.id}>
                <div className="flex-1 space-y-2">
                  {message.parts?.map((part, index) => {
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

                    return (
                      match(part.type)
                        .with("tool-getEvents", () => {
                          const toolPart = part as ToolUIPart;
                          if (toolPart.state === "input-available") {
                            return (
                              <GetEventCall key={`${message.id}-${index}`} />
                            );
                          } else if (toolPart.state === "output-available") {
                            return (
                              <GetEventResult
                                key={`${message.id}-${index}`}
                                toolInvocation={toolPart}
                              />
                            );
                          }
                          return null;
                        })
                        // Handle createEvent tool
                        .with("tool-createEvent", () => {
                          const toolPart = part as ToolUIPart;
                          if (toolPart.state === "input-available") {
                            return (
                              <CreateEventCall key={`${message.id}-${index}`} />
                            );
                          } else if (toolPart.state === "output-available") {
                            return (
                              <CreateEventResult
                                key={`${message.id}-${index}`}
                                toolInvocation={toolPart}
                              />
                            );
                          }
                          return null;
                        })
                        // Handle createRecurringEvent tool
                        .with("tool-createRecurringEvent", () => {
                          const toolPart = part as ToolUIPart;
                          if (toolPart.state === "input-available") {
                            return (
                              <CreateRecurringEventCall
                                key={`${message.id}-${index}`}
                              />
                            );
                          } else if (toolPart.state === "output-available") {
                            return (
                              <CreateRecurringEventResult
                                key={`${message.id}-${index}`}
                                toolInvocation={toolPart}
                              />
                            );
                          }
                          return null;
                        })
                        // Handle updateEvent tool
                        .with("tool-updateEvent", () => {
                          const toolPart = part as ToolUIPart;
                          if (toolPart.state === "input-available") {
                            return (
                              <UpdateEventCall
                                key={`${message.id}-${index}`}
                                toolInvocation={toolPart}
                              />
                            );
                          } else if (toolPart.state === "output-available") {
                            return (
                              <UpdateEventResult
                                key={`${message.id}-${index}`}
                                message={message}
                                toolInvocation={toolPart}
                              />
                            );
                          }
                          return null;
                        })
                        // Handle getNextUpcomingEvent tool
                        .with("tool-getNextUpcomingEvent", () => {
                          const toolPart = part as ToolUIPart;
                          if (toolPart.state === "input-available") {
                            return (
                              <GetUpcomingEventCall
                                key={`${message.id}-${index}`}
                              />
                            );
                          } else if (toolPart.state === "output-available") {
                            return (
                              <GetUpcomingEventResult
                                key={`${message.id}-${index}`}
                                toolInvocation={toolPart}
                              />
                            );
                          }
                          return null;
                        })
                        // Handle getFreeSlots tool
                        .with("tool-getFreeSlots", () => {
                          const toolPart = part as ToolUIPart;
                          if (toolPart.state === "input-available") {
                            return (
                              <GetFreeSlotsCall
                                key={`${message.id}-${index}`}
                              />
                            );
                          } else if (toolPart.state === "output-available") {
                            return (
                              <GetFreeSlotsResult
                                key={`${message.id}-${index}`}
                                toolInvocation={toolPart}
                              />
                            );
                          }
                          return null;
                        })
                        // Handle deleteEvent tool
                        .with("tool-deleteEvent", () => {
                          const toolPart = part as ToolUIPart;
                          if (toolPart.state === "input-available") {
                            return (
                              <DeleteEventCall key={`${message.id}-${index}`} />
                            );
                          } else if (toolPart.state === "output-available") {
                            return (
                              <DeleteEventResult
                                key={`${message.id}-${index}`}
                                toolInvocation={toolPart}
                              />
                            );
                          }
                          return null;
                        })
                        .otherwise(() => null)
                    );
                  })}

                  {message.parts?.length === 0 && (
                    <div className="text-muted-foreground p-2 text-sm italic">
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
