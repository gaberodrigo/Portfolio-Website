type LogoVariant = "onDark" | "onLight";
type LogoSize = "md" | "xl";

export default function Logo({
  onClick,
  variant = "onLight",
  size = "md",
}: {
  onClick?: () => void;
  variant?: LogoVariant;
  size?: LogoSize;
}) {
  const isOnDark = variant === "onDark";
  const isXL = size === "xl";
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "select-none text-left font-bold tracking-[-0.02em]",
        isXL ? "text-6xl" : "text-2xl",
        isOnDark ? "text-white" : "text-neutral-950",
      ].join(" ")}
      aria-label="Home"
    >
      gabriel r
      <span className={isOnDark ? "text-neutral-400" : "text-neutral-500"}>.</span>
    </button>
  );
}

