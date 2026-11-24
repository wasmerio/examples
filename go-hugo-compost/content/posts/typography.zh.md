---
title: 中文网页排版样例
date: 2021-11-16T00:00:00.000Z
draft: false
description: 参考赫蹏项目调整后的中文正文内容样式，支持深色模式。
tags:
    - markdown
    - css
    - sample
    - tailwindcss
    - typography
    - demo
    - javascript
series:
    - Samples
---


{{< lead >}}
参考赫蹏项目调整后的中文正文内容样式，支持深色模式。
{{< /lead >}}

## 一、样式基础

### 赫蹏

[赫蹏](https://github.com/sivan/heti)（hètí）是专为中文内容展示设计的排版样式增强。它基于通行的中文排版规范而来，可以为网站的读者带来更好的文章阅读体验。

主要特性：

- 贴合网格的排版；
- 全标签样式美化；
- 预置古文、诗词样式；
- 预置多种排版样式（行间注、多栏、竖排等）；
- 多种预设字体族（仅限桌面端）；
- 简/繁体中文支持；
- 自适应黑暗模式；
- 中西文混排美化，不再手敲空格 👏（基于 JavaScript 脚本）；
- 全角标点挤压（基于 JavaScript 脚本）；
- 兼容 _normalize.css_、_CSS Reset_ 等常见样式重置；
- 移动端支持；
- ……

### Tailwindcss Typography

The `@tailwindcss/typography` plugin adds a set of prose classes that can be used to quickly add sensible typographic styles to content blocks that come from sources like markdown or a CMS database.

## 二、测试样式

{{<alert>}}
使用注意：第一，一、二、三级标题增加了字间距，尽量不要包含英文（只是缩写则问题不大）。
第二，建议手动添加中西文之间的空格。因为没有使用 js，所以不支持**自动进行中西文混排美化和标点挤压**。
{{</alert>}}

### 段落文字样式（三级标题）

