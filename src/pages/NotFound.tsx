import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex items-center bg-gradient-to-b from-cream to-ivory">
      <Container className="text-center py-24">
        <p className="font-[family-name:var(--font-display)] text-7xl md:text-8xl text-gold">404</p>
        <h1 className="mt-4 text-3xl md:text-4xl">This page couldn’t be found</h1>
        <p className="mt-3 text-ink-soft/80 max-w-md mx-auto">
          The page you’re looking for may have moved. Let’s get you back to something beautiful.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/services" variant="outline">Browse services</Button>
        </div>
        <p className="mt-8 text-sm text-taupe-dark">
          Or <Link href="/contact" className="text-navy underline underline-offset-2">contact us</Link> directly.
        </p>
      </Container>
    </section>
  );
}
