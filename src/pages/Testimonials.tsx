import Image from "next/image";
import { Star, MessageSquareQuote } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Section";
import { FinalCta } from "@/components/sections/FinalCta";
import { getTestimonials } from "@/lib/content";



export default function TestimonialsPage() {
  const testimonials = getTestimonials();

  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="What our clients say"
        intro="Trusted by homeowners and business owners for premium interior solutions."
        crumbs={[{ label: "Home", href: "/" }, { label: "Testimonials" }]}
      />
      <section className="py-16 md:py-24">
        <Container>
          {testimonials.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={t.clientName} className="rounded-xl border border-border bg-soft-white p-6 shadow-soft">
                  <div className="flex items-center gap-0.5 text-gold mb-3" aria-label={`${t.rating} out of 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className={i < t.rating ? "fill-gold" : "opacity-25"} />
                    ))}
                  </div>
                  <blockquote className="text-ink-soft/90 leading-relaxed">“{t.text}”</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    {t.photo && (
                      <span className="relative h-11 w-11 overflow-hidden rounded-full">
                        <Image src={t.photo.src} alt={t.photo.alt} fill sizes="44px" className="object-cover" />
                      </span>
                    )}
                    <span>
                      <span className="block font-medium text-ink">{t.clientName}</span>
                      {(t.location || t.serviceType) && (
                        <span className="block text-sm text-taupe-dark">
                          {[t.location, t.serviceType].filter(Boolean).join(" · ")}
                        </span>
                      )}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl text-center py-12">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy/10 text-navy">
                <MessageSquareQuote size={26} />
              </span>
              <h2 className="mt-5 text-2xl">Client stories coming soon</h2>
              <p className="mt-3 text-ink-soft/80">
                We’re gathering verified reviews from our clients. In the meantime, explore our
                work or start a conversation about your project.
              </p>
            </div>
          )}
        </Container>
      </section>
      <FinalCta title="Become our next happy client" />
    </>
  );
}
