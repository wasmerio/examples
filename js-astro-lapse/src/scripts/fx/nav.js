// Topbar. Desktop (1200+): once the page moves, the links fold into the
// capsule; pointing at the capsule with a mouse brings them back. Below 1200
// the dots icon opens the dropdown menu and any menu link closes it.
const WIDE = 1200;
export function mount(root) {
  const capsule = root.querySelector('.capsule');
  const toggle = root.querySelector('.nav-toggle');
  let hovered = false;
  const update = () => root.classList.toggle('is-collapsed', window.scrollY > 8 && !hovered && innerWidth >= WIDE);
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  const wideMouse = (e) => e.pointerType === 'mouse' && innerWidth >= WIDE;
  capsule.addEventListener('pointerenter', (e) => { if (wideMouse(e)) { hovered = true; update(); } });
  capsule.addEventListener('pointerleave', (e) => { if (wideMouse(e)) { hovered = false; update(); } });
  update();

  const setOpen = (open) => {
    root.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  const syncToggle = () => { toggle.tabIndex = innerWidth < WIDE ? 0 : -1; if (innerWidth >= WIDE) setOpen(false); };
  syncToggle(); addEventListener('resize', syncToggle);
  toggle.addEventListener('click', () => { if (innerWidth < WIDE) setOpen(!root.classList.contains('is-open')); });
  root.querySelectorAll('.menu a, .logo').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}
