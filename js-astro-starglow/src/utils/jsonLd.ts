/** JSON-LD builders. Values come from the rendering page; empty ones are dropped. */

type JsonLdValue = string | number | boolean | JsonLdObject | JsonLdValue[];
type JsonLdObject = { [key: string]: JsonLdValue | undefined };

const SCHEMA_CONTEXT = "https://schema.org";

/**
 * Serialises for an inline `<script type="application/ld+json">`.
 * JSON.stringify leaves `<` alone, so a title containing `</script>` would end
 * the block early. `<` reads back as `<` for JSON parsers.
 */
export function toJsonLd(data: JsonLdObject): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Drops keys whose value is undefined, an empty string or an empty array. */
export function compact(object: JsonLdObject): JsonLdObject {
  const result: JsonLdObject = {};
  for (const [key, value] of Object.entries(object)) {
    if (value === undefined || value === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    result[key] = value;
  }
  return result;
}

/** `Astro.site` is typed as possibly undefined; JSON-LD ids need an origin. */
export function requireSite(site: URL | undefined): URL {
  if (!site) throw new Error("[jsonLd] Astro.site is not set");
  return site;
}

/** The site root path, base included, with a trailing slash. */
const homePath = () => import.meta.env.BASE_URL.replace(/\/*$/, "/");

export function personId(site: URL): string {
  return new URL(`${homePath()}#person`, site).href;
}

export function websiteId(site: URL): string {
  return new URL(`${homePath()}#website`, site).href;
}

type HomeGraphInput = {
  name: string;
  siteName: string;
  siteDescription: string;
  inLanguage: string;
  sameAs: string[];
  jobTitle?: string;
  description?: string;
};

/** Homepage graph: the Person and the WebSite that Person publishes. */
export function homeGraph(site: URL, input: HomeGraphInput): JsonLdObject {
  const root = new URL(homePath(), site).href;
  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      compact({
        "@type": "Person",
        "@id": personId(site),
        name: input.name,
        url: root,
        sameAs: input.sameAs,
        jobTitle: input.jobTitle,
        description: input.description,
      }),
      compact({
        "@type": "WebSite",
        "@id": websiteId(site),
        name: input.siteName,
        url: root,
        description: input.siteDescription,
        inLanguage: input.inLanguage,
        publisher: { "@id": personId(site) },
      }),
    ],
  };
}

function author(site: URL, name: string): JsonLdObject {
  return { "@type": "Person", "@id": personId(site), name };
}

type BlogPostingInput = {
  site: URL;
  headline: string;
  description?: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  inLanguage: string;
  authorName: string;
};

export function blogPosting(input: BlogPostingInput): JsonLdObject {
  return {
    "@context": SCHEMA_CONTEXT,
    ...compact({
      "@type": "BlogPosting",
      headline: input.headline,
      description: input.description,
      url: input.url,
      image: input.image,
      datePublished: input.datePublished,
      dateModified: input.dateModified,
      inLanguage: input.inLanguage,
      author: author(input.site, input.authorName),
    }),
  };
}

type ArticleInput = {
  site: URL;
  headline: string;
  description?: string;
  url: string;
  image: string;
  dateModified?: string;
  inLanguage: string;
  authorName: string;
};

export function article(input: ArticleInput): JsonLdObject {
  return {
    "@context": SCHEMA_CONTEXT,
    ...compact({
      "@type": "Article",
      headline: input.headline,
      description: input.description,
      url: input.url,
      image: input.image,
      dateModified: input.dateModified,
      inLanguage: input.inLanguage,
      author: author(input.site, input.authorName),
    }),
  };
}

type SoftwareSourceCodeInput = {
  site: URL;
  name: string;
  description?: string;
  url: string;
  image: string;
  codeRepository?: string;
  keywords?: string[];
  authorName: string;
};

export function softwareSourceCode(
  input: SoftwareSourceCodeInput
): JsonLdObject {
  return {
    "@context": SCHEMA_CONTEXT,
    ...compact({
      "@type": "SoftwareSourceCode",
      name: input.name,
      description: input.description,
      url: input.url,
      image: input.image,
      codeRepository: input.codeRepository,
      keywords: input.keywords,
      author: author(input.site, input.authorName),
    }),
  };
}
