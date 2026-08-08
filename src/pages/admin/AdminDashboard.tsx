import { useEffect, useState } from "react";

type Metrics = {
  counts: { total: number; new_count: number; contacted_count: number; qualified_count: number; converted_count: number };
  recent: Array<{ id: string; name: string; phone: string; serviceInterest?: string; status: string; createdAt: string }>;
  byService: Array<{ label: string; value: number }>;
  bySource: Array<{ label: string; value: number }>;
};

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data) => setMetrics(data.metrics));
  }, []);

  if (!metrics) return <div className="rounded-2xl bg-white border border-line p-6">Loading dashboard…</div>;

  const cards = [
    { label: "Total enquiries", value: metrics.counts.total },
    { label: "New", value: metrics.counts.new_count },
    { label: "Contacted", value: metrics.counts.contacted_count },
    { label: "Qualified", value: metrics.counts.qualified_count },
    { label: "Converted", value: metrics.counts.converted_count },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-2">Dashboard</p>
        <h1 className="text-3xl">Admin overview</h1>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white border border-line p-5 shadow-soft">
            <p className="text-sm text-ink-soft">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border border-line p-6">
          <h2 className="text-xl">Recent enquiries</h2>
          <div className="mt-4 space-y-3">
            {metrics.recent.map((row) => (
              <div key={row.id} className="rounded-xl border border-line p-4">
                <p className="font-medium">{row.name}</p>
                <p className="text-sm text-ink-soft">{row.phone} · {row.serviceInterest ?? "General"} · {row.status}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl bg-white border border-line p-6">
            <h2 className="text-xl">Service interest summary</h2>
            <div className="mt-4 space-y-2">
              {metrics.byService.map((row) => <p key={row.label} className="text-sm">{row.label}: <strong>{row.value}</strong></p>)}
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-line p-6">
            <h2 className="text-xl">Source summary</h2>
            <div className="mt-4 space-y-2">
              {metrics.bySource.map((row) => <p key={row.label} className="text-sm">{row.label}: <strong>{row.value}</strong></p>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
