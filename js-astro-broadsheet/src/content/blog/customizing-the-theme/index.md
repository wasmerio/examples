---
title: 定制外观：配色、字体与版面
description: 主题令牌放在哪、怎么换字体、以及首页版面的文章分配规则。
date: 2026-08-20
tags:
  - Broadsheet
  - CSS
  - 设计
cover: https://picsum.photos/id/1039/1400/900
---

样式集中在 `src/styles/global.css` 一个文件里，用 Tailwind CSS v4 加一组 CSS 变量组织。没有 `tailwind.config.js`，配置直接写在 CSS 的 `@theme` 块中。

## 配色

文件里有两组 `:root` 变量。**靠后的那一组才是最终生效的**（注释标着「报刊式排版系统」），前面一组是被覆盖的默认色板。改配色时改后面那组，以及紧随其后的 `html.dark` 块。

常用的几个令牌：

| 变量                              | 用途           |
| --------------------------------- | -------------- |
| `--page-bg`                       | 页面底色       |
| `--surface`                       | 卡片、面板背景 |
| `--text` / `--muted` / `--subtle` | 三级文字颜色   |
| `--border` / `--line`             | 描边与分隔线   |
| `--accent`                        | 链接与强调色   |

深浅两套都要改，不然切换主题时会露馅。`--astro-code-*` 系列控制代码块的语法高亮配色，同样分深浅两套。

## 字体

默认字体是 Geist Sans 与 Geist Mono，通过 `@fontsource` 打包在本地，不请求外部 CDN。换字体需要动三处：

1. `package.json` 里换掉 `@fontsource/*` 依赖。
2. `src/components/Head.astro` 顶部的字重 import 列表。
3. `src/styles/global.css` 里 `@theme` 块的 `--font-sans` 和 `--font-mono`。

如果博客以中文为主，建议在 `--font-sans` 的回退列表里显式加上系统中文字体，避免不同平台的渲染差异。

## 首页版面

首页按发布时间把文章分成三块，规则在 `src/pages/index.astro`：

```ts
const featuredPost = allPosts[0]; // 头条
const highlightedPosts = allPosts.slice(1, 4); // 近期三篇
const latestPosts = allPosts.slice(4, 10); // 列表区
```

想让某篇文章长期占据头条位，把这里改成按标签或自定义字段筛选即可。文章少于四篇时，后面的区块会自动隐藏，不会留下空白。

没有 `cover` 的文章会显示一个「文章封面」占位块。想让版面统一，要么每篇都配图，要么把 `index.astro` 里的图片区域整段删掉，做成纯文字版面。

## 动画

带 `animate` 类的元素会在进入视口时淡入。这套逻辑尊重系统的 `prefers-reduced-motion` 设置：用户关掉动效后，元素直接显示，不做过渡。自己新增区块时，加上 `animate` 类就能接入。
