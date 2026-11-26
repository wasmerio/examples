/**
 * Also registered in `editor-live-sync.js`: inline scripts don't run in the
 * CloudCannon editor. `CodeBlockSurface` renders its button; a bare Markdown
 * fence `<pre>` gets one injected here.
 */
const RESET_MS = 1600;

function copyButton(): HTMLButtonElement {
  const button = document.createElement("button");

  button.type = "button";
  button.className = "code-surface-copy";
  button.innerHTML =
    '<span class="code-surface-copy-idle">Copy</span>' +
    '<span class="code-surface-copy-done">Copied</span>';

  return button;
}

function bind(
  root: HTMLElement,
  button: HTMLButtonElement,
  source: () => HTMLElement | null
): void {
  let timer: ReturnType<typeof setTimeout> | undefined;

  button.addEventListener("click", async () => {
    const el = source();

    if (!el) return;

    try {
      await navigator.clipboard.writeText(el.innerText);
      button.dataset.state = "copied";
      clearTimeout(timer);
      timer = setTimeout(() => delete button.dataset.state, RESET_MS);
    } catch {
      /* Clipboard denied — the code is still selectable, so say nothing. */
    }
  });

  root.setAttribute("data-code-initialized", "");
}

export function setupCodeSurface(root: HTMLElement): void {
  if (root.hasAttribute("data-code-initialized")) return;

  const button = root.querySelector<HTMLButtonElement>(".code-surface-copy");

  if (!button) return;

  // Tabs keep every panel in the DOM; only the visible one should be copied.
  bind(
    root,
    button,
    () =>
      root.querySelector<HTMLElement>("[data-code-source]:not([hidden])") ??
      root.querySelector<HTMLElement>("[data-code-source]")
  );
}

export function setupCodeFence(pre: HTMLElement): void {
  if (pre.hasAttribute("data-code-initialized")) return;

  const button = copyButton();

  pre.appendChild(button);
  bind(pre, button, () => pre.querySelector<HTMLElement>("code"));
}

export function setupAllCodeSurfaces(): void {
  document.querySelectorAll<HTMLElement>(".code-surface").forEach(setupCodeSurface);
  document.querySelectorAll<HTMLElement>(".prose > pre.astro-code").forEach(setupCodeFence);
}
