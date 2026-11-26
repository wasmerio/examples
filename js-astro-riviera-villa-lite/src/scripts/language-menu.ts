/**
 * Language menu of the header: opens on click or with the arrow keys, closes with Escape,
 * a click outside or when focus leaves it. Arrow keys, Home and End move between languages.
 */
export function initLanguageMenu(root: HTMLElement): void {
  const button = root.querySelector<HTMLButtonElement>('[data-lang-button]');
  const list = root.querySelector<HTMLElement>('[data-lang-list]');
  if (!button || !list) return;
  const links = () => [...list.querySelectorAll<HTMLAnchorElement>('a')];

  const isOpen = () => button.getAttribute('aria-expanded') === 'true';
  const open = (focus?: 'first' | 'last' | 'current') => {
    list.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    const items = links();
    const target =
      focus === 'first'
        ? items[0]
        : focus === 'last'
          ? items[items.length - 1]
          : focus === 'current'
            ? (items.find((a) => a.getAttribute('aria-current') === 'page') ?? items[0])
            : undefined;
    target?.focus();
  };
  const close = (returnFocus = false) => {
    if (!isOpen()) return;
    list.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (returnFocus) button.focus();
  };

  button.addEventListener('click', () => (isOpen() ? close() : open()));
  button.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      open('current');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      open('last');
    }
  });

  list.addEventListener('keydown', (event) => {
    const items = links();
    const index = items.indexOf(document.activeElement as HTMLAnchorElement);
    const moves: Record<string, number> = {
      ArrowDown: (index + 1) % items.length,
      ArrowUp: (index - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    };
    const next = moves[event.key];
    if (next !== undefined) {
      event.preventDefault();
      items[next]?.focus();
    }
  });

  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      event.preventDefault();
      close(true);
    }
  });
  root.addEventListener('focusout', (event) => {
    if (!root.contains(event.relatedTarget as Node | null)) close();
  });
  document.addEventListener('click', (event) => {
    if (!root.contains(event.target as Node)) close();
  });
  // Back after switching language: the browser may restore this page with the list still open.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) close();
  });
}
