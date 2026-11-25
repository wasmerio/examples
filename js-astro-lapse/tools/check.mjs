// Every route at three widths: console errors, horizontal overflow, h1 count.
import { chromium, executable } from './pw.mjs';
const base = process.argv[2] || 'http://localhost:4390';
const routes = ['/', '/about', '/pricing', '/blog', '/blog/what-we-will-not-automate', '/blog/say-it-is-an-agent', '/contact', '/terms', '/privacy', '/nope'];
const b = await chromium.launch({ executablePath: executable(), headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const w of [1440, 1000, 390]) for (const r of routes) {
  const p = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 120)));
  const res = await p.goto(base + r, { waitUntil: 'networkidle' });
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 700) { await p.evaluate((v) => scrollTo(0, v), y); await p.waitForTimeout(40); }
  await p.waitForTimeout(600);
  const m = await p.evaluate(() => ({ over: document.documentElement.scrollWidth - innerWidth, h1: document.querySelectorAll('h1').length, broken: [...document.images].filter((i) => i.complete && !i.naturalWidth).map((i) => i.src).slice(0, 3) }));
  const bad = errs.length || m.over > 0 || m.h1 !== 1 || m.broken.length;
  console.log(`${bad ? '!!' : 'ok'} ${w} ${r} status=${res.status()} H=${H} over=${m.over} h1=${m.h1} ${m.broken.join(' ')} ${errs.join(' | ')}`);
  await p.context().close();
}
await b.close();
