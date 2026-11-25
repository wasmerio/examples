---
title: "提示框的语义类型与语法"
date: 2026-05-04
description: "介绍Chaos主题支持的提示框类型：NOTE、TIP、IMPORTANT、WARNING、CAUTION、HISTORICAL、DISCLAIMER与可折叠的DETAILS，以及自定义标题与多语言适配。"
categories: ["指南"]
tags: ["Chaos", "Markdown", "提示框"]
series: "Chaos 主题指南"
---


Chaos支持[GitHub风格的提示框语法](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts)，标题文字会随站点语言自动本地化，并配有对应的图标与底色。除通用的五种类型外，主题还扩充了面向技术归档与免责声明的语义类型。

<!--more-->

只需在引用块（`>`）的第一行声明类型关键词即可（因为定义列表的术语行不支持嵌入块级引用与代码块，以下逐一将源码写法与渲染效果穿插对照）。

## 标准提示框类型

### `NOTE`

```markdown
> [!NOTE]
> 供浏览时参考的背景信息与补充说明。
```

> [!NOTE]
> 供浏览时参考的背景信息与补充说明。

### `TIP`

```markdown
> [!TIP]
> 有助于提高操作效率的使用技巧与建议。
```

> [!TIP]
> 有助于提高操作效率的使用技巧与建议。

### `IMPORTANT`

```markdown
> [!IMPORTANT]
> 达成目标所必须了解的关键步骤或必要前提。
```

> [!IMPORTANT]
> 达成目标所必须了解的关键步骤或必要前提。

