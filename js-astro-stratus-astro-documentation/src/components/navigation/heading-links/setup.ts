// Also registered in `editor-live-sync.js`; the hover `#` lives in `base/_prose.css`.
const TOAST_MS = 1600;

let bound = false;

function showToast(message: string): void {
  let toast = document.querySelector<HTMLElement>(".heading-link-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "heading-link-toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.dataset.visible = "";
  clearTimeout(Number(toast.dataset.timer));
  toast.dataset.timer = String(setTimeout(() => delete toast.dataset.visible, TOAST_MS));
}

export function setupHeadingLinks(): void {
  // Bound once, resolving the heading at event time, so view transitions can't stack listeners.
  if (bound) return;
  bound = true;

  document.addEventListener("click", (event) => {
    const heading = (event.target as HTMLElement | null)?.closest<HTMLElement>(
      ".prose h2[id], .prose h3[id]"
    );

    // Steps and tabs headings have no anchor affordance in `base/_prose.css`; keep the two in step.
    if (!heading || heading.closest(".step-content, .content-selector-tab")) return;

    event.preventDefault();

    const url = `${location.href.split("#")[0]}#${heading.id}`;

    history.replaceState(null, "", `#${heading.id}`);
    navigator.clipboard
      ?.writeText(url)
      .then(() => showToast("Link to this section copied"))
      .catch(() => {});
  });
}
