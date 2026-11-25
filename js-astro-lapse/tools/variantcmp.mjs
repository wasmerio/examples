// Compare two builds of the site element by element (adapted from Eave).
// Both render the same markup, so the n-th element in one build is the n-th in
// the other. Reports every element whose box differs by more than MAX px, per
// route and width, after a scroll-through so reveals have settled.
//
//   A=http://localhost:4541 B=http://localhost:4542 node tools/variantcmp.mjs [maxPx=2]
//
// STYLES=1 also compares a computed-style digest of every element (colour,
// type, borders, shadows, transforms ...), which catches cascade changes that
// leave boxes alone. IGNORE_CLASS=1 matches elements by tag instead of class
// (baseline vs refactored Astro, where component classes were renamed).
import { chromium, executable } from './pw.mjs';
const MAX = Number(process.argv[2] || 2);
const A = process.env.A || 'http://localhost:4541';
const B = process.env.B || 'http://localhost:4542';
const STYLES = process.env.STYLES === '1';
const IGNORE_CLASS = process.env.IGNORE_CLASS === '1';
const SLUGS = ['backlog-is-a-queue-problem', 'say-it-is-an-agent', 'what-2-4-million-support-messages-look-like', 'what-a-wrong-answer-costs', 'what-we-will-not-automate'];
const routes = (process.env.ROUTES || ['/', '/about/', '/pricing/', '/blog/', ...SLUGS.map((s) => `/blog/${s}/`), '/contact/', '/privacy/', '/terms/', '/nope'].join(',')).split(',');
// 1440/1000/390 plus both sides of the template's breakpoints (810, 1200).
const widths = (process.env.WIDTHS || '1440,1200,1199,1000,810,809,390').split(',').map(Number);
const PROPS = ['display', 'position', 'color', 'background-color', 'background-image', 'border-top-width', 'border-top-color', 'border-top-left-radius', 'border-bottom-right-radius',
  'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-align', 'text-transform', 'text-decoration-line', 'opacity', 'visibility', 'transform',
  'box-shadow', 'z-index', 'overflow-x', 'overflow-y', 'cursor', 'pointer-events', 'white-space', 'stroke', 'stroke-width', 'fill', 'filter', 'backdrop-filter', 'mask-image',
  'object-fit', 'user-select', 'transition-duration', 'transition-property', 'animation-name', 'list-style-type', 'gap', 'padding-top', 'padding-left', 'margin-top', 'content'];
const b = await chromium.launch({ executablePath: executable(), headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

async function grab(base, path, w, tries = 3) {
  try { return await grabOnce(base, path, w); } catch (e) { if (tries <= 1) throw e; return grab(base, path, w, tries - 1); }
}
async function grabOnce(base, path, w) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  // A 404 route answers 404 by design; any other failed request is reported.
  p.on('console', (m) => m.type() === 'error' && !/^Failed to load resource/.test(m.text()) && errs.push(m.text().slice(0, 140)));
  p.on('response', (r) => r.status() >= 400 && r.url() !== base + path && errs.push(`${r.status()} ${r.url()}`));
  p.on('requestfailed', (r) => errs.push(`failed ${r.url()}`));
  await p.goto(base + path, { waitUntil: 'load', timeout: 180000 });
  await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await p.evaluate(() => document.fonts.ready);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 700) { await p.evaluate((v) => scrollTo(0, v), y); await p.waitForTimeout(40); }
  // Back to the top; a synthetic scroll event makes every scroll-driven effect
  // settle on the final position even when a loaded machine drops frames.
  await p.evaluate(() => { scrollTo(0, 0); dispatchEvent(new Event('scroll')); });
  await p.waitForTimeout(800);
  await p.evaluate(() => dispatchEvent(new Event('scroll')));
  const frames = () => p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await frames(); await p.waitForTimeout(200); await frames();
  const rows = await p.evaluate(({ PROPS, STYLES }) => [...document.querySelectorAll('body *')]
    .filter((el) => !el.closest('nextjs-portal, next-route-announcer, script, style, template, noscript, body > div[hidden]:not([class])') && !/^(SCRIPT|STYLE|LINK|META|TITLE|TEMPLATE|NOSCRIPT)$/.test(el.tagName))
    .map((el) => {
      const r = el.getBoundingClientRect();
      const out = { t: el.tagName, c: (el.getAttribute('class') || '').split(/\s+/).filter(Boolean).join('.'), x: r.left, y: r.top + scrollY, w: r.width, h: r.height };
      if (STYLES) {
        const cs = getComputedStyle(el);
        out.s = PROPS.map((k) => cs.getPropertyValue(k).split(location.origin).join(''));
        for (const pe of ['::before', '::after']) { const ps = getComputedStyle(el, pe); if (ps.content !== 'none') out.s.push(pe, ...PROPS.map((k) => ps.getPropertyValue(k).split(location.origin).join(''))); }
      }
      return out;
    }), { PROPS, STYLES });
  const html = await p.evaluate(() => document.documentElement.scrollHeight);
  await ctx.close();
  return { rows, H: html, errs };
}

let bad = 0, ok = 0;
for (const w of widths) for (const r of routes) {
  const [a, n] = await Promise.all([grab(A, r, w), grab(B, r, w)]);
  const diffs = [];
  if (a.rows.length !== n.rows.length) diffs.push(`element count ${a.rows.length} vs ${n.rows.length}`);
  const len = Math.min(a.rows.length, n.rows.length);
  for (let i = 0; i < len; i++) {
    const x = a.rows[i], y = n.rows[i];
    const kx = IGNORE_CLASS ? x.t : x.t + '.' + x.c, ky = IGNORE_CLASS ? y.t : y.t + '.' + y.c;
    if (kx !== ky) { diffs.push(`#${i} "${x.t}.${x.c}" vs "${y.t}.${y.c}"`); break; }
    const d = Math.max(Math.abs(x.x - y.x), Math.abs(x.y - y.y), Math.abs(x.w - y.w), Math.abs(x.h - y.h));
    if (d > MAX) diffs.push(`#${i} ${x.t}.${x.c} Δ${d.toFixed(1)} (${Math.round(x.x)},${Math.round(x.y)} ${Math.round(x.w)}x${Math.round(x.h)} vs ${Math.round(y.x)},${Math.round(y.y)} ${Math.round(y.w)}x${Math.round(y.h)})`);
    if (STYLES) {
      if (x.s.length !== y.s.length) diffs.push(`#${i} ${x.t}.${x.c} pseudo-element set differs`);
      else for (let k = 0; k < x.s.length; k++) if (x.s[k] !== y.s[k]) { diffs.push(`#${i} ${x.t}.${x.c} ${PROPS[k % (PROPS.length + 1)] ?? k}: "${String(x.s[k]).slice(0, 60)}" vs "${String(y.s[k]).slice(0, 60)}"`); break; }
    }
  }
  if (a.H !== n.H) diffs.push(`page height ${a.H} vs ${n.H}`);
  for (const e of a.errs) diffs.push('A console: ' + e);
  for (const e of n.errs) diffs.push('B console: ' + e);
  console.log(`${diffs.length ? '!!' : 'ok'} ${w} ${r} (${a.rows.length} elements)`);
  for (const d of diffs.slice(0, 12)) console.log('   ' + d);
  if (diffs.length) bad++; else ok++;
}
await b.close();
console.log(`\n${ok} pass, ${bad} fail (${widths.length} widths x ${routes.length} routes)`);
process.exit(bad ? 1 : 0);
