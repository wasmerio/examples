---
title: 自定义组件手册：功能、用法与 consts.ts 配置
description: 说明 LogFlow Theme 内置组件的职责、调用方式、可选参数与关联配置。
pubDate: 2026-03-14
collection: LogFlow Theme
collectionDescription: LogFlow Theme 主题设计、实现与迭代实践
tags:
  - Astro
  - Components
  - Template
---

这篇文章用于快速了解主题内置组件。组件集中在 `src/components/` 与 `src/components/layout/`，页面通常通过 `SiteLayout` 统一获得页头、页脚、像素背景和代码复制功能。

## 页面外壳

### BaseHead.astro

注入页面元数据、canonical URL、RSS 与 sitemap 链接，并在首屏初始化主题。`ClientRouter` 也由此启用。

```astro
<BaseHead title="文章标题" description="页面描述" image={heroImage} type="article" />
```

- 必填参数：`title`、`description`
- 可选参数：`image?: ImageMetadata`、`type?: 'website' | 'article'`
- 关联配置：`SITE_TITLE` 用于 RSS 标题；`SITE_URL` 由 Astro 配置用于 canonical、sitemap 和 RSS。

### SiteLayout.astro

页面级布局，组合 `BaseHead`、`PixelHeroCanvas`、`Header`、`PageContainer`、`Footer` 和 `CodeCopy`。

```astro
<SiteLayout title="文章标题" description="页面描述" type="article">
  <p>页面内容</p>
</SiteLayout>
```

`title` 与 `description` 必填；`lang`、`image` 和 `type` 可选。文章页通常传入 `type="article"` 与 `heroImage`。

### Header.astro、HeaderLink.astro 与 ThemeToggle.astro

- `Header` 渲染站点标题、`NAV_LINKS`、搜索入口、主题切换和移动端导航。
- `HeaderLink` 负责当前路径的 `aria-current` 状态，可继承原生 `<a>` 属性。
- `ThemeToggle` 在文档根节点切换 `dark` class，并将用户选择保存到 `localStorage`。

```astro
<HeaderLink href="/blog">文章</HeaderLink>
<ThemeToggle />
```

### SearchDialog.astro

由 Header 使用的静态文章搜索对话框。它从 `/search-index.json` 加载标题、描述和标签索引，支持关键词高亮、方向键选择、Enter 打开和 Escape 关闭。通过 `SEARCH.enabled` 控制是否显示入口，通过 `SEARCH.maxResults` 限制结果数。

### Footer.astro 与 SocialIcon.astro

`Footer` 渲染版权、当前年份和 `SOCIAL_LINKS`；`SocialIcon` 根据内置键名渲染图标。

```astro
<SocialIcon icon="social/github" size={20} />
```

`SocialIcon` 的 `size` 可选，默认值为 `20`。`SOCIAL_LINKS[].icon` 当前支持 `social/github`、`social/twitter` 和 `social/bilibili`。

### PixelHeroCanvas.astro

在全站绘制像素化流体背景。组件使用 WebGL 两阶段渲染，按网格计算流体场并栅格化显示；会响应鼠标、明暗主题和 `prefers-reduced-motion`。动画时间保存在当前标签页的 `sessionStorage` 中，以便 ClientRouter 换页时保持连续。WebGL 不可用或上下文丢失时回退到 CSS 背景。

## 布局组件

### Box.astro 与 Cell.astro

`Box` 是带边框、毛玻璃背景和分隔线的外层容器；`Cell` 是容器内的统一内边距单元。页面的卡片、列表和区块优先组合这两个组件。

```astro
<Box as="section">
  <Cell as="header" variant="header">区块标题</Cell>
  <Cell>区块内容</Cell>
</Box>
```

- `Box`：`as?: 'div' | 'section' | 'header' | 'article' | 'aside'`，以及 `class` 和其他 HTML 属性。
- `Cell`：`as?: 'div' | 'section' | 'header' | 'article' | 'li' | 'a' | 'h2'`，`variant?: 'body' | 'header'`，`interactive?: boolean`，以及 `class` 和其他 HTML 属性。
- `variant="header"` 使用区块标题背景；`interactive` 为可点击单元添加悬停状态。

### PageContainer.astro 与 SidebarSection.astro

`PageContainer` 提供页面最大宽度、响应式内边距和区块间距，由 `SiteLayout` 自动使用。`SidebarSection` 用于侧栏区块，接受必填的 `title` 和可选的 `href`，并提供 `action` 插槽。

### Prose.astro

为 Markdown/MDX 正文提供统一排版容器，并将内容包在 `article` 外壳中。组件不接受参数，正文宽度由页面容器决定，排版由 `@tailwindcss/typography` 的 `prose` 容器统一提供。

```astro
<Prose><Content /></Prose>
```

## 内容组件

### PageHeader.astro

统一渲染页面标题、说明和数量徽标，可通过插槽放置说明内容或右侧操作。

```astro
<PageHeader
  title="文章"
  description="记录学习和实践。"
  count={{ value: posts.length, unit: "篇" }}
  descriptionItalic={false}
>
  <ArchiveLink slot="description-action" />
</PageHeader>
```

参数：`title` 必填；`description`、`count` 和 `descriptionItalic` 可选。`description` 插槽和 `description-action` 插槽可替代或补充默认说明。

### PostList.astro

统一渲染首页、文章、专题、标签和年份归档中的文章列表。

```astro
<PostList posts={posts} showDescription={true} showReadingTime={true} />
```

`posts` 必填；`showDescription` 默认 `true`，`showReadingTime` 默认 `false`。列表会显示文章标签、发布日期和可选的阅读时长。

### Badge.astro、Count.astro 与 Meta.astro

- `Badge` 以徽标样式渲染 `span`；传入 `href` 时渲染为链接。
- `Count` 渲染数字和单位，参数为必填的 `value` 与 `unit`。
- `Meta` 为日期、更新日期和阅读时长提供统一的行内元信息容器。

```astro
<Badge href="/blog/tags/Astro/">Astro</Badge>
<Count value={6} unit="篇" />
<Meta><FormattedDate date={post.data.pubDate} /></Meta>
```

三者都接受可选的 `class`；站内路径应使用 `withBase()` 处理部署在子路径下的场景。

### ArchiveLink.astro

渲染指向 `/blog/years/` 的“时间机器”徽标链接，不接受组件参数。

### FormattedDate.astro

统一输出带 `datetime` 的 `<time>` 元素。同一年显示 `月日`，跨年显示 `年/月/日`，完整中文日期放在 `title` 属性中。`date` 为必填参数，不再提供旧版的 `short` 参数。

```astro
<FormattedDate date={post.data.pubDate} />
```

### CodeCopy.astro

由 `SiteLayout` 自动加载。它为 `.prose pre` 代码块添加复制按钮，并在 ClientRouter 换页后重新初始化；`data-code-block` 和 `data-copy-ready` 标记保证初始化幂等。需要复制自定义文本时，可使用 `data-copy-text`：

```html
<button type="button" data-copy-text="要复制的内容">复制</button>
```

复制成功或失败会短暂更新按钮状态，不影响代码块阅读。

## 数据与集成组件

### GitHubContribute.astro 与 GitHubCalendar.astro

`GitHubContribute` 在构建阶段按 `GH_CONTRIBUTE.username` 获取贡献数据，并显示标题、贡献总数和失败提示；`GitHubCalendar` 将数据渲染为可访问的 HTML/CSS 网格，支持明暗主题和贡献强度图例。

```astro
<GitHubContribute />
<GitHubCalendar contributions={contributions} totalCount={totalCount} />
```

`GitHubContribute` 无组件参数；`GitHubCalendar` 的 `contributions` 与 `totalCount` 必填，通常只由前者调用。

构建时需要提供 `GITHUB_TOKEN`（或兼容的 `GH_TOKEN`）访问 GitHub GraphQL API。令牌缺失或请求失败时，组件保留区块并显示 `GH_CONTRIBUTE.errorMessage`，不会阻塞其他页面生成。

### CommentSection.astro

按 `COMMENTS` 配置动态加载 Giscus，并在主题切换时同步评论 iframe 的主题。组件无参数；全局关闭 `COMMENTS.enabled` 时不渲染，配置不完整时显示提示。文章页还会读取 frontmatter 的 `enableComments`，未设置时默认开启。

```astro
<CommentSection />
```

`COMMENTS` 的关键字段包括 `enabled`、`provider`、`repo`、`repoId`、`category`、`categoryId`、`mapping`、`themeLight`、`themeDark` 和 `lang`。

## 维护建议

- 站点文案、导航、社交链接、首页信息和集成开关优先修改 `src/consts.ts`。
- 文章元信息遵循 [Frontmatter 使用指南](/blog/frontmatter-usage-guide/)。
- 布局间距和颜色由 `src/styles/global.css` 统一维护，组件内尽量复用 `Box`、`Cell` 和现有工具类。
- `ContentSection.astro` 已移除，新增页面应使用 `Box`、`Cell` 和 `PageContainer`，不要继续引用旧组件。
