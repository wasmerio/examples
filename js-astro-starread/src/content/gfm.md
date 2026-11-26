---
title: GFM语法
categories: [主题介绍]
cover: /cover/20e6c8ef356dd961.avif
description: Markdown语法
date: 2026-06-30 12:58:33
---

Astro 原生支持Markdown基本用法，具体如下：

## 列表

### 任务列表

- [x] 支持 task list
- [ ] 还没完成

### 有序列表

1. 有序列表项 1
2. 有序列表项 2
3. 有序列表项 3

### 无序列表

- 无序列表项 1
- 无序列表项 2
- 无序列表项 3

## 表格

| 字段 | 值 |
| --- | --- |
| 版本 | Tailwind v4 |
| 插件 | @tailwindcss/typography |

## 删除线

~~被删除的文本~~

## 脚注

这里有脚注[^1]。

## 代码

```javascript
console.log(' fenced code 支持高亮按你的主题来 ');
```

## alert

> [!NOTE]
> 这是备注内容

> [!TIP]
> 这是提示内容。

> [!IMPORTANT]
> 这是重要内容。
> 支持**换行**


> [!WARNING]
> 这是警告内容。

> [!CAUTION]
> 这是危险内容，它比警告更严重。
