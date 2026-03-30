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
  const className = [
    "inline-block select-none text-left font-bold tracking-[-0.02em]",
    isXL
      ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
      : "text-2xl",
    isOnDark ? "text-white" : "text-neutral-950",
  ].join(" ");

  const mark = (
    <>
      gabriel r
      <span className={isOnDark ? "text-neutral-400" : "text-neutral-500"}>.</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className} aria-label="Home">
        {mark}
      </button>
    );
  }

  return <span className={className}>{mark}</span>;
}
