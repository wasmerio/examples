/**
 * Never move DOM nodes here: tab order and editable bindings depend on source order.
 * A consumer's `@supports` block must test the exact `display: masonry` string tested here.
 */

import { masonrySpan } from "./masonrySpan";

/* Must match `grid-auto-rows` in every consumer's enhanced CSS block. */
export const ROW_UNIT = 8;

/** `root` takes the `data-masonry-enhanced` attribute the consumer's CSS keys on. */
export function enhanceMasonryLayout(root: HTMLElement, inner: HTMLElement): void {
  if (CSS.supports("display", "masonry")) return;

  root.setAttribute("data-masonry-enhanced", "");

  let frame = 0;

  const relayout = () => {
    frame = 0;

    const gap = parseFloat(getComputedStyle(inner).columnGap) || 0;

    for (const item of Array.from(inner.children) as HTMLElement[]) {
      // Never measure the spanning item itself: its span changes its height, so it would loop.
      const probe = (item.firstElementChild as HTMLElement | null) ?? item;
      const span = masonrySpan(probe.getBoundingClientRect().height, gap, ROW_UNIT);
      const value = `span ${span}`;

      if (item.style.gridRow !== value) item.style.gridRow = value;
    }
  };

  const queueRelayout = () => {
    if (!frame) frame = requestAnimationFrame(relayout);
  };

  const observeItems = () => {
    for (const item of Array.from(inner.children)) {
      // An editor re-render swaps an item's contents, detaching the observed probe.
      mutationObserver.observe(item, { childList: true });

      if (item.firstElementChild) resizeObserver.observe(item.firstElementChild);
    }
  };

  const resizeObserver = new ResizeObserver(queueRelayout);

  const mutationObserver = new MutationObserver(() => {
    observeItems();
    queueRelayout();
  });

  resizeObserver.observe(inner);
  mutationObserver.observe(inner, { childList: true });
  observeItems();

  queueRelayout();
}
