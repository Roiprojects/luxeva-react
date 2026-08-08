import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type BootstrapState = { requiresSetup: boolean } | null;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [bootstrap, setBootstrap] = useState<BootstrapState>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/bootstrap", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data) => setBootstrap({ requiresSetup: Boolean(data.requiresSetup) }))
      .catch(() => setBootstrap({ requiresSetup: false }));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const endpoint = bootstrap?.requiresSetup ? "/api/admin/setup" : "/api/admin/login";
    const body = bootstrap?.requiresSetup
      ? { email, password, fullName }
      : { email, password };
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Authentication failed");
      return;
    }
    navigate("/admin");
  }

  return (
    <div className="min-h-screen bg-mist flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white shadow-card border border-line p-8">
        <p className="eyebrow mb-2">{bootstrap?.requiresSetup ? "Admin setup" : "Admin login"}</p>
        <h1 className="text-3xl">{bootstrap?.requiresSetup ? "Create the first admin account" : "Sign in to admin"}</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {bootstrap?.requiresSetup ? "Set up the first administrator for Luxeva Care." : "Manage content, leads and public-site data."}
        </p>
        {bootstrap?.requiresSetup && (
          <label className="block mt-6">
            <span className="text-sm font-medium text-ink">Full name</span>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-2 w-full rounded-xl border border-line px-4 py-3" required />
          </label>
        )}
        <label className="block mt-6">
          <span className="text-sm font-medium text-ink">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-line px-4 py-3" required />
        </label>
        <label className="block mt-4">
          <span className="text-sm font-medium text-ink">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-line px-4 py-3" required minLength={8} />
        </label>
        {error && <p className="mt-4 text-sm text-brand">{error}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-full bg-brand px-5 py-3 text-white font-semibold disabled:opacity-60">
          {loading ? "Please wait..." : bootstrap?.requiresSetup ? "Create admin" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
