/**
 * Motion, read as text: every transition, animation and transform in the theme's stylesheets (src/styles/, the look
 * and accent files too) sits under `prefers-reduced-motion: no-preference`, and every transition or animation class
 * in a component, layout or page is `motion-safe:`. So reduced motion turns every one of them off (vesper.css also
 * stops any left over, the kit's included). The theme's light hover motion is there: the post-row photo's
 * zoom, the title's color, the arrow's nudge, the Now line's arrow and the collage's grow.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { cssBlocks, mediaOf } from "../lib/css-tree.mjs";

const src = fileURLToPath(new URL("../../src/", import.meta.url));
const files = (dir, ext) =>
	readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(join(dir, e.name), ext) : e.name.endsWith(ext) ? [join(dir, e.name)] : []));

const MOVING = /^(transition|transition-[\w-]+|animation|animation-[\w-]+|transform|translate|scale|rotate)$/;
const GUARD = /prefers-reduced-motion: no-preference/;
const stylesheets = files(join(src, "styles"), ".css");

/** Every declaration that moves something, with where it sits: `{ file, heads, prop, value }`. */
function moving() {
	return stylesheets.flatMap((file) =>
		cssBlocks(readFileSync(file, "utf8")).flatMap((block) =>
			block.decls.filter(([prop, value]) => MOVING.test(prop) && !/^(none|0s)\b/.test(value)).map(([prop, value]) => ({ file, heads: block.heads, prop, value })),
		),
	);
}

test("every transition, animation and transform in the stylesheets is under prefers-reduced-motion: no-preference", () => {
	const all = moving();
	assert.ok(all.length > 0);
	const loose = all.filter((d) => !GUARD.test(mediaOf(d.heads))).map((d) => `${d.file.slice(src.length)}: ${d.heads.join(" > ")} { ${d.prop}: ${d.value} }`);
	assert.deepEqual(loose, []);
});

test("the theme's hover motion is there, each under the guard", () => {
	const all = moving().filter((d) => GUARD.test(mediaOf(d.heads)));
	const has = (utility, prop, value) => all.some((d) => d.heads.includes(`@utility ${utility}`) && d.prop === prop && d.value.includes(value));
	assert.ok(has("v-thumb", "transform", "scale(1.05)"), "the post-row photo's zoom");
	assert.ok(has("v-thumb", "transition", "transform 0.6s"), "the zoom's timing");
	assert.ok(has("v-post", "transition", "color"), "the post title's color");
	assert.ok(has("v-alink", "transform", "translateX(3px)"), "the arrow's nudge");
	assert.ok(has("v-alink", "transition", "0.25s"), "the nudge's timing");
	assert.ok(has("v-now-line", "transform", "translateX(3px)"), "the Now line's arrow");
	assert.ok(has("v-band", "transform", "scale(1.055)"), "the collage photo's grow");
	assert.ok(has("v-band", "transition", "transform 0.5s"), "the grow's timing");
});

test("every transition or animation class in the markup is motion-safe", () => {
	const loose = [];
	for (const file of files(src, ".astro")) {
		const text = readFileSync(file, "utf8");
		for (const m of text.matchAll(/(?<![\w:-])((?:[\w-]+:)*)(transition(?:-[\w-]+)?|animate-[\w-]+|duration-\d+)(?![\w-])/g)) {
			const [token, variants] = m;
			if (/\bmotion-safe:/.test(variants) || /\bmotion-reduce:/.test(variants)) continue;
			// Only class names: skip words in comments and prose (a class list has no spaces around a token's colon).
			const line = text.slice(text.lastIndexOf("\n", m.index) + 1, text.indexOf("\n", m.index));
			if (!/class|cn\(|"/.test(line) || /^\s*(\*|\/\/)/.test(line)) continue;
			loose.push(`${file.slice(src.length)}: ${token}`);
		}
	}
	assert.deepEqual(loose, []);
});
