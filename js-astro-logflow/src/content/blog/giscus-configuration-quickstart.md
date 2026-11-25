---
title: Giscus 配置速览：5 步启用评论系统
description: 用最短路径完成 Giscus 从仓库到站点的配置，并映射到 LogFlow Theme。
pubDate: 2026-03-14
collection: LogFlow Theme
collectionDescription: LogFlow Theme 主题设计、实现与迭代实践
tags:
  - Giscus
  - Comments
  - Astro
---

这篇文章只关注 Giscus 接入流程，不重复组件总览中的其他内容。

## 第 1 步：准备仓库

- 确保仓库是公开仓库。
- 在 GitHub 仓库设置中启用 Discussions。
- 建议先创建一个用于评论的分类，例如 `Announcements` 或 `General`。

## 第 2 步：安装 Giscus App

- 访问 <https://github.com/apps/giscus> 并安装到目标仓库。
- 在 <https://giscus.app/zh-CN> 选择仓库和 Discussion 分类。

完成后你会拿到以下关键值：

- `repo`：`owner/repo`
- `repoId`：仓库 ID
- `category`
- `categoryId`

## 第 3 步：写入 consts.ts

在 `src/consts.ts` 的 `COMMENTS` 中填入配置：

```ts
export const COMMENTS = {
	enabled: true,
	provider: 'giscus',
	repo: 'owner/repository',
	repoId: '你的 repoId',
	category: 'Announcements',
	categoryId: '你的 categoryId',
	mapping: 'pathname',
	themeLight: 'light_protanopia',
	themeDark: 'transparent_dark',
	lang: 'zh-CN',
};
```

## 第 4 步：按文章控制评论开关

在文章 frontmatter 中添加 `enableComments` 字段即可按文章独立控制：

```yaml
---
title: 我的文章
enableComments: false
---
```

模板会优先读取 frontmatter 中的值，未设置时默认开启评论。

如果设为 `false`，即使 `COMMENTS.enabled` 为 `true` 该文章也不会渲染评论区。

## 第 5 步：常见问题排查

- 页面显示“评论系统尚未配置，请检查 src/consts.ts 中的 COMMENTS 设置。”
  - 检查 `repo`、`repoId`、`categoryId` 是否为空。
- 评论区加载失败或无内容
  - 检查仓库是否公开、Discussions 是否开启、分类是否匹配。
- 主题切换后评论区颜色不正确
  - 检查 `themeLight` / `themeDark` 是否为 Giscus 支持的主题名。

## 可选参数建议

- `mapping`
  - 推荐 `pathname`，按 URL 路径绑定讨论串。
  - 若希望按文章标题绑定，可使用 `title`。
- `lang`
  - 可设置 `zh-CN`、`en` 等。
- `themeLight` / `themeDark`
  - 可从 giscus 官方主题列表中选择，例如 `light`、`dark`、`transparent_dark`。
