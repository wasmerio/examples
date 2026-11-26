/**
 * Fills in the live values on the foundations page: token values, contrast
 * numbers, spacing widths and the theme's own tokens. Runs again when the
 * mode changes.
 */
import { contrast, contrastOnImage } from "./contrast.mjs";

const root = document.documentElement;
const read = (name: string) => getComputedStyle(root).getPropertyValue(name).trim();

let canvas: CanvasRenderingContext2D | null = null;

/** Any opaque CSS color (hex, oklch(), color-mix(), names) as sRGB 0–255, via a 1×1 canvas. Null if invalid or see-through. */
function toRgb(colour: string): [number, number, number] | null {
	canvas ??= Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", {
		willReadFrequently: true,
	});
	if (!canvas || !colour || !CSS.supports("color", colour)) return null;
	canvas.clearRect(0, 0, 1, 1);
	canvas.fillStyle = "#000";
	canvas.fillStyle = colour;
	canvas.fillRect(0, 0, 1, 1);
	const [r, g, b, a] = canvas.getImageData(0, 0, 1, 1).data;
	// See-through colors depend on what is behind them, so no single ratio.
	return a < 255 ? null : [r, g, b];
}

function fillTokens(page: Element) {
	for (const item of page.querySelectorAll<HTMLElement>("[data-token]")) {
		const name = item.dataset.token!;
		const current = read(name);
		const slot = item.querySelector("[data-value]");
		if (slot) slot.textContent = current || "not set";

		const out = item.querySelector("[data-contrast]");
		const on = item.dataset.on;
		if (!out || !on) continue;
		const fg = toRgb(current);
		const bg = toRgb(read(on));
		if (!fg || !bg) {
			out.textContent = `Contrast on ${on}: not measurable (a color is not set, not valid, or see-through)`;
			out.className = "text-[0.875rem] text-muted";
			continue;
		}
		const target = Number(item.dataset.target);
		// A color for text on an image (scrim-fg) counts over a black and a white image, under the kit's scrim layers.
		const onImage = item.dataset.onImage !== undefined;
		const ratio = onImage ? contrastOnImage(fg, bg) : contrast(fg, bg);
		const shown = `${ratio.toFixed(2)}:1 on ${on}${onImage ? " over any image" : ""}`;
		if (item.dataset.note) {
			// Advice, not a pass or fail (borders are often decorative).
			out.textContent = `${shown} · target ${target}:1. ${item.dataset.note}`;
			out.className = "text-[0.875rem] text-muted";
		} else if (ratio >= target) {
			out.textContent = `${shown} · AA (${target})`;
			out.className = "text-[0.875rem] text-fg";
		} else {
			out.textContent = `${shown} · below AA (${target})`;
			out.className = "text-[0.875rem] font-semibold text-danger";
		}
	}
}

function fillSpacing(page: Element) {
	for (const item of page.querySelectorAll<HTMLElement>("[data-measure]")) {
		const bar = item.querySelector<HTMLElement>("[data-bar]");
		const slot = item.querySelector("[data-value]");
		if (bar && slot) slot.textContent = `${Math.round(bar.getBoundingClientRect().width * 100) / 100}px`;
	}
}

/** True when one selector in the list is :root alone or with qualifiers, e.g. :root[data-theme="dark"], not ":root .x". */
function isRootRule(selectorText: string): boolean {
	return selectorText.split(",").some((part) => /^:root(?:\[[^\]]*\]|:[\w-]+(?:\([^\s()]*(?:\([^()]*\))?[^\s()]*\))?)*$/.test(part.trim()));
}

/** Names of custom properties set on :root rules (also inside @media and @layer) that start with a prefix. */
function themeTokenNames(prefixes: string[]): string[] {
	const names = new Set<string>();
	const walk = (rules: CSSRuleList) => {
		for (const rule of rules) {
			if (rule instanceof CSSStyleRule && isRootRule(rule.selectorText)) {
				for (const prop of rule.style) {
					if (prefixes.some((prefix) => prop.startsWith(prefix))) names.add(prop);
				}
			}
			if ("cssRules" in rule && rule.cssRules) walk(rule.cssRules as CSSRuleList);
		}
	};
	for (const sheet of document.styleSheets) {
		try {
			walk(sheet.cssRules);
		} catch {
			// A cross-origin sheet: its rules cannot be read.
		}
	}
	return [...names].sort();
}

function fillThemeTokens(page: Element) {
	const table = page.querySelector<HTMLTableElement>("[data-theme-tokens]");
	const body = table?.tBodies[0];
	if (!table || !body) return;
	const prefixes: string[] = JSON.parse(table.dataset.themeTokens || "[]");
	const names = themeTokenNames(prefixes);
	const rows = names.map((name) => {
		const row = document.createElement("tr");
		row.className = "border-b-ui border-solid border-border align-top";
		const cell = (text: string, className: string) => {
			const td = document.createElement("td");
			td.className = className;
			td.textContent = text;
			return td;
		};
		row.append(
			cell(name, "py-2 pr-6 font-mono text-[0.8125rem] whitespace-nowrap"),
			cell(read(name) || "not set", "py-2 font-mono text-[0.8125rem] text-muted [overflow-wrap:anywhere]"),
		);
		return row;
	});
	if (!rows.length) {
		const row = document.createElement("tr");
		const td = document.createElement("td");
		td.colSpan = 2;
		td.className = "py-2 text-muted";
		td.textContent = `No tokens found that start with ${prefixes.join(", ")}.`;
		row.append(td);
		rows.push(row);
	}
	body.replaceChildren(...rows);
}

function refresh() {
	const page = document.querySelector('[data-system-page="foundations"]');
	if (!page) return;
	fillTokens(page);
	fillSpacing(page);
	fillThemeTokens(page);
}

// Inline module scripts can run again after a ClientRouter swap: bind once
// per visit. refresh() does nothing off the foundations page.
const w = window as unknown as { __auiSystemFoundations?: boolean };
if (!w.__auiSystemFoundations) {
	w.__auiSystemFoundations = true;
	new MutationObserver(refresh).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
	matchMedia("(prefers-color-scheme: dark)").addEventListener("change", refresh);
	document.addEventListener("astro:page-load", refresh);
}
refresh();
