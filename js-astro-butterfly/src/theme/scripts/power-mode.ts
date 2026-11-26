/**
 * Typing sparks: Butterfly's `activate_power_mode` (disjukr/activate-power-mode),
 * rewritten without the library. Each keystroke in a text field throws a few
 * coloured particles from the caret; they fall under gravity and fade out.
 * Same constants as the original: 5–10 particles, 3px squares, gravity 0.08,
 * alpha ×0.96 per frame, optional screen shake.
 *
 * Off on touch devices (config `mobile: false`) and under prefers-reduced-motion.
 * The canvas only exists while particles are alive, so idle cost is zero.
 */

type Particle = { x: number; y: number; vx: number; vy: number; alpha: number; color: string };
type Options = { colorful: boolean; shake: boolean; mobile: boolean };

const FIELD = 'textarea, input:not([type]), input[type=text], input[type=search], input[type=email], input[type=url], [contenteditable=""], [contenteditable=true]';
const rand = (min: number, max: number) => min + Math.random() * (max - min);

/* Mirror-div caret measurement (the technique behind textarea-caret-position). */
const MIRRORED = [
  'boxSizing', 'width', 'height', 'overflowX', 'overflowY', 'borderTopWidth', 'borderRightWidth',
  'borderBottomWidth', 'borderLeftWidth', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'lineHeight', 'fontFamily',
  'textAlign', 'textTransform', 'textIndent', 'letterSpacing', 'wordSpacing', 'tabSize',
] as const;

function caretPoint(el: Element): { x: number; y: number } | null {
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
    const pos = el.selectionEnd ?? el.value.length;
    const cs = getComputedStyle(el);
    const mirror = document.createElement('div');
    const s = mirror.style;
    for (const p of MIRRORED) s[p] = cs[p];
    s.position = 'absolute';
    s.visibility = 'hidden';
    s.whiteSpace = el instanceof HTMLTextAreaElement ? 'pre-wrap' : 'pre';
    s.overflowWrap = 'break-word';
    mirror.textContent = el.value.slice(0, pos);
    const mark = document.createElement('span');
    mark.textContent = el.value.slice(pos) || '.';
    mirror.append(mark);
    document.body.append(mirror);
    const r = el.getBoundingClientRect();
    const x = r.left + mark.offsetLeft - el.scrollLeft;
    const y = r.top + mark.offsetTop - el.scrollTop + mark.offsetHeight / 2;
    mirror.remove();
    return { x: Math.min(x, r.right), y: Math.min(y, r.bottom) };
  }
  const sel = getSelection();
  if (!sel?.rangeCount) return null;
  const rect = sel.getRangeAt(0).getBoundingClientRect();
  return rect.height ? { x: rect.left, y: rect.top + rect.height / 2 } : null;
}

export function initPowerMode() {
  const raw = document.body.dataset.powerMode;
  if (!raw) return;
  const opts: Options = JSON.parse(raw);
  if (!opts.mobile && !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  let particles: Particle[] = [];
  let shakeUntil = 0;

  const resize = () => {
    if (!canvas) return;
    const dpr = devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const frame = (now: number) => {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    particles = particles.filter((p) => p.alpha > 0.1);
    for (const p of particles) {
      p.vy += 0.08;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha *= 0.96;
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x - 1.5), Math.round(p.y - 1.5), 3, 3);
    }
    if (opts.shake) {
      const k = now < shakeUntil ? 1 : 0;
      document.body.style.translate = k ? `${rand(-1, 1) * 3}px ${rand(-1, 1) * 3}px` : '';
    }
    if (particles.length || now < shakeUntil) requestAnimationFrame(frame);
    else {
      canvas.remove(); // nothing alive: drop the layer until the next keystroke
      canvas = ctx = null;
      removeEventListener('resize', resize);
    }
  };

  const spawn = (target: Element) => {
    const at = caretPoint(target);
    if (!at) return;
    if (canvas && !canvas.isConnected) document.body.append(canvas); // body swapped by a client-side navigation
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'power-mode';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.append(canvas);
      ctx = canvas.getContext('2d');
      resize();
      addEventListener('resize', resize);
      requestAnimationFrame(frame);
    }
    const base = getComputedStyle(target).color;
    const n = Math.round(rand(5, 10));
    for (let i = 0; i < n; i++) {
      particles.push({
        x: at.x, y: at.y, vx: rand(-1, 1), vy: rand(-3.5, -1.5), alpha: 1,
        color: opts.colorful ? `rgb(${rand(0, 255) | 0},${rand(0, 255) | 0},${rand(0, 255) | 0})` : base,
      });
    }
    if (opts.shake) shakeUntil = performance.now() + 75;
  };

  // `input` covers typing, IME commits and deletes; composed so it crosses Twikoo's DOM.
  document.addEventListener('input', (e) => {
    if (reduced.matches) return;
    const t = e.composedPath()[0];
    if (t instanceof Element && t.matches(FIELD)) spawn(t);
  });
}
