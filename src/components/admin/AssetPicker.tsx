import { useEffect, useMemo, useState } from "react";

type AssetInfo = {
  path: string;
  name: string;
  directory: string;
};

export function AssetPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<AssetInfo[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!open || assets.length > 0) return;
    fetch("/api/admin/assets", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data) => setAssets(data.assets ?? []));
  }, [open, assets.length]);

  const visible = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return assets;
    return assets.filter((asset) => `${asset.directory}/${asset.name}`.toLowerCase().includes(query));
  }, [assets, filter]);

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-sm font-medium text-ink">{label}</span>
        <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-xl border border-line px-4 py-3" />
      </label>

      {value ? (
        <div className="overflow-hidden rounded-xl border border-line bg-mist">
          <div className="aspect-[16/10] bg-white">
            <img src={value} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      ) : null}

      <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-full border border-line px-4 py-2 text-sm">
        {open ? "Hide asset library" : "Choose from asset library"}
      </button>

      {open ? (
        <div className="rounded-2xl border border-line bg-white p-4 space-y-4">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search assets"
            className="w-full rounded-xl border border-line px-4 py-3"
          />
          <div className="grid max-h-[24rem] gap-3 overflow-auto sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((asset) => (
              <button
                key={asset.path}
                type="button"
                onClick={() => {
                  onChange(asset.path);
                  setOpen(false);
                }}
                className={`overflow-hidden rounded-xl border text-left ${value === asset.path ? "border-brand" : "border-line"}`}
              >
                <div className="aspect-[4/3] bg-mist">
                  <img src={asset.path} alt={asset.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-xs uppercase tracking-wide text-ink-soft">{asset.directory || "root"}</p>
                  <p className="mt-1 text-sm break-all">{asset.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
