---
title: consts.ts 配置参考
description: 按站点、页面、导航、首页、搜索、友链与评论分组说明全局配置。
pubDate: 2026-03-14
collection: LogFlow Theme
collectionDescription: LogFlow Theme 主题设计、实现与迭代实践
tags:
  - Astro
  - Config
  - Template
---

全站可复用配置集中在 `src/consts.ts`。页面内容、文章 frontmatter 和纯视觉样式不放在这里：文章内容由 `src/content/` 管理，颜色、字号与间距由 `src/styles/global.css` 的 Tailwind 主题令牌管理。搜索索引由构建时从文章集合生成，`SEARCH` 只控制搜索入口和结果数量。

## 站点基础信息

### SITE_TITLE

站点名称，用于 Header、首页标题、浏览器标题和 RSS。

```ts
export const SITE_TITLE = "LogFlow Theme";
```

### SITE_DESCRIPTION

站点级默认描述，用于首页和 RSS。各静态页面的独立概述由 `PAGE_COPY` 管理。

```ts
export const SITE_DESCRIPTION = "A compact Astro theme for writing and publishing.";
```

### SITE_URL

生产环境的完整站点地址，用于 Astro 的 `site` 配置、canonical URL、sitemap、RSS 和友链交换信息。不要添加末尾斜杠。

```ts
export const SITE_URL = "https://example.com";
```

### COPYRIGHT_NAME

页脚版权名称，可以填写个人名、组织名或品牌名。

```ts
export const COPYRIGHT_NAME = "LogFlow Theme";
```

## 页面标题与概述

`PAGE_COPY` 统一维护静态页面的标题和概述。每项文案同时提供给页面标题区域与 SEO description，避免在页面组件内重复填写。

```ts
export const PAGE_COPY = {
  blog: {
    title: "文章",
    description: "按时间浏览全部文章。",
    descriptionItalic: false,
  },
  collections: {
    title: "专题",
    description: "按系列阅读相关文章。",
    descriptionItalic: false,
  },
  tags: {
    title: "标签",
    description: "按主题浏览全部文章。",
    descriptionItalic: false,
  },
  years: {
    title: "文章归档",
    description: "按发布时间浏览全部文章。",
    descriptionItalic: false,
  },
  friends: {
    title: "友链",
    description: "收藏一些值得长期拜访的个人站点。",
    descriptionItalic: false,
  },
  about: {
    title: "关于",
    description: "关于作者、本站和内容授权。",
    descriptionItalic: false,
  },
} as const;
```

标签详情页的概述会根据标签名动态生成；专题详情页优先读取文章 frontmatter 中的 `collectionDescription`，缺失时回退到专题页概述。

每个页面的 `descriptionItalic` 都控制对应页面概述是否使用斜体，默认建议设为 `false`。

## Header 导航

`NAV_LINKS` 控制 Header 的桌面端和移动端导航。`href` 使用站内绝对路径，构建时会自动处理 Astro 的 `base` 路径。

```ts
export const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/blog", label: "文章" },
  { href: "/friends", label: "友链" },
  { href: "/about", label: "关于" },
] as const;
```

## 页脚社交链接

`SOCIAL_LINKS` 控制页脚图标链接。

```ts
export const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/kevynf/logflow-theme",
    icon: "social/github",
  },
] as const;
```

字段含义：

- `label`：无障碍名称。
- `href`：外部主页地址。
- `icon`：`SocialIcon.astro` 内置图标键名，当前支持 `social/github`、`social/twitter` 和 `social/bilibili`。

## 首页

`HOME` 只管理首页个人信息和内容数量，不管理字号或布局。

```ts
export const HOME = {
  avatar: {
    src: "/favicon.svg",
    alt: "LogFlow Theme avatar",
  },
  motto: "Build in public.",
  description: "一个窄版、紧凑的 Astro 博客主题。",
  recentPostsLimit: 6,
} as const;
```

- `avatar.src`：头像地址。
- `avatar.alt`：头像替代文本。
- `motto`：首页显示的个人格言，同时用于生成本站友链信息中的 `Desc`。
- `description`：首页直接展示的个人简介，不从 About 正文自动提取。
- `recentPostsLimit`：首页最近文章数量。

## GitHub 活跃度

`GH_CONTRIBUTE` 控制首页 GitHub 贡献区块。

```ts
export const GH_CONTRIBUTE = {
  title: "GitHub 活跃度",
  description: "最近一年的开源贡献记录",
  username: "octocat",
  profileUrl: "https://github.com/octocat",
  errorMessage: "GitHub 贡献图暂时不可用。",
} as const;
```

- `title`、`description`：区块标题和说明。
- `username`：贡献图对应的 GitHub 用户名。
- `profileUrl`：点击区块后前往的 GitHub 主页。
- `errorMessage`：贡献图加载失败时显示的提示。

构建阶段通过 `GITHUB_TOKEN` 或 `GH_TOKEN` 访问 GitHub GraphQL API。令牌缺失或请求失败时只显示 `errorMessage`，不会使其他页面停止生成；部署工作流应在构建步骤注入令牌。

## 友链

`FRIEND_LINKS` 从 `src/config/friend-links.ts` 导出，友链较多时无需继续增大主配置文件。

```ts
export const FRIEND_LINKS = [
  {
    name: "Example Blog",
    link: "https://example.com",
    avatar: "https://example.com/avatar.png",
    desc: "一句话介绍这个站点。",
  },
];
```

- `name`：站点名称，必填。
- `link`：站点地址；旧数据中的 `url` 仍兼容。展示页会在新字段为空时回退到 `url`。
- `avatar`：头像地址，可选；缺失时显示站点名称首字。
- `desc`：一句话简介；旧数据中的 `description` 仍兼容。首页交换信息中的本站简介来自 `HOME.motto`。

## 搜索

`SEARCH` 控制页头是否显示文章搜索入口，以及搜索结果的最大数量。索引由 `src/pages/search-index.json.ts` 在构建时生成，搜索内容包括文章标题、描述和标签。

```ts
export const SEARCH = {
  enabled: true,
  maxResults: 8,
} as const;
```

- `enabled`：设为 `false` 时不渲染页头搜索按钮。
- `maxResults`：单次最多显示的匹配文章数。

## 评论

`COMMENTS` 管理 giscus 的开关、仓库、Discussion 分类、映射方式、主题与语言。

```ts
export const COMMENTS = {
  enabled: false,
  provider: "giscus",
  repo: "owner/repository",
  repoId: "",
  category: "Announcements",
  categoryId: "",
  mapping: "pathname",
  themeLight: "light_protanopia",
  themeDark: "transparent_dark",
  lang: "zh-CN",
} as const;
```

- `enabled`：评论总开关。
- `provider`：当前保持为 `giscus`。
- `repo`、`repoId`：已启用 Discussions 的公开仓库及其 ID。
- `category`、`categoryId`：用于评论的 Discussion 分类及其 ID。
- `mapping`：页面与讨论串的映射方式，常用值为 `pathname`、`title`、`url` 或 `og:title`。
- `themeLight`、`themeDark`：跟随站点明暗模式切换的 giscus 主题。
- `lang`：giscus 界面语言。

评论默认关闭，`enabled` 为 `false` 时不渲染评论区；启用步骤见 [Giscus 配置速览](/blog/giscus-configuration-quickstart/)。仓库和分类 ID 可通过 [giscus 配置页](https://giscus.app/zh-CN) 获取。

## 推荐修改顺序

1. 修改 `SITE_TITLE`、`SITE_DESCRIPTION`、`SITE_URL` 和 `COPYRIGHT_NAME`。
2. 修改 `PAGE_COPY`、`NAV_LINKS` 和 `HOME`，确定站点文案。
3. 修改 `SOCIAL_LINKS`、`GH_CONTRIBUTE` 与 `FRIEND_LINKS`。
4. 在仓库启用 Discussions 后配置 `COMMENTS`。
5. 运行 `npx astro check` 和 `npm run build` 验证配置。
