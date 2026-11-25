/**
 * Generates the placeholder imagery used by the /components showcase.
 *
 * The showcase used to hotlink avatars from i.pravatar.cc and banners from
 * images.unsplash.com. That sent every visitor's IP to two third parties on a
 * site that otherwise ships cookieless analytics, and left the demo dependent
 * on services that can rate-limit or disappear. These are drawn locally
 * instead: abstract, deterministic, and no faces, so nothing here implies a
 * real person.
 *
 * Run with `node scripts/demo-assets.mjs`. Output is committed, so this only
 * needs re-running when the artwork itself should change.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'public', 'demo');

/** Distinct hues, kept clear of each other so an AvatarGroup reads as separate people. */
const AVATAR_HUES = [212, 267, 340, 24, 158, 190, 45];

/**
 * An abstract avatar: a tinted field with a soft off-centre bloom and two
 * overlapping arcs. Deliberately not a face and not initials — the showcase
 * demonstrates the initials fallback separately, so these have to read as
 * photographic fills rather than repeat it.
 */
function avatar(hue, i) {
  const bg = `hsl(${hue} 62% ${46 + (i % 3) * 7}%)`;
  const light = `hsl(${(hue + 28) % 360} 82% ${72 + (i % 2) * 6}%)`;
  const dark = `hsl(${(hue + 330) % 360} 55% ${28 + (i % 3) * 5}%)`;
  const cx = 38 + ((i * 17) % 34);
  const cy = 34 + ((i * 23) % 30);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" width="150" height="150" role="img" aria-label="Abstract placeholder avatar">
  <defs>
    <radialGradient id="g${i}" cx="${cx}%" cy="${cy}%" r="78%">
      <stop offset="0%" stop-color="${light}"/>
      <stop offset="62%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="${dark}"/>
    </radialGradient>
  </defs>
  <rect width="150" height="150" fill="url(#g${i})"/>
  <circle cx="${cx + 12}" cy="${cy + 46}" r="46" fill="${light}" opacity="0.20"/>
  <circle cx="${118 - (i % 4) * 9}" cy="${112 - (i % 3) * 11}" r="30" fill="${dark}" opacity="0.22"/>
</svg>
`;
}

/**
 * A 1200x200 banner standing in for a wide photograph. Layered bands give the
 * transparent-header demos something with real tonal variation to sit on —
 * a flat fill would not show whether the header blends or fights with it.
 */
function banner({ id, sky, mid, near, haze }) {
  const band = (y, fill, opacity) =>
    `<path d="M0 ${y} C 220 ${y - 34}, 430 ${y + 26}, 660 ${y - 12} S 1010 ${y - 44}, 1200 ${y - 6} L1200 200 L0 200 Z" fill="${fill}" opacity="${opacity}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 200" width="1200" height="200" role="img" aria-label="Abstract placeholder banner">
  <defs>
    <linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${sky[0]}"/>
      <stop offset="100%" stop-color="${sky[1]}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="200" fill="url(#sky-${id})"/>
  <circle cx="965" cy="58" r="34" fill="${haze}" opacity="0.55"/>
  ${band(126, mid, '0.85')}
  ${band(158, near, '0.95')}
</svg>
`;
}

await mkdir(join(OUT, 'avatars'), { recursive: true });

for (const [i, hue] of AVATAR_HUES.entries()) {
  await writeFile(join(OUT, 'avatars', `${i + 1}.svg`), avatar(hue, i + 1), 'utf8');
}

// Light banner: the demo over it applies grayscale + brightness-150 +
// opacity-60, which is close to three stops of lift. Pastels disappear
// completely under that, so this starts at mid tone and lands light.
await writeFile(
  join(OUT, 'banner-light.svg'),
  banner({ id: 'l', sky: ['#6f86bd', '#9db0d6'], mid: '#59709f', near: '#43567c', haze: '#f0dfa8' }),
  'utf8',
);

// Dark banner: sits under a black/40 overlay with white text on top. It has to
// stay dark enough for the text, but the bands need real separation from the
// sky or the overlay flattens the whole thing to one black rectangle.
await writeFile(
  join(OUT, 'banner-dark.svg'),
  banner({ id: 'd', sky: ['#16233d', '#3b5573'], mid: '#4a6e94', near: '#1b2b40', haze: '#7dd3fc' }),
  'utf8',
);

console.warn(`demo assets written to ${OUT}`);
