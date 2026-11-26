import { siteConfig } from "@/config/site";
import { entryHref, type Entry } from "@/lib/journal";
import type { Person } from "@/lib/people";
import { workHref, type Work } from "@/lib/work";

const absolute = (path: string) => new URL(path, siteConfig.siteUrl).toString();

const organization = {
  "@type": "Organization",
  "@id": absolute("/#organization"),
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  url: siteConfig.siteUrl,
  logo: absolute("/favicon.svg"),
  email: siteConfig.email,
  sameAs: siteConfig.socials
    .filter((social) => social.href.startsWith("http"))
    .map((social) => social.href),
};

const breadcrumbs = (items: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absolute(item.path),
  })),
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@graph": [
    organization,
    {
      "@type": "WebSite",
      "@id": absolute("/#website"),
      name: siteConfig.name,
      url: siteConfig.siteUrl,
      description: siteConfig.description,
      inLanguage: siteConfig.language,
      publisher: { "@id": absolute("/#organization") },
    },
  ],
});

export const workSchema = (work: Work, image: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CreativeWork",
      name: `${work.data.title}: ${work.data.headline}`,
      description: work.data.summary,
      image: absolute(image),
      dateCreated: String(work.data.year),
      url: absolute(workHref(work)),
      creator: { "@id": absolute("/#organization") },
    },
    organization,
    breadcrumbs([
      { name: "Work", path: "/work/" },
      { name: work.data.title, path: workHref(work) },
    ]),
  ],
});

export const articleSchema = (entry: Entry, authors: Person[], image?: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: entry.data.title,
      description: entry.data.description,
      image: image ? absolute(image) : undefined,
      datePublished: entry.data.date.toISOString(),
      dateModified: (entry.data.updated ?? entry.data.date).toISOString(),
      author: authors.map((person) => ({ "@type": "Person", name: person.data.name })),
      publisher: organization,
      mainEntityOfPage: absolute(entryHref(entry)),
      inLanguage: siteConfig.language,
    },
    breadcrumbs([
      { name: "Journal", path: "/journal/" },
      { name: entry.data.title, path: entryHref(entry) },
    ]),
  ],
});
