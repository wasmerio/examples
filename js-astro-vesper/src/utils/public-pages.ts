/**
 * The site's public pages, for the sitemap and the share cards: every page a search engine should find, in a fixed
 * order. It reads the content with no request, so it never depends on who asks.
 *
 * Listed: the fixed pages (home, articles), the optional pages that are on (projects, speaking, uses, now: their page
 * switches, getConfig), then each post, each project (while Projects is on), each page at the root (about, privacy),
 * each category page and each tag page (page 1 only, and only a term with at least one shown post). Left out: search,
 * 404, paged lists (`/articles/page/2`), a page that is off, entries hidden from search engines (`seo.noindex`, the
 * Now page's too), and a category or tag whose every post is hidden.
 *
 * Each entry's page carries a description (its SEO description, else its summary: plain text) for the reader map; a
 * post's lastmod is its last change (the later of its date and its update).
 *
 * `pageAt(path)` builds the one public page at a path, for the card route, without listing everything.
 */
import { latestDate } from "@astronomic/theme-core/date";
import { listedPages, shownEntries } from "@astronomic/theme-core/feeds";
import { declaredOrigin, publicOrigin } from "@astronomic/theme-core/seo";
import { plainHeading } from "@astronomic/ui/lib/emphasis.ts";
import type { APIContext } from "astro";
import { useContent, type Page, type Post, type Project, type Settings, type Term } from "~/content";
import { strings } from "~/theme.strings";
import { usedTerms } from "./articles";
import { type Config, getConfig } from "./config";
import { articlesHref, categoryHref, homeHref, isReservedPostSlug, nowHref, nowName, pageHref, postHref, projectHref, projectsHref, speakingHref, tagHref, usesHref } from "./routes";
import { ABOUT_SLUG, isListPage, listHead, type ListPage, projectPageOf, sectionOf } from "./sections";
import { siteSettings } from "./setup";

export type PublicPage = {
	path: string;
	/** The share card's title, plain (a heading's emphasis marker never shows): the page's title; on the home page the headline. */
	title: string;
	/** The page's short name for the reader map, where its title is a headline ("Now"); none: the title. */
	name?: string;
	/** The small label over the title on the share card; none on the fixed pages and the lists. */
	label?: string;
	/** The reader map's section (a key of `strings.readerMap`); none: `pages`. */
	section?: keyof typeof strings.readerMap;
	/** One plain line about the page, for the reader map: the entry's SEO description, else its summary. None on the fixed pages. */
	description?: string;
	lastmod?: Date;
	/** True when the page gets a made share card. */
	card: boolean;
};

const t = strings.articles;

/** An entry's description: its SEO description, else its summary (both plain text). */
const describe = (e: { summary?: string; seo?: { description?: string } } | undefined) => e?.seo?.description || e?.summary;
const kinds = strings.search.kinds;

/** The fixed pages. The home card's title is the headline (what the person does); the card's foot names the site. */
function fixedPages(settings: Settings): PublicPage[] {
	return [
		{ path: homeHref(), title: plainHeading(settings.headline || settings.title), name: settings.title, card: true },
		{ path: articlesHref(), title: t.title, card: true },
	];
}

/**
 * The optional list pages that are on: /projects, /speaking and /uses, each titled by its pages entry when there is
 * one (else the theme's words), and left out when that entry is hidden from search engines. (/now is a page from
 * the pages collection: nowPage.)
 */
function sectionPages(config: Pick<Config, "pages">, entries: Partial<Record<ListPage, Page>>): PublicPage[] {
	const list = (page: ListPage, path: string): PublicPage[] =>
		config.pages[page] && !entries[page]?.seo?.noindex ? [{ path, title: plainHeading(listHead(entries[page], strings[page]).title), name: strings[page].title, description: describe(entries[page]), card: true }] : [];
	return [...list("projects", projectsHref()), ...list("speaking", speakingHref()), ...list("uses", usesHref())];
}

/** The list pages' entries among `pages`, by slug. */
const listEntries = (pages: readonly Page[]): Partial<Record<ListPage, Page>> => Object.fromEntries(pages.filter((p) => isListPage(p.slug)).map((p) => [p.slug, p]));

/**
 * /now while it is on: its page's title (with no page yet, the page's name: the settings' `nowLabel`, else "Now"),
 * unless the page is hidden.
 */
function nowPage(config: Pick<Config, "pages">, page: Page | undefined, settings: Pick<Settings, "nowLabel">): PublicPage[] {
	if (!config.pages.now || page?.seo?.noindex) return [];
	return [{ path: nowHref(), title: plainHeading(page?.title ?? nowName(settings.nowLabel, strings.now.title)), name: nowName(settings.nowLabel, strings.now.title), description: describe(page), card: true }];
}

const postPage = (p: Post): PublicPage => ({
	path: postHref(p.slug),
	title: plainHeading(p.title),
	label: p.category?.label ?? kinds.posts,
	section: "posts",
	description: describe(p),
	lastmod: latestDate(p.date, p.updated),
	card: true,
});
const projectPage = (p: Project): PublicPage => ({ path: projectHref(p.slug), title: plainHeading(p.title), label: kinds.projects, section: "projects", description: describe(p), card: true });
const rootPage = (p: Page): PublicPage => ({ path: pageHref(p.slug), title: plainHeading(p.title), ...(p.slug === ABOUT_SLUG ? { name: strings.about.name } : {}), description: describe(p), card: true });
const categoryPage = (c: Term): PublicPage => ({ path: categoryHref(c.slug), title: t.categoryTitle(c.label), section: "categories", card: true });
const tagPage = (c: Term): PublicPage => ({ path: tagHref(c.slug), title: t.tagTitle(c.label), section: "tags", card: true });

/** The terms (categories or tags) with posts that keep their page: at least one of their posts is shown. */
function listedTerms<T extends Term>(terms: readonly T[], posts: readonly Post[], taxonomy: "category" | "tag"): T[] {
	return listedPages(terms, {
		entries: posts,
		shown: (post) => !post.seo?.noindex,
		of: (post) => (taxonomy === "category" ? (post.category ? [post.category.slug] : []) : post.tags.map((tag) => tag.slug)),
	});
}

export async function publicPages(): Promise<PublicPage[]> {
	const content = useContent();
	const [settings, posts, projects, pages, categories, tags] = await Promise.all([
		siteSettings(content),
		// `seo: true`: each entry's noindex (an EmDash source looks it up per entry, so only these lists ask).
		content.posts.list({ seo: true }),
		content.projects.list({ seo: true }),
		content.pages.list({ seo: true }),
		usedTerms(content, "category"),
		usedTerms(content, "tag"),
	]);
	const { config } = getConfig(settings);
	const slugs = pages.items.map((p) => p.slug);
	// The pages the root route shows as pages (about, privacy): not /now, not a reserved slug (src/utils/sections.ts).
	const rootPages = shownEntries(pages.items).filter((p) => {
		const kind = sectionOf(p.slug, config, slugs)?.kind;
		return kind === "about" || kind === "page";
	});
	return [
		...fixedPages(settings),
		...sectionPages(config, listEntries(pages.items)),
		...nowPage(
			config,
			pages.items.find((p) => p.slug === "now"),
			settings,
		),
		...shownEntries(posts.items).map(postPage),
		...(config.pages.projects ? shownEntries(projects.items).map(projectPage) : []),
		...rootPages.map(rootPage),
		...listedTerms(categories, posts.items, "category").map(categoryPage),
		...listedTerms(tags, posts.items, "tag").map(tagPage),
	];
}

/** A term's page at `slug`, when it has a shown post (else undefined). Looks up only that term's posts. */
async function termAt(taxonomy: "category" | "tag", slug: string): Promise<Term | undefined> {
	const content = useContent();
	const [terms, posts] = await Promise.all([content.terms(taxonomy), content.posts.list(taxonomy === "category" ? { category: slug, seo: true } : { tag: slug, seo: true })]);
	const term = terms.find((x) => x.slug === slug);
	return term && shownEntries(posts.items).length > 0 ? term : undefined;
}

/**
 * The one public page at `path`, or undefined (not a public page, or hidden from search engines). Looks up only what
 * the path names.
 */
export async function pageAt(path: string): Promise<PublicPage | undefined> {
	const content = useContent();
	const [, first, second, third, ...rest] = path.split("/");
	if (rest.length) return undefined;
	if (!second) {
		const settings = await siteSettings(content);
		return fixedPages(settings).find((p) => p.path === path) ?? (first ? rootPageAt(first) : undefined);
	}
	if (first === "projects") {
		const [settings, slugs] = await Promise.all([siteSettings(content), content.projects.slugs()]);
		const { config } = getConfig(settings);
		const at = third === undefined ? projectPageOf(second, config, slugs) : undefined;
		if (at?.kind !== "project") return undefined;
		const project = await content.projects.get(at.slug);
		return project && !project.seo?.noindex ? projectPage(project) : undefined;
	}
	if (first === "articles" && second === "category" && third) {
		const term = await termAt("category", third);
		return term ? categoryPage(term) : undefined;
	}
	if (third !== undefined) return undefined;
	if (first === "tags") {
		const term = await termAt("tag", second);
		return term ? tagPage(term) : undefined;
	}
	if (first === "articles" && !isReservedPostSlug(second)) {
		const post = await content.posts.get(second);
		return post && !post.seo?.noindex ? postPage(post) : undefined;
	}
	return undefined;
}

/** The one-segment public page at `/<slug>`: /projects, /speaking, /uses (their switches), /now, about, privacy. */
async function rootPageAt(slug: string): Promise<PublicPage | undefined> {
	const content = useContent();
	const [settings, slugs] = await Promise.all([siteSettings(content), content.pages.slugs()]);
	const { config } = getConfig(settings);
	const page = slugs.includes(slug) ? await content.pages.get(slug) : undefined;
	if (isListPage(slug)) return sectionPages(config, page ? { [slug]: page } : {}).find((p) => p.path === pageHref(slug));
	const section = sectionOf(slug, config, slugs);
	if (!section) return undefined;
	if (section.kind === "now") return nowPage(config, page, settings)[0];
	return page && !page.seo?.noindex ? rootPage(page) : undefined;
}

/** The site's public origin for a route file (SITE_URL at run time on a server build, else `site`). */
export const siteOrigin = ({ site, url }: Pick<APIContext, "site" | "url">) => publicOrigin({ site, url, output: import.meta.env.CONTENT_OUTPUT });

/** The address a form's redirect is built on: as configured, never a request's Host, so with no SITE_URL it stays the placeholder and the form leaves its redirect out. */
export const formOrigin = ({ site, url }: Pick<APIContext, "site" | "url">) => declaredOrigin({ site, url, output: import.meta.env.CONTENT_OUTPUT });
