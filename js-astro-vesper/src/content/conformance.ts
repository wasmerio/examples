/**
 * The Vesper conformance check: field checks and queries for the generic check (`checks`), plus the data rules every
 * source must keep (`vesperProblems`):
 *
 * - every filtered list (posts by category, tag and series; featured projects) holds exactly the entries the shared
 *   match rule keeps, in rule order;
 * - a post has one category and one series at most (src/content/terms.ts records a source that held more);
 * - every collage photo has alt text;
 * - settings (`settingsProblems`): the name and the headline are set; socials have a label, a link and an icon; the
 *   newsletter's options have their names and pairs, and come with an action; the CV file is text when set;
 * - no duplicate slugs in a routed collection, no page on a route the theme owns, and no post slugged `page` or
 *   `category` (the list's own routes under /articles);
 * - every list, filtered lists too, follows the sort rules (src/content/rules.ts).
 */
import type { CheckOptions, ContentAdapter, ContentContext } from "@astronomic/content";
import { body, bool, duplicateSlugs, fields, isImage, list, nonEmpty, optImage, optInt, optStr, reservedRoutes, sortProblems } from "@astronomic/theme-core/conformance";
import { isReservedPostSlug, isReservedSlug, OWN_ROUTE_PAGES, THEME_ROUTES } from "../utils/routes";
import type { Model, Post, PostQuery, Project, Settings } from "./model";
import {
	compareCollage,
	compareJobs,
	comparePages,
	comparePosts,
	compareProjects,
	compareTalks,
	compareUses,
	matchFeatured,
	matchPost,
} from "./rules";
import { termProblems } from "./terms";

type Entry = Record<string, unknown>;

const isDate = (v: unknown) => v instanceof Date && !Number.isNaN(v.getTime());
const optDate = (v: unknown) => v === undefined || isDate(v);
const isTerm = (v: unknown) => nonEmpty((v as Entry)?.slug) && nonEmpty((v as Entry)?.label);
const term = (v: unknown) => v === undefined || isTerm(v);
/** A term list in label order (the order every source lists terms in). */
const terms = (v: unknown) =>
	list(isTerm)(v) && (v as { label: string }[]).every((t, i, all) => i === 0 || all[i - 1].label.localeCompare(t.label, "en") <= 0);
const year = (v: unknown) => Number.isInteger(v);

export const checks: CheckOptions = {
	// Every model collection must exist on the selected source.
	expect: ["posts", "projects", "talks", "uses", "jobs", "collage", "pages"],
	collections: {
		posts: {
			validate: (e) =>
				fields(e, { title: nonEmpty, date: optDate, updated: optDate, summary: optStr, thumbnail: optImage, category: term, tags: terms, series: term, body }),
			// Sorts are not filters; their order is checked in vesperProblems.
			queries: [{ category: "design" }, { tag: "film" }, { series: "building-ridgeline" }, { category: "photography", tag: "gear" }],
		},
		projects: {
			validate: (e) =>
				fields(e, {
					title: nonEmpty,
					summary: optStr,
					image: optImage,
					logo: optImage,
					link: optStr,
					year: optInt,
					featured: bool,
					order: optInt,
					body,
				}),
			queries: [{ featured: true }],
		},
		talks: {
			validate: (e) =>
				fields(e, { title: nonEmpty, event: nonEmpty, date: isDate, place: optStr, summary: optStr, video: optStr, slides: optStr, order: optInt }),
		},
		uses: {
			validate: (e) =>
				fields(e, {
					group: nonEmpty,
					name: nonEmpty,
					note: optStr,
					link: optStr,
					linkButton: (v) => v === undefined || v === true,
					linkLabel: optStr,
					groupImage: optImage,
					order: optInt,
				}),
		},
		jobs: {
			validate: (e) =>
				fields(e, {
					company: nonEmpty,
					role: nonEmpty,
					start: year,
					end: (v) => v === undefined || (year(v) && (v as number) >= ((e as Entry).start as number)),
					logo: optImage,
					link: optStr,
					order: optInt,
				}),
		},
		collage: {
			validate: (e) =>
				fields(e, {
					image: (v) => isImage(v) && nonEmpty((v as Entry).src),
					alt: (v) => typeof v === "string" && v.trim().length > 0,
					place: optStr,
					year: optInt,
					geo: optStr,
					link: optStr,
					order: optInt,
				}),
		},
		pages: { validate: (e) => fields(e, { title: nonEmpty, summary: optStr, image: optImage, body }) },
	},
	taxonomies: ["category", "tag", "series"],
	menus: ["primary", "footer"],
};

const ctx: ContentContext = { cache() {} };

/** Problems with the cross-collection rules. Empty array = conforms. */
export async function vesperProblems(adapter: ContentAdapter<Model, Settings>): Promise<string[]> {
	const problems: string[] = [];
	const c = adapter.collections;
	const [posts, projects, talks, uses, jobs, collage, pages] = await Promise.all([
		c.posts.list(undefined, ctx),
		c.projects.list(undefined, ctx),
		c.talks.list(undefined, ctx),
		c.uses.list(undefined, ctx),
		c.jobs.list(undefined, ctx),
		c.collage.list(undefined, ctx),
		c.pages.list(undefined, ctx),
	]);

	// One category and one series per post: a source that held more recorded the post while it mapped the list.
	problems.push(...termProblems());

	// Filters: each filtered list holds exactly what the shared match rule keeps from the full list, in its order.
	const filtered = async <T extends { slug: string }, Q>(name: string, col: { list(q: Q, c: ContentContext): Promise<{ items: T[] }> }, all: T[], q: Q, match: (e: T, q: Q) => boolean) => {
		const got = (await col.list(q, ctx)).items.map((e) => e.slug);
		const want = all.filter((e) => match(e, q)).map((e) => e.slug);
		if (got.join() !== want.join()) problems.push(`${name}.list(${JSON.stringify(q)}): got [${got.join(", ")}], the match rule keeps [${want.join(", ")}]`);
	};
	const termsOf = async (name: string) => (await adapter.taxonomies?.list(name, ctx)) ?? [];
	const [categories, tags, series] = await Promise.all([termsOf("category"), termsOf("tag"), termsOf("series")]);
	const postQueries: PostQuery[] = [
		...categories.map((t) => ({ category: t.slug })),
		...tags.map((t) => ({ tag: t.slug })),
		...series.map((t) => ({ series: t.slug })),
	];
	for (const q of postQueries) await filtered("posts", c.posts, posts.items, q, matchPost);
	for (const featured of [true, false]) await filtered("projects", c.projects, projects.items, { featured }, matchFeatured);

	// Every collage photo has alt text (the band's photos are content, not decoration).
	for (const p of collage.items) if (!p.alt?.trim()) problems.push(`collage "${p.slug}": needs alt text`);

	// Settings.
	problems.push(...settingsProblems((await adapter.settings?.get(ctx)) ?? {}));

	// Duplicate slugs in every collection, and pages on theme routes.
	for (const [name, items] of Object.entries({ posts: posts.items, projects: projects.items, talks: talks.items, uses: uses.items, jobs: jobs.items, collage: collage.items, pages: pages.items }))
		problems.push(...duplicateSlugs(name, items));
	const plainPages = pages.items.filter((p) => !OWN_ROUTE_PAGES.includes(p.slug));
	problems.push(...reservedRoutes(plainPages, THEME_ROUTES));
	for (const { slug } of plainPages) if (isReservedSlug(slug) && !(THEME_ROUTES as readonly string[]).includes(slug)) problems.push(`pages: "${slug}" collides with the theme's /${slug} route`);
	problems.push(...reservedPostSlugs(posts.items));

	// Sort rules: every list must already be in rule order, filtered lists too.
	const sorted = <T extends { slug: string }>(name: string, items: T[], compare: (a: T, b: T) => number) => problems.push(...sortProblems(name, items, compare));
	sorted("posts", posts.items, (a: Post, b: Post) => comparePosts(a, b));
	sorted("projects", projects.items, compareProjects);
	sorted("talks", talks.items, compareTalks);
	sorted("uses", uses.items, compareUses);
	sorted("jobs", jobs.items, compareJobs);
	sorted("collage", collage.items, compareCollage);
	sorted("pages", pages.items, comparePages);
	for (const sort of ["date-asc", "title"] as const) {
		const q: PostQuery = { sort };
		sorted(`posts (${sort})`, (await c.posts.list(q, ctx)).items, (a: Post, b: Post) => comparePosts(a, b, q));
	}
	for (const q of postQueries) sorted(`posts (${JSON.stringify(q)})`, (await c.posts.list(q, ctx)).items, (a: Post, b: Post) => comparePosts(a, b, q));
	sorted("projects (featured)", (await c.projects.list({ featured: true }, ctx)).items, (a: Project, b: Project) => compareProjects(a, b));

	return problems;
}

/** Posts on a route the article list owns (`/articles/page/…`, `/articles/category/…`): such a post is never reachable. */
export const reservedPostSlugs = (posts: { slug: string }[]) =>
	posts.filter((p) => isReservedPostSlug(p.slug)).map((p) => `posts: "${p.slug}" collides with the list's /articles/${p.slug.toLowerCase()}/ routes`);

const filled = (v: unknown) => typeof v === "string" && v.trim().length > 0;
/** True for a list of objects whose keys all hold non-empty strings. */
const stringRows = (v: unknown, ...keys: string[]) => Array.isArray(v) && v.every((r) => keys.every((k) => filled((r as Entry)?.[k])));

/** Problems with the settings a source returns. Empty array = conforms. */
export function settingsProblems(settings: Partial<Settings>): string[] {
	const problems: string[] = [];
	const s = settings as Entry;
	if (!filled(s.name)) problems.push("settings.name: needs the person's name");
	if (!filled(s.headline)) problems.push("settings.headline: needs a headline (the home page's h1)");
	if (!stringRows(s.socials, "label", "href", "icon")) problems.push("settings.socials: a list, each with a non-empty label, href and icon");
	if (s.nowUpdated !== undefined && !isDate(s.nowUpdated)) problems.push("settings.nowUpdated: must be a date");
	if (s.newsletterAction !== undefined && !filled(s.newsletterAction)) problems.push("settings.newsletterAction: must be a non-empty URL (or leave it out)");
	const o = s.newsletterOptions as Entry | undefined;
	if (o !== undefined) {
		if (!filled(s.newsletterAction)) problems.push("settings.newsletterOptions: set without a newsletterAction (options without an action are no form)");
		if (o.emailName !== undefined && !filled(o.emailName)) problems.push("settings.newsletterOptions.emailName: must be non-empty");
		if (o.honeypot !== undefined && !filled((o.honeypot as Entry)?.name)) problems.push("settings.newsletterOptions.honeypot: needs a non-empty name");
		if (o.hiddenFields !== undefined && !stringRows(o.hiddenFields, "name", "value")) problems.push("settings.newsletterOptions.hiddenFields: each needs a non-empty name and value");
		if (o.nameField !== undefined && typeof o.nameField !== "boolean") problems.push("settings.newsletterOptions.nameField: must be true or false");
		if (o.nameName !== undefined && !filled(o.nameName)) problems.push("settings.newsletterOptions.nameName: must be non-empty");
	}
	if (s.cvFile !== undefined && typeof s.cvFile !== "string") problems.push("settings.cvFile: must be text (a site path or a URL)");
	return problems;
}
