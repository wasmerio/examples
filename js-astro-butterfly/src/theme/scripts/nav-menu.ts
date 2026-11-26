/**
 * Desktop nav dropdowns, following the WAI-ARIA disclosure navigation pattern:
 * `aria-expanded` on the button is the single source of truth (the CSS shows the
 * list from it), so what assistive tech hears always matches what is on screen.
 *
 *  - mouse: opens on hover and closes on leave, like the original theme;
 *  - click / Enter / Space: toggles (touch and keyboard);
 *  - Escape, focus leaving the menu, or a click elsewhere: closes.
 */
const MENU = '.has-child';
const BUTTON = ':scope > button[aria-expanded]';

const buttonOf = (menu: Element) => menu.querySelector<HTMLButtonElement>(BUTTON);
const isOpen = (menu: Element) => buttonOf(menu)?.getAttribute('aria-expanded') === 'true';

function setOpen(menu: Element, open: boolean) {
  buttonOf(menu)?.setAttribute('aria-expanded', String(open));
}

function closeAll(except?: Element | null) {
  for (const menu of document.querySelectorAll(MENU)) if (menu !== except && isOpen(menu)) setOpen(menu, false);
}

export function initNavMenu() {
  // A mouse click on a hover-opened menu must keep it open rather than toggle it shut.
  let pointerType = '';
  document.addEventListener('pointerdown', (e) => (pointerType = e.pointerType), true);

  document.addEventListener('pointerover', (e) => {
    if (e.pointerType !== 'mouse') return;
    const menu = (e.target as Element).closest(MENU);
    if (menu && !isOpen(menu)) {
      closeAll(menu);
      setOpen(menu, true);
    }
  });
  document.addEventListener('pointerout', (e) => {
    if (e.pointerType !== 'mouse') return;
    const menu = (e.target as Element).closest(MENU);
    if (menu && !menu.contains(e.relatedTarget as Node | null)) setOpen(menu, false);
  });

  document.addEventListener('click', (e) => {
    const target = e.target as Element;
    const button = target.closest<HTMLButtonElement>(`${MENU} > button[aria-expanded]`);
    const menu = button?.closest(MENU);
    closeAll(menu);
    if (!menu) return;
    const byMouse = pointerType === 'mouse' && e.detail > 0; // detail is 0 for Enter / Space
    pointerType = '';
    setOpen(menu, byMouse || !isOpen(menu));
  });

  document.addEventListener('focusout', (e) => {
    const menu = (e.target as Element).closest(MENU);
    if (menu && !menu.contains(e.relatedTarget as Node | null)) setOpen(menu, false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const menu = [...document.querySelectorAll(MENU)].find(isOpen);
    if (!menu) return;
    setOpen(menu, false);
    if (menu.contains(document.activeElement)) buttonOf(menu)?.focus();
  });

  document.addEventListener('astro:before-swap', () => closeAll());
}
