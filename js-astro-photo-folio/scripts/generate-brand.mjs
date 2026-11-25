// Generates a neutral placeholder brand mark — a simple "aperture seal" — so the
// template ships with working, non-personal branding. No network or external
// assets needed (uses the `sharp` that ships with Astro).
//
//   npm run gen:brand      # writes the two source seals
//   npm run gen:icons      # derives seal.png / seal-dark.png / favicons from them
//   npm run gen:placeholders   # rebuilds og.jpg (uses seal.png)
//
// Outputs (the inputs that generate-icons.mjs expects):
//   src/assets/logo-seal-light.png   darker red mark on a TRANSPARENT background
//   src/assets/logo-seal-dark.png    lighter red mark on a WHITE background
//
// To use your OWN logo, just replace these two PNGs (or seal.png / seal-dark.png
// directly) and re-run gen:icons. A red ink-on-white "chop", a monogram, or any
// mark works — light = on transparent, dark = on white.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = join(__dirname, '..', 'src', 'assets');

const SIZE = 900;
const RED_LIGHT = '#a8281f'; // darker red for the light theme (on transparent)
const RED_DARK = '#d8483f'; //  lighter red for the dark theme (on white)

// A rounded-square seal frame enclosing a simple camera-aperture / lens motif.
// Stroke-only (no fills, no masks) so it works the same on transparent or white:
// keying out white later keeps the red strokes and drops the paper.
function sealSVG(red, bg) {
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const rOuter = 222;
  const rInner = 120;
  // Six short ticks between the inner and outer lens circles → an aperture feel.
  let ticks = '';
  for (let k = 0; k < 6; k++) {
    const a = (Math.PI / 6) + (k * Math.PI) / 3; // 30°, 90°, …
    const x1 = cx + (rInner + 14) * Math.cos(a);
    const y1 = cy + (rInner + 14) * Math.sin(a);
    const x2 = cx + (rOuter - 14) * Math.cos(a);
    const y2 = cy + (rOuter - 14) * Math.sin(a);
    ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
    ${bg ? `<rect width="${SIZE}" height="${SIZE}" fill="${bg}"/>` : ''}
    <g fill="none" stroke="${red}" stroke-width="36" stroke-linecap="round" stroke-linejoin="round">
      <rect x="78" y="78" width="744" height="744" rx="132"/>
      <circle cx="${cx}" cy="${cy}" r="${rOuter}"/>
      <circle cx="${cx}" cy="${cy}" r="${rInner}"/>
      ${ticks}
    </g>
    <circle cx="${cx}" cy="${cy}" r="26" fill="${red}"/>
  </svg>`;
}

async function main() {
  await mkdir(ASSETS, { recursive: true });

  // Light source: darker red on transparent (gen:icons trims + scales it as-is).
  await sharp(Buffer.from(sealSVG(RED_LIGHT, null)))
    .png()
    .toFile(join(ASSETS, 'logo-seal-light.png'));
  console.log('generated', 'src/assets/logo-seal-light.png');

  // Dark source: lighter red on white (gen:icons keys the white out → transparent).
  await sharp(Buffer.from(sealSVG(RED_DARK, '#ffffff')))
    .png()
    .toFile(join(ASSETS, 'logo-seal-dark.png'));
  console.log('generated', 'src/assets/logo-seal-dark.png');

  console.log('\nDone. Now run: npm run gen:icons');
}

await main();
