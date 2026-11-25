---
title: "站点与导航"
description: "site.ts 中的站点信息、导航链接、首页区块和分页。"
date: 2026-06-27
order: 1
tags: ["指南", "配置"]
toc: true
---

`src/config/site.ts` 是大多数站点唯一需要修改的文件。

## 站点信息

```ts
export const siteConfig = {
  name: 'Astro Narrow',
  shortName: 'Narrow',
  description: '一个内容优先的 Astro 主题。',
  contentWidth: '56rem',
  author: {
    name: '你的名字',
    title: { en: 'A line under your name', 'zh-cn': '名字下的一句话' },
    description: { en: '…', 'zh-cn': '…' },
    avatar: '/avatar.png',
    social: [
      { name: 'GitHub', url: 'https://github.com/you', icon: 'simple-icons:github' },
      { name: 'Email', url: 'mailto:you@example.com', icon: 'lucide:mail' }
    ]
  }
}
```

`author` 用于首页个人卡片。`contentWidth` 是默认栏宽,访客可以在 Dock 中调整。

## 导航

`nav` 渲染在 Dock 的菜单面板中。条目可以是注册路由 id(`posts`、`projects`、`archives`),也可以是内联链接;内联链接支持内部路径与外部 URL:

```ts
nav: [
  'posts',
  'projects',
  'archives',
  { label: 'GitHub', href: 'https://github.com/', icon: 'simple-icons:github' },
  { label: { en: 'About', 'zh-cn': '关于' }, href: '/about/' }
]
```

`label` 可以是字符串或按语言的对象;`icon` 可选。外部 URL 在新标签页打开并带一个小箭头标记。

## 首页与分页

```ts
home: {
  recentPosts: { enabled: true, limit: 3 }
},
list: {
  pageSize: 10
}
```

首页展示个人卡片与最近文章。`/posts/` 按 `pageSize` 分页,第二页起位于 `/posts/page/2/`。

## 评论与统计

在 `comments` 块中填入你的 [giscus](https://giscus.app) 仓库参数并设置 `enabled: true`;`analytics` 以同样方式配置 Umami。未启用时两者都不会加载。
