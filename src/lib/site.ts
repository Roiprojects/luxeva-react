/** Global site configuration. Brand facts here are safe/non-invented. */

export const siteConfig = {
  name: "Luxeva Care",
  legalName: "Luxeva Care Pvt Ltd",
  tagline: "Complete residential & commercial interior solutions",
  /**
   * Update to the production domain when supplied (MISSING_CLIENT_INPUTS H1).
   * Used for canonical URLs, sitemap and Open Graph.
   */
  url: import.meta.env.VITE_SITE_URL ?? "https://luxevacare.example",
  description:
    "Luxeva Care Pvt Ltd delivers premium residential and commercial interior design and execution — from consultation and space planning to custom furniture, finishing and handover.",
  locale: "en_IN",
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
] as const;
