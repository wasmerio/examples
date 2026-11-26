// Draws the sample photographs that ship with the theme.
//
// Halftone puts a picture on every article, and a theme that is sold cannot lean on stock
// licences that restrict redistribution. So the samples are drawn here instead: two layers —
// a blurred ground for atmosphere and a near-crisp silhouette for subject — screened with a
// dot pattern so nobody mistakes one for a real photograph. Each has a dark quarter for the
// cover lines to sit on. Replace them with your own pictures; the schema does not change.
//
//   node scripts/make-sample-plates.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const out = new URL('../src/assets/sample/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });

// Deterministic per name: the same slug always draws the same picture, so regenerating the
// set does not churn the repository.
const rand = (seed) => {
  let s = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32;
};

// Desk palettes: [ground, mid, light]. Cold for World, steel for Technology, warm for
// Politics, pale for Health — enough separation that a desk front reads as one place.
//
// These were two stops darker until the cover plate was first built, and one stop darker until
// the plates were photographed for the listing: under the scrim the picture disappeared, which
// is the one thing this theme cannot have. The scrim was measured over a pure white photograph
// and guarantees contrast on its own, so the photographs do not need to be dark as well. The
// values below are a gamma lift (0.78) of the first set -- it opens the shadows, where the wide
// crop of a plate lands, and leaves the highlights about where they were.
const palettes = {
  world: ['#354a64', '#6182a9', '#b9cade'],
  politics: ['#504433', '#947a4f', '#dbc5a0'],
  technology: ['#30444b', '#56818b', '#b5d1d5'],
  health: ['#3c4c44', '#6a8f81', '#c4d8cc'],
};
const ink = '#07090b'; // silhouettes are nearly black; the screen pattern does the rest

const px = (n) => n.toFixed(0);

// Silhouettes. Each returns SVG for the near layer, which is barely blurred, so these are
// what actually make the frame read as a photograph rather than a gradient.
const scenes = {
  coast: (w, h, r) => {
    const y = h * (0.56 + r() * 0.08);
    const boats = Array.from({ length: 3 }, (_, i) => {
      const bx = w * (0.15 + r() * 0.7);
      const bw = w * (0.012 + r() * 0.03);
      return `<rect x="${px(bx)}" y="${px(y - bw * 0.5)}" width="${px(bw)}" height="${px(bw * 0.55)}" fill="${ink}" opacity="${(0.45 + i * 0.15).toFixed(2)}"/>`;
    }).join('');
    return `<rect x="0" y="${px(y)}" width="${w}" height="${px(h - y)}" fill="${ink}" opacity="0.72"/>
      ${boats}
      <path d="M0 ${px(h)} L0 ${px(h * 0.8)} Q${px(w * 0.22)} ${px(h * 0.72)} ${px(w * 0.42)} ${px(h)} Z" fill="${ink}"/>`;
  },
  crowd: (w, h, r) =>
    Array.from({ length: 9 }, (_, i) => {
      const cx = w * (0.04 + (i / 8) * 0.92 + (r() - 0.5) * 0.06);
      const scale = 0.7 + r() * 0.6;
      const head = h * 0.055 * scale;
      const cy = h * (0.72 + r() * 0.12);
      return `<g opacity="${(0.6 + r() * 0.4).toFixed(2)}" fill="${ink}">
        <circle cx="${px(cx)}" cy="${px(cy)}" r="${px(head)}"/>
        <path d="M${px(cx - head * 2)} ${px(h)} Q${px(cx - head * 1.6)} ${px(cy + head * 1.1)} ${px(cx)} ${px(cy + head * 1.05)} Q${px(cx + head * 1.6)} ${px(cy + head * 1.1)} ${px(cx + head * 2)} ${px(h)} Z"/>
      </g>`;
    }).join(''),
  interior: (w, h, r) => {
    const windows = Array.from({ length: 3 }, (_, i) => {
      const x = w * (0.1 + i * 0.3 + r() * 0.04);
      const ww = w * (0.11 + r() * 0.05);
      return `<rect x="${px(x)}" y="${px(h * 0.12)}" width="${px(ww)}" height="${px(h * (0.4 + r() * 0.2))}" fill="#fff" opacity="${(0.18 + r() * 0.22).toFixed(2)}"/>`;
    }).join('');
    const fx = w * (0.62 + r() * 0.22);
    return `<rect width="${w}" height="${h}" fill="${ink}" opacity="0.5"/>${windows}
      <rect x="0" y="${px(h * 0.82)}" width="${w}" height="${px(h * 0.18)}" fill="${ink}" opacity="0.8"/>
      <g fill="${ink}"><circle cx="${px(fx)}" cy="${px(h * 0.5)}" r="${px(h * 0.07)}"/>
      <path d="M${px(fx - h * 0.18)} ${px(h)} Q${px(fx - h * 0.12)} ${px(h * 0.6)} ${px(fx)} ${px(h * 0.58)} Q${px(fx + h * 0.12)} ${px(h * 0.6)} ${px(fx + h * 0.18)} ${px(h)} Z"/></g>`;
  },
  field: (w, h, r) => {
    const y = h * (0.64 + r() * 0.06);
    const stalks = Array.from({ length: 34 }, () => {
      const sx = w * r();
      const sh = h * (0.08 + r() * 0.22);
      return `<rect x="${px(sx)}" y="${px(h - sh)}" width="${px(w * 0.004)}" height="${px(sh)}" fill="${ink}" opacity="${(0.3 + r() * 0.5).toFixed(2)}"/>`;
    }).join('');
    return `<rect x="0" y="${px(y)}" width="${w}" height="${px(h - y)}" fill="${ink}" opacity="0.6"/>${stalks}`;
  },
  street: (w, h, r) => {
    const fx = w * (0.3 + r() * 0.15);
    return `<path d="M0 0 L${px(w * 0.26)} 0 L${px(w * 0.22)} ${px(h)} L0 ${px(h)} Z" fill="${ink}" opacity="0.9"/>
      <path d="M${px(w)} 0 L${px(w * 0.74)} ${px(h * 0.08)} L${px(w * 0.8)} ${px(h)} L${px(w)} ${px(h)} Z" fill="${ink}" opacity="0.82"/>
      <rect x="0" y="${px(h * 0.86)}" width="${w}" height="${px(h * 0.14)}" fill="${ink}" opacity="0.7"/>
      <g fill="${ink}"><circle cx="${px(fx)}" cy="${px(h * 0.58)}" r="${px(h * 0.05)}"/>
      <path d="M${px(fx - h * 0.13)} ${px(h * 0.95)} Q${px(fx - h * 0.09)} ${px(h * 0.66)} ${px(fx)} ${px(h * 0.64)} Q${px(fx + h * 0.09)} ${px(h * 0.66)} ${px(fx + h * 0.13)} ${px(h * 0.95)} Z"/></g>`;
  },
  portrait: (w, h) =>
    `<g fill="${ink}"><circle cx="${px(w * 0.5)}" cy="${px(h * 0.42)}" r="${px(h * 0.19)}"/>
      <path d="M${px(w * 0.1)} ${px(h)} Q${px(w * 0.18)} ${px(h * 0.66)} ${px(w * 0.5)} ${px(h * 0.62)} Q${px(w * 0.82)} ${px(h * 0.66)} ${px(w * 0.9)} ${px(h)} Z"/></g>`,
};

const svg = (w, h, desk, scene, seed) => {
  const r = rand(seed);
  const [ground, mid, light] = palettes[desk];
  // Far layer: soft masses that stand in for depth of field.
  const haze = Array.from({ length: 3 }, () => {
    const fill = r() > 0.5 ? mid : ground;
    return `<ellipse cx="${px(w * r())}" cy="${px(h * (0.2 + r() * 0.6))}" rx="${px(w * (0.2 + r() * 0.3))}" ry="${px(h * (0.15 + r() * 0.25))}" fill="${fill}"/>`;
  }).join('');
  const glow = (0.35 + r() * 0.45).toFixed(2); // where the light falls, and so where text must not go

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="${(0.2 + r() * 0.6).toFixed(2)}" y2="1">
      <stop offset="0" stop-color="${light}"/>
      <stop offset="0.5" stop-color="${mid}"/>
      <stop offset="1" stop-color="${ground}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${glow}" cy="0.26" r="0.55">
      <stop offset="0" stop-color="${light}" stop-opacity="0.5"/>
      <stop offset="1" stop-color="${light}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.45" r="0.78">
      <stop offset="0.4" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.3"/>
    </radialGradient>
    <filter id="far" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="${px(w / 22)}"/>
    </filter>
    <filter id="near" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="${(w / 420).toFixed(1)}"/>
    </filter>
    <pattern id="screen" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle cx="5" cy="5" r="2.6" fill="#000"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  <g filter="url(#far)">${haze}</g>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <g filter="url(#near)">${scenes[scene](w, h, r)}</g>
  <rect width="${w}" height="${h}" fill="url(#vignette)"/>
  <rect width="${w}" height="${h}" fill="url(#screen)" opacity="0.16"/>
</svg>`;
};

const draw = async (name, w, h, desk, scene) => {
  await sharp(Buffer.from(svg(w, h, desk, scene, name)))
    .avif({ quality: 46 })
    .toFile(join(out, `${name}.avif`));
  return name;
};

const portraits = [
  ['linnea-holm', 'politics'],
  ['dessie-okonkwo', 'world'],
  ['rafael-viana', 'politics'],
  ['mira-halvorsen', 'technology'],
  ['soo-jin-pae', 'health'],
  ['arun-pelletier', 'world'],
];

const done = await Promise.all(
  portraits.map(([id, desk]) => draw(`portrait-${id}`, 640, 640, desk, 'portrait')),
);
console.log(`${done.length} portraits → src/assets/sample/`);
