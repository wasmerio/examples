// "Who is here" selection, ported from ref/code/withTeamSwitch.tsx.
// Picking a name or a card makes that person active: the row slides so their
// card lands on the left edge of the window (no clamp on the last person), their
// portrait opens from the inset frame to the full card, the frosted veil under
// the caption fades in over the first 22% of that opening, their name goes to
// full opacity and carries the star. Every value rides the same spring.

// Portrait size in % of the card, idle vs open.
const PHOTO_IDLE = { width: 72.2, height: 65.7 };
const PHOTO_OPEN = { width: 100, height: 100 };
const IDLE_OPACITY = 0.45;
const SPRING = { stiffness: 210, damping: 30, mass: 0.9 };
const VEIL_IN = 0.22;

/**
 * A spring that keeps its velocity when the target moves, like framer-motion's
 * useSpring. restDelta/restSpeed follow framer-motion's defaults: fine values
 * for 0-1 quantities, coarser ones for pixels.
 */
class Spring {
  constructor(value, onUpdate, { restDelta = 0.005, restSpeed = 0.01 } = {}) {
    this.x = value; this.v = 0; this.target = value; this.onUpdate = onUpdate;
    this.restDelta = restDelta; this.restSpeed = restSpeed; this.raf = 0; this.last = 0;
    onUpdate(value);
  }
  set(target, instant = false) {
    this.target = target;
    if (instant) { this.x = target; this.v = 0; cancelAnimationFrame(this.raf); this.raf = 0; this.onUpdate(target); return; }
    if (!this.raf) { this.last = 0; this.raf = requestAnimationFrame((t) => this.tick(t)); }
  }
  tick(now) {
    const dt = this.last ? Math.min((now - this.last) / 1000, 0.064) : 1 / 60;
    this.last = now;
    const { stiffness: k, damping: c, mass: m } = SPRING;
    // Semi-implicit Euler in 1ms steps: stable and indistinguishable from the analytic curve.
    const steps = Math.max(1, Math.round(dt * 1000));
    const h = dt / steps;
    for (let i = 0; i < steps; i++) {
      const a = (-k * (this.x - this.target) - c * this.v) / m;
      this.v += a * h;
      this.x += this.v * h;
    }
    if (Math.abs(this.x - this.target) < this.restDelta && Math.abs(this.v) < this.restSpeed) {
      this.x = this.target; this.v = 0; this.raf = 0; this.onUpdate(this.x); return;
    }
    this.onUpdate(this.x);
    this.raf = requestAnimationFrame((t) => this.tick(t));
  }
}

const lerp = (a, b, p) => a + (b - a) * p;

export function mount(root, { reduced }) {
  const names = [...root.querySelectorAll('.name-row')];
  const track = root.querySelector('#about-team-track');
  const cards = [...track.children];
  let active = Math.max(0, names.findIndex((n) => n.classList.contains('is-active')));

  // Step = one card plus the row gap, measured so every breakpoint works.
  const measureStep = () => {
    const first = cards[0];
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    return first ? first.offsetWidth + gap : 0;
  };
  let step = measureStep();

  const trackX = new Spring(-active * step, (x) => { track.style.transform = x ? `translateX(${x}px)` : ''; }, { restDelta: 0.5, restSpeed: 2 });

  const nameOpacity = names.map((n, i) => new Spring(i === active ? 1 : IDLE_OPACITY, (o) => { n.style.opacity = String(o); }));
  const starOpacity = names.map((n, i) => {
    const star = n.querySelector('.marker');
    return new Spring(i === active ? 1 : 0, (o) => { star.style.opacity = String(o); });
  });
  const open = cards.map((card, i) => {
    const photo = card.querySelector('.about-team-photo');
    const veil = card.querySelector('.veil');
    return new Spring(i === active ? 1 : 0, (p) => {
      photo.style.width = `${lerp(PHOTO_IDLE.width, PHOTO_OPEN.width, p)}%`;
      photo.style.height = `${lerp(PHOTO_IDLE.height, PHOTO_OPEN.height, p)}%`;
      veil.style.opacity = String(Math.min(1, Math.max(0, p / VEIL_IN)));
    });
  });

  const setActive = (index) => {
    if (index === active) return;
    active = index;
    names.forEach((n, i) => {
      const on = i === index;
      n.classList.toggle('is-active', on);
      n.setAttribute('aria-pressed', String(on));
      nameOpacity[i].set(on ? 1 : IDLE_OPACITY, reduced);
      starOpacity[i].set(on ? 1 : 0, reduced);
    });
    cards.forEach((c, i) => {
      c.classList.toggle('is-active', i === index);
      open[i].set(i === index ? 1 : 0, reduced);
    });
    trackX.set(-index * step, reduced);
  };

  names.forEach((n, i) => n.addEventListener('click', () => setActive(i)));
  cards.forEach((c, i) => c.addEventListener('click', () => setActive(i)));

  const onResize = () => {
    const next = measureStep();
    if (next === step) return;
    step = next;
    trackX.set(-active * step, reduced);
  };
  window.addEventListener('resize', onResize);
}
