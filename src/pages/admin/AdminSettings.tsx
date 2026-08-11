import { FormEvent, useState } from "react";
import { Lock, CheckCircle, Eye, EyeOff } from "lucide-react";

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus(""); setError(""); setLoading(true);
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ currentPassword, nextPassword }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok || !data.ok) { setError(data.error ?? "Failed to change password"); return; }
    setCurrentPassword(""); setNextPassword("");
    setStatus("Password updated successfully.");
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <p className="eyebrow mb-2">Account</p>
        <h1 className="text-3xl text-ink">Settings</h1>
        <p className="mt-1 text-sm text-ink-soft">Manage your account security.</p>
      </div>

      <div className="rounded-2xl bg-white border border-line shadow-soft p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/10 text-navy">
            <Lock size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-ink">Change Password</h2>
            <p className="text-xs text-ink-soft mt-0.5">Use a strong password of at least 8 characters.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Current password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-line bg-mist/50 px-4 py-3 pr-12 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
                required
              />
              <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink">
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">New password</label>
            <div className="relative">
              <input
                type={showNext ? "text" : "password"}
                value={nextPassword}
                onChange={(e) => setNextPassword(e.target.value)}
                className="w-full rounded-xl border border-line bg-mist/50 px-4 py-3 pr-12 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
                required
                minLength={8}
              />
              <button type="button" onClick={() => setShowNext((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink">
                {showNext ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {nextPassword && nextPassword.length < 8 && (
              <p className="mt-1 text-xs text-brand">Must be at least 8 characters</p>
            )}
          </div>

          {error && (
            <div className="rounded-xl bg-brand-soft border border-brand/20 px-4 py-3 text-sm text-brand">{error}</div>
          )}
          {status && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle size={15} /> {status}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-dark transition-colors disabled:opacity-60"
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
