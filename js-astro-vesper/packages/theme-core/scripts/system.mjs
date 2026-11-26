/**
 * The design system runner (a theme's `pnpm test:system [source ...]`, default:
 * markdown emdash mixed).
 *
 * Checks the design system pages (`astronomicSystem()` in astro.config.mjs)
 * for each source, in two builds:
 *   1. No leak: a normal build (no ASTRONOMIC_SYSTEM). /system and its three
 *      sub-pages return 404, no `system` dir is written to the out dir, and
 *      the home page has no link to /system (the footer link is off).
 *   2. Render: a build with ASTRONOMIC_SYSTEM=1. All four pages return 200
 *      with their `data-system-page` marker, foundations has at least 10
 *      `data-token` swatches, and if the config sets `sections` the sections
 *      page does not show the "no sections file" stub. The home page links to
 *      /system. If the config sets `screens`, /system shows one preview per
 *      listed screen, and each screen answers with its status (200, or the
 *      `status` it lists, e.g. 404).
 * Builds into dist-system-off-<source> and dist-system-on-<source>, removes
 * them at the end. Never modifies source files. EmDash needs a seeded data.db.
 *
 * `config`: `root` (the project root), and optionally `port` (see createHarness).
 * The sources come from the command line.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { createHarness } from "./harness.mjs";

/** Path -> the `data-system-page` marker it must carry. */
const PAGES = {
	"/system": "overview",
	"/system/foundations": "foundations",
	"/system/components": "components",
	"/system/sections": "sections",
};
const MIN_SWATCHES = 10;
const SECTIONS_STUB = "This theme has no sections file";

/** True if the page links to the system start page (the footer link). */
/** Every link on a page to the design system pages: "/system", "/system/foundations", ... */
const systemHrefs = (html) => [...html.matchAll(/<a\b[^>]*\bhref\s*=\s*["'](\/system(?:\/[\w-]*)?)\/?["']/g)].map((m) => m[1]);
const linksToSystem = (html) => systemHrefs(html).length > 0;
/** The footer links to every design system page. */
const FOOTER_LINKS = ["/system", "/system/foundations", "/system/components", "/system/sections"];

export async function runSystem(config) {
	const sources = process.argv.slice(2).length ? process.argv.slice(2) : ["markdown", "emdash", "mixed"];

	const h = createHarness(config);
	const cwd = h.root;

	// Whether the theme sets its own sections file; if so, the stub must not show.
	const astroConfig = readFileSync(join(cwd, "astro.config.mjs"), "utf8");
	const hasSections = /astronomicSystem\(\s*\{[^}]*\bsections\s*:/.test(astroConfig);
	// The theme's screens file, if set. Node strips its types on import.
	const screensFile = astroConfig.match(/astronomicSystem\(\s*\{[^}]*\bscreens\s*:\s*["']([^"']+)["']/)?.[1];
	const screens = screensFile ? (await import(pathToFileURL(join(cwd, screensFile)).href)).screens : null;

	const get = h.get;

	/** /system shows one preview per listed screen, and every screen answers with its status. */
	async function screenProblems(source, html) {
		const out = [];
		const shown = [...html.matchAll(/<li\b[^>]*\bdata-screen="([^"]*)"/g)].map((m) => m[1].replaceAll("&amp;", "&"));
		if (shown.length !== screens.length) out.push(`${source} (on): /system shows ${shown.length} screens, the screens file lists ${screens.length}`);
		for (const screen of screens) {
			if (!shown.includes(screen.path)) out.push(`${source} (on): /system has no preview for ${screen.path}`);
			const expected = screen.status ?? 200;
			const { status } = await fetch(h.base + screen.path);
			if (status !== expected) out.push(`${source} (on): screen ${screen.name} (${screen.path}) returned ${status}, expected ${expected}`);
		}
		return out;
	}

	const problems = [];

	try {
		for (const source of sources) {
			console.log(`\n=== ${source}: no leak (flag off) ===`);
			const off = h.tempDir(`dist-system-off-${source}`);
			if ((await h.build(off, { source })) !== 0) {
				problems.push(`${source}: build without the flag failed`);
			} else {
				for (const dir of ["system", "client/system"]) {
					if (existsSync(join(off, dir))) problems.push(`${source} (off): ${dir}/ exists in the out dir`);
				}
				const server = await h.serve(off);
				try {
					for (const path of Object.keys(PAGES)) {
						const { status } = await get(path);
						if (status !== 404) problems.push(`${source} (off): ${path} returned ${status}, expected 404`);
					}
					const home = await get("/");
					if (linksToSystem(home.html)) problems.push(`${source} (off): / links to /system`);
				} finally {
					server.stop();
				}
			}

			console.log(`\n=== ${source}: render (ASTRONOMIC_SYSTEM=1) ===`);
			const on = h.tempDir(`dist-system-on-${source}`);
			if ((await h.build(on, { source, env: { ASTRONOMIC_SYSTEM: "1" } })) !== 0) {
				problems.push(`${source}: build with ASTRONOMIC_SYSTEM=1 failed`);
				continue;
			}
			const server = await h.serve(on);
			try {
				for (const [path, marker] of Object.entries(PAGES)) {
					const { status, html } = await get(path);
					if (status !== 200) {
						problems.push(`${source} (on): ${path} returned ${status}, expected 200`);
						continue;
					}
					if (!html.includes(`data-system-page="${marker}"`)) problems.push(`${source} (on): ${path} has no data-system-page="${marker}"`);
					if (marker === "foundations") {
						const swatches = (html.match(/\bdata-token=/g) ?? []).length;
						if (swatches < MIN_SWATCHES) problems.push(`${source} (on): ${path} has ${swatches} data-token swatches, expected at least ${MIN_SWATCHES}`);
					}
					if (marker === "sections" && hasSections && html.includes(SECTIONS_STUB))
						problems.push(`${source} (on): ${path} shows the stub, but the config sets \`sections\``);
					if (marker === "overview" && screens) problems.push(...(await screenProblems(source, html)));
				}
				const home = await get("/");
				const found = new Set(systemHrefs(home.html));
				for (const href of FOOTER_LINKS) if (!found.has(href)) problems.push(`${source} (on): / has no link to ${href}`);
			} finally {
				server.stop();
			}
		}
	} catch (err) {
		problems.push(err.message);
	} finally {
		h.cleanup();
	}

	if (problems.length) {
		console.log(`\n${problems.length} problem(s):`);
		for (const p of problems) console.log(`  - ${p}`);
	}
	console.log(problems.length ? "\nFAIL" : "\nOK");
	process.exit(problems.length ? 1 : 0);
}
