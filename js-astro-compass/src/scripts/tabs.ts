const activateTab = (triggers: HTMLButtonElement[], panels: HTMLElement[], next: HTMLButtonElement, focus = false) => {
  triggers.forEach((button) => {
    const isActive = button === next;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  panels.forEach((panel) => {
    panel.hidden = panel.id !== next.dataset.tabTarget;
  });

  if (focus) next.focus();
};

const keyOffsets: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

document.querySelectorAll<HTMLElement>('[data-tabs-root]').forEach((root) => {
  const triggers = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-tab-trigger]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-tab-panel]'));

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => activateTab(triggers, panels, trigger));
    trigger.addEventListener('keydown', (event) => {
      let nextIndex: number | undefined;

      if (event.key in keyOffsets) nextIndex = (index + keyOffsets[event.key] + triggers.length) % triggers.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = triggers.length - 1;

      if (nextIndex === undefined) return;
      event.preventDefault();
      activateTab(triggers, panels, triggers[nextIndex], true);
    });
  });
});
