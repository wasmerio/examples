#!/usr/bin/env node
/**
 * `pnpm test:skins`
 *
 * Checks the accent files in src/styles/accents/ against accents.json, and every pair an accent colors in every look
 * and mode (scripts/lib/skins.mjs):
 *   - every id in accents.json has <id>.css and every .css file is listed; the ids are the ones src/utils/config.ts
 *     knows; global.css imports each file; each file sets its four values to accents.json's (Glacier also on :root,
 *     the default); the accent in src/theme.config.ts is a listed id
 *   - contrast, for each accent in Clear, Field notes and Trail map, light and dark: the accent as text on the ground,
 *     the cards, the second surface and the Now chip's tint (4.5:1); the button's text on the accent, at rest and on
 *     hover (4.5:1); the focus ring on every surface and on the look's photo paper (3:1)
 *
 * Prints each value, then OK or FAIL with the problems. Lodestar's runner is the model (Lodestar has six values per
 * accent; Vesper has four, and its grounds come from three looks).
 */
import { readFileSync } from "node:fs";
import { accentFileProblems, readAccents, skinChecks } from "./lib/skins.mjs";

const at = (path) => new URL(`../${path}`, import.meta.url);
const KNOWN = /export const ACCENTS = \[([^\]]*)\]/.exec(readFileSync(at("src/utils/config.ts"), "utf8"))?.[1].match(/"([^"]+)"/g)?.map((s) => s.slice(1, -1)) ?? [];
const problems = accentFileProblems(KNOWN);
const ids = readAccents().map((a) => a.id);
const chosen = /export\s+const\s+accent\b[^=]*=\s*["']([^"']+)["']/.exec(readFileSync(at("src/theme.config.ts"), "utf8"));
if (!chosen) problems.push('src/theme.config.ts: no `export const accent = "<id>"`');
else if (!ids.includes(chosen[1])) problems.push(`src/theme.config.ts: accent "${chosen[1]}" is not in accents.json`);

let checks = 0;
if (!problems.length) {
	for (const { name, value, min } of skinChecks()) {
		checks++;
		if (!(value >= min)) problems.push(`${name} is ${value.toFixed(2)}, needs ${min}`);
		else console.log(`${name} ${value.toFixed(2)}`);
	}
}

if (problems.length) {
	console.log(`\n${problems.length} problem(s):`);
	for (const p of problems) console.log(`  - ${p}`);
}
console.log(problems.length ? "\nFAIL" : `\nOK (${checks} checks, ${ids.length} accents, 3 looks, light and dark)`);
process.exit(problems.length ? 1 : 0);
