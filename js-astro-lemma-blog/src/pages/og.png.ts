import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { fromHtml } from 'hast-util-from-html';
import { toHtml } from 'hast-util-to-html';
import type { Element } from 'hast';
import { formula } from 'virtual:lemma/math';
import lemma from '../../lemma.config.mjs';
import { OG_IMAGE, SITE } from '../i18n';
import { CURVES, DOTS, breath, dot, tracks } from '../scripts/curves';

// The image link previews show (og:image, and the image of a post's JSON-LD):
// the home intro, curve mark and formula, at 4 times its size on light paper.
// Only shapes, no text: MathJax draws the formula as paths, so no font has to
// be installed where the site is built.
const { width: WIDTH, height: HEIGHT } = OG_IMAGE;
const SCALE = 4;
// The home intro: 4rem mark, 1.25rem gap, 1.75rem formula (src/styles/global.css).
const MARK = 64 * SCALE;
const GAP = 20 * SCALE;
const EM = 28 * SCALE;
const { bg, text } = lemma.theme.colors.light;

const mark = (x: number) => {
  if (!SITE.introCurve) return '';
  const c = CURVES[SITE.introCurve];
  const s = breath(0);
  // As TaglineCurve.astro and its styles: a faint track, the comet in Ink.
  const paths = tracks(c, s).map((d, i) =>
    i ? `<path d="${d}" stroke-opacity="0.16" stroke-width="1.5"/>` : `<path d="${d}" stroke-opacity="0.1" stroke-width="5"/>`,
  );
  const dots = Array.from({ length: DOTS }, (_, i) => {
    const { cx, cy, r, opacity } = dot(c, 0, s, i);
    return `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${r.toFixed(2)}" opacity="${opacity.toFixed(3)}"/>`;
  });
  return `<svg x="${x}" y="${(HEIGHT - MARK) / 2}" width="${MARK}" height="${MARK}" viewBox="0 0 100 100" overflow="visible">
<g fill="none" stroke="${text}" stroke-linecap="round" stroke-linejoin="round">${paths.join('')}</g>
<g fill="${text}">${dots.join('')}</g></svg>`;
};

// MathJax's <svg>s (several when the formula has break points) on one
// baseline; their viewBox is in thousandths of an em. Between them, an
// <mjx-break size="n"> is a space (src/styles/mathjax.css).
const BREAK = [0.001, 0.111, 0.167, 0.222, 0.278, 0.333];
const math = () => {
  if (!formula) return { width: 0, place: () => '' };
  const container = fromHtml(formula, { fragment: true }).children[0] as Element;
  let width = 0;
  const parts = container.children.flatMap((c) => {
    if (c.type !== 'element') return [];
    if (c.tagName === 'mjx-break') width += BREAK[Number(c.properties.size)] * EM;
    if (c.tagName !== 'svg') return [];
    const [, y, w, h] = String(c.properties.viewBox).split(/\s+/).map((n) => (Number(n) / 1000) * EM);
    const part = { svg: c, x: width, width: w, height: h, ascent: -y };
    width += w;
    return [part];
  });
  const ascent = Math.max(...parts.map((p) => p.ascent));
  const descent = Math.max(...parts.map((p) => p.height - p.ascent));
  const baseline = (HEIGHT - ascent - descent) / 2 + ascent;
  return {
    width,
    place: (x: number) =>
      parts
        .map((p) => {
          const props = { ...p.svg.properties, x: String(x + p.x), y: String(baseline - p.ascent), width: p.width, height: p.height, style: undefined };
          return toHtml({ ...p.svg, properties: props }, { space: 'svg' });
        })
        .join('')
        .replaceAll('currentColor', text),
  };
};

export const GET: APIRoute = async () => {
  const formulaPart = math();
  const markWidth = SITE.introCurve ? MARK + (formula ? GAP : 0) : 0;
  const left = (WIDTH - markWidth - formulaPart.width) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
<rect width="100%" height="100%" fill="${bg}"/>${mark(left)}${formulaPart.place(left + markWidth)}</svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
