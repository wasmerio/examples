/**
 * URLs. Pages, components, the search and the site files build links only through these.
 *
 * Pages (about, privacy) sit at the root (`/<slug>`); now, projects, speaking and uses give their route its words. THEME_ROUTES are the first path segments of the fixed
 * routes; conformance reports a page that takes one. Lists page as `<list>/page/<n>` (page 1 is the list itself).
 *
 * Plain Node loads this file (the unit tests), so it imports only theme-core's route helpers and types.
 *
 * VESPER_PER_PAGE (test only): a smaller page size for one build, so the content tests reach the later pages with the
 * demo's posts. Vite replaces `import.meta.env.VESPER_PER_PAGE` in a build (astro.config.mjs); plain Node has no
 * `import.meta.env`.
 */
import { extraPages } from "@astronomic/theme-core/routes";
import type { Config, OptionalPage } from "./config";

const perPageOverride = typeof import.meta.env === "object" ? Number(import.meta.env.VESPER_PER_PAGE) : NaN;

/** Posts per page on /articles, a category and a tag. */
export const PER_PAGE = Number.isInteger(perPageOverride) && perPageOverride > 0 ? perPageOverride : 10;

/** How many pages a list of `total` posts takes. An empty list still has its first page. */
export const pageCount = (total: number, perPage = PER_PAGE) => extraPages(total, perPage).length + 1;

/** True when page `page` of a list of `total` posts exists: the first always, a later one while it holds a post. */
export const hasPage = (page: number, total: number, perPage = PER_PAGE) => page === 1 || (page >= 2 && (page - 1) * perPage < total);

/**
 * The page number in a rest route's param (`/tags/[tag]/[...page]`): none is page 1, `page/<n>` is page n (2 or
 * more); anything else is null (the route answers 404).
 */
export function restPage(param: string | undefined): number | null {
	if (param === undefined || param === "") return 1;
	const n = /^page\/([1-9]\d*)$/.exec(param)?.[1];
	return n && Number(n) >= 2 ? Number(n) : null;
}

/** A rest route's param for page `page`: undefined for page 1, else `page/<n>`. */
export const restPageParam = (page: number) => (page <= 1 ? undefined : `page/${page}`);

/** Page `page` of a list at `base`: the list itself for page 1, else `<base>/page/<n>`. */
const paged = (base: string, page: number) => (page <= 1 ? base : `${base}/page/${page}`);

export const homeHref = () => "/";
/** Every post, newest first. Page 2 and later are paths, so static builds work. */
export const articlesHref = (page = 1) => paged("/articles", page);
export const postHref = (slug: string) => `/articles/${slug}`;
/** The posts in one category (the filter on /articles). */
export const categoryHref = (slug: string, page = 1) => paged(`/articles/category/${slug}`, page);
export const tagHref = (slug: string, page = 1) => paged(`/tags/${slug}`, page);
export const projectsHref = () => "/projects";
export const projectHref = (slug: string) => `/projects/${slug}`;
export const speakingHref = () => "/speaking";
export const usesHref = () => "/uses";
/** A page from the pages collection (about, now, privacy). */
export const pageHref = (slug: string) => `/${slug}`;
/** The Now page: the pages collection's `now`, with its stamp. */
export const nowHref = () => pageHref("now");
export const aboutHref = () => pageHref("about");
export const searchHref = () => "/search";
export const rssHref = () => "/rss.xml";

/**
 * Post slugs a post cannot take: the second segment of the list's own routes under /articles (`/articles/page/2`,
 * `/articles/category/design`).
 */
export const POST_ROUTES = ["page", "category"] as const;
export const isReservedPostSlug = (slug: string) => (POST_ROUTES as readonly string[]).includes(slug.toLowerCase());

/**
 * First-level routes the theme owns: its pages, its site files (feed, sitemaps, robots, the reader map, share cards), the CV folder,
 * the design system pages, EmDash's admin and the build's own folders. A page with one of these slugs would never be
 * reachable (conformance reports it), except the pages in OWN_ROUTE_PAGES.
 */
export const THEME_ROUTES = [
	"articles",
	"tags",
	"projects",
	"speaking",
	"uses",
	"now",
	"search",
	"404",
	"rss.xml",
	"sitemap.xml",
	"robots.txt",
	"llms.txt",
	"og",
	"system",
	"files",
	"_emdash",
	"_image",
	"_astro",
	"pagefind",
] as const;

/**
 * Pages whose words a theme route shows: the pages collection's `now` is the Now page at /now (with its stamp), and
 * `projects`, `speaking` and `uses` (each optional) set the title and the lead of their list page; without one the
 * list page's head comes from src/theme.strings.ts. Each goes with its route when the page switch turns it off. Conformance allows these slugs on their route.
 */
export const OWN_ROUTE_PAGES: readonly string[] = ["now", "projects", "speaking", "uses"];

/** True when `slug` (a page slug) would take a fixed route, the per-collection sitemaps included. */
export const isReservedSlug = (slug: string) =>
	(THEME_ROUTES as readonly string[]).includes(slug.toLowerCase()) || /^sitemap-.*\.xml$/i.test(slug);

/** Each optional page's route: a link to it, or below it, goes when the page is off. */
export const OPTIONAL_ROUTES: Record<OptionalPage, string> = { projects: projectsHref(), speaking: speakingHref(), uses: usesHref(), now: nowHref() };

/**
 * The optional page a site path belongs to (`/projects/ridgeline?x#y` → "projects"), or undefined. Only site paths
 * count: a full URL is left as it is (a menu may link to another site's /projects).
 */
export function optionalPageOf(href: string): OptionalPage | undefined {
	if (!href.startsWith("/") || href.startsWith("//")) return undefined;
	const path = href.split(/[?#]/)[0].replace(/\/+$/, "").toLowerCase();
	for (const [page, route] of Object.entries(OPTIONAL_ROUTES) as [OptionalPage, string][]) {
		if (path === route || path.startsWith(`${route}/`)) return page;
	}
	return undefined;
}

/** True when a page may link to `href` under `config`: not a link to an optional page that is off. */
export const linkOn = (href: string, config: Pick<Config, "pages">) => {
	const page = optionalPageOf(href);
	return !page || config.pages[page];
};

type MenuLink = { href: string; children?: MenuLink[] };

/** True for a site path to the Now page itself ("/now", "/now/", "/now?x", "/now#y"), not a page below it. */
const isNowPath = (href: string) => href.startsWith("/") && !href.startsWith("//") && href.split(/[?#]/)[0].replace(/\/+$/, "").toLowerCase() === nowHref();

/**
 * The Now page's name: the settings' `nowLabel` ("Status"), else `fallback` (the theme's "Now", src/theme.strings.ts).
 * The address stays /now.
 */
export const nowName = (label: string | undefined, fallback: string) => label?.trim() || fallback;

/**
 * A menu with each link to the Now page named `label` (the settings' `nowLabel`), at every level, so one setting
 * renames it in the nav, the phone menu and the footer. With no label, the menu's own words stay.
 */
export function withNowLabel<T extends { href: string; label: string; children?: T[] }>(menu: readonly T[], label: string | undefined): T[] {
	const name = label?.trim();
	if (!name) return [...menu];
	return menu.map((item) => {
		const named = isNowPath(item.href) ? { ...item, label: name } : item;
		return item.children ? { ...named, children: withNowLabel(item.children, name) } : named;
	});
}

/**
 * A menu without its links to the optional pages that are off (Projects, Speaking, Uses, Now), at every level: a
 * dropped item takes its children with it. The nav, the phone menu and the footer use it.
 */
export function navLinks<T extends MenuLink>(menu: readonly T[], config: Pick<Config, "pages">): T[] {
	return menu.filter((item) => linkOn(item.href, config)).map((item) => (item.children ? { ...item, children: navLinks(item.children, config) } : item));
}
