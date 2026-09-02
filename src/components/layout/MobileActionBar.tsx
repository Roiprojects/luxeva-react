import Link from "next/link";
import { Phone, CalendarCheck } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { getContactDetails } from "@/lib/content";
import { telHref, whatsappHref } from "@/lib/utils";

/**
 * Sticky mobile action bar (Call · WhatsApp · Enquire).
 * Call/WhatsApp render only when the verified number exists; Enquire always links to /contact.
 */
export function MobileActionBar() {
  const contact = getContactDetails();
  const tel = telHref(contact.phone);
  const wa = whatsappHref(contact.whatsapp, "Hello Luxeva Care, I'd like to enquire about interior services.");

  return (
    <div
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-soft-white/95 backdrop-blur border-t border-border shadow-lift"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-3 divide-x divide-border">
        <a
          href={tel || "tel:+919900026502"}
          className="flex min-h-[3.5rem] flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium text-ink"
          aria-label="Call +91 9900026502"
        >
          <Phone size={19} className="text-navy" />
          Call
        </a>
        <a
          href={wa || "https://api.whatsapp.com/send?phone=919900026502&text=Hello%20Luxeva%20Care%2C%20I%27d%20like%20to%20enquire%20about%20interior%20services."}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[3.5rem] flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium text-ink"
          aria-label="Chat on WhatsApp with 9900026502"
        >
          <WhatsAppIcon size={18} className="text-[#25D366]" />
          WhatsApp
        </a>
        <Link href="/contact" className="flex min-h-[3.5rem] flex-col items-center justify-center gap-1 bg-gold/15 py-2.5 text-xs font-semibold text-ink">
          <CalendarCheck size={19} className="text-navy" />
          Enquire
        </Link>
      </div>
    </div>
  );
}
