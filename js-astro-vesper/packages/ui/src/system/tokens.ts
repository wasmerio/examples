export type Category = "colour" | "type" | "space" | "shape";

export interface Token {
	name: `--ui-${string}`;
	category: Category;
	/** The Tailwind class that uses it, if any. */
	utility?: string;
	/** What it is for, in a few words. */
	use: string;
	/** For colors checked for contrast: the background token, and the WCAG target. */
	on?: `--ui-${string}`;
	target?: 4.5 | 3;
	/**
	 * Checked where the kit puts it: on `on` laid over an image, as the scrim layers show it, over a black and a white
	 * image, under the kit's scrim layers (SCRIM_LAYERS in contrast.mjs, contrastOnImage). Not on `on` as a solid fill.
	 */
	onImage?: true;
	/** Extra advice shown with the contrast number. */
	note?: string;
	/** Components fall back when it is not set. tokens.css may set it (the default look does); a preset sets it to `initial` to get the fallback. */
	optional?: true;
	/** For an optional token: the CSS the components use when it is not set. */
	fallback?: string;
	/** A color token whose value is not a color (a mix amount): lists show no swatch for it. */
	swatch?: false;
}

/**
 * Pairs on a page-family fill (decision 0015, principle 2): `surface-2` is a quiet fill of the page, not a colored
 * surface, so text, secondary text and the focus ring keep the page's colors on it (the paywall card,
 * SeriesPager's and Pagination's hover, a form's hints in the paywall's sign-in slot). Each pair
 * must reach its target there in every preset, light and dark: a test checks every kit preset.
 */
export const fillPairs: { name: `--ui-${string}`; on: `--ui-${string}`; target: 4.5 | 3; use: string }[] = [
	{ name: "--ui-fg", on: "--ui-surface-2", target: 4.5, use: "Text on the quiet fill" },
	{ name: "--ui-muted", on: "--ui-surface-2", target: 4.5, use: "Secondary text on the quiet fill" },
	{ name: "--ui-border-control", on: "--ui-surface-2", target: 3, use: "A text field's edge on the quiet fill (a form in the paywall's sign-in slot)" },
	{ name: "--ui-accent", on: "--ui-surface-2", target: 3, use: "The focus ring on the quiet fill" },
];

/**
 * Pairs on the inverse surface (decision 0015, principle 2; Panel tone="inverse"): its text, secondary text, accent
 * mark and focus ring, each read from the optional tokens with their defaults (the page's pair, swapped). Each pair
 * must reach its target in every preset, light and dark: a test checks every kit preset, resolving the defaults.
 */
export const inversePairs: { name: `--ui-${string}`; on: `--ui-${string}`; target: 4.5 | 3; use: string }[] = [
	{ name: "--ui-inverse-fg", on: "--ui-inverse", target: 4.5, use: "Text on the inverse surface" },
	{ name: "--ui-inverse-muted", on: "--ui-inverse", target: 4.5, use: "Secondary text, and word fill's start color, on the inverse surface" },
	{ name: "--ui-inverse-mark", on: "--ui-inverse", target: 4.5, use: "The accent mark on the inverse surface, also small text (an open service's number)" },
	{ name: "--ui-inverse-fg", on: "--ui-inverse", target: 3, use: "The focus ring on the inverse surface (focus-on-inverse)" },
];

/**
 * Pairs on the accent surface (decision 0015, principle 2; surface-accent: GuaranteeStrip, EmergencyBanner): its text,
 * secondary text and focus ring, and the inverted card on it (EmergencyBanner's phone card: an accent-fg fill with the
 * number in the accent, and the accent focus ring), each read from the tokens with their defaults. Each pair must
 * reach its target in every preset, light and dark: a test checks every kit preset, resolving the defaults.
 */
export const accentPairs: { name: `--ui-${string}`; on: `--ui-${string}`; target: 4.5 | 3; use: string }[] = [
	{ name: "--ui-accent-fg", on: "--ui-accent", target: 4.5, use: "Text on the accent surface" },
	{ name: "--ui-accent-muted", on: "--ui-accent", target: 4.5, use: "Secondary text on the accent surface" },
	{ name: "--ui-accent-fg", on: "--ui-accent", target: 3, use: "The focus ring on the accent surface (focus-on-accent)" },
	{ name: "--ui-accent", on: "--ui-accent-fg", target: 4.5, use: "The inverted card on the accent surface: its text and number, and its accent focus ring" },
];

/**
 * Pairs on a map pin (Pro MapView; decision 0015, principle 2): a pin's price, a second-mode pin's price and the hot
 * pin's price, each on its own fill, read from the optional pin tokens with their defaults (the page's text and
 * background, the surface and text, the accent and its text). Each pair must reach 4.5:1 in every preset, light and
 * dark: a test checks every kit preset, resolving the defaults.
 */
export const pinPairs: { name: `--ui-${string}`; on: `--ui-${string}`; target: 4.5 | 3; use: string }[] = [
	{ name: "--ui-pin-fg", on: "--ui-pin", target: 4.5, use: "A map pin's price" },
	{ name: "--ui-pin-alt-fg", on: "--ui-pin-alt", target: 4.5, use: "A second-mode pin's price (a rental)" },
	{ name: "--ui-pin-hot-fg", on: "--ui-pin-hot", target: 4.5, use: "The hot pin's price (under the pointer, or its card focused)" },
];

/** Every token in tokens.css, plus the optional ones presets may set, in the order the foundations page shows them. */
export const tokens: Token[] = [
	// Color
	{ name: "--ui-bg", category: "colour", utility: "bg-bg", use: "Page background" },
	{ name: "--ui-surface", category: "colour", utility: "bg-surface", use: "Cards" },
	{ name: "--ui-surface-2", category: "colour", utility: "bg-surface-2", use: "Quiet fills" },
	{ name: "--ui-fg", category: "colour", utility: "text-fg", use: "Text", on: "--ui-bg", target: 4.5 },
	{ name: "--ui-muted", category: "colour", utility: "text-muted", use: "Secondary text", on: "--ui-bg", target: 4.5 },
	{
		name: "--ui-border",
		category: "colour",
		utility: "border-border",
		use: "Borders and rules",
		on: "--ui-bg",
		target: 3,
		note: "Needed only when a border is the only sign of a control.",
	},
	{
		name: "--ui-border-control",
		category: "colour",
		utility: "border-border-control",
		use: "Text-field edges",
		on: "--ui-bg",
		target: 3,
	},
	{ name: "--ui-accent", category: "colour", utility: "bg-accent", use: "Accent marks and focus ring", on: "--ui-bg", target: 3 },
	{ name: "--ui-accent-fg", category: "colour", utility: "text-accent-fg", use: "Text on the accent", on: "--ui-accent", target: 4.5 },
	{
		name: "--ui-accent-hover",
		category: "colour",
		utility: "bg-accent-hover",
		use: "Primary button hover, set outright (optional)",
		optional: true,
		fallback: "color-mix(in oklab, var(--ui-accent) var(--ui-accent-hover-amount, 88%), var(--ui-accent-hover-mix, var(--ui-fg)))",
	},
	{
		name: "--ui-accent-hover-amount",
		category: "colour",
		use: "How much accent the primary button hover keeps (optional)",
		optional: true,
		swatch: false,
		fallback: "88%",
	},
	{
		name: "--ui-accent-hover-mix",
		category: "colour",
		use: "The color the primary button hover mixes the accent toward (optional)",
		optional: true,
		fallback: "var(--ui-fg)",
	},
	{
		name: "--ui-field-bg",
		category: "colour",
		use: "Text-field fill (optional)",
		optional: true,
		fallback: "var(--ui-surface)",
	},
	{ name: "--ui-accent-soft", category: "colour", utility: "bg-accent-soft", use: "Selection and soft fills" },
	{
		name: "--ui-accent-muted",
		category: "colour",
		utility: "text-on-accent-muted",
		use: "Secondary text on the accent surface (surface-accent: GuaranteeStrip, EmergencyBanner) (optional)",
		optional: true,
		fallback: "color-mix(in oklab, var(--ui-accent-fg) 90%, var(--ui-accent))",
	},
	{ name: "--ui-danger", category: "colour", utility: "text-danger", use: "Errors", on: "--ui-bg", target: 4.5 },
	{ name: "--ui-scrim", category: "colour", utility: "bg-scrim", use: "A dark veil over images, in both modes (CardOverlay, HeroCover)" },
	{ name: "--ui-scrim-fg", category: "colour", utility: "text-scrim-fg", use: "Text on the scrim over an image", on: "--ui-scrim", onImage: true, target: 4.5 },
	{
		name: "--ui-tint",
		category: "colour",
		use: "A second soft color: the Badge pill and Avatar initials (optional)",
		optional: true,
		fallback: "var(--ui-surface) for Badge; var(--ui-surface-2) for Avatar",
	},
	{
		name: "--ui-tint-fg",
		category: "colour",
		use: "Text on the tint, at 4.5:1 (optional)",
		optional: true,
		fallback: "var(--ui-fg) for Badge; var(--ui-muted) for Avatar",
	},
	{
		name: "--ui-band",
		category: "colour",
		utility: "bg-band",
		use: "Band surface: the CTA family (CtaBand and its recipes), and the Navbar and Footer when set (optional)",
		optional: true,
		fallback: "var(--ui-accent) for the CTA family; the page (--ui-bg) for Navbar and Footer",
	},
	{
		name: "--ui-band-fg",
		category: "colour",
		utility: "text-band-fg",
		use: "Text on the band (optional)",
		optional: true,
		fallback: "var(--ui-accent-fg) for the CTA family; --ui-fg for Navbar and Footer",
	},
	{
		name: "--ui-nav-bg",
		category: "colour",
		use: "The Navbar's fill when it is not on the band, e.g. a translucent glass (optional)",
		optional: true,
		fallback: "var(--ui-bg)",
	},
	{
		name: "--ui-inverse",
		category: "colour",
		utility: "surface-inverse",
		use: "The inverse surface: the dark panel on a light page, light on a dark page (Panel tone=\"inverse\") (optional)",
		optional: true,
		fallback: "var(--ui-fg)",
	},
	{ name: "--ui-inverse-fg", category: "colour", utility: "text-on-inverse", use: "Text and the focus ring on the inverse surface (optional)", optional: true, fallback: "var(--ui-bg)" },
	{
		name: "--ui-inverse-muted",
		category: "colour",
		utility: "text-on-inverse-muted",
		use: "Secondary text on the inverse surface (optional)",
		optional: true,
		fallback: "color-mix(in oklab, var(--ui-inverse-fg, var(--ui-bg)) 72%, var(--ui-inverse, var(--ui-fg)))",
	},
	{
		name: "--ui-inverse-border",
		category: "colour",
		utility: "border-on-inverse-border",
		use: "Rules on the inverse surface (optional)",
		optional: true,
		fallback: "color-mix(in oklab, var(--ui-inverse-fg, var(--ui-bg)) 24%, var(--ui-inverse, var(--ui-fg)))",
	},
	{ name: "--ui-inverse-mark", category: "colour", utility: "text-on-inverse-mark", use: "The accent mark on the inverse surface (optional)", optional: true, fallback: "var(--ui-inverse-fg, var(--ui-bg))" },
	{ name: "--ui-fill-start", category: "colour", use: "Word fill's start color on the page and the quiet fill (optional)", optional: true, fallback: "var(--ui-muted)" },
	{
		name: "--ui-inverse-fill-start",
		category: "colour",
		use: "Word fill's start color on the inverse surface (optional)",
		optional: true,
		fallback: "var(--ui-inverse-muted, color-mix(in oklab, var(--ui-inverse-fg, var(--ui-bg)) 72%, var(--ui-inverse, var(--ui-fg))))",
	},
	{
		name: "--ui-scrim-fill-start",
		category: "colour",
		use: "Word fill's start color on a photo, under the scrim (optional)",
		optional: true,
		fallback: "color-mix(in oklab, var(--ui-scrim-fg) 80%, var(--ui-scrim))",
	},

	{ name: "--ui-pin", category: "colour", utility: "bg-pin", use: "A map pin's fill (optional)", optional: true, fallback: "var(--ui-fg)" },
	{ name: "--ui-pin-fg", category: "colour", utility: "text-pin-fg", use: "A map pin's price and edge (optional)", optional: true, fallback: "var(--ui-bg)" },
	{ name: "--ui-pin-alt", category: "colour", utility: "bg-pin-alt", use: "A second-mode pin's fill, such as a rental (optional)", optional: true, fallback: "var(--ui-surface)" },
	{ name: "--ui-pin-alt-fg", category: "colour", utility: "text-pin-alt-fg", use: "A second-mode pin's price and edge (optional)", optional: true, fallback: "var(--ui-fg)" },
	{ name: "--ui-pin-hot", category: "colour", utility: "bg-pin-hot", use: "The hot pin's fill: under the pointer, or its card focused (optional)", optional: true, fallback: "var(--ui-accent)" },
	{ name: "--ui-pin-hot-fg", category: "colour", utility: "text-pin-hot-fg", use: "The hot pin's price (optional)", optional: true, fallback: "var(--ui-accent-fg)" },
	// Pro MapView's own style: each color is worked out from the page's tokens when unset, so none has a fallback here.
	{ name: "--ui-map-land", category: "colour", use: "The map's land (optional; Pro MapView)", optional: true },
	{ name: "--ui-map-water", category: "colour", use: "The map's water (optional; Pro MapView)", optional: true },
	{ name: "--ui-map-park", category: "colour", use: "The map's parks (optional; Pro MapView)", optional: true },
	{ name: "--ui-map-building", category: "colour", use: "The map's buildings (optional; Pro MapView)", optional: true },
	{ name: "--ui-map-road", category: "colour", use: "The map's roads (optional; Pro MapView)", optional: true },
	{ name: "--ui-map-label", category: "colour", use: "The map's place, road and water names, kept at 4.5:1 on the land (optional; Pro MapView)", optional: true },

	// Type
	{ name: "--ui-font-display", category: "type", utility: "font-display", use: "Headings and display type" },
	{ name: "--ui-font-body", category: "type", utility: "font-body", use: "Body text" },
	{
		name: "--ui-body-track",
		category: "type",
		utility: "tracking-body",
		use: "Body text letter spacing (optional)",
		optional: true,
		fallback: "normal",
	},
	{ name: "--ui-display-weight", category: "type", use: "Display font weight" },
	{ name: "--ui-display-track", category: "type", use: "Display letter spacing" },
	{ name: "--ui-display-stretch", category: "type", use: "Display font stretch" },
	{ name: "--ui-display-case", category: "type", use: "Display text case" },
	{ name: "--ui-display-scale", category: "type", use: "Display size multiplier: the display, title, section, stat, step, quote and price roles" },
	{ name: "--ui-type-display", category: "type", utility: "text-display", use: "Display text: hero headings (times the display scale)" },
	{ name: "--ui-type-display-split", category: "type", utility: "text-display-split", use: "Display text in a column beside media: HeroSplit's heading (times the display scale)" },
	{ name: "--ui-type-title", category: "type", utility: "text-title", use: "Title text: band headings (CtaBand) and large page titles, sized to the nearest container (times the display scale)" },
	{
		name: "--ui-type-section",
		category: "type",
		utility: "text-section",
		use: "Section text: a section's heading (SectionHead), a step under title, sized to the nearest container (times the display scale)",
		// tokens.css sets it; theme.css falls back to the title role for a site that does not load tokens.css.
		optional: true,
		fallback: "var(--ui-type-title)",
	},
	{ name: "--ui-type-stat", category: "type", utility: "text-stat", use: "Stat text: the largest a Stats value gets (times the display scale); below it, every value in a list fits the widest one to its item" },
	{ name: "--ui-type-step", category: "type", utility: "text-step", use: "Step text: a Steps number, sized to its own step (times the display scale)" },
	{ name: "--ui-type-price", category: "type", utility: "text-price", use: "Price text: a plan's price in Pro's Pricing, sized to its plan (times the display scale)" },
	{
		name: "--ui-type-listing-price",
		category: "type",
		utility: "text-listing-price",
		use: "A listing's price on a card: one flat size at every card width (optional)",
		optional: true,
		fallback: "1.6rem",
	},
	{ name: "--ui-type-quote", category: "type", utility: "text-quote", use: "Quote text: one large pull quote (TestimonialQuote), sized to its container, below the title role (times the display scale)" },
	{ name: "--ui-type-subhead", category: "type", utility: "text-subhead", use: "Subhead text: a heading inside running text (Prose h2), sized to its container" },
	{ name: "--ui-type-heading", category: "type", utility: "text-heading", use: "Heading text: card, plan and question titles" },
	{ name: "--ui-type-lead", category: "type", utility: "text-lead", use: "Intro line under a large heading" },
	{ name: "--ui-type-reading", category: "type", utility: "text-reading", use: "Reading text: running text in Prose, a step above body" },
	{ name: "--ui-type-body", category: "type", utility: "text-body", use: "Body text in parts" },
	{ name: "--ui-type-small", category: "type", utility: "text-small", use: "Small text: footers, meta lines" },
	{ name: "--ui-type-eyebrow", category: "type", utility: "text-eyebrow", use: "Eyebrow text: a short label above a heading" },
	{
		name: "--ui-heading-weight",
		category: "type",
		use: "Small heading weight: card, plan and question titles (optional)",
		optional: true,
		fallback: "var(--ui-display-weight)",
	},
	{ name: "--ui-button-weight", category: "type", use: "Button font weight" },
	{ name: "--ui-button-case", category: "type", use: "Button text case" },
	{ name: "--ui-button-track", category: "type", use: "Button letter spacing" },

	// Space
	{ name: "--ui-space", category: "space", use: "The Tailwind spacing unit" },
	{
		name: "--ui-space-section",
		category: "space",
		utility: "py-section",
		use: "Section padding (optional; default 16 to 32 times --ui-space by screen width)",
		optional: true,
		fallback: "clamp(calc(var(--ui-space) * 16), calc(var(--ui-space) * 8 + 8vw), calc(var(--ui-space) * 32))",
	},
	{
		name: "--ui-space-block",
		category: "space",
		utility: "gap-blocks",
		use: "Gap between blocks (optional)",
		optional: true,
		fallback: "calc(var(--ui-space) * 8)",
	},
	{
		name: "--ui-space-item",
		category: "space",
		utility: "gap-item",
		use: "Gap between items in a block (optional)",
		optional: true,
		fallback: "calc(var(--ui-space) * 2.5)",
	},
	{
		name: "--ui-space-cards",
		category: "space",
		utility: "gap-cards",
		use: "Gap between cards in a grid (optional; default twice the item gap)",
		optional: true,
		fallback: "calc(var(--ui-space-item, calc(var(--ui-space) * 2.5)) * 2)",
	},
	{ name: "--ui-panel-inset", category: "space", utility: "mx-panel-inset", use: "How far a Panel sits in from the page's sides and the next panel (optional)", optional: true, fallback: "0.5rem" },
	{ name: "--ui-control-h", category: "space", use: "Control height" },
	{
		name: "--ui-nav-offset",
		category: "space",
		use: "The page's scroll-padding-top under a sticky Navbar, so in-page jumps and focus land below it; 9rem for two rows, 1.5rem more when it floats (optional)",
		optional: true,
		fallback: "6rem",
	},
	{
		name: "--ui-card-media-inset",
		category: "space",
		use: "A Card image's inset from the card's top and side edges; the card's text pads by it too, so they share one edge (0px: a full-bleed image, the text keeps the padding) (optional)",
		optional: true,
		fallback: "calc(var(--ui-space) * 6)",
	},

	// Shape
	{ name: "--ui-radius-control", category: "shape", utility: "rounded-control", use: "Control corners" },
	{ name: "--ui-radius-card", category: "shape", utility: "rounded-card", use: "Card corners" },
	{ name: "--ui-border-w", category: "shape", use: "Border width" },
	{
		name: "--ui-card-border-w",
		category: "shape",
		use: "Card edge width; 0px for a card lifted by its shadow alone (optional)",
		optional: true,
		fallback: "var(--ui-border-w)",
	},
	{
		name: "--ui-button-border-w",
		category: "shape",
		use: "Button border width (optional)",
		optional: true,
		fallback: "var(--ui-border-w)",
	},
	{
		name: "--ui-field-border-w",
		category: "shape",
		use: "Text-field top and side edge width; the bottom keeps --ui-border-w (optional)",
		optional: true,
		fallback: "var(--ui-border-w)",
	},
	{
		name: "--ui-radius-media",
		category: "shape",
		utility: "rounded-media",
		use: "Media image corners (optional)",
		optional: true,
		fallback: "var(--ui-radius-card)",
	},
	{ name: "--ui-radius-panel", category: "shape", utility: "rounded-panel", use: "Panel corners (optional)", optional: true, fallback: "var(--ui-radius-card)" },
	{
		name: "--ui-radius-pill",
		category: "shape",
		utility: "rounded-pill",
		use: "Round-ended control corners: icon-tile buttons and option chips; a tile or box inside takes these less its gap (optional)",
		optional: true,
		fallback: "calc(infinity * 1px)",
	},
	{
		name: "--ui-media-border-w",
		category: "shape",
		use: "Media image edge width, in --ui-border (optional)",
		optional: true,
		fallback: "0px",
	},
	{
		name: "--ui-icon-stroke",
		category: "shape",
		utility: "ui-icon",
		use: "Icon line weight, the same at every icon size, e.g. 1.5px (optional)",
		optional: true,
		fallback: "1.75px",
	},
	{
		name: "--ui-logo-h",
		category: "shape",
		utility: "h-logo",
		use: "Logo height in LogoStrip, e.g. 2rem (optional)",
		optional: true,
		fallback: "1.75rem",
	},
	{
		name: "--ui-marquee-duration",
		category: "shape",
		utility: "marquee",
		use: "How long a Marquee takes to loop once at normal speed, e.g. 30s; slow is 1.5 times it, fast 0.6 (optional)",
		optional: true,
		fallback: "40s",
	},
	{
		name: "--ui-bento-row",
		category: "shape",
		utility: "auto-rows-bento",
		use: "The smallest row height in Pro's Bento grids, e.g. 13rem (optional)",
		optional: true,
		fallback: "11rem",
	},
	{
		name: "--ui-notch-angle",
		category: "shape",
		use: "MediaShape's notch wall slope, 0deg to 60deg (optional)",
		optional: true,
		fallback: "0deg",
	},
	{
		name: "--ui-notch-radius",
		category: "shape",
		use: "The curve inside a MediaShape notch (optional)",
		optional: true,
		fallback: "var(--ui-radius-media, var(--ui-radius-card))",
	},
	{
		name: "--ui-notch-gap",
		category: "shape",
		use: "Space between a MediaShape item and its cut edge (optional)",
		optional: true,
		fallback: "0.5rem",
	},
	{ name: "--ui-cut-size", category: "shape", use: "How far Media's cut corner reaches along each edge (optional)", optional: true, fallback: "2.5rem" },
	{ name: "--ui-cut-r", category: "shape", use: "The rounding on the joins of Media's cut corner (optional)", optional: true, fallback: "5px" },
	{ name: "--ui-shadow", category: "shape", utility: "shadow-card", use: "Card shadow" },
	{
		name: "--ui-popover-shadow",
		category: "shape",
		utility: "shadow-popover",
		use: "The lift of a panel that floats over the page: Popover's, and Select's picker (optional)",
		optional: true,
		fallback: "0 1px 2px rgb(0 0 0 / 0.05), 0 14px 40px -18px rgb(0 0 0 / 0.28)",
	},
	{
		name: "--ui-button-shadow",
		category: "shape",
		use: "Primary button edge and depth, e.g. an inset highlight (optional)",
		optional: true,
		fallback: "none",
	},
	{
		name: "--ui-band-button-shadow",
		category: "shape",
		use: "The band primary button's edge and depth (Button tone=\"band\" and tone=\"cta\"), drawn in the band colors (optional)",
		optional: true,
		fallback: "--ui-button-shadow",
	},
	{
		name: "--ui-press-scale",
		category: "shape",
		use: "Button shrink while pressed, e.g. 0.97 (optional)",
		optional: true,
		fallback: "none",
	},
	{
		name: "--ui-media-dim",
		category: "shape",
		use: "Media image filter, e.g. brightness(0.9) in dark mode to take the glare off pale photos (optional)",
		optional: true,
		fallback: "none",
	},
	{
		name: "--ui-media-shadow",
		category: "shape",
		use: "Media image shadow; not drawn on a Card's image (optional)",
		optional: true,
		fallback: "none",
	},
	{
		name: "--ui-nav-blur",
		category: "shape",
		use: "The Navbar's backdrop-filter, e.g. blur(16px), for a glass bar (optional)",
		optional: true,
		fallback: "none",
	},
];
