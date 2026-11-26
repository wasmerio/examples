/**
 * The Search family's pure helpers for the lazy apps (lib/search-app.ts and lib/search-page-app.ts): the config block
 * the shell writes, "See all results", and filling a result option from the shell's <template>. No listeners and no
 * globals, so it runs under node --test on a stand-in DOM. What the shell's eager script needs (the selectors, the key
 * hint, the trigger and dialog keys) is in lib/search-boot.ts, so that script shares no chunk with the apps.
 *
 * Result text only ever becomes text nodes and <mark> elements, through the search package's marked(), never markup.
 * It imports only types from the package; the apps pass marked() and isSafeUrl() in (decision 0015, principle 7).
 */
import type { isSafeUrl, marked } from "@astronomic-dev/search/dom";
import type { Option, StringsInput } from "@astronomic-dev/search/controller";
import type { GroupBy, Highlight, IndexSettings, SearchRecord, SearchResult, SuggestedLink } from "@astronomic-dev/search/core";

/** The JSON block inside each dialog (type="application/json": data, never run, so a strict CSP allows it). */
export const CONFIG = "script[data-search-config]";

type Attrs = { getAttribute(name: string): string | null };

export interface BrowseLink {
	label: string;
	href: string;
}

/** The dialog's own words, beside the search's strings: what its markup shows that the package has no word for. */
export interface DialogWords {
	/** The Escape key's cap in the key hints (the arrows and Enter are symbols). */
	escKey: string;
	/** The mark before a section result's heading (hidden from screen readers). */
	headingMark: string;
	/** The mark between the parts of a result's breadcrumb (hidden from screen readers). */
	crumbMark: string;
	/** The visible label before the type tabs (the tablist keeps its name, the search's `typesLabel`). */
	typeText: string;
}

/** Search's `strings`: the search's strings and the dialog's own words. */
export type SearchStrings = StringsInput & Partial<DialogWords>;

export const defaultDialogWords: DialogWords = { escKey: "esc", headingMark: "#", crumbMark: "›", typeText: "Type" };

/** The dialog's words: the defaults with `input`'s on top (strings only). */
export function dialogWords(input: Partial<DialogWords> = {}): DialogWords {
	const out = { ...defaultDialogWords };
	for (const k of Object.keys(out) as (keyof DialogWords)[]) if (typeof input[k] === "string") out[k] = input[k];
	return out;
}

/** What the shell writes for its dialog: the site's search settings, with this dialog's words and keys. */
export interface SearchConfig {
	/** The manifest URL, base applied. */
	manifest: string;
	/** The site's default index. */
	index: string;
	/** The shortcut keys this dialog answers; [] for none. */
	keys: string[];
	/** The words: the site's `strings` setting with this dialog's own on top (overrides only). */
	strings: StringsInput;
	/** Links for the error state. */
	browse: BrowseLink[];
}

/**
 * `map[key]` only when `map` has it as its own: a type or facet name from the URL, the query or the index never reads an
 * inherited property (`constructor`, `toString`) of the index settings' plain objects.
 */
export function ownValue<T>(map: Record<string, T> | null | undefined, key: string): T | undefined {
	return map && Object.hasOwn(map, key) ? map[key] : undefined;
}

/** Reads a dialog's config block. A block with no manifest URL means the search integration is missing. */
export function parseConfig(text: string | null | undefined): SearchConfig {
	let data: unknown;
	try {
		data = JSON.parse(text ?? "null");
	} catch {
		throw new Error("Search: the dialog's config block is not JSON");
	}
	const c = (data && typeof data === "object" && !Array.isArray(data) ? data : {}) as Partial<SearchConfig>;
	if (typeof c.manifest !== "string" || c.manifest === "") {
		throw new Error("Search: the dialog has no manifest URL; add the search() integration from @astronomic-dev/search/astro to astro.config");
	}
	return {
		manifest: c.manifest,
		index: typeof c.index === "string" && c.index ? c.index : "default",
		keys: Array.isArray(c.keys) ? c.keys.filter((k): k is string => typeof k === "string") : [],
		strings: c.strings && typeof c.strings === "object" ? c.strings : {},
		browse: Array.isArray(c.browse) ? c.browse : [],
	};
}

/**
 * Where "See all results" goes: the button's href with `q` set to the query (in place of any `q` it had), before its
 * fragment and keeping its other parameters; an empty query removes `q`. The href stays as written (relative or not).
 */
export function seeAllHref(base: string, query: string): string {
	const hashAt = base.indexOf("#");
	const hash = hashAt < 0 ? "" : base.slice(hashAt);
	const rest = hashAt < 0 ? base : base.slice(0, hashAt);
	const searchAt = rest.indexOf("?");
	const path = searchAt < 0 ? rest : rest.slice(0, searchAt);
	const params = new URLSearchParams(searchAt < 0 ? "" : rest.slice(searchAt + 1));
	const q = query.trim();
	if (q) params.set("q", q);
	else params.delete("q");
	const search = params.toString();
	return `${path}${search ? `?${search}` : ""}${hash}`;
}

/** The attributes for each <mark>: the class of the shell's mark template, so its classes are in the source. */
export function markAttrs(template: { content?: { firstElementChild: Attrs | null } } | null): Record<string, string> {
	const cls = template?.content?.firstElementChild?.getAttribute("class");
	return cls ? { class: cls } : {};
}

export interface FillContext {
	/** The document that makes the text nodes and marks. */
	doc: Document;
	/** The option element id for a record id (the dom layer's createIdFor, shared with the combobox). */
	idFor: (recordId: string) => string;
	/** Attributes for each <mark> (markAttrs()). */
	mark: Record<string, string>;
	/** The search package's marked() (dom layer): text nodes with a <mark> around each range. */
	marked: typeof marked;
	/** The search package's isSafeUrl() (dom layer): only a relative or http(s) URL becomes a link. */
	isSafeUrl: typeof isSafeUrl;
	/** The breadcrumb's parts (crumbOf()); none removes the breadcrumb. */
	crumb?: string[];
}

/**
 * A page result's breadcrumb, from the index settings: its type's label, then each facet's value labels in the
 * settings' order, whatever the grouping, so a Docs page reads "Docs › Vesper" under its Docs group too (the context
 * stays on the row); a record with no facet value reads its type alone. A `section` facet, if the index has one,
 * follows. A type or facet value with no label in the settings shows as written.
 */
export function crumbOf(record: SearchRecord, settings: Pick<IndexSettings, "types" | "facets"> | null | undefined): string[] {
	const out = [ownValue(settings?.types, record.type)?.label ?? record.type];
	for (const [facet, setting] of Object.entries(settings?.facets ?? {})) {
		const labels = (ownValue(record.facets, facet) ?? []).map((v) => ownValue(setting.values, v) ?? v).filter(Boolean);
		if (labels.length) out.push(labels.join(", "));
	}
	return out;
}

/** A breadcrumb's parts into `crumb`, each as text, the template's [data-search-crumb-sep] between; none removes it. */
export function fillCrumb(doc: Document, crumb: HTMLElement, parts: string[]): void {
	const sep = crumb.querySelector("[data-search-crumb-sep]");
	crumb.textContent = "";
	parts.forEach((text, i) => {
		if (i > 0 && sep) crumb.append(sep.cloneNode(true));
		const span = doc.createElement("span");
		span.textContent = text;
		crumb.append(span);
	});
	if (!parts.length) crumb.remove();
}

type Template = { content: { firstElementChild: Element | null } };

/** A copy of a template's first element. */
export function cloneTemplate(template: Template): HTMLElement {
	const first = template.content.firstElementChild;
	if (!first) throw new Error("Search: an empty <template> in the dialog");
	return first.cloneNode(true) as HTMLElement;
}

/**
 * One result option from the page or heading template: id from idFor, role="option", data-kind, the title (a
 * heading's own text for a heading), the breadcrumb (`ctx.crumb`, each part as text, the template's separator between)
 * and the snippet with marks at the highlight ranges. The URL becomes the href only
 * when it is relative or http(s); a link is never a tab stop (focus stays in the box). An empty snippet is removed.
 */
export function fillOption(template: Template, record: SearchRecord, highlight: Highlight, ctx: FillContext): HTMLElement {
	const el = cloneTemplate(template);
	el.setAttribute("id", ctx.idFor(record.id));
	el.setAttribute("role", "option");
	el.setAttribute("data-kind", record.kind);
	if (record.url !== undefined && ctx.isSafeUrl(record.url)) {
		el.setAttribute("href", record.url);
		el.setAttribute("tabindex", "-1");
	} else {
		el.removeAttribute("href");
		el.removeAttribute("tabindex");
	}
	const title = el.querySelector<HTMLElement>("[data-search-title]");
	if (title) {
		const heading = record.kind === "heading";
		title.textContent = "";
		title.append(...ctx.marked(ctx.doc, heading ? record.heading : record.title, (heading ? highlight.heading : highlight.title) ?? [], ctx.mark));
	}
	const crumb = el.querySelector<HTMLElement>("[data-search-crumb]");
	if (crumb) fillCrumb(ctx.doc, crumb, ctx.crumb ?? []);
	const snippet = el.querySelector<HTMLElement>("[data-search-snippet]");
	if (snippet) {
		if (highlight.snippet.text) {
			snippet.textContent = "";
			snippet.append(...ctx.marked(ctx.doc, highlight.snippet.text, highlight.snippet.ranges, ctx.mark));
		} else snippet.remove();
	}
	return el;
}

/**
 * One suggested link (the controller's `kind: "suggested"` option, shown in an empty box) from the suggested
 * template: id from idFor, role="option", data-kind="suggested", the label as text (the URL with no label) and the
 * URL as the href, never a tab stop. Null when the link has no URL or one that is not relative or http(s): the
 * controller's options stay in step with the listbox only for links it can follow, as the default dialog's.
 */
export function fillSuggested(template: Template, option: Option, ctx: Pick<FillContext, "idFor" | "isSafeUrl">): HTMLElement | null {
	if (option.kind !== "suggested" || option.url === undefined || !ctx.isSafeUrl(option.url)) return null;
	const el = cloneTemplate(template);
	el.setAttribute("id", ctx.idFor(option.id));
	el.setAttribute("role", "option");
	el.setAttribute("data-kind", "suggested");
	el.setAttribute("href", option.url);
	el.setAttribute("tabindex", "-1");
	const title = el.querySelector<HTMLElement>("[data-search-title]");
	if (title) title.textContent = option.label || option.url;
	return el;
}

/** A group's count: its matching pages over all matches (as the type tab and the facet show), else the pages shown. */
export function groupCount(result: Pick<SearchResult, "types" | "facets"> | null | undefined, group: GroupBy, key: string, shown: number): number {
	const counts = group === "type" ? result?.types : typeof group === "string" ? ownValue(result?.facets, group) : undefined;
	return counts?.find((c) => c.value === key)?.count ?? shown;
}

/**
 * No results: the index's suggested links into a message's [data-search-suggested-links] block, as plain links (the
 * template's one list row cloned per link), the ones it can follow; none removes the block and its label. The label
 * gets `labelId` and names the list.
 */
export function suggestedLinks(el: HTMLElement, links: SuggestedLink[] | undefined, isSafe: typeof isSafeUrl, labelId: string): void {
	const wrap = el.querySelector<HTMLElement>("[data-search-suggested-links]");
	if (!wrap) return;
	const safe = (links ?? []).filter((l) => typeof l?.href === "string" && isSafe(l.href));
	const list = wrap.querySelector("ul");
	const row = list?.firstElementChild;
	if (!safe.length || !list || !row) return wrap.remove();
	const label = wrap.querySelector<HTMLElement>("[data-search-suggested-label]");
	if (label) {
		label.id = labelId;
		list.setAttribute("aria-labelledby", label.id);
	}
	row.remove();
	for (const link of safe) {
		const li = row.cloneNode(true) as HTMLElement;
		const a = li.querySelector("a")!;
		a.href = link.href;
		a.textContent = link.label || link.href;
		a.setAttribute("data-key", `suggested:${link.href}`);
		list.append(li);
	}
}
