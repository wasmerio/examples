/**
 * The look's token files against the approved comp (docs/design/vesper/comp.html): the shared preset (vesper.css),
 * the three looks (Clear also with no data-look; light, phones and both dark rules), the four accents, the contrast
 * every text pair needs in every look and mode, the fonts each look names, the stylesheet order, and the buyer's
 * config file with its one reader, getConfig().
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { afterEach, test } from "node:test";
import { contrast } from "@astronomic/ui/system/contrast";
import { DARK_MEDIA, hex, propsOf, readRules } from "../lib/css.mjs";
import { accentFileProblems, LOOK_IDS, lookRules, lookTokens, paperOf, RING, skinChecks, TEXT } from "../lib/skins.mjs";
import * as theme from "../../src/theme.config.ts";
import * as configModule from "../../src/utils/config.ts";

const { ACCENTS, ARTICLE_LISTS, COLLAGES, DEFAULT_CONFIG, LOOKS, OPTIONAL_PAGES, checkConfigFile, getConfig, pageOn, testConfigNotice } = configModule;
const styles = new URL("../../src/styles/", import.meta.url);
const at = (path) => new URL(path, styles);
const text = (path) => readFileSync(at(path), "utf8");
const preset = readRules(at("vesper.css"));
const clear = readRules(at("looks/clear.css"));
const accents = JSON.parse(text("accents/accents.json"));

const PHONE = "(max-width: 900px)";
const CLEAR_LIGHT = ':root, :root[data-look="clear"]';
const CLEAR_DARK_OS = ':root:not([data-look]):not([data-theme="light"]), :root[data-look="clear"]:not([data-theme="light"])';
const CLEAR_DARK_PAGE = ':root:not([data-look])[data-theme="dark"], :root[data-look="clear"][data-theme="dark"]';
const PRESET_DARK_OS = ':root:not([data-theme="light"])';
const PRESET_DARK_PAGE = ':root[data-theme="dark"]';

/** comp.html "L1 Clear", named for the kit (--ui-*) and the theme (--v-*). */
const CLEAR = {
	"--ui-bg": "#fbfbfc", "--ui-surface": "#f3f4f6", "--ui-surface-2": "#eceef1",
	"--ui-fg": "#17181b", "--v-body": "#3d4148", "--ui-muted": "#5b606a", "--ui-border": "#e2e4e8", "--v-border-2": "#cfd3d9",
	"--ui-font-display": /^"Host Grotesk", /,
	"--ui-font-body": /^"Onest", /,
	"--v-font-meta": "var(--ui-font-body)", "--v-font-code": /^"Vesper Mono", /,
	"--ui-display-weight": "680", "--ui-display-track": "-0.034em", "--ui-display-stretch": "100%", "--v-d-lh": "1.04",
	"--ui-heading-weight": "650", "--v-italic": "normal",
	"--v-meta-size": "14px", "--v-meta-track": "0", "--v-meta-case": "none",
	"--ui-radius-card": "18px", "--ui-radius-media": "6px", "--ui-radius-control": "10px",
	"--v-cut": "44px", "--v-print": "transparent", "--v-print-pad": "0px",
	"--v-photo": "brightness(1)",
};
const CLEAR_DARK = {
	"--ui-bg": "#111215", "--ui-surface": "#18191d", "--ui-surface-2": "#202227",
	"--ui-fg": "#ededef", "--v-body": "#c4c7cd", "--ui-muted": "#9a9fa8", "--ui-border": "#26282e", "--v-border-2": "#34373e",
	"--v-photo": "brightness(.9) saturate(.95)",
};
/** comp.html "Base and browser surfaces" and "Responsive". */
const SHARED = { "--v-gut": "40px", "--v-sec": "120px", "--v-base": "17px", "--v-leading": "1.65", "--v-cut-r": "5px", "--ui-cut-size": "var(--v-cut)", "--ui-cut-r": "var(--v-cut-r)" };
const SHARED_PHONE = { "--v-gut": "20px", "--v-sec": "88px", "--v-base": "16.5px" };
/** comp.html "Accents": Glacier. */
const GLACIER = { id: "glacier", label: "Glacier", light: "#0a6a84", dark: "#6ccae4", fgLight: "#ffffff", fgDark: "#101214" };

const ratio = (a, b) => contrast(hex(a), hex(b));
const atLeast = (name, a, b, min) => {
	assert.ok(hex(a) && hex(b), `${name}: ${a} on ${b} must be two #rrggbb colors`);
	const value = ratio(a, b);
	assert.ok(value >= min, `${name}: ${a} on ${b} is ${value.toFixed(2)}, needs ${min}`);
};
const matches = (props, want, where) => {
	for (const [name, value] of Object.entries(want)) {
		if (value instanceof RegExp) assert.match(props[name] ?? "", value, `${where} ${name}`);
		else assert.equal(props[name], value, `${where} ${name}`);
	}
};

test("Clear holds every comp token, light, also on a page with no data-look; the cut is 30px up to 900px", () => {
	matches(propsOf(clear, CLEAR_LIGHT), CLEAR, "clear light");
	assert.equal(propsOf(clear, CLEAR_LIGHT, PHONE)["--v-cut"], "30px");
});

test("Clear's two dark rules hold every comp dark token and agree", () => {
	const os = propsOf(clear, CLEAR_DARK_OS, DARK_MEDIA);
	const page = propsOf(clear, CLEAR_DARK_PAGE);
	matches(os, CLEAR_DARK, "clear dark (OS)");
	assert.deepEqual(os, page, "the two dark rules agree");
});

test("dark mode sets every token the kit's dark rules set (theirs outrank :root), in every look: the look's and the preset's together", () => {
	const kit = readRules(new URL(import.meta.resolve("@astronomic/ui/tokens.css")));
	const kitDark = Object.keys(propsOf(kit, ':root:not([data-theme="light"])', DARK_MEDIA));
	assert.ok(kitDark.length > 10, "the kit's dark rule");
	for (const look of LOOK_IDS) {
		const own = lookRules(look);
		const os = { ...propsOf(preset, PRESET_DARK_OS, DARK_MEDIA), ...own.darkOs };
		const page = { ...propsOf(preset, PRESET_DARK_PAGE), ...own.darkPage };
		assert.deepEqual(kitDark.filter((name) => !(name in os)), [], `${look} dark (OS)`);
		assert.deepEqual(kitDark.filter((name) => !(name in page)), [], `${look} dark (page)`);
		assert.deepEqual(own.darkOs, own.darkPage, `${look}: the two dark rules agree`);
	}
	assert.deepEqual(propsOf(preset, PRESET_DARK_OS, DARK_MEDIA), propsOf(preset, PRESET_DARK_PAGE), "the preset's two dark rules agree");
});

/** comp.html "L2 Field notes" and "L3 Trail map", light and dark, with the phone cut (comp "Responsive"). */
const FIELD = {
	"--ui-bg": "#f4efe6", "--ui-surface": "#ece5d8", "--ui-surface-2": "#e4dccc",
	"--ui-fg": "#2a231e", "--v-body": "#4a4038", "--ui-muted": "#675b50", "--ui-border": "#dcd2c1", "--v-border-2": "#c9bca7",
	"--ui-font-display": /^"Vollkorn", "Vollkorn Fallback", Georgia, /, "--ui-font-body": /^"Commissioner", "Commissioner Fallback", /,
	"--v-font-meta": "var(--ui-font-body)", "--v-font-code": /^"Vesper Mono", /,
	"--ui-display-weight": "560", "--ui-display-track": "-0.014em", "--ui-display-stretch": "100%", "--v-d-lh": "1.06",
	"--ui-heading-weight": "600", "--v-italic": "italic",
	"--v-meta-size": "12.5px", "--v-meta-track": ".08em", "--v-meta-case": "uppercase",
	"--ui-radius-card": "4px", "--ui-radius-media": "2px", "--ui-radius-control": "4px",
	"--v-cut": "36px", "--v-print": "#fdfbf6", "--v-print-pad": "10px",
	"--v-print-shadow": /^drop-shadow\(0 10px 14px rgb\(60 40 20 /, "--v-print-lift": /^drop-shadow\(0 24px 26px rgb\(60 40 20 /,
};
const FIELD_DARK = {
	"--ui-bg": "#1a1714", "--ui-surface": "#221e1a", "--ui-surface-2": "#2a2520",
	"--ui-fg": "#efe7da", "--v-body": "#d3c8b8", "--ui-muted": "#ab9f8f", "--ui-border": "#332d27", "--v-border-2": "#443c34",
	"--v-print": "#2c2722",
	"--v-print-shadow": /^drop-shadow\(0 12px 16px rgb\(0 0 0 \/ 0\.45\)\)$/, "--v-print-lift": /^drop-shadow\(0 24px 28px rgb\(0 0 0 \/ 0\.65\)\)$/,
};
const TRAIL = {
	"--ui-bg": "#eceef1", "--ui-surface": "#f7f8f9", "--ui-surface-2": "#e1e4e8",
	"--ui-fg": "#15181d", "--v-body": "#343a43", "--ui-muted": "#4f5662", "--ui-border": "#d6dae0", "--v-border-2": "#bfc5cd",
	"--ui-font-display": /^"Sora", "Sora Fallback", /, "--ui-font-body": /^"Public Sans", "Public Sans Fallback", /,
	"--v-font-meta": /^"Overpass Mono", /, "--v-font-code": /^"Overpass Mono", /,
	"--ui-display-weight": "600", "--ui-display-track": "-0.036em", "--ui-display-stretch": "100%", "--v-d-lh": "1.04",
	"--ui-heading-weight": "600", "--v-italic": "normal",
	"--v-meta-size": "12.5px", "--v-meta-track": ".01em", "--v-meta-case": "none",
	"--ui-radius-card": "10px", "--ui-radius-media": "4px", "--ui-radius-control": "8px",
	"--v-cut": "48px", "--v-print": "var(--v-edge)", "--v-print-pad": "1px", "--v-edge-w": "1px",
	"--v-mat": "6px", "--v-mat-t": "4px", "--v-mat-bg": "#fafbfc",
	"--v-edge-shadow": /^drop-shadow\(/, "--v-topo": /^color-mix\(/, "--v-topo-ix": /^color-mix\(/,
	"--v-grain": /^url\("data:image\/svg\+xml,/, "--v-grain-a": ".13",
};
const TRAIL_DARK = {
	"--ui-bg": "#14171b", "--ui-surface": "#1c2025", "--ui-surface-2": "#252a31",
	"--ui-fg": "#e7eaee", "--v-body": "#c1c7cf", "--ui-muted": "#9aa2ad", "--ui-border": "#262b32", "--v-border-2": "#353b44",
	"--v-mat-bg": "#262b32", "--v-edge-shadow": /^drop-shadow\(/, "--v-grain": /^url\("data:image\/svg\+xml,/, "--v-grain-a": ".07",
};
/** The photo frame's tokens (the contract with collage.css): every look sets each, so none leaks from another. */
const FRAME = ["--v-print", "--v-print-pad", "--v-print-shadow", "--v-print-lift", "--v-mat", "--v-mat-t", "--v-mat-bg", "--v-edge", "--v-edge-w", "--v-edge-shadow"];

test("Field notes and Trail map hold the comp's tokens, light and dark, with their phone cut (and Field notes' print)", () => {
	for (const [look, light, dark, phone] of [
		["field", FIELD, FIELD_DARK, { "--v-cut": "26px", "--v-print-pad": "7px" }],
		["trail", TRAIL, TRAIL_DARK, { "--v-cut": "32px" }],
	]) {
		const own = lookRules(look);
		matches(own.light, light, `${look} light`);
		matches(own.darkOs, dark, `${look} dark`);
		matches(own.phone, phone, `${look} phones`);
	}
	// The emphasis: italic in the ink in Field notes, the muted ink in Clear and Trail map.
	assert.equal(lookRules("field").light["--v-em"], "currentColor");
	assert.equal(lookRules("trail").light["--v-em"], "var(--ui-muted)");
	assert.equal(lookRules("clear").light["--v-em"], "var(--ui-muted)");
});

test("every look sets every token Clear sets, light and dark, and every photo frame token", () => {
	const clearOwn = lookRules("clear");
	for (const look of LOOK_IDS) {
		const own = lookRules(look);
		assert.deepEqual(Object.keys(clearOwn.light).filter((name) => !(name in own.light)), [], `${look} light`);
		assert.deepEqual(Object.keys(clearOwn.darkOs).filter((name) => !(name in own.darkOs)), [], `${look} dark`);
		assert.deepEqual(FRAME.filter((name) => !(name in own.light)), [], `${look}: the frame tokens`);
		assert.ok("--v-cut" in own.phone, `${look}: the phone cut`);
	}
});

test("contrast in every look: ink, body and muted text on every ground and the photo paper; field edges, danger and the scrim; light and dark", () => {
	for (const look of LOOK_IDS) {
		for (const [mode, t] of Object.entries(lookTokens(look))) {
			const where = `${look} ${mode}`;
			const grounds = [["--ui-bg", t["--ui-bg"]], ["--ui-surface", t["--ui-surface"]], ["--ui-surface-2", t["--ui-surface-2"]]];
			for (const [name, ground] of [...grounds, ...paperOf(t).map((p) => ["the photo paper", p])]) {
				for (const ink of ["--ui-fg", "--v-body", "--ui-muted"]) atLeast(`${where} ${ink} on ${name}`, t[ink], ground, TEXT);
			}
			for (const [name, ground] of grounds) {
				atLeast(`${where} field edge on ${name}`, t["--ui-border-control"], ground, 3);
				atLeast(`${where} danger on ${name}`, t["--ui-danger"], ground, TEXT);
			}
			atLeast(`${where} text on photos (scrim)`, t["--ui-scrim-fg"], t["--ui-scrim"], TEXT);
		}
	}
});

test("Trail map's edge line (a UI boundary) passes 3:1 on its mat, light and dark", () => {
	for (const [mode, t] of Object.entries(lookTokens("trail"))) atLeast(`trail ${mode} edge on the mat`, t["--v-edge"], t["--v-mat-bg"], RING);
});

test("each look's fonts are declared in fonts.css, with their files", () => {
	const fonts = text("fonts.css");
	const declared = new Set([...fonts.matchAll(/font-family: "([^"]+)";/g)].map((m) => m[1]));
	for (const look of LOOK_IDS) {
		const t = lookTokens(look).light;
		for (const prop of ["--ui-font-display", "--ui-font-body", "--v-font-meta", "--v-font-code"]) {
			const first = /^"([^"]+)"/.exec(t[prop])?.[1];
			if (!first) continue;
			assert.ok(declared.has(first), `${look} ${prop}: "${first}" has an @font-face`);
		}
	}
	for (const family of ["Vollkorn", "Commissioner", "Sora", "Public Sans", "Overpass Mono"]) assert.ok(declared.has(family), family);
	// Field notes' emphasis is italic: Vollkorn has its italic file.
	assert.match(fonts, /font-family: "Vollkorn";\s*font-style: italic;/);
	const license = readFileSync(new URL("../assets/fonts/OFL.txt", styles), "utf8");
	for (const family of ["Vollkorn", "Commissioner", "Sora", "Public Sans", "Overpass"]) assert.match(license, new RegExp(`Copyright \\d{4} The ${family} Project Authors`), `OFL.txt: ${family}`);
});

test("accents: every id has its file and every file its id, each matches accents.json, and the config's accent is listed", () => {
	assert.deepEqual(accentFileProblems(ACCENTS), []);
	assert.ok(accents.some((a) => a.id === theme.accent));
	assert.deepEqual(accents.map((a) => a.id), ["glacier", "moss", "alpenglow", "dusk"]);
	const want = { moss: ["#3c682a", "#a5d388"], alpenglow: ["#ac3a25", "#ff9d86"], dusk: ["#5845bd", "#bbb0ff"] };
	for (const [id, [light, dark]] of Object.entries(want)) assert.deepEqual(accents.find((a) => a.id === id), { id, label: accents.find((a) => a.id === id).label, light, dark, fgLight: "#ffffff", fgDark: "#101214" });
});

test("contrast for every accent in every look and mode: text, the Now chip, the button (rest and hover) and the focus ring", () => {
	const checks = skinChecks();
	assert.equal(checks.length, 4 * 3 * 2 * 9 + 2 * 2 * 4, "every pair counted");
	const failing = checks.filter((c) => !(c.value >= c.min)).map((c) => `${c.name}: ${c.value.toFixed(2)} < ${c.min}`);
	assert.deepEqual(failing, []);
});

test("the preset: gutter, section space, body text and the cut's rounding, with the phone values", () => {
	matches(propsOf(preset, ":root"), SHARED, "shared");
	matches(propsOf(preset, ":root", PHONE), SHARED_PHONE, "shared phones");
	// The accent per mode: the light pair on :root, the dark pair in both dark rules; the soft tint and the Now chip.
	const light = propsOf(preset, ":root");
	assert.equal(light["--ui-accent"], "var(--v-accent-light)");
	assert.equal(light["--ui-accent-fg"], "var(--v-accent-fg-light)");
	assert.equal(light["--ui-accent-soft"], "color-mix(in srgb, var(--ui-accent) 12%, var(--ui-bg))");
	assert.equal(light["--v-chip"], "color-mix(in srgb, var(--ui-accent) 9%, var(--ui-bg))");
	for (const props of [propsOf(preset, PRESET_DARK_OS, DARK_MEDIA), propsOf(preset, PRESET_DARK_PAGE)]) {
		assert.equal(props["--ui-accent"], "var(--v-accent-dark)");
		assert.equal(props["--ui-accent-fg"], "var(--v-accent-fg-dark)");
	}
	// The kit nav folds at 900px (its links show from 901px); both fold points in px, as theme.css asks.
	assert.match(text("vesper.css"), /@theme\s*{[^}]*--breakpoint-nav-md:\s*901px;/);
	assert.match(text("vesper.css"), /@theme\s*{[^}]*--breakpoint-nav-lg:\s*1024px;/);
	// The focus ring: 2px in the accent, 3px out; reduced motion stops every transition.
	assert.match(text("vesper.css"), /:focus-visible\s*{\s*outline: 2px solid var\(--ui-accent\);\s*outline-offset: 3px;/);
	assert.match(text("vesper.css"), /prefers-reduced-motion: reduce\)\s*{\s*\*,\s*\*::before,\s*\*::after\s*{\s*transition: none !important;/);
});

test("Glacier sets its four values, also on a page with no data-accent; accents.json agrees", () => {
	const props = propsOf(readRules(at("accents/glacier.css")), ':root, :root[data-accent="glacier"]');
	assert.equal(props["--v-accent-light"], GLACIER.light);
	assert.equal(props["--v-accent-dark"], GLACIER.dark);
	assert.equal(props["--v-accent-fg-light"], GLACIER.fgLight);
	assert.equal(props["--v-accent-fg-dark"], GLACIER.fgDark);
	assert.deepEqual(accents.find((a) => a.id === "glacier"), GLACIER);
	for (const { id, label } of accents) {
		assert.ok(ACCENTS.includes(id), `${id} is a known accent`);
		assert.ok(label, `${id} has a label`);
		assert.ok(existsSync(at(`accents/${id}.css`)), `accents/${id}.css`);
	}
});

test("contrast: text on every ground, the accent as text and the button's text; light and dark", () => {
	const light = propsOf(clear, CLEAR_LIGHT);
	const dark = { ...light, ...propsOf(clear, CLEAR_DARK_OS, DARK_MEDIA) };
	for (const [mode, t, accent, fg] of [
		["light", light, GLACIER.light, GLACIER.fgLight],
		["dark", dark, GLACIER.dark, GLACIER.fgDark],
	]) {
		for (const ground of ["--ui-bg", "--ui-surface", "--ui-surface-2"]) {
			for (const name of ["--ui-fg", "--v-body", "--ui-muted"]) atLeast(`${mode} ${name} on ${ground}`, t[name], t[ground], 4.5);
			atLeast(`${mode} field edge on ${ground}`, t["--ui-border-control"], t[ground], 3);
			atLeast(`${mode} danger on ${ground}`, t["--ui-danger"], t[ground], 4.5);
		}
		for (const ground of ["--ui-bg", "--ui-surface"]) atLeast(`${mode} Glacier as text on ${ground}`, accent, t[ground], 4.5);
		atLeast(`${mode} the button's text on Glacier`, fg, accent, 4.5);
		atLeast(`${mode} text on photos (scrim)`, t["--ui-scrim-fg"], t["--ui-scrim"], 4.5);
	}
});

test("global.css imports the layers in order, and scans only the kit and theme-core", () => {
	const global = text("global.css");
	const order = ["tailwindcss", "@astronomic/ui/tokens.css", "./fonts.css", "@astronomic/ui/theme.css", "./vesper.css", "./looks/clear.css", "./accents/glacier.css", "./collage.css", "./prose.css"];
	const found = [...global.matchAll(/@import "([^"]+)";/g)].map((m) => m[1]);
	assert.deepEqual(found.filter((f) => order.includes(f)), order);
	// Every look and accent file that exists is imported (looks before accents), so a look set per request still styles the page.
	for (const id of LOOKS) if (existsSync(at(`looks/${id}.css`))) assert.ok(found.includes(`./looks/${id}.css`), `looks/${id}.css`);
	for (const id of ACCENTS) if (existsSync(at(`accents/${id}.css`))) assert.ok(found.includes(`./accents/${id}.css`), `accents/${id}.css`);
	assert.ok(found.findLastIndex((f) => f.startsWith("./looks/")) < found.findIndex((f) => f.startsWith("./accents/")), "looks before accents");
	assert.deepEqual([...global.matchAll(/@source "([^"]+)";/g)].map((m) => m[1]), ["../../node_modules/@astronomic/ui/src", "../../node_modules/@astronomic/theme-core/src"]);
});

test("fonts: each face self-hosted with swap, the files and the license beside them", () => {
	const fonts = text("fonts.css");
	const all = [...fonts.matchAll(/@font-face\s*{([^}]*)}/g)].map((m) => m[1]);
	const faces = all.filter((face) => !/font-family: "[^"]+ Fallback";/.test(face));
	assert.ok(faces.length >= 5);
	for (const face of faces) {
		assert.match(face, /font-display: swap;/);
		const file = /url\("\.\.\/assets\/fonts\/([^"]+)"\)/.exec(face)?.[1];
		assert.ok(file && existsSync(new URL(`../assets/fonts/${file}`, styles)), `font file ${file}`);
	}
	for (const family of ["Host Grotesk", "Onest", "Vesper Mono"]) assert.match(fonts, new RegExp(`font-family: "${family}";`), family);
	assert.ok(existsSync(new URL("../assets/fonts/OFL.txt", styles)), "OFL.txt");
	assert.ok(existsSync(new URL("../assets/fonts/HostGrotesk-latin-600.woff", styles)), "the share card's static file");
});

test("fonts: each look's faces have a metric-matched fallback (Georgia for Vollkorn, Arial for the rest), second in the look's stacks", () => {
	const fallbacks = [...text("fonts.css").matchAll(/@font-face\s*{([^}]*)}/g)].map((m) => m[1]).filter((face) => / Fallback";/.test(face));
	const system = { Vollkorn: "Georgia" };
	for (const name of ["Host Grotesk", "Onest", "Vollkorn", "Commissioner", "Sora", "Public Sans"]) {
		const family = `${name} Fallback`;
		const own = fallbacks.filter((face) => face.includes(`font-family: "${family}";`));
		assert.equal(own.length, 2, `${family}: a regular and a bold face`);
		const local = system[name] ?? "Arial";
		assert.match(own[0], new RegExp(`src: local\\("${local}"\\)`), `${family} regular`);
		assert.match(own[1], new RegExp(`src: local\\("${local} Bold"\\)`), `${family} bold`);
		for (const face of own) {
			for (const prop of ["size-adjust", "ascent-override", "descent-override", "line-gap-override"]) assert.match(face, new RegExp(`${prop}: \\d+(\\.\\d+)?%;`), `${family} ${prop}`);
		}
	}
	const light = propsOf(clear, CLEAR_LIGHT);
	assert.match(light["--ui-font-display"], /^"Host Grotesk", "Host Grotesk Fallback", /);
	assert.match(light["--ui-font-body"], /^"Onest", "Onest Fallback", /);
});

test("every look whose file exists names the fonts the layout preloads for it", () => {
	const base = readFileSync(new URL("../../src/layouts/Base.astro", import.meta.url), "utf8");
	const map = /const lookFonts: Record<LookId, string\[\]> = \{([^}]*)\};/.exec(base)?.[1];
	assert.ok(map, "Base.astro's lookFonts");
	for (const look of LOOKS) {
		const list = new RegExp(`\\b${look}: \\[([^\\]]*)\\]`).exec(map)?.[1];
		assert.ok(list !== undefined, `lookFonts.${look}`);
		if (existsSync(at(`looks/${look}.css`))) assert.ok(list.trim() !== "", `looks/${look}.css exists, so lookFonts.${look} needs its display and body files`);
	}
});

test("theme.config.ts uses known ids and the theme's defaults", () => {
	assert.deepEqual(checkConfigFile(), []);
	assert.ok(LOOKS.includes(theme.look));
	assert.ok(ACCENTS.includes(theme.accent));
	assert.ok(COLLAGES.includes(theme.collage));
	assert.ok(ARTICLE_LISTS.includes(theme.articleList));
	assert.deepEqual(
		{ look: theme.look, accent: theme.accent, collage: theme.collage, articleList: theme.articleList, thumbnails: theme.thumbnails, nowLine: theme.nowLine, pages: theme.pages, builtWith: theme.builtWith },
		DEFAULT_CONFIG,
	);
	assert.deepEqual(Object.keys(theme.pages), [...OPTIONAL_PAGES]);
});

test("checkConfigFile reports each bad value", () => {
	const good = { ...DEFAULT_CONFIG, pages: { ...DEFAULT_CONFIG.pages } };
	assert.deepEqual(checkConfigFile(good), []);
	const bad = { look: "field-notes", accent: "teal", collage: "grid", articleList: "cards", thumbnails: "yes", nowLine: 1, builtWith: undefined, pages: { projects: true, speaking: "no", uses: true, blog: true } };
	const problems = checkConfigFile(bad);
	for (const word of ['look "field-notes"', 'accent "teal"', 'collage "grid"', 'articleList "cards"', "thumbnails must", "nowLine must", "builtWith must", "pages.speaking must", "pages.now must", '"pages.blog"']) {
		assert.ok(problems.some((p) => p.includes(word)), `${word}: ${problems.join(" | ")}`);
	}
	assert.match(checkConfigFile({ ...good, pages: null })[0], /pages must be an object/);
});

const FILE = { ...DEFAULT_CONFIG, pages: { ...DEFAULT_CONFIG.pages } };
afterEach(() => delete process.env.VESPER_CONFIG);

test("getConfig: the file alone", () => {
	assert.deepEqual(getConfig(undefined, { values: FILE }), { config: DEFAULT_CONFIG, warnings: [] });
	assert.deepEqual(getConfig({ config: null }, { values: FILE }).config, DEFAULT_CONFIG);
});

test("getConfig: a set field wins, an empty one keeps the file value", () => {
	const { config, warnings } = getConfig({ config: { look: "trail", accent: "", collage: undefined, thumbnails: false, pages: { now: false, uses: null } } }, { values: FILE });
	assert.deepEqual(warnings, []);
	assert.equal(config.look, "trail");
	assert.equal(config.accent, "glacier");
	assert.equal(config.collage, "mosaic");
	assert.equal(config.thumbnails, false);
	assert.deepEqual(config.pages, { projects: true, speaking: true, uses: true, now: false });
	assert.equal(pageOn(config, "now"), false);
	assert.equal(pageOn(config, "uses"), true);
	assert.equal(pageOn(config, "about"), true, "a page that is not optional is always on");
});

test("getConfig: the article list is grid by default; rows from the settings or VESPER_CONFIG; an unknown one keeps the file value", () => {
	assert.equal(getConfig(undefined, { values: FILE }).config.articleList, "grid");
	assert.equal(getConfig({ config: { articleList: "rows" } }, { values: FILE }).config.articleList, "rows");
	const { config, warnings } = getConfig({ config: { articleList: "cards" } }, { values: FILE });
	assert.equal(config.articleList, "grid");
	assert.match(warnings[0], /unknown articleList "cards"/);
	process.env.VESPER_CONFIG = JSON.stringify({ articleList: "rows" });
	assert.equal(getConfig(undefined, { values: FILE }).config.articleList, "rows");
});

test("getConfig: an unknown key, id or switch value keeps the file value with a warning, never an error", () => {
	const { config, warnings } = getConfig({ config: { look: "neon", tone: "warm", nowLine: "off", pages: { blog: false, projects: "no" } } }, { values: FILE, mode: "static" });
	assert.deepEqual(config, DEFAULT_CONFIG);
	assert.equal(warnings.length, 5);
	assert.ok(warnings.every((w) => w.startsWith("Config: settings.config")));
	assert.match(warnings.join(" "), /unknown look "neon"/);
	assert.match(warnings.join(" "), /unknown setting "tone"/);
	assert.match(getConfig({ config: "clear" }, { values: FILE }).warnings[0], /settings.config is not an object/);
});

test("getConfig: VESPER_CONFIG goes over the settings; an unknown id there throws outside production", () => {
	process.env.VESPER_CONFIG = JSON.stringify({ look: "trail", pages: { speaking: false } });
	const { config } = getConfig({ config: { look: "field", accent: "moss" } }, { values: FILE });
	assert.equal(config.look, "trail");
	assert.equal(config.accent, "moss");
	assert.equal(config.pages.speaking, false);
	assert.match(testConfigNotice(), /VESPER_CONFIG is set \(test only\)/);

	for (const mode of ["static", "dev"]) {
		process.env.VESPER_CONFIG = JSON.stringify({ look: "neon" });
		assert.throws(() => getConfig(undefined, { values: FILE, mode }), /VESPER_CONFIG: unknown look "neon"/);
		process.env.VESPER_CONFIG = "{look";
		assert.throws(() => getConfig(undefined, { values: FILE, mode }), /VESPER_CONFIG is not JSON/);
	}
	// A production server logs once and keeps the value it had.
	process.env.VESPER_CONFIG = JSON.stringify({ look: "neon", accent: "dusk" });
	const lines = [];
	const out = getConfig(undefined, { values: FILE, mode: "production", log: (line) => lines.push(line) });
	assert.equal(out.config.look, "clear");
	assert.equal(out.config.accent, "dusk");
	getConfig(undefined, { values: FILE, mode: "production", log: (line) => lines.push(line) });
	assert.equal(lines.length, 1, "logged once");
	delete process.env.VESPER_CONFIG;
	assert.equal(testConfigNotice(), undefined);
});

test("getConfig: a bad config file stops a build and dev, and takes the default on a production server", () => {
	const bad = { ...FILE, look: "neon", builtWith: "yes" };
	for (const mode of ["static", "dev"]) assert.throws(() => getConfig(undefined, { values: bad, mode }), /src\/theme\.config\.ts: unknown look "neon"/);
	const lines = [];
	const { config } = getConfig(undefined, { values: bad, mode: "production", log: (line) => lines.push(line) });
	assert.equal(config.look, "clear");
	assert.equal(config.builtWith, false);
	assert.equal(lines.length, 2);
});
