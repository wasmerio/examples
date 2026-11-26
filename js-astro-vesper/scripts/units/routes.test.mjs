/** The href builders, the paging rules, the reserved route lists and the menu filter (src/utils/routes.ts). */
import assert from "node:assert/strict";
import { test } from "node:test";
import {
	aboutHref,
	articlesHref,
	categoryHref,
	hasPage,
	homeHref,
	isReservedPostSlug,
	isReservedSlug,
	linkOn,
	navLinks,
	nowHref,
	nowName,
	withNowLabel,
	optionalPageOf,
	OWN_ROUTE_PAGES,
	pageCount,
	pageHref,
	PER_PAGE,
	postHref,
	projectHref,
	projectsHref,
	rssHref,
	searchHref,
	speakingHref,
	tagHref,
	THEME_ROUTES,
	usesHref,
} from "../../src/utils/routes.ts";
import { SEARCH_ROUTES } from "../../src/content/search.ts";

test("hrefs", () => {
	assert.equal(homeHref(), "/");
	assert.equal(articlesHref(), "/articles");
	assert.equal(articlesHref(1), "/articles");
	assert.equal(articlesHref(2), "/articles/page/2");
	assert.equal(postHref("forty-megabytes"), "/articles/forty-megabytes");
	assert.equal(categoryHref("design"), "/articles/category/design");
	assert.equal(categoryHref("design", 3), "/articles/category/design/page/3");
	assert.equal(tagHref("film"), "/tags/film");
	assert.equal(tagHref("film", 2), "/tags/film/page/2");
	assert.equal(projectsHref(), "/projects");
	assert.equal(projectHref("ridgeline"), "/projects/ridgeline");
	assert.equal(speakingHref(), "/speaking");
	assert.equal(usesHref(), "/uses");
	assert.equal(nowHref(), "/now");
	assert.equal(aboutHref(), "/about");
	assert.equal(pageHref("privacy"), "/privacy");
	assert.equal(searchHref(), "/search");
	assert.equal(rssHref(), "/rss.xml");
});

test("search hits use these routes", () => {
	for (const [collection, route] of Object.entries(SEARCH_ROUTES)) assert.equal(typeof route, "function", collection);
	assert.equal(SEARCH_ROUTES.posts, postHref);
	assert.equal(SEARCH_ROUTES.projects, projectHref);
	assert.equal(SEARCH_ROUTES.pages, pageHref);
});

test("a page never takes a fixed route's first segment", () => {
	for (const slug of ["articles", "tags", "projects", "speaking", "uses", "now", "search", "404", "rss.xml", "sitemap.xml", "robots.txt", "og", "system", "files", "_emdash", "_image", "_astro", "pagefind"]) {
		assert.ok(THEME_ROUTES.includes(slug), `${slug} is reserved`);
		assert.ok(isReservedSlug(slug), slug);
	}
	// Each fixed href builds under a reserved first segment.
	for (const href of [articlesHref(), articlesHref(2), postHref("x"), categoryHref("x", 2), tagHref("x", 2), projectsHref(), projectHref("x"), speakingHref(), usesHref(), nowHref(), searchHref(), rssHref()]) {
		assert.ok(isReservedSlug(href.split("/")[1]), href);
	}
	assert.ok(isReservedSlug("sitemap-posts.xml"), "the per-collection sitemaps");
	assert.ok(isReservedSlug("Projects"), "case does not matter");
	for (const slug of ["about", "privacy", "colophon"]) assert.ok(!isReservedSlug(slug), slug);
	// The Now page's words come from the pages collection, on its own route; so may the list pages' heads.
	assert.deepEqual(OWN_ROUTE_PAGES, ["now", "projects", "speaking", "uses"]);
	for (const slug of OWN_ROUTE_PAGES) assert.ok(isReservedSlug(slug), `${slug} is a theme route`);
});

test("a post never takes the list's own second segments", () => {
	for (const slug of ["page", "category", "Category"]) assert.ok(isReservedPostSlug(slug), slug);
	for (const slug of ["pages", "categories", "forty-megabytes"]) assert.ok(!isReservedPostSlug(slug), slug);
	assert.equal(articlesHref(2).split("/")[2], "page");
	assert.equal(categoryHref("x").split("/")[2], "category");
});

test("paging: 10 a page; page 1 always exists, a later one while it holds a post", () => {
	assert.equal(PER_PAGE, 10);
	assert.equal(pageCount(0), 1);
	assert.equal(pageCount(10), 1);
	assert.equal(pageCount(11), 2);
	assert.equal(pageCount(7, 3), 3, "a smaller page size (VESPER_PER_PAGE)");
	assert.ok(hasPage(1, 0));
	assert.ok(hasPage(2, 11));
	assert.ok(!hasPage(2, 10));
	assert.ok(!hasPage(0, 50));
});

const ALL_ON = { pages: { projects: true, speaking: true, uses: true, now: true } };
const off = (...names) => ({ pages: { ...ALL_ON.pages, ...Object.fromEntries(names.map((n) => [n, false])) } });

test("optionalPageOf: the optional page a site path belongs to, with or without a query, hash or trailing slash", () => {
	assert.equal(optionalPageOf("/projects"), "projects");
	assert.equal(optionalPageOf("/projects/ridgeline?x=1#notes"), "projects");
	assert.equal(optionalPageOf("/speaking/"), "speaking");
	assert.equal(optionalPageOf("/Uses"), "uses");
	assert.equal(optionalPageOf("/now#today"), "now");
	for (const href of ["/", "/nowhere", "/projectsx", "/about", "/articles", "https://example.com/projects", "//example.com/now", "#now", "mailto:a@b.c"]) {
		assert.equal(optionalPageOf(href), undefined, href);
	}
});

test("withNowLabel names every link to /now with the label, at every level; no label keeps the menu's words", () => {
	const menu = [
		{ label: "Now", href: "/now" },
		{ label: "More", href: "/about", children: [{ label: "What I do now", href: "/now/#top" }, { label: "Notes", href: "/now/notes" }, { label: "Elsewhere", href: "https://example.com/now" }] },
	];
	assert.deepEqual(withNowLabel(menu, undefined), menu);
	assert.deepEqual(withNowLabel(menu, "  "), menu);
	assert.deepEqual(
		withNowLabel(menu, " Status ").map((i) => [i.label, i.children?.map((c) => c.label)]),
		[["Status", undefined], ["More", ["Status", "Notes", "Elsewhere"]]],
	);
	assert.equal(nowName(" Status ", "Now"), "Status");
	assert.equal(nowName("", "Now"), "Now");
	assert.equal(nowName(undefined, "Now"), "Now");
});

test("navLinks drops links to the pages that are off, at every level, and keeps the rest in order", () => {
	const menu = [
		{ label: "Articles", href: "/articles" },
		{ label: "Projects", href: "/projects", children: [{ label: "Ridgeline", href: "/projects/ridgeline" }] },
		{ label: "Speaking", href: "/speaking" },
		{ label: "More", href: "/about", children: [{ label: "Uses", href: "/uses" }, { label: "Now", href: "/now" }, { label: "Elsewhere", href: "https://example.com/now" }] },
	];
	assert.deepEqual(navLinks(menu, ALL_ON), menu);
	assert.deepEqual(
		navLinks(menu, off("projects", "now")).map((i) => [i.label, i.children?.map((c) => c.label)]),
		[["Articles", undefined], ["Speaking", undefined], ["More", ["Uses", "Elsewhere"]]],
	);
	assert.deepEqual(navLinks(menu, off("projects", "speaking", "uses", "now")).map((i) => i.label), ["Articles", "More"]);
	assert.ok(linkOn("/articles", off("projects")));
	assert.ok(!linkOn("/projects/x", off("projects")));
});
