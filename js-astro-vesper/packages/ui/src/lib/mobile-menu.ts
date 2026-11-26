/**
 * MobileMenu's script. MobileMenu.astro's processed <script> calls start(); Astro bundles it once per page, however
 * many menus render. No framework: the panel is a native <dialog>, so the browser does the modal work (focus moves
 * into the panel and stays there, the page behind is inert, Escape closes it, and focus goes back to the open button
 * on close). This script only:
 *
 * - opens the panel when its open button ([data-mobile-menu-open], which names the dialog in aria-controls) is
 *   pressed: first it moves the dialog into the closest [data-ui-portal] around the button, else <body> (lib/portal.ts),
 *   so the panel takes that part's tokens, never the bar's; then showModal();
 * - moves the dialog back where it was rendered once it has closed (after its closing transition), and at once before
 *   ClientRouter swaps the page (astro:before-swap, closing it first): a bar kept with transition:persist keeps its
 *   panel, as ClientRouter keeps only what is inside the persisted element;
 * - closes it on the close button ([data-mobile-menu-close]), on a click on the backdrop (a click on the dialog itself,
 *   outside its box; a click on the panel's padding is inside it), and when a link in the panel is followed: an
 *   action, a page link and a same-page jump alike, so the page it lands on (or the one the browser keeps for Back)
 *   never shows the panel open. A link opened elsewhere (a modifier key held, a button other than the main one, a
 *   target other than _self, or a download) leaves it open. A link whose default action was prevented closes it too: ClientRouter prevents it on every link
 *   it follows itself, a same-page jump included;
 * - closes it when the window widens past the fold point (its open button no longer shows), so the wide page is never
 *   left inert under a panel it has no button for;
 * - keeps aria-expanded on the open button: true while its panel is open, false once it closes, however it closed;
 * - for a card panel (MobileMenu panel="card", data-panel="card"), places it under the bar as it opens: the bottom
 *   and the side edges of the [data-menu-anchor] around the open button (it wins over a nearer <nav>), else its
 *   closest <nav> (the Navbar's bar), as --menu-top, --menu-left and --menu-right on the dialog (cardPlace); with
 *   neither, only --menu-top, from the open button, and the card keeps its default side inset. It places it again on
 *   every resize while it is open.
 *
 * One click, close and before-swap listener on the document and one resize listener on the window (close is captured:
 * it does not bubble), bound once per page (a window flag), so a menu that ClientRouter swaps in works with no new
 * binding. Without the script the open button is hidden (@media (scripting: none)) and the caller shows its links
 * another way (the Navbar's link row).
 *
 * The open step (the gutter mark, then showModal()) and the click helpers (outside, plain, leaves) are lib/modal.ts's,
 * shared with the Lightbox. It imports only that (the component's script passes in portalContainer), so its logic runs
 * under Node's test runner.
 */
import { leaves, openModal, outside, plain, type Box, type Press } from "./modal.ts";

/** The open button; its aria-controls names the panel. */
export const OPEN = "[data-mobile-menu-open]";
/** The panel. */
export const MENU = "dialog[data-mobile-menu]";
/** What closes the panel when pressed or followed inside it: the close button, and every link. */
export const CLOSES = "[data-mobile-menu-close], a[href]";

type El = {
	closest(selector: string): El | null;
	getAttribute(name: string): string | null;
	getBoundingClientRect(): Box;
	open?: boolean;
};

/**
 * What a click does: "open" (the panel of the open button it hit), "close" (the open panel it hit), or nothing.
 * `target` is the element clicked, `x` and `y` where, `press` its button and keys: a link opened elsewhere (a
 * modifier key, another button, a target or a download) leaves the panel open.
 */
export function clickAction(target: El | null, x: number, y: number, press: Press = {}): { action: "open"; button: El } | { action: "close"; dialog: El } | null {
	if (!target) return null;
	const button = target.closest(OPEN);
	if (button) return { action: "open", button };
	const dialog = target.closest(MENU);
	if (!dialog?.open) return null;
	if (target === dialog) return outside(dialog.getBoundingClientRect(), x, y) ? { action: "close", dialog } : null;
	const hit = target.closest(CLOSES);
	if (!hit || (hit.closest("a[href]") === hit && (!plain(press) || leaves(hit)))) return null;
	return { action: "close", dialog };
}

/** A card panel's anchor: an explicit [data-menu-anchor] around the open button, which wins over a nearer <nav>. */
export const ANCHOR = "[data-menu-anchor]";
/** With no [data-menu-anchor], the closest <nav> (the Navbar's bar). */
export const ANCHOR_NAV = "nav";

/** The element a card panel lines up with: the open button's [data-menu-anchor], else its closest <nav>, else none. */
export function anchorOf(button: El): El | null {
	return button.closest(ANCHOR) ?? button.closest(ANCHOR_NAV);
}

/**
 * Where a card panel opens, in px from the viewport's edges (MobileMenu's --menu-top, --menu-left, --menu-right): under
 * the anchor's box and as wide, or, with no anchor, only under the open button. `width` is the viewport's width with no
 * scrollbar (documentElement.clientWidth), read before the scroll lock adds its gutter.
 */
export function cardPlace(anchor: Box | null, button: Box, width: number): { top: number; left?: number; right?: number } {
	if (!anchor) return { top: Math.round(button.bottom) };
	return { top: Math.round(anchor.bottom), left: Math.round(anchor.left), right: Math.round(width - anchor.right) };
}

/** Starts the script once per page. `portal` finds where a popup renders (lib/portal.ts's portalContainer). */
export function start(portal: (from: Element) => HTMLElement | undefined) {
	const w = window as unknown as { __auiMobileMenu?: boolean };
	if (w.__auiMobileMenu) return;
	w.__auiMobileMenu = true;

	/** Where each moved dialog was rendered: its parent and the node after it. */
	const homes = new WeakMap<HTMLDialogElement, { parent: Node; next: Node | null }>();
	const opener = (dialog: HTMLDialogElement) => document.querySelector<HTMLElement>(`[aria-controls="${CSS.escape(dialog.id)}"]`);
	const goHome = (dialog: HTMLDialogElement) => {
		const home = homes.get(dialog);
		if (!home || dialog.open) return;
		homes.delete(dialog);
		// A bar ClientRouter swapped out: the dialog stays where it is, and goes with the page.
		if (!home.parent.isConnected) return;
		home.parent.insertBefore(dialog, home.next?.parentNode === home.parent ? home.next : null);
	};

	/**
	 * A card panel's place (cardPlace), from its open button's anchor, as --menu-top, --menu-left and --menu-right. Set as
	 * it opens and again on every resize while it is open (a turned phone, a theme inset that changes at a breakpoint),
	 * so it stays on the bar's edges. The CSS (theme.css, menu-card-place) keeps it inside the screen and its safe areas.
	 */
	const place = (dialog: HTMLDialogElement, button: Element | null = opener(dialog)) => {
		if (dialog.dataset.panel !== "card" || !button) return;
		const anchor = anchorOf(button as unknown as El) as unknown as Element | null;
		const box = cardPlace(anchor ? anchor.getBoundingClientRect() : null, button.getBoundingClientRect(), document.documentElement.clientWidth);
		for (const side of ["top", "left", "right"] as const) {
			const px = box[side];
			if (px === undefined) dialog.style.removeProperty(`--menu-${side}`);
			else dialog.style.setProperty(`--menu-${side}`, `${px}px`);
		}
	};

	document.addEventListener("click", (event) => {
		const hit = clickAction(event.target instanceof Element ? (event.target as unknown as El) : null, event.clientX, event.clientY, event);
		if (hit?.action === "close") (hit.dialog as unknown as HTMLDialogElement).close();
		if (hit?.action !== "open") return;
		const button = hit.button as unknown as HTMLElement;
		const dialog = document.getElementById(button.getAttribute("aria-controls") ?? "");
		if (!(dialog instanceof HTMLDialogElement) || dialog.open) return;
		const home = portal(button) ?? document.body;
		if (dialog.parentElement !== home) {
			if (!homes.has(dialog)) homes.set(dialog, { parent: dialog.parentNode!, next: dialog.nextSibling });
			home.append(dialog);
		}
		place(dialog, button);
		// The scroll lock keeps the scrollbar's gutter only on a page that has a scrollbar (theme.css).
		openModal(dialog, document.documentElement);
		button.setAttribute("aria-expanded", "true");
	});

	document.addEventListener(
		"close",
		(event) => {
			const dialog = event.target;
			if (!(dialog instanceof HTMLDialogElement) || !dialog.matches(MENU)) return;
			opener(dialog)?.setAttribute("aria-expanded", "false");
			// After the slide out (none under reduced motion): moving the dialog ends its transitions.
			// allSettled: a canceled animation (its finished promise rejects) does not cut the others short.
			Promise.allSettled(dialog.getAnimations({ subtree: true }).map((a) => a.finished)).then(() => goHome(dialog));
		},
		true,
	);

	document.addEventListener("astro:before-swap", () => {
		for (const dialog of document.querySelectorAll<HTMLDialogElement>(MENU)) {
			if (dialog.open) dialog.close();
			opener(dialog)?.setAttribute("aria-expanded", "false");
			goHome(dialog);
		}
	});

	window.addEventListener("resize", () => {
		for (const dialog of document.querySelectorAll<HTMLDialogElement>(`${MENU}[open]`)) {
			if (!opener(dialog)?.getClientRects().length) dialog.close();
			else place(dialog);
		}
	});
}
