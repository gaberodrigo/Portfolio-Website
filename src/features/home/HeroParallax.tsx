"use client";

import type { MotionValue } from "framer-motion";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { ReactNode } from "react";

import { useMediaQuery } from "@/lib/useMediaQuery";

type LayerConfig = {
  key: string;
  src: string;
  alt: string;
  zIndex: number;
  /**
   * Vertical movement in pixels at scroll progress 1.
   * Must map to 0 at progress 0 for pixel-perfect "rest" alignment.
   */
  yRangePx: number;
  /**
   * Controls how the SVG is fit inside the hero.
   * Usually keep consistent across all layers to avoid seams.
   */
  objectPosition?: string; // CSS object-position, e.g. "50% 100%"
};

const LAYERS: LayerConfig[] = [
  // Depth groups (tweak per your extracted artwork)
  { key: "LayerBackground", src: "/images/articles/LayerBackground.svg", alt: "Sky", zIndex: 0, yRangePx: 0 },
  { key: "LayerX", src: "/images/articles/Layerx.svg", alt: "Clouds", zIndex: 1, yRangePx: 900 },
  { key: "Layer9", src: "/images/articles/Layer9.svg", alt: "Far mountains", zIndex: 2, yRangePx: 800 },
  { key: "Layer8", src: "/images/articles/Layer8.svg", alt: "Mid mountains", zIndex: 3, yRangePx: 700 },
  { key: "Layer7", src: "/images/articles/Layer7.svg", alt: "Tree line", zIndex: 4, yRangePx: 600 },
  { key: "Layer6", src: "/images/articles/Layer6.svg", alt: "Foreground detail", zIndex: 5, yRangePx: 500 },
  { key: "Layer5", src: "/images/articles/Layer5.svg", alt: "Foreground detail", zIndex: 6, yRangePx: 400 },
  { key: "Layer4", src: "/images/articles/Layer4.svg", alt: "Foreground detail", zIndex: 7, yRangePx: 300 },
  { key: "Layer3", src: "/images/articles/Layer3.svg", alt: "Foreground detail", zIndex: 8, yRangePx: 200 },
  { key: "Layer2", src: "/images/articles/Layer2.svg", alt: "Foreground detail", zIndex: 9, yRangePx: 100 },
  { key: "Layer1", src: "/images/articles/layer1.svg", alt: "Foreground", zIndex: 10, yRangePx: 0 },
];

// ─── Desktop: full parallax (unchanged logic) ────────────────────────────────

function ParallaxLayer({
  layer,
  scrollYProgress,
}: {
  layer: LayerConfig;
  scrollYProgress: MotionValue<number>;
}) {
  const y = useTransform(scrollYProgress, [0, 1], [0, layer.yRangePx]);

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none will-change-transform"
      style={{
        zIndex: layer.zIndex,
        y,
      }}
    >
      <img
        src={layer.src}
        alt=""
        draggable={false}
        loading="eager"
        decoding="async"
        className="h-full w-full select-none object-cover"
        style={{
          // Anchor from bottom so ground/cliffs line up consistently across layers.
          objectPosition: layer.objectPosition ?? "50% 100%",
        }}
      />
    </motion.div>
  );
}

function ParallaxHeroDesktop({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children?: ReactNode;
}) {
  const heroRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    // progress = 0 when hero top aligns with viewport top
    offset: ["start start", "end start"],
  });

  return (
    <section
      id={id}
      ref={heroRef}
      className={[
        "relative h-screen w-full overflow-hidden overflow-x-hidden",
        // Base color to avoid edge gaps. Layers should be transparent-aware.
        "bg-[#F7F7F7]",
        className ?? "",
      ].join(" ")}
      aria-label="Landing hero parallax"
    >
      {LAYERS.map((layer) => (
        <ParallaxLayer key={layer.key} layer={layer} scrollYProgress={scrollYProgress} />
      ))}

      {/* Overlay content stays above parallax layers */}
      <div className="relative z-10 h-full">{children}</div>
    </section>
  );
}

// ─── Mobile / small viewports: same artwork as desktop, no scroll-driven motion ─
// Uses the same SVG stack as ParallaxHeroDesktop (not the separate JPG), so we do
// not depend on ParalaxBackground.jpg, which is easy to omit from deploys and breaks
// Next/Image on some devices when missing or mis-cached.

function StaticHero({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section
      id={id}
      className={[
        "relative h-screen w-full overflow-hidden overflow-x-hidden",
        "bg-[#F7F7F7]",
        className ?? "",
      ].join(" ")}
      aria-label="Landing hero"
    >
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        aria-hidden="true"
      >
        {LAYERS.map((layer) => (
          <div
            key={layer.key}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: layer.zIndex }}
          >
            <img
              src={layer.src}
              alt=""
              draggable={false}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="h-full w-full select-none object-cover"
              style={{
                objectPosition: layer.objectPosition ?? "50% 100%",
              }}
            />
          </div>
        ))}
      </motion.div>

      <div className="relative z-10 h-full">{children}</div>
    </section>
  );
}

// ─── Main export: static hero vs scroll-driven parallax (media queries, not width) ──

/** Touch-primary devices, or layouts below Tailwind `lg` — evaluated via matchMedia. */
const PARALLAX_DISABLED_QUERY = "(pointer: coarse), (max-width: 1023px)";

export default function HeroParallax({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children?: ReactNode;
}) {
  /**
   * null  → not yet hydrated (SSR safe)
   * true  → disable parallax (coarse pointer and/or narrow layout per CSS)
   * false → desktop: full parallax
   *
   * We use matchMedia instead of window.innerWidth so behavior matches real CSS
   * (Safari / iOS / DPR / viewport timing), and `(pointer: coarse)` catches iPhones
   * even when the layout viewport is wide (e.g. “Request Desktop Website”).
   */
  const parallaxDisabled = useMediaQuery(PARALLAX_DISABLED_QUERY);

  // Static fallback while unknown, on touch/narrow viewports, or when query matches
  if (parallaxDisabled !== false) {
    return (
      <StaticHero id={id} className={className}>
        {children}
      </StaticHero>
    );
  }

  return (
    <ParallaxHeroDesktop id={id} className={className}>
      {children}
    </ParallaxHeroDesktop>
  );
}
