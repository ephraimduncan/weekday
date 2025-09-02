"use client";

import { Arrow } from "@radix-ui/react-tooltip";
import { ArrowUp, Square } from "lucide-react";

import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input";
import { Button } from "@/components/ui/button";

interface ChatPromptInputProps {
  isLoading: boolean;
  value: string;
  onSubmit: () => void;
  onValueChange: (value: string) => void;
}

export function ChatPromptInput({
  isLoading,
  value,
  onSubmit,
  onValueChange,
}: ChatPromptInputProps) {
  return (
    <PromptInput
      className="border-input bg-background w-full max-w-(--breakpoint-md) rounded-[calc(1rem-4px)] border px-3 py-1 pl-1.5 shadow-[0_9px_9px_0px_rgba(0,0,0,0.01),0_2px_5px_0px_rgba(0,0,0,0.06)]"
      value={value}
      onSubmit={onSubmit}
      onValueChange={onValueChange}
      isLoading={isLoading}
    >
      <PromptInputTextarea
        className="dark:bg-background text-base placeholder:text-base"
        placeholder="Ask anything..."
      />
      <PromptInputActions className="bg-background mt-0 mb-2 flex h-auto items-center justify-between gap-2 sm:mt-5">
        <div className="flex items-center gap-x-1.5"></div>
        <PromptInputAction
          className="duration-0 data-[state=closed]:duration-0"
          delayDuration={0}
          tooltip={
            <div className="bg-black">
              <Arrow className="fill-black duration-0" />
              <span className="text-xs leading-none font-semibold text-white">
                {isLoading ? "Stop generation" : "Send message"}
              </span>
            </div>
          }
        >
          <Button
            size="icon"
            variant="default"
            className="h-9 w-9 rounded-full p-1 [&_svg]:size-6"
            // disabled={isLoading || !value.trim()}
            onClick={onSubmit}
          >
            {isLoading ? <Square /> : <ArrowUp />}
          </Button>
        </PromptInputAction>
      </PromptInputActions>
    </PromptInput>
  );
}
