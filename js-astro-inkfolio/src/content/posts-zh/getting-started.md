---
title: 从这三条命令开始
description: 装依赖、本地预览、上线。不用碰构建配置。
date: 2026-11-10
cover: /og/posts/zh/getting-started.png
pinned: 1
coverAlt: 从这三条命令开始
tags: [上手, 部署]
categories: ['配置']
lang: zh
---

Inkfolio 是一个静态的 Astro 主题，只需要 Node.js 20 或更新版本。

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 输出到 dist/
```

第一件要改的事在 `site.config.yaml`，只有一行：

```yaml
site:
  url: https://your-domain.com
```

它决定了 canonical、sitemap 和 RSS 里的链接。不改也能构建，但每页的 canonical 都会指向 `example.com`。

## 部署

`npm run build` 产出一包纯静态 HTML，任何静态托管都能直接放，不需要特殊设置：

- **Cloudflare Pages**：连仓库，构建命令 `npm run build`，输出目录 `dist`。
- **Netlify**：同样两个值。
- **Vercel**：它会自己认出 Astro。

没有服务器、没有数据库、没有 API key。以后要加联系表单，那是另外接的服务，主题故意不自带。

## 自带什么

- 首页列出最新文章
- 文章索引页与正文页
- 关于页（一个 Markdown 文件）
- 每种语言一份 RSS
- 自动生成 sitemap
- 亮色/暗色切换，按访客选择记忆
- 可选的 `/zh/` 中文站，带正确的 `hreflang`

下一篇把 `site.config.yaml` 里每个设置讲一遍。
