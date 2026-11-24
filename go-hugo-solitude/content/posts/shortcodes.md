---
title: Solitude Hugo Shortcode 使用指南
date: 2026-08-22T10:00:00+08:00
lastmod: 2026-08-25T10:00:00+08:00
slug: shortcode-showcase
description: 从基本写法、参数说明到实际效果，系统了解 Solitude Hugo 内置 shortcode。
cover: /img/demo/cover-shortcodes-v2.webp
categories: [内容组件]
tags: [Shortcode, Markdown, Hugo]
series: [官方示例]
recommend: true
toc: true
comment: true
locate: 组件示例
---


Shortcode 是 Hugo 在 Markdown 之外提供的内容组件语法。Solitude 用它承载提示框、标签页、图库、图表等富内容；迁移旧文章时，也应把 Hexo 外挂标签改写为对应的 Hugo shortcode。

{{< note type="info" >}}
本文既是使用手册，也是可构建的效果页。每个组件都按 **用途 → 写法 → 参数 → 效果** 展开，代码可以直接复制到 Markdown 文件中。
{{< /note >}}

## 开始之前

Hugo shortcode 有两种边界符：`{{</* shortcode */>}}` 适合普通参数，`{{%/* shortcode */%}}` 会先处理内部 Markdown。Solitude 的块级组件已经按各自用途处理正文，通常直接使用尖括号写法即可。

| 内容类型 | 推荐组件 | 适合场景 |
| --- | --- | --- |
| 行内强调 | `span`、`label`、`keyboard` | 一句话中的状态、术语或快捷键 |
| 块级提示 | `note`、`subnote`、`fold` | 说明、警告、补充资料 |
| 导航与引用 | `button`、`link`、`card` | 行动入口、站内外资源 |
| 结构化内容 | `tabs`、`timeline`、`gallery`、`series` | 分组、步骤、图片与文章集合 |
| 动态内容 | `mermaid`、`chartjs`、`typeit` | 流程、数据与动态文字 |

{{< note type="warning" style="simple" >}}
Shortcode 名称和参数区分大小写。块级组件还要成对书写结束标签，否则 Hugo 会在构建阶段直接报错。
{{< /note >}}

## 文本与状态

### 彩色文本与标签

`p` 用于整段文字，`span` 用于行内文字，`label` 用于短小的状态标记。颜色参数可使用 `blue`、`green`、`orange`、`red`、`purple` 等主题色名称。

**写法**

```go-html-template
{{</* p color="blue" */>}}这是一段蓝色文字{{</* /p */>}}
正文中的 {{</* span color="red" */>}}重点文字{{</* /span */>}}
{{</* label color="green" */>}}已完成{{</* /label */>}}
```

**效果**

