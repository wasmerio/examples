import { site } from '../config/site';
import { absoluteUrl } from './url';

type Json = Record<string, unknown>;

export function websiteSchema(siteUrl: URL | undefined): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    description: site.description,
    url: absoluteUrl('/', siteUrl),
    inLanguage: site.lang,
  };
}

/**
 * Studio details for search engines. While `site.isDemo` is true the
 * placeholder address, phone and email are left out on purpose.
 */
export function businessSchema(siteUrl: URL | undefined): Json {
  const { contact } = site;
  const schema: Json = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': `${absoluteUrl('/', siteUrl)}#business`,
    name: site.name,
    description: site.description,
    url: absoluteUrl('/', siteUrl),
    image: absoluteUrl(site.seo.ogImage, siteUrl),
    openingHoursSpecification: site.hours.map((row) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: row.days,
      opens: row.opens,
      closes: row.closes,
    })),
    sameAs: site.socials.map((s) => s.href).filter((href) => /^https?:/.test(href)),
  };
  if (!site.isDemo) {
    Object.assign(schema, {
      email: contact.email,
      telephone: contact.phoneHref,
      address: {
        '@type': 'PostalAddress',
        streetAddress: contact.address.street,
        addressLocality: contact.address.locality,
        addressRegion: contact.address.region,
        postalCode: contact.address.postalCode,
        addressCountry: contact.address.country,
      },
    });
  }
  return schema;
}

export function breadcrumbSchema(items: Array<{ name: string; href: string }>, siteUrl: URL | undefined): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.href, siteUrl),
    })),
  };
}

export function blogPostingSchema(
  post: { title: string; description: string; image: string; author: string; pubDate: Date; updatedDate?: Date; path: string },
  siteUrl: URL | undefined,
): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: absoluteUrl(post.image, siteUrl),
    datePublished: post.pubDate.toISOString(),
    dateModified: (post.updatedDate ?? post.pubDate).toISOString(),
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: site.name, url: absoluteUrl('/', siteUrl) },
    mainEntityOfPage: absoluteUrl(post.path, siteUrl),
    inLanguage: site.lang,
  };
}
