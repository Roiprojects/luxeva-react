import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Section";
import { FinalCta } from "@/components/sections/FinalCta";
import { getFaqs } from "@/lib/content";



export default function FaqPage() {
  const faqs = getFaqs();

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <PageHero
        eyebrow="Good to know"
        title="Frequently asked questions"
        intro="Everything you might want to know before starting your interior project."
        crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />
      <section className="py-16 md:py-20">
        <Container className="max-w-3xl">
          <div className="divide-y divide-border rounded-xl border border-border bg-soft-white">
            {faqs.map((f) => (
              <details key={f.question} className="group px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-medium text-ink [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <span className="text-navy transition-transform group-open:rotate-45 text-2xl leading-none shrink-0">+</span>
                </summary>
                <p className="pb-6 -mt-1 text-ink-soft/85 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
      <FinalCta title="Still have questions?" body="Reach out and our team will be glad to help you plan your space." />
    </>
  );
}
