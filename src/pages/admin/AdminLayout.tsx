import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

const NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Home", href: "/admin/home" },
  { label: "About", href: "/admin/about" },
  { label: "Room Categories", href: "/admin/rooms" },
  { label: "Services", href: "/admin/services" },
  { label: "Portfolio", href: "/admin/portfolio" },
  { label: "FAQs", href: "/admin/faqs" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Leadership", href: "/admin/leadership" },
  { label: "Contact", href: "/admin/contact-settings" },
  { label: "Enquiries", href: "/admin/enquiries" },
  { label: "Users", href: "/admin/users" },
  { label: "Settings", href: "/admin/settings" },
  { label: "Media Library", href: "/admin/media" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "same-origin" })
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const data = await r.json();
        setName(data.user.fullName);
        setReady(true);
      })
      .catch(() => navigate("/admin/login"));
  }, [navigate]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    navigate("/admin/login");
  }

  if (!ready) return <div className="min-h-screen bg-mist" />;

  return (
    <div className="min-h-screen bg-mist">
      <div className="border-b border-line bg-white">
        <div className="container-lux flex items-center justify-between py-4 gap-4">
          <Link to="/admin" className="font-semibold text-xl text-ink">Luxeva Admin</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink-soft">{name}</span>
            <button onClick={logout} className="rounded-full border border-line px-4 py-2 text-sm">Logout</button>
          </div>
        </div>
      </div>
      <div className="container-lux grid lg:grid-cols-[240px_1fr] gap-8 py-8">
        <aside className="rounded-2xl bg-white border border-line p-4 h-fit">
          <nav className="space-y-1">
            {NAV.map((item) => (
              <NavLink key={item.href} to={item.href} end={item.href === "/admin"} className={({ isActive }) => `block rounded-xl px-4 py-3 text-sm ${isActive ? "bg-brand text-white" : "text-ink-soft hover:bg-mist"}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <section>
          <Outlet />
        </section>
      </div>
    </div>
  );
}
