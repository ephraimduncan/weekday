"use client";

import type { ChatStatus } from "ai";

import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/components/ai/prompt-input";

interface ChatPromptInputProps {
  status: ChatStatus;
  value: string;
  onSubmit: () => void;
  onValueChange: (value: string) => void;
  onStop?: () => void;
}

export function ChatPromptInput({
  status,
  value,
  onStop,
  onSubmit,
  onValueChange,
}: ChatPromptInputProps) {
  const isLoading = status === "submitted" || status === "streaming";

  return (
    <PromptInput
      className="w-full rounded-xl border shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (isLoading) {
          onStop?.();
          return;
        }
        onSubmit();
      }}
    >
      <PromptInputTextarea
        className="text-base placeholder:text-base"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder="Ask anything..."
      />
      <PromptInputToolbar>
        <div />
        <PromptInputSubmit
          disabled={!value.trim() && !isLoading}
          status={status}
        />
      </PromptInputToolbar>
    </PromptInput>
  );
}
