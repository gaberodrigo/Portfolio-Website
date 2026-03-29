"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import MenuOverlay from "@/components/layout/MenuOverlay";

const links = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Articles", href: "#articles" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Chat", href: "#chat" },
];

/** Matches `h-20`; hero is "past" the bar when it no longer sits under the sticky header. */
const NAV_HEIGHT_PX = 80;

export default function Navbar() {
  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // On the homepage, clicking the logo scrolls to hero.
  // On any other page, it navigates back to the homepage.
  const logoHref = pathname === "/" ? "#hero" : "/";

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const update = () => {
      const { bottom } = hero.getBoundingClientRect();
      setPastHero(bottom <= NAV_HEIGHT_PX);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header
        className={[
          "sticky top-0 z-50 w-full transition-colors duration-300 ease-in-out",
          pastHero
            ? "bg-neutral-50 text-neutral-950 shadow-sm"
            : "bg-black text-white",
        ].join(" ")}
      >
        <Container>
          <div className="flex h-20 items-center justify-between">
            {/* Logo — scrolls to hero on homepage, navigates home from other pages */}
            <Link
              href={logoHref}
              aria-label="gabriel r — go to homepage"
              className="transition-opacity hover:opacity-70 focus:outline-none focus-visible:opacity-70"
            >
              <Logo variant={pastHero ? "onLight" : "onDark"} size="xl" />
            </Link>

            {/* Hamburger menu button — visible on all breakpoints */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="nav-overlay"
              className={[
                "flex flex-col items-end justify-center gap-[5px] p-2 transition-opacity hover:opacity-60 focus:outline-none focus-visible:opacity-60",
                pastHero ? "text-neutral-950" : "text-white",
              ].join(" ")}
            >
              <span className="block h-px w-6 bg-current" />
              <span className="block h-px w-6 bg-current" />
              <span className="block h-px w-4 bg-current" />
            </button>
          </div>
        </Container>
      </header>

      <MenuOverlay
        isOpen={menuOpen}
        onClose={closeMenu}
        links={links}
      />
    </>
  );
}
