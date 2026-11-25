// Record a live effect with a scripted pointer path. usage: node tools/record.mjs <url> <selector> <out> [width]
import { chromium, executable } from './pw.mjs';
import fs from 'fs';
const [url, sel, out, width = '1440'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: executable(), headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--enable-unsafe-webgpu', '--enable-features=Vulkan'] });
const ctx = await b.newContext({ viewport: { width: +width, height: 900 }, recordVideo: { dir: '/tmp/lapse-rec', size: { width: +width, height: 900 } } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: 'networkidle' });
const el = p.locator(sel).first();
await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
const box = await el.boundingBox();
await p.evaluate(({ y, h }) => scrollTo(0, scrollY + y + h / 2 - innerHeight / 2), { y: box.y, h: box.height });
await p.waitForTimeout(2500);
const r = await el.boundingBox();
const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
// idle, then a slow sweep, a fast sweep, a circle, then rest to watch it settle
await p.mouse.move(r.x + 5, cy); await p.waitForTimeout(1500);
for (let i = 0; i <= 60; i++) { await p.mouse.move(r.x + r.width * i / 60, cy + Math.sin(i / 8) * r.height * 0.15); await p.waitForTimeout(40); }
for (let i = 0; i <= 15; i++) { await p.mouse.move(r.x + r.width * (1 - i / 15), cy - r.height * 0.1); await p.waitForTimeout(16); }
for (let i = 0; i <= 80; i++) { const a = i / 80 * Math.PI * 4; await p.mouse.move(cx + Math.cos(a) * r.width * 0.2, cy + Math.sin(a) * r.height * 0.25); await p.waitForTimeout(25); }
await p.mouse.move(r.x + r.width - 2, r.y + 2); await p.waitForTimeout(3500);
const v = p.video(); await ctx.close(); fs.copyFileSync(await v.path(), out); await b.close();
console.log(out, JSON.stringify(r));
