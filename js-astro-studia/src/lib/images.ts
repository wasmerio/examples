import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Intrinsic dimensions of an image under public/, which never touches Astro's
 * image pipeline — so nothing else knows how big it is, and the audit fails an
 * <img> without width and height. One caller: `SITE.brandLogo`, or the
 * /apple-touch-icon.png ProjectHero falls back to — configuration rather than an import,
 * so it cannot come from src/assets/.
 *
 * Resolved from the working directory, NOT import.meta.url: `astro build`
 * bundles this module into dist/.prerender/chunks/, so a module-relative URL
 * points into the output and every lookup fails. `astro dev` runs the source in
 * place and works.
 */
export function intrinsic(publicPath: string): { width: number; height: number } {
  const file = join(process.cwd(), 'public', publicPath);
  if (!existsSync(file)) throw new Error(`image: ${publicPath} not found under public/`);

  if (publicPath.endsWith('.svg')) {
    const svg = readFileSync(file, 'utf8').slice(0, 4096);
    const vb = svg.match(/viewBox\s*=\s*["']\s*[\d.-]+[ ,]+[\d.-]+[ ,]+([\d.]+)[ ,]+([\d.]+)/i);
    if (vb) return { width: Math.round(Number(vb[1])), height: Math.round(Number(vb[2])) };
    const w = svg.match(/\bwidth\s*=\s*["']([\d.]+)/i);
    const h = svg.match(/\bheight\s*=\s*["']([\d.]+)/i);
    if (w && h) return { width: Math.round(Number(w[1])), height: Math.round(Number(h[1])) };
    throw new Error(`image: ${publicPath} has neither viewBox nor width/height`);
  }

  const buf = readFileSync(file);

  // PNG: IHDR is always the first chunk, width/height at bytes 16..24.
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  // JPEG: walk the marker segments to the first SOF (0xC0..0xCF, excluding the
  // non-frame markers C4/C8/CC), which carries the dimensions.
  if (buf.length > 4 && buf.readUInt16BE(0) === 0xffd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i += 1;
        continue;
      }
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
  }

  throw new Error(`image: could not read dimensions of ${publicPath}`);
}
