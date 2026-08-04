import Image from "next/image";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function FinalCta({
  title = "Ready to design your dream home?",
  body = "Book a consultation with Luxeva Care and let’s create a space that reflects your lifestyle.",
  image = "/assets/stock/img-27.jpg",
}: {
  title?: string;
  body?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image src={image} alt="" aria-hidden fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-ink/80" />
      </div>
      <Container className="relative py-20 md:py-28 text-center">
        <Reveal className="mx-auto max-w-2xl">
          <h2 className="text-3xl md:text-5xl text-soft-white leading-tight">{title}</h2>
          <p className="mt-4 text-lg text-soft-white/80">{body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/contact" size="lg">Book Consultation</Button>
            <Button href="/contact" variant="on-dark" size="lg">Contact Us</Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
