/**
 * The pure half of SearchPage's static search: the query, the strings, and
 * Pagefind results as shown hits. The part's script does the DOM work.
 */
import type { ShownHit } from "./content/search.ts";

/** The fields of a Pagefind result's `data()` this uses. */
export type PagefindData = { url: string; excerpt?: string; meta?: Record<string, string | undefined> };

/** The trimmed `q` parameter of a query string, or "". */
export function queryFrom(search: string): string {
	return (new URLSearchParams(search).get("q") ?? "").trim();
}

/** Fills `{n}` and `{q}` in a string; a name with no value stays as it is. */
export function fill(template: string, values: { n?: number; q?: string }): string {
	return template.replace(/\{(n|q)\}/g, (m, key: "n" | "q") => (values[key] === undefined ? m : String(values[key])));
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

/** Text only: tags removed, entities decoded. */
function textOf(html: string): string {
	return html
		.replace(/<[^>]*>/g, "")
		.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
			if (e[0] !== "#") return ENTITIES[e.toLowerCase()] ?? m;
			const cp = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : Number(e.slice(1));
			return cp <= 0x10ffff ? String.fromCodePoint(cp) : m;
		})
		.trim();
}

/** Options for turning Pagefind results into hits. */
export type HitOptions = {
	/** Keep the trailing slash of Pagefind's URLs (`/work/a/`): for a site with `trailingSlash: "always"`. */
	keepTrailingSlash?: boolean;
};

/** `/work/a/` -> `/work/a` (a query and a hash stay); `/` stays. */
function dropTrailingSlash(url: string): string {
	return url.replace(/^([^?#]*[^/?#])\/(?=[?#]|$)/, "$1");
}

/**
 * A Pagefind result as a shown hit. `meta.kind` is the collection key
 * (`SearchIndex`), shown as its label from `kinds`. The excerpt is the
 * indexed summary, else Pagefind's excerpt as plain text (never HTML).
 * Pagefind's URLs end in a slash (directory pages); the href drops it, as
 * the theme's own links do, unless `keepTrailingSlash`. `meta.hit_image` and
 * `meta.hit_image_alt` (`SearchIndex`'s image) become the hit's image;
 * Pagefind's own `image` (its guess from the page's first <img>) is ignored.
 */
export function toHit(result: PagefindData, kinds: Record<string, string> = {}, opts: HitOptions = {}): ShownHit {
	const meta = result.meta ?? {};
	const href = opts.keepTrailingSlash ? result.url : dropTrailingSlash(result.url);
	const hit: ShownHit = { href, title: meta.title ?? href };
	const excerpt = meta.summary || textOf(result.excerpt ?? "");
	if (excerpt) hit.excerpt = excerpt;
	const kind = meta.kind ? kinds[meta.kind] : undefined;
	if (kind) hit.kind = kind;
	if (meta.hit_image) hit.image = { src: meta.hit_image, alt: meta.hit_image_alt ?? "" };
	return hit;
}

/** The hits to show and whether more matched. `limit` undefined: every result. 0 or less throws. */
export function shown<T>(results: readonly T[], limit: number | undefined): { hits: T[]; more: boolean } {
	if (limit === undefined) return { hits: [...results], more: false };
	if (!Number.isInteger(limit) || limit < 1) throw new Error(`search: limit must be a whole number of 1 or more (got ${limit}); leave it out for no limit.`);
	return { hits: results.slice(0, limit), more: results.length > limit };
}

/** The part of Pagefind's browser API this uses. */
export type PagefindApi = {
	init?: () => Promise<void>;
	search: (q: string) => Promise<{ results: { data: () => Promise<PagefindData> }[] }>;
};

/**
 * Loads Pagefind and searches. Any failure (no index, a failed search or
 * `data()`) gives `state: "failed"`, never a rejection.
 */
export async function searchHits(
	load: () => Promise<PagefindApi>,
	q: string,
	opts: { limit?: number; kinds?: Record<string, string> } & HitOptions,
): Promise<{ state: "results" | "none" | "failed"; hits: ShownHit[]; more: boolean }> {
	try {
		const pagefind = await load();
		await pagefind.init?.();
		const { results } = await pagefind.search(q);
		const wanted = opts.limit === undefined ? results : results.slice(0, opts.limit + 1);
		const data = await Promise.all(wanted.map((result) => result.data()));
		const { hits, more } = shown(data.map((d) => toHit(d, opts.kinds, opts)), opts.limit);
		return { state: hits.length ? "results" : "none", hits, more };
	} catch {
		return { state: "failed", hits: [], more: false };
	}
}
