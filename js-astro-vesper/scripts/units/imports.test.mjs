/**
 * Import rules (the content walls, decision 0003), for every file under src/. Each rule is an allow list: the files
 * named may import the module, every other file under src/ may not.
 *
 * - Only the content entry point (src/content/index.ts) and the conformance route (src/content/conformance.route.ts)
 *   import the private source, `astronomic:content/source`, in any form (import, export from, dynamic import).
 * - Only files under src/content/ import a source file (`~/content/sources/*`, `/src/content/sources/*` or a relative
 *   path to it): everything else reads content only through `~/content`.
 * - Only the collection configs (src/content.config.ts, src/live.config.ts) and files under src/content/ import
 *   Astro's collections (`astro:content`) or the live loaders (`astronomic:content/live`), which hand out whole entries.
 * - No file outside src/content/sources/ names an EmDash package (`emdash`, `@emdash-cms/*`,
 *   `@astronomic/content/emdash`), so a Markdown build never loads one (`pnpm test:no-emdash` checks the build).
 * - Only the config's reader (src/utils/config.ts) imports the buyer's config file (src/theme.config.ts), in any form:
 *   every other file gets the choices from `getConfig(settings)`, so a later CMS setting reaches them all.
 *   (The rule holds before the file exists, so it is in place when the look adds it.)
 * - No file in the theme names the paid kit package in any form (decision 0012: a free theme uses no paid parts). The
 *   package's name is built from parts here, so this file does not name it either.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, posix, relative, sep } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const SOURCE = "astronomic:content/source";
const SOURCE_READERS = ["content/index.ts", "content/conformance.route.ts"];
const COLLECTIONS = ["astro:content", "astronomic:content/live"];
const COLLECTION_READERS = ["content.config.ts", "live.config.ts"];
const inContent = (path) => path.startsWith("content/");
const EMDASH = /^(emdash(\/|$)|@emdash-cms\/|@astronomic\/content\/emdash(\/|$))/;
const CONFIG_FILE = /^theme\.config(\.ts)?$/;
const CONFIG_READER = "utils/config.ts";
/** The paid kit package's name, in parts (so no file in the theme spells it). */
const PAID = ["ui", "pro"].join("-");

/**
 * Every module specifier a file names: static and side-effect imports, `export … from`, `import()`, `require()` and
 * the patterns of `import.meta.glob()` (one, or a list; a `!` pattern only leaves files out, so it names nothing), in
 * any quotes (a template literal's text up to its first `${` counts, so `import(`./sources/${name}`)` names
 * ./sources/), without a `?query`.
 */
export function specifiers(text) {
	const out = [];
	const q = "[\"'`]([^\"'`]+)[\"'`]";
	for (const re of [new RegExp(`\\b(?:import|export)\\s[^"'\`;]*?\\bfrom\\s*${q}`, "g"), new RegExp(`\\bimport\\s*${q}`, "g"), new RegExp(`\\b(?:import|require)\\s*\\(\\s*${q}`, "g")]) {
		for (const m of text.matchAll(re)) out.push(m[1].split("${")[0].split("?")[0]);
	}
	for (const m of text.matchAll(new RegExp(`\\bimport\\.meta\\.glob\\s*(?:<[^>]*>\\s*)?\\(\\s*(\\[[^\\]]*\\]|${q})`, "g"))) {
		for (const p of m[1].matchAll(new RegExp(q, "g"))) if (!p[1].startsWith("!")) out.push(p[1].split("${")[0].split("?")[0]);
	}
	return out;
}

/** The src/-relative path a specifier names (`~/x`, `/src/x`, `./x`, `../x`), or undefined for a package. */
function target(path, spec) {
	if (spec.startsWith("~/")) return spec.slice(2);
	if (spec.startsWith("/src/")) return spec.slice(5);
	if (spec.startsWith(".")) return posix.normalize(posix.join(posix.dirname(path), spec));
	return undefined;
}

/** Problems for `files`: `{ path, text }` with `path` relative to src/ ("/" separators). */
export function importProblems(files) {
	const problems = [];
	for (const { path, text } of files) {
		for (const spec of specifiers(text)) {
			if (spec === SOURCE && !SOURCE_READERS.includes(path)) problems.push(`${path}: imports ${SOURCE}`);
			if (/^content\/sources(\/|\.|$)/.test(target(path, spec) ?? "") && !inContent(path)) problems.push(`${path}: imports the source file ${spec}`);
			if (COLLECTIONS.includes(spec) && !COLLECTION_READERS.includes(path) && !inContent(path)) problems.push(`${path}: imports ${spec}`);
			if (EMDASH.test(spec) && !path.startsWith("content/sources/")) problems.push(`${path}: names ${spec}`);
			if (CONFIG_FILE.test(target(path, spec) ?? "") && path !== CONFIG_READER) problems.push(`${path}: imports the config file ${spec}`);
		}
	}
	return problems;
}

const src = fileURLToPath(new URL("../../src/", import.meta.url));
const walk = (dir) =>
	readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : /\.(astro|[cm]?[jt]sx?)$/.test(e.name) ? [join(dir, e.name)] : []));

test("the rules catch each break", () => {
	const cases = [
		["pages/x.astro", 'import source from "astronomic:content/source";'],
		["utils/x.ts", 'const s = await import("astronomic:content/source");'],
		["content/x.ts", 'export { default } from "astronomic:content/source";'],
		["components/x.astro", 'import { posts } from "~/content/sources/markdown";'],
		["layouts/x.astro", 'import "../content/sources/emdash";'],
		["utils/x.ts", 'import { x } from "../content/sources/markdown.ts";'],
		["pages/x.astro", 'import { getEmDashCollection } from "emdash";'],
		["components/x.astro", 'import Image from "emdash/ui";'],
		["utils/x.ts", 'import type { X } from "@emdash-cms/auth";'],
		["content/index.ts", 'import Head from "@astronomic/content/emdash/Head.astro";'],
		// Every form of the source, everywhere outside its two readers.
		["content/snapshot.route.ts", 'export * from "astronomic:content/source";'],
		["share-card.ts", "const s = await import(`astronomic:content/source`);"],
		["system/x.ts", "import source from 'astronomic:content/source?raw';"],
		// Source files: anywhere outside src/content/, in any path form.
		["share-card.ts", 'import { posts } from "./content/sources/markdown";'],
		["system/x.astro", 'import { posts } from "/src/content/sources/markdown.ts";'],
		["styles/x.ts", "const m = await import(`../content/sources/${name}.ts`);"],
		["theme.config.ts", 'export { posts } from "~/content/sources/markdown";'],
		["pages/x.astro", 'const m = import.meta.glob("../content/sources/*.ts");'],
		["utils/x.ts", "const m = import.meta.glob(['~/utils/*.ts', '/src/content/sources/*.ts'], { eager: true });"],
		["components/x.astro", "const m = import.meta.glob(`../content/sources/**`);"],
		// Collections and live loaders: outside the configs and src/content/.
		["pages/x.astro", 'import { getCollection } from "astro:content";'],
		["components/x.astro", 'import { getLiveEntry } from "astro:content";'],
		["utils/x.ts", 'import { liveLoaders } from "astronomic:content/live";'],
		["share-card.ts", 'const c = await import("astro:content");'],
		["layouts/x.astro", 'export { defineCollection } from "astro:content";'],
		// The config file: anywhere but its reader, in any path form.
		["layouts/Base.astro", 'import * as config from "../theme.config";'],
		["components/x.astro", 'import { look } from "~/theme.config.ts";'],
		["pages/index.astro", 'const config = await import("/src/theme.config.ts");'],
		["utils/setup.ts", 'export { accent } from "../theme.config";'],
	];
	for (const [path, text] of cases) assert.ok(importProblems([{ path, text }]).length > 0, `${path}: ${text}`);
	const fine = [
		["content/index.ts", 'import source from "astronomic:content/source";'],
		["content/conformance.route.ts", 'import source from "astronomic:content/source";'],
		["pages/x.astro", 'import { useContent } from "~/content";'],
		["content/sources/emdash.ts", 'import { x } from "emdash"; import "@astronomic/content/emdash";'],
		["content/snapshot.route.ts", 'import { a } from "./sources/markdown";'],
		["utils/x.ts", 'import { emdashLike } from "./emdash-like";'],
		["content/sources/markdown.ts", 'import { getEntry } from "astro:content";'],
		["content.config.ts", 'import { defineCollection, reference } from "astro:content";'],
		["live.config.ts", 'import { defineLiveCollection } from "astro:content"; import { liveLoaders } from "astronomic:content/live";'],
		["pages/x.astro", 'import { search } from "~/content/search";'],
		["utils/x.ts", 'const m = import.meta.glob(["./*.ts", "!../content/sources/*.ts"]);'],
		["content/x.ts", 'const m = import.meta.glob("./sources/*.ts");'],
		["utils/config.ts", 'import * as theme from "../theme.config.ts";'],
		["layouts/Base.astro", 'import { getConfig } from "../utils/config";'],
	];
	for (const [path, text] of fine) assert.deepEqual(importProblems([{ path, text }]), [], `${path}: ${text}`);
});

test("src keeps the rules", () => {
	const files = walk(src).map((f) => ({ path: relative(src, f).split(sep).join("/"), text: readFileSync(f, "utf8") }));
	assert.deepEqual(importProblems(files), []);
	// Both readers of the source still read it (a rename would make the first rule vacuous).
	const readers = files.filter((f) => specifiers(f.text).includes(SOURCE)).map((f) => f.path).sort();
	assert.deepEqual(readers, [...SOURCE_READERS].sort());
	// Once the config file exists, its reader still reads it.
	if (files.some((f) => f.path === "theme.config.ts"))
		assert.ok(specifiers(files.find((f) => f.path === CONFIG_READER)?.text ?? "").some((s) => CONFIG_FILE.test(target(CONFIG_READER, s) ?? "")), "utils/config.ts reads theme.config.ts");
});

const theme = fileURLToPath(new URL("../../", import.meta.url));
const SKIP = new Set(["node_modules", "dist", ".astro", "uploads"]);
const allFiles = (dir) =>
	readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
		SKIP.has(e.name) || e.name.startsWith("dist-") ? [] : e.isDirectory() ? allFiles(join(dir, e.name)) : /\.(astro|[cm]?[jt]sx?|json|md|css|html|txt)$/.test(e.name) ? [join(dir, e.name)] : [],
	);

test("no file in the theme names the paid kit package", () => {
	const named = allFiles(theme).filter((f) => readFileSync(f, "utf8").includes(PAID)).map((f) => relative(theme, f));
	assert.deepEqual(named, []);
});
