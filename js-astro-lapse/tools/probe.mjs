// Interaction probe: records an element while the pointer does labelled moves,
// and writes the phase timestamps so frames can be matched to actions.
// usage: node tools/probe.mjs <url> <selector> <outprefix> [width] [pointerEventsFromParent]
import { chromium, executable } from './pw.mjs';
import fs from 'fs';
const [url, sel, out, width = '1440'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: executable(), headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--enable-unsafe-webgpu', '--enable-features=Vulkan'] });
const ctx = await b.newContext({ viewport: { width: +width, height: 900 }, recordVideo: { dir: '/tmp/lapse-probe', size: { width: +width, height: 900 } } });
const p = await ctx.newPage();
const t0 = Date.now(); const log = [];
const mark = (name) => log.push({ name, t: (Date.now() - t0) / 1000 });
await p.goto(url, { waitUntil: 'networkidle' });
const el = p.locator(sel).first();
await el.scrollIntoViewIfNeeded();
const bb = await el.boundingBox();
await p.evaluate(({ y, h }) => scrollTo(0, scrollY + y + h / 2 - innerHeight / 2), { y: bb.y, h: bb.height });
await p.waitForTimeout(4000);
const r = await el.boundingBox();
const at = (fx, fy) => [r.x + r.width * fx, r.y + r.height * fy];
mark('idle'); await p.mouse.move(...at(0.98, 0.02)); await p.waitForTimeout(2500);
mark('enter-hold'); await p.mouse.move(...at(0.35, 0.45), { steps: 20 }); await p.waitForTimeout(3000);
mark('slow-drag'); for (let i = 0; i <= 100; i++) { await p.mouse.move(...at(0.35 + 0.3 * i / 100, 0.45 + 0.05 * Math.sin(i / 10))); await p.waitForTimeout(30); }
mark('hold-2'); await p.waitForTimeout(2500);
mark('fast-flick'); await p.mouse.move(...at(0.15, 0.55), { steps: 6 }); await p.waitForTimeout(200); await p.mouse.move(...at(0.85, 0.35), { steps: 6 });
mark('after-flick'); await p.waitForTimeout(2500);
mark('leave'); await p.mouse.move(...at(0.99, 0.99), { steps: 4 }); await p.mouse.move(r.x + r.width + 30, r.y - 30); await p.waitForTimeout(3000);
mark('end');
const v = p.video(); await ctx.close();
fs.copyFileSync(await v.path(), out + '.webm'); fs.writeFileSync(out + '.json', JSON.stringify({ box: r, log }, null, 1));
await b.close(); console.log(out, JSON.stringify(log));
