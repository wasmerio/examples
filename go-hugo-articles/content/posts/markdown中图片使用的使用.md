---
title: markdown中如何插入图片
date: 2024-12-09T14:45:55+0800
description: "本文详细介绍了markdown中如何插入图片的方法。"
tags: [markdown]
---

# 前言
基于hugo渲染的markdown文档中，图片的插入有两种方法：原始markdown插入图片和使用hugo的shortcode。目前，我只对原始markdown插入图片的方法进行渲染，hugo的shortcode插入图片的方法没有适配。

# 使用原始markdown插入图片

Markdown支持插入图片，语法为`![图片描述](图片URL)`。

例如：
```markdown
![home](https://raw.githubusercontent.com/henglgh/hugo-articles/refs/heads/main/images/merged.jpg "主页")
```

例如：![home](https://raw.githubusercontent.com/henglgh/hugo-articles/refs/heads/main/images/merged.jpg "主页")

图片前后都有文字时，在渲染过程中，把图片元素单独抽离出来，不与文字混在一起。

