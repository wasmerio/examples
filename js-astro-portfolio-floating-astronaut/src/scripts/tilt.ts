// 3D hover tilt for the glass cards ([data-tilt]). Desktop pointers only; touch,
// coarse pointers and reduced motion keep the flat cards. GSAP loads lazily so
// phones never download it.
const MAX_TILT_DEG = 8;
const LIFT_PX = -6;

const canTilt = () =>
  matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !matchMedia('(prefers-reduced-motion: reduce)').matches;

async function initTilt() {
  const cards = [...document.querySelectorAll<HTMLElement>('[data-tilt]')];
  if (!cards.length || !canTilt()) return;
  const { gsap } = await import('gsap');

  for (const card of cards) {
    const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    const lift = gsap.quickTo(card, 'y', { duration: 0.5, ease: 'power3.out' });

    card.addEventListener('pointerenter', () => {
      // GSAP owns transform from here; a CSS transform transition would fight every frame.
      card.style.transition = 'opacity .8s ease, border-color .35s ease';
      // Set on first hover, not at load, so the inline transform can't cancel the reveal slide.
      gsap.set(card, { transformPerspective: 900 });
      card.classList.add('is-tilting');
      lift(LIFT_PX);
    });
    card.addEventListener('pointermove', (event) => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width; // 0..1
      const y = (event.clientY - box.top) / box.height;
      rotY((x - 0.5) * 2 * MAX_TILT_DEG);
      rotX((0.5 - y) * 2 * MAX_TILT_DEG);
      card.style.setProperty('--tilt-x', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--tilt-y', `${(y * 100).toFixed(1)}%`);
    });
    card.addEventListener('pointerleave', () => {
      rotX(0);
      rotY(0);
      lift(0);
      card.classList.remove('is-tilting');
    });
  }
}

void initTilt();
