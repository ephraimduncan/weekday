"use client";

import { useState } from "react";

import type { ToolUIPart, UIMessage } from "ai";

import { type UseChatOptions, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { nanoid } from "nanoid";
import { match } from "ts-pattern";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai/conversation";
import { Message, MessageContent } from "@/components/ai/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai/reasoning";
import { Response } from "@/components/ai/response";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChat as useChatProvider } from "@/providers/chat-provider";
import { api } from "@/trpc/react";

import { Suggestion, Suggestions } from "../ai/suggestion";
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
  const utils = api.useUtils();
  const [chatId, setChatId] = useState(nanoid());
  const [input, setInput] = useState("");

  const { isChatOpen } = useChatProvider();
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

  const suggestions = [
    "Find free time next week",
    "What events do I have today?",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage({ text: suggestion });
  };

  if (!isChatOpen) {
    return null;
  }

  return (
    <div className="bg-background flex h-full w-full flex-1 flex-col gap-4 rounded-lg pt-0">
      <div className="relative flex h-full w-full flex-col overflow-hidden">
        <div className="flex w-full items-center justify-between border-b p-3">
          <div />
          <Button size="sm" onClick={handleNewChat}>
            New Chat
          </Button>
        </div>

        <Conversation className="flex-1 border-t">
          <ConversationContent>
            {messages.map((message: UIMessage, index: number) => {
              return (
                <Message
                  key={`${message.id}-${index}`}
                  className={cn("py-2", {
                    "gap-1 text-justify [&>div]:max-w-[100%]":
                      message.role === "assistant",
                  })}
                  from={message.role}
                >
                  <div className="flex-1 space-y-2">
                    {message.parts?.map((part, index) => {
                      if (part.type === "text") {
                        return (
                          <MessageContent
                            key={`${message.id}-text-${index}`}
                            className={cn({
                              "mb-4 bg-transparent! p-0 text-base":
                                message.role === "assistant",
                              "rounded-xl p-2! pl-2.5!":
                                message.role === "user",
                            })}
                          >
                            <Response>{String(part.text)}</Response>
                          </MessageContent>
                        );
                      }

                      if (part.type === "reasoning") {
                        return (
                          <Reasoning
                            key={`${message.id}-reasoning-${index}`}
                            isStreaming={part.state === "streaming"}
                          >
                            <ReasoningTrigger />
                            <ReasoningContent className="mt-2 pl-5 [&>div]:space-y-[0]">
                              {String(part.text)}
                            </ReasoningContent>
                          </Reasoning>
                        );
                      }

                      return match(part.type)
                        .with("tool-getEvents", () => {
                          const toolPart = part as ToolUIPart;
                          if (toolPart.state === "input-available") {
                            return (
                              <GetEventCall
                                key={`${message.id}-getEvents-${index}`}
                              />
                            );
                          } else if (toolPart.state === "output-available") {
                            return (
                              <GetEventResult
                                key={`${message.id}-getEventsResult-${index}`}
                                toolInvocation={toolPart}
                              />
                            );
                          }
                          return null;
                        })
                        .with("tool-createEvent", () => {
                          const toolPart = part as ToolUIPart;
                          if (toolPart.state === "input-available") {
                            return (
                              <CreateEventCall
                                key={`${message.id}-createEvent-${index}`}
                              />
                            );
                          } else if (toolPart.state === "output-available") {
                            return (
                              <CreateEventResult
                                key={`${message.id}-createEventResult-${index}`}
                                toolInvocation={toolPart}
                              />
                            );
                          }
                          return null;
                        })
                        .with("tool-createRecurringEvent", () => {
                          const toolPart = part as ToolUIPart;
                          if (toolPart.state === "input-available") {
                            return (
                              <CreateRecurringEventCall
                                key={`${message.id}-createRecurringEvent-${index}`}
                              />
                            );
                          } else if (toolPart.state === "output-available") {
                            return (
                              <CreateRecurringEventResult
                                key={`${message.id}-createRecurringEventResult-${index}`}
                                toolInvocation={toolPart}
                              />
                            );
                          }
                          return null;
                        })
                        .with("tool-updateEvent", () => {
                          const toolPart = part as ToolUIPart;
                          if (toolPart.state === "input-available") {
                            return (
                              <UpdateEventCall
                                key={`${message.id}-updateEvent-${index}`}
                                toolInvocation={toolPart}
                              />
                            );
                          } else if (toolPart.state === "output-available") {
                            return (
                              <UpdateEventResult
                                key={`${message.id}-updateEventResult-${index}`}
                                message={message}
                                toolInvocation={toolPart}
                              />
                            );
                          }
                          return null;
                        })
                        .with("tool-getNextUpcomingEvent", () => {
                          const toolPart = part as ToolUIPart;
                          if (toolPart.state === "input-available") {
                            return (
                              <GetUpcomingEventCall
                                key={`${message.id}-getNextUpcomingEvent-${index}`}
                              />
                            );
                          } else if (toolPart.state === "output-available") {
                            return (
                              <GetUpcomingEventResult
                                key={`${message.id}-getNextUpcomingEventResult-${index}`}
                                toolInvocation={toolPart}
                              />
                            );
                          }
                          return null;
                        })
                        .with("tool-getFreeSlots", () => {
                          const toolPart = part as ToolUIPart;
                          if (toolPart.state === "input-available") {
                            return (
                              <GetFreeSlotsCall
                                key={`${message.id}-getFreeSlots-${index}`}
                              />
                            );
                          } else if (toolPart.state === "output-available") {
                            return (
                              <GetFreeSlotsResult
                                key={`${message.id}-getFreeSlotsResult-${index}`}
                                toolInvocation={toolPart}
                              />
                            );
                          }
                          return null;
                        })
                        .with("tool-deleteEvent", () => {
                          const toolPart = part as ToolUIPart;
                          if (toolPart.state === "input-available") {
                            return (
                              <DeleteEventCall
                                key={`${message.id}-deleteEvent-${index}`}
                              />
                            );
                          } else if (toolPart.state === "output-available") {
                            return (
                              <DeleteEventResult
                                key={`${message.id}-deleteEventResult-${index}`}
                                toolInvocation={toolPart}
                              />
                            );
                          }
                          return null;
                        })
                        .otherwise(() => null);
                    })}
                  </div>
                </Message>
              );
            })}
          </ConversationContent>
          <ConversationScrollButton className="shadow-sm" />
        </Conversation>

        <div className="px-4 pt-4">
          <Suggestions className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <Suggestion
                key={s}
                onClick={handleSuggestionClick}
                suggestion={s}
              />
            ))}
          </Suggestions>
        </div>

        <div className="relative p-2">
          <ChatPromptInput
            value={input}
            onStop={stop}
            onSubmit={handleFormSubmit}
            onValueChange={setInput}
            status={status}
          />
        </div>
      </div>
    </div>
  );
}
