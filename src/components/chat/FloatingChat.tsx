"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useChatContext } from "@/features/chat/ChatProvider";

const LAUNCHER_RESHOW_MS = 400;

export default function FloatingChat() {
  const {
    isOpen,
    openChat,
    closeChat,
    messages,
    input,
    setInput,
    isLoading,
    error,
    submit,
    onKeyDown,
    messagesScrollRef,
  } = useChatContext();

  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [showLauncher, setShowLauncher] = useState(true);
  const launcherTimerRef = useRef<number | null>(null);
  const hadOpenedRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      hadOpenedRef.current = true;
      if (launcherTimerRef.current !== null) {
        window.clearTimeout(launcherTimerRef.current);
        launcherTimerRef.current = null;
      }
      setShowLauncher(false);
      return;
    }

    if (hadOpenedRef.current) {
      if (launcherTimerRef.current !== null) {
        window.clearTimeout(launcherTimerRef.current);
      }
      launcherTimerRef.current = window.setTimeout(() => {
        setShowLauncher(true);
        launcherTimerRef.current = null;
      }, LAUNCHER_RESHOW_MS);
    } else {
      setShowLauncher(true);
    }

    return () => {
      if (launcherTimerRef.current !== null) {
        window.clearTimeout(launcherTimerRef.current);
        launcherTimerRef.current = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  const panelTransition = reduceMotion
    ? { duration: 0.15, ease: "easeOut" as const }
    : { type: "spring" as const, stiffness: 420, damping: 32, mass: 0.7 };

  function handleLauncherClick() {
    setShowLauncher(false);
    requestAnimationFrame(() => {
      openChat();
    });
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col items-end sm:bottom-6 sm:right-6">
      <div className="pointer-events-auto flex flex-col items-end gap-3">
        {showLauncher && !isOpen ? (
          <motion.button
            key="launcher"
            type="button"
            aria-label="Open chat"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={handleLauncherClick}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-700 bg-neutral-950 text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-colors hover:bg-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </motion.button>
        ) : null}

        <AnimatePresence>
          {isOpen ? (
            <motion.div
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="floating-chat-title"
              initial={
                reduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, scale: 0.92, y: 10 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.92, y: 10 }
              }
              transition={panelTransition}
              style={{ transformOrigin: "bottom right" }}
              className="flex h-[min(560px,calc(100vh-5.5rem))] w-[min(360px,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-950/[0.76] text-neutral-100 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-sm"
            >
              <div className="flex items-start justify-between gap-3 border-b border-neutral-800 px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <h2
                    id="floating-chat-title"
                    className="text-sm font-semibold text-neutral-100"
                  >
                    Chat
                  </h2>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Portfolio &amp; project questions
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeChat}
                  aria-label="Close chat"
                  className="shrink-0 rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div
                ref={messagesScrollRef}
                className="min-h-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden px-4 py-3 sm:px-5"
              >
                {messages.map((m, idx) => (
                  <div
                    key={`${m.role}-${idx}`}
                    className={[
                      "w-fit max-w-[90%] break-words rounded-xl border px-3.5 py-2.5",
                      m.role === "user"
                        ? "ml-auto border-neutral-700 bg-neutral-900"
                        : "border-neutral-800 bg-black/20",
                    ].join(" ")}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-200">
                      {m.text}
                    </p>
                  </div>
                ))}
                {isLoading ? (
                  <div className="flex items-center gap-1.5 pl-1 text-xs text-neutral-500">
                    <span
                      className="inline-flex gap-1"
                      aria-live="polite"
                      aria-busy="true"
                    >
                      <span className="animate-pulse">Thinking</span>
                      <span className="inline-flex animate-pulse">…</span>
                    </span>
                  </div>
                ) : null}
              </div>

              {error ? (
                <p className="border-t border-neutral-800 px-4 py-2 text-xs text-neutral-400 sm:px-5">
                  {error}
                </p>
              ) : null}

              <form className="border-t border-neutral-800 p-3 sm:p-4" onSubmit={submit}>
                <label className="sr-only" htmlFor="floating-chat-input">
                  Message
                </label>
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    id="floating-chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Ask a question…"
                    disabled={isLoading}
                    className="min-w-0 flex-1 rounded-xl border border-neutral-800 bg-black/30 px-3 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none focus:border-neutral-500 disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="shrink-0 rounded-xl border border-neutral-700 bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-100 disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </form>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
