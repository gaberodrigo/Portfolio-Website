"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import FloatingChat from "@/components/chat/FloatingChat";
import { usePortfolioChat } from "./usePortfolioChat";

type ChatContextValue = ReturnType<typeof usePortfolioChat> & {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const chat = usePortfolioChat();
  const [isOpen, setIsOpen] = useState(false);
  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({
      ...chat,
      isOpen,
      openChat,
      closeChat,
    }),
    [chat, isOpen, openChat, closeChat],
  );

  return (
    <ChatContext.Provider value={value}>
      {children}
      <FloatingChat />
    </ChatContext.Provider>
  );
}

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return ctx;
}
