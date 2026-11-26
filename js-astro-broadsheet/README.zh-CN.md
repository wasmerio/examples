# Broadsheet

[English](README.md) · **简体中文**

一个报刊式排版的 Astro 博客模板，为中文技术写作准备。首页像一张报纸版面：一条头条、三篇近期文章、一列更多文章，右侧是作者卡片与标签导航。

[![用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fxyovo%2Fbroadsheet&project-name=my-blog&repository-name=my-blog)

点上面的按钮会把这个仓库复制到你自己的 GitHub 账号并直接部署，不需要填任何配置。也可以点仓库页面的 **Use this template** 建仓，然后本地开发。

![首页](docs/preview-home.png)

## 特性

- **两套内容集合**：文章（`blog`）与项目（`projects`），frontmatter 用 Zod 校验，字段写错在构建期报错
- **Markdown 与 MDX**：普通文章用 `.md`，需要在正文插入组件时改成 `.mdx`
- **全文搜索**：Pagefind 在构建时生成索引，无需搜索服务，快捷键 `/` 或 `Cmd/Ctrl + K`
- **深浅色主题**：亮色 / 暗色 / 跟随系统三档，首屏无闪烁
- **标签归档**：自动统计标签数量并生成归档页
- **文章目录**：二三级标题自动生成右侧目录，滚动高亮当前章节
- **评论**：Giscus + GitHub Discussions，不配置就自动隐藏
- **RSS 与站点地图**：`/rss.xml` 与 `sitemap-index.xml` 构建时生成
- **零客户端框架**：纯静态输出，页面切换用 Astro 内置 ClientRouter
- **可访问性**：完整的 ARIA 标注，尊重 `prefers-reduced-motion`

## 技术栈

Astro 6 · TypeScript · Tailwind CSS v4 · Pagefind · MDX · Shiki

## 快速开始

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:4321`。开发服务器监听所有网卡，局域网内的手机可以直接访问调试移动端。

## 配置清单

按顺序改完这几处，站点就是你自己的了：

1. **`src/consts.ts`** — 站点标题、简介、作者信息、导航项、技术栈列表。品牌相关的文字都在这里，不需要翻组件。
2. **`.env`** — 复制 `.env.example`，填 `SITE_URL`（部署后的完整地址），以及可选的 Giscus 参数。部署在 Vercel 上可以不填 `SITE_URL`，会自动用项目的生产域名。
3. **`public/favicon.svg`** — 换成你自己的图标。
4. **`src/pages/about.astro`** — 关于页的正文、封面图与技术分类需要手写。
5. **`src/content/`** — 删掉示例文章和示例项目，换成你的内容。
6. **`src/styles/global.css`** — 需要换配色时改这里（见下）。

## 写文章

一篇文章是一个目录加一个 `index.md`，目录名就是链接地址：

```
src/content/blog/
└── my-first-post/     → /blog/my-first-post
    ├── index.md
    └── diagram.png    → 文章里用 ./diagram.png 引用
```

文章 frontmatter：

```yaml
---
title: 文章标题 # 必填
description: 一句话摘要 # 必填，用于列表与 SEO
date: 2026-09-01 # 必填
tags: [Astro, 工程实践] # 可选
cover: https://example.com/a.jpg # 可选，需要完整 URL
draft: true # 可选，为 true 时不构建、不进列表和 RSS
---
```

项目 frontmatter 多三个字段：`status`（`构思中` / `验证中` / `开发中` / `已发布` / `维护中`）、`demoURL`、`repoURL`。完整约束见 `src/content.config.ts`。

模板自带的示例文章本身就是使用文档，涵盖内容格式、外观定制、部署与评论、以及一页排版元素参照。

## 换配色

`src/styles/global.css` 里有两组 `:root` 变量，**靠后的那一组才生效**（注释标着「报刊式排版系统」），前一组是被覆盖的默认色板。改配色时改后面那组以及紧随的 `html.dark` 块，深浅两套要一起改。

主要令牌：`--page-bg`（页面底色）、`--surface`（卡片背景）、`--text` / `--muted` / `--subtle`（三级文字）、`--border` / `--line`（描边）、`--accent`（链接与强调色）。`--astro-code-*` 系列控制代码高亮。

字体默认 Geist Sans / Geist Mono，通过 `@fontsource` 本地打包。要更换需改三处：`package.json` 的依赖、`src/components/Head.astro` 顶部的 import、`global.css` 中 `@theme` 的 `--font-sans` / `--font-mono`。

## 目录结构

```
src/
├── components/     # 页头页脚、卡片、目录、主题切换等
├── content/        # 文章与项目（Markdown / MDX）
├── layouts/        # 页面骨架
├── pages/          # 路由
├── styles/         # global.css，全部样式与主题令牌
├── consts.ts       # 站点配置入口
├── content.config.ts  # 内容集合与字段校验
└── types.ts
```

路由一览：`/`（首页）、`/blog`、`/blog/[id]`、`/projects`、`/projects/[id]`、`/tags`、`/tags/[tag]`、`/about`、`/rss.xml`、`/404`。

## 构建与部署

```bash
pnpm build    # astro check + build，并生成搜索索引
pnpm preview  # 预览构建产物
```

构建产物在 `dist/`，纯静态，任何静态托管都能部署。平台配置：构建命令 `pnpm build`，输出目录 `dist`，Node 24。

### Vercel

[![用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fxyovo%2Fbroadsheet&project-name=my-blog&repository-name=my-blog)

零配置：Vercel 会自动识别 Astro、跑 `pnpm build`、发布 `dist`。站点地址取 `VERCEL_PROJECT_PRODUCTION_URL`，所以 sitemap 和 RSS 从第一次部署起就是正确的绝对地址。

绑定自定义域名后，在项目的 Environment Variables 里加 `SITE_URL=https://你的域名` 再重新部署——它的优先级高于自动域名。想开评论就把四个 `PUBLIC_GISCUS_*` 变量一起加上。

### 其他平台

Netlify、Cloudflare Pages、GitHub Pages 同样可用，但**必须手动设置 `SITE_URL` 环境变量**，否则 RSS 与 sitemap 里的链接会指向 `localhost`。部署在子路径下（例如 GitHub Pages 项目页）还要在 `astro.config.mjs` 里补 `base`。

搜索索引只在构建时生成，**开发模式下搜索结果为空是正常的**，要验证搜索请跑 `pnpm build && pnpm preview`。

## 评论

在 [giscus.app](https://giscus.app) 生成四个参数，写进 `.env` 和托管平台的环境变量：

```bash
PUBLIC_GISCUS_REPO=your-name/your-repo
PUBLIC_GISCUS_REPO_ID=R_xxx
PUBLIC_GISCUS_CATEGORY=Announcements
PUBLIC_GISCUS_CATEGORY_ID=DIC_xxx
```

前提是仓库为 public、已开启 Discussions 并安装了 Giscus App。四个变量缺任何一个，评论区就不渲染，其余功能照常。

## 许可

MIT
