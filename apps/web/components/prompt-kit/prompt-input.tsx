"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type PromptInputContextType = {
  isLoading: boolean;
  maxHeight: number | string;
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
  onSubmit?: () => void;
};

const PromptInputContext = createContext<PromptInputContextType>({
  disabled: false,
  isLoading: false,
  maxHeight: 240,
  value: "",
  setValue: () => {},
  onSubmit: undefined,
});

function usePromptInput() {
  const context = useContext(PromptInputContext);
  if (!context) {
    throw new Error("usePromptInput must be used within a PromptInput");
  }
  return context;
}

export type PromptInputTextareaProps = {
  disableAutosize?: boolean;
} & React.ComponentProps<typeof Textarea>;

function PromptInput({
  children,
  className,
  isLoading = false,
  maxHeight = 240,
  value,
  onSubmit,
  onValueChange,
}: PromptInputProps) {
  const [internalValue, setInternalValue] = useState(value || "");

  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <TooltipProvider>
      <PromptInputContext.Provider
        value={{
          isLoading,
          maxHeight,
          setValue: onValueChange ?? handleChange,
          value: value ?? internalValue,
          onSubmit,
        }}
      >
        <div
          className={cn(
            "border-input bg-background rounded-3xl border p-2 shadow-xs",
            className,
          )}
        >
          {children}
        </div>
      </PromptInputContext.Provider>
    </TooltipProvider>
  );
}

type PromptInputActionProps = {
  children: React.ReactNode;
  tooltip: React.ReactNode;
  className?: string;
  side?: "bottom" | "left" | "right" | "top";
} & React.ComponentProps<typeof Tooltip>;

function PromptInputTextarea({
  className,
  disableAutosize = false,
  onKeyDown,
  ...props
}: PromptInputTextareaProps) {
  const { disabled, maxHeight, setValue, value, onSubmit } = usePromptInput();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (disableAutosize) return;

    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      typeof maxHeight === "number"
        ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
        : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`;
  }, [value, maxHeight, disableAutosize]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
    onKeyDown?.(e);
  };

  return (
    <Textarea
      ref={textareaRef}
      className={cn(
        "text-primary min-h-[44px] w-full resize-none border-none bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
        className,
      )}
      disabled={disabled}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      rows={1}
      {...props}
    />
  );
}

type PromptInputActionsProps = React.HTMLAttributes<HTMLDivElement>;

function PromptInputActions({
  children,
  className,
  ...props
}: PromptInputActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

type PromptInputProps = {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  maxHeight?: number | string;
  value?: string;
  onSubmit?: () => void;
  onValueChange?: (value: string) => void;
};

function PromptInputAction({
  children,
  className,
  side = "top",
  tooltip,
  ...props
}: PromptInputActionProps) {
  const { disabled } = usePromptInput();

  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild disabled={disabled}>
        {children}
      </TooltipTrigger>
      <TooltipContent className={className} side={side}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

export {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
};
