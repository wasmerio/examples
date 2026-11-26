/**
 * The URL state of a listing search: the text, the mode (buy or rent), each field's filter, the sort and the page.
 * Pure: the Filters script (lib/filters.ts) is the one owner of the URL and uses these to read and write it; the Pro
 * search reads the same state. Imports only ./listing.ts, so it runs under node --test and in the browser.
 *
 * The URL: the page is in the path, as the server's pages are (/search/, /search/page/2/), so a static site serves
 * every page; the query holds the rest: q=<text>, mode=<mode>, <key>=<min>-<max> (either side may be empty: beds=3-),
 * <key>=<a>,<b> (a choice, in option order), <key>=1 (a toggle), sort=<id>. Defaults are left out, the keys keep one
 * order, and a bad value is dropped, so one state has one URL.
 */
import { fieldLabel, formatPrice, formatValue, periodFor, type ListingField } from "./listing.ts";

/** One field's filter: a range [min, max] (either may be null), the picked option values of a choice, or a toggle. */
export type FilterValue = [number | null, number | null] | string[] | true;

export interface FilterState {
	q: string;
	/** "" when the page has no modes. */
	mode: string;
	/** Field filters by key: a range as [min, max], a choice as the picked values (one at most without `multiple`), a toggle as true. */
	filters: Record<string, FilterValue>;
	sort: string;
	/** From 1. In the path, not the query. */
	page: number;
}

export interface FilterConfig {
	fields: ListingField[];
	modes?: string[];
	sorts: string[];
	defaults: { mode?: string; sort: string };
	/** The path of each page from 1, as the server pages are built: pageHref(1) to pageHref(pages). Unset: one page. */
	pageHrefs?: string[];
}

/** An active filter, for the chips that remove it: one per range, toggle, or picked choice value. */
export interface FilterChip {
	key: string;
	/** The choice value this chip removes. */
	value?: string;
	/** What the chip shows ("3+ beds"). */
	text: string;
	/** The chip's accessible name ("Remove: 3+ beds"). */
	label: string;
}

/** Fired on the Filters form once per change: detail { state, kind, source: "user" | "popstate" | "load" }. */
export const FILTERS_CHANGE = "filters:change";
/**
 * Fired on the Filters form by a pager link (with script): detail { page }. The filters set the page and push the URL.
 * With { page, replace: true } (a search that showed its last page for a page past the end) they set the page and
 * replace the URL, and fire no filters:change.
 */
export const FILTERS_PAGE = "filters:page";

const RANGE = /^(\d+(?:\.\d+)?)?-(\d+(?:\.\d+)?)?$/;
const trimSlash = (path: string) => path.replace(/\/+$/, "") || "/";

const defaultMode = (config: FilterConfig) => (config.modes?.length ? (config.defaults.mode && config.modes.includes(config.defaults.mode) ? config.defaults.mode : config.modes[0]) : "");

/** The state with nothing set: the default mode and sort, page 1. */
export function defaultState(config: FilterConfig): FilterState {
	return { q: "", mode: defaultMode(config), filters: {}, sort: config.defaults.sort, page: 1 };
}

/** One field's filter from the URL's values for its key, or undefined when there is none or it is bad. */
function readFilter(field: ListingField, values: string[]): FilterValue | undefined {
	if (field.kind === "toggle") return values.includes("1") ? true : undefined;
	if (field.kind === "choice") {
		const known = (field.options ?? []).map((o) => o.value);
		const picked = values.flatMap((v) => v.split(",")).filter((v) => known.includes(v));
		if (!picked.length) return undefined;
		if (!field.multiple) return [picked[0]];
		return known.filter((v) => picked.includes(v));
	}
	if (field.kind === "range") {
		const m = RANGE.exec(values[0] ?? "");
		if (!m) return undefined;
		const min = m[1] === undefined ? null : Number(m[1]);
		const max = field.bound === "min" || m[2] === undefined ? null : Number(m[2]);
		if (min === null && max === null) return undefined;
		if (min !== null && max !== null && min > max) return undefined;
		return [min, max];
	}
	return undefined;
}

/** The state from a URL. Bad values are ignored and defaults used; the page comes from the path (pageHrefs). */
export function parseState(url: { pathname: string; search: string }, config: FilterConfig): FilterState {
	const params = new URLSearchParams(url.search);
	const state = defaultState(config);
	state.q = (params.get("q") ?? "").trim();
	const mode = params.get("mode");
	if (mode && config.modes?.includes(mode)) state.mode = mode;
	const sort = params.get("sort");
	if (sort && config.sorts.includes(sort)) state.sort = sort;
	for (const field of config.fields) {
		const values = params.getAll(field.key);
		if (!values.length) continue;
		const value = readFilter(field, values);
		if (value !== undefined) state.filters[field.key] = value;
	}
	const index = (config.pageHrefs ?? []).findIndex((href) => trimSlash(href) === trimSlash(url.pathname));
	state.page = index > 0 ? index + 1 : 1;
	return state;
}

const encode = (value: string) => encodeURIComponent(value);
/** A number the URL can hold as written: finite, not negative, and without an exponent ("1e+23" would not parse back). */
const plainNumber = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n) && n >= 0 && !/e/i.test(String(n));
/** A range end in the URL; a number that is not plain is left out. */
const numberText = (n: number | null) => (plainNumber(n) ? String(n) : "");

/**
 * The URL for a state: the page's path (pageHrefs; else `path`, the current one), then the query, defaults left out,
 * in a stable key order (q, mode, the fields in list order, sort). "/search/page/2/?mode=rent&beds=3-".
 */
export function writeState(state: FilterState, config: FilterConfig, path = ""): string {
	const hrefs = config.pageHrefs;
	const base = hrefs?.length ? hrefs[Math.min(Math.max(state.page, 1), hrefs.length) - 1] : path;
	const parts: string[] = [];
	if (state.q.trim()) parts.push(`q=${encode(state.q.trim())}`);
	if (state.mode && state.mode !== defaultMode(config)) parts.push(`mode=${encode(state.mode)}`);
	for (const field of config.fields) {
		const value = state.filters[field.key];
		if (value === undefined) continue;
		if (value === true) {
			if (field.kind === "toggle") parts.push(`${field.key}=1`);
		} else if (field.kind === "choice" && Array.isArray(value)) {
			const known = (field.options ?? []).map((o) => o.value).filter((v) => (value as string[]).includes(v));
			const list = field.multiple ? known : known.slice(0, 1);
			if (list.length) parts.push(`${field.key}=${list.map(encode).join(",")}`);
		} else if (field.kind === "range" && Array.isArray(value)) {
			const [min, max] = (value as [number | null, number | null]).map(numberText);
			if (min || max) parts.push(`${field.key}=${min}-${max}`);
		}
	}
	if (state.sort && state.sort !== config.defaults.sort) parts.push(`sort=${encode(state.sort)}`);
	const query = parts.join("&");
	return query ? `${base}?${query}` : base || "?";
}

/** A state's filters as one string, keys sorted, so two equal states compare equal. */
const filtersKey = (filters: FilterState["filters"]) => JSON.stringify(Object.keys(filters).sort().map((k) => [k, filters[k]]));

/**
 * How a change goes into the history: a mode change or a page change alone is a new entry ("push"); an edit of the
 * text, a filter or the sort is "replace", even when it resets the page as a side effect; no change is "none".
 */
export function changeKind(prev: FilterState, next: FilterState): "push" | "replace" | "none" {
	if (prev.mode !== next.mode) return "push";
	if (prev.q !== next.q || prev.sort !== next.sort || filtersKey(prev.filters) !== filtersKey(next.filters)) return "replace";
	if (prev.page !== next.page) return "push";
	return "none";
}

/** The state in another mode: resetOnMode fields (the price) and the sort cleared, page 1. An unknown mode, or the mode already set, changes nothing. */
export function setMode(state: FilterState, mode: string, config: FilterConfig): FilterState {
	if (!config.modes?.includes(mode) || mode === state.mode) return state;
	const filters = { ...state.filters };
	for (const field of config.fields) if (field.resetOnMode) delete filters[field.key];
	return { ...state, mode, filters, sort: config.defaults.sort, page: 1 };
}

/** A range: two ends, each a number or null (undefined counts as null). */
const isRange = (value: unknown): value is [unknown, unknown] =>
	Array.isArray(value) && value.length === 2 && value.every((v) => v === null || v === undefined || typeof v === "number");

/**
 * The state with one field's filter set, page 1. An empty value (null, false, [], [null, null]) removes it. A range end
 * that is not a plain number (NaN, Infinity, negative, or one only exponent form can write) becomes null; a range with
 * both ends null, or min > max, removes the filter.
 */
export function setFilter(state: FilterState, key: string, value: unknown): FilterState {
	const filters = { ...state.filters };
	if (isRange(value)) {
		const [min, max] = value.map((v) => (plainNumber(v) ? v : null));
		value = min !== null && max !== null && min > max ? null : [min, max];
	}
	const empty = value === null || value === undefined || value === false || (Array.isArray(value) && value.every((v) => v === null || v === undefined));
	if (empty) delete filters[key];
	else filters[key] = value as FilterValue;
	return { ...state, filters, page: 1 };
}

/** An amount in a chip: a sale short ("$750K"), a rent whole ("$2,500"), other fields by their format. */
function amountText(field: ListingField, n: number, mode: string): string {
	if (field.format === "price") return formatPrice({ amount: n, period: periodFor(field, mode) }, { short: true });
	return formatValue(field, n, mode) ?? String(n);
}

/**
 * The active filters as chips, in field order: one per range or toggle, one per picked choice value. Range texts:
 * "$750K to $1.2M", "From $750K", "Up to $4,000/mo", "3+ beds" (a minimum-only field), "Up to 2,000 sq ft" (the unit,
 * else the label in lowercase). `removeLabel`: the chip's name, with {text} filled in (default "Remove: {text}").
 */
export function activeChips(state: FilterState, config: FilterConfig, texts: { removeLabel?: string } = {}): FilterChip[] {
	const removeLabel = texts.removeLabel ?? "Remove: {text}";
	const chip = (key: string, text: string, value?: string): FilterChip => ({ key, ...(value === undefined ? {} : { value }), text, label: removeLabel.replace("{text}", text) });
	const chips: FilterChip[] = [];
	for (const field of config.fields) {
		const value = state.filters[field.key];
		if (value === undefined) continue;
		if (value === true) {
			chips.push(chip(field.key, fieldLabel(field, state.mode)));
		} else if (field.kind === "choice") {
			for (const v of value as string[]) {
				const option = field.options?.find((o) => o.value === v);
				if (option) chips.push(chip(field.key, option.label, v));
			}
		} else if (field.kind === "range") {
			const [min, max] = value as [number | null, number | null];
			const a = min === null ? null : amountText(field, min, state.mode);
			const b = max === null ? null : amountText(field, max, state.mode);
			let text: string;
			if (field.format === "price") {
				const mo = periodFor(field, state.mode) === "month" ? "/mo" : "";
				text = a !== null && b !== null ? `${a} to ${b}${mo}` : a !== null ? `From ${a}${mo}` : `Up to ${b}${mo}`;
			} else {
				const unit = field.unit ?? fieldLabel(field, state.mode).toLowerCase();
				text = a !== null && b !== null ? `${a} to ${b} ${unit}` : a !== null ? `${a}+ ${unit}` : `Up to ${b} ${unit}`;
			}
			chips.push(chip(field.key, text));
		}
	}
	return chips;
}

/** The state without one chip's filter: one choice value, or the whole filter. Page 1. */
export function removeChip(state: FilterState, chip: { key: string; value?: string }): FilterState {
	const value = state.filters[chip.key];
	if (chip.value !== undefined && Array.isArray(value)) {
		return setFilter(state, chip.key, (value as string[]).filter((v) => v !== chip.value));
	}
	return setFilter(state, chip.key, null);
}
