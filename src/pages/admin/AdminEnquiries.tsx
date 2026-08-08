import { useEffect, useState } from "react";

type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  serviceInterest?: string;
  status: string;
  message?: string;
};

type Note = { id: string; author?: string; note: string; createdAt: string };

const STATUSES = ["new", "contacted", "qualified", "follow_up", "converted", "closed", "spam"];

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState("");

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

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Lead management</p>
        <h1 className="text-3xl">Enquiries</h1>
      </div>
      <div className="grid lg:grid-cols-[360px_1fr] gap-6">
        <div className="rounded-2xl bg-white border border-line p-4 space-y-3 max-h-[75vh] overflow-auto">
          {enquiries.map((enquiry) => (
            <button key={enquiry.id} onClick={() => setActiveId(enquiry.id)} className={`w-full rounded-xl border p-4 text-left ${activeId === enquiry.id ? "border-brand bg-brand-soft" : "border-line"}`}>
              <p className="font-medium">{enquiry.name}</p>
              <p className="text-sm text-ink-soft">{enquiry.phone} · {enquiry.serviceInterest ?? "General"}</p>
              <p className="text-xs mt-2 uppercase tracking-wide text-ink-soft">{enquiry.status}</p>
            </button>
          ))}
        </div>
        <div className="rounded-2xl bg-white border border-line p-6">
          {active ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl">{active.name}</h2>
                  <p className="text-sm text-ink-soft">{active.phone}{active.email ? ` · ${active.email}` : ""}</p>
                </div>
                <select value={active.status} onChange={(e) => updateStatus(active.id, e.target.value)} className="rounded-xl border border-line px-4 py-2">
                  {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
              <div className="mt-6">
                <h3 className="text-lg">Message</h3>
                <p className="mt-2 text-sm text-ink-soft whitespace-pre-wrap">{active.message || "No message supplied."}</p>
              </div>
              <div className="mt-8">
                <h3 className="text-lg">Internal notes</h3>
                <div className="mt-3 space-y-3">
                  {notes.map((note) => (
                    <div key={note.id} className="rounded-xl border border-line p-4">
                      <p className="text-sm">{note.note}</p>
                      <p className="mt-2 text-xs text-ink-soft">{note.author ?? "Admin"}</p>
                    </div>
                  ))}
                </div>
                <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} className="mt-4 min-h-[120px] w-full rounded-xl border border-line px-4 py-3" placeholder="Add an internal note" />
                <button onClick={addNote} className="mt-3 rounded-full bg-brand px-5 py-3 text-white font-semibold">Add note</button>
              </div>
            </>
          ) : (
            <p className="text-sm text-ink-soft">Select an enquiry.</p>
          )}
        </div>
      </div>
    </div>
  );
}
