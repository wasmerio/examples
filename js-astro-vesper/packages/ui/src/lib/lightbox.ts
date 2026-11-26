/**
 * The Lightbox's script. Lightbox.astro's processed <script> calls start(); Astro bundles it once per page. No
 * framework: the viewer is a native modal <dialog> (data-lightbox-dialog), so the browser does the modal work (focus
 * moves in and stays there, the page behind is inert, Escape closes it). This script only:
 *
 * - opens it from a link marked data-lightbox (lightboxAttrs() writes the marks), whose href is the full image. It
 *   listens for clicks on the document in the capture phase, so it runs before any bubbling listener there
 *   (ClientRouter's included) and prevents the click first: ClientRouter skips a prevented click, so it never
 *   navigates. A click that opens a tab or a window (a modifier key, another button), a link with a target or a
 *   download, and a click already prevented before it runs are left alone, and so is every click on a page with no
 *   lightbox dialog. Only a capture listener on `window` runs before it: a click handler on the link itself, or any
 *   other listener on the page, runs after the lightbox has opened, so its preventDefault() cannot stop it. To keep a
 *   link out of the lightbox, leave data-lightbox off it (or remove it). Focus goes to the close button, with its
 *   focus ring when it was opened from the keyboard and without it after a click or a tap;
 * - walks the link's group (every visible link with the same data-lightbox value, in page order: one with a box, not
 *   visibility:hidden and not inside [inert]) with the prev and next buttons, the arrow keys (swapped right to left),
 *   Home, End and a sideways swipe, wrapping at the ends. The keys work wherever focus is in the dialog, and on the
 *   body (a click on the picture or the caption moves focus there in Firefox and Safari). A set of one hides prev,
 *   next and the counter;
 * - shows the link's own thumbnail at once, then the full file once it has decoded; a slow load for an earlier pick
 *   never replaces a later one (a request number), and the stage is aria-busy="true" only while the current one loads;
 * - makes the caption a Tab stop (tabindex="0") only while it scrolls (a long caption, past its max height), so the
 *   keyboard can scroll it in every browser;
 * - closes it on the close button and on a click beside the picture (on the stage, the bar's empty space), not on
 *   the picture or the caption: the press must start there too, so a drag from the caption (selecting its text) or
 *   from the picture never closes it, and neither does a sideways swipe, in a set of one too. It gives focus back to
 *   the link of the image shown last, or to the link that opened it when that one is hidden now;
 * - closes it before ClientRouter swaps the page, without moving focus.
 *
 * It never keeps a dialog node: it finds the current dialog[data-lightbox-dialog] at each use, so after a page swap it
 * uses the new page's. Bound once per page (a window flag). No preloading. Without the script the links open the image.
 *
 * It imports only lib/modal.ts, so its logic runs under Node's test runner.
 */
import { leaves, OVERFLOW, openModal, outside, plain, type Box, type Press } from "./modal.ts";

/** A link that opens the lightbox. */
export const TRIGGER = "a[data-lightbox]";
/** The viewer. */
export const DIALOG = "dialog[data-lightbox-dialog]";

/** What lightboxAttrs() takes: the set, and optional caption, large srcset and full size. */
export interface LightboxOptions {
	/** The set this image belongs to: prev and next walk every link with the same group. "" (the default) is a set of one. */
	group?: string;
	/** The caption. Else the text of the <figcaption> of the link's closest <figure>. Plain text. */
	caption?: string;
	/** A srcset for the large view, so the browser picks the right file. */
	srcset?: string;
	/** The sizes for `srcset`. Default "100vw". Only with `srcset`. */
	sizes?: string;
	/** The full image's width, so the large view keeps its shape while it loads. Else the thumbnail's ratio. */
	width?: number;
	/** The full image's height. */
	height?: number;
}

/** The attributes lightboxAttrs() returns, to spread on a link. */
export interface LightboxAttrs {
	"data-lightbox": string;
	"data-lightbox-caption"?: string;
	"data-lightbox-srcset"?: string;
	"data-lightbox-sizes"?: string;
	"data-lightbox-width"?: string;
	"data-lightbox-height"?: string;
}

/**
 * The attributes that make a link open in the Lightbox. Spread them on a link whose href is the full image:
 * `<a href={src} {...lightboxAttrs({ group: "shots" })}><img …></a>`. They are plain attributes, so a caller may write
 * them by hand too (in CMS HTML, say).
 */
export function lightboxAttrs({ group = "", caption, srcset, sizes, width, height }: LightboxOptions = {}): LightboxAttrs {
	const attrs: LightboxAttrs = { "data-lightbox": group };
	if (caption) attrs["data-lightbox-caption"] = caption;
	if (srcset) {
		attrs["data-lightbox-srcset"] = srcset;
		attrs["data-lightbox-sizes"] = sizes || "100vw";
	}
	if (width !== undefined) attrs["data-lightbox-width"] = String(width);
	if (height !== undefined) attrs["data-lightbox-height"] = String(height);
	return attrs;
}

type Attrs = { getAttribute(name: string): string | null; hasAttribute(name: string): boolean };
type Visible = Attrs & { getClientRects(): { length: number }; closest(selector: string): unknown };

/** A link's computed visibility, in a browser. */
const visibilityOf = (link: unknown): string => getComputedStyle(link as Element).visibility;

/**
 * Whether a link is shown: it has a box (not display:none, itself or an ancestor), it is not visibility:hidden (or
 * collapse), and it is not inside [inert]. `visibility` reads its computed visibility (a test passes its own).
 */
export function shown(link: Visible, visibility: (link: Visible) => string = visibilityOf): boolean {
	if (link.getClientRects().length === 0 || link.closest("[inert]")) return false;
	const v = visibility(link);
	return v !== "hidden" && v !== "collapse";
}

/**
 * The set a link belongs to: every shown link (see shown()) with the same data-lightbox value, in page order, and
 * always the link itself. A link with data-lightbox="" is a set of one. `isShown` decides which links are shown.
 */
export function collect<T extends Visible>(trigger: T, doc: { querySelectorAll(selector: string): Iterable<T> | ArrayLike<T> }, isShown: (link: T) => boolean = (link) => shown(link)): T[] {
	const group = trigger.getAttribute("data-lightbox") ?? "";
	if (group === "") return [trigger];
	const set = Array.from(doc.querySelectorAll(TRIGGER)).filter((link) => link === trigger || (link.getAttribute("data-lightbox") === group && isShown(link)));
	return set.includes(trigger) ? set : [trigger];
}

/**
 * Where focus goes back on close: the link of the image shown last, else (it is gone or hidden now) the link that
 * opened the lightbox, else null (focus stays on the body).
 */
export function returnTo<T>(last: T | null | undefined, opener: T | null | undefined, usable: (link: T) => boolean): T | null {
	for (const link of [last, opener]) if (link != null && usable(link)) return link;
	return null;
}

/** Whether a set has more than one image: else prev, next and the counter hide, and the keys and swipe do nothing. */
export const navigable = (set: { length: number }): boolean => set.length >= 2;

const fold = (text: string | null | undefined) => (text ?? "").replace(/\s+/g, " ").trim();

type Linkish = Attrs & {
	closest(selector: string): { querySelector(selector: string): { textContent: string | null } | null } | null;
	querySelector(selector: string): Attrs | null;
};

/** The caption: the link's data-lightbox-caption, else its closest <figure>'s <figcaption> text, else "". Plain text. */
export function captionOf(link: Linkish): string {
	const own = fold(link.getAttribute("data-lightbox-caption"));
	if (own) return own;
	return fold(link.closest("figure")?.querySelector("figcaption")?.textContent);
}

/**
 * The large image's alt: the alt of the link's <img>, as it is (an explicit alt="" stays empty: the author marked
 * the image as decoration, and the caption still describes the dialog). Only with no <img>, or an <img> with no alt
 * attribute, the caption; `warn` is called when that is empty too.
 */
export function altOf(link: Linkish, caption: string, warn?: (message: string) => void): string {
	const img = link.querySelector("img");
	if (img?.hasAttribute("alt")) return img.getAttribute("alt") ?? "";
	if (!caption) warn?.(`Lightbox: the link to ${link.getAttribute("href")} has no image alt and no caption, so the large image has no text alternative.`);
	return caption;
}

/** The counter: `{n}` and `{total}` in the template filled in. */
export const counter = (template: string, n: number, total: number): string => template.replaceAll("{n}", String(n)).replaceAll("{total}", String(total));

/** A move through the set. */
export type Move = "next" | "prev" | "first" | "last";

/** The index after a move, wrapping at the ends (the last's next is the first). */
export function step(index: number, total: number, move: Move): number {
	if (total < 1) return 0;
	if (move === "first") return 0;
	if (move === "last") return total - 1;
	return (index + (move === "next" ? 1 : -1) + total) % total;
}

/** The move for a key: the arrows (swapped right to left), Home and End; else null. */
export function keyStep(key: string, dir: "ltr" | "rtl" = "ltr"): Move | null {
	if (key === "Home") return "first";
	if (key === "End") return "last";
	const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
	const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
	return key === forward ? "next" : key === back ? "prev" : null;
}

/** How far a swipe must go sideways, in CSS pixels. */
export const SWIPE = 48;

type Point = { x: number; y: number };

/**
 * The move for a swipe: more than SWIPE sideways, and more sideways than up and down. A swipe toward the start (left,
 * or right in a right-to-left page) shows the next image, as a page turns. Else null.
 */
export function swipe(start: Point, end: Point, dir: "ltr" | "rtl" = "ltr"): "next" | "prev" | null {
	const dx = end.x - start.x;
	const dy = end.y - start.y;
	if (Math.abs(dx) <= SWIPE || Math.abs(dx) <= Math.abs(dy)) return null;
	const towardStart = dir === "rtl" ? dx > 0 : dx < 0;
	return towardStart ? "next" : "prev";
}

/**
 * Whether a click on a lightbox link opens the lightbox: a plain click (the main button, no modifier key), on a link
 * that stays in this tab (no target, no download), not already prevented by another listener. Else the click is left
 * to the browser (or ClientRouter), which follows the link.
 */
export function opens(event: Press & { defaultPrevented?: boolean }, link: Attrs): boolean {
	return !event.defaultPrevented && plain(event) && !leaves(link);
}

/**
 * Whether a click came from a pointer (a mouse, a pen or a tap), not from the keyboard. A click is a PointerEvent in
 * current browsers, and one the keyboard made (Enter on a focused link) has an empty pointerType. An older browser's
 * click is a plain MouseEvent: there a keyboard click counts 0 in `detail` and a pointer click 1 or more.
 */
export function byPointer(event: { pointerType?: string; detail?: number }): boolean {
	if (typeof event.pointerType === "string") return event.pointerType !== "";
	return (event.detail ?? 0) > 0;
}

type Focusable = { focus(options?: { preventScroll?: boolean; focusVisible?: boolean }): void; blur(): void; ownerDocument?: { activeElement: unknown } | null };

/**
 * Moves focus to the open lightbox's close button, with its focus ring when it was opened from the keyboard and
 * without it after a click or a tap (the :focus-visible behavior a reader expects). The dialog's autofocus has
 * usually focused the button already, with the browser's guess at the ring. After a key every engine guesses right,
 * so the button is left as it is (a second focus() inside the click that opened it makes Firefox drop the ring).
 * After a pointer Safari draws the ring, so the button is blurred and focused again with `focusVisible: false`. A
 * browser that does not know the option ignores it and makes its own guess, as for any focus() call.
 */
export function focusClose(button: Focusable, pointer: boolean): void {
	const focused = button.ownerDocument?.activeElement === button;
	if (!pointer) {
		if (!focused) button.focus();
		return;
	}
	if (focused) button.blur();
	button.focus({ focusVisible: false });
}

/** The dialog's areas that a click can land on. */
export interface Parts<T> {
	dialog: T;
	frame?: T | null;
	stage?: T | null;
	bar?: T | null;
	controls?: T | null;
	image?: (T & { getBoundingClientRect(): Box }) | null;
}

/**
 * Whether a click closes the lightbox: on the dialog, its frame, the stage or the bar's empty space (the bar and the
 * controls row themselves, not a button or the caption in them), or on the image outside its drawn box. A click on
 * the picture, a button, the counter or the caption does not.
 */
export function closesOn<T>(target: T | null, x: number, y: number, parts: Parts<T>): boolean {
	if (!target) return false;
	if (parts.image && target === parts.image) return outside(parts.image.getBoundingClientRect(), x, y);
	return [parts.dialog, parts.frame, parts.stage, parts.bar, parts.controls].some((part) => part != null && part === target);
}

/** Where a press landed: its target and its point. */
export type Hit<T> = { target: T | null; x: number; y: number };

/**
 * Whether a press closes the lightbox: it started (pointerdown) and ended (the click) on areas that close it (see
 * closesOn). So a drag from the caption or the picture to the stage does not. With no pointerdown seen (a browser
 * that sends none), the click alone decides.
 */
export function pressCloses<T>(down: Hit<T> | null, click: Hit<T>, parts: Parts<T>): boolean {
	if (!closesOn(click.target, click.x, click.y, parts)) return false;
	return down === null || closesOn(down.target, down.x, down.y, parts);
}

/** Whether a box's content is taller than the box: it scrolls. */
export const scrolls = (box: { scrollHeight: number; clientHeight: number }): boolean => box.scrollHeight > box.clientHeight;

/**
 * Loads for the current pick only. Each load() is a new request number; its result is applied only while that number
 * is still the latest, so a slow load for an earlier pick never replaces a later one. `busy(true)` as a load starts,
 * `busy(false)` once the latest one ends, after an error too. cancel() drops every load in flight (the viewer closed).
 */
export function createLoader(busy: (on: boolean) => void) {
	let current = 0;
	return {
		/** The number of the latest request. */
		get current() {
			return current;
		},
		async load<T>(task: () => Promise<T>, apply: (value: T) => void): Promise<boolean> {
			const n = ++current;
			busy(true);
			try {
				const value = await task();
				if (n !== current) return false;
				apply(value);
				return true;
			} catch {
				return false;
			} finally {
				if (n === current) busy(false);
			}
		},
		cancel() {
			current++;
			busy(false);
		},
	};
}

/**
 * The large image's classes. The script makes the <img> in the stage on first open (an <img> needs a src). It fits
 * the stage at its own ratio and never grows past the file's width (lightbox-image, theme.css), so its box is the
 * picture. It fades and scales up from 98% as the dialog opens, and the next image fades in, with motion allowed only.
 */
export const IMAGE_CLASS =
	"lightbox-image select-none motion-ok:not-data-changing:transition-[opacity,scale] motion-ok:duration-200 motion-ok:ease-out motion-ok:data-changing:opacity-0 motion-ok:in-open:starting:opacity-0 motion-ok:in-open:starting:scale-98";

/** The dialog's parts the script fills, found by their marks. */
function partsOf(dialog: HTMLDialogElement) {
	const q = <T extends Element = HTMLElement>(name: string) => dialog.querySelector<T>(`[data-lightbox-${name}]`);
	return {
		dialog,
		frame: q("frame"),
		stage: q("stage"),
		bar: q("bar"),
		controls: q("controls"),
		image: q<HTMLImageElement>("image"),
		caption: q("caption"),
		counter: q("counter"),
		live: q("live"),
		close: q<HTMLButtonElement>("close"),
		prev: q<HTMLButtonElement>("prev"),
		next: q<HTMLButtonElement>("next"),
	};
}

/** Loads and decodes an image off screen; resolves with it once it can be drawn at once. */
function decoded(src: string, srcset: string | null, sizes: string | null): Promise<HTMLImageElement> {
	const img = new Image();
	if (srcset) {
		img.sizes = sizes || "100vw";
		img.srcset = srcset;
	}
	img.src = src;
	return img.decode().then(() => img);
}

/** Starts the script once per page. `dev` logs a warning for a second lightbox and an image with no text alternative. */
export function start({ dev = false }: { dev?: boolean } = {}) {
	const w = window as unknown as { __auiLightbox?: boolean };
	if (w.__auiLightbox) return;
	w.__auiLightbox = true;

	const warn = dev ? (message: string) => console.warn(message) : undefined;
	/** The open set, the index shown and whether focus goes back to its link on close. */
	let state: { set: HTMLAnchorElement[]; index: number; template: string; restore: boolean; opener: HTMLAnchorElement } | null = null;
	/** Where a swipe started on the stage. */
	let swipeStart: (Point & { id: number }) | null = null;
	/** Where the press that the next click ends started, in the open dialog. */
	let pressStart: Hit<Element> | null = null;
	/** Set by a swipe: the click that ends it is not a click. */
	let dropClick = false;

	const findDialog = () => {
		const all = document.querySelectorAll<HTMLDialogElement>(DIALOG);
		if (all.length > 1) warn?.("Lightbox: this page has more than one lightbox; the first one is used. Render one per page.");
		return all[0] ?? null;
	};
	const openDialog = () => {
		const dialog = document.querySelector<HTMLDialogElement>(`${DIALOG}[open]`);
		return dialog && state ? dialog : null;
	};
	const dirOf = (el: Element) => (getComputedStyle(el).direction === "rtl" ? "rtl" : "ltr");

	let loader: ReturnType<typeof createLoader> | null = null;

	/** The caption is a Tab stop only while it scrolls (shown and taller than its max height), so the keyboard can scroll it. */
	const fitCaption = (caption: HTMLElement | null) => {
		if (!caption) return;
		if (!caption.hidden && scrolls(caption)) caption.setAttribute("tabindex", "0");
		else caption.removeAttribute("tabindex");
	};

	/** Shows the image at `index` of the open set; `announce` writes the live region (on a change, not on open). */
	const show = (dialog: HTMLDialogElement, index: number, announce: boolean) => {
		if (!state) return;
		state.index = index;
		const link = state.set[index];
		const p = partsOf(dialog);
		const total = state.set.length;
		const many = navigable(state.set);
		const caption = captionOf(link as unknown as Linkish);
		const alt = altOf(link as unknown as Linkish, caption, warn);
		const thumb = link.querySelector("img");
		let img = p.image;
		if (!img && p.stage) {
			img = document.createElement("img");
			img.setAttribute("data-lightbox-image", "");
			img.className = IMAGE_CLASS;
			img.draggable = false;
			img.decoding = "async";
			p.stage.append(img);
		}

		if (img) {
			// The link's own thumbnail at once (the file it already loaded), at the large size; the full file once decoded.
			const width = Number(link.getAttribute("data-lightbox-width")) || 0;
			const height = Number(link.getAttribute("data-lightbox-height")) || 0;
			const ratio = width && height ? width / height : thumb?.naturalWidth && thumb.naturalHeight ? thumb.naturalWidth / thumb.naturalHeight : 0;
			if (ratio) img.style.setProperty("--lightbox-ratio", String(ratio));
			else img.style.removeProperty("--lightbox-ratio");
			if (width) img.style.setProperty("--lightbox-width", `${width}px`);
			else img.style.removeProperty("--lightbox-width");
			img.alt = alt;
			img.removeAttribute("srcset");
			img.removeAttribute("sizes");
			img.src = thumb?.currentSrc || thumb?.src || link.href;
			if (announce) {
				// A short fade in of the new image (motion-ok only): off at once, then on the next frame back.
				img.setAttribute("data-changing", "");
				requestAnimationFrame(() => requestAnimationFrame(() => img.removeAttribute("data-changing")));
			}
			const srcset = link.getAttribute("data-lightbox-srcset");
			const sizes = link.getAttribute("data-lightbox-sizes");
			loader?.load(
				() => decoded(link.href, srcset, sizes),
				(full) => {
					if (srcset) {
						img.sizes = sizes || "100vw";
						img.srcset = srcset;
					}
					img.src = link.href;
					if (!(width && height) && full.naturalWidth && full.naturalHeight) {
						img.style.setProperty("--lightbox-ratio", String(full.naturalWidth / full.naturalHeight));
						img.style.setProperty("--lightbox-width", `${full.naturalWidth}px`);
					}
				},
			);
		}

		if (p.caption) {
			p.caption.textContent = caption;
			p.caption.hidden = !caption;
			fitCaption(p.caption);
		}
		if (caption && p.caption?.id) dialog.setAttribute("aria-describedby", p.caption.id);
		else dialog.removeAttribute("aria-describedby");

		const count = counter(state.template, index + 1, total);
		if (p.counter) {
			p.counter.textContent = count;
			p.counter.hidden = !many;
		}
		if (p.prev) p.prev.hidden = !many;
		if (p.next) p.next.hidden = !many;
		if (p.live) p.live.textContent = announce ? [count, alt].filter(Boolean).join(", ") : "";
	};

	const go = (dialog: HTMLDialogElement, move: Move) => {
		if (!state || !navigable(state.set)) return;
		const index = step(state.index, state.set.length, move);
		if (index !== state.index) show(dialog, index, true);
	};

	const open = (link: HTMLAnchorElement, dialog: HTMLDialogElement, pointer: boolean) => {
		const set = collect(link, { querySelectorAll: (s: string) => document.querySelectorAll<HTMLAnchorElement>(s) });
		const index = set.indexOf(link);
		state = { set, index, template: dialog.getAttribute("data-lightbox-counter-text") || "{n} of {total}", restore: true, opener: link };
		const p = partsOf(dialog);
		loader = createLoader((on) => (on ? p.stage?.setAttribute("aria-busy", "true") : p.stage?.removeAttribute("aria-busy")));
		show(dialog, index, false);
		openModal(dialog, document.documentElement);
		// The caption has a size only now that the dialog is drawn.
		fitCaption(p.caption);
		if (p.close) focusClose(p.close, pointer);
	};

	/** Ends the open state; `restore` gives focus back to the link of the image shown last. */
	const finish = (restore: boolean) => {
		const last = state?.set[state.index];
		const opener = state?.opener;
		loader?.cancel();
		loader = null;
		state = null;
		swipeStart = null;
		pressStart = null;
		document.documentElement.removeAttribute(OVERFLOW);
		// The script focuses the link itself: Safari does not focus a clicked link, so the browser's own return lands on the page.
		if (!restore) return;
		const to = returnTo(last, opener, (link) => link.isConnected && shown(link));
		if (to) to.focus();
		// No link to go back to: the body, not a control of the closed dialog (where Chromium leaves it).
		else if (document.activeElement instanceof HTMLElement && document.activeElement.closest(DIALOG)) document.activeElement.blur();
	};

	document.addEventListener(
		"click",
		(event) => {
			const target = event.target instanceof Element ? event.target : null;
			if (!target) return;
			const inside = target.closest<HTMLDialogElement>(DIALOG);
			if (inside) {
				if (!inside.open || !state) return;
				const down = pressStart;
				pressStart = null;
				if (dropClick) {
					dropClick = false;
					return;
				}
				const p = partsOf(inside);
				const button = target.closest("button");
				if (button && button === p.close) inside.close();
				else if (button && button === p.prev) go(inside, "prev");
				else if (button && button === p.next) go(inside, "next");
				else if (pressCloses<Element>(down, { target, x: event.clientX, y: event.clientY }, p)) inside.close();
				return;
			}
			const link = target.closest<HTMLAnchorElement>(TRIGGER);
			if (!link || !opens(event, link)) return;
			const dialog = findDialog();
			if (!dialog || dialog.open) return;
			event.preventDefault();
			open(link, dialog, byPointer(event));
		},
		true,
	);

	document.addEventListener("keydown", (event) => {
		const dialog = openDialog();
		const target = event.target;
		// Focus is in the dialog, or on the body: a click on the picture, the caption or the counter (none of them
		// focusable) leaves it there in Firefox and Safari. The page behind is inert, so nothing else has it.
		const ours = target instanceof Node && (dialog?.contains(target) || target === document.body || target === document.documentElement);
		if (!dialog || !ours) return;
		if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
		const move = keyStep(event.key, dirOf(dialog));
		if (!move || !navigable(state!.set)) return;
		event.preventDefault();
		go(dialog, move);
	});

	document.addEventListener("pointerdown", (event) => {
		const dialog = openDialog();
		const target = event.target instanceof Element ? event.target : null;
		if (!dialog || !event.isPrimary || !target || !dialog.contains(target)) return;
		pressStart = { target, x: event.clientX, y: event.clientY };
		if (target.closest("[data-lightbox-stage]")) swipeStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
	});
	document.addEventListener("pointercancel", () => {
		swipeStart = null;
		pressStart = null;
	});
	document.addEventListener("pointerup", (event) => {
		const from = swipeStart;
		swipeStart = null;
		const dialog = openDialog();
		if (!from || !dialog || event.pointerId !== from.id) return;
		const move = swipe(from, { x: event.clientX, y: event.clientY }, dirOf(dialog));
		if (!move) return;
		// A set of one does not move, but the swipe is still a swipe: its click must not close the lightbox.
		go(dialog, move);
		// The click that ends this swipe (if the browser sends one) is dropped; any later click counts again.
		dropClick = true;
		setTimeout(() => (dropClick = false), 0);
	});

	document.addEventListener(
		"close",
		(event) => {
			if (!(event.target instanceof HTMLDialogElement) || !event.target.matches(DIALOG) || !state) return;
			finish(state.restore);
		},
		true,
	);

	// A turn or a resize can make the caption scroll, or stop.
	window.addEventListener("resize", () => {
		const dialog = openDialog();
		if (dialog) fitCaption(partsOf(dialog).caption);
	});

	document.addEventListener("astro:before-swap", () => {
		const dialog = openDialog();
		if (!dialog) return;
		// The page is leaving: no focus back to its link. The close event may never reach the document (the dialog
		// goes with the old page), so the state ends here.
		finish(false);
		dialog.close();
	});
}
