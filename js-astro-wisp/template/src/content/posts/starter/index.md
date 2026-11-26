---
title: '开始写作'
description: '介绍如何在 Wisp 站点中发布第一篇文章。'
pubDate: 2026-11-06
tags: ['Wisp']
featured: true
---

这是你的第一篇文章。把本文件替换成自己的内容，或者删除 `starter` 目录后在同级目录创建新文章。

## 文章结构

文章使用 Markdown 或 MDX 编写。每篇文章需要在 frontmatter 中提供 `title`、`description` 和 `pubDate`，文章正文从二级标题开始。

## 下一步

- 修改 `astro.config.ts` 中 `wisp({...})` 的站点信息和导航。
- 编辑 `src/content/pages/about.md`。
- 在 `src/content/posts/` 下创建文章目录。
- 运行 `pnpm dev` 预览，运行 `pnpm build` 检查生产构建。
