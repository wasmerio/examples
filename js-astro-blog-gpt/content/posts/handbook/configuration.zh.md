---
title: '配置与扩展：定制你的站点'
slug: 'configuration'
date: 2026-08-15
description: '调整外观、文案、导航、分享与统计，并添加自己的样式和脚本。'
categories: ['customization']
tags: ['astro', 'design']
updated: '2026-10-16'
---

通过 `blog.config.ts` 调整站点的外观、内容和交互；友链在 `friends.config.ts` 中管理。需要自定义样式或脚本时，可以使用 `custom/` 下的扩展文件。

## 站点与说明文字

`site` 设置站名、生产地址、语言和时区；`author` 设置名字、介绍、头像与社交链接。首页标题、搜索提示和页脚说明集中在 `text` 中。

这些展示文字支持普通字符串或多语言对象：

```ts
author: {
  name: { zh: '站点作者', en: 'Site author' },
  bio: {
    zh: '记录日常与想法。',
    en: 'Notes from everyday life.',
  },
}
```

通过 `site.locales` 选择内容语言，缺少对应界面译文时自动回退。社区翻译者在 `src/i18n/` 添加译文，并在同目录的 `i18n.config.ts` 注册，一同贡献到仓库。

## 外观

```ts title="blog.config.ts"
appearance: {
  defaultTheme: 'system',
  pageTransition: 'fade',
  codeThemes: { light: 'github-light', dark: 'github-dark' },
  showCodeLineNumbers: false,
  categoryCoverStyle: 'thumbnail',
}
```

可以选择浅色、深色或跟随系统外观，设置正文过渡与代码主题。分类卡片支持缩略图、右侧渐隐和完整背景三种封面样式，单个分类可用 `coverStyle` 调整。

## 导航、页脚与友链

`sidebar.items` 设置侧栏导航，`sidebar.menu` 设置左上角站名菜单。条目可以打开内置功能页、独立页面或外部链接。内置功能页绑定 `page` 后，其标题、简介和介绍正文由对应的 pages 内容决定。

`footer` 设置起始时间、版权作者、内容许可与主题署名。友链支持分组、头像、简介与搜索。

## 分享与统计

`sharing.copyFormat` 设置复制的分享文字，`sharing.platforms` 设置社交平台的名字、图标与链接。可用 `{title}`、`{description}`、`{author}`、`{blog}`、`{url}` 等占位符。

`article.shareCover` 设置 Satori 自动分享封面的尺寸、颜色与字体。`statistics` 可以分别控制统计数字、发文热力图和文章字数柱状图。

## 全站扩展

| 文件                     | 用途                         |
| ------------------------ | ---------------------------- |
| `custom/head.html`       | 在 head 中添加内容           |
| `custom/body-start.html` | 在 body 开头添加内容         |
| `custom/body-end.html`   | 在 body 末尾添加内容         |
| `custom/styles.css`      | 自定义样式                   |
| `custom/client.ts`       | 页面加载时运行脚本并处理清理 |
| `custom/components/`     | 多篇文章共用的 MDX 组件      |

完整字段、默认值与使用示例见[主题文档](https://bloggpt.reincarnatey.net/config/reference)。
