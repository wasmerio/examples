const root = document.documentElement;
const TOOLS_AT = 56;
/** Smaller moves keep the nav as it is: trackpad jitter, scroll anchoring. They add up. */
const DIRECTION_TOLERANCE = 4;
let lastY = 0;
let ticking = false;

/**
 * Butterfly nav: hides while scrolling down, shows while scrolling up. It changes
 * between the page's flow and `position: fixed` only where both put it in the same
 * spot, so it never jumps:
 *  - going down, once it has scrolled fully out of view (`nav-entering` skips the
 *    slide, or it would flash back on screen just to leave again);
 *  - going up, at the very top. Until then it stays fixed instead of snapping to its
 *    place in the flow, part of a screen away.
 */
function render(reset = false) {
  const max = root.scrollHeight - window.innerHeight;
  // Rubber-band overscroll moves scrollY past both ends and back: not a direction change.
  const y = Math.max(0, Math.min(window.scrollY, max));
  const navHeight = document.getElementById('nav')?.offsetHeight ?? 0;

  const wasFixed = !reset && root.classList.contains('nav-fixed');
  let visible = reset || root.classList.contains('nav-visible');
  if (reset) lastY = y;
  else if (Math.abs(y - lastY) >= DIRECTION_TOLERANCE) {
    visible = y < lastY;
    lastY = y;
  }
  const fixed = y > 0 && (wasFixed || y >= navHeight);

  root.classList.toggle('nav-entering', fixed && !wasFixed);
  root.classList.toggle('nav-fixed', fixed);
  root.classList.toggle('nav-visible', fixed && visible);
  root.classList.toggle('show-rightside', y > TOOLS_AT);

  const percentEl = document.querySelector<HTMLElement>('[data-scroll-percent]');
  if (percentEl) {
    const pct = max > 0 ? Math.round((y / max) * 100) : 0;
    percentEl.textContent = pct > 0 && pct < 100 ? String(pct) : '';
  }
}

export function onPageScroll() {
  render(true);
}

export function initScroll() {
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          render();
        });
      }
    },
    { passive: true },
  );

  document.addEventListener('click', (e) => {
    if ((e.target as Element).closest('[data-go-up]')) {
      window.scrollTo({ top: 0 });
      document.getElementById('main-content')?.focus({ preventScroll: true });
    }
  });
}
