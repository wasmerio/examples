/** Search limits and the simple search a source without its own can use. */
import type { ContentImage, SearchHit } from "@astronomic/content";

/**
 * How many hits the search page shows. A source returns up to `fetch` hits,
 * one past the limit, so the page knows for sure whether more matched than
 * it shows (see `shownHits`).
 */
export function searchLimits(limit: number) {
	if (!Number.isInteger(limit) || limit < 1) throw new Error(`searchLimits: limit must be a whole number of 1 or more (got ${limit}); leave it out for no limit.`);
	return {
		limit,
		fetch: limit + 1,
		/** The hits to show, and whether more matched than that. */
		shownHits<T>(hits: T[]): { hits: T[]; more: boolean } {
			return { hits: hits.slice(0, limit), more: hits.length > limit };
		},
	};
}

/** One searchable collection: its entries (in the source's order), how to read them, and its URL. */
export type SearchGroup<E> = {
	collection: string;
	items: E[];
	title(e: E): string;
	excerpt(e: E): string | undefined;
	href(slug: string): string;
	slug(e: E): string;
};

/**
 * Case-insensitive match on title and excerpt, group by group in the given
 * order, up to `limit` hits when given. An empty query finds nothing.
 */
// biome-ignore lint/suspicious/noExplicitAny: each group has its own entry type.
export function simpleSearch(groups: SearchGroup<any>[], q: string, opts: { limit?: number } = {}): SearchHit[] {
	const needle = q.trim().toLowerCase();
	if (!needle) return [];
	const hits = groups.flatMap((g) =>
		g.items.flatMap((e) => {
			const title = g.title(e);
			const excerpt = g.excerpt(e);
			if (!`${title} ${excerpt ?? ""}`.toLowerCase().includes(needle)) return [];
			const slug = g.slug(e);
			return [{ collection: g.collection, slug, title, excerpt, href: g.href(slug) }];
		}),
	);
	return opts.limit === undefined ? hits : hits.slice(0, opts.limit);
}

/** The hit a search page shows, in both modes (request hits and Pagefind results map to it). */
/** `image`: the entry's public picture; in static mode only its URL and alt (from the index). */
export type ShownHit = { href: string; title: string; excerpt?: string; kind?: string; image?: ContentImage };

/** A request hit as a shown hit: `collection` becomes its `kind` label (none when `kinds` has no label for it). */
export function toShownHit(hit: SearchHit, kinds: Record<string, string> = {}): ShownHit {
	const shown: ShownHit = { href: hit.href, title: hit.title };
	if (hit.excerpt) shown.excerpt = hit.excerpt;
	const kind = kinds[hit.collection];
	if (kind) shown.kind = kind;
	if (hit.image) shown.image = hit.image;
	return shown;
}

/**
 * Which search a page offers: `"request"` when the source searches per
 * request, `"static"` (Pagefind, built with `staticSearch()`) on a static
 * build, otherwise none.
 */
export function searchMode(search: unknown, output: string | undefined): "request" | "static" | undefined {
	if (search) return "request";
	if (output === "static") return "static";
	return undefined;
}
