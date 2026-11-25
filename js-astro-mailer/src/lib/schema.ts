import { siteConfig } from "@/config/site";
import { formatDate, issueHref, readMinutes, wordCount, type Issue } from "@/lib/issues";

const absolute = (path: string) => new URL(path, siteConfig.siteUrl).toString();

const publisher = () => ({
  "@type": "Organization",
  name: siteConfig.name,
  url: absolute("/"),
  logo: {
    "@type": "ImageObject",
    url: absolute(siteConfig.publisherLogo),
  },
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  alternateName: siteConfig.tagline,
  url: absolute("/"),
  description: siteConfig.description,
  inLanguage: siteConfig.language,
  publisher: publisher(),
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${absolute("/search/")}?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

/**
 * An issue is a `BlogPosting` with its number carried as `issueNumber`, so an
 * aggregator that understands periodicals still sees the ordering.
 */
export const issueSchema = (issue: Issue, imageUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: issue.data.title,
  description: issue.data.excerpt,
  image: [imageUrl],
  datePublished: issue.data.date.toISOString(),
  dateModified: (issue.data.updatedDate ?? issue.data.date).toISOString(),
  issueNumber: issue.data.issue,
  author: {
    "@type": "Person",
    name: issue.data.author.name,
    jobTitle: issue.data.author.role,
  },
  publisher: publisher(),
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": absolute(issueHref(issue)),
  },
  articleSection: issue.data.topic,
  wordCount: wordCount(issue),
  timeRequired: `PT${readMinutes(issue)}M`,
  inLanguage: siteConfig.language,
});

export const issueBreadcrumbSchema = (issue: Issue) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { name: siteConfig.name, item: absolute("/") },
    { name: "Issues", item: absolute("/archive/") },
    {
      name: `No. ${issue.data.issue} — ${formatDate(issue.data.date)}`,
      item: absolute(issueHref(issue)),
    },
  ].map((entry, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: entry.name,
    item: entry.item,
  })),
});
