export default function SectionHeading({
  kicker,
  title,
  description,
}: {
  kicker?: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      {kicker ? (
        <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          {kicker}
        </p>
      ) : null}
      <h2 className="mt-3 text-[2.8125rem] font-bold tracking-[-0.03em]">{title}</h2>
      {description ? (
        <p className="mt-4 max-w-2xl text-neutral-600">{description}</p>
      ) : null}
    </div>
  );
}

