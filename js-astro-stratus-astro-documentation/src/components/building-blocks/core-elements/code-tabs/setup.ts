/**
 * Also registered in `editor-live-sync.js`: inline scripts don't run in the editor.
 * The site-wide choice is stored per tab *label*; a block without that label
 * keeps its own first tab.
 */
const STORAGE_KEY = "docs:code-language";

function readStoredLabel(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeLabel(label: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, label);
  } catch {
    /* Private mode or blocked storage — the tabs still work for this page. */
  }
}

// The editor's re-render copies the server's attributes onto the existing
// nodes, resetting every block to its first tab; these survive because the
// nodes do, and the observer puts the selection back.
const selectedIndex = new WeakMap<HTMLElement, number>();
const initialized = new WeakSet<HTMLElement>();

function getTabs(root: HTMLElement): HTMLButtonElement[] {
  return Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
}

function activateIndex(root: HTMLElement, index: number): void {
  const tabs = getTabs(root);
  const target = tabs[Math.min(index, tabs.length - 1)];

  if (!target) return;

  selectedIndex.set(root, tabs.indexOf(target));

  for (const tab of tabs) {
    const selected = tab === target;
    const panel = document.getElementById(tab.getAttribute("aria-controls") ?? "");

    if (tab.getAttribute("aria-selected") !== String(selected)) {
      tab.setAttribute("aria-selected", String(selected));
    }
    tab.tabIndex = selected ? 0 : -1;
    if (panel && panel.hidden === selected) panel.hidden = !selected;
  }
}

function activate(root: HTMLElement, label: string): void {
  const index = getTabs(root).findIndex((tab) => tab.dataset.label === label);

  if (index !== -1) activateIndex(root, index);
}

function restoreSelection(root: HTMLElement): void {
  const index = selectedIndex.get(root);

  if (index === undefined) return;

  const tabs = getTabs(root);
  const current = tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
  const panelsInSync = tabs.every(
    (tab, i) =>
      document.getElementById(tab.getAttribute("aria-controls") ?? "")?.hidden !== (i === current)
  );

  if (current !== Math.min(index, tabs.length - 1) || !panelsInSync) activateIndex(root, index);
}

export function setupCodeTabs(root: HTMLElement): void {
  root.setAttribute("data-code-tabs-initialized", "");
  if (initialized.has(root)) return;
  initialized.add(root);

  if (!getTabs(root).length) return;

  selectedIndex.set(root, 0);

  const stored = readStoredLabel();

  if (stored) activate(root, stored);

  new MutationObserver(() => restoreSelection(root)).observe(root, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["aria-selected", "hidden"],
  });

  root.addEventListener("click", (event) => {
    const tab = (event.target as HTMLElement).closest<HTMLButtonElement>('[role="tab"]');

    if (!tab?.dataset.label) return;

    storeLabel(tab.dataset.label);
    document
      .querySelectorAll<HTMLElement>(".code-tabs")
      .forEach((block) => activate(block, tab.dataset.label as string));
  });

  root.addEventListener("keydown", (event) => {
    const key = (event as KeyboardEvent).key;

    if (key !== "ArrowLeft" && key !== "ArrowRight") return;

    const tabs = getTabs(root);
    const current = tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
    const next = tabs[(current + (key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];

    event.preventDefault();
    next.focus();
    next.click();
  });
}

export function setupAllCodeTabs(): void {
  document.querySelectorAll<HTMLElement>(".code-tabs").forEach(setupCodeTabs);
}
