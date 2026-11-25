// Side-by-side viewport captures, live Framer (left) vs local (right), at a
// list of scroll offsets. usage: node tools/sbs.mjs <path> <width> <y,y,...> [outprefix]
import { chromium, executable } from './pw.mjs';
import fs from 'fs';
const [path = '/', width = '1440', ys = '0', out = 'ref/shots/sbs'] = process.argv.slice(2);
const LIVE = 'https://lapseai.framer.website', MINE = process.env.MINE || 'http://localhost:4322';
const W = +width, H = 900;
const browser = await chromium.launch({ executablePath: executable(), headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
fs.mkdirSync('ref/shots', { recursive: true });
async function grab(base) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('PAGEERROR', base, e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', base, m.text().slice(0, 200)); });
  await page.goto(base + path, { waitUntil: 'networkidle', timeout: 90000 });
  const shots = [];
  for (const y of ys.split(',').map(Number)) {
    await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(1500);
    shots.push(await page.screenshot());
  }
  await ctx.close();
  return shots;
}
const [a, b] = await Promise.all([grab(LIVE), grab(MINE)]);
for (let i = 0; i < a.length; i++) {
  fs.writeFileSync(`${out}-${W}-${i}-live.png`, a[i]);
  fs.writeFileSync(`${out}-${W}-${i}-mine.png`, b[i]);
}
await browser.close();
console.log('ok');
