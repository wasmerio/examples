// Desktop smooth scrolling: turns discrete wheel ticks into a continuous scroll
// curve so the scrubbed film glides. Skipped on touch (native momentum is
// already smooth, and Lenis touch handling has stalled iOS before) and under
// reduced motion. Loaded lazily so it never blocks first paint.
const touch = matchMedia('(pointer: coarse)').matches || matchMedia('(hover: none)').matches;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

type LenisLike = { scrollTo: (target: number | HTMLElement, options?: { duration?: number; offset?: number }) => void };
let lenis: LenisLike | undefined;

/** Scroll to a document Y: Lenis when active, native smooth scroll otherwise, instant under reduced motion. */
export function scrollToY(y: number): void {
  if (lenis) { lenis.scrollTo(y, { duration: 1.6 }); return; }
  window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
}

if (!touch && !reduced) {
  import('lenis').then(({ default: Lenis }) => {
    const instance = new Lenis({ autoRaf: true, lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
    lenis = instance;
    // Anchor links scroll smoothly too.
    document.addEventListener('click', (event) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const id = link?.getAttribute('href')?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      event.preventDefault();
      instance.scrollTo(target, { offset: -88 }); // clear the floating header
    });
  }).catch(() => { /* native scrolling still works */ });
}
