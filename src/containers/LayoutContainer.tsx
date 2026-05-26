/**
 * LayoutContainer — orchestrates settings, footer and branding for the
 * public chrome (Navbar / Footer / FloatingButtons).
 *
 * The ONLY place that reads layout-related CMS hooks. Layout components
 * remain pure prop-driven presentation.
 */

import { useMemo } from "react";
import Navbar, { type NavbarProps } from "@/components/Navbar";
import Footer, { type FooterProps } from "@/components/Footer";
import FloatingButtons, { type FloatingButtonsProps } from "@/components/FloatingButtons";
import Favicon from "@/components/Favicon";
import { useCmsDocument } from "@/cms";
import { site } from "@/data/site";

export default function LayoutContainer({ children }: { children: React.ReactNode }) {
  const settingsDoc = useCmsDocument("settings");
  const footerDoc   = useCmsDocument("footer");
  const brandingDoc = useCmsDocument("branding");

  const navbarProps = useMemo<NavbarProps>(() => ({
    brand: {
      phoneDisplay: settingsDoc.data.phonePrimary,
      phoneRaw:     settingsDoc.data.phonePrimaryRaw,
      email:        settingsDoc.data.email,
      logoLight:    brandingDoc.data.logoLight     || undefined,
      logoCollapsed:brandingDoc.data.logoCollapsed || brandingDoc.data.logoLight || undefined,
    },
  }), [settingsDoc.data, brandingDoc.data]);

  const footerProps = useMemo<FooterProps>(() => ({
    brand: {
      legalName:    settingsDoc.data.legalName,
      brandName:    settingsDoc.data.brandName,
      established:  site.brand.established,
    },
    description: footerDoc.data.description,
    contact: {
      phones: site.contact.phones,
      email:  settingsDoc.data.email,
    },
    offices: [...site.offices],
    links:   footerDoc.data.links,
    primaryPhoneRaw: settingsDoc.data.phonePrimaryRaw,
    /** Footer always lives on dark surfaces — prefer the dark logo. */
    logoUrl: brandingDoc.data.logoDark || brandingDoc.data.logoLight || undefined,
  }), [settingsDoc.data, footerDoc.data, brandingDoc.data]);

  const floatingProps = useMemo<FloatingButtonsProps>(() => ({
    whatsappUrlWithMsg: site.contact.whatsappWithMsg,
    whatsappUrl:        site.contact.whatsapp,
    phoneDisplay:       settingsDoc.data.phonePrimary,
    phoneRaw:           settingsDoc.data.phonePrimaryRaw,
    email:              settingsDoc.data.email,
  }), [settingsDoc.data]);

  return (
    <>
      <Favicon />
      <Navbar {...navbarProps} />
      {children}
      <Footer {...footerProps} />
      <FloatingButtons {...floatingProps} />
    </>
  );
}
