import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Build a tel: href from a raw phone string, or null if unset. */
export function telHref(phone?: string | null) {
  if (!phone) return "tel:+919900026502";
  const cleaned = phone.replace(/[^+\d]/g, "");
  if (!cleaned) return "tel:+919900026502";
  if (!cleaned.startsWith("+") && cleaned.length === 10) {
    return `tel:+91${cleaned}`;
  }
  return `tel:${cleaned}`;
}

/** Build a wa.me / api.whatsapp.com href from a raw WhatsApp number. */
export function whatsappHref(number?: string | null, message?: string) {
  const raw = number || "9900026502";
  let digits = raw.replace(/[^\d]/g, "");
  if (!digits) digits = "919900026502";
  if (digits.length === 10) {
    digits = `91${digits}`;
  }
  const q = message ? `&text=${encodeURIComponent(message)}` : "";
  return `https://api.whatsapp.com/send?phone=${digits}${q}`;
}

/** Build a native WhatsApp app href from a raw WhatsApp number. */
export function whatsappAppHref(number?: string | null, message?: string) {
  return whatsappHref(number, message);
}

/** Build a mailto: href, or null if unset. */
export function mailHref(email?: string | null) {
  if (!email) return null;
  return `mailto:${email}`;
}
