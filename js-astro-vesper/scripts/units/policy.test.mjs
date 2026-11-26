/**
 * Decision 0013, "Named classes, not long arbitrary classes" and "No short form", for the theme's own code: no
 * `var(--…)` inside an arbitrary class, no token read through Tailwind's short form (`x-(--…)`, negatives too), no
 * literal font size, no literal max width, no literal pixel width, no fixed length in a grid track, no written-out
 * underline offset, photo framing or filter amount, and no arbitrary variant (`[&_a]:…`, `[@media…]:…`), in
 * src/**\/*.{astro,ts}. A token gets a name in the theme's `@theme inline` (src/styles/vesper.css); anything else
 * is a `v-` utility there. No allow list.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

/** The kit's rules (packages/ui/test/policy.mjs), for every custom property, not only --ui-*. */
export const RULES = [
	["literal font size", /(?<![\w-])text-(?:\[(?!color:)(?:length:|[\d.]|(?:clamp|calc|min|max)\()[^\]\s]*\]|\(length:[^)\s]*\))/g],
	["var() in an arbitrary class", /(?<![\w-])(?:[\w-]+-)?\[[^\]\s"'`]*?var\(--[^\]\s]*\]/g],
	["literal max width", /(?<![\w-])max-w-(?:\[[^\]\s]+\]|\([^)\s]+\))/g],
	// A box width in pixels; use a named width.
	["literal width", /(?<![\w-])w-\[[\d.]+px\]/g],
	// A box height or size in pixels; name it in vesper.css's @theme inline (size-v-avatar, size-v-icon).
	["literal height or size", /(?<![\w-])(?:h|min-h|size)-\[[\d.]+px\]/g],
	// A grid track with a fixed length (`grid-cols-[1.375rem_…]`); fractions, minmax(0,…fr), auto and repeat stay.
	["literal grid track", /(?<![\w-])grid-(?:cols|rows)-\[[^\]\s]*?\d(?:rem|em|px|ch|vw|vh)[^\]\s]*\]/g],
	// An underline offset, a photo's framing or a filter amount written out; name it as a `v-` utility.
	["literal offset, framing or filter", /(?<![\w-])(?:underline-offset|object|sepia|saturate|grayscale|brightness|contrast|blur|hue-rotate)-\[[^\]\s]+\]/g],
	// A selector or at-rule written as a variant; name it as a `v-` utility (or use the built-in variant).
	["arbitrary variant", /(?<![\w-])(?:[\w-]+:)*\[[&@][^\s"'`]*/g],
	["token shorthand", /(?<![\w-])-?(?!max-w-\()(?!text-\(length:)[a-z][\w-]*?-\((?:[a-z-]+:)?--[^)\s]+\)/g],
];

/** Problems in one file's text, as "file:line: kind: match". */
export function policyProblems(file, text) {
	const problems = [];
	for (const [i, line] of text.split("\n").entries()) {
		for (const [kind, re] of RULES) for (const m of line.matchAll(re)) problems.push(`${file}:${i + 1}: ${kind}: ${m[0]}`);
	}
	return problems;
}

const src = fileURLToPath(new URL("../../src/", import.meta.url));
const files = (dir) =>
	readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(join(dir, e.name)) : /\.(astro|ts)$/.test(e.name) ? [join(dir, e.name)] : []));

test("the rules catch each kind", () => {
	const bad = [
		'class="text-[0.875rem]"',
		'class="text-[calc(1.4rem*var(--v-cut))]"',
		'class="w-[min(var(--v-wrap),100%)]"',
		'class="md:[&_a]:bg-[color-mix(in_oklab,var(--v-chip)_50%,transparent)]"',
		'class="max-w-[15ch]"',
		'class="text-(--v-body)"',
		'class="-mt-(--v-sec)"',
		'class="[&_a]:outline-(--v-body)"',
		'class="sticky w-[190px]"',
		'class="max-tablet:h-[58px]"',
		'class="size-[13px]"',
		'class="min-h-[44px]"',
		'class="[&_input]:h-11"',
		'class="md:[&>[data-nav-end]]:ms-0"',
		'class="[@media(scripting:none)]:hidden"',
		'class="grid grid-cols-[1.375rem_minmax(0,1fr)]"',
		'class="tablet:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]"',
		'class="object-cover object-[50%_60%] sepia-[.35]"',
		'class="underline underline-offset-[0.2em]"',
		'class="hover:underline-offset-[0.25em]"',
	];
	for (const line of bad) assert.ok(policyProblems("x.astro", line).length > 0, line);
	for (const line of ['class="text-v-body max-w-head v-wrap mt-v-sec h-[clamp(600px,88vh,880px)] text-eyebrow max-w-prose noscript:hidden wrap-anywhere peer-data-[state=x]:hidden tablet:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] grid-cols-[repeat(3,auto)] object-cover saturate-90 underline-offset-2"']) assert.deepEqual(policyProblems("x.astro", line), []);
});

test("src uses named classes only", () => {
	const problems = files(src).flatMap((f) => policyProblems(relative(src, f), readFileSync(f, "utf8")));
	assert.deepEqual(problems, []);
});

/**
 * Settings reach pages only through the setup reader (src/utils/setup.ts, `siteSettings(content)`), so the test-only
 * override (VESPER_SETTINGS) and every fallback apply everywhere. The snapshot and conformance routes read the
 * source's own settings on purpose.
 */
test("only the setup reader calls content.settings()", () => {
	const allowed = ["utils/setup.ts", "content/snapshot.route.ts", "content/conformance.route.ts"];
	// The sources define the settings (`SiteParts<Settings>["settings"]`); they do not read them.
	const sources = "content/sources/";
	const problems = files(src)
		.filter((f) => !allowed.includes(relative(src, f)) && !relative(src, f).startsWith(sources))
		.flatMap((f) => readFileSync(f, "utf8").split("\n").flatMap((line, i) => (/\bsettings\s*\(\s*\)|\[\s*["'`]settings["'`]\s*\]/.test(line) ? [`${relative(src, f)}:${i + 1}: ${line.trim()}`] : [])));
	assert.deepEqual(problems, []);
});
