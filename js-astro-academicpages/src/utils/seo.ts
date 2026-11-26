import type { AuthorConfig } from '@data/siteConfig';
import { siteConfig } from '@data/siteConfig';
import { resolveExternalUrl, resolveUrl } from '@utils/url';

export type SchemaOrgNode = Record<string, unknown>;

export interface CitationMetadata {
  title?: string;
  author?: string;
  publicationDate?: string;
  journalTitle?: string;
  conferenceTitle?: string;
  pdfUrl?: string;
  venue?: string;
}

function resolveSchemaImage(
  siteBase: string,
  imageUrl?: string
): string | undefined {
  if (!imageUrl) return undefined;

  return imageUrl.startsWith('http')
    ? imageUrl
    : new URL(resolveUrl(imageUrl), siteBase).toString();
}

/**
 * Builds standard Person schema for the site author
 */
export function buildPersonSchema(
  siteBase: string,
  author: AuthorConfig = siteConfig.author,
  avatarUrl?: string
): SchemaOrgNode {
  const sameAsLinks: string[] = [];
  if (author.github)
    sameAsLinks.push(resolveExternalUrl(author.github, 'https://github.com/'));
  if (author.linkedin) {
    sameAsLinks.push(
      resolveExternalUrl(author.linkedin, 'https://www.linkedin.com/in/')
    );
  }
  if (author.orcid)
    sameAsLinks.push(resolveExternalUrl(author.orcid, 'https://orcid.org/'));
  if (author.googlescholar) {
    sameAsLinks.push(
      resolveExternalUrl(
        author.googlescholar,
        'https://scholar.google.com/citations?user='
      )
    );
  }
  if (author.arxiv)
    sameAsLinks.push(resolveExternalUrl(author.arxiv, 'https://arxiv.org/a/'));
  if (author.dblp)
    sameAsLinks.push(resolveExternalUrl(author.dblp, 'https://dblp.org/pid/'));
  if (author.researchgate) {
    sameAsLinks.push(
      resolveExternalUrl(
        author.researchgate,
        'https://www.researchgate.net/profile/'
      )
    );
  }
  if (author.semantic) {
    sameAsLinks.push(
      resolveExternalUrl(
        author.semantic,
        'https://www.semanticscholar.org/author/'
      )
    );
  }

  return {
    '@type': 'Person',
    '@id': `${siteBase}#author`,
    name: author.name,
    url: siteBase,
    image: resolveSchemaImage(siteBase, avatarUrl),
    jobTitle: author.employer,
    description: author.bio,
    sameAs: sameAsLinks.length > 0 ? sameAsLinks : undefined,
  };
}

/**
 * Builds WebSite schema
 */
export function buildWebSiteSchema(siteBase: string): SchemaOrgNode {
  return {
    '@type': 'WebSite',
    '@id': `${siteBase}#website`,
    name: siteConfig.title,
    url: siteBase,
    description: siteConfig.description,
    inLanguage: siteConfig.locale,
    publisher: { '@id': `${siteBase}#author` },
  };
}

/**
 * Builds ProfilePage schema for author bio / cv / homepage
 */
export function buildProfilePageSchema(
  canonicalUrl: string,
  siteBase: string,
  title: string,
  description?: string
): SchemaOrgNode {
  return {
    '@type': 'ProfilePage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: title,
    description: description || siteConfig.description,
    mainEntity: { '@id': `${siteBase}#author` },
    isPartOf: { '@id': `${siteBase}#website` },
  };
}

/**
 * Builds ScholarlyArticle schema for publications
 */
export function buildScholarlyArticleSchema(
  canonicalUrl: string,
  siteBase: string,
  citation: CitationMetadata,
  description?: string,
  imageUrl?: string
): SchemaOrgNode {
  const authorName = citation.author || siteConfig.author.name;

  return {
    '@type': 'ScholarlyArticle',
    '@id': `${canonicalUrl}#article`,
    headline: citation.title,
    name: citation.title,
    author: { '@type': 'Person', name: authorName },
    datePublished: citation.publicationDate,
    description,
    image: resolveSchemaImage(siteBase, imageUrl),
    url: canonicalUrl,
    isPartOf:
      citation.journalTitle || citation.venue
        ? {
            '@type': 'Periodical',
            name: citation.journalTitle || citation.venue,
          }
        : undefined,
    publisher: { '@id': `${siteBase}#author` },
    mainEntityOfPage: canonicalUrl,
  };
}

/**
 * Builds Course schema for teaching items
 */
export function buildCourseSchema(
  canonicalUrl: string,
  siteBase: string,
  title: string,
  description?: string,
  provider?: string,
  term?: string
): SchemaOrgNode {
  return {
    '@type': 'Course',
    '@id': `${canonicalUrl}#course`,
    name: title,
    description: description || title,
    url: canonicalUrl,
    provider: provider
      ? { '@type': 'EducationalOrganization', name: provider }
      : { '@id': `${siteBase}#author` },
    coursePrerequisites: term ? `Term: ${term}` : undefined,
    instructor: { '@id': `${siteBase}#author` },
  };
}

/**
 * Builds EducationEvent / Event schema for talks and tutorials
 */
export function buildEventSchema(
  canonicalUrl: string,
  siteBase: string,
  title: string,
  date?: string | Date,
  location?: string,
  description?: string
): SchemaOrgNode {
  const isoDate =
    date instanceof Date
      ? date.toISOString().split('T')[0]
      : typeof date === 'string'
        ? date
        : undefined;

  return {
    '@type': 'EducationEvent',
    '@id': `${canonicalUrl}#event`,
    name: title,
    description: description || title,
    startDate: isoDate,
    url: canonicalUrl,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: location ? { '@type': 'Place', name: location } : undefined,
    organizer: { '@id': `${siteBase}#author` },
  };
}

/**
 * Builds BlogPosting schema for blog posts
 */
export function buildBlogPostingSchema(
  canonicalUrl: string,
  siteBase: string,
  title: string,
  datePublished?: string | Date,
  dateModified?: string | Date,
  description?: string,
  imageUrl?: string
): SchemaOrgNode {
  const publishedIso =
    datePublished instanceof Date
      ? datePublished.toISOString()
      : typeof datePublished === 'string'
        ? datePublished
        : undefined;

  const modifiedIso =
    dateModified instanceof Date
      ? dateModified.toISOString()
      : typeof dateModified === 'string'
        ? dateModified
        : publishedIso;

  return {
    '@type': 'BlogPosting',
    '@id': `${canonicalUrl}#article`,
    headline: title,
    name: title,
    description,
    image: resolveSchemaImage(siteBase, imageUrl),
    datePublished: publishedIso,
    dateModified: modifiedIso,
    url: canonicalUrl,
    author: { '@id': `${siteBase}#author` },
    publisher: { '@id': `${siteBase}#author` },
    mainEntityOfPage: canonicalUrl,
  };
}

/**
 * Builds CreativeWork / SoftwareSourceCode schema for portfolio items
 */
export function buildCreativeWorkSchema(
  canonicalUrl: string,
  siteBase: string,
  title: string,
  description?: string,
  date?: string | Date,
  imageUrl?: string,
  codeUrl?: string
): SchemaOrgNode {
  const isoDate =
    date instanceof Date
      ? date.toISOString().split('T')[0]
      : typeof date === 'string'
        ? date
        : undefined;

  const type = codeUrl ? 'SoftwareSourceCode' : 'CreativeWork';

  return {
    '@type': type,
    '@id': `${canonicalUrl}#work`,
    name: title,
    description,
    dateCreated: isoDate,
    image: resolveSchemaImage(siteBase, imageUrl),
    url: canonicalUrl,
    codeRepository: codeUrl,
    creator: { '@id': `${siteBase}#author` },
  };
}
