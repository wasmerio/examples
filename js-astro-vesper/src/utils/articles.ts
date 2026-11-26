/**
 * The article lists' data: the categories and tags that have posts, the paged routes' params, and a post's previous
 * and next. The loaders take the content (a page passes `useContent(Astro)`, a getStaticPaths `useContent()`).
 *
 * Plain Node loads this file (scripts/units/paging.test.mjs): type imports and src/utils only.
 */
import { withCounts } from "@astronomic/theme-core/routes";
import type { Content, Model, Settings, Term } from "~/content";
import { PER_PAGE, pageCount, restPageParam } from "./routes";

type Site = Content<Model, Settings>;

/** The categories or tags that have posts (A to Z by label, as every source lists terms), with their counts. */
export async function usedTerms(content: Site, taxonomy: "category" | "tag"): Promise<(Term & { count: number })[]> {
	return withCounts(await content.terms(taxonomy), (t) => content.posts.count(taxonomy === "category" ? { category: t.slug } : { tag: t.slug }));
}

/** A rest route's params for every page of every term: `{ [param]: slug, page }` (page 1 has no page param). */
export function termPagePaths(terms: readonly { slug: string; count: number }[], perPage: number, param: string) {
	return terms.flatMap((t) => Array.from({ length: pageCount(t.count, perPage) }, (_, i) => ({ params: { [param]: t.slug, page: restPageParam(i + 1) } })));
}

export const categoryPaths = async (content: Site) => termPagePaths(await usedTerms(content, "category"), PER_PAGE, "slug");
export const tagPaths = async (content: Site) => termPagePaths(await usedTerms(content, "tag"), PER_PAGE, "tag");

/** In a newest-first list: the post before `slug` in time (previous, older) and after it (next, newer). */
export function neighbors<T extends { slug: string }>(list: readonly T[], slug: string): { previous?: T; next?: T } {
	const i = list.findIndex((p) => p.slug === slug);
	if (i < 0) return { previous: undefined, next: undefined };
	return { previous: list[i + 1], next: i > 0 ? list[i - 1] : undefined };
}
