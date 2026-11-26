/**
 * The page's meta: the title rule and the list of meta tags the product
 * renders itself (`SeoHead`). Source hooks get it as `page` and must not
 * render those tags again.
 */
import type { PageMeta } from "@astronomic/content";
import { jsonLdGraph, type JsonLdNode } from "./jsonld.ts";
import { absoluteUrl, isAbsoluteUrl } from "./url.ts";

/** The site's public origin (see @astronomic/content/public-origin). */
export { declaredOrigin, publicOrigin, type PublicOriginInput } from "@astronomic/content/public-origin";

export type PageMetaInput = {
	title: string;
	pageTitle?: string | null;
	description?: string | null;
	image?: string | null;
	/** The canonical URL (an entry's `seo.canonical`). Left out with `site` and `url`: the page's own absolute URL. */
	canonical?: string | null;
	/** The entry this page shows, for source hooks (e.g. EmDash page contributions). */
	entry?: { ref?: { source: string; collection: string; id: string }; slug: string; locked?: boolean };
	/** Keeps the page out of search results. */
	noindex?: boolean;
	siteTitle: string;
	siteTagline?: string;
	/**
	 * The site's public origin. With it, `image`, `canonical`, `url` and the
	 * feed are absolute, `twitter:card` renders with an image, and the product
	 * owns the twitter tags (source hooks drop theirs).
	 */
	site?: string | URL;
	/** The page's own URL (path or URL), for `og:url`; rendered only when absolute (a path needs `site`). */
	url?: string;
	/** `og:type`. */
	type?: "website" | "article";
	/** `og:image:alt`; only with an image. */
	imageAlt?: string;
	/** The RSS feed, for `<link rel="alternate" type="application/rss+xml">`. */
	feed?: { title: string; path: string };
	/** The page's JSON-LD nodes (see ./jsonld.ts). Kept on the page as `jsonLd` (SeoHead renders it) only with `site` and without noindex. */
	jsonLd?: readonly JsonLdNode[] | null;
};

/** "About" → "About — Studio"; a title that already names the site stays as it is. */
export function pageMeta({
	title,
	pageTitle,
	description,
	image,
	canonical,
	entry,
	noindex = false,
	siteTitle,
	siteTagline,
	site,
	url,
	type,
	imageAlt,
	feed,
	jsonLd,
}: PageMetaInput): PageMeta {
	const titleIncludesSiteName = title === siteTitle || title.endsWith(` | ${siteTitle}`) || title.endsWith(` — ${siteTitle}`);
	const abs = (value: string | null | undefined) => (value ? (site ? absoluteUrl(site, value) : value) : undefined);
	const absPageUrl = (value: string | undefined) => (value && isAbsoluteUrl(value) ? value : undefined);
	const page: PageMeta = {
		title: titleIncludesSiteName ? title : `${title} — ${siteTitle}`,
		pageTitle: pageTitle ?? title,
		description: description ?? siteTagline,
		image: abs(image),
		canonical: abs(canonical) ?? (site ? absPageUrl(abs(url)) : undefined),
		siteName: siteTitle,
		// A locked entry's page gives hooks no identity, so a source hook cannot load the entry (its body or SEO).
		ref: entry?.ref && !entry.locked ? { ...entry.ref, slug: entry.slug } : undefined,
		baseMeta: [],
	};
	if (entry?.locked) page.locked = true;
	const pageUrl = absPageUrl(abs(url));
	if (pageUrl) page.url = pageUrl;
	if (type) page.type = type;
	if (imageAlt && page.image) page.imageAlt = imageAlt;
	if (feed) page.feed = { title: feed.title, href: abs(feed.path) as string };
	// JSON-LD needs absolute URLs (a site) and stays off noindex pages.
	const graph = jsonLd?.length ? jsonLd : undefined;
	// Keep in step with the tags SeoHead renders (a test checks every mix); SeoHead reads noindex from "robots" and
	// the JSON-LD script from "jsonld", like robots.
	// The twitter title, description and image are owned (named) with `site` but not rendered: cards fall back to og:*.
	page.baseMeta = [
		noindex && "robots",
		page.description && "description",
		page.canonical && "canonical",
		"og:title",
		"og:site_name",
		page.description && "og:description",
		page.url && "og:url",
		page.type && "og:type",
		page.image && "og:image",
		page.imageAlt && "og:image:alt",
		site && page.image && "twitter:card",
		site && "twitter:title",
		site && "twitter:description",
		site && "twitter:image",
		site && graph && !noindex && "jsonld",
	].filter((tag): tag is string => !!tag);
	if (page.baseMeta.includes("jsonld") && graph) page.jsonLd = jsonLdGraph(graph);
	return page;
}
