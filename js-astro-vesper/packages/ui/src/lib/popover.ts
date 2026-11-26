/**
 * The Popover family's script (decision 0002: a plain script, no island). The browser does the rest: popovertarget
 * opens and closes the panel, Escape and an outside click close it, CSS places it. This covers only what those do not:
 *
 * - The trigger's words follow what is picked in the panel (summary "choices": "Any type", "House", "2 types"; summary
 *   "range": "$900K to $1.5M", "$900K+", "Up to $1.5M"), and in a range a Max at or below the Min, or a Min at or above
 *   the Max, is disabled, unless it is the one picked (a page may open on a Min equal to the Max).
 * - aria-expanded follows the panel; focus moves into the panel when it opens, and the panel scrolls to show it; a panel
 *   with nothing to focus takes focus itself. When the panel closes with focus on nothing or still in the panel, focus
 *   goes back to the trigger, unless the press that closed it landed on another control (a click does not focus a button
 *   in WebKit, so the browser has nothing to go back to).
 * - Enter on a checkbox or a radio in the panel picks it, and does not submit the form around it.
 * - Up and Down on a checkbox in the panel move focus to the previous or next enabled checkbox and check nothing, since
 *   Safari's default Tab skips checkboxes. Every checkbox stays in the Tab order. Radios keep their native arrows.
 * - WebKit places a panel off screen when its trigger is under position: fixed and the page has scrolled: there the
 *   script places it by the trigger's box while it is open.
 *
 * Without JavaScript the panel still opens and closes, and its controls still submit: only the trigger's words stay.
 *
 * Another script that sets the panel's controls itself (a form that reads the URL) calls syncPopover(root) after,
 * since setting a control fires no change event. A script that changes what the popover is about (Price becomes Rent)
 * calls setPopoverWords(root, { label, anyText }).
 *
 * It imports nothing and touches the page only inside functions, so its logic runs under Node's test runner.
 */

export const ROOT = "[data-popover]";
export const PANEL = "[data-popover-panel]";
export const TRIGGER = "[data-popover-trigger]";
export const TEXT = "[data-popover-text]";
export const OPTION_TEXT = "[data-popover-option-text]";
export const END = "[data-popover-end]";
/** The hidden first words of the trigger's name. */
export const NAME = "[data-popover-name]";
/** On a range option the script disabled, so it never clears a disabled the author set. */
const LIMITED = "data-popover-limited";

/** The words of a summary, with {n}, {min} and {max} filled in. */
export interface PopoverTexts {
	/** Nothing is picked ("Any type"). */
	anyText: string;
	/** Two or more choices ("{n} types"). */
	countText: string;
	/** Both ends of a range ("{min} to {max}"). */
	rangeText: string;
	/** A minimum only ("{min}+"). */
	fromText: string;
	/** A maximum only ("Up to {max}"). */
	upToText: string;
}

export const POPOVER_TEXTS: PopoverTexts = { anyText: "Any", countText: "{n} selected", rangeText: "{min} to {max}", fromText: "{min}+", upToText: "Up to {max}" };

/** A template with its {name} parts filled in. */
const fill = (template: string, values: Record<string, string>) => template.replace(/\{(\w+)\}/g, (all, name: string) => values[name] ?? all);

/** What several choices read as: nothing picked, the one label picked, or the count. */
export function choicesText(labels: string[], texts: Pick<PopoverTexts, "anyText" | "countText"> = POPOVER_TEXTS): string {
	if (labels.length === 0) return texts.anyText;
	if (labels.length === 1) return labels[0];
	return fill(texts.countText, { n: String(labels.length) });
}

/** What a range reads as, from the labels of its two ends ("" is no pick). */
export function rangeText(min: string, max: string, texts: Pick<PopoverTexts, "anyText" | "rangeText" | "fromText" | "upToText"> = POPOVER_TEXTS): string {
	if (min && max) return fill(texts.rangeText, { min, max });
	if (min) return fill(texts.fromText, { min });
	if (max) return fill(texts.upToText, { max });
	return texts.anyText;
}

/**
 * Whether a range option cannot be picked, given the other end's value: a Min at or above the Max, a Max at or below the
 * Min. The empty option ("No min", "No max") always can, and so can any option while the other end is empty.
 */
export function rangeBlocked(end: "min" | "max", value: string, other: string): boolean {
	if (value === "" || other === "") return false;
	const a = Number(value);
	const b = Number(other);
	if (Number.isNaN(a) || Number.isNaN(b)) return false;
	return end === "min" ? a >= b : a <= b;
}

/** Whether Enter on this control is the picking kind: a checkbox or a radio. */
export const entersPick = (type: string) => type === "checkbox" || type === "radio";

/** Which way an arrow key moves through a panel's checkboxes, or 0 for any other key. */
export const arrowStep = (key: string): -1 | 0 | 1 => (key === "ArrowDown" ? 1 : key === "ArrowUp" ? -1 : 0);

/** The item one step from another, wrapping at the ends. */
export const stepFrom = <T>(list: T[], from: T, by: -1 | 1): T | undefined => list[(list.indexOf(from) + by + list.length) % list.length];

/** The label of a picked control: its option's words, else its value. */
const optionLabel = (input: HTMLInputElement) => input.closest("label")?.querySelector(OPTION_TEXT)?.textContent?.trim() ?? input.value;

/** The end groups of a range panel, with their radios. */
function ends(root: Element) {
	const inputs = (end: string) => [...root.querySelectorAll<HTMLInputElement>(`${END}[data-popover-end="${end}"] input`)];
	return { min: inputs("min"), max: inputs("max") };
}

/** Disables or frees one option of a range. A picked option stays enabled, so its value still submits. */
function limitOption(input: HTMLInputElement, blocked: boolean) {
	if (blocked && !input.checked) {
		if (input.disabled) return;
		input.disabled = true;
		input.setAttribute(LIMITED, "");
	} else if (input.hasAttribute(LIMITED)) {
		input.disabled = false;
		input.removeAttribute(LIMITED);
	}
}

/** Disables the options of a range that the other end rules out. */
function limitRange(root: Element) {
	const { min, max } = ends(root);
	const picked = (list: HTMLInputElement[]) => list.find((i) => i.checked)?.value ?? "";
	const low = picked(min);
	const high = picked(max);
	for (const input of min) limitOption(input, rangeBlocked("min", input.value, high));
	for (const input of max) limitOption(input, rangeBlocked("max", input.value, low));
}

/** The trigger's words for the panel's controls as they are now, or null for a popover with no summary. */
export function summaryOf(root: HTMLElement): string | null {
	const data = root.dataset;
	const texts: PopoverTexts = {
		anyText: data.popoverAny ?? POPOVER_TEXTS.anyText,
		countText: data.popoverCount ?? POPOVER_TEXTS.countText,
		rangeText: data.popoverRange ?? POPOVER_TEXTS.rangeText,
		fromText: data.popoverFrom ?? POPOVER_TEXTS.fromText,
		upToText: data.popoverUpTo ?? POPOVER_TEXTS.upToText,
	};
	if (data.popoverSummary === "choices") {
		const picked = [...root.querySelectorAll<HTMLInputElement>(`${PANEL} input:checked`)].filter((i) => i.value !== "");
		return choicesText(picked.map(optionLabel), texts);
	}
	if (data.popoverSummary === "range") {
		const { min, max } = ends(root);
		const label = (list: HTMLInputElement[]) => {
			const input = list.find((i) => i.checked);
			return input && input.value !== "" ? optionLabel(input) : "";
		};
		return rangeText(label(min), label(max), texts);
	}
	return null;
}

/**
 * Brings one popover in step with its controls: the range limits and the trigger's words. The script calls it on every
 * change in a panel, after a form reset and on load. Call it yourself after your own script sets the controls.
 */
export function syncPopover(root: HTMLElement) {
	if (root.dataset.popoverSummary === "range") limitRange(root);
	const text = summaryOf(root);
	const target = root.querySelector(TEXT);
	if (text !== null && target && target.textContent !== text) target.textContent = text;
}

/**
 * Changes what a popover is about, when a mode switch makes Price into Rent: the trigger's hidden name, the panel's name
 * and the words for nothing picked, then brings the trigger in step. With a trigger slot, the trigger's words are yours.
 */
export function setPopoverWords(root: HTMLElement, { label, anyText }: { label?: string; anyText?: string }) {
	if (label !== undefined) {
		const name = root.querySelector(NAME);
		if (name) name.textContent = `${label}: `;
		root.querySelector(PANEL)?.setAttribute("aria-label", label);
	}
	if (anyText !== undefined) root.dataset.popoverAny = anyText;
	syncPopover(root);
}

/** The name of a trigger's anchor: a CSS name from any id, with the characters a name cannot hold written as their code. */
export const anchorName = (id: string) => `--${id.replace(/[^\w-]/gu, (c) => `_${c.codePointAt(0)!.toString(16)}`)}`;

/** Whether a box sits beside another: above or under it, within reach, and sharing some of its width. */
export function nextTo(trigger: Rect, panel: Rect, reach = 24): boolean {
	const near = (gap: number) => gap >= -1 && gap <= reach;
	return panel.left < trigger.right && panel.right > trigger.left && (near(panel.top - trigger.bottom) || near(trigger.top - panel.bottom));
}

type Rect = Pick<DOMRect, "top" | "right" | "bottom" | "left">;

/** Where focus goes when a panel opens: the picked control, else the first one that takes focus. */
export function entryOf(panel: Element): HTMLElement | null {
	return (
		panel.querySelector<HTMLElement>("input:checked:not(:disabled)") ??
		panel.querySelector<HTMLElement>("input:not(:disabled):not([type='hidden']), select:not(:disabled), textarea:not(:disabled), button:not(:disabled), a[href], [tabindex]:not([tabindex='-1'])")
	);
}

/** What a press may land on and take focus by itself. A click focuses no button in WebKit, but it is still the user's next control. */
const TAKES_FOCUS = "a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary, label, [tabindex], [contenteditable]";

/** The inline styles placeBeside sets, which the panel's closing clears. */
const PLACED = ["position-area", "position-try-fallbacks", "inset", "margin", "inline-size", "min-inline-size", "max-block-size"];

/**
 * The fallback for an engine that has anchor positioning but put the panel away from its trigger (WebKit, a trigger under
 * position: fixed on a scrolled page): the same place, from the trigger's box. An engine with no anchor positioning keeps
 * its centered panel.
 */
function placeBeside(panel: HTMLElement, trigger: HTMLElement) {
	if (!CSS.supports("anchor-name: --a")) return;
	const t = trigger.getBoundingClientRect();
	const p = panel.getBoundingClientRect();
	if (nextTo(t, p)) return;
	const edge = 8;
	const gap = parseFloat(getComputedStyle(panel).marginBlockStart) || 0;
	const under = window.innerHeight - t.bottom - gap - edge;
	const over = t.top - gap - edge;
	const down = Math.max(p.height, panel.scrollHeight) <= under || under >= over;
	const left = Math.max(edge, Math.min(t.left, document.documentElement.clientWidth - p.width - edge));
	const values = [
		"none",
		"none",
		down ? `${t.bottom + gap}px auto auto ${left}px` : `auto auto ${window.innerHeight - t.top + gap}px ${left}px`,
		"0",
		`${p.width}px`,
		"0",
		`${Math.max(down ? under : over, 0)}px`,
	];
	PLACED.forEach((name, i) => panel.style.setProperty(name, values[i]));
}

/** Scrolls only the panel, so the row of its focused control shows. Focus moved with preventScroll, so the page stays put. */
function reveal(panel: HTMLElement, entry: Element) {
	const row = (entry.closest("label") ?? entry).getBoundingClientRect();
	const top = panel.getBoundingClientRect().top + panel.clientTop;
	const bottom = top + panel.clientHeight;
	if (row.bottom > bottom) panel.scrollTop += row.bottom - bottom;
	else if (row.top < top) panel.scrollTop -= top - row.top;
}

/**
 * Keeps the focused row in view until the panel has settled. While a panel's opening transition runs, Chromium and WebKit
 * try it at its full height on each frame and cut its scroll to fit that, so one scroll at the start does not last.
 */
function revealWhileSettling(panel: HTMLElement, entry: HTMLElement, rest = 2) {
	reveal(panel, entry);
	requestAnimationFrame(() => {
		if (document.activeElement !== entry) return;
		const left = panel.getAnimations().length > 0 ? 2 : rest - 1;
		if (left >= 0) revealWhileSettling(panel, entry, left);
	});
}

/** Binds the family's listeners once, on the document, so they outlive a ClientRouter swap. */
export function start() {
	const w = window as unknown as { __auiPopover?: boolean };
	if (w.__auiPopover) return;
	w.__auiPopover = true;

	const syncAll = () => {
		for (const root of document.querySelectorAll<HTMLElement>(`${ROOT}[data-popover-summary]`)) syncPopover(root);
	};
	/** Where the press that may be closing a panel landed; null after a key, or once a panel has toggled. */
	let pressed: Element | null = null;
	document.addEventListener("keydown", () => { pressed = null; }, true);
	document.addEventListener("pointerdown", (event) => { pressed = event.target as Element; }, true);

	// The toggle event does not bubble, so it is caught on the way down.
	document.addEventListener(
		"toggle",
		(event) => {
			const panel = event.target as HTMLElement;
			if (!panel.matches?.(PANEL)) return;
			const trigger = panel.closest(ROOT)?.querySelector<HTMLElement>(TRIGGER);
			const press = pressed;
			pressed = null;
			if ((event as ToggleEvent).newState === "open") {
				trigger?.setAttribute("aria-expanded", "true");
				if (trigger) placeBeside(panel, trigger);
				if (panel.contains(document.activeElement)) return;
				const entry = entryOf(panel);
				entry?.focus({ preventScroll: true });
				if (entry && panel.contains(document.activeElement)) revealWhileSettling(panel, entry);
				else {
					// Nothing in it takes focus: the panel does, so a screen reader reads the dialog and Escape has a place to go back from.
					panel.tabIndex = -1;
					panel.focus({ preventScroll: true });
				}
				return;
			}
			trigger?.setAttribute("aria-expanded", "false");
			for (const name of PLACED) panel.style.removeProperty(name);
			// After Escape the browser goes back to what had focus before. In WebKit a click does not focus a button, so that
			// is nothing, and focus may still read as the hidden control. A press on page text leaves it on nothing too. Either
			// way: the trigger, unless the press was on another control, which keeps the user's place.
			const active = document.activeElement;
			const lost = !active || active === document.body || panel.contains(active);
			const elsewhere = press?.closest?.(TAKES_FOCUS) && !trigger?.contains(press) && !panel.contains(press);
			if (lost && !elsewhere) trigger?.focus({ preventScroll: true });
		},
		true,
	);
	document.addEventListener("change", (event) => {
		const root = (event.target as Element).closest?.(`${PANEL}`)?.closest<HTMLElement>(ROOT);
		if (root) syncPopover(root);
	});
	document.addEventListener("keydown", (event) => {
		if (event.isComposing) return;
		const input = event.target as HTMLInputElement;
		if (input.tagName !== "INPUT") return;
		const panel = input.closest<HTMLElement>(PANEL);
		if (!panel) return;
		const by = arrowStep(event.key);
		if (by !== 0 && input.type === "checkbox") {
			// With a modifier the key is the browser's or the system's.
			if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
			event.preventDefault();
			// A row hidden by the page takes no focus, and would stop the walk.
			const boxes = [...panel.querySelectorAll<HTMLInputElement>("input[type='checkbox']:not(:disabled)")].filter((box) => box.getClientRects().length > 0);
			const next = stepFrom(boxes, input, by);
			if (!next) return;
			next.focus({ preventScroll: true });
			reveal(panel, next);
			return;
		}
		if (event.key !== "Enter" || !entersPick(input.type)) return;
		event.preventDefault();
		// Held down: one pick, not a checkbox flipping on and off.
		if (event.repeat) return;
		if (!(input.type === "radio" && input.checked)) input.click();
	});
	// A reset sets the controls after its event, so the words follow on the next task.
	document.addEventListener("reset", () => setTimeout(syncAll));
	// The browser may bring back picked controls on Back, or on a reload.
	window.addEventListener("pageshow", syncAll);
	document.addEventListener("astro:page-load", syncAll);
	syncAll();
}
