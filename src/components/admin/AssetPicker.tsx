import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

export function AssetPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
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
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Upload failed. Please try again.");
        return;
      }
      onChange(data.asset.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-ink">{label}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-line group">
          <img src={value} alt="" className="w-full h-36 object-cover" />
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-ink shadow-md hover:bg-mist transition-colors"
            >
              {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
              {uploading ? "Uploading…" : "Change"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-xs font-semibold text-white shadow-md hover:bg-brand-dark transition-colors"
            >
              <X size={13} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-mist/40 py-7 text-ink-soft hover:border-navy hover:text-navy hover:bg-navy/5 transition-all disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 size={22} className="animate-spin" />
              <span className="text-sm font-medium">Uploading…</span>
            </>
          ) : (
            <>
              <Upload size={22} />
              <span className="text-sm font-medium">Choose image from device</span>
              <span className="text-xs opacity-60">PNG, JPG, WebP · Max 15 MB</span>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-xs text-brand flex items-center gap-1">{error}</p>
      )}
    </div>
  );
}
