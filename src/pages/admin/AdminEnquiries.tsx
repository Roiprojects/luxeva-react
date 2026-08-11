import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Calendar, MessageCircle, Clock, ChevronLeft } from "lucide-react";

type Enquiry = {
  id: string; name: string; phone: string; email?: string;
  serviceInterest?: string; propertyType?: string; location?: string;
  budgetRange?: string; timeline?: string; message?: string;
  status: string; followUpDate?: string; createdAt?: string;
};

type Note = { id: string; author?: string; note: string; createdAt: string };

const STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "follow_up", label: "Follow Up" },
  { value: "converted", label: "Converted" },
  { value: "closed", label: "Closed" },
  { value: "spam", label: "Spam" },
];

const STATUS_BADGE: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  contacted: "bg-amber-100 text-amber-700 border-amber-200",
  qualified: "bg-indigo-100 text-indigo-700 border-indigo-200",
  follow_up: "bg-orange-100 text-orange-700 border-orange-200",
  converted: "bg-emerald-100 text-emerald-700 border-emerald-200",
  closed: "bg-gray-100 text-gray-600 border-gray-200",
  spam: "bg-red-100 text-red-600 border-red-200",
};

const STATUS_LABEL: Record<string, string> = {
  new: "New", contacted: "Contacted", qualified: "Qualified",
  follow_up: "Follow Up", converted: "Converted", closed: "Closed", spam: "Spam",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [showDetail, setShowDetail] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/enquiries", { credentials: "same-origin" });
    const data = await res.json();
    setEnquiries(data.enquiries ?? []);
    if (!activeId && data.enquiries?.[0]?.id) setActiveId(data.enquiries[0].id);
  }

  async function loadNotes(id: string) {
    const res = await fetch(`/api/admin/enquiries/${id}/notes`, { credentials: "same-origin" });
    const data = await res.json();
    setNotes(data.notes ?? []);
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { if (activeId) loadNotes(activeId); }, [activeId]);

  const filtered = filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);
  const active = enquiries.find((item) => item.id === activeId);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ status }),
    });
    await load();
  }

  async function addNote() {
    if (!activeId || !noteText.trim()) return;
    await fetch(`/api/admin/enquiries/${activeId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ note: noteText }),
    });
    setNoteText("");
    await loadNotes(activeId);
  }

  function selectEnquiry(id: string) {
    setActiveId(id);
    setShowDetail(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Lead management</p>
        <h1 className="text-3xl text-ink">Enquiries</h1>
        <p className="text-sm text-ink-soft mt-1">{enquiries.length} total leads · {enquiries.filter(e => e.status === "new").length} new</p>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {[{ value: "all", label: "All" }, ...STATUSES].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all ${
              filter === value
                ? "bg-navy text-white border-navy"
                : "bg-white text-ink-soft border-line hover:border-navy hover:text-navy"
            }`}
          >
            {label}
            {value !== "all" && (
              <span className="ml-1.5 opacity-60">{enquiries.filter((e) => e.status === value).length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-5">
        {/* List */}
        <div className={`rounded-2xl bg-white border border-line shadow-soft overflow-hidden ${showDetail ? "hidden lg:block" : ""}`}>
          <div className="px-4 py-3 border-b border-line bg-mist/50">
            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">{filtered.length} enquiries</p>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
            {filtered.length === 0 && (
              <p className="px-6 py-12 text-center text-sm text-ink-soft">No enquiries with this status.</p>
            )}
            {filtered.map((enquiry) => (
              <button
                key={enquiry.id}
                onClick={() => selectEnquiry(enquiry.id)}
                className={`w-full text-left border-b border-line/60 last:border-b-0 px-4 py-4 transition-all hover:bg-mist/40 ${
                  activeId === enquiry.id ? "bg-navy/5 border-l-2 border-l-navy" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy text-xs font-bold mt-0.5">
                    {enquiry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-ink truncate">{enquiry.name}</p>
                      <span className={`inline-block flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_BADGE[enquiry.status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        {STATUS_LABEL[enquiry.status] ?? enquiry.status}
                      </span>
                    </div>
                    <p className="text-xs text-ink-soft mt-0.5">{enquiry.phone}</p>
                    {enquiry.serviceInterest && (
                      <p className="text-xs text-gold mt-0.5">{enquiry.serviceInterest}</p>
                    )}
                    {enquiry.createdAt && (
                      <p className="text-[10px] text-ink-soft/60 mt-1">{formatDate(enquiry.createdAt)}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className={`rounded-2xl bg-white border border-line shadow-soft ${!showDetail ? "hidden lg:block" : ""}`}>
          {active ? (
            <div className="h-full flex flex-col">
              {/* Detail header */}
              <div className="flex items-start gap-4 px-6 py-5 border-b border-line">
                <button onClick={() => setShowDetail(false)} className="lg:hidden text-ink-soft mt-1">
                  <ChevronLeft size={20} />
                </button>
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-navy text-white text-base font-bold">
                  {active.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-ink">{active.name}</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {active.phone && (
                      <a href={`tel:${active.phone}`} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors">
                        <Phone size={12} /> Call {active.phone}
                      </a>
                    )}
                    {active.phone && (
                      <a href={`https://wa.me/91${active.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 border border-green-200 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 transition-colors">
                        WhatsApp
                      </a>
                    )}
                    {active.email && (
                      <a href={`mailto:${active.email}`} className="inline-flex items-center gap-1.5 rounded-lg bg-navy/5 border border-navy/20 px-3 py-1.5 text-xs font-semibold text-navy hover:bg-navy/10 transition-colors">
                        <Mail size={12} /> {active.email}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1">Status</label>
                    <select
                      value={active.status}
                      onChange={(e) => updateStatus(active.id, e.target.value)}
                      className="rounded-xl border border-line px-3 py-2 text-sm font-medium focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
                    >
                      {STATUSES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1">Follow-up date</label>
                    <input
                      type="date"
                      defaultValue={active.followUpDate?.slice(0, 10) ?? ""}
                      onBlur={async (e) => {
                        await fetch(`/api/admin/enquiries/${active.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          credentials: "same-origin",
                          body: JSON.stringify({ followUpDate: e.target.value || null }),
                        });
                        await load();
                      }}
                      className="rounded-xl border border-line px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Info grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "Service of Interest", value: active.serviceInterest, icon: null },
                    { label: "Property Type", value: active.propertyType, icon: null },
                    { label: "Location", value: active.location, icon: MapPin },
                    { label: "Budget Range", value: active.budgetRange, icon: null },
                    { label: "Timeline", value: active.timeline, icon: Calendar },
                    { label: "Received on", value: active.createdAt ? `${formatDate(active.createdAt)} at ${formatTime(active.createdAt)}` : null, icon: Clock },
                  ].filter(({ value }) => value).map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-xl bg-mist/60 px-4 py-3">
                      <p className="text-xs font-medium text-ink-soft mb-0.5">{label}</p>
                      <div className="flex items-center gap-1.5">
                        {Icon && <Icon size={13} className="text-ink-soft/60 flex-shrink-0" />}
                        <p className="text-sm font-medium text-ink">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message */}
                {active.message && (
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-ink mb-2">
                      <MessageCircle size={15} className="text-ink-soft" /> Customer Message
                    </h3>
                    <div className="rounded-xl bg-mist/60 px-4 py-3">
                      <p className="text-sm text-ink-soft whitespace-pre-wrap leading-relaxed">{active.message}</p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <h3 className="text-sm font-semibold text-ink mb-3">Internal Notes</h3>
                  {notes.length === 0 && (
                    <p className="text-xs text-ink-soft/60 mb-3">No notes yet. Add one below.</p>
                  )}
                  <div className="space-y-2 mb-3">
                    {notes.map((note) => (
                      <div key={note.id} className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                        <p className="text-sm text-ink">{note.note}</p>
                        <p className="mt-1 text-xs text-ink-soft/60">{note.author ?? "Admin"} · {formatDate(note.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-line bg-mist/40 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10 placeholder:text-ink-soft/50 resize-none"
                    placeholder="Write a note for your team…"
                  />
                  <button
                    onClick={addNote}
                    disabled={!noteText.trim()}
                    className="mt-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark transition-colors disabled:opacity-40"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <MessageCircle size={32} className="text-ink-soft/30 mb-3" />
              <p className="text-sm text-ink-soft">Select an enquiry from the list to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
