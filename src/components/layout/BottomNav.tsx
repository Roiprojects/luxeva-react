"use client";

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Home, LayoutGrid, ImageIcon, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { getContactDetails } from "@/lib/content";
import { whatsappHref } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const TABS = [
  { label: "Home",      href: "/",          icon: Home },
  { label: "Services",  href: "/services",  icon: LayoutGrid },
  { label: "Portfolio", href: "/portfolio", icon: ImageIcon },
  { label: "Contact",   href: "/contact",   icon: Phone },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  const contact = getContactDetails();
  const wa = whatsappHref(contact.whatsapp ?? contact.phone ?? "", "Hello Luxeva Care, I'd like to enquire about interior services.");

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

        {/* WhatsApp tab — green brand color, official icon */}
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[#25D366] select-none"
          >
            <WhatsAppIcon size={22} />
            <span className="text-[10px] font-medium leading-none">WhatsApp</span>
          </a>
        ) : (
          <Link
            to="/contact"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[#25D366] select-none"
          >
            <WhatsAppIcon size={22} />
            <span className="text-[10px] font-medium leading-none">WhatsApp</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
