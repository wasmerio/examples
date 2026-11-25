# Astro Narrow

一个内容优先的 Astro 主题:单栏窄版式,读者可以自己调的整站配色,随屏幕平滑缩放的字号与间距。从 Hugo Narrow 迁移,保留整体设计理念。

[English](README.md) · [简体中文](README.zh-CN.md) · [Hugo Narrow](https://github.com/tom2almighty/hugo-narrow)

## 功能

- 一键换色:挑一个主题色,整站深浅、边框、链接全部自动配好,深色模式也不用单独调
- 读者可以自己调外观:主题色、配色方案、磨砂玻璃、背景颗粒、页面宽度,刷新后依然保留
- 自适应导航:Dock 在宽屏横屏时停靠右侧,其余情况停在底部,菜单、搜索、评论、外观设置与回到顶部都在其中;顶部上下文栏滚动时把面包屑收成标题胶囊
- 字号和间距随屏幕宽度平滑缩放,从手机到大屏都舒服
- 把几篇文章放进同一个文件夹就是一组子文章:自动排序,Dock 中的目录列出全部子文章,上一篇/下一篇在组内衔接
- 文章分页、标签归档、全文搜索、RSS、sitemap 开箱即用
- 多语言(默认英文,内置简体中文示例)
- Markdown 增强:数学公式、Mermaid 图表、选项卡、提示块、图库灯箱
- 项目页只需几行 frontmatter 就能生成卡片,右上角显示 GitHub 图标

## 快速开始

```sh
pnpm install
pnpm dev
pnpm build
pnpm astro check
```

## 主要配置文件

| 文件                    | 用途                     | 常用配置                                                                             |
| ----------------------- | ------------------------ | ------------------------------------------------------------------------------------ |
| `src/config/site.ts`    | 站点、作者与全局功能     | `contentWidth`、`nav`、`home`、`list.pageSize`、`ui.toc`、`comments`、`analytics` |
| `src/config/i18n.ts`    | 语言与显示名称           | `defaultLocale`、`locales`、`localeMeta`                                             |
| `src/config/theme.ts`   | 默认主题、配色方案与预设 | `defaultTheme`、`defaultScheme`、`schemes`、`seedPresets`、`seedColor`、`seedLimits` |
| `src/content.config.ts` | 可用的 frontmatter 字段  | 新增或修改内容字段时更新                                                             |
| `src/styles/tokens.css` | 设计令牌                 | 纸/墨公理色、主题种子、混色配方、Utopia 字号/间距刻度、`--radius`                    |

新增语言时,同时更新 `astro.config.mjs` 的 `i18n.locales` 和 `src/content.config.ts` 中允许的 `lang` 值。

## 导航

`nav` 渲染在 Dock 的菜单面板中。条目可以是注册路由 id(`posts`、`projects`、`archives`),也可以内联链接;内联链接同时支持内部路径与外部 URL,外部 URL 会在新标签页打开并带箭头标记。

```ts
nav: [
  "posts",
  "projects",
  "archives",
  { label: "GitHub", href: "https://github.com/", icon: "simple-icons:github" },
  { label: { en: "About", "zh-cn": "关于" }, href: "/about/" },
],
```

`label` 可以是字符串或按语言的对象;`icon` 可选。页脚只保留版权信息,不再提供页脚导航。

## 首页区块与分页

```ts
home: {
  recentPosts: { enabled: true, limit: 3 },
},
list: {
  pageSize: 10,
},
```

`/posts/` 按 `pageSize` 分页,第二页起位于 `/posts/page/<n>/`。

## 内容分类

文章只使用 `tags`:

```yaml
---
title: 用 Astro Narrow 写作
date: 2026-07-10
tags: [Astro, Markdown]
---
```

归档页会从已发布文章中自动发现标签。筛选 URL 可以直接分享:

```text
/archives/?tag=Astro
```

## 子文章

子文章是 posts 集合里的一个文件夹。文件夹的 `index.md` 是父文,同目录的每个 Markdown 文件是一篇子文章:

```text
src/content/posts/zh-cn/astro-guide/
├── index.md        → /zh-cn/posts/astro-guide/
├── setup.md        → /zh-cn/posts/astro-guide/setup/
└── deploy.md       → /zh-cn/posts/astro-guide/deploy/
```

- 子文章按 frontmatter 的 `order` 数字排序,回落到 `date`,再回落到文件名。
- 文章列表和首页只显示父文;归档、搜索和 RSS 包含每篇子文章。
- 父文页面渲染自动生成的子文章列表;上一篇/下一篇在子文章之间切换。
- Dock 中的目录面板会列出全部子文章,并在当前子文章下嵌套其小标题。
- 上下文栏会显示子文章条目,每篇子文章对应一个圆点;弹层列出全部子文章。
- 只包含 `index.md` 和资源文件的文件夹仍是普通文章。

## 目录

目录位于 Dock 中:Dock 的列表按钮打开唯一的面板。Dock 在侧边时,面板从侧边弹出,可固定常开(`ui.toc.defaultPin`,或构建时的 `ASTRO_TOC_PIN`);Dock 在底部时,面板从底部向上弹出,固定按钮随之隐藏。单篇文章可用 frontmatter `toc: false` 关闭。

## 项目

项目是纯 frontmatter 的卡片,以三列网格展示——没有详情页。`github` 链接会在卡片右上角显示一个 GitHub 图标。

```yaml
---
title: 'Astro Narrow'
description: '一个 Astro-native 内容主题。'
tags: [Astro]
order: 1
links:
  github: https://github.com/example/repo
---
```

## 主题配色

换颜色不需要懂配色:

- **读者侧**:Dock 的显示设置里有预设色板和色相、彩度、明度三条滑杆,挑一个颜色(大红、深蓝、整个色相环都行),整站立刻换装并记住选择。旁边的「配色方案」按钮(默认/着色/鲜明/柔和)决定颜色用得多重——纸面要不要带主题色、颜色的饱和度和强调有多强。
- **站长侧**:默认主题、默认方案和预设色板都在 `src/config/theme.ts`。想用品牌色,在 `src/styles/tokens.css` 声明配方通道:`[data-theme='brand'] { --seed-recipe-l: …; --seed-recipe-c: …; --seed-recipe-h: …; }`,并加一枚对应的预设色板;想做自己的方案,复制 tokens.css 末尾的模板块、改几个百分比,再到 `theme.ts` 注册,Dock 里就会自动出现按钮。

原理只有一句话:整个调色板由「纸、墨 + 一枚主题色」按同一套 `color-mix()` 配方推导,所以任何颜色、任何方案、明暗两种模式都自动协调,不会失调。

字号与间距来自内置的 [Utopia](https://utopia.fyi) `clamp()` 刻度(`--step-*`、`--space-*`),并暴露为 Tailwind 工具类(`text-step-1`、`p-fl-m` 等)。正文样式位于 `src/styles/prose.css`。

## Markdown Tabs

Tabs 使用 `remark-directive` 语法。外层容器使用四个冒号,因为它包含嵌套指令。

````md
::::tabs
:::tab{title="pnpm"}

```sh
pnpm install
```

:::

:::tab{title="npm"}

```sh
npm install
```

:::
::::
````

## GitHub Pages

示例工作流位于 `.github/workflows/deploy.yml`。首次部署前,在仓库 **Settings > Pages** 中把 **Build and deployment > Source** 设置为 **GitHub Actions**。缺少该设置时,`actions/deploy-pages` 可能报 `HttpError: Not Found`。

工作流会为用户页和项目页自动设置 `ASTRO_SITE` 和 `ASTRO_BASE`。

## 许可证

本项目基于 [GNU General Public License Version 3](LICENSE) 发布。
