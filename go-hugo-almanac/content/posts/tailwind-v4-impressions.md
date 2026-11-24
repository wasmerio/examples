---
title: "Tailwind v4 用了一个月：好与不好"
date: 2026-04-23
summary: "@theme inline、@source inline、CSS-first 配置 —— Tailwind v4 把配置文件烧了，留下纯 CSS 和更短的 build。"
tags: ["前端", "Tailwind", "CSS"]
categories: ["技术"]
cardSize: "standard"
---


## 三件好事

**1. `@theme inline` —— 配置写进 CSS**

不再有 `tailwind.config.js`。所有 design token 直接写在 CSS 里：

```css
@theme inline {
  --color-brand: #c0764e;
  --color-bg: #faf8f5;
  --font-serif: "Source Serif 4", Georgia, serif;
}
```

`bg-brand` / `text-brand` / `font-serif` 这些 utility 自动派生出来，IDE 也能补全。

**2. `@source inline()` —— 数据驱动 utility 不再丢**

模板里出现不了但运行时会用到的 class（比如根据 props 算出来的 `grid-cols-{n}`），以前要靠 `safelist`，现在直接：

```css
@source inline("grid-cols-{1,2,3,4,5,6}");
```

**3. 构建快了一截**

去 PostCSS 之后冷启动从 ~800ms 掉到 ~200ms，HMR 体感丝滑。

## 一件不好

老插件还没全跟上。`@tailwindcss/typography` 在 v4 上只能装 alpha 版，几个 prose 变体类名变了，迁移要手动改。

