import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Home, Info, Grid3X3, Wrench, ImageIcon, HelpCircle,
  Star, Users2, Phone, MessageSquare, UserCog, Settings, FolderOpen,
  LogOut, ChevronRight, Menu,
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Website Content",
    items: [
      { label: "Home Page", href: "/admin/home", icon: Home },
      { label: "About Us", href: "/admin/about", icon: Info },
      { label: "Room Categories", href: "/admin/rooms", icon: Grid3X3 },
      { label: "Services", href: "/admin/services", icon: Wrench },
      { label: "Portfolio", href: "/admin/portfolio", icon: ImageIcon },
      { label: "Testimonials", href: "/admin/testimonials", icon: Star },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
      { label: "Leadership", href: "/admin/leadership", icon: Users2 },
      { label: "Contact Info", href: "/admin/contact-settings", icon: Phone },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
      { label: "Media Library", href: "/admin/media", icon: FolderOpen },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Admin Users", href: "/admin/users", icon: UserCog },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

function SidebarNav({ onNav }: { onNav?: () => void }) {
  return (
    <div className="space-y-5">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-ink-soft/50">{group.label}</p>
          <div className="space-y-0.5">
            {group.items.map(({ label, href, icon: Icon }) => (
              <NavLink
                key={href}
                to={href}
                end={href === "/admin"}
                onClick={onNav}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-navy text-white shadow-soft"
                      : "text-ink-soft hover:bg-mist hover:text-ink"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={16} className={isActive ? "text-white/80" : "text-ink-soft"} />
                    <span className="flex-1">{label}</span>
                    {isActive && <ChevronRight size={14} className="text-white/40" />}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-mist flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-line fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-line">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy">
            <span className="text-xs font-bold text-white">LC</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink leading-none">Luxeva Care</p>
            <p className="text-xs text-ink-soft mt-0.5">Admin Panel</p>
          </div>
        </div>
        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <SidebarNav />
        </nav>
        {/* User */}
        <div className="border-t border-line p-3">
          <div className="flex items-center gap-3 rounded-xl p-3 hover:bg-mist transition-colors">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy text-xs font-bold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">{name}</p>
              <p className="text-xs text-ink-soft">Administrator</p>
            </div>
            <button onClick={logout} title="Logout" className="text-ink-soft hover:text-brand transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-ink/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white lg:hidden flex flex-col shadow-lift">
            <div className="flex items-center justify-between px-5 py-5 border-b border-line">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy">
                  <span className="text-xs font-bold text-white">LC</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink leading-none">Luxeva Care</p>
                  <p className="text-xs text-ink-soft mt-0.5">Admin Panel</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-ink-soft">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <SidebarNav onNav={() => setSidebarOpen(false)} />
            </nav>
            <div className="border-t border-line p-3">
              <button onClick={logout} className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-mist hover:text-ink transition-all">
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-4 bg-white border-b border-line px-4 py-3 shadow-soft">
          <button onClick={() => setSidebarOpen(true)} className="text-ink-soft">
            <Menu size={22} />
          </button>
          <Link to="/admin" className="font-semibold text-ink">Luxeva Admin</Link>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/10 text-navy text-xs font-bold">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8 max-w-screen-xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
