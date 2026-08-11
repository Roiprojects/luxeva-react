import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";

type BootstrapState = { requiresSetup: boolean } | null;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [bootstrap, setBootstrap] = useState<BootstrapState>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

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
    const body = bootstrap?.requiresSetup ? { email, password, fullName } : { email, password };
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok || !data.ok) { setError(data.error ?? "Authentication failed"); return; }
    navigate("/admin");
  }

  const isSetup = bootstrap?.requiresSetup;

  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-navy flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-grid text-white pointer-events-none" />
        <div className="absolute inset-0 spotlight pointer-events-none" />
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 border border-white/20 mb-8">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-display text-white leading-tight">Luxeva Care</h1>
          <p className="mt-3 text-white/60 text-lg">Admin Control Panel</p>
          <div className="mt-12 grid gap-4 text-left max-w-xs mx-auto">
            {["Manage enquiries & leads", "Edit website content", "Upload project photos", "Manage your team"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                <p className="text-white/70 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 mt-auto text-white/30 text-xs">Luxeva Care Interiors · Admin Access</p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-mist">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-navy mb-4">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-display text-ink">Luxeva Admin</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-line p-8">
            <h2 className="text-2xl font-display text-ink">
              {isSetup ? "Create admin account" : "Welcome back"}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              {isSetup ? "Set up the first administrator for Luxeva Care." : "Sign in to manage your content and leads."}
            </p>

            <form onSubmit={onSubmit} className="mt-7 space-y-4">
              {isSetup && (
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Full name</label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-line bg-mist/50 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10 transition-all"
                    placeholder="Your full name"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-line bg-mist/50 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-line bg-mist/50 px-4 py-3 pr-12 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10 transition-all"
                    placeholder={isSetup ? "Min. 8 characters" : "Your password"}
                    required
                    minLength={8}
                  />
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-brand-soft border border-brand/20 px-4 py-3 text-sm text-brand">
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-navy px-6 py-3.5 text-sm font-semibold text-white hover:bg-navy-dark transition-colors disabled:opacity-60 shadow-soft"
              >
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Please wait…</span>
                ) : (
                  <><LogIn size={16} /> {isSetup ? "Create admin account" : "Sign in"}</>
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-ink-soft/60">
            Luxeva Care Interiors · Secure Admin Access
          </p>
        </div>
      </div>
    </div>
  );
}
