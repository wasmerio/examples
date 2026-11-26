---
tagline: "一个从多个仓库聚合文档与文章、自动部署的多语言静态内容中心。"
description: "Astro Content Hub 是一个模板,用于把多个仓库的文档与博客文章聚合到一个双语、可搜索、自动部署的静态站点。"
highlights:
  - label: "许可证"
    value: "MIT"
  - label: "技术栈"
    value: "Astro 7 + TypeScript"
  - label: "语言"
    value: "en, zh-Hans"
install: |
  npx degit awareride/astro-content-hub my-hub
  cd my-hub
  npm install

  # 本地运行
  npm run dev

  # 生产构建
  npm run build
features:
  - title: "数据驱动的产品"
    body: "在 site.config.ts 中登记一个产品,其文档集合、落地页、导航与页脚条目便会自动生成 —— 无需任何按产品编写的路由文件。"
  - title: "默认多语言"
    body: "默认英文,zh-Hans 位于 /zh-Hans/ 下,支持逐页回退:缺失的翻译会在本地化外壳中渲染英文正文,而绝不会 404。"
  - title: "从任意仓库同步内容"
    body: "外部仓库通过 GitHub Actions 贡献文档与文章,推送到评审分支并向内容中心发起 PR —— 内容在发布前都会被审阅。"
  - title: "结构化的产品落地页"
    body: "每个产品可选的 landing/<locale>.md 驱动一个丰富的自动生成落地页(英雄区、要点、安装、特性、FAQ),也可用手写的 .astro 覆盖获得完全控制。"
  - title: "内置搜索与 SEO"
    body: "Pagefind 站内搜索、带 hreflang 备选的 sitemap、llms.txt、RSS,以及可部署到 GitHub Pages 或 Cloudflare Pages 的静态构建产物。"
  - title: "按产品换肤"
    body: "每个产品可通过一个作用域 CSS 文件覆盖其落地页与文档页的颜色令牌 —— 无需改动机制本身即可换品牌。"
sections:
  - type: hero
  - type: highlights
  - type: install
  - type: features
    data:
      layout: grid
      eyebrow: "特性"
      title: "Astro Content Hub 能为你带来什么"
  - type: docs-preview
  - type: cta
    data:
      primary: { label: "阅读文档", href: "/astro-content-hub/docs" }
      secondary: { label: "查看源码", href: "https://github.com/awareride/astro-content-hub" }
---

**Astro Content Hub** 是一个把多个仓库的文档与博客文章聚合到一个站点的静态站点模板。它基于
Astro 7(纯静态输出,无客户端框架)、TypeScript 与单一全局样式表构建 —— 不用 Tailwind,也不用
CSS-in-JS。

站点**数据驱动**:产品都登记在唯一的 `site.config.ts` 注册表中。登记一个产品便会自动接入其
本地化文档集合、落地页、导航与页脚条目,以及 `/products` 目录。内容在外部仓库中编写,并通过
**GitHub Actions 同步**进来,向内容中心发起 PR,因此所有内容在发布前都会被审阅。

它开箱即支持双语(**en** 默认 + `/zh-Hans/` 下的中文),带逐页回退、Pagefind 搜索、带 hreflang
备选的 sitemap、`llms.txt`、RSS,以及面向 GitHub Pages 与 Cloudflare Pages 的静态部署目标。

用它来运营你组织的中心文档站,或把它 fork 成基于同一套机制的产品文档站。
