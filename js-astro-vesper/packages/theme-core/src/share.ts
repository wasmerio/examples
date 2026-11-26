/**
 * Share cards: the 1200 x 630 image a page shows when someone links to it.
 * A theme owns the route as a thin file (`src/pages/og/[...path]/card.png.ts`)
 * that builds the card with `cardTree`, renders it with `renderCard` and
 * returns `cardResponse`. Build time or server only: no page ships this to the
 * browser.
 *
 * Look-free: the colors and the font family come in as arguments, and the
 * theme passes its own font files. The tree is plain objects (no JSX), so the
 * theme needs no React. The PNG is the same on every render of the same input.
 */
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

export const WIDTH = 1200;
export const HEIGHT = 630;

const PAD = 72;
const CACHE = "public, max-age=86400";

/**
 * What a card shows. Only public fields: a card is served to anyone and cached
 * publicly, so it never carries a body, a summary or anything a locked entry
 * keeps back. Step E fills it from the public view of the entry.
 */
export type ShareCard = { title: string; label?: string; siteName: string };

/** The theme's look for the card: four colors (any CSS color) and a font family the fonts in `renderCard` provide. */
export type ShareLook = { colors: { bg: string; fg: string; muted: string; accent: string }; fontFamily: string };

/** A font file for `renderCard`. The card asks for weight 400 (label, site name) and 700 (title); satori uses the nearest weight given. */
export type ShareFont = { name: string; data: ArrayBuffer | Uint8Array; weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900; style: "normal" };

/** One node of the card tree, in the shape satori reads. */
export type CardNode = { type: string; props: { style: Record<string, string | number>; children?: string | CardNode[] } };

/*
 * A `og/[...path]/card.png.ts` route maps its param back to the page with
 * path ? `/${path}` : "/" (the home card's param is undefined), or reads the
 * request path with `shareKey`. Use one path source throughout: the decoded
 * `getStaticPaths` params, not the percent-encoded `Astro.url.pathname`, so a
 * non-ASCII slug gives the same key on both sides.
 */

/** The card image's path for a page: `/` → `/og/card.png`, `/work/x` → `/og/work/x/card.png`. Every page has its own path. */
export function shareImagePath(path: string): string {
	const trimmed = path.replace(/^\/+|\/+$/g, "");
	return trimmed ? `/og/${trimmed}/card.png` : "/og/card.png";
}

/** The page a card path belongs to (the inverse of `shareImagePath`), or `undefined` when it is not a card path. */
export function shareKey(imagePath: string): string | undefined {
	if (imagePath === "/og/card.png") return "/";
	const m = /^\/og\/(.+)\/card\.png$/.exec(imagePath);
	if (!m || m[1].split("/").some((part) => part === "")) return undefined;
	return `/${m[1]}`;
}

/** Title size in px: long titles get smaller, so they fit in three lines at most. */
export function titleSize(title: string): number {
	const n = title.length;
	if (n <= 14) return 128;
	if (n <= 26) return 104;
	if (n <= 44) return 84;
	if (n <= 70) return 68;
	return 56;
}

const h = (style: CardNode["props"]["style"], children?: CardNode["props"]["children"]): CardNode => ({
	type: "div",
	props: children === undefined ? { style } : { style, children },
});

/** The card's tree: the label at the top, the title, then an accent bar and the site name. No other text. */
export function cardTree(card: ShareCard, look: ShareLook): CardNode {
	const { bg, fg, muted, accent } = look.colors;
	const small = { display: "flex", fontSize: 28, fontWeight: 400, letterSpacing: "0.04em", color: muted };
	return h({ width: WIDTH, height: HEIGHT, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: PAD, backgroundColor: bg, color: fg, fontFamily: look.fontFamily }, [
		card.label ? h({ ...small, textTransform: "uppercase" }, card.label) : h({ display: "flex" }),
		h({ display: "block", fontSize: titleSize(card.title), fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, lineClamp: 3, color: fg }, card.title),
		h({ display: "flex", alignItems: "center" }, [h({ display: "flex", width: 48, height: 6, marginRight: 20, backgroundColor: accent }), h({ ...small, color: fg }, card.siteName)]),
	]);
}

/** An exact ArrayBuffer of the bytes (satori reads ArrayBuffers). */
const toArrayBuffer = (data: ArrayBuffer | Uint8Array): ArrayBuffer =>
	data instanceof Uint8Array ? (data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer) : data;

/** The tree as a 1200 x 630 PNG. Satori draws text as paths, so resvg loads no system fonts and the bytes are the same on every machine. */
export async function renderCard(tree: CardNode, opts: { fonts: ShareFont[] }): Promise<Uint8Array> {
	const fonts = opts.fonts.map((font) => ({ ...font, data: toArrayBuffer(font.data) }));
	const svg = await satori(tree as unknown as Parameters<typeof satori>[0], { width: WIDTH, height: HEIGHT, fonts });
	const png = new Resvg(svg, { fitTo: { mode: "original" }, font: { loadSystemFonts: false } }).render().asPng();
	return new Uint8Array(png.buffer, png.byteOffset, png.byteLength);
}

/** Rendered cards, per process: SHA-256 of the public input → the render (a promise, so calls at once share it). */
const cards = new Map<string, Promise<Uint8Array>>();

async function cardKey(card: ShareCard, look: ShareLook): Promise<string> {
	const bytes = new TextEncoder().encode(JSON.stringify([card, look]));
	const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
	return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * A card PNG rendered once per process: kept by a SHA-256 of its public input (`card` and `look`; a ShareCard holds
 * nothing else), up to `max` cards, least recently used out first. A hit returns the same bytes without calling
 * `render`; a failed render is not kept. Web Crypto only, so it runs in any server runtime.
 *
 *   const png = await cachedCard(card, look, () => renderCard(cardTree(card, look), { fonts }));
 */
export async function cachedCard(
	card: ShareCard,
	look: ShareLook,
	render: () => Promise<Uint8Array>,
	{ max = 200 }: { max?: number } = {},
): Promise<Uint8Array> {
	const key = await cardKey(card, look);
	let hit = cards.get(key);
	if (hit) {
		cards.delete(key);
		cards.set(key, hit);
		return hit;
	}
	hit = render();
	cards.set(key, hit);
	hit.catch(() => {
		if (cards.get(key) === hit) cards.delete(key);
	});
	while (cards.size > Math.max(1, max)) cards.delete(cards.keys().next().value as string);
	return hit;
}

/** The PNG as a response: `Content-Type: image/png` and a one-day public `Cache-Control`. */
export function cardResponse(png: Uint8Array): Response {
	return new Response(png as Uint8Array<ArrayBuffer>, { headers: { "Content-Type": "image/png", "Cache-Control": CACHE } });
}

/** The bytes of a base64 data URL, as Vite's `?inline` import gives a font file. */
export function fontFromDataUrl(url: string): Uint8Array {
	const m = /^data:[^,]*;base64,(.*)$/s.exec(url);
	if (!m) throw new Error(`fontFromDataUrl: not a base64 data URL (${url.slice(0, 40)})`);
	const text = atob(m[1]);
	const out = new Uint8Array(text.length);
	for (let i = 0; i < text.length; i++) out[i] = text.charCodeAt(i);
	return out;
}
