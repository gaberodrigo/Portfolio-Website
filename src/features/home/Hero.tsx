import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/motion/FadeIn";

export default function Hero() {
  return (
    <section id="hero" className="bg-black text-white">
      <Container>
        <div className="pb-24 pt-28">
          <FadeIn>
            <p className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Portfolio
            </p>
          </FadeIn>

          <FadeIn delay={0.05} className="mt-5">
            <h1 className="text-5xl font-bold leading-[0.95] tracking-[-0.04em] sm:text-7xl">
              High-end work.
              <br />
              Clean execution.
            </h1>
          </FadeIn>

          <FadeIn delay={0.1} className="mt-6 max-w-2xl text-lg text-neutral-300 sm:text-xl">
            I build fast, readable, and scalable products with a focus on UI/UX polish
            and reliable backend systems.
          </FadeIn>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <FadeIn delay={0.15}>
              <Button variant="solidLight" href="#services" ariaLabel="Explore services">
                Explore services
              </Button>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Button variant="outlineLight" href="#chat" ariaLabel="Jump to chat">
                Chat
              </Button>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}

