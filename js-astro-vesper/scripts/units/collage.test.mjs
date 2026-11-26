/**
 * The collage band's grids (src/styles/collage.css, v-band), read as text: for every layout (Mosaic, Row, Contact
 * sheet), count (4, 5, 6) and breakpoint (desktop, tablet, phone) a grid that packs the band (every area a rectangle,
 * no empty cell, every shown photo once), the photos hidden only where the layout says (Mosaic on a phone shows four),
 * a cut corner for every shown photo that faces a gutter with a photo across it (never a corner of the band), two
 * photos that both cut toward the gutter between them cutting at the same point of it, no photo under 120px on its
 * short side at 360px wide (4 and 5 photos; the 6-photo grids are the comp's), and hover only with motion allowed.
 *
 * A breakpoint with no rule of its own keeps the wider one's, as the cascade does (max-width queries, tablet then
 * phone): the effective grid is desktop, then tablet over it, then phone over that.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { cssBlocks, mediaOf } from "../lib/css-tree.mjs";
import { readFileSync } from "node:fs";
import { COLLAGES } from "../../src/utils/config.ts";

const css = readFileSync(new URL("../../src/styles/collage.css", import.meta.url), "utf8");
const band = cssBlocks(css).filter((b) => b.heads.includes("@utility v-band"));

const COUNTS = [4, 5, 6];
const BPS = ["desktop", "tablet", "phone"];
const LETTERS = "abcdef";
/** The photos the band hides: Mosaic on a phone shows four (6: photos 1, 2, 4 and 5, as the comp; 5: the first four). */
const HIDDEN = { mosaic: { phone: { 6: [3, 6], 5: [5], 4: [] } } };
/** The band's width at 360px: Mosaic and Contact sheet keep the 20px side gutters, Row runs edge to edge. */
const WIDTH_AT_360 = { mosaic: 320, row: 360, sheet: 320 };

function bpOf(heads) {
	const media = mediaOf(heads);
	if (/hover|reduced-motion|900px/.test(media)) return undefined;
	if (media.includes("max-width: 600px")) return "phone";
	if (media.includes("max-width: 1100px")) return "tablet";
	return media === "" ? "desktop" : undefined;
}

/** The effective grid of one case: the grid's declarations, the photos' corners, aspect ratios and hidden ones. */
function effective(layout, count, bp) {
	const upTo = BPS.slice(0, BPS.indexOf(bp) + 1);
	const grid = {};
	const corners = {};
	const aspect = {};
	let photoAspect;
	const hidden = new Set();
	for (const level of upTo) {
		// The layout's own rules first, then the count's (more specific), each at this breakpoint.
		for (const withCount of [false, true]) {
			for (const block of band) {
				const joined = block.heads.join(" ");
				if (!joined.includes(`[data-collage="${layout}"]`) || /data-look/.test(joined)) continue;
				const c = /\[data-count="(\d)"\]/.exec(joined)?.[1];
				if (withCount ? Number(c) !== count : c !== undefined) continue;
				if (bpOf(block.heads) !== level) continue;
				const selector = block.heads.filter((h) => !h.startsWith("@")).at(-1);
				const decls = Object.fromEntries(block.decls);
				if (selector === "& [data-band-grid]") Object.assign(grid, decls);
				else if (selector.startsWith("& [data-ph]")) {
					const photos = [...selector.matchAll(/:nth-child\((\d)\)/g)].map((m) => Number(m[1]));
					if (!photos.length && decls["aspect-ratio"]) photoAspect = decls["aspect-ratio"];
					for (const n of photos) {
						if (decls.display === "none") hidden.add(n);
						if (decls["aspect-ratio"]) aspect[n] = decls["aspect-ratio"];
						const corner = /var\(--v-cut-(t[se]|b[se])\)/.exec(decls["--cut-clip"] ?? "")?.[1];
						if (corner) corners[n] = corner;
					}
				}
			}
		}
	}
	return { grid, corners, aspect, photoAspect, hidden };
}

/** `grid-template-areas` as rows of names. */
const areasOf = (value) => [...(value ?? "").matchAll(/"([^"]*)"/g)].map((m) => m[1].trim().split(/\s+/));

/** Each name's rectangle, `{ r0, r1, c0, c1 }` (end lines exclusive), or a problem. */
function rects(rows) {
	const out = {};
	const problems = [];
	if (!rows.length) return { out, problems: ["no grid-template-areas"] };
	if (rows.some((r) => r.length !== rows[0].length)) problems.push("rows of different lengths");
	for (const [r, row] of rows.entries())
		for (const [c, name] of row.entries()) {
			if (name === ".") problems.push(`an empty cell at row ${r + 1}, column ${c + 1}`);
			const box = (out[name] ??= { r0: r, r1: r + 1, c0: c, c1: c + 1 });
			box.r0 = Math.min(box.r0, r);
			box.r1 = Math.max(box.r1, r + 1);
			box.c0 = Math.min(box.c0, c);
			box.c1 = Math.max(box.c1, c + 1);
		}
	for (const [name, box] of Object.entries(out))
		for (let r = box.r0; r < box.r1; r++)
			for (let c = box.c0; c < box.c1; c++) if (rows[r]?.[c] !== name) problems.push(`"${name}" is not a rectangle`);
	return { out, problems: [...new Set(problems)] };
}

/** Track sizes: `repeat(n, 1fr)` or a list of `fr` values, shared out over `space`. */
function tracks(value, space, gap) {
	const repeat = /^repeat\((\d+),\s*([\d.]+)fr\)$/.exec(value ?? "");
	const frs = repeat ? Array(Number(repeat[1])).fill(Number(repeat[2])) : (value ?? "1fr").split(/\s+/).map((v) => Number.parseFloat(v));
	const free = space - gap * (frs.length - 1);
	const sum = frs.reduce((a, b) => a + b, 0);
	return frs.map((f) => (free * f) / sum);
}
const ratio = (value) => {
	const [a, b = "1"] = String(value).split("/").map((s) => Number.parseFloat(s));
	return a / b;
};
const span = (sizes, from, to, gap) => sizes.slice(from, to).reduce((a, b) => a + b, 0) + gap * (to - from - 1);

/** The gutter of a layout at a breakpoint (the layout's own `--v-g`, else the base 20px). */
function gutter(layout, bp) {
	let g = 20;
	for (const level of BPS.slice(0, BPS.indexOf(bp) + 1))
		for (const block of band) {
			const joined = block.heads.join(" ");
			if (joined.includes(`[data-collage="${layout}"]`) && !/data-count|data-look/.test(joined) && bpOf(block.heads) === level) {
				const v = Object.fromEntries(block.decls)["--v-g"];
				if (v) g = Number.parseFloat(v);
			}
		}
	return g;
}

const cases = COLLAGES.flatMap((layout) => COUNTS.flatMap((count) => BPS.map((bp) => ({ layout, count, bp }))));

test("the three layouts in the config are the ones collage.css packs", () => {
	assert.deepEqual([...COLLAGES], ["mosaic", "row", "sheet"]);
});

for (const { layout, count, bp } of cases) {
	test(`${layout}, ${count} photos, ${bp}: a full rectangle with every shown photo once, and facing cuts`, () => {
		const { grid, corners, hidden } = effective(layout, count, bp);
		const rows = areasOf(grid["grid-template-areas"]);
		const { out, problems } = rects(rows);
		assert.deepEqual(problems, []);

		const expectedHidden = HIDDEN[layout]?.[bp]?.[count] ?? [];
		assert.deepEqual([...hidden].sort(), [...expectedHidden].sort(), "the hidden photos");
		const shown = Array.from({ length: count }, (_, i) => i + 1).filter((n) => !hidden.has(n));
		assert.deepEqual(Object.keys(out).sort(), shown.map((n) => LETTERS[n - 1]).sort(), "the grid's areas are the shown photos'");

		const R = rows.length;
		const C = rows[0].length;
		const points = {};
		for (const n of shown) {
			const corner = corners[n];
			assert.ok(corner, `photo ${n} has no cut corner`);
			const box = out[LETTERS[n - 1]];
			const point = [corner[0] === "t" ? box.r0 : box.r1, corner[1] === "s" ? box.c0 : box.c1];
			const bandCorner = (point[0] === 0 || point[0] === R) && (point[1] === 0 || point[1] === C);
			assert.ok(!bandCorner, `photo ${n}'s cut (${corner}) points at a corner of the band, not at a gutter`);
			points[n] = point;
		}

		// The cut points at a gutter with a photo across it: another shown photo touches the cut's point.
		const touches = (b, [r, c]) => r >= b.r0 && r <= b.r1 && c >= b.c0 && c <= b.c1;
		for (const n of shown) {
			const across = shown.filter((m) => m !== n && touches(out[LETTERS[m - 1]], points[n]));
			assert.ok(across.length, `photo ${n}'s cut (${corners[n]}) points at a gutter with no photo across it`);
		}

		// Two photos side by side (or one over the other) that both cut toward the gutter between them cut at the same
		// point of it, so the cuts face each other. A cut with no partner cut across its gutter is fine, and so is one
		// that already faces a third photo's cut at its point (Row's five on a phone: photo 5 faces photo 4, and
		// photo 3's cut above them stays single).
		const paired = (n) => shown.some((m) => m !== n && String(points[m]) === String(points[n]));
		for (const n of shown)
			for (const m of shown) {
				if (m <= n) continue;
				const a = out[LETTERS[n - 1]];
				const b = out[LETTERS[m - 1]];
				for (const [line, lo, hi, axis] of [
					...(a.c1 === b.c0 || b.c1 === a.c0 ? [[a.c1 === b.c0 ? a.c1 : a.c0, Math.max(a.r0, b.r0), Math.min(a.r1, b.r1), 1]] : []),
					...(a.r1 === b.r0 || b.r1 === a.r0 ? [[a.r1 === b.r0 ? a.r1 : a.r0, Math.max(a.c0, b.c0), Math.min(a.c1, b.c1), 0]] : []),
				]) {
					if (lo >= hi) continue; // they only meet at a point: no shared gutter
					const on = (p) => p[axis] === line && p[1 - axis] >= lo && p[1 - axis] <= hi;
					// Cut at the same point, they are each other's partner, so `paired` covers the facing pair too.
					if (on(points[n]) && on(points[m]))
						assert.ok(paired(n) || paired(m), `photos ${n} and ${m} both cut toward the gutter between them, but not at the same point`);
				}
			}
	});
}

for (const layout of COLLAGES)
	for (const count of [4, 5])
		test(`${layout}, ${count} photos, at 360px wide: no photo under 120px on its short side`, () => {
			const { grid, aspect, photoAspect, hidden } = effective(layout, count, "phone");
			const rows = areasOf(grid["grid-template-areas"]);
			const { out } = rects(rows);
			const g = gutter(layout, "phone");
			const W = WIDTH_AT_360[layout];
			const cols = tracks(grid["grid-template-columns"], W, g);
			let heights;
			if (grid["aspect-ratio"]) heights = tracks(grid["grid-template-rows"] ?? rows.map(() => "1fr").join(" "), W / ratio(grid["aspect-ratio"]), g);
			else
				// Rows sized by the photos: a photo one row tall and with a ratio sets its row's height.
				heights = rows.map((_, r) => {
					const [name, box] = Object.entries(out).find(([name, b]) => b.r0 === r && b.r1 === r + 1 && (aspect[LETTERS.indexOf(name) + 1] ?? photoAspect) !== "auto") ?? [];
					assert.ok(name, `row ${r + 1} has no photo that sets its height`);
					return span(cols, box.c0, box.c1, g) / ratio(aspect[LETTERS.indexOf(name) + 1] ?? photoAspect);
				});
			for (const [name, box] of Object.entries(out)) {
				const n = LETTERS.indexOf(name) + 1;
				if (hidden.has(n)) continue;
				const short = Math.min(span(cols, box.c0, box.c1, g), span(heights, box.r0, box.r1, g));
				assert.ok(short >= 120, `photo ${n} is ${short.toFixed(0)}px on its short side`);
			}
		});

test("every hover and focus rule on the band and the thumbnails sits under the motion guard", () => {
	const hovers = cssBlocks(css).filter((b) => b.heads.some((h) => !h.startsWith("@") && /:hover|:focus/.test(h)));
	assert.ok(hovers.length > 0);
	for (const block of hovers)
		assert.match(mediaOf(block.heads), /prefers-reduced-motion: no-preference/, `${block.heads.join(" > ")} is not under the motion guard`);
});

test("the band's focus grow needs only motion allowed, its hover grow a pointer that hovers too", () => {
	const ph = cssBlocks(css).filter((b) => b.heads.some((h) => /^& \[data-ph\]:/.test(h)));
	const grow = (state) => ph.filter((b) => b.heads.some((h) => h.includes(`:${state}`)) && b.decls.some(([p, v]) => p === "transform" && v.includes("scale(")));
	assert.ok(grow("focus-visible").length > 0, "a focused photo grows");
	assert.ok(grow("hover").length > 0, "a hovered photo grows");
	for (const block of grow("focus-visible")) assert.doesNotMatch(mediaOf(block.heads), /hover/, `${block.heads.join(" > ")}: focus is not tied to a pointer that hovers`);
	for (const block of grow("hover")) assert.match(mediaOf(block.heads), /\(hover: hover\)/, `${block.heads.join(" > ")}: hover needs a pointer that hovers`);
	const dims = cssBlocks(css).filter((b) => b.heads.some((h) => /:has\(\[data-ph\]:focus-visible\)/.test(h)));
	assert.ok(dims.length > 0 && dims.every((b) => !/hover/.test(mediaOf(b.heads))), "the others dim on focus on every device");
});

test("the look rules use the frame tokens, and set no grid", () => {
	const looks = band.filter((b) => b.heads.join(" ").includes("data-look"));
	assert.ok(looks.some((b) => b.heads.join(" ").includes('[data-look="field"]')), "no Field notes rules");
	assert.ok(looks.some((b) => b.heads.join(" ").includes('[data-look="trail"]')), "no Trail map rules");
	for (const block of looks)
		for (const [prop] of block.decls) assert.ok(!/^grid|aspect-ratio|--cut-clip/.test(prop), `${block.heads.join(" > ")} sets ${prop}`);
});
