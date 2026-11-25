[English](README.md) 丨 简体中文

# Astro Solitude

简洁、优雅、功能丰富的 Astro 博客主题。

支持静态页面、Markdown / MDX、明暗模式、内容组件、本地搜索、订阅、评论和跨页面音乐胶囊。

[使用此模板](https://github.com/everfu/astro-solitude/generate) · [快速开始](#快速开始) · [问题反馈](https://github.com/everfu/astro-solitude/issues)

## 快速开始

### 1. 获取项目

准备 Node.js **22.12.0+** 与 pnpm，pnpm 版本以 [package.json](package.json) 的 `packageManager` 为准。

点击 [Use this template](https://github.com/everfu/astro-solitude/generate) 创建自己的独立仓库，再使用自己的账号和仓库名称克隆副本。

```sh
git clone https://github.com/YOUR_NAME/my-blog.git
cd my-blog
pnpm install --frozen-lockfile
pnpm dev
```

打开终端提示的本地地址，即可预览主题与示例内容。

### 2. 配置站点

编辑 [`site.config.ts`](site.config.ts)，设置站点地址、标题、作者、导航和主题选项。

```ts
import { defineSolitudeConfig } from './src/config';

export default defineSolitudeConfig({
  site: 'https://example.com',
  title: '我的博客',
  description: '记录生活，分享所见。',
  locale: 'zh-CN',
  author: { name: '你的名字' },
});
```

部署在子目录时，另外设置 `base`，例如 `base: '/blog/'`。

模板保留示例文章和特色页面，本地搜索开箱即用。评论、评论聚合和音乐馆默认关闭，服务标识为空。音乐胶囊已启用示例汽水音乐歌单。可以替换 `theme.capsule.id`，或设置 `theme.capsule.enable: false` 关闭。发布前替换示例内容、头像和站点信息。界面语言设置不会自动翻译文章或自定义导航。

### 3. 开始写作

在 `src/content/posts/` 中添加文章，下面的示例可保存为 `hello-world.md`。

```md
---
title: 你好，世界
date: 2026-09-11
description: 我的第一篇文章。
tags: [生活]
---

从这里开始记录。
```

默认文章地址为 `/p/hello-world/`。可以通过 `slug`、`url` 和 `aliases` 调整地址。`draft: true` 用于草稿，`home: false` 可从首页各区域隐藏文章，同时保留归档、搜索、RSS 与直接访问。

### 4. 构建与部署

```sh
pnpm build
pnpm preview
```

将生成的 `dist/` 目录发布到托管平台。构建命令为 `pnpm build`，输出目录为 `dist`。安装依赖时可使用 `pnpm install --frozen-lockfile`。

## 图标与页面数据

图标使用本地 Iconify 图集，通过 Astro Icon 构建为 SVG。导航、个人信息和 MDX 组件的图标参数使用 `lucide:book-open`、`simple-icons:github` 这样的名称。可以在 [Lucide](https://icon-sets.iconify.design/lucide/) 和 [Simple Icons](https://icon-sets.iconify.design/simple-icons/) 中查找图标。

```mdx
<Button url="/archives/" text="阅读文章" icon="lucide:book-open" />
```

仅含图标的按钮通过 `label` 提供操作名称。

站点名称的图标模式使用 `theme.site.name: { class: 'icon', custom: 'simple-icons:astro' }`。

编辑 `src/data/` 中的 `about.ts`、`links.ts`、`kit.ts` 和 `brevity.ts`，维护关于、友链、设备和短动态页面。每份数据通过 `satisfies` 校验，支持注释和多行文本。

```ts
import type { AboutData } from '@/types/about';

export default {
  title: '关于我',
  sections: [{ type: 'story', title: '我的故事', content: '从这里介绍自己。' }],
} satisfies AboutData;
```

自定义数据可以保存为 `src/data/profile.ts`，并在页面前置信息中设置 `type: about` 和 `data: profile`。`pnpm check` 会检查数据类型，构建时会报告缺失的数据文件。

## 常用命令

在项目根目录运行。

| 命令           | 用途                          |
| -------------- | ----------------------------- |
| `pnpm dev`     | 启动本地开发                  |
| `pnpm build`   | 构建静态站点到 `dist/`        |
| `pnpm preview` | 预览生产构建                  |
| `pnpm check`   | 检查 TypeScript 与 Astro 组件 |

## 参与贡献

欢迎反馈问题和提交改进。请按 [贡献指南](CONTRIBUTING.md) 提供复现步骤和验证结果。

## 许可

[Apache-2.0](LICENSE) License © 2026–至今 [everfu](https://github.com/everfu)。二次分发与修改请保留相应许可及版权声明。
