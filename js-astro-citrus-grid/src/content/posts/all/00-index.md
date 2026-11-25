---
title: "CitrusGrid 二次开发文档总览"
slug: citrusgrid-er-ci-kai-fa-wen-dang-zong-lan
index: 0
description: "本目录下的文档由源码逐文件核对生成。"
category: "二次开发"
tags: ["二次开发"]
series: "二次开发文档"
series_order: 1
published: 2026-09-16 19:04:41
---

本目录下的文档由源码逐文件核对生成。

## 一、文档地图

| 文档 | 内容 | 什么时候看 |
| --- | --- | --- |
| [`00-index.md`](./00-index.md) | 总览、阅读顺序、二次开发常见任务索引 | 第一次接触项目 |
| [`01-项目结构.md`](./01-项目结构.md) | 目录树、技术栈、构建流水线、数据流 | 想搞清楚哪个文件干什么 |
| [`02-组件说明.md`](./02-组件说明.md) | 全部 19 个 Astro 组件的 Props 表、DOM 结构、事件协议（含布局） | 要改卡片 / 头部 / 目录 / 播放器 |
| [`03-主题与样式定制.md`](./03-主题与样式定制.md) | `--wp-*` CSS 变量全表、暗色模式、Tailwind 桥接、动画、换肤步骤 | 要换主色 / 换字体 / 改圆角 |
| [`04-站点配置.md`](./04-站点配置.md) | `site.config.ts` 逐字段参数表 + `astro.config.mjs` / `tsconfig` / `biome` / `pagefind` | 要改站点信息、导航、首页分页 |
| [`05-内容与Markdown.md`](./05-内容与Markdown.md) | 文章 Frontmatter 表、目录约定、markdown 插件链、MDX 支持、相对链接、图片、容器语法 | 要写文章 / 改渲染行为 |
| [`06-构建与脚本.md`](./06-构建与脚本.md) | 11 个 `scripts/*.js` 的作用与参数（含渲染管线缓存校验）、构建产物结构、部署方式 | 要改构建流程 / 排构建错误 |
| [`07-页面与路由.md`](./07-页面与路由.md) | 路由表、`getStaticPaths` 逻辑、SEO/JSON-LD、i18n 现状 | 要加页面 / 改 URL 规则 |
| [`08-插件系统.md`](./08-插件系统.md) | 评论插件、统计插件接口契约、音乐播放器、检索 | 要接 Waline / Giscus / 自建统计 |
| [`09-常见改造与排错.md`](./09-常见改造与排错.md) | 任务式改造清单 + FAQ + 自检清单 | 动手前的 checklist |

## 二、60 秒认识这个项目

CitrusGrid 是一个纯静态的 Astro 博客主题：

```text
Markdown / MDX 文章 (src/content/posts/*.{md,mdx})
        │
        ├─ dev / build 启动 ─► scripts/sync-md-cache.js ──► 渲染管线指纹变化则清内容缓存
        │
        ├─ astro build ──► dist/*.html（构建期全量预渲染，客户端几乎零 JS）
        │                        │
        │                        └─ scripts/postbuild.js ──► 内联脚本压缩 + modulepreload 注入 + pagefind 索引
        │
        └─ Vite 插件（buildStart）──► .generated/*.json（slug、LQIP 取色、updated 时间）
```

三个关键设计取向，改之前务必知道：

1. 构建期做完一切能做的事：
        代码高亮（Prism）、图片 LQIP 主色渐变、目录（TOC）数据、SEO JSON-LD、RSS 全都在构建期产出，客户端只负责交互。

2. 样式靠 CSS 变量中转：
        全部颜色 / 阴影 / 圆角收敛到 `--wp-*` 变量，再由 `@theme inline` 映射成 Tailwind 的工具类（如 `bg-surface`）。换肤 = 只改 `src/styles/main.css` 里的变量值，不用动组件。

3. 插件靠「同名文件 + 契约」接入：
        `site.config.ts` 里写一个字符串（如 `commentScript: 'utterances'`），运行时会动态 `import` `src/comments/utterances.ts`。加评论系统 = 新增一个文件，不改框架代码。

## 三、二次开发常见任务索引

| 我想…… | 直接看 |
| --- | --- |
| 把主色从柑橘橙改成别的颜色 | [03-主题与样式定制.md#2](./03-主题与样式定制.md#2-换主色最小改动步骤) |
| 换字体 / 调字号 / 行高 | [03-主题与样式定制.md#5](./03-主题与样式定制.md#5-字体与排版) |
| 改站点标题、作者、头像、社交按钮 | [04-站点配置.md#2](./04-站点配置.md#2-siteconfig-字段逐项说明) |
| 加一个导航菜单项 | [02-组件说明.md#3.1](./02-组件说明.md#31-siteheaderastro) + [07-页面与路由.md#6](./07-页面与路由.md#6-新增页面与导航项) |
| 改首页卡片样式 | [02-组件说明.md#4.2](./02-组件说明.md#42-postcardastro) + [03-主题与样式定制.md#7](./03-主题与样式定制.md#7-全局样式文件与工具类) |
| 加一门语言（如韩语） | [07-页面与路由.md#5](./07-页面与路由.md#5-i18n-现状与扩展) |
| 接入 Waline / Giscus 评论 | [08-插件系统.md#2](./08-插件系统.md#2-评论插件) |
| 接入自建访问统计 | [08-插件系统.md#3](./08-插件系统.md#3-统计插件) |
| 开启音乐播放器 / 加歌 | [08-插件系统.md#4](./08-插件系统.md#4-音乐播放器) |
| 加一个 Markdown 提示容器类型 | [05-内容与Markdown.md#5](./05-内容与Markdown.md#5-提示容器remarkcontainers) |
| 在文章里用 MDX 写表达式 / JSX / 组件 | [05-内容与Markdown.md#4.1](./05-内容与Markdown.md#41-mdxmdx文章支持) |
| 改代码块的语言图标 / 行号 / 换行行为 | [05-内容与Markdown.md#6](./05-内容与Markdown.md#6-代码块实现与可调参数) |
| 加一个自定义图标 | [02-组件说明.md#4A](./02-组件说明.md#4a-图标系统srclibiconsts) |
| 纯净阅读：增删要隐藏的组件 | [09-常见改造与排错.md#16](./09-常见改造与排错.md#16-纯净阅读模式增删要隐藏的组件) |
| 部署到 Cloudflare Pages 等静态托管 | [06-构建与脚本.md#9](./06-构建与脚本.md#9-部署) |

## 四、改动前的三条硬规则

#### 规则一：不要手改 `dist/` 和 `.generated/`

`dist/` 是构建产物，`.generated/`（`post-index.json`、`lqips.json`、`post-updated.json`）由构建脚本自动写入，二者都在 `.gitignore` 里。要改行为请改生成它们的源码。

#### 规则二：样式改动优先落在 CSS 变量，而不是组件内的 class

组件里大量使用 `bg-surface`、`text-ink-2`、`border-line` 这类由变量桥接出来的语义类（见 `main.css` 的 `@theme inline`）。直接改某个组件的颜色会造成暗色模式失效或全站不一致。

#### 规则三：Astro 组件的 `<script>` 在 Swup 换页时不会重新执行

项目用 Swup 做无刷新导航，只有 `#swup-container` 内的 DOM 会被替换。所以：

- 页面级脚本必须用 `onPageLoad()`（`src/lib/pageLifecycle.ts`）包一层，而不是裸 `DOMContentLoaded`；
- 常驻 UI（头部、页脚、右下按钮组、音乐播放器）都被刻意放在 `#swup-container` 之外（见 `BaseLayout.astro`），保证切页时不重建、不中断播放。

## 五、验证改动是否生效

```bash
pnpm check            # Astro 组件 + 类型检查
pnpm type-check   # tsc --noEmit（覆盖 src 与 scripts）
pnpm format:all     # Biome 检查并修复
pnpm build            # 完整构建（含 postbuild + pagefind）
pnpm build:fresh   # 强制清缓存后重建（一般不需要，见下）
pnpm preview       # 预览 dist 产物
```

> 注意：搜索功能只在 `pnpm build` 之后可用（pagefind 索引在 `postbuild.js` 中生成），`pnpm dev` 下搜索框会提示「搜索索引不可用」。
>
> 改了 `src/lib/md/*` 的渲染插件或 `astro.config.mjs` 的插件链后，**无需手动清缓存**：`dev` / `build` 启动前的 `scripts/sync-md-cache.js` 会比对渲染管线指纹，变化即自动清掉 Astro 内容缓存并重渲染全部文章。只有 dev server 长时间运行且改插件未重启时才需要重启一次；`pnpm build:fresh` 是无条件强制兜底。详见 [09-常见改造与排错.md](./09-常见改造与排错.md) 的 Q9。
