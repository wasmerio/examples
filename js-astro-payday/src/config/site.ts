export const siteConfig = {
  name: "Payday",
  title: "Payday - A free Astro theme for SaaS and product sites",
  description:
    "Payday runs payroll for teams in 140 countries: on-time pay, automatic tax filings, time off and benefits in one place.",
  siteUrl: "https://payday.xocoweb.workers.dev",
  language: "en",
  locale: "en_US",
  socialImage: "/og-image.png",
  /** The main call to action, used in the header, the hero, pricing and the closing panel. */
  cta: { label: "Get started", href: "#" },
  signIn: { label: "Log in", href: "#" },
  /** The contact page form. It stays disabled until `enabled` is true and `action` is set. */
  contact: {
    enabled: false,
    action: "",
    method: "post",
  },
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com" },
    { label: "X", href: "https://x.com" },
    { label: "GitHub", href: "https://github.com" },
  ],
};

export interface NavLink {
  label: string;
  href: string;
}

export const navigation: NavLink[] = [
  { label: "Product", href: "/#product" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];

export const footerNavigation: NavLink[] = [
  { label: "Product", href: "/#product" },
  { label: "Global payroll", href: "/#global" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];
