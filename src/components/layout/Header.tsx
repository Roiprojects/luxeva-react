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
      {/* Announcement strip — hides on scroll */}
      <div
        className={cn(
          "overflow-hidden bg-brand text-white transition-all duration-500",
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100",
        )}
      >
        <div className="container-lux flex items-center justify-center gap-2 py-2 text-center text-xs sm:text-sm font-medium">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/80" />
          Book a <strong className="font-semibold">free design consultation</strong> — no cost, no obligation.
          <Link href="/contact" className="ml-1 hidden sm:inline underline underline-offset-2 hover:text-white/80">Enquire now →</Link>
        </div>
      </div>

      <div className={cn("container-lux transition-all duration-500", scrolled ? "pt-2 md:pt-3" : "pt-3 md:pt-4")}>
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
                            src="/assets/stock/img-34.jpg"
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

          {/* Mobile toggle */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full text-ink hover:bg-ink/5 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 bg-ivory/98 backdrop-blur-xl transition-all duration-400",
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none",
        )}
      >
        <nav aria-label="Mobile" className="container-lux pt-28 pb-10 flex flex-col gap-1 h-full overflow-y-auto">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "py-4 text-2xl font-[family-name:var(--font-display)] border-b border-border transition-all duration-500",
                mobileOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4",
                isActive(item.href) ? "text-ink" : "text-ink-soft",
              )}
              style={{ transitionDelay: mobileOpen ? `${100 + i * 60}ms` : "0ms" }}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-6">
            <Button href="/contact" className="w-full" size="lg">
              Get Free Quote
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
