/**
 * The full LXGW font ('LXGW WenKai Screen Fallback', scripts/build-font.mjs)
 * covers text the site's own font chunks don't: comments, the weather city,
 * search input, traditional Chinese. None of it is part of the first paint, and
 * applying 97 extra @font-face rules re-matches fonts for the whole document —
 * a long style/layout task on big posts. So nothing loads it up front; each
 * feature that is about to show such text calls this first.
 *
 * The <link> is added once; persist-styles.ts carries it across navigations.
 */
let added = false;
let bodyFont: Promise<void> = Promise.resolve();

/**
 * Body characters are declared after the first paint, so their font file never
 * competes with the page's first render. Every page gets the declaration; the
 * file is only fetched where one of its characters is on the page. Runs once:
 * persist-styles.ts carries the <link> across navigations.
 */
export function initBodyFont() {
  const href = document.documentElement.dataset.bodyFont;
  if (!href) return;
  bodyFont = new Promise((resolve) => {
    let linked = false;
    const add = () => {
      if (linked) return;
      linked = true;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = link.onerror = () => resolve();
      document.head.append(link);
    };
    addEventListener('load', add, { once: true });
    if (document.readyState === 'complete') add();
    new PerformanceObserver((list, observer) => {
      if (!list.getEntriesByName('first-contentful-paint').length) return;
      observer.disconnect();
      add();
    }).observe({ type: 'paint', buffered: true });
  });
}

/** Do the site's own faces already have every character of this text? */
function covered(text: string) {
  const ranges: [number, number][] = [];
  for (const face of document.fonts) {
    if (face.family.replace(/['"]/g, '') !== 'LXGW WenKai Screen') continue;
    for (const r of face.unicodeRange.split(',')) {
      const [from, to] = r.trim().replace(/^U\+/i, '').split('-').map((n) => parseInt(n, 16));
      ranges.push([from, to ?? from]);
    }
  }
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    if (cp > 0x20 && !ranges.some(([from, to]) => cp >= from && cp <= to)) return false;
  }
  return true;
}

/** With `text`, the full font is only loaded if that text needs it. */
export async function useFallbackFont(text?: string) {
  if (text !== undefined) {
    await bodyFont; // its faces count as covered too
    if (covered(text)) return;
  }
  if (added) return;
  added = true;
  const href = document.documentElement.dataset.fallbackFont;
  if (!href || document.head.querySelector(`link[href="${CSS.escape(href)}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.append(link);
}
