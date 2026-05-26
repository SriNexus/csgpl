import { useNavigate, useLocation } from "react-router-dom";
import { Bell, LogOut, Search } from "lucide-react";
import { adminAuth, useAuth } from "@/admin/auth";
import ThemeToggle from "@/components/ThemeToggle";
import { ADMIN_NAV } from "./AdminSidebar";

export default function AdminTopbar() {
  const nav = useNavigate();
  const loc = useLocation();
  const { user } = useAuth();

  async function onLogout() {
    await adminAuth.logout();
    nav("/admin");
  }

  const userInitials = user?.email ? user.email[0].toUpperCase() : "CS";
  const userEmail = user?.email || "admin@csgpl.in";

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile route switcher */}
        <select
          value={loc.pathname}
          onChange={(e) => nav(e.target.value)}
          className="md:hidden rounded-lg border border-gray-200 px-2 py-1.5 text-sm font-semibold"
        >
          {ADMIN_NAV.map((t) => (
            <option key={t.to} value={t.to}>{t.label}</option>
          ))}
        </select>
        <div className="hidden sm:flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 w-72">
          <Search className="h-4 w-4 text-gray-400" />
          <input className="bg-transparent text-sm focus:outline-none w-full" placeholder="Search…" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle size="sm" />
        <button className="relative h-9 w-9 grid place-items-center rounded-lg bg-gray-100 hover:bg-gray-200">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>
        <div className="hidden sm:flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center text-white font-bold text-sm">
            {userInitials}
          </div>
          <div className="text-xs leading-tight">
            <div className="font-bold text-ink-900">Admin User</div>
            <div className="text-gray-500 truncate max-w-[160px]">{userEmail}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="md:hidden h-9 w-9 grid place-items-center rounded-lg bg-rose-50 text-rose-600"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
