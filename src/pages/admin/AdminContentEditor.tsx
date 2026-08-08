import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getContentSnapshot, type RoomCategory } from "@/lib/content";
import type { ContactDetails, Faq, ImageAsset, Leader, Project, Service, Testimonial } from "@/lib/types";
import { AssetPicker } from "@/components/admin/AssetPicker";

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

export default function AdminContentEditor() {
  const { pathname } = useLocation();
  const key = useMemo(() => routeToKey[pathname] ?? "home", [pathname]);
  const [doc, setDoc] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [showRaw, setShowRaw] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const snapshot = getContentSnapshot();
    const defaults = {
      home: snapshot.home,
      about: snapshot.about,
      roomCategories: snapshot.roomCategories,
      services: snapshot.services,
      projects: snapshot.projects,
      faqs: snapshot.faqs,
      testimonials: snapshot.testimonials,
      leadership: snapshot.leadership,
      contactDetails: snapshot.contactDetails,
    } as Record<string, unknown>;
    fetch(`/api/admin/content/${key}`, { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data) => {
        const next = data.data ?? defaults[key] ?? {};
        setDoc(next);
        setText(JSON.stringify(next, null, 2));
      });
  }, [key]);

  useEffect(() => {
    if (!doc || showRaw) return;
    setText(JSON.stringify(doc, null, 2));
  }, [doc, showRaw]);

  async function save() {
    setStatus("");
    let parsed: unknown = doc;
    if (showRaw) {
      try {
        parsed = JSON.parse(text);
        setDoc(parsed);
      } catch {
        setStatus("Invalid JSON");
        return;
      }
    }
    const res = await fetch(`/api/admin/content/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ data: parsed }),
    });
    const data = await res.json();
    setStatus(data.ok ? "Saved. Public pages will reflect this data." : data.error ?? "Save failed");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Content editor</p>
        <h1 className="text-3xl">{key}</h1>
        <p className="mt-2 text-sm text-ink-soft">Edit the structured content that powers the public site.</p>
      </div>
      <div className="rounded-2xl bg-white border border-line p-6">
        {!doc ? (
          <p className="text-sm text-ink-soft">Loading…</p>
        ) : (
          <>
            <StructuredEditor keyName={key} doc={doc} onChange={setDoc} />
            <div className="mt-6 border-t border-line pt-6">
              <button type="button" onClick={() => setShowRaw((v) => !v)} className="rounded-full border border-line px-4 py-2 text-sm">
                {showRaw ? "Hide raw JSON" : "Show raw JSON"}
              </button>
              {showRaw ? (
                <textarea value={text} onChange={(e) => setText(e.target.value)} className="mt-4 min-h-[520px] w-full rounded-xl border border-line px-4 py-3 font-mono text-sm" spellCheck={false} />
              ) : null}
            </div>
          </>
        )}
        <div className="mt-4 flex items-center gap-3">
          <button onClick={save} className="rounded-full bg-brand px-5 py-3 text-white font-semibold">Save</button>
          {status ? <p className="text-sm text-ink-soft">{status}</p> : null}
        </div>
      </div>
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

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 min-h-[120px] w-full rounded-xl border border-line px-4 py-3" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-xl border border-line px-4 py-3" />
      )}
    </label>
  );
}

function CheckboxField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function TextListEditor({ label, values, onChange }: { label: string; values: string[]; onChange: (next: string[]) => void }) {
  return (
    <Field
      label={label}
      value={values.join("\n")}
      onChange={(value) => onChange(value.split("\n").map((item) => item.trim()).filter(Boolean))}
      multiline
    />
  );
}

function ImageAssetEditor({
  label,
  asset,
  onChange,
}: {
  label: string;
  asset: ImageAsset | undefined;
  onChange: (next: ImageAsset) => void;
}) {
  const next = asset ?? { src: "", alt: "" };
  return (
    <div className="space-y-3 rounded-2xl border border-line p-4">
      <h3 className="text-sm font-semibold">{label}</h3>
      <AssetPicker label="Image path" value={next.src ?? ""} onChange={(src) => onChange({ ...next, src })} />
      <Field label="Alt text" value={next.alt ?? ""} onChange={(alt) => onChange({ ...next, alt })} />
      <CheckboxField label="This is a design render" checked={!!next.isRender} onChange={(isRender) => onChange({ ...next, isRender })} />
    </div>
  );
}

function ImageArrayEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: ImageAsset[];
  onChange: (next: ImageAsset[]) => void;
}) {
  const safeItems = items ?? [];
  const update = (index: number, patch: Partial<ImageAsset>) => {
    const next = structuredClone(safeItems);
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-line p-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold">{label}</h3>
        <button type="button" onClick={() => onChange([...safeItems, { src: "", alt: "" }])} className="rounded-full border border-line px-4 py-2 text-sm">
          Add image
        </button>
      </div>
      {safeItems.map((item, index) => (
        <div key={`${item.src}-${index}`} className="space-y-3 rounded-xl border border-line p-4">
          <AssetPicker label={`Image ${index + 1} path`} value={item.src ?? ""} onChange={(src) => update(index, { src })} />
          <Field label="Alt text" value={item.alt ?? ""} onChange={(alt) => update(index, { alt })} />
          <CheckboxField label="This is a design render" checked={!!item.isRender} onChange={(isRender) => update(index, { isRender })} />
          <button type="button" onClick={() => onChange(safeItems.filter((_, itemIndex) => itemIndex !== index))} className="rounded-full border border-line px-4 py-2 text-sm">
            Remove image
          </button>
        </div>
      ))}
    </div>
  );
}

function HomeEditor({ doc, onChange }: { doc: any; onChange: (next: any) => void }) {
  const update = (path: string[], value: unknown) => {
    const next = structuredClone(doc);
    let cursor = next;
    for (let i = 0; i < path.length - 1; i++) cursor = cursor[path[i]];
    cursor[path[path.length - 1]] = value;
    onChange(next);
  };
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Hero eyebrow" value={doc.hero?.eyebrow ?? ""} onChange={(v) => update(["hero", "eyebrow"], v)} />
        <Field label="Hero heading (HTML allowed)" value={doc.hero?.heading ?? ""} onChange={(v) => update(["hero", "heading"], v)} multiline />
        <Field label="Hero subheading" value={doc.hero?.subheading ?? ""} onChange={(v) => update(["hero", "subheading"], v)} multiline />
        <Field label="About preview eyebrow" value={doc.aboutPreview?.eyebrow ?? ""} onChange={(v) => update(["aboutPreview", "eyebrow"], v)} />
        <Field label="About preview title" value={doc.aboutPreview?.title ?? ""} onChange={(v) => update(["aboutPreview", "title"], v)} />
        <Field label="About preview body" value={doc.aboutPreview?.body ?? ""} onChange={(v) => update(["aboutPreview", "body"], v)} multiline />
      </div>
      <AssetPicker label="About preview image" value={doc.aboutPreview?.image ?? ""} onChange={(v) => update(["aboutPreview", "image"], v)} />
      <TextListEditor label="Trust strip (one per line)" values={doc.trustStrip ?? []} onChange={(v) => update(["trustStrip"], v)} />
      <ImageArrayEditor label="Hero slideshow images" items={doc.hero?.images ?? []} onChange={(v) => update(["hero", "images"], v)} />
      <StringPairListEditor
        label="Hero stats"
        items={doc.hero?.stats ?? []}
        firstLabel="Stat label"
        secondLabel="Stat value"
        onChange={(v) => update(["hero", "stats"], v)}
      />
      <TitledDescriptionListEditor label="Why choose items" items={doc.whyChoose ?? []} onChange={(v) => update(["whyChoose"], v)} />
      <TitledDescriptionListEditor label="Design process" items={doc.designProcess ?? []} onChange={(v) => update(["designProcess"], v)} />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Materials eyebrow" value={doc.materials?.eyebrow ?? ""} onChange={(v) => update(["materials", "eyebrow"], v)} />
        <Field label="Materials title" value={doc.materials?.title ?? ""} onChange={(v) => update(["materials", "title"], v)} />
        <Field label="Materials body" value={doc.materials?.body ?? ""} onChange={(v) => update(["materials", "body"], v)} multiline />
      </div>
      <SimpleImagePathListEditor label="Materials images" items={doc.materials?.images ?? []} onChange={(v) => update(["materials", "images"], v)} />
    </div>
  );
}

function AboutEditor({ doc, onChange }: { doc: any; onChange: (next: any) => void }) {
  const next = structuredClone(doc);
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Field label="Intro" value={doc.intro ?? ""} onChange={(v) => { next.intro = v; onChange(structuredClone(next)); }} multiline />
      <Field label="Story" value={doc.story ?? ""} onChange={(v) => { next.story = v; onChange(structuredClone(next)); }} multiline />
      <Field label="Mission" value={doc.mission ?? ""} onChange={(v) => { next.mission = v; onChange(structuredClone(next)); }} multiline />
      <Field label="Vision" value={doc.vision ?? ""} onChange={(v) => { next.vision = v; onChange(structuredClone(next)); }} multiline />
      <AssetPicker label="About image" value={doc.image ?? ""} onChange={(v) => { next.image = v; onChange(structuredClone(next)); }} />
      <TextListEditor label="Values (one per line)" values={doc.values ?? []} onChange={(v) => { next.values = v; onChange(structuredClone(next)); }} />
      <TextListEditor label="Expertise (one per line)" values={doc.expertise ?? []} onChange={(v) => { next.expertise = v; onChange(structuredClone(next)); }} />
    </div>
  );
}

function RoomCategoryEditor({ doc, onChange }: { doc: RoomCategory[]; onChange: (next: RoomCategory[]) => void }) {
  const items = doc ?? [];
  const update = (index: number, patch: Partial<RoomCategory>) => {
    const next = structuredClone(items);
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };
  return (
    <div className="space-y-4">
      <button type="button" onClick={() => onChange([...items, { title: "", image: "", href: "/services" }])} className="rounded-full border border-line px-4 py-2 text-sm">
        Add room category
      </button>
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} className="space-y-4 rounded-2xl border border-line p-4">
          <Field label="Title" value={item.title} onChange={(v) => update(index, { title: v })} />
          <Field label="Link href" value={item.href} onChange={(v) => update(index, { href: v })} />
          <AssetPicker label="Image path" value={item.image} onChange={(v) => update(index, { image: v })} />
          <button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} className="rounded-full border border-line px-4 py-2 text-sm">
            Remove category
          </button>
        </div>
      ))}
    </div>
  );
}

function ContactEditor({ doc, onChange }: { doc: ContactDetails; onChange: (next: ContactDetails) => void }) {
  const next = structuredClone(doc);
  const socials = doc.socials ?? [];
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Phone" value={doc.phone ?? ""} onChange={(v) => { next.phone = v || null; onChange(structuredClone(next)); }} />
        <Field label="WhatsApp" value={doc.whatsapp ?? ""} onChange={(v) => { next.whatsapp = v || null; onChange(structuredClone(next)); }} />
        <Field label="Email" value={doc.email ?? ""} onChange={(v) => { next.email = v || null; onChange(structuredClone(next)); }} />
        <Field label="Working hours" value={doc.workingHours ?? ""} onChange={(v) => { next.workingHours = v || null; onChange(structuredClone(next)); }} />
        <Field label="Address" value={doc.address ?? ""} onChange={(v) => { next.address = v || null; onChange(structuredClone(next)); }} multiline />
        <Field label="Google Maps embed URL" value={doc.mapsEmbedUrl ?? ""} onChange={(v) => { next.mapsEmbedUrl = v || null; onChange(structuredClone(next)); }} multiline />
      </div>
      <div className="space-y-4 rounded-2xl border border-line p-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm font-semibold">Social links</h3>
          <button type="button" onClick={() => onChange({ ...doc, socials: [...socials, { label: "", href: "" }] })} className="rounded-full border border-line px-4 py-2 text-sm">
            Add social link
          </button>
        </div>
        {socials.map((item, index) => (
          <div key={`${item.label}-${index}`} className="grid md:grid-cols-[1fr_2fr_auto] gap-3">
            <Field label="Label" value={item.label} onChange={(value) => onChange({ ...doc, socials: socials.map((social, socialIndex) => socialIndex === index ? { ...social, label: value } : social) })} />
            <Field label="URL" value={item.href} onChange={(value) => onChange({ ...doc, socials: socials.map((social, socialIndex) => socialIndex === index ? { ...social, href: value } : social) })} />
            <button type="button" onClick={() => onChange({ ...doc, socials: socials.filter((_, socialIndex) => socialIndex !== index) })} className="self-end rounded-full border border-line px-4 py-2 text-sm">
              Remove
            </button>
          </div>
        ))}
      </div>
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
    <div className="space-y-4">
      <button type="button" onClick={() => onChange([...items, { question: "", answer: "", category: "" }])} className="rounded-full border border-line px-4 py-2 text-sm">
        Add FAQ
      </button>
      {items.map((item, index) => (
        <div key={`${index}-${item.question}`} className="rounded-xl border border-line p-4 space-y-3">
          <Field label="Question" value={item.question} onChange={(v) => update(index, { question: v })} />
          <Field label="Answer" value={item.answer} onChange={(v) => update(index, { answer: v })} multiline />
          <Field label="Category" value={item.category ?? ""} onChange={(v) => update(index, { category: v })} />
        </div>
      ))}
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
    <div className="space-y-4">
      <button type="button" onClick={() => onChange([...items, { clientName: "", rating: 5, text: "", published: true }])} className="rounded-full border border-line px-4 py-2 text-sm">
        Add testimonial
      </button>
      {items.map((item, index) => (
        <div key={`${index}-${item.clientName}`} className="rounded-xl border border-line p-4 space-y-3">
          <Field label="Client name" value={item.clientName} onChange={(v) => update(index, { clientName: v })} />
          <Field label="Location" value={item.location ?? ""} onChange={(v) => update(index, { location: v })} />
          <Field label="Service type" value={item.serviceType ?? ""} onChange={(v) => update(index, { serviceType: v })} />
          <Field label="Rating" value={String(item.rating ?? 5)} onChange={(v) => update(index, { rating: Number(v) || 5 })} />
          <Field label="Review text" value={item.text} onChange={(v) => update(index, { text: v })} multiline />
          <ImageAssetEditor label="Client photo" asset={item.photo} onChange={(photo) => update(index, { photo })} />
          <CheckboxField label="Published" checked={item.published} onChange={(published) => update(index, { published })} />
        </div>
      ))}
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
      <select value={selected} onChange={(e) => setSelected(Number(e.target.value))} className="rounded-xl border border-line px-4 py-3">
        {items.map((service, index) => <option key={service.slug} value={index}>{service.title}</option>)}
      </select>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Title" value={item.title} onChange={(v) => update({ title: v })} />
        <Field label="Slug" value={item.slug} onChange={() => {}} />
        <Field label="Category" value={item.category} onChange={(v) => update({ category: v as Service["category"] })} />
        <Field label="Price text" value={item.priceText ?? ""} onChange={(v) => update({ priceText: v || undefined })} />
        <Field label="SEO title" value={item.seoTitle ?? ""} onChange={(v) => update({ seoTitle: v || undefined })} />
        <Field label="SEO description" value={item.seoDescription ?? ""} onChange={(v) => update({ seoDescription: v || undefined })} multiline />
        <Field label="Short description" value={item.shortDescription} onChange={(v) => update({ shortDescription: v })} multiline />
        <Field label="Long description" value={item.longDescription} onChange={(v) => update({ longDescription: v })} multiline />
      </div>
      <ImageAssetEditor label="Hero image" asset={item.heroImage} onChange={(heroImage) => update({ heroImage })} />
      <ImageArrayEditor label="Gallery images" items={item.gallery ?? []} onChange={(gallery) => update({ gallery })} />
      <TextListEditor label="Benefits (one per line)" values={item.benefits ?? []} onChange={(benefits) => update({ benefits })} />
      <TitledDescriptionListEditor label="Process steps" items={item.process ?? []} onChange={(process) => update({ process })} />
      <FaqEditor doc={item.faqs ?? []} onChange={(faqs) => update({ faqs })} />
      <div className="flex flex-wrap gap-4">
        <CheckboxField label="Featured" checked={!!item.featured} onChange={(featured) => update({ featured })} />
        <CheckboxField label="Published" checked={!!item.published} onChange={(published) => update({ published })} />
      </div>
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
      <select value={selected} onChange={(e) => setSelected(Number(e.target.value))} className="rounded-xl border border-line px-4 py-3">
        {items.map((project, index) => <option key={project.slug} value={index}>{project.title}</option>)}
      </select>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Title" value={item.title} onChange={(v) => update({ title: v })} />
        <Field label="Category" value={item.category} onChange={(v) => update({ category: v as Project["category"] })} />
        <Field label="Summary" value={item.summary} onChange={(v) => update({ summary: v })} multiline />
        <Field label="Description" value={item.description} onChange={(v) => update({ description: v })} multiline />
        <Field label="Style" value={item.style ?? ""} onChange={(v) => update({ style: v || undefined })} />
        <Field label="Location" value={item.location ?? ""} onChange={(v) => update({ location: v || undefined })} />
        <Field label="Completion info" value={item.completionInfo ?? ""} onChange={(v) => update({ completionInfo: v || undefined })} />
      </div>
      <ImageAssetEditor label="Cover image" asset={item.cover} onChange={(cover) => update({ cover })} />
      <ImageArrayEditor label="Gallery images" items={item.gallery ?? []} onChange={(gallery) => update({ gallery })} />
      <TextListEditor label="Scope items (one per line)" values={item.scope ?? []} onChange={(scope) => update({ scope })} />
      <TextListEditor label="Materials (one per line)" values={item.materials ?? []} onChange={(materials) => update({ materials })} />
      <div className="flex flex-wrap gap-4">
        <CheckboxField label="Featured" checked={!!item.featured} onChange={(featured) => update({ featured })} />
        <CheckboxField label="Published" checked={!!item.published} onChange={(published) => update({ published })} />
      </div>
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
    <div className="space-y-4">
      <button type="button" onClick={() => onChange([...items, { name: "", roleType: "Founder", bio: "", published: true }])} className="rounded-full border border-line px-4 py-2 text-sm">
        Add leader
      </button>
      {items.map((item, index) => (
        <div key={`${item.name}-${index}`} className="rounded-xl border border-line p-4 space-y-3">
          <Field label="Name" value={item.name} onChange={(v) => update(index, { name: v })} />
          <Field label="Role type" value={item.roleType} onChange={(v) => update(index, { roleType: v as Leader["roleType"] })} />
          <Field label="Bio" value={item.bio} onChange={(v) => update(index, { bio: v })} multiline />
          <TextListEditor label="Expertise (one per line)" values={item.expertise ?? []} onChange={(expertise) => update(index, { expertise })} />
          <ImageAssetEditor label="Profile photo" asset={item.photo} onChange={(photo) => update(index, { photo })} />
          <CheckboxField label="Published" checked={item.published} onChange={(published) => update(index, { published })} />
        </div>
      ))}
    </div>
  );
}

function TitledDescriptionListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: Array<{ title: string; description: string }>;
  onChange: (next: Array<{ title: string; description: string }>) => void;
}) {
  const safeItems = items ?? [];
  return (
    <div className="space-y-4 rounded-2xl border border-line p-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold">{label}</h3>
        <button type="button" onClick={() => onChange([...safeItems, { title: "", description: "" }])} className="rounded-full border border-line px-4 py-2 text-sm">
          Add item
        </button>
      </div>
      {safeItems.map((item, index) => (
        <div key={`${item.title}-${index}`} className="grid md:grid-cols-2 gap-4 rounded-xl border border-line p-4">
          <Field label="Title" value={item.title} onChange={(value) => onChange(safeItems.map((entry, entryIndex) => entryIndex === index ? { ...entry, title: value } : entry))} />
          <Field label="Description" value={item.description} onChange={(value) => onChange(safeItems.map((entry, entryIndex) => entryIndex === index ? { ...entry, description: value } : entry))} multiline />
        </div>
      ))}
    </div>
  );
}

function StringPairListEditor({
  label,
  items,
  firstLabel,
  secondLabel,
  onChange,
}: {
  label: string;
  items: Array<{ label: string; value: string }>;
  firstLabel: string;
  secondLabel: string;
  onChange: (next: Array<{ label: string; value: string }>) => void;
}) {
  const safeItems = items ?? [];
  return (
    <div className="space-y-4 rounded-2xl border border-line p-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold">{label}</h3>
        <button type="button" onClick={() => onChange([...safeItems, { label: "", value: "" }])} className="rounded-full border border-line px-4 py-2 text-sm">
          Add stat
        </button>
      </div>
      {safeItems.map((item, index) => (
        <div key={`${item.label}-${index}`} className="grid md:grid-cols-2 gap-4 rounded-xl border border-line p-4">
          <Field label={firstLabel} value={item.label} onChange={(value) => onChange(safeItems.map((entry, entryIndex) => entryIndex === index ? { ...entry, label: value } : entry))} />
          <Field label={secondLabel} value={item.value} onChange={(value) => onChange(safeItems.map((entry, entryIndex) => entryIndex === index ? { ...entry, value } : entry))} />
        </div>
      ))}
    </div>
  );
}

function SimpleImagePathListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (next: string[]) => void }) {
  const safeItems = items ?? [];
  return (
    <div className="space-y-4 rounded-2xl border border-line p-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold">{label}</h3>
        <button type="button" onClick={() => onChange([...safeItems, ""])} className="rounded-full border border-line px-4 py-2 text-sm">
          Add image
        </button>
      </div>
      {safeItems.map((item, index) => (
        <div key={`${item}-${index}`} className="rounded-xl border border-line p-4">
          <AssetPicker label={`Image ${index + 1} path`} value={item} onChange={(value) => onChange(safeItems.map((entry, entryIndex) => entryIndex === index ? value : entry))} />
        </div>
      ))}
    </div>
  );
}
