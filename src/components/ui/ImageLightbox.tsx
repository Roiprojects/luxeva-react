"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageAsset = { src: string; alt: string };

export function ImageLightbox({
  images,
  open,
  onClose,
  initialIndex = 0,
}: {
  images: ImageAsset[];
  open: boolean;
  onClose: () => void;
  initialIndex?: number;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Reset index when opening with a new initial index
  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  // Lock body scroll & prevent background scroll
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus the close button for accessibility
    closeBtnRef.current?.focus();
    return () => { document.body.style.overflow = original; };
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          goPrev();
          break;
        case "ArrowRight":
          goNext();
          break;
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const goTo = useCallback((newIndex: number) => {
    if (isTransitioning) return;
    if (newIndex < 0 || newIndex >= images.length) return;
    setDirection(newIndex > index ? "next" : "prev");
    setIsTransitioning(true);
    setIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [index, images.length, isTransitioning]);

  const goNext = useCallback(() => {
    if (index < images.length - 1) goTo(index + 1);
  }, [index, images.length, goTo]);

  const goPrev = useCallback(() => {
    if (index > 0) goTo(index - 1);
  }, [index, goTo]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const dx = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(dx) > 60) {
      if (dx < 0) goNext();
      else goPrev();
    }
    setTouchStart(null);
  };

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) onClose();
  };

  if (!open || images.length === 0) return null;

  const current = images[index];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[70] flex flex-col bg-ink/95 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 shrink-0">
        <span className="text-xs sm:text-sm font-medium text-soft-white/70">
          {index + 1} / {images.length}
        </span>
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-soft-white/80 hover:bg-white/10 hover:text-soft-white transition-colors"
          aria-label="Close viewer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Image area */}
      <div
        className="flex-1 relative flex items-center justify-center min-h-0"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Prev arrow */}
        {index > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-2 sm:left-4 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-ink/40 text-soft-white/90 backdrop-blur hover:bg-ink/60 hover:text-soft-white transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* Main image */}
        <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
          <img
            key={current.src}
            src={current.src}
            alt={current.alt}
            className={cn(
              "max-w-full max-h-full object-contain rounded-lg shadow-lift",
              direction === "next" && "animate-slide-in-right",
              direction === "prev" && "animate-slide-in-left",
              !direction && "animate-fade-in",
            )}
            draggable={false}
          />
        </div>

        {/* Next arrow */}
        {index < images.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 sm:right-4 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-ink/40 text-soft-white/90 backdrop-blur hover:bg-ink/60 hover:text-soft-white transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="shrink-0 border-t border-white/10 bg-ink/60 backdrop-blur-sm">
        <div className="flex gap-2 overflow-x-auto px-4 py-3 sm:px-6 sm:justify-center sm:py-3 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => goTo(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200",
                i === index
                  ? "border-gold-2 opacity-100 scale-105"
                  : "border-transparent opacity-50 hover:opacity-80",
              )}
            >
              <img
                src={img.src}
                alt=""
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
