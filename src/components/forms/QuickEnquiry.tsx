"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { submitEnquiry } from "@/lib/enquiry";

/** Compact lead-capture card (name + phone) for the hero. */
export function QuickEnquiry() {
  const pathname = usePathname();
  const renderedAt = useRef(0);
  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const res = await submitEnquiry({
      name,
      phone,
      consent: true,
      serviceInterest: "Free consultation (hero)",
      renderedAt: renderedAt.current,
      sourcePage: pathname,
    });
    if (res.ok) {
      setStatus("done");
    } else {
      setStatus("error");
      setError(res.error);
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-line bg-paper p-6 shadow-card text-center">
        <CheckCircle2 className="mx-auto text-brand" size={40} />
        <h3 className="mt-3 text-xl font-semibold">Thank you!</h3>
        <p className="mt-1 text-sm text-ink-soft">Our team will call you back shortly to book your free consultation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-paper/95 backdrop-blur p-5 shadow-card">
      <p className="text-sm font-semibold text-ink">Book a free design consultation</p>
      <p className="text-xs text-ink-soft mt-0.5">No cost, no obligation. We&rsquo;ll call you back.</p>
      <div className="mt-4 space-y-3">
        <input
          required minLength={2}
          value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-xl border border-line bg-mist px-4 py-3 text-sm focus:border-brand focus:bg-paper focus:outline-none transition-colors"
          aria-label="Your name"
        />
        <div className="flex">
          <span className="inline-flex items-center rounded-l-xl border border-r-0 border-line bg-mist px-3 text-sm font-medium text-ink-soft">+91</span>
          <input
            required type="tel" inputMode="numeric" maxLength={10} pattern="[0-9]{10}"
            value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10-digit phone number"
            className="w-full rounded-r-xl border border-line bg-mist px-4 py-3 text-sm focus:border-brand focus:bg-paper focus:outline-none transition-colors"
            aria-label="Phone number"
          />
        </div>
        <button
          type="submit" disabled={status === "loading"}
          className="btn-sheen inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-sm font-semibold text-white shadow-brand hover:bg-brand-dark transition-colors disabled:opacity-60"
        >
          {status === "loading" ? <><Loader2 size={17} className="animate-spin" /> Sending…</> : <>Get Free Quote <ArrowRight size={16} /></>}
        </button>
        {error && <p className="text-xs text-brand text-center">{error}</p>}
        <p className="text-[0.7rem] text-muted text-center">By submitting you agree to our <a href="/privacy-policy" className="underline">privacy policy</a>.</p>
      </div>
    </form>
  );
}
