import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import plumeTheme, { defineCollection, defineCollections, defineNavbarConfig, defineSiteConfig, defineThemeConfig } from '../../theme/node.ts'
import { defineEChartsConfig, useEChartsConfig } from '../../theme/lib/echarts-config.ts'
import { isActive, isGradient, normalize, normalizeLink, normalizePrefix, numToUnit, resolveEditLink, resolveNavLink, resolveRepoType, toArray, withBase, withBaseInHtml, withoutBase } from '../../theme/lib/client-utils.ts'
import { languageFromPath, languageFromSourcePath, routeFromSourcePath } from '../../theme/lib/locales.ts'
import { isIOS } from '../../theme/components/vue/background/helpers.ts'
import { tintPlateColors } from '../../theme/lib/tint-plate.ts'
import { homeConfigOf } from '../../theme/lib/home.ts'
import { seoEnabled } from '../../theme/lib/seo-options.mjs'
import { collectionForEntry, collectionsFor } from '../../theme/lib/collections.ts'
import { siteConfig } from '../../site.config.mjs'

test('public Node helpers preserve identity and the client barrel covers the frozen documented API', async () => {
  const values = [
    [{ text: 'Docs', link: '/docs/' }],
    [{ type: 'post', dir: 'blog' }],
    { type: 'doc', dir: 'docs' },
    { locales: {} },
  ]
  assert.equal(defineNavbarConfig(values[0]), values[0])
  assert.equal(defineCollections(values[1]), values[1])
  assert.equal(defineCollection(values[2]), values[2])
  assert.equal(defineThemeConfig(values[3]), values[3])
  const site = { origin: 'https://example.com', logo: '/logo.svg', locales: { 'zh-CN': { siteName: 'Site', home: '/' } } }
  assert.equal(defineSiteConfig(site), site)
  assert.deepEqual(site.features, { engagement: false, popularPosts: false, comments: false })
  assert.deepEqual(site.social, [])
  assert.equal(site.namespace, 'ermaozi')
  assert.deepEqual({
    appearance: site.appearance,
    navbarSocialInclude: site.navbarSocialInclude,
    aside: site.aside,
    outline: site.outline,
    externalLinkIcon: site.externalLinkIcon,
    editLink: site.editLink,
    contributors: site.contributors,
    changelog: site.changelog,
    prevPage: site.prevPage,
    nextPage: site.nextPage,
  }, {
    appearance: true,
    navbarSocialInclude: ['github', 'twitter', 'discord', 'facebook'],
    aside: true,
    outline: [2, 3],
    externalLinkIcon: true,
    editLink: true,
    contributors: true,
    changelog: false,
    prevPage: true,
    nextPage: true,
  })
  assert.match(site.footer.message, /Astro.*ermaozi/)
  assert.equal(plumeTheme(values[3]), values[3])
  const [client, node] = await Promise.all([readFile('theme/client.ts', 'utf8'), readFile('theme/node.ts', 'utf8')])
  const frozenNodeHelpers = ['defineSiteConfig', 'defineThemeConfig', 'defineNavbarConfig', 'defineNotesConfig', 'defineNoteConfig', 'defineCollections', 'defineCollection']
  const frozenClientComponents = ['VPBadge', 'VPCard', 'VPCardGrid', 'VPHomeBanner', 'VPHomeBox', 'VPHomeCustom', 'VPHomeFeatures', 'VPHomeHero', 'VPHomeProfile', 'VPHomeTextImage', 'VPButton', 'VPIcon', 'VPImage', 'VPLink']
  for (const name of frozenNodeHelpers) assert.match(node, new RegExp(`\\b${name}\\b`))
  for (const name of frozenClientComponents) {
    assert.match(client, new RegExp(`default as ${name}\\b`))
  }
  assert.match(client, /export \{ Layout, NotFound \}/)
  for (const name of ['useDarkMode', 'useData', 'useLocalePostList']) assert.match(client, new RegExp(`function ${name}\\b`))
  assert.match(client, /export const plumeClientConfig = Object\.freeze\(\{ layouts:/)
  assert.match(client, /echarts-config/)
  assert.doesNotMatch(client, /node:/)
})

test('site config fails early with actionable boundary errors', () => {
  const valid = () => ({ origin: 'https://example.com', logo: '/logo.svg', locales: { 'zh-CN': { siteName: 'Site', home: '/' } } })
  const plume = defineSiteConfig({ hostname: 'https://example.com', logo: '/logo.svg', docsRepo: 'owner/repo', docsBranch: 'dev', docsDir: 'docs', locales: { 'zh-CN': { siteName: 'Site', home: '/' } } })
  assert.equal(plume.origin, 'https://example.com')
  assert.deepEqual(plume.repository, { url: 'owner/repo', branch: 'dev', contentDir: 'docs' })
  const customHome = defineSiteConfig({ ...valid(), home: '/blog/' })
  assert.equal(customHome.locales['zh-CN'].path, '/')
  assert.equal(customHome.locales['zh-CN'].home, '/blog/')
  const disabledHome = defineSiteConfig({ origin: 'https://example.com', home: false, locales: { 'zh-CN': { siteName: 'Site' } } })
  assert.equal(disabledHome.locales['zh-CN'].path, '/')
  assert.equal(disabledHome.locales['zh-CN'].home, false)
  assert.throws(() => defineSiteConfig({ ...valid(), origin: 'example.com' }), /origin 必须是有效的 http\(s\) URL/)
  const withoutLogo = defineSiteConfig({ origin: 'https://example.com', locales: { 'zh-CN': { siteName: 'Site', home: '/' } } })
  assert.equal(withoutLogo.logo, false)
  assert.equal(defineSiteConfig({ ...valid(), logo: false }).logo, false)
  assert.throws(() => defineSiteConfig({ ...valid(), logo: 42 }), /logo 必须是非空字符串或 false/)
  assert.throws(() => defineSiteConfig({ ...valid(), locales: { 'zh-CN': { siteName: 'Site', home: '/', logo: 42 } } }), /locales\.zh-CN\.logo 必须是非空字符串或 false/)
  assert.throws(() => defineSiteConfig({ ...valid(), namespace: '' }), /namespace 不能为空/)
  assert.throws(() => defineSiteConfig({ ...valid(), base: '/docs' }), /base 必须以 \/ 开头和结尾/)
  assert.throws(() => defineSiteConfig({ ...valid(), home: 42 }), /home 必须是以 \/ 开头和结尾的站内路径或 false/)
  assert.throws(() => defineSiteConfig({ ...valid(), features: false }), /features 必须是对象/)
  assert.throws(() => defineSiteConfig({ ...valid(), markdown: false }), /markdown 必须是对象/)
  assert.throws(() => defineSiteConfig({ ...valid(), markdown: { repl: { theme: 'missing-theme' } } }), /markdown\.repl\.theme 包含未知的 Shiki 主题/)
  assert.throws(() => defineSiteConfig({ ...valid(), markdown: { repl: { go: 'yes' } } }), /markdown\.repl\.go 必须是布尔值/)
  assert.throws(() => defineSiteConfig({ ...valid(), markdown: { codeTree: { icon: 'fancy' } } }), /markdown\.codeTree\.icon/)
  assert.throws(() => defineSiteConfig({ ...valid(), markdown: { codeTree: { height: null } } }), /markdown\.codeTree\.height/)
  assert.throws(() => defineSiteConfig({ ...valid(), markdown: { encrypt: { password: '' } } }), /markdown\.encrypt\.password 必须是非空字符串/)
  assert.throws(() => defineSiteConfig({ ...valid(), locales: { 'zh-CN': null } }), /locales\.zh-CN 必须是对象/)
  assert.throws(() => defineSiteConfig({ ...valid(), collections: [null] }), /collections\[0\]\.type/)
  assert.throws(() => defineSiteConfig({ ...valid(), pagination: 0 }), /pagination\.perPage 必须是正整数/)
  assert.throws(() => defineSiteConfig({ ...valid(), locales: { 'zh-CN': { siteName: 'Site', home: '/', collections: [{ type: 'post', dir: 'blog', pagination: 0 }] } } }), /collections\[0\]\.pagination\.perPage 必须是正整数/)
  assert.throws(() => defineSiteConfig({ ...valid(), locales: { 'zh-CN': { siteName: 'Site', home: '/', collections: [{ type: 'post', dir: '../blog' }] } } }), /collections\[0\]\.dir 必须是 content 内的相对目录/)
  assert.throws(() => defineSiteConfig({ ...valid(), locales: { 'zh-CN': { siteName: 'Site', home: '/', collections: [{ type: 'post', dir: '/blog' }] } } }), /collections\[0\]\.dir 必须是 content 内的相对目录/)
  assert.throws(() => defineSiteConfig({ ...valid(), collections: [{ type: 'post', dir: 'blog' }, { type: 'doc', dir: './blog/' }] }), /collections\[1\]\.dir 与同一语言的其他集合重复/)
  const normalized = defineSiteConfig({ ...valid(), collections: [{ type: 'post', dir: './blog//./guides/' }, { type: 'doc', dir: './' }] })
  assert.deepEqual(normalized.collections?.map(collection => collection.dir), ['blog/guides', '/'])
  assert.throws(() => defineSiteConfig({ ...valid(), locales: { 'zh-CN': { siteName: 'Site', home: '/', collections: [{ type: 'post', dir: 'blog', categoriesExpand: -1 }] } } }), /categoriesExpand 必须是非负整数/)
  assert.throws(() => defineSiteConfig({ ...valid(), locales: { 'zh-CN': { siteName: 'Site', home: '/', path: '/zh/' } } }), /必须有一种语言使用根路径/)
  assert.throws(() => defineSiteConfig({ ...valid(), features: { engagement: true, popularPosts: false, comments: false } }), /services\.statsBase/)
})

test('legacy blog pageLayout remains a built-in posts alias', async () => {
  const route = await readFile('theme/pages/[...path].astro', 'utf8')
  assert.match(route, /standardLayouts = new Set\(\['home', 'posts', 'blog', 'doc', 'page', 'friends'\]\)/)
  assert.match(route, /pageLayout === 'posts' \|\| entry\?\.data\.pageLayout === 'blog'/)
  assert.ok(route.indexOf('postsLayout ? layoutPostCollection ?? postCollectionsFor(lang)[0]') < route.indexOf("entryCollection?.type === 'post' ? entryCollection"))
  assert.match(route, /pageLayout: posts 找不到 Post 集合/)
})

test('top-level Plume locale text remains a global fallback', async () => {
  const { localeOf } = await import('../../theme/lib/locales.ts')
  const previous = siteConfig.openNewWindowText
  try {
    siteConfig.openNewWindowText = 'Open elsewhere'
    assert.equal(localeOf('zh-CN').openNewWindowText, 'Open elsewhere')
  }
  finally {
    if (previous === undefined) delete siteConfig.openNewWindowText
    else siteConfig.openNewWindowText = previous
  }
})

test('missing post translations fall back to the matching target collection before the first blog', async () => {
  const route = await readFile('theme/pages/[...path].astro', 'utf8')
  assert.match(route, /targetPostCollections\.find\(collection => collection\.dir === entryCollection\?\.dir\)\?\.link \?\? targetPostCollections\[0\]\?\.link/)
})

test('legacy Plume plugin options fall back to the canonical flat configuration', () => {
  const copyCode = { duration: 1200 }
  const shiki = { lineNumbers: true }
  const readingTime = { wordPerMinute: 240 }
  const markdownPower = { mermaid: true, imageSize: 'all' }
  const markdownChart = { echarts: true }
  const configured = defineSiteConfig({
    origin: 'https://example.com',
    logo: '/logo.svg',
    locales: { 'zh-CN': { siteName: 'Site', home: '/' } },
    plugins: {
      copyCode,
      shiki,
      readingTime,
      markdownPower,
      markdownChart,
      markdownMath: false,
      docsearch: { appId: 'app', apiKey: 'key', indexName: 'index' },
      llmstxt: true,
    },
  })
  assert.equal(configured.copyCode, copyCode)
  assert.equal(configured.codeHighlighter, shiki)
  assert.equal(configured.readingTime, readingTime)
  assert.deepEqual(configured.search, { provider: 'algolia', appId: 'app', apiKey: 'key', indexName: 'index' })
  assert.equal(configured.markdown.math, false)
  assert.equal(configured.markdown.mermaid, true)
  assert.equal(configured.markdown.echarts, true)
  assert.equal(configured.markdown.imageSize, 'all')
  assert.equal(configured.llmstxt, true)

  const legacyIcons = { provider: 'iconfont', prefix: 'legacy-' }
  const withLegacyIcons = defineSiteConfig({
    origin: 'https://example.com',
    logo: '/logo.svg',
    locales: { 'zh-CN': { siteName: 'Site', home: '/' } },
    markdown: { icons: legacyIcons },
  })
  assert.equal(withLegacyIcons.markdown.icon, legacyIcons)
})

test('deprecated Plume avatar settings fall back to profile globally and per locale', () => {
  const globalAvatar = { name: 'Global', url: '/global.png' }
  const localeAvatar = { name: 'Locale', url: '/locale.png' }
  const configured = defineSiteConfig({
    origin: 'https://example.com',
    logo: '/logo.svg',
    avatar: globalAvatar,
    locales: { 'zh-CN': { siteName: 'Site', home: '/', avatar: localeAvatar, collections: [{ type: 'post', dir: 'blog', profile: { url: '/collection.png' } }] } },
  })
  assert.equal(configured.profile, globalAvatar)
  assert.equal(configured.locales['zh-CN'].profile, localeAvatar)
  assert.equal(configured.profile.avatar, '/global.png')
  assert.equal(configured.locales['zh-CN'].profile.avatar, '/locale.png')
  assert.equal(configured.locales['zh-CN'].collections[0].profile.avatar, '/collection.png')
})

test('deprecated Plume blog, notes, and article settings migrate to collections', () => {
  const configured = defineSiteConfig({
    origin: 'https://example.com',
    logo: '/logo.svg',
    article: '/articles/',
    blog: { exclude: 'private/**', pagination: 10 },
    notes: { dir: '/notes/', link: '/', notes: [{ dir: 'typescript', link: '/typescript/', sidebar: 'auto' }] },
    locales: {
      'zh-CN': { siteName: 'Site', home: '/' },
      'en-US': { siteName: 'Site', home: '/en/', collections: [{ type: 'post', dir: 'journal' }] },
    },
  })
  assert.deepEqual(configured.locales['zh-CN'].collections, [
    { type: 'post', dir: '/', linkPrefix: '/articles/', exclude: ['private/**', 'notes/typescript'], pagination: 10 },
    { type: 'doc', dir: 'notes/typescript', linkPrefix: '/typescript/', sidebar: 'auto', sidebarScrollbar: undefined },
  ])
  assert.deepEqual(configured.locales['en-US'].collections, [{ type: 'post', dir: 'journal' }])
  assert.deepEqual(collectionsFor('zh-CN', configured).map(collection => [collection.type, collection.linkPrefix]), [['post', '/articles/'], ['doc', '/typescript/']])
  assert.equal(collectionForEntry('legacy-post', 'zh-CN', configured)?.type, 'post')
  assert.equal(collectionForEntry('notes/typescript/start', 'zh-CN', configured)?.type, 'doc')
  assert.equal(Object.hasOwn(configured, 'blog'), false)
  assert.equal(Object.hasOwn(configured, 'notes'), false)
})

test('plugins.seo false disables generated SEO metadata', () => {
  assert.equal(seoEnabled({ plugins: { seo: false } }), false)
  assert.equal(seoEnabled({ plugins: { seo: {} } }, false), false)
  assert.equal(seoEnabled({ plugins: { seo: {} } }), true)
})

test('ECharts public config preserves the frozen singleton contract', () => {
  const config = { option: { backgroundColor: '#123456' }, setup: async () => {} }
  defineEChartsConfig(config)
  assert.equal(useEChartsConfig(), config)
  defineEChartsConfig({})
})

test('public client utilities preserve the frozen path, CSS, and repository contracts', () => {
  assert.deepEqual(toArray('one'), ['one'])
  assert.equal(normalize('/README.md#top'), '/')
  assert.equal(isActive('/docs/', '/docs/'), true)
  assert.equal(isActive('/docs/guide/', '^/docs/', true), true)
  assert.equal(numToUnit(12), '12px')
  assert.equal(numToUnit('2rem'), '2rem')
  assert.equal(isGradient('linear-gradient(red, blue)'), true)
  assert.equal(normalizeLink('/docs/', 'guide/'), '/docs/guide/')
  assert.equal(normalizePrefix('/docs/', 'guide'), '/docs/guide/')
  assert.equal(withBase('/logo.svg', '/theme/'), '/theme/logo.svg')
  assert.equal(withBase('/theme/logo.svg', '/theme/'), '/theme/logo.svg')
  assert.equal(withBase('https://example.com/logo.svg', '/theme/'), 'https://example.com/logo.svg')
  assert.equal(withoutBase('/theme/docs/', '/theme/'), '/docs/')
  assert.equal(withoutBase('/theme', '/theme/'), '/')
  assert.equal(withBaseInHtml('<a href="/docs/"><img src="/img/a.png"><a href="https://example.com/">', '/theme/'), '<a href="/theme/docs/"><img src="/theme/img/a.png"><a href="https://example.com/">')
  assert.equal(resolveRepoType('owner/repo'), 'GitHub')
  assert.equal(resolveRepoType('https://gitlab.com/owner/repo'), 'GitLab')
  assert.equal(resolveEditLink({ docsRepo: 'owner/repo', docsBranch: 'main', docsDir: 'content', filePathRelative: 'guide.md' }), 'https://github.com/owner/repo/edit/main/content/guide.md')
  assert.equal(resolveEditLink({ docsRepo: 'https://gitlab.com/owner/repo', docsBranch: 'main', docsDir: 'content', filePathRelative: 'guide.md' }), 'https://gitlab.com/owner/repo/-/edit/main/content/guide.md')
  assert.equal(resolveEditLink({ docsRepo: 'https://gitee.com/owner/repo', docsBranch: 'main', docsDir: 'content', filePathRelative: 'guide.md' }), 'https://gitee.com/owner/repo/edit/main/content/guide.md')
  assert.equal(resolveEditLink({ docsRepo: 'https://bitbucket.org/owner/repo', docsBranch: 'main', docsDir: 'content', filePathRelative: 'guide.md' }), 'https://bitbucket.org/owner/repo/src/main/content/guide.md?mode=edit&spa=0&at=main&fileviewer=file-view-default')
  assert.equal(resolveEditLink({ docsRepo: 'https://example.com/owner/repo', docsBranch: 'main', docsDir: 'content', filePathRelative: 'guide.md', editLinkPattern: ':repo/write/:branch/:path' }), 'https://example.com/owner/repo/write/main/content/guide.md')
  assert.deepEqual(resolveNavLink('/guide/index.html'), { text: 'guide', link: '/guide/' })
  assert.equal(languageFromPath('/en/docs/'), 'en-US')
  assert.equal(languageFromPath('/docs/'), 'zh-CN')
  assert.equal(languageFromSourcePath('/repo/content/en/docs/page.md'), 'en-US')
  assert.equal(languageFromSourcePath('/repo/content/docs/page.md'), 'zh-CN')
  assert.equal(languageFromSourcePath('content/en/docs/page.md'), 'en-US')
  assert.equal(languageFromSourcePath('./content/docs/page.md'), 'zh-CN')
  assert.equal(routeFromSourcePath('content/en/docs/page.md'), '/en/docs/page.md')
})

test('public page data excludes unlock credentials and custom CSS loads last', async () => {
  const [layout, encrypted, clientConfig] = await Promise.all([
    readFile('theme/layouts/BaseLayout.astro', 'utf8'),
    readFile('dist/blog/encrypted-example/index.html', 'utf8'),
    readFile('theme/client-config.ts', 'utf8'),
  ])
  assert.match(layout, /import '\.\.\/client-config\.ts'/)
  assert.match(clientConfig, /export \{\}/)
  assert.match(layout, /import '\.\.\/styles\/custom\.css'/)
  assert.ok(layout.indexOf("import '../styles/custom.css'") > layout.indexOf("import 'swiper/css/bundle'"))
  assert.match(layout, /const favicon = typeof siteConfig\.logo === 'string' \? withBase\(siteConfig\.logo, import\.meta\.env\.BASE_URL\) : ''/)
  assert.match(layout, /!hasCustomIcon && favicon && <link rel="icon" href=\{favicon\}/)
  assert.match(layout, /'og:image:alt': image \? title : undefined/)
  assert.doesNotMatch(layout, /rel="icon" href=\{withBase\('\/img\/logo\.svg'/)
  const payload = encrypted.match(/<script id="ermaozi-page-data" type="application\/json">([^<]*)<\/script>/)?.[1]
  assert.ok(payload)
  const data = JSON.parse(payload)
  assert.equal(Object.hasOwn(data.frontmatter, 'password'), false)
  assert.equal(Object.hasOwn(data.frontmatter, 'passwordHint'), false)
})

test('home background components preserve Plume mask, gradient, attachment, and single-section semantics', async () => {
  const [banner, hero, box, layout] = await Promise.all([
    readFile('theme/components/VPHomeBanner.astro', 'utf8'),
    readFile('theme/components/VPHomeHero.astro', 'utf8'),
    readFile('theme/components/VPHomeBox.astro', 'utf8'),
    readFile('theme/layouts/BaseLayout.astro', 'utf8'),
  ])
  assert.match(banner, /bannerMask\.dark : bannerMask\) \|\| 0/)
  assert.match(hero, /isGradient\(String\(value\)\)/)
  assert.match(hero, /Object\.prototype\.toString\.call\(effectConfig\) === '\[object Object\]'/)
  assert.match(hero, /builtInEffect[\s\S]*<HeroEffect[\s\S]*hasBackground && <div class="home-hero-bg"/)
  assert.match(hero, /--vp-home-bg-light-attachment:\$\{props\.backgroundAttachment \|\| 'scroll'\}/)
  assert.match(box, /--vp-home-bg-light-attachment:\$\{backgroundAttachment \|\| 'scroll'\}/)
  assert.match(layout, /const isHome = layout === 'home' \|\| entry\?\.data\.home === true \|\| entry\?\.data\.pageLayout === 'home'/)
  assert.match(layout, /singleHomeSection = isHome && homeConfig\.length === 1/)
  assert.match(layout, /\(entry\.data\.config\?\.length \?\? 0\) > 1/)
  assert.match(layout, /'footer-no-border': singleHomeSection/)
  assert.match(layout, /const backToTopEnabled = entry\?\.data\.backToTop !== false && !shortHomeConfig/)
  assert.match(layout, /<BackToTop \{lang\} enabled=\{backToTopEnabled\} \/>/)
})

test('custom home normalization preserves explicit, legacy banner, and default Hero branches', () => {
  const explicit = [{ type: 'posts', collection: 'journal' }]
  assert.equal(homeConfigOf({ config: explicit }), explicit)
  assert.deepEqual(homeConfigOf({ banner: '/banner.png', bannerMask: { light: 0.1, dark: 0.3 }, hero: { name: 'Legacy' } }), [{
    type: 'banner', banner: '/banner.png', bannerMask: { light: 0.1, dark: 0.3 }, hero: { name: 'Legacy' },
  }])
  assert.deepEqual(homeConfigOf({ config: [], hero: { name: 'Default' } }), [{ type: 'hero', full: true, background: 'tint-plate', hero: { name: 'Default' } }])
})

test('unknown custom home sections fail with an actionable component path', async () => {
  const home = await readFile('theme/components/CustomHome.astro', 'utf8')
  assert.match(home, /首页区块 type .*未找到对应组件；请添加 theme\/components\/home\//)
  assert.match(home, /首页 .* 区块找不到 Post 集合/)
})

test('hero background iOS detection follows the frozen platform contract', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  try {
    for (const [platform, expected] of [['iOS', true], ['iPhone', true], ['iPad', true], ['MacIntel', false], ['iPod', false]]) {
      Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { platform, userAgent: 'ignored' } })
      assert.equal(isIOS(), expected, platform)
    }
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { platform: 'Linux', userAgentData: { platform: 'iOS' } } })
    assert.equal(isIOS(), true)
  }
  finally {
    if (original) Object.defineProperty(globalThis, 'navigator', original)
    else delete globalThis.navigator
  }
})

test('TintPlate keeps the frozen compatibility and theme fallbacks', () => {
  assert.deepEqual(tintPlateColors(210, false).r, { value: 210, offset: 46 })
  assert.deepEqual(tintPlateColors(210, true).r, { value: 32, offset: 36 })
  assert.deepEqual(tintPlateColors(0, false).r, { value: 200, offset: 36 })
  assert.deepEqual(tintPlateColors('210.5', false).r, { value: 200, offset: 36 })
  assert.deepEqual(tintPlateColors({ rgb: '10, 20, 30' }, false), {
    r: { value: 10, offset: 64 }, g: { value: 20, offset: 64 }, b: { value: 30, offset: 64 },
  })
  assert.deepEqual(tintPlateColors({ light: '10,20,30', dark: 40 }, true).r, { value: 40, offset: 64 })
  assert.deepEqual(tintPlateColors({ light: 0, dark: 40 }, false).r, { value: 0, offset: 64 })
  assert.deepEqual(tintPlateColors({ light: { r: { value: 1, offset: 2 } } }, false).r, { value: 200, offset: 36 })
  assert.deepEqual(tintPlateColors({ r: { value: '100', offset: '20' }, g: { value: 110, offset: 21 }, b: { value: 120, offset: 22 } }, false).r, { value: 100, offset: 20 })
})
