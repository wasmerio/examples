// Generates one 1200×630 OG image per post into public/og/posts/<lang>/<slug>.png.
//
//   node scripts/build-og.mjs
//
// Optional and not part of `npm run build`: it needs Playwright + Chromium.
// Pages fall back to seo.ogImage when a file is missing, so skipping this script
// never breaks a deploy.
import { readFileSync, mkdirSync, existsSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { chromium } from 'playwright';
import { globSync } from 'node:fs';

// Reuse any Chromium already on the machine before asking the user to download one.
const localChrome =
  process.env.CHROME_PATH ||
  globSync(`${process.env.HOME}/.cache/ms-playwright/chromium-*/chrome-linux*/chrome`)[0] ||
  undefined;

// Cards carry the site's own name and host, never the demo's. SITE_URL wins,
// then site.config.yaml, then the example placeholder.
const cfg = existsSync('site.config.yaml') ? parseYaml(readFileSync('site.config.yaml', 'utf8')) : {};
const configured = typeof cfg?.site?.name === 'string' ? cfg.site.name : 'Inkfolio';
const SITE = process.env.SITE_NAME || configured;
const siteUrl = process.env.SITE_URL || cfg?.site?.url || 'https://example.com';
let HOST = 'example.com';
try {
  HOST = new URL(siteUrl).host;
} catch {}
const ACCENT = cfg?.theme?.accent || '#ff6b01';
const FONT = '"Noto Sans CJK SC", "Noto Sans SC", "Source Han Sans SC", system-ui, sans-serif';

function frontmatter(file) {
  const raw = readFileSync(file, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  const fm = {};
  if (!m) return fm;
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
  }
  return fm;
}

const jobs = [];
for (const [dir, lang] of [
  ['src/content/posts', 'en'],
  ['src/content/posts-zh', 'zh'],
]) {
  if (!existsSync(dir)) continue;
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.md')) continue;
    const fm = frontmatter(join(dir, name));
    if (!fm.title || fm.draft === 'true') continue;
    jobs.push({
      lang,
      slug: name.replace(/\.md$/, ''),
      title: fm.title,
      date: fm.date ?? '',
      out: join('public/og/posts', lang, `${name.replace(/\.md$/, '')}.png`),
    });
  }
}

const html = (title, date, lang) => `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;width:1200px;height:630px}
  body{background:#f7f7f5;color:#141413;font-family:${FONT};display:flex;flex-direction:column;justify-content:space-between;padding:72px 80px;box-sizing:border-box}
  .top{display:flex;align-items:center;gap:18px;font-size:24px;font-weight:600;letter-spacing:.01em}
  .dot{width:14px;height:14px;border-radius:50%;background:${ACCENT}}
  h1{font-size:64px;line-height:1.14;letter-spacing:-.02em;margin:28px 0 0;font-weight:700;max-width:960px}
  .bottom{display:flex;justify-content:space-between;align-items:flex-end;font-size:22px;color:#61615c}
  .ring{position:absolute;right:-60px;bottom:-80px;width:320px;height:320px;border-radius:50%;background:${ACCENT};opacity:.10}
</style></head><body>
  <div>
    <div class="top"><span class="dot"></span>${SITE}${lang === 'zh' ? ' · 中文' : ''}</div>
    <h1>${title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h1>
  </div>
  <div class="bottom"><span>${date}</span><span>${HOST}</span></div>
  <div class="ring"></div>
</body></html>`;

const browser = await chromium.launch(localChrome ? { executablePath: localChrome } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const job of jobs) {
  mkdirSync(join('public/og/posts', job.lang), { recursive: true });
  await page.setContent(html(job.title, job.date, job.lang), { waitUntil: 'load' });
  await page.screenshot({ path: job.out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log('og:', job.out);
}
await browser.close();
writeFileSync(join('public/og/posts', '.generated'), new Date().toISOString() + '\n');
console.log(`done: ${jobs.length} images`);
