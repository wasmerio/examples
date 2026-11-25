---
weight: 8
title: "主题文档 - music Shortcode"
date: 2020-03-03T12:29:59+08:00
lastmod: 2020-03-03T12:29:59+08:00
draft: false
author: "Dillon"
authorLink: "https://dillonzq.com"
description: "music shortcode 基于 APlayer 和 MetingJS 库提供了一个内嵌的响应式音乐播放器."
images: []
resources:
- name: "featured-image"
  src: "featured-image.png"

tags: ["shortcodes"]
categories: ["documentation"]

hiddenFromHomePage: true
---


`music` shortcode 基于 [APlayer](https://github.com/MoePlayer/APlayer) 和 [MetingJS](https://github.com/metowolf/MetingJS) 库提供了一个内嵌的响应式音乐播放器.

<!--more-->

有三种方式使用 `music` shortcode.

## 1 自定义音乐 URL {#custom-music-url}

{{< version 0.2.10 >}} 支持[本地资源引用](../theme-documentation-content#contents-organization)的完整用法.

`music` shortcode 有以下命名参数来使用自定义音乐 URL:

* **server** *[必需]*

    音乐的链接.

* **type** *[可选]*

    音乐的名称.

* **artist** *[可选]*

    音乐的创作者.

* **cover** *[可选]*

    音乐的封面链接.

一个使用自定义音乐 URL 的 `music` 示例:

```markdown
{{</* music url="/music/Wavelength.mp3" name=Wavelength artist=oldmanyoung cover="/images/Wavelength.jpg" */>}}
```

呈现的输出效果如下:

{{< music url="/music/Wavelength.mp3" name=Wavelength artist=oldmanyoung cover="/images/Wavelength.jpg" >}}

