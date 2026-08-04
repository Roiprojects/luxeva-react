import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site";



export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms & Conditions" crumbs={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]} />
      <section className="py-16">
        <Container className="max-w-3xl">
          <div className="rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-ink-soft/80 mb-8">
            <strong>Draft template.</strong> These terms are a starting point pending review and
            approval by {siteConfig.legalName} and its legal advisor before public launch.
          </div>

          <div className="space-y-6 text-ink-soft/90 leading-relaxed [&_h2]:text-2xl [&_h2]:text-ink [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:font-[family-name:var(--font-display)]">
            <p>
              These terms govern your use of the {siteConfig.legalName} website. By using this
              website, you agree to these terms.
            </p>

            <h2>Use of the website</h2>
            <p>
              This website is provided for general information about our interior design and
              execution services. Content may be updated at any time without notice.
            </p>

            <h2>Enquiries &amp; quotations</h2>
            <p>
              Information on this website does not constitute a binding offer. Any project scope,
              materials, timelines and pricing are confirmed separately in a written proposal.
            </p>

            <h2>Intellectual property</h2>
            <p>
              All content, imagery and designs on this website are the property of{" "}
              {siteConfig.legalName} unless otherwise stated, and may not be reproduced without
              permission.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              We aim to keep information accurate and up to date but make no warranties as to its
              completeness. We are not liable for any loss arising from reliance on website content.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms can be sent via our{" "}
              <a href="/contact" className="text-navy underline underline-offset-2">contact page</a>.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
