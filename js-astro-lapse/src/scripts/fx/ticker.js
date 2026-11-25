// Vertical ticker, as Framer's Ticker effect: the list scrolls up at a steady
// 30px/s, slows to 20px/s under the pointer, and can be dragged. Items are
// cloned (aria-hidden) so the loop never shows a gap.
const VELOCITY = 30;
const HOVER_VELOCITY = 20;

export function mount(root, { reduced }) {
  const track = root.querySelector('.ticker-track');
  const items = [...track.children];
  const gap = parseFloat(getComputedStyle(track).rowGap) || 0;
  const cloneSet = () => items.forEach((el) => {
    const c = el.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    c.querySelectorAll('a, button').forEach((n) => n.setAttribute('tabindex', '-1'));
    track.appendChild(c);
  });
  cloneSet();
  if (reduced) return;

  let period = 0;
  const measure = () => { period = items.reduce((h, el) => h + el.offsetHeight, 0) + gap * items.length; };
  measure();
  new ResizeObserver(measure).observe(track);

  let offset = 0, last = performance.now(), hovered = false, dragging = false, dragY = 0, visible = true;
  root.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hovered = true; });
  root.addEventListener('pointerleave', () => { hovered = false; });
  root.addEventListener('pointerdown', (e) => { dragging = true; dragY = e.clientY; root.setPointerCapture(e.pointerId); });
  root.addEventListener('pointermove', (e) => { if (!dragging) return; offset -= e.clientY - dragY; dragY = e.clientY; });
  const end = () => { dragging = false; };
  root.addEventListener('pointerup', end); root.addEventListener('pointercancel', end);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: '200px' }).observe(root);

  const tick = (now) => {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (visible && !dragging) offset += (hovered ? HOVER_VELOCITY : VELOCITY) * dt;
    if (period > 0) offset = ((offset % period) + period) % period;
    track.style.transform = `translateY(${-offset}px)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
