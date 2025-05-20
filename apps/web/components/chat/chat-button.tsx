"use client";

import * as React from "react";

import { RiChat3Line } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChat } from "@/providers/chat-provider";

export function ChatButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { isChatOpen, toggleChat } = useChat();

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        "text-muted-foreground/80 hover:text-foreground/80 size-8",
        isChatOpen && "text-foreground/80 bg-muted/50",
        className,
      )}
      onClick={toggleChat}
      aria-label="Toggle chat"
      aria-pressed={isChatOpen}
      {...props}
    >
      <RiChat3Line size={20} aria-hidden="true" />
    </Button>
  );
}
