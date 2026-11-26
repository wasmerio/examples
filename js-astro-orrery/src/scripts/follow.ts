/**
 * 6, 11. The orbit drawings lean towards the pointer ([data-follow="<ms>"], the transition time).
 * As measured on the reference: per axis, offset = (pointer − centre) × 24 / (distance from the
 * centre to the far edge of the screen), so it reaches ±24px at the edge; before the pointer
 * moves it is taken to be the middle of the screen, and the offset is recomputed on scroll.
 * A sticky element keeps the centre of its place in the page flow, like the reference does.
 */
const els = [...document.querySelectorAll<HTMLElement>("[data-follow]")];
if (els.length && matchMedia("(prefers-reduced-motion: no-preference) and (min-width: 751px)").matches) {
  const p = { x: innerWidth / 2, y: innerHeight / 2 };
  const lean = (m: number, c: number, size: number) => Math.max(-24, Math.min(24, ((m - c) * 24) / Math.max(c, size - c)));
  let queued = 0;
  const update = () => {
    queued = 0;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      const [tx, ty] = (getComputedStyle(el).translate.match(/-?[\d.]+/g) ?? [0, 0]).map(Number);
      const css = getComputedStyle(el);
      const cx = r.left - (tx || 0) + r.width / 2;
      const cy =
        css.position === "sticky"
          ? el.parentElement!.getBoundingClientRect().top + parseFloat(css.marginTop) + r.height / 2
          : r.top - (ty || 0) + r.height / 2;
      el.style.translate = `${lean(p.x, cx, innerWidth).toFixed(2)}px ${lean(p.y, cy, innerHeight).toFixed(2)}px`;
    }
  };
  const queue = () => (queued ||= requestAnimationFrame(update));
  addEventListener("scroll", queue, { passive: true });
  addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return;
      p.x = e.clientX;
      p.y = e.clientY;
      queue();
    },
    { passive: true },
  );
  for (const el of els) el.style.transition = `translate ${el.dataset.follow}ms ease-out`;
}
