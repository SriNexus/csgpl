import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, FileText, Package, Briefcase, Star,
  LogOut, Image as ImageIcon, Layers, Globe, BarChart3, ChevronRight,
  Settings, Palette, Tag, FileStack, Stethoscope, HeartPulse, Film, type LucideIcon,
} from "lucide-react";
import Logo from "@/components/Logo";
import { adminAuth } from "@/admin/auth";
import { useNavigate } from "react-router-dom";
import { useCmsDocument } from "@/cms";

export interface AdminNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { to: "/admin",                   label: "Dashboard",     icon: LayoutDashboard, end: true },
  { to: "/admin/leads",             label: "Leads",         icon: Users },
  { to: "/admin/hero-slider",       label: "Hero Slider",   icon: Film },
  { to: "/admin/pages",             label: "Homepage Builder", icon: Layers },
  { to: "/admin/pages-builder",     label: "Pages",         icon: FileStack },
  { to: "/admin/blogs",             label: "Blogs",         icon: FileText },
  { to: "/admin/blogs-categories",  label: "Categories",    icon: Tag },
  { to: "/admin/products",          label: "Products",      icon: Package },
  { to: "/admin/projects",          label: "Projects",      icon: Briefcase },
  { to: "/admin/testimonials",      label: "Testimonials",  icon: Star },
  { to: "/admin/media",             label: "Media Library", icon: ImageIcon },
  { to: "/admin/branding",          label: "Branding",      icon: Palette },
  { to: "/admin/seo",               label: "SEO Settings",  icon: Globe },
  { to: "/admin/analytics",         label: "Analytics",     icon: BarChart3 },
  { to: "/admin/settings",          label: "Settings",      icon: Settings },
  { to: "/admin/debug/storage",     label: "Storage Debug", icon: Stethoscope },
  { to: "/admin/debug/health",      label: "Health",        icon: HeartPulse },
];

export default function AdminSidebar() {
  const nav = useNavigate();
  const branding = useCmsDocument("branding");

  async function onLogout() {
    await adminAuth.logout();
    nav("/admin");
  }

  return (
    <aside className="hidden md:flex w-64 shrink-0 bg-white border-r border-gray-100 flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-gray-100">
        <Logo src={branding.data.logoLight} slot="logoLight (admin)" />
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {ADMIN_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md"
                  : "text-ink-800 hover:bg-gray-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="h-4 w-4" /> {item.label}
                {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
