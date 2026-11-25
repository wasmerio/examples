/**
 * flow-lines: a field of thin bright contour lines drifting through slow,
 * curving bends. Lines are the isolines of a scalar field (a tilted ramp
 * pushed around by layered noise). Where the bends squeeze the isolines
 * together they form bright silvery ribbons; elsewhere they fade out.
 * A large soft push follows the eased pointer and rests at the centre.
 *
 * mount(el, { reduced }) fills `el` with a canvas. Pointer input is read
 * from el's parent so overlaid cards don't swallow it.
 */

const VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;      // canvas size in device px
uniform float uTime;
uniform vec3 uPtr;      // pointer (x, y in panel-height units, strength 0..1)
uniform float uDpr;
out vec4 o;

// 2D simplex noise (standard construction, own transcription)
vec3 perm(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865, 0.366025404, -0.577350269, 0.024390244);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = x0.x > x0.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = perm(perm(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 a0 = x - floor(x + 0.5);
  m *= 1.79284291 - 0.85373473 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Lines are isolines of the across-line coordinate in a frame rotated
// -45deg (rising to the right), bent by slow noise and by a soft Gaussian
// push that follows the eased pointer (centre of the panel when idle).
float across(vec2 p, float t, out float along) {
  vec2 q = p - vec2(0.5 * uRes.x / uRes.y, 0.5);
  const vec2 R = vec2(0.848, 0.530);     // cos/sin of the ~32deg line angle
  float u = q.x * R.x - q.y * R.y;       // along the lines
  float v = q.x * R.y + q.y * R.x;       // across the lines
  along = u;
  v += 0.13 * snoise(vec2(u * 0.75 - t * 0.06, v * 0.3 + t * 0.025));
  v += 0.02 * snoise(vec2(u * 1.6 + 7.0, v * 0.8 - t * 0.05));
  vec2 d = p - uPtr.xy;
  v += uPtr.z * exp(-dot(d, d) / (2.0 * 0.17 * 0.17));
  return v;
}

void main() {
  vec2 frag = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 p = frag / uRes.y;                 // panel-height units, y down
  float t = uTime * 0.45;
  float u;
  float v = across(p, t, u);

  // Monotone respacing g = G(v): squeezes neighbouring lines into ribbons
  // along the flow without changing the lines' shapes (0.17 * 3.2 < 1).
  float ph = 1.6 * snoise(vec2(v * 0.45, t * 0.05)) + t * 0.06;
  float g = v + 0.17 * sin(3.2 * v + ph);
  const float N = 38.0;                   // lines per panel-height unit
  float val = g * N;
  float fw = max(fwidth(val), 1e-4);      // val units per device px
  float px = (0.5 - abs(fract(val) - 0.5)) / fw;

  // brightness: packed lines glow; slow bands swell and fade over time
  float spacing = 1.0 / (fw * uDpr);      // CSS px between lines
  float bunch = 1.0 - smoothstep(8.0, 19.0, spacing);
  float band = snoise(vec2(u * 0.55 - t * 0.04, v * 1.0 + t * 0.03)) * 0.5 + 0.5;
  band = smoothstep(0.2, 0.85, band) * (0.8 + 0.2 * sin(t * 0.5 + v * 2.0));
  float lum = mix(0.1 + 0.3 * band, 0.55 + 0.7 * band, bunch);
  lum *= 0.65 + 0.35 * snoise(vec2(u * 2.2 - t * 0.2, g * 6.0));  // streaks
  lum = pow(clamp(lum, 0.0, 1.0), 1.5);

  float sig = (0.42 + 1.7 * lum * lum) * uDpr;
  float line = exp(-0.5 * px * px / (sig * sig));
  line *= 1.0 - smoothstep(0.3, 0.5, fw);

  float c = line * lum;
  vec3 bg = vec3(16.0 / 255.0);
  o = vec4(bg + (vec3(0.96) - bg) * c, 1.0);
}`;

export function mount(el, { reduced = false, signal } = {}) {
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
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y;';
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'low-power' });
  if (!gl) return;

  const sh = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = sh(gl.VERTEX_SHADER, VERT);
  const fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  el.style.touchAction = 'pan-y';
  el.appendChild(canvas);

  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uPtr = gl.getUniformLocation(prog, 'uPtr');
  const uDpr = gl.getUniformLocation(prog, 'uDpr');

  const PUSH = 0.17;       // warp amplitude, panel-height units
  const LAG = 0.3;         // pointer easing time constant, seconds
  let w = 0, h = 0, dpr = 1;
  let time = 20.0;         // start a little way in for a nicer first frame
  let last = 0, raf = 0, visible = false, inside = false;
  const target = { x: 0, y: 0.5 };
  const ptr = { x: 0, y: 0.5 };

  function draw() {
    if (!w || !h) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, time);
    gl.uniform3f(uPtr, ptr.x, ptr.y, PUSH);
    gl.uniform1f(uDpr, dpr);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function resize() {
    const r = el.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    if (!inside && h) { target.x = w / h / 2; target.y = 0.5; }
    if (!last && h) { ptr.x = target.x; ptr.y = target.y; }
    draw();
  }

  function frame(now) {
    if (signal?.aborted) return;
    raf = 0;
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    time += dt;
    const k = 1 - Math.exp(-dt / LAG);
    ptr.x += (target.x - ptr.x) * k;
    ptr.y += (target.y - ptr.y) * k;
    draw();
    if (visible && !document.hidden) raf = requestAnimationFrame(frame);
  }
  const start = () => { if (!raf && !reduced && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } };
  const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };

  watch(new ResizeObserver(resize)).observe(el);
  resize();

  if (reduced) { draw(); return; }

  const host = el.parentElement || el;
  host.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    if (!r.height) return;
    inside = true;
    target.x = (e.clientX - r.left) / r.height;
    target.y = (e.clientY - r.top) / r.height;
  }, { passive: true, signal });
  // the warp never switches off: it drifts back to the panel centre
  const release = () => { inside = false; if (h) { target.x = w / h / 2; target.y = 0.5; } };
  host.addEventListener('pointerleave', release, { passive: true, signal });
  host.addEventListener('pointercancel', release, { passive: true, signal });

  watch(new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1].isIntersecting;
    visible ? start() : stop();
  })).observe(el);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()), { signal });
}
