---
title: 关于这个主题
description: 了解 ermaozi 的设计目标、功能边界和定制入口。
permalink: /about/
createTime: 2026-08-05
updateTime: 2026-08-05
tags: [Astro, 主题]
readingTime: false
comments: false
aside: left
outline: deep
watermark:
  content: ermaozi Demo
  fullPage: false
  globalAlpha: 0.08
---

# 关于这个主题

ermaozi 是一个偏内容型的静态站点起点，适合博客、个人知识库和项目文档。

## 设计目标

- 保持静态输出，部署环境不受限制。
- 用一份配置管理站点身份、导航和可选服务。
- 同时支持中文和英文内容。
- 默认提供搜索、深色模式、分类、标签、归档和增强 Markdown。

#### 适用场景

个人博客、项目文档与轻量知识库都可以从同一套内容结构开始。

## 定制入口

站点信息在 `site.config.mjs`，文章在 `content/`，样式在 `theme/styles/`。如果不需要评论、浏览量或点赞，不配置对应服务即可。
