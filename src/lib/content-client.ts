import { applyContentOverrides } from "./content";

export async function hydratePublicContent() {
  try {
    const res = await fetch("/api/public/content", { credentials: "same-origin" });
    if (!res.ok) return;
    const payload = await res.json();
    if (payload?.ok && payload.documents) {
      applyContentOverrides(payload.documents);
    }
  } catch {
    // fall back to bundled defaults when the API is unavailable
  }
}
