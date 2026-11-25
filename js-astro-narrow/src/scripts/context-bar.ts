/*
 * Context bar: the breadcrumb trail collapses into a title capsule while
 * scrolling down, and expands again on scroll up, hover, focus, or click.
 * The trail and the capsule share one surface, so the change is a width/radius
 * morph rather than a content swap.
 */

const COLLAPSE_AFTER = 96;
const SCROLL_DELTA = 8;

const bar = document.getElementById('context-bar');
const pill = document.getElementById('context-pill');

if (bar && pill) {
  const collapsible = [...bar.querySelectorAll<HTMLElement>('.context-crumbs, .subpost-bar')];
  const shell = bar.querySelector<HTMLElement>('.context-shell');
  const popover = document.getElementById('subpost-popover');
  const trigger = document.querySelector<HTMLElement>('[data-subpost-toggle]');

  let collapsed = false;
  let lastY = window.scrollY;
  let lastHeight = document.documentElement.scrollHeight;
  let ticking = false;

  const measure = () => {
    bar.dataset.measuring = 'true';
    // The shell is the measured surface, so its own borders come on top of
    // the capsule's outer width; without them the last characters ellipsize.
    const style = shell ? getComputedStyle(shell) : null;
    const border = style
      ? Number.parseFloat(style.borderLeftWidth) + Number.parseFloat(style.borderRightWidth)
      : 0;
    const width = Math.min(pill.offsetWidth + border, bar.clientWidth);
    bar.style.setProperty('--context-pill-width', `${width}px`);
    delete bar.dataset.measuring;
  };

  const setCollapsed = (value: boolean) => {
    if (value === collapsed) return;
    collapsed = value;
    bar.dataset.collapsed = String(value);
    for (const element of collapsible) element.inert = value;
    if (!value && document.activeElement === pill) pill.blur();
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      const y = window.scrollY;
      const height = document.documentElement.scrollHeight;

      /*
       * Collapsing changes the bar's own height, and the browser's scroll
       * anchoring shifts scrollY to keep the content in place. That adjustment
       * is not a user scroll — treating it as one would toggle the bar back
       * and forth. Skip the frame and resync.
       */
      if (height !== lastHeight) {
        lastHeight = height;
        lastY = y;
        ticking = false;
        return;
      }

      const delta = y - lastY;

      if (y <= COLLAPSE_AFTER) {
        setCollapsed(false);
        lastY = y;
        ticking = false;
        return;
      }

      if (Math.abs(delta) < SCROLL_DELTA) {
        ticking = false;
        return;
      }

      if (delta < 0) {
        setCollapsed(false);
      } else if (!bar.matches(':hover') && !bar.contains(document.activeElement)) {
        setCollapsed(true);
      }

      lastY = y;
      ticking = false;
    });
  };

  measure();

  if (window.scrollY > COLLAPSE_AFTER) setCollapsed(true);
  window.requestAnimationFrame(() => {
    bar.dataset.ready = 'true';
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener(
    'resize',
    () => {
      measure();
      onScroll();
    },
    { passive: true }
  );
  document.fonts?.ready.then(measure);

  bar.addEventListener('pointerenter', () => setCollapsed(false));
  bar.addEventListener('focusin', () => setCollapsed(false));
  pill.addEventListener('click', () => setCollapsed(false));

  if (popover && trigger) {
    const setOpen = (open: boolean) => {
      popover.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
    };

    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      setOpen(popover.hasAttribute('hidden'));
    });

    document.addEventListener('click', (event) => {
      if (!popover.hidden && !popover.contains(event.target as Node)) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !popover.hidden) setOpen(false);
    });
  }
}
