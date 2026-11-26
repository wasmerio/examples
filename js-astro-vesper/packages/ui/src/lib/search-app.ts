/**
 * The Search family's browser glue, loaded on first use only (the shell's script imports it through import() on
 * hover, focus, a click or the shortcut): the search package's core (createSearch, the MiniSearch engine),
 * controller and dom layer, and the render step that fills the shell's templates from the controller's state.
 *
 * One controller per dialog. mountSearch binds the dialog's buttons, the shortcut (on the main button's dialog only),
 * the dialog lifecycle, the combobox, the tabs, the live region and the analytics events (search:query, search:select
 * and search:noresults on the dialog, the package's default); it opens through the kit's openModal(), so the
 * kit's one scroll lock applies (decision 0015, principle 4). After a ClientRouter swap the old page's dialogs are
 * unbound and the new page's main dialog is bound, so the shortcut keeps working.
 */
import { createController, fill, loadSearcher, type Controller, type State } from "@astronomic-dev/search/controller";
import { createSearch, minisearchEngine, type GroupBy, type IndexSettings } from "@astronomic-dev/search/core";
import { bindTabs, createIdFor, isSafeUrl, marked, mountSearch } from "@astronomic-dev/search/dom";
import { openModal } from "./modal";
import { CONFIG, cloneTemplate, crumbOf, fillOption, fillSuggested, groupCount, markAttrs, ownValue, parseConfig, seeAllHref, suggestedLinks, type SearchConfig } from "./search";
import { DIALOG, TRIGGER, triggerKey } from "./search-boot";

interface Parts {
	panel: HTMLElement;
	input: HTMLInputElement;
	close: HTMLElement;
	typeRow: HTMLElement;
	tablist: HTMLElement;
	facets: HTMLElement;
	scroll: HTMLElement;
	listbox: HTMLElement;
	message: HTMLElement;
	seeAll: HTMLAnchorElement;
	live: HTMLElement;
}

interface Bound {
	dialog: HTMLDialogElement;
	config: SearchConfig;
	controller: Controller;
	parts: Parts;
	triggers: HTMLElement[];
	settings: IndexSettings | null;
	idFor: (recordId: string) => string;
	/** "See all results" with no query: the shell's search page link. */
	seeAll: string;
	unmount: (() => void) | null;
	unbindTabs: (() => void) | null;
	last: Partial<State>;
}

const bound = new Map<HTMLDialogElement, Bound>();

function localStore(): Storage | null {
	try {
		return window.localStorage;
	} catch {
		return null;
	}
}

function parseGroup(value: string | null): GroupBy | null {
	if (value === null || value === "") return null;
	return value === "false" ? false : value;
}

const typesOf = (dialog: Element) =>
	(dialog.getAttribute("data-search-types") ?? "")
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean);

const configOf = (dialog: Element) => parseConfig(dialog.querySelector(CONFIG)?.textContent);

/** The page's main kit button: the one marked data-search-main, else the first. */
function mainTrigger(): HTMLElement | null {
	return document.querySelector<HTMLElement>(`${TRIGGER}[data-search-main]`) ?? document.querySelector<HTMLElement>(TRIGGER);
}

/** The dialog with the same index, types and group as `trigger`. */
function dialogFor(trigger: Element): HTMLDialogElement | null {
	const dialogs = [...document.querySelectorAll<HTMLDialogElement>(DIALOG)];
	if (!dialogs.length) return null;
	const site = configOf(dialogs[0]!).index;
	const key = triggerKey(trigger, site);
	return dialogs.find((d) => triggerKey(d, site) === key) ?? null;
}

function part<T extends HTMLElement>(dialog: HTMLDialogElement, name: string): T {
	const el = dialog.querySelector<T>(`[data-search-${name}]`);
	if (!el) throw new Error(`Search: the dialog has no [data-search-${name}]`);
	return el;
}

function template(dialog: HTMLDialogElement, name: string): HTMLTemplateElement {
	const t = dialog.querySelector<HTMLTemplateElement>(`template[data-search-template="${name}"]`);
	if (!t) throw new Error(`Search: the dialog has no "${name}" template`);
	return t;
}

/** Replaces a container's children, keeping focus on the element with the same data-key, if it had it. */
function replace(container: HTMLElement, nodes: Node[]): void {
	const active = document.activeElement;
	const key = active && container.contains(active) ? active.getAttribute("data-key") : null;
	container.replaceChildren(...nodes);
	if (!key) return;
	for (const el of container.querySelectorAll<HTMLElement>("[data-key]")) {
		if (el.getAttribute("data-key") === key) return el.focus();
	}
}

function make(dialog: HTMLDialogElement): Bound {
	const config = configOf(dialog);
	const index = dialog.getAttribute("data-search-index") || config.index;
	const types = typesOf(dialog);
	const group = parseGroup(dialog.getAttribute("data-search-group"));
	const parts: Parts = {
		panel: part(dialog, "panel"),
		input: part(dialog, "input"),
		close: part(dialog, "close"),
		typeRow: part(dialog, "type-row"),
		tablist: part(dialog, "tabs"),
		facets: part(dialog, "facets"),
		scroll: part(dialog, "scroll"),
		listbox: part(dialog, "results"),
		message: part(dialog, "message"),
		seeAll: part(dialog, "see-all"),
		live: part(dialog, "live"),
	};
	const b: Bound = {
		dialog,
		config,
		parts,
		triggers: [],
		settings: null,
		idFor: createIdFor(index),
		seeAll: parts.seeAll.getAttribute("href") || "/search",
		unmount: null,
		unbindTabs: null,
		last: {},
		controller: createController({
			index,
			types,
			surface: "dialog",
			storage: localStore(),
			strings: config.strings,
			dev: import.meta.env.DEV,
			load: async () => {
				const searcher = await loadSearcher({
					index,
					lang: document.documentElement.lang,
					manifestUrl: config.manifest,
					// The init carries the manifest's cache mode ({ cache: "no-cache" }).
					fetch: (url: string, init?: RequestInit) => fetch(url, init),
					engine: minisearchEngine,
					createSearch,
				});
				b.settings = searcher.settings;
				if (group === null) return searcher;
				// Only the grouping changes: the capabilities, the locale (in each event's detail) and run() stay the searcher's.
				return { ...searcher, settings: { ...searcher.settings, group: { ...searcher.settings.group, dialog: group } } };
			},
		}),
	};
	parts.close.addEventListener("click", () => b.controller.close());
	dialog.addEventListener("click", (e) => action(b, e));
	b.controller.subscribe((s) => render(b, s));
	render(b, b.controller.getState());
	return b;
}

/** Binds (again) a dialog to the page's matching buttons, and the shortcut when it is the main button's dialog. */
function bind(dialog: HTMLDialogElement): Bound {
	const b = bound.get(dialog) ?? make(dialog);
	bound.set(dialog, b);
	const site = b.config.index;
	const key = triggerKey(dialog, site);
	const triggers = [...document.querySelectorAll<HTMLElement>(TRIGGER)].filter((t) => triggerKey(t, site) === key);
	if (b.unmount && triggers.length === b.triggers.length && triggers.every((t, i) => t === b.triggers[i])) return b;
	b.unmount?.();
	b.triggers = triggers;
	const main = mainTrigger();
	b.unmount = mountSearch({
		trigger: triggers,
		dialog,
		dialogPanel: b.parts.panel,
		input: b.parts.input,
		listbox: b.parts.listbox,
		live: b.parts.live,
		controller: b.controller,
		idFor: b.idFor,
		keys: main && triggers.includes(main) ? b.config.keys : [],
		scrollLock: false,
		show: (d) => openModal(d, document.documentElement),
	});
	return b;
}

/** Unbinds the dialogs a page swap removed: their shortcut listener is on the window. */
function sweep(): void {
	for (const [dialog, b] of bound) {
		if (dialog.isConnected) continue;
		b.unmount?.();
		b.unbindTabs?.();
		bound.delete(dialog);
	}
}

/** Makes and binds the dialog for `trigger` (and the main button's, so the shortcut is bound) and starts its load. */
export function prepare(trigger: HTMLElement, _keys: string[] = []): Controller | null {
	sweep();
	const main = mainTrigger();
	const mainDialog = main && main !== trigger ? dialogFor(main) : null;
	if (mainDialog) bind(mainDialog);
	const dialog = dialogFor(trigger);
	if (!dialog) {
		if (import.meta.env.DEV) console.warn("Search: no Search dialog on the page matches this button's index, types and group", trigger);
		return null;
	}
	const b = bind(dialog);
	b.controller.preload().catch(() => {});
	return b.controller;
}

document.addEventListener("astro:after-swap", () => {
	sweep();
	const main = mainTrigger();
	const dialog = main && dialogFor(main);
	if (dialog) bind(dialog);
});

function action(b: Bound, e: Event): void {
	const target = (e.target as Element | null)?.closest?.("[data-action]");
	if (!target || !b.dialog.contains(target)) return;
	const c = b.controller;
	switch (target.getAttribute("data-action")) {
		case "retry":
			c.retry();
			b.parts.input.focus();
			break;
		case "all-types":
			c.searchAllTypes();
			b.parts.input.focus();
			break;
		case "recent":
			c.input(target.getAttribute("data-query") ?? "");
			b.parts.input.focus();
			break;
		case "facet":
			c.togglePick(target.getAttribute("data-facet") ?? "", target.getAttribute("data-value") ?? "");
			break;
	}
}

/** The grouping in effect: the dialog's own, else the index setting. */
function groupOf(b: Bound): GroupBy {
	return parseGroup(b.dialog.getAttribute("data-search-group")) ?? b.settings?.group.dialog ?? "type";
}

const typeLabel = (b: Bound, type: string) => ownValue(b.settings?.types, type)?.label ?? type;

/**
 * A labeled group from the group template: its name gets an id from `key` and names the group; its count (null: none)
 * shows at the end of the label row.
 */
function labeledGroup(b: Bound, key: string, text: string, count: number | null, options: HTMLElement[]): HTMLElement {
	const el = cloneTemplate(template(b.dialog, "group"));
	const name = el.querySelector<HTMLElement>("[data-search-group-name]")!;
	name.id = b.idFor(key);
	name.textContent = text;
	const countEl = el.querySelector<HTMLElement>("[data-search-group-count]");
	if (countEl && count !== null) countEl.textContent = String(count);
	else countEl?.remove();
	el.setAttribute("aria-labelledby", name.id);
	el.append(...options);
	return el;
}

/** The empty box's suggested links (the controller's kind "suggested" options): one group labeled "Suggested". */
function suggested(b: Bound, s: State): HTMLElement[] {
	const tpl = template(b.dialog, "suggested");
	const ctx = { idFor: b.idFor, isSafeUrl };
	const options = s.options.map((o) => fillSuggested(tpl, o, ctx)).filter((el): el is HTMLElement => el !== null);
	return options.length ? [labeledGroup(b, "label:suggested", b.controller.strings.suggested, null, options)] : [];
}

function results(b: Bound, s: State): HTMLElement[] {
	if (!s.result) return suggested(b, s);
	const d = b.dialog;
	const group = groupOf(b);
	const ctx = { doc: document, idFor: b.idFor, mark: markAttrs(template(d, "mark")), marked, isSafeUrl };
	const page = template(d, "page");
	const heading = template(d, "heading");
	const out: HTMLElement[] = [];
	for (const g of s.result.groups) {
		const options: HTMLElement[] = [];
		for (const item of g.items) {
			options.push(fillOption(page, item.page, item.highlight, { ...ctx, crumb: crumbOf(item.page, b.settings) }));
			for (const h of item.headings) options.push(fillOption(heading, h.record, h.highlight, ctx));
		}
		if (group === false) {
			out.push(...options);
			continue;
		}
		out.push(labeledGroup(b, `group:${g.key}`, g.key === "" ? b.controller.strings.other : g.label, groupCount(s.result, group, g.key, g.items.length), options));
	}
	return out;
}

function recentList(b: Bound, s: State): HTMLElement | null {
	if (!s.recent.length) return null;
	const el = cloneTemplate(template(b.dialog, "recent"));
	const label = el.querySelector<HTMLElement>("[data-search-recent-label]")!;
	label.id = b.idFor("label:recent");
	const list = el.querySelector("ul")!;
	list.setAttribute("aria-labelledby", label.id);
	const row = list.firstElementChild!;
	row.remove();
	for (const q of s.recent) {
		const li = row.cloneNode(true) as HTMLElement;
		const button = li.querySelector<HTMLElement>("[data-action]")!;
		button.textContent = q;
		button.setAttribute("data-query", q);
		button.setAttribute("data-key", `recent:${q}`);
		list.append(li);
	}
	return el;
}

/** The message under the listbox: the error state, loading, no results, or recent searches (after any suggested links). */
function message(b: Bound, s: State): HTMLElement | null {
	const d = b.dialog;
	const q = s.query.trim();
	if (s.status === "error") {
		const el = cloneTemplate(template(d, "error"));
		el.querySelector("[data-action]")?.setAttribute("data-key", "retry");
		const label = el.querySelector<HTMLElement>("[data-search-browse-label]")!;
		const list = el.querySelector<HTMLElement>("[data-search-browse]")!;
		const row = list.firstElementChild!;
		row.remove();
		// Only links it can follow (relative or http(s)); the build checks them too.
		const links = b.config.browse.filter((link) => typeof link?.href === "string" && isSafeUrl(link.href));
		if (!links.length) {
			label.remove();
			list.remove();
			return el;
		}
		label.id = b.idFor("label:browse");
		list.setAttribute("aria-labelledby", label.id);
		for (const link of links) {
			const li = row.cloneNode(true) as HTMLElement;
			const a = li.querySelector("a")!;
			a.href = link.href;
			a.textContent = link.label;
			list.append(li);
		}
		return el;
	}
	if (!q) return recentList(b, s);
	if (s.status === "loading" || s.status === "idle") return cloneTemplate(template(d, "loading"));
	if (s.result && s.result.total === 0) {
		const el = cloneTemplate(template(d, "empty"));
		el.querySelector("[data-search-empty-text]")!.textContent = fill(b.controller.strings.noResults, { query: q });
		const all = el.querySelector<HTMLElement>('[data-action="all-types"]')!;
		const narrowed = s.type !== null || Object.keys(s.picks).length > 0;
		if (narrowed) all.setAttribute("data-key", "all-types");
		else all.remove();
		suggestedLinks(el, b.settings?.suggested, isSafeUrl, b.idFor("label:suggested-links"));
		const recent = recentList(b, s);
		if (recent) el.append(recent);
		return el;
	}
	return null;
}

/** The types the tabs show: this dialog's `types`, else every type of the index. */
function tabTypes(b: Bound): string[] {
	const all = Object.keys(b.settings?.types ?? {});
	const only = typesOf(b.dialog);
	return only.length ? all.filter((t) => only.includes(t)) : all;
}

function tabs(b: Bound, s: State, types: string[]): HTMLElement[] {
	const counts = new Map((s.result?.types ?? []).map((t) => [t.value, t.count]));
	const total = types.reduce((n, t) => n + (counts.get(t) ?? 0), 0);
	const tpl = template(b.dialog, "tab");
	// A type with no match shows no tab, unless it is the selected one; "All" always shows.
	const shown = types.filter((t) => !s.result || (counts.get(t) ?? 0) > 0 || t === s.type);
	const tab = (value: string, label: string, count: number) => {
		const el = cloneTemplate(tpl);
		el.setAttribute("data-type", value);
		el.setAttribute("data-key", `tab:${value}`);
		el.querySelector("[data-search-name]")!.textContent = label;
		const c = el.querySelector<HTMLElement>("[data-search-count]")!;
		if (s.result) c.textContent = String(count);
		else c.remove();
		return el;
	};
	return [tab("", b.controller.strings.allTypes, total), ...shown.map((t) => tab(t, typeLabel(b, t), counts.get(t) ?? 0))];
}

function facets(b: Bound, s: State): HTMLElement[] {
	if (!s.capabilities?.facets || !s.result) return [];
	const groupTpl = template(b.dialog, "facet-group");
	const facetTpl = template(b.dialog, "facet");
	const out: HTMLElement[] = [];
	for (const [facet, values] of Object.entries(s.result.facets)) {
		const shown = values.filter((v) => v.count > 0 || v.picked);
		if (!shown.length) continue;
		const el = cloneTemplate(groupTpl);
		const label = el.querySelector<HTMLElement>("[data-search-facet-label]")!;
		label.id = b.idFor(`facet:${facet}`);
		label.textContent = ownValue(b.settings?.facets, facet)?.label ?? facet;
		el.setAttribute("aria-labelledby", label.id);
		const pills = el.querySelector<HTMLElement>("[data-search-facet-values]") ?? el;
		for (const v of shown) {
			const button = cloneTemplate(facetTpl);
			button.setAttribute("aria-pressed", String(v.picked));
			button.setAttribute("data-facet", facet);
			button.setAttribute("data-value", v.value);
			button.setAttribute("data-key", `facet:${facet}:${v.value}`);
			button.querySelector("[data-search-name]")!.textContent = v.label;
			button.querySelector("[data-search-count]")!.textContent = String(v.count);
			pills.append(button);
		}
		out.push(el);
	}
	return out;
}

function render(b: Bound, s: State): void {
	const last = b.last;
	const changed = (k: keyof State) => last[k] !== s[k];
	if (!(["result", "options", "status", "query", "type", "picks", "recent", "capabilities"] as const).some(changed)) return;
	b.last = { ...s };
	const p = b.parts;

	// The results, or in an empty box the suggested links (options the arrows reach), before recent searches.
	if (changed("result") || changed("options") || changed("status")) {
		replace(p.listbox, results(b, s));
		p.listbox.hidden = s.options.length === 0;
	}
	replace(p.message, [message(b, s)].filter((n): n is HTMLElement => n !== null));

	// The tabs show while there is a type to pick: "All" alone (no type has a match, none is picked) hides the row.
	const types = tabTypes(b);
	const row = s.status === "ready" && types.length > 1 ? tabs(b, s, types) : [];
	const showTabs = row.length > 1;
	if (showTabs) {
		replace(p.tablist, row);
		b.unbindTabs ??= bindTabs(p.tablist, b.controller, { panel: p.scroll });
	}
	p.tablist.hidden = !showTabs;
	p.typeRow.hidden = !showTabs;

	const rows = facets(b, s);
	replace(p.facets, rows);
	p.facets.hidden = rows.length === 0;

	// The button's own href (a SearchButton with `href`), else the shell's search page.
	p.seeAll.href = seeAllHref(b.triggers[0]?.getAttribute("href") || b.seeAll, s.query);
	// No results: nothing more to see, so "See all results" hides.
	p.seeAll.hidden = s.query.trim() !== "" && s.result?.total === 0;
}
