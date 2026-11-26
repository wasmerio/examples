// Generates the template's neutral placeholder images with sharp:
//   public/assets/brand/ avatar, favicons, app icons, og-image
//   public/projects/      one 16:10 cover per project in src/data/projects.ts
// Replace any of them with your own files (same names) — this script is only
// for the template's defaults.  Run: node media-src/placeholder-assets.mjs
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const BRAND = 'public/assets/brand';
const PROJECTS = 'public/projects';
mkdirSync(BRAND, { recursive: true });
mkdirSync(PROJECTS, { recursive: true });

// 16×16 pixel-art avatar: a simple head-and-shoulders figure. '.' = transparent.
const ART = [
  '................',
  '.....######.....',
  '....########....',
  '...##########...',
  '...##@####@##...',
  '...##########...',
  '...####--####...',
  '....########....',
  '.....######.....',
  '.......##.......',
  '...##########...',
  '..############..',
  '.##############.',
  '.##############.',
  '.##############.',
  '................',
];
const COLORS = { '#': [61, 255, 143, 255], '@': [4, 20, 11, 255], '-': [11, 92, 52, 255], '.': [0, 0, 0, 0] };
const pixels = Buffer.from(ART.flatMap((row) => [...row].flatMap((c) => COLORS[c])));
const avatar = sharp(pixels, { raw: { width: 16, height: 16, channels: 4 } });
const scaled = (size) => avatar.clone().resize(size, size, { kernel: 'nearest' }).png();

for (const size of [96, 192, 512]) await scaled(size).toFile(`${BRAND}/avatar-${size}.png`);

// Icons sit the avatar on the dark site background.
const icon = async (size, file) => {
  const inner = Math.round(size * 0.75);
  const art = await avatar.clone().resize(inner, inner, { kernel: 'nearest' }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: '#050908' } })
    .composite([{ input: art, gravity: 'center' }]).png().toFile(`${BRAND}/${file}`);
};
await icon(32, 'favicon-32.png');
await icon(180, 'apple-touch-icon.png');
await icon(192, 'icon-192.png');
await icon(512, 'icon-512.png');
// favicon.ico: a single 32px PNG wrapped in an ICO header (valid in all browsers).
const png32 = await sharp(`${BRAND}/favicon-32.png`).toBuffer();
const ico = Buffer.alloc(22);
ico.writeUInt16LE(0, 0); ico.writeUInt16LE(1, 2); ico.writeUInt16LE(1, 4);
ico.writeUInt8(32, 6); ico.writeUInt8(32, 7); ico.writeUInt16LE(1, 10); ico.writeUInt16LE(32, 12);
ico.writeUInt32LE(png32.length, 14); ico.writeUInt32LE(22, 18);
writeFileSync(`${BRAND}/favicon.ico`, Buffer.concat([ico, png32]));

// Text panels: dark gradient, soft glow, a title. Fonts fall back to the system sans.
const panel = (w, h, title, sub) => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#03110a"/><stop offset="1" stop-color="#0b3d24"/></linearGradient>
    <radialGradient id="glow" cx=".8" cy=".2" r=".7"><stop offset="0" stop-color="#3dff8f" stop-opacity=".35"/><stop offset="1" stop-color="#3dff8f" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/><rect width="100%" height="100%" fill="url(#glow)"/>
  <text x="${w * 0.07}" y="${h * 0.42}" font-family="Helvetica, Arial, sans-serif" font-size="${h * 0.11}" font-weight="700" fill="#eafff2">${title}</text>
  <text x="${w * 0.07}" y="${h * 0.42 + h * 0.1}" font-family="Helvetica, Arial, sans-serif" font-size="${h * 0.045}" fill="#9fd9b6">${sub}</text>
</svg>`);

await sharp(panel(1200, 630, 'Your Name', 'Portfolio · replace public/assets/brand/og-image.png')).png().toFile(`${BRAND}/og-image.png`);
const names = ['one', 'two', 'three', 'four', 'five'];
for (const name of names) {
  await sharp(panel(1600, 1000, 'Your screenshot', `public/projects/project-${name}.webp`)).webp({ quality: 80 }).toFile(`${PROJECTS}/project-${name}.webp`);
}
console.log('placeholder assets written');
