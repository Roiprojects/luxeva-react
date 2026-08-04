import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Section";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { getContactDetails } from "@/lib/content";
import { telHref, whatsappHref, mailHref } from "@/lib/utils";



export default function ContactPage() {
  const contact = getContactDetails();
  const tel = telHref(contact.phone);
  const wa = whatsappHref(contact.whatsapp, "Hello Luxeva Care, I'd like to enquire about interior services.");
  const mail = mailHref(contact.email);

  // Build contact cards only from verified, non-null values.
  const cards = [
    tel && { icon: Phone, label: "Call us", value: contact.phone!, href: tel, external: false },
    wa && { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: wa, external: true },
    mail && { icon: Mail, label: "Email", value: contact.email!, href: mail, external: false },
    contact.address && { icon: MapPin, label: "Visit us", value: contact.address, href: undefined, external: false },
    contact.workingHours && { icon: Clock, label: "Working hours", value: contact.workingHours, href: undefined, external: false },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href?: string; external: boolean }[];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s plan your interior project"
        intro="Get expert help for your home or commercial interior. Send an enquiry and our team will get back to you."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="py-16 md:py-20">
        <Container className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
          {/* Left: contact info + reassurance */}
          <div>
            <h2 className="text-2xl md:text-3xl">Get in touch</h2>
            <p className="mt-3 text-ink-soft/85">
              Share a few details about your space and requirements. There’s no obligation —
              we’ll help you understand your options.
            </p>

            {cards.length > 0 ? (
              <div className="mt-8 space-y-3">
                {cards.map((c) => {
                  const inner = (
                    <div className="flex items-center gap-4 rounded-xl border border-border bg-soft-white p-4 shadow-soft">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-navy shrink-0">
                        <c.icon size={20} />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-taupe-dark">{c.label}</p>
                        <p className="font-medium text-ink">{c.value}</p>
                      </div>
                    </div>
                  );
                  return c.href ? (
                    <a key={c.label} href={c.href} target={c.external ? "_blank" : undefined} rel={c.external ? "noopener noreferrer" : undefined} className="block hover:opacity-90 transition-opacity">
                      {inner}
                    </a>
                  ) : (
                    <div key={c.label}>{inner}</div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8 rounded-xl border border-border bg-cream/50 p-5 text-sm text-ink-soft/80">
                Our direct contact details will be published here shortly. Please use the
                enquiry form and we’ll respond as soon as possible.
              </div>
            )}
          </div>

          {/* Right: form */}
          <div>
            <EnquiryForm />
          </div>
        </Container>
      </section>

      {/* Map — only when a verified embed URL exists (MISSING_CLIENT_INPUTS A6). */}
      {contact.mapsEmbedUrl && (
        <section className="pb-16">
          <Container>
            <div className="overflow-hidden rounded-2xl border border-border shadow-soft aspect-[16/7]">
              <iframe
                title="Luxeva Care location"
                src={contact.mapsEmbedUrl}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
