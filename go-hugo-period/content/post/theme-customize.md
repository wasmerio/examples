---
title: "主题定制：设计令牌与样式"
slug: "theme-customize"
date: 2024-11-15
description: "SCSS 设计令牌全量说明与修改方法：配色、字号、间距、断点；换 logo、切换字体、改界面文案。"
featured: "images/covers/theme-customize.svg"
categories: ["设计"]
tags: ["主题", "定制", "scss"]
author: "Period"
---


所有视觉属性都收敛在 `themes/period/assets/scss/_variables.scss` 这一个文件里——改颜色、
字号、间距、断点不需要碰任何规则文件。

## 设计令牌全量说明

```scss
// ---- Colors（对应设计文档 §1.2）----
$c-page:              #EDEDED;   // 页面背景
$c-text:              #333333;   // 正文 / 链接 / 标题
$c-text-hover:        #757575;   // 正文链接悬停
$c-header:            #333333;   // 页眉 / 页脚背景
$c-header-text:       #FFFFFF;   // 页眉 / 菜单文字
$c-header-text-hover: #D4D4D4;   // tagline、页眉链接悬停
$c-credit:            #242424;   // credit 条 / 归档标题 / 菜单选中态
$c-card:              #FFFFFF;   // 卡片背景
$c-card-shadow:       rgba(58,58,58,0.2);
$c-input-bg:          #F7F7F7;   // 输入框 / 代码背景
$c-input-border:      #D4D4D4;   // 输入框描边
$c-muted:             #666666;   // 次要文字

// ---- Typography ----
$font-family: "Roboto", "Open Sans", sans-serif;
$font-light: 300;  $font-regular: 400;  $font-bold: 700;
$fs-base: 16px;
$lh-base: 1.5;

// ---- Layout ----
$max-width:      1300px;         // 页面最大宽度
$header-overlap: 5.25em;         // 内容上叠压头高度（签名特征）
$page-gutter:    5.5556%;        // 页面左右留白
$col-main: 62.5005%;  $col-side: 34.375275%;  $col-gap: 3.125025%;

// ---- Breakpoints（对应原主题媒体查询）----
$bp-600:  37.5em;   // 600px
$bp-900:  56.25em;  // 900px
$bp-1100: 68.75em;  // 1100px
```

