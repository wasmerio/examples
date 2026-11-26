---
title: 从 Broadsheet 开始搭建你的博客
description: 一份五分钟上手指南：安装依赖、修改站点信息、发布第一篇文章。
date: 2026-09-01
tags:
  - Broadsheet
  - Astro
  - 快速开始
cover: https://picsum.photos/id/1015/1400/900
---

Broadsheet 是一个报刊式排版的 Astro 博客模板。它把首页做成一个版面：一条头条、三篇近期文章，右侧是作者信息与标签导航。你要做的只是替换内容。

## 一、装好依赖，跑起来

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:4321` 就能看到当前这个站点。开发服务器默认监听所有网卡，同一局域网内的手机也可以直接访问调试移动端布局。

## 二、改掉站点信息

所有品牌相关的文字都集中在 `src/consts.ts`，不需要翻组件：

```ts
export const SITE: Site = {
  TITLE: "你的站点名",
  WORDMARK: "你的站点名",
  DESCRIPTION: "一句话介绍这个博客。",
  TAGLINE: "页脚和侧栏展示的短句。",
  LOCALE: "zh-CN",
  AUTHOR: {
    NAME: "你的名字",
    INITIALS: "XY",
    ROLE: "全栈工程师",
    SLOGAN: "记录技术、实践与持续学习。",
  },
};
```

同一个文件里还能改导航项（`NAV_LINKS`、`FOOTER_LINKS`）和侧栏的技术栈（`STACK`）。把 `STACK` 设为空数组，那个区块就会自动隐藏。

## 三、写第一篇文章

在 `src/content/blog/` 下新建一个目录，放一个 `index.md`：

```
src/content/blog/
└── my-first-post/
    └── index.md
```

目录名就是文章链接，这篇文章的地址是 `/blog/my-first-post`。用目录而不是单文件的好处是，文章用到的图片可以放在同一个目录里就近管理。

## 四、部署前的三件事

1. 复制 `.env.example` 为 `.env`，把 `SITE_URL` 改成你的域名，RSS 与 sitemap 依赖它生成绝对地址。
2. 替换 `public/favicon.svg`，以及示例文章 frontmatter 里的 `cover` 占位图。
3. 删掉 `src/content/` 下的示例文章和示例项目，换成你自己的内容。

剩下的部分——搜索、RSS、深浅色主题、标签归档、目录导航——已经接好了，不用额外配置。
