---
title: "架构"
description: "astro-content-hub 的 Astro 站点结构:布局、路由、内容集合与核心模块。"
order: 1
---

本页说明 `astro-content-hub` 站点的组织方式,供在中心仓库内工作的贡献者参考。
更改站点以外的编写内容请参阅[编写内容](./authoring.md);
从外部仓库同步内容请参阅[内容同步](./content-sync.md)。

## 技术栈

- **Astro 7**,`output: 'static'`。整个站点预渲染到 `dist/`。
- **TypeScript**,`strict` 模式。无理由不使用 `any`。
- **无 UI 框架。** 组件均为 `.astro` 文件。
- **样式:** 单一全局样式表(`src/styles/global.css`)基于 CSS 自定义属性,必要时
  辅以小型 scoped `<style>` 块。无 Tailwind,无 CSS-in-JS。
- **Markdown:** Shiki,使用 `css-variables` 主题。
- **Node 22**(与部署工作流一致)。使用 `npm`。

## 目录布局

```
astro-content-hub/            <- 中心(Astro 站点)位于仓库根目录
├── astro.config.mjs          <- 将 `site` 设为你的域名;sitemap + Sätteri 插件
├── src/
│   ├── components/           <- Layout, Nav, Footer, DocsLayout, PostCard,
│   │                          LocaleSwitcher, ThemeToggle, TableOfContents, TagPage, ProductLandingDefault
│   ├── components/product-landing/  <- 可选的逐产品落地页覆盖(每个产品一个文件,以 slug 命名)
│   ├── content/              <- markdown 集合(文章 + 文档)
│   ├── content.config.ts     <- 集合 schema + glob 加载器
│   ├── lib/                  <- i18n.ts, content.ts, docs.ts, feed.ts, product-landing.ts,
│   │                          remark-rewrite-links.mjs, heading-ids.mjs
│   ├── pages/                <- 基于文件的路由(+ [locale]/ 通用路由)
│   └── styles/global.css     <- 设计变量 + .prose 排版 + 暗色主题
├── public/                   <- favicon, images, CNAME
├── .github/workflows/        <- deploy.yml (GH Pages + CF Pages), sync-docs.yml
├── examples/                 <- 同步进入中心的示例外部仓库
└── docs/                     <- 本文档(同步至中心)
```

## 路由

路由基于 `src/pages/` 下的文件:

- `/` —— 落地页(`index.astro`)。
- `/posts`、`/posts/[...slug]` —— 博客列表 + 捕获所有文章路由。
- `/<product>` -- 产品落地页,由仓库根目录 `site.config.ts` 的 `products` 数组**动态**
  提供。
- `/<product>/docs`、`/<product>/docs/[...slug]` —— 文档索引 + 捕获所有路由。
- 非默认语言由 `src/pages/[locale]/...` 下的**通用路由**提供,这些路由
  在 `getStaticPaths` 中遍历 `locales`(除去默认语言)。一套路由文件即可
  服务所有非默认语言。

由于产品与语言页面均由数据驱动,**你无需为每个产品或语言创建路由文件。** 在
`products` 中添加一项,路由与文档集合即自动生成。

**逐产品落地页覆盖。** 产品可通过添加 `src/components/product-landing/<slug>.astro` 来提供自定义落地页(独立的 `<main>` 区块)。`src/lib/product-landing.ts` 在构建时预先 glob 该目录,并按 slug 返回对应组件(或 `undefined`);两个落地路由(默认 `/<product>/` 路由及其 `/<locale>/<product>/` 双生路由)在存在覆盖时渲染之,否则使用共享回退 `src/components/ProductLandingDefault.astro`。覆盖只渲染 `<main>` 区块 -- 路由仍负责 `Layout` + `Nav` + `Footer` 与 `<head>`。覆盖与回退共用同一套 props 约定(`product`、`locale`、`c`、`docsHref`)。参见[编写内容 - 自定义产品落地页](./authoring.md#自定义产品落地页)。文档子路由(`/<product>/docs...`)不受影响。

## 布局组合

- `Layout.astro` 负责文档外壳(`<html>/<head>/<body>`、字体、meta、OpenGraph)。
  每个页面都组合它 —— 切勿手写第二份文档外壳。
- `Nav.astro`(吸顶头部)与 `Footer.astro` 在 `Layout` 内组合。
- `DocsLayout.astro` 是内容区域布局:它组合 `Layout` + `Nav` + `Footer`,并加上
  侧边栏 + `.prose` 内容区。

## 内容集合

在 `src/content.config.ts` 中以 [zod](https://zod.dev/) schema 定义:

- `posts<Locale>` —— `src/content/posts/<locale>/**/*.{md,mdx,html}`。schema:
  `title`、`date`、`description`、`tags`、`author?`、`source?`、`draft?`。
  嵌套目录是 slug 的一部分。
- `<product>Docs<Locale>` —— `src/content/docs/<product>/<locale>/**/*.md`,
  按 `products` 数组为每个产品自动生成。schema:`title`、`description?`、
  `order`(控制侧边栏排序;`index` 始终排在最前)。

Markdown 通过 `astro:content` 的 `render(entry)` 渲染;页面将 `<Content />`
传入 `.prose` 容器以复用统一排版。

## `src/lib/` 中的核心模块

| 文件 | 职责 |
|------|------|
| `i18n.ts` | 单一事实来源:`locales`、`defaultLocale`、`t`(UI 字符串)、`home`(落地文案)、`productCopy` 及路径/语言辅助函数。 |
| `site.config.ts`(仓库根目录) | 实例配置:`site` 段(`orgUrl`、`nav.links` 自定义导航项、`footer.links` 页脚列)以及 `products` 注册表(提供文档与落地卡片的产品列表)。 |
| `content.ts` | 本地化路径生成 + 回退渲染辅助(文档 + 文章)。 |
| `docs.ts` | `buildNav` —— 侧边栏构建(index → 基础路径,按 `order` 排序)。 |
| `product-landing.ts` | 逐产品落地页覆盖解析器 -- 预先 glob `components/product-landing/*.astro`,以 slug 为键;返回覆盖组件或 `undefined`(回退到 `ProductLandingDefault.astro`)。 |
| `remark-rewrite-links.mjs` | 重写文档链接,使 `docs/<product>/<locale>/` 解析为 `/<product>/docs`。 |

## 构建与部署

- `npm run dev` —— 本地开发服务器。
- `npm run build` —— 先运行 `astro check`(类型检查),再构建到 `dist/`。
- `.github/workflows/deploy.yml` 由**手动**触发(`workflow_dispatch`):构建后将
  `dist/` 部署到 GitHub Pages 与 Cloudflare Pages。它不会在推送到 `main` 时
  自动运行。参见[部署](./deployment.md)。

## 约定

- 组件保持小而可组合;优先用 props 而非全局变量。
- 使用 `global.css` 的 CSS 自定义属性,而非硬编码值。
- 应用代码优先使用相对导入;`@/*` 映射到 `src/*`。
- `<head>` 相关事项放在 `Layout.astro`;页面不得重复 meta 标签。
- 所有提交的产物均为**英文**(源码注释、代码、文档),本地化内容除外。
