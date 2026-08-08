import { useEffect, useState } from "react";

type AssetInfo = {
  path: string;
  name: string;
  directory: string;
};

export default function AdminMediaLibrary() {
  const [assets, setAssets] = useState<AssetInfo[]>([]);
  const [filter, setFilter] = useState("");
  const [copied, setCopied] = useState("");
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [deletingPath, setDeletingPath] = useState("");

  function loadAssets() {
    fetch("/api/admin/assets", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data) => setAssets(data.assets ?? []));
  }

  useEffect(() => {
    loadAssets();
  }, []);

  const visible = assets.filter((asset) => {
    const query = filter.trim().toLowerCase();
    if (!query) return true;
    return `${asset.directory}/${asset.name}`.toLowerCase().includes(query);
  });

  async function copy(path: string) {
    try {
      await navigator.clipboard.writeText(path);
      setCopied(path);
      window.setTimeout(() => setCopied(""), 1500);
    } catch {
      setCopied("");
    }
  }

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setStatus("");
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
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          base64Data,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus(data.error ?? "Upload failed");
        return;
      }
      setStatus(`Uploaded ${data.asset.name}`);
      loadAssets();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(path: string) {
    setDeletingPath(path);
    setStatus("");
    try {
      const res = await fetch("/api/admin/assets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ path }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus(data.error ?? "Delete failed");
        return;
      }
      setStatus(`Deleted ${path}`);
      loadAssets();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeletingPath("");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Media library</p>
        <h1 className="text-3xl">Project assets</h1>
        <p className="mt-2 text-sm text-ink-soft">Browse the existing public asset library and copy image paths into content fields.</p>
      </div>

      <div className="rounded-2xl bg-white border border-line p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <label className="block">
            <span className="text-sm font-medium text-ink">Upload image</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
              onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
              disabled={uploading}
              className="mt-2 block w-full rounded-xl border border-line px-4 py-3 text-sm"
            />
          </label>
          <button onClick={loadAssets} className="rounded-full border border-line px-4 py-3 text-sm">
            Refresh assets
          </button>
        </div>
        {status ? <p className="mt-3 text-sm text-ink-soft">{status}</p> : null}
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by folder or filename"
          className="mt-4 w-full rounded-xl border border-line px-4 py-3"
        />
        <p className="mt-3 text-sm text-ink-soft">{visible.length} assets</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {visible.map((asset) => (
            <div key={asset.path} className="overflow-hidden rounded-2xl border border-line bg-mist">
              <div className="aspect-[4/3] bg-white">
                <img src={asset.path} alt={asset.name} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-2 p-4">
                <p className="text-xs uppercase tracking-wide text-ink-soft">{asset.directory || "root"}</p>
                <p className="text-sm font-medium break-all">{asset.name}</p>
                <p className="text-xs text-ink-soft break-all">{asset.path}</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => copy(asset.path)} className="rounded-full border border-line px-4 py-2 text-sm">
                    {copied === asset.path ? "Copied" : "Copy path"}
                  </button>
                  {asset.directory === "uploads" ? (
                    <button
                      onClick={() => onDelete(asset.path)}
                      disabled={deletingPath === asset.path}
                      className="rounded-full border border-line px-4 py-2 text-sm"
                    >
                      {deletingPath === asset.path ? "Deleting..." : "Delete"}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
