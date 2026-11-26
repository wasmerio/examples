import { services } from "@/config/services";

export const siteConfig = {
  name: "Lucenta",
  /** The company's full name, used in the footer and the legal line. */
  legalName: "Lucenta Studio Ltd",
  tagline: "Brand and digital design studio",
  /** A sentence under the logo in the footer. */
  summary:
    "An independent design studio in Lisbon and New York, building brands, websites and packaging that are impossible to scroll past.",
  title: "Lucenta - An Astro theme for design studios, agencies and portfolios",
  description:
    "Lucenta is an independent brand and digital design studio in Lisbon and New York. We make identities, websites, packaging and campaigns for companies that would rather be seen.",
  siteUrl: "https://lucenta.xocoweb.workers.dev",
  language: "en",
  locale: "en_GB",
  dateLocale: "en-GB",
  socialImage: "/og-image.png",
  email: "hello@example.com",
  /** The call to action in the header, the menu and the footer. */
  action: { label: "Start a project", href: "/contact/" },
  /** The short line beside the status dot in the header and hero. Leave empty to hide both. */
  availability: "Booking projects for February 2027",
  /** The contact form. It stays disabled until `enabled` is true and `action` is set. */
  contact: {
    enabled: false,
    action: "",
    method: "post",
  },
  studios: [
    {
      city: "Lisbon",
      address: ["Rua das Flores 28", "1200-195 Lisboa"],
      phone: "+351 000 000 000",
      timeZone: "Europe/Lisbon",
    },
    {
      city: "New York",
      address: ["87 Kent Avenue", "Brooklyn, NY 11249"],
      phone: "(123) 000-0100",
      timeZone: "America/New_York",
    },
  ],
  socials: [
    { label: "Instagram", href: "#" },
    { label: "Behance", href: "#" },
    { label: "Dribbble", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
};

export interface NavLink {
  label: string;
  href: string;
}

export const navigation: NavLink[] = [
  { label: "Work", href: "/work/" },
  { label: "Services", href: "/services/" },
  { label: "Studio", href: "/studio/" },
  { label: "Journal", href: "/journal/" },
  { label: "Contact", href: "/contact/" },
];

export interface NavColumn {
  title: string;
  links: NavLink[];
}

export const footerNavigation: NavColumn[] = [
  {
    title: "Studio",
    links: [
      { label: "Work", href: "/work/" },
      { label: "Studio", href: "/studio/" },
      { label: "Journal", href: "/journal/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
  {
    title: "Services",
    links: services.map((service) => ({ label: service.title, href: `/services/#${service.key}` })),
  },
];

/** The small links under the footer. */
export const legalNavigation: NavLink[] = [
  { label: "Privacy", href: "/legal/privacy/" },
  { label: "Terms", href: "/legal/terms/" },
];
