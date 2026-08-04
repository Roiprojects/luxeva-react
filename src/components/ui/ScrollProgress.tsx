"use client";

import { useEffect, useState } from "react";

/** Thin gold scroll-progress bar pinned to the very top of the viewport. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollTop = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(1, scrollTop / height) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-[3px] bg-transparent pointer-events-none" aria-hidden>
      <div
        className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-soft origin-left"
        style={{ transform: `scaleX(${progress})`, transition: "transform 0.1s linear" }}
      />
    </div>
  );
}
