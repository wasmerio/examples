---
title: "你好，Chaos"
date: 2026-09-12
description: "Chaos主题功能速览：设计理念、基础配置与系列指南索引。"
categories: ["指南"]
tags: ["Chaos", "Hugo", "入门"]
series: "Chaos 主题指南"
---


Chaos是一个专为个人博客设计的极简[Hugo](https://gohugo.io/)主题：不依赖前端脚本框架，
仅用轻量原生脚本提供外观模式切换、自动目录、代码与标题链接复制、
即时页面导航以及针对中文排版的细致处理。

<!--more-->

## 设计理念

主题配色源自[日本传统色](https://zh.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E4%BC%A0%E7%BB%9F%E8%89%B2%E7%B3%BB)（[和色]^(wairo)）：日间以[]{#FBFAF5}[**生成り色**]{きなりいろ}为纸底、[]{#2B2B2B}[**黒**]^(kuro)与[]{#595857}[**墨**]^(sumi)为字墨，
辅以[]{#9E3D3F}[**蘇芳**]{すおう}与[]{#165E83}[**藍色**]{あいいろ}作为强调与链接色；夜间则采用沉静的[暖炭底色]{#151514}，配以[]{#DCDDDD}[**白鼠**]^(shiro-nezumi)、[]{#D69090}[**退紅**]^(arazome)与[]{#84B9CB}[**浅縹**]^(asa-hanada)。
兼顾素雅纸张质感与[WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)规定的色彩对比度要求。

> [!TIP]
> 点击右上角的🌓按钮，可以在「跟随系统/浅色/深色」三种模式之间切换。

## 基础配置

在站点的`hugo.toml`中，建议配置以下基础字段：

```toml
theme = 'chaos'
baseURL = 'https://example.org/'
locale = 'zh-cn'
defaultContentLanguage = 'zh-cn'
title = '混沌札记'

# 必须启用：让 Hugo 按字符统计中文字数并正常截断摘要
hasCJKLanguage = true

[outputs]
  home = ['HTML', 'ATOM', 'sitemapxsl', 'RSS', 'feedxsl', 'REDIR']
  section = ['HTML']
  taxonomy = ['HTML']
  term = ['HTML']

# 解析期折叠中文段落内的软换行，避免源码折行变成多余空格
[markup.goldmark.extensions.cjk]
  enable = true
