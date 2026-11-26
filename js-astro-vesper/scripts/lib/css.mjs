/**
 * A small reader for the look's token files (src/styles/), for the unit tests and `pnpm test:skins`. It knows
 * only what those files hold: rules of custom properties, some inside one `@media` block.
 */
import { readFileSync } from "node:fs";

/**
 * The rules of a stylesheet: `{ media, selector, props }`, where `media` is the enclosing `@media` query ("" at
 * the top) and `props` maps each custom property to its value as written. Comments are dropped.
 */
export function cssRules(text) {
	const css = text.replace(/\/\*[\s\S]*?\*\//g, "");
	const rules = [];
	const stack = [];
	let start = 0;
	for (let i = 0; i < css.length; i++) {
		if (css[i] === "{") {
			stack.push({ head: css.slice(start, i).trim(), body: i + 1 });
			start = i + 1;
		} else if (css[i] === "}") {
			const open = stack.pop();
			start = i + 1;
			if (!open || open.head.startsWith("@")) continue;
			const media = stack.filter((s) => s.head.startsWith("@media")).map((s) => s.head.replace(/^@media\s*/, "")).join(" and ");
			const props = {};
			for (const [, name, value] of css.slice(open.body, i).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) props[name] = value.trim();
			rules.push({ media, selector: open.head.replace(/\s+/g, " "), props });
		}
	}
	return rules;
}

export const readRules = (path) => cssRules(readFileSync(path, "utf8"));

/** The two dark rules every look file repeats: the OS setting (unless the page says light) and the page's own. */
export const DARK_MEDIA = "(prefers-color-scheme: dark)";

/** The props of the rule with this selector and media ("" for none); `{}` when there is none. */
export function propsOf(rules, selector, media = "") {
	return rules.find((r) => r.selector === selector && r.media === media)?.props ?? {};
}

/** A `#rrggbb` value as `[r, g, b]`, or undefined. */
export function hex(value) {
	const m = /^#([0-9a-f]{6})$/i.exec(value ?? "");
	return m ? [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)) : undefined;
}

/** The hue of a `#rrggbb` color, 0 to 360 degrees. */
export function hue(value) {
	const [r, g, b] = hex(value).map((c) => c / 255);
	const max = Math.max(r, g, b);
	const d = max - Math.min(r, g, b);
	if (d === 0) return 0;
	const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
	return (h * 60 + 360) % 360;
}
