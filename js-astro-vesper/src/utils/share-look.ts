/**
 * The share card's look, input and tree, plain functions (scripts/units/share.test.mjs loads this file in plain Node;
 * the font file is src/share-card.ts's). The colors are the Clear look's light ground, ink and muted text
 * (src/styles/looks/clear.css, :root), and the mark is the resolved accent's light color (getConfig(settings).config
 * .accent), so a later accent setting reaches the cards too. The card is the same in every look: one calm card.
 *
 * The tree is theme-core's layout (the label at the top, the title, the site name at the foot) with Vesper's mark in
 * place of the bar: a small accent square with one cut corner, the photos' shape.
 */
import { HEIGHT, titleSize, WIDTH, type CardNode, type ShareCard, type ShareLook } from "@astronomic/theme-core/share";
import { plainHeading } from "@astronomic/ui/lib/emphasis.ts";
import type { PublicPage } from "./public-pages";

/** src/styles/looks/clear.css's light :root: --ui-bg, --ui-fg, --ui-muted (the unit test holds them together). */
export const CARD_GROUND = { bg: "#fbfbfc", fg: "#17181b", muted: "#5b606a" } as const;

/** The card's font family: Clear's display face (src/share-card.ts loads its static 600 WOFF). */
export const CARD_FONT = "Host Grotesk";
/** The one weight the card's font file has; every text on the card asks for it. */
export const CARD_WEIGHT = 600;

/** One accent of src/styles/accents/accents.json (the fields the card reads). */
export type AccentValues = { id: string; light: string };

/** The card's colors for an accent id: the ground, ink and muted text, and the accent's light color (ink when unknown). */
export function cardColors(accent: string, accents: readonly AccentValues[]): ShareLook["colors"] {
	return { ...CARD_GROUND, accent: accents.find((a) => a.id === accent)?.light ?? CARD_GROUND.fg };
}

/**
 * The card's public input for one page, and the look. The title is plain text (plainHeading: a heading's asterisks
 * never show; satori draws it as a text node, never markup). No label when it would repeat the title or the site name.
 */
export function cardInput(page: Pick<PublicPage, "title" | "label">, siteName: string, colors: ShareLook["colors"]): { card: ShareCard; look: ShareLook } {
	const title = plainHeading(page.title);
	const label = page.label && page.label !== title && page.label !== siteName ? page.label : undefined;
	return { card: { title, label, siteName }, look: { colors, fontFamily: CARD_FONT } };
}

const PAD = 72;
/** The mark's side and its cut, in px: a square with its top-end corner cut at 45 degrees. */
const MARK = 34;
const MARK_CUT = 12;

const h = (style: CardNode["props"]["style"], children?: CardNode["props"]["children"]): CardNode => ({
	type: "div",
	props: children === undefined ? { style } : { style, children },
});

/** The card's tree: the label at the top, the title, then the cut-corner mark and the site name. No other text. */
export function cardTree(card: ShareCard, look: ShareLook): CardNode {
	const { bg, fg, muted, accent } = look.colors;
	const small = { display: "flex", fontSize: 28, fontWeight: CARD_WEIGHT, letterSpacing: "0.02em", color: muted };
	return h({ width: WIDTH, height: HEIGHT, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: PAD, backgroundColor: bg, color: fg, fontFamily: look.fontFamily }, [
		card.label ? h({ ...small, textTransform: "uppercase" }, card.label) : h({ display: "flex" }),
		h({ display: "block", fontSize: titleSize(card.title), fontWeight: CARD_WEIGHT, letterSpacing: "-0.034em", lineHeight: 1.04, lineClamp: 3, color: fg }, card.title),
		h({ display: "flex", alignItems: "center" }, [
			h({
				display: "flex",
				width: MARK,
				height: MARK,
				marginRight: 20,
				backgroundColor: accent,
				clipPath: `polygon(0 0, ${MARK - MARK_CUT}px 0, ${MARK}px ${MARK_CUT}px, ${MARK}px ${MARK}px, 0 ${MARK}px)`,
			}),
			h({ ...small, color: fg }, card.siteName),
		]),
	]);
}
