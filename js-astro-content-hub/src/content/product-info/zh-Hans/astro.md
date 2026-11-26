---
tagline: "面向内容驱动网站的 Web 框架 —— 默认零 JavaScript。"
description: "Astro 用于构建博客、营销页与文档等快速、内容驱动的网站,并按需加入交互岛屿。"
highlights:
  - label: "许可证"
    value: "MIT"
  - label: "运行时"
    value: "Node"
features:
  - title: "默认零 JS"
    body: "页面默认以纯 HTML 交付、不携带任何 JavaScript —— 岛屿仅在需要处加入交互。"
    icon:
      paths:
        - "M13 2L4.5 12.5H11L9.5 22 19 10.5H12.5L13 2z"
  - title: "内容集合"
    body: "带类型校验的 Markdown,开箱即用,适合文档、博客等场景。"
    image:
      fallback: "MD"
      gradient: "linear-gradient(135deg, #2a9d8f 0%, #1f7a6f 100%)"
  - title: "框架无关"
    body: "自带 UI 框架 —— React、Vue、Svelte 等,按组件接入。"
    icon:
      paths:
        - "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5"
links:
  - label: "官网"
    href: "https://astro.build"
# Section system demo (Phase 4): rich landing for the astro product so every
# product page in the hub has a consistent, content-driven landing.
sections:
  - type: hero
  - type: highlights
    data:
      variant: card
      eyebrow: "核心信息"
      title: "开源、开箱即用"
  - type: install
  - type: features
    data:
      layout: grid
      eyebrow: "为什么选择 Astro"
      title: "为内容而生,而非配置"
  - type: stats
    data:
      - { label: "GitHub Stars", value: "48k" }
      - { label: "npm 周下载量", value: "900k" }
      - { label: "许可证", value: "MIT" }
  - type: testimonials
    data:
      - quote: "Astro 几乎没花什么力气就让我们的文档站明显更快了。"
        author: "Priya Sharma"
        role: "平台工程师"
        company: "Atlas"
        rating: 5
        avatar:
          fallback: "PS"
      - quote: "内容集合正是我们把博客迁过来的原因。"
        author: "Tom Nguyen"
        role: "创始人"
        company: "Dune"
        rating: 5
        avatar:
          fallback: "TN"
      - quote: "默认零 JS 是一种真正不同的发布思路。"
        author: "Sofia Reyes"
        role: "前端负责人"
        company: "Halcyon"
        rating: 4
        avatar:
          fallback: "SR"
  - type: docs-preview
  - type: faq
    data:
      - q: "Astro 默认会携带 JavaScript 吗?"
        a: "不会 —— 页面默认是纯 HTML,交互岛屿按需开启。"
      - q: "可以使用我熟悉的框架吗?"
        a: "可以 —— 支持 React、Vue、Svelte、Preact 等,按组件接入。"
  - type: cta
    data:
      primary: { label: "开始上手", href: "/astro/docs/getting-started" }
      secondary: { label: "查看源码", href: "https://github.com/withastro/astro" }
---

Astro 是面向内容驱动网站(博客、营销站点与文档)的 Web 框架。它**默认零
JavaScript**,页面天然快速,仅在需要处加入交互岛屿。
