// "Our rules" pinned scroll, ported from ref/code/withRulesScroll.tsx.
// Progress runs 0 to 1 across the section's pinned scroll (section height minus
// the sticky stage). Each card climbs RISE px into its slot during its turn and
// fades in over the first 2% of it; then the track slides left by whatever hangs
// off the right edge of the viewport so the fourth card lands flush.
// Motion is read straight off scroll (no smoothing), as in the original.

const PIN_MIN_WIDTH = 700;
const RISE = 460;
const TURNS = [
  [0.04, 0.2],
  [0.2, 0.36],
  [0.36, 0.52],
  [0.66, 0.84],
];
const SHIFT = [0.56, 0.78];

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Framer's useTransform with clamp: map v from [a, b] to [from, to]. */
const map = (v, a, b, from, to) => from + (to - from) * clamp01((v - a) / (b - a));

export function mount(section, { reduced }) {
  const stage = section.querySelector('#about-rules-stage');
  const viewport = section.querySelector('#about-rules-viewport');
  const track = section.querySelector('#about-rules-track');
  const cards = [...track.children];
  const mq = window.matchMedia(`(min-width: ${PIN_MIN_WIDTH}px)`);
  let travel = 0;
  let shift = 0;
  let frame = 0;

  const measure = () => {
    travel = section.getBoundingClientRect().height - stage.getBoundingClientRect().height;
    const overhang = track.offsetWidth - viewport.clientWidth;
    shift = -(overhang > 0 ? overhang : 0);
  };

  // Below the pin width, or when the layout is not pinned at all (the Phone
  // column, 700-809px included), every layer is handed back untouched.
  const pinned = () => mq.matches && travel > 0;

  const clear = () => {
    track.style.transform = '';
    for (const c of cards) { c.style.transform = ''; c.style.opacity = ''; }
  };

  const render = () => {
    frame = 0;
    if (!pinned()) { clear(); return; }
    const progress = clamp01(-section.getBoundingClientRect().top / travel);
    const x = map(progress, SHIFT[0], SHIFT[1], 0, shift);
    track.style.transform = x ? `translateX(${x}px)` : '';
    if (reduced) return; // cards stay at rest; only the sideways reveal follows scroll
    cards.forEach((c, i) => {
      const [start, end] = TURNS[i];
      const y = map(progress, start, end, RISE, 0);
      c.style.transform = y ? `translateY(${y}px)` : '';
      c.style.opacity = String(map(progress, start, start + 0.02, 0, 1));
    });
  };

  const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
  const onResize = () => { measure(); schedule(); };

  measure();
  render();
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', onResize);
  mq.addEventListener('change', onResize);
  // Fonts or late images can change the stage height; re-measure when they do.
  if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(section);
}
