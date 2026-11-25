---
title: "项目站点的域名和子路径要分开写"
description: "GitHub Pages 项目站点的源站是用户域名，仓库名只是路径。写进同一个变量会让 canonical 重复。"
locale: zh-cn
translationKey: github-pages-paths
publishedAt: 2026-08-14
author: "Site Author"
tags: [发布, Astro, 静态站点, 架构]
featured: true
minutes: 7
draft: false
---

这个示例站点本身就部署在 GitHub Pages 的项目路径上。配置方式可以当成一份可核对的样本。

## 两个变量

```bash
SITE_URL=https://liyuk.github.io
BASE_PATH=/astro-fourfold
```

`SITE_URL` 只写源站，不带仓库名。`BASE_PATH` 才是子路径。页面、RSS、站点地图和 canonical 会把它们拼成 `https://liyuk.github.io/astro-fourfold/`。

如果把子路径也写进 `SITE_URL`，再留着原来的 `BASE_PATH`，地址会被拼两次。

## 自定义域名不是多写一段路径

域名本身已经在根上提供站点时，`BASE_PATH` 用 `/`：

```bash
SITE_URL=https://example.com
BASE_PATH=/
```

仓库自带的 GitHub Actions 按「用户名.github.io + 仓库名」生成项目站点。用户站点或自定义域名需要在工作流里改掉这两个值。

## 和内容无关的部分

文章 Markdown 里不要写死这组地址。本地 `npm run dev` 默认走站点根路径，生产构建才读环境变量。示例项目页上的“访问项目”链接指向在线演示，克隆之后应该换成你自己的地址。
