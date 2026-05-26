import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import Logo from "./Logo";
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon, WhatsappIcon } from "./SocialIcons";
import { footerLinks } from "@/data/navigation";

/* ============================================================
   Footer — premium dark editorial.
   Pure presentation; receives all content via props.
   ============================================================ */

export interface FooterProps {
  brand: { brandName: string; legalName: string; established: number };
  description: string;
  contact: { phones: readonly string[]; email: string };
  offices: { label: string; tone: "brand" | "amber"; address: string }[];
  links:   { label: string; href: string }[];
  primaryPhoneRaw: string;
  /** Optional uploaded logo URL — falls back to inline SVG when empty. */
  logoUrl?: string;
}

export default function Footer(props: FooterProps) {
  return (
    <footer className="relative bg-[#050912] text-white overflow-hidden">
      <FooterBackdrop />

      <div className="relative mx-auto max-w-7xl px-6 pt-14 pb-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
        <BrandCol brand={props.brand} description={props.description} logoUrl={props.logoUrl} />
        <ProductsCol />
        <LinksCol links={props.links} />
        <ContactCol contact={props.contact} />
        <OfficeCol offices={props.offices} />
      </div>

      <BottomBar legalName={props.brand.legalName} />
    </footer>
  );
}

/* ----- decomposed pieces ----- */

function FooterBackdrop() {
  return (
    <>
      <div className="absolute inset-0 bg-grid opacity-[0.04]" />
      <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-brand-500/15 blur-[120px]" />
      <div className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-amber-500/10 blur-[120px]" />
      <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none" />
    </>
  );
}



function BrandCol({
  brand, description, logoUrl,
}: { brand: FooterProps["brand"]; description: string; logoUrl?: string }) {
  return (
    <div className="md:col-span-3">
      <div className="bg-white/95 rounded-2xl p-3 inline-block">
        <Logo src={logoUrl} slot="logoDark" />
      </div>
      <p className="mt-6 text-[15px] text-white/60 leading-[1.7] max-w-sm">{description}</p>
      <div className="mt-6 flex items-center gap-2.5">
        {[FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon, WhatsappIcon].map((Icon, i) => (
          <a key={i} href="#" className="h-9 w-9 grid place-items-center rounded-xl bg-white/[0.04] hover:bg-brand-500 transition-colors border border-white/[0.08] text-white/70 hover:text-white">
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>
      <div className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/40">
        <span className="h-px w-8 bg-white/15" /> Estd. {brand.established} · India
      </div>
    </div>
  );
}

function ColumnHeader({ children }: { children: React.ReactNode }) {
  return <h4 className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40 mb-5">{children}</h4>;
}

function ProductsCol() {
  return (
    <div className="md:col-span-2">
      <ColumnHeader>Products</ColumnHeader>
      <ul className="space-y-3.5 text-[15px] text-white/75">
        {footerLinks.products.map((l) => (
          <li key={l.label}>
            <Link to={l.href} className="group inline-flex items-center gap-2 hover:text-white transition-colors">
              {l.label}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-400" />
            </Link>
          </li>
        ))}
        <li><Link to="/products" className="hover:text-white font-bold text-brand-300">All Products →</Link></li>
      </ul>
    </div>
  );
}

function LinksCol({ links }: { links: FooterProps["links"] }) {
  return (
    <div className="md:col-span-2">
      <ColumnHeader>Explore</ColumnHeader>
      <ul className="space-y-3.5 text-[15px] text-white/75">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="group inline-flex items-center gap-2 hover:text-white transition-colors">
              {l.label}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-400" />
            </a>
          </li>
        ))}
        <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
      </ul>
    </div>
  );
}

function ContactCol({ contact }: { contact: FooterProps["contact"] }) {
  return (
    <div className="md:col-span-2">
      <ColumnHeader>Contact</ColumnHeader>
      <ul className="space-y-4 text-[15px] text-white/75">
        <li className="flex items-start gap-3">
          <span className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/[0.08] grid place-items-center shrink-0">
            <Phone className="h-4 w-4 text-brand-400" />
          </span>
          <div className="leading-relaxed">
            {contact.phones.map((p, i) => (
              <a key={p} href={`tel:${p.replace(/[\s-]/g, "")}`} className={`block hover:text-white ${i === contact.phones.length - 1 ? "font-bold" : ""}`}>
                {p}
              </a>
            ))}
          </div>
        </li>
        <li className="flex items-center gap-3">
          <span className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/[0.08] grid place-items-center shrink-0">
            <Mail className="h-4 w-4 text-brand-400" />
          </span>
          <a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a>
        </li>
      </ul>
    </div>
  );
}

function OfficeCol({ offices }: { offices: FooterProps["offices"] }) {
  return (
    <div className="md:col-span-3">
      <ColumnHeader>Offices</ColumnHeader>
      <ul className="space-y-6 text-[14px] text-white/65 leading-relaxed">
        {offices.map((o) => (
          <li key={o.label}>
            <div className="flex items-center gap-2 mb-1.5">
              <MapPin className={`h-3.5 w-3.5 ${o.tone === "brand" ? "text-brand-400" : "text-amber-400"}`} />
              <span className="text-[10px] uppercase tracking-[0.2em] text-white font-bold">{o.label}</span>
            </div>
            <p>{o.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BottomBar({ legalName }: { legalName: string }) {
  return (
    <div className="relative border-t border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-white/50">
        <p>© 2023 {legalName} — All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Use</a>
          <Link to="/admin" className="hover:text-brand-300">Admin</Link>
        </div>
      </div>
    </div>
  );
}
