export {};

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;

  if (target.closest('[data-history-back]')) {
    const button = target.closest<HTMLElement>('[data-history-back]');
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = button?.dataset.fallback || '/';
    }
  }

  if (target.closest('[data-back-top]')) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (target.closest('[data-comments-jump]')) {
    document.getElementById('comments')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    });
  }

  if (target.closest('[data-layout-width-reset]')) {
    const input = document.querySelector<HTMLInputElement>('[data-layout-width]');
    if (!input) return;
    applyContentWidth(Number(input.dataset.defaultWidth));
    try {
      localStorage.removeItem('content-width');
    } catch {
      // 本地存储不可用时仍保留当前会话内的宽度调整。
    }
  }
});

const contentWidthInput = document.querySelector<HTMLInputElement>('[data-layout-width]');
const contentWidthOutput = document.querySelector<HTMLOutputElement>('[data-layout-width-output]');
const contentWidthReset = document.querySelector<HTMLButtonElement>('[data-layout-width-reset]');

function applyContentWidth(value: number) {
  if (!contentWidthInput || !Number.isFinite(value)) return;
  const minimum = Number(contentWidthInput.min);
  const maximum = Number(contentWidthInput.max);
  const clamped = Math.min(maximum, Math.max(minimum, value));
  const width = `${clamped}rem`;
  const defaultWidth = Number(contentWidthInput.dataset.defaultWidth);

  contentWidthInput.value = String(clamped);
  if (contentWidthOutput) contentWidthOutput.value = width;
  document.documentElement.style.setProperty('--layout-content-width', width);
  if (contentWidthReset) contentWidthReset.disabled = clamped === defaultWidth;
}

if (contentWidthInput) {
  const storedWidth = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--layout-content-width')
  );
  applyContentWidth(storedWidth);
  contentWidthInput.addEventListener('input', () =>
    applyContentWidth(Number(contentWidthInput.value))
  );
  contentWidthInput.addEventListener('change', () => {
    const value = Number(contentWidthInput.value);
    const defaultWidth = Number(contentWidthInput.dataset.defaultWidth);
    try {
      if (value === defaultWidth) localStorage.removeItem('content-width');
      else localStorage.setItem('content-width', `${value}rem`);
    } catch {
      // 本地存储不可用时仍保留当前会话内的宽度调整。
    }
  });
}

/*
 * Dock placement and side-collapse. Keep SIDE_DOCK_QUERY in sync with the
 * media query in src/styles/chrome.css.
 */
const dock = document.querySelector<HTMLElement>('[data-dock]');

if (dock) {
  const sideQuery = window.matchMedia(
    '(min-aspect-ratio: 4/3) and (min-width: 75rem), (horizontal-viewport-segments: 2)'
  );
  let collapsed = false;
  let lastY = window.scrollY;

  const panelOpen = () =>
    Boolean(
      document.querySelector(
        '[data-menu-panel]:not(.hidden), [data-toc-panel]:not(.hidden), [data-display-panel]:not(.hidden)'
      )
    );

  const setCollapsed = (value: boolean) => {
    const next = sideQuery.matches ? value : false;
    if (next === collapsed) return;
    collapsed = next;
    dock.dataset.collapsed = String(next);
  };

  const syncPlacement = () => {
    const placement = sideQuery.matches ? 'side' : 'bottom';
    dock.dataset.placement = placement;
    dock.setAttribute('aria-orientation', placement === 'side' ? 'vertical' : 'horizontal');
    setCollapsed(false);
    // The TOC panel's pin only applies beside the article; it listens for this.
    document.dispatchEvent(new CustomEvent('dock:placement'));
  };

  const onDockScroll = () => {
    const y = window.scrollY;
    if (!sideQuery.matches) {
      lastY = y;
      return;
    }
    const delta = y - lastY;
    if (Math.abs(delta) < 8) return;
    if (delta < 0) {
      setCollapsed(false);
    } else if (
      y > 320 &&
      !panelOpen() &&
      !dock.matches(':hover') &&
      !dock.contains(document.activeElement)
    ) {
      setCollapsed(true);
    }
    lastY = y;
  };

  syncPlacement();
  sideQuery.addEventListener('change', syncPlacement);
  window.addEventListener('scroll', onDockScroll, { passive: true });
  dock.addEventListener('pointerenter', () => setCollapsed(false));
  dock.addEventListener('focusin', () => setCollapsed(false));
}
