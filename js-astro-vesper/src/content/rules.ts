/**
 * Rules every source shares: sort orders, query filters, the uses groups, job years and series parts. Sources import
 * these, so all of them order and filter the same way, and the conformance check tests against the same code.
 * Source-free: no CMS import.
 *
 * Plain Node loads this file (the unit tests), so it imports only theme-core's sort helpers.
 */
import { ascLast, byText, compareOrdered, descLast } from "@astronomic/theme-core/content";
import type { CollagePhoto, Job, Post, PostQuery, Project, Talk, UsesItem } from "./model";

export { byText, matchFeatured } from "@astronomic/theme-core/content";

const time = (d?: Date) => d?.getTime() ?? 0;

/** Posts: `date-desc` (default), `date-asc` or `title`; then slug. A post with no date sorts as the oldest. */
export function comparePosts(a: Pick<Post, "slug" | "title" | "date">, b: Pick<Post, "slug" | "title" | "date">, q: PostQuery = {}): number {
	const first = q.sort === "title" ? byText(a.title, b.title) : q.sort === "date-asc" ? time(a.date) - time(b.date) : time(b.date) - time(a.date);
	return first || byText(a.slug, b.slug);
}

/** Projects: `featured` first, then `order` ascending (none last), title, `year` descending (none last), slug. */
export function compareProjects(
	a: Pick<Project, "slug" | "title" | "featured" | "order" | "year">,
	b: Pick<Project, "slug" | "title" | "featured" | "order" | "year">,
): number {
	return Number(b.featured) - Number(a.featured) || ascLast(a.order, b.order) || byText(a.title, b.title) || descLast(a.year, b.year) || byText(a.slug, b.slug);
}

/** Talks: newest first, then `order` ascending (none last), title, slug. */
export function compareTalks(a: Pick<Talk, "slug" | "title" | "date" | "order">, b: Pick<Talk, "slug" | "title" | "date" | "order">): number {
	return time(b.date) - time(a.date) || ascLast(a.order, b.order) || byText(a.title, b.title) || byText(a.slug, b.slug);
}

/**
 * Uses items, as a flat list: `order` ascending (none last), then group, name, slug. `groupUses` turns that list
 * into groups by first appearance, which puts the groups in the order of their lowest `order` (groups with none
 * last, by name) and keeps each group's items by `order`, name, slug. A pairwise rule cannot see a group's lowest
 * order, so the flat order is this one and the grouping is `groupUses`.
 */
export function compareUses(a: Pick<UsesItem, "slug" | "group" | "name" | "order">, b: Pick<UsesItem, "slug" | "group" | "name" | "order">): number {
	return ascLast(a.order, b.order) || byText(a.group, b.group) || byText(a.name, b.name) || byText(a.slug, b.slug);
}

/** The uses items in their groups, in group order (see `compareUses`). Sorts a copy first, so any order goes in. */
export function groupUses<T extends Pick<UsesItem, "slug" | "group" | "name" | "order">>(items: readonly T[]): { group: string; items: T[] }[] {
	const groups = new Map<string, T[]>();
	for (const item of [...items].sort(compareUses)) {
		const list = groups.get(item.group);
		if (list) list.push(item);
		else groups.set(item.group, [item]);
	}
	return [...groups].map(([group, list]) => ({ group, items: list }));
}

/** Jobs: `order` ascending (none last), then `start` descending, company, slug. */
export function compareJobs(a: Pick<Job, "slug" | "company" | "start" | "order">, b: Pick<Job, "slug" | "company" | "start" | "order">): number {
	return ascLast(a.order, b.order) || b.start - a.start || byText(a.company, b.company) || byText(a.slug, b.slug);
}

/** Collage photos: `order` ascending (none last), then slug. */
export const compareCollage = compareOrdered<Pick<CollagePhoto, "slug" | "order">>((e) => e.slug);

/** Pages: title, then slug. */
export const comparePages = (a: { slug: string; title: string }, b: { slug: string; title: string }) => byText(a.title, b.title) || byText(a.slug, b.slug);

/** Category slug, any tag slug, series slug. `sort` is an order, not a filter. */
export const matchPost = (p: Pick<Post, "category" | "tags" | "series">, q: PostQuery) =>
	(!q.category || p.category?.slug === q.category) &&
	(!q.tag || (p.tags ?? []).some((t) => t.slug === q.tag)) &&
	(!q.series || p.series?.slug === q.series);

/** A job's years: "2018 – 2022", "2022 – Now" with no end (the en dash with spaces), or one year when they match. */
export function jobYears(job: Pick<Job, "start" | "end">, nowLabel: string): string {
	if (job.end !== undefined && job.end === job.start) return String(job.start);
	return `${job.start} – ${job.end ?? nowLabel}`;
}

export type SeriesPart = { slug: string; title: string; date?: Date; current: boolean };

/** The posts in `current`'s series, oldest first, with `current` marked. Empty when it has no series. */
export function seriesParts(posts: readonly Pick<Post, "slug" | "title" | "date" | "series">[], current: Pick<Post, "slug" | "series">): SeriesPart[] {
	const series = current.series?.slug;
	if (!series) return [];
	return posts
		.filter((p) => p.series?.slug === series)
		.sort((a, b) => comparePosts(a, b, { sort: "date-asc" }))
		.map((p) => ({ slug: p.slug, title: p.title, ...(p.date ? { date: p.date } : {}), current: p.slug === current.slug }));
}
