/**
 * The post lists with thumbnails off (`thumbnails: false`), read as text (src/styles/pages.css): a post row is one
 * column unless it has a photo (`data-thumbed`, which PostRow sets only when it renders one), and the article grid
 * keeps its two columns with or without photos. This is the CSS half; the markup half (in a real build with thumbnails
 * off: no photo, no tile and no `data-thumbed`, the rows and the grid still there) needs a build to check.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { cssBlocks, mediaOf } from "../lib/css-tree.mjs";

const blocks = cssBlocks(readFileSync(new URL("../../src/styles/pages.css", import.meta.url), "utf8"));
const columns = (utility) =>
	blocks
		.filter((b) => b.heads[0] === `@utility ${utility}`)
		.flatMap((b) => b.decls.filter(([p]) => p === "grid-template-columns").map(([, value]) => ({ heads: b.heads.slice(1), value })));
const tracks = (value) => value.replace(/minmax\([^)]*\)/g, "x").replace(/repeat\((\d+),[^)]*\)/, (_, n) => Array(Number(n)).fill("x").join(" ")).trim().split(/\s+/).length;

test("a post row is one column, and only a row with a photo has two", () => {
	const rules = columns("v-post");
	const base = rules.filter((r) => r.heads.length === 0);
	assert.equal(base.length, 1);
	assert.equal(tracks(base[0].value), 1, "the row's own grid");
	for (const rule of rules.filter((r) => tracks(r.value) > 1))
		assert.ok(rule.heads.some((h) => h.includes("[data-thumbed]")), `${rule.heads.join(" > ")} gives a row without a photo ${rule.value}`);
});

test("the article grid has two columns (one on phones) whatever the thumbnails", () => {
	const rules = columns("v-post-grid");
	const base = rules.find((r) => r.heads.length === 0);
	assert.equal(tracks(base.value), 2);
	for (const rule of rules) {
		assert.ok(!rule.heads.some((h) => /data-thumb/.test(h)), "the grid does not depend on thumbnails");
		if (rule.heads.length) assert.match(mediaOf(rule.heads), /max-width: 600px/);
	}
	assert.ok(!blocks.some((b) => b.heads.join(" ").includes("data-thumbs")), "no rule reads data-thumbs: the markup leaves the photos out");
});
