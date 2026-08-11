import { useEffect, useRef, useState } from "react";
import { Upload, RefreshCw, Search, Copy, Check, Trash2, FolderOpen, Image as ImageIcon } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/Modal";

type AssetInfo = {
  path: string; name: string; directory: string;
};

export default function AdminMediaLibrary() {
  const [assets, setAssets] = useState<AssetInfo[]>([]);
  const [filter, setFilter] = useState("");
  const [copied, setCopied] = useState("");
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [deletingPath, setDeletingPath] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function loadAssets() {
    fetch("/api/admin/assets", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data) => setAssets(data.assets ?? []));
  }

  useEffect(() => { loadAssets(); }, []);

  // Only show uploaded images — hide built-in stock photos
  const uploadedAssets = assets.filter((a) => !a.directory.startsWith("stock"));

  const visible = uploadedAssets.filter((asset) => {
    const q = filter.trim().toLowerCase();
    return !q || `${asset.directory}/${asset.name}`.toLowerCase().includes(q);
  });

  const folders = [...new Set(uploadedAssets.map((a) => a.directory || "root"))];

  async function copy(path: string) {
    try {
      await navigator.clipboard.writeText(path);
      setCopied(path);
      setTimeout(() => setCopied(""), 1800);
    } catch { setCopied(""); }
  }

  async function uploadFile(file: File) {
    if (!file) return;
    setUploading(true);
    setStatus(null);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
      const base64Data = dataUrl.includes(",") ? dataUrl.split(",")[1] : "";
      const res = await fetch("/api/admin/assets/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ fileName: file.name, mimeType: file.type, base64Data }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) { setStatus({ type: "error", msg: data.error ?? "Upload failed" }); return; }
      setStatus({ type: "success", msg: `"${data.asset.name}" uploaded successfully.` });
      loadAssets();
    } catch (error) {
      setStatus({ type: "error", msg: error instanceof Error ? error.message : "Upload failed" });
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(path: string) {
    setDeletingPath(path);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/assets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ path }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) { setStatus({ type: "error", msg: data.error ?? "Delete failed" }); return; }
      setStatus({ type: "success", msg: "Image deleted." });
      loadAssets();
    } catch (error) {
      setStatus({ type: "error", msg: error instanceof Error ? error.message : "Delete failed" });
    } finally {
      setDeletingPath("");
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Media</p>
          <h1 className="text-3xl text-ink">Image Library</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {uploadedAssets.length} uploaded image{uploadedAssets.length !== 1 ? "s" : ""} across {folders.length} folder{folders.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={loadAssets} className="flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink-soft hover:border-navy hover:text-navy transition-all">
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Upload zone */}
      <div
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          dragOver ? "border-navy bg-navy/5" : "border-line bg-white hover:border-navy/40"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ""; }}
        />
        <div className={`inline-flex items-center justify-center h-14 w-14 rounded-2xl mb-4 ${dragOver ? "bg-navy text-white" : "bg-mist text-ink-soft"}`}>
          <Upload size={24} />
        </div>
        <p className="text-sm font-semibold text-ink">{uploading ? "Uploading…" : "Click to upload or drag & drop"}</p>
        <p className="text-xs text-ink-soft mt-1">PNG, JPG, WebP, GIF, SVG · Max 15MB</p>
      </div>

      {/* Status */}
      {status && (
        <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
          status.type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-brand-soft border-brand/20 text-brand"
        }`}>
          {status.type === "success" ? <Check size={15} /> : null}
          {status.msg}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search by folder or filename…"
          className="w-full rounded-xl border border-line bg-white pl-10 pr-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
        />
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white border border-line py-16 text-center">
          <ImageIcon size={40} className="text-ink-soft/30 mb-3" />
          <p className="text-sm text-ink-soft">{filter ? "No images match your search." : "No uploaded images yet. Use the upload zone above to add images."}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((asset) => (
            <div key={asset.path} className="group overflow-hidden rounded-2xl border border-line bg-white shadow-soft hover:shadow-card transition-all">
              <div className="aspect-[4/3] bg-mist/50 overflow-hidden">
                <img src={asset.path} alt={asset.name} className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-500" />
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <FolderOpen size={11} className="text-ink-soft/60 flex-shrink-0" />
                  <p className="text-[10px] uppercase tracking-wide text-ink-soft/60 truncate">{asset.directory || "root"}</p>
                </div>
                <p className="text-xs font-medium text-ink break-all leading-tight mb-2">{asset.name}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copy(asset.path)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                      copied === asset.path
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-line text-ink-soft hover:border-navy hover:text-navy"
                    }`}
                  >
                    {copied === asset.path ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy path</>}
                  </button>
                  {asset.directory === "uploads" && (
                    <button
                      onClick={() => setConfirmDelete(asset.path)}
                      disabled={deletingPath === asset.path}
                      className="flex items-center justify-center h-8 w-8 rounded-lg border border-line text-ink-soft hover:border-brand hover:text-brand transition-all disabled:opacity-40"
                      title="Delete image"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => { if (confirmDelete) onDelete(confirmDelete); setConfirmDelete(null); }}
        title="Delete image"
        message={`Are you sure you want to permanently delete "${confirmDelete?.split("/").pop()}"? This cannot be undone.`}
        confirmLabel="Yes, delete"
        danger
      />
    </div>
  );
}
