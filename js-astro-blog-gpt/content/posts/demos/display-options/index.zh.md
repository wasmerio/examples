---
title: '正文显示：只留下你需要的内容'
slug: 'display-options'
date: 2026-08-26
description: '按篇设置标题、作者、日期、阅读时间、标签与分享等信息。'
categories: ['writing']
tags: ['design']
updated: '2026-10-16'
---

文章页可以按需展示标题、作者、日期等信息。全局设置放在 `article.display`，单篇设置写在 frontmatter 的 `display` 中。

## 选择显示的信息

| 字段          | 显示内容         |
| ------------- | ---------------- |
| `title`       | 标题、简介和分类 |
| `author`      | 作者             |
| `published`   | 发布时间         |
| `readingTime` | 估算阅读时间     |
| `updated`     | 最后更新时间     |
| `tags`        | 底部标签         |
| `share`       | 分享按钮与浮窗   |
| `navigation`  | 上一篇和下一篇   |

这些设置默认全部开启。最后更新时间在填写 `updated` 且与发布时间不同时，显示在正文底部。

## 单篇调整

例如，某篇文章只想隐藏作者和阅读时间：

```yaml
display:
  author: false
  readingTime: false
```

其余字段沿用全局设置。单篇填写 `true` 或 `false` 都会覆盖全局默认值。

## 独立页面

[关于 BlogGPT](../../about/)等独立页面也可以设置标题、作者、日期、阅读时间、更新时间和分享。每个页面都可以选择适合自己的展示方式。

正文增强的设置见[增强开关](../enhancement-overrides/)，发布状态见[发布与迁移](../migration/)。
