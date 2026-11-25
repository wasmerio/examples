---
weight: 10
title: "主题文档 - typeit Shortcode"
date: 2020-03-03T10:29:59+08:00
lastmod: 2020-03-03T10:29:59+08:00
draft: false
author: "Dillon"
authorLink: "https://dillonzq.com"
description: "typeit shortcode 基于 TypeIt 库提供了打字动画."
images: []
resources:
- name: "featured-image"
  src: "featured-image.png"

tags: ["shortcodes"]
categories: ["documentation"]

hiddenFromHomePage: true
---


`typeit` shortcode 基于 [TypeIt](https://typeitjs.com/) 库提供了打字动画.

<!--more-->

只需将你需要打字动画的内容插入 `typeit` shortcode 中即可.

`typeit` shortcode 有以下命名参数:

* **tag** *[可选]*

    包裹打字内容的 HTML 标签, 默认值是 `div`.

* **class** *[可选]*

    添加到打字元素上的额外 CSS 类名.

* **code** *[可选]*

    用于高亮内容的代码语言, 参见[代码内容](#code-content).

* **code-link** *[可选]*

    仅与 `code` 一起使用. 启用后, 高亮代码的某个词法单元 (例如注释或字符串) 中以 `[文本](链接)` 形式书写的内容会被渲染为可点击的链接.

* **group** *[可选]*

    分组名称, 同一分组的内容会依次开始打字动画, 参见[分组内容](#group-content).

## 1 简单内容 {#simple-content}

允许使用 `Markdown` 格式的简单内容, 并且 **不包含** 富文本的块内容, 例如图像等等...

一个 `typeit` 示例:

```markdown
{{</* typeit */>}}
这一个带有基于 [TypeIt](https://typeitjs.com/) 的 **打字动画** 的 *段落*...
{{</* /typeit */>}}
