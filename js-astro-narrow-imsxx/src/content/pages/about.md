---
title: "关于"
summary: "关于这个站点、这套主题，以及我平时折腾的东西。"
links:
  - name: "GitHub"
    url: "https://github.com/imsxx"
    description: "代码和一些零散的工具项目。"
    icon: "github"
  - name: "hugo-narrow"
    url: "https://github.com/tom2almighty/hugo-narrow"
    description: "本主题的上游项目，AGPL-3.0 协议。"
    icon: "link"
  - name: "Astro"
    url: "https://astro.build"
    description: "这个移植版本使用的框架。"
    icon: "globe"
---

这里用来放站点说明。`src/content/pages/about.md` 是内容来源，改这个文件就能改本页。

## 关于主题

astro-narrow 是 [hugo-narrow](https://github.com/tom2almighty/hugo-narrow) 的 Astro 移植版。功能与视觉跟随上游，实现方式按 Astro 的习惯重写：

- 配置用 Zod 校验，字段写错会在构建时失败
- 数学公式在构建时渲染成静态 HTML，不依赖客户端脚本
- 代码高亮用 Shiki 双主题，复用上游的代码块样式
- shortcode 换成 MDX 组件，参数有类型

## 技术栈

| 层 | 选择 |
| --- | --- |
| 框架 | Astro 7 |
| 样式 | Tailwind CSS 4 |
| 内容 | Content Collections（Markdown / MDX） |
| 高亮 | Shiki |
| 数学 | KaTeX（构建时） |
| 图表 | Mermaid（按需加载） |

正文支持标题、列表、表格、代码块、引用、公式和图表。下面这段用来验证排版：

> 好的排版应该让人忘记排版本身的存在，只记得读到了什么。
