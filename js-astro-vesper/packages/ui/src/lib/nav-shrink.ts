/**
 * Navbar's shrink script (the `shrink` prop, with `floating`). NavShrink.astro's processed <script> calls start(); Astro
 * bundles it once per page, and only a page with a shrinking bar renders it. No framework, and no CSS of its own in
 * any stylesheet: the narrow width and its transition are inline styles this script sets, so a site whose bars never
 * shrink ships none of it (its theme scans the kit's source, so a class here would land in every site's CSS).
 *
 * - Once the page scrolls past SHRINK_AT pixels, each header[data-nav-shrink] gets data-nav-shrunk, and back at the top
 *   it loses it. Above the fold point the shrunk bar's <nav> then rests at max-content (its content's width, the link
 *   list at its natural width, so no empty space between the groups), never wider than its own resting width (an inline
 *   max width, measured: a bar with many links keeps its width rather than grow past it), centered by the Navbar's
 *   mx-auto. Below the fold
 *   point it rests at its normal width. The fold point is read from the page, not from a breakpoint: the menu button's
 *   wrapper ([data-nav-menu]) is display: none above it, wherever the theme sets it. The header's own height never
 *   changes, so nothing under the bar moves.
 * - The width animates by measurement, which works in every current browser (interpolate-size, which would let the
 *   CSS transition to max-content alone, is Chromium only): read the nav's width now, switch the state, read the new
 *   width with no transition, pin the old width inline, then set the new one with a width transition (DURATION,
 *   EASING), so it runs between two lengths. On transitionend the transition goes and the nav takes its resting width
 *   again, so the bar follows its content and the window. A reversal part way starts from the width the nav has then.
 * - No animation under prefers-reduced-motion, under the calm setting (data-motion="calm" on <html>, decision 0018), on
 *   the first state, or for a scroll the reader did not make (a page opened scrolled down, or put back there on reload,
 *   or at an anchor: it switches before the bar is seen to change): it only switches to the resting width. A scroll
 *   counts as the reader's once the page has loaded, or after a wheel, touch, key or pointer press, so the first scroll
 *   on a page still loading (a large photo, a slow network) animates too.
 * - The transition's end is its transitionend once no width transition still runs on the nav: Chromium can report a
 *   width transitionend (elapsed 0) as the transition starts, which would put the nav at its end width at once.
 * - One passive scroll listener on the window, read once per frame (requestAnimationFrame). When a header's own width
 *   changes (the window's did, perhaps across the fold point), a ResizeObserver puts the nav back at its resting width.
 *   It binds once per page (a window flag), and astro:page-load sets the state again for the new page, so ClientRouter
 *   navigation and a persisted header both work.
 * - Without the script the bar is sticky at its normal width.
 *
 * It imports nothing, so its logic runs under Node's test runner.
 */

/** The bars this script narrows. */
export const SHRINK_SELECTOR = "header[data-nav-shrink]";

/** How far the page scrolls, in CSS pixels, before the bar narrows. */
export const SHRINK_AT = 24;

/** The width transition while the bar narrows or widens. */
export const DURATION = "300ms";
export const EASING = "ease-out";

/** The narrow bar's resting width, above the fold point. */
export const NARROW = "max-content";

/** Whether the bar is narrow at this scroll position. */
export function shouldShrink(scrollY: number, threshold = SHRINK_AT): boolean {
	return scrollY > threshold;
}

type Box = { style: { width: string; maxWidth: string; transition: string }; getBoundingClientRect(): { width: number }; querySelector(selector: string): unknown };
type Header = { hasAttribute(name: string): boolean; toggleAttribute(name: string, force: boolean): boolean; querySelector(selector: string): unknown };
type Env = { getComputedStyle(el: never): { display: string } };

const navOf = (header: Header) => header.querySelector(":scope > nav") as Box | null;

/** The inline width and max width a nav rests at: none (its own width), or the narrow state's. */
export type Resting = { width: string; maxWidth: string };

/**
 * The inline styles the bar's nav rests at in its current state. Shrunk above the fold point (the menu button's
 * wrapper is hidden): max-content, never wider than the nav's own width (measured with no inline width), so a bar
 * whose content is wider than its resting width (many links) keeps that width rather than growing. Else none.
 */
export function restingStyle(header: Header, env: Env = globalThis as unknown as Env): Resting {
	const none = { width: "", maxWidth: "" };
	if (!header.hasAttribute("data-nav-shrunk")) return none;
	const nav = navOf(header);
	const menu = nav?.querySelector(":scope > [data-nav-menu]");
	if (!nav || !menu || env.getComputedStyle(menu as never).display !== "none") return none;
	const { width, maxWidth } = nav.style;
	nav.style.width = "";
	nav.style.maxWidth = "";
	const own = nav.getBoundingClientRect().width;
	nav.style.width = width;
	nav.style.maxWidth = maxWidth;
	return { width: NARROW, maxWidth: `${own}px` };
}

/** Sets a nav's inline width and max width. */
const apply = (nav: Box, { width, maxWidth }: Resting) => {
	nav.style.maxWidth = maxWidth;
	nav.style.width = width;
};

/**
 * The nav's width once the transitions inside it have ended. A part in the bar may change size with the state on a
 * transition of its own (a logo that gets smaller as the bar narrows): measured at once, it is still at its old size,
 * the width transition ends too wide, and the nav then jumps to its resting width. So each running transition inside
 * the nav (not the nav's own) is moved to its end for the measurement and put back where it was, in the same task, so
 * nothing paints in between and the part still animates.
 */
function settledWidth(nav: Box): number {
	const all = (nav as unknown as Partial<Element>).getAnimations?.({ subtree: true }) ?? [];
	const inner = all.filter((a) => a.effect && (a.effect as KeyframeEffect).target !== (nav as unknown) && a.playState === "running");
	const was = inner.map((a) => a.currentTime);
	for (const a of inner) a.currentTime = a.effect!.getComputedTiming().endTime as number;
	const width = nav.getBoundingClientRect().width;
	inner.forEach((a, i) => (a.currentTime = was[i]));
	return width;
}

/** Puts the nav back at its resting width, with no transition (after one, or when the window's width changed). */
export function rest(header: Header, env: Env = globalThis as unknown as Env) {
	const nav = navOf(header);
	if (!nav) return;
	nav.style.transition = "";
	apply(nav, restingStyle(header, env));
}

/**
 * Sets one bar's state. With `animate`, the nav's width moves from the width it has now to the width of the new state.
 * Returns whether the state changed.
 */
export function setShrunk(header: Header, on: boolean, { animate = false, env = globalThis as unknown as Env }: { animate?: boolean; env?: Env } = {}): boolean {
	if (header.hasAttribute("data-nav-shrunk") === on) return false;
	const nav = navOf(header);
	if (!nav || !animate) {
		header.toggleAttribute("data-nav-shrunk", on);
		rest(header, env);
		return true;
	}
	const from = nav.getBoundingClientRect().width;
	nav.style.transition = "none";
	header.toggleAttribute("data-nav-shrunk", on);
	apply(nav, restingStyle(header, env));
	const to = settledWidth(nav);
	if (Math.abs(to - from) < 0.5) {
		nav.style.transition = "";
		return true;
	}
	nav.style.width = `${from}px`;
	nav.getBoundingClientRect(); // commit the start width before the transition is set
	nav.style.transition = `width ${DURATION} ${EASING}`;
	nav.style.width = `${to}px`;
	return true;
}

/** Whether the page's motion is off: reduced motion, the calm setting or the reader's pause on <html> (decision 0018). */
export function still(reduced: boolean, root: { getAttribute(name: string): string | null }): boolean {
	return reduced || root.getAttribute("data-motion") === "calm" || root.getAttribute("data-motion-paused") !== null;
}

/** Whether a width transition still runs on the nav (its transitionend is then not the end). */
const widthRunning = (nav: Element) => nav.getAnimations().some((a) => (a as CSSTransition).transitionProperty === "width" && a.playState === "running");

/** The events that show the reader is scrolling the page themselves. */
export const INPUT_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

/** How long after a width transition starts the script checks that the nav came to rest (the transition, plus a margin). */
export const SAFETY_MS = parseFloat(DURATION) + 50;

/** Starts the script once per page. */
export function start() {
	const w = window as unknown as { __auiNavShrink?: boolean };
	if (w.__auiNavShrink) return;
	w.__auiNavShrink = true;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	let frame = 0;
	// A header that changes width (the window did) puts its nav back at its resting width, so the bar fits again, on
	// either side of the fold point. Only a change from the width last seen counts: the observer also reports each
	// header once when it starts.
	const widths = new WeakMap<Element, number>();
	const sized = new ResizeObserver((entries) => {
		for (const { target, contentRect } of entries) {
			const was = widths.get(target);
			widths.set(target, contentRect.width);
			if (was !== undefined && was !== contentRect.width) rest(target);
		}
	});

	const observed = new Set<Element>();
	// A scroll after the reader's own input is theirs, even before the page has loaded.
	let input = false;
	const mark = () => {
		input = true;
		for (const type of INPUT_EVENTS) window.removeEventListener(type, mark, true);
	};
	for (const type of INPUT_EVENTS) window.addEventListener(type, mark, { capture: true, passive: true });

	// A safety net: should no transitionend come (the nav hidden, the transition cut), the nav still comes to rest once its
	// width transition has had its time; while one still runs (a slow frame), it looks again later.
	const timers = new WeakMap<Element, ReturnType<typeof setTimeout>>();
	const settleLater = (header: Element, nav: HTMLElement) => {
		clearTimeout(timers.get(nav));
		timers.set(
			nav,
			setTimeout(() => {
				if (!nav.style.transition) return;
				if (widthRunning(nav)) settleLater(header, nav);
				else rest(header);
			}, SAFETY_MS),
		);
	};

	const update = (animate: boolean) => {
		// A header no longer in the document (ClientRouter swapped the page) is no longer observed.
		for (const header of observed)
			if (!header.isConnected) {
				sized.unobserve(header);
				observed.delete(header);
			}
		const on = shouldShrink(window.scrollY);
		for (const header of document.querySelectorAll<HTMLElement>(SHRINK_SELECTOR)) {
			const nav = header.querySelector<HTMLElement>(":scope > nav");
			if (nav && nav.dataset.navShrinkBound === undefined) {
				nav.dataset.navShrinkBound = "";
				nav.addEventListener("transitionend", (e) => {
					if (e.target === nav && e.propertyName === "width" && !widthRunning(nav)) rest(header);
				});
				// The header's width follows the window, never the nav's animation (the nav narrows inside it).
				sized.observe(header);
				observed.add(header);
			}
			const moving = animate && !still(reduced.matches, document.documentElement);
			if (setShrunk(header, on, { animate: moving }) && nav && nav.style.transition) settleLater(header, nav);
		}
	};

	window.addEventListener(
		"scroll",
		() => {
			if (frame) return;
			frame = requestAnimationFrame(() => {
				frame = 0;
				// Before the page has loaded and with no input from the reader, a scroll is the browser putting a reopened page
				// back where it was (or at an anchor): no animation.
				update(input || document.readyState === "complete");
			});
		},
		{ passive: true },
	);
	document.addEventListener("astro:page-load", () => update(false));
	update(false);
}
