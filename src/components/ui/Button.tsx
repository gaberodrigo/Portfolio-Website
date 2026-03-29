import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "solidDark" | "solidLight" | "outline" | "outlineLight";
  href?: string;
  ariaLabel?: string;
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "solidDark",
  href,
  ariaLabel,
}: ButtonProps) {
  const className =
    variant === "outline"
      ? "inline-flex items-center justify-center rounded-full border border-neutral-200 bg-transparent px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:border-neutral-400"
      : variant === "outlineLight"
        ? "inline-flex items-center justify-center rounded-full border border-white bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 hover:border-white"
      : variant === "solidLight"
        ? "inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-100"
        : "inline-flex items-center justify-center rounded-full border border-neutral-200 bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-900";

  if (href) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} aria-label={ariaLabel} className={className}>
      {children}
    </button>
  );
}

