/**
 * The theme's `cn`: the kit's (@astronomic/ui/lib/cn.ts) with the theme's own Tailwind names taught to
 * tailwind-merge too (src/styles/vesper.css `@theme inline`). Without them, tailwind-merge reads an unknown
 * `text-v-brand` as a color and drops a `text-inherit` beside it. The kit's names below are a copy of its list;
 * scripts/units/cn.test.mjs fails when the kit adds a name this copy lacks.
 *
 * Plain Node loads this file (the unit tests).
 */
import { extendTailwindMerge } from "tailwind-merge";

type ClassValue = string | false | null | undefined;

/** Joins class names, skipping falsy values. No conflict resolution. */
export function cx(...classes: ClassValue[]): string {
	return classes.filter(Boolean).join(" ");
}

// The kit's names (lib/cn.ts in @astronomic/ui, with its notes), then the theme's (marked "Vesper").
const twMerge = extendTailwindMerge({
	extend: {
		theme: {
			color: [
				"bg",
				"surface",
				"surface-2",
				"fg",
				"muted",
				"border",
				"border-control",
				"accent",
				"accent-fg",
				"accent-soft",
				"accent-hover",
				"danger",
				"band",
				"band-fg",
				"scrim",
				"scrim-fg",
				"on-band",
				"on-band-muted",
				"on-band-border",
				"on-band-underline",
				"on-band-tint",
				"on-band-surface",
				"on-band-button",
				"on-band-button-fg",
				"on-band-button-hover",
				"cta-button-hover",
				"cta-tint",
				"field-fill",
				"tint",
				"tint-fg",
				"tint-edge",
				"avatar-fill",
				"avatar-fg",
				"inverse",
				"on-inverse",
				"on-inverse-muted",
				"on-inverse-border",
				"on-inverse-mark",
				"on-inverse-button-hover",
				"on-inverse-tint",
				"fill-start",
				"inverse-fill-start",
				"scrim-fill-start",
				// Map pins (Pro MapView): the pin, the second mode's pin and the hot pin, each with its text color.
				"pin",
				"pin-fg",
				"pin-alt",
				"pin-alt-fg",
				"pin-hot",
				"pin-hot-fg",
				// The trades kit's color names. The accent surface (surface-accent): its text, secondary text and rules, and its Button's hover and tint.
				"on-accent",
				"on-accent-muted",
				"on-accent-border",
				"on-accent-button-hover",
				"on-accent-tint",
				// Vesper
				"v-body",
				"v-border-2",
				"v-chip",
			],
			radius: ["control", "card", "media", "textarea", "code", "code-block", "panel"],
			shadow: ["card"],
			font: ["display", "body", "v-meta", "v-code"],
			text: [
				"display",
				"display-split",
				"title",
				"stat",
				"step",
				"quote",
				"price",
				"listing-price",
				"subhead",
				"heading",
				"lead",
				"reading",
				"body",
				"small",
				"eyebrow",
				"nav-index",
				"nav-badge",
				"filter-label",
				"control-sm",
				"control",
				"control-lg",
				"avatar-sm",
				"avatar",
				"avatar-lg",
				"avatar-xl",
				"code",
				// Vesper
				"v-title",
				"v-page",
				"v-lead",
				"v-meta",
				"v-nav",
				"v-brand",
				"v-role",
				"v-fine",
			],
			// The roles, and the control heights and hairline (h-control, size-control-sm, min-w-control, -mt-hairline).
			spacing: ["section", "blocks", "item", "blocks-item", "group", "cards", "control", "control-sm", "control-lg", "hairline", "nav-inset", "panel-inset", "v-gut", "v-sec", "v-avatar", "v-author", "v-icon"],
			// Named reading widths and the logo box (theme.css --max-width-*): max-w-head, max-w-lead, max-w-lead-narrow, max-w-logo.
			container: ["head", "lead", "lead-narrow", "logo", "v-wrap", "v-bar"],
		},
		// border-card and card-pad (theme.css) are the Card's edge width and padding, so border-0 and p-8 replace
		// them and border-border does not; border-ui (and each side), border-button, border-field and border-s-quote
		// are border widths too. ring-ui is a ring width and decoration-ui an underline thickness. h-logo (theme.css
		// --height-logo) is a height, so h-8 replaces it; min-h-logo and min-h-textarea likewise are min heights.
		classGroups: {
			"border-w": [{ border: ["card", "ui", "button", "field"] }],
			"border-w-x": [{ "border-x": ["ui"] }],
			"border-w-y": [{ "border-y": ["ui"] }],
			"border-w-s": [{ "border-s": ["ui", "quote"] }],
			"border-w-e": [{ "border-e": ["ui"] }],
			"border-w-t": [{ "border-t": ["ui"] }],
			"border-w-r": [{ "border-r": ["ui"] }],
			"border-w-b": [{ "border-b": ["ui"] }],
			"border-w-l": [{ "border-l": ["ui"] }],
			"ring-w": [{ ring: ["ui"] }],
			// rounded-pill, rounded-card-nest, rounded-card-outer and rounded-nested (theme.css) are corner radii: the pill
			// token's, the card's (each naming it for a nested box), the card's plus the gap (a box holding a nested one), and
			// the outer one less the gap. So rounded-full or rounded-none replaces them.
			rounded: [{ rounded: ["pill", "card-nest", "card-outer", "nested"] }],
			"text-decoration-thickness": [{ decoration: ["ui"] }],
			// safe-area-pad (theme.css) is padding too: the safe-area insets, on the Lightbox frame.
			p: [{ card: ["pad"] }, "safe-area-pad"],
			h: [{ h: ["logo"] }],
			// min-h-tap (theme.css, the proof parts) is a min height too, so min-h-11 or min-h-control replaces it.
			"min-h": [{ "min-h": ["logo", "textarea", "tap"] }],
			// The credentials column templates (theme.css --grid-template-columns-*) are column templates.
			"grid-cols": [{ "grid-cols": ["credentials-strip", "credentials-rows"] }],
			// auto-rows-bento (theme.css --grid-auto-rows-bento) is a grid row size, so auto-rows-fr replaces it.
			"auto-rows": [{ "auto-rows": ["bento"] }],
			// button-shadow, band-button-shadow and field-invalid-ring set box-shadow, so shadow-none (under the same
			// variant) replaces them; press-scale sets scale, so active:scale-100 replaces active:press-scale.
			shadow: ["button-shadow", "band-button-shadow", "field-invalid-ring"],
			scale: ["press-scale"],
			// text-roll (a rolling label, theme.css) and text-fit (fitted display type) are utilities, not text colors
			// or sizes: each is its own group, so a text-* color or size beside them stays. New group ids, so the
			// object is typed loosely (the merge takes any id).
			...({ "text-roll": ["text-roll"], "text-fit": ["text-fit"] } as {}),
		},
		// Not taught: these utilities set several properties at once, or style an element's children, so no one group
		// fits them. cn() keeps a caller's class beside them, and which one shows is down to CSS order:
		// - link-underline (color and underline), button-face (weight, case, tracking), display-face and heading-face
		//   (family, weight, tracking, stretch, case; lib/display.ts): Tailwind puts these before the color, family,
		//   weight, tracking and case utilities, so a caller's text-muted, font-body, font-semibold or uppercase wins
		//   (check-css checks it).
		// - media-frame (border width, box-shadow and filter at once): cn() keeps a caller's border, shadow or filter
		//   class beside it and none replaces it. A shadow-* or filter class still wins by CSS order, but a border
		//   width (border-0, border-2) sits before media-frame in the sheet and loses: set --ui-media-border-w instead.
		// - surface-band and surface-nav (background, edge and text color; surface-nav's backdrop filter too) sit
		//   before the color and backdrop utilities, so a caller's bg-*, border-* color or text-* wins.
		// - ui-icon (display, flex-shrink, vertical-align, stroke width), card-media (margins, and its image's shadow
		//   and corners) and scrim-rise (a border-image).
		// - focus-on-image, focus-on-cta and focus-on-band style the focusable elements inside, not the element that
		//   carries them, so they conflict with none of that element's own classes.
	},
});

/** Joins class names; later classes win over conflicting earlier ones (for `class` overrides). */
export function cn(...classes: ClassValue[]): string {
	return twMerge(cx(...classes));
}
