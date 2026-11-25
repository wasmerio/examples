// Exercise every interactive behaviour by script and print what each one did,
// so two or three builds can be diffed line by line. Selectors use data-*
// hooks and ids only (component classes differ between the baseline and the
// refactored source). Dev tooling only.
//
//   node tools/behaviour.mjs http://localhost:4541 > a.txt
import { chromium, executable } from './pw.mjs';
const BASE = process.argv[2] || 'http://localhost:4541';
const b = await chromium.launch({ executablePath: executable(), headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const out = [];
const log = (name, value) => out.push(`${name}: ${typeof value === 'string' ? value : JSON.stringify(value)}`);
const errors = [];

async function page(path, width = 1440, height = 900) {
  const ctx = await b.newContext({ viewport: { width, height }, reducedMotion: 'no-preference' });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(`${path}@${width} ${e.message}`));
  p.on('console', (m) => m.type() === 'error' && !/^Failed to load resource/.test(m.text()) && errors.push(`${path}@${width} ${m.text().slice(0, 140)}`));
  await p.goto(BASE + path, { waitUntil: 'load', timeout: 180000 });
  await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await p.waitForTimeout(500);
  p.settle = async (ms = 1200) => { await p.waitForTimeout(ms); await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))); };
  p.scrollTo = async (y) => { await p.evaluate((v) => { scrollTo(0, v); dispatchEvent(new Event('scroll')); }, y); await p.settle(); };
  return { p, done: () => ctx.close() };
}
const round = (v) => (typeof v === 'number' ? Math.round(v) : v);

// ---- nav: desktop collapse + hover, phone menu
{
  const { p, done } = await page('/');
  const st = () => p.evaluate(() => document.querySelector('[data-fx="nav"]').className);
  log('nav desktop top', await st());
  await p.scrollTo(600); log('nav desktop scrolled', await st());
  const box = await p.evaluate(() => { const r = document.querySelector('[data-fx="nav"] nav > div > div').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
  await p.mouse.move(box[0], box[1]); await p.settle(800); log('nav desktop hover', await st());
  await p.mouse.move(5, 600); await p.settle(800); log('nav desktop leave', await st());
  await done();
}
{
  const { p, done } = await page('/', 390, 812);
  const st = () => p.evaluate(() => { const t = document.querySelector('[data-fx="nav"] button[aria-controls="nav-menu"]'); return [document.querySelector('[data-fx="nav"]').className, t.getAttribute('aria-expanded'), t.getAttribute('aria-label'), getComputedStyle(document.getElementById('nav-menu')).opacity]; });
  log('nav phone closed', await st());
  await p.click('[data-fx="nav"] button[aria-controls="nav-menu"]'); await p.settle(800); log('nav phone open', await st());
  await p.keyboard.press('Escape'); await p.settle(800); log('nav phone escape', await st());
  await p.click('[data-fx="nav"] button[aria-controls="nav-menu"]'); await p.settle(300);
  await p.click('[data-fx="nav"] button[aria-controls="nav-menu"]'); await p.settle(800); log('nav phone toggle twice', await st());
  await done();
}

// ---- home: horizontal track, steps, appear, billing toggle, faq, ticker, accordion, canvases
for (const w of [1440, 1000, 390]) {
  const { p, done } = await page('/', w);
  const sec = (id) => p.evaluate((id) => { const el = document.getElementById(id); return { top: el.getBoundingClientRect().top + scrollY, h: el.offsetHeight }; }, id);
  const wc = await sec('what-changes');
  for (const f of [0, 0.5, 1]) {
    await p.scrollTo(wc.top + f * (wc.h - 900));
    log(`changes track ${w} @${f}`, await p.evaluate(() => { const t = document.querySelector('#what-changes [style*="--track-x"]'); return t ? t.style.getPropertyValue('--track-x') : 'unset'; }));
  }
  const how = await sec('how-it-works');
  for (const f of [0.1, 0.4, 0.7, 0.95]) {
    await p.scrollTo(how.top + f * Math.max(0, how.h - 900));
    log(`how steps ${w} @${f}`, await p.evaluate(() => [...document.querySelectorAll('#how-it-works [data-step]')].map((s) => `${(+getComputedStyle(s).opacity).toFixed(2)}`).join(' ')));
  }
  const pr = await sec('pricing');
  await p.scrollTo(pr.top - 200);
  await p.settle(1500);
  log(`appear ${w}`, await p.evaluate(() => [...document.querySelectorAll('[data-fx~="appear"]')].map((e) => e.classList.contains('is-in')).join(',')));
  if (w === 1440) {
    await p.click('#pricing button[data-billing="annual"]'); await p.settle(600);
    log('home billing annual', await p.evaluate(() => [document.querySelector('[data-billing-state]').dataset.billingState, ...[...document.querySelectorAll('#pricing [data-price-monthly]')].map((e) => e.textContent), ...[...document.querySelectorAll('#pricing button[data-billing]')].map((e) => e.getAttribute('aria-pressed'))]));
    await p.click('#pricing button[data-billing="monthly"]'); await p.settle(600);
    log('home billing monthly', await p.evaluate(() => [...document.querySelectorAll('#pricing [data-price-monthly]')].map((e) => e.textContent)));
    const faq = await sec('faq'); await p.scrollTo(faq.top);
    await p.click('#faq details:nth-of-type(2) summary'); await p.settle(1200);
    log('faq open', await p.evaluate(() => [...document.querySelectorAll('#faq details')].map((d) => `${d.open}:${Math.round(d.getBoundingClientRect().height)}`)));
    await p.click('#faq details:nth-of-type(2) summary'); await p.settle(1200);
    log('faq closed', await p.evaluate(() => [...document.querySelectorAll('#faq details')].map((d) => `${d.open}:${Math.round(d.getBoundingClientRect().height)}`)));
    await p.click('#faq details:nth-of-type(3) summary'); await p.settle(200);
    await p.click('#faq details:nth-of-type(4) summary'); await p.settle(1200);
    log('faq two open', await p.evaluate(() => [...document.querySelectorAll('#faq details')].map((d) => d.open)));
    const ticker = await p.evaluate(() => { const el = document.querySelector('[data-fx="ticker"]'); return el.getBoundingClientRect().top + scrollY; });
    await p.scrollTo(ticker - 100);
    const ty = () => p.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('[data-fx="ticker"] > *')).transform).m42);
    const t0 = await ty(); await p.waitForTimeout(2000); const t1 = await ty();
    log('ticker moves up', t1 < t0);
    log('ticker clones', await p.evaluate(() => document.querySelector('[data-fx="ticker"] > *').children.length));
    log('canvases', await p.evaluate(() => ['flow-lines', 'particle-field'].map((n) => `${n}:${document.querySelectorAll(`[data-fx="${n}"] canvas`).length}`)));
    const row = await p.evaluate(() => { const el = document.querySelector('[data-fx="blog-accordion"]'); return el.getBoundingClientRect().top + scrollY; });
    await p.mouse.move(5, 5);
    await p.scrollTo(row - 200); await p.settle(1500);
    const widths = () => p.evaluate(() => [...document.querySelectorAll('[data-fx="blog-accordion"] [data-card]')].map((c) => Math.round(c.getBoundingClientRect().width)).join(' '));
    log('accordion rest', await widths());
    const c3 = await p.evaluate(() => { const r = document.querySelectorAll('[data-fx="blog-accordion"] [data-card]')[2].getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    await p.mouse.move(c3[0], c3[1]); await p.settle(2500);
    log('accordion hover 3', await widths());
    await p.mouse.move(5, 5); await p.settle(2500);
    log('accordion leave', await widths());
  }
  await done();
}

// ---- pricing: billing toggle drives the compare table; plan tabs below desktop
for (const w of [1440, 390]) {
  const { p, done } = await page('/pricing/', w);
  await p.click('#plans button[data-billing="annual"]'); await p.settle(600);
  log(`pricing ${w} annual`, await p.evaluate(() => [...document.querySelectorAll('[data-price-monthly]')].map((e) => e.textContent).join('|')));
  if (w === 390) {
    const t = await p.evaluate(() => document.getElementById('compare').getBoundingClientRect().top + scrollY);
    await p.scrollTo(t);
    for (const plan of ['growth', 'enterprise', 'starter']) {
      await p.click(`button[data-plan-tab="${plan}"]`); await p.settle(500);
      log(`plan tab ${plan}`, await p.evaluate(() => { const tbl = document.querySelector('[data-fx="plan-tabs"]'); const vis = [...tbl.querySelectorAll('[class*="cell--"]')].filter((c) => c.offsetParent !== null).length; return [tbl.dataset.plan, vis, ...[...tbl.querySelectorAll('button[data-plan-tab]')].map((b) => b.getAttribute('aria-pressed'))]; }));
    }
  }
  await done();
}

// ---- about: logo ticker, rules scroll, team switch
for (const w of [1440, 390]) {
  const { p, done } = await page('/about/', w);
  log(`logo clones ${w}`, await p.evaluate(() => document.querySelectorAll('[data-fx="logo-ticker"] [data-ticker-clone]').length));
  const lx = () => p.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('[data-fx="logo-ticker"] ul')).transform).m41);
  const l0 = await lx(); await p.waitForTimeout(1500); log(`logo ticker moves left ${w}`, (await lx()) < l0);
  const rules = await p.evaluate(() => { const el = document.getElementById('about-rules'); return { top: el.getBoundingClientRect().top + scrollY, h: el.offsetHeight }; });
  for (const f of [0, 0.5, 1]) {
    await p.scrollTo(rules.top + f * Math.max(0, rules.h - 900));
    log(`rules ${w} @${f}`, await p.evaluate(() => [document.getElementById('about-rules-track').style.transform, ...[...document.getElementById('about-rules-track').children].map((c) => c.style.transform || getComputedStyle(c).transform)].join(' | ')));
  }
  const team = await p.evaluate(() => document.querySelector('[data-fx="team-switch"]').getBoundingClientRect().top + scrollY);
  await p.scrollTo(team - 100);
  for (const i of [2, 3, 0]) {
    await p.click(`[data-fx="team-switch"] button[data-index="${i}"]`); await p.settle(3000);
    log(`team ${w} pick ${i}`, await p.evaluate(() => { const root = document.querySelector('[data-fx="team-switch"]'); return [[...root.querySelectorAll('button[data-index]')].map((b) => b.getAttribute('aria-pressed')).join(''), [...root.querySelectorAll('div[data-index]')].map((c) => c.classList.contains('is-active') ? 1 : 0).join(''), Math.round(new DOMMatrix(getComputedStyle(document.getElementById('about-team-track')).transform).m41)]; }));
  }
  await p.click('[data-fx="team-switch"] div[data-index="1"]', { force: true }); await p.settle(3000);
  log(`team ${w} card click 1`, await p.evaluate(() => [...document.querySelectorAll('[data-fx="team-switch"] button[data-index]')].map((b) => b.getAttribute('aria-pressed')).join('')));
  await done();
}

// ---- blog: category tabs
{
  const { p, done } = await page('/blog/');
  const tabs = await p.evaluate(() => [...document.querySelectorAll('[data-tab]')].map((t) => t.dataset.tab));
  for (const t of [...tabs.slice(1), tabs[0]]) {
    await p.click(`[data-tab="${t}"]`); await p.settle(600);
    log(`blog tab "${t}"`, await p.evaluate(() => [[...document.querySelectorAll('[data-category]')].map((c) => (c.hidden ? 0 : 1)).join(''), document.querySelector('[data-empty]').hidden, [...document.querySelectorAll('[data-tab]')].map((x) => x.getAttribute('aria-pressed')).join(',')]));
  }
  await done();
}

// ---- contact form states (no endpoint: plays its states)
{
  const { p, done } = await page('/contact/');
  const form = 'form[data-fx="contact-form"]';
  const st = () => p.evaluate((f) => { const b = document.querySelector(`${f} button[type="submit"]`); return `${b.dataset.state}:${b.textContent.trim()}`; }, form);
  log('form idle', await st());
  await p.click(`${form} button[type="submit"]`); await p.settle(300);
  log('form empty submit (browser validation)', await st());
  for (const el of await p.$$(`${form} input:not([name="_gotcha"]), ${form} textarea`)) {
    const type = await el.getAttribute('type');
    await el.fill(type === 'email' ? 'test@example.com' : 'Test');
  }
  await p.click(`${form} button[type="submit"]`);
  const seen = [];
  for (let i = 0; i < 70; i++) { const v = await st(); if (seen.at(-1) !== v) seen.push(v); await p.waitForTimeout(100); }
  log('form states in order', seen);
  await done();
}

// ---- 404: shard field
for (const w of [1440, 390]) {
  const { p, done } = await page('/nope', w);
  await p.settle(1000);
  log(`404 shard canvas ${w}`, await p.evaluate(() => document.querySelectorAll('[data-fx="shard-field"] canvas').length));
  await p.mouse.move(w / 2, 400); await p.mouse.down(); await p.waitForTimeout(600); await p.mouse.up(); await p.settle(500);
  log(`404 press: copy not selected ${w}`, await p.evaluate(() => String(getSelection()).length === 0));
  await done();
}

await b.close();
for (const l of out) console.log(l);
console.log('console errors:', errors.length ? errors : 'none');
