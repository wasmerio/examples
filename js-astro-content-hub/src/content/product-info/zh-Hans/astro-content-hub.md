---
tagline: "聚合多个仓库的文档与文章 —— 本地化、自动部署。"
description: "组织与产品门户模板:将多个开源仓库的文档与博客文章聚合到一个快速、本地化的静态站点。"
highlights:
  - label: "许可证"
    value: "MIT"
  - label: "技术栈"
    value: "Astro 7"
  - label: "语言"
    value: "2"
install: |
  git clone https://github.com/awareride/astro-content-hub
  cd astro-content-hub
  npm install
features:
  - title: "Hub + 内容同步"
    body: "外部仓库撰写文章与文档,再由 GitHub Action 通过拉取请求同步进来。一个 Hub、多个源仓库,任何内容上线前都经过人工审阅。"
    icon:
      paths:
        - "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 18l9 5 9-5"
  - title: "带逐页回退的 i18n"
    body: "默认语言 en 位于根路径,zh-Hans 位于 /zh-Hans/。缺失的翻译会在本地化外壳中渲染默认语言正文 —— 绝不 404。"
    icon:
      paths:
        - "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"
  - title: "数据驱动产品"
    body: "在 site.config.ts 的 products 数组添加一条,landing 页、docs 路由与侧边栏即自动生成 —— 无需任何按产品写的路由文件。"
    icon:
      paths:
        - "M4 5h16M4 12h16M4 19h10"
  - title: "零配置样式"
    body: "基于 CSS 自定义属性的单一全局样式表、共享 .prose 排版、深色模式。无 Tailwind、无 CSS-in-JS、无 UI 框架 —— 只有小而美的 .astro 组件。"
    icon:
      paths:
        - "M4 6h16M4 12h16M4 18h16"
links:
  - label: "官网"
    href: "https://awareride.github.io/astro-content-hub"
# 本项目自身的产品落地页 —— 下面每个 section 都是真实、可工作的功能,非占位文案。
sections:
  - type: hero
  - type: highlights
  - type: install
  - type: features
    data:
      layout: grid
      eyebrow: "它能做什么"
      title: "一个 Hub,而非单纯博客"
  - type: stats
    data:
      eyebrow: "数据一览"
      title: "小巧、快速、专注"
      items:
        - { label: "产品数", value: "4" }
        - { label: "语言数", value: "2" }
        - { label: "构建页数", value: "65" }
  - type: docs-preview
  - type: testimonials
    data:
      - quote: "一种真正干净的、聚合多仓库文档与文章的方式。"
        author: "AwareRide"
        role: "维护者"
        company: "astro-content-hub"
        rating: 5
        avatar:
          github: "dev-bobsong"
  - type: faq
    data:
      - q: "内容如何进入 Hub?"
        a: "外部仓库撰写 Markdown,由 GitHub Action 发起拉取请求。任何内容上线前都经过人工审阅。"
      - q: "缺失的翻译会 404 吗?"
        a: "不会 —— 它会在本地化外壳中渲染默认语言正文并给出提示。先写 en,再增量翻译。"
      - q: "部署要花钱吗?"
        a: "不花钱。静态输出可免费部署到 GitHub Pages 与 Cloudflare Pages。"
  - type: cta
    data:
      primary: { label: "阅读文档", href: "/astro-content-hub/docs" }
      secondary: { label: "查看源码", href: "https://github.com/awareride/astro-content-hub" }
---

`astro-content-hub` 是一个基于内容中心模式的**组织与产品门户**模板:它将多个
开源仓库的文档与博客文章聚合到一个**本地化、自动部署**的静态站点,为组织提供
门户入口,并为每个项目提供独立的产品落地页。内容通过拉取请求进入,任何内容在
上线前都经过人工审阅。

## 为什么选择这个模板

内容中心的难点 —— 带逐页回退的 i18n、类型化内容集合、数据驱动产品路由、
免费部署 —— 都已解决。你只需写 Markdown,Hub 负责构建与部署。

## 你会得到什么

- **Hub + 内容同步模型** —— 一个 Hub、多个源仓库、基于 PR 的审阅。
- **带逐页回退的 i18n** —— `en` 在根路径,`zh-Hans` 在 `/zh-Hans/`,缺失翻译
  绝不 404。
- **数据驱动产品** —— 在 `site.config.ts` 添加一条,landing、docs 路由与
  侧边栏即自动出现。
- **零配置样式** —— 基于 CSS 自定义属性的单一全局样式表、共享 `.prose`
  排版、深色模式。
- **SEO 与可发现性** —— canonical URL、sitemap、RSS、`llms.txt`、
  `robots.txt`、自定义 404。
- **阅读体验** —— docs TOC、上一篇/下一篇、代码复制按钮、标签页、
  相关文章、面包屑。
- **免费自动部署** —— 手动工作流免费发布到 GitHub Pages 与 Cloudflare
  Pages。
