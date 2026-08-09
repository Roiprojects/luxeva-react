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
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 w-full border-t border-line bg-paper/75 px-2.5 pt-2 backdrop-blur-2xl shadow-[0_-12px_35px_rgba(20,35,60,0.12)]" style={{ paddingBottom: "max(0.55rem, env(safe-area-inset-bottom))" }}>
      <div className="mx-auto grid w-full max-w-md grid-cols-3 gap-1.5 rounded-2xl bg-navy p-1.5 shadow-lift">
        {tel ? (
          <a href={tel} className="flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 rounded-xl text-[0.68rem] font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white">
            <Phone size={18} className="text-gold-2" />
            Call
          </a>
        ) : (
          <Link to="/contact" className="flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 rounded-xl text-[0.68rem] font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white">
            <Phone size={18} className="text-gold-2" />
            Call
          </Link>
        )}
        {wa ? (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 rounded-xl text-[0.68rem] font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white">
            <WhatsAppIcon size={18} className="text-[#65e995]" />
            WhatsApp
          </a>
        ) : (
          <Link to="/contact" className="flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 rounded-xl text-[0.68rem] font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white">
            <WhatsAppIcon size={18} className="text-[#65e995]" />
            WhatsApp
          </Link>
        )}
        <Link to="/contact" className="flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 rounded-xl bg-brand px-1 text-[0.68rem] font-bold text-white shadow-brand transition-transform active:scale-[0.97]">
          <CalendarCheck size={18} className="text-white" />
          Enquire
        </Link>
      </div>
    </div>
  );
}
