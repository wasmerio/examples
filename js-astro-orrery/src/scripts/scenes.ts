/**
 * The three canvas visuals, in one small dependency-free script:
 *   plexus  rotating 3D particle network (hero)
 *   flow    drifting lines (media panel)
 *   wave    3D field of dots rolling like a swell (footer)
 *
 * Usage: <canvas data-scene="plexus|flow|wave" aria-hidden="true"></canvas>
 * Line and dot color = the canvas's CSS `color`; accent = its --accent.
 * Device pixel ratio is capped at 2. A scene draws only while it is on screen
 * and the tab is visible. With prefers-reduced-motion: reduce it draws one
 * still frame and never animates.
 */

type Point = { x: number; y: number };
type Draw = (c: CanvasRenderingContext2D, w: number, h: number, t: number, ink: string, accent: string, p: Point) => void;

/** Pointer position in viewport coordinates; far away until the pointer moves. */
const pointer: Point = { x: -1e5, y: -1e5 };
addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") (pointer.x = e.clientX), (pointer.y = e.clientY); }, { passive: true });
document.documentElement.addEventListener("pointerleave", () => (pointer.x = pointer.y = -1e5));

const TAU = Math.PI * 2;

/** Seeded random numbers, so every visitor gets the same network. */
function random(seed: number) {
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}

function plexus(): Draw {
  const rnd = random(11);
  const N = 140;
  const pts: number[][] = [];
  // An airy cloud, larger than the hero: points spread evenly through the volume (no clumps).
  // Each point also gets its own slow drift (phase, speed), so the mesh breathes as it turns.
  for (let i = 0; i < N; i++) {
    const u = rnd() * 2 - 1;
    const a = rnd() * TAU;
    const r = Math.cbrt(rnd());
    const s = Math.sqrt(1 - u * u) * r;
    pts.push([s * Math.cos(a) * 1.5, u * r * 0.82, s * Math.sin(a), rnd() * TAU, 0.6 + rnd() * 0.8]);
  }
  // Link each point to its six nearest neighbours once: long lines with clear gaps between them.
  const seen = new Set<number>();
  const links: number[] = [];
  for (let i = 0; i < N; i++) {
    const near = pts
      .map((b, j) => [Math.hypot(pts[i][0] - b[0], pts[i][1] - b[1], pts[i][2] - b[2]), j])
      .sort((p, q) => p[0] - q[0])
      .slice(1, 7);
    for (const [, j] of near) {
      const key = Math.min(i, j) * N + Math.max(i, j);
      if (!seen.has(key)) seen.add(key), links.push(i, j);
    }
  }
  const xy = new Float32Array(N * 4); // x, y, depth 0..1, edge fade 0..1
  const push = new Float32Array(N * 2); // eased pointer displacement, px

  return (c, w, h, t, ink, accent, p) => {
    const turn = t * 0.00006;
    const tilt = 0.3 + Math.sin(t * 0.00004) * 0.08;
    const [cy, sy, cx, sx] = [Math.cos(turn), Math.sin(turn), Math.cos(tilt), Math.sin(tilt)];
    // The canvas is the whole hero; the cloud is ~1.4× its width, centred at 65% / 55%, so it runs
    // off the right and bottom edges like an environment (on tall phones it sizes to the height).
    const scale = Math.max(w, h * 0.8) * 0.467;
    const R = Math.max(150, Math.min(180, w * 0.12)); // pointer reach
    for (let i = 0; i < N; i++) {
      const [x0, y0, z0, ph, sp] = pts[i];
      const x = x0 + Math.sin(t * 0.0005 * sp + ph) * 0.05;
      const y = y0 + Math.cos(t * 0.0004 * sp + ph * 1.7) * 0.05;
      const z = z0 + Math.sin(t * 0.00033 * sp + ph * 2.3) * 0.05;
      const x1 = x * cy + z * sy;
      const z1 = z * cy - x * sy;
      const y1 = y * cx - z1 * sx;
      const z2 = z1 * cx + y * sx;
      const f = 3 / (3 + z2);
      const px = x1 * f;
      const py = y1 * f;
      const sx0 = w * 0.65 + px * scale;
      const sy0 = h * 0.55 + py * scale;
      // The pointer pushes nearby points away; they spring back when it leaves.
      let tx = 0;
      let ty = 0;
      const dx = sx0 - p.x;
      const dy = sy0 - p.y;
      const d = Math.hypot(dx, dy);
      if (d < R && d > 0.01) {
        const k = (1 - d / R) ** 1.6 * R * 0.6;
        tx = (dx / d) * k;
        ty = (dy / d) * k;
      }
      push[i * 2] += (tx - push[i * 2]) * 0.08;
      push[i * 2 + 1] += (ty - push[i * 2 + 1]) * 0.08;
      xy[i * 4] = sx0 + push[i * 2];
      xy[i * 4 + 1] = sy0 + push[i * 2 + 1];
      xy[i * 4 + 2] = Math.max(0, Math.min(1, (1.1 - z2) / 2.2));
      const edge = Math.hypot(px / 1.5, py / 0.82);
      xy[i * 4 + 3] = edge > 0.75 ? Math.max(0, 1 - (edge - 0.75) / 0.3) : 1;
    }
    // Overlapping lines add up, so bundles glow where links cross; five brightness bands.
    c.globalCompositeOperation = "lighter";
    c.strokeStyle = ink;
    c.lineWidth = 0.7;
    for (let band = 0; band < 5; band++) {
      c.beginPath();
      for (let k = 0; k < links.length; k += 2) {
        const i = links[k] * 4;
        const j = links[k + 1] * 4;
        const v = ((xy[i + 2] + xy[j + 2]) / 2) * Math.min(xy[i + 3], xy[j + 3]);
        if (Math.min(4, Math.floor(v * 5)) !== band) continue;
        c.moveTo(xy[i], xy[i + 1]);
        c.lineTo(xy[j], xy[j + 1]);
      }
      c.globalAlpha = 0.07 + band * 0.07;
      c.stroke();
    }
    // The pointer "grabs" the points within reach (as on the reference): a fading line to each.
    for (let i = 0; i < N; i++) {
      const d = Math.hypot(xy[i * 4] - p.x, xy[i * 4 + 1] - p.y);
      if (d >= R) continue;
      c.globalAlpha = 0.6 * (1 - d / R);
      c.beginPath();
      c.moveTo(p.x, p.y);
      c.lineTo(xy[i * 4], xy[i * 4 + 1]);
      c.stroke();
    }
    // Points: three in ten accent-coloured with a soft halo, the rest small and pale.
    for (let i = 0; i < N; i++) {
      const d = xy[i * 4 + 2] * xy[i * 4 + 3];
      if (d < 0.02) continue;
      const lit = i % 10 < 3;
      c.fillStyle = lit ? accent : ink;
      if (lit) {
        c.globalAlpha = 0.1 * d;
        c.beginPath();
        c.arc(xy[i * 4], xy[i * 4 + 1], 6, 0, TAU);
        c.fill();
      }
      c.globalAlpha = (lit ? 0.6 : 0.5) * (0.3 + d * 0.7);
      c.beginPath();
      c.arc(xy[i * 4], xy[i * 4 + 1], lit ? 2.6 : 1.3 + d * 0.5, 0, TAU);
      c.fill();
    }
    c.globalCompositeOperation = "source-over";
  };
}

function flow(): Draw {
  return (c, w, h, t, ink, accent) => {
    const lines = 26;
    const step = w / 48;
    c.lineWidth = 1;
    for (let i = 0; i < lines; i++) {
      c.beginPath();
      for (let k = 0; k <= 48; k++) {
        const y =
          h * (0.12 + (0.76 * i) / lines) +
          Math.sin(k * 0.16 + i * 0.45 + t * 0.0005) * h * 0.07 +
          Math.sin(k * 0.06 - t * 0.0003 + i * 0.21) * h * 0.11;
        k ? c.lineTo(k * step, y) : c.moveTo(0, y);
      }
      const lit = i % 7 === 3;
      c.strokeStyle = lit ? accent : ink;
      c.globalAlpha = lit ? 0.55 : 0.14 + (i % 3) * 0.06;
      c.stroke();
    }
  };
}

function wave(): Draw {
  return (c, w, h, t, ink) => {
    const cols = 70;
    const rows = 26;
    c.fillStyle = ink;
    for (let r = 0; r < rows; r++) {
      const z = r / (rows - 1); // 0 far … 1 near
      const f = 1 / (1.9 - z * 1.3);
      c.globalAlpha = 0.12 + z * 0.55;
      const size = 0.8 + z * 1.8;
      for (let k = 0; k < cols; k++) {
        const x = (k / (cols - 1)) * 2 - 1;
        const lift = Math.sin(x * 2.6 + t * 0.0005 + z * 2.2) * Math.cos(z * 3.4 - t * 0.0003 + x) * 0.5;
        c.fillRect(w / 2 + x * w * 0.62 * f, h * (0.3 + z * 0.62) - lift * h * 0.22 * f, size, size);
      }
    }
  };
}

const SCENES: Record<string, () => Draw> = { plexus, flow, wave };
const still = matchMedia("(prefers-reduced-motion: reduce)");

for (const canvas of document.querySelectorAll<HTMLCanvasElement>("canvas[data-scene]")) {
  const ctx = canvas.getContext("2d");
  const make = SCENES[canvas.dataset.scene ?? ""];
  if (!ctx || !make) continue;
  const draw = make();
  let ink = "";
  let accent = "";
  let w = 0;
  let h = 0;
  let dpr = 1;
  let t = 9000; // scene time in ms; also the pose of the still frame
  let last = 0;
  let raf = 0;
  let onScreen = false;

  const frame = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const box = canvas.getBoundingClientRect();
    draw(ctx, w, h, t, ink, accent, { x: pointer.x - box.left, y: pointer.y - box.top });
    ctx.globalAlpha = 1;
  };
  const loop = (now: number) => {
    t += Math.min(now - (last || now), 50); // no jump after a pause
    last = now;
    frame();
    raf = requestAnimationFrame(loop);
  };
  const update = () => {
    cancelAnimationFrame(raf);
    raf = last = 0;
    if (onScreen && !document.hidden && !still.matches) raf = requestAnimationFrame(loop);
  };

  new ResizeObserver(() => {
    // Colors are read here, after layout: WebKit can run the script before the stylesheet applies.
    const css = getComputedStyle(canvas);
    ink = css.color;
    accent = css.getPropertyValue("--accent").trim() || ink;
    dpr = Math.min(2, devicePixelRatio || 1);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    frame();
  }).observe(canvas);
  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    update();
  }).observe(canvas);
  document.addEventListener("visibilitychange", update);
  still.addEventListener("change", update);
}
