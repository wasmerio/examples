// Particle field: rebuilds a photo from tens of thousands of soft round dots.
// Dots are scattered with a probability that follows the photo's brightness,
// so black areas stay empty. Each dot shimmers in place (on the GPU) and is
// pushed away from the pointer, then springs home (on the CPU, typed arrays).
// Opt in with data-fx="particle-field" data-src="/path/to/image".

const DENSITY = 45000 / (1200 * 651); // dots per CSS px² at desktop size
const RADIUS = 90;        // pointer influence radius, CSS px (squared falloff)
const PUSH = 14000;       // radial acceleration at the cursor centre, px/s²
const SWIRL = 0.5;        // sideways curl, as a share of the push (one rotational sense)
const FLING = 1 / 550;    // extra shove along travel per px/s of cursor speed, × push
const FLING_MAX = 4;      // cap on that shove, × push
const SPEED_TAU = 0.3;    // tracked cursor speed decays with this time constant, s
const STIFF = 55;         // spring toward home, 1/s²
const DAMP = 12.6;        // velocity damping, 1/s (heavily damped, tiny overshoot)
const DRIFT = 1.25;       // idle loop radius at desktop size, CSS px
const SLEEP = 0.02;       // below this offset/speed everything is at rest
const CELL = 4;           // brightness sampling cell, CSS px
const FLOOR = 0.06;       // cells darker than this get no dots
const TONE_GAIN = 1.15, TONE_LIFT = 0.07, TONE_VAR = 0.3;

const VS = `
attribute vec2 aHome;
attribute vec2 aOff;
attribute vec2 aSeed;
attribute vec4 aCol;
uniform vec2 uRes;
uniform float uT;
uniform float uDpr;
uniform float uAmp;
varying vec3 vCol;
varying float vEdge;
void main() {
  // idle drift: each dot loops on its own small 3D ellipse, period 2.5-4 s
  float ph = aSeed.x * 6.2831;
  float w = 6.2831 / (2.5 + 1.5 * fract(aSeed.y * 7.13 + aSeed.x * 3.7));
  float a = uT * w + ph;
  vec3 loop = vec3(sin(a), sin(a + 1.3 + aSeed.y * 2.0) * 0.8, cos(a + aSeed.x * 4.0));
  vec2 drift = loop.xy * uAmp;
  vec2 p = aHome + aOff + drift;
  gl_Position = vec4(p / uRes * 2.0 - 1.0, 0.0, 1.0) * vec4(1.0, -1.0, 1.0, 1.0);
  // ~1.8px ±40%, and a few "nearer" dots a little larger
  float depth = pow(fract(aSeed.x * 47.31 + aSeed.y * 13.7), 10.0);
  float size = 1.8 * (0.6 + 0.8 * aSeed.y) * (1.0 + 0.6 * depth) * (1.0 + 0.1 * loop.z) * uDpr;
  gl_PointSize = size + 1.0;
  vEdge = 1.0 - 1.6 / (size + 1.0);
  vCol = aCol.rgb;
}`;

const FS = `
precision mediump float;
varying vec3 vCol;
varying float vEdge;
void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  float a = 1.0 - smoothstep(vEdge * 0.6, 1.0, r);
  gl_FragColor = vec4(vCol * a, a);
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

// Draw the photo with object-fit: cover into a small w×h buffer. The browser's
// downscale averages neighbouring pixels, so isolated specks in the photo fade
// and only genuinely lit regions keep their brightness.
function coverPixels(img, w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingQuality = 'high';
  ctx.filter = 'blur(0.7px)';
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  return ctx.getImageData(0, 0, w, h).data;
}

// Scatter n dots over a gw×gh brightness grid (cell = CELL CSS px).
function scatter(px, gw, gh, n) {
  const cdf = new Float32Array(gw * gh);
  let sum = 0;
  for (let i = 0, j = 0; i < cdf.length; i++, j += 4) {
    const l = (px[j] * 0.3 + px[j + 1] * 0.59 + px[j + 2] * 0.11) / 255;
    const v = (l - FLOOR) / (1 - FLOOR);
    sum += v > 0 ? v : 0;
    cdf[i] = sum;
  }
  const home = new Float32Array(n * 2);
  const seed = new Float32Array(n * 2);
  const col = new Uint8Array(n * 4);
  if (sum <= 0) return { home, seed, col, n: 0 };
  for (let k = 0; k < n; k++) {
    const t = Math.random() * sum;
    let lo = 0, hi = cdf.length - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (cdf[m] < t) lo = m + 1; else hi = m; }
    const x = lo % gw, y = (lo / gw) | 0, j = lo * 4;
    home[k * 2] = (x + Math.random()) * CELL;
    home[k * 2 + 1] = (y + Math.random()) * CELL;
    seed[k * 2] = Math.random();
    seed[k * 2 + 1] = Math.random();
    // brighter where the photo is brighter, with per-dot variation
    const v = 1 - TONE_VAR * Math.random();
    for (let c = 0; c < 3; c++) col[k * 4 + c] = Math.round(255 * Math.min(1, TONE_LIFT + TONE_GAIN * (px[j + c] / 255)) * v);
    col[k * 4 + 3] = 255;
  }
  return { home, seed, col, n };
}

export function mount(el, { reduced, signal } = {}) {
  // Teardown for hosts that unmount (Framer): pass an AbortSignal as `signal`.
  const observers = [];
  const watch = (o) => { observers.push(o); return o; };
  signal?.addEventListener('abort', () => {
    observers.forEach((o) => o.disconnect());
    // raf and canvas may not exist yet if mount bailed out early.
    try { if (raf) cancelAnimationFrame(raf); } catch {}
    try {
      for (const kind of ['webgl2', 'webgl']) canvas.getContext(kind)?.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    } catch {}
  });
  const src = el.dataset.src;
  if (!src) return;
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y';
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  el.style.touchAction = 'pan-y';

  let gl;
  try { gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false }); } catch { gl = null; }
  if (!gl) return;
  const prog = gl.createProgram();
  const vs = compile(gl, gl.VERTEX_SHADER, VS), fs = compile(gl, gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return;
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  const loc = (n) => gl.getAttribLocation(prog, n);
  const aHome = loc('aHome'), aOff = loc('aOff'), aSeed = loc('aSeed'), aCol = loc('aCol');
  const uRes = gl.getUniformLocation(prog, 'uRes'), uT = gl.getUniformLocation(prog, 'uT'), uDpr = gl.getUniformLocation(prog, 'uDpr'), uAmp = gl.getUniformLocation(prog, 'uAmp');
  const bHome = gl.createBuffer(), bOff = gl.createBuffer(), bSeed = gl.createBuffer(), bCol = gl.createBuffer();
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  let W = 0, H = 0, dpr = 1, n = 0, img = null;
  let off = new Float32Array(0), vel = new Float32Array(0), home = new Float32Array(0);
  let awake = false, visible = true, running = false, raf = 0, last = 0, t0 = performance.now();
  // pointer state: current and previous position, velocity, presence
  const ptr = { x: 0, y: 0, px: 0, py: 0, vx: 0, vy: 0, on: false, t: 0, clock: 0 };

  function bind(buf, attr, size, type, norm) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(attr);
    gl.vertexAttribPointer(attr, size, type, norm, 0, 0);
  }

  function build() {
    if (!img || !W || !H) return;
    const count = Math.round(DENSITY * W * H * Math.min(2, Math.pow((1200 * 651) / (W * H), 0.3)));
    const gw = Math.ceil(W / CELL), gh = Math.ceil(H / CELL);
    const d = scatter(coverPixels(img, gw, gh), gw, gh, count);
    n = d.n; home = d.home;
    off = new Float32Array(n * 2); vel = new Float32Array(n * 2);
    gl.bindBuffer(gl.ARRAY_BUFFER, bHome); gl.bufferData(gl.ARRAY_BUFFER, d.home, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bSeed); gl.bufferData(gl.ARRAY_BUFFER, d.seed, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bCol); gl.bufferData(gl.ARRAY_BUFFER, d.col, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bOff); gl.bufferData(gl.ARRAY_BUFFER, off, gl.DYNAMIC_DRAW);
    bind(bHome, aHome, 2, gl.FLOAT, false);
    bind(bSeed, aSeed, 2, gl.FLOAT, false);
    bind(bCol, aCol, 4, gl.UNSIGNED_BYTE, true);
    bind(bOff, aOff, 2, gl.FLOAT, false);
    awake = false;
    draw(0);
  }

  function draw(t) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!n) return;
    gl.uniform2f(uRes, W, H);
    gl.uniform1f(uT, t);
    gl.uniform1f(uDpr, dpr);
    // ~2.5px of loop travel at desktop, scaled down with the stage
    gl.uniform1f(uAmp, reduced ? 0 : DRIFT * Math.max(0.4, Math.min(1, W / 1200, H / 651)));
    gl.drawArrays(gl.POINTS, 0, n);
  }

  function step(dt) {
    const R = RADIUS, R2 = R * R;
    const near = ptr.on;
    // the pointer acts along the segment it travelled this frame, so fast
    // sweeps carve a continuous path instead of a dotted one
    const ax = ptr.px, ay = ptr.py, sx = ptr.x - ax, sy = ptr.y - ay;
    const sl = sx * sx + sy * sy;
    const minX = Math.min(ax, ptr.x) - R, maxX = Math.max(ax, ptr.x) + R;
    const minY = Math.min(ay, ptr.y) - R, maxY = Math.max(ay, ptr.y) + R;
    // fling: a shove along the cursor's travel that grows with its speed
    const sp = Math.hypot(ptr.vx, ptr.vy);
    const fk = Math.min(FLING_MAX, sp * FLING);
    const tx = sp > 1 ? ptr.vx / sp : 0, ty = sp > 1 ? ptr.vy / sp : 0;
    // a resting cursor's hole breathes slowly
    const P = PUSH * (1 + 0.12 * Math.sin(ptr.clock * 2.2)) * dt;
    const kDt = STIFF * dt, dDt = Math.max(0, 1 - DAMP * dt);
    let energy = 0;
    for (let i = 0, j = 0; i < n; i++, j += 2) {
      let ox = off[j], oy = off[j + 1], vx = vel[j], vy = vel[j + 1];
      if (near) {
        const x = home[j] + ox, y = home[j + 1] + oy;
        if (x > minX && x < maxX && y > minY && y < maxY) {
          let u = sl > 0 ? ((x - ax) * sx + (y - ay) * sy) / sl : 1;
          u = u < 0 ? 0 : u > 1 ? 1 : u;
          const dx = x - (ax + sx * u), dy = y - (ay + sy * u);
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) + 0.001;
            const q = 1 - d / R, f = q * q * P;
            const nx = dx / d, ny = dy / d;
            vx += (nx - ny * SWIRL + tx * fk) * f;
            vy += (ny + nx * SWIRL + ty * fk) * f;
          }
        }
      }
      if (ox !== 0 || oy !== 0 || vx !== 0 || vy !== 0) {
        vx = (vx - ox * kDt) * dDt;
        vy = (vy - oy * kDt) * dDt;
        ox += vx * dt; oy += vy * dt;
        const e = Math.abs(ox) + Math.abs(oy) + Math.abs(vx) * 0.05 + Math.abs(vy) * 0.05;
        if (e < SLEEP) { ox = oy = vx = vy = 0; } else if (e > energy) energy = e;
        off[j] = ox; off[j + 1] = oy; vel[j] = vx; vel[j + 1] = vy;
      }
    }
    ptr.px = ptr.x; ptr.py = ptr.y;
    return energy > 0;
  }

  function frame(now) {
    if (signal?.aborted) return;
    raf = 0;
    if (!running) return;
    const dt = Math.min(1 / 30, Math.max(0, (now - last) / 1000)); last = now;
    // tracked cursor speed decays when it stops moving
    const decay = Math.exp(-dt / SPEED_TAU);
    ptr.vx *= decay; ptr.vy *= decay; ptr.clock += dt;
    if (awake || ptr.on) {
      // split long frames so the spring stays stable
      const steps = dt > 1 / 70 ? 2 : 1;
      let moving = false;
      for (let s = 0; s < steps; s++) moving = step(dt / steps) || moving;
      awake = moving;
      gl.bindBuffer(gl.ARRAY_BUFFER, bOff);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, off);
    }
    draw((now - t0) / 1000);
    raf = requestAnimationFrame(frame);
  }

  function update() {
    const want = !reduced && visible && !document.hidden && n > 0;
    if (want && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    else if (!want && running) { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
  }

  function resize() {
    const r = el.getBoundingClientRect();
    const w = r.width, h = r.height;
    if (!w || !h) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    if (Math.abs(w - W) > 0.5 || Math.abs(h - H) > 0.5) { W = w; H = h; build(); }
    else draw(reduced ? 0 : (performance.now() - t0) / 1000);
    update();
  }

  // pointer input (mouse and pen); touch is handled with passive listeners so
  // vertical scrolling is never blocked
  function setPtr(cx, cy) {
    const r = el.getBoundingClientRect();
    const x = cx - r.left, y = cy - r.top, now = performance.now();
    if (!ptr.on) { ptr.px = x; ptr.py = y; ptr.vx = ptr.vy = 0; }
    else {
      const dt = Math.max(8, now - ptr.t) / 1000;
      // smooth the velocity estimate a little
      ptr.vx = ptr.vx * 0.5 + ((x - ptr.x) / dt) * 0.5;
      ptr.vy = ptr.vy * 0.5 + ((y - ptr.y) / dt) * 0.5;
    }
    ptr.x = x; ptr.y = y; ptr.t = now; ptr.on = true;
  }
  const leave = () => { ptr.on = false; ptr.vx = ptr.vy = 0; };
  if (!reduced) {
    el.addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') setPtr(e.clientX, e.clientY); }, { signal });
    el.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch') leave(); }, { signal });
    el.addEventListener('touchstart', (e) => { const t = e.touches[0]; ptr.on = false; setPtr(t.clientX, t.clientY); }, { passive: true }, { signal });
    el.addEventListener('touchmove', (e) => { const t = e.touches[0]; setPtr(t.clientX, t.clientY); }, { passive: true }, { signal });
    el.addEventListener('touchend', leave, { passive: true, signal });
    el.addEventListener('touchcancel', leave, { passive: true, signal });
  }

  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); running = false; n = 0; }, { signal });

  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.decoding = 'async';
  image.onload = () => {
    if (signal?.aborted) return;
    img = image;
    el.appendChild(canvas);
    watch(new ResizeObserver(resize)).observe(el);
    watch(new IntersectionObserver(([e]) => { visible = e.isIntersecting; update(); }, { rootMargin: '100px' })).observe(el);
    document.addEventListener('visibilitychange', update, { signal });
    resize();
  };
  image.onerror = () => {};
  image.src = src;
}
