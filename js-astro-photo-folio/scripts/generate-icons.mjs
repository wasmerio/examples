// Derives the site's brand images from the two seal sources. Idempotent: it only
// reads logo-seal-*.png and writes the cleaned/derived assets, so it can be
// re-run any time the seals change.
//
//   npm run gen:brand   # creates the two source seals (or supply your own)
//   npm run gen:icons   # then run this to derive everything below
//
// Inputs  (src/assets/, kept as-is — replace these with your own logo if you like):
//   logo-seal-light.png  → darker red seal, already transparent  (LIGHT theme)
//   logo-seal-dark.png   → lighter red seal on a WHITE background (DARK theme)
//
// Outputs:
//   src/assets/seal.png            light-theme logo (trimmed, scaled)
//   src/assets/seal-dark.png       dark-theme logo  (white keyed out → transparent)
//   public/favicon.png             theme-aware favicon (light/default)
//   public/favicon-dark.png        theme-aware favicon (dark)
//   public/apple-touch-icon.png    iOS home-screen icon (opaque)
//
// The OG share image (public/og.jpg) is regenerated separately by
// generate-placeholders.mjs.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = join(__dirname, '..', 'src', 'assets');
const PUBLIC = join(__dirname, '..', 'public');

const SRC_LIGHT = join(ASSETS, 'logo-seal-light.png'); // darker red, transparent
const SRC_DARK = join(ASSETS, 'logo-seal-dark.png'); // lighter red, white bg

const CREAM = '#fcfcfb'; // site light background (for the opaque iOS icon)
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

// Match the old tree logo's longest edge so the seal renders at ~the same scale.
const LONG_EDGE = 805;

// The pink seal sits on white paper. Its ink has much lower green/blue than the
// paper, so we derive alpha from how far min(G,B) drops below white — clean,
// anti-aliased edges, original ink color preserved, grungy texture kept.
async function keyOutWhite(srcPath) {
  const { data, info } = await sharp(srcPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const HI = 235; // min(G,B) >= HI  → fully transparent (paper)
  const LO = 180; // min(G,B) <= LO  → fully opaque (ink)
  for (let i = 0; i < data.length; i += channels) {
    const minGB = Math.min(data[i + 1], data[i + 2]);
    let a = ((HI - minGB) / (HI - LO)) * 255;
    a = a < 0 ? 0 : a > 255 ? 255 : a;
    data[i + 3] = Math.round((data[i + 3] / 255) * a);
  }
  return sharp(data, { raw: { width, height, channels } }).png().toBuffer();
}

// Trim transparent margins, then scale so the longest edge == LONG_EDGE.
async function trimAndScale(input) {
  const trimmed = await sharp(input).trim().toBuffer();
  const m = await sharp(trimmed).metadata();
  const scale = LONG_EDGE / Math.max(m.width, m.height);
  return sharp(trimmed).resize(Math.round(m.width * scale), Math.round(m.height * scale)).png().toBuffer();
}

// Center an image on a transparent square canvas of `size`, with `pad` px margin.
async function squarePadded(input, size, pad) {
  const inner = size - pad * 2;
  const fitted = await sharp(input).resize(inner, inner, { fit: 'contain', background: TRANSPARENT }).toBuffer();
  return sharp(fitted)
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: TRANSPARENT })
    .png()
    .toBuffer();
}

async function main() {
  // 1) Theme logos — identical dimensions so toggling themes never shifts layout.
  const lightLogo = await trimAndScale(SRC_LIGHT); // darker red (already transparent)
  const lm = await sharp(lightLogo).metadata();
  await sharp(lightLogo).toFile(join(ASSETS, 'seal.png'));

  const darkTrimmed = await sharp(await keyOutWhite(SRC_DARK)).trim().toBuffer();
  const darkLogo = await sharp(darkTrimmed)
    .resize(lm.width, lm.height, { fit: 'contain', background: TRANSPARENT })
    .png()
    .toBuffer();
  await sharp(darkLogo).toFile(join(ASSETS, 'seal-dark.png'));

  // 2) Theme-aware favicons (transparent, a little breathing room).
  await sharp(await squarePadded(lightLogo, 256, 14)).toFile(join(PUBLIC, 'favicon.png'));
  await sharp(await squarePadded(darkLogo, 256, 14)).toFile(join(PUBLIC, 'favicon-dark.png'));

  // 3) Apple touch icon — iOS ignores transparency, so flatten onto the cream bg.
  await sharp(await squarePadded(lightLogo, 180, 16))
    .flatten({ background: CREAM })
    .png()
    .toFile(join(PUBLIC, 'apple-touch-icon.png'));

  for (const f of [
    'src/assets/seal.png',
    'src/assets/seal-dark.png',
    'public/favicon.png',
    'public/favicon-dark.png',
    'public/apple-touch-icon.png',
  ]) {
    const m = await sharp(join(__dirname, '..', f)).metadata();
    console.log('  ' + f.padEnd(32), m.width + 'x' + m.height, m.hasAlpha ? 'alpha' : 'opaque');
  }
  console.log('Done.');
}

await main();
