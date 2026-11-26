---
title: "交互式 Markdown"
description: "按钮、标签页、图标与图表 —— 全部用纯 HTML + 内联 JS 写在普通 .md 文件里。"
order: 6
---

普通 `.md` 文件就能承载真正的交互:直接写在 Markdown 里的 `<script>` 标签会
原样输出并在浏览器中执行。本页是一个纯 `.md` 文件 —— 打开它的源码可以看到
**没有任何组件**。下面的每个 demo 都只是 HTML + 一点内联 JS,而且每个 demo
都展示了你在自己文档里要写的源码。

> 这是给**从外部仓库同步的 docs 与 posts** 添加交互的推荐方式:直接把 HTML
> + `<script>` 写进你的 Markdown。无需 hub 侧代码、无需共享库 —— 你的内容
> 自包含,由 hub 的 PR 审核把关什么能上线。

## 按钮

点按钮,看数值变化:

<div class="demo-card">
  <p><strong>计数器</strong> —— 经典示例。点击按钮。</p>
  <div class="demo-row">
    <button class="btn btn-secondary demo-btn" onclick="demoCounter('minus')">−</button>
    <span class="demo-output" id="demo-counter">0</span>
    <button class="btn btn-secondary demo-btn" onclick="demoCounter('plus')">+</button>
  </div>
  <div class="demo-row">
    <button class="btn btn-primary demo-btn" onclick="demoCounter('reset')">重置</button>
    <button class="btn btn-secondary demo-btn" onclick="demoCounter('double')">加倍</button>
  </div>
</div>

源码 —— 一个带 `onclick` 的按钮,加一小段修改 `<span>` 的脚本:

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

## 标签页

把内容分组到标签页 —— 点击切换面板:

<div class="demo-card">
  <p><strong>包管理器</strong> —— 点击标签。</p>
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

模式 —— 标签栏加面板,通过 class 切换:

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

## 图标

内联 SVG —— 无需图标库。静态图标原样渲染;按钮可在两个图标间切换:

<div class="demo-card">
  <p><strong>切换图标</strong> —— 点击在太阳与月亮间切换。</p>
  <div class="demo-row">
    <button class="btn btn-secondary demo-btn" onclick="demoIconToggle()">切换图标</button>
    <span id="demo-icon"></span>
  </div>
</div>

<div class="demo-card">
  <p><strong>静态图标</strong>(内联 SVG,直接渲染)。</p>
  <div class="demo-row">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/></svg>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M2 8h20M8 2v20"/></svg>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/><path d="M12 7v5l3 3"/></svg>
  </div>
</div>

## 由 JS 函数生成的图表

写一个生成数据的函数,画成 SVG —— 无需图表库。点 **Roll** 重新生成
(同样的 seed → 同样的形状),或切换折线/柱状:

<div class="demo-card">
  <p><strong>随机游走</strong> —— 一个 JS 函数产生数据点。</p>
  <svg id="demo-chart" class="demo-chart" viewBox="0 0 600 220" preserveAspectRatio="none"></svg>
  <div class="demo-row">
    <span class="demo-output" id="demo-chart-count">0 个点</span>
    <button class="btn btn-secondary demo-btn" onclick="demoChartRoll()">Roll</button>
    <label><input type="checkbox" id="demo-chart-bar" onchange="demoChartDraw()"> 柱状</label>
  </div>
</div>

源码 —— 生成器是一个你能读懂的普通函数:

```html
<svg id="demo-chart" class="demo-chart" viewBox="0 0 600 220"></svg>
<button onclick="demoChartRoll()">Roll</button>

<script>
  // 确定性 PRNG,同样的 seed 画出同样的图表。
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
    document.getElementById('demo-chart-count').textContent = values.length + ' 个点';
  }
  function demoChartRoll() { demoChartSeed = Math.floor(Math.random() * 1e9); demoChartDraw(); }
  // 加载时绘制。
  demoChartDraw();
</script>
```

## 最佳实践

- **保持自包含。** 所有样式与脚本都在这个 `.md` 文件里。给 class 与 `id`
  加上 `demo-`(或产品名)前缀,这样你的页面永远不会与 hub 的全局样式或
  另一个页面冲突。
- **无外部请求。** 这里的交互是纯 DOM + 数学。避免在内容中使用
  `fetch`/`XMLHttpRequest`、`eval` 与 cookie 访问 —— hub 的审核会把关,
  这也让你的页面更快更安全。
- **末尾放一个 `<script>`** 定义所有函数,比散落的内联处理器更好读,
  也让页面更整洁。
- **复用 hub 的 CSS 类**(`btn`、`btn-primary`、`btn-secondary`),让你的按钮
  与站点一致;只为自定义部分(卡片、标签页、图表)加一个小的 `<style>` 块。

<!-- 上面所有 demo 共用一个 <script>。纯 JS —— 无模块、无框架、无 fetch,
     只是 DOM 读写。 -->

<script>
  // ---- 计数器 ----
  var demoCounterValue = 0;
  function demoCounter(action) {
    var out = document.getElementById('demo-counter');
    if (action === 'minus') demoCounterValue -= 1;
    else if (action === 'plus') demoCounterValue += 1;
    else if (action === 'double') demoCounterValue *= 2;
    else demoCounterValue = 0;
    out.textContent = String(demoCounterValue);
  }

  // ---- 标签页 ----
  function demoTabs(name) {
    document.querySelectorAll('.demo-tab').forEach(function (t) {
      t.classList.toggle('is-active', t.getAttribute('data-tab') === name);
    });
    document.querySelectorAll('.demo-panel').forEach(function (p) {
      p.classList.toggle('is-active', p.getAttribute('data-panel') === name);
    });
  }

  // ---- 图标切换(太阳 <-> 月亮)----
  var demoIconIsSun = true;
  function demoIconToggle() {
    var el = document.getElementById('demo-icon');
    demoIconIsSun = !demoIconIsSun;
    el.innerHTML = demoIconIsSun
      ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
      : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>';
  }
  demoIconToggle();

  // ---- 图表(随机游走)----
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
    document.getElementById('demo-chart-count').textContent = values.length + ' 个点';
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
