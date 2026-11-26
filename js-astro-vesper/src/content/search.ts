/**
 * The site search's shared parts, for every source that builds its own hits (EmDash now, a mixed source later):
 * which collections are searched, their routes, the one-line summary a hit shows, and the limits. Source-free: no
 * CMS import, so a later mixed source reuses it for its own simple search.
 *
 *   posts     `summary`
 *   projects  `summary`
 *   pages     `summary`, else the first paragraph of the body
 *
 * Talks and uses items are not search records in either mode: /speaking and /uses are one page each, and a static
 * build indexes a page as one entry, so a server build does the same: `listPageHits` gives one hit for /speaking
 * when its title, its lead or a talk matches, and one for /uses the same way (after the source's own hits). The
 * pages collection's `projects`, `speaking` and `uses` entries only word those list pages (src/utils/sections.ts
 * `listHead`), so they are never hits of their own (`ownListHit`): /projects is not indexed in a static build, and
 * /speaking and /uses take the entry's title and lead in `listPageHits`.
 *
 * Each summary is cut at about 160 characters, and is never the title again. The search page shows 20 hits; a
 * source returns up to `search.fetch` (21), so the page knows whether more matched than it shows. A source that
 * searches a CMS asks it for `SEARCH_WINDOW` hits, then leaves out (`keptHits`) a hit on an optional page that is off
 * and an entry hidden from search engines (a static build indexes neither) before it cuts the list to 21.
 */
import type { RichText, SearchHit } from "@astronomic/content";
import { firstParagraph, searchLimits, trimSummary } from "@astronomic/theme-core/content";
import { strings } from "../theme.strings";
import { pageHref, postHref, projectHref, speakingHref, usesHref } from "../utils/routes";
import { isListPage, listHead } from "../utils/sections";
import type { Page, Talk, UsesItem } from "./model";

export const search = searchLimits(20);

/**
 * How many hits a source asks a CMS search for: more than the page shows, so the hits left out afterwards (`keptHits`)
 * do not crowd out ones it can show.
 */
export const SEARCH_WINDOW = search.fetch * 5;

/**
 * A source's own hits, in order, as the search page may show them, `max` at most: a hit on a page that is off (`on`
 * is false for its href) is left out, and so is one `keep` resolves to undefined (an entry hidden from search
 * engines). `keep` returns the hit to show (with its summary). The hits are checked a batch at a time, and it stops
 * once it has `max`, so only the entries it needs are loaded.
 */
export async function keptHits<H extends { href: string }>(
	hits: readonly H[],
	{ on, keep, max }: { on: (href: string) => boolean; keep: (hit: H) => Promise<H | undefined>; max: number },
): Promise<H[]> {
	const left = hits.filter((hit) => on(hit.href));
	const kept: H[] = [];
	let at = 0;
	while (kept.length < max && at < left.length) {
		const batch = left.slice(at, at + max - kept.length);
		at += batch.length;
		for (const hit of await Promise.all(batch.map(keep))) if (hit) kept.push(hit);
	}
	return kept;
}

/** The searched model collections, in hit order, with each one's EmDash collection slug. */
export const SEARCH_COLLECTIONS = {
	posts: "posts",
	projects: "projects",
	pages: "pages",
} as const;

export type SearchCollection = keyof typeof SEARCH_COLLECTIONS;

/** Each searched collection's entry route (src/utils/routes.ts). */
export const SEARCH_ROUTES: Record<SearchCollection, (slug: string) => string> = {
	posts: postHref,
	projects: projectHref,
	pages: pageHref,
};

/** The model name for a collection named either way (the model's or EmDash's), or undefined. */
export function searchCollection(name: string): SearchCollection | undefined {
	if (name in SEARCH_COLLECTIONS) return name as SearchCollection;
	return (Object.keys(SEARCH_COLLECTIONS) as SearchCollection[]).find((k) => SEARCH_COLLECTIONS[k] === name);
}

/** A hit's href. Throws for a collection the site does not search. */
export function searchHref(collection: string, slug: string): string {
	const name = searchCollection(collection);
	if (!name) throw new Error(`search: "${collection}" is not searched (searched: ${Object.keys(SEARCH_COLLECTIONS).join(", ")}).`);
	return SEARCH_ROUTES[name](slug);
}

type Summarised = { summary?: string; body?: RichText };

/** The summary for a hit, or undefined. Never the title. */
export function searchSummary(collection: string, entry: Summarised): string | undefined {
	const text = (v: string | undefined) => (v?.trim() ? trimSummary(v) : undefined);
	switch (searchCollection(collection)) {
		case "posts":
		case "projects":
			return text(entry.summary);
		case "pages":
			return text(entry.summary) ?? (entry.body ? firstParagraph(entry.body) : undefined);
		default:
			return undefined;
	}
}

/** The words of a text for matching: lowercase, split at anything that is not a letter or a digit. */
const wordsOf = (text: string) => text.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);

/** True when every word of `q` starts a word of `text` (as a static search matches a page: every word, by prefix). */
export function matchesText(q: string, text: string): boolean {
	const want = wordsOf(q);
	if (want.length === 0) return false;
	const have = wordsOf(text);
	return want.every((w) => have.some((h) => h.startsWith(w)));
}

/** True for a source's hit on a pages collection entry that only words a list page (/projects, /speaking, /uses). */
export const ownListHit = (hit: Pick<SearchHit, "collection" | "slug">) => searchCollection(hit.collection) === "pages" && isListPage(hit.slug);

type ListEntry = Pick<Page, "title" | "summary" | "image" | "imageCaption" | "seo">;

/**
 * The list pages a server build searches as one hit each, as a static build indexes them: /speaking (its title, its
 * lead, and each talk's title, event, place and summary) and /uses (its title, its lead, and each item's group, name
 * and note). The title and lead are the page's entry's when the pages collection has one
 * (`pages`), else the theme's words; an entry hidden from search engines leaves its page out. A hit's kind is a
 * page's, its summary the page's lead. Whether the page is on is the source's call (it drops hits on a page that is
 * off, as the search page does too).
 */
export function listPageHits(
	q: string,
	{ talks, uses, pages = {} }: { talks: readonly Talk[]; uses: readonly UsesItem[]; pages?: { speaking?: ListEntry; uses?: ListEntry } },
): SearchHit[] {
	const list = [
		{ slug: "speaking", href: speakingHref(), entry: pages.speaking, head: listHead(pages.speaking, strings.speaking), text: talks.flatMap((x) => [x.title, x.event, x.place, x.summary]) },
		{ slug: "uses", href: usesHref(), entry: pages.uses, head: listHead(pages.uses, strings.uses), text: uses.flatMap((x) => [x.group, x.name, x.note]) },
	];
	return list
		.filter((p) => !p.entry?.seo?.noindex)
		.filter((p) => matchesText(q, [p.head.title, p.head.lead, ...p.text].filter(Boolean).join(" ")))
		.map((p) => ({ collection: "pages", slug: p.slug, title: p.head.title, href: p.href, excerpt: p.head.lead ? trimSummary(p.head.lead) : undefined }));
}
