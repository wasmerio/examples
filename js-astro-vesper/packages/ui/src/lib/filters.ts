/**
 * The Filters family's script and the pure steps the parts share (decision 0002: a plain script, no island).
 *
 * The filters are the one owner of the URL (lib/filter-state.ts has the codec). start() binds every
 * form[data-filters] once: on load it reads the URL into the controls and fires filters:change (source "load"); on
 * each edit it builds the next state from the controls, writes the URL (pushState for a mode or a page, replaceState
 * for the rest), redraws the active-filter chips and "Clear", and fires filters:change once (source "user"); on
 * Back and Forward it reads the URL back (source "popstate"); on filters:page it sets the page and pushes (with
 * replace: true, it sets the page and replaces the URL, with no event: a search that showed another page). A text box
 * fires after 300 ms of no typing, or at once on Enter. The form never submits.
 *
 * Under Astro's ClientRouter: the router keeps its own history state (index, scroll) on each entry, returns on a
 * popstate whose state is null (the address changes, the page stays), and swaps the page on any other. So a replace
 * carries the entry's state. A push writes null, so Back and Forward between pushed entries are the filters' own, read
 * from the URL with no swap. Before the router leaves a pushed entry by a link, it gets the state back, so Back to it
 * swaps the page in. Any entry with a state is the router's: the page swaps and the new form binds. The entry the
 * pushes started from keeps its state, so a Back onto it is a swap too. Before a swap the old form's timer and
 * observer stop, and it writes no more.
 *
 * A form may draw its fields as dropdowns (the dropdown prop): a range as radio lists in a Popover, several choices as
 * checkboxes in one; one choice and a minimum-only range stay selects. The radios and checkboxes are the same controls to this script, with the same names and values. It
 * rebuilds a list of radios from its template[data-filter-option] when the mode or a value that is not a step asks for
 * another list, and brings each Popover's words and limits in step after it writes the controls.
 *
 * Imports only ./filter-state.ts, ./listing.ts and ./popover.ts (which touches the page only inside functions), and takes
 * the document and window as arguments, so it runs under node --test with stand-ins.
 */
import {
	FILTERS_CHANGE,
	FILTERS_PAGE,
	activeChips,
	changeKind,
	defaultState,
	parseState,
	removeChip,
	setFilter,
	setMode,
	writeState,
	type FilterConfig,
	type FilterState,
} from "./filter-state.ts";
import { fieldAnyText, fieldLabel, formatPrice, formatValue, periodFor, stepsFor, type ListingField } from "./listing.ts";
import { END, OPTION_TEXT, PANEL, ROOT, TRIGGER, entryOf, setPopoverWords, syncPopover } from "./popover.ts";

/** The texts the filters show that are not the fields' own, with {text} filled in for removeLabel. */
export interface FiltersTexts {
	/** A select's empty first option: a choice field's, and a minimum-only range's ("Any"). */
	anyText: string;
	/** A range's empty Min option ("No min"). */
	minText: string;
	/** A range's empty Max option ("No max"). */
	maxText: string;
	/** An active-filter chip's name ("Remove: {text}"). */
	removeLabel: string;
}

export const FILTERS_TEXTS: FiltersTexts = { anyText: "Any", minText: "No min", maxText: "No max", removeLabel: "Remove: {text}" };

/** What the Filters form writes for its script, as JSON in script[data-filters-config]: the codec's config and the texts. */
export interface FiltersData extends FilterConfig {
	texts: FiltersTexts;
}

/** One option of a select. */
export interface SelectOption {
	value: string;
	label: string;
}

/** The text event delay: the URL is written after this long with no typing. */
export const TEXT_DELAY = 300;

/** The JSON for script[data-filters-config], safe inside a <script> (every "<" escaped). */
export function configJson(data: FiltersData): string {
	return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** A step as a select's label: a sale price short ("$750K"), a rent whole ("$2,500"), other formats as the card writes them. */
function stepText(field: ListingField, n: number, mode: string): string {
	if (field.format === "price") return formatPrice({ amount: n, period: periodFor(field, mode) }, { short: true });
	return formatValue(field, n, mode) ?? String(n);
}

/**
 * A range field's options for a mode: Min and Max, each with its empty first option ("No min", "No max") and one
 * option per step; a minimum-only field (bound "min") has Min only, as "at least" options ("Any", or the field's own
 * anyText, "1+", "2+").
 * `extra`: values to add to the steps (a shared URL may hold a value that is not a step), kept in number order.
 */
export function rangeOptions(field: ListingField, mode: string, texts: FiltersTexts = FILTERS_TEXTS, extra: (number | null)[] = []): { min: SelectOption[]; max?: SelectOption[] } {
	const steps = [...new Set([...stepsFor(field, mode), ...extra.filter((n): n is number => typeof n === "number")])].sort((a, b) => a - b);
	if (field.bound === "min") return { min: [{ value: "", label: fieldAnyText(field, mode, texts.anyText) }, ...steps.map((n) => ({ value: String(n), label: `${stepText(field, n, mode)}+` }))] };
	const list = steps.map((n) => ({ value: String(n), label: stepText(field, n, mode) }));
	return { min: [{ value: "", label: texts.minText }, ...list], max: [{ value: "", label: texts.maxText }, ...list] };
}

/** The visible count: "1 listing", "15 listings", "2,000 listings" (en-US). */
export function countText(count: number, text: { one: string; other: string }): string {
	return `${new Intl.NumberFormat("en-US").format(count)} ${count === 1 ? text.one : text.other}`;
}

// ---------------------------------------------------------------------------
// The DOM: only what the script needs, so the stand-ins in the test stay small.
// ---------------------------------------------------------------------------

/** A form control as the script reads it. */
interface Control {
	name: string;
	type: string;
	value: string;
	checked?: boolean;
	form?: unknown;
	getAttribute(name: string): string | null;
	focus?(): void;
}

/** Field filters by key, from the controls: ranges from their Min and Max selects or the picked radio of each end, choices from a select or checkboxes, toggles. */
export function readControls(controls: Iterable<Control>, prev: FilterState, config: FilterConfig): FilterState {
	let state: FilterState = { ...prev, filters: {} };
	const ranges: Record<string, [number | null, number | null]> = {};
	const picks: Record<string, string[]> = {};
	const num = (v: string) => (v === "" ? null : Number(v));
	for (const c of controls) {
		const key = c.getAttribute("data-filter-key");
		if (c.name === "q" && c.getAttribute("data-filter-text") !== null) state.q = c.value.trim();
		else if (c.name === "sort" && c.getAttribute("data-filter-sort") !== null) state.sort = config.sorts.includes(c.value) ? c.value : config.defaults.sort;
		else if (c.name === "mode" && c.type === "radio" && c.checked && config.modes?.includes(c.value)) state.mode = c.value;
		else if (key) {
			const end = c.getAttribute("data-filter-end");
			if (end) {
				ranges[key] ??= [null, null];
				if (c.type !== "radio" || c.checked) ranges[key][end === "max" ? 1 : 0] = num(c.value);
			} else if (c.type === "checkbox") {
				if (c.checked) (picks[key] ??= []).push(c.value);
			} else if (c.value !== "") (picks[key] ??= []).push(c.value);
		}
	}
	for (const field of config.fields) {
		if (field.kind === "range" && ranges[field.key]) state = setFilter(state, field.key, ranges[field.key]);
		else if (field.kind === "toggle") state = setFilter(state, field.key, picks[field.key]?.length ? true : null);
		else if (field.kind === "choice") {
			const known = (field.options ?? []).map((o) => o.value).filter((v) => picks[field.key]?.includes(v));
			state = setFilter(state, field.key, field.multiple ? known : known.slice(0, 1));
		}
	}
	return { ...state, page: prev.page };
}

interface El {
	getAttribute(name: string): string | null;
	setAttribute(name: string, value: string): void;
	toggleAttribute(name: string, force?: boolean): boolean;
	querySelector(selector: string): any;
	querySelectorAll(selector: string): Iterable<any>;
	addEventListener(type: string, fn: (e: any) => void): void;
	dispatchEvent(e: unknown): boolean;
	textContent: string | null;
}
interface Doc {
	readyState?: string;
	activeElement?: unknown;
	createElement(tag: string): any;
	querySelectorAll(selector: string): Iterable<any>;
	addEventListener(type: string, fn: (e: any) => void): void;
}
interface Win {
	location: { pathname: string; search: string; reload?(): void };
	history: { state?: unknown; pushState(data: unknown, unused: string, url: string): void; replaceState(data: unknown, unused: string, url?: string): void };
	addEventListener(type: string, fn: (e: any) => void): void;
	setTimeout(fn: () => void, ms: number): unknown;
	clearTimeout(id: unknown): void;
	CustomEvent: new (type: string, init: { detail: unknown; bubbles?: boolean }) => unknown;
	ResizeObserver?: new (fn: () => void) => { observe(el: unknown): void; disconnect(): void };
}

/** One bound form: its config, its state now, and the pending text timer. */
interface Bound {
	form: El & { elements: Iterable<Control> };
	data: FiltersData;
	state: FilterState;
	timer?: unknown;
	/** The router's state on the entry the filters last left it on, for a pushed entry to get back when a link leaves it. */
	entry?: object;
	/** The sideways row's observer, disconnected in a page swap. */
	observer?: { disconnect(): void };
	/** The page was swapped out: the form writes nothing more. */
	dead?: boolean;
}

const bound = new WeakMap<object, Bound>();
const BOUND = "data-filters-bound";

/** The state a Filters form holds now, for a listener that binds after the load event (undefined before start). */
export function filtersState(form: object): FilterState | undefined {
	return bound.get(form)?.state;
}

/** Puts a select's options in place (only when they differ), then its value. */
function fillSelect(doc: Doc, select: any, options: SelectOption[], value: string) {
	const now = [...select.options].map((o: any) => `${o.value}\u0000${o.textContent}`).join("\u0001");
	if (now !== options.map((o) => `${o.value}\u0000${o.label}`).join("\u0001")) {
		select.replaceChildren(
			...options.map((o) => {
				const option = doc.createElement("option");
				option.value = o.value;
				option.textContent = o.label;
				return option;
			}),
		);
	}
	select.value = value;
}

/** A row's words. */
const rowText = (input: any): string => input.closest("label")?.querySelector(OPTION_TEXT)?.textContent ?? "";

/**
 * Puts one end's radios in place, only when the list differs, since a new row would take focus from the radio an arrow
 * just moved to. Rows come from the group's template, as the chips do. Then picks the value. If the list changed under
 * focus, focus stays on the same value; with that value gone, on the group's picked radio, else the panel's first control,
 * and never on the body.
 */
function fillRadios(doc: Doc, group: any, options: SelectOption[], value: string) {
	const template = group.querySelector("template[data-filter-option]");
	const now = [...group.querySelectorAll("input")];
	const differs = now.map((i: any) => `${i.value}\u0000${rowText(i)}`).join("\u0001") !== options.map((o) => `${o.value}\u0000${o.label}`).join("\u0001");
	const focused = template && differs ? now.find((i: any) => i === doc.activeElement) : undefined;
	if (template && differs) {
		const old = new Set(now.map((i: any) => i.closest("label")));
		const rows = options.map((o) => {
			const row = template.content.firstElementChild.cloneNode(true);
			row.querySelector("input").value = o.value;
			row.querySelector(OPTION_TEXT).textContent = o.label;
			return row;
		});
		group.replaceChildren(...[...group.children].filter((child: any) => !old.has(child)), ...rows);
	}
	const inputs = [...group.querySelectorAll("input")] as any[];
	for (const input of inputs) input.checked = input.value === value;
	if (focused) (inputs.find((i) => i.value === focused.value) ?? inputs.find((i) => i.checked) ?? entryOf(group.closest(PANEL)))?.focus?.({ preventScroll: true });
}

/** Writes a state into the controls: the mode, the text, each field (a range's options for the mode), the sort, the labels, each Popover's words and limits. */
function writeControls(doc: Doc, b: Bound) {
	const { state, data } = b;
	const fields = new Map(data.fields.map((f) => [f.key, f]));
	// A copy: rebuilding a list of radios changes the form's live list of controls.
	const groups = new Set<unknown>();
	for (const c of [...b.form.elements] as any[]) {
		const key = c.getAttribute("data-filter-key");
		if (c.name === "mode" && c.type === "radio") c.checked = c.value === state.mode;
		else if (c.name === "q" && c.getAttribute("data-filter-text") !== null) {
			if (c.value.trim() !== state.q || (!state.q && c.value)) c.value = state.q;
		} else if (c.name === "sort" && c.getAttribute("data-filter-sort") !== null) c.value = state.sort;
		else if (key && fields.has(key)) {
			const field = fields.get(key)!;
			const value = state.filters[key];
			const end = c.getAttribute("data-filter-end");
			if (end) {
				const range = Array.isArray(value) && field.kind === "range" ? (value as [number | null, number | null]) : [null, null];
				const options = rangeOptions(field, state.mode, data.texts, range);
				const n = range[end === "max" ? 1 : 0];
				const list = (end === "max" ? options.max : options.min) ?? [];
				const picked = n === null ? "" : String(n);
				if (c.type !== "radio") fillSelect(doc, c, list, picked);
				else {
					// Once per end. A row this write already took out belongs to no group.
					const group = c.closest(END);
					if (group && !groups.has(group)) {
						groups.add(group);
						fillRadios(doc, group, list, picked);
					}
				}
			} else if (c.type === "checkbox") c.checked = field.kind === "toggle" ? value === true : Array.isArray(value) && (value as string[]).includes(c.value);
			else {
				// A one-choice select's empty first option says the field's words for the mode.
				const first = c.options?.[0];
				const any = fieldAnyText(field, state.mode, data.texts.anyText);
				if (first?.value === "" && first.textContent !== any) first.textContent = any;
				c.value = Array.isArray(value) ? ((value as string[])[0] ?? "") : "";
			}
		}
	}
	// Each field's name for the mode: its legend or label marked data-filter-label, else a one-select field's Field label (a one-choice field, or a minimum-only range with dropdown).
	// A dropdown's panel takes the name too, and its words for nothing picked.
	for (const wrap of b.form.querySelectorAll("[data-filter-field]")) {
		const field = fields.get(wrap.getAttribute("data-filter-field"));
		if (!field) continue;
		const label = fieldLabel(field, state.mode);
		const name = wrap.querySelector("[data-filter-label]") ?? ((field.kind === "choice" && !field.multiple) || field.bound === "min" ? wrap.querySelector("label") : null);
		if (name && name.textContent !== label) name.textContent = label;
		const popover = wrap.querySelector(ROOT);
		if (popover) setPopoverWords(popover, { label, anyText: fieldAnyText(field, state.mode, data.texts.anyText) });
	}
	// Setting a control fires no change event, so each Popover hears it here: on load, Back, a chip, Clear and a mode switch.
	for (const root of b.form.querySelectorAll(ROOT)) syncPopover(root);
}

/** Redraws the active-filter chips from the template, and shows "Clear" when anything is set. */
function drawChips(doc: Doc, b: Bound) {
	const list = b.form.querySelector("[data-filter-chips]");
	const template = b.form.querySelector("template[data-filter-chip]");
	const chips = activeChips(b.state, b.data, { removeLabel: b.data.texts.removeLabel });
	if (list && template) {
		const items = chips.map((chip) => {
			const item = template.content.firstElementChild.cloneNode(true);
			const button = item.querySelector("[data-chip]");
			button.setAttribute("data-chip-key", chip.key);
			if (chip.value !== undefined) button.setAttribute("data-chip-value", chip.value);
			button.setAttribute("aria-label", chip.label);
			item.querySelector("[data-chip-text]").textContent = chip.text;
			return item;
		});
		list.replaceChildren(...items);
		list.toggleAttribute("hidden", chips.length === 0);
	}
	const clear = b.form.querySelector("[data-filters-clear]");
	clear?.toggleAttribute("hidden", chips.length === 0 && b.state.q === "");
}

/** A range's two selects are named <key>-min and <key>-max, so a native GET of the form (before the script runs) gives those. */
const rangeEnds = (config: FilterConfig) => config.fields.filter((f) => f.kind === "range").flatMap((f) => [`${f.key}-min`, `${f.key}-max`]);

/**
 * A query with a range's <key>-min and <key>-max (a native submit of the form) read into the codec's <key>=<min>-<max>,
 * the long-hand keys gone; a range already in the codec's form wins. Other keys are left alone.
 */
export function shortHand(search: string, config: FilterConfig): string {
	const params = new URLSearchParams(search);
	for (const field of config.fields) {
		if (field.kind !== "range") continue;
		const min = (params.get(`${field.key}-min`) ?? "").trim();
		const max = (params.get(`${field.key}-max`) ?? "").trim();
		params.delete(`${field.key}-min`);
		params.delete(`${field.key}-max`);
		if (!params.has(field.key) && (min || max)) params.set(field.key, `${min}-${max}`);
	}
	const query = params.toString();
	return query ? `?${query}` : "";
}

/** The state a location holds (parseState), a native submit's long-hand range keys read too. */
function stateAt(location: { pathname: string; search: string }, config: FilterConfig): FilterState {
	return parseState({ pathname: location.pathname, search: shortHand(location.search, config) }, config);
}

/** A query key as text; a key that cannot be decoded (%zz, %E0) is kept as written, so it is never one of the filters'. */
function keyText(part: string): string {
	const raw = part.split("=")[0].replace(/\+/g, " ");
	try {
		return decodeURIComponent(raw);
	} catch {
		return raw;
	}
}

/**
 * The URL for a state (writeState), keeping the query's other keys, which are not the filters' (a campaign's utm_source,
 * a page's own setting), after the filters' own, as they were. The filters' keys are q, mode, sort, page, the field
 * keys, and a range's <key>-min and <key>-max (a native submit's names).
 */
export function urlFor(state: FilterState, config: FilterConfig, location: { pathname: string; search: string }): string {
	const url = writeState(state, config, location.pathname);
	const own = new Set(["q", "mode", "sort", "page", ...config.fields.map((f) => f.key), ...rangeEnds(config)]);
	const foreign = location.search
		.replace(/^\?/, "")
		.split("&")
		.filter((part) => part && !own.has(keyText(part)));
	if (!foreign.length) return url;
	return `${url}${url.includes("?") ? "&" : "?"}${foreign.join("&")}`;
}

/** Fires filters:change on the form. */
function fire(win: Win, b: Bound, kind: string, source: "user" | "popstate" | "load", url: string) {
	b.form.dispatchEvent(new win.CustomEvent(FILTERS_CHANGE, { detail: { state: b.state, kind, source, url } }));
}

/** Astro's ClientRouter is on this page (the router's own test). */
function routed(doc: Doc): boolean {
	return [...doc.querySelectorAll('[name="astro-view-transitions-enabled"]')].length > 0;
}

/** Writes the URL. A replace carries the entry's state; a push too, but under the router it writes null (see the top of this file). */
function writeUrl(doc: Doc, win: Win, b: Bound, kind: "push" | "replace", url: string) {
	const state = win.history.state ?? null;
	if (state) b.entry = state;
	if (kind === "replace") win.history.replaceState(state, "", url);
	else win.history.pushState(routed(doc) ? null : state, "", url);
}

/** Drops a pending text event. */
function dropTimer(win: Win, b: Bound) {
	if (b.timer === undefined) return;
	win.clearTimeout(b.timer);
	b.timer = undefined;
}

/** Takes a next state: writes the URL by its change kind, redraws, and fires once. A change of nothing does nothing. */
function commit(doc: Doc, win: Win, b: Bound, next: FilterState) {
	if (b.dead) return;
	dropTimer(win, b);
	const kind = changeKind(b.state, next);
	if (kind === "none") return;
	b.state = kind === "replace" ? { ...next, page: 1 } : next;
	const url = urlFor(b.state, b.data, win.location);
	writeUrl(doc, win, b, kind === "push" ? "push" : "replace", url);
	writeControls(doc, b);
	drawChips(doc, b);
	fire(win, b, kind, "user", url);
}

/** The next state from the controls after an edit; a mode change goes through setMode (it clears the price and the sort). */
function fromControls(b: Bound): FilterState {
	const read = readControls(b.form.elements, b.state, b.data);
	// The other controls are kept (text typed just before the click); setMode clears only the mode's own fields and the sort.
	if (read.mode !== b.state.mode) return setMode({ ...read, mode: b.state.mode }, read.mode, b.data);
	return read;
}

/**
 * Where focus goes when the control that had it hides (the last chip, "Clear"): the first field control, else the text
 * box, else the mode that is on, else the form itself, focusable by script only. A control in a closed panel takes no
 * focus, so a dropdown's first control gives way to its trigger.
 */
function firstFilter(b: Bound): { focus?(): void } {
	const controls = [...b.form.elements];
	const control =
		controls.find((c) => c.getAttribute("data-filter-key")) ??
		controls.find((c) => c.getAttribute("data-filter-text") !== null) ??
		controls.find((c) => c.name === "mode" && c.type === "radio" && c.checked);
	if (control) return (control as any).closest?.(PANEL)?.closest(ROOT)?.querySelector(TRIGGER) ?? control;
	b.form.setAttribute("tabindex", "-1");
	return b.form as unknown as { focus?(): void };
}

/** Marks a sideways row with data-more while some of it is past its end, so its end fade shows only then. Returns its observer. */
function watchRow(win: Win, row: any) {
	const update = () => {
		const rest = row.scrollWidth - row.clientWidth - Math.abs(row.scrollLeft);
		row.toggleAttribute("data-more", rest > 1);
	};
	row.addEventListener("scroll", update, { passive: true });
	const observer = win.ResizeObserver ? new win.ResizeObserver(update) : undefined;
	observer?.observe(row);
	update();
	return observer;
}

/** Binds one form, once: reads the URL into its controls and fires the load event when the page's scripts have run. */
function bind(doc: Doc, win: Win, form: any) {
	if (bound.has(form) || form.hasAttribute?.(BOUND)) return;
	const script = form.querySelector("script[data-filters-config]");
	if (!script) return;
	const data = JSON.parse(script.textContent) as FiltersData;
	const b: Bound = { form, data, state: defaultState(data), entry: (win.history.state as object | null) ?? undefined };
	bound.set(form, b);
	form.setAttribute(BOUND, "");
	b.state = stateAt(win.location, data);
	writeControls(doc, b);
	drawChips(doc, b);
	// A bad or long-hand URL becomes the one URL of its state, in place (the query's other keys kept).
	const url = urlFor(b.state, data, win.location);
	if (url !== `${win.location.pathname}${win.location.search}`) writeUrl(doc, win, b, "replace", url);

	form.addEventListener("submit", (e: any) => {
		e.preventDefault();
		commit(doc, win, b, fromControls(b));
	});
	form.addEventListener(FILTERS_PAGE, (e: any) => {
		const page = Number(e.detail?.page);
		if (b.dead || !Number.isInteger(page) || page < 1) return;
		// replace: a search showed another page than asked (past the end); the address follows, in place, with no event.
		if (e.detail?.replace === true) {
			if (page === b.state.page) return;
			b.state = { ...b.state, page };
			writeUrl(doc, win, b, "replace", urlFor(b.state, b.data, win.location));
			return;
		}
		commit(doc, win, b, { ...b.state, page });
	});
	form.querySelector("[data-filters-clear]")?.addEventListener("click", () => {
		commit(doc, win, b, { ...b.state, q: "", filters: {} });
		firstFilter(b).focus?.();
	});
	form.querySelector("[data-filter-chips]")?.addEventListener("click", (e: any) => {
		const button = e.target?.closest?.("[data-chip]");
		if (!button) return;
		const buttons = [...form.querySelectorAll("[data-chip]")];
		const index = buttons.indexOf(button);
		const value = button.getAttribute("data-chip-value");
		commit(doc, win, b, removeChip(b.state, { key: button.getAttribute("data-chip-key"), ...(value === null ? {} : { value }) }));
		const after = [...form.querySelectorAll("[data-chip]")];
		const next = after[index] ?? firstFilter(b);
		(next as any)?.focus?.();
	});
	const row = form.querySelector("[data-filters-row]");
	if (row) b.observer = watchRow(win, row);

	// The load event waits for the page's other scripts (a search's listener), which run before DOMContentLoaded while
	// the page is parsed; the window's load is the fallback when that has passed. After the page has loaded (a page
	// swap), it fires on the next task.
	let loaded = false;
	const load = () => {
		if (loaded || b.dead) return;
		loaded = true;
		fire(win, b, "none", "load", url);
	};
	if (doc.readyState === "complete") win.setTimeout(load, 0);
	else {
		doc.addEventListener("DOMContentLoaded", load);
		win.addEventListener("load", load);
	}
}

/**
 * Binds every Filters form on the page (once each), and the page's own listeners once: control edits (a control may
 * sit outside the form with a form attribute, as ResultsHead's sort), Back and Forward, and Astro's page loads.
 */
export function start(doc: Doc = document as unknown as Doc, win: Win = window as unknown as Win) {
	for (const form of doc.querySelectorAll("form[data-filters]")) bind(doc, win, form);
	const w = win as Win & { __auiFilters?: boolean };
	if (w.__auiFilters) return;
	w.__auiFilters = true;
	const owner = (e: any): Bound | undefined => (e.target?.form ? bound.get(e.target.form) : undefined);
	doc.addEventListener("change", (e: any) => {
		const b = owner(e);
		if (b) commit(doc, win, b, fromControls(b));
	});
	doc.addEventListener("input", (e: any) => {
		const b = owner(e);
		if (!b || e.target.getAttribute("data-filter-text") === null) return;
		if (b.timer !== undefined) win.clearTimeout(b.timer);
		b.timer = win.setTimeout(() => {
			b.timer = undefined;
			commit(doc, win, b, fromControls(b));
		}, TEXT_DELAY);
	});
	let path = win.location.pathname;
	win.addEventListener("popstate", (e: any) => {
		const forms = [...doc.querySelectorAll("form[data-filters]")].flatMap((form) => bound.get(form) ?? []);
		if (routed(doc)) {
			// An entry with a state: the router swaps the page, and the old form must not write on that entry meanwhile.
			if (e.state != null) {
				for (const b of forms) dropTimer(win, b);
				return;
			}
			// A jump from another page onto a pushed entry (the Back button's list): the router ignores it, so the page on screen is the wrong one, with filters or without.
			if (win.location.pathname !== path) {
				win.location.reload?.();
				return;
			}
		}
		for (const b of forms) {
			const prev = b.state;
			b.state = stateAt(win.location, b.data);
			writeControls(doc, b);
			drawChips(doc, b);
			// A Back that changes nothing the filters hold (a hash-only entry) fires nothing.
			const kind = changeKind(prev, b.state);
			if (kind !== "none") fire(win, b, kind, "popstate", `${win.location.pathname}${win.location.search}`);
		}
	});
	// A link is leaving: a pushed entry gets the router's state back, so Back to it swaps the page in, and the router can write its scroll.
	doc.addEventListener("astro:before-preparation", (e: any) => {
		if (e.navigationType === "traverse" || (win.history.state ?? null) !== null) return;
		const b = [...doc.querySelectorAll("form[data-filters]")].map((form) => bound.get(form)).find((one) => one?.entry);
		if (b) win.history.replaceState({ ...b.entry }, "");
	});
	// The form goes with the page, unless transition:persist keeps it: the next page holds the same persisted key.
	doc.addEventListener("astro:before-swap", (e: any) => {
		for (const form of doc.querySelectorAll("form[data-filters]")) {
			const b = bound.get(form);
			if (!b) continue;
			dropTimer(win, b);
			const key = form.closest?.("[data-astro-transition-persist]")?.getAttribute("data-astro-transition-persist");
			if (key && e.newDocument?.querySelector(`[data-astro-transition-persist=${JSON.stringify(key)}]`)) continue;
			b.dead = true;
			b.observer?.disconnect();
		}
	});
	doc.addEventListener("astro:page-load", () => {
		path = win.location.pathname;
		for (const form of doc.querySelectorAll("form[data-filters]")) bind(doc, win, form);
	});
}

/**
 * Writes a ResultsHead's visible count ("15 homes", on every search, load too) and, with `announce`, its status line
 * for screen readers (only after a reader's own change or Back and Forward, so a page load says nothing). For the
 * search controller.
 */
export function setResultsCount(head: El, count: number, { announce = false }: { announce?: boolean } = {}) {
	const line = head.querySelector("[data-results-count]");
	const text = { one: line?.getAttribute("data-count-one") ?? "listing", other: line?.getAttribute("data-count-other") ?? "listings" };
	const number = line?.querySelector("[data-results-number]");
	const noun = line?.querySelector("[data-results-noun]");
	if (number) number.textContent = new Intl.NumberFormat("en-US").format(count);
	if (noun) noun.textContent = count === 1 ? text.one : text.other;
	if (line) line.toggleAttribute("hidden", false);
	if (announce) {
		const status = head.querySelector("[data-results-status]");
		if (status) status.textContent = countText(count, text);
	}
}
