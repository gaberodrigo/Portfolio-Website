import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/motion/FadeIn";
import ChatOpenButton from "@/components/chat/ChatOpenButton";

export default function Cta() {
  return (
    <section id="cta" className="bg-black py-20 text-white sm:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <h2 className="text-4xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              Ready to build something clean?
            </h2>
          </FadeIn>
          <FadeIn delay={0.05} className="mt-5">
            <p className="text-neutral-300">
              Send a question and I’ll respond with practical next steps for your
              project — open the chat anytime from the corner or below.
            </p>
          </FadeIn>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <FadeIn delay={0.1}>
              <Button variant="solidLight" href="#services" ariaLabel="Explore services">
                Explore services
              </Button>
            </FadeIn>
            <FadeIn delay={0.15}>
              <ChatOpenButton variant="outlineLight" ariaLabel="Open chat" />
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}
