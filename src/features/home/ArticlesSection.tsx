"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/motion/FadeIn";
import { articles } from "@/lib/constants";
import styles from "./articlesImage.module.css";

type Article = (typeof articles)[number];

function articleDotsClass(article: Article): string {
  const i = articles.findIndex((a) => a.href === article.href);
  const idx = i >= 0 ? i : 0;
  const v = (idx % 3) + 1;
  return v === 1 ? styles.dots1 : v === 2 ? styles.dots2 : styles.dots3;
}

const TRANSITION = { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const };

/** Enter from the direction you're arriving, exit in the direction you're leaving. */
const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
};

function ArticleCard({ article }: { article: Article }) {
  return (
    <a
      href={article.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${article.title} — ${article.source} (opens in a new tab)`}
      className={`${styles.articleCard} group block rounded-2xl border border-[#EAEAEA] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md`}
    >
      <div
        className={`${styles.imageWrap} ${articleDotsClass(article)} aspect-[16/9] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50`}
      >
        <img
          src={article.previewImage}
          alt=""
          loading="lazy"
          className={styles.previewImg}
        />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
        {article.source}
      </p>
      <h3 className="mt-2 text-lg font-semibold leading-snug text-neutral-950">
        {article.title}
      </h3>
    </a>
  );
}

function NavArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const isPrev = direction === "prev";
  return (
    <button
      onClick={onClick}
      aria-label={isPrev ? "Previous articles" : "Next articles"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-colors hover:border-neutral-950 hover:bg-neutral-950 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        {isPrev ? (
          <path
            d="M10 3L5 8l5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M6 3l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

export default function ArticlesSection() {
  const [leftIdx, setLeftIdx] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const n = articles.length;

  const go = (d: 1 | -1) => {
    setDir(d);
    setLeftIdx((i) => (i + d + n) % n);
  };

  const leftArticle = articles[leftIdx];
  const rightArticle = articles[(leftIdx + 1) % n];

  return (
    <section id="articles" className="bg-[#F7F7F7] py-24">
      <Container>
        <FadeIn>
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
            <div>
              <h2 className="text-[2.8125rem] font-bold tracking-[-0.03em]">
                Articles
              </h2>
              <p className="mt-4 max-w-2xl text-neutral-600">
                Reading list — tech, culture, and ideas worth your time.
              </p>
            </div>
            <div className="flex shrink-0 gap-2 pb-1">
              <NavArrow direction="prev" onClick={() => go(-1)} />
              <NavArrow direction="next" onClick={() => go(1)} />
            </div>
          </div>
        </FadeIn>

        {/*
         * Carousel container.
         *
         * The invisible sizer div is always rendered and gives the container a
         * stable height that matches one card (mobile) or two cards (sm+).
         * The animated slides are absolutely inset on top of it so they never
         * cause layout shifts.
         */}
        <div className="relative mt-10 overflow-hidden">
          {/* Height sizer — invisible, never interactive */}
          <div
            className="invisible grid grid-cols-1 gap-6 sm:grid-cols-2"
            aria-hidden="true"
          >
            <ArticleCard article={articles[0]} />
            <div className="hidden sm:block">
              <ArticleCard article={articles[1]} />
            </div>
          </div>

          {/* Animated slide — keyed by leftIdx so each advance triggers enter/exit */}
          <AnimatePresence custom={dir} initial={false}>
            <motion.div
              key={leftIdx}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={TRANSITION}
              className="absolute inset-0 grid grid-cols-1 gap-6 sm:grid-cols-2"
            >
              <ArticleCard article={leftArticle} />
              <div className="hidden sm:block">
                <ArticleCard article={rightArticle} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
