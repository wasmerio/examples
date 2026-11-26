#!/usr/bin/env node
/**
 * Draws the sober placeholder images shipped with the theme (src/assets/placeholders/).
 * One file per photo slot used by villa.config.ts, same file names as the demo photos.
 *
 *   node scripts/make-placeholders.mjs
 *
 * Uses sharp, which Astro already installs for its image optimisation.
 */
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const OUT = fileURLToPath(new URL('../src/assets/placeholders/', import.meta.url));

const SLOTS = [
  ['hero.jpg', 2400, 1350],
  ['pool.jpg', 1800, 1200],
  ['terrace.jpg', 1800, 1200],
  ['living.jpg', 1800, 1200],
  ['kitchen.jpg', 1800, 1200],
  ['bedroom-1.jpg', 1800, 1200],
  ['bedroom-2.jpg', 1800, 1200],
  ['bedroom-3.jpg', 1800, 1200],
  ['bathroom.jpg', 1800, 1200],
  ['garden.jpg', 1800, 1200],
  ['exterior.jpg', 1800, 1200],
  ['detail.jpg', 1800, 1200],
  ['beach.jpg', 1800, 1200],
  ['village.jpg', 1800, 1200],
];

function svg(name, width, height) {
  const s = Math.min(width, height) / 1200;
  const cx = width / 2;
  const cy = height / 2 - 40 * s;
  const label = `${name}  ·  ${width} × ${height}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#E9E3D9"/>
      <stop offset="1" stop-color="#DDD4C7"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <g fill="none" stroke="#B3A694" stroke-width="${4 * s}" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="${cx + 70 * s}" cy="${cy - 60 * s}" r="${28 * s}"/>
    <path d="M ${cx - 150 * s} ${cy + 90 * s} L ${cx - 50 * s} ${cy - 20 * s} L ${cx + 10 * s} ${cy + 40 * s} L ${cx + 60 * s} ${cy} L ${cx + 150 * s} ${cy + 90 * s} Z"/>
    <path d="M ${cx - 180 * s} ${cy + 130 * s} q ${30 * s} ${-16 * s} ${60 * s} 0 t ${60 * s} 0 t ${60 * s} 0 t ${60 * s} 0 t ${60 * s} 0 t ${60 * s} 0"/>
  </g>
  <text x="${cx}" y="${cy + 230 * s}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${30 * s}" letter-spacing="${3 * s}" fill="#9A8D7B">${label}</text>
</svg>`;
}

await mkdir(OUT, { recursive: true });
for (const [name, width, height] of SLOTS) {
  await sharp(Buffer.from(svg(name, width, height)))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`${OUT}${name}`);
  console.log(`placeholder ${name} ${width}×${height}`);
}
