import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { FinalCta } from "@/components/sections/FinalCta";
import { getServices } from "@/lib/content";
import type { ServiceCategory } from "@/lib/types";



const CATEGORY_ORDER: ServiceCategory[] = [
  "Residential Interiors",
  "Custom Furniture",
  "Technical Services",
  "Kitchen & Surface Works",
  "Safety & Smart Home",
  "Commercial Interiors",
];

export default function ServicesPage() {
  const services = getServices();

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Complete interior solutions for homes & commercial spaces"
        intro="From design consultation to furniture, electrical, plumbing, automation and final finishing — Luxeva Care manages every detail."
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      <section className="py-16 md:py-20">
        <Container>
          {/* Category quick-nav */}
          <nav aria-label="Service categories" className="mb-12 flex flex-wrap justify-center gap-2">
            {CATEGORY_ORDER.map((c) => (
              <a
                key={c}
                href={`#${slugifyCategory(c)}`}
                className="rounded-full border border-border bg-soft-white px-4 py-2 text-sm text-ink-soft hover:border-navy hover:text-ink transition-colors"
              >
                {c}
              </a>
            ))}
          </nav>

          {CATEGORY_ORDER.map((category) => {
            const items = services.filter((s) => s.category === category);
            if (items.length === 0) return null;
            return (
              <div key={category} id={slugifyCategory(category)} className="scroll-mt-24 mb-16">
                <h2 className="text-2xl md:text-3xl mb-6">{category}</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {items.map((s, i) => (
                    <Reveal key={s.slug} delay={i * 40}>
                      <ServiceCard service={s} />
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </Container>
      </section>

      <FinalCta title="Not sure which service you need?" body="Tell us about your space — we’ll guide you and prepare a tailored plan." />
    </>
  );
}

function slugifyCategory(c: string) {
  return c.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
}
