import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Build a tel: href from a raw phone string, or default if unset. Guaranteed no spaces. */
export function telHref(phone?: string | null) {
  const raw = phone || "9900026502";
  const cleaned = raw.replace(/[^+\d]/g, "");
  if (!cleaned) return "tel:+919900026502";
  if (!cleaned.startsWith("+")) {
    if (cleaned.length === 10) {
      return `tel:+91${cleaned}`;
    }
    return `tel:+${cleaned}`;
  }
  return `tel:${cleaned}`;
}

/** Build a wa.me universal href for cross-platform compatibility. */
export function whatsappHref(number?: string | null, message?: string) {
  const raw = number || "9900026502";
  let digits = raw.replace(/[^\d]/g, "");
  if (!digits) digits = "919900026502";
  if (digits.length === 10) {
    digits = `91${digits}`;
  }
  const q = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${q}`;
}

/** Build a native WhatsApp app URI (whatsapp://) for mobile app redirection. */
export function whatsappAppHref(number?: string | null, message?: string) {
  const raw = number || "9900026502";
  let digits = raw.replace(/[^\d]/g, "");
  if (!digits) digits = "919900026502";
  if (digits.length === 10) {
    digits = `91${digits}`;
  }
  const q = message ? `&text=${encodeURIComponent(message)}` : "";
  return `whatsapp://send?phone=${digits}${q}`;
}

/** Open WhatsApp in the native app on mobile or in WhatsApp Web on desktop. */
export function openWhatsApp(number?: string | null, message?: string) {
  if (typeof window === "undefined") return;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = whatsappAppHref(number, message);
  } else {
    window.open(whatsappHref(number, message), "_blank", "noopener,noreferrer");
  }
}

/** Open phone dialer with cleaned number. */
export function openPhone(phone?: string | null) {
  if (typeof window === "undefined") return;
  window.location.href = telHref(phone);
}

/** Build a mailto: href, or null if unset. */
export function mailHref(email?: string | null) {
  if (!email) return null;
  return `mailto:${email}`;
}

