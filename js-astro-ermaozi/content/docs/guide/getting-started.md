---
title: 零基础快速开始
description: 不需要修改主题源码，用配置文件和 Markdown 在十分钟内搭建博客。
permalink: /docs/guide/getting-started/
type: doc
group: 指南
order: 5
badge: 开始
createTime: 2026-08-07
tags: [入门, 配置, Astro]
---

# 零基础快速开始

日常搭建博客只需要接触两个位置：`site.config.mjs` 管站点，`content/` 管文章。不要修改 `theme/`，以后更新主题会更轻松。

## 1. 准备环境

安装 [Node.js 22.12 或更高版本](https://nodejs.org/)，再准备一个文本编辑器。Windows、macOS 和 Linux 都可以使用。

## 2. 创建并打开站点

任选一种已经安装的包管理器：

```sh
npm create astro-theme-ermaozi my-blog
pnpm create astro-theme-ermaozi my-blog
yarn create astro-theme-ermaozi my-blog
```

向导可选择简体中文或 English 作为站点根语言；启用多语言时，另一种语言会自动放到 `/en/` 或 `/zh/`，无需手动移动内容或修改永久链接。

进入项目并启动预览：

```sh
cd my-blog
npm run dev
```

使用 pnpm 时运行 `pnpm dev`，使用 Yarn 时运行 `yarn dev`。终端会显示本地网址，通常是 `http://localhost:4321/`；修改配置或 Markdown 后会自动刷新。

## 3. 只改这六处配置

打开 `site.config.mjs`。编辑器会根据 `defineSiteConfig()` 提示可用字段，写错常见字段时 `npm run check` 会直接指出位置。

1. `origin`：最终域名，例如 `https://blog.example.com`。
2. `logo`：Logo 文件地址，例如 `/img/logo.svg`。
3. `profile`：头像、简介、所在地和资料卡位置。
4. `locales.zh-CN.siteName`：站名。
5. `locales.zh-CN.description`：站点说明。
6. `social`：GitHub 等社交链接；不需要时写成 `social: []`。

先保留其余默认值，站点已经可以使用。导航、搜索、分页、外观、评论和增强 Markdown 的全部选项见[站点配置](/docs/guide/configuration/)。

### 只做中文站

删除 `site.config.mjs` 中完整的 `'en-US': { ... }` 配置块，再删除 `content/en/`。只剩一种语言时不会显示语言切换入口。删除文件前建议先复制整个项目作为备份。

## 4. 发布第一篇文章

在 `content/blog/` 下新建 `hello.md`，粘贴以下内容：

```md
---
title: 我的第一篇文章
description: 这篇文章介绍我的新博客。
permalink: /blog/hello/
createTime: 2026-08-07
tags: [随笔]
type: post
---

# 我的第一篇文章

这里开始写正文。
```

保存后刷新浏览器即可看到文章。分类来自文件夹，例如 `content/blog/教程/hello.md` 会自动进入“教程”分类。图片放在 `public/img/`，Markdown 中写 `![说明](/img/photo.webp)`。

## 5. 调整导航

每种语言都有自己的 `navbar`（旧字段 `navigation` 仍兼容）。最常用的单层链接如下：

```js
navbar: [
  { text: '博客', link: '/blog/', icon: 'home' },
  { text: '关于', link: '/about/', icon: 'info' },
]
```

导航可以使用普通链接、下拉菜单、Iconify 图标和徽章；复制现有项目里的写法再替换文字与链接最安全。

## 6. 发布前检查

```sh
npm run validate
```

检查通过后会生成 `dist/`。创建时选择的平台配置可以自动发布，也可以把 `dist/` 交给任意静态托管平台；详见[部署站点](/docs/guide/deployment/)。

## 常见问题

- **开发时搜索不到新文章**：开发服务器不生成 Pagefind 索引，改用 `npm run build && npm run preview` 验收搜索。
- **页面地址重复或失效**：确保每篇文章的 `permalink` 唯一，并以 `/` 开头和结尾。
- **图片不显示**：文件应放在 `public/`，引用路径不要写 `public`，例如 `/img/photo.webp`。
- **配置后白屏**：先运行 `npm run check`，根据文件名和行号修正缺失的逗号、引号或括号。
- **不需要评论或统计**：保持 `features` 中对应开关为 `false`，纯静态博客不需要后端。

下一步可以阅读[内容能力](/docs/guide/content/)；需要深入定制的开发者再查看[公共 API 与样式定制](/docs/guide/api/)。
