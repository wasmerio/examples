/** The rules every source shares (src/content/rules.ts): sort orders, query filters, the uses groups, job years and series parts. */
import assert from "node:assert/strict";
import { test } from "node:test";
import {
	compareCollage,
	compareJobs,
	comparePages,
	comparePosts,
	compareProjects,
	compareTalks,
	compareUses,
	groupUses,
	jobYears,
	matchFeatured,
	matchPost,
	seriesParts,
} from "../../src/content/rules.ts";

const slugs = (list) => list.map((e) => e.slug);
const sorted = (list, compare) => slugs([...list].sort(compare));
const day = (d, month = "09") => new Date(`2026-${month}-${String(d).padStart(2, "0")}T08:00:00Z`);

test("posts: newest first (default), oldest first or by title, ties by slug", () => {
	const post = (slug, d, title = slug) => ({ slug, title, date: d === undefined ? undefined : day(d) });
	const list = [post("b", 3), post("a", 3), post("c", 9, "Alpha"), post("d", 1)];
	assert.deepEqual(sorted(list, (a, b) => comparePosts(a, b)), ["c", "a", "b", "d"]);
	assert.deepEqual(sorted(list, (a, b) => comparePosts(a, b, { sort: "date-asc" })), ["d", "a", "b", "c"]);
	assert.deepEqual(sorted(list, (a, b) => comparePosts(a, b, { sort: "title" })), ["a", "c", "b", "d"], "a, Alpha, b, d");
	// A post with no date sorts as the oldest.
	assert.deepEqual(sorted([post("x", 2), post("y")], (a, b) => comparePosts(a, b)), ["x", "y"]);
});

test("projects: featured first, then order (none last), title, year (newest, none last), slug", () => {
	const p = (slug, extra = {}) => ({ slug, title: "Same", featured: false, ...extra });
	const list = [
		p("plain-b"),
		p("plain-a"),
		p("old", { year: 2019 }),
		p("new", { year: 2025 }),
		p("ordered", { order: 1 }),
		p("feat-2", { featured: true, order: 2 }),
		p("feat-1", { featured: true, order: 1 }),
		p("feat-none", { featured: true }),
		p("titled", { title: "Alpha" }),
	];
	assert.deepEqual(sorted(list, compareProjects), ["feat-1", "feat-2", "feat-none", "ordered", "titled", "new", "old", "plain-a", "plain-b"]);
});

test("talks: newest first, then order (none last), title, slug", () => {
	const t = (slug, d, extra = {}) => ({ slug, title: "Same", event: "E", date: day(d), ...extra });
	const list = [t("b", 3), t("a", 3), t("first", 3, { order: 1 }), t("alpha", 3, { title: "Alpha" }), t("new", 20), t("old", 1)];
	assert.deepEqual(sorted(list, compareTalks), ["new", "first", "alpha", "a", "b", "old"]);
});

test("uses: groups in the order of their lowest order (none last, then group name), items by order, name, slug", () => {
	const u = (slug, group, name, order) => ({ slug, group, name, ...(order === undefined ? {} : { order }) });
	const list = [
		u("app-b", "Apps", "Same"),
		u("app-a", "Apps", "Same"),
		u("desk-2", "Desk", "Keyboard", 5),
		u("desk-1", "Desk", "Laptop", 4),
		u("desk-none", "Desk", "Lamp"),
		u("bag-1", "Camera bag", "Body", 1),
		u("bag-9", "Camera bag", "Tripod", 9),
		u("bin-a", "Bin", "Zip"),
	];
	const flat = [...list].sort(compareUses);
	assert.deepEqual(
		groupUses(flat).map((g) => [g.group, slugs(g.items)]),
		[
			["Camera bag", ["bag-1", "bag-9"]],
			["Desk", ["desk-1", "desk-2", "desk-none"]],
			["Apps", ["app-a", "app-b"]],
			["Bin", ["bin-a"]],
		],
	);
	// Every tie breaks by slug.
	assert.deepEqual(sorted([u("b", "G", "N"), u("a", "G", "N")], compareUses), ["a", "b"]);
	// groupUses sorts on its own, whatever order it is given.
	assert.deepEqual(groupUses([...list].reverse()).map((g) => g.group), ["Camera bag", "Desk", "Apps", "Bin"]);
	assert.deepEqual(groupUses([]), []);
});

test("jobs: order (none last), then start (newest), company, slug", () => {
	const j = (slug, start, extra = {}) => ({ slug, company: "Same", role: "R", start, ...extra });
	const list = [j("b", 2015), j("a", 2015), j("new", 2022), j("first", 2001, { order: 1 }), j("alpha", 2015, { company: "Alpha" })];
	assert.deepEqual(sorted(list, compareJobs), ["first", "new", "alpha", "a", "b"]);
});

test("collage photos: order (none last), then slug; pages: title, then slug", () => {
	const c = (slug, order) => ({ slug, ...(order === undefined ? {} : { order }) });
	assert.deepEqual(sorted([c("b"), c("a"), c("z", 2), c("y", 1)], compareCollage), ["y", "z", "a", "b"]);
	const pg = (slug, title) => ({ slug, title });
	assert.deepEqual(sorted([pg("b", "Same"), pg("a", "Same"), pg("c", "About")], comparePages), ["c", "a", "b"]);
});

test("matchPost: category, any tag, series, every key at once; sort is not a filter", () => {
	const p = {
		slug: "p",
		category: { slug: "design", label: "Design" },
		tags: [
			{ slug: "maps", label: "Maps" },
			{ slug: "offline", label: "Offline" },
		],
		series: { slug: "ridgeline", label: "Building Ridgeline" },
	};
	assert.ok(matchPost(p, {}));
	assert.ok(matchPost(p, { sort: "title" }));
	assert.ok(matchPost(p, { category: "design" }));
	assert.ok(!matchPost(p, { category: "tools" }));
	assert.ok(matchPost(p, { tag: "offline" }), "any of its tags");
	assert.ok(!matchPost(p, { tag: "film" }));
	assert.ok(matchPost(p, { series: "ridgeline" }));
	assert.ok(!matchPost(p, { series: "darkroom" }));
	assert.ok(matchPost(p, { category: "design", tag: "maps", series: "ridgeline" }));
	assert.ok(!matchPost(p, { category: "design", tag: "film", series: "ridgeline" }));
	const bare = { slug: "q", tags: [] };
	assert.ok(!matchPost(bare, { category: "design" }), "no category");
	assert.ok(!matchPost(bare, { tag: "maps" }), "no tags");
	assert.ok(!matchPost(bare, { series: "ridgeline" }), "no series");
});

test("matchFeatured", () => {
	assert.ok(matchFeatured({ featured: true }, {}));
	assert.ok(matchFeatured({ featured: false }, { featured: false }));
	assert.ok(!matchFeatured({ featured: false }, { featured: true }));
});

test("jobYears: start to end with a spaced en dash; no end is the now label; one year alone", () => {
	assert.equal(jobYears({ start: 2018, end: 2022 }, "Now"), "2018 – 2022");
	assert.equal(jobYears({ start: 2022 }, "Now"), "2022 – Now");
	assert.equal(jobYears({ start: 2022 }, "Present"), "2022 – Present");
	assert.equal(jobYears({ start: 2020, end: 2020 }, "Now"), "2020");
});

test("seriesParts: the series' posts oldest first, the current one marked; none without a series", () => {
	const s = { slug: "ridgeline", label: "Building Ridgeline" };
	const post = (slug, d, series) => ({ slug, title: slug.toUpperCase(), date: day(d), tags: [], ...(series ? { series } : {}) });
	const all = [post("three", 20, s), post("other", 15), post("one", 1, s), post("two", 10, s), post("elsewhere", 5, { slug: "darkroom", label: "Darkroom" })];
	assert.deepEqual(seriesParts(all, all[3]), [
		{ slug: "one", title: "ONE", date: day(1), current: false },
		{ slug: "two", title: "TWO", date: day(10), current: true },
		{ slug: "three", title: "THREE", date: day(20), current: false },
	]);
	assert.deepEqual(seriesParts(all, all[1]), [], "a post with no series");
});
