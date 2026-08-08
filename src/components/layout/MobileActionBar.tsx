import { Link } from "react-router-dom";
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
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-soft-white/95 backdrop-blur border-t border-border shadow-lift">
      <div className="grid grid-cols-3 divide-x divide-border">
        {tel ? (
          <a href={tel} className="flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium text-ink">
            <Phone size={19} className="text-navy" />
            Call
          </a>
        ) : (
          <Link to="/contact" className="flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium text-ink">
            <Phone size={19} className="text-navy" />
            Call
          </Link>
        )}
        {wa ? (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium text-ink">
            <WhatsAppIcon size={18} className="text-[#25D366]" />
            WhatsApp
          </a>
        ) : (
          <Link to="/contact" className="flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium text-ink">
            <WhatsAppIcon size={18} className="text-[#25D366]" />
            WhatsApp
          </Link>
        )}
        <Link to="/contact" className="flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-semibold text-ink bg-gold/15">
          <CalendarCheck size={19} className="text-navy" />
          Enquire
        </Link>
      </div>
    </div>
  );
}
