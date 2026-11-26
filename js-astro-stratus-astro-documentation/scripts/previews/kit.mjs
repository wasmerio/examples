/**
 * Component-preview kit — the authoring API for `*.preview.mjs` recipe files.
 *
 * A recipe declares a content `width` and draws in absolute canvas coordinates;
 * `compile()` centers the bounding box and asserts it matches that width. Output is
 * deterministic and browser-free; screenshots (`screenshot.mjs`) are never an input.
 *
 * Rules:
 *
 *   1. TEN COLOR ROLES, no raw hex (glossary below). Re-skin the set from one place.
 *   2. A FIVE-STEP TYPE SCALE (display/heading/label/body/micro). `bar()` takes
 *      a step, not a pixel height, so no recipe can add a sixth size.
 *   3. A THREE-STEP STROKE SCALE (control 2 / field 3 / active 4).
 *   4. FOUR CONTENT WIDTH BANDS (560 / 760 / 960 / 1120), asserted at build
 *      time. Components that would read as distorted set `exempt: true`.
 *   5. EVERYTHING CENTERS on (640, 360) — `compile()` applies the offset.
 *
 * Geometry is integer. Prefer the composites (`pill`, `field`, `media`,
 * `cropCorners`, …) over raw shapes: they carry the on-system weights, radii and
 * insets. Absolute y values are arbitrary; start at 0 and work down.
 */

// 16:9 to match CloudCannon's structure-picker card (`.c-card__preview`, ~286×160).

export const W = 1280;
export const H = 720;
export const CX = W / 2;
export const CY = H / 2;

// Light values are the `var()` fallback, since page CSS can't reach an `<img>`-loaded
// SVG; dark values arrive via the in-document `@media` block `compile()` injects.
//
//   paper    the page behind everything
//   panel    a subtly-tinted panel (mobile menu, side nav, chevron chips)
//   surface  a filled media / card surface, one step stronger than panel
//   line     a faint hairline border or rule
//   glyph    a placeholder mark: inactive control, dropdown copy, media glyph
//   body     body-copy text bars
//   subject  what the preview is about — headings, active marks, nav labels
//   ink      the brand primary (a dark neutral by default): filled buttons
//   on-ink   a faint label bar drawn inside an `ink` fill
//   accent   the interactive color (active tab, marker) — one mark per preview

const LIGHT = {
  paper: "#FFFFFF",
  panel: "#F6F7F9",
  surface: "#ECEFF3",
  line: "#E2E6EB",
  glyph: "#CFD5DD",
  body: "#D8DDE4",
  subject: "#A3ABB6",
  ink: "#08090B",
  "on-ink": "#8A9099",
  accent: "#0F766E",
};

const DARK = {
  paper: "#08090B",
  panel: "#101216",
  surface: "#191D23",
  line: "#23272F",
  glyph: "#333944",
  body: "#2B313A",
  subject: "#555B64",
  ink: "#F3F5F8",
  "on-ink": "#6C737E",
  accent: "#5EEAD4",
};

const role = (name) => `var(--pv-${name}, ${LIGHT[name]})`;

export const paper = role("paper");
export const panel = role("panel");
export const surface = role("surface");
export const line = role("line");
export const glyph = role("glyph");
export const body = role("body");
export const subject = role("subject");
export const ink = role("ink");
export const onInk = role("on-ink");
export const accent = role("accent");

/** Type scale. Text is a fully-rounded bar at one of these five heights. */
export const TYPE = {
  display: 40,
  heading: 26,
  label: 16,
  body: 12,
  micro: 8,
};

/** Default role per type step — body copy is quieter than a heading. */
const TYPE_FILL = {
  display: subject,
  heading: subject,
  label: subject,
  body,
  micro: onInk,
};

/** Stroke scale. `control` = button/segment outline, `field` = form input, `active` = selected. */
export const STROKE = { control: 2, field: 3, active: 4 };

/** Corner radii. `box` is the universal soft corner; `tile` is the big icon plate. */
export const R = { box: 10, tile: 44 };

/** The four content width bands. */
export const BANDS = [560, 760, 960, 1120];

/** @param {number} w One of BANDS, or any width when the recipe is `exempt`. */
export function band(w) {
  const left = Math.round((W - w) / 2);

  return { w, left, right: left + w, cx: CX };
}

// Primitives return elements in absolute canvas coordinates; draw order is array order.

const num = (v) => Math.round(v);

/** @param {object} [o] { fill, stroke, sw, r, dash, opacity } */
export function box(x, y, w, h, o = {}) {
  return {
    k: "rect",
    x: num(x),
    y: num(y),
    w: num(w),
    h: num(h),
    r: o.r ?? R.box,
    fill: o.fill ?? surface,
    stroke: o.stroke ?? null,
    sw: o.sw ?? (o.stroke ? STROKE.control : null),
    dash: o.dash ?? null,
    opacity: o.opacity ?? null,
  };
}

/**
 * @param {"display"|"heading"|"label"|"body"|"micro"} size
 * @param {object} [o] { fill, opacity }
 */
export function bar(x, y, w, size = "body", o = {}) {
  const h = TYPE[size];

  if (!h) throw new Error(`bar(): unknown type step "${size}"`);

  return box(x, y, w, h, {
    r: h / 2,
    fill: o.fill ?? TYPE_FILL[size],
    opacity: o.opacity,
  });
}

/** Filled circle. @param {object} [o] { fill, opacity } */
export function dot(cx, cy, r, o = {}) {
  return {
    k: "circle",
    cx: num(cx),
    cy: num(cy),
    r: num(r),
    fill: o.fill ?? glyph,
    stroke: o.stroke ?? null,
    sw: o.sw ?? (o.stroke ? STROKE.control : null),
    opacity: o.opacity ?? null,
  };
}

/**
 * Polygon. @param {Array<[number, number]>} pts @param {object} [o] { fill, opacity, round }
 * `round` softens corners without changing the footprint. Convex shapes only.
 */
export function poly(pts, o = {}) {
  const round = o.round >= 1 ? Math.round(o.round) : null;

  return {
    k: "poly",
    pts: (round ? insetVertices(pts, round) : pts).map(([x, y]) => [num(x), num(y)]),
    fill: o.fill ?? glyph,
    round,
    opacity: o.opacity ?? null,
  };
}

function insetVertices(pts, r) {
  const n = pts.length;

  return pts.map(([x, y], i) => {
    const [px, py] = pts[(i + n - 1) % n];
    const [nx, ny] = pts[(i + 1) % n];
    const unit = (dx, dy) => {
      const len = Math.hypot(dx, dy) || 1;

      return [dx / len, dy / len];
    };
    const [ax, ay] = unit(px - x, py - y);
    const [bx, by] = unit(nx - x, ny - y);
    const sinHalf = Math.sqrt(Math.max(0, (1 - (ax * bx + ay * by)) / 2));

    if (!sinHalf) return [x, y];
    const [cx2, cy2] = unit(ax + bx, ay + by);

    return [x + (cx2 * r) / sinHalf, y + (cy2 * r) / sinHalf];
  });
}

export function rule(x, y, w, o = {}) {
  return box(x, y, w, o.h ?? 2, { r: 1, fill: o.fill ?? line });
}

/** Flatten arbitrarily-nested element arrays, dropping null/false/undefined. */
export function flatten(els) {
  const out = [];
  const walk = (v) => {
    if (v == null || v === false) return;
    if (Array.isArray(v)) return v.forEach(walk);
    out.push(v);
  };

  walk(els);
  return out;
}

export function at(dx, dy, els) {
  return flatten(els).map((e) => {
    if (e.k === "rect") return { ...e, x: e.x + num(dx), y: e.y + num(dy) };
    if (e.k === "circle") return { ...e, cx: e.cx + num(dx), cy: e.cy + num(dy) };
    return { ...e, pts: e.pts.map(([x, y]) => [x + num(dx), y + num(dy)]) };
  });
}

/** `repeat(3, i => …)` — build n groups, index-aware. */
export function repeat(n, fn) {
  return Array.from({ length: n }, (_, i) => fn(i));
}

/** Stroke-agnostic, matching how bands are measured. */
export function bounds(els) {
  const list = flatten(els);

  if (!list.length) return null;
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;

  for (const e of list) {
    if (e.k === "rect") {
      x0 = Math.min(x0, e.x);
      y0 = Math.min(y0, e.y);
      x1 = Math.max(x1, e.x + e.w);
      y1 = Math.max(y1, e.y + e.h);
    } else if (e.k === "circle") {
      x0 = Math.min(x0, e.cx - e.r);
      y0 = Math.min(y0, e.cy - e.r);
      x1 = Math.max(x1, e.cx + e.r);
      y1 = Math.max(y1, e.cy + e.r);
    } else {
      for (const [x, y] of e.pts) {
        x0 = Math.min(x0, x);
        y0 = Math.min(y0, y);
        x1 = Math.max(x1, x);
        y1 = Math.max(y1, y);
      }
    }
  }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}

/** Groups keep their own internal x positions. */
export function stackY(x, y, gap, groups) {
  const out = [];
  let cy = y;

  for (const group of groups) {
    const g = flatten(group);

    if (!g.length) continue;
    const b = bounds(g);

    out.push(at(x - b.x0, cy - b.y0, g));
    cy += b.h + gap;
  }
  return out;
}

/** Top-aligned. */
export function rowX(x, y, gap, groups) {
  const out = [];
  let cx = x;

  for (const group of groups) {
    const g = flatten(group);

    if (!g.length) continue;
    const b = bounds(g);

    out.push(at(cx - b.x0, y - b.y0, g));
    cx += b.w + gap;
  }
  return out;
}

/** Even columns: `columns(x, 4, 293, i => …)` places group i at x + i * pitch. */
export function columns(x, count, pitch, fn) {
  return repeat(count, (i) => at(x + i * pitch, 0, fn(i)));
}

/** Center a group horizontally on `cx` (leaves y alone). */
export function centerX(cx, els) {
  const g = flatten(els);
  const b = bounds(g);

  return b ? at(cx - (b.x0 + b.x1) / 2, 0, g) : g;
}

/**
 * @param {number[]} widths One entry per line.
 * @param {object} [o] { size = "body", gap = 12 (leading between bars), fill,
 *   align = "left"|"center", within }
 */
export function lines(x, y, widths, o = {}) {
  const size = o.size ?? "body";
  const step = TYPE[size] + (o.gap ?? 12);
  const within = o.within ?? Math.max(...widths);

  return widths.map((w, i) => {
    const dx = o.align === "center" ? Math.round((within - w) / 2) : 0;

    return bar(x + dx, y + i * step, w, size, { fill: o.fill });
  });
}

/**
 * The label bar defaults to `micro` in a short button and `body` in a tall one.
 * @param {object} [o] { variant: "ink"|"ghost", label, labelSize, r }
 */
export function pill(x, y, w, h, o = {}) {
  const variant = o.variant ?? "ink";
  const labelSize = o.labelSize ?? (h >= 56 ? "body" : "micro");
  const labelW = o.label ?? Math.min(Math.round(w * 0.45), 112);
  const lh = TYPE[labelSize];
  const shell =
    variant === "ink"
      ? box(x, y, w, h, { r: o.r ?? R.box, fill: ink })
      : box(x, y, w, h, { r: o.r ?? R.box, fill: paper, stroke: glyph, sw: STROKE.control });

  return [
    shell,
    bar(x + Math.round((w - labelW) / 2), y + Math.round((h - lh) / 2), labelW, labelSize, {
      fill: variant === "ink" ? onInk : body,
    }),
  ];
}

export function field(x, y, w, h, o = {}) {
  return box(x, y, w, h, {
    r: o.r ?? R.box,
    fill: o.fill ?? paper,
    stroke: o.stroke ?? glyph,
    sw: o.sw ?? STROKE.field,
    dash: o.dash,
  });
}

export function plate(x, y, w, h, o = {}) {
  return box(x, y, w, h, {
    r: o.r ?? R.box,
    fill: o.fill ?? paper,
    stroke: o.stroke ?? line,
    sw: o.sw ?? STROKE.control,
  });
}

/** No glyph — add `photoGlyph` or `playDisc` on top. */
export function media(x, y, w, h, o = {}) {
  return box(x, y, w, h, { r: o.r ?? R.box, fill: o.fill ?? surface, stroke: o.stroke, sw: o.sw });
}

export function sun(cx, cy, r, o = {}) {
  return dot(cx, cy, r, { fill: o.fill ?? glyph });
}

export function peak(x1, x2, xApex, yBase, yApex, o = {}) {
  return poly(
    [
      [x1, yBase],
      [xApex, yApex],
      [x2, yBase],
    ],
    { fill: o.fill ?? glyph, round: o.round ?? Math.max(4, Math.round((yBase - yApex) * 0.08)) }
  );
}

/** Use this in a new preview; the shipped set mostly hand-tunes `sun`/`peak`. */
export function photoGlyph(x, y, w, h, o = {}) {
  const fill = o.fill ?? glyph;
  const baseY = y + h * 0.78;

  return [
    sun(x + w * 0.7, y + h * 0.32, Math.max(6, Math.min(w, h) * 0.06), { fill }),
    peak(x + w * 0.18, x + w * 0.6, x + w * 0.42, baseY, y + h * 0.5, { fill }),
    peak(x + w * 0.45, x + w * 0.86, x + w * 0.66, baseY, y + h * 0.56, { fill }),
  ];
}

/** The triangle's right-of-center nudge is optical, sized for its rounded tip. */
export function playDisc(cx, cy, r, o = {}) {
  const left = cx - (o.back ?? Math.round(r * 0.32));
  const half = o.half ?? Math.round(r * 0.5278);
  const tip = cx + (o.reach ?? Math.round(r * 0.6));

  return [
    dot(cx, cy, r, { fill: o.fill ?? subject }),
    poly(
      [
        [left, cy - half],
        [left, cy + half],
        [tip, cy],
      ],
      { fill: o.tri ?? paper, round: o.round ?? Math.max(3, Math.round(r * 0.11)) }
    ),
  ];
}

export function caret(x, y, w, o = {}) {
  const h = o.h ?? Math.round(w * 0.56);

  return poly(
    [
      [x, y],
      [x + w, y],
      [x + w / 2, y + h],
    ],
    { fill: o.fill ?? subject, round: o.round ?? Math.max(2, Math.round(w * 0.12)) }
  );
}

/** `dir` is "left" or "right". */
export function chevron(x, y, w, h, dir = "right", o = {}) {
  const pts =
    dir === "right"
      ? [
          [x, y],
          [x, y + h],
          [x + w, y + h / 2],
        ]
      : [
          [x + w, y],
          [x + w, y + h],
          [x, y + h / 2],
        ];

  return poly(pts, { fill: o.fill ?? glyph });
}

export function tile(x, y, d, o = {}) {
  return box(x, y, d, d, { r: o.r ?? R.box, fill: o.fill ?? surface, stroke: o.stroke, sw: o.sw });
}

export function cropCorners(x, y, w, h, o = {}) {
  const inset = o.inset ?? 71;
  const insetY = o.insetY ?? 68;
  const arm = o.arm ?? 115;
  const t = o.thick ?? 12;
  const legT = o.legThick ?? 13;
  const legH = o.legH ?? 110;
  const fill = o.fill ?? subject;
  const l = x + inset;
  const rgt = x + w - inset - arm;
  const top = y + insetY;
  const bot = y + h - insetY - t;
  const armBar = (bx, by) => box(bx, by, arm, t, { r: t / 2, fill });
  const legBar = (bx, by) => box(bx, by, legT, legH, { r: R.box, fill });

  return [
    armBar(l, top),
    legBar(l, top),
    armBar(rgt, top),
    legBar(rgt + arm - legT, top),
    armBar(l, bot),
    legBar(l, bot - legH + t),
    armBar(rgt, bot),
    legBar(rgt + arm - legT, bot - legH + t),
  ];
}

export function checkbox(x, y, d, on = false, o = {}) {
  return box(x, y, d, d, { r: o.r ?? 6, fill: on ? ink : (o.fill ?? glyph) });
}

export function toggle(x, y, w, h, on = true, o = {}) {
  const kr = o.knob ?? Math.round(h / 2 - 8);
  const pad = o.pad ?? 8;
  const kx = on ? x + w - kr - pad : x + kr + pad;

  return [
    box(x, y, w, h, { r: h / 2, fill: on ? ink : glyph }),
    dot(kx, y + h / 2, kr, { fill: o.knobFill ?? paper }),
  ];
}

/**
 * @param {object} spec
 * @param {number} spec.width  Content bounding-box width: one of BANDS unless
 *   `exempt`. Asserted against the drawn geometry at build time.
 * @param {boolean} [spec.exempt] Opt out of the band check — for a single small
 *   control that would read as distorted stretched to 560.
 * @param {string} [spec.title] Override the derived `<title>` text.
 * @param {Array} spec.draw Nested arrays of elements.
 */
export function preview(spec) {
  if (typeof spec?.width !== "number") {
    throw new Error("preview(): `width` is required (the content bounding-box width)");
  }
  if (!spec.exempt && !BANDS.includes(spec.width)) {
    throw new Error(
      `preview(): width ${spec.width} is not a band (${BANDS.join(" / ")}). ` +
        `Pick a band, or set \`exempt: true\` with a comment saying why.`
    );
  }
  return {
    __preview: true,
    width: spec.width,
    exempt: !!spec.exempt,
    title: spec.title,
    draw: spec.draw,
  };
}

function attrs(pairs) {
  return pairs
    .filter(([, v]) => v != null)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");
}

function emit(e) {
  if (e.k === "rect") {
    const r = e.r >= 1 ? Math.round(Math.min(e.r, e.w / 2, e.h / 2)) : null;

    return `<rect ${attrs([
      ["x", e.x],
      ["y", e.y],
      ["width", e.w],
      ["height", e.h],
      ["rx", r],
      ["fill", e.fill],
      ["stroke", e.stroke],
      ["stroke-width", e.sw],
      ["stroke-dasharray", e.dash],
      ["opacity", e.opacity],
    ])}/>`;
  }
  if (e.k === "circle") {
    return `<circle ${attrs([
      ["cx", e.cx],
      ["cy", e.cy],
      ["r", e.r],
      ["fill", e.fill],
      ["stroke", e.stroke],
      ["stroke-width", e.sw],
      ["opacity", e.opacity],
    ])}/>`;
  }
  return `<polygon ${attrs([
    ["points", e.pts.map(([x, y]) => `${x},${y}`).join(" ")],
    ["fill", e.fill],
    ["stroke", e.round ? e.fill : null],
    ["stroke-width", e.round ? e.round * 2 : null],
    ["stroke-linejoin", e.round ? "round" : null],
    ["opacity", e.opacity],
  ])}/>`;
}

/** `cta-split` -> `Cta split`. */
function titleCase(slug) {
  const words = slug.split("-").join(" ");

  return words.charAt(0).toUpperCase() + words.slice(1);
}

// Scoped to `svg`, not `:root`: an inlined copy would leak overrides onto the host page.
const DARK_BLOCK = [
  "  <style>",
  "    @media (prefers-color-scheme: dark) {",
  "      svg {",
  ...Object.entries(DARK).map(([k, v]) => `        --pv-${k}: ${v};`),
  "      }",
  "    }",
  "  </style>",
].join("\n");

/**
 * @param {object} spec A `preview({...})` result.
 * @param {string} key  The component key, e.g. `page-sections/heroes/hero-center`.
 */
export function compile(spec, key = "preview") {
  if (!spec?.__preview) {
    throw new Error("compile(): recipe default export must be a preview({...}) result");
  }
  const els = flatten(spec.draw);

  if (!els.length) throw new Error("compile(): recipe drew nothing");

  const b = bounds(els);

  if (b.w !== spec.width) {
    throw new Error(
      `compile(): declared width ${spec.width} but the drawn content measures ${b.w} ` +
        `(x ${b.x0}..${b.x1}). Fix the geometry or the declared width.`
    );
  }

  const dx = Math.round(CX - (b.x0 + b.x1) / 2);
  const dy = Math.round(CY - (b.y0 + b.y1) / 2);

  if (b.x0 + dx < 0 || b.x1 + dx > W || b.y0 + dy < 0 || b.y1 + dy > H) {
    throw new Error(
      `compile(): centered content overflows the ${W}×${H} canvas ` +
        `(content ${b.w}×${b.h}). Shrink the drawing or raise an exempt band.`
    );
  }

  const slug = key.split("/").pop();
  const id = `t-${slug}`;
  const title = `${spec.title ?? titleCase(slug)} component preview`;
  const open = dx === 0 && dy === 0 ? "  <g>" : `  <g transform="translate(${dx} ${dy})">`;

  return [
    // width/height give an `<img>` an intrinsic size before it loads.
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="${id}">`,
    `  <title id="${id}">${title}</title>`,
    DARK_BLOCK,
    `  <rect x="0" y="0" width="${W}" height="${H}" fill="${paper}"/>`,
    open,
    ...els.map((e) => `    ${emit(e)}`),
    `  </g>`,
    `</svg>`,
    ``,
  ].join("\n");
}
