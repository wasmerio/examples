/**
 * The looks' and accents' colors as the browser sees them, for the unit tests and `pnpm test:skins`.
 *
 * A look's tokens in a mode: Clear's light rule (it is also on plain :root, so it is under every look), then the
 * look's light rule, then (dark) the look's dark rule for the OS setting. The two dark rules of each look must agree
 * (lookProblems). An accent's four values come from accents.json, which each accent file must match.
 *
 * skinChecks() runs every pair an accent colors, in every look and mode:
 *   - the accent as text on the ground, the cards (surface), the second surface and the Now chip's tint (the accent
 *     9% over the ground), at 4.5:1
 *   - the button's text on the accent, at rest and on hover (the fill mixed toward the ink, as the preset's
 *     --ui-accent-hover-amount says), at 4.5:1
 *   - the focus ring (the accent, 2px) on every surface: the ground, the cards, the second surface, and the look's
 *     photo paper (Field notes' print, Trail map's mat), at 3:1
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { contrast, over } from "@astronomic/ui/system/contrast";
import { DARK_MEDIA, hex, propsOf, readRules } from "./css.mjs";

export const TEXT = 4.5;
export const RING = 3;

const styles = new URL("../../src/styles/", import.meta.url);
const at = (path) => new URL(path, styles);

/** The look ids that have a file, and each look's rule selectors. */
export const LOOK_IDS = ["clear", "field", "trail"];
export const lookSelectors = (id) =>
	id === "clear"
		? {
				light: ':root, :root[data-look="clear"]',
				darkOs: ':root:not([data-look]):not([data-theme="light"]), :root[data-look="clear"]:not([data-theme="light"])',
				darkPage: ':root:not([data-look])[data-theme="dark"], :root[data-look="clear"][data-theme="dark"]',
			}
		: { light: `:root[data-look="${id}"]`, darkOs: `:root[data-look="${id}"]:not([data-theme="light"])`, darkPage: `:root[data-look="${id}"][data-theme="dark"]` };

/** A look's own rules: `{ light, phone, darkOs, darkPage }`, each a props map as written. */
export function lookRules(id) {
	const rules = readRules(at(`looks/${id}.css`));
	const s = lookSelectors(id);
	return {
		light: propsOf(rules, s.light),
		phone: propsOf(rules, s.light, "(max-width: 900px)"),
		darkOs: propsOf(rules, s.darkOs, DARK_MEDIA),
		darkPage: propsOf(rules, s.darkPage),
	};
}

/** A look's tokens in light and dark, as they apply on the page (Clear's light rule under every look). */
export function lookTokens(id) {
	const base = lookRules("clear").light;
	const own = lookRules(id);
	const light = { ...base, ...own.light };
	return { light, dark: { ...light, ...own.darkOs } };
}

/** The look's photo paper, where one sits behind photos: Field notes' print, Trail map's mat. */
export const paperOf = (tokens) => [tokens["--v-print"], tokens["--v-mat-bg"]].filter((v) => hex(v));

export const readAccents = () => JSON.parse(readFileSync(at("accents/accents.json"), "utf8"));

/** Every accent file matches accents.json, every id has a file and every file an id; global.css imports each. */
export function accentFileProblems(known) {
	const problems = [];
	const accents = readAccents();
	const ids = accents.map((a) => a.id);
	if (known && JSON.stringify(ids) !== JSON.stringify([...known])) problems.push(`accents.json lists ${ids.join(", ")}; src/utils/config.ts ACCENTS is ${known.join(", ")}`);
	for (const file of readdirSync(at("accents/")).filter((f) => f.endsWith(".css"))) {
		if (!ids.includes(file.slice(0, -4))) problems.push(`accents/${file} is not listed in accents.json`);
	}
	const global = readFileSync(at("global.css"), "utf8");
	for (const accent of accents) {
		const { id, label } = accent;
		if (!/^[a-z][a-z0-9-]*$/.test(id)) problems.push(`bad id: ${id}`);
		if (!label) problems.push(`${id}: no label`);
		if (!existsSync(at(`accents/${id}.css`))) {
			problems.push(`${id}: no accents/${id}.css`);
			continue;
		}
		if (!global.includes(`@import "./accents/${id}.css";`)) problems.push(`global.css does not import ./accents/${id}.css`);
		const selector = id === "glacier" ? ':root, :root[data-accent="glacier"]' : `:root[data-accent="${id}"]`;
		const props = propsOf(readRules(at(`accents/${id}.css`)), selector);
		for (const [key, prop] of [["light", "--v-accent-light"], ["dark", "--v-accent-dark"], ["fgLight", "--v-accent-fg-light"], ["fgDark", "--v-accent-fg-dark"]]) {
			if (!hex(accent[key])) problems.push(`accents.json ${id}.${key} is not a #rrggbb value`);
			else if (props[prop]?.toLowerCase() !== accent[key].toLowerCase()) problems.push(`accents/${id}.css (${selector}): ${prop} is ${props[prop]}, expected ${accent[key]}`);
		}
	}
	return problems;
}

/** Every contrast pair an accent colors, in every look and mode: `{ checks: [{ name, value, min }] }`. */
export function skinChecks() {
	const preset = propsOf(readRules(at("vesper.css")), ":root");
	const hoverShare = Number.parseFloat(preset["--ui-accent-hover-amount"]) / 100;
	const checks = [];
	const check = (name, a, b, min) => checks.push({ name, value: contrast(a, b), min });
	for (const accent of readAccents()) {
		for (const look of LOOK_IDS) {
			const tokens = lookTokens(look);
			for (const mode of ["light", "dark"]) {
				const t = tokens[mode];
				const fill = hex(mode === "light" ? accent.light : accent.dark);
				const fg = hex(mode === "light" ? accent.fgLight : accent.fgDark);
				const where = `${accent.id} in ${look} ${mode}`;
				const grounds = [["ground", t["--ui-bg"]], ["cards", t["--ui-surface"]], ["second surface", t["--ui-surface-2"]]];
				for (const [name, ground] of grounds) check(`${where}: the accent as text on the ${name}`, fill, hex(ground), TEXT);
				check(`${where}: the accent as text on the Now chip`, fill, over(fill, 0.09, hex(t["--ui-bg"])), TEXT);
				check(`${where}: the button's text on the accent`, fg, fill, TEXT);
				check(`${where}: the button's text on the accent (hover)`, fg, over(fill, hoverShare, hex(t["--ui-fg"])), TEXT);
				for (const [name, ground] of [...grounds, ...paperOf(t).map((p) => ["photo paper", p])]) check(`${where}: the focus ring on the ${name}`, fill, hex(ground), RING);
			}
		}
	}
	return checks;
}
