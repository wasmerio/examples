// Endless left-drifting row, the port of Framer's ticker effect.
// Markup: <div data-fx="logo-ticker" data-velocity="12"> <ul> <li>...</li> </ul> </div>
// The list moves left at data-velocity px/s; an item that leaves the left edge
// is moved one loop length to the right, so the row never runs out. If the
// items are narrower than the window, they are cloned (aria-hidden) until the
// loop covers it. Reduced motion: the row stays still.

export function mount(root, { reduced }) {
  const list = root.querySelector('ul');
  if (!list || reduced) return;
  const velocity = Number(root.dataset.velocity || 12);
  const originals = [...list.children];
  if (!originals.length) return;

  let items = [];
  let loop = 0;
  const measure = () => {
    items.forEach((li) => { li.style.transform = ''; });
    list.style.transform = '';
    const gap = parseFloat(getComputedStyle(list).columnGap || '0') || 0;
    // Clone until one loop is at least as wide as the window plus one item.
    const unit = originals.reduce((w, li) => w + li.offsetWidth + gap, 0);
    list.querySelectorAll('[data-ticker-clone]').forEach((c) => c.remove());
    const copies = unit > 0 ? Math.max(0, Math.ceil((root.clientWidth + originals[0].offsetWidth) / unit) - 1) : 0;
    for (let k = 0; k < copies; k++) {
      for (const li of originals) {
        const c = li.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        c.dataset.tickerClone = '';
        list.appendChild(c);
      }
    }
    items = [...list.children].map((li) => ({ li, left: li.offsetLeft - list.offsetLeft, width: li.offsetWidth }));
    loop = unit * (copies + 1);
  };
  measure();

  let offset = 0;
  let last = 0;
  let visible = true;
  const tick = (now) => {
    if (last && visible) {
      offset = (offset + (velocity * Math.min(now - last, 100)) / 1000) % loop;
      list.style.transform = `translateX(${-offset}px)`;
      for (const it of items) {
        const wrap = it.left + it.width - offset < 0;
        it.li.style.transform = wrap ? `translateX(${loop}px)` : '';
      }
    }
    last = now;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(root);
  }
  let rw = root.clientWidth;
  window.addEventListener('resize', () => {
    if (root.clientWidth === rw) return;
    rw = root.clientWidth;
    measure();
  });
}
