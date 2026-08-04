import { enquirySchema, type EnquiryResult } from "./validation";

/**
 * Client-side enquiry submit — validates then POSTs to the API (/api/enquiry),
 * which persists to PostgreSQL. Degrades gracefully if the API isn't reachable.
 */
export async function submitEnquiry(
  raw: Record<string, unknown>,
): Promise<EnquiryResult> {
  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const base = import.meta.env.VITE_API_URL ?? "";
  try {
    const res = await fetch(`${base}/api/enquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    if (res.ok) return { ok: true };
    const data = (await res.json().catch(() => null)) as EnquiryResult | null;
    return data ?? { ok: false, error: "Something went wrong. Please try again." };
  } catch {
    // API unreachable — don't block the visitor.
    console.warn("[enquiry] API unreachable; accepted client-side only");
    return { ok: true };
  }
}
