---
title: Astro-Argon 使用指南
published: 2024-04-01
description: "如何使用这个 Astro 博客模板。"
image: "./cover.jpeg"
tags: ["Astro", "博客", "自定义"]
category: 指南
draft: false
---

> 封面来源：[Source](https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/208fc754-890d-4adb-9753-2c963332675d/width=2048/01651-1456859105-(colour_1.5),girl,_Blue,yellow,green,cyan,purple,red,pink,_best,8k,UHD,masterpiece,male%20focus,%201boy,gloves,%20ponytail,%20long%20hair,.jpeg)

本模板基于 [Astro](https://astro.build/) 构建。本文只覆盖常见配置，未提及的问题可查阅 [Astro 文档](https://docs.astro.build/)。

## 文章 Frontmatter 字段

```yaml
---
title: 我的第一篇文章
published: 2023-09-09
description: 这是一段简短摘要，会显示在列表页。
image: ./cover.jpg
tags: [示例, 教程]
category: 指南
draft: false
---
```

| 字段 | 说明 |
|---|---|
| `title` | 文章标题。 |
| `published` | 发布时间。 |
| `description` | 列表页摘要。 |
| `image` | 封面图路径：<br/>1. `http://` 或 `https://` 开头：远程图片<br/>2. `/` 开头：`public` 目录图片<br/>3. 其他：相对当前 Markdown 文件路径 |
| `tags` | 标签数组。 |
| `category` | 分类名称。 |
| `draft` | 是否草稿，`true` 时不会被发布。 |

## 文章文件放哪里

文章放在 `src/content/posts/` 下。你也可以按目录组织文章和资源。

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```
