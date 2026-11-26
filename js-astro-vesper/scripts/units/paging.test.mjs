/** Paging (src/utils/routes.ts): how many pages a list takes, which exist, and the paged routes' params. */
import assert from "node:assert/strict";
import { test } from "node:test";
import { articlesHref, categoryHref, hasPage, pageCount, restPage, restPageParam, tagHref } from "../../src/utils/routes.ts";
import { neighbors, termPagePaths } from "../../src/utils/articles.ts";

test("page counts at 10 a page: 0, 10, 11 and 25 posts", () => {
	assert.equal(pageCount(0, 10), 1, "an empty list still has its first page");
	assert.equal(pageCount(10, 10), 1);
	assert.equal(pageCount(11, 10), 2);
	assert.equal(pageCount(25, 10), 3);
});

test("which pages exist: the first always, a later one only while it holds a post", () => {
	for (const [total, last] of [
		[0, 1],
		[10, 1],
		[11, 2],
		[25, 3],
	]) {
		for (let n = 1; n <= last; n++) assert.equal(hasPage(n, total, 10), true, `page ${n} of ${total}`);
		assert.equal(hasPage(last + 1, total, 10), false, `page ${last + 1} of ${total}`);
	}
	assert.equal(hasPage(0, 25, 10), false);
});

test("a smaller page size (VESPER_PER_PAGE=3) over the demo's ten posts: pages 2 to 4, not 5", () => {
	assert.equal(pageCount(10, 3), 4);
	assert.equal(hasPage(4, 10, 3), true);
	assert.equal(hasPage(5, 10, 3), false);
});

test("hrefs: page 1 is the list itself; later pages are paths", () => {
	assert.equal(articlesHref(2), "/articles/page/2");
	assert.equal(categoryHref("design"), "/articles/category/design");
	assert.equal(categoryHref("design", 3), "/articles/category/design/page/3");
	assert.equal(tagHref("film", 2), "/tags/film/page/2");
});

test("a rest route's page: none is 1, page/<n> from 2; anything else is refused", () => {
	assert.equal(restPage(undefined), 1);
	assert.equal(restPage("page/2"), 2);
	for (const bad of ["page/1", "page/0", "page/02", "2", "page", "page/2/x", "nope"]) assert.equal(restPage(bad), null, bad);
	assert.equal(restPageParam(1), undefined);
	assert.equal(restPageParam(3), "page/3");
});

test("term page paths: page 1 and each later page of each term, as the rest route's params", () => {
	assert.deepEqual(termPagePaths([{ slug: "design", count: 7 }, { slug: "tools", count: 2 }], 3, "slug"), [
		{ params: { slug: "design", page: undefined } },
		{ params: { slug: "design", page: "page/2" } },
		{ params: { slug: "design", page: "page/3" } },
		{ params: { slug: "tools", page: undefined } },
	]);
});

test("previous and next: the older and the newer post in a newest-first list", () => {
	const list = [{ slug: "c" }, { slug: "b" }, { slug: "a" }];
	assert.deepEqual(neighbors(list, "b"), { previous: { slug: "a" }, next: { slug: "c" } });
	assert.deepEqual(neighbors(list, "c"), { previous: { slug: "b" }, next: undefined });
	assert.deepEqual(neighbors(list, "a"), { previous: undefined, next: { slug: "b" } });
	assert.deepEqual(neighbors(list, "x"), { previous: undefined, next: undefined });
});
