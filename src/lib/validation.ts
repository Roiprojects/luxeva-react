import { z } from "zod";

export const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Independent House",
  "Commercial Showroom",
  "Office",
  "Other",
] as const;

export const BUDGET_RANGES = [
  "Under ₹5 Lakh",
  "₹5–10 Lakh",
  "₹10–20 Lakh",
  "₹20–40 Lakh",
  "₹40 Lakh+",
  "Not sure yet",
] as const;

export const TIMELINES = [
  "Immediately",
  "Within 1 month",
  "1–3 months",
  "3–6 months",
  "Just exploring",
] as const;

export const SERVICE_INTERESTS = [
  "Residential Home Interior",
  "Modular Kitchen & Countertops",
  "Carpentry & Wardrobes",
  "Electrical Works",
  "False Ceiling & POP",
  "Home Automation",
  "Plumbing Services",
  "Tiles & Bathroom Work",
  "Custom Beds & Bedrooms",
  "Study & Home Office",
  "Living Area Wall Design",
  "Commercial & Showroom Interior",
  "Other",
] as const;

/** Shared enquiry schema — used by the client form and the server action. */
export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(15, "Please enter a valid phone number")
    .regex(/^[+\d][\d\s-]{6,}$/, "Please enter a valid phone number"),
  email: z
    .union([z.string().trim().email("Please enter a valid email"), z.literal("")])
    .optional(),
  serviceInterest: z.string().trim().max(120).optional(),
  // Unselected <select> submits "" — accept it alongside the enum values.
  propertyType: z.enum(PROPERTY_TYPES).or(z.literal("")).optional(),
  location: z.string().trim().max(120).optional(),
  budgetRange: z.enum(BUDGET_RANGES).or(z.literal("")).optional(),
  timeline: z.enum(TIMELINES).or(z.literal("")).optional(),
  message: z.string().trim().max(2000).optional(),
  consent: z
    .boolean()
    .refine((v) => v === true, "Please accept the privacy terms to continue"),
  // Anti-spam (server-checked): honeypot must be empty; renderedAt used for a time-trap.
  company: z.string().max(0).optional(), // honeypot
  renderedAt: z.number().optional(),
  // Context (captured automatically)
  sourcePage: z.string().max(300).optional(),
  utm: z.record(z.string(), z.string()).optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type EnquiryResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };
