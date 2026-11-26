import { site } from "../config";

/**
 * JSON-LD builders. Kept dependency-free on purpose: schema is plain data, and
 * a build-time object is easier to verify than a runtime library.
 *
 * Rule of thumb: exactly one valid block per page. Emitting three competing
 * LocalBusiness nodes is worse than emitting none.
 */

const postalAddress = () => ({
  "@type": "PostalAddress",
  streetAddress: site.address.street,
  postalCode: site.address.zip,
  addressLocality: site.address.city,
  addressRegion: site.address.region,
  addressCountry: site.address.country,
});

export const localBusiness = (extra: Record<string, unknown> = {}) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${site.url}/#business`,
  name: site.name,
  description: site.description,
  url: site.url,
  ...(site.phone ? { telephone: site.phone } : {}),
  ...(site.email ? { email: site.email } : {}),
  ...(site.priceRange ? { priceRange: site.priceRange } : {}),
  address: postalAddress(),
  // Omitted entirely until real coordinates are supplied.
  ...(site.geo ? { geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng } } : {}),
  ...(site.areaServed.length > 0
    ? { areaServed: site.areaServed.map((name) => ({ "@type": "City", name })) }
    : {}),
  openingHoursSpecification: site.hours.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  })),
  ...(site.sameAs.length > 0 ? { sameAs: [...site.sameAs] } : {}),
  ...extra,
});

export const service = (input: { name: string; description: string; path: string }) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: input.name,
  description: input.description,
  url: new URL(input.path, site.url).href,
  serviceType: input.name,
  provider: { "@id": `${site.url}/#business` },
  ...(site.areaServed.length > 0
    ? { areaServed: site.areaServed.map((name) => ({ "@type": "City", name })) }
    : {}),
});

export const faqPage = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const breadcrumbs = (trail: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: new URL(item.path, site.url).href,
  })),
});
