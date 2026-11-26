/**
 * Libraries loaded on demand (Twikoo, APlayer, PhotoSwipe) inject their CSS into
 * <head> once. Astro's View Transitions replace <head> on every navigation, which
 * would drop that CSS while the library itself stays loaded — e.g. comment icons
 * lose their styles after switching posts. Track styles added at runtime and carry
 * them into each new document.
 */
const MARK = 'data-runtime-style';
let swapping = false;

const isStyle = (n: Node): n is HTMLStyleElement | HTMLLinkElement =>
  n instanceof HTMLStyleElement || (n instanceof HTMLLinkElement && n.rel === 'stylesheet');

export function initPersistStyles() {
  new MutationObserver((mutations) => {
    if (swapping) return;
    for (const m of mutations) for (const n of m.addedNodes) if (isStyle(n)) n.setAttribute(MARK, '');
  }).observe(document.head, { childList: true });

  document.addEventListener('astro:before-swap', (e) => {
    swapping = true;
    const next = (e as Event & { newDocument: Document }).newDocument;
    for (const el of document.head.querySelectorAll(`[${MARK}]`)) {
      const href = el instanceof HTMLLinkElement ? el.getAttribute('href') : null;
      if (href && next.head.querySelector(`link[href="${CSS.escape(href)}"]`)) continue;
      next.head.append(el.cloneNode(true));
    }
  });
  document.addEventListener('astro:after-swap', () => {
    swapping = false;
  });
}
