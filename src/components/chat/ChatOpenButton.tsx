"use client";

import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import { useChatContext } from "@/features/chat/ChatProvider";

type Props = {
  variant?: "outline" | "outlineLight";
  ariaLabel?: string;
  children?: ReactNode;
};

export default function ChatOpenButton({
  variant = "outline",
  ariaLabel = "Open chat",
  children = "Chat",
}: Props) {
  const { openChat } = useChatContext();
  return (
    <Button variant={variant} onClick={openChat} ariaLabel={ariaLabel}>
      {children}
    </Button>
  );
}
