"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; text: string };

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

export default function ChatSection() {
  const backend = useMemo(() => getChatBackend(), []);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const fastApiQueryUrl = useMemo(() => `${apiBaseUrl}/query`, [apiBaseUrl]);

  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      role: "assistant",
      text:
        backend === "bedrock"
          ? "Hello! Ask me anything about this portfolio or your project. I’ll answer using the Bedrock Knowledge Base (with FastAPI fallback if needed)."
          : "Hello! Ask me anything about this portfolio or your project. I’ll answer using your backend’s RAG API.",
    },
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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
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
  }

  const endpointHint =
    backend === "bedrock" ? (
      <>
        Primary: <span className="font-mono">POST /api/chat</span> (Bedrock Knowledge Base).
        If that fails, falls back to <span className="font-mono">POST /query</span> via{" "}
        <span className="font-mono">NEXT_PUBLIC_API_URL</span>.
      </>
    ) : (
      <>
        Responses come from <span className="font-mono">POST /query</span> (FastAPI RAG).
      </>
    );

  return (
    <div
      id="chat"
      className="w-full min-w-0 max-w-full scroll-mt-24 rounded-2xl border border-neutral-700 bg-neutral-950/35 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_0_28px_rgba(255,255,255,0.08)] sm:p-6"
    >
      <div className="flex items-start justify-between gap-4 sm:gap-6">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-200">Chatbot (RAG)</p>
          <p className="mt-3 text-sm text-neutral-400">
            Ask questions. {endpointHint}
          </p>
        </div>
      </div>

      <div
        ref={messagesScrollRef}
        className="mt-5 max-h-[280px] space-y-4 overflow-y-auto overflow-x-hidden pr-2"
      >
        {messages.map((m, idx) => (
          <div
            key={`${m.role}-${idx}`}
            className={[
              "w-fit max-w-[85%] break-words rounded-xl border px-4 py-3",
              m.role === "user"
                ? "ml-auto border-neutral-700 bg-neutral-900"
                : "border-neutral-800 bg-black/10",
            ].join(" ")}
          >
            <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-200">
              {m.text}
            </p>
          </div>
        ))}
      </div>

      {error ? (
        <p className="mt-4 text-sm font-medium text-neutral-200">{error}</p>
      ) : null}

      <form className="mt-4" onSubmit={submit}>
        <label className="sr-only" htmlFor="chatInput">
          Ask a question
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <input
            id="chatInput"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your work..."
            className="min-w-0 flex-1 rounded-xl border border-neutral-800 bg-black/20 px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none focus:border-neutral-500"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="shrink-0 rounded-xl border border-neutral-800 bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-neutral-100 disabled:opacity-60 sm:w-auto"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
