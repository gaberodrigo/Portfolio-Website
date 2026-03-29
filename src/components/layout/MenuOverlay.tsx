"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/ui/Container";

type NavLink = { label: string; href: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
};

export default function MenuOverlay({ isOpen, onClose, links }: Props) {
  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col bg-black"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Top bar — mirrors navbar height, aligned to site container */}
          <Container>
            <div className="flex h-20 items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Menu
              </span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-2 text-white transition-opacity hover:opacity-50 focus:outline-none focus-visible:opacity-50"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </Container>

          {/* Nav links — aligned to site container */}
          <nav
            className="flex flex-1 flex-col justify-center"
            aria-label="Overlay navigation"
          >
            <Container>
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.06 + i * 0.07,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={onClose}
                  className="block py-3 text-4xl font-bold leading-none text-white transition-opacity hover:opacity-30 focus:outline-none focus-visible:opacity-30 sm:text-5xl lg:text-6xl"
                >
                  {link.label}
                </motion.a>
              ))}
            </Container>
          </nav>

          {/* Footer strip — aligned to site container */}
          <Container>
            <div className="pb-8 text-xs text-neutral-600">
              © {new Date().getFullYear()} gabriel r.
            </div>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
