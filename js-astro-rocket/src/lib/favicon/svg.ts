/**
 * Favicon generation — the SVG half.
 *
 * The brand mark is the first letter of the site name on a rounded square.
 * Historically it was emitted as an SVG `<text>` element relying on the
 * "Outfit" web font. Search-engine crawlers (and other renderers) do not load
 * external fonts, so the letter never drew and Google fell back to its default
 * globe icon in the SERP. The letter is outlined to a real vector `<path>`
 * against an embedded Outfit subset instead, so the SVG is self-contained.
 *
 * This file imports nothing native, but it is still not workerd-safe: it
 * decodes the embedded font with `Buffer` and parses it with fontkit, neither
 * of which exists there without `nodejs_compat`. So it belongs in the build
 * hook alongside `raster.ts`, not in a route — as a route it emitted a 0-byte
 * favicon on Cloudflare while the build reported success.
 *
 * `sharp` still lives in `raster.ts` and must stay there. Keeping the halves
 * apart — with no barrel re-exporting both — is what stops a layout pulling a
 * native module into every page, which is how #600 happened.
 */
// fontkit ships no type declarations; declare the minimal surface we use.
// @ts-expect-error - no types published for fontkit
import * as fontkit from 'fontkit';
import { OUTFIT_700_SUBSET_BASE64 } from './font-data.ts';

interface Glyph {
  bbox: { minX: number; minY: number; maxX: number; maxY: number };
  path: { toSVG(): string };
}
interface Font {
  hasGlyphForCodePoint(codePoint: number): boolean;
  glyphForCodePoint(codePoint: number): Glyph;
}

// Parse the embedded font once and reuse across routes.
let cachedFont: Font | null = null;
function getFont(): Font {
  if (!cachedFont) {
    const buf = Buffer.from(OUTFIT_700_SUBSET_BASE64, 'base64');
    cachedFont = (fontkit as { create(buf: Buffer): Font }).create(buf);
  }
  return cachedFont;
}

/** Fraction of the icon the glyph's bounding box should occupy. */
const GLYPH_FILL = 0.6;
/** Corner rounding as a fraction of the icon size. */
const CORNER_RADIUS = 0.1667;

/**
 * Build a self-contained favicon SVG: a rounded square filled with `bgColor`
 * and the outlined `letter` in `fgColor`, centred. Falls back to an empty
 * square if the embedded subset has no glyph for the character.
 */
export function buildFaviconSvg(
  letter: string,
  bgColor: string,
  fgColor = '#ffffff',
  size = 48
): string {
  const rx = (size * CORNER_RADIUS).toFixed(2);
  const rect = `<rect width="${size}" height="${size}" rx="${rx}" fill="${bgColor}"/>`;

  const font = getFont();
  const codePoint = letter.codePointAt(0);
  if (codePoint === undefined || !font.hasGlyphForCodePoint(codePoint)) {
    console.warn(
      `[favicon] No embedded glyph for "${letter}". Emitting a plain square. ` +
        `The embedded Outfit subset covers A-Z and 0-9; regenerate it if your ` +
        `site name starts with a different character.`
    );
    return wrapSvg(size, rect);
  }

  const glyph = font.glyphForCodePoint(codePoint);
  const { minX, minY, maxX, maxY } = glyph.bbox;
  const bw = maxX - minX;
  const bh = maxY - minY;

  const target = size * GLYPH_FILL;
  const scale = target / Math.max(bw, bh);
  const scaledW = bw * scale;
  const scaledH = bh * scale;

  // Map font units (y-up, baseline at 0) into the SVG viewBox (y-down),
  // centring the glyph's bounding box within the square.
  const translateX = (size - scaledW) / 2 - minX * scale;
  const translateY = maxY * scale + (size - scaledH) / 2;
  const matrix = `matrix(${scale} 0 0 ${-scale} ${translateX} ${translateY})`;

  const path = `<path transform="${matrix}" d="${glyph.path.toSVG()}" fill="${fgColor}"/>`;
  return wrapSvg(size, rect + path);
}

function wrapSvg(size: number, inner: string): string {
  return (
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" ` +
    `xmlns="http://www.w3.org/2000/svg">${inner}</svg>`
  );
}
