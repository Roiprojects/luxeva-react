import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("container-lux", className)}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  tone = "dark",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "center" | "left";
  tone?: "dark" | "light";
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
      )}
    >
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h2
        className={cn(
          "text-3xl md:text-4xl lg:text-[2.75rem] leading-tight",
          tone === "light" ? "text-soft-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {intro ? (
        <p
          className={cn(
            "mt-4 text-base md:text-lg leading-relaxed",
            tone === "light" ? "text-soft-white/80" : "text-ink-soft/85",
          )}
        >
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}
