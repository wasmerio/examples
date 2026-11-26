/**
 * SearchPage's pure helpers: the query, the type and the filter picks in the URL (`?q=dark+mode&type=docs&theme=vega`),
 * the toggles that take one set of picks to another (for Back and Forward), and the first pages of a result for "Show
 * more results". No listeners and no globals, so it runs under node --test. The page's eager script shares this file,
 * so it imports only types from the search package; the browser glue is lib/search-page-app.ts, loaded on first use.
 */
import type { Option, StringsInput } from "@astronomic-dev/search/controller";
import type { ResultGroup, SearchResult } from "@astronomic-dev/search/core";

/** The page part's root, a <search> element. */
export const PAGE = "[data-search-page]";
/** Results shown at first, and added by each "Show more results". */
export const PAGE_SIZE = 20;

export type Picks = Record<string, string[]>;

export interface UrlState {
	query: string;
	/** The type tab; null for all types. */
	type: string | null;
	/** Facet name -> the picked values. */
	picks: Picks;
}

const params = (search: string) => new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);

/**
 * A name a set of picks can take from a URL without the index's facet names: not one Object.prototype has
 * (`constructor`, `__proto__`, `toString`), which stays a parameter that is not ours. With the facet names, any name
 * the index declares is a pick, whatever it is called.
 */
const pickable = (name: string) => !(name in Object.prototype);
const own = (picks: Picks, name: string): string[] | undefined => (Object.hasOwn(picks, name) ? picks[name] : undefined);

/**
 * The query (`q`), the type (`type`) and the picks from a URL's search part. A pick is any other parameter whose name
 * Object.prototype does not have, or, with `facets` (the index's facet names), each one the index declares, even
 * `constructor`. A value picked twice counts once; empty values are left out. The picks are a null-prototype object,
 * so no name reads an inherited property.
 */
export function readUrl(search: string, facets?: readonly string[]): UrlState {
	const p = params(search);
	const picks: Picks = Object.create(null);
	for (const [name, value] of p) {
		if (name === "q" || name === "type" || value === "") continue;
		if (facets ? !facets.includes(name) : !pickable(name)) continue;
		const list = own(picks, name) ?? (picks[name] = []);
		if (!list.includes(value)) list.push(value);
	}
	return { query: p.get("q")?.trim() ?? "", type: p.get("type") || null, picks };
}

/**
 * The search part for `state`, "" when it is empty: `q` (trimmed), `type`, then each pick (a facet with several values
 * repeats its name), then every other parameter of `current` that is not ours, in its order. Ours are `q`, `type`,
 * `facets` and the facets `state` picks.
 */
export function writeUrl(state: UrlState, current = "", facets: readonly string[] = []): string {
	const out = new URLSearchParams();
	const query = state.query.trim();
	if (query) out.set("q", query);
	if (state.type) out.set("type", state.type);
	for (const [facet, values] of Object.entries(state.picks)) for (const v of values) if (v !== "") out.append(facet, v);
	const ours = new Set(["q", "type", ...facets, ...Object.keys(state.picks)]);
	for (const [name, value] of params(current)) if (!ours.has(name)) out.append(name, value);
	const text = out.toString();
	return text ? `?${text}` : "";
}

/** The [facet, value] toggles that take the picks `from` to `to`: the values to drop, then the values to add. */
export function pickToggles(from: Picks, to: Picks): [string, string][] {
	const out: [string, string][] = [];
	for (const [facet, values] of Object.entries(from)) for (const v of values) if (!own(to, facet)?.includes(v)) out.push([facet, v]);
	for (const [facet, values] of Object.entries(to)) for (const v of values) if (!own(from, facet)?.includes(v)) out.push([facet, v]);
	return out;
}

export interface Slice {
	/** The groups with their first pages, in order; a group with none shown is left out. */
	groups: ResultGroup[];
	/** Pages shown. */
	shown: number;
	/** More pages to show. */
	more: boolean;
	/** What is shown, flat in screen order: each page, then its headings. Its index + 1 is a result's position. */
	options: Option[];
}

/** The first `count` pages of a result, across its groups in order. */
export function slicePages(result: Pick<SearchResult, "groups" | "total"> | null, count: number): Slice {
	const groups: ResultGroup[] = [];
	const options: Option[] = [];
	let shown = 0;
	let all = 0;
	for (const g of result?.groups ?? []) {
		all += g.items.length;
		const items = g.items.slice(0, Math.max(0, count - shown));
		if (!items.length) continue;
		shown += items.length;
		groups.push({ ...g, items });
		for (const item of items) {
			for (const r of [item.page, ...item.headings.map((h) => h.record)]) {
				const o: Option = { id: r.id, kind: r.kind, type: r.type };
				if (r.url !== undefined) o.url = r.url;
				options.push(o);
			}
		}
	}
	return { groups, shown, more: shown < all, options };
}

/** The page's own words, beside the search's strings; the marks and the Type label default as Search's (lib/search.ts). */
export interface PageWords {
	/** The search box's label (visually hidden; the box shows the placeholder). */
	label: string;
	/** The form's button. */
	submit: string;
	/** The button under the results. */
	showMore: string;
	/** Read after "Show more results": `{position}`, `{total}` and `{title}` of the new first result. */
	moreShown: string;
	/** The mark before a section result's heading (hidden from screen readers), as in Search. */
	headingMark: string;
	/** The mark between the parts of a result's breadcrumb (hidden from screen readers), as in Search. */
	crumbMark: string;
	/** The visible label before the type tabs (the tablist keeps its name, the search's `typesLabel`), as in Search. */
	typeText: string;
}

/** SearchPage's `strings`: the search's strings (as Search takes them) and the page's own words. */
export type SearchPageStrings = StringsInput & Partial<PageWords>;

export const defaultPageWords: PageWords = {
	label: "Search",
	submit: "Search",
	showMore: "Show more results",
	moreShown: "Result {position} of {total}: {title}",
	headingMark: "#",
	crumbMark: "›",
	typeText: "Type",
};

/** The page's words: the defaults with `input`'s on top. */
export function pageStrings(input: Partial<PageWords> = {}): PageWords {
	const out = { ...defaultPageWords };
	for (const k of Object.keys(out) as (keyof PageWords)[]) if (typeof input[k] === "string") out[k] = input[k];
	return out;
}
