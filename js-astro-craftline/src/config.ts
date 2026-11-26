/**
 * Craftline — the one file to edit when you rebrand the theme.
 *
 * Everything here is sample data for a fictional business. Phone numbers use the
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

export const SITE = {
  name: "Northside Plumbing & Heating",
  /** Short name for the logo on small screens. */
  shortName: "Northside",
  tagline: "Plumbing and heating repairs, priced before we start",
  description:
    "Licensed plumbers in Fernhollow for leaks, blocked drains, water heaters and boilers. Written fixed price before any work, two-year guarantee on labor.",
  /** Your production URL. Used for canonical links, Open Graph, the sitemap and the form redirect. */
  url: "https://example.com",
  lang: "en",
  locale: "en_US",
  /** schema.org type for the JSON-LD block: "Plumber", "Electrician", "HVACBusiness", "HousePainter", "RoofingContractor", "GeneralContractor" or "LocalBusiness". */
  schemaType: "Plumber",
  priceRange: "$$",

  phone: { display: "(555) 555-0142", tel: "+15555550142" },
  emergencyPhone: { display: "(555) 555-0199", tel: "+15555550199" },
  email: "hello@example.com",

  address: {
    street: "214 Copperline Road",
    city: "Fernhollow",
    region: "OR",
    postalCode: "97000",
    country: "US",
  },

  /** Towns and neighborhoods you cover. Shown on the home page, in the footer and in JSON-LD. */
  serviceAreas: [
    "Fernhollow",
    "North Fernhollow",
    "Cedar Bluff",
    "Millbrook Heights",
    "Ashby Crossing",
    "Larkspur Valley",
    "Quarry Hill",
    "Saltmarsh Point",
  ],

  hours: [
    { label: "Mon – Fri", days: ["Mo", "Tu", "We", "Th", "Fr"], opens: "07:00", closes: "18:00" },
    { label: "Saturday", days: ["Sa"], opens: "08:00", closes: "14:00" },
    { label: "Sunday", days: ["Su"] },
  ] as OpeningHours[],
  /** One line under the hours. Set to "" to hide. */
  hoursNote: "Emergency line open 24/7, including holidays.",

  /** Root domains only — replace with your own profile URLs. */
  social: [
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
  ],

  /** Trust strip. These are SAMPLE figures — replace them with your real ones. */
  trust: {
    license: "PL-000000",
    years: 25,
    jobs: 12000,
    rating: 4.9,
    reviewCount: 200,
    responseMinutes: 60,
    /** Call-out fee, shown in the hero and FAQ. */
    callOut: "$129",
    /** Small caption under the strip. Set to "" once the figures are real. */
    note: "Sample figures for the Craftline demo.",
  },

  /**
   * One vivid accent for highlighted words, buttons and the solid service cards.
   * `accentText` is the text color on accent fills: keep a contrast ratio of at least 4.5:1
   * (the default dark navy on safety orange is about 7:1).
   */
  theme: { accent: "#ff7a29", accentText: "#0b0e1c" },

  /**
   * Quote form. PUBLIC_FORMGONG_ACCESS_KEY in .env wins over `accessKey`.
   * The key (fk_…) is public by design: it only lets visitors send submissions to your form.
   */
  formgong: {
    accessKey: "fk_your_access_key",
    endpoint: "https://formgong.com/submit",
    subject: "New quote request from the website",
  },

  nav: [
    { label: "Services", href: "/services/" },
    { label: "About", href: "/about/" },
    { label: "Contact", href: "/contact/" },
  ],
} as const;

export type SiteConfig = typeof SITE;
