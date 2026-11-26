---
title: 站点配置
description: 配置站点身份、导航、双语内容和可选服务。
permalink: /docs/guide/configuration/
type: doc
group: 指南
order: 10
createTime: 2026-08-05
tags: [配置, Astro]
---

# 站点配置

公共配置位于 `site.config.mjs`。修改站名、域名和导航后，Astro 开发服务器会自动刷新。最外层的 `defineSiteConfig()` 提供自动补全，为省略的可选区块补充安全默认值，并在启动时报告无效域名、路径和分页等配置。

## 公告板

公告板默认关闭。将 `siteConfig.bulletin.enabled` 改为 `true` 后，可选择 `top-left`、`top-right`、`bottom-left`、`bottom-right` 或 `center` 布局，并通过 `always`、`session`、`once` 控制关闭后的显示周期。`contentType: 'markdown'` 会使用与正文相同的 Markdown 渲染器，也可以通过 `contentFile` 读取独立的 Markdown 或 HTML 文件。

## 文章封面

`siteConfig.postCover` 设置全站文章封面布局，支持 `left`、`right`、`odd-left`、`odd-right` 和 `top`。文章 frontmatter 可用 `coverStyle` 覆盖布局、比例、侧栏宽度和紧凑模式：

```yaml
cover: /img/cover.webp
coverStyle:
  layout: right
  ratio: 4/3
  width: 240
  compact: false
```

`siteConfig.profile` 支持 `avatar`（兼容旧名 `url`）、`name`、`description`、`circle`、`location`、`organization` 和 `layout: 'left' | 'right'`。移动端会使用同一份资料显示底部弹窗和分类导航；Plume 已弃用的顶层或 locale `avatar: { ... }` 也会回退为 `profile`。

将 `profile` 设为 `false` 会移除桌面资料卡，并像 Plume 一样在文章列表上方显示标签、分类和归档的横向本地导航；移动端仍保留包含这三项入口的弹层按钮。

在手机宽度下，左右封面会与 Plume 一样自动切换到顶部。

## 页面过渡

`transition.page` 在完整页面导航时对内容区域执行与 Plume 一致的 `fade-slide-y` 先退出、再进入动画，不会创建容易造成主题闪烁的整页浏览器快照；文档左侧栏不会执行完整页面导航，而会像 Plume 一样保留公共页面外壳，只更新正文、目录和当前导航状态。博客列表、分类、标签与归档之间也会保留共用的头部和资料侧栏，只切换集合内容。系统开启“减少动态效果”时自动禁用完整页面动画。设置 `transition: false` 可关闭全部过渡，或仅设置 `transition.page: false` 关闭完整页面跳转动画。

## 外观

`appearance` 与 Plume 一致，默认为 `true`，会跟随系统首选配色并记住用户手动选择。设为 `'dark'` 会在没有已保存选择时默认使用深色；设为 `false` 会固定浅色并隐藏所有外观开关；设为 `'force-dark'` 会固定深色并隐藏开关。locale 内的同名配置可覆盖全局值。

`transition.appearance` 支持 `fade`、`circle-clip`、`horizontal-clip`、`vertical-clip`、`skew-clip`、`blinds-vertical`、`blinds-horizontal`、`soft-blur-fade` 和 `diamond-reveal`。设置为 `false`，或系统开启“减少动态效果”时，会立即切换而不执行 View Transition。打印深色页面时会临时使用浅色，打印完成后恢复。

## 多语言

`locales` 可配置任意数量的语言；每种语言用 `home` 指定路径前缀，内容放在同名目录或在 frontmatter 显式填写 `lang`。框架会为每种已配置语言生成博客、标签、分类、归档、分页数据、LLM 文档和 SEO alternate，并在语言下拉框列出确实存在的翻译页面。

Plume 的简体中文、繁体中文、英语、德语、法语、俄语、日语和韩语预设均已内置，识别 `zh-CN`、`zh-TW`、`en-US`、`de-DE`、`fr-FR`、`ru-RU`、`ja-JP`、`ko-KR` 及其短名称。站点名称、说明、导航等业务字段仍应在对应 locale 中填写；同名字段可覆盖预设文案。

## 导航栏

每个 locale 的 `navbar` 接受 Plume 的字符串链接，以及 `{ text, link, icon, badge, activeMatch, prefix, items, target, rel, noIcon }`；旧字段 `navigation` 继续兼容。`label` 与 `href` 也作为兼容别名保留。字符串指向站内内容时会自动读取页面标题、图标和徽章；`prefix` 会递归拼接组内相对链接，最多显示两层下拉分组。省略 `navbar` 时会根据当前语言的第一个 Post 集合自动生成首页、文章、标签和归档入口。

```js
navbar: [
  '/docs/',
  { text: '博客', link: '/blog/', activeMatch: '^/(blog|article)/', icon: 'material-symbols:article-outline' },
  {
    text: '指南',
    prefix: '/docs/guide/',
    items: [
      { text: '配置', link: 'configuration/', badge: { text: 'New', type: 'warning' } },
      { text: 'Astro', link: 'https://astro.build/', icon: 'simple-icons:astro' },
    ],
  },
]
```

外链默认在新窗口打开并显示外链标识，`noIcon: true` 可隐藏该标识。导航图标复用 Markdown 图标提供方，因此支持 Iconify、IconFont、Font Awesome、图片 URL 和 `{ svg }`。

全局配置先作为默认值，再与当前 locale 的对象字段浅合并；一个语言只需填写不同的部分。locale 可独立覆盖 `logo`、`logoDark`、`profile`、`social`、`navbarSocialInclude`、`appearance`、`transition`、`footer`、`outline`、`aside`、`externalLinkIcon` 和 `createTime`，不会继承另一种语言的导航或文案。单页 frontmatter 使用 `navbar: false` 可隐藏导航栏。

## 页面与正文选项

`pageLayout` 支持 `home`、`posts`、`doc`、`page`、`friends`、`custom`、`false` 和自定义组件名，并兼容 Plume 旧名 `blog`（等同于 `posts`）。`posts` 可配合 `collection` 指定 Post 集合；`page` 保留导航栏与专页正文；`custom`/`false` 只输出 Markdown 正文；命名组件布局替换主内容区域，但保留主题导航、页脚以及适用的集合侧栏。自定义组件放在 `theme/components/layouts/`，文件名就是布局名。

正文目录可通过全局、locale 或单页的 `outline` 与 `aside` 配置。`externalLinkIcon` 默认开启，单页也可关闭；旧字段 `externalLink` 仍兼容。`createTime: 'only-posts'` 只在博客文章和文章列表显示创建时间，`false` 则全站隐藏。`plugins.nprogress: false` 可关闭站内页面切换时的顶部进度条。

## 布局插槽

在 `theme/components/slots/` 新建与 Plume 插槽同名的 `.astro` 或 `.vue` 文件即可注入内容，例如 `doc-top.astro` 或 `DocTop.astro`。组件会收到当前可用的 `lang`、`route`、`entry`、`layout`、`posts` 等属性；没有对应文件时不会增加额外 DOM。

支持的布局文件名包括：

- 通用：`layout-top`、`layout-bottom`、`custom-content`、`footer-content`、`bulletin-content`、`not-found`；
- 导航：`nav-bar-title-before/after`、`nav-bar-content-before/after`、`nav-bar-menu-before/after`、`nav-screen-content-before/after`、`nav-screen-menu-before/after`；
- 文档与页面：`page-top/bottom`、`doc-top/bottom`、`doc-before/after`、`doc-content-before`、`doc-footer-before`、`doc-title-before/after`、`doc-meta-top/bottom/before/after`、`sidebar-nav-before/after`、`aside-top/bottom`、`aside-outline-before/after`；
- 博客：`posts-top/bottom`、`posts-aside-top/bottom`、`posts-extract-before/after`、`posts-post-list-before/after`、`posts-post-list-pagination-after`，以及 `posts-tags-*`、`posts-categories-*`、`posts-archives-before/after`。

`FooterContent.astro` 与 `BulletinContent.astro` 的旧式组件覆盖仍兼容；同名插槽文件优先。

## 自动 frontmatter

`autoFrontmatter` 默认启用。新 Markdown 缺少字段时，开发、检查或构建前会像 Plume 一样把 `title`、文件创建时间 `createTime` 和 8 位随机 `permalink` 写回源文件，已有字段绝不覆盖。设为 `{ permalink: 'filepath' }` 可按路径生成稳定链接；安装可选的 `pinyin-pro` 后会把中文路径转换为拼音。

全局或集合级配置均可分别关闭 `title`、`createTime`、`permalink`，也可提供同步或异步 `transform(data, context, locale)`。`context` 包含 `filepath`、`relativePath` 与正文 `content`；集合配置优先于全局配置。设置 `autoFrontmatter: false` 可完全关闭源文件写回。

## 文章分页

`siteConfig.pagination` 接受 `false`、每页文章数，或 `{ perPage: 文章数 }`。示例项目与 Plume 的默认值均为每页 15 篇。

`siteConfig.categoriesExpand` 控制分类树默认展开深度，接受数字或 `'deep'`。分类目录可使用 `01.名称` 形式控制顺序；数字前缀不会显示，并且任意层级都会保留在分类页和文章面包屑中。

`siteConfig.tagsTheme` 可设为 `'colored'`、`'gray'` 或 `'brand'`；彩色模式使用 Plume 的完整 18 色预设。`siteConfig.meta` 可分别开关 `tags`、`readingTime`、`wordCount`、`createTime`，其中创建时间支持 `'short'` 和 `'long'`；设为 `false` 会全部隐藏，集合仍可单独重新开启字段。`postCover: false` 会关闭列表封面。单页可用 `readingTime: false` 隐藏阅读统计。

`siteConfig.readingTime` 与 Plume 的阅读统计插件一致，支持 `false`、`wordPerMinute`，以及按 locale 路径配置的 `locales`。每个 locale 可覆盖包含 `$word` 的 `word`、包含 `$time` 的 `time` 和 `less1Minute`；未配置时使用 Plume 内置的中、英、繁中、德、法、俄、日、韩文案。

## Post 与 doc 集合

每个 locale 可配置任意多个 Plume 风格集合；`dir` 相对于该语言的内容目录：

```js
locales: {
  'zh-CN': {
    home: '/',
    collections: [
      { type: 'post', dir: 'blog', title: '博客' },
      { type: 'post', dir: 'news', title: '新闻', link: '/updates/' },
      { type: 'doc', dir: 'docs', title: '文档', sidebar: 'auto' },
    ],
  },
},
```

Post 集合支持 `include`、`exclude`、`pagination`、`postList`、`link`、`linkPrefix`，标签/分类/归档页的开关、自定义路径与标题，以及集合级 `tagsTheme`、`meta`、`postCover`、`profile`、`social`、`categoriesExpand` 和 `categoriesTransform`。`categoriesTransform` 会像 Plume 一样为每篇文章接收从外到内的 `{ id, name, sort }[]` 分类链，返回值会统一用于文章卡片、面包屑、统计和分类树。生成页、分页 JSON、站点地图和多语言切换都会使用集合的实际路径。

从旧版 Plume 迁移时，已弃用的顶层 `blog`、`article`、`notes` 以及 locale 内的 `notes` 会在启动时转换为集合；目标位置已有非空 `collections` 时以新配置为准。全局、locale 和 Post 集合中的旧 `profile.url` 也会归一化为 `profile.avatar`。这些兼容项只用于平滑迁移，新配置应直接使用 `collections` 与 `profile.avatar`。

Doc 集合支持 `sidebar: 'auto'`，会按目录层级和数字前缀递归生成导航；`sidebarCollapsed` 控制自动分组初始折叠，`sidebarScrollbar` 控制滚动条。也可传入字符串或 `{ text, link, prefix, icon, badge, collapsed, items }` 数组手动编排，`items: 'auto'` 只自动读取当前分组，`link: '---'` 生成分隔符。

还可使用 Plume 的全局多侧栏写法：`sidebar: { '/docs/': 'auto', '/guide/': [...] }`，按最长路径前缀匹配。值也可写成 `{ items, prefix }`；单页 `sidebar: '/guide/'` 可强制选择指定侧栏，`sidebar: false` 关闭当前页侧栏。侧栏项兼容旧 `dir` 字段以及 `target`、`rel`。

`site.config.mjs` 已从 `./theme/config.mjs` 导入 `defineSiteConfig`。它保留传入的对象引用，并为主题运行必需的可选区块补充默认值。开发主题集成时还可从 `theme/node.ts` 使用 `defineThemeConfig`、`defineNavbarConfig`、`defineCollections` 和 `defineCollection`；其余帮助函数仍原样返回传入值。

Plume 旧式 `plugins.copyCode`、`plugins.shiki`、`plugins.readingTime`、`plugins.comment`、`plugins.watermark`、`plugins.replaceAssets`、`plugins.llmstxt`、`plugins.markdownPower`、`plugins.markdownChart`、`plugins.markdownImage`、`plugins.markdownInclude`、`plugins.markdownMath`、`plugins.search` 和 `plugins.docsearch` 均会回退到对应的新式扁平配置；新旧同时存在时以顶层或 `markdown` 配置为准。`markdown.image` 完整支持 Plume 的 `figure`、`lazyload`、`mark`、`size`、`legacySize` 和 `obsidianSize` 选项；`codeHighlighter: false` 会回退到普通代码块。`plugins.markdownPower: false` 只关闭该增强组，图片、数学、包含、提示与图表仍由各自开关控制。

`plugins.seo` 对象支持 Plume 的 `hostname`、`author`、`restrictions`、`autoDescription`、`fallBackImage`、`twitterID`、`isArticle`、`ogp`、`jsonLd`、`customHead` 和 `canonical`；设为 `false` 会关闭自动 Open Graph、Twitter Card 与 JSON-LD。Twitter/X 账号优先从 `social` 链接识别，`twitterID` 只作为兼容回退。`plugins.sitemap` 支持 `hostname`、`extraUrls`、`excludePaths`、`sitemapFilename`、`sitemapXSLFilename`、`sitemapXSLTemplate`、`changefreq`、`modifyTimeGetter`、`devServer`、`devHostname` 和 `xmlNameSpace`；设为 `false` 会删除 sitemap 输出及 robots.txt 中的地址。

页面 frontmatter 的 `head` 接受 Plume/VuePress 风格的 `[tag, attributes, content?]` 数组，可添加 `meta`、`link`、`style`、`script` 或其他合法 head 标签。`description`、`keywords`、`robots` 和 `canonical` 会覆盖主题生成值；自定义 `robots: noindex` 也会同时排除 Pagefind 与 sitemap。无刷新导航会同步 JSON-LD 和主题管理的 head 节点；目标页改变外壳、侧栏或自定义 head 时自动回退为完整导航，避免沿用上一页状态。`script` 与 `style` 内容按原文输出，只能填写完全可信的内容。

本地搜索使用 Pagefind；`plugins.search.isSearchable(page)` 会控制页面是否进入索引，`disableQueryPersistence` 和 `locales` 也会生效。Plume 原插件的 `miniSearch` 分词器选项没有 Pagefind 等价能力，因此只为配置迁移保留类型，不会改变 Pagefind 的分词算法。Plume 顶层的 `cache` 和 `configFile` 分别控制 VuePress 编译缓存与配置文件加载；Astro 没有对应运行阶段，这两个字段同样只保留迁移类型，配置后不会改变构建行为，迁移时应删除。

## 可信图表脚本

`chartjs`、`echarts`、`flowchart`、`markmap`、`plantuml`、`mermaid` 与 Plume 一样默认关闭，按需在 `markdown` 中设为 `true`。`plantuml` 也接受 `@mdit/plugin-plantuml` 选项数组，用来限定图表语法、服务地址或输出格式；本示例站为展示能力已显式开启全部六项。

Chart.js 和 ECharts 的 `js` / `javascript` 配置默认不会执行。只有内容完全可信时，才同时开启脚本执行并把对应 Markdown 文件加入允许列表：

```js
markdown: {
  DANGEROUS_ALLOW_SCRIPT_EXECUTION: true,
  DANGEROUS_SCRIPT_EXECUTION_ALLOWLIST: ['docs/guide/chart-demo.md'],
}
```

允许列表也接受 `'*'`，但不建议用于包含用户内容的网站；普通图表优先使用 `json` 配置。

## 媒体嵌入

`acfun`、`bilibili`、`youtube`、`pdf`、`audioReader` 和 `artPlayer` 与 Plume 一样默认关闭，可在 `markdown` 中分别开启。本示例站为展示能力已显式开启全部六项；Obsidian 的 PDF 与视频嵌入也分别依赖 `pdf` 与 `artPlayer`。

```js
markdown: {
  youtube: true,
  pdf: { pdfjsUrl: 'https://static.pengzhanbo.cn/pdfjs/' },
  audioReader: true,
  artPlayer: true,
}
```

桌面浏览器直接嵌入 PDF；移动端按需加载 PDF.js。`pdfjsUrl` 应指向包含 `web/viewer.html` 的 PDF.js 发布目录。ArtPlayer 支持 Plume 的 MP4、MP3、WebM、Ogg、DASH、HLS、TS、FLV、MKV、MOV 与 OGV 类型。

## Markdown 图标

正文使用与 Plume 相同的 `::名称 =尺寸 /颜色::` 语法，例如 `::mdi:home =24 /#336f87::`。默认 Iconify 会直接内联已安装的图标集合，其他集合在浏览器中从 Iconify 官方 API 按需加载；`:[名称 尺寸/颜色]:` 旧语法仍兼容。

```js
markdown: {
  icon: { provider: 'iconify', prefix: 'mdi' },
}
```

将 `provider` 改为 `iconfont` 或 `fontawesome` 时，可用 `assets` 配置一个或多个 `.css` / `.js` 地址。Font Awesome 支持内置值 `fontawesome` 和 `fontawesome-with-brands`，以及 `::fontawesome fas:house 2xl::` 这种按图标覆盖提供方的写法。

`markdown.repl` 可分别开启 `go`、`kotlin`、`rust`、`python`，并通过 `theme` 指定单个 Shiki 主题或 `{ light, dark }` 主题。可编辑 REPL 会按需加载高亮器并在输入时更新语法高亮。前三者会把代码发往 Plume 所用的公开运行服务，Python 会按需加载 Pyodide 在浏览器本地执行；只应运行可信、轻量的示例代码。`markdown.codeTree` 可写成 `{ height, icon }`，为代码树设置默认高度和文件图标风格，容器自身的同名属性优先。

## 社交链接与页脚

`social` 使用与 Plume 相同的数组结构，支持内置 Simple Icons 名称、`twitter` / `weibo` 兼容别名和自定义 SVG。`navbarSocialInclude` 只限制桌面导航栏与“更多”菜单；移动导航和博客资料卡仍显示完整列表。

```js
social: [
  { icon: 'github', link: 'https://github.com/example' },
  { icon: 'weibo', link: 'https://weibo.com/example', ariaLabel: '微博' },
  { icon: { svg: '<svg>...</svg>', name: 'custom' }, link: 'https://example.com' },
],
navbarSocialInclude: ['github', 'weibo'],
footer: {
  message: 'Power by <a href="https://astro.build/">Astro</a>',
  copyright: 'Copyright © 2026 Example',
},
```

将全局 `footer` 设为 `false` 可关闭整站页脚；单页 frontmatter 使用 `footer: false` 只关闭当前页。

## 友情链接页

页面 frontmatter 使用 `pageLayout: friends`（兼容旧写法 `friends: true`）即可启用 Plume 友链布局。`cols` 控制桌面最大列数，`contentPosition` 控制 Markdown 正文位于列表前后；`list` 与 `groups` 均支持头像、描述、所在地、组织、社交链接以及浅色/深色主题颜色。完整示例见 `/friends/`。

## 公告栏

`bulletin` 支持 `top-left`、`top-right`、`bottom-left`、`bottom-right`、`center` 五个位置，以及 `always`、`session`、`once` 三种关闭期限。`enablePage` 可以用布尔值或接收 `{ path }` 的函数限制页面；未填写 `id` 时会根据配置生成稳定标识。示例公告只在 `/landing/` 展示。

## 搜索服务

`llmstxt: true` 会生成 `/llms.txt`、`/llms-full.txt`、每页 Plume 风格的 `index.md` 及兼容的 `/raw/` 路径，并启用标题旁的页面上下文菜单。Plume 默认关闭此能力；设为 `false` 后这些文件和菜单会一起消失，单页 `llmstxt: false` 只排除当前页面。对象写法支持 `llmsTxt`、`llmsFullTxt`、`llmsPageTxt`、`stripHTML`、`locale`、`domain`、`linkExtension`、`filter`、`transformMarkdown`、`llmsTxtTemplate` 和 `llmsTxtTemplateGetter`；`locale` 默认只处理根语言，设为 `'all'` 才处理全部语言。也兼容 `plugins.llmstxt`，但推荐使用顶层字段。

默认使用构建时生成的 Pagefind 本地索引，不需要外部服务：

```js
search: {
  provider: 'local',
  locales: {
    '/en/': { placeholder: 'Search documentation' },
  },
}
```

本地搜索的 locale 可覆盖 `placeholder`、`buttonText`、`resetButtonTitle`、`backButtonTitle`、`noResultsText` 和 footer 的键盘提示文字；未配置时使用与 Plume 相同的语言预设。

大型文档站也可切换到与 Plume 相同的 Algolia DocSearch 适配器。客户端与样式仅在选择该提供方时加载，并自动为当前语言添加 `lang` facet：

```js
search: {
  provider: 'algolia',
  appId: 'YOUR_APP_ID',
  apiKey: 'YOUR_SEARCH_API_KEY',
  indexName: 'YOUR_INDEX_NAME',
  locales: {
    '/en/': { placeholder: 'Search documentation' },
  },
}
```

也支持 DocSearch 的 `indices`、`searchParameters`、`translations`、`keyboardShortcuts` 与 `indexBase`。`apiKey` 必须是只能查询索引的公开搜索密钥，不能填写管理密钥。

## 资源链接替换

`replaceAssets` 默认关闭。生产构建可把 `/images/` 下的图片和 `/medias/` 下的视频、音频、字幕、PDF 链接改写到 CDN；源 Markdown、HTML、CSS 和 JavaScript 文件不会被修改：

```js
replaceAssets: process.env.NODE_ENV === 'production'
  ? { image: 'https://images.example.com', media: 'https://media.example.com' }
  : false,
```

也可直接填写一个字符串或函数以替换全部内置资源类型，或使用 `{ find, replacement }`、规则数组及 `rules` 自定义匹配。字符串 `find` 以 `^` 开头或 `$` 结尾时按正则表达式匹配，否则匹配 URL 的开头或结尾。内置规则与 Plume 一样只识别 `/images/`、`/medias/` 下的已知资源扩展名。

## 构建期图片尺寸

`markdown.imageSize` 默认关闭。设为 `true` 或 `'local'` 后，生产构建会读取本地图片并为正文 `<img>` 自动补齐 `width`、`height`；设为 `'all'` 时也会探测远程图片。旧写法 `plugins.markdownPower.imageSize` 仍兼容：

```js
markdown: {
  imageSize: 'local',
},
```

已有宽高会保留，只缺一项时按原始比例推算。该处理只改变构建产物，不写回 Markdown；远程模式会增加网络请求，并对无法读取的单个地址最多等待 3 秒，因此除非确实需要，优先使用本地模式。出于解析安全考虑，AVIF、HEIF、HEIC、JXL 与 ICNS 暂不自动探测尺寸；图片本身仍可正常使用。

## 内容加密

`encrypt` 与 Plume 一样支持全站门禁、管理员密码和按 Markdown 文件、目录、访问路径或正则表达式匹配的页面规则。密码可以是单个字符串或字符串数组；同一目录或规则解锁后在当前会话继续有效：

```js
encrypt: {
  global: false,
  admin: ['REPLACE_WITH_ADMIN_PASSWORD'],
  rules: {
    'notes/private/': 'directory-password',
    '/private/': ['reader-password', 'editor-password'],
    '^/(?:en/)?members/': 'member-password',
  },
},
```

单页仍可在 frontmatter 使用 `password`、`passwordHint`；`::: encrypt` 局部容器可使用自身密码或管理员密码，也可由 `markdown.encrypt: { password: '默认密码' }` 提供默认密码。页面正文和局部内容在构建时使用 PBKDF2 与 AES-GCM 加密，但静态站点门禁不应替代真正的服务端访问控制，敏感数据请勿随公开构建产物发布。示例配置中的密码仅用于演示，实际站点必须替换或删除。

## Git 贡献者与变更记录

生产构建会从每篇 Markdown 的 Git 历史生成最后更新时间和贡献者；开发环境默认跳过，避免反复执行 `git log`。贡献者默认以内联姓名显示，也可以切换为带头像、链接的正文区块。变更记录与 Plume 一样默认关闭：

```js
lastUpdated: { formatOptions: { dateStyle: 'short', timeStyle: 'short' } },
contributors: {
  mode: 'block', // 或 'inline'
  info: [
    { username: 'octocat', name: 'Site author', alias: 'Local Git Name' },
  ],
},
changelog: {
  maxCount: 10,
  repoUrl: 'https://github.com/owner/repo',
},
```

页面 frontmatter 可用 `contributors: false`、`changelog: false`、`lastUpdated: false` 单独关闭，也可用 `contributors: [额外贡献者]` 补充名单。`gitInclude` 可把同一仓库内的关联文件计入本页历史。开发时需要检查该功能，可设置 `plugins: { git: true }`；CI 必须拉取完整历史（GitHub Actions 使用 `fetch-depth: 0`）。没有 Git、浅克隆或文件无提交记录时会安全地不显示这些信息，构建不会失败。

## 评论服务

将 `features.comments` 设为 `true`，再在 `comment.provider` 中选择 `Giscus`、`Waline`、`Twikoo` 或 `Artalk`。四种客户端均按需加载，并沿用 Plume 的服务端字段：

```js
comment: {
  provider: 'Giscus',
  repo: 'owner/repo',
  repoId: 'R_...',
  category: 'General',
  categoryId: 'DIC_...',
  // inputPosition: 'top',
  // strict: true,
},
```

Waline 使用 `serverURL`，Twikoo 使用 `envId`，Artalk 使用 `server`。页面 frontmatter 设置 `comments: false` 可单独关闭评论；受密码保护的文章会在成功解锁后再加载评论。

## 项目结构

::: file-tree title="ermaozi"
- content
  - blog
  - docs
  - en
- public # **静态资源**
  - **img**
- theme # **主题实现，通常无需修改**
  - components
  - lib
  - pages
  - styles
- astro.config.mjs
- site.config.mjs
- package.json
:::

也可以直接粘贴 `tree` 命令的输出：

```file-tree title="最小项目" icon="simple"
.
├── content
│   └── index.md
├── public
│   └── logo.svg
├── theme
│   └── ...
├── astro.config.mjs
├── site.config.mjs
└── package.json
```

## 配置字段组件

:::: field-group
::: field title
@type string
@required

页面标题，同时用于导航、搜索与 SEO 元数据。
:::

::: field draft
@type boolean
@optional
@default false

启用后只在开发环境预览，不进入生产构建。
:::

::: field legacy
@type string
@deprecated

仅用于演示弃用状态。
:::
::::

## 页面字段

| 字段 | 用途 | 必填 |
| --- | --- | --- |
| `title` | 页面标题 | 是 |
| `description` | 搜索与 SEO 摘要 | 是 |
| `type` | `post`、`doc` 或 `page` | 否 |
| `order` | 文档侧栏排序 | 否 |
| `group` | 文档侧栏分组 | 否 |
| `cover` / `coverStyle` | 文章封面与当前文章的封面布局 | 否 |

没有设置 `permalink` 时，主题会根据文件路径生成稳定路由；需要长期保持 URL 时仍建议显式设置。
