import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "./Section";

export type Crumb = { label: string; href?: string };

export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="relative bg-gradient-to-b from-cream to-ivory border-b border-border overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gold/12 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 left-[-4rem] h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-0 text-brand/[0.05] pattern-dots [mask-image:radial-gradient(55%_60%_at_85%_10%,#000,transparent)]" />
      <Container className="relative pt-20 pb-12 md:pt-40 md:pb-16">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-taupe-dark">
              {crumbs.map((c, i) => (
                <li key={i} className="inline-flex items-center gap-1">
                  {c.href ? (
                    <Link href={c.href} className="hover:text-ink transition-colors">{c.label}</Link>
                  ) : (
                    <span aria-current="page" className="text-ink">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && <ChevronRight size={14} className="text-taupe" />}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="text-4xl md:text-5xl leading-tight max-w-3xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg text-ink-soft/85 leading-relaxed">{intro}</p>}
      </Container>
    </section>
  );
}

/** JSON-LD breadcrumb helper. */
export function breadcrumbLd(crumbs: Crumb[], baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${baseUrl}${c.href}` } : {}),
    })),
  };
}
