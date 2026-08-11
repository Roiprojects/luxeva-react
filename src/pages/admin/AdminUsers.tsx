import { FormEvent, useEffect, useState } from "react";
import { UserPlus, Shield, Users, ToggleLeft, ToggleRight } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/Modal";

type AdminUser = {
  id: string; email: string; fullName: string; role: string; isActive: boolean;
};

const ROLES = [
  { value: "super_admin", label: "Super Admin", description: "Full access to all features" },
  { value: "content_manager", label: "Content Manager", description: "Can edit website content" },
  { value: "service_manager", label: "Service Manager", description: "Manages services & portfolio" },
  { value: "enquiry_manager", label: "Enquiry Manager", description: "Handles customer enquiries" },
];

function roleLabel(value: string) {
  return ROLES.find((r) => r.value === value)?.label ?? value;
}

const ROLE_BADGE: Record<string, string> = {
  super_admin: "bg-brand-soft text-brand border-brand/20",
  content_manager: "bg-blue-50 text-blue-700 border-blue-200",
  service_manager: "bg-indigo-50 text-indigo-700 border-indigo-200",
  enquiry_manager: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "content_manager" });
  const [showForm, setShowForm] = useState(false);
  const [toggleConfirm, setToggleConfirm] = useState<AdminUser | null>(null);

  async function load() {
    const res = await fetch("/api/admin/users", { credentials: "same-origin" });
    const data = await res.json();
    if (!res.ok || !data.ok) { setError(data.error ?? "Failed to load admin users"); return; }
    setUsers(data.users ?? []);
  }

  useEffect(() => { load(); }, []);

  async function createUser(e: FormEvent) {
    e.preventDefault();
    setError(""); setStatus("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) { setError(data.error ?? "Failed to create admin user"); return; }
    setForm({ fullName: "", email: "", password: "", role: "content_manager" });
    setStatus("Team member added successfully.");
    setShowForm(false);
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
    if (!res.ok || !data.ok) { setError(data.error ?? "Failed to update"); return; }
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Access control</p>
          <h1 className="text-3xl text-ink">Admin Team</h1>
          <p className="mt-1 text-sm text-ink-soft">Manage who can access the admin panel and what they can do.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark transition-colors shadow-soft"
        >
          <UserPlus size={16} /> Add member
        </button>
      </div>

      {/* Add user form */}
      {showForm && (
        <div className="rounded-2xl bg-white border border-line shadow-soft p-6">
          <h2 className="text-base font-semibold text-ink mb-4">Add a team member</h2>
          <form onSubmit={createUser} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Full name</label>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))}
                  placeholder="e.g. Priya Sharma"
                  className="w-full rounded-xl border border-line bg-mist/50 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Email address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                  placeholder="priya@luxevacare.com"
                  className="w-full rounded-xl border border-line bg-mist/50 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Temporary password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-xl border border-line bg-mist/50 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}
                  className="w-full rounded-xl border border-line bg-mist/50 px-4 py-3 text-sm focus:border-navy focus:outline-none"
                >
                  {ROLES.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
                </select>
              </div>
            </div>
            {error && <div className="rounded-xl bg-brand-soft border border-brand/20 px-4 py-3 text-sm text-brand">{error}</div>}
            {status && <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">{status}</div>}
            <div className="flex items-center gap-3">
              <button type="submit" className="rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark transition-colors">
                Add team member
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-line px-5 py-2.5 text-sm font-medium text-ink-soft hover:bg-mist transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Role reference */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ROLES.map((role) => (
          <div key={role.value} className="rounded-xl border border-line bg-white p-4">
            <div className="flex items-center gap-2 mb-1">
              <Shield size={14} className="text-ink-soft" />
              <p className="text-xs font-semibold text-ink">{role.label}</p>
            </div>
            <p className="text-xs text-ink-soft">{role.description}</p>
          </div>
        ))}
      </div>

      {/* Users list */}
      <div className="rounded-2xl bg-white border border-line shadow-soft overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-line bg-mist/50">
          <Users size={16} className="text-ink-soft" />
          <p className="text-sm font-semibold text-ink">{users.length} team member{users.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="divide-y divide-line">
          {users.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-ink-soft">No team members yet.</p>
          )}
          {users.map((user) => (
            <div key={user.id} className={`flex flex-wrap items-center gap-4 px-6 py-4 ${!user.isActive ? "opacity-60" : ""}`}>
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy text-sm font-bold">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <input
                  value={user.fullName}
                  onChange={(e) => setUsers((rows) => rows.map((row) => row.id === user.id ? { ...row, fullName: e.target.value } : row))}
                  onBlur={(e) => updateUser(user, { fullName: e.target.value })}
                  className="block w-full text-sm font-medium text-ink bg-transparent border-b border-transparent hover:border-line focus:border-navy focus:outline-none py-0.5 transition-colors"
                />
                <p className="text-xs text-ink-soft mt-0.5">{user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={user.role}
                  onChange={(e) => updateUser(user, { role: e.target.value })}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold focus:outline-none ${ROLE_BADGE[user.role] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
                >
                  {ROLES.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
                </select>
                <button
                  onClick={() => setToggleConfirm(user)}
                  className={`transition-colors ${user.isActive ? "text-emerald-500 hover:text-emerald-600" : "text-gray-300 hover:text-gray-400"}`}
                  title={user.isActive ? "Active — click to disable" : "Disabled — click to enable"}
                >
                  {user.isActive ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!showForm && error && <div className="rounded-xl bg-brand-soft border border-brand/20 px-4 py-3 text-sm text-brand">{error}</div>}

      <ConfirmDialog
        open={toggleConfirm !== null}
        onClose={() => setToggleConfirm(null)}
        onConfirm={() => { if (toggleConfirm) updateUser(toggleConfirm, { isActive: !toggleConfirm.isActive }); }}
        title={toggleConfirm?.isActive ? "Disable team member" : "Enable team member"}
        message={toggleConfirm?.isActive
          ? `This will revoke ${toggleConfirm.fullName}'s access to the admin panel. They won't be able to log in until re-enabled.`
          : `This will restore ${toggleConfirm?.fullName}'s access to the admin panel.`}
        confirmLabel={toggleConfirm?.isActive ? "Yes, disable" : "Yes, enable"}
        danger={toggleConfirm?.isActive}
      />
    </div>
  );
}
