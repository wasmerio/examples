// Shared button classes, used by Button.astro and the React islands.
// Class strings are written out in full so Tailwind can find them.
import { cx } from "./cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

/** The one focus ring every interactive component uses. */
export const focusRing =
	"outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-accent";

/**
 * The same ring on a label or box whose control is visually hidden inside it (an option chip, a switch's segment):
 * drawn when the control within has keyboard focus.
 */
export const focusRingWithin =
	"has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:outline-offset-2 has-focus-visible:outline-accent";

/**
 * A link or button that is a real box of at least 44 × 44px (WCAG 2.5.5) on a touch screen, in rem so a preset's
 * spacing never shrinks it: for links in a row that may wrap (an author's links, a card's actions), where a tap-area
 * ::after would reach into the next row. Give the element a display that takes a min size (inline-flex items-center).
 */
export const touchBox = "pointer-coarse:min-h-[2.75rem] pointer-coarse:min-w-[2.75rem]";

const base = cx(
	"inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap select-none no-underline cursor-pointer",
	// button-face: the preset's weight, case and tracking (--ui-button-weight, --ui-button-case, --ui-button-track).
	"font-body button-face",
	"rounded-control border-button border-solid",
	// Press: a 1px drop, plus an optional shrink (press-scale: --ui-press-scale, e.g. 0.97; unset means no scale), on an
	// enabled control only. The press and the transition apply only when motion is allowed (motion-ok: no reduced
	// motion, not calm; decision 0018), so with either the button changes color at once and never moves.
	"motion-ok:transition-[background-color,border-color,color,translate,scale,box-shadow] motion-ok:duration-150",
	"motion-ok:active:not-disabled:not-aria-disabled:translate-y-px motion-ok:active:not-disabled:not-aria-disabled:press-scale",
	"disabled:cursor-not-allowed disabled:opacity-45",
	"aria-disabled:cursor-not-allowed aria-disabled:opacity-45",
	focusRing,
);

// button-shadow: the primary button's edge and depth (--ui-button-shadow, optional, default none), e.g. an inset highlight.
const primaryShadow = "button-shadow";

export const buttonVariants: Record<ButtonVariant, string> = {
	primary: cx(
		"bg-accent text-accent-fg border-accent hover:not-disabled:not-aria-disabled:bg-accent-hover hover:not-disabled:not-aria-disabled:border-accent-hover",
		primaryShadow,
	),
	secondary: "bg-surface text-fg border-border hover:not-disabled:not-aria-disabled:bg-surface-2",
	ghost: "bg-transparent text-fg border-transparent hover:not-disabled:not-aria-disabled:bg-surface-2",
};

/**
 * The variants on an image, under a scrim (tone="image"): scrim-fg on the scrim, so they read on any picture. The
 * primary is a scrim-fg fill with scrim text; the secondary an outline and the ghost no fill, each with a light
 * scrim-fg tint on hover. The shares are the largest that keep every label at 4.5:1 and every edge at 3:1 over a
 * black and a white image (a 10% tint drops Soft's label under 4.5:1). The focus ring is the caller's: on an image,
 * put focus-on-image on an ancestor. The primary leaves out --ui-button-shadow: a preset tunes that edge for the
 * accent fill, not for scrim-fg.
 */
export const buttonOnImage: Record<ButtonVariant, string> = {
	primary:
		"bg-scrim-fg text-scrim border-scrim-fg hover:not-disabled:not-aria-disabled:bg-scrim-fg/85 hover:not-disabled:not-aria-disabled:border-scrim-fg/85",
	secondary: "bg-transparent text-scrim-fg border-scrim-fg/70 hover:not-disabled:not-aria-disabled:bg-scrim-fg/6",
	ghost: "bg-transparent text-scrim-fg border-transparent hover:not-disabled:not-aria-disabled:bg-scrim-fg/6",
};

/**
 * The variants on the band where the band is optional (tone="band": the Navbar's actions). With --ui-band and
 * --ui-band-fg set they invert, like CtaBand's: the primary is a band-fg fill with band text, the secondary a band
 * fill with a band-fg edge, the ghost band-fg text, and the secondary and ghost hover is a band-fg tint. Without a
 * band each name falls back to the page value, so they look as on the page.
 */
export const buttonOnBand: Record<ButtonVariant, string> = {
	// band-button-shadow: --ui-band-button-shadow (an edge in the band colors, optional), else --ui-button-shadow.
	primary: cx(
		"bg-on-band-button text-on-band-button-fg border-on-band-button hover:not-disabled:not-aria-disabled:bg-on-band-button-hover hover:not-disabled:not-aria-disabled:border-on-band-button-hover",
		"band-button-shadow",
	),
	secondary: "bg-on-band-surface text-on-band border-on-band-border hover:not-disabled:not-aria-disabled:bg-on-band-tint",
	ghost: "bg-transparent text-on-band border-transparent hover:not-disabled:not-aria-disabled:bg-on-band-tint",
};

/**
 * The variants on the CTA band (tone="cta"), which is always a full-color band: the band, else the accent. They
 * invert against it: the primary is a band-fg fill with band text, the secondary a band-fg outline, the ghost
 * band-fg text, and the secondary and ghost hover is a band-fg tint. The focus ring is the caller's: put
 * focus-on-cta on the band. The primary's edge is the band one (band-button-shadow), as on tone="band".
 */
export const buttonOnCta: Record<ButtonVariant, string> = {
	primary: cx(
		"bg-band-fg text-band border-band-fg hover:not-disabled:not-aria-disabled:bg-cta-button-hover hover:not-disabled:not-aria-disabled:border-cta-button-hover",
		"band-button-shadow",
	),
	secondary: "bg-transparent text-band-fg border-band-fg hover:not-disabled:not-aria-disabled:bg-cta-tint",
	ghost: "bg-transparent text-band-fg border-transparent hover:not-disabled:not-aria-disabled:bg-cta-tint",
};

/**
 * The variants on the inverse surface (tone="inverse": Panel tone="inverse", the dark panel). They invert against it:
 * the primary is an inverse-fg fill with inverse text, mixed 10% toward the fill on hover; the secondary an
 * inverse-fg outline and the ghost inverse-fg text, each with a 6% inverse-fg tint on hover. The focus ring is the
 * caller's: put focus-on-inverse on the surface (Panel does). The primary leaves out --ui-button-shadow, a preset's
 * edge for the accent fill.
 */
export const buttonOnInverse: Record<ButtonVariant, string> = {
	primary:
		"bg-on-inverse text-inverse border-on-inverse hover:not-disabled:not-aria-disabled:bg-on-inverse-button-hover hover:not-disabled:not-aria-disabled:border-on-inverse-button-hover",
	secondary: "bg-transparent text-on-inverse border-on-inverse hover:not-disabled:not-aria-disabled:bg-on-inverse-tint",
	ghost: "bg-transparent text-on-inverse border-transparent hover:not-disabled:not-aria-disabled:bg-on-inverse-tint",
};

/**
 * The variants on the accent surface (tone="accent": GuaranteeStrip, EmergencyBanner). They invert against it, as
 * buttonOnInverse: the primary is an accent-fg fill with accent text, mixed 10% toward the accent on hover; the
 * secondary an accent-fg outline and the ghost accent-fg text, each with a 6% accent-fg tint on hover. The focus ring
 * is the caller's: put focus-on-accent on the surface. The primary leaves out --ui-button-shadow, a preset's edge for
 * the accent fill.
 */
export const buttonOnAccent: Record<ButtonVariant, string> = {
	primary:
		"bg-on-accent text-accent border-on-accent hover:not-disabled:not-aria-disabled:bg-on-accent-button-hover hover:not-disabled:not-aria-disabled:border-on-accent-button-hover",
	secondary: "bg-transparent text-on-accent border-on-accent hover:not-disabled:not-aria-disabled:bg-on-accent-tint",
	ghost: "bg-transparent text-on-accent border-transparent hover:not-disabled:not-aria-disabled:bg-on-accent-tint",
};

// The control heights are theme names: md is the preset's control height, lg 8px over it, and small
// (--spacing-control-sm) 6px under it and never under 30px, so a compact preset still gets a tappable button.
export const buttonSizes: Record<ButtonSize, string> = {
	sm: "h-control-sm px-3 text-control-sm",
	md: "h-control px-4.5 text-control",
	lg: "h-control-lg px-6 text-control-lg",
};

/** Square icon-only button sizes (e.g. the mobile menu trigger). No text size, so leading-none sets the line height. */
export const iconButtonSizes: Record<ButtonSize, string> = {
	sm: "size-control-sm px-0 leading-none",
	md: "size-control px-0 leading-none",
	lg: "size-control-lg px-0 leading-none",
};

export interface ButtonClassOptions {
	variant?: ButtonVariant;
	size?: ButtonSize;
	/** Square, icon-only shape. */
	icon?: boolean;
	/**
	 * `image` on an image under a scrim: the variant's colors come from buttonOnImage. `band` on an optional band
	 * (the Navbar): from buttonOnBand. `cta` on the CTA band: from buttonOnCta. `inverse` on the inverse surface
	 * (Panel tone="inverse"): from buttonOnInverse. `accent` on the accent surface (surface-accent): from buttonOnAccent.
	 */
	tone?: "page" | "image" | "band" | "cta" | "inverse" | "accent";
}

const toneVariants = { page: buttonVariants, image: buttonOnImage, band: buttonOnBand, cta: buttonOnCta, inverse: buttonOnInverse, accent: buttonOnAccent };

export function buttonClasses({ variant = "primary", size = "md", icon = false, tone = "page" }: ButtonClassOptions = {}): string {
	// An unknown tone falls back to the page colors.
	const colours = (toneVariants[tone] ?? buttonVariants)[variant];
	return cx(base, colours, icon ? iconButtonSizes[size] : buttonSizes[size]);
}

type ButtonTone = NonNullable<ButtonClassOptions["tone"]>;

/**
 * The icon tile's colors (Button iconTile): the inverted pair of the button's own colors, per tone and variant, so the
 * tile reads at the same contrast as the label. A primary's tile is its label color with its fill as the icon; a
 * secondary or ghost tile is a fill in its label color with the surface under it as the icon.
 */
export const buttonTiles: Record<ButtonTone, Record<ButtonVariant, string>> = {
	page: { primary: "bg-accent-fg text-accent", secondary: "bg-fg text-surface", ghost: "bg-fg text-bg" },
	image: { primary: "bg-scrim text-scrim-fg", secondary: "bg-scrim-fg text-scrim", ghost: "bg-scrim-fg text-scrim" },
	band: { primary: "bg-on-band-button-fg text-on-band-button", secondary: "bg-on-band text-on-band-surface", ghost: "bg-on-band text-on-band-surface" },
	cta: { primary: "bg-band text-band-fg", secondary: "bg-band-fg text-band", ghost: "bg-band-fg text-band" },
	inverse: { primary: "bg-inverse text-on-inverse", secondary: "bg-on-inverse text-inverse", ghost: "bg-on-inverse text-inverse" },
	accent: { primary: "bg-accent text-on-accent", secondary: "bg-on-accent text-accent", ghost: "bg-on-accent text-accent" },
};

/**
 * A button with an icon tile (Button iconTile): a pill in the pill token's corners (rounded-pill: --ui-radius-pill,
 * fully round by default), the label's side padded and the tile's side close, at least 44px tall (min-h-11). The tile
 * sits the same 6px (py-1.5, pe-1.5) in from the top, bottom and end, so it keeps that proportion at every size; that
 * inset is the gap its nested corners take off the pill's (--nest-gap). group/button lets the tile's icon move on
 * hover and focus.
 */
export const iconTileButton = "group/button rounded-pill ps-6 pe-1.5 py-1.5 gap-3 min-h-11 [--nest-gap:0.375rem]";

/** How the tile's icon moves on hover and keyboard focus: turn -45° (default), or slide out while a copy slides in. */
export type TileMotion = "turn" | "slide";

/**
 * The tile: as tall as the pill inside its padding (h-full of the pill's set height, aspect-square: about 32px in a 44px pill; not self-stretch, which iOS WebKit sizes past the pill), with
 * nested corners (rounded-nested: the pill's radius less the 6px gap, so the two run parallel; a disc in a round
 * pill), in the inverted pair of the button's colors, holding the icon. With motion "slide" it clips (overflow-clip)
 * and is the containing block of the icon's copy.
 */
export function iconTileClasses({ variant = "primary", tone = "page", motion = "turn" }: Pick<ButtonClassOptions, "variant" | "tone"> & { motion?: TileMotion } = {}): string {
	return cx("inline-flex h-full aspect-square shrink-0 items-center justify-center rounded-nested", motion === "slide" && "relative overflow-clip", (buttonTiles[tone] ?? buttonTiles.page)[variant]);
}

/** The icon inside the tile (motion "turn"): it turns -45° on hover and keyboard focus, under motion-ok. */
export const iconTileIcon =
	"motion-ok:transition-transform motion-ok:duration-300 motion-ok:group-hover/button:-rotate-45 motion-ok:group-focus-visible/button:-rotate-45";

/**
 * Motion "slide": the icon moves out past the tile's end edge on hover and keyboard focus (twice its own width, out
 * of the tile at every button size), under motion-ok; in right to left the end is the left.
 */
export const iconTileSlideIcon =
	"motion-ok:transition-transform motion-ok:duration-300 motion-ok:group-hover/button:translate-x-[200%] motion-ok:group-focus-visible/button:translate-x-[200%] motion-ok:group-hover/button:rtl:-translate-x-[200%] motion-ok:group-focus-visible/button:rtl:-translate-x-[200%]";

/**
 * Motion "slide": the box around the icon's copy (hidden from a screen reader, as the icon is), the copy's size. It
 * is centered in the tile and waits off the start edge at rest, clipped, so with reduced motion or calm it is never
 * seen; on hover and keyboard focus it moves in to the center as the icon moves out, under motion-ok.
 */
export const iconTileSlideCopy =
	"absolute inset-0 m-auto flex size-fit -translate-x-[200%] rtl:translate-x-[200%] motion-ok:transition-transform motion-ok:duration-300 motion-ok:group-hover/button:translate-x-0 motion-ok:group-focus-visible/button:translate-x-0";

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

/**
 * The plain text of a rendered label (Button roll's data-label): tags dropped, entities read, spaces collapsed, so the
 * rolled copy shows the same words. Astro escapes it again as an attribute.
 */
export function rollText(html: string): string {
	return html
		.replace(/<[^>]*>/g, "")
		.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
			if (e[0] === "#") {
				const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
				return Number.isFinite(code) ? String.fromCodePoint(code) : m;
			}
			return ENTITIES[e.toLowerCase()] ?? m;
		})
		.replace(/\s+/g, " ")
		.trim();
}
