import { FormEvent, useState } from "react";

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("");
    setError("");
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ currentPassword, nextPassword }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Failed to change password");
      return;
    }
    setCurrentPassword("");
    setNextPassword("");
    setStatus("Password updated.");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Account settings</p>
        <h1 className="text-3xl">Change password</h1>
      </div>
      <form onSubmit={onSubmit} className="max-w-xl rounded-2xl bg-white border border-line p-6 space-y-4">
        <input value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type="password" placeholder="Current password" className="w-full rounded-xl border border-line px-4 py-3" />
        <input value={nextPassword} onChange={(e) => setNextPassword(e.target.value)} type="password" placeholder="New password (min 8 chars)" className="w-full rounded-xl border border-line px-4 py-3" />
        <div className="flex items-center gap-3">
          <button className="rounded-full bg-brand px-5 py-3 text-white font-semibold">Update password</button>
          {status && <p className="text-sm text-ink-soft">{status}</p>}
          {error && <p className="text-sm text-brand">{error}</p>}
        </div>
      </form>
    </div>
  );
}
