"use client";

import type { ReactNode } from "react";
import { ChatProvider } from "@/features/chat/ChatProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <ChatProvider>{children}</ChatProvider>;
}
