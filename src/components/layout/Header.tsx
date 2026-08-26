"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Home,
  Sofa,
  Wrench,
  ChefHat,
  ShieldCheck,
  Store,
} from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { nav } from "@/lib/site";
import { cn } from "@/lib/utils";
import { getContactDetails } from "@/lib/content";

type ServiceLink = { slug: string; title: string; category: string };

const CATEGORY_META: { name: string; icon: typeof Home }[] = [
  { name: "Residential Interiors", icon: Home },
  { name: "Custom Furniture", icon: Sofa },
  { name: "Technical Services", icon: Wrench },
  { name: "Kitchen & Surface Works", icon: ChefHat },
  { name: "Safety & Smart Home", icon: ShieldCheck },
  { name: "Commercial Interiors", icon: Store },
];

const MOBILE_FEATURED_LINKS = [
  { label: "Book Free Consultation", href: "/contact" },
  { label: "View Services", href: "/services" },
] as const;

export function Header({ services }: { services: ServiceLink[] }) {
  const pathname = usePathname();
  const contact = getContactDetails();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeTimer = useRef<number | null>(null);
  const openServices = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setServicesOpen(true);
  };
  const scheduleCloseServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 160);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 nav-shell">
      <div
        className={cn(
          "hidden sm:block overflow-hidden bg-brand text-white transition-all duration-500",
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100",
        )}
      >
        <div className="container-lux flex items-center justify-center gap-2 py-2 text-center text-xs sm:text-sm font-medium">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/80" />
          Book a <strong className="font-semibold">free design consultation</strong> - no cost, no obligation.
          <Link href="/contact" className="ml-1 hidden sm:inline underline underline-offset-2 hover:text-white/80">Enquire now -&gt;</Link>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden flex items-center justify-between gap-3 border-b border-line px-4 transition-all duration-300",
          scrolled
            ? "h-14 bg-paper/95 shadow-[0_2px_12px_rgba(20,35,60,0.08)] backdrop-blur-xl"
            : "h-14 bg-paper/90 backdrop-blur-md",
        )}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-paper/90 text-ink shadow-soft"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="min-w-0 flex-1">
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            aria-label="Get a quote"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand px-4 text-sm font-semibold text-white shadow-brand"
          >
            Quote
          </Link>
          {contact.phone ? (
            <a
              href={`tel:${contact.phone}`}
              aria-label="Call us"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/8 text-brand"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.8 19.8 0 0 1 1.61 4.87 2 2 0 0 1 3.59 2.68h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.2a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17.7z"></path></svg>
            </a>
          ) : null}
        </div>
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            aria-hidden
            onClick={() => setMobileOpen(false)}
            className="mobile-backdrop-enter fixed inset-0 z-50 bg-ink/45 backdrop-blur-[2px] lg:hidden"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="mobile-drawer-enter fixed inset-0 z-50 lg:hidden"
          >
            <div className="ml-auto flex h-full w-[min(24rem,88vw)] flex-col bg-paper shadow-[0_0_40px_rgba(20,35,60,0.24)]">
              <div
                className="flex items-center justify-between border-b border-line px-5 pb-4 pt-5"
                style={{ paddingTop: "calc(1.25rem + env(safe-area-inset-top))" }}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Navigation</p>
                  <p className="mt-1 text-lg font-semibold text-ink">Luxeva Care</p>
                </div>
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-mist text-ink"
                >
                  <X size={20} />
                </button>
              </div>

              <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-2">
                  {nav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "flex min-h-14 items-center justify-between rounded-2xl border px-4 py-3 text-base font-medium transition-colors",
                        isActive(item.href)
                          ? "border-brand/20 bg-brand-soft text-brand"
                          : "border-line bg-white text-ink",
                      )}
                    >
                      <span>{item.label}</span>
                      <ArrowRight size={18} className={isActive(item.href) ? "text-brand" : "text-muted"} />
                    </Link>
                  ))}
                </div>

                <div className="mt-6 rounded-3xl bg-mist p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Quick actions</p>
                  <div className="mt-3 grid gap-2">
                    {MOBILE_FEATURED_LINKS.map((item) => (
                      <Link
                        key={item.href + item.label}
                        href={item.href}
                        className="flex min-h-12 items-center justify-between rounded-2xl bg-paper px-4 py-3 text-sm font-semibold text-ink shadow-soft"
                      >
                        <span>{item.label}</span>
                        <ArrowRight size={16} />
                      </Link>
                    ))}
                    {contact.phone ? (
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex min-h-12 items-center justify-between rounded-2xl bg-paper px-4 py-3 text-sm font-semibold text-ink shadow-soft"
                      >
                        <span>{contact.phone}</span>
                        <ArrowRight size={16} />
                      </a>
                    ) : null}
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}

      <div className={cn("hidden lg:block container-lux transition-all duration-500", scrolled ? "pt-2 md:pt-3" : "pt-3 md:pt-4")}>
        <div
          className={cn(
            "nav-pill relative flex items-center justify-between gap-4 rounded-full border pl-5 pr-3 md:pl-6 md:pr-4",
            scrolled
              ? "h-14 md:h-16 bg-paper/90 backdrop-blur-xl border-line shadow-card"
              : "h-16 md:h-18 bg-paper/70 backdrop-blur-md border-white/60 shadow-soft",
          )}
        >
          <Logo />

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-0.5">
            {nav.map((item) =>
              item.label === "Services" ? (
                <div
                  key={item.href}
                  onMouseEnter={openServices}
                  onMouseLeave={scheduleCloseServices}
                >
                  <Link
                    href={item.href}
                    aria-expanded={servicesOpen}
                    data-active={isActive(item.href)}
                    className={cn(
                      "nav-link-underline inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      isActive(item.href) ? "text-ink" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    {item.label}
                    <ChevronDown size={15} className={cn("transition-transform duration-300", servicesOpen && "rotate-180")} />
                  </Link>
                  <div
                    onMouseEnter={openServices}
                    onMouseLeave={scheduleCloseServices}
                    className={cn(
                      "absolute right-0 top-full mt-2 w-[52rem] max-w-[calc(100vw-2rem)] origin-top-right transition-all duration-300",
                      servicesOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0 pointer-events-none",
                    )}
                  >
                    <div className="overflow-hidden rounded-2xl border border-border bg-soft-white/95 shadow-lift backdrop-blur-xl">
                      <div className="grid grid-cols-[1fr_1fr_1fr_15rem]">
                        <div className="col-span-3 grid grid-cols-3 gap-x-5 gap-y-5 p-6">
                          {CATEGORY_META.map(({ name, icon: Icon }) => {
                            const items = services.filter((s) => s.category === name);
                            if (items.length === 0) return null;
                            return (
                              <div key={name}>
                                <div className="mb-2.5 flex items-center gap-2">
                                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gold/15 text-navy">
                                    <Icon size={14} />
                                  </span>
                                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-taupe-dark">
                                    {name}
                                  </span>
                                </div>
                                <ul className="space-y-0.5">
                                  {items.map((s) => (
                                    <li key={s.slug}>
                                      <Link
                                        href={`/services/${s.slug}`}
                                        className="block rounded-md px-2 py-1.5 text-[0.82rem] text-ink-soft transition-colors hover:bg-ivory hover:text-ink"
                                      >
                                        {s.title}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          })}
                        </div>

                        <div className="relative flex flex-col justify-end p-6 text-soft-white">
                          <Image
                            src="/assets/stock/drive-living/living-2.jpg"
                            alt=""
                            aria-hidden
                            fill
                            sizes="15rem"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/25" />
                          <div className="relative">
                            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold-soft">
                              Complete interiors
                            </p>
                            <p className="mt-1.5 font-[family-name:var(--font-display)] text-xl leading-tight">
                              Design to handover, one team
                            </p>
                            <Link
                              href="/services"
                              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-gold-soft"
                            >
                              View all services
                              <ArrowRight size={15} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={isActive(item.href)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "nav-link-underline rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive(item.href) ? "text-ink" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden lg:block">
            <Button href="/contact" size="sm">
              Get Free Quote
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
