import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "on-dark";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "btn-sheen bg-brand text-white hover:bg-brand-dark shadow-brand hover:-translate-y-0.5 outline-navy",
  secondary:
    "btn-sheen bg-navy text-white hover:bg-navy-dark shadow-soft hover:-translate-y-0.5 outline-brand",
  outline:
    "border border-ink/20 text-ink hover:border-brand hover:text-brand hover:bg-brand-soft outline-brand",
  ghost: "text-ink hover:bg-ink/[0.05] outline-brand",
  "on-dark":
    "border border-white/40 text-white hover:bg-white/10 outline-white",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2 min-h-9",
  md: "text-[0.95rem] px-6 py-3 min-h-11",
  lg: "text-base px-8 py-4 min-h-12",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
};

type ButtonAsButton = CommonProps &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const { external } = props;
    if (external) {
      return (
        <a href={props.href} className={classes} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
