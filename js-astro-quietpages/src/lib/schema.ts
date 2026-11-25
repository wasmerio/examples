import { siteConfig } from "@/config/site";

const absolute = (path: string) => new URL(path, siteConfig.siteUrl).toString();

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: absolute("/"),
  description: siteConfig.description,
  inLanguage: siteConfig.language,
  potentialAction: {
    "@type": "SearchAction",
    target: `${absolute("/blog/")}?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export interface Crumb {
  label: string;
  href?: string;
}

export const breadcrumbSchema = (items: Crumb[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    ...(item.href ? { item: absolute(item.href) } : {}),
  })),
});

export const withBreadcrumbs = (schema: Record<string, unknown>, crumbs: Crumb[]) => ({
  "@context": "https://schema.org",
  "@graph": [{ ...schema }, breadcrumbSchema(crumbs)],
});

export { absolute };
