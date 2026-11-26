import assert from 'node:assert/strict'
import { access, readFile, readdir } from 'node:fs/promises'
import test from 'node:test'

const visibleText = html => html.replace(/<[^>]+>/g, '')
const outsideFences = markdown => markdown.replace(/(^|\n)\s*(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\s*\2(?=\n|$)/gu, '\n')

test('build contains generic blog, docs, enhanced Markdown, search, and crawler files', async () => {
  const [home, englishHome, landing, hero, banner, singleHero, effects, pageLayout, customLayout, post, showcase, encryptedPage, rawShowcase, plumeShowcase, docsHome, docs, configuration, rawDocs, plumeDocs, categories, robots, sitemap, llms, routeSource] = await Promise.all([
    readFile('dist/index.html', 'utf8'),
    readFile('dist/en/index.html', 'utf8'),
    readFile('dist/landing/index.html', 'utf8'),
    readFile('dist/hero/index.html', 'utf8'),
    readFile('dist/banner/index.html', 'utf8'),
    readFile('dist/single-hero/index.html', 'utf8'),
    readFile('dist/effects/index.html', 'utf8'),
    readFile('dist/page-layout/index.html', 'utf8'),
    readFile('dist/custom-layout/index.html', 'utf8'),
    readFile('dist/blog/getting-started/index.html', 'utf8'),
    readFile('dist/blog/markdown-showcase/index.html', 'utf8'),
    readFile('dist/blog/encrypted-example/index.html', 'utf8'),
    readFile('dist/raw/blog/markdown-showcase.md', 'utf8'),
    readFile('dist/blog/markdown-showcase/index.md', 'utf8'),
    readFile('dist/docs/index.html', 'utf8'),
    readFile('dist/docs/guide/content/index.html', 'utf8'),
    readFile('dist/docs/guide/configuration/index.html', 'utf8'),
    readFile('dist/raw/docs/guide/content.md', 'utf8'),
    readFile('dist/docs/guide/content/index.md', 'utf8'),
    readFile('dist/blog/categories/index.html', 'utf8'),
    readFile('dist/robots.txt', 'utf8'),
    readFile('dist/sitemap.xml', 'utf8'),
    readFile('dist/llms-full.txt', 'utf8'),
    readFile('theme/pages/[...path].astro', 'utf8'),
  ])

  assert.match(home, /ermaozi/)
  assert.match(home, /<div id="nprogress" aria-hidden="true" hidden><div class="bar"><\/div><\/div>/)
  assert.match(home, /class="vp-profile"/)
  assert.match(home, /data-page-transition/)
  assert.doesNotMatch(home, /@view-transition \{ navigation: auto; \}/)
  assert.match(home, /class="posts-modal" role="dialog"/)
  assert.match(home, /class="posts-nav"/)
  assert.match(home, /vp-tag-color-\d+/)
  assert.match(englishHome, /ermaozi Demo/)
  assert.match(landing, /class="vp-home-doc-hero has-image"/)
  assert.match(landing, /class="vp-home-box vp-home-features"/)
  assert.match(landing, /class="vp-home-box vp-home-text-image"/)
  assert.match(landing, /class="vp-home-box vp-home-profile"/)
  assert.match(landing, /class="vp-home-box vp-home-announcement"/)
  assert.match(landing, /data-user-home-component/)
  assert.match(landing, /class="vp-home-box vp-home-custom"/)
  assert.match(landing, /<div class="vp-posts home-posts" vp-posts>/)
  assert.doesNotMatch(landing, /<div[^>]+(?:type|index|onlyOnce)="[^"]+"[^>]+class="vp-home-box/)
  assert.match(landing, /class="vp-bulletin preset top-right border"/)
  assert.match(landing, /data-bulletin-id="[a-f0-9]{8}" data-bulletin-lifetime="session"/)
  assert.doesNotMatch(home, /class="vp-bulletin/)
  assert.match(landing, /<div[^>]*class="vp-link no-icon vp-home-feature">/)
  assert.match(landing, /<div class="grid-3 item"><div[^>]*class="vp-link no-icon vp-home-feature">/)
  assert.match(hero, /class="vp-home-hero full first tint-plate"/)
  assert.match(hero, /data-tint-plate/)
  assert.match(banner, /class="theme-plume vp-layout footer-no-border"/)
  assert.match(banner, /--vp-banner-mask-light:0\.15;--vp-banner-mask-dark:0\.65/)
  assert.match(singleHero, /class="vp-home-hero full once first tint-plate"/)
  assert.doesNotMatch(singleHero, /class="vp-sign-down"/)
  assert.match(singleHero, /class="theme-plume vp-layout footer-no-border"/)
  assert.match(effects, /effect-config-pixel/)
  assert.match(effects, /effect-config-liquid/)
  assert.match(effects, /effect-config-dot/)
  assert.match(effects, /effect-config-orb/)
  assert.match(pageLayout, /<html class="layout-page"/)
  assert.match(pageLayout, /<main id="VPContent" class="vp-content"><div class="vp-page"><article class="vp-doc plume-content external-link-icon-enabled" data-pagefind-body><h1 id="专页布局示例"/)
  assert.doesNotMatch(pageLayout, /vp-doc-container|vp-doc-title|vp-doc-meta|vp-breadcrumb|vp-page-context-menu|data-comment-provider/)
  assert.match(customLayout, /<html class="layout-Minimal"/)
  assert.match(customLayout, /<div class="theme-plume vp-layout">/)
  assert.match(customLayout, /<header class="vp-nav/)
  assert.match(customLayout, /<main id="VPContent" class="vp-content"><article class="custom-layout-example plume-content" lang="zh-CN"><h1 id="自定义布局示例"/)
  assert.match(customLayout, /<meta data-ermaozi-managed-head name="theme-layout" content="custom">/)
  assert.match(customLayout, /<meta name="description" content="此描述由 head 配置覆盖。">/)
  assert.match(customLayout, /<meta name="keywords" content="custom-layout,head">/)
  assert.match(customLayout, /<meta data-ermaozi-managed-head property="og:description" content="此描述由 head 配置覆盖。">/)
  assert.doesNotMatch(customLayout, /<meta name="description" content="验证 Plume 自定义布局组件名的迁移能力。">/)
  assert.match(customLayout, /<footer class="vp-footer/)
  assert.doesNotMatch(customLayout, /vp-doc-container|vp-doc-title|vp-doc-meta|vp-breadcrumb|vp-page-context-menu|data-comment-provider/)
  assert.match(routeSource, /userLayoutName \? \([\s\S]*class:list=\{\['vp-content', \{ 'has-sidebar': hasSidebar \}\]\}/)
  assert.match(post, /https:\/\/example\.com\/blog\/getting-started\//)
  assert.match(post, /<title>ermaozi 快速开始 \| 博客 \| ermaozi<\/title>/)
  assert.match(post, /property="article:published_time" content="2026-08-05T00:00:00.000Z"/)
  assert.match(post, /"datePublished":"2026-08-05T00:00:00.000Z"/)
  assert.match(post, /"@type":"BreadcrumbList","itemListElement":\[\{"@type":"ListItem","position":1,"name":"首页","item":"https:\/\/example\.com\/"\},\{"@type":"ListItem","position":2,"name":"博客","item":"https:\/\/example\.com\/blog\/"\},\{"@type":"ListItem","position":3,"name":"指南","item":"https:\/\/example\.com\/blog\/categories\/\?id=0941aa"\},\{"@type":"ListItem","position":4,"name":"ermaozi 快速开始","item":"https:\/\/example\.com\/blog\/getting-started\/"\}\]/)
  assert.doesNotMatch(post, /data-comment-provider/)
  assert.match(post, /hreflang="en-US" href="https:\/\/example\.com\/en\/blog\/getting-started\/"/)
  assert.match(post, /vp-navbar-translations/)
  assert.match(showcase, /class="vp-doc plume-content external-link-icon-enabled"/)
  assert.match(showcase, /<mark>重点标记<\/mark>/)
  assert.match(showcase, /class="vp-annotation ignore-header bottom"/)
  assert.doesNotMatch(showcase, /\[\+静态站点\]:/)
  assert.match(showcase, /vp-collapse-header/)
  assert.match(showcase, /vp-tab-nav/)
  assert.match(showcase, /class="mermaid-wrapper"[\s\S]*class="mermaid-content"/)
  assert.match(showcase, /class="vp-timeline-item success line-dashed between between-right" data-timeline-between="right"/)
  assert.match(showcase, /class="has-icon vp-timeline-line"[\s\S]*data-provider="iconify"/)
  assert.match(showcase, /class="vp-timeline-time">第一步/)
  assert.match(showcase, /class="vp-image-card center"/)
  assert.match(showcase, /class="vp-card-masonry" data-masonry-cols="\{&quot;sm&quot;:1,&quot;md&quot;:2,&quot;lg&quot;:3\}"/)
  assert.match(showcase, /class="vp-steps"/)
  assert.match(showcase, /class="window-wrapper has-title"/)
  assert.match(showcase, /class="vp-code-tree" data-code-tree/)
  assert.match(showcase, /data-code-file="src\/config\.ts"/)
  assert.match(showcase, /class="code-tree-title" title="目录导入示例"/)
  assert.match(showcase, /data-code-file="src\/locale\.ts"/)
  assert.match(showcase, /data-title="src\/locale\.ts"/)
  assert.match(showcase, /code-tree-example/)
  assert.match(showcase, /class="vp-copyright"/)
  assert.match(showcase, /class="vp-link no-icon">Site Author<\/span>/)
  assert.match(showcase, /href="https:\/\/example\.com\/blog\/markdown-showcase\/" target="_blank" rel="noopener noreferrer"[^>]*class="vp-link link no-icon vp-external-link-icon"/)
  assert.match(showcase, /署名 4\.0 国际 \(CC-BY-4\.0\)/)
  assert.match(showcase, /class="last-updated"/)
  assert.match(showcase, /class="vp-link link pager-link (?:prev|next)"/)
  assert.match(showcase, /class="title"><span>[^<]+<\/span><\/span>/)
  assert.match(showcase, /class="vp-npm-badge-group"/)
  assert.match(showcase, /img\.shields\.io\/npm\/v\/astro/)
  assert.match(showcase, /img\.shields\.io\/npm\/v\/astro\?[^" ]*label=Astro/)
  assert.match(showcase, /img\.shields\.io\/npm\/dm\/astro\?[^" ]*label=monthly/)
  assert.doesNotMatch(showcase, /<NpmBadgeGroup/)
  assert.match(showcase, /class="vp-qrcode card center" data-qrcode/)
  assert.match(showcase, /data-qrcode-logo="\/img\/logo\.svg" data-qrcode-logo-size="0\.25"/)
  assert.match(showcase, /data-encrypt-snippet/)
  assert.match(showcase, /被引入的 Markdown/)
  assert.doesNotMatch(showcase, /data-title="import-example\.js"/)
  assert.match(showcase, /class="line highlighted"[^>]*>.*renderer/s)
  assert.match(visibleText(showcase), /pnpm add --save-dev astro/)
  assert.match(visibleText(showcase), /yarn add --dev astro/)
  assert.doesNotMatch(showcase, /局部加密验证内容/)
  assert.match(rawShowcase, /Encrypted content is omitted/)
  assert.doesNotMatch(rawShowcase, /局部加密验证内容/)
  assert.equal(plumeShowcase, rawShowcase)
  assert.match(encryptedPage, /data-page-encrypt/)
  assert.doesNotMatch(encryptedPage, /class="vp-footer/)
  assert.doesNotMatch(encryptedPage, /整页加密验证内容/)
  assert.doesNotMatch(encryptedPage, /解锁之后/)
  assert.doesNotMatch(showcase, /加密片段标题/)
  await assert.rejects(access('dist/raw/blog/encrypted-example.md'))
  await assert.rejects(access('dist/blog/encrypted-example/index.md'))
  assert.match(docs, /vp-sidebar/)
  assert.match(docsHome, /<h1 class="page-title">文档中心<span> <\/span><span class="vp-badge tip"[^>]*>开始<\/span><\/h1>/)
  assert.match(docs, /<title>内容能力 \| 文档中心 \| ermaozi<\/title>/)
  assert.match(docs, /<meta data-ermaozi-managed-head property="og:type" content="article">/)
  assert.match(docs, /"articleSection":"文档中心"/)
  assert.match(docs, /"@type":"BreadcrumbList","itemListElement":\[\{"@type":"ListItem","position":1,"name":"首页","item":"https:\/\/example\.com\/"\},\{"@type":"ListItem","position":2,"name":"文档中心","item":"https:\/\/example\.com\/docs\/"\},\{"@type":"ListItem","position":3,"name":"指南"\},\{"@type":"ListItem","position":4,"name":"内容能力","item":"https:\/\/example\.com\/docs\/guide\/content\/"\}\]/)
  assert.match(docs, /<span property="item" typeof="WebPage"[^>]*class="vp-link no-icon breadcrumb">指南<\/span>/)
  assert.match(docs, /code-block-title/)
  assert.match(docs, /line-numbers-mode/)
  assert.match(docs, /class="line highlighted"/)
  assert.match(docs, /class="vp-code [^"]*has-diff[^"]*has-highlighted[^"]*has-focused-lines"/)
  assert.match(docs, /class="line has-focus"/)
  assert.match(docs, /class="line diff remove"/)
  assert.match(docs, /class="line diff add"/)
  assert.match(docs, /class="line highlighted warning"/)
  assert.match(docs, /class="line highlighted error"/)
  assert.match(docs, /class="highlighted-word"/)
  assert.match(docs, /has-collapsed-lines collapsed/)
  assert.doesNotMatch(docs, /\[!code (?:focus|word|warning|error|highlight|\+\+|--)/)
  assert.match(docs, /class="footnotes"/)
  assert.match(docs, /data-copy-table="md"/)
  assert.match(docs, /class="hint-container info">\s*<p class="hint-container-title">相关信息<\/p>/)
  assert.match(docs, /class="hint-container note">\s*<p class="hint-container-title">注<\/p>/)
  assert.match(docs, /class="hint-container tip">\s*<p class="hint-container-title"><strong>自定义标题<\/strong><\/p>/)
  assert.match(docs, /class="hint-container warning">[\s\S]*class="hint-container important"/)
  assert.match(docs, /class="hint-container caution">\s*<p class="hint-container-title">警告<\/p>[\s\S]*旧版 <code>danger<\/code>/)
  assert.match(docs, /<details class="hint-container details"><summary><strong>展开详情<\/strong><\/summary>/)
  assert.match(docs, /GitHub Alert 使用同一套提示样式/)
  assert.match(docs, /data-copy-page="\/docs\/guide\/content\/index\.md"/)
  assert.match(docs, /class="[^\"]*twoslash[^\"]*lsp/)
  assert.match(docs, /twoslash-hover/)
  assert.match(configuration, /class="vp-file-tree-info folder expanded"/)
  assert.match(configuration, /class="vp-file-tree-info file focus"/)
  assert.match(configuration, /class="file-tree-icon vp-icon is-svg"/)
  assert.match(configuration, /class="comment"># <strong>静态资源<\/strong>/)
  assert.match(configuration, /data-copy-tree/)
  assert.match(configuration, /class="vp-field-group"/)
  assert.match(configuration, /class="vp-field required"/)
  assert.match(configuration, /class="vp-field optional"/)
  assert.match(configuration, /class="vp-field deprecated"/)
  assert.match(rawDocs, /^# 内容能力/)
  assert.doesNotMatch(rawDocs, /^# 内容能力\s+# 内容能力/)
  assert.equal(plumeDocs, rawDocs)
  assert.match(categories, /指南/)
  assert.match(categories, /data-category-id="e760f2"/)
  assert.match(categories, /data-category-id="3e30c5"/)
  assert.match(categories, />写作<\/span>/)
  assert.match(categories, />基础<\/span>/)
  assert.doesNotMatch(categories, />0[23]\.(?:写作|基础)<\/span>/)
  assert.match(robots, /User-agent: \*/)
  assert.match(sitemap, /https:\/\/example\.com\/blog\/getting-started\//)
  assert.match(sitemap, /hreflang="en-US"/)
  assert.match(llms, /ermaozi/)
  assert.doesNotMatch(llms, /Alternate Language Versions/)
  assert.doesNotMatch(outsideFences(llms), /(?:^|\n)\s*<(?:RepoCard|Swiper|VPButton)\b/m)
  assert.doesNotMatch(llms, /整页加密验证内容|局部加密验证内容/)
  assert.doesNotMatch(home, /草稿预览/)
  assert.doesNotMatch(sitemap, /draft-preview/)
  assert.doesNotMatch(llms, /草稿预览|Draft preview/)
  await assert.rejects(access('dist/en/llms-full.txt'))
  await assert.rejects(access('dist/en/docs/guide/content/index.md'))
  await assert.rejects(access('dist/blog/draft-preview/index.html'))
  await assert.rejects(access('dist/en/blog/draft-preview/index.html'))
})

test('production post data preserves Plume sticky and excerpt semantics', async () => {
  const data = JSON.parse(await readFile('dist/posts.json', 'utf8'))
  const posts = data['zh-CN']['zh-CN:blog']
  assert.equal(posts.some(post => post.draft || post.route === '/blog/draft-preview/'), false)
  const gettingStarted = posts.find(post => post.route === '/blog/getting-started/')
  assert.equal(gettingStarted.sticky, 10)
  assert.match(gettingStarted.excerpt, /只需要 Node\.js/)
  assert.doesNotMatch(gettingStarted.excerpt, /<h1/)
})

test('friends layout contains grouped Plume-compatible cards', async () => {
  const [friends, englishFriends] = await Promise.all([
    readFile('dist/friends/index.html', 'utf8'),
    readFile('dist/en/friends/index.html', 'utf8'),
  ])
  assert.match(friends, /<html class="layout-friends"/)
  assert.match(friends, /class="vp-friends cols-large" style="--vp-friends-cols:3"/)
  assert.match(friends, /class="vp-doc plume-content before"/)
  assert.match(friends, /class="vp-friends-group"/)
  assert.match(friends, /class="vp-friend only-title no-desc"/)
  assert.match(friends, /class="location"/)
  assert.match(friends, /class="organization"/)
  assert.match(friends, /class="vp-social-links"/)
  assert.match(friends, /light-dark\(#eaf5f8, #18343f\)/)
  assert.match(englishFriends, /class="vp-doc plume-content after"/)
})

test('build bundles the frozen Plume Inter font locally', async () => {
  const files = await readdir('dist/_astro')
  assert.equal(files.filter(file => /^inter-(?:roman|italic)-.+\.woff2$/.test(file)).length, 14)
})

test('all frozen Plume comment providers remain available as lazy chunks', async () => {
  const [packageJson, files, component, page, schema] = await Promise.all([
    readFile('package.json', 'utf8').then(JSON.parse),
    readdir('dist/_astro'),
    readFile('theme/components/vue/Comments.vue', 'utf8'),
    readFile('theme/pages/[...path].astro', 'utf8'),
    readFile('theme/content.config.ts', 'utf8'),
  ])
  assert.equal(packageJson.dependencies.giscus, '1.6.0')
  assert.equal(packageJson.dependencies['@waline/client'], '3.13.0')
  assert.equal(packageJson.dependencies.artalk, '2.9.1')
  assert.equal(packageJson.dependencies.twikoo, '1.7.2')
  const commentChunks = await Promise.all(files.filter(file => file.endsWith('.js')).map(file => readFile(`dist/_astro/${file}`, 'utf8')))
  const code = commentChunks.join('\n')
  for (const provider of ['Artalk', 'Giscus', 'Twikoo', 'Waline']) assert.match(code, new RegExp(provider))
  assert.match(component, /ar be bg ca cs da de en eo es eu fa fr gr hbs he hu id it ja kh ko nl pl pt ro ru th tr uk uz vi zh-CN zh-HK zh-TW/)
  assert.match(component, /props\.lang === 'zh-CN' \? 'zh-CN' : 'en'/)
  assert.match(component, /pageview\.pageviewCount\(\{ serverURL: String\(props\.config\.serverURL\), path: props\.identifier \}\)/)
  assert.match(component, /provider === 'Artalk' \? undefined : 'comment'/)
  assert.match(component, /'vp-comment'/)
  assert.match(page, /pageview: entry\?\.data\.pageview \?\? commentConfig\.pageview/)
  assert.match(schema, /pageview: z\.boolean\(\)\.optional\(\)/)
})

test('local and frozen Algolia search providers remain independently available', async () => {
  const [packageJson, home, files, header] = await Promise.all([
    readFile('package.json', 'utf8').then(JSON.parse),
    readFile('dist/index.html', 'utf8'),
    readdir('dist/_astro'),
    readFile('theme/components/Header.astro', 'utf8'),
  ])
  assert.equal(packageJson.dependencies['@docsearch/js'], '4.6.3')
  assert.equal(packageJson.dependencies['@docsearch/css'], '4.6.3')
  assert.match(home, /id="local-search"/)
  assert.doesNotMatch(home, /docsearch-container/)
  const module = files.find(file => /^AlgoliaSearch\..+\.js$/.test(file))
  assert.ok(module)
  const code = await readFile(`dist/_astro/${module}`, 'utf8')
  assert.match(code, /algolia-preconnect/)
  assert.match(code, /lang:/)
  assert.match(code, /500/)
  assert.match(header, /disableQueryPersistence \? '' : sessionStorage\.getItem\('vuepress-plume:mini-search-filter'\)/)
  assert.match(header, /event\.key === '\/'/)
  assert.match(header, /history\.pushState\(null, '', null\)/)
  assert.match(header, /document\.body\.style\.overflow = 'hidden'/)
})

test('profile-disabled blogs retain Plume local taxonomy navigation', async () => {
  const [page, home, nav, styles] = await Promise.all([
    readFile('theme/pages/[...path].astro', 'utf8'),
    readFile('theme/components/CustomHome.astro', 'utf8'),
    readFile('theme/components/PostsNav.astro', 'utf8'),
    readFile('theme/styles/plume-parity.css', 'utf8'),
  ])
  assert.match(page, /!profileEnabled && <PostsNav \{lang\} \{blogStats\} collection=\{postCollection\} local/)
  assert.match(home, /item\.collection \? postCollections\.find\(entry => entry\.dir === item\.collection\)/)
  assert.match(home, /<PostList posts=\{itemPosts\} \{lang\} \{collection\}/)
  assert.match(nav, /class:list=\{\['vp-posts-nav', \{ local \}\]\}/)
  assert.match(styles, /\.posts-container\.no-profile \{ display: block; max-width: 784px/)
  assert.match(styles, /@media \(min-width: 768px\) \{ \.vp-posts-nav\.local \{ display: flex !important; \} \}/)
})

test('global post metadata and cover disable switches reach initial and paginated lists', async () => {
  const [content, list, endpoint] = await Promise.all([
    readFile('theme/lib/content.ts', 'utf8'),
    readFile('theme/components/PostList.astro', 'utf8'),
    readFile('theme/pages/posts.json.ts', 'utf8'),
  ])
  assert.match(content, /global === false \? hiddenPostMeta : global \?\? \{\}/)
  assert.match(list, /configuredPostCover !== false && post\.data\.cover/)
  assert.match(list, /post\.cover && postCover !== false/)
  assert.match(endpoint, /postMetaConfigOf\(siteConfig\.meta/)
})

test('page navigation uses one shared Plume-compatible partial navigation module without an SPA router', async () => {
  const [layout, sidebar, profile, navigation, header, styles] = await Promise.all([
    readFile('theme/layouts/BaseLayout.astro', 'utf8'),
    readFile('theme/components/DocsSidebar.astro', 'utf8'),
    readFile('theme/components/ProfileAside.astro', 'utf8'),
    readFile('theme/lib/page-navigation.ts', 'utf8'),
    readFile('theme/components/Header.astro', 'utf8'),
    readFile('theme/styles/plume-parity.css', 'utf8'),
  ])
  assert.doesNotMatch(layout, /@view-transition \{ navigation: auto; \}/)
  assert.doesNotMatch(layout, /ClientRouter/)
  assert.match(header, /appearance-transition/)
  assert.doesNotMatch(styles, /view-transition-name: plume-page-content/)
  assert.match(styles, /prefers-reduced-motion: reduce/)
  assert.doesNotMatch(layout, /onpageswap/)
  assert.match(layout, /link\.closest\('\.vp-sidebar'\)/)
  assert.match(layout, /fade-slide-y-leave-from/)
  assert.match(layout, /fade-slide-y-enter-from/)
  assert.match(layout, /initPageNavigation\(\)/)
  assert.doesNotMatch(sidebar, /const syncHead|const executeScripts|fetch\(url/)
  assert.doesNotMatch(profile, /const syncHead|const executeScripts|fetch\(url/)
  assert.match(navigation, /fetch\(url, \{ signal: navigation\.signal/)
  assert.match(navigation, /currentContent\.replaceWith\(imported\)/)
  assert.match(navigation, /\{ ermaoziDoc: true \}/)
  assert.match(navigation, /\{ ermaoziPosts: true \}/)
  assert.match(navigation, /nextAside\.replaceWith\(persistedAside\)/)
  assert.match(navigation, /CustomEvent\('plume-content-updated'\)/)
  assert.match(layout, /data-page-shell=\{pageShellSignature\}/)
  assert.match(sidebar, /data-sidebar-signature=\{signature\}/)
  assert.match(navigation, /nextDocument\.body\.dataset\.pageShell !== document\.body\.dataset\.pageShell/)
  assert.match(navigation, /nextSidebar\?\.dataset\.sidebarSignature !== currentSidebar\?\.dataset\.sidebarSignature/)
  assert.match(layout, /data-ermaozi-managed-head/)
  assert.match(navigation, /const selector = headSelectors\.join\(','\)/)
  assert.match(navigation, /clone instanceof HTMLScriptElement\) executeScript\(clone\)/)
  assert.match(layout, /<title>\{fullTitle\}<\/title>/)
  assert.doesNotMatch(layout, /<title set:html=/)
})

test('appearance keeps every frozen mode, configuration state, and print fallback', async () => {
  const [layout, header, client, styles] = await Promise.all([
    readFile('theme/layouts/BaseLayout.astro', 'utf8'),
    readFile('theme/components/Header.astro', 'utf8'),
    readFile('theme/client.ts', 'utf8'),
    readFile('theme/styles/global.css', 'utf8'),
  ])
  for (const mode of ['fade', 'circle-clip', 'horizontal-clip', 'vertical-clip', 'skew-clip', 'blinds-vertical', 'blinds-horizontal', 'soft-blur-fade', 'diamond-reveal']) assert.match(header, new RegExp(mode))
  assert.match(layout, /appearance !== false/)
  assert.match(layout, /appearance === 'force-dark'/)
  assert.match(header, /appearance !== 'force-dark'/)
  assert.match(header, /appearance === 'dark' \? 'dark' : 'auto'/)
  assert.match(header, /beforeprint/)
  assert.match(header, /afterprint/)
  assert.match(client, /appearance === false \? false/)
  assert.match(styles, /prefers-reduced-motion: reduce/)
  assert.match(styles, /\.vp-switch-appearance \.check \{ transition: none !important; \}/)
})
