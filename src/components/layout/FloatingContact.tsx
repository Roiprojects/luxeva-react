import Link from "next/link";
import { Phone } from "lucide-react";
import type { ReactNode } from "react";
import { getContactDetails } from "@/lib/content";
import { telHref, whatsappHref } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/**
 * Floating Call + WhatsApp buttons on the left edge (desktop).
 * Uses tel:/wa.me when the client has supplied numbers, otherwise routes to /contact.
 * Mobile already has the sticky bottom action bar, so this is lg-only.
 */
export function FloatingContact() {
  const c = getContactDetails();
  const tel = telHref(c.phone);
  const wa = whatsappHref(c.whatsapp, "Hello Luxeva Care, I'd like to enquire about interior services.");

  return (
    <div className="hidden lg:flex fixed left-5 bottom-6 z-40 flex-col gap-3">
      <FloatBtn
        href={wa ?? "/contact"}
        external={!!wa}
        label="Chat on WhatsApp"
        className="bg-[#25D366] hover:bg-[#1ebe5b]"
        ringClassName="bg-[#25D366]"
      >
        <WhatsAppIcon size={24} />
      </FloatBtn>
      <FloatBtn href={tel ?? "/contact"} label="Call us" className="bg-brand hover:bg-brand-dark">
        <Phone size={20} />
      </FloatBtn>
    </div>
  );
}

function FloatBtn({
  href,
  external,
  label,
  className,
  ringClassName,
  children,
}: {
  href: string;
  external?: boolean;
  label: string;
  className?: string;
  ringClassName?: string;
  children: ReactNode;
}) {
  const inner = (
    <span className="group relative flex">
      {ringClassName && (
        <span aria-hidden className={cn("absolute inset-0 rounded-full opacity-40 motion-safe:animate-ping", ringClassName)} />
      )}
      <span
        className={cn(
          "relative flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lift transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          className,
        )}
      >
        {children}
      </span>
      {/* Tooltip */}
      <span className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-card transition-opacity duration-200 group-hover:opacity-100">
        {label}
      </span>
    </span>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
      {inner}
    </a>
  ) : (
    <Link href={href} aria-label={label}>
      {inner}
    </Link>
  );
}
