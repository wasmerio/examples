---
tagline: "面向内容驱动型网站的 Web 框架。"
description: "Astro 是一个现代静态站点生成器,默认不输出 JavaScript,并支持任意 UI 框架。"
highlights:
  - label: "许可证"
    value: "MIT"
  - label: "UI 框架"
    value: "React, Vue, Svelte"
install: |
  npm create astro@latest
features:
  - title: "默认群岛架构"
    body: "仅在需要处交付交互组件,其余皆为静态 HTML,页面始终保持快速。"
  - title: "框架无关"
    body: "可使用 React、Vue、Svelte、Solid 或 Preact。Astro 在构建时将它们渲染为 HTML。"
  - title: "内容集合"
    body: "带类型的 Markdown 与 MDX,经校验的 Frontmatter、类型化 API 与快速增量构建。"
links:
  - label: "官网"
    href: "https://astro.build"
---

Astro 是一个以内容驱动型网站为优先的静态站点生成器:博客、文档、作品集
与营销站点。它默认编译为 HTML,仅在必要处启用客户端交互。

## 为何面向内容?

网页大多以静态为主。Astro 拥抱这一点:构建时渲染为 HTML,并按需逐个激活
交互"群岛"。结果是更小的负载与更快的页面,同时不放弃丰富的 UI。

```bash
# 创建新项目
npm create astro@latest
```
