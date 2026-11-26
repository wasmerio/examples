/**
 * Which pages the two rest routes build, from the page switches (getConfig()) and the pages collection:
 *
 * - `src/pages/[...section].astro`: /speaking, /uses and /now while each is on, and the pages collection's pages at
 *   the root (/about and plain pages such as /privacy). One segment only: a param with a "/" is refused, and so is a
 *   first segment the theme keeps for itself (THEME_ROUTES: /articles, /pagefind, /_astro, /_image, ...).
 * - `src/pages/projects/[...slug].astro`: /projects and one page per project while Projects is on.
 *
 * A static build builds only the paths these list (a page that is off is not built, so it answers 404); a server
 * build asks `sectionOf` and `projectPageOf` per request and answers 404 for undefined.
 *
 * Plain Node loads this file (scripts/units/sections.test.mjs): it imports only src/utils.
 */
import type { Config, OptionalPage } from "./config";
import { isReservedSlug, OWN_ROUTE_PAGES } from "./routes";

/** The sections at the root with their own page: Speaking, Uses and Now (each a page switch). */
export const SECTION_PAGES = ["speaking", "uses", "now"] as const satisfies readonly OptionalPage[];
export type SectionPage = (typeof SECTION_PAGES)[number];

/**
 * The list pages whose head a pages collection entry with the same slug may set (OWN_ROUTE_PAGES): /projects,
 * /speaking and /uses.
 */
export const LIST_PAGES = ["projects", "speaking", "uses"] as const satisfies readonly OptionalPage[];
export type ListPage = (typeof LIST_PAGES)[number];
export const isListPage = (slug: string): slug is ListPage => (LIST_PAGES as readonly string[]).includes(slug);

type HeadEntry = { title: string; summary?: string };

/**
 * A list page's head: its pages collection entry's title and lead (the summary) when the entry exists, each field as
 * the entry has it; with no entry, the theme's words (`fallback`, src/theme.strings.ts). A list page shows no page
 * photo (on /uses, a group's own photo shows its gear instead).
 */
export function listHead(entry: HeadEntry | undefined, fallback: { title: string; lead: string }): { title: string; lead?: string } {
	if (!entry) return { title: fallback.title, lead: fallback.lead };
	return { title: entry.title, lead: entry.summary?.trim() || undefined };
}

/** The pages collection's page with its own layout at the root (the rest are plain pages). */
export const ABOUT_SLUG = "about";

/**
 * What a root path shows: one of the optional sections, the about page, or a plain page from the pages collection.
 * `slug` is the path's one segment.
 */
export type Section = { kind: SectionPage; slug: SectionPage } | { kind: "about"; slug: string } | { kind: "page"; slug: string };

/** True for a pages collection slug that is a plain page at the root: not a theme route, not a page a section shows. */
const isRootPage = (slug: string) => !OWN_ROUTE_PAGES.includes(slug) && !isReservedSlug(slug);

/**
 * What `/<param>` shows under `config`, given the pages collection's slugs, or undefined (the route answers 404): no
 * param, more than one segment, a section that is off, a reserved first segment, or no such page.
 */
export function sectionOf(param: string | undefined, config: Pick<Config, "pages">, pageSlugs: readonly string[]): Section | undefined {
	if (!param || param.includes("/")) return undefined;
	if ((SECTION_PAGES as readonly string[]).includes(param)) {
		const page = param as SectionPage;
		return config.pages[page] ? { kind: page, slug: page } : undefined;
	}
	if (!isRootPage(param) || !pageSlugs.includes(param)) return undefined;
	return param === ABOUT_SLUG ? { kind: "about", slug: param } : { kind: "page", slug: param };
}

/** Every root path the section route builds under `config`: the sections that are on, then each root page. */
export function sectionSlugs(config: Pick<Config, "pages">, pageSlugs: readonly string[]): string[] {
	const sections = SECTION_PAGES.filter((page) => config.pages[page]);
	return [...sections, ...pageSlugs.filter(isRootPage)];
}

/** What a param of the projects route shows: the index (no param), one project, or undefined (404). */
export type ProjectPage = { kind: "index" } | { kind: "project"; slug: string };

/**
 * What `/projects/<param>` shows under `config`, or undefined (404): Projects off, more than one segment, or a slug
 * that is not a project's.
 */
export function projectPageOf(param: string | undefined, config: Pick<Config, "pages">, projectSlugs: readonly string[]): ProjectPage | undefined {
	if (!config.pages.projects) return undefined;
	if (param === undefined || param === "") return { kind: "index" };
	if (param.includes("/") || !projectSlugs.includes(param)) return undefined;
	return { kind: "project", slug: param };
}

/** The projects route's params: the index (undefined) and each project, or none while Projects is off. */
export function projectParams(config: Pick<Config, "pages">, projectSlugs: readonly string[]): (string | undefined)[] {
	return config.pages.projects ? [undefined, ...projectSlugs] : [];
}
