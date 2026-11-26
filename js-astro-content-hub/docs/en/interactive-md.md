---
title: "Interactive Markdown"
description: "Buttons, tabs, icons, and charts built with bare HTML + inline JS inside a plain .md file."
order: 6
---

Plain `.md` files can host real interactivity: a `<script>` tag written
directly in the Markdown is shipped verbatim and runs in the browser. This
page is a single `.md` file — open its source to see there are **no
components** anywhere. Every demo below is just HTML + a bit of inline JS,
and every demo shows the source you would write in your own docs.

> This is the recommended way to add interaction to docs and posts synced
> from external repositories: write the HTML + `<script>` directly in your
> Markdown. No hub-side code, no shared library — your content is
> self-contained, and the hub's PR review gates what ships.

## Buttons

Click a button, watch a value change:

<div class="demo-card">
  <p><strong>Counter</strong> — the classic. Click the buttons.</p>
  <div class="demo-row">
    <button class="btn btn-secondary demo-btn" onclick="demoCounter('minus')">−</button>
    <span class="demo-output" id="demo-counter">0</span>
    <button class="btn btn-secondary demo-btn" onclick="demoCounter('plus')">+</button>
  </div>
  <div class="demo-row">
    <button class="btn btn-primary demo-btn" onclick="demoCounter('reset')">Reset</button>
    <button class="btn btn-secondary demo-btn" onclick="demoCounter('double')">Double</button>
  </div>
</div>

The source — a button with an `onclick`, plus a small script that mutates a
`<span>`:

```html
<button class="btn btn-secondary" onclick="myCounter('plus')">+</button>
<span id="my-counter">0</span>

<script>
  var n = 0;
  function myCounter(action) {
    if (action === 'plus') n++;
    document.getElementById('my-counter').textContent = String(n);
  }
</script>
```

## Tabs

Group content behind tabs — switch panels by clicking:

<div class="demo-card">
  <p><strong>Package managers</strong> — click a tab.</p>
  <div class="demo-tabs">
    <button class="demo-tab is-active" data-tab="npm" onclick="demoTabs('npm')">npm</button>
    <button class="demo-tab" data-tab="pnpm" onclick="demoTabs('pnpm')">pnpm</button>
    <button class="demo-tab" data-tab="yarn" onclick="demoTabs('yarn')">yarn</button>
  </div>
  <div class="demo-panel is-active" data-panel="npm">
    <pre><code>npm install my-package</code></pre>
  </div>
  <div class="demo-panel" data-panel="pnpm">
    <pre><code>pnpm add my-package</code></pre>
  </div>
  <div class="demo-panel" data-panel="yarn">
    <pre><code>yarn add my-package</code></pre>
  </div>
</div>

The pattern — a tab bar plus panels, toggled by class:

```html
<div class="demo-tabs">
  <button class="demo-tab is-active" onclick="demoTabs('npm')">npm</button>
  <button class="demo-tab" onclick="demoTabs('pnpm')">pnpm</button>
</div>
<div class="demo-panel is-active" data-panel="npm">…</div>
<div class="demo-panel" data-panel="pnpm">…</div>

<script>
  function demoTabs(name) {
    document.querySelectorAll('.demo-tab').forEach(function (t) {
      t.classList.toggle('is-active', t.getAttribute('data-tab') === name);
    });
    document.querySelectorAll('.demo-panel').forEach(function (p) {
      p.classList.toggle('is-active', p.getAttribute('data-panel') === name);
    });
  }
</script>
```

## Icons

Inline SVG — no icon library. Static icons render as-is; a button can swap
between two icons:

<div class="demo-card">
  <p><strong>Toggle icon</strong> — click to flip between sun and moon.</p>
  <div class="demo-row">
    <button class="btn btn-secondary demo-btn" onclick="demoIconToggle()">Toggle icon</button>
    <span id="demo-icon"></span>
  </div>
</div>

<div class="demo-card">
  <p><strong>Static icons</strong> (inline SVG, just rendered).</p>
  <div class="demo-row">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/></svg>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M2 8h20M8 2v20"/></svg>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/><path d="M12 7v5l3 3"/></svg>
  </div>
</div>

## Chart from a JS function

Write a function that generates data, draw it as an SVG — no chart library.
Click **Roll** to regenerate (same seed → same shape), or switch line/bar:

<div class="demo-card">
  <p><strong>Random walk</strong> — a JS function produces the points.</p>
  <svg id="demo-chart" class="demo-chart" viewBox="0 0 600 220" preserveAspectRatio="none"></svg>
  <div class="demo-row">
    <span class="demo-output" id="demo-chart-count">0 points</span>
    <button class="btn btn-secondary demo-btn" onclick="demoChartRoll()">Roll</button>
    <label><input type="checkbox" id="demo-chart-bar" onchange="demoChartDraw()"> bar</label>
  </div>
</div>

The source — the generator is a plain function you can read:

```html
<svg id="demo-chart" class="demo-chart" viewBox="0 0 600 220"></svg>
<button onclick="demoChartRoll()">Roll</button>

<script>
  // A deterministic PRNG so the same seed draws the same chart.
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var demoChartSeed = 7;
  var demoChartAsBar = false;
  function demoChartData() {
    var r = mulberry32(demoChartSeed);
    var v = 50, out = [];
    for (var i = 0; i < 24; i++) {
      v = Math.max(5, Math.min(95, v + (r() - 0.5) * 24));
      out.push(v);
    }
    return out;
  }
  function demoChartDraw() {
    var svg = document.getElementById('demo-chart');
    var values = demoChartData();
    var asBar = document.getElementById('demo-chart-bar').checked;
    var W = 600, H = 220, PAD = 8;
    var x = function (i) { return PAD + (i / 23) * (W - PAD * 2); };
    var y = function (v) { return H - PAD - (v / 100) * (H - PAD * 2); };
    var inner = '';
    if (!asBar) {
      var pts = values.map(function (p, i) {
        return x(i).toFixed(1) + ',' + y(p).toFixed(1);
      }).join(' ');
      inner += '<polyline points="' + pts + '" fill="none" stroke="var(--color-accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
      inner += values.map(function (p, i) {
        return '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(p).toFixed(1) + '" r="2.5" fill="var(--color-accent)"/>';
      }).join('');
    } else {
      var bw = ((W - PAD * 2) / 24) * 0.7;
      inner = values.map(function (p, i) {
        var hh = Math.max(2, H - PAD - y(p));
        return '<rect x="' + (x(i) - bw / 2).toFixed(1) + '" y="' + (H - PAD - hh).toFixed(1) +
               '" width="' + bw.toFixed(1) + '" height="' + hh.toFixed(1) + '" rx="1.5" fill="var(--color-accent)"/>';
      }).join('');
    }
    svg.innerHTML = inner;
    document.getElementById('demo-chart-count').textContent = values.length + ' points';
  }
  function demoChartRoll() { demoChartSeed = Math.floor(Math.random() * 1e9); demoChartDraw(); }
  // Draw on load.
  demoChartDraw();
</script>
```

## Best practices

- **Keep it self-contained.** All styles and scripts live in this one `.md`
  file. Use a `demo-` (or product-specific) prefix on classes and `id`s so
  your page never collides with the hub's global styles or another page.
- **No external requests.** Interactivity here is pure DOM + math. Avoid
  `fetch`/`XMLHttpRequest`, `eval`, and cookie access in content — the hub's
  review gates this, and it keeps your page fast and safe.
- **One `<script>` at the end** defining all functions is easier to read than
  scattered inline handlers, and keeps the page organized.
- **Reuse the hub's CSS classes** (`btn`, `btn-primary`, `btn-secondary`) so
  your buttons match the site; add a small `<style>` block only for your
  custom bits (cards, tabs, chart).

<!-- A single <script> for all the demos above. Plain JS - no modules, no
     framework, no fetch - just DOM reads/writes. -->

<script>
  // ---- Counter ----
  var demoCounterValue = 0;
  function demoCounter(action) {
    var out = document.getElementById('demo-counter');
    if (action === 'minus') demoCounterValue -= 1;
    else if (action === 'plus') demoCounterValue += 1;
    else if (action === 'double') demoCounterValue *= 2;
    else demoCounterValue = 0;
    out.textContent = String(demoCounterValue);
  }

  // ---- Tabs ----
  function demoTabs(name) {
    document.querySelectorAll('.demo-tab').forEach(function (t) {
      t.classList.toggle('is-active', t.getAttribute('data-tab') === name);
    });
    document.querySelectorAll('.demo-panel').forEach(function (p) {
      p.classList.toggle('is-active', p.getAttribute('data-panel') === name);
    });
  }

  // ---- Icon toggle (sun <-> moon) ----
  var demoIconIsSun = true;
  function demoIconToggle() {
    var el = document.getElementById('demo-icon');
    demoIconIsSun = !demoIconIsSun;
    el.innerHTML = demoIconIsSun
      ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
      : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>';
  }
  demoIconToggle();

  // ---- Chart (random walk) ----
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var demoChartSeed = 7;
  function demoChartData() {
    var r = mulberry32(demoChartSeed);
    var v = 50, out = [];
    for (var i = 0; i < 24; i++) {
      v = Math.max(5, Math.min(95, v + (r() - 0.5) * 24));
      out.push(v);
    }
    return out;
  }
  function demoChartDraw() {
    var svg = document.getElementById('demo-chart');
    if (!svg) return;
    var values = demoChartData();
    var asBar = document.getElementById('demo-chart-bar').checked;
    var W = 600, H = 220, PAD = 8;
    var x = function (i) { return PAD + (i / 23) * (W - PAD * 2); };
    var y = function (v) { return H - PAD - (v / 100) * (H - PAD * 2); };
    var inner = '';
    if (!asBar) {
      var pts = values.map(function (p, i) {
        return x(i).toFixed(1) + ',' + y(p).toFixed(1);
      }).join(' ');
      inner += '<polyline points="' + pts + '" fill="none" stroke="var(--color-accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
      inner += values.map(function (p, i) {
        return '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(p).toFixed(1) + '" r="2.5" fill="var(--color-accent)"/>';
      }).join('');
    } else {
      var bw = ((W - PAD * 2) / 24) * 0.7;
      inner = values.map(function (p, i) {
        var hh = Math.max(2, H - PAD - y(p));
        return '<rect x="' + (x(i) - bw / 2).toFixed(1) + '" y="' + (H - PAD - hh).toFixed(1) +
               '" width="' + bw.toFixed(1) + '" height="' + hh.toFixed(1) + '" rx="1.5" fill="var(--color-accent)"/>';
      }).join('');
    }
    svg.innerHTML = inner;
    document.getElementById('demo-chart-count').textContent = values.length + ' points';
  }
  function demoChartRoll() { demoChartSeed = Math.floor(Math.random() * 1e9); demoChartDraw(); }
  demoChartDraw();
</script>

<style>
  .demo-card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 1.25rem 1.5rem;
    margin: 1.5rem 0;
    background: var(--color-surface);
  }
  .demo-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }
  #demo-icon {
    display: inline-flex;
    align-items: center;
    line-height: 0;
    color: var(--color-text);
  }
  .demo-btn {
    padding: 0.4rem 1.1rem;
    font-size: 0.9rem;
  }
  .demo-output {
    min-width: 3rem;
    text-align: center;
    font-size: 1.4rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .demo-tabs {
    display: flex;
    gap: 0.35rem;
    margin-bottom: 0.75rem;
  }
  .demo-tab {
    appearance: none;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text-secondary);
    padding: 0.45rem 1rem;
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
  }
  .demo-tab.is-active {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: #141413;
  }
  .demo-panel { display: none; }
  .demo-panel.is-active { display: block; }
  .demo-chart {
    width: 100%;
    height: 220px;
    display: block;
    background: var(--color-bg-alt);
    border-radius: var(--radius);
  }
</style>
