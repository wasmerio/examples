/**
 * The single source of truth for the business.
 *
 * Everything a search engine or an AI assistant needs to know lives here: NAP
 * (name, address, phone), opening hours, service area. Fill it in once; the
 * layout, schema, footer and llms.txt all read from it, so they can never
 * disagree with each other.
 *
 * The values below are placeholders. Replace every one before deploying —
 * search engines cross-check the address here against your Google Business
 * Profile, and mismatches cost you local rankings.
 */

export type OpeningHours = {
  /** Schema.org day names, e.g. ["Monday", "Tuesday"] */
  days: string[];
  opens: string;
  closes: string;
};

export const site = {
  /** Legal or trading name exactly as it appears on Google Business Profile. */
  name: "Muster Sanitär AG",
  url: "https://example.ch",
  /** Shown in <title>, the hero and llms.txt. Include the city you serve. */
  tagline: "Sanitär, Heizung und Notdienst in Musterstadt",
  description:
    "Sanitär- und Heizungsinstallation in Musterstadt und Umgebung. Notdienst an 7 Tagen, Festpreise vor Beginn der Arbeit.",

  phone: "+41 00 000 00 00",
  email: "info@example.ch",

  address: {
    street: "Musterstrasse 1",
    zip: "0000",
    city: "Musterstadt",
    /** ISO 3166-1 alpha-2. Used verbatim in schema and llms.txt. */
    country: "CH",
    region: "Musterkanton",
  },

  /**
   * Coordinates of the business location (not a service area). Optional:
   * leave null until you can copy the exact pair from your Google Business
   * Profile, and the schema block omits `geo` entirely.
   */
  geo: null as { lat: number; lng: number } | null,

  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:30", closes: "17:00" },
    { days: ["Saturday"], opens: "09:00", closes: "13:00" },
  ] as OpeningHours[],

  /** A range, not a single number. */
  priceRange: "CHF 90–140 pro Stunde",

  /**
   * The places you actually serve. These become `areaServed` in the schema and
   * are what you should write location pages for — one city per page, each
   * with something true about that city.
   */
  areaServed: ["Musterstadt", "Beispieldorf", "Beispielheim"],

  /** Only verified profiles. Schema `sameAs` is a trust signal; wrong URLs hurt. */
  sameAs: [
    // "https://www.google.com/maps/place/...",
    // "https://www.linkedin.com/company/...",
  ],

  locale: "de_CH",
  /** Optional: set this to a form backend URL (Formspree, Web3Forms, a Worker). */
  formEndpoint: "",
} as const;

export const absoluteUrl = (path: string) => new URL(path, site.url).href;
