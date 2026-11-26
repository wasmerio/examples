/** Builds EmDash's page context from the adapter-neutral `PageMeta`. */
import { createPublicPageContext } from "emdash/page";
import type { PageMeta } from "../index";
import { publicOrigin } from "../public-origin";

export function pageContext(Astro: { url: URL; site?: URL; currentLocale?: string }, page: PageMeta) {
	// Only EmDash entries have an EmDash identity; other sources' refs are ignored. A locked page gives none:
	// with it, EmDash would reload the entry's SEO panel and hand the entry to plugin metadata, JSON-LD and fragments.
	const ref = page.ref?.source === "emdash" && !page.locked ? page.ref : undefined;
	return createPublicPageContext({
		Astro,
		kind: ref ? "content" : "custom",
		pageType: "website",
		title: page.title,
		pageTitle: page.pageTitle,
		description: page.description,
		canonical: page.canonical,
		image: page.image,
		content: ref ? { collection: ref.collection, id: ref.id, slug: ref.slug } : undefined,
		// No siteName: EmDash would add its own WebSite JSON-LD block and og:site_name; the product renders both (SeoHead).
		// The public origin, for any absolute URL EmDash builds (behind a proxy the request is internal).
		siteUrl: publicOrigin({ site: Astro.site, url: Astro.url, output: "server" }),
	});
}
