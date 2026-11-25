export {};

/*
 * The table of contents lives in the Dock: one panel, opened from the dock
 * control, positioned by the dock's own placement (above the bottom capsule,
 * left of the side capsule). This script owns its open state, the active
 * heading, and the pin toggle.
 */

const dock = document.querySelector<HTMLElement>('[data-dock]');
const panel = document.querySelector<HTMLElement>('[data-toc-panel]');
const toggle = document.querySelector<HTMLElement>('[data-toc-toggle]');
const closeButton = document.querySelector<HTMLElement>('[data-toc-close]');
const pinButton = document.querySelector<HTMLButtonElement>('[data-toc-pin-toggle]');

if (panel && toggle) setupToc(panel, toggle);

function setupToc(panel: HTMLElement, toggle: HTMLElement) {
  const root = document.documentElement;
  const links = [...panel.querySelectorAll<HTMLAnchorElement>('[data-toc-link]')];
  const scroller = panel.querySelector<HTMLElement>('[data-toc-scroll]');

  const isPinned = () => root.dataset.tocPin === 'true';
  const isSideDock = () => dock?.dataset.placement === 'side';
  // The pin only takes effect beside the article; in the bottom capsule it is
  // hidden, so it must not stop the panel from dismissing either.
  const staysOpen = () => isPinned() && isSideDock();
  const isOpen = () => !panel.classList.contains('hidden');

  function revealActive() {
    if (!scroller) return;
    const active = scroller.querySelector<HTMLElement>('.toc-active');
    if (!active || scroller.scrollHeight <= scroller.clientHeight) return;
    const box = scroller.getBoundingClientRect();
    const rect = active.getBoundingClientRect();
    if (rect.top < box.top) scroller.scrollTop -= box.top - rect.top + 8;
    else if (rect.bottom > box.bottom) scroller.scrollTop += rect.bottom - box.bottom + 8;
  }

  function open() {
    panel.classList.remove('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    // The list has to be laid out before the scroller can measure it.
    requestAnimationFrame(revealActive);
  }

  function close() {
    panel.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => (isOpen() ? close() : open()));
  closeButton?.addEventListener('click', close);

  // Clicking anywhere outside the panel dismisses it, unless it is pinned.
  document.addEventListener('click', (event) => {
    const target = event.target as Node;
    if (!isOpen() || staysOpen() || panel.contains(target) || toggle.contains(target)) return;
    close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) close();
  });

  // Following a heading keeps the panel open only when pinned; otherwise the
  // reader is done with it.
  for (const link of links) {
    link.addEventListener('click', () => {
      if (!staysOpen()) close();
    });
  }

  // Pin: a page-wide preference (the theme script restores it before paint).
  function syncPin() {
    if (!pinButton) return;
    const pinned = isPinned();
    const label = (pinned ? pinButton.dataset.labelUnpin : pinButton.dataset.labelPin) ?? '';
    pinButton.setAttribute('aria-pressed', String(pinned));
    pinButton.setAttribute('aria-label', label);
    pinButton.title = label;
  }

  pinButton?.addEventListener('click', () => {
    if (isPinned()) {
      delete root.dataset.tocPin;
      // Written, not removed: with a pinned site default, an absent key would
      // read as "pinned" again on the next page.
      localStorage.setItem('toc-pin', 'false');
    } else {
      root.dataset.tocPin = 'true';
      localStorage.setItem('toc-pin', 'true');
    }
    syncPin();
  });

  syncPin();

  // Pinned panels only exist beside the article: the bottom capsule would
  // cover the text, so the pin control hides there (see chrome.css).
  const syncPinnedPanel = () => {
    if (isPinned() && isSideDock()) open();
    else if (!isSideDock()) close();
  };
  syncPinnedPanel();
  document.addEventListener('dock:placement', syncPinnedPanel);

  // Active heading: the last one to pass the upper third of the viewport.
  // A scroll comparison rather than an IntersectionObserver band, because short
  // sections can leave the band empty between two headings.
  const headingElements = [
    ...new Set(
      links
        .map((link) => decodeURIComponent(link.hash.slice(1)))
        .filter(Boolean)
        .map((id) => document.getElementById(id))
    )
  ].filter(Boolean) as HTMLElement[];

  function setActive(id: string) {
    for (const link of links) {
      link.classList.toggle('toc-active', decodeURIComponent(link.hash.slice(1)) === id);
    }
    if (isOpen()) revealActive();
  }

  function updateActive() {
    if (headingElements.length === 0) return;
    const reference = window.innerHeight * 0.3;
    let current: HTMLElement | undefined;
    for (const heading of headingElements) {
      if (heading.getBoundingClientRect().top > reference) break;
      current = heading;
    }
    // A final short section never reaches the line: at the page end it wins.
    const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atEnd) current = headingElements[headingElements.length - 1];
    setActive(current?.id ?? '');
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updateActive();
    });
  }

  updateActive();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}
