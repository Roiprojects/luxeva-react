import Image from "next/image";
import Link from "next/link";
import { useParams } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { PageHero, breadcrumbLd } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { getService, getServices } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { usePageTitle } from "@/lib/seo";
import NotFoundPage from "./NotFound";

export default function ServiceDetailPage() {
  const { slug = "" } = useParams();
  const service = getService(slug);
  usePageTitle(service ? `${service.title} · Luxeva Care` : "Service not found");
  if (!service) return <NotFoundPage />;

  const all = getServices();
  const related = all
    .filter((s) => s.slug !== service.slug && s.category === service.category)
    .slice(0, 3);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: service.title },
  ];

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.shortDescription,
    provider: { "@type": "Organization", name: siteConfig.legalName, url: siteConfig.url },
    areaServed: "IN",
    serviceType: service.category,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(crumbs, siteConfig.url)) }} />

      <PageHero eyebrow={service.category} title={service.title} intro={service.shortDescription} crumbs={crumbs} />

      {/* Overview */}
      <section className="py-16 md:py-20">
        <Container className="grid lg:grid-cols-[1.4fr_1fr] gap-12 items-start">
          <div>
            {service.heroImage && (
              <Reveal className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-card mb-8">
                <Image src={service.heroImage.src} alt={service.heroImage.alt} fill priority sizes="(max-width:1024px) 100vw, 60vw" className="object-cover" />
                {service.heroImage.isRender && (
                  <span className="absolute top-4 left-4 rounded-full bg-ink/70 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-soft-white">Design visualisation</span>
                )}
              </Reveal>
            )}
            <h2 className="text-2xl md:text-3xl">Overview</h2>
            <p className="mt-4 text-lg text-ink-soft/85 leading-relaxed">{service.longDescription}</p>

            {service.benefits.length > 0 && (
              <>
                <h3 className="mt-10 text-xl">What’s included</h3>
                <ul className="mt-4 grid sm:grid-cols-2 gap-3">
                  {service.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-ink-soft/90">
                      <Check size={18} className="mt-0.5 text-navy shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {service.process && service.process.length > 0 && (
              <>
                <h3 className="mt-10 text-xl">Our process</h3>
                <ol className="mt-4 space-y-4">
                  {service.process.map((p, i) => (
                    <li key={p.title} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy text-sm font-semibold">{i + 1}</span>
                      <div>
                        <p className="font-medium text-ink">{p.title}</p>
                        <p className="text-sm text-ink-soft/80">{p.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </>
            )}

            {service.gallery && service.gallery.length > 0 && (
              <>
                <h3 className="mt-10 text-xl">Gallery</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {service.gallery.map((g) => (
                    <div key={g.src} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-soft">
                      <Image src={g.src} alt={g.alt} fill sizes="(max-width:768px) 50vw, 30vw" className="object-cover" />
                      {g.isRender && <span className="absolute top-2 left-2 rounded-full bg-ink/70 px-2 py-0.5 text-[0.6rem] uppercase tracking-wide text-soft-white">Render</span>}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sticky enquiry rail */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border bg-cream/50 p-6 shadow-soft mb-6">
              <p className="eyebrow mb-2">Pricing</p>
              <p className="text-2xl font-[family-name:var(--font-display)] text-ink">
                {service.priceText ?? "Get a tailored quote"}
              </p>
              <p className="mt-2 text-sm text-ink-soft/75">
                Every project is customised — share your requirements for an accurate estimate.
              </p>
              <Button href="#enquiry" className="mt-5 w-full">Enquire about this service</Button>
            </div>
          </aside>
        </Container>
      </section>

      {/* Enquiry */}
      <section id="enquiry" className="scroll-mt-24 py-16 md:py-20 bg-cream/50">
        <Container className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl text-center">Request {service.title}</h2>
          <p className="mt-3 text-center text-ink-soft/85">Tell us about your space and we’ll be in touch.</p>
          <div className="mt-8">
            <EnquiryForm defaultService={service.title} />
          </div>
        </Container>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16">
          <Container>
            <div className="flex items-end justify-between gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl">Related services</h2>
              <Link href="/services" className="text-sm font-medium text-navy inline-flex items-center gap-1">
                All services <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/services/${r.slug}`} className="rounded-xl border border-border bg-soft-white p-5 shadow-soft hover:shadow-card transition-shadow">
                  <p className="eyebrow text-[0.6rem] mb-1">{r.category}</p>
                  <p className="text-lg font-[family-name:var(--font-display)]">{r.title}</p>
                  <p className="mt-1 text-sm text-ink-soft/75 line-clamp-2">{r.shortDescription}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
