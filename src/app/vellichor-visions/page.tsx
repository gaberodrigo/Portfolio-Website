import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/motion/FadeIn";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Vellichor Visions — Photography & Videography",
  description:
    "Professional photography for portraits, headshots, and real estate. Where light meets story.",
};

const vvServices = [
  {
    title: "Portrait",
    description:
      "Authentic portraiture that captures personality, emotion, and presence. Studio or on-location — tailored entirely to you.",
  },
  {
    title: "Headshot",
    description:
      "Sharp, polished headshots built for LinkedIn, corporate profiles, and personal branding. First impressions, handled.",
  },
  {
    title: "Real Estate",
    description:
      "Architectural and interior photography that makes properties stand out in any listing. Clean angles, honest light.",
  },
];

export default function VellichorVisionsPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section id="hero" className="bg-black py-32 text-white sm:py-40">
          <Container>
            <FadeIn>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Visual Storytelling
              </p>
              <h1 className="mt-4 text-5xl font-bold leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
                Vellichor
                <br />
                Visions
              </h1>
            </FadeIn>
            <FadeIn delay={0.1} className="mt-6">
              <p className="max-w-lg text-lg text-neutral-400 sm:text-xl">
                Professional photography that turns moments into lasting impressions.
                Clean craft, honest light, cinematic results.
              </p>
            </FadeIn>
            <FadeIn delay={0.15} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href="mailto:hello@vellichorvisions.com" variant="solidLight">
                Book a Session
              </Button>
              <Button href="#vv-services" variant="outlineLight">
                Explore Services
              </Button>
            </FadeIn>
          </Container>
        </section>

        {/* ── About ────────────────────────────────────────────────────────── */}
        <section id="vv-about" className="bg-[#F7F7F7] py-24">
          <Container>
            <div className="grid gap-12 md:grid-cols-2 md:gap-20">
              <FadeIn>
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  About
                </p>
                <h2 className="mt-4 text-[2.8125rem] font-bold tracking-[-0.03em]">
                  Craft over clutter.
                </h2>
              </FadeIn>
              <FadeIn delay={0.08} className="flex flex-col justify-center">
                <p className="leading-7 text-neutral-600">
                  Vellichor Visions is a professional photography studio built on one
                  principle: every frame should tell the truth beautifully. Whether
                  it&apos;s a polished corporate headshot, an intimate portrait session,
                  or showcase-ready real estate photography — the work is guided by
                  disciplined composition, natural light, and an uncompromising
                  commitment to quality.
                </p>
                <p className="mt-4 leading-7 text-neutral-600">
                  The result is always clean, purposeful, and made to last — images
                  that build your brand and do the work for you.
                </p>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* ── Services ─────────────────────────────────────────────────────── */}
        <section id="vv-services" className="bg-white py-24">
          <Container>
            <FadeIn>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Services
              </p>
              <h2 className="mt-4 text-[2.8125rem] font-bold tracking-[-0.03em]">
                What we offer.
              </h2>
            </FadeIn>

            <FadeIn delay={0.08} className="mt-12">
              <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[#EAEAEA] bg-[#EAEAEA] sm:grid-cols-3">
                {vvServices.map((s) => (
                  <div
                    key={s.title}
                    className="group bg-white p-8 transition-colors duration-200 hover:bg-neutral-950 hover:text-white"
                  >
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-neutral-500 transition-colors group-hover:text-neutral-400">
                      {s.description}
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </Container>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="bg-black py-28 text-white">
          <Container>
            <FadeIn>
              <h2 className="text-5xl font-bold tracking-[-0.03em] sm:text-6xl lg:text-7xl">
                Ready to
                <br />
                capture
                <br />
                your story?
              </h2>
            </FadeIn>
            <FadeIn delay={0.08} className="mt-6">
              <p className="max-w-md text-lg text-neutral-400">
                Book a session, ask a question, or just say hello. Inquiries are always
                welcome.
              </p>
            </FadeIn>
            <FadeIn delay={0.14} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="mailto:hello@vellichorvisions.com" variant="solidLight">
                Get in Touch
              </Button>
              <Button href="https://vellichorvisions.com" variant="outlineLight">
                Visit Full Site
              </Button>
            </FadeIn>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
