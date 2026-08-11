import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { getContentSnapshot, type RoomCategory } from "@/lib/content";
import type { ContactDetails, Faq, ImageAsset, Leader, Project, Service, Testimonial } from "@/lib/types";
import { AssetPicker } from "@/components/admin/AssetPicker";
import { Modal, ConfirmDialog } from "@/components/admin/Modal";
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

/* ─── Heading helpers ─── */

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
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} className={`${fieldCls} min-h-[100px] resize-y`} placeholder={placeholder} />
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

function ModalActions({ onCancel, onConfirm, confirmLabel = "Add", disabled = false }: {
  onCancel: () => void; onConfirm: () => void; confirmLabel?: string; disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-line">
      <button type="button" onClick={onCancel} className="rounded-xl border border-line px-5 py-2.5 text-sm font-medium text-ink-soft hover:bg-mist transition-colors">
        Cancel
      </button>
      <button type="button" onClick={onConfirm} disabled={disabled} className="rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark transition-colors disabled:opacity-50">
        {confirmLabel}
      </button>
    </div>
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

function RemoveButton({ label, onRemove }: { label: string; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-1 text-xs text-brand hover:underline">
        <Trash2 size={12} /> Remove
      </button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={onRemove}
        title="Confirm removal"
        message={`Are you sure you want to remove this ${label}? This cannot be undone.`}
        confirmLabel="Yes, remove"
        danger
      />
    </>
  );
}

/* ─── ImageAssetEditor (single image, no add/remove) ─── */

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

/* ─── ImageArrayEditor — modal to add, confirm to remove ─── */

function ImageArrayEditor({ label, items, onChange }: { label: string; items: ImageAsset[]; onChange: (next: ImageAsset[]) => void }) {
  const safeItems = items ?? [];
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<ImageAsset>({ src: "", alt: "", isRender: false });

  const update = (index: number, patch: Partial<ImageAsset>) => {
    const next = structuredClone(safeItems);
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  function handleAdd() {
    if (!addForm.src) return;
    onChange([...safeItems, { ...addForm }]);
    setAddForm({ src: "", alt: "", isRender: false });
    setAddOpen(false);
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink">{label} <span className="text-ink-soft font-normal">({safeItems.length})</span></p>
          <button type="button" onClick={() => setAddOpen(true)} className="flex items-center gap-1.5 rounded-xl bg-navy/5 border border-navy/20 px-3 py-2 text-xs font-semibold text-navy hover:bg-navy/10 transition-all">
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
                <RemoveButton label="image" onRemove={() => onChange(safeItems.filter((_, i) => i !== index))} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={`Add image to ${label}`}>
        <div className="space-y-4">
          <AssetPicker label="Choose image" value={addForm.src ?? ""} onChange={(src) => setAddForm((f) => ({ ...f, src }))} />
          {addForm.src && <img src={addForm.src} alt="" className="h-32 w-full object-cover rounded-xl" />}
          <Field label="Alt text (describe what's in the image)" value={addForm.alt ?? ""} onChange={(alt) => setAddForm((f) => ({ ...f, alt }))} placeholder="e.g. Modern living room with designer sofa" />
          <CheckboxField label="This is a design render / 3D visual" checked={!!addForm.isRender} onChange={(isRender) => setAddForm((f) => ({ ...f, isRender }))} />
        </div>
        <ModalActions onCancel={() => setAddOpen(false)} onConfirm={handleAdd} confirmLabel="Add image" disabled={!addForm.src} />
      </Modal>
    </>
  );
}

/* ─── SimpleImagePathListEditor — modal to add, confirm to remove ─── */

function SimpleImagePathListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (next: string[]) => void }) {
  const safeItems = items ?? [];
  const [addOpen, setAddOpen] = useState(false);
  const [addSrc, setAddSrc] = useState("");

  function handleAdd() {
    if (!addSrc) return;
    onChange([...safeItems, addSrc]);
    setAddSrc("");
    setAddOpen(false);
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink">{label}</p>
          <button type="button" onClick={() => setAddOpen(true)} className="flex items-center gap-1.5 rounded-xl bg-navy/5 border border-navy/20 px-3 py-2 text-xs font-semibold text-navy hover:bg-navy/10 transition-all">
            <Plus size={13} /> Add image
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {safeItems.map((item, index) => (
            <div key={`${item}-${index}`} className="space-y-2 rounded-xl border border-line bg-mist/30 p-3">
              {item && <img src={item} alt="" className="h-20 w-full object-cover rounded-lg" />}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <AssetPicker label="" value={item} onChange={(value) => onChange(safeItems.map((e, i) => i === index ? value : e))} />
                </div>
                <RemoveButton label="image" onRemove={() => onChange(safeItems.filter((_, i) => i !== index))} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={`Add image to ${label}`}>
        <div className="space-y-4">
          <AssetPicker label="Choose image" value={addSrc} onChange={setAddSrc} />
          {addSrc && <img src={addSrc} alt="" className="h-32 w-full object-cover rounded-xl" />}
        </div>
        <ModalActions onCancel={() => setAddOpen(false)} onConfirm={handleAdd} confirmLabel="Add image" disabled={!addSrc} />
      </Modal>
    </>
  );
}

/* ─── TitledDescriptionListEditor — modal to add, confirm to remove ─── */

function TitledDescriptionListEditor({ label, items, onChange }: {
  label: string; items: Array<{ title: string; description: string }>;
  onChange: (next: Array<{ title: string; description: string }>) => void;
}) {
  const safeItems = items ?? [];
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ title: "", description: "" });

  function handleAdd() {
    if (!addForm.title) return;
    onChange([...safeItems, { ...addForm }]);
    setAddForm({ title: "", description: "" });
    setAddOpen(false);
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink">{label}</p>
          <button type="button" onClick={() => setAddOpen(true)} className="flex items-center gap-1.5 rounded-xl bg-navy/5 border border-navy/20 px-3 py-2 text-xs font-semibold text-navy hover:bg-navy/10 transition-all">
            <Plus size={13} /> Add item
          </button>
        </div>
        {safeItems.map((item, index) => (
          <div key={`${item.title}-${index}`} className="rounded-xl border border-line bg-mist/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{item.title || `Item ${index + 1}`}</p>
              <RemoveButton label="item" onRemove={() => onChange(safeItems.filter((_, i) => i !== index))} />
            </div>
            <Field label="Title" value={item.title} onChange={(value) => onChange(safeItems.map((e, i) => i === index ? { ...e, title: value } : e))} />
            <Field label="Description" value={item.description} onChange={(value) => onChange(safeItems.map((e, i) => i === index ? { ...e, description: value } : e))} multiline />
          </div>
        ))}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={`Add new ${label.toLowerCase()}`}>
        <div className="space-y-4">
          <Field label="Title" value={addForm.title} onChange={(v) => setAddForm((f) => ({ ...f, title: v }))} placeholder="e.g. Quality Materials" />
          <Field label="Description" value={addForm.description} onChange={(v) => setAddForm((f) => ({ ...f, description: v }))} multiline placeholder="Brief description…" />
        </div>
        <ModalActions onCancel={() => setAddOpen(false)} onConfirm={handleAdd} disabled={!addForm.title} />
      </Modal>
    </>
  );
}

/* ─── StringPairListEditor — modal to add, confirm to remove ─── */

function StringPairListEditor({ label, items, firstLabel, secondLabel, onChange }: {
  label: string; items: Array<{ label: string; value: string }>; firstLabel: string; secondLabel: string;
  onChange: (next: Array<{ label: string; value: string }>) => void;
}) {
  const safeItems = items ?? [];
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ label: "", value: "" });

  function handleAdd() {
    if (!addForm.label && !addForm.value) return;
    onChange([...safeItems, { ...addForm }]);
    setAddForm({ label: "", value: "" });
    setAddOpen(false);
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink">{label}</p>
          <button type="button" onClick={() => setAddOpen(true)} className="flex items-center gap-1.5 rounded-xl bg-navy/5 border border-navy/20 px-3 py-2 text-xs font-semibold text-navy hover:bg-navy/10 transition-all">
            <Plus size={13} /> Add
          </button>
        </div>
        {safeItems.map((item, index) => (
          <div key={`${item.label}-${index}`} className="grid sm:grid-cols-2 gap-3 rounded-xl border border-line bg-mist/30 p-4">
            <Field label={firstLabel} value={item.label} onChange={(value) => onChange(safeItems.map((e, i) => i === index ? { ...e, label: value } : e))} />
            <Field label={secondLabel} value={item.value} onChange={(value) => onChange(safeItems.map((e, i) => i === index ? { ...e, value } : e))} />
            <div className="sm:col-span-2 flex justify-end">
              <RemoveButton label="item" onRemove={() => onChange(safeItems.filter((_, i) => i !== index))} />
            </div>
          </div>
        ))}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={`Add to ${label}`}>
        <div className="space-y-4">
          <Field label={firstLabel} value={addForm.label} onChange={(v) => setAddForm((f) => ({ ...f, label: v }))} placeholder="e.g. 500+" />
          <Field label={secondLabel} value={addForm.value} onChange={(v) => setAddForm((f) => ({ ...f, value: v }))} placeholder="e.g. Projects completed" />
        </div>
        <ModalActions onCancel={() => setAddOpen(false)} onConfirm={handleAdd} disabled={!addForm.label && !addForm.value} />
      </Modal>
    </>
  );
}

/* ─── TextListEditor — stays as textarea but add hint ─── */

function TextListEditor({ label, values, onChange, placeholder = "" }: { label: string; values: string[]; onChange: (next: string[]) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className={labelCls}>{label} <span className="text-ink-soft font-normal">(one per line)</span></span>
      <textarea
        value={values.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n").map((item) => item.trim()).filter(Boolean))}
        className={`${fieldCls} min-h-[100px] resize-y`}
        placeholder={placeholder}
      />
    </label>
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
          <Field label="Sub-heading" value={doc.hero?.subheading ?? ""} onChange={(v) => update(["hero", "subheading"], v)} multiline placeholder="A brief description of your services…" />
        </div>
        <ImageArrayEditor label="Slideshow images" items={doc.hero?.images ?? []} onChange={(v) => update(["hero", "images"], v)} />
        <StringPairListEditor label="Stats strip" items={doc.hero?.stats ?? []} firstLabel="Number / Label (e.g. 500+)" secondLabel="Description (e.g. Projects)" onChange={(v) => update(["hero", "stats"], v)} />
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
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<RoomCategory>({ title: "", image: "", href: "/services/living-room" });

  const update = (index: number, patch: Partial<RoomCategory>) => {
    const next = structuredClone(items);
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  function handleAdd() {
    if (!addForm.title) return;
    onChange([...items, { ...addForm }]);
    setAddForm({ title: "", image: "", href: "/services/living-room" });
    setAddOpen(false);
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <button type="button" onClick={() => setAddOpen(true)} className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark transition-all shadow-soft">
            <Plus size={15} /> Add room category
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((item, index) => (
            <div key={`${item.title}-${index}`} className="rounded-2xl border border-line bg-white overflow-hidden">
              {item.image && <img src={item.image} alt={item.title} className="h-32 w-full object-cover" />}
              <div className="p-4 space-y-3">
                <Field label="Category name" value={item.title} onChange={(v) => update(index, { title: v })} placeholder="e.g. Living Room" />
                <AssetPicker label="Photo" value={item.image} onChange={(v) => update(index, { image: v })} />
                <label className="block">
                  <span className={labelCls}>Links to which page?</span>
                  <select value={item.href} onChange={(e) => update(index, { href: e.target.value })} className={fieldCls}>
                    {ROOM_PAGE_OPTIONS.map((opt) => <option key={opt.href} value={opt.href}>{opt.label}</option>)}
                    {!ROOM_PAGE_OPTIONS.find((o) => o.href === item.href) && item.href && (
                      <option value={item.href}>{item.href}</option>
                    )}
                  </select>
                </label>
                <div className="flex justify-end">
                  <RemoveButton label="room category" onRemove={() => onChange(items.filter((_, i) => i !== index))} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add room category">
        <div className="space-y-4">
          <Field label="Category name" value={addForm.title} onChange={(v) => setAddForm((f) => ({ ...f, title: v }))} placeholder="e.g. Living Room" />
          <AssetPicker label="Photo" value={addForm.image} onChange={(v) => setAddForm((f) => ({ ...f, image: v }))} />
          {addForm.image && <img src={addForm.image} alt="" className="h-28 w-full object-cover rounded-xl" />}
          <label className="block">
            <span className={labelCls}>Links to which service page?</span>
            <select value={addForm.href} onChange={(e) => setAddForm((f) => ({ ...f, href: e.target.value }))} className={fieldCls}>
              {ROOM_PAGE_OPTIONS.map((opt) => <option key={opt.href} value={opt.href}>{opt.label}</option>)}
            </select>
          </label>
        </div>
        <ModalActions onCancel={() => setAddOpen(false)} onConfirm={handleAdd} confirmLabel="Add category" disabled={!addForm.title} />
      </Modal>
    </>
  );
}

function ContactEditor({ doc, onChange }: { doc: ContactDetails; onChange: (next: ContactDetails) => void }) {
  const next = structuredClone(doc);
  const socials = doc.socials ?? [];
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ label: "", href: "" });

  function handleAddSocial() {
    if (!addForm.label || !addForm.href) return;
    onChange({ ...doc, socials: [...socials, { ...addForm }] });
    setAddForm({ label: "", href: "" });
    setAddOpen(false);
  }

  return (
    <>
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
              <div key={`${item.label}-${index}`} className="grid sm:grid-cols-[140px_1fr_auto] gap-3 items-end">
                <Field label="Platform" value={item.label} onChange={(value) => onChange({ ...doc, socials: socials.map((s, i) => i === index ? { ...s, label: value } : s) })} placeholder="Instagram" />
                <Field label="URL" value={item.href} onChange={(value) => onChange({ ...doc, socials: socials.map((s, i) => i === index ? { ...s, href: value } : s) })} placeholder="https://instagram.com/…" />
                <div className="pb-0.5">
                  <RemoveButton label="social link" onRemove={() => onChange({ ...doc, socials: socials.filter((_, i) => i !== index) })} />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setAddOpen(true)} className="flex items-center gap-2 rounded-xl bg-navy/5 border border-navy/20 px-4 py-2.5 text-sm font-semibold text-navy hover:bg-navy/10 transition-all">
              <Plus size={14} /> Add social link
            </button>
          </div>
        </SectionCard>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add social media link">
        <div className="space-y-4">
          <Field label="Platform name" value={addForm.label} onChange={(v) => setAddForm((f) => ({ ...f, label: v }))} placeholder="e.g. Instagram" />
          <Field label="URL" value={addForm.href} onChange={(v) => setAddForm((f) => ({ ...f, href: v }))} placeholder="https://instagram.com/luxevacare" />
        </div>
        <ModalActions onCancel={() => setAddOpen(false)} onConfirm={handleAddSocial} confirmLabel="Add link" disabled={!addForm.label || !addForm.href} />
      </Modal>
    </>
  );
}

function FaqEditor({ doc, onChange }: { doc: Faq[]; onChange: (next: Faq[]) => void }) {
  const items = doc ?? [];
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ question: "", answer: "", category: "" });

  const update = (index: number, patch: Partial<Faq>) => {
    const next = structuredClone(items);
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  function handleAdd() {
    if (!addForm.question || !addForm.answer) return;
    onChange([...items, { ...addForm }]);
    setAddForm({ question: "", answer: "", category: "" });
    setAddOpen(false);
  }

  return (
    <>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${index}-${item.question}`} className="rounded-xl border border-line bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">FAQ #{index + 1}</p>
              <RemoveButton label="FAQ" onRemove={() => onChange(items.filter((_, i) => i !== index))} />
            </div>
            <Field label="Question" value={item.question} onChange={(v) => update(index, { question: v })} />
            <Field label="Answer" value={item.answer} onChange={(v) => update(index, { answer: v })} multiline />
            <Field label="Category (optional)" value={item.category ?? ""} onChange={(v) => update(index, { category: v })} placeholder="e.g. Pricing" />
          </div>
        ))}
        <button type="button" onClick={() => setAddOpen(true)} className="flex items-center gap-2 rounded-xl bg-navy/5 border border-navy/20 px-4 py-2.5 text-sm font-semibold text-navy hover:bg-navy/10 transition-all">
          <Plus size={14} /> Add FAQ
        </button>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add new FAQ">
        <div className="space-y-4">
          <Field label="Question" value={addForm.question} onChange={(v) => setAddForm((f) => ({ ...f, question: v }))} placeholder="e.g. How long does a bedroom makeover take?" />
          <Field label="Answer" value={addForm.answer} onChange={(v) => setAddForm((f) => ({ ...f, answer: v }))} multiline placeholder="Type your answer here…" />
          <Field label="Category (optional)" value={addForm.category} onChange={(v) => setAddForm((f) => ({ ...f, category: v }))} placeholder="e.g. Pricing" />
        </div>
        <ModalActions onCancel={() => setAddOpen(false)} onConfirm={handleAdd} confirmLabel="Add FAQ" disabled={!addForm.question || !addForm.answer} />
      </Modal>
    </>
  );
}

function TestimonialEditor({ doc, onChange }: { doc: Testimonial[]; onChange: (next: Testimonial[]) => void }) {
  const items = doc ?? [];
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ clientName: "", text: "", rating: 5, location: "", serviceType: "" });

  const update = (index: number, patch: Partial<Testimonial>) => {
    const next = structuredClone(items);
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  function handleAdd() {
    if (!addForm.clientName || !addForm.text) return;
    onChange([...items, { ...addForm, published: true }]);
    setAddForm({ clientName: "", text: "", rating: 5, location: "", serviceType: "" });
    setAddOpen(false);
  }

  return (
    <>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${index}-${item.clientName}`} className="rounded-xl border border-line bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">{item.clientName || `Review #${index + 1}`}</p>
              <div className="flex items-center gap-3">
                <CheckboxField label="Visible on site" checked={item.published} onChange={(published) => update(index, { published })} />
                <RemoveButton label="testimonial" onRemove={() => onChange(items.filter((_, i) => i !== index))} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Client name" value={item.clientName} onChange={(v) => update(index, { clientName: v })} />
              <Field label="Location / City" value={item.location ?? ""} onChange={(v) => update(index, { location: v })} />
              <Field label="Service type" value={item.serviceType ?? ""} onChange={(v) => update(index, { serviceType: v })} />
              <label className="block">
                <span className={labelCls}>Star rating</span>
                <select value={item.rating ?? 5} onChange={(e) => update(index, { rating: Number(e.target.value) })} className={fieldCls}>
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} star{r !== 1 ? "s" : ""}</option>)}
                </select>
              </label>
            </div>
            <Field label="Review text" value={item.text} onChange={(v) => update(index, { text: v })} multiline />
            <ImageAssetEditor label="Client photo (optional)" asset={item.photo} onChange={(photo) => update(index, { photo })} />
          </div>
        ))}
        <button type="button" onClick={() => setAddOpen(true)} className="flex items-center gap-2 rounded-xl bg-navy/5 border border-navy/20 px-4 py-2.5 text-sm font-semibold text-navy hover:bg-navy/10 transition-all">
          <Plus size={14} /> Add testimonial
        </button>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add customer review" maxWidth="max-w-xl">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Client name" value={addForm.clientName} onChange={(v) => setAddForm((f) => ({ ...f, clientName: v }))} placeholder="e.g. Priya Sharma" />
            <Field label="Location / City" value={addForm.location} onChange={(v) => setAddForm((f) => ({ ...f, location: v }))} placeholder="e.g. Bengaluru" />
            <Field label="Service type" value={addForm.serviceType} onChange={(v) => setAddForm((f) => ({ ...f, serviceType: v }))} placeholder="e.g. Full home interior" />
            <label className="block">
              <span className={labelCls}>Star rating</span>
              <select value={addForm.rating} onChange={(e) => setAddForm((f) => ({ ...f, rating: Number(e.target.value) }))} className={fieldCls}>
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} star{r !== 1 ? "s" : ""}</option>)}
              </select>
            </label>
          </div>
          <Field label="Review text" value={addForm.text} onChange={(v) => setAddForm((f) => ({ ...f, text: v }))} multiline placeholder="What the client said about their experience…" />
        </div>
        <ModalActions onCancel={() => setAddOpen(false)} onConfirm={handleAdd} confirmLabel="Add review" disabled={!addForm.clientName || !addForm.text} />
      </Modal>
    </>
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
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", roleType: "Founder" as Leader["roleType"], bio: "" });

  const update = (index: number, patch: Partial<Leader>) => {
    const next = structuredClone(items);
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  function handleAdd() {
    if (!addForm.name) return;
    onChange([...items, { ...addForm, published: true }]);
    setAddForm({ name: "", roleType: "Founder", bio: "" });
    setAddOpen(false);
  }

  return (
    <>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${item.name}-${index}`} className="rounded-xl border border-line bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">{item.name || `Team member #${index + 1}`}</p>
              <div className="flex items-center gap-3">
                <CheckboxField label="Visible on site" checked={item.published} onChange={(published) => update(index, { published })} />
                <RemoveButton label="team member" onRemove={() => onChange(items.filter((_, i) => i !== index))} />
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
        <button type="button" onClick={() => setAddOpen(true)} className="flex items-center gap-2 rounded-xl bg-navy/5 border border-navy/20 px-4 py-2.5 text-sm font-semibold text-navy hover:bg-navy/10 transition-all">
          <Plus size={14} /> Add team member
        </button>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add team member">
        <div className="space-y-4">
          <Field label="Full name" value={addForm.name} onChange={(v) => setAddForm((f) => ({ ...f, name: v }))} placeholder="e.g. Priya Sharma" />
          <label className="block">
            <span className={labelCls}>Role / Title</span>
            <select value={addForm.roleType} onChange={(e) => setAddForm((f) => ({ ...f, roleType: e.target.value as Leader["roleType"] }))} className={fieldCls}>
              {["Founder", "Co-Founder", "CEO", "Director", "Designer", "Project Manager", "Architect", "Other"].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>
          <Field label="Bio" value={addForm.bio} onChange={(v) => setAddForm((f) => ({ ...f, bio: v }))} multiline placeholder="Brief description of their background and role…" />
        </div>
        <ModalActions onCancel={() => setAddOpen(false)} onConfirm={handleAdd} confirmLabel="Add member" disabled={!addForm.name} />
      </Modal>
    </>
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
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

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
      setStatusMsg("Changes saved successfully. The website will update shortly.");
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
          onClick={() => setSaveConfirmOpen(true)}
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
            onClick={() => setSaveConfirmOpen(true)}
            disabled={status === "saving"}
            className="flex items-center gap-2 rounded-xl bg-navy px-6 py-3.5 text-sm font-semibold text-white hover:bg-navy-dark transition-colors disabled:opacity-60 shadow-lift"
          >
            <Save size={16} /> {status === "saving" ? "Saving…" : "Save all changes"}
          </button>
        </div>
      )}

      <ConfirmDialog
        open={saveConfirmOpen}
        onClose={() => setSaveConfirmOpen(false)}
        onConfirm={save}
        title="Save changes to website"
        message={`This will publish your changes to the live website immediately. Are you sure you want to save the ${PAGE_LABELS[key] ?? "content"}?`}
        confirmLabel="Yes, save & publish"
      />
    </div>
  );
}
