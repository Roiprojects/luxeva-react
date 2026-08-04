import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Logo } from "./Logo";
import { siteConfig, nav } from "@/lib/site";
import { getContactDetails, getServices } from "@/lib/content";
import { telHref, whatsappHref, mailHref } from "@/lib/utils";

export function Footer() {
  const contact = getContactDetails();
  const services = getServices();
  const year = new Date().getFullYear();
  const tel = telHref(contact.phone);
  const wa = whatsappHref(contact.whatsapp);
  const mail = mailHref(contact.email);

  return (
    <footer className="bg-charcoal text-soft-white/80 mt-24">
      <div className="container-lux py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo tone="light" />
          <p className="mt-5 text-sm leading-relaxed text-soft-white/70 max-w-xs">
            {siteConfig.legalName} — complete residential and commercial interior design and
            execution, delivered with care.
          </p>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <h3 className="text-soft-white font-medium mb-4 text-[0.95rem]">Explore</h3>
          <ul className="space-y-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-gold transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Services" className="text-sm">
          <h3 className="text-soft-white font-medium mb-4 text-[0.95rem]">Services</h3>
          <ul className="space-y-2.5">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-gold transition-colors">
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/services" className="text-gold-soft hover:text-gold transition-colors">
                All services →
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <h3 className="text-soft-white font-medium mb-4 text-[0.95rem]">Get in touch</h3>
          {/* Each contact line renders only when the verified value exists. */}
          <ul className="space-y-3">
            {tel && (
              <li>
                <a href={tel} className="flex items-center gap-2.5 hover:text-gold transition-colors">
                  <Phone size={16} className="text-gold shrink-0" /> {contact.phone}
                </a>
              </li>
            )}
            {wa && (
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-gold transition-colors">
                  <WhatsAppIcon size={16} className="text-[#25D366] shrink-0" /> WhatsApp
                </a>
              </li>
            )}
            {mail && (
              <li>
                <a href={mail} className="flex items-center gap-2.5 hover:text-gold transition-colors">
                  <Mail size={16} className="text-gold shrink-0" /> {contact.email}
                </a>
              </li>
            )}
            {contact.address && (
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-gold shrink-0 mt-0.5" /> <span>{contact.address}</span>
              </li>
            )}
            {contact.workingHours && (
              <li className="flex items-center gap-2.5">
                <Clock size={16} className="text-gold shrink-0" /> {contact.workingHours}
              </li>
            )}
            {!tel && !mail && !contact.address && (
              <li>
                <Link href="/contact" className="text-gold-soft hover:text-gold transition-colors">
                  Send an enquiry →
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-soft-white/10">
        <div className="container-lux py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-soft-white/55">
          <p>© {year} {siteConfig.legalName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
