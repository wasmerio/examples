/**
 * shard-field: a stream of small glass flakes sweeping across a dark hero.
 * Original implementation (WebGL2, instanced quads, CPU-side simulation).
 *
 * Each flake lives on a sweeping band (a spline across the box), drifts along
 * it, tumbles about its long axis (width + brightness pulse, rare glints) and
 * is drawn as a faceted diamond with radial chromatic fringes and a soft halo.
 * Pointer (read window-wide): hovering parts the stream sideways around a
 * smoothed cursor; a click sends a shockwave ring; press-and-hold gathers
 * flakes into an orbiting cloud that disperses, with a stronger ring, on release.
 *
 * Options via data attributes on the element (all optional):
 *   data-bg="#101010"  background the canvas clears to
 */

const VS = `#version 300 es
layout(location=0) in vec2 a_corner;
layout(location=1) in vec4 a_a; // x, y, length(px), angle
layout(location=2) in vec4 a_b; // width ratio, brightness, glint, hue
layout(location=3) in vec2 a_c; // accent flash, facet light (-1..1)
uniform vec2 u_res;
uniform float u_dpr;
const float E = 1.9;
out vec2 v_p;
out vec4 v_b;
out vec2 v_c;
out vec2 v_ca;
out float v_len;
void main(){
  v_c = a_c;
  float c = cos(a_a.w), s = sin(a_a.w);
  mat2 R = mat2(c, s, -s, c);
  vec2 local = a_corner * E;
  vec2 world = a_a.xy + R * (local * vec2(a_a.z, a_a.z * max(a_b.x, 0.35)));
  v_p = local * vec2(1.0, max(a_b.x, 0.35));
  v_b = a_b;
  v_len = a_a.z * u_dpr;
  // radial chromatic split, stronger toward the edges of the box, in local units
  vec2 rad = (a_a.xy - 0.5 * u_res) / max(u_res.x, u_res.y);
  vec2 ca = (vec2(1.0, 0.0) + rad * 1.6) * (0.11 + 1.1 / max(a_a.z, 1.0));
  v_ca = transpose(R) * ca;
  vec2 clip = world / u_res * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`;

const FS = `#version 300 es
precision highp float;
in vec2 v_p;
in vec4 v_b;
in vec2 v_c;
in vec2 v_ca;
in float v_len;
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform float u_fade;
out vec4 o;
float dia(vec2 p, float k){ return abs(p.x) + abs(p.y) / k; }
void main(){
  float k = v_b.x;
  float aa = 0.05 + 1.5 / max(v_len * k, 1.0);
  float dG = dia(v_p, k);
  float cG = smoothstep(1.0 + aa, 1.0 - aa, dG);
  float cR = smoothstep(1.0 + aa, 1.0 - aa, dia(v_p + v_ca, k));
  float cB = smoothstep(1.0 + aa, 1.0 - aa, dia(v_p - v_ca, k));
  vec3 base = mix(mix(u_c1, u_c2, v_b.w), vec3(1.0), 0.18);
  // two facets either side of the spine, lit unequally, plus a bright ridge
  float facet = 0.8 + 0.22 * sign(v_p.y) * v_c.y;
  float ridge = exp(-abs(v_p.y) / k * 9.0) * 0.5;
  float taper = 1.0 - 0.35 * abs(v_p.x);
  vec3 col = base * (facet + ridge) * taper * cG;
  col += vec3(1.0, 0.32, 0.22) * max(cR - cG, 0.0) * 1.2;
  col += vec3(0.2, 0.5, 1.0) * max(cB - cG, 0.0) * 1.3;
  col += vec3(1.0) * v_b.z * cG * (0.5 + ridge);
  // soft halo stands in for bloom
  float halo = exp(-dG * 2.4) * (0.10 + 0.45 * v_b.z);
  col += mix(base, vec3(1.0), 0.2) * halo;
  col *= v_b.y;
  // shockwave flash in the accent (white)
  col += u_c2 * v_c.x * (cG * 1.1 + halo * 2.4);
  col *= u_fade;
  o = vec4(col, 0.0);
}`;

const GVS = `#version 300 es
void main(){ vec2 p = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0); gl_Position = vec4(p, 0.0, 1.0); }`;
const GFS = `#version 300 es
precision highp float;
uniform vec3 u_bg;
uniform float u_seed;
out vec4 o;
void main(){
  vec2 q = gl_FragCoord.xy + u_seed;
  float n = fract(sin(dot(q, vec2(12.9898, 78.233))) * 43758.5453);
  o = vec4(u_bg + (n - 0.5) * 0.014, 1.0);
}`;

// Band centre line in box-relative units (x across, y down), left to right.
const PATH = [
  [-0.12, 0.64], [0.0, 0.56], [0.14, 0.46], [0.3, 0.4], [0.47, 0.43],
  [0.63, 0.53], [0.8, 0.66], [0.95, 0.82], [1.12, 1.0],
];
const SAMPLES = 256;
const FLOATS = 10;

function rgb(str, fb) {
  const m = /rgba?\(([^)]+)\)/.exec(str || '');
  if (m) {
    const p = m[1].split(',').map(parseFloat);
    if (p.length < 4 || p[3] > 0) return [p[0] / 255, p[1] / 255, p[2] / 255];
  }
  const h = /^#?([0-9a-f]{6})$/i.exec(str || '');
  if (h) { const n = parseInt(h[1], 16); return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; }
  return fb;
}
const hex = (n) => [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];

function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}
function gauss() { return (Math.random() + Math.random() + Math.random() + Math.random() - 2) * 1.73; }

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
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;opacity:0;transition:opacity 1.4s ease';
  let gl;
  try { gl = canvas.getContext('webgl2', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'low-power' }); } catch { gl = null; }
  if (!gl) return;

  const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
  const link = (a, b) => {
    const v = compile(gl.VERTEX_SHADER, a), f = compile(gl.FRAGMENT_SHADER, b);
    if (!v || !f) return null;
    const pr = gl.createProgram();
    gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr);
    return gl.getProgramParameter(pr, gl.LINK_STATUS) ? pr : null;
  };
  const prog = link(VS, FS), grain = link(GVS, GFS);
  if (!prog || !grain) return;

  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  el.style.touchAction = 'pan-y';
  el.appendChild(canvas);

  const bg = rgb(el.dataset.bg, [16 / 255, 16 / 255, 16 / 255]);
  const U = (n) => gl.getUniformLocation(prog, n);
  const uBg = gl.getUniformLocation(grain, 'u_bg'), uSeed = gl.getUniformLocation(grain, 'u_seed');
  const uRes = U('u_res'), uDpr = U('u_dpr'), uC1 = U('u_c1'), uC2 = U('u_c2'), uFade = U('u_fade');

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const inst = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, inst);
  gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, FLOATS * 4, 0); gl.vertexAttribDivisor(1, 1);
  gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 4, gl.FLOAT, false, FLOATS * 4, 16); gl.vertexAttribDivisor(2, 1);
  gl.enableVertexAttribArray(3); gl.vertexAttribPointer(3, 2, gl.FLOAT, false, FLOATS * 4, 32); gl.vertexAttribDivisor(3, 1);
  const empty = gl.createVertexArray();

  // ---- state
  let W = 0, H = 0, dpr = 1, scale = 1;
  const px = new Float32Array(SAMPLES + 1), py = new Float32Array(SAMPLES + 1);
  const tx = new Float32Array(SAMPLES + 1), ty = new Float32Array(SAMPLES + 1);
  let N = 0, P = null, data = null;
  // per particle: u, off, z, len, aspect, spin, omega, jitter, speed, glinty, hue,
  // gather g, gather velocity, cloud radius, cloud angle, phase, orbit rate
  const S = 17;

  function buildPath() {
    // dense samples of the spline in px, then re-sample by arc length
    const raw = [];
    const pts = PATH.map(([x, y]) => [x * W, y * H]);
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
      for (let j = 0; j < 32; j++) {
        const t = j / 32;
        raw.push([catmull(p0[0], p1[0], p2[0], p3[0], t), catmull(p0[1], p1[1], p2[1], p3[1], t)]);
      }
    }
    raw.push(pts[pts.length - 1]);
    const acc = [0];
    for (let i = 1; i < raw.length; i++) acc.push(acc[i - 1] + Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]));
    const total = acc[acc.length - 1];
    let j = 0;
    for (let i = 0; i <= SAMPLES; i++) {
      const d = (i / SAMPLES) * total;
      while (j < raw.length - 2 && acc[j + 1] < d) j++;
      const f = (d - acc[j]) / Math.max(acc[j + 1] - acc[j], 1e-6);
      px[i] = raw[j][0] + (raw[j + 1][0] - raw[j][0]) * f;
      py[i] = raw[j][1] + (raw[j + 1][1] - raw[j][1]) * f;
    }
    for (let i = 0; i <= SAMPLES; i++) {
      const a = Math.max(i - 1, 0), b = Math.min(i + 1, SAMPLES);
      const dx = px[b] - px[a], dy = py[b] - py[a], l = Math.hypot(dx, dy) || 1;
      tx[i] = dx / l; ty[i] = dy / l;
    }
  }

  function spawn(i, anywhere) {
    const o = i * S;
    const keepG = anywhere ? 0 : P[o + 11], keepV = anywhere ? 0 : P[o + 12];
    P[o] = anywhere ? Math.random() : -Math.random() * 0.04;
    // most flakes sit inside the band, a few stray outside it
    P[o + 1] = Math.random() < 0.12 ? (Math.random() * 2 - 1) * 1.8 : gauss() * 0.5;
    const z = Math.random();
    P[o + 2] = z;
    const r = Math.random();
    P[o + 3] = 1.3 + 11 * Math.pow(r, 2.4) * (0.4 + 1.1 * z * z); // half-length px at 1440
    P[o + 4] = 0.24 + Math.random() * 0.2; // width / length
    if (Math.random() < 0.07) { P[o + 3] *= 1.7; P[o + 4] *= 0.5; } // streaks
    P[o + 5] = Math.random() * Math.PI * 2;
    P[o + 6] = (0.35 + Math.random() * 1.2) * (Math.random() < 0.5 ? -1 : 1);
    P[o + 7] = (Math.random() - 0.5) * 0.45;
    P[o + 8] = 0.65 + Math.random() * 0.7;
    P[o + 9] = Math.random() < 0.3 ? 1 : 0;
    P[o + 10] = Math.random() < 0.15 ? 0.5 + Math.random() * 0.5 : Math.random() * 0.2;
    P[o + 11] = keepG; P[o + 12] = keepV;
    P[o + 13] = Math.abs(gauss()) * 0.5 + Math.random() * 0.08; // cloud radius (x sigma)
    P[o + 14] = Math.random() * Math.PI * 2;
    P[o + 16] = (0.25 + Math.random() * 0.5) * (Math.random() < 0.8 ? 1 : -1);
    P[o + 15] = Math.random() * Math.PI * 2;
  }

  function resize() {
    const r = el.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    scale = Math.max(0.72, Math.min(1.25, Math.hypot(W, H) / Math.hypot(1440, 792)));
    buildPath();
    const want = Math.round(Math.max(1000, Math.min(2500, 2500 * (W * H) / (1440 * 792))));
    if (want !== N) {
      N = want;
      P = new Float32Array(N * S);
      data = new Float32Array(N * FLOATS);
      for (let i = 0; i < N; i++) spawn(i, true);
      gl.bindBuffer(gl.ARRAY_BUFFER, inst);
      gl.bufferData(gl.ARRAY_BUFFER, data.byteLength, gl.DYNAMIC_DRAW);
    }
  }

  // ---- pointer, read window-wide and mapped into the box
  const SKIP = 'a,button,input,select,textarea,label,summary,[role="button"],[role="link"]';
  const ptr = {
    x: 0, y: 0, in: false, // raw
    sx: 0, sy: 0, vx: 0, vy: 0, // smoothed (critically damped)
    pres: 0, down: false, downAt: 0, gathering: false, G: 0, Gv: 0,
  };
  const ripples = [0, 1, 2, 3].map(() => ({ on: false, x: 0, y: 0, t: 0, s: 1 }));
  let time = 8;
  const fire = (x, y, strength) => {
    const r = ripples.find((q) => !q.on);
    if (r) { r.on = true; r.x = x; r.y = y; r.t = 0; r.s = strength; }
  };
  const locate = (e) => {
    const r = el.getBoundingClientRect();
    ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top;
    ptr.in = ptr.x >= 0 && ptr.y >= 0 && ptr.x <= r.width && ptr.y <= r.height;
  };
  const onMove = (e) => {
    const was = ptr.pres > 0.001;
    locate(e);
    if (ptr.in && !was) { ptr.sx = ptr.x; ptr.sy = ptr.y; ptr.vx = ptr.vy = 0; }
  };
  const release = (strong) => {
    if (!ptr.down) return;
    ptr.down = false;
    if (ptr.gathering && strong && ptr.G > 0.3) fire(ptr.sx, ptr.sy, 1 + 0.8 * Math.min(1, ptr.G));
    ptr.gathering = false;
  };
  const onDown = (e) => {
    if (e.button > 0 || (e.target instanceof Element && e.target.closest(SKIP))) return;
    onMove(e);
    if (!ptr.in) return;
    ptr.down = true; ptr.downAt = time; ptr.sx = ptr.x; ptr.sy = ptr.y;
    window.getSelection()?.removeAllRanges();
    fire(ptr.x, ptr.y, 1);
  };
  const onUp = (e) => {
    locate(e);
    release(true);
    if (e.pointerType !== 'mouse') ptr.in = false;
  };
  const onCancel = () => { release(false); ptr.in = false; };
  if (!reduced) {
    const o = { passive: true };
    window.addEventListener('pointermove', onMove, { ...o, signal });
    window.addEventListener('pointerdown', onDown, { ...o, signal });
    window.addEventListener('pointerup', onUp, { ...o, signal });
    window.addEventListener('pointercancel', onCancel, { ...o, signal });
    window.addEventListener('blur', onCancel, { ...o, signal });
    document.documentElement.addEventListener('pointerleave', () => { ptr.in = false; }, { ...o, signal });
    // A press on the field is a gesture, not a text selection: block selecting and dragging the copy on top.
    const block = (e) => { if (ptr.down) e.preventDefault(); };
    document.addEventListener('selectstart', block, { signal });
    document.addEventListener('dragstart', block, { signal });
  }

  const BASE_SPEED = 1 / 42; // band fraction per second
  const TAU = Math.PI * 2;
  const smooth01 = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

  function updatePointer(dt) {
    // critically damped follow, settles in ~0.12 s
    const w = 34;
    const ax = w * w * (ptr.x - ptr.sx) - 2 * w * ptr.vx;
    const ay = w * w * (ptr.y - ptr.sy) - 2 * w * ptr.vy;
    ptr.vx += ax * dt; ptr.vy += ay * dt;
    ptr.sx += ptr.vx * dt; ptr.sy += ptr.vy * dt;
    // presence: quick in, slower out
    const target = ptr.in ? 1 : 0;
    ptr.pres += (target - ptr.pres) * (1 - Math.exp(-dt / (ptr.in ? 0.035 : 0.085)));
    if (!ptr.in && ptr.down) release(true);
    if (ptr.down && !ptr.gathering && time - ptr.downAt > 0.15) ptr.gathering = true;
    // global gather amount, soft spring
    const gt = ptr.gathering ? 1 : 0, gw = ptr.gathering ? 5 : 4.5;
    ptr.Gv += (gw * gw * (gt - ptr.G) - 2 * gw * ptr.Gv) * dt;
    ptr.G += ptr.Gv * dt;
    for (const r of ripples) if (r.on && (r.t += dt) > 2.6) r.on = false;
  }

  function step(dt, t) {
    updatePointer(dt);
    const sx = ptr.sx, sy = ptr.sy;
    const pres = ptr.pres;
    const hover = pres * (1 - Math.min(1, Math.max(0, ptr.G)));
    const La = H * 0.34, Lc = H * 0.13; // influence blob: long along the flow, short across
    const push = H * 0.055 * hover;
    const bend = 0.9 / H; // the blob bows with the stream
    const light = pres * ((sx / W - 0.5) * 2.2 + (sy / H - 0.5) * 1.2);
    const speed = 2 * H; // ring front: ~4 half-heights per second
    const rAmp = H * 0.05;
    const diag = Math.hypot(W, H);
    const cloud = H * 0.1;
    const gathering = ptr.gathering;
    const held = gathering ? t - ptr.downAt - 0.15 : 0;
    let w = 0;
    for (let i = 0; i < N; i++) {
      const o = i * S;
      const z = P[o + 2];
      P[o] += BASE_SPEED * P[o + 8] * (0.7 + 0.6 * z) * dt;
      if (P[o] > 1.02) spawn(i, false);
      const u = P[o];
      const fi = Math.min(Math.max(u, 0), 1) * SAMPLES;
      const i0 = Math.min(fi | 0, SAMPLES - 1), f = fi - i0;
      const cx = px[i0] + (px[i0 + 1] - px[i0]) * f, cy = py[i0] + (py[i0 + 1] - py[i0]) * f;
      const ux = tx[i0], uy = ty[i0];
      const nx = -uy, ny = ux;
      const half = Math.min(H, W * 0.8) * (0.25 - 0.08 * u) * (1 + 0.15 * Math.sin(u * 9 + t * 0.15));
      const off = P[o + 1] * half + Math.sin(t * 0.3 + P[o + 15]) * 6 * scale;
      let x = cx + nx * off + (u < 0 ? ux * u * W : 0);
      let y = cy + ny * off + (u < 0 ? uy * u * W : 0);
      const bx = x, by = y;
      let ang = Math.atan2(uy, ux) * 0.6 + P[o + 7];
      let turn = 0, tip = 0, flash = 0;

      // hover: part the stream sideways around the cursor
      if (hover > 0.002) {
        const rx = x - sx, ry = y - sy;
        const along = rx * ux + ry * uy;
        const across = rx * nx + ry * ny - bend * along * along * 0.5;
        const e = Math.exp(-(along * along) / (La * La) - (across * across) / (Lc * Lc));
        if (e > 0.003) {
          const side = Math.tanh(across / (Lc * 0.35));
          const d = push * e * side * (0.7 + 0.5 * z);
          x += nx * d; y += ny * d;
          // heading follows the slope of the parting
          const slope = d * (-2 * along / (La * La));
          turn = Math.atan(slope * 1.6);
        }
      }

      // click shockwaves
      for (let q = 0; q < 4; q++) {
        const r = ripples[q];
        if (!r.on) continue;
        const dx = x - r.x, dy = y - r.y;
        const dist = Math.hypot(dx, dy) || 1;
        const tau = r.t - dist / speed;
        if (tau <= 0 || tau > 1.9) continue;
        const env = Math.exp(-tau * 2.6) * (1 - Math.exp(-tau * 40)) / (1 + dist / (0.7 * H));
        const wob = Math.sin(TAU * 1.5 * tau) * env * r.s;
        const d = wob * rAmp * (0.7 + 0.5 * z);
        x += (dx / dist) * d; y += (dy / dist) * d;
        flash += (Math.abs(wob) * 0.35 + Math.exp(-tau * 13) * (1 - Math.exp(-tau * 60)) / (1 + dist / (0.9 * H)) * 0.9) * r.s;
        tip += wob;
      }

      // press and hold: gather into an orbiting cloud
      let g = P[o + 11], gv = P[o + 12];
      const delay = 0.1 + 0.6 * Math.min(1, Math.hypot(bx - sx, by - sy) / diag * 1.6) + 0.35 * (1 - z);
      const gt = gathering ? smooth01((held - delay) / 0.55) : 0;
      const gw = gathering ? 6 : 4.6;
      gv += (gw * gw * (gt - g) - 2 * gw * gv) * dt;
      g += gv * dt;
      P[o + 11] = g; P[o + 12] = gv;
      let shrink = 1;
      if (g > 0.001) {
        const rr = P[o + 13] * cloud * (1 + 0.18 * Math.sin(t * 0.7 + P[o + 15] * 3));
        P[o + 14] += P[o + 16] * dt * (0.6 + 0.6 / (0.4 + P[o + 13]));
        const phi = P[o + 14] + 0.4 * Math.sin(t * 0.33 + P[o + 13] * 4);
        const gx = sx + Math.cos(phi) * rr * 1.15, gy = sy + Math.sin(phi) * rr * 0.9;
        const ge = Math.min(1, Math.max(0, g));
        x += (gx - x) * ge; y += (gy - y) * ge;
        const orbit = phi + (P[o + 16] > 0 ? Math.PI / 2 : -Math.PI / 2);
        ang += Math.atan2(Math.sin(orbit - ang), Math.cos(orbit - ang)) * ge * 0.8;
        shrink = 1 - 0.3 * ge;
      }

      // tumble
      P[o + 5] += P[o + 6] * dt;
      const th = P[o + 5];
      const face = Math.abs(Math.sin(th + tip * 1.2));
      const len = P[o + 3] * scale * (1.35 - 0.6 * Math.min(Math.max(u, 0), 1)) * shrink * (1 + 0.2 * Math.min(1, flash));
      ang += turn + 0.25 * Math.sin(th * 0.5 + P[o + 15]);
      const kk = P[o + 4] * (0.25 + 0.75 * face);
      const edge = Math.min(1, (u + 0.02) / 0.08, (1.02 - u) / 0.1);
      const vis = Math.max(edge, Math.min(1, g));
      const bright = Math.max(0, vis) * (1 - 0.6 * Math.min(1, Math.max(0, g))) * (0.13 + 0.6 * z * z) * (0.45 + 0.75 * face) * (1.25 - 0.45 * Math.min(Math.max(u, 0), 1));
      const gl0 = th * 2 + P[o + 15] + light;
      const glint = P[o + 9] ? Math.pow(Math.max(0, Math.cos(gl0)), 22) * (0.9 + 1.6 * z * z) : 0;

      data[w++] = x; data[w++] = y; data[w++] = len; data[w++] = ang;
      data[w++] = kk; data[w++] = bright; data[w++] = glint; data[w++] = P[o + 10];
      data[w++] = Math.min(1.2, flash) * Math.max(0, vis) * (0.4 + 0.5 * z); data[w++] = Math.cos(th + light * 0.8);
    }
  }

  const c1 = hex(0xa3a3a3), c2 = hex(0xf2f2f2); // neutral greys; the fringes keep the colour
  let fade = 0, frame = 0;
  function draw() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.disable(gl.BLEND);
    gl.useProgram(grain);
    gl.bindVertexArray(empty);
    gl.uniform3f(uBg, bg[0], bg[1], bg[2]);
    gl.uniform1f(uSeed, (frame++ % 64) * 17.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.useProgram(prog);
    gl.bindVertexArray(vao);
    gl.uniform2f(uRes, W, H);
    gl.uniform1f(uDpr, dpr);
    gl.uniform3f(uC1, c1[0] * 1.5, c1[1] * 1.5, c1[2] * 1.5);
    gl.uniform3f(uC2, c2[0] * 1.3, c2[1] * 1.3, c2[2] * 1.3);
    gl.uniform1f(uFade, fade);
    gl.bindBuffer(gl.ARRAY_BUFFER, inst);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, N);
  }

  resize();

  if (reduced) {
    fade = 1;
    step(0, time);
    draw();
    canvas.style.transition = 'none';
    canvas.style.opacity = '1';
    watch(new ResizeObserver(() => { resize(); step(0, time); draw(); })).observe(el);
    return;
  }

  let visible = true, inView = false, raf = 0, last = 0, born = -1;
  const loop = (now) => {
    if (signal?.aborted) return;
    raf = 0;
    if (!visible || !inView) return;
    const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
    last = now;
    if (born < 0) { born = now; canvas.style.opacity = '1'; }
    const age = (now - born) / 1000;
    fade = Math.min(1, Math.max(0, (age - 0.3) / 1.8));
    fade = fade * fade * (3 - 2 * fade);
    time += dt;
    step(dt, time);
    draw();
    raf = requestAnimationFrame(loop);
  };
  const kick = () => { if (!raf && visible && inView) { last = 0; raf = requestAnimationFrame(loop); } };

  watch(new ResizeObserver(() => { resize(); if (!raf) { step(0, time); draw(); } })).observe(el);
  watch(new IntersectionObserver((es) => { inView = es[es.length - 1].isIntersecting; kick(); })).observe(el);
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; kick(); }, { signal });
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); cancelAnimationFrame(raf); raf = 0; inView = false; canvas.style.opacity = '0'; }, { signal });
}
