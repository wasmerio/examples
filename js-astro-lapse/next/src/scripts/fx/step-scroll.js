// "How it works": while the section is pinned, the four step cards take
// turns on stage. A card waits down-right at +30deg, lands square, then leaves
// up-left at -30deg, and the matching step number lights up. Step 1 starts
// composed, step 4 holds to the end. Ported from the Framer override
// withStepScroll; constants copied as they are.
const STEPS = 4;
const ENTER_X = 660, ENTER_Y = 120, EXIT_X = -560, EXIT_Y = -110, TILT = 30;
const IN_END = 0.34, OUT_START = 0.84;

// Piecewise-linear map, clamped at both ends (framer-motion useTransform).
function lerp(u, stops, values) {
  if (u <= stops[0]) return values[0];
  for (let i = 1; i < stops.length; i++) {
    if (u <= stops[i]) {
      const t = (u - stops[i - 1]) / (stops[i] - stops[i - 1] || 1);
      return values[i - 1] + (values[i] - values[i - 1]) * t;
    }
  }
  return values[values.length - 1];
}

function tracks(index) {
  const first = index === 0, last = index === STEPS - 1;
  return {
    stops: first ? [OUT_START, 1] : last ? [0, IN_END] : [0, IN_END, OUT_START, 1],
    xs: first ? [0, EXIT_X] : last ? [ENTER_X, 0] : [ENTER_X, 0, 0, EXIT_X],
    ys: first ? [0, EXIT_Y] : last ? [ENTER_Y, 0] : [ENTER_Y, 0, 0, EXIT_Y],
    rs: first ? [0, -TILT] : last ? [TILT, 0] : [TILT, 0, 0, -TILT],
    fadeStops: first ? [OUT_START, 1] : last ? [0, 0.02] : [0, 0.02, OUT_START, 1],
    fades: first ? [1, 0] : last ? [0, 1] : [0, 1, 1, 0],
    numStops: first ? [OUT_START, 1] : last ? [0, 0.16] : [0, 0.16, OUT_START, 1],
    nums: first ? [1, 0] : last ? [0, 1] : [0, 1, 1, 0],
  };
}

export function mount(section, { reduced }) {
  const stage = section.querySelector('.how-stage');
  const slides = [...section.querySelectorAll('.slide')];
  const numbers = [...section.querySelectorAll('.active')];
  const t = slides.map((_, i) => tracks(i));
  let frame = 0;
  const update = () => {
    frame = 0;
    if (getComputedStyle(stage).position !== 'sticky') return;
    const rect = section.getBoundingClientRect();
    const travel = rect.height - stage.getBoundingClientRect().height;
    if (travel <= 0) return;
    const p = Math.min(1, Math.max(0, -rect.top / travel));
    slides.forEach((el, i) => {
      const u = p * STEPS - i, k = t[i];
      const op = lerp(u, k.fadeStops, k.fades);
      el.style.opacity = op;
      el.style.transform = reduced ? 'none'
        : `translate(${lerp(u, k.stops, k.xs)}px, ${lerp(u, k.stops, k.ys)}px) rotate(${lerp(u, k.stops, k.rs)}deg)`;
      numbers[i].style.opacity = lerp(u, k.numStops, k.nums);
    });
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  update();
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
}
