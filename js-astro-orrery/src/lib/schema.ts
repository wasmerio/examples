import { SITE } from "../config";

const DAY_NAMES = { Mo: "Monday", Tu: "Tuesday", We: "Wednesday", Th: "Thursday", Fr: "Friday", Sa: "Saturday", Su: "Sunday" } as const;

/**
 * schema.org ProfessionalService (or another LocalBusiness subtype) built from src/config.ts.
 * No aggregateRating on purpose: search engines ignore ratings a business publishes about itself.
 */
export function businessJsonLd(site: URL) {
  const { address } = SITE;
  return {
    "@context": "https://schema.org",
    "@type": SITE.schemaType,
    "@id": new URL("/#business", site).href,
    name: SITE.name,
    description: SITE.description,
    url: new URL("/", site).href,
    telephone: SITE.phone.tel,
    email: SITE.email,
    image: new URL("/og.png", site).href,
    logo: new URL("/apple-touch-icon.png", site).href,
    priceRange: SITE.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    areaServed: SITE.areaServed,
    openingHoursSpecification: SITE.hours
      .filter((h) => h.opens && h.closes)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.days.map((d) => `https://schema.org/${DAY_NAMES[d]}`),
        opens: h.opens,
        closes: h.closes,
      })),
    // Only real profile URLs belong here; the demo's root-domain placeholders are skipped.
    sameAs: SITE.social.map((s) => s.href).filter((href) => new URL(href).pathname.length > 1),
  };
}

/** JSON for a <script type="application/ld+json">, safe against "</script>" in config strings. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
