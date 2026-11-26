import { SITE } from "../config";

/**
 * schema.org RealEstateAgent built from src/config.ts.
 * No aggregateRating on purpose: search engines ignore ratings a business publishes about itself.
 */
export function agentJsonLd(site: URL) {
  const { address } = SITE;
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": new URL("/#agent", site).href,
    name: SITE.name,
    description: SITE.description,
    url: new URL("/", site).href,
    telephone: SITE.phone.tel,
    email: SITE.email,
    image: new URL("/og.jpg", site).href,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    areaServed: SITE.areaServed,
    // Only real profile URLs belong here; the demo's root-domain placeholders are skipped.
    sameAs: SITE.social.map((s) => s.href).filter((href) => new URL(href).pathname.length > 1),
  };
}

/** JSON for a <script type="application/ld+json">, safe against "</script>" in config strings. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
