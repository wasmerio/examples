/** Which pages the rest routes build under the page switches (src/utils/sections.ts). */
import assert from "node:assert/strict";
import { test } from "node:test";
import { OPTIONAL_PAGES } from "../../src/utils/config.ts";
import { isListPage, LIST_PAGES, listHead, projectPageOf, projectParams, sectionOf, sectionSlugs } from "../../src/utils/sections.ts";

const PAGES = ["about", "now", "privacy"];
const PROJECTS = ["contour", "ridgeline"];

/** Every combination of the four page switches. */
const combos = () =>
	Array.from({ length: 2 ** OPTIONAL_PAGES.length }, (_, n) => ({
		pages: Object.fromEntries(OPTIONAL_PAGES.map((page, i) => [page, Boolean(n & (1 << i))])),
	}));

test("every switch combination builds the sections that are on, then about and the plain pages", () => {
	for (const config of combos()) {
		const on = ["speaking", "uses", "now"].filter((page) => config.pages[page]);
		assert.deepEqual(sectionSlugs(config, PAGES), [...on, "about", "privacy"], JSON.stringify(config.pages));
		for (const page of ["speaking", "uses", "now"]) {
			assert.deepEqual(sectionOf(page, config, PAGES), config.pages[page] ? { kind: page, slug: page } : undefined, `${page} ${JSON.stringify(config.pages)}`);
		}
		assert.deepEqual(projectParams(config, PROJECTS), config.pages.projects ? [undefined, ...PROJECTS] : []);
		assert.deepEqual(projectPageOf(undefined, config, PROJECTS), config.pages.projects ? { kind: "index" } : undefined);
		assert.deepEqual(projectPageOf("contour", config, PROJECTS), config.pages.projects ? { kind: "project", slug: "contour" } : undefined);
	}
});

test("the now page is the Now section, never a plain page, with or without the switch", () => {
	const off = { pages: { projects: true, speaking: true, uses: true, now: false } };
	assert.ok(!sectionSlugs(off, PAGES).includes("now"));
	assert.equal(sectionOf("now", off, PAGES), undefined);
});

test("about has its own layout; other pages are plain", () => {
	const config = combos().at(-1);
	assert.deepEqual(sectionOf("about", config, PAGES), { kind: "about", slug: "about" });
	assert.deepEqual(sectionOf("privacy", config, PAGES), { kind: "page", slug: "privacy" });
	assert.equal(sectionOf("about", config, ["privacy"]), undefined, "no about page, no /about");
});

test("one segment only, and the theme's own first segments are refused", () => {
	const config = combos().at(-1);
	for (const param of [undefined, "", "a/b", "about/x", "speaking/2026", "pagefind", "_astro", "_image", "_emdash", "articles", "tags", "projects", "search", "og", "rss.xml", "sitemap-posts.xml", "nope"]) {
		assert.equal(sectionOf(param, config, [...PAGES, "pagefind", "_astro", "_image", "articles"]), undefined, String(param));
	}
	// A page with a reserved slug is never built either (conformance reports it).
	assert.deepEqual(sectionSlugs(config, [...PAGES, "pagefind", "_astro", "_image", "search"]), ["speaking", "uses", "now", "about", "privacy"]);
	for (const param of ["contour/x", "nope", "a/b"]) assert.equal(projectPageOf(param, config, PROJECTS), undefined, param);
});

test("the list pages' heads: the pages entry's words when there is one, else the theme's words; never a photo", () => {
	assert.deepEqual(LIST_PAGES, ["projects", "speaking", "uses"]);
	assert.ok(isListPage("uses") && !isListPage("now") && !isListPage("about"));
	const fallback = { title: "Uses", lead: "The tools I use." };
	// No entry: the theme's words, no photo.
	assert.deepEqual(listHead(undefined, fallback), { title: "Uses", lead: "The tools I use." });
	// An entry: its own title and lead. An entry's photo and caption are not part of a list page's head.
	const image = { src: "/gear.webp", alt: "Gear on a map" };
	assert.deepEqual(listHead({ title: "What’s in the bag.", summary: " People ask. ", image, imageCaption: "On the desk." }, fallback), {
		title: "What’s in the bag.",
		lead: "People ask.",
	});
	// An entry with no summary has no lead (the theme's lead is not mixed in).
	assert.deepEqual(listHead({ title: "Talks", summary: "  " }, fallback), { title: "Talks", lead: undefined });
	// The list pages' entries are never plain root pages.
	const slugs = [...PAGES, ...LIST_PAGES];
	const on = { pages: { projects: true, speaking: true, uses: true, now: true } };
	assert.deepEqual(sectionSlugs(on, slugs), ["speaking", "uses", "now", "about", "privacy"]);
	assert.equal(sectionOf("projects", on, slugs), undefined);
	assert.deepEqual(sectionOf("uses", on, slugs), { kind: "uses", slug: "uses" });
	assert.equal(sectionOf("uses", { pages: { ...on.pages, uses: false } }, slugs), undefined);
});
