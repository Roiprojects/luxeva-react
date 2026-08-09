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

// Category display order + icon for the services mega-menu.
const CATEGORY_META: { name: string; icon: typeof Home }[] = [
  { name: "Residential Interiors", icon: Home },
  { name: "Custom Furniture", icon: Sofa },
  { name: "Technical Services", icon: Wrench },
  { name: "Kitchen & Surface Works", icon: ChefHat },
  { name: "Safety & Smart Home", icon: ShieldCheck },
  { name: "Commercial Interiors", icon: Store },
];

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
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Short close-delay so moving the pointer from the trigger into the wide panel
  // (crossing a small gap) doesn't dismiss the mega-menu.
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
      {/* Announcement strip — desktop only */}
      <div
        className={cn(
          "hidden sm:block overflow-hidden bg-brand text-white transition-all duration-500",
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100",
        )}
      >
        <div className="container-lux flex items-center justify-center gap-2 py-2 text-center text-xs sm:text-sm font-medium">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/80" />
          Book a <strong className="font-semibold">free design consultation</strong> — no cost, no obligation.
          <Link href="/contact" className="ml-1 hidden sm:inline underline underline-offset-2 hover:text-white/80">Enquire now →</Link>
        </div>
      </div>

      {/* ── Mobile app bar ─────────────────────────────────────────────── */}
      <div
        className={cn(
          "lg:hidden flex w-full min-w-0 items-center justify-between px-3 sm:px-4 border-b border-line transition-all duration-300",
          scrolled
            ? "h-14 bg-paper/95 backdrop-blur-xl shadow-[0_2px_12px_rgba(20,35,60,0.08)]"
            : "h-14 bg-paper/90 backdrop-blur-md",
        )}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <Logo className="min-w-0 max-w-[10rem] shrink overflow-hidden" />
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {contact.phone ? (
            <a
              href={`tel:${contact.phone}`}
              aria-label="Call us"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-brand/8 text-brand"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.8 19.8 0 0 1 1.61 4.87 2 2 0 0 1 3.59 2.68h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.2a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17.7z"></path></svg>
            </a>
          ) : (
            <Link href="/contact" aria-label="Contact us" className="flex items-center justify-center w-10 h-10 rounded-full bg-brand/8 text-brand">
              <PhoneIcon />
            </Link>
          )}
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-navy text-white shadow-soft"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="mobile-backdrop-enter fixed inset-0 top-14 z-0 bg-ink/35 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="mobile-drawer-enter absolute right-0 top-full z-10 w-[min(92vw,26rem)] border-l border-b border-line bg-paper shadow-lift"
          >
            <nav aria-label="Mobile primary" className="max-h-[calc(100dvh-4rem)] overflow-y-auto p-4">
              <div className="mb-4 rounded-2xl bg-navy px-4 py-4 text-white">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-gold-2">Luxeva Care</p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-2xl leading-tight">Spaces made personal.</p>
                <p className="mt-1 text-xs text-white/65">Design consultation at no cost, no obligation.</p>
              </div>
              <div className="grid gap-1">
              {nav.map((item) => item.label === "Services" ? (
                <div key={item.href}>
                  <button
                    type="button"
                    aria-expanded={servicesOpen}
                    onClick={() => setServicesOpen((open) => !open)}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-base font-semibold text-ink hover:bg-mist"
                  >
                    {item.label}
                    <ChevronDown size={18} className={cn("transition-transform", servicesOpen && "rotate-180")} />
                  </button>
                  {servicesOpen && (
                    <div className="ml-3 grid gap-1 border-l-2 border-brand/20 pl-3 pb-2">
                      <Link href="/services" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-brand">All services</Link>
                      {services.map((service) => (
                        <Link key={service.slug} href={`/services/${service.slug}`} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-mist hover:text-ink">
                          {service.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={cn("rounded-xl px-4 py-3.5 text-base font-semibold hover:bg-mist", isActive(item.href) ? "bg-brand-soft text-brand" : "text-ink")}>
                  {item.label}
                </Link>
              ))}
              </div>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3.5 font-semibold text-white shadow-brand">
                Get Free Quote <ArrowRight size={17} />
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* ── Desktop pill nav ────────────────────────────────────────────── */}
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

          {/* Desktop nav */}
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
                      "nav-link-underline inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-colors",
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
                      "absolute right-0 top-full mt-2 w-[52rem] max-w-[calc(100vw-2rem)] transition-all duration-300 origin-top-right",
                      servicesOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none",
                    )}
                  >
                    <div className="overflow-hidden rounded-2xl border border-border bg-soft-white/95 backdrop-blur-xl shadow-lift">
                      <div className="grid grid-cols-[1fr_1fr_1fr_15rem]">
                        {/* Category columns */}
                        <div className="col-span-3 grid grid-cols-3 gap-x-5 gap-y-5 p-6">
                          {CATEGORY_META.map(({ name, icon: Icon }) => {
                            const items = services.filter((s) => s.category === name);
                            if (items.length === 0) return null;
                            return (
                              <div key={name}>
                                <div className="flex items-center gap-2 mb-2.5">
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
                                        className="block rounded-md px-2 py-1.5 text-[0.82rem] text-ink-soft hover:bg-ivory hover:text-ink transition-colors"
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

                        {/* Featured panel */}
                        <div className="relative flex flex-col justify-end p-6 text-soft-white">
                          <Image
                            src="/assets/stock/living-dr-1.jpg"
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
                              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-medium text-ink hover:bg-gold-soft transition-colors"
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
                    "nav-link-underline px-4 py-2 text-sm font-medium rounded-full transition-colors",
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

function PhoneIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.8 19.8 0 0 1 1.61 4.87 2 2 0 0 1 3.59 2.68h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.2a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17.7z" /></svg>;
}
