---
title: Site configuration
description: Configure identity, navigation, bilingual content, and optional services.
permalink: /en/docs/guide/configuration/
translationOf: /docs/guide/configuration/
type: doc
group: Guide
order: 10
createTime: 2026-08-05
tags: [Configuration, Astro]
---

# Site configuration

Public configuration lives in `site.config.mjs`. Astro refreshes the development site after changes to names, origins, or navigation. The outer `defineSiteConfig()` call adds completion, fills safe defaults for omitted optional sections, and reports invalid origins, paths, and pagination values at startup.

## Post covers

`siteConfig.postCover` sets the default post-cover layout: `left`, `right`, `odd-left`, `odd-right`, or `top`. A post can override the layout, ratio, side width, and compact mode in frontmatter:

```yaml
cover: /img/cover.webp
coverStyle:
  layout: right
  ratio: 4/3
  width: 240
  compact: false
```

`siteConfig.profile` accepts `avatar` (plus the legacy `url` alias), `name`, `description`, `circle`, `location`, `organization`, and `layout: 'left' | 'right'`. Mobile pages reuse the same profile in the bottom sheet with taxonomy navigation. Plume's deprecated top-level or locale `avatar: { ... }` form also falls back to `profile`.

Set `profile` to `false` to remove the desktop card. As in Plume, a horizontal Tags/Categories/Archives navigation then appears above the post list, while mobile keeps those links in the extract sheet.

Side covers automatically move above the post on mobile, matching Plume.

## Page transitions

`transition.page` applies a Plume-compatible content transition during full-page navigation: `fade-slide-y` leaves first, then enters, without taking a whole-page browser snapshot that can flash the wrong theme. Documentation sidebar links preserve the shared shell and replace only the document content, while Blog, Tags, Categories, and Archives preserve the header and profile card. Page scripts are re-initialized after each partial update. `prefers-reduced-motion` disables the animation. Set `transition: false` to disable all transitions or `transition.page: false` to disable only full-page navigation.

## Appearance

`appearance` matches Plume and defaults to `true`, following the system color preference until the user makes a stored choice. Use `'dark'` for a dark default when no choice is stored, `false` to force light mode and hide every appearance switch, or `'force-dark'` to force dark mode and hide the switches. A locale-level value overrides the global setting.

`transition.appearance` accepts `fade`, `circle-clip`, `horizontal-clip`, `vertical-clip`, `skew-clip`, `blinds-vertical`, `blinds-horizontal`, `soft-blur-fade`, and `diamond-reveal`. Set it to `false`, or enable reduced motion at the OS level, to switch immediately without a View Transition. Dark pages temporarily print in light mode and restore their prior appearance afterwards.

## Locales

`locales` accepts any number of languages. Each locale uses `home` as its route prefix; place content under the matching directory or set `lang` explicitly in frontmatter. The framework generates blog, tag, category, archive, pagination-data, LLM-document, and SEO-alternate routes for every configured locale, while the language menu only lists translations that actually exist.

The frozen Plume presets for Simplified Chinese, Traditional Chinese, English, German, French, Russian, Japanese, and Korean are built in, including their short and regional language codes. Site identity, descriptions, and navigation remain locale configuration fields, and an explicitly configured label overrides its preset.

## Navbar

Each locale's canonical `navbar` field accepts Plume string links and `{ text, link, icon, badge, activeMatch, prefix, items, target, rel, noIcon }`; the old `navigation` field remains an alias. The legacy `label` and `href` names also remain supported. An internal string link inherits the target page's title, icon, and badge. `prefix` recursively resolves relative child links, with up to two visible dropdown levels. When omitted, Home, Posts, Tags, and Archives are generated from the locale's first Post collection.

```js
navbar: [
  '/docs/',
  { text: 'Blog', link: '/blog/', activeMatch: '^/(blog|article)/', icon: 'material-symbols:article-outline' },
  {
    text: 'Guide',
    prefix: '/docs/guide/',
    items: [
      { text: 'Configuration', link: 'configuration/', badge: { text: 'New', type: 'warning' } },
      { text: 'Astro', link: 'https://astro.build/', icon: 'simple-icons:astro' },
    ],
  },
]
```

External links open in a new window and show the external-link marker by default; set `noIcon: true` to hide it. Navbar icons share the Markdown icon provider and support Iconify, IconFont, Font Awesome, image URLs, and `{ svg }`.

Global options provide defaults and object-valued locale options are shallow-merged over them. A locale may independently override `logo`, `logoDark`, `profile`, `social`, `navbarSocialInclude`, `appearance`, `transition`, `footer`, `outline`, `aside`, `externalLinkIcon`, and `createTime` without inheriting another locale's navbar or labels. Use `navbar: false` in page frontmatter to hide the navbar on that page.

## Page and content options

`pageLayout` supports `home`, `posts`, `doc`, `page`, `friends`, `custom`, `false`, and custom component names, plus Plume's legacy `blog` alias for `posts`. A `posts` page may select a Post collection with `collection`; `page` keeps the navigation and standalone body; `custom`/`false` output only the Markdown body. Named component layouts replace the main content region while retaining the theme navigation, footer, and applicable collection sidebar. Put them in `theme/components/layouts/` with the layout name as the filename.

Global, locale, and page-level `outline` and `aside` values control the content outline. `externalLinkIcon` is enabled by default and can be disabled per page; the old `externalLink` name remains compatible. `createTime: 'only-posts'` limits creation dates to posts and post lists, while `false` hides them everywhere. Set `plugins.nprogress: false` to disable the top progress bar during internal navigation.

## Layout slots

Add an `.astro` or `.vue` file named after a Plume slot under `theme/components/slots/`, for example `doc-top.astro` or `DocTop.astro`. Components receive the currently available `lang`, `route`, `entry`, `layout`, and `posts` props. A missing component produces no extra DOM.

Supported names include:

- General: `layout-top`, `layout-bottom`, `custom-content`, `footer-content`, `bulletin-content`, and `not-found`.
- Navigation: every `nav-bar-*-before/after` and `nav-screen-*-before/after` slot from Plume.
- Documents and pages: `page-top/bottom`, `doc-top/bottom`, `doc-before/after`, `doc-content-before`, `doc-footer-before`, all `doc-title-*` and `doc-meta-*` positions, `sidebar-nav-before/after`, `aside-top/bottom`, and `aside-outline-before/after`.
- Posts: `posts-top/bottom`, `posts-aside-top/bottom`, `posts-extract-before/after`, every `posts-post-list-*` hook, plus all tag, category, and archive positions.

The legacy `FooterContent.astro` and `BulletinContent.astro` overrides remain compatible; a same-named slot component takes precedence.

## Automatic frontmatter

`autoFrontmatter` is enabled by default. Before development, checks, or builds, a new Markdown file receives a filename-derived `title`, filesystem `createTime`, and random eight-character `permalink` only when those fields are missing; the result is written back to the source as in Plume. Use `{ permalink: 'filepath' }` for stable path-derived URLs. When the optional `pinyin-pro` package is installed, Chinese paths are transliterated.

Global and collection-level options can independently disable `title`, `createTime`, or `permalink`, and may provide a synchronous or asynchronous `transform(data, context, locale)`. `context` contains `filepath`, `relativePath`, and body `content`; collection settings take precedence. Set `autoFrontmatter: false` to disable source write-back entirely.

## Pagination

`siteConfig.pagination` accepts `false`, a page size, or `{ perPage: number }`. Both the starter and Plume default to 15 posts per page.

`siteConfig.categoriesExpand` controls the initially expanded category depth and accepts a number or `'deep'`. Directory names may use an `01.Name` prefix for ordering; the prefix stays hidden while every category level remains available in the category page and post breadcrumbs.

`siteConfig.tagsTheme` accepts `'colored'`, `'gray'`, or `'brand'`; colored mode uses Plume's complete 18-color preset. `siteConfig.meta` independently controls `tags`, `readingTime`, `wordCount`, and `createTime`, with `'short'` and `'long'` date formats. Set it to `false` to hide all metadata; a collection may still re-enable individual fields. `postCover: false` disables list covers. A page may set `readingTime: false` to hide its reading statistics.

`siteConfig.readingTime` matches Plume's reading-time plugin and accepts `false`, `wordPerMinute`, and `locales` keyed by locale path. Each locale may override `word` with `$word`, `time` with `$time`, and `less1Minute`; otherwise the frozen Chinese, English, Traditional Chinese, German, French, Russian, Japanese, and Korean presets are used.

## Post and doc collections

Each locale accepts any number of Plume-style collections. `dir` is relative to that locale's content directory:

```js
locales: {
  'en-US': {
    home: '/en/',
    collections: [
      { type: 'post', dir: 'blog', title: 'Blog' },
      { type: 'post', dir: 'news', title: 'News', link: '/updates/' },
      { type: 'doc', dir: 'docs', title: 'Docs', sidebar: 'auto' },
    ],
  },
},
```

Post collections support `include`, `exclude`, `pagination`, `postList`, `link`, `linkPrefix`, independent tag/category/archive switches, paths and labels, plus collection-level `tagsTheme`, `meta`, `postCover`, `profile`, `social`, `categoriesExpand`, and `categoriesTransform`. As in Plume, `categoriesTransform` receives each post's outer-to-inner `{ id, name, sort }[]` category chain; its result is shared by cards, breadcrumbs, statistics, and the category tree. Generated pages, pagination JSON, sitemap entries, and language switching use the resolved collection routes.

When migrating an older Plume site, deprecated top-level `blog`, `article`, and `notes` settings plus locale-level `notes` are converted into collections at startup; a non-empty `collections` array at the target level takes precedence. Legacy `profile.url` is also normalized to `profile.avatar` globally, per locale, and in Post collections. These aliases are migration aids only; new configuration should use `collections` and `profile.avatar` directly.

Doc collections support recursive directory and numeric-prefix navigation through `sidebar: 'auto'`; `sidebarCollapsed` controls initial group state and `sidebarScrollbar` controls the scrollbar. A manual array accepts strings or `{ text, link, prefix, icon, badge, collapsed, items }`, including scoped `items: 'auto'` and `link: '---'` separators.

Plume's global multi-sidebar form is also supported: `sidebar: { '/docs/': 'auto', '/guide/': [...] }`, with longest-prefix matching. A value may also use `{ items, prefix }`; page frontmatter can force a configured sidebar with `sidebar: '/guide/'` or disable it with `sidebar: false`. Sidebar items retain the legacy `dir` alias plus `target` and `rel`.

`site.config.mjs` already imports `defineSiteConfig` from `./theme/config.mjs`. It preserves the supplied object reference while filling defaults required by the theme runtime. Theme integrations may also use `defineThemeConfig`, `defineNavbarConfig`, `defineCollections`, and `defineCollection` from `theme/node.ts`; the other helpers still return their input unchanged.

Legacy Plume options under `plugins.copyCode`, `plugins.shiki`, `plugins.readingTime`, `plugins.comment`, `plugins.watermark`, `plugins.replaceAssets`, `plugins.llmstxt`, `plugins.markdownPower`, `plugins.markdownChart`, `plugins.markdownImage`, `plugins.markdownInclude`, `plugins.markdownMath`, `plugins.search`, and `plugins.docsearch` fall back to their flat equivalents. Flat or `markdown` options win when both forms exist. `markdown.image` supports Plume's complete `figure`, `lazyload`, `mark`, `size`, `legacySize`, and `obsidianSize` option set; `codeHighlighter: false` falls back to plain fenced code. `plugins.markdownPower: false` disables only that enhancement group, leaving image, math, include, hint, and chart features under their own switches.

The `plugins.seo` object supports Plume's `hostname`, `author`, `restrictions`, `autoDescription`, `fallBackImage`, `twitterID`, `isArticle`, `ogp`, `jsonLd`, `customHead`, and `canonical`; `false` disables generated Open Graph, Twitter Card, and JSON-LD data. Twitter/X handles are resolved from `social` first, with `twitterID` kept only as a compatibility fallback. `plugins.sitemap` supports `hostname`, `extraUrls`, `excludePaths`, `sitemapFilename`, `sitemapXSLFilename`, `sitemapXSLTemplate`, `changefreq`, `modifyTimeGetter`, `devServer`, `devHostname`, and `xmlNameSpace`; `false` removes sitemap output and its robots.txt entry.

Page frontmatter `head` accepts Plume/VuePress-style `[tag, attributes, content?]` tuples for `meta`, `link`, `style`, `script`, and other valid head tags. `description`, `keywords`, `robots`, and `canonical` override generated values; `robots: noindex` also excludes the page from Pagefind and the sitemap. Partial navigation synchronizes JSON-LD and theme-managed head nodes, and falls back to a full navigation when the target changes its shell, sidebar, or custom head. `script` and `style` contents are emitted verbatim, so use only fully trusted content.

Local search uses Pagefind. `plugins.search.isSearchable(page)` controls indexing, while `disableQueryPersistence` and `locales` remain effective. Plume's `miniSearch` tokenizer options have no Pagefind equivalent, so their types are retained for migration but they do not alter Pagefind tokenization. Plume's top-level `cache` and `configFile` options control VuePress compilation caching and configuration loading; Astro has no matching runtime stage, so these fields are type-only migration shims and should be removed from migrated configuration.

## Trusted chart scripts

As in Plume, `chartjs`, `echarts`, `flowchart`, `markmap`, `plantuml`, and `mermaid` are disabled by default and enabled independently under `markdown`. `plantuml` may instead be an array of `@mdit/plugin-plantuml` options to limit syntax, change the server, or select an output format. This starter explicitly enables all six for its showcase.

`js` and `javascript` configurations for Chart.js and ECharts are disabled by default. Enable script execution and allowlist each trusted Markdown file only when you control its contents:

```js
markdown: {
  DANGEROUS_ALLOW_SCRIPT_EXECUTION: true,
  DANGEROUS_SCRIPT_EXECUTION_ALLOWLIST: ['docs/guide/chart-demo.md'],
}
```

The allowlist also accepts `'*'`, but that is not recommended for sites containing user content. Prefer `json` for ordinary charts.

## Media embeds

As in Plume, `acfun`, `bilibili`, `youtube`, `pdf`, `audioReader`, and `artPlayer` are disabled by default and enabled independently under `markdown`. This starter explicitly enables all six for its showcase. Obsidian PDF and video embeds also depend on `pdf` and `artPlayer`, respectively.

```js
markdown: {
  youtube: true,
  pdf: { pdfjsUrl: 'https://static.pengzhanbo.cn/pdfjs/' },
  audioReader: true,
  artPlayer: true,
}
```

Desktop browsers embed PDFs directly, while mobile browsers lazily load PDF.js. `pdfjsUrl` must point to a PDF.js distribution containing `web/viewer.html`. ArtPlayer supports Plume's MP4, MP3, WebM, Ogg, DASH, HLS, TS, FLV, MKV, MOV, and OGV types.

## Markdown icons

Content uses Plume's `::name =size /color::` syntax, for example `::mdi:home =24 /#336f87::`. Iconify embeds icons from installed collections and lazily loads other collections from the official Iconify API in the browser. The legacy `:[name size/color]:` form remains compatible.

```js
markdown: {
  icon: { provider: 'iconify', prefix: 'mdi' },
}
```

Set `provider` to `iconfont` or `fontawesome` and use `assets` for one or more `.css` / `.js` URLs. Font Awesome also accepts the built-ins `fontawesome` and `fontawesome-with-brands`, while `::fontawesome fas:house 2xl::` overrides the provider for one icon.

`markdown.repl` independently enables `go`, `kotlin`, `rust`, and `python`, while `theme` selects one Shiki theme or a `{ light, dark }` pair. Editable REPLs lazily load the highlighter and refresh syntax highlighting as you type. The first three submit code to Plume's public playground services; Python lazily loads Pyodide and executes locally in the browser. Run only trusted, lightweight examples. `markdown.codeTree` also accepts `{ height, icon }` defaults; attributes on an individual container take precedence.

## Social links and footer

`social` uses Plume's array shape and accepts built-in Simple Icons names, the `twitter` / `weibo` compatibility aliases, and custom SVG. `navbarSocialInclude` filters only the desktop navbar and its extra menu; mobile navigation and the blog profile retain the full list.

```js
social: [
  { icon: 'github', link: 'https://github.com/example' },
  { icon: 'weibo', link: 'https://weibo.com/example', ariaLabel: 'Weibo' },
  { icon: { svg: '<svg>...</svg>', name: 'custom' }, link: 'https://example.com' },
],
navbarSocialInclude: ['github', 'weibo'],
footer: {
  message: 'Power by <a href="https://astro.build/">Astro</a>',
  copyright: 'Copyright © 2026 Example',
},
```

Set the global `footer` to `false` to hide it site-wide, or use `footer: false` in page frontmatter to hide it only on that page.

## Friends pages

Set `pageLayout: friends` in frontmatter (the legacy `friends: true` also works) to enable Plume's friends layout. `cols` controls the desktop column limit and `contentPosition` places Markdown before or after the lists. Both `list` and `groups` support avatars, descriptions, location, organization, social links, and separate light/dark colors. See `/en/friends/` for a complete example.

## Bulletin

`bulletin` supports the `top-left`, `top-right`, `bottom-left`, `bottom-right`, and `center` positions plus the `always`, `session`, and `once` dismissal lifetimes. `enablePage` accepts a boolean or a function receiving `{ path }`; when `id` is omitted, the theme derives a stable identifier from the configuration. The starter bulletin appears only on `/landing/`.

## Search providers

`llmstxt: true` generates `/llms.txt`, `/llms-full.txt`, each page's Plume-style `index.md`, the legacy `/raw/` route, and the page-context menu beside document titles. As in Plume, the feature defaults to disabled; `false` removes the files and menu together, while page frontmatter `llmstxt: false` excludes only that page. Object form supports `llmsTxt`, `llmsFullTxt`, `llmsPageTxt`, `stripHTML`, `locale`, `domain`, `linkExtension`, `filter`, `transformMarkdown`, `llmsTxtTemplate`, and `llmsTxtTemplateGetter`; `locale` defaults to the root locale and must be set to `'all'` for every language. `plugins.llmstxt` remains an alias, though the top-level field is preferred.

The default Pagefind index is generated at build time and needs no external service:

```js
search: {
  provider: 'local',
  locales: {
    '/en/': { placeholder: 'Search documentation' },
  },
}
```

Local-search locales may override `placeholder`, `buttonText`, `resetButtonTitle`, `backButtonTitle`, `noResultsText`, and the footer keyboard labels; omitted values use the same presets as Plume.

Large documentation sites can switch to the same Algolia DocSearch adapter used by Plume. Its client and stylesheet load only when this provider is selected, and the adapter adds the current language as a `lang` facet:

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

The adapter also accepts DocSearch `indices`, `searchParameters`, `translations`, `keyboardShortcuts`, and `indexBase`. `apiKey` must be a public search-only key, never an admin key.

## Asset URL replacement

`replaceAssets` is disabled by default. A production build can rewrite images under `/images/` and video, audio, subtitle, or PDF URLs under `/medias/` to a CDN without modifying the source Markdown, HTML, CSS, or JavaScript files:

```js
replaceAssets: process.env.NODE_ENV === 'production'
  ? { image: 'https://images.example.com', media: 'https://media.example.com' }
  : false,
```

A string or function replaces every built-in asset type. `{ find, replacement }`, rule arrays, and a `rules` property provide custom matching. A string `find` beginning with `^` or ending with `$` is treated as a regular expression; other strings match the start or end of a URL. As in Plume, built-in rules only recognize known extensions under `/images/` and `/medias/`.

## Build-time image dimensions

`markdown.imageSize` is disabled by default. Set it to `true` or `'local'` to read local images during production builds and add intrinsic `width` and `height` attributes to content images; use `'all'` to inspect remote images too. The legacy `plugins.markdownPower.imageSize` form remains supported:

```js
markdown: {
  imageSize: 'local',
},
```

Existing dimensions are preserved, and a single missing dimension is derived from the original ratio. Only built output changes; Markdown sources remain untouched. Remote mode adds network work and waits up to three seconds for each unreadable URL, so prefer local mode unless remote sizing is required. For parser safety, automatic sizing is temporarily skipped for AVIF, HEIF, HEIC, JXL, and ICNS files; the images themselves remain usable.

## Content encryption

Like Plume, `encrypt` supports a site-wide gate, administrator passwords, and page rules matched by Markdown file, directory, request path, or regular expression. A password may be one string or an array; unlocking a shared directory or rule remains valid for the current session:

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

Individual pages still accept `password` and `passwordHint` in frontmatter. A partial `::: encrypt` container accepts either its own password or an administrator password, while `markdown.encrypt: { password: 'default password' }` supplies a default. Page and partial content use PBKDF2 and AES-GCM at build time, but a static-site gate is not a substitute for server-side access control; do not ship sensitive data in a public build. Replace or remove every demonstration password before using the theme for real content.

## Git contributors and changelog

Production builds derive each Markdown page's last-updated time and contributors from Git history. Development skips `git log` by default. Contributors appear as inline names by default, or as an in-content block with avatars and links. As in Plume, the changelog is disabled by default:

```js
lastUpdated: { formatOptions: { dateStyle: 'short', timeStyle: 'short' } },
contributors: {
  mode: 'block', // or 'inline'
  info: [
    { username: 'octocat', name: 'Site author', alias: 'Local Git Name' },
  ],
},
changelog: {
  maxCount: 10,
  repoUrl: 'https://github.com/owner/repo',
},
```

Frontmatter can disable one page with `contributors: false`, `changelog: false`, or `lastUpdated: false`; `contributors: [extra contributor]` supplements the generated list. `gitInclude` adds related files from the same repository to the page history. Set `plugins: { git: true }` when testing in development. CI must fetch complete history (`fetch-depth: 0` in GitHub Actions). Missing Git, shallow history, and untracked files degrade to no metadata without failing the build.

## Comment providers

Set `features.comments` to `true`, then choose `Giscus`, `Waline`, `Twikoo`, or `Artalk` in `comment.provider`. All four clients load on demand and use Plume's server fields:

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

Waline uses `serverURL`, Twikoo uses `envId`, and Artalk uses `server`. Set `comments: false` in page frontmatter to disable comments on one page. Password-protected posts load comments only after a successful unlock.

## Project structure

::: file-tree title="ermaozi"
- content
  - blog
  - docs
  - en
- public
  - img
- theme # Theme internals; usually leave unchanged
  - components
  - lib
  - pages
  - styles
- astro.config.mjs
- site.config.mjs
- package.json
:::

Use `icon="simple"` on a file-tree container or fence for generic file/folder icons. The default `colored` mode selects local VS Code icons by folder name and file type; set the global default with `markdown.fileTree.icon`.

## Page fields

| Field | Purpose | Required |
| --- | --- | --- |
| `title` | Page title | Yes |
| `description` | Search and SEO summary | Yes |
| `type` | `post`, `doc`, or `page` | No |
| `order` | Documentation order | No |
| `group` | Documentation group | No |
| `cover` / `coverStyle` | Post cover and per-post cover layout | No |

Without a `permalink`, the theme derives a stable route from the file path. Set one explicitly when the URL must remain unchanged long term.
