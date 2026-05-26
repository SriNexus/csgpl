import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Phone, Mail, MessageCircle, ChevronDown, Menu, X, ArrowRight,
} from "lucide-react";
import Logo from "./Logo";
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from "./SocialIcons";
import { Button } from "@/components/ui";
import ThemeToggle from "./ThemeToggle";
import { mainNav, solarSolutions, productNavItems } from "@/data/navigation";

/* ============================================================
   Navbar — fixed editorial top with collapsible top bar.
   Pure presentation; receives brand props from LayoutContainer.
   ============================================================ */

export interface NavbarProps {
  brand: {
    phoneDisplay: string;
    phoneRaw:     string;
    email:        string;
    /** Primary (light-background) logo URL. */
    logoLight?:    string;
    /** Compact icon-only logo for mobile / collapsed states. */
    logoCollapsed?: string;
  };
}

export default function Navbar({ brand }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [loc.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <TopBar collapsed={scrolled} brand={brand} />

      <nav className={`transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-xl border-b hairline shadow-soft" : "bg-white/70 backdrop-blur-md border-b border-transparent"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-[68px] md:h-[76px] flex items-center justify-between">
          <Link to="/" className="flex items-center no-tap">
            <Logo src={brand.logoLight} slot="logoLight" />
          </Link>

          <MainNav />

          <DesktopCta brand={brand} />

          <div className="lg:hidden flex items-center gap-1.5">
            <ThemeToggle size="sm" />
            <button
              className="p-2 rounded-lg text-ink-800 hover:bg-paper no-tap"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {open && <MobileMenu onClose={() => setOpen(false)} brand={brand} />}
      </nav>
    </header>
  );
}

/* ============================================================
   DECOMPOSED PIECES
   ============================================================ */

function TopBar({ collapsed, brand }: { collapsed: boolean; brand: NavbarProps["brand"] }) {
  return (
    <div className={`hidden md:block bg-[#050912] text-white text-[11px] tracking-tight transition-all duration-300 ${collapsed ? "h-0 overflow-hidden opacity-0" : "h-auto opacity-100"}`}>
      <div className="mx-auto max-w-7xl px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href={`tel:${brand.phoneRaw}`} className="inline-flex items-center gap-2 hover:text-brand-300 transition-colors">
            <Phone className="h-3 w-3 text-brand-400" /> {brand.phoneDisplay}
          </a>
          <a href={`mailto:${brand.email}`} className="inline-flex items-center gap-2 hover:text-brand-300 transition-colors">
            <Mail className="h-3 w-3 text-brand-400" /> {brand.email}
          </a>
          <span className="hidden lg:inline text-white/40">·</span>
          <span className="hidden lg:inline text-white/60">Premium Solar EPC across India</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/40">Follow</span>
          <a className="text-white/70 hover:text-brand-300 transition-colors" href="#" aria-label="Facebook"><FacebookIcon className="h-3.5 w-3.5" /></a>
          <a className="text-white/70 hover:text-brand-300 transition-colors" href="#" aria-label="Instagram"><InstagramIcon className="h-3.5 w-3.5" /></a>
          <a className="text-white/70 hover:text-brand-300 transition-colors" href="#" aria-label="LinkedIn"><LinkedinIcon className="h-3.5 w-3.5" /></a>
          <a className="text-white/70 hover:text-brand-300 transition-colors" href="#" aria-label="Twitter"><TwitterIcon className="h-3.5 w-3.5" /></a>
          <a className="text-white/70 hover:text-brand-300 transition-colors" href={`https://wa.me/${brand.phoneRaw.replace(/[^0-9]/g, "")}`} aria-label="WhatsApp"><MessageCircle className="h-3.5 w-3.5" /></a>
        </div>
      </div>
    </div>
  );
}

function MainNav() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3.5 py-2 text-[13px] font-semibold transition-colors tracking-tight ${
      isActive ? "text-brand-700" : "text-ink-800 hover:text-brand-700"
    }`;

  const [home, about, ...rest] = mainNav;

  return (
    <div className="hidden lg:flex items-center gap-0.5">
      <NavLink to={home.to} end className={navLinkClass}>{home.label}</NavLink>
      <NavLink to={about.to} className={navLinkClass}>{about.label}</NavLink>
      <SolutionsMenu />
      <ProductsMenu />
      {rest.map((l) => (
        <NavLink key={l.to} to={l.to} className={navLinkClass}>{l.label}</NavLink>
      ))}
    </div>
  );
}

function SolutionsMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="inline-flex items-center gap-1 px-3.5 py-2 text-[13px] font-semibold text-ink-800 hover:text-brand-700 tracking-tight">
        Solar Solutions <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 transition-all ${open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
        <div className="w-[440px] rounded-2xl bg-white shadow-premium border hairline p-3 grid grid-cols-1 gap-1">
          <div className="px-3 py-2 flex items-center justify-between border-b hairline mb-1">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-ink-500">Browse solutions</span>
            <a href="/#solutions" className="text-[11px] font-bold text-brand-700 hover:underline">View all →</a>
          </div>
          {solarSolutions.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.name} to={s.to} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-paper transition-colors group">
                <span className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 grid place-items-center ring-1 ring-brand-100 group-hover:bg-gradient-to-br group-hover:from-brand-500 group-hover:to-brand-700 group-hover:text-white transition-all">
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-ink-900">{s.name}</div>
                  <div className="text-[11px] text-ink-500 truncate">{s.desc}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-ink-300 group-hover:text-brand-700 group-hover:translate-x-0.5 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ProductsMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="inline-flex items-center gap-1 px-3.5 py-2 text-[13px] font-semibold text-ink-800 hover:text-brand-700 tracking-tight">
        Products <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 transition-all ${open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
        <div className="w-[440px] rounded-2xl bg-white shadow-premium border hairline p-3 grid grid-cols-1 gap-1">
          <div className="px-3 py-2 flex items-center justify-between border-b hairline mb-1">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-ink-500">Browse products</span>
            <Link to="/products" className="text-[11px] font-bold text-brand-700 hover:underline">View all →</Link>
          </div>
          {productNavItems.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.to}
                to={p.to}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-paper transition-colors group"
              >
                <span className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 grid place-items-center ring-1 ring-brand-100 group-hover:bg-gradient-to-br group-hover:from-brand-500 group-hover:to-brand-700 group-hover:text-white transition-all">
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-ink-900">{p.name}</div>
                  <div className="text-[11px] text-ink-500 truncate">{p.desc}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-ink-300 group-hover:text-brand-700 group-hover:translate-x-0.5 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DesktopCta({ brand }: { brand: NavbarProps["brand"] }) {
  return (
    <div className="hidden lg:flex items-center gap-3">
      <ThemeToggle />
      <a href={`tel:${brand.phoneRaw}`} className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-800 hover:text-brand-700">
        <span className="h-8 w-8 rounded-full bg-brand-50 grid place-items-center ring-1 ring-brand-100">
          <Phone className="h-3.5 w-3.5 text-brand-700" />
        </span>
        <span className="hidden xl:inline">{brand.phoneDisplay.replace("+91 ", "")}</span>
      </a>
      <Button as="a" href="#consultation" size="md" trailingArrow>
        Get Free Quote
      </Button>
    </div>
  );
}

function MobileMenu({ onClose, brand }: { onClose: () => void; brand: NavbarProps["brand"] }) {
  const [home, about, ...rest] = mainNav;
  return (
    <div className="lg:hidden fixed inset-x-0 top-[68px] bottom-0 bg-white overflow-y-auto animate-fade-up" style={{ animationDuration: ".3s" }}>
      <div className="px-5 py-6 space-y-1">
        <NavLink to={home.to} end className="block py-4 px-2 text-xl font-bold text-ink-900 border-b hairline">{home.label}</NavLink>
        <NavLink to={about.to} className="block py-4 px-2 text-xl font-bold text-ink-900 border-b hairline">{about.label}</NavLink>

        <details className="group border-b hairline">
          <summary className="cursor-pointer list-none py-4 px-2 text-xl font-bold text-ink-900 flex items-center justify-between">
            Solar Solutions <ChevronDown className="h-5 w-5 group-open:rotate-180 transition" />
          </summary>
          <div className="pb-3 space-y-1">
            {solarSolutions.map((s) => {
              const Icon = s.icon;
              return (
                <Link key={s.name} to={s.to} className="flex items-center gap-3 py-3 px-2 rounded-xl text-base text-ink-700 hover:bg-paper">
                  <Icon className="h-4 w-4 text-brand-600" /> {s.name}
                </Link>
              );
            })}
          </div>
        </details>

        <details className="group border-b hairline">
          <summary className="cursor-pointer list-none py-4 px-2 text-xl font-bold text-ink-900 flex items-center justify-between">
            Products <ChevronDown className="h-5 w-5 group-open:rotate-180 transition" />
          </summary>
          <div className="pb-3 space-y-1">
            <Link to="/products" className="flex items-center gap-3 py-3 px-2 rounded-xl text-base font-bold text-brand-700 hover:bg-paper">
              All products →
            </Link>
            {productNavItems.map((p) => {
              const Icon = p.icon;
              return (
                <Link key={p.to} to={p.to} className="flex items-center gap-3 py-3 px-2 rounded-xl text-base text-ink-700 hover:bg-paper">
                  <Icon className="h-4 w-4 text-brand-600" /> {p.name}
                </Link>
              );
            })}
          </div>
        </details>

        {rest.map((l) => (
          <NavLink key={l.to} to={l.to} className="block py-4 px-2 text-xl font-bold text-ink-900 border-b hairline">{l.label}</NavLink>
        ))}

        <div className="pt-6 space-y-3">
          <Button as="a" href="#consultation" className="w-full text-center justify-center" onClick={onClose}>
            Get Free Consultation
          </Button>
          <Button as="a" href={`tel:${brand.phoneRaw}`} variant="ghost" className="w-full text-center justify-center">
            Call {brand.phoneDisplay}
          </Button>
        </div>

        <div className="pt-8 mt-4 border-t hairline flex items-center gap-5 text-ink-500">
          <a href="#" aria-label="Facebook"><FacebookIcon className="h-4 w-4" /></a>
          <a href="#" aria-label="Instagram"><InstagramIcon className="h-4 w-4" /></a>
          <a href="#" aria-label="LinkedIn"><LinkedinIcon className="h-4 w-4" /></a>
          <a href="#" aria-label="Twitter"><TwitterIcon className="h-4 w-4" /></a>
        </div>
      </div>
    </div>
  );
}
