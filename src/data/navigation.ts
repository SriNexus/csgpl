import { Home, Building2, Factory, Zap, Battery, Sun, type LucideIcon } from "lucide-react";
import { productCategories } from "./productsCatalog";

export type NavLink = { label: string; to: string };

export const mainNav: NavLink[] = [
  { label: "Home",            to: "/" },
  { label: "About",           to: "/about" },
  // "Solar Solutions" is rendered as a dropdown (see solarSolutions)
  // "Products" is rendered as a dropdown (see productNavItems)
  { label: "Solar For Need",  to: "/solar-for-need" },
  { label: "Blog",            to: "/blog" },
  { label: "Contact",         to: "/contact" },
];

/** Product-category items used in the Navbar Products dropdown. */
export type ProductNavItem = { name: string; desc: string; to: string; icon: LucideIcon };

export const productNavItems: ProductNavItem[] = productCategories.map((c) => ({
  name: c.name,
  desc: c.tagline,
  to:   `/products/${c.slug}`,
  icon: c.icon,
}));

export type SolutionItem = {
  name: string;
  desc: string;
  to: string;
  icon: LucideIcon;
};

export const solarSolutions: SolutionItem[] = [
  { name: "Residential Solar",      icon: Home,      desc: "Rooftop systems for Indian homes",   to: "/solutions/residential" },
  { name: "Commercial Solar",       icon: Building2, desc: "For shops, offices & retail",        to: "/solutions/commercial" },
  { name: "Industrial Solar EPC",   icon: Factory,   desc: "MW-scale for factories & MSMEs",     to: "/solutions/industrial" },
  { name: "On-Grid Solar System",   icon: Zap,       desc: "Net metering · sell to grid",        to: "/solutions/on-grid" },
  { name: "Off-Grid Solar System",  icon: Battery,   desc: "Standalone · total independence",    to: "/solutions/off-grid" },
  { name: "Hybrid Solar System",    icon: Sun,       desc: "Grid + battery · TOU optimisation",  to: "/solutions/hybrid" },
];

export const footerLinks = {
  explore: [
    { label: "Solar for Homes",        href: "/#solutions" },
    { label: "Housing Society",        href: "/#solutions" },
    { label: "Commercial Solar",       href: "/#solutions" },
    { label: "Industrial Solar",       href: "/#solutions" },
    { label: "Net Metering",           href: "/#consultation" },
  ],
  /** Quick links to every product category — used in the footer. */
  products: productCategories.map((c) => ({
    label: c.name,
    href:  `/products/${c.slug}`,
  })),
};
