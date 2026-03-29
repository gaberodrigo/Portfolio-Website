import Container from "@/components/ui/Container";
import FadeIn from "@/components/motion/FadeIn";
import { testimonials } from "@/lib/constants";

function Stars({ rating }: { rating: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span aria-hidden="true" className="text-neutral-300">
      {Array.from({ length: 5 }).map((_, i) => (i < filled ? "★" : "☆")).join("")}
    </span>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-[#F7F7F7] py-24">
      <Container>
        <FadeIn>
          <h2 className="text-[2.8125rem] font-bold tracking-[-0.03em]">Testimonials</h2>
        </FadeIn>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <FadeIn key={t.quote} delay={0.05 + idx * 0.02}>
              <article className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{t.rating.toFixed(1)}</p>
                  <p aria-label={`${t.rating.toFixed(1)} out of 5 stars`}>
                    <span className="sr-only">{t.rating.toFixed(1)} star rating</span>
                    <Stars rating={t.rating} />
                  </p>
                </div>
                <p className="mt-4 text-sm leading-6 text-neutral-600">{t.quote}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}

