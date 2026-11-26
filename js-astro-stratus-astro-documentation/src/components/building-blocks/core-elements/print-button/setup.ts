/**
 * Also registered in `editor-live-sync.js`: inline scripts don't run in the
 * CloudCannon editor. The control renders `hidden` and is revealed here.
 */
export function setupPrintButton(root: HTMLElement): void {
  if (root.hasAttribute("data-print-initialized")) return;
  root.setAttribute("data-print-initialized", "");

  const button = root.querySelector<HTMLButtonElement>("button");

  if (!button) return;

  root.hidden = false;
  button.addEventListener("click", () => window.print());
}

export function setupAllPrintButtons(): void {
  document.querySelectorAll<HTMLElement>(".print-button").forEach(setupPrintButton);
}
