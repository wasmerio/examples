/** The theme's cn (src/utils/cn.ts): the kit's merge rules plus the theme's own Tailwind names. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { cn } from "../../src/utils/cn.ts";

test("theme colors merge as colors; theme sizes, fonts, spaces and widths merge in their own groups", () => {
	assert.equal(cn("text-fg", "text-v-body"), "text-v-body");
	assert.equal(cn("text-v-body", "text-muted"), "text-muted");
	assert.equal(cn("bg-surface", "bg-v-chip"), "bg-v-chip");
	assert.equal(cn("border-border", "border-v-border-2"), "border-v-border-2");
	assert.equal(cn("mt-12", "mt-v-sec"), "mt-v-sec");
	assert.equal(cn("px-4", "px-v-gut"), "px-v-gut");
	assert.equal(cn("size-10", "size-v-avatar"), "size-v-avatar");
	assert.equal(cn("font-body", "font-v-meta"), "font-v-meta");
	assert.equal(cn("max-w-head", "max-w-v-bar"), "max-w-v-bar");
	assert.equal(cn("text-inherit", "text-v-brand"), "text-inherit text-v-brand");
	assert.equal(cn("text-small", "text-v-nav"), "text-v-nav");
	assert.equal(cn("text-v-meta", "text-v-body"), "text-v-meta text-v-body");
	// The kit's own names behave as in the kit.
	assert.equal(cn("text-reading", "text-small"), "text-small");
	assert.equal(cn("text-fg", "text-on-band"), "text-on-band");
	assert.equal(cn("border-b-ui", "border-b-0"), "border-b-0");
});

test("the kit's names are all in the theme's copy", () => {
	const quoted = (text) => new Set([...text.matchAll(/"([\w-]+)"/g)].map((m) => m[1]));
	const block = (text) => text.slice(text.indexOf("extendTailwindMerge({"), text.indexOf("export function cn"));
	const kit = quoted(block(readFileSync(fileURLToPath(import.meta.resolve("@astronomic/ui/lib/cn.ts")), "utf8")));
	const theme = quoted(block(readFileSync(new URL("../../src/utils/cn.ts", import.meta.url), "utf8")));
	assert.deepEqual([...kit].filter((name) => !theme.has(name)), []);
});

test("rounded-card-outer is a corner radius, so rounded-none replaces it", () => {
	assert.equal(cn("rounded-card-outer", "rounded-none"), "rounded-none");
});
