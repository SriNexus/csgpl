/**
 * Site configuration — global brand, contact & SEO data.
 * CMS-ready: this is the single source of truth for cross-section content.
 * When the admin CMS lands, this file becomes the local mirror / fallback.
 */

export const site = {
  brand: {
    name: "CHAITANYASRI",
    legalName: "ChaitanyaSri Greentech Private Limited",
    short: "CSGPL",
    tagline: "Premium Solar EPC Solutions India",
    established: 2018,
  },
  contact: {
    phonePrimary: "+91 93058 06938",
    phonePrimaryRaw: "+919305806938",
    phones: ["+91-542-4052114", "+91-522-3504098", "+91 93058 06938"],
    email: "info@csgpl.in",
    whatsapp: "https://wa.me/919305806938",
    whatsappWithMsg: "https://wa.me/919305806938?text=Hi%20CSGPL%2C%20I%27m%20interested%20in%20solar%20solutions.",
  },
  offices: [
    {
      label: "Corporate Office",
      tone: "brand" as const,
      address: "4/284, Sector-4, Gomti Nagar Vistar, Lucknow, Uttar Pradesh – 226010",
    },
    {
      label: "Head Office",
      tone: "amber" as const,
      address: "Pama Complex, D.L.W. Lahartara Road, Shivdaspur, Varanasi, U.P. – 221103",
    },
  ],
  social: [
    { name: "Facebook",  href: "#" },
    { name: "Instagram", href: "#" },
    { name: "LinkedIn",  href: "#" },
    { name: "Twitter",   href: "#" },
    { name: "WhatsApp",  href: "https://wa.me/919305806938" },
  ],
  trust: {
    rating: 4.9,
    reviewsCount: 500,
    capacityInstalledMW: 5,
    yearsWarranty: 25,
  },
} as const;

export type Site = typeof site;
