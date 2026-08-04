"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Slide = { image: string; title: string; caption?: string };

/**
 * Lightweight, dependency-free carousel — autoplay (paused on hover / reduced-motion),
 * prev/next arrows, dots, and pointer/touch swipe. Echoes the reference site's slider
 * usage in a cleaner, premium form.
 */
export function Carousel({ slides, interval = 5000 }: { slides: Slide[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragX = useRef<number | null>(null);
  const n = slides.length;

  const go = useCallback((i: number) => setIndex((i + n) % n), [n]);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (paused || n <= 1) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % n), interval);
    return () => window.clearInterval(t);
  }, [paused, n, interval]);

  const onDown = (e: React.PointerEvent) => { dragX.current = e.clientX; };
  const onUp = (e: React.PointerEvent) => {
    if (dragX.current == null) return;
    const dx = e.clientX - dragX.current;
    if (dx > 60) prev();
    else if (dx < -60) next();
    dragX.current = null;
  };

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div
        className="relative overflow-hidden rounded-3xl shadow-card touch-pan-y"
        onPointerDown={onDown}
        onPointerUp={onUp}
      >
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((s, i) => (
            <div key={s.image} className="relative w-full shrink-0 aspect-[16/10] md:aspect-[21/9]">
              <Image
                src={s.image}
                alt={s.title}
                fill
                priority={i === 0}
                sizes="(max-width:1024px) 100vw, 80vw"
                className="object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gold-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-2" />Signature work
                </p>
                <h3 className="mt-2 text-2xl md:text-4xl font-medium text-white">{s.title}</h3>
                {s.caption && <p className="mt-1.5 max-w-xl text-sm md:text-base text-white/80">{s.caption}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button" onClick={prev} aria-label="Previous slide"
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-paper/85 backdrop-blur text-ink shadow-card hover:bg-paper hover:text-brand transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button" onClick={next} aria-label="Next slide"
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-paper/85 backdrop-blur text-ink shadow-card hover:bg-paper hover:text-brand transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.image} type="button" onClick={() => go(i)} aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
              i === index ? "w-7 bg-gold" : "w-2 bg-ink/20 hover:bg-ink/40",
            )}
          />
        ))}
      </div>
    </div>
  );
}
