import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Build a tel: href from a raw phone string, or null if unset. */
export function telHref(phone?: string | null) {
  if (!phone) return null;
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

/** Build a wa.me href from a raw WhatsApp number, or null if unset. */
export function whatsappHref(number?: string | null, message?: string) {
  if (!number) return null;
  const digits = number.replace(/[^\d]/g, "");
  const q = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${q}`;
}

/** Build a mailto: href, or null if unset. */
export function mailHref(email?: string | null) {
  if (!email) return null;
  return `mailto:${email}`;
}
