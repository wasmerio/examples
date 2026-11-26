/**
 * SearchPage's browser glue, loaded on first use only (the part's script imports it through import(): at once with a
 * query in the URL, else on hover, focus or typing): the search package's core, controller and dom layer (tabs, live
 * region, analytics events), and the render step that fills the part's templates from the controller's state.
 *
 * The URL holds the query, the type tab and the filter picks (lib/search-page.ts): each change replaces the history
 * entry, and a submit adds one, so Back returns to the last submitted query; Back and Forward put the URL's state back.
 *
 * Under Astro's ClientRouter: the router keeps its own state (index, scroll) on each entry, ignores a popstate whose
 * state is null (the address changes, the page stays), and swaps the page in on any other. So while the page is on
 * screen its own entries hold null: a submit nulls the entry it starts from (keeping the router's state) and pushes
 * null, and Back and Forward between them are the page's own, with no swap or refetch. When a link leaves, the entry
 * gets the router's state back, marked as the page's (OWN), so Back to it swaps the page in and the router can write
 * its scroll; the page that mounts there nulls it again. A jump from another page straight onto a null entry (the Back
 * button's list) is the router's to miss: SearchPage's script reloads then (as the Filters do).
 */
import { countText, createController, fill, loadSearcher, type Controller, type State } from "@astronomic-dev/search/controller";
import { createSearch, minisearchEngine, type GroupBy, type IndexSettings, type ResultItem, type SearchRecord } from "@astronomic-dev/search/core";
import { bindEvents, bindLive, bindTabs, isSafeUrl, marked } from "@astronomic-dev/search/dom";
import { CONFIG, cloneTemplate, crumbOf, fillCrumb, groupCount, markAttrs, ownValue, parseConfig, suggestedLinks, type SearchConfig } from "./search";
import { PAGE_SIZE, pageStrings, pickToggles, readUrl, slicePages, writeUrl, type PageWords, type Slice } from "./search-page";

interface Page {
	root: HTMLElement;
	config: SearchConfig;
	words: PageWords;
	controller: Controller;
	settings: IndexSettings | null;
	input: HTMLInputElement;
	form: HTMLFormElement;
	typeRow: HTMLElement;
	tablist: HTMLElement;
	facets: HTMLElement;
	panel: HTMLElement;
	count: HTMLElement;
	results: HTMLElement;
	message: HTMLElement;
	more: HTMLButtonElement;
	live: HTMLElement;
	/** Pages shown; "Show more results" adds PAGE_SIZE. */
	shown: number;
	slice: Slice;
	/** The search part of the last history entry a submit (or the load, or Back) made. */
	committed: string;
	unbindTabs: (() => void) | null;
	last: Partial<State>;
}

let counter = 0;
const nextId = (base: string) => `${base}-${++counter}`;

function part<T extends HTMLElement>(root: HTMLElement, name: string): T {
	const el = root.querySelector<T>(`[data-search-${name}]`);
	if (!el) throw new Error(`Search: the search page has no [data-search-${name}]`);
	return el;
}

function template(root: HTMLElement, name: string): HTMLTemplateElement {
	const t = root.querySelector<HTMLTemplateElement>(`template[data-search-template="${name}"]`);
	if (!t) throw new Error(`Search: the search page has no "${name}" template`);
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

/** The same element as another tag (a title one level down under a group heading), with its attributes and children. */
function retag(el: HTMLElement, tag: string): HTMLElement {
	if (el.tagName.toLowerCase() === tag) return el;
	const next = document.createElement(tag);
	for (const a of el.attributes) next.setAttribute(a.name, a.value);
	next.append(...el.childNodes);
	el.replaceWith(next);
	return next;
}

const typesOf = (root: Element) =>
	(root.getAttribute("data-search-types") ?? "")
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean);

const urlState = (s: State) => ({ query: s.query, type: s.type, picks: s.picks });
const facetNames = (p: Page) => Object.keys(p.settings?.facets ?? {});
const typeLabel = (p: Page, type: string) => ownValue(p.settings?.types, type)?.label ?? type;
const here = (search: string) => `${location.pathname}${search}${location.hash}`;

/** Astro's ClientRouter is on this page. */
const routed = () => document.querySelector('[name="astro-view-transitions-enabled"]') !== null;
/** Marks the router's state given back to a page's entry when a link leaves it. */
const OWN = "astronomicSearch";
type RouterState = Record<string, unknown>;

/** Puts a URL's query, type and picks into the box and the controller. */
function apply(p: Page, search: string): void {
	const url = readUrl(search, p.settings ? facetNames(p) : undefined);
	const c = p.controller;
	const s = c.getState();
	for (const [facet, value] of pickToggles(s.picks, url.picks)) c.togglePick(facet, value);
	if (s.type !== url.type) c.setType(url.type);
	p.input.value = url.query;
	if (url.query !== s.query) c.input(url.query);
}

export function mount(root: HTMLElement): void {
	if (root.hasAttribute("data-search-mounted")) return;
	root.setAttribute("data-search-mounted", "");
	const config = parseConfig(root.querySelector(CONFIG)?.textContent);
	const index = root.getAttribute("data-search-index") || config.index;
	const types = typesOf(root);
	const words = pageStrings(config.strings as Partial<PageWords>);
	const p: Page = {
		root,
		config,
		words,
		settings: null,
		input: part(root, "input"),
		form: root.querySelector("form")!,
		typeRow: part(root, "type-row"),
		tablist: part(root, "tabs"),
		facets: part(root, "facets"),
		panel: part(root, "panel"),
		count: part(root, "total"),
		results: part(root, "results"),
		message: part(root, "message"),
		more: part(root, "more"),
		live: part(root, "live"),
		shown: PAGE_SIZE,
		slice: slicePages(null, 0),
		committed: location.search,
		unbindTabs: null,
		last: {},
		controller: createController({
			index,
			types,
			surface: "page",
			storage: null,
			strings: config.strings,
			dev: import.meta.env.DEV,
			load: async () => {
				const searcher = await loadSearcher({
					index,
					lang: document.documentElement.lang,
					manifestUrl: config.manifest,
					fetch: (url: string, init?: RequestInit) => fetch(url, init),
					engine: minisearchEngine,
					createSearch,
				});
				p.settings = searcher.settings;
				// The URL may carry parameters that are not this index's facets (a campaign tag): they are not picks.
				const known = Object.keys(searcher.settings.facets);
				for (const [facet, values] of Object.entries(p.controller.getState().picks)) {
					if (!known.includes(facet)) for (const v of values) p.controller.togglePick(facet, v);
				}
				const type = p.controller.getState().type;
				if (type !== null && !Object.hasOwn(searcher.settings.types, type)) p.controller.setType(null);
				return searcher;
			},
		}),
	};
	const c = p.controller;
	const unbinds: (() => void)[] = [];
	const events = bindEvents(root, c);
	unbinds.push(events.unbind, bindLive(p.live, c));
	unbinds.push(c.subscribe((s) => render(p, s)));

	// The box: each change searches and replaces the history entry (in render); no search while composing.
	const onInput = (e: Event) => {
		if ((e as InputEvent).isComposing) return;
		c.input(p.input.value);
	};
	const onCompositionStart = () => c.compositionStart();
	const onCompositionEnd = () => c.compositionEnd(p.input.value);
	// Under the router: the router's state of the entry the page holds as null (see the top of this file). An entry
	// that got it back when a link left it is the page's again.
	let entry: RouterState | null = null;
	const hold = () => {
		const state = history.state as RouterState | null;
		if (!routed() || state === null || typeof state !== "object") return;
		const { [OWN]: _, ...rest } = state;
		entry = rest;
		history.replaceState(null, "");
	};
	if ((history.state as RouterState | null)?.[OWN]) hold();
	// A submit adds a history entry: the entry before it goes back to the last submitted search, so Back returns there.
	const submit = () => {
		c.input(p.input.value);
		const next = writeUrl(urlState(c.getState()), location.search, facetNames(p));
		if (next === p.committed) return;
		hold();
		history.replaceState(history.state, "", here(p.committed));
		history.pushState(routed() ? null : history.state, "", here(next));
		p.committed = next;
	};
	const onSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		submit();
	};
	const onPop = (e: PopStateEvent) => {
		// An entry with a state, under the router: the router swaps the page in.
		if (routed() && e.state !== null) return;
		p.committed = location.search;
		apply(p, location.search);
	};
	const onClick = (e: MouseEvent) => action(p, e, events.select);
	const onMore = () => more(p);
	p.input.addEventListener("input", onInput);
	p.input.addEventListener("compositionstart", onCompositionStart);
	p.input.addEventListener("compositionend", onCompositionEnd);
	p.form.addEventListener("submit", onSubmit);
	p.more.addEventListener("click", onMore);
	root.addEventListener("click", onClick);
	root.addEventListener("auxclick", onClick);
	window.addEventListener("popstate", onPop);
	unbinds.push(() => {
		p.input.removeEventListener("input", onInput);
		p.input.removeEventListener("compositionstart", onCompositionStart);
		p.input.removeEventListener("compositionend", onCompositionEnd);
		p.form.removeEventListener("submit", onSubmit);
		p.more.removeEventListener("click", onMore);
		root.removeEventListener("click", onClick);
		root.removeEventListener("auxclick", onClick);
		window.removeEventListener("popstate", onPop);
		p.unbindTabs?.();
	});
	// A link leaves: a null entry gets the router's state back, marked as the page's, so Back to it swaps the page in.
	const onLeave = (e: Event) => {
		if ((e as Event & { navigationType?: string }).navigationType === "traverse" || history.state !== null || !entry) return;
		history.replaceState({ ...entry, [OWN]: true }, "");
	};
	document.addEventListener("astro:before-preparation", onLeave);
	unbinds.push(() => document.removeEventListener("astro:before-preparation", onLeave));
	// After a ClientRouter swap the old page's listeners go (popstate and the events are on the window and the root).
	const onSwap = () => {
		for (const unbind of unbinds.reverse()) unbind();
		document.removeEventListener("astro:before-swap", onSwap);
	};
	document.addEventListener("astro:before-swap", onSwap);

	// The URL's type and picks, then the box's query (what the part's script wrote from the URL, or what was typed).
	const url = readUrl(location.search);
	for (const [facet, value] of pickToggles({}, url.picks)) c.togglePick(facet, value);
	if (url.type) c.setType(url.type);
	render(p, c.getState());
	if (p.input.value.trim()) c.input(p.input.value);
	c.preload().catch(() => {});
	if (root.hasAttribute("data-search-submit")) {
		root.removeAttribute("data-search-submit");
		submit();
	}
}

type Select = ReturnType<typeof bindEvents>["select"];

function action(p: Page, e: MouseEvent, select: Select): void {
	const el = e.target as Element | null;
	if (e.type === "auxclick" && e.button !== 1) return;
	const result = el?.closest?.<HTMLElement>("a[data-search-position]");
	if (result && p.results.contains(result)) {
		const i = Number(result.getAttribute("data-search-position")) - 1;
		const option = p.slice.options[i];
		if (option) select(option, i + 1);
		return;
	}
	if (e.type !== "click") return;
	const target = el?.closest?.("[data-action]");
	if (!target || !p.root.contains(target)) return;
	const c = p.controller;
	switch (target.getAttribute("data-action")) {
		case "retry":
			c.retry();
			p.input.focus();
			break;
		case "all-types":
			c.searchAllTypes();
			p.input.focus();
			break;
		case "facet":
			c.togglePick(target.getAttribute("data-facet") ?? "", target.getAttribute("data-value") ?? "");
			break;
	}
}

/** "Show more results": the next PAGE_SIZE pages. Focus stays on the button; the new first result is read with the count. */
function more(p: Page): void {
	const s = p.controller.getState();
	if (!s.result) return;
	const from = p.slice.shown;
	p.shown += PAGE_SIZE;
	draw(p, s);
	const first = p.results.querySelectorAll<HTMLElement>("[data-search-title] a[data-search-position]")[from];
	if (!first) return;
	if (p.more.hidden) first.focus();
	const text = fill(p.words.moreShown, { position: from + 1, total: s.result.total, title: first.textContent ?? "" });
	p.live.textContent = "";
	requestAnimationFrame(() => (p.live.textContent = text));
}

interface Ctx {
	mark: Record<string, string>;
}

/** Text with a <mark> around each range, into `el`. */
function setText(el: Element, text: string, ranges: [number, number][] | undefined, ctx: Ctx): void {
	el.textContent = "";
	el.append(...marked(document, text, ranges ?? [], ctx.mark));
}

function setLink(a: HTMLAnchorElement, record: SearchRecord, position: number): void {
	if (record.url !== undefined && isSafeUrl(record.url)) a.href = record.url;
	else a.removeAttribute("href");
	a.setAttribute("data-search-position", String(position));
}

/** One result: the breadcrumb (crumbOf()), the title link, the snippet and the matched sections as sub-links. */
function result(p: Page, item: ResultItem, position: () => number, ctx: Ctx): HTMLElement {
	const li = cloneTemplate(template(p.root, "result"));
	const crumb = li.querySelector<HTMLElement>("[data-search-crumb]");
	if (crumb) fillCrumb(document, crumb, crumbOf(item.page, p.settings));
	const title = li.querySelector<HTMLElement>("[data-search-title]")!;
	const a = title.querySelector<HTMLAnchorElement>("a[data-search-link]")!;
	setText(a, item.page.title, item.highlight.title, ctx);
	setLink(a, item.page, position());
	const snippet = li.querySelector<HTMLElement>("[data-search-snippet]")!;
	if (item.highlight.snippet.text) setText(snippet, item.highlight.snippet.text, item.highlight.snippet.ranges, ctx);
	else snippet.remove();
	const list = li.querySelector<HTMLElement>("[data-search-headings]")!;
	if (!item.headings.length) list.remove();
	const headingTpl = template(p.root, "heading");
	for (const h of item.headings) {
		const row = cloneTemplate(headingTpl);
		const link = row.querySelector<HTMLAnchorElement>("a[data-search-link]")!;
		setText(link.querySelector("[data-search-title]")!, h.record.heading ?? h.record.title, h.highlight.heading ?? h.highlight.title, ctx);
		setLink(link, h.record, position());
		const text = row.querySelector<HTMLElement>("[data-search-snippet]")!;
		if (h.highlight.snippet.text) setText(text, h.highlight.snippet.text, h.highlight.snippet.ranges, ctx);
		else text.remove();
		list.append(row);
	}
	return li;
}

/** The results shown: one list, or a section per group under its heading (the titles one level down). */
function results(p: Page, s: State): HTMLElement[] {
	p.slice = slicePages(s.result, p.shown);
	if (!s.result || !p.slice.groups.length) return [];
	const ctx: Ctx = { mark: markAttrs(template(p.root, "mark")) };
	let n = 0;
	const position = () => ++n;
	const listTpl = template(p.root, "list");
	const grouped = p.slice.groups.some((g) => g.key !== "");
	const group: GroupBy = grouped ? (p.settings?.group.page ?? false) : false;
	const groupTpl = template(p.root, "group");
	const out: HTMLElement[] = [];
	for (const g of p.slice.groups) {
		const list = cloneTemplate(listTpl);
		if (!grouped) {
			for (const item of g.items) list.append(result(p, item, position, ctx));
			out.push(list);
			continue;
		}
		const section = cloneTemplate(groupTpl);
		const heading = section.querySelector<HTMLElement>("[data-search-group-label]")!;
		heading.id = nextId("search-group");
		heading.textContent = g.key === "" ? p.controller.strings.other : g.label;
		section.setAttribute("aria-labelledby", heading.id);
		const count = section.querySelector<HTMLElement>("[data-search-group-count]");
		if (count) count.textContent = String(groupCount(s.result, group, g.key, g.items.length));
		for (const item of g.items) list.append(result(p, item, position, ctx));
		fixTitles(list, heading.tagName.toLowerCase());
		section.append(list);
		out.push(section);
	}
	return out;
}

/** Under a group heading the titles go one level down (h2 -> h3); mixed, they keep the part's level. */
function fixTitles(list: HTMLElement, groupTag: string): void {
	const level = Math.min(6, Number(groupTag.slice(1)) + 1);
	for (const t of [...list.querySelectorAll<HTMLElement>("[data-search-title]")]) if (/^H[1-6]$/.test(t.tagName)) retag(t, `h${level}`);
}

function message(p: Page, s: State): HTMLElement | null {
	const q = s.query.trim();
	if (s.status === "error") {
		const el = cloneTemplate(template(p.root, "error"));
		el.querySelector("[data-action]")?.setAttribute("data-key", "retry");
		const label = el.querySelector<HTMLElement>("[data-search-browse-label]")!;
		const list = el.querySelector<HTMLElement>("[data-search-browse]")!;
		const row = list.firstElementChild!;
		row.remove();
		// Only links it can follow (relative or http(s)); the build checks them too.
		const links = p.config.browse.filter((link) => typeof link?.href === "string" && isSafeUrl(link.href));
		if (!links.length) {
			label.remove();
			list.remove();
			return el;
		}
		label.id = nextId("search-browse");
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
	if (!q) return null;
	if (s.status === "loading" || s.status === "idle") return cloneTemplate(template(p.root, "loading"));
	if (s.result && s.result.total === 0) {
		const el = cloneTemplate(template(p.root, "empty"));
		el.querySelector("[data-search-empty-text]")!.textContent = fill(p.controller.strings.noResults, { query: q });
		const all = el.querySelector<HTMLElement>('[data-action="all-types"]')!;
		if (s.type !== null || Object.keys(s.picks).length > 0) all.setAttribute("data-key", "all-types");
		else all.remove();
		suggestedLinks(el, p.settings?.suggested, isSafeUrl, nextId("search-suggested"));
		return el;
	}
	return null;
}

function tabTypes(p: Page): string[] {
	const all = Object.keys(p.settings?.types ?? {});
	const only = typesOf(p.root);
	return only.length ? all.filter((t) => only.includes(t)) : all;
}

function tabs(p: Page, s: State, types: string[]): HTMLElement[] {
	const counts = new Map((s.result?.types ?? []).map((t) => [t.value, t.count]));
	const total = types.reduce((n, t) => n + (counts.get(t) ?? 0), 0);
	const tpl = template(p.root, "tab");
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
	return [tab("", p.controller.strings.allTypes, total), ...shown.map((t) => tab(t, typeLabel(p, t), counts.get(t) ?? 0))];
}

function facets(p: Page, s: State): HTMLElement[] {
	if (!s.capabilities?.facets || !s.result) return [];
	const groupTpl = template(p.root, "facet-group");
	const facetTpl = template(p.root, "facet");
	const out: HTMLElement[] = [];
	for (const [facet, values] of Object.entries(s.result.facets)) {
		const shown = values.filter((v) => v.count > 0 || v.picked);
		if (!shown.length) continue;
		const el = cloneTemplate(groupTpl);
		const label = el.querySelector<HTMLElement>("[data-search-facet-label]")!;
		label.id = nextId("search-facet");
		label.textContent = ownValue(p.settings?.facets, facet)?.label ?? facet;
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

/** The results, the count and the more button. */
function draw(p: Page, s: State): void {
	replace(p.results, results(p, s));
	p.more.hidden = !p.slice.more;
	// No results: the message says so, so the count line hides.
	p.count.hidden = !s.result || s.result.total === 0;
	p.count.textContent = s.result ? countText(p.controller.strings, s.result.total) : "";
}

function render(p: Page, s: State): void {
	const last = p.last;
	const changed = (k: keyof State) => last[k] !== s[k];
	if (!(["result", "status", "query", "type", "picks", "capabilities"] as const).some(changed)) return;
	p.last = { ...s };

	// A new search starts at the first page of results.
	if (changed("query") || changed("type") || changed("picks")) p.shown = PAGE_SIZE;
	if (changed("result") || changed("status") || changed("query") || changed("type") || changed("picks")) draw(p, s);
	replace(p.message, [message(p, s)].filter((n): n is HTMLElement => n !== null));

	// The tabs show while there is a type to pick: "All" alone (no type has a match, none is picked) hides the row.
	const types = tabTypes(p);
	const row = s.status === "ready" && types.length > 1 ? tabs(p, s, types) : [];
	const showTabs = row.length > 1;
	if (showTabs) {
		replace(p.tablist, row);
		p.unbindTabs ??= bindTabs(p.tablist, p.controller, { panel: p.panel });
	}
	p.tablist.hidden = !showTabs;
	p.typeRow.hidden = !showTabs;

	const rows = facets(p, s);
	replace(p.facets, rows);
	p.facets.hidden = rows.length === 0;

	// The URL follows the search: the history entry is replaced (a submit adds one, in mount()).
	const next = writeUrl(urlState(s), location.search, facetNames(p));
	if (next !== location.search) history.replaceState(history.state, "", here(next));
}
