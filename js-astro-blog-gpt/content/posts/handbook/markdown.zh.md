---
title: 'Markdown 排版：文字、表格与代码'
slug: 'markdown'
date: 2026-09-17
description: '查看文字、链接、列表、表格、代码与图片的排版效果。'
categories: ['writing']
tags: ['markdown']
image: '/images/covers/writing-typography.webp'
---

Markdown 提供文字、列表、表格和代码等基础排版。下面可以直接查看它们在正文中的效果。

## 文字与链接

使用**粗体**、_斜体_、~~删除线~~与 `行内代码`。

链接可以指向[站内文章](../welcome/)，也可以指向 [Astro 官方文档](https://docs.astro.build/)这样的外部页面。

## 列表

### 有序与无序列表

1. 写出具体问题。
2. 用例子说明过程。
3. 给结论附上来源。

- 苹果
- 香蕉
- 橘子

### 任务列表

- [x] 完成正文
- [x] 检查内部链接
- [ ] 在窄屏下通读一次

## 引用与分隔

> 支持引用文字，
>
> > 以及嵌套引用。

支持分割线。

---

## 表格

| 内容     |   语法    |     用途 |
| :------- | :-------: | -------: |
| 标题     | `## 标题` | 组织章节 |
| 引用     | `> 文字`  | 补充说明 |
| 行内代码 |  反引号   | 标记变量 |

宽表格可以在表格区域横向滚动。

## Expressive Code 代码块

```ts title="greeting.ts" {2,5}
type Reader = { name: string };
const reader: Reader = { name: 'BlogGPT' };

function greeting({ name }: Reader) {
  return `Hello, ${name}!`;
}
```

```sh title="Terminal"
pnpm check
pnpm build
```

代码块支持语法高亮、文件名、行标记和复制。深浅色主题与行号可在 `appearance` 中设置。

## 图片

![青蓝色水彩晕染](/images/illustrations/blue-flow.webp)

图片使用 `![说明](路径)` 插入，文件管理与附件见[内容组织](../content-bundle/)。公式、图表和交互组件见[文章增强](../article-enhancements/)。
