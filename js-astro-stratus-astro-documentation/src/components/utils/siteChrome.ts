/**
 * Live-patches the docs chrome no editable region can bind to: sidebar placement
 * and the group crumb (derived across every doc via the shared `buildDocsNav` —
 * never reimplement it here) and the boolean switches. A switched control is
 * always rendered and hidden with `data-toggle-hidden`; gating it at build time
 * leaves the editor nothing to reveal. Group labels must not become a text region:
 * membership comes from each page's `group`, so the rebuild undoes a rename.
 */

import type {
  CloudCannonEditorWindow,
  CloudCannonJavaScriptV1API,
  CloudCannonJavaScriptV1APICollection,
} from "@cloudcannon/javascript-api";
import { asRecord, framed, resolveDataSource } from "@component-utils/editorData";
import { onPageLoad } from "@component-utils/onPageLoad";
import { buildDocsNav, type DocsNav, type DocsNavPage } from "@utils/docsNavModel";

declare const window: CloudCannonEditorWindow;

const HEADER = { dataset: "header", path: "src/data/header.json" };
const SIDEBAR = { dataset: "sidebar", path: "src/data/sidebar.json" };
const PAGE_TOOLS = { dataset: "pageTools", path: "src/data/pageTools.json" };
const ANNOUNCEMENT = { dataset: "announcementBar", path: "src/data/announcementBar.json" };

const text = (value: unknown) => String(value ?? "").trim();

function docTrail(): HTMLElement | null {
  return document.querySelector<HTMLElement>(".doc-breadcrumbs");
}

/** The group crumb is the only url-less crumb that is not the current page. */
function setGroupCrumb(name: string) {
  const trail = docTrail();

  if (!trail) return;

  const existing = trail.querySelector<HTMLElement>(".breadcrumbs-current:not([aria-current])");

  if (!name) {
    existing?.closest(".breadcrumbs-item")?.remove();

    return;
  }

  if (existing) {
    existing.textContent = name;

    return;
  }

  const current = trail.querySelector<HTMLElement>('.breadcrumbs-current[aria-current="page"]');
  const home = trail.querySelector<HTMLElement>(".breadcrumbs-trail > .breadcrumbs-item");
  const template = current?.closest(".breadcrumbs-item");

  if (!template || !home) return;

  const item = template.cloneNode(true) as HTMLElement;
  const label = item.querySelector<HTMLElement>(".breadcrumbs-current");

  label?.removeAttribute("aria-current");

  if (label) label.textContent = name;

  home.after(item);
}

const sidebar = () => document.querySelector<HTMLElement>(".docs-sidebar");
const sidebarInner = () => sidebar()?.querySelector<HTMLElement>(".docs-sidebar-inner") ?? null;

const itemFor = (href: string) =>
  sidebar()?.querySelector<HTMLElement>(`li[data-href="${CSS.escape(href)}"]`) ?? null;

function groupElements(): HTMLElement[] {
  return [...(sidebar()?.querySelectorAll<HTMLElement>(".docs-sidebar-group") ?? [])];
}

const groupNamed = (name: string) =>
  groupElements().find((group) => group.dataset.group === name) ?? null;

const groupList = (group: HTMLElement) =>
  group.querySelector<HTMLElement>(":scope > .docs-sidebar-list");

/** A group with no pages is not rendered, so a page moving into one builds it. */
function createGroup(name: string): HTMLElement | null {
  const template = groupElements()[0];
  const inner = sidebarInner();

  if (!template || !inner) return null;

  const group = template.cloneNode(true) as HTMLElement;
  const label = group.querySelector<HTMLElement>(".docs-sidebar-group-label span");
  const list = groupList(group);

  group.dataset.group = name;
  group.classList.remove("is-collapsible");
  (group as HTMLDetailsElement).open = true;

  if (label) label.textContent = name;

  if (list) list.replaceChildren();

  inner.append(group);

  return group;
}

/** A page with no `group` has no sidebar entry, so gaining one builds it. */
function createItem(page: DocsNavPage): HTMLElement | null {
  const template = sidebar()?.querySelector<HTMLElement>("li[data-href]");

  if (!template) return null;

  const item = template.cloneNode(true) as HTMLElement;
  const link = item.querySelector<HTMLAnchorElement>(":scope > a");

  item.querySelector(":scope > .docs-sidebar-children")?.remove();

  if (!link) return null;

  link.removeAttribute("aria-current");
  link.setAttribute("href", page.href);

  return item;
}

function childList(item: HTMLElement): HTMLElement | null {
  const existing = item.querySelector<HTMLElement>(":scope > .docs-sidebar-children");

  if (existing) return existing;

  const template = sidebar()?.querySelector<HTMLElement>(".docs-sidebar-children");
  const list = template
    ? (template.cloneNode(false) as HTMLElement)
    : Object.assign(document.createElement("ul"), {
        className: "docs-sidebar-list docs-sidebar-children",
      });

  list.replaceChildren();
  item.append(list);

  return list;
}

/** `seen` collects every href still in the nav; the caller removes the rest. */
function syncList(list: HTMLElement, pages: DocsNavPage[], seen: Set<string>) {
  for (const page of pages) {
    const item = itemFor(page.href) ?? createItem(page);

    if (!item) continue;

    seen.add(page.href);
    item.dataset.href = page.href;
    item.dataset.order = String(page.order);

    const link = item.querySelector<HTMLElement>(":scope > a");

    if (link && link.textContent !== page.title) link.textContent = page.title;

    list.append(item);

    if (page.children.length > 0) {
      const nested = childList(item);

      if (nested) syncList(nested, page.children, seen);
    } else {
      item.querySelector(":scope > .docs-sidebar-children")?.remove();
    }
  }
}

/**
 * Derive from every doc, not `currentFile()`: other pages are served as built,
 * so a page whose `group` changed would snap back on navigation.
 */
function syncSidebar(nav: DocsNav) {
  const inner = sidebarInner();

  if (!inner) return;

  const seen = new Set<string>();

  for (const group of nav.groups) {
    const element = groupNamed(group.name) ?? createGroup(group.name);
    const list = element && groupList(element);

    if (!element || !list) continue;

    inner.append(element);
    syncList(list, group.pages, seen);
  }

  for (const item of sidebar()?.querySelectorAll<HTMLElement>("li[data-href]") ?? []) {
    if (!seen.has(item.dataset.href ?? "")) item.remove();
  }

  for (const group of groupElements()) {
    if (!groupList(group)?.querySelector("li[data-href]")) group.remove();
  }
}

function syncCrumbs(nav: DocsNav) {
  setGroupCrumb(nav.byHref.get(location.pathname)?.group ?? "");
}

function setLeadLabel(label: string) {
  const lead = sidebar()?.querySelector<HTMLElement>("[data-nav-lead] a");

  if (lead) lead.textContent = label || "Overview";
}

/** Re-asserting `open` on every read would snap shut a group expanded by hand. */
const collapsedState = new Map<string, boolean>();

/** Collapsed state only — `syncSidebar` already placed the groups in order. */
function setGroups(navGroups: Record<string, unknown>[]) {
  for (const group of groupElements()) {
    const name = group.dataset.group ?? "";
    const collapsed = navGroups.find((entry) => text(entry.name) === name)?.collapsed === true;

    group.classList.toggle("is-collapsible", collapsed);

    if (collapsedState.get(name) !== collapsed) {
      collapsedState.set(name, collapsed);
      (group as HTMLDetailsElement).open =
        !collapsed || Boolean(group.querySelector("[aria-current]"));
    }
  }
}

/** Listeners bound to a previous page's file check this and no-op after navigation. */
let generation = 0;

/** A control gated by both a page and a site switch recomputes when either fires. */
let pageData: Record<string, unknown> | undefined;
let headerData: Record<string, unknown> | undefined;
let sidebarData: Record<string, unknown> | undefined;
let pageToolsData: Record<string, unknown> | undefined;

/**
 * `data.get()` returns raw frontmatter, so an omitted key is `undefined` — and
 * the schema defaults these to `true`, so absent must read as on.
 */
const pageOn = (value: unknown) => value !== false;

/** A site switch. Absent is off here: that is the `.astro` destructure default. */
const siteOn = (value: unknown) => Boolean(value);

function setToggled(selector: string, visible: boolean) {
  document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
    element.toggleAttribute("data-toggle-hidden", !visible);
  });
}

/** Each control waits for its handles: an unread one looks switched off and flashes it hidden. */
function applyToggles() {
  if (headerData) {
    setToggled(".search", siteOn(headerData.search));
    setToggled(".theme-toggle", siteOn(headerData.themeToggle));
    setToggled(".docs-topbar-version", siteOn(headerData.showVersionNumber));
  }

  if (pageData) {
    setToggled(".docs-pager", pageOn(pageData.showPager));
    setToggled(".docs-toc-rail > .toc", pageOn(pageData.showTableOfContents));
  }

  if (pageData && pageToolsData) {
    setToggled(
      ".copy-page",
      pageOn(pageData.showCopyPage) && siteOn(asRecord(pageToolsData.copyPage).enabled)
    );
    setToggled(
      ".page-feedback",
      pageOn(pageData.showFeedback) && siteOn(asRecord(pageToolsData.feedback).enabled)
    );
  }

  if (!pageData) return;

  const showTableOfContents = pageOn(pageData.showTableOfContents);

  // The rail keeps its grid column while it holds a hidden table of contents.
  const shell = document.querySelector<HTMLElement>(".docs-shell");
  const rail = document.querySelector(".docs-toc-rail > .toc");

  if (shell && rail) shell.classList.toggle("is-wide", !showTableOfContents);
}

function subscribe(
  emitters: { addEventListener(event: "change", fn: () => void): void }[],
  repaint: () => void
) {
  for (const emitter of emitters) emitter.addEventListener("change", repaint);

  repaint();
}

async function connectDataFiles(api: CloudCannonJavaScriptV1API) {
  const header = await resolveDataSource(api, HEADER);

  if (header) {
    subscribe(
      header.emitters,
      framed(async () => {
        headerData = asRecord(await header.file.data.get());
        applyToggles();
      })
    );
  } else {
    console.warn(`[siteChrome] ${HEADER.path} is not editable here.`);
  }

  const sidebarSource = await resolveDataSource(api, SIDEBAR);

  if (sidebarSource) {
    subscribe(
      sidebarSource.emitters,
      framed(async () => {
        const data = asRecord(await sidebarSource.file.data.get());
        const navGroups = Array.isArray(data.navGroups) ? data.navGroups.map(asRecord) : [];

        sidebarData = data;

        setLeadLabel(text(data.homeLabel));
        setGroups(navGroups);
        void resyncNav();
      })
    );
  } else {
    console.warn(`[siteChrome] ${SIDEBAR.path} is not editable here.`);
  }

  const pageTools = await resolveDataSource(api, PAGE_TOOLS);

  if (pageTools) {
    subscribe(
      pageTools.emitters,
      framed(async () => {
        pageToolsData = asRecord(await pageTools.file.data.get());
        applyToggles();
      })
    );
  } else {
    console.warn(`[siteChrome] ${PAGE_TOOLS.path} is not editable here.`);
  }

  const announcement = await resolveDataSource(api, ANNOUNCEMENT);

  if (announcement) {
    subscribe(
      announcement.emitters,
      framed(async () => {
        const data = asRecord(await announcement.file.data.get());

        // The bar's own text is an editable region; only the switch needs this.
        setToggled(".announcement-bar-text", siteOn(data.enabled));
      })
    );
  } else {
    console.warn(`[siteChrome] ${ANNOUNCEMENT.path} is not editable here.`);
  }
}

const DOCS_COLLECTION = "documentation";
const DOCS_BASE = "src/content/docs/";

/** `src/content/docs/theming/token-reference.mdx` -> `theming/token-reference`. */
function entryId(path: string): string | undefined {
  const rest = path.replace(/^\//, "");

  if (!rest.startsWith(DOCS_BASE)) return undefined;

  return rest.slice(DOCS_BASE.length).replace(/\.mdx?$/, "");
}

let docsCollection: CloudCannonJavaScriptV1APICollection | undefined;

async function resyncNav() {
  if (!docsCollection) return;

  let files;

  try {
    files = await docsCollection.items();
  } catch {
    return;
  }

  const entries = [];

  for (const file of files) {
    const id = entryId(file.path);

    if (!id) continue;

    const data = asRecord(await file.data.get());

    entries.push({
      id,
      title: text(data.title) || id,
      group: text(data.group) || undefined,
      order: typeof data.order === "number" ? data.order : 0,
    });
  }

  if (entries.length === 0) return;

  const nav = buildDocsNav(entries, {
    navGroups: (Array.isArray(sidebarData?.navGroups) ? sidebarData.navGroups : []) as {
      name: string;
      collapsed?: boolean;
    }[],
    homeLabel: text(sidebarData?.homeLabel),
  });

  syncSidebar(nav);
  syncCrumbs(nav);
  setGroups(Array.isArray(sidebarData?.navGroups) ? sidebarData.navGroups.map(asRecord) : []);
}

function connectCollection(api: CloudCannonJavaScriptV1API) {
  if (docsCollection) return;

  try {
    docsCollection = api.collection(DOCS_COLLECTION);
  } catch {
    console.warn(`[siteChrome] collection "${DOCS_COLLECTION}" is not readable here.`);

    return;
  }

  docsCollection.addEventListener(
    "change",
    framed(() => void resyncNav())
  );
}

let currentFileHandle: unknown;

function connectCurrentFile(api: CloudCannonJavaScriptV1API) {
  const file = api.currentFile();

  if (!file || file === currentFileHandle) return;
  currentFileHandle = file;

  const mine = generation;

  const repaint = framed(async () => {
    if (mine !== generation) return;

    const data = asRecord(await file.data.get());

    pageData = data;

    applyToggles();
    // The open page reaches the sidebar only through the collection resync.
    void resyncNav();
  });

  file.addEventListener("change", repaint);
  repaint();
}

let started = false;

function start() {
  const api = window.CloudCannonAPI?.useVersion("v1", true);

  if (!api) return;

  if (!started) {
    started = true;
    connectDataFiles(api);
  }

  connectCollection(api);

  connectCurrentFile(api);
  void resyncNav();
}

export function setupSiteChrome() {
  onPageLoad(() => {
    generation += 1;
    currentFileHandle = undefined;
    collapsedState.clear();

    if (window.CloudCannonAPI) start();
    else document.addEventListener("cloudcannon:load", start, { once: true });
  });
}
