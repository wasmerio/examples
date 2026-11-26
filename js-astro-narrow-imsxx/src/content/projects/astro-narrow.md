---
title: "astro-narrow"
description: "hugo-narrow 的 Astro 移植版，用 Astro 原生能力重写。"
summary: "把 hugo-narrow 的功能与视觉搬到 Astro，配置、内容集合和高亮都按 Astro 的方式重做。"
date: 2026-10-22T12:00:00+08:00
link: "https://github.com/imsxx/astro-narrow"
tags: ["Astro", "Tailwind", "主题"]
featured: true
---

把 hugo-narrow 的页面结构、配色体系和交互逐项搬到 Astro。功能对齐，实现重写。

## 做了什么

- 组件化：93 个 Go 模板重组为 Astro 组件
- 配置校验：站点配置用 Zod 定义，字段错误在构建期暴露
- 数学公式构建时渲染，不再依赖客户端脚本
- 代码高亮换成 Shiki 双主题，复用上游的代码块样式
- shortcode 换成 MDX 组件，参数带类型

## 维护方式

仓库内保留上游快照，`PORTING.md` 记录每个文件的去向和状态（直搬 / 重写 / 替代）。上游发版时按层同步，大版本重构不硬跟。
