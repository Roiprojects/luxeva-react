import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { getContentSnapshot, type RoomCategory } from "@/lib/content";
import type { ContactDetails, Faq, ImageAsset, Leader, Project, Service, Testimonial } from "@/lib/types";
import { AssetPicker } from "@/components/admin/AssetPicker";
import { Save, Plus, Trash2, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

const routeToKey: Record<string, string> = {
  "/admin/home": "home",
  "/admin/about": "about",
  "/admin/rooms": "roomCategories",
  "/admin/services": "services",
  "/admin/portfolio": "projects",
  "/admin/faqs": "faqs",
  "/admin/testimonials": "testimonials",
  "/admin/leadership": "leadership",
  "/admin/contact-settings": "contactDetails",
};

const PAGE_LABELS: Record<string, string> = {
  home: "Home Page", about: "About Us", roomCategories: "Room Categories",
  services: "Services", projects: "Portfolio", faqs: "FAQs",
  testimonials: "Testimonials", leadership: "Leadership", contactDetails: "Contact Info",
};

const PAGE_DESCRIPTIONS: Record<string, string> = {
  home: "Edit the hero, about preview, trust strip and process steps shown on the home page.",
  about: "Update the about page text, values and images.",
  roomCategories: "Manage the room category tiles on the home page.",
  services: "Edit each service page — descriptions, images, benefits and FAQs.",
  projects: "Update portfolio projects with photos and descriptions.",
  faqs: "Add or edit frequently asked questions.",
  testimonials: "Manage customer reviews shown on the site.",
  leadership: "Update team member profiles and bios.",
  contactDetails: "Edit phone, email, address and social media links.",
};

/* ─── Heading helpers: split the hero HTML heading into two plain-text fields ─── */

function parseHeading(raw: string): { line1: string; line2: string } {
  const brMatch = raw.match(/^([\s\S]*?)<br\s*\/?>/i);
  if (!brMatch) return { line1: raw.replace(/&amp;/g, "&"), line2: "" };
  const line1 = brMatch[1].trim();
  const spanMatch = raw.match(/<span[^>]*>([\s\S]*?)<\/span>/i);
  const line2 = spanMatch ? spanMatch[1].replace(/&amp;/g, "&") : "";
  return { line1, line2 };
}

function buildHeading(line1: string, line2: string): string {
  if (!line2.trim()) return line1;
  return `${line1}<br/><span class="text-gradient-gold">${line2.replace(/&/g, "&amp;")}</span>`;
}

/* ─── Shared field components ─── */

const fieldCls = "w-full rounded-xl border border-line bg-mist/40 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10 transition-all";
const labelCls = "block text-sm font-medium text-ink mb-1.5";

function Field({ label, value, onChange, multiline = false, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {multiline
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} className={`${fieldCls} min-h-[120px] resize-y`} placeholder={placeholder} />
        : <input value={value} onChange={(e) => onChange(e.target.value)} className={fieldCls} placeholder={placeholder} />
      }
    </label>
  );
}

function CheckboxField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 text-sm cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-line accent-navy" />
      <span className="text-ink-soft">{label}</span>
    </label>
  );
}

function TextListEditor({ label, values, onChange, placeholder = "" }: { label: string; values: string[]; onChange: (next: string[]) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className={labelCls}>{label} <span className="text-ink-soft font-normal">(one per line)</span></span>
      <textarea
        value={values.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n").map((item) => item.trim()).filter(Boolean))}
        className={`${fieldCls} min-h-[120px] resize-y`}
        placeholder={placeholder}
      />
    </label>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-2xl border border-line bg-white overflow-hidden">
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between px-5 py-4 bg-mist/50 hover:bg-mist transition-colors text-left">
        <span className="text-sm font-semibold text-ink">{title}</span>
        {open ? <ChevronUp size={16} className="text-ink-soft" /> : <ChevronDown size={16} className="text-ink-soft" />}
      </button>
      {open && <div className="p-5 space-y-4">{children}</div>}
    </div>
  );
}

function ImageAssetEditor({ label, asset, onChange }: { label: string; asset: ImageAsset | undefined; onChange: (next: ImageAsset) => void }) {
  const next = asset ?? { src: "", alt: "" };
  return (
    <div className="space-y-3 rounded-xl border border-line bg-mist/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</p>
      {next.src && (
        <img src={next.src} alt={next.alt || label} className="h-24 w-full object-cover rounded-lg" />
      )}
      <AssetPicker label="Image" value={next.src ?? ""} onChange={(src) => onChange({ ...next, src })} />
      <Field label="Alt text (describe the image)" value={next.alt ?? ""} onChange={(alt) => onChange({ ...next, alt })} />
      <CheckboxField label="This is a design render / 3D visual" checked={!!next.isRender} onChange={(isRender) => onChange({ ...next, isRender })} />
    </div>
  );
}

function ImageArrayEditor({ label, items, onChange }: { label: string; items: ImageAsset[]; onChange: (next: ImageAsset[]) => void }) {
  const safeItems = items ?? [];
  const update = (index: number, patch: Partial<ImageAsset>) => {
    const next = structuredClone(safeItems);
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink">{label} <span className="text-ink-soft font-normal">({safeItems.length})</span></p>
        <button type="button" onClick={() => onChange([...safeItems, { src: "", alt: "" }])} className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs font-medium text-ink-soft hover:border-navy hover:text-navy transition-all">
          <Plus size={13} /> Add image
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {safeItems.map((item, index) => (
          <div key={`${item.src}-${index}`} className="space-y-3 rounded-xl border border-line bg-mist/30 p-4">
            {item.src && <img src={item.src} alt={item.alt || ""} className="h-20 w-full object-cover rounded-lg" />}
            <AssetPicker label={`Image ${index + 1}`} value={item.src ?? ""} onChange={(src) => update(index, { src })} />
            <Field label="Alt text" value={item.alt ?? ""} onChange={(alt) => update(index, { alt })} />
            <div className="flex items-center justify-between">
              <CheckboxField label="Design render" checked={!!item.isRender} onChange={(isRender) => update(index, { isRender })} />
              <button type="button" onClick={() => onChange(safeItems.filter((_, i) => i !== index))} className="flex items-center gap-1 text-xs text-brand hover:underline">
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleImagePathListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (next: string[]) => void }) {
  const safeItems = items ?? [];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink">{label}</p>
        <button type="button" onClick={() => onChange([...safeItems, ""])} className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs font-medium text-ink-soft hover:border-navy hover:text-navy transition-all">
          <Plus size={13} /> Add
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {safeItems.map((item, index) => (
          <div key={`${item}-${index}`} className="space-y-2 rounded-xl border border-line bg-mist/30 p-3">
            {item && <img src={item} alt="" className="h-16 w-full object-cover rounded-lg" />}
            <div className="flex items-center gap-2">
              <div className="flex-1"><AssetPicker label="" value={item} onChange={(value) => onChange(safeItems.map((e, i) => i === index ? value : e))} /></div>
              <button type="button" onClick={() => onChange(safeItems.filter((_, i) => i !== index))} className="text-brand hover:text-brand-dark flex-shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TitledDescriptionListEditor({ label, items, onChange }: {
  label: string; items: Array<{ title: string; description: string }>;
  onChange: (next: Array<{ title: string; description: string }>) => void;
}) {
  const safeItems = items ?? [];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink">{label}</p>
        <button type="button" onClick={() => onChange([...safeItems, { title: "", description: "" }])} className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs font-medium text-ink-soft hover:border-navy hover:text-navy transition-all">
          <Plus size={13} /> Add item
        </button>
      </div>
      {safeItems.map((item, index) => (
        <div key={`${item.title}-${index}`} className="rounded-xl border border-line bg-mist/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Item {index + 1}</p>
            <button type="button" onClick={() => onChange(safeItems.filter((_, i) => i !== index))} className="flex items-center gap-1 text-xs text-brand hover:underline">
              <Trash2 size={12} /> Remove
            </button>
          </div>
          <Field label="Title" value={item.title} onChange={(value) => onChange(safeItems.map((e, i) => i === index ? { ...e, title: value } : e))} />
          <Field label="Description" value={item.description} onChange={(value) => onChange(safeItems.map((e, i) => i === index ? { ...e, description: value } : e))} multiline />
        </div>
      ))}
    </div>
  );
}

function StringPairListEditor({ label, items, firstLabel, secondLabel, onChange }: {
  label: string; items: Array<{ label: string; value: string }>; firstLabel: string; secondLabel: string;
  onChange: (next: Array<{ label: string; value: string }>) => void;
}) {
  const safeItems = items ?? [];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink">{label}</p>
        <button type="button" onClick={() => onChange([...safeItems, { label: "", value: "" }])} className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs font-medium text-ink-soft hover:border-navy hover:text-navy transition-all">
          <Plus size={13} /> Add
        </button>
      </div>
      {safeItems.map((item, index) => (
        <div key={`${item.label}-${index}`} className="grid sm:grid-cols-2 gap-3 rounded-xl border border-line bg-mist/30 p-4">
          <Field label={firstLabel} value={item.label} onChange={(value) => onChange(safeItems.map((e, i) => i === index ? { ...e, label: value } : e))} />
          <Field label={secondLabel} value={item.value} onChange={(value) => onChange(safeItems.map((e, i) => i === index ? { ...e, value } : e))} />
          <button type="button" onClick={() => onChange(safeItems.filter((_, i) => i !== index))} className="flex items-center gap-1 text-xs text-brand hover:underline sm:col-span-2">
            <Trash2 size={12} /> Remove this item
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── Section editors ─── */

function HomeEditor({ doc, onChange }: { doc: any; onChange: (next: any) => void }) {
  const update = (path: string[], value: unknown) => {
    const next = structuredClone(doc);
    let cursor = next;
    for (let i = 0; i < path.length - 1; i++) cursor = cursor[path[i]];
    cursor[path[path.length - 1]] = value;
    onChange(next);
  };
  const { line1: headingLine1, line2: headingLine2 } = parseHeading(doc.hero?.heading ?? "");

  return (
    <div className="space-y-4">
      <SectionCard title="Hero Banner">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Eyebrow text" value={doc.hero?.eyebrow ?? ""} onChange={(v) => update(["hero", "eyebrow"], v)} placeholder="e.g. Premium Interiors" />
          <Field
            label="Heading — first line"
            value={headingLine1}
            onChange={(v) => update(["hero", "heading"], buildHeading(v, headingLine2))}
            placeholder="e.g. Crafted luxury interiors,"
          />
          <Field
            label="Heading — gold highlighted phrase"
            value={headingLine2}
            onChange={(v) => update(["hero", "heading"], buildHeading(headingLine1, v))}
            placeholder="e.g. designed & delivered"
          />
          <Field label="Sub-heading (shown below the main heading)" value={doc.hero?.subheading ?? ""} onChange={(v) => update(["hero", "subheading"], v)} multiline placeholder="A brief description of your services…" />
        </div>
        <ImageArrayEditor label="Slideshow images" items={doc.hero?.images ?? []} onChange={(v) => update(["hero", "images"], v)} />
        <StringPairListEditor label="Stats strip (e.g. '500+' / 'Projects')" items={doc.hero?.stats ?? []} firstLabel="Number / Label" secondLabel="Description" onChange={(v) => update(["hero", "stats"], v)} />
      </SectionCard>
      <SectionCard title="About Preview">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Eyebrow" value={doc.aboutPreview?.eyebrow ?? ""} onChange={(v) => update(["aboutPreview", "eyebrow"], v)} />
          <Field label="Title" value={doc.aboutPreview?.title ?? ""} onChange={(v) => update(["aboutPreview", "title"], v)} />
          <Field label="Body text" value={doc.aboutPreview?.body ?? ""} onChange={(v) => update(["aboutPreview", "body"], v)} multiline />
        </div>
        <AssetPicker label="Preview image" value={doc.aboutPreview?.image ?? ""} onChange={(v) => update(["aboutPreview", "image"], v)} />
      </SectionCard>
      <SectionCard title="Trust Strip">
        <TextListEditor label="Trust points" values={doc.trustStrip ?? []} onChange={(v) => update(["trustStrip"], v)} placeholder="e.g. 500+ Happy Clients" />
      </SectionCard>
      <SectionCard title="Why Choose Us">
        <TitledDescriptionListEditor label="Reasons" items={doc.whyChoose ?? []} onChange={(v) => update(["whyChoose"], v)} />
      </SectionCard>
      <SectionCard title="Design Process">
        <TitledDescriptionListEditor label="Process steps" items={doc.designProcess ?? []} onChange={(v) => update(["designProcess"], v)} />
      </SectionCard>
      <SectionCard title="Materials Section">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Eyebrow" value={doc.materials?.eyebrow ?? ""} onChange={(v) => update(["materials", "eyebrow"], v)} />
          <Field label="Title" value={doc.materials?.title ?? ""} onChange={(v) => update(["materials", "title"], v)} />
          <Field label="Body text" value={doc.materials?.body ?? ""} onChange={(v) => update(["materials", "body"], v)} multiline />
        </div>
        <SimpleImagePathListEditor label="Materials images" items={doc.materials?.images ?? []} onChange={(v) => update(["materials", "images"], v)} />
      </SectionCard>
    </div>
  );
}

function AboutEditor({ doc, onChange }: { doc: any; onChange: (next: any) => void }) {
  const next = structuredClone(doc);
  return (
    <div className="space-y-4">
      <SectionCard title="Story & Mission">
        <Field label="Introduction paragraph" value={doc.intro ?? ""} onChange={(v) => { next.intro = v; onChange(structuredClone(next)); }} multiline />
        <Field label="Our story" value={doc.story ?? ""} onChange={(v) => { next.story = v; onChange(structuredClone(next)); }} multiline />
        <Field label="Mission statement" value={doc.mission ?? ""} onChange={(v) => { next.mission = v; onChange(structuredClone(next)); }} multiline />
        <Field label="Vision statement" value={doc.vision ?? ""} onChange={(v) => { next.vision = v; onChange(structuredClone(next)); }} multiline />
      </SectionCard>
      <SectionCard title="Photo & Values">
        <AssetPicker label="About page image" value={doc.image ?? ""} onChange={(v) => { next.image = v; onChange(structuredClone(next)); }} />
        <TextListEditor label="Our values" values={doc.values ?? []} onChange={(v) => { next.values = v; onChange(structuredClone(next)); }} placeholder="e.g. Quality craftsmanship" />
        <TextListEditor label="Areas of expertise" values={doc.expertise ?? []} onChange={(v) => { next.expertise = v; onChange(structuredClone(next)); }} />
      </SectionCard>
    </div>
  );
}

const ROOM_PAGE_OPTIONS = [
  { label: "Living Room", href: "/services/living-room" },
  { label: "Bedroom", href: "/services/bedroom" },
  { label: "Kitchen", href: "/services/kitchen" },
  { label: "Wardrobe / Storage", href: "/services/wardrobe" },
  { label: "Bathroom & Tiles", href: "/services/tiles-bathroom-work" },
  { label: "Plumbing", href: "/services/plumbing-service" },
  { label: "Electrical Works", href: "/services/electrical-works" },
  { label: "False Ceiling", href: "/services/false-ceiling" },
  { label: "Home Office", href: "/services/home-office" },
  { label: "Kids Room", href: "/services/kids-room" },
  { label: "All Services", href: "/services" },
];

function RoomCategoryEditor({ doc, onChange }: { doc: RoomCategory[]; onChange: (next: RoomCategory[]) => void }) {
  const items = doc ?? [];
  const update = (index: number, patch: Partial<RoomCategory>) => {
    const next = structuredClone(items);
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };
  return (
    <div className="space-y-4">
      <button type="button" onClick={() => onChange([...items, { title: "", image: "", href: "/services" }])} className="flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink-soft hover:border-navy hover:text-navy transition-all">
        <Plus size={15} /> Add room category
      </button>
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <div key={`${item.title}-${index}`} className="rounded-2xl border border-line bg-white overflow-hidden">
            {item.image && <img src={item.image} alt={item.title} className="h-32 w-full object-cover" />}
            <div className="p-4 space-y-3">
              <Field label="Category name" value={item.title} onChange={(v) => update(index, { title: v })} placeholder="e.g. Living Room" />
              <AssetPicker label="Photo" value={item.image} onChange={(v) => update(index, { image: v })} />
              <label className="block">
                <span className={labelCls}>Links to which page?</span>
                <select
                  value={item.href}
                  onChange={(e) => update(index, { href: e.target.value })}
                  className={fieldCls}
                >
                  {ROOM_PAGE_OPTIONS.map((opt) => (
                    <option key={opt.href} value={opt.href}>{opt.label}</option>
                  ))}
                  {!ROOM_PAGE_OPTIONS.find((o) => o.href === item.href) && item.href && (
                    <option value={item.href}>{item.href}</option>
                  )}
                </select>
              </label>
              <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className="flex items-center gap-1.5 text-xs font-medium text-brand hover:underline">
                <Trash2 size={12} /> Remove this category
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactEditor({ doc, onChange }: { doc: ContactDetails; onChange: (next: ContactDetails) => void }) {
  const next = structuredClone(doc);
  const socials = doc.socials ?? [];
  return (
    <div className="space-y-4">
      <SectionCard title="Contact Details">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Phone number" value={doc.phone ?? ""} onChange={(v) => { next.phone = v || null; onChange(structuredClone(next)); }} placeholder="+91 98765 43210" />
          <Field label="WhatsApp number" value={doc.whatsapp ?? ""} onChange={(v) => { next.whatsapp = v || null; onChange(structuredClone(next)); }} placeholder="+91 98765 43210" />
          <Field label="Email address" value={doc.email ?? ""} onChange={(v) => { next.email = v || null; onChange(structuredClone(next)); }} placeholder="hello@luxevacare.com" />
          <Field label="Working hours" value={doc.workingHours ?? ""} onChange={(v) => { next.workingHours = v || null; onChange(structuredClone(next)); }} placeholder="Mon–Sat, 9am–7pm" />
          <Field label="Office address" value={doc.address ?? ""} onChange={(v) => { next.address = v || null; onChange(structuredClone(next)); }} multiline />
          <Field label="Google Maps embed URL" value={doc.mapsEmbedUrl ?? ""} onChange={(v) => { next.mapsEmbedUrl = v || null; onChange(structuredClone(next)); }} />
        </div>
      </SectionCard>
      <SectionCard title="Social Media Links">
        <div className="space-y-3">
          {socials.map((item, index) => (
            <div key={`${item.label}-${index}`} className="grid sm:grid-cols-[120px_1fr_auto] gap-3 items-end">
              <Field label="Platform" value={item.label} onChange={(value) => onChange({ ...doc, socials: socials.map((s, i) => i === index ? { ...s, label: value } : s) })} placeholder="Instagram" />
              <Field label="URL" value={item.href} onChange={(value) => onChange({ ...doc, socials: socials.map((s, i) => i === index ? { ...s, href: value } : s) })} placeholder="https://instagram.com/…" />
              <button type="button" onClick={() => onChange({ ...doc, socials: socials.filter((_, i) => i !== index) })} className="rounded-xl border border-line px-3 py-3 text-ink-soft hover:text-brand hover:border-brand transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => onChange({ ...doc, socials: [...socials, { label: "", href: "" }] })} className="flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink-soft hover:border-navy hover:text-navy transition-all">
            <Plus size={14} /> Add social link
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

function FaqEditor({ doc, onChange }: { doc: Faq[]; onChange: (next: Faq[]) => void }) {
  const items = doc ?? [];
  const update = (index: number, patch: Partial<Faq>) => {
    const next = structuredClone(items);
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={`${index}-${item.question}`} className="rounded-xl border border-line bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">FAQ #{index + 1}</p>
            <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className="flex items-center gap-1 text-xs text-brand hover:underline">
              <Trash2 size={12} /> Remove
            </button>
          </div>
          <Field label="Question" value={item.question} onChange={(v) => update(index, { question: v })} />
          <Field label="Answer" value={item.answer} onChange={(v) => update(index, { answer: v })} multiline />
          <Field label="Category (optional)" value={item.category ?? ""} onChange={(v) => update(index, { category: v })} placeholder="e.g. Pricing" />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, { question: "", answer: "", category: "" }])} className="flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink-soft hover:border-navy hover:text-navy transition-all">
        <Plus size={14} /> Add FAQ
      </button>
    </div>
  );
}

function TestimonialEditor({ doc, onChange }: { doc: Testimonial[]; onChange: (next: Testimonial[]) => void }) {
  const items = doc ?? [];
  const update = (index: number, patch: Partial<Testimonial>) => {
    const next = structuredClone(items);
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={`${index}-${item.clientName}`} className="rounded-xl border border-line bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Review #{index + 1}</p>
            <div className="flex items-center gap-3">
              <CheckboxField label="Visible on site" checked={item.published} onChange={(published) => update(index, { published })} />
              <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className="flex items-center gap-1 text-xs text-brand hover:underline">
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Client name" value={item.clientName} onChange={(v) => update(index, { clientName: v })} />
            <Field label="Location / City" value={item.location ?? ""} onChange={(v) => update(index, { location: v })} />
            <Field label="Service type" value={item.serviceType ?? ""} onChange={(v) => update(index, { serviceType: v })} />
            <Field label="Star rating (1–5)" value={String(item.rating ?? 5)} onChange={(v) => update(index, { rating: Math.min(5, Math.max(1, Number(v) || 5)) })} />
          </div>
          <Field label="Review text" value={item.text} onChange={(v) => update(index, { text: v })} multiline />
          <ImageAssetEditor label="Client photo (optional)" asset={item.photo} onChange={(photo) => update(index, { photo })} />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, { clientName: "", rating: 5, text: "", published: true }])} className="flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink-soft hover:border-navy hover:text-navy transition-all">
        <Plus size={14} /> Add testimonial
      </button>
    </div>
  );
}

function ServiceEditor({ doc, onChange }: { doc: Service[]; onChange: (next: Service[]) => void }) {
  const items = doc ?? [];
  const [selected, setSelected] = useState(0);
  const item = items[selected];
  const update = (patch: Partial<Service>) => {
    const next = structuredClone(items);
    next[selected] = { ...next[selected], ...patch };
    onChange(next);
  };
  if (!item) return null;
  return (
    <div className="space-y-4">
      <div>
        <label className={labelCls}>Select service to edit</label>
        <select value={selected} onChange={(e) => setSelected(Number(e.target.value))} className={fieldCls}>
          {items.map((service, index) => <option key={service.slug} value={index}>{service.title}</option>)}
        </select>
      </div>
      <SectionCard title="Basic Details">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Service title" value={item.title} onChange={(v) => update({ title: v })} />
          <Field label="Price text" value={item.priceText ?? ""} onChange={(v) => update({ priceText: v || undefined })} placeholder="e.g. Starts from ₹500/sq.ft" />
          <Field label="Short description" value={item.shortDescription} onChange={(v) => update({ shortDescription: v })} multiline />
          <Field label="Full description" value={item.longDescription} onChange={(v) => update({ longDescription: v })} multiline />
          <Field label="SEO page title" value={item.seoTitle ?? ""} onChange={(v) => update({ seoTitle: v || undefined })} />
          <Field label="SEO description" value={item.seoDescription ?? ""} onChange={(v) => update({ seoDescription: v || undefined })} multiline />
        </div>
        <div className="flex flex-wrap gap-4">
          <CheckboxField label="Featured service" checked={!!item.featured} onChange={(featured) => update({ featured })} />
          <CheckboxField label="Published (visible on site)" checked={!!item.published} onChange={(published) => update({ published })} />
        </div>
      </SectionCard>
      <SectionCard title="Hero Image & Gallery">
        <ImageAssetEditor label="Hero (banner) image" asset={item.heroImage} onChange={(heroImage) => update({ heroImage })} />
        <ImageArrayEditor label="Gallery photos" items={item.gallery ?? []} onChange={(gallery) => update({ gallery })} />
      </SectionCard>
      <SectionCard title="Benefits">
        <TextListEditor label="Key benefits" values={item.benefits ?? []} onChange={(benefits) => update({ benefits })} placeholder="e.g. Durable materials used" />
      </SectionCard>
      <SectionCard title="Our Process">
        <TitledDescriptionListEditor label="Process steps" items={item.process ?? []} onChange={(process) => update({ process })} />
      </SectionCard>
      <SectionCard title="FAQs for this service">
        <FaqEditor doc={item.faqs ?? []} onChange={(faqs) => update({ faqs })} />
      </SectionCard>
    </div>
  );
}

function ProjectEditor({ doc, onChange }: { doc: Project[]; onChange: (next: Project[]) => void }) {
  const items = doc ?? [];
  const [selected, setSelected] = useState(0);
  const item = items[selected];
  const update = (patch: Partial<Project>) => {
    const next = structuredClone(items);
    next[selected] = { ...next[selected], ...patch };
    onChange(next);
  };
  if (!item) return null;
  return (
    <div className="space-y-4">
      <div>
        <label className={labelCls}>Select project to edit</label>
        <select value={selected} onChange={(e) => setSelected(Number(e.target.value))} className={fieldCls}>
          {items.map((project, index) => <option key={project.slug} value={index}>{project.title}</option>)}
        </select>
      </div>
      <SectionCard title="Project Details">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Project title" value={item.title} onChange={(v) => update({ title: v })} />
          <label className="block">
            <span className={labelCls}>Category</span>
            <select value={item.category} onChange={(e) => update({ category: e.target.value as Project["category"] })} className={fieldCls}>
              {["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office", "Full Home", "Commercial"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <Field label="Style" value={item.style ?? ""} onChange={(v) => update({ style: v || undefined })} placeholder="e.g. Contemporary" />
          <Field label="Location / City" value={item.location ?? ""} onChange={(v) => update({ location: v || undefined })} />
          <Field label="Completion info" value={item.completionInfo ?? ""} onChange={(v) => update({ completionInfo: v || undefined })} placeholder="e.g. Completed in 45 days" />
          <Field label="Summary (short)" value={item.summary} onChange={(v) => update({ summary: v })} multiline />
          <Field label="Full description" value={item.description} onChange={(v) => update({ description: v })} multiline />
        </div>
        <div className="flex flex-wrap gap-4">
          <CheckboxField label="Featured project" checked={!!item.featured} onChange={(featured) => update({ featured })} />
          <CheckboxField label="Published (visible on site)" checked={!!item.published} onChange={(published) => update({ published })} />
        </div>
      </SectionCard>
      <SectionCard title="Photos">
        <ImageAssetEditor label="Cover photo" asset={item.cover} onChange={(cover) => update({ cover })} />
        <ImageArrayEditor label="Gallery photos" items={item.gallery ?? []} onChange={(gallery) => update({ gallery })} />
      </SectionCard>
      <SectionCard title="Scope & Materials">
        <TextListEditor label="Scope of work" values={item.scope ?? []} onChange={(scope) => update({ scope })} placeholder="e.g. Full kitchen renovation" />
        <TextListEditor label="Materials used" values={item.materials ?? []} onChange={(materials) => update({ materials })} placeholder="e.g. Italian marble flooring" />
      </SectionCard>
    </div>
  );
}

function LeadershipEditor({ doc, onChange }: { doc: Leader[]; onChange: (next: Leader[]) => void }) {
  const items = doc ?? [];
  const update = (index: number, patch: Partial<Leader>) => {
    const next = structuredClone(items);
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={`${item.name}-${index}`} className="rounded-xl border border-line bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">{item.name || `Team member #${index + 1}`}</p>
            <div className="flex items-center gap-3">
              <CheckboxField label="Visible on site" checked={item.published} onChange={(published) => update(index, { published })} />
              <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className="flex items-center gap-1 text-xs text-brand hover:underline">
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Name" value={item.name} onChange={(v) => update(index, { name: v })} />
            <label className="block">
              <span className={labelCls}>Role / Title</span>
              <select value={item.roleType} onChange={(e) => update(index, { roleType: e.target.value as Leader["roleType"] })} className={fieldCls}>
                {["Founder", "Co-Founder", "CEO", "Director", "Designer", "Project Manager", "Architect", "Other"].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>
          </div>
          <Field label="Bio" value={item.bio} onChange={(v) => update(index, { bio: v })} multiline />
          <TextListEditor label="Areas of expertise" values={item.expertise ?? []} onChange={(expertise) => update(index, { expertise })} />
          <ImageAssetEditor label="Profile photo" asset={item.photo} onChange={(photo) => update(index, { photo })} />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, { name: "", roleType: "Founder", bio: "", published: true }])} className="flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink-soft hover:border-navy hover:text-navy transition-all">
        <Plus size={14} /> Add team member
      </button>
    </div>
  );
}

function StructuredEditor({ keyName, doc, onChange }: { keyName: string; doc: any; onChange: (next: any) => void }) {
  if (keyName === "home") return <HomeEditor doc={doc} onChange={onChange} />;
  if (keyName === "about") return <AboutEditor doc={doc} onChange={onChange} />;
  if (keyName === "roomCategories") return <RoomCategoryEditor doc={doc as RoomCategory[]} onChange={onChange} />;
  if (keyName === "contactDetails") return <ContactEditor doc={doc as ContactDetails} onChange={onChange} />;
  if (keyName === "faqs") return <FaqEditor doc={doc as Faq[]} onChange={onChange} />;
  if (keyName === "testimonials") return <TestimonialEditor doc={doc as Testimonial[]} onChange={onChange} />;
  if (keyName === "services") return <ServiceEditor doc={doc as Service[]} onChange={onChange} />;
  if (keyName === "projects") return <ProjectEditor doc={doc as Project[]} onChange={onChange} />;
  if (keyName === "leadership") return <LeadershipEditor doc={doc as Leader[]} onChange={onChange} />;
  return null;
}

/* ─── Main page ─── */

export default function AdminContentEditor() {
  const { pathname } = useLocation();
  const key = useMemo(() => routeToKey[pathname] ?? "home", [pathname]);
  const [doc, setDoc] = useState<any>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    setDoc(null);
    setStatus("idle");
    const snapshot = getContentSnapshot();
    const defaults: Record<string, unknown> = {
      home: snapshot.home, about: snapshot.about, roomCategories: snapshot.roomCategories,
      services: snapshot.services, projects: snapshot.projects, faqs: snapshot.faqs,
      testimonials: snapshot.testimonials, leadership: snapshot.leadership, contactDetails: snapshot.contactDetails,
    };
    fetch(`/api/admin/content/${key}`, { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data) => setDoc(data.data ?? defaults[key] ?? {}));
  }, [key]);

  async function save() {
    setStatus("saving");
    setStatusMsg("");
    const res = await fetch(`/api/admin/content/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ data: doc }),
    });
    const data = await res.json();
    if (data.ok) {
      setStatus("saved");
      setStatusMsg("Changes saved. The website will update shortly.");
      setTimeout(() => setStatus("idle"), 4000);
    } else {
      setStatus("error");
      setStatusMsg(data.error ?? "Save failed. Please try again.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Content editor</p>
          <h1 className="text-3xl text-ink">{PAGE_LABELS[key] ?? key}</h1>
          <p className="mt-1 text-sm text-ink-soft">{PAGE_DESCRIPTIONS[key] ?? ""}</p>
        </div>
        <button
          onClick={save}
          disabled={!doc || status === "saving"}
          className="flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-dark transition-colors disabled:opacity-60 shadow-soft flex-shrink-0"
        >
          <Save size={16} /> {status === "saving" ? "Saving…" : "Save changes"}
        </button>
      </div>

      {status === "saved" && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle size={15} /> {statusMsg}
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-xl bg-brand-soft border border-brand/20 px-4 py-3 text-sm text-brand">
          <AlertCircle size={15} /> {statusMsg}
        </div>
      )}

      {!doc ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-white border border-line animate-pulse" />)}
        </div>
      ) : (
        <StructuredEditor keyName={key} doc={doc} onChange={setDoc} />
      )}

      {doc && (
        <div className="sticky bottom-4 flex justify-end">
          <button
            onClick={save}
            disabled={status === "saving"}
            className="flex items-center gap-2 rounded-xl bg-navy px-6 py-3.5 text-sm font-semibold text-white hover:bg-navy-dark transition-colors disabled:opacity-60 shadow-lift"
          >
            <Save size={16} /> {status === "saving" ? "Saving…" : "Save all changes"}
          </button>
        </div>
      )}
    </div>
  );
}
