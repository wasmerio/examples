---
title: Broadsheet · 博客模板
description: 一个报刊式排版的 Astro 博客模板，内置文章、项目、标签、全文搜索、RSS 与评论。
date: 2026-09-01
status: 已发布
tags:
  - Astro
  - TypeScript
  - Tailwind CSS
  - Pagefind
demoURL: https://example.com
repoURL: https://github.com/your-name/your-repo
cover: https://picsum.photos/id/0/1200/800
---

这是一条示例项目记录，用来展示项目页的版式。换成你自己的项目时，删掉这个目录即可。

## 项目简介

Broadsheet 把个人博客需要的东西一次装好：文章与项目两套内容集合、标签归档、构建期生成的全文搜索、RSS、站点地图、深浅色主题，以及基于 GitHub Discussions 的评论。

首页按报纸版面组织内容——一条头条、三篇近期文章、一列更多文章，右侧是作者卡片与标签导航。整体偏向阅读，而不是堆砌视觉效果。

## 技术选择

- **Astro**：静态输出，零客户端框架，页面切换用内置的 ClientRouter。
- **Tailwind CSS v4**：配置写在 CSS 里，主题令牌用 CSS 变量，深浅色共用一套结构。
- **Pagefind**：搜索索引在构建时生成，不依赖任何搜索服务。
- **TypeScript**：内容 frontmatter 用 Zod 校验，字段写错在构建期就会报错。

## 页面结构

```
/            首页版面
/blog        文章归档
/blog/[id]   文章详情（目录、上下篇、评论）
/projects    项目列表
/tags        标签总览
/about       关于页
/rss.xml     RSS 订阅
```

## 状态字段

项目 frontmatter 里的 `status` 会显示在标题上方，可选值是 `构思中`、`验证中`、`开发中`、`已发布`、`维护中`。`demoURL` 和 `repoURL` 填了才会出现对应的链接按钮，两个都不填就只显示正文。
