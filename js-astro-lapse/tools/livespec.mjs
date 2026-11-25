// Dump every named Framer layer on a live page: rect, and the computed styles
// that matter for a port. usage: node tools/livespec.mjs <path> <width> [base]
import { chromium, executable } from './pw.mjs';
import fs from 'fs';
const [path = '/', width = '1440', base = 'https://lapseai.framer.website'] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: executable(), headless: true });
const ctx = await browser.newContext({ viewport: { width: +width, height: 900 }, reducedMotion: 'reduce' });
const page = await ctx.newPage();
await page.goto(base + path, { waitUntil: 'networkidle', timeout: 90000 });
const H = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 500) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(50); }
await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(800);
const rows = await page.evaluate(() => {
  const out = [];
  const keys = ['display','flexDirection','justifyContent','alignItems','gap','padding','borderRadius','backgroundColor','backgroundImage','border','boxShadow','opacity','fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','textAlign','textTransform','position','overflow','backdropFilter','filter'];
  const def = {display:'block',gap:'normal',padding:'0px',borderRadius:'0px',backgroundColor:'rgba(0, 0, 0, 0)',backgroundImage:'none',boxShadow:'none',opacity:'1',textTransform:'none',position:'static',overflow:'visible',backdropFilter:'none',filter:'none',flexDirection:'row',justifyContent:'normal',alignItems:'normal'};
  for (const el of document.querySelectorAll('[data-framer-name], h1,h2,h3,h4,p,a,button,input,textarea,img')) {
    const r = el.getBoundingClientRect(); if (!r.width && !r.height) continue;
    let hidden = false; for (let n = el; n; n = n.parentElement) { const s = getComputedStyle(n); if (s.display === 'none' || s.visibility === 'hidden') { hidden = true; break } }
    if (hidden) continue;
    const cs = getComputedStyle(el); const st = {};
    for (const k of keys) { const v = cs[k]; if (def[k] !== undefined && def[k] === v) continue; if (['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','textAlign'].includes(k) && !(el.childNodes && [...el.childNodes].some(c => c.nodeType === 3 && c.textContent.trim()))) continue; if (k === 'border' && v.startsWith('0px')) continue; st[k] = v; }
    let depth = 0; for (let n = el.parentElement; n; n = n.parentElement) if (n.dataset?.framerName) depth++;
    const own = [...el.childNodes].filter(c => c.nodeType === 3).map(c => c.textContent.trim()).join(' ').slice(0, 70);
    out.push(`${'  '.repeat(depth)}${el.tagName.toLowerCase()}${el.dataset.framerName ? ' "' + el.dataset.framerName + '"' : ''} [${Math.round(r.left)},${Math.round(r.top + scrollY)} ${Math.round(r.width)}x${Math.round(r.height)}]${own ? ' «' + own + '»' : ''} ${Object.entries(st).map(([k, v]) => k + '=' + v).join('; ')}`);
  }
  return out;
});
const name = (path === '/' ? 'home' : path.replace(/\//g, '_').replace(/^_/, '')) + '-' + width;
fs.mkdirSync('ref/live', { recursive: true });
fs.writeFileSync(`ref/live/${name}.txt`, `H=${H}\n` + rows.join('\n'));
console.log(name, H, rows.length);
await browser.close();
