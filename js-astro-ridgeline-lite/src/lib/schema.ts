import { siteConfig } from '../config/site';
import { getAggregateRating } from './reviews';

/**
 * Basic RoofingContractor structured data, rendered on every page.
 * NAP, hours, and geo come from src/config/site.ts. The Pro version
 * adds per-city Service entities, FAQPage, Article, and project
 * ImageGallery markup.
 */
export async function buildRoofingContractor(site: URL) {
  const rating = await getAggregateRating();
  const { address, geo } = siteConfig;

  return {
    '@context': 'https://schema.org',
    '@type': 'RoofingContractor',
    '@id': new URL('/#roofingcontractor', site).href,
    name: siteConfig.name,
    description: siteConfig.seo.defaultDescription,
    url: site.href,
    telephone: siteConfig.phoneHref.replace('tel:', ''),
    email: siteConfig.email,
    image: new URL(siteConfig.seo.ogImage, site).href,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    openingHours: siteConfig.openingHoursSchema,
    sameAs: Object.values(siteConfig.social),
    ...(rating.count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.average,
        reviewCount: rating.count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}
