// Match every visible text block on both sites by its words and report the
// ones whose position or size differ. Motion is on (real layout), but the
// page is scrolled through once so reveals have played.
// usage: node tools/textdiff.mjs <path> <width> [minDelta=3]
import { chromium, executable } from './pw.mjs';
const [path, width, min = '2'] = process.argv.slice(2);
const W = Number(width), MIN = Number(min);
const browser = await chromium.launch({ executablePath: executable(), headless: true });
async function grab(base) {
  const ctx = await browser.newContext({ viewport: { width: W, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + path, { waitUntil: 'networkidle', timeout: 90000 });
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 600) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(60); }
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(1200);
  const rows = await page.evaluate(() => {
    const out = [];
    const norm = (x) => (x || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const els = document.querySelectorAll('body *');
    for (const el of els) {
      if (el.closest('nav, .topbar, [data-framer-name="Topbar"], [data-framer-name="Store Card"], .store, script, style, template, .sr-only')) continue;
      if (el.classList.contains('sr-only')) continue;
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!own) continue;
      const t = norm(el.innerText);
      if (!t || t.length < 3) continue;
      if ([...el.querySelectorAll('*')].some((c) => norm(c.innerText) === t)) continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
      out.push({ t: t.slice(0, 60), x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) });
    }
    return out;
  });
  await ctx.close();
  return rows;
}
const [f, m] = await Promise.all([grab('https://lapseai.framer.website'), grab(process.env.MINE || 'http://localhost:4322')]);
const used = new Set();
let shown = 0, prevDy = null;
for (const a of f) {
  const i = m.findIndex((b, k) => !used.has(k) && b.t === a.t);
  if (i < 0) { console.log(`  MISSING  ${a.t}`); continue; }
  used.add(i);
  const b = m[i];
  const dy = b.y - a.y, dx = b.x - a.x, dw = b.w - a.w, dh = b.h - a.h;
  const jump = prevDy === null ? dy : dy - prevDy;
  prevDy = dy;
  if (Math.abs(dx) >= MIN || Math.abs(dw) >= MIN || Math.abs(dh) >= MIN || Math.abs(jump) >= MIN) {
    console.log(`  y${String(a.y).padStart(6)} dy=${String(dy).padStart(4)} (Δ${String(jump).padStart(4)}) dx=${String(dx).padStart(4)} dw=${String(dw).padStart(4)} dh=${String(dh).padStart(4)}  ${a.t}`);
    if (++shown > 70) break;
  }
}
await browser.close();
