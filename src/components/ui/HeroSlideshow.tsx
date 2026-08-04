"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type HeroImage = { src: string; alt: string };

/**
 * Auto-advancing hero background slideshow — horizontal slide with a slow ease.
 * The text overlay stays fixed on top. Pauses / stays on the first frame under
 * prefers-reduced-motion. Dots allow manual control.
 */
export function HeroSlideshow({
  images,
  interval = 5000,
}: {
  images: HeroImage[];
  interval?: number;
}) {
  const [i, setI] = useState(0);
  const n = images.length;

  useEffect(() => {
    if (n <= 1) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setI((p) => (p + 1) % n), interval);
    return () => window.clearInterval(t);
  }, [n, interval]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="flex h-full w-full transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={img.src} className="relative h-full w-full shrink-0">
            <Image
              src={img.src}
              alt={idx === 0 ? img.alt : ""}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {images.map((img, idx) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setI(idx)}
            aria-label={`Show slide ${idx + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              idx === i ? "w-7 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80",
            )}
          />
        ))}
      </div>
    </div>
  );
}
