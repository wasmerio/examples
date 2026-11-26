// Also registered in `editor-live-sync.js`. Handlers are delegated from `document`
// and bound once, so view transitions can't stack listeners on detached DOM.
import { llmPrompt } from "@utils/docsMarkdown";

const RESET_MS = 1600;

const markdown = new WeakMap<HTMLElement, Promise<string>>();

let bound = false;
let resetTimer: ReturnType<typeof setTimeout> | undefined;

function setOpen(root: HTMLElement, open: boolean): void {
  const menu = root.querySelector<HTMLElement>(".copy-page-menu");
  const trigger = root.querySelector<HTMLElement>(".copy-page-trigger");

  if (!menu || !trigger) return;

  menu.hidden = !open;
  trigger.setAttribute("aria-expanded", String(open));
}

function closeAll(except?: HTMLElement): void {
  for (const root of document.querySelectorAll<HTMLElement>(".copy-page")) {
    if (root !== except) setOpen(root, false);
  }
}

function pageMarkdown(root: HTMLElement): Promise<string> {
  const cached = markdown.get(root);

  if (cached) return cached;

  const href = root.dataset.markdownHref ?? "";
  const pending = fetch(href).then((response) => {
    if (!response.ok) throw new Error(`${href} responded ${response.status}`);

    return response.text();
  });

  markdown.set(root, pending);
  // A failed fetch must not poison the cache.
  pending.catch(() => markdown.delete(root));

  return pending;
}

async function payload(root: HTMLElement, action: string): Promise<string> {
  const url = location.href;

  if (action === "link") return url;

  const source = await pageMarkdown(root);

  return action === "prompt" ? llmPrompt(source, url) : source;
}

function report(root: HTMLElement, state: "copied" | "failed", message: string): void {
  const status = root.querySelector<HTMLElement>(".copy-page-status");

  root.dataset.state = state;

  if (status) status.textContent = message;

  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => {
    delete root.dataset.state;

    if (status) status.textContent = "";
  }, RESET_MS);
}

async function copy(root: HTMLElement, action: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(await payload(root, action));
    report(root, "copied", "Copied to the clipboard.");
  } catch {
    report(root, "failed", "Nothing was copied — the Markdown or the clipboard was unavailable.");
  }
}

function moveFocus(root: HTMLElement, step: number): void {
  const items = [...root.querySelectorAll<HTMLElement>(".copy-page-item")];

  if (items.length === 0) return;

  const index = items.indexOf(document.activeElement as HTMLElement);

  if (index === -1) {
    (step > 0 ? items[0] : items[items.length - 1]).focus();
    return;
  }

  items[(index + step + items.length) % items.length].focus();
}

function onClick(event: MouseEvent): void {
  const target = event.target as HTMLElement | null;
  const trigger = target?.closest<HTMLElement>(".copy-page-trigger");

  if (trigger) {
    const root = trigger.closest<HTMLElement>(".copy-page");

    if (!root) return;

    const open = trigger.getAttribute("aria-expanded") === "true";

    closeAll(root);
    setOpen(root, !open);
    return;
  }

  const item = target?.closest<HTMLElement>(".copy-page-item[data-action]");
  const root = item?.closest<HTMLElement>(".copy-page");

  if (!item || !root) {
    closeAll();
    return;
  }

  setOpen(root, false);

  // An open menu would trap focus behind the print dialog.
  if (item.dataset.action === "print") {
    window.print();
    return;
  }

  void copy(root, item.dataset.action ?? "markdown");
}

function onKeydown(event: KeyboardEvent): void {
  const root = (event.target as HTMLElement | null)?.closest<HTMLElement>(".copy-page");

  if (event.key === "Escape") {
    closeAll();
    root?.querySelector<HTMLElement>(".copy-page-trigger")?.focus();
    return;
  }

  if (!root || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) return;

  event.preventDefault();
  setOpen(root, true);
  moveFocus(root, event.key === "ArrowDown" ? 1 : -1);
}

export function setupCopyPage(root: HTMLElement): void {
  if (root.hasAttribute("data-copy-page-initialized")) return;
  root.setAttribute("data-copy-page-initialized", "");
  root.hidden = false;

  if (bound) return;
  bound = true;

  document.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeydown);
}

export function setupAllCopyPage(): void {
  document.querySelectorAll<HTMLElement>(".copy-page").forEach(setupCopyPage);
}
