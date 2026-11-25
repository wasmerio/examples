function setupArchiveFilters(root: HTMLElement) {
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-archive-filter-value]')];
  const entries = [...document.querySelectorAll<HTMLElement>('[data-archive-entry]')];
  const years = [...document.querySelectorAll<HTMLElement>('[data-archive-year]')];
  const resultCount = root.querySelector<HTMLElement>('[data-archive-result-count]');
  const emptyState = root.querySelector<HTMLElement>('[data-archive-empty]');
  const available = new Set(buttons.map((button) => button.dataset.archiveFilterValue || ''));

  function readState() {
    const url = new URL(window.location.href);
    const requested = url.searchParams.get('tag');
    if (requested && available.has(requested)) return requested;
    if (requested !== null) {
      url.searchParams.delete('tag');
      window.history.replaceState({}, '', url);
    }
    return '';
  }

  function entryTags(entry: HTMLElement) {
    return JSON.parse(entry.dataset.tags || '[]') as string[];
  }

  function applyState(tag: string) {
    for (const button of buttons) {
      button.setAttribute(
        'aria-pressed',
        String((button.dataset.archiveFilterValue || '') === tag)
      );
    }

    let visibleCount = 0;
    for (const entry of entries) {
      entry.hidden = Boolean(tag) && !entryTags(entry).includes(tag);
      if (!entry.hidden) visibleCount += 1;
    }

    for (const year of years) {
      year.hidden = !year.querySelector<HTMLElement>('[data-archive-entry]:not([hidden])');
    }

    if (resultCount) resultCount.textContent = String(visibleCount);
    if (emptyState) emptyState.hidden = visibleCount > 0;
  }

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const value = button.dataset.archiveFilterValue || '';
      const url = new URL(window.location.href);
      if (value) url.searchParams.set('tag', value);
      else url.searchParams.delete('tag');
      window.history.pushState({}, '', url);
      applyState(readState());
    });
  }

  window.addEventListener('popstate', () => applyState(readState()));
  applyState(readState());
  root.hidden = false;
}

for (const root of document.querySelectorAll<HTMLElement>('[data-archive-filter-root]')) {
  setupArchiveFilters(root);
}
