import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/motion/FadeIn";
import ChatSection from "@/features/chat/ChatSection";

export default function Cta() {
  return (
    <section id="cta" className="bg-black py-20 text-white sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="min-w-0">
            <FadeIn>
              <h2 className="text-4xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                Ready to build something clean?
              </h2>
            </FadeIn>
            <FadeIn delay={0.05} className="mt-5">
              <p className="text-neutral-300">
                Send a question and I’ll respond with practical next steps for your
                project.
              </p>
            </FadeIn>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <FadeIn delay={0.1}>
                <Button variant="solidLight" href="#services" ariaLabel="Explore services">
                  Explore services
                </Button>
              </FadeIn>
              <FadeIn delay={0.15}>
                <Button variant="outlineLight" href="#chat" ariaLabel="Jump to chat">
                  Chat
                </Button>
              </FadeIn>
            </div>
          </div>

          <div className="min-w-0">
            <FadeIn delay={0.2}>
              <ChatSection />
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}
