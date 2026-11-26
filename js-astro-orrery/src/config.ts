/**
 * Orrery: the one file to edit when you rebrand the theme.
 *
 * Everything here is sample data for a fictional consultancy. Phone numbers use the
 * 555-01xx range reserved for fiction, and every email and URL uses example.com.
 */

export type Day = "Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa" | "Su";

export interface OpeningHours {
  /** Shown on the page, e.g. "Mon – Fri". */
  label: string;
  days: Day[];
  /** 24h "HH:MM". Leave both out for a closed day. */
  opens?: string;
  closes?: string;
}

export interface Stat {
  value: number;
  /** Printed right after the number, e.g. "+" or "%". */
  suffix?: string;
  label: string;
}

export const SITE = {
  name: "Quillmoor Analytics",
  /** Short name for the logo on small screens. */
  shortName: "Quillmoor",
  tagline: "Forecasting, pricing and reporting for firms without a data team",
  description:
    "A five-person data and strategy consultancy in Port Alder. Demand forecasts, pricing, experiments and reporting for companies of 20 to 500 people, each scoped to a fixed price before work starts.",
  /** Your production URL. Used for canonical links, Open Graph, the sitemap and the form redirect. */
  url: "https://example.com",
  lang: "en",
  locale: "en_US",
  /** schema.org type for the JSON-LD block, e.g. "ProfessionalService", "AccountingService", "LegalService" or "LocalBusiness". */
  schemaType: "ProfessionalService",
  priceRange: "$$$",

  phone: { display: "(555) 555-0167", tel: "+15555550167" },
  email: "hello@example.com",

  address: {
    street: "18 Wharf Lane, Suite 4",
    city: "Port Alder",
    region: "WA",
    postalCode: "98000",
    country: "US",
  },
  /** Where you work. Shown on the contact page and in JSON-LD `areaServed`. */
  areaServed: "United States and Canada, remote first",

  hours: [
    { label: "Mon – Fri", days: ["Mo", "Tu", "We", "Th", "Fr"], opens: "09:00", closes: "17:30" },
    { label: "Sat – Sun", days: ["Sa", "Su"] },
  ] as OpeningHours[],
  /** One line under the hours. Set to "" to hide. */
  hoursNote: "We answer every enquiry within one working day.",

  /** Root domains only: replace them with your own profile URLs. */
  social: [
    { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
    { label: "GitHub", href: "https://github.com", icon: "github" },
  ],

  /** The counters in the hero. These are SAMPLE figures: replace them with your real ones. A "|" in a label is where its line breaks. */
  stats: [
    { value: 14, label: "years of|experience" },
    { value: 86, label: "projects|delivered" },
    { value: 112, label: "models now|in use" },
    { value: 5, label: "consultants|on staff" },
  ] as Stat[],
  /** Small caption under the counters. Set to "" once the figures are real. */
  statsNote: "Sample figures for the Orrery demo.",

  /**
   * One accent for highlighted words, buttons, the service cards and the process panel.
   * `accentText` is the text color on accent fills: keep a contrast ratio of at least 4.5:1
   * (the default near-black on lime is about 17:1).
   */
  theme: { accent: "#dcfd35", accentText: "#040319" },

  /**
   * Contact form. PUBLIC_FORMGONG_ACCESS_KEY in .env wins over `accessKey`.
   * The key (fk_…) is public by design: it only lets visitors send submissions to your form.
   */
  formgong: {
    accessKey: "fk_your_access_key",
    endpoint: "https://formgong.com/submit",
    subject: "New enquiry from the website",
  },

  nav: [
    { label: "services", href: "/services/" },
    { label: "about", href: "/about/" },
    { label: "contact", href: "/contact/" },
  ],
  /** The lime button in the header and footer. */
  cta: { label: "Book a call", href: "/contact/#enquiry" },
} as const;

export type SiteConfig = typeof SITE;
