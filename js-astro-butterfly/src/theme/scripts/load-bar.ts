/**
 * Page-load progress bar (replaces Butterfly's pace.js "minimal" theme: a 2px bar
 * along the top edge in the theme colour).
 *
 * Built for slow connections rather than for show:
 *  - only appears if loading takes longer than DELAY, so fast loads never flash it;
 *  - trickles towards 90% and stays there until the page has really arrived (no
 *    fake completion), then fills, fades out and resets;
 *  - covers the first load (until `load`) and every client-side navigation
 *    (astro:before-preparation → astro:page-load), restarting if one supersedes another;
 *  - lives on <html>, outside <body>, so page swaps never remove it mid-run.
 */

const DELAY = 200;
let bar: HTMLDivElement | null = null;
let value = 0;
let showTimer = 0;
let trickleTimer = 0;
let hideTimer = 0;
let running = false;

function el() {
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'load-bar';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', '页面加载进度');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    document.documentElement.append(bar);
  }
  return bar;
}

function set(n: number) {
  value = Math.min(n, 100);
  const b = el();
  b.style.transform = `scaleX(${value / 100})`;
  b.setAttribute('aria-valuenow', String(Math.round(value)));
}

export function start() {
  clearTimeout(showTimer);
  clearInterval(trickleTimer);
  clearTimeout(hideTimer);
  running = true;
  showTimer = window.setTimeout(() => {
    if (!running) return;
    const b = el();
    b.classList.remove('is-done');
    b.classList.add('is-active');
    set(8);
    // smaller steps the closer it gets: never reaches 100% on its own
    trickleTimer = window.setInterval(() => set(value + (90 - value) * 0.08), 250);
  }, DELAY);
}

/** A response arrived (HTML downloaded): jump ahead, keep waiting for the swap. */
export function advance(to = 70) {
  if (running && value && value < to) set(to);
}

export function done() {
  running = false;
  clearTimeout(showTimer);
  clearInterval(trickleTimer);
  if (!bar?.classList.contains('is-active')) return; // was fast: never shown
  set(100);
  bar.classList.add('is-done');
  hideTimer = window.setTimeout(() => {
    bar!.classList.remove('is-active', 'is-done');
    set(0);
  }, 400);
}

export function initLoadBar() {
  // first load: module scripts run before `load`, so on a slow link the bar covers the wait
  if (document.readyState !== 'complete') {
    start();
    addEventListener('load', done, { once: true });
  }
  document.addEventListener('astro:before-preparation', start);
  document.addEventListener('astro:after-preparation', () => advance());
  document.addEventListener('astro:page-load', () => {
    if (document.readyState === 'complete') done();
  });
}
