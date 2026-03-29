import Container from "@/components/ui/Container";
import FadeIn from "@/components/motion/FadeIn";

const points = [
  ["Fast delivery", "Pragmatic iteration and tight feedback loops."],
  ["Clean UI", "High-contrast hierarchy and thoughtful spacing."],
  ["Reliable backend", "Well-structured APIs with real safeguards."],
  ["Scalable systems", "Build once—improve over time."],
] as const;

export default function AboutValue() {
  return (
    <section id="about" className="bg-[#F7F7F7] py-24">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <FadeIn>
            <h2 className="text-[2.8125rem] font-bold tracking-[-0.03em]">Value</h2>
          </FadeIn>
          <div className="space-y-4">
            <FadeIn delay={0.05}>
              <p className="max-w-xl text-neutral-600">
                I design for clarity first. Then I engineer for speed, accessibility,
                and maintainability so the experience stays consistent as you grow.
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="rounded-2xl border border-[#EAEAEA] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="grid gap-6 sm:grid-cols-2">
                  {points.map(([k, v]) => (
                    <div key={k}>
                      <p className="text-sm font-semibold">{k}</p>
                      <p className="mt-2 text-sm text-neutral-600">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}

