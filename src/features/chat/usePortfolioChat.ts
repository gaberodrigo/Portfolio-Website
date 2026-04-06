"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ChatMessage = { role: "user" | "assistant"; text: string };

type ChatBackend = "bedrock" | "fastapi";

function getChatBackend(): ChatBackend {
  const v = process.env.NEXT_PUBLIC_CHAT_BACKEND?.toLowerCase().trim();
  return v === "fastapi" ? "fastapi" : "bedrock";
}

async function queryFastApi(queryUrl: string, query: string): Promise<string> {
  const response = await fetch(queryUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const data = await response.json();
  if (!response.ok) {
    const detail = typeof data?.detail === "string" ? data.detail : String(data);
    throw new Error(detail);
  }
  const assistantText = data.response || data.answer || data.message;
  if (!assistantText || typeof assistantText !== "string") {
    throw new Error("Unexpected API response format");
  }
  return assistantText;
}

function greetingForBackend(backend: ChatBackend): string {
  if (backend === "bedrock") {
    return "Hi — ask me about this portfolio or your project. I answer from the knowledge base here.";
  }
  return "Hi — ask me about this portfolio or your project. I answer using the RAG backend.";
}

export function usePortfolioChat() {
  const backend = useMemo(() => getChatBackend(), []);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const fastApiQueryUrl = useMemo(() => `${apiBaseUrl}/query`, [apiBaseUrl]);

  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { role: "assistant", text: greetingForBackend(backend) },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const messagesScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = messagesScrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  const submit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || isLoading) return;

      setError("");
      setIsLoading(true);

      setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
      setInput("");

      try {
        if (backend === "fastapi") {
          const assistantText = await queryFastApi(fastApiQueryUrl, trimmed);
          setMessages((prev) => [...prev, { role: "assistant", text: assistantText }]);
        } else {
          try {
            const response = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: trimmed, sessionId }),
            });

            let data: Record<string, unknown>;
            try {
              data = (await response.json()) as Record<string, unknown>;
            } catch {
              throw new Error("Invalid response from /api/chat");
            }

            if (!response.ok) {
              const detail =
                typeof data?.error === "string" ? data.error : "Chat request failed.";
              throw new Error(detail);
            }

            if (typeof data.sessionId === "string" && data.sessionId) {
              setSessionId(data.sessionId);
            }

            const assistantText = data.answer ?? data.response ?? data.message;
            if (!assistantText || typeof assistantText !== "string") {
              throw new Error("Unexpected API response format");
            }

            setMessages((prev) => [...prev, { role: "assistant", text: assistantText }]);
          } catch (bedrockErr) {
            console.error("Bedrock failed, falling back to FastAPI", bedrockErr);
            setSessionId(undefined);
            const assistantText = await queryFastApi(fastApiQueryUrl, trimmed);
            setMessages((prev) => [...prev, { role: "assistant", text: assistantText }]);
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to complete request.";
        setError(message);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "Something went wrong. Please try again." },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [backend, fastApiQueryUrl, input, isLoading, sessionId],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void submit();
      }
    },
    [submit],
  );

  return useMemo(
    () => ({
      messages,
      input,
      setInput,
      isLoading,
      error,
      submit,
      onKeyDown,
      messagesScrollRef,
    }),
    [
      messages,
      input,
      isLoading,
      error,
      submit,
      onKeyDown,
    ],
  );
}
