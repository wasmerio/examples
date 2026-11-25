// Generates tasteful placeholder "photos" so the site looks good before you add
// your own work. No external assets or network needed (uses the `sharp` that
// ships with Astro).
//
//   npm run gen:placeholders
//
// - Digital  → clean, cool landscape gradients   (src/assets/digital/)
// - Analog   → warm, faded, grainy, vignetted     (src/assets/analog/)
// - Calendar → one per month                      (src/assets/calendar/)
// - Blog     → a few photos for the example post  (src/assets/blog/)
// - og.jpg   → the social-share image             (public/)
//
// To use YOUR photos: delete the placeholder files in those folders and drop in
// your own .jpg/.png/.webp files. They're picked up automatically.
import sharp from 'sharp';
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = join(__dirname, '..', 'src', 'assets');

// Read the site name from src/config.ts (no TS import needed) so the share image
// stays in sync with your config. Re-run `npm run gen:placeholders` after a name
// change to refresh public/og.jpg.
async function readSiteName() {
  try {
    const cfg = await readFile(join(__dirname, '..', 'src', 'config.ts'), 'utf8');
    const name = cfg.match(/name:\s*'([^']*)'/)?.[1] || 'Your Name';
    const nameZh = cfg.match(/nameZh:\s*'([^']*)'/)?.[1] || '';
    return { name, nameZh };
  } catch {
    return { name: 'Your Name', nameZh: '' };
  }
}

const W = 1800;
const H = 1200;

// [skyTop, skyBottom, hillFar, hillNear]
const digitalPalettes = [
  ['#cdd7e0', '#8a9bb0', '#71839a', '#566578'], // misty blue
  ['#ece4d6', '#b9a888', '#9a8a6c', '#766a52'], // sand & sea
  ['#f1dccb', '#c98f76', '#a86f5c', '#7d5446'], // muted sunset
  ['#d8ddd2', '#8fa089', '#6f8268', '#52614f'], // forest fog
  ['#dadfe4', '#9aa2ab', '#6d7782', '#4f5862'], // slate mountains
  ['#e9e4df', '#bcb3a8', '#8f857a', '#6b635a'], // warm grey
  ['#d4e1e1', '#88a9a8', '#6a8a89', '#4d6766'], // cool teal
  ['#e0d8e4', '#a596ab', '#837189', '#5f5266'], // lavender dusk
];

// Warmer, lower-contrast, faded — the "film" look.
const analogPalettes = [
  ['#e9ddc8', '#c9b48f', '#b09a72', '#8f7c58'], // faded gold
  ['#ecd9c6', '#d2a98c', '#b98e72', '#946b54'], // warm portrait
  ['#e7dcc6', '#bfa988', '#9f8a68', '#7c6a4c'], // sepia
  ['#d9e0cf', '#a9b58c', '#8c9a6e', '#6e7c52'], // expired green
  ['#ecd6d2', '#cba39c', '#b08881', '#8c6862'], // dusty rose
  ['#cdd9d2', '#9fb1a6', '#82978b', '#63786c'], // faded teal
  ['#e3ddd4', '#b7ac9c', '#968b78', '#6f6657'], // warm grey film
  ['#e6d7c0', '#c6a079', '#a8835f', '#806146'], // amber dusk
];

// Deterministic pseudo-random so output is stable between runs.
function seeded(seed) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function hill(rand, baseY, amp) {
  const pts = [];
  const steps = 6;
  for (let i = 0; i <= steps; i++) {
    const x = (W * i) / steps;
    const y = baseY + (rand() - 0.5) * amp;
    pts.push(`${x.toFixed(0)},${y.toFixed(0)}`);
  }
  return `0,${H} ${pts.join(' ')} ${W},${H}`;
}

function svg(palette, i, { film }) {
  const [top, bottom, far, near] = palette;
  const rand = seeded(i + 1);
  const sunX = (0.2 + rand() * 0.6) * W;
  const sunY = (0.2 + rand() * 0.25) * H;
  const farHill = hill(rand, H * 0.66, H * 0.12);
  const nearHill = hill(rand, H * 0.82, H * 0.16);
  const vignette = film
    ? `<radialGradient id="vig" cx="50%" cy="48%" r="72%">
         <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
         <stop offset="100%" stop-color="#2a2014" stop-opacity="0.5"/>
       </radialGradient>`
    : '';
  const vignetteRect = film ? `<rect width="${W}" height="${H}" fill="url(#vig)"/>` : '';
  const sunOpacity = film ? 0.4 : 0.55;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${top}"/>
        <stop offset="100%" stop-color="${bottom}"/>
      </linearGradient>
      <radialGradient id="sun" cx="${(sunX / W) * 100}%" cy="${(sunY / H) * 100}%" r="55%">
        <stop offset="0%" stop-color="#fff7ea" stop-opacity="${sunOpacity}"/>
        <stop offset="40%" stop-color="#fff7ea" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#fff7ea" stop-opacity="0"/>
      </radialGradient>
      ${vignette}
    </defs>
    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    <rect width="${W}" height="${H}" fill="url(#sun)"/>
    <polygon points="${farHill}" fill="${far}" opacity="0.85"/>
    <polygon points="${nearHill}" fill="${near}" opacity="0.95"/>
    ${vignetteRect}
  </svg>`;
}

// A subtle film-grain overlay built from random pixels (reliable, no SVG filter).
// Seeded so output is stable between runs (no needless git churn).
function grain(w, h, amp, rand) {
  const buf = Buffer.allocUnsafe(w * h * 3);
  for (let i = 0; i < buf.length; i += 3) {
    let v = 128 + Math.round((rand() * 2 - 1) * amp);
    v = v < 0 ? 0 : v > 255 ? 255 : v;
    buf[i] = buf[i + 1] = buf[i + 2] = v;
  }
  return sharp(buf, { raw: { width: w, height: h, channels: 3 } }).png().toBuffer();
}

async function build(name, palettes, film) {
  const dir = join(ASSETS, name);
  await mkdir(dir, { recursive: true });
  for (let i = 0; i < palettes.length; i++) {
    const file = `${name}-${String(i + 1).padStart(2, '0')}.jpg`;
    let pipe = sharp(Buffer.from(svg(palettes[i], i, { film })));
    if (film) {
      pipe = pipe.composite([{ input: await grain(W, H, 20, seeded(1000 + i)), blend: 'overlay' }]);
    }
    await pipe.jpeg({ quality: 82, mozjpeg: true }).toFile(join(dir, file));
    console.log('generated', `${name}/${file}`);
  }
}

// Calendar: one image per month. Filenames are YYYY-MM.jpg; the Calendar page
// shows every entry whose image is present (see src/data/calendar.ts).
async function buildCalendar() {
  const months = [];
  for (let m = 1; m <= 12; m++) months.push(`2025-${String(m).padStart(2, '0')}`);
  const dir = join(ASSETS, 'calendar');
  await mkdir(dir, { recursive: true });
  for (let i = 0; i < months.length; i++) {
    const file = `${months[i]}.jpg`;
    await sharp(Buffer.from(svg(digitalPalettes[i % digitalPalettes.length], i, { film: false })))
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(join(dir, file));
    console.log('generated', `calendar/${file}`);
  }
}

// Blog: a few photos referenced by the example Photo Blog post (an .mdx file
// that uses <Photo> and <Gallery>). Named descriptively so the auto-captions
// read nicely.
async function buildBlog() {
  const files = ['meadow-path.jpg', 'still-water.jpg', 'forest-edge.jpg'];
  const dir = join(ASSETS, 'blog');
  await mkdir(dir, { recursive: true });
  for (let i = 0; i < files.length; i++) {
    await sharp(Buffer.from(svg(digitalPalettes[(i + 3) % digitalPalettes.length], i + 20, { film: false })))
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(join(dir, files[i]));
    console.log('generated', `blog/${files[i]}`);
  }
}

// Social-share / Open Graph image (1200×630) for rich link previews. The name is
// read from src/config.ts; if you set a second-script name (site.nameZh) it's
// centered under the main name with flanking rules.
async function buildOgImage() {
  const PUBLIC = join(__dirname, '..', 'public');
  await mkdir(PUBLIC, { recursive: true });
  const SEAL_RED = '#d03930'; // matches the seal logo's ink color
  const { name, nameZh } = await readSiteName();
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const trimmedWidth = async (svg) => {
    const { info } = await sharp(Buffer.from(svg)).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
    return info.width;
  };
  const enFont = 'DejaVu Serif, Georgia, serif';
  const zhFont = 'Noto Serif CJK SC, Songti SC, serif';
  const probe = (t, ff, fs) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="240"><rect width="1800" height="240" fill="#fff"/><text x="20" y="160" font-family="${ff}" font-size="${fs}" fill="#000">${esc(t)}</text></svg>`;
  const SEAL_H = 300;
  const F = 34;
  const cx = 600;

  let text;
  if (nameZh) {
    // Two lines: the main name sets the width; rules flank the second-script name.
    const wEn = await trimmedWidth(probe(name, enFont, F));
    const wZh = await trimmedWidth(probe(nameZh, zhFont, F));
    const enY = 460, zhY = 506, ruleY = 494, gap = 14;
    text = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <text x="${cx}" y="${enY}" text-anchor="middle" font-family="${enFont}" font-size="${F}" fill="${SEAL_RED}">${esc(name)}</text>
      <line x1="${(cx - wEn / 2).toFixed(1)}" y1="${ruleY}" x2="${(cx - wZh / 2 - gap).toFixed(1)}" y2="${ruleY}" stroke="${SEAL_RED}" stroke-width="2"/>
      <text x="${cx}" y="${zhY}" text-anchor="middle" font-family="${zhFont}" font-size="${F}" fill="${SEAL_RED}">${esc(nameZh)}</text>
      <line x1="${(cx + wZh / 2 + gap).toFixed(1)}" y1="${ruleY}" x2="${(cx + wEn / 2).toFixed(1)}" y2="${ruleY}" stroke="${SEAL_RED}" stroke-width="2"/>
    </svg>`;
  } else {
    // Single centered name.
    text = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <text x="${cx}" y="488" text-anchor="middle" font-family="${enFont}" font-size="${F}" fill="${SEAL_RED}">${esc(name)}</text>
    </svg>`;
  }

  const illu = await sharp(join(__dirname, '..', 'src', 'assets', 'seal.png')).resize({ height: SEAL_H }).png().toBuffer();
  const im = await sharp(illu).metadata();
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#fcfcfb' } })
    .composite([
      { input: illu, top: 118, left: Math.round(600 - im.width / 2) },
      { input: Buffer.from(text), top: 0, left: 0 },
    ])
    .jpeg({ quality: 90 })
    .toFile(join(PUBLIC, 'og.jpg'));
  console.log('generated', 'public/og.jpg');
}

// `--og-only` regenerates just the share image (e.g. after a name/logo change),
// leaving the deterministic placeholder photos untouched.
if (!process.argv.includes('--og-only')) {
  await build('digital', digitalPalettes, false);
  await build('analog', analogPalettes.slice(0, 4), true);
  await buildCalendar();
  await buildBlog();
}
await buildOgImage();

console.log('\nDone.');
