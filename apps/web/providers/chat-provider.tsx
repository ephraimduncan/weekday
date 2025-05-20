"use client";

import * as React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getCookie, setCookie } from "cookies-next";

type ChatContextProps = {
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
  toggleChat: () => void;
};

const ChatContext = createContext<ChatContextProps | null>(null);

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  return context;
}

type ChatProviderProps = {
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function ChatProvider({
  children,
  defaultOpen = true,
}: ChatProviderProps) {
  const [isChatOpen, setIsChatOpenState] = useState(defaultOpen);

  useEffect(() => {
    const storedState = getCookie("chat:state");
    if (storedState !== undefined) {
      setIsChatOpenState(storedState === "true");
    }
  }, []);

  const setIsChatOpen = (isOpen: boolean) => {
    setIsChatOpenState(isOpen);
    setCookie("chat:state", isOpen.toString());
  };

  const toggleChat = useCallback(() => {
    setIsChatOpen(!isChatOpen);
  }, [isChatOpen]);

  const contextValue = useMemo(
    () => ({
      isChatOpen,
      setIsChatOpen,
      toggleChat,
    }),
    [isChatOpen, toggleChat],
  );

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}
