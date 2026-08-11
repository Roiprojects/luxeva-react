import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, TrendingUp, PhoneCall, BadgeCheck, Star, ArrowRight, Clock } from "lucide-react";

type Metrics = {
  counts: { total: number; new_count: number; contacted_count: number; qualified_count: number; converted_count: number };
  recent: Array<{ id: string; name: string; phone: string; serviceInterest?: string; status: string; createdAt: string }>;
  byService: Array<{ label: string; value: number }>;
  bySource: Array<{ label: string; value: number }>;
};

const STATUS_BADGE: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  qualified: "bg-indigo-100 text-indigo-700",
  follow_up: "bg-orange-100 text-orange-700",
  converted: "bg-emerald-100 text-emerald-700",
  closed: "bg-gray-100 text-gray-600",
  spam: "bg-red-100 text-red-600",
};

const STATUS_LABEL: Record<string, string> = {
  new: "New", contacted: "Contacted", qualified: "Qualified",
  follow_up: "Follow Up", converted: "Converted", closed: "Closed", spam: "Spam",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data) => setMetrics(data.metrics));
  }, []);

  if (!metrics) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded-xl bg-line animate-pulse" />
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-white border border-line animate-pulse" />)}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Enquiries", value: metrics.counts.total, icon: MessageSquare, color: "bg-navy/10 text-navy", border: "border-navy/20" },
    { label: "New Leads", value: metrics.counts.new_count, icon: TrendingUp, color: "bg-blue-50 text-blue-600", border: "border-blue-200" },
    { label: "Contacted", value: metrics.counts.contacted_count, icon: PhoneCall, color: "bg-amber-50 text-amber-600", border: "border-amber-200" },
    { label: "Converted", value: metrics.counts.converted_count, icon: BadgeCheck, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-200" },
  ];

  const maxService = Math.max(...metrics.byService.map((s) => s.value), 1);

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-2">Overview</p>
        <h1 className="text-3xl text-ink">Dashboard</h1>
        <p className="text-sm text-ink-soft mt-1">Welcome back. Here's what's happening with your leads.</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, border }) => (
          <div key={label} className={`rounded-2xl bg-white border ${border} p-5 shadow-soft`}>
            <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl ${color} mb-4`}>
              <Icon size={20} />
            </div>
            <p className="text-3xl font-bold text-ink">{value}</p>
            <p className="text-sm text-ink-soft mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="rounded-2xl bg-white border border-line shadow-soft">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-line">
            <div>
              <h2 className="text-lg font-semibold text-ink">Recent Enquiries</h2>
              <p className="text-xs text-ink-soft mt-0.5">Latest leads from your website</p>
            </div>
            <Link to="/admin/enquiries" className="flex items-center gap-1 text-sm font-medium text-gold hover:text-gold-deep transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-line">
            {metrics.recent.length === 0 && <p className="px-6 py-8 text-center text-sm text-ink-soft">No enquiries yet.</p>}
            {metrics.recent.map((row) => (
              <Link key={row.id} to="/admin/enquiries" className="flex items-center gap-4 px-6 py-4 hover:bg-mist/50 transition-colors">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy text-sm font-semibold">
                  {row.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{row.name}</p>
                  <p className="text-xs text-ink-soft truncate">{row.phone}{row.serviceInterest ? ` · ${row.serviceInterest}` : ""}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[row.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {STATUS_LABEL[row.status] ?? row.status}
                  </span>
                  <span className="text-xs text-ink-soft flex items-center gap-1"><Clock size={10} /> {formatDate(row.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl bg-white border border-line shadow-soft p-5">
            <h2 className="text-base font-semibold text-ink mb-4">Enquiries by Service</h2>
            <div className="space-y-3">
              {metrics.byService.length === 0 && <p className="text-sm text-ink-soft">No data yet.</p>}
              {metrics.byService.map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-ink-soft truncate">{row.label || "General"}</span>
                    <span className="font-semibold text-ink ml-2">{row.value}</span>
                  </div>
                  <div className="h-1.5 bg-line rounded-full overflow-hidden">
                    <div className="h-full bg-navy rounded-full" style={{ width: `${Math.round((row.value / maxService) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-line shadow-soft p-5">
            <h2 className="text-base font-semibold text-ink mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: "Manage Enquiries", href: "/admin/enquiries", icon: MessageSquare },
                { label: "Edit Home Page", href: "/admin/home", icon: Star },
                { label: "Upload Images", href: "/admin/media", icon: BadgeCheck },
              ].map(({ label, href, icon: Icon }) => (
                <Link key={href} to={href} className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm font-medium text-ink-soft hover:border-navy hover:text-navy hover:bg-navy/5 transition-all">
                  <Icon size={15} /> {label} <ArrowRight size={14} className="ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
