"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import {
  enquirySchema,
  type EnquiryInput,
  PROPERTY_TYPES,
  BUDGET_RANGES,
  TIMELINES,
  SERVICE_INTERESTS,
} from "@/lib/validation";
import { submitEnquiry } from "@/lib/enquiry";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-lg border border-border bg-soft-white px-4 py-3 text-ink placeholder:text-taupe/70 focus:border-navy focus:outline-none focus-visible:outline-2 focus-visible:outline-navy focus-visible:outline-offset-1 transition-colors";
const labelCls = "block text-sm font-medium text-ink-soft mb-1.5";
const errCls = "mt-1 text-sm text-terracotta flex items-center gap-1";

type EnquiryFormProps = { defaultService?: string; compact?: boolean };

/** Public wrapper — isolates useSearchParams() in a Suspense boundary for static export. */
export function EnquiryForm(props: EnquiryFormProps) {
  return (
    <Suspense fallback={<div className="rounded-xl border border-border bg-cream/40 p-8 text-center text-ink-soft/60">Loading form…</div>}>
      <EnquiryFormInner {...props} />
    </Suspense>
  );
}

function EnquiryFormInner({ defaultService, compact = false }: EnquiryFormProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const renderedAt = useRef(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const utm = useMemo(() => {
    const out: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => {
      const v = searchParams.get(k);
      if (v) out[k] = v;
    });
    return out;
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      serviceInterest: defaultService ?? "",
      consent: false,
    },
  });

  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => setSuccess(false), 4500);
    return () => window.clearTimeout(timer);
  }, [success]);

  const onSubmit = async (values: EnquiryInput) => {
    setServerError(null);
    const result = await submitEnquiry({
      ...values,
      renderedAt: renderedAt.current,
      sourcePage: pathname,
      utm,
    });
    if (result.ok) {
      setSuccess(true);
      reset();
    } else {
      setServerError(result.error);
    }
  };

  if (success) {
    return (
      <div
        role="status"
        className="rounded-xl border border-border bg-soft-white p-8 text-center shadow-soft"
      >
        <CheckCircle2 className="mx-auto text-navy" size={44} />
        <h3 className="mt-4 text-2xl">Thank you — enquiry received</h3>
        <p className="mt-2 text-ink-soft/85">
          Our team will review your requirements and get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm font-medium text-navy underline underline-offset-4"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-xl border border-border bg-cream/40 p-6 md:p-8 shadow-soft"
    >
      {/* Honeypot — visually hidden, not announced */}
      <div aria-hidden className="absolute -left-[9999px]" tabIndex={-1}>
        <label>
          Company
          <input type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
        </label>
      </div>

      <div className={cn("grid gap-4", compact ? "sm:grid-cols-1" : "sm:grid-cols-2")}>
        <div>
          <label htmlFor="name" className={labelCls}>
            Full name <span className="text-terracotta">*</span>
          </label>
          <input id="name" className={field} autoComplete="name" aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-err" : undefined} {...register("name")} />
          {errors.name && <p id="name-err" className={errCls}><AlertCircle size={14} />{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className={labelCls}>
            Phone <span className="text-terracotta">*</span>
          </label>
          <input id="phone" type="tel" className={field} autoComplete="tel" aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-err" : undefined} {...register("phone")} />
          {errors.phone && <p id="phone-err" className={errCls}><AlertCircle size={14} />{errors.phone.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className={labelCls}>Email</label>
          <input id="email" type="email" className={field} autoComplete="email" aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-err" : undefined} {...register("email")} />
          {errors.email && <p id="email-err" className={errCls}><AlertCircle size={14} />{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="location" className={labelCls}>Location</label>
          <input id="location" className={field} placeholder="City / area" {...register("location")} />
        </div>

        <div>
          <label htmlFor="propertyType" className={labelCls}>Property type</label>
          <select id="propertyType" className={field} defaultValue="" {...register("propertyType")}>
            <option value="" disabled>Select…</option>
            {PROPERTY_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="serviceInterest" className={labelCls}>Service of interest</label>
          <select id="serviceInterest" className={field} {...register("serviceInterest")}>
            <option value="">Select a service</option>
            {SERVICE_INTERESTS.map((service) => <option key={service} value={service}>{service}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="budgetRange" className={labelCls}>Approximate budget</label>
          <select id="budgetRange" className={field} defaultValue="" {...register("budgetRange")}>
            <option value="" disabled>Select…</option>
            {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="timeline" className={labelCls}>Timeline</label>
          <select id="timeline" className={field} defaultValue="" {...register("timeline")}>
            <option value="" disabled>Select…</option>
            {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="message" className={labelCls}>Message</label>
        <textarea id="message" rows={4} className={field} placeholder="Tell us about your space and requirements…" {...register("message")} />
      </div>

      <div className="mt-4 flex items-start gap-3">
        <input id="consent" type="checkbox" className="mt-1 h-5 w-5 rounded border-border accent-navy"
          aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "consent-err" : undefined} {...register("consent")} />
        <label htmlFor="consent" className="text-sm text-ink-soft/85">
          I agree to be contacted about my enquiry and accept the{" "}
          <a href="/privacy-policy" className="text-navy underline underline-offset-2">privacy policy</a>.
        </label>
      </div>
      {errors.consent && <p id="consent-err" className={errCls}><AlertCircle size={14} />{errors.consent.message}</p>}

      {serverError && (
        <div role="alert" className="mt-4 rounded-lg border border-terracotta/30 bg-terracotta/5 px-4 py-3 text-sm text-terracotta flex items-center gap-2">
          <AlertCircle size={16} /> {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 font-medium text-ink shadow-soft hover:bg-gold-soft hover:shadow-card transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:opacity-60"
      >
        {isSubmitting ? (<><Loader2 size={18} className="animate-spin" /> Sending…</>) : "Send enquiry"}
      </button>
    </form>
  );
}
