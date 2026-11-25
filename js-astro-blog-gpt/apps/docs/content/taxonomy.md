# 分类、标签和页面

除了 `content/posts/` 下的博客文章外，BlogGPT 还在 `content/` 下提供了**分类（`categories`）**、**标签（`tags`）**与**独立页面（`pages`）**三类内容集合。

## 分类与标签

当你在文章的 Frontmatter 中声明 `categories: [frontend]` 或 `tags: [astro, css]` 时，BlogGPT 会自动生成对应的聚合归档页（如 `/categories/frontend`、`/tags/astro`）。

如果某个分类或标签没有对应的说明文件，页面上默认会直接显示其英文短名称（如 `frontend`）。为了让分类和标签显示优雅的中文名称、简介、自定义封面图或多语言译名，你可以在 `content/categories/` 和 `content/tags/` 下创建同名 Markdown 文件：

```markdown
---
title: 前端工程
description: 探讨现代 Web 框架、CSS 架构设计与浏览器性能优化。
image: /images/categories/frontend.webp
coverStyle: background
---

这里可以编写该分类的详细介绍，将展示在分类归档页的顶部。
```

你也可以直接通过命令行快速创建分类或标签定义文件：

```bash
pnpm new category frontend --title "前端工程"
pnpm new tag astro --title "Astro"
```

## 独立页面（`content/pages/`）

`content/pages/` 用于存放不属于时间线文章的常驻独立页面，例如**关于我（`/about`）**、**近况（`/now`）**、**常用装备（`/uses`）**或**更新日志（`/changelog`）**。

```bash
pnpm new page about --title "关于我"
```

### 将独立页面添加到侧边栏导航

新建 `content/pages/about.md` 后，该页面即可通过 `/about` 访问。如果你想把它的入口放到左侧边栏菜单中，只需在 `blog.config.ts` 的 `sidebar.items` 或 `sidebar.menu` 中添加一条链接配置即可（详见[导航、作者和友链](../config/navigation.md)）。

如果你希望某个独立页面仅通过直接链接访问，而不出现在任何列表或搜索中，可在其 Frontmatter 中设置 `hidden: true`。
