/**
 * Accessible tabs for any `[data-tabs]` block: `[data-tab]` buttons and
 * `[data-panel]` panels in the same order.
 */
export function initTabs() {
  document.querySelectorAll<HTMLElement>("[data-tabs]").forEach((root) => {
    if (root.dataset.tabsReady) return;
    root.dataset.tabsReady = "true";

    const tabs = [...root.querySelectorAll<HTMLButtonElement>("[data-tab]")];
    const panels = [...root.querySelectorAll<HTMLElement>("[data-panel]")];
    let index = Math.max(
      0,
      tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true"),
    );

    const select = (next: number, focus = false) => {
      index = (next + tabs.length) % tabs.length;
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        if (on && focus) tab.focus();
      });
      panels.forEach((panel, i) => {
        const on = i === index;
        panel.toggleAttribute("data-active", on);
        panel.toggleAttribute("inert", !on);
      });
    };

    const keys: Record<string, number> = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(i));
      tab.addEventListener("keydown", (event) => {
        if (event.key in keys) {
          event.preventDefault();
          select(index + keys[event.key], true);
        } else if (event.key === "Home" || event.key === "End") {
          event.preventDefault();
          select(event.key === "Home" ? 0 : tabs.length - 1, true);
        }
      });
    });
  });
}
