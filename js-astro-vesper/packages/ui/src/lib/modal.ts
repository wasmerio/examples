/**
 * What the kit's modal dialogs share (MobileMenu and Lightbox): the open step and the click helpers. Each part marks its
 * <dialog> with data-modal, so one rule in theme.css stops the page behind it scrolling while it is open
 * (html:has(dialog[data-modal][open])), however it closes.
 *
 * It imports nothing, so its logic runs under Node's test runner; the parts' scripts import it as ./modal.ts.
 */

/** A box on screen, as getBoundingClientRect() gives it. */
export type Box = { left: number; right: number; top: number; bottom: number };

/** Whether a point lies outside a box: a click on a dialog there landed on its backdrop. */
export function outside(box: Box, x: number, y: number): boolean {
	return x < box.left || x > box.right || y < box.top || y > box.bottom;
}

/** What a click carries besides where it landed: the button pressed and the modifier keys held. */
export type Press = { button?: number; metaKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean };

/** Whether a click follows a link in this tab: the main button, no modifier key (those open a tab or a window). */
export function plain(press: Press): boolean {
	return (press.button ?? 0) === 0 && !press.metaKey && !press.ctrlKey && !press.shiftKey && !press.altKey;
}

/** Whether a link opens somewhere else than this tab: a target other than _self (in any case, as browsers read it), or a download. */
export function leaves(link: { getAttribute(name: string): string | null }): boolean {
	const target = link.getAttribute("target");
	return (target !== null && target !== "" && target.toLowerCase() !== "_self") || link.getAttribute("download") !== null;
}

/** The marker on <html> for a page that has a scrollbar while a modal is open: the scroll lock keeps its gutter. */
export const OVERFLOW = "data-modal-overflow";

type Root = { scrollHeight: number; clientHeight: number; toggleAttribute(name: string, force: boolean): unknown };
type Dialog = {
	open: boolean;
	showModal(): void;
	addEventListener(type: "close", listener: () => void): void;
};

/** The dialogs openModal() has opened, each with the <html> it marks: one close listener each, however often it opens. */
const marked = new WeakMap<Dialog, Root>();

/**
 * Opens a modal dialog: first marks `root` (<html>) with data-modal-overflow when the page has a scrollbar, so the
 * scroll lock keeps the scrollbar's gutter and the page does not shift sideways (theme.css), then showModal(). The
 * mark goes on each close event of the dialog, however it closes, unless the dialog is open again by then (a late
 * event). A dialog already open is left alone.
 */
export function openModal(dialog: Dialog, root: Root): void {
	if (dialog.open) return;
	root.toggleAttribute(OVERFLOW, root.scrollHeight > root.clientHeight);
	dialog.showModal();
	if (!marked.has(dialog)) dialog.addEventListener("close", () => dialog.open || marked.get(dialog)!.toggleAttribute(OVERFLOW, false));
	marked.set(dialog, root);
}
