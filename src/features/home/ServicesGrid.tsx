import Link from "next/link";
import Container from "@/components/ui/Container";
import ArrowIcon from "@/components/ui/ArrowIcon";
import FadeIn from "@/components/motion/FadeIn";
import { services, type Service } from "@/lib/constants";

function ServiceTile({ s }: { s: Service }) {
  const inner = (
    <div className="group flex h-full flex-col justify-between bg-white p-6 transition-colors duration-200 hover:bg-neutral-950 hover:text-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold">{s.title}</h3>
          <p className="mt-2 text-sm leading-5 text-neutral-500 transition-colors group-hover:text-neutral-400">
            {s.description}
          </p>
        </div>
        <span className="mt-0.5 shrink-0 text-neutral-400 transition-colors group-hover:text-white">
          <ArrowIcon size={16} />
        </span>
      </div>
    </div>
  );

  if (s.href) {
    return (
      <Link
        href={s.href}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black"
        aria-label={`Learn more about ${s.title}`}
      >
        {inner}
      </Link>
    );
  }

  return <div>{inner}</div>;
}

export default function ServicesGrid() {
  return (
    <section id="services" className="bg-[#F7F7F7] py-24">
      <Container>
        <FadeIn>
          <h2 className="text-[2.8125rem] font-bold tracking-[-0.03em]">Services</h2>
        </FadeIn>
        <FadeIn delay={0.05} className="mt-4">
          <p className="max-w-2xl text-neutral-600">
            Design that feels premium. Engineering that stays solid.
          </p>
        </FadeIn>

        <FadeIn delay={0.08} className="mt-10">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#EAEAEA] bg-[#EAEAEA] md:grid-cols-3">
            {services.map((s) => (
              <ServiceTile key={s.title} s={s} />
            ))}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
