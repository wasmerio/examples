function activateTab(button: HTMLButtonElement) {
  const root = button.closest<HTMLElement>('[data-tabs]');
  if (!root) return;

  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-tabs-panel]')];

  for (const tab of tabs) {
    const active = tab === button;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  }

  for (const panel of panels) {
    panel.hidden = panel.id !== button.getAttribute('aria-controls');
  }
}

document.addEventListener('click', (event) => {
  const button = (event.target as Element | null)?.closest<HTMLButtonElement>(
    '.tabs-trigger[role="tab"]'
  );
  if (button) activateTab(button);
});

document.addEventListener('keydown', (event) => {
  const current = (event.target as Element | null)?.closest<HTMLButtonElement>(
    '.tabs-trigger[role="tab"]'
  );
  if (!current || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

  const root = current.closest<HTMLElement>('[data-tabs]');
  const tabs = root ? [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')] : [];
  const index = tabs.indexOf(current);
  if (index < 0) return;

  event.preventDefault();
  const nextIndex =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? tabs.length - 1
        : event.key === 'ArrowRight'
          ? (index + 1) % tabs.length
          : (index - 1 + tabs.length) % tabs.length;

  tabs[nextIndex]?.focus();
  if (tabs[nextIndex]) activateTab(tabs[nextIndex]);
});
