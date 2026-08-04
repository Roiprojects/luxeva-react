import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/types";

export function ServiceCard({ service }: { service: Service }) {
  const img = service.heroImage;
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-soft-white shadow-soft hover:shadow-lift hover:-translate-y-1.5 hover:border-gold/40 transition-all duration-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
    >
      <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-0.5 scale-x-0 origin-left bg-gradient-to-r from-gold to-gold-soft transition-transform duration-500 group-hover:scale-x-100" />
      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
        {img ? (
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cream to-sand">
            <span className="font-[family-name:var(--font-display)] text-2xl text-taupe-dark/50">
              {service.title.charAt(0)}
            </span>
          </div>
        )}
        {img?.isRender && (
          <span className="absolute top-3 left-3 rounded-full bg-ink/70 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-soft-white">
            Design visualisation
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow mb-2 text-[0.65rem]">{service.category}</p>
        <h3 className="text-xl leading-snug line-clamp-2 min-h-[3.4rem]">{service.title}</h3>
        <p className="mt-2 text-sm text-ink-soft/80 line-clamp-2 min-h-[2.5rem]">{service.shortDescription}</p>
        <span className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-dark">
          View details
          <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
