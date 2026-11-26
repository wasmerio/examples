/** The shared search module (src/content/search.ts): collections, routes, hit summaries and limits, for every source. */
import assert from "node:assert/strict";
import { test } from "node:test";
import { keptHits, listPageHits, matchesText, ownListHit, SEARCH_COLLECTIONS, SEARCH_ROUTES, SEARCH_WINDOW, search, searchCollection, searchHref, searchSummary } from "../../src/content/search.ts";

test("the searched collections and their EmDash names: posts, projects and pages; talks and uses are not records", () => {
	assert.deepEqual(Object.keys(SEARCH_COLLECTIONS), ["posts", "projects", "pages"]);
	for (const name of Object.values(SEARCH_COLLECTIONS)) assert.match(name, /^[a-z][a-z0-9_]*$/, "an EmDash slug");
	assert.equal(searchCollection("posts"), "posts");
	assert.equal(searchCollection("talks"), undefined);
	assert.equal(searchCollection("uses"), undefined);
});

test("routes for every searched collection", () => {
	assert.equal(searchHref("posts", "two-days-on-a-trail-crew"), "/articles/two-days-on-a-trail-crew");
	assert.equal(searchHref("projects", "ridgeline"), "/projects/ridgeline");
	assert.equal(searchHref("pages", "about"), "/about");
	assert.deepEqual(Object.keys(SEARCH_ROUTES), Object.keys(SEARCH_COLLECTIONS));
	assert.throws(() => searchHref("talks", "x"), /not searched/);
});

test("summaries: the entry's own text, never its title", () => {
	assert.equal(searchSummary("posts", { title: "T", summary: "One roll." }), "One roll.");
	assert.equal(searchSummary("projects", { title: "T", summary: "Offline maps." }), "Offline maps.");
	assert.equal(searchSummary("pages", { title: "T", summary: "What I do now." }), "What I do now.");
	assert.equal(searchSummary("pages", { body: { format: "markdown", value: { body: "First paragraph.\n\nSecond." } } }), "First paragraph.");
	assert.equal(searchSummary("posts", { title: "T" }), undefined);
	assert.equal(searchSummary("posts", { title: "T", summary: "  " }), undefined);
	const long = "word ".repeat(80);
	assert.ok(searchSummary("projects", { summary: long }).endsWith("…"));
	assert.equal(searchSummary("uses", { summary: "x" }), undefined);
});

test("limits: 20 shown, 21 fetched", () => {
	assert.equal(search.limit, 20);
	assert.equal(search.fetch, 21);
});

test("matching: every word of the query starts a word of the text, any case", () => {
	assert.equal(matchesText("tripod", "Carbon travel tripod"), true);
	assert.equal(matchesText("Trip", "Carbon travel tripod"), true);
	assert.equal(matchesText("carbon tripod", "Carbon travel tripod"), true);
	assert.equal(matchesText("ripod", "Carbon travel tripod"), false);
	assert.equal(matchesText("carbon kayak", "Carbon travel tripod"), false);
	assert.equal(matchesText("  ", "Carbon travel tripod"), false);
});

test("/speaking and /uses are one hit each, from their talks and items, as a static build indexes them", () => {
	const talks = [
		{ slug: "a", title: "Forty megabytes of mountain", event: "Front Range Web Conf", place: "Denver, CO", date: new Date(0) },
		{ slug: "b", title: "No bars", event: "Offline Camp", date: new Date(0) },
	];
	const uses = [{ slug: "c", group: "Camera bag", name: "Carbon travel tripod", note: "Light enough to carry." }];
	const hit = (q) => listPageHits(q, { talks, uses }).map((h) => h.href);
	assert.deepEqual(hit("megabytes"), ["/speaking"]);
	assert.deepEqual(hit("denver"), ["/speaking"]);
	assert.deepEqual(hit("tripod"), ["/uses"]);
	assert.deepEqual(hit("speaking"), ["/speaking"]);
	assert.deepEqual(hit("zzqxv"), []);
	const [one] = listPageHits("tripod", { talks, uses });
	assert.deepEqual({ collection: one.collection, slug: one.slug, title: one.title }, { collection: "pages", slug: "uses", title: "Uses" });
	assert.ok(one.excerpt);
	assert.equal(listPageHits("megabytes", { talks: [], uses }).length, 0, "no talks: only the page's own words");
});

test("/speaking and /uses take their pages entry's title and lead; those entries are never hits of their own", () => {
	const talks = [{ slug: "a", title: "Forty megabytes of mountain", event: "Front Range Web Conf", date: new Date(0) }];
	const uses = [{ slug: "c", group: "Camera bag", name: "Carbon travel tripod" }];
	const pages = {
		speaking: { title: "Talks about calm software and the outdoors.", summary: "I speak a few times a year." },
		uses: { title: "What’s in the bag, and on the desk.", summary: "People ask, so here it is.", image: { src: "/g.webp", alt: "Gear" }, imageCaption: "The lantern stays home." },
	};
	const [speaking] = listPageHits("megabytes", { talks, uses, pages });
	assert.deepEqual({ title: speaking.title, excerpt: speaking.excerpt, href: speaking.href }, { title: pages.speaking.title, excerpt: "I speak a few times a year.", href: "/speaking" });
	// The entry's words match; the theme's own title no longer does (a static build indexes the page as shown).
	assert.deepEqual(listPageHits("outdoors", { talks, uses, pages }).map((h) => h.href), ["/speaking"]);
	assert.deepEqual(listPageHits("speaking", { talks, uses, pages }).map((h) => h.href), []);
	// The entry's photo caption does not show on /uses (it shows no page photo), so it does not match.
	assert.deepEqual(listPageHits("lantern", { talks, uses, pages }).map((h) => h.href), []);
	// An entry hidden from search engines leaves its page out.
	assert.deepEqual(listPageHits("megabytes", { talks, uses, pages: { speaking: { ...pages.speaking, seo: { noindex: true } } } }), []);
	// An entry with no summary: no excerpt.
	assert.equal(listPageHits("talks", { talks, uses, pages: { speaking: { title: "Talks" } } })[0].excerpt, undefined);
	for (const slug of ["projects", "speaking", "uses"]) assert.ok(ownListHit({ collection: "pages", slug }), slug);
	assert.ok(!ownListHit({ collection: "pages", slug: "now" }));
	assert.ok(!ownListHit({ collection: "projects", slug: "uses" }));
});

test("keptHits: hits on a page that is off and hidden entries are left out before the cut, so they never crowd out a hit", async () => {
	assert.ok(SEARCH_WINDOW > search.fetch, "a CMS is asked for more hits than the page shows");
	// 30 project hits (the projects page is off) and 3 noindex posts, then 25 posts the page may show.
	const hits = [
		...Array.from({ length: 30 }, (_, i) => ({ href: `/projects/p${i}` })),
		...Array.from({ length: 3 }, (_, i) => ({ href: `/articles/hidden${i}`, noindex: true })),
		...Array.from({ length: 25 }, (_, i) => ({ href: `/articles/a${i}` })),
	];
	const loaded = [];
	const kept = await keptHits(hits, {
		on: (href) => !href.startsWith("/projects"),
		keep: async (hit) => {
			loaded.push(hit.href);
			return hit.noindex ? undefined : { ...hit, excerpt: "x" };
		},
		max: search.fetch,
	});
	assert.equal(kept.length, search.fetch, "a full page and the one past it, so the page knows more matched");
	assert.deepEqual(
		kept.map((h) => h.href),
		Array.from({ length: search.fetch }, (_, i) => `/articles/a${i}`),
	);
	assert.ok(kept.every((h) => h.excerpt === "x"));
	assert.ok(!loaded.some((href) => href.startsWith("/projects")), "a hit on a page that is off loads no entry");
	assert.equal(loaded.length, 3 + search.fetch, "only the entries it needs: a first batch of 21 (three of them hidden), then three more");
	assert.deepEqual(await keptHits([{ href: "/a" }], { on: () => true, keep: async () => undefined, max: 5 }), []);
});
