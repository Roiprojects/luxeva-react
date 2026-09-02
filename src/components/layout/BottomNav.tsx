"use client";

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Home, LayoutGrid, ImageIcon, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { getContactDetails } from "@/lib/content";
import { telHref, whatsappAppHref, openWhatsApp, openPhone } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const TABS = [
  { label: "Home",      href: "/",          icon: Home },
  { label: "Services",  href: "/services",  icon: LayoutGrid },
  { label: "Portfolio", href: "/portfolio", icon: ImageIcon },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  const contact = getContactDetails();
  const tel = telHref(contact.phone);
  const waMessage = "Hello Luxeva Care, I'd like to enquire about interior services.";
  const wa = whatsappAppHref(contact.whatsapp ?? contact.phone ?? "", waMessage);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="App navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-paper/98 backdrop-blur-md border-t border-line shadow-[0_-4px_24px_rgba(20,35,60,0.10)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch" style={{ height: 58 }}>
        {TABS.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors duration-150 select-none",
                active ? "text-brand" : "text-muted",
              )}
            >
              <Icon
                size={22}
                className="transition-transform duration-150"
                strokeWidth={active ? 2.2 : 1.7}
                style={active ? { transform: "scale(1.08)" } : undefined}
              />
              <span className={cn("text-[10px] font-medium leading-none", active ? "font-semibold" : "")}>
                {label}
              </span>
            </Link>
          );
        })}

        {/* Call button — redirects directly to phone dialer (+91 9900026502) */}
        <a
          href={tel}
          onClick={(e) => {
            e.preventDefault();
            openPhone(contact.phone);
          }}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-brand select-none cursor-pointer"
          aria-label="Call +91 9900026502"
        >
          <Phone size={22} strokeWidth={1.9} />
          <span className="text-[10px] font-medium leading-none">Call</span>
        </a>

        {/* WhatsApp button — redirects directly to native WhatsApp app */}
        <a
          href={wa}
          onClick={(e) => {
            e.preventDefault();
            openWhatsApp(contact.whatsapp ?? contact.phone, waMessage);
          }}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[#25D366] select-none cursor-pointer"
          aria-label="Chat on WhatsApp with 9900026502"
        >
          <WhatsAppIcon size={22} />
          <span className="text-[10px] font-medium leading-none">WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}
