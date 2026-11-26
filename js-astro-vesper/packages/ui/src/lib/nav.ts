import type { ButtonSize, ButtonVariant } from "./button";
import type { IconComponent } from "./icon";

export interface NavLink {
	label: string;
	href: string;
	/** Marks the current page (aria-current="page"). */
	current?: boolean;
	/** Link target, e.g. "_blank". New-tab links get rel="noopener noreferrer". */
	target?: string;
	/** Optional section number shown before the label, e.g. "1.0". Styled with `[data-nav-index]`. */
	index?: string;
	/** Optional short tag after the label, e.g. "Beta" or "New". Styled with `[data-nav-badge]`. */
	badge?: string;
}

/** rel value for a link target. */
export function relFor(target?: string): string | undefined {
	return target === "_blank" ? "noopener noreferrer" : undefined;
}

export interface NavAction {
	label: string;
	href: string;
	variant?: ButtonVariant;
	/** Desktop button size in the Navbar. Default: "sm". */
	size?: ButtonSize;
}

/**
 * The number to call in the Navbar and its MobileMenu (Navbar's and MobileMenu's phone): the bar's PhoneLink and the
 * menu's "Call {number}" row (its words are callText).
 */
export interface NavPhone {
	/** The number as the page shows it, such as "(555) 010-0142". */
	number: string;
	/** Small words over the number in the bar, such as "Call us". Part of the link's accessible name. */
	label?: string;
	/** Required. Your phone icon: below the fold point it is all the bar shows. Decoration. */
	icon: IconComponent;
	/**
	 * The mobile menu row's words, with {number} filled in by the number as written: "Call {number}" by default. The
	 * words are the row link's name, so keep the number in them.
	 */
	callText?: string;
	/**
	 * Where the bar's phone folds to its 44px icon: below the Navbar's own fold point (`collapse`, the default), or
	 * `"nav-phone"`, the theme's own phone fold point (theme.css --breakpoint-nav-phone, 48rem by default), so the number
	 * stays in the bar after the links fold. The accessible name keeps the number at every width.
	 */
	iconOnlyBelow?: PhoneFold;
}

/** A PhoneLink's fold point: one of the Navbar's (md, lg) or the phone's own (theme.css --breakpoint-nav-phone). */
export type PhoneFold = NavCollapse | "nav-phone";

/**
 * Where Navbar switches from the desktop links to the mobile menu: below the `md` fold point (the default) or below
 * the `lg` one (for a bar with more links or utilities). Each is a Tailwind breakpoint of its own, set in theme.css's
 * @theme and read through its variant (nav-md:, nav-lg:): --breakpoint-nav-md (48rem, 768px, as Tailwind's md) and
 * --breakpoint-nav-lg (64rem, 1024px, as lg). A theme moves a fold point by setting the token in its own @theme
 * (Dispatch: 761px and 1100px), and every class here (the menu button's wrapper hides with CSS, so the menu follows
 * it) and theme.css's sticky inset follow it. Full class names, for Tailwind.
 * The recipes' layouts above the fold point follow it too: centeredLinks and centeredSide (NavbarCentered's link list,
 * and its brand and end group, which share the free space equally), stackedRow
 * and stackedLinks (NavbarStacked's row, which wraps, and its link list, last in the markup, a full-width second
 * row under a hairline), centerRow, centerBrand and centerEnd (NavbarBrandCenter's three columns: the links, the brand, the end group).
 * Below the fold point with no JavaScript (@media (scripting: none)), where the menu cannot open, the bar shows its
 * link list instead: fallbackRow (the <nav> wraps, its rows close together), fallbackLinks (the list shows at every
 * width, and below the fold point takes a full row of its own, last) and fallbackLink (each link a box at least 44px
 * tall, in rem, WCAG 2.5.5, so the wrapped rows never overlap).
 */
export const navCollapse = {
	md: {
		desktop: "hidden nav-md:flex",
		mobile: "nav-md:hidden",
		centeredLinks: "nav-md:justify-center nav-md:flex-none",
		centeredSide: "nav-md:flex-[1_1_0] nav-md:min-w-min nav-md:in-data-nav-shrunk:min-w-max",
		stackedRow: "nav-md:flex-wrap nav-md:gap-y-3",
		stackedLinks: "nav-md:basis-full nav-md:border-t-ui nav-md:border-solid nav-md:border-on-band-border nav-md:pt-3",
		centerRow: "nav-md:grid nav-md:grid-cols-[1fr_auto_1fr]",
		centerBrand: "nav-md:justify-self-center nav-md:justify-center nav-md:text-center",
		centerEnd: "nav-md:justify-self-end",
		fallbackRow: "noscript:max-nav-md:flex-wrap noscript:max-nav-md:gap-y-1",
		fallbackLinks: "noscript:flex noscript:max-nav-md:order-last noscript:max-nav-md:basis-full noscript:max-nav-md:gap-y-0",
		fallbackLink: "noscript:max-nav-md:inline-flex noscript:max-nav-md:min-h-[2.75rem] noscript:max-nav-md:items-center",
	},
	lg: {
		desktop: "hidden nav-lg:flex",
		mobile: "nav-lg:hidden",
		centeredLinks: "nav-lg:justify-center nav-lg:flex-none",
		centeredSide: "nav-lg:flex-[1_1_0] nav-lg:min-w-min nav-lg:in-data-nav-shrunk:min-w-max",
		stackedRow: "nav-lg:flex-wrap nav-lg:gap-y-3",
		stackedLinks: "nav-lg:basis-full nav-lg:border-t-ui nav-lg:border-solid nav-lg:border-on-band-border nav-lg:pt-3",
		centerRow: "nav-lg:grid nav-lg:grid-cols-[1fr_auto_1fr]",
		centerBrand: "nav-lg:justify-self-center nav-lg:justify-center nav-lg:text-center",
		centerEnd: "nav-lg:justify-self-end",
		fallbackRow: "noscript:max-nav-lg:flex-wrap noscript:max-nav-lg:gap-y-1",
		fallbackLinks: "noscript:flex noscript:max-nav-lg:order-last noscript:max-nav-lg:basis-full noscript:max-nav-lg:gap-y-0",
		fallbackLink: "noscript:max-nav-lg:inline-flex noscript:max-nav-lg:min-h-[2.75rem] noscript:max-nav-lg:items-center",
	},
} as const;

export type NavCollapse = keyof typeof navCollapse;
