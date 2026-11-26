---
title: 改外观，但别把它改坏
description: 强调色、暗色模式、字体和间距，各自在哪个文件里。
date: 2026-11-14
cover: /og/posts/zh/customize-the-look.png
coverAlt: 改外观，但别把它改坏
tags: [设计]
categories: ['设计']
lang: zh
---

Inkfolio 是故意做得素的：暖纸白背景、近黑正文、一个强调色、系统字体、零 webfont 请求。这是设计决定，不是没做完。

## 强调色

`site.config.yaml` 里一行：

```yaml
theme:
  accent: '#ff6b01'
```

它喂给 CSS 变量 `--accent` 和 `--u`，控制链接、波浪下划线和当前菜单项。暗色模式用同一个值；如果颜色在暗底上太沉，换一个亮一点的，或者在 `src/styles/global.css` 里覆盖：

```css
:root[data-theme='dark'] {
  --accent: #ff7b1a;
  --u: #ff7b1a;
}
```

## 字体

字体栈只在 `src/styles/global.css` 顶部定义一次，变量是 `--font` 和 `--mono`。两个都快的选择：

1. 就用系统字体栈，瞬间渲染，在每个系统上都像原生。
2. 自托管字体：`.woff2` 放 `public/fonts/`，加一段 `@font-face`，把 `--font` 指过去。别加 Google Fonts 的 `<link>`——每页多一次连接，还把访客 IP 送给第三方。

## 间距和宽度

内容列宽由 `--max-w` 控制（外壳 880px，正文 632px），都是同一个文件顶部的 CSS 变量。调宽了长文就更难读，这是取舍不是 bug。

## 暗色模式

导航栏有切换按钮，选择存在 `localStorage` 的 `inkfolio-theme`。`defaultMode: auto` 时首次访问跟随系统。主题在页面绘制前就应用，所以暗色用户不会看到白屏闪一下。

## 别动的地方

正文内联链接的波浪下划线是这个主题唯一的花招，而且**常驻可见**——只在 hover 时才出现的样式，在触屏上等于没有。
