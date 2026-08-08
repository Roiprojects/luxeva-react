import { FormEvent, useEffect, useState } from "react";

type AdminUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
};

const ROLES = ["super_admin", "content_manager", "service_manager", "enquiry_manager"];

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "content_manager" });

  async function load() {
    const res = await fetch("/api/admin/users", { credentials: "same-origin" });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Failed to load admin users");
      return;
    }
    setUsers(data.users ?? []);
  }

  useEffect(() => { load(); }, []);

  async function createUser(e: FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Failed to create admin user");
      return;
    }
    setForm({ fullName: "", email: "", password: "", role: "content_manager" });
    setStatus("Admin user created.");
    await load();
  }

  async function updateUser(user: AdminUser, patch: Partial<AdminUser>) {
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ fullName: patch.fullName, role: patch.role, isActive: patch.isActive }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Failed to update admin user");
      return;
    }
    await load();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Access control</p>
        <h1 className="text-3xl">Admin users</h1>
        <p className="mt-2 text-sm text-ink-soft">Only super admins can manage admin accounts and roles.</p>
      </div>

      <form onSubmit={createUser} className="rounded-2xl bg-white border border-line p-6 grid md:grid-cols-2 gap-4">
        <input value={form.fullName} onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))} placeholder="Full name" className="rounded-xl border border-line px-4 py-3" />
        <input value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} placeholder="Email" type="email" className="rounded-xl border border-line px-4 py-3" />
        <input value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} placeholder="Temporary password" type="password" className="rounded-xl border border-line px-4 py-3" />
        <select value={form.role} onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))} className="rounded-xl border border-line px-4 py-3">
          {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
        <div className="md:col-span-2 flex items-center gap-3">
          <button className="rounded-full bg-brand px-5 py-3 text-white font-semibold">Create admin user</button>
          {status && <p className="text-sm text-ink-soft">{status}</p>}
          {error && <p className="text-sm text-brand">{error}</p>}
        </div>
      </form>

      <div className="rounded-2xl bg-white border border-line p-6 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-soft border-b border-line">
              <th className="py-3">Name</th>
              <th className="py-3">Email</th>
              <th className="py-3">Role</th>
              <th className="py-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-line/60">
                <td className="py-3">
                  <input value={user.fullName} onChange={(e) => setUsers((rows) => rows.map((row) => row.id === user.id ? { ...row, fullName: e.target.value } : row))} onBlur={(e) => updateUser(user, { fullName: e.target.value })} className="w-full rounded-lg border border-line px-3 py-2" />
                </td>
                <td className="py-3">{user.email}</td>
                <td className="py-3">
                  <select value={user.role} onChange={(e) => updateUser(user, { role: e.target.value })} className="rounded-lg border border-line px-3 py-2">
                    {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                </td>
                <td className="py-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={user.isActive} onChange={(e) => updateUser(user, { isActive: e.target.checked })} />
                    <span>{user.isActive ? "Active" : "Disabled"}</span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
