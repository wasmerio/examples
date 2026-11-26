/**
 * Mermaid diagrams (```mermaid, plugins/remark-mermaid.ts). The library is large,
 * so it loads only when a page has a diagram about to scroll into view. Diagrams
 * follow the site's theme, with the same pair of Mermaid themes as Butterfly.
 */
type Mermaid = (typeof import('mermaid'))['default'];

const SELECTOR = '.mermaid-diagram';
let library: Promise<Mermaid> | undefined;
let queue: Promise<void> = Promise.resolve(); // one at a time: initialize() is global
let seq = 0;
let visible: IntersectionObserver | undefined;

const currentTheme = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default');

async function draw(el: HTMLElement) {
  const theme = currentTheme();
  if (!el.isConnected || el.dataset.rendered === theme) return;
  el.dataset.source ??= el.textContent ?? '';
  try {
    library ??= import('mermaid').then((m) => m.default);
    const mermaid = await library;
    await document.fonts.ready; // labels are measured in the site's font
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      suppressErrorRendering: true,
      theme,
      fontFamily: getComputedStyle(el).fontFamily,
      // Mermaid 12 defaults to ELK, a ~1.5 MB download for every page with a diagram.
      // Dagre is the layout Mermaid ≤ 11 and Butterfly draw with; a diagram can still
      // opt into ELK in its own frontmatter (`config: { layout: elk }`), loaded on demand.
      layout: 'dagre',
      // The stock shadow is a light grey: a glow around every node on dark pages.
      themeVariables: { dropShadow: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' },
    });
    const { svg } = await mermaid.render(`mermaid-${++seq}`, el.dataset.source);
    el.innerHTML = svg;
    el.dataset.rendered = theme;
    delete el.dataset.failed;
  } catch (e) {
    library = undefined; // a failed download can be retried
    console.warn('[mermaid]', e);
    el.textContent = el.dataset.source; // show the source rather than nothing
    el.dataset.failed = '';
  }
}

function watch(els: Iterable<Element>) {
  visible ??= new IntersectionObserver(
    (entries) => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue;
        visible!.unobserve(target);
        queue = queue.then(() => draw(target as HTMLElement));
      }
    },
    { rootMargin: '600px 0px' },
  );
  for (const el of els) visible.observe(el);
}

let started = false;

export function initMermaid() {
  const diagrams = document.querySelectorAll(SELECTOR);
  if (diagrams.length) watch(diagrams);
  if (started) return;
  started = true;
  // Redraw on a theme switch; off-screen diagrams wait until they are near.
  new MutationObserver(() => {
    const drawn = [...document.querySelectorAll<HTMLElement>(`${SELECTOR}[data-rendered]`)];
    watch(drawn.filter((el) => el.dataset.rendered !== currentTheme()));
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
