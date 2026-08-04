import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site";



export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <section className="py-16">
        <Container className="max-w-3xl">
          <div className="rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-ink-soft/80 mb-8">
            <strong>Draft template.</strong> This policy is a starting point pending review and
            approval by {siteConfig.legalName} and its legal advisor before public launch.
          </div>

          <div className="space-y-6 text-ink-soft/90 leading-relaxed [&_h2]:text-2xl [&_h2]:text-ink [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:font-[family-name:var(--font-display)]">
            <p>
              {siteConfig.legalName} (“we”, “us”) is committed to protecting your privacy. This
              policy explains what information we collect through this website and how we use it.
            </p>

            <h2>Information we collect</h2>
            <p>
              When you submit an enquiry, we collect the details you provide — such as your name,
              phone number, email, location, property type and message. We may also record the
              page you enquired from and basic campaign parameters (UTM values) to understand how
              you found us.
            </p>

            <h2>How we use your information</h2>
            <p>
              We use your information solely to respond to your enquiry, provide requested
              information about our interior services, and manage our relationship with you. We do
              not sell your personal information.
            </p>

            <h2>Storage &amp; security</h2>
            <p>
              Enquiries are stored securely and are accessible only to authorised members of our
              team. We take reasonable technical and organisational measures to protect your data.
            </p>

            <h2>Your rights</h2>
            <p>
              You may request access to, correction of, or deletion of the personal information you
              have shared with us by contacting us through this website.
            </p>

            <h2>Contact</h2>
            <p>
              For any privacy-related questions, please reach us via our{" "}
              <a href="/contact" className="text-navy underline underline-offset-2">contact page</a>.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
