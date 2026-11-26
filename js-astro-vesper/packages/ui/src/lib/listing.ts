/**
 * The listing fields list and its formats: what a listing card's fact strip, the filters, the URL state codec and the
 * search read. The parts do not know the listing type; the theme passes a fields list (beds, baths, sq ft, home type,
 * or any of its own). Imports nothing, so it runs under node --test and in the browser.
 *
 * Formats are US English: "$", en-US grouping. One Intl.NumberFormat per kind, made once.
 */

/** How a field filters. Unset: shown on the card, not filtered. */
export type ListingFieldKind = "range" | "choice" | "toggle";
/** How a value is written. */
export type ListingFieldFormat = "integer" | "decimal" | "area" | "year" | "price" | "text";

export interface ListingFieldOption {
	/** The value in each listing's values and in the URL. No commas. */
	value: string;
	/** What the filter and the card show ("Condo"). */
	label: string;
}

/** A price: a sale ("once") or a rent ("month"). */
export interface ListingPrice {
	amount: number;
	/** "once" (a sale) or "month" (a rent). */
	period: "once" | "month";
}

export interface ListingField {
	/** The key in each listing's values, and the URL parameter ("beds"). Lowercase letters, digits and "-". */
	key: string;
	/** The label on the card and the filter ("Beds"). */
	label: string;
	/** The label per mode, where it differs ({ buy: "Price", rent: "Rent" }). Every mode must have one. Default: label. */
	labels?: Record<string, string>;
	/** A short label for tight places, such as the pin card ("bd"). Default: label. */
	shortLabel?: string;
	kind?: ListingFieldKind;
	format?: ListingFieldFormat;
	/** A unit after the value ("sq ft"). */
	unit?: string;
	/** range: the steps for Min and Max. Per mode when the steps differ ("buy": $, "rent": $/mo). */
	steps?: number[] | Record<string, number[]>;
	/** price format: whether an amount is a sale or a month's rent, per mode when it differs ({ buy: "once", rent: "month" }). Default "once". */
	period?: ListingPrice["period"] | Record<string, ListingPrice["period"]>;
	/** range: "min" shows one "at least" select ("3+"), "both" shows Min and Max (default). */
	bound?: "min" | "both";
	/** choice: the options. */
	options?: ListingFieldOption[];
	/** choice: several options at once, drawn as option chips (native checkboxes). Default false: one native select. */
	multiple?: boolean;
	/** A dropdown's words for nothing picked ("Any type"), per mode when they differ ({ buy: "Any price", rent: "Any rent" }). Default: the Filters' anyText. */
	anyText?: string | Record<string, string>;
	/** A dropdown's words for two or more choices; {n} is the count ("{n} types"). Default: the Filters' countText. */
	countText?: string;
	/** Shown in the card's fact strip (default true). */
	card?: boolean;
	/** Cleared when the mode changes, as the price. Default false. */
	resetOnMode?: boolean;
}

/** One listing's values by field key. A missing key hides that cell. */
export type ListingValues = Record<string, number | string | boolean | undefined>;

/** One cell of a fact strip. */
export interface FactCell {
	key: string;
	label: string;
	text: string;
}

/** Keys the URL state uses for itself (lib/filter-state.ts), so a field may not take them. */
export const RESERVED_KEYS = ["q", "mode", "sort", "page", "size"];
const KEY = /^[a-z0-9-]+$/;

const formats = new Map<string, Intl.NumberFormat>();
/** One formatter per kind, made on first use. */
function formatter(kind: string): Intl.NumberFormat {
	let f = formats.get(kind);
	if (!f) {
		const options: Record<string, Intl.NumberFormatOptions> = {
			price: { style: "currency", currency: "USD", maximumFractionDigits: 0 },
			short: { style: "currency", currency: "USD", notation: "compact", maximumSignificantDigits: 3 },
			integer: { maximumFractionDigits: 0 },
			decimal: { maximumFractionDigits: 2 },
			year: { maximumFractionDigits: 0, useGrouping: false },
		};
		f = new Intl.NumberFormat("en-US", options[kind]);
		formats.set(kind, f);
	}
	return f;
}

/**
 * A price as text: "$1,125,000", or "$3,150/mo" for a month's rent. `short`: "$1.13M", "$865K" (compact, three
 * digits at most, half up) for a sale; a rent stays whole and drops "/mo" ("$3,150": a map pin; the card adds "/mo" in
 * its own quieter span). An amount that is not a finite number prints nothing ("").
 */
export function formatPrice(price: ListingPrice, options: { short?: boolean } = {}): string {
	if (!Number.isFinite(price.amount)) return "";
	const month = price.period === "month";
	if (options.short) return formatter(month || Math.abs(price.amount) < 1000 ? "price" : "short").format(price.amount);
	return `${formatter("price").format(price.amount)}${month ? "/mo" : ""}`;
}

/** A number from a value, or null when there is none (undefined, null, "", NaN, a word). */
function numberOf(value: unknown): number | null {
	if (typeof value === "number") return Number.isFinite(value) ? value : null;
	if (typeof value === "string" && value.trim() !== "") {
		const n = Number(value);
		return Number.isFinite(n) ? n : null;
	}
	return null;
}

/**
 * A value as text, by the field's format: integer "4", decimal "2.5", area "1,840" (the unit goes in the label or
 * after), year "1926", price "$325", text as given. A choice field shows its option's label. With no format, a number
 * is a decimal, a word is text, true and false are "Yes" and "No". A missing or bad value is null, so its cell hides.
 */
export function formatValue(field: ListingField, value: unknown, mode?: string): string | null {
	if (value === undefined || value === null || value === "") return null;
	if (typeof value === "boolean") return value ? "Yes" : "No";
	if (field.kind === "choice" && field.options) {
		const option = field.options.find((o) => o.value === String(value));
		if (option) return option.label;
	}
	const format = field.format ?? (typeof value === "number" ? "decimal" : "text");
	if (format === "text") {
		if (typeof value === "number" && !Number.isFinite(value)) return null;
		return String(value);
	}
	const n = numberOf(value);
	if (n === null) return null;
	switch (format) {
		case "price":
			return formatPrice({ amount: n, period: periodFor(field, mode) });
		case "integer":
		case "area":
			return formatter("integer").format(n);
		case "year":
			return formatter("year").format(n);
		default:
			return formatter("decimal").format(n);
	}
}

/** The label for a mode: labels[mode], else label. The filters, the chips and the card read it. */
export function fieldLabel(field: ListingField, mode?: string): string {
	return (mode !== undefined && field.labels?.[mode]) || field.label;
}

/** A dropdown's words for nothing picked, for a mode: the field's own, else the fallback. */
export function fieldAnyText(field: ListingField, mode: string | undefined, fallback: string): string {
	const any = field.anyText;
	if (typeof any === "string") return any;
	return (mode !== undefined && any?.[mode]) || fallback;
}

/** A range field's steps for a mode: the mode's list when the steps are per mode, else the one list. */
export function stepsFor(field: ListingField, mode?: string): number[] {
	const steps = field.steps;
	if (!steps) return [];
	if (Array.isArray(steps)) return steps;
	return (mode !== undefined && steps[mode]) || [];
}

/** A price field's period for a mode: the mode's entry when it is per mode, else the one value, else "once". */
export function periodFor(field: ListingField, mode?: string): ListingPrice["period"] {
	const period = field.period;
	if (!period) return "once";
	if (typeof period === "string") return period;
	return (mode !== undefined && period[mode]) || "once";
}

/** The fact strip's cells: card fields (card !== false) with a value, in list order. Never "undefined". */
export function factCells(fields: ListingField[], values: ListingValues, mode?: string): FactCell[] {
	const cells: FactCell[] = [];
	for (const field of fields) {
		if (field.card === false) continue;
		const text = formatValue(field, values[field.key], mode);
		if (text !== null) cells.push({ key: field.key, label: fieldLabel(field, mode), text });
	}
	return cells;
}

/**
 * Checks a fields list and returns it; throws naming the field on: a duplicate key, a key that is not URL-safe, a
 * reserved key (q, mode, sort, page), a range without steps, a choice without options, an option value with a comma
 * or used twice, or per-mode labels, steps or period that miss one of `modes`.
 */
export function checkFields<T extends ListingField[]>(fields: T, modes: string[] = []): T {
	const seen = new Set<string>();
	for (const field of fields) {
		const key = field.key;
		if (!KEY.test(key)) throw new Error(`listing field "${key}": a key is lowercase letters, digits and "-" only`);
		if (RESERVED_KEYS.includes(key)) throw new Error(`listing field "${key}": "${key}" is reserved for the URL state and the search's request (${RESERVED_KEYS.join(", ")})`);
		if (seen.has(key)) throw new Error(`listing field "${key}": the key is used twice`);
		seen.add(key);
		if (field.kind === "range") {
			const steps = field.steps;
			const empty = !steps || (Array.isArray(steps) ? steps.length === 0 : Object.values(steps).every((s) => !s.length));
			if (empty) throw new Error(`listing field "${key}": a range needs steps`);
		}
		if (field.kind === "choice") {
			if (!field.options?.length) throw new Error(`listing field "${key}": a choice needs options`);
			const values = new Set<string>();
			for (const option of field.options) {
				if (option.value.includes(",")) throw new Error(`listing field "${key}": the option value "${option.value}" has a comma`);
				if (values.has(option.value)) throw new Error(`listing field "${key}": the option value "${option.value}" is used twice`);
				values.add(option.value);
			}
		}
		for (const [name, perMode] of [
			["labels", field.labels],
			["steps", field.steps && !Array.isArray(field.steps) ? field.steps : undefined],
			["period", field.period && typeof field.period === "object" ? field.period : undefined],
		] as const) {
			if (!perMode) continue;
			for (const mode of modes) if (!(mode in perMode)) throw new Error(`listing field "${key}": ${name} has no entry for the "${mode}" mode`);
		}
	}
	return fields;
}

const SCHEME = /^[a-z][a-z0-9+.-]*:/i;

/**
 * A listing's link, safe to print or set: a relative URL, or an http: or https: one; anything else is "#". It reads the
 * URL as a browser does: spaces and control characters at the ends and tabs and newlines inside are dropped first, so
 * " JaVaScRiPt:" and "java\tscript:" are the schemes they look like to the browser.
 */
export function safeHref(href: unknown): string {
	if (typeof href !== "string") return "#";
	const url = href.replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g, "").replace(/[\t\n\r]/g, "");
	if (!url) return "#";
	const scheme = SCHEME.exec(url)?.[0].toLowerCase();
	return scheme === undefined || scheme === "http:" || scheme === "https:" ? url : "#";
}
