---
title: 主题、横幅、统计与 SEO
order: 3
description: 强调色、亮暗、可关横幅、三家统计和共享的元数据。
---

## theme

```yaml
theme:
  accent: '#ff6b01'
  defaultMode: auto
  radius: 12px
```

`accent` 喲给 `--accent` 和 `--u`（链接、下划线、当前菜单项）。`defaultMode` 是 `auto | light | dark`，访客可以自己切，选择会被记住。暗色下可能需要单独一个强调色，在 `src/styles/global.css` 里覆盖：

```css
:root[data-theme='dark'] {
  --accent: #ff7b1a;
  --u: #ff7b1a;
}
```

## promoBanner

```yaml
promoBanner:
  enabled: true
  dismissible: true
  text: 本站的 SEO 用 ZensInk 跑
  link: https://zens.ink
  linkText: 去看看
```

`enabled: false` 会把横幅从 HTML 里彻底去掉，不留隐藏元素。`dismissible: true` 时访客的选择存在 `localStorage` 的 `inkfolio-promo-dismissed` 里。

## analytics

三家默认全关。只有 `enabled: true` **且**填了 id 才会注入脚本：

```yaml
analytics:
  umami:
    enabled: true
    scriptUrl: https://analytics.your-domain.com/script.js
    websiteId: 1a2b3c4d-...
  googleAnalytics:
    enabled: false
    measurementId: G-XXXXXXXXXX
  clarity:
    enabled: false
    projectId: abcdefghij
```

> [!WARNING]
> GA4 和 Clarity 会写 cookie。主题不带 cookie 弹窗——要对欧盟访客开它们，自己加同意工具，并让标签通过它加载。

## seo

```yaml
seo:
  titleTemplate: '{title} — Inkfolio'
  defaultDescription: 一句话介绍这个站。
  ogImage: /og-default.png
  twitterHandle: yourname
  structuredData: true
  robots: index,follow
```

- `titleTemplate`：`{title}` 会被替换；设成 `"{title}"` 就去掉后缀。
- `ogImage`：1200×630，没单独指定图片的页面都用它。
- `structuredData`：WebSite + BlogPosting 的 JSON-LD，日期取自 frontmatter。
- `robots`：全站默认；被关闭的功能（如关着的 MCP 页）会自己改成 `noindex`。
