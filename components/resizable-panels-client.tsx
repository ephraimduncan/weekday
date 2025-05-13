"use client";

import { BigCalendar } from "@/components/big-calendar";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useChat } from "@/providers/chat-provider";

export function ResizablePanelsClient() {
  const { isMobile } = useSidebar();
  const { isChatOpen } = useChat();

  return (
    <ResizablePanelGroup
      className={cn("h-full", {
        "p-2": isMobile,
      })}
      direction="horizontal"
    >
      <ResizablePanel defaultSize={80} minSize={50}>
        <BigCalendar />
      </ResizablePanel>

      {isChatOpen && (
        <>
          <ResizableHandle className="bg-sidebar w-2 scheme-only-dark" />

          <ResizablePanel defaultSize={30} minSize={20}>
            <ChatSidebar />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
