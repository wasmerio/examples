/**
 * Builders for the RSS feed, the sitemap and robots.txt. Each theme owns the
 * routes as thin files in `src/pages/` (`rss.xml.ts`, `sitemap.xml.ts`,
 * `robots.txt.ts`) that call these. They are builders, not injected routes,
 * because EmDash stands back from `/sitemap.xml` and `/robots.txt` only when
 * such files exist in `src/pages/`; an integration's route would not stop it.
 *
 * Every output here is anonymous and public: it never depends on who asks and
 * may be cached publicly. Entries pass through a `view` (today every entry as
 * it is) so a later step can plug in the public view of locked entries. No
 * builder reads or renders an entry's body.
 */
import rss from "@astrojs/rss";
import { absoluteUrl } from "./url.ts";

export { absoluteUrl };

/** What a page or feed may show of an entry. Today every entry is public as it is; step E passes the public view. */
export type PublicView<E, V = E> = (entry: E) => V | undefined;

export type FeedItem = { title: string; path: string; date?: Date; description?: string; categories?: string[] };

export type SitemapPage = { path: string; lastmod?: Date };

const CACHE = "public, max-age=3600";

const validDate = (date: Date) => !Number.isNaN(date.getTime());

/** Escapes the five XML characters and drops the control characters XML 1.0 does not allow. */
export function escapeXml(value: string): string {
	return value
		.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

/**
 * One meaning of "shown" for every public list (sitemap, feed, search index, cards): not marked noindex, and
 * kept by the public `view` (identity when left out).
 */
export function isShown<E extends { seo?: { noindex?: boolean } }, V = E>(entry: E, view?: PublicView<E, V>): boolean {
	if (entry.seo?.noindex) return false;
	return view ? view(entry) !== undefined : true;
}

/**
 * The shown entries as their public view: each entry not marked noindex goes through `view` once (a projection is
 * never asked twice), and an entry the view leaves out (`undefined`) is dropped.
 */
export function shownEntries<E extends { seo?: { noindex?: boolean } }, V = E>(entries: readonly E[], view?: PublicView<E, V>): V[] {
	const out: V[] = [];
	for (const entry of entries) {
		if (entry.seo?.noindex) continue;
		const viewed = view ? view(entry) : (entry as unknown as V);
		if (viewed !== undefined) out.push(viewed);
	}
	return out;
}

/** Entries through `view` (left out when it returns `undefined`), then `item` with the viewed value. */
export function publicItems<E, V, T>(entries: readonly E[], opts: { view?: PublicView<E, V>; item: (v: V) => T }): T[] {
	const view = opts.view ?? ((entry: E) => entry as unknown as V);
	const out: T[] = [];
	for (const entry of entries) {
		const viewed = view(entry);
		if (viewed !== undefined) out.push(opts.item(viewed));
	}
	return out;
}

/**
 * The pages built from entries that a public page list keeps: a term's page, or a fixed page that shows one entry
 * (`of` gives the slugs of the pages an entry belongs to). A page is kept when no entry belongs to it (it stands on
 * its own, e.g. an empty term) or at least one `shown` entry does; it is left out when every entry it has is hidden.
 */
export function listedPages<P extends { slug: string }, E>(pages: readonly P[], opts: { entries: readonly E[]; shown: (entry: E) => boolean; of: (entry: E) => readonly string[] }): P[] {
	const owned = new Set<string>();
	const visible = new Set<string>();
	for (const entry of opts.entries) {
		const shown = opts.shown(entry);
		for (const slug of opts.of(entry)) {
			owned.add(slug);
			if (shown) visible.add(slug);
		}
	}
	return pages.filter((page) => !owned.has(page.slug) || visible.has(page.slug));
}

/** The feed's items: the public view, newest first (no date or an invalid one last, then by path), at most `limit` (50). */
export function feedItems<E, V>(entries: readonly E[], opts: { view?: PublicView<E, V>; item: (v: V) => FeedItem; limit?: number }): FeedItem[] {
	const { limit = 50 } = opts;
	const items = publicItems(entries, opts).map((item) => (item.date && !validDate(item.date) ? { ...item, date: undefined } : item));
	items.sort((a, b) => {
		const ta = a.date?.getTime();
		const tb = b.date?.getTime();
		if (ta !== tb) {
			if (ta === undefined) return 1;
			if (tb === undefined) return -1;
			return tb - ta;
		}
		return a.path < b.path ? -1 : a.path > b.path ? 1 : 0;
	});
	return items.slice(0, limit);
}

/** The feed through @astrojs/rss: `link` = `path`, `pubDate` = `date`; nothing else is passed. Sets `Content-Type: application/rss+xml` and the `Cache-Control` header. */
export async function rssResponse(opts: { site: string | URL; title: string; description: string; items: FeedItem[] }): Promise<Response> {
	const res = await rss({
		title: opts.title,
		description: opts.description,
		site: String(opts.site),
		items: opts.items.map(({ title, path, date, description, categories }) => ({
			title,
			link: absoluteUrl(opts.site, path),
			...(date && validDate(date) ? { pubDate: date } : {}),
			...(description ? { description } : {}),
			...(categories?.length ? { categories } : {}),
		})),
	});
	res.headers.set("Content-Type", "application/rss+xml; charset=utf-8");
	res.headers.set("Cache-Control", CACHE);
	return res;
}

/** One URL set; pages in the given order (the theme sorts), a repeated URL once (first wins); an invalid `lastmod` is left out. */
export function sitemapXml({ site, pages }: { site: string | URL; pages: readonly SitemapPage[] }): string {
	const seen = new Set<string>();
	const urls: string[] = [];
	for (const page of pages) {
		const loc = absoluteUrl(site, page.path);
		if (seen.has(loc)) continue;
		seen.add(loc);
		const lastmod = page.lastmod && validDate(page.lastmod) ? `<lastmod>${page.lastmod.toISOString().slice(0, 10)}</lastmod>` : "";
		urls.push(`<url><loc>${escapeXml(loc)}</loc>${lastmod}</url>`);
	}
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `${u}\n`).join("")}</urlset>\n`;
}

/** The crawlers that gather pages to train models (not the ones that answer searches); `aiTraining: false` turns them away. */
export const TRAINING_CRAWLERS = ["GPTBot", "ClaudeBot", "Google-Extended", "CCBot", "Applebot-Extended"] as const;

/**
 * Allow all, then each `disallow` path, then the sitemap's absolute URL. A path with a line break throws.
 * `aiTraining: false` adds one group that asks the training crawlers to stay off the whole site; search crawlers
 * stay allowed. It is a request: a crawler may ignore it.
 */
export function robotsTxt({
	site,
	sitemap,
	disallow = [],
	aiTraining = true,
}: {
	site: string | URL;
	sitemap: string;
	disallow?: readonly string[];
	aiTraining?: boolean;
}): string {
	const broken = disallow.find((path) => /[\r\n\u2028\u2029]/.test(path));
	if (broken !== undefined) throw new Error(`robotsTxt: disallow path has a line break: ${JSON.stringify(broken)}`);
	const lines = ["User-agent: *", "Allow: /", ...disallow.map((path) => `Disallow: ${path}`)];
	const training = aiTraining ? [] : ["", ...TRAINING_CRAWLERS.map((bot) => `User-agent: ${bot}`), "Disallow: /"];
	return `${[...lines, ...training].join("\n")}\n\nSitemap: ${absoluteUrl(site, sitemap)}\n`;
}

export type ReaderLink = { title: string; path: string; description?: string };
export type ReaderSection = { title: string; links: readonly ReaderLink[] };

const oneLine = (value: string) => value.replace(/\s+/g, " ").trim();
const linkText = (value: string) => oneLine(value).replace(/[\\[\]]/g, (c) => `\\${c}`);
const linkUrl = (site: string | URL, path: string) => absoluteUrl(site, path).replace(/[ ()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

/**
 * The reader map in the llmstxt.org format: `# <site>`, `> <summary>`, then one `## <section>` per area with
 * `- [Title](absolute url): description`. An empty section is left out. It is a map for a coding assistant or other
 * reading tool that someone sends to the site, so the tool can see which pages it has. No tool has to read it, and it
 * promises no results. It does not raise search rank, and search engines do not use it to rank pages. Pass only
 * shown pages (as the sitemap does): nothing here reads a body.
 */
export function llmsTxt({ site, title, summary, sections }: { site: string | URL; title: string; summary?: string; sections: readonly ReaderSection[] }): string {
	const out = [`# ${oneLine(title)}`];
	if (summary && oneLine(summary)) out.push(`> ${oneLine(summary)}`);
	for (const section of sections) {
		if (!section.links.length) continue;
		const links = section.links.map((l) => {
			const description = l.description ? oneLine(l.description) : "";
			return `- [${linkText(l.title)}](${linkUrl(site, l.path)})${description ? `: ${description}` : ""}`;
		});
		out.push(`## ${oneLine(section.title)}`, links.join("\n"));
	}
	return `${out.join("\n\n")}\n`;
}

/**
 * The reader map's sections from a theme's public pages: one `## ` section per key of `headings` (a theme's
 * `strings.readerMap`), in the order of its keys, titled by its value. A page goes under its `section`, else under
 * `pages` (the fixed pages and the pages collection share one section). A section with no pages is left out; a
 * section with no heading throws. Reads only path, title, description and section (never a share card's label).
 */
export function llmsSections<K extends string>(
	pages: readonly { path: string; title: string; section?: K; description?: string }[],
	headings: Readonly<Record<K | "pages", string>>,
): ReaderSection[] {
	const groups = new Map<string, ReaderLink[]>(Object.keys(headings).map((key) => [key, []]));
	for (const page of pages) {
		const key = page.section ?? "pages";
		const links = groups.get(key);
		if (!links) throw new Error(`llmsSections: no heading for the section ${JSON.stringify(key)} (${page.path})`);
		links.push({ title: page.title, path: page.path, ...(page.description ? { description: page.description } : {}) });
	}
	return [...groups]
		.filter(([, links]) => links.length)
		.map(([key, links]) => ({ title: (headings as Record<string, string>)[key], links }));
}

/** A sitemap (`"xml"`), or robots.txt or the reader map (`"text"`) response, publicly cacheable. */
export function xmlResponse(body: string, type: "xml" | "text"): Response {
	return new Response(body, {
		headers: {
			"Content-Type": type === "xml" ? "application/xml; charset=utf-8" : "text/plain; charset=utf-8",
			"Cache-Control": CACHE,
		},
	});
}
