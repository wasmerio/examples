import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { renderMarkdown } from '../../theme/lib/markdown.ts'
import { defaultFile, defaultFolder, definitions, getFileIconName } from '../../theme/lib/file-icons.ts'
import { hasIcon, iconAssetUrls, iconifySvg } from '../../theme/lib/iconify.ts'
import { siteConfig } from '../../site.config.mjs'

test('page layouts keep their source title while document layouts consume it', async () => {
  const source = '# Standalone page\n\nBody'
  assert.doesNotMatch(await renderMarkdown(source), /<h1/)
  assert.match(await renderMarkdown(source, { removeTitle: false }), /<h1 id="standalone-page"/)
})

test('Markdown images preserve the frozen size syntax and native loading policy', async () => {
  const html = await renderMarkdown('![Logo =160x80](/img/logo.svg)\n\n![Second](/img/logo.svg)')
  assert.match(html, /<img src="\/img\/logo\.svg" alt="Logo" width="160" height="80" decoding="async" loading="eager" fetchpriority="high">/)
  assert.match(html, /<img src="\/img\/logo\.svg" alt="Second" decoding="async" loading="lazy">/)
})

test('directory code trees resolve relative paths and omit binary source panels', async () => {
  const sourcePath = path.resolve('internal/tests/fixtures/page.md')
  const html = await renderMarkdown('@[code-tree title="Fixture" entry="main.ts"](./code-tree)', { sourcePath })
  assert.match(html, /data-entry-file="main\.ts"/)
  assert.match(html, /data-code-file="main\.ts"/)
  assert.match(html, /data-code-file="logo\.png"/)
  assert.match(html, /style="--file-tree-level:-1"/)
  assert.match(html, /data-title="main\.ts"/)
  assert.match(html, /class="code-block-title" data-title="main\.ts"><div class="code-block-title-bar"><span class="title"><span class="vp-icon is-svg"/)
  assert.doesNotMatch(html, /data-title="logo\.png"|binary fixture/)
})

test('directory code trees render in block containers but stay literal in fenced code', async () => {
  const sourcePath = path.resolve('internal/tests/fixtures/page.md')
  const html = await renderMarkdown('> @[code-tree](./code-tree)\n\n- @[code-tree](./code-tree)\n\n> ```md\n> @[code-tree](./code-tree)\n> ```', { sourcePath })
  assert.equal(html.match(/class="vp-code-tree"/g)?.length, 2)
  assert.match(html, /<blockquote>[\s\S]*class="vp-code-tree"/)
  assert.match(html, /<ul>[\s\S]*class="vp-code-tree"/)
  assert.match(html, /class="language-md" data-highlighter="shiki"/)
})

test('directory code trees reject paths outside the project', async () => {
  await assert.rejects(
    renderMarkdown('@[code-tree](../../../../)', { sourcePath: path.resolve('internal/tests/fixtures/page.md') }),
    /escapes the project root/,
  )
})

test('file trees use the complete frozen Plume filename mapping', () => {
  const ruleCount = Object.values(definitions).reduce((total, rules) => total + Object.keys(rules).length, 0)
  assert.equal(ruleCount, 861)
  assert.equal(getFileIconName('vite.config.ts'), 'vscode-icons:file-type-vite')
  assert.equal(getFileIconName('pnpm-lock.yaml'), 'vscode-icons:file-type-light-pnpm')
  assert.equal(getFileIconName('node_modules', 'folder'), 'vscode-icons:folder-type-light-node')
  assert.equal(getFileIconName('foo.spec.tsx'), 'vscode-icons:file-type-reactts')
  const icons = new Set([defaultFile, defaultFolder, ...Object.values(definitions).flatMap(Object.values)])
  assert.deepEqual([...icons].filter(icon => !hasIcon(icon)).sort(), ['seti:spring', 'vvscode-icons:file-type-aspx'])
  assert.match(iconifySvg(getFileIconName('Makefile')), /<svg/)
  assert.equal(iconifySvg(getFileIconName('application.asax')), '')
})

test('file tree modifiers render independently from the documented project layout', async () => {
  const html = await renderMarkdown('::: file-tree\n- ++ added.ts\n- -- removed.ts\n- generated/\n:::')
  assert.match(html, /class="vp-file-tree-info file add diff"/)
  assert.match(html, /class="vp-file-tree-info file remove diff"/)
  assert.match(html, /class="vp-file-tree-node generated"/)
  assert.match(await renderMarkdown('::: file-tree\n- file.ts\n:::', { sourcePath: 'content/en/tree.md' }), /aria-label="Copy" data-copied="Copied"/)
  assert.match(await renderMarkdown('::: file-tree\n- file.ts\n:::', { sourcePath: 'content/docs/tree.md' }), /aria-label="复制" data-copied="已复制"/)
})

test('npm badge groups inherit parent props without transforming fenced examples', async () => {
  const html = await renderMarkdown(`<NpmBadgeGroup name="astro" repo="withastro/astro" theme="flat-square">
  <NpmBadge type="version" label="Astro" />
  <NpmBadge type="dm" label="monthly" />
</NpmBadgeGroup>

\`\`\`md
<NpmBadge name="leave-me-alone" />
\`\`\``)
  assert.match(html, /npm\/v\/astro\?[^" ]*label=Astro/)
  assert.match(html, /npm\/dm\/astro\?[^" ]*label=monthly/)
  assert.doesNotMatch(html, /<NpmBadgeGroup/)
  assert.match(html, /leave-me-alone/)
  assert.doesNotMatch(html, /package\/leave-me-alone/)
})

test('NPM badges preserve every frozen type, defaults, group precedence, and code spans', async () => {
  const html = await renderMarkdown(`<NpmBadgeGroup repo="owner/repo" name="parent" theme="flat-square" color="#123456" label-color="#654321" label="ignored">
  <NpmBadge name="child" type="version" label="child label" label-color="#ffffff" />
  <NpmBadge type="source" />
</NpmBadgeGroup>

<NpmBadge repo="owner/repo" type="stars" />
<NpmBadge repo="owner/repo" type="forks" />
<NpmBadge repo="owner/repo" type="license" />
<NpmBadge name="@scope/pkg" type="dt" />
<NpmBadge name="pkg" type="d18m" />
<NpmBadge name="pkg" type="dw" />
<NpmBadge name="pkg" type="dm" />
<NpmBadge name="pkg" type="dy" />
<NpmBadge />
<NpmBadge/>
<NpmBadgeGroup/>
<NpmBadgeGroup repo="owner/repo" :items="['stars', 'dm']"/>

\`<NpmBadge name="inline-code" type="version" />\`

\`\`<NpmBadge name="double-code" type="version" />\`\``)
  assert.match(html, /npm\/v\/parent\?style=flat-square&amp;color=%23123456&amp;labelColor=%23654321&amp;label=child\+label/)
  assert.match(html, /href="https:\/\/github\.com\/owner\/repo"[\s\S]*badge\/source-a\?logo=github&amp;color=%23654321/)
  for (const type of ['stars', 'forks', 'license']) assert.match(html, new RegExp(`(?:github|github/license)/${type === 'license' ? 'owner/repo' : `${type}/owner/repo`}`))
  assert.equal((html.match(/npm\/d18m\//g) ?? []).length, 2)
  for (const type of ['dw', 'dm', 'dy']) assert.match(html, new RegExp(`npm/${type}/pkg`))
  assert.match(html, /npm\/d18m\/%40scope%2Fpkg/)
  assert.match(html, /<img src="https:\/\/img\.shields\.io\/badge\/unknown\?style=flat&amp;color=%2332A9C3&amp;labelColor=%231B3C4A" class="no-view" alt="unknown">/)
  assert.equal((html.match(/alt="unknown"/g) ?? []).length, 2)
  assert.match(html, /<p class="vp-npm-badge-group"><\/p>/)
  assert.match(html, /<code>&lt;NpmBadge name=&quot;inline-code&quot;/)
  assert.match(html, /<code>&lt;NpmBadge name=&quot;double-code&quot;/)
  assert.doesNotMatch(html, /package\/(?:inline|double)-code/)
})

test('QR codes resolve routes, component syntax, multiline text, and feature disabling', async () => {
  const sourcePath = path.resolve('content/blog/指南/Markdown展示.md')
  const html = await renderMarkdown(`@[qrcode card=true reverse=true title="Docs" width="96rem" level="q" version="8" mask="2" margin="1" scale="3" dark="#123456ff" light="#ffffffff"](/docs/index.md#top)

::: qrcode card title="Lines"
First line
Second line
:::

<VPQRCode text="https://example.com" title="Direct" align="right" />

@[qrcode](/missing.md)`, { sourcePath })
  assert.match(html, /class="vp-qrcode card reverse left"[^>]*data-qrcode-text="\/docs\/#top" data-qrcode-is-link="true" data-qrcode-internal="true"/)
  assert.match(html, /data-qrcode-level="q" data-qrcode-version="8" data-qrcode-mask="2" data-qrcode-margin="1" data-qrcode-scale="3" data-qrcode-light="#ffffffff" data-qrcode-dark="#123456ff"/)
  assert.match(html, /style="--vp-qrcode-size:96px"/)
  assert.match(html, /data-qrcode-text="First line&#10;Second line" data-qrcode-is-link="false"/)
  assert.match(html, /class="vp-qrcode right"[^>]*data-qrcode-text="https:\/\/example\.com" data-qrcode-is-link="true"/)
  assert.match(html, /data-qrcode-text="\/missing\.md" data-qrcode-is-link="false" data-qrcode-internal="false"/)

  const previous = siteConfig.markdown.qrcode
  try {
    siteConfig.markdown.qrcode = false
    const disabled = await renderMarkdown('@[qrcode](text)\n\n<VPQRCode text="text" />', { sourcePath })
    assert.doesNotMatch(disabled, /vp-qrcode/)
  } finally {
    siteConfig.markdown.qrcode = previous
  }
})

test('Swiper preserves the frozen modes, effects, literal props, and linked slides', async () => {
  const html = await renderMarkdown(`<Swiper
  :items="[{ link: '/one.png', href: 'https://example.com', alt: 'One' }, '/two.png',]"
  :width="80"
  :height="200"
  effect="creative"
  :creativeEffect="{ prev: { shadow: true, translate: [0, 0, -400] }, next: { translate: ['100%', 0, 0] }, }"
  :navigation="false"
  :delay="0"
  :speed="0"
  :loop="false"
  :swipe="false"
  slides-per-view="auto"
  :space-between="20"
/>

<Swiper :items="['/one.png', '/two.png']" mode="carousel" :height="200" :slides-per-view="3" :space-between="20" pause-on-mouse-enter />

<Swiper :items="['/one.png', '/two.png']" mode="broadcast" mousewheel />

\`<Swiper :items="['/code.png']" />\``)
  const options = [...html.matchAll(/data-swiper-options="([^"]+)"/g)].map(match => JSON.parse(match[1].replaceAll('&quot;', '"').replaceAll('&amp;', '&')))
  assert.equal(options.length, 3)
  assert.deepEqual(options[0], {
    mode: 'banner',
    effect: 'creative',
    navigation: false,
    delay: 0,
    speed: 0,
    loop: false,
    pauseOnMouseEnter: false,
    swipe: false,
    mousewheel: false,
    slidesPerView: 'auto',
    spaceBetween: 20,
    creativeEffect: { prev: { shadow: true, translate: [0, 0, -400] }, next: { translate: ['100%', 0, 0] } },
  })
  assert.equal(options[1].mode, 'carousel')
  assert.equal(options[1].pauseOnMouseEnter, true)
  assert.equal(options[1].slidesPerView, 3)
  assert.equal(options[2].mode, 'broadcast')
  assert.equal(options[2].mousewheel, true)
  assert.match(html, /style="width:80px;height:200px"/)
  assert.match(html, /class="swiper vp-swiper swiper-no-swiping"/)
  assert.match(html, /href="https:\/\/example\.com" target="_blank" rel="noopener noreferrer" class="swiper-slide-link no-icon"><img[^>]*alt="One"/)
  assert.doesNotMatch(html, /swiper-button-(?:prev|next)[\s\S]*data-swiper-options="\{&quot;mode&quot;:&quot;banner&quot;/)
  assert.match(html, /<code>&lt;Swiper :items=/)
})

test('RepoCard preserves provider and explicit fullname semantics without touching code', async () => {
  const html = await renderMarkdown(`<RepoCard repo="owner/user-repo" />
<RepoCard repo="owner/org-repo" provider="gitee" fullname />
<RepoCard repo="owner/short-repo" :fullname="false" />

\`<RepoCard repo="owner/code" />\``)
  assert.match(html, /data-repo="owner\/user-repo" data-provider="github" hidden/)
  assert.match(html, /data-repo="owner\/org-repo" data-provider="gitee" data-fullname="true" hidden/)
  assert.match(html, /data-repo="owner\/short-repo" data-provider="github" data-fullname="false" hidden/)
  assert.match(html, /<code>&lt;RepoCard repo=/)
})

test('Plume icon syntax supports Iconify, IconFont, Font Awesome, and legacy options', async () => {
  const html = await renderMarkdown(`::simple-icons:astro =24 /#bc52ee spin::

::mdi:home:: ::iconfont home =20:: ::fontawesome fas:house 2xl data-fa-transform="shrink-8"::

::simple-icons:astro =x16 class="custom-icon alpha" id="custom-icon" title="Custom icon"::

<Icon provider="iconfont" name="hot" size="24" color="#f00" class="direct-iconfont" id="direct-iconfont" />

<VPIcon provider="fontawesome" name="ds:house" size="24x16" extra="2xl beat" class="direct-fontawesome" />

:[simple-icons:astro 16/#336f87]:`)
  assert.match(html, /class="vp-icon iconify spin" data-provider="iconify" style="color:#bc52ee;width:24px;height:24px"><svg/)
  assert.match(html, /data-iconify-remote="mdi:home"/)
  assert.match(html, /class="vp-icon iconfont icon-home" data-provider="iconfont" aria-hidden="true" style="font-size:20px"/)
  assert.match(html, /class="vp-icon fontawesome fa-solid fa-house fa-2xl"/)
  assert.match(html, /data-fa-transform="shrink-8"/)
  assert.match(html, /class="vp-icon iconify custom-icon alpha"[^>]*style="height:16px"[^>]*id="custom-icon" title="Custom icon"/)
  assert.match(html, /class="vp-icon iconfont icon-hot direct-iconfont"[^>]*style="color:#f00;font-size:24px" id="direct-iconfont"/)
  assert.match(html, /class="vp-icon fontawesome fa-duotone fa-solid fa-house fa-2xl fa-beat direct-fontawesome"[^>]*style="width:24px;height:16px"/)
  assert.match(html, /color:#336f87;width:16px;height:16px/)
})

test('icon providers preserve frozen defaults, prefixes, aliases, and asset URLs', async () => {
  const previous = siteConfig.markdown.icon
  try {
    siteConfig.markdown.icon = { provider: 'iconify', prefix: 'mdi', size: '1.25em', color: '#ccc' }
    let html = await renderMarkdown('::home:: ::simple-icons:astro =x16 /#eee::')
    assert.match(html, /data-iconify-remote="mdi:home" style="color:#ccc;width:1.25em;height:1.25em"/)
    assert.match(html, /data-provider="iconify" style="color:#eee;height:16px"/)

    siteConfig.markdown.icon = { provider: 'iconfont', prefix: 'glyph glyph-', size: 20, color: '#123456' }
    html = await renderMarkdown('::home:: ::iconify simple-icons:astro::')
    assert.match(html, /class="vp-icon glyph glyph-home"[^>]*style="color:#123456;font-size:20px"/)
    assert.match(html, /data-provider="iconify" style="color:#123456;width:20px;height:20px"/)

    siteConfig.markdown.icon = { provider: 'fontawesome', prefix: 'far', size: 18, color: '#654321' }
    html = await renderMarkdown('::circle-user:: ::sds:house border::')
    assert.match(html, /class="vp-icon fontawesome fa-regular fa-circle-user"/)
    assert.match(html, /class="vp-icon fontawesome fa-sharp-duotone fa-solid fa-house fa-border"/)
    assert.match(html, /style="color:#654321;width:18px;height:18px"/)
  } finally {
    siteConfig.markdown.icon = previous
  }

  assert.deepEqual(iconAssetUrls({ provider: 'iconfont', assets: ['/icons/local.css', 'cdn.example.com/icons.js', '/icons/local.css', 'invalid.txt'] }), [
    '/icons/local.css',
    '//cdn.example.com/icons.js',
  ])
  assert.deepEqual(iconAssetUrls({ provider: 'fontawesome', assets: ['fontawesome', 'fontawesome-with-brands'] }), [
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/js/solid.min.js',
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/js/regular.min.js',
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/js/fontawesome.min.js',
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/js/brands.min.js',
  ])
  assert.deepEqual(iconAssetUrls({ provider: 'iconify', assets: '/ignored.css' }), [])
})

test('cards preserve Plume icons, slots, colors, localized dates, and responsive columns', async () => {
  const source = `<Badge text="custom" color="#8e5cd9" bg-color="rgba(159,122,234,.16)" border-color="#8e5cd9" />

<LinkCard icon="simple-icons:astro" title="External" href="https://example.com" description="Description" />

<LinkCard title="Internal" href="/docs/">

- First item
- Second item

</LinkCard>

<LinkCard href="/custom/">
<template #title><span style="color:red">Custom title</span></template>
Custom body
</LinkCard>

<CardGrid :cols="{ sm: 1, md: 2, lg: 3 }">
<Card title="Icon card" icon="simple-icons:astro">
Card body
</Card>
<Card title="SVG card" icon='{"svg":"svg-marker"}'>
SVG body
</Card>
</CardGrid>

<ImageCard image="/img/logo.svg" title="Dated" author="Author" date="2026-08-05" width="320" center />`
  const html = await renderMarkdown(source, { sourcePath: path.resolve('content/en/cards.md') })
  assert.match(html, /class="vp-badge tip" style="color:#8e5cd9;background-color:rgba\(159,122,234,.16\);border-color:#8e5cd9">custom/)
  assert.match(html, /href="https:\/\/example\.com" target="_blank" rel="noopener noreferrer"/)
  assert.match(html, /class="vp-link-card"[\s\S]*class="vp-icon iconify"/)
  assert.match(html, /href="\/docs\/"(?![^>]*target=)/)
  assert.match(html, /<ul>[\s\S]*First item[\s\S]*Second item[\s\S]*<\/ul>/)
  assert.match(html, /<span style="color:red">Custom title<\/span>/)
  assert.match(html, /data-card-grid-cols="\{&quot;sm&quot;:1,&quot;md&quot;:2,&quot;lg&quot;:3\}"/)
  assert.match(html, /<header class="title"><span class="vp-icon iconify"[\s\S]*<span class="text">Icon card<\/span>/)
  assert.match(html, /<span class="vp-icon is-svg" aria-hidden="true">svg-marker<\/span><span class="text">SVG card<\/span>/)
  assert.match(html, /<span>Author<\/span><span> \| <\/span><span>Aug 5, 2026<\/span>/)
  assert.match(html, /class="vp-image-card center" style="width:320px"/)
})

test('cards preserve Vue title slots and compile dynamic ImageCard lists', async () => {
  const html = await renderMarkdown(`<script setup>
import { ref } from 'vue'
const cards = ref([{ image: '/img/logo.svg', title: 'Dynamic' }])
</script>

<Card>
<template v-slot:title><strong data-slot-title>Custom</strong></template>
Body
</Card>

<ImageCard v-for="card in cards" :key="card.image" v-bind="card" />`)
  assert.match(html, /<strong data-slot-title>Custom<\/strong><section class="body"><p>Body<\/p>/)
  assert.match(html, /data-dynamic-cards-app/)
  assert.match(html, /data-dynamic-card-target="dynamic-image-card-/)
  assert.doesNotMatch(html, /<script setup>/)
})

test('code demos compile every frozen optional CSS preprocessor', async () => {
  for (const [language, source, expected] of [
    ['scss', '$color: #123456; .scss-demo { color: $color; }', /\.scss-demo\s*\{[\s\S]*color:\s*#123456/],
    ['less', '@gap: 7px; .less-demo { gap: @gap; }', /\.less-demo\s*\{[\s\S]*gap:\s*7px/],
    ['stylus', 'accent = #654321\n.stylus-demo\n  color accent', /\.stylus-demo\s*\{[\s\S]*color:\s*#654321/],
  ]) {
    const html = await renderMarkdown(`::: demo normal\n\`\`\`html\n<div class="${language}-demo">demo</div>\n\`\`\`\n\n\`\`\`${language}\n${source}\n\`\`\`\n:::`)
    const encoded = html.match(/data-demo-css="([^"]+)"/)?.[1]
    assert.ok(encoded, `${language} demo CSS payload`)
    assert.match(Buffer.from(encoded, 'base64').toString(), expected)
  }
})

test('global links and buttons keep Plume component props without touching fenced examples', async () => {
  const html = await renderMarkdown(`<VPButton text="Start" href="/docs/" icon="simple-icons:astro" suffix-icon="mdi:arrow-right" size="big" theme="alt" />
<VPLink href="https://example.com" no-icon>External</VPLink>

\`\`\`md
<VPButton text="keep" />
\`\`\``)
  assert.match(html, /class="vp-button big alt" href="\/docs\/"/)
  assert.match(html, /class="vp-icon iconify"[\s\S]*<svg/)
  assert.match(html, /data-iconify-remote="mdi:arrow-right"/)
  assert.match(html, /class="vp-link link no-icon vp-external-link-icon" href="https:\/\/example\.com"/)
  assert.equal((html.match(/class="vp-button /g) ?? []).length, 1)
  assert.match(html, /class="language-md"[\s\S]*VPButton[\s\S]*keep/)
})

test('global links and buttons localize external-window text and honor target blank', async () => {
  const source = '<VPLink href="/internal/" target="_blank">Target blank</VPLink>\n<VPButton href="https://example.com" text="External" />'
  const [zh, en] = await Promise.all([
    renderMarkdown(source, { sourcePath: path.resolve('content/docs/links.md') }),
    renderMarkdown(source, { sourcePath: path.resolve('content/en/docs/links.md') }),
  ])
  assert.match(zh, /class="vp-link link vp-external-link-icon"[^>]*target="_blank"[^>]*>[\s\S]*（在新窗口打开）/)
  assert.match(zh, /class="vp-button medium brand"[\s\S]*（在新窗口打开）/)
  assert.match(en, /class="vp-link link vp-external-link-icon"[\s\S]*\(Open in new window\)/)
  assert.match(en, /class="vp-button medium brand"[\s\S]*\(Open in new window\)/)
})

test('enhanced tables preserve Plume options while plain tables stay plain', async () => {
  const html = await renderMarkdown(`| Plain | Table |
| --- | --- |
| A | B |

::: table title="Status" align="right" copy="md" max-content full-width hl-rows="warning:2" hl-cols="info:1" hl-cells="danger:(2,2)"
| Name | State |
| --- | --- |
| Astro | Ready |
:::`)
  assert.equal((html.match(/class="vp-table /g) ?? []).length, 1)
  assert.match(html, /class="vp-table right full"/)
  assert.match(html, /class="table-inner max-content"/)
  assert.doesNotMatch(html, /data-copy-table="html"/)
  assert.match(html, /data-copy-table="md"/)
  assert.match(html, /<th class="info">Name<\/th>/)
  assert.match(html, /<td class="warning">Astro<\/td>[\s\S]*<td class="danger">Ready<\/td>/)
  assert.match(html, /<p class="table-title">Status<\/p>/)
})

test('emoji, subscript, superscript, and Markdown environment presets are global', async () => {
  const html = await renderMarkdown(`## First heading

### Nested heading

[[TOC]]

:tada: :100: X^2^ H~2~O

[Astro][astro] is an SSG. Preset [+preset]

*[SSG]: Local **generator**

[+preset]: Local **annotation**

Group [+group]

[+group]: First annotation
[+group]: Second annotation`)
  assert.match(html, /🎉 💯 X<sup>2<\/sup> H<sub>2<\/sub>O/)
  assert.match(html, /<nav class="table-of-contents"><ul><li><a href="#first-heading">First heading<\/a><ul><li><a href="#nested-heading">Nested heading<\/a>/)
  assert.match(html, /<a href="https:\/\/astro\.build\/" title="Astro" target="_blank" rel="noopener noreferrer">Astro<\/a>/)
  assert.match(html, /class="vp-abbr"[^>]*aria-label="Local generator"[^>]*data-abbr-content="[^"]+">SSG<\/span>/)
  assert.match(html, /class="vp-annotation ignore-header bottom"[^>]*data-annotation-content="[^"]+"[^>]*data-annotation-total="1"/)
  assert.match(html, /class="vp-annotation ignore-header bottom"[^>]*aria-label="group"[^>]*data-annotation-content="[^"]+"[^>]*data-annotation-total="2"/)
  assert.doesNotMatch(html, /vp-abbr-tooltip|vp-annotation-wrapper|vp-annotation-template/)
})

test('basic Markdown keeps the frozen attrs, task-list, footnote, mark, emoji, subscript, superscript, and TOC preset', async () => {
  const html = await renderMarkdown(`## Matrix {.matrix #matrix}

[[TOC]]

- [x] complete
- [ ] pending

==marked== :tada: X^2^ H~2~O[^note]

[^note]: Footnote`)
  assert.match(html, /<h2 class="matrix" id="matrix"/)
  assert.match(html, /class="task-list-container"/)
  assert.match(html, /type="checkbox"[^>]*checked="checked"[^>]*disabled="disabled"/)
  assert.match(html, /<mark>marked<\/mark> 🎉 X<sup>2<\/sup> H<sub>2<\/sub>O/)
  assert.match(html, /<nav class="table-of-contents"><ul><li><a href="#matrix">Matrix<\/a>/)
  assert.match(html, /class="footnotes"/)
})

test('hint containers keep every frozen locale preset selected by the configured route', async () => {
  const presets = {
    'zh-Hant': ['重要', '相關信息', '注', '提示', '注意', '警告', '詳情'],
    'de-AT': ['Wichtig', 'Information', 'Notiz', 'Tips', 'Warnung', 'Gefahr', 'Details'],
    'vi-VN': ['Quan trọng', 'Thông tin', 'Note', 'Tips', 'Lưu ý', 'Cẩn thận', 'Chi tiết'],
    uk: ['Важливо', 'Інформація', 'Note', 'Поради', 'Примітка', 'Увага', 'Деталь'],
    'ru-RU': ['Важно', 'Инфо', 'Заметка', 'Совет', 'Примечание', 'Предупреждение', 'Подробности'],
    br: ['Importante', 'Informativo', 'Note', 'Dicas', 'Avisos', 'Cuidado', 'Detalhe'],
    'pl-PL': ['Ważne', 'Info', 'Notatka', 'Porady', 'Ostrzeżenie', 'Uwaga', 'Dane'],
    'sk-SK': ['Dôležité', 'Info', 'Poznámka', 'Tip', 'Upozornenie', 'Pozor', 'Podrobnosti'],
    'fr-FR': ['Important', 'Info', 'Note', 'Conseil', 'Avertissement', 'Attention', 'Details'],
    'es-ES': ['Importante', 'Información', 'Nota', 'Consejos', 'Aviso', 'Advertencia', 'Detalles'],
    'ja-JP': ['重要', '関連情報', '注', 'ヒント', '注意', '警告', '詳細'],
    'tr-TR': ['Önemli', 'Bilgi', 'Not', 'Tavsiye', 'Uyarı', 'Tehlike', 'Detay'],
    'ko-KO': ['중요', '정보', '노트', '팁', '경고', '위험', '세부사항'],
    'fi-FI': ['Tärkeä', 'Tietoa', 'Huomautus', 'Vinkki', 'Varoitus', 'Vaara', 'Yksityiskohdat'],
    'hu-HU': ['Fontos', 'Információ', 'Megjegyzés', 'Tipp', 'Figyelem', 'Veszély', 'Részletek'],
    'id-ID': ['Penting', 'Pemberitahuan', 'Catatan', 'Tips', 'Penting', 'Peringatan', 'Rincian'],
    'nl-NL': ['Belangrijk', 'Info', 'Notitie', 'Tips', 'Notitie', 'Waarschuwing', 'Details'],
  }
  const source = ['important', 'info', 'note', 'tip', 'warning', 'caution'].map(type => `::: ${type}\nbody\n:::`).join('\n\n') + '\n\n::: details\nbody\n:::'
  try {
    for (const [language, expected] of Object.entries(presets)) {
      const slug = language.toLowerCase()
      siteConfig.locales[language] = { home: `/${slug}/` }
      const html = await renderMarkdown(source, { sourcePath: path.resolve(`content/${slug}/hint.md`) })
      assert.deepEqual([...html.matchAll(/(?:hint-container-title">|<summary>)([^<]+)/g)].map(match => match[1]), expected)
    }
  } finally {
    for (const language of Object.keys(presets)) delete siteConfig.locales[language]
  }
})

test('abbreviations keep Plume word boundaries, longest matches, and local definition precedence', async () => {
  const html = await renderMarkdown(`SSG SSG2 XSSG (SSG) /SSG/ SSG-X SSG_

API Client and API.

*[SSG]: First [Astro][astro]
*[SSG]: Second
*[API]: Interface
*[API Client]: Client library

  [astro]: https://local.invalid/`)
  assert.equal((html.match(/class="vp-abbr"/g) ?? []).length, 7)
  assert.match(html, /SSG2 XSSG/)
  assert.match(html, />API Client<\/span> and <span class="vp-abbr"/)
  const description = html.match(/data-abbr-content="([^"]+)"[^>]*>SSG<\/span>/)?.[1]
  assert.ok(description)
  const decoded = Buffer.from(description, 'base64').toString()
  assert.match(decoded, /First <a href="https:\/\/astro\.build\/" title="Astro"/)
  assert.doesNotMatch(decoded, /Second|local\.invalid/)
})

test('annotation content retains local abbreviations and grouped local definitions override presets', async () => {
  const html = await renderMarkdown(`TERM [+preset]

*[TERM]: Local term

[+preset]: First TERM and [Astro][astro].
[+preset]: Second item.`)
  const match = html.match(/aria-label="preset"[^>]*data-annotation-content="([^"]+)"[^>]*data-annotation-total="2"/)
  assert.ok(match)
  const decoded = Buffer.from(match[1], 'base64').toString()
  assert.equal((decoded.match(/class="annotation"/g) ?? []).length, 2)
  assert.match(decoded, /class="vp-abbr"[^>]*>TERM<\/span>/)
  assert.match(decoded, /href="https:\/\/astro\.build\/"/)
  assert.doesNotMatch(decoded, /configured once/)
})

test('Markdown power settings override env presets and can disable abbreviation and annotation syntax', async () => {
  const markdown = siteConfig.markdown
  const previousAbbr = markdown.abbr
  const previousAnnotation = markdown.annotation
  try {
    markdown.abbr = { SSG: 'Configured generator' }
    markdown.annotation = { preset: ['Configured first', 'Configured second'] }
    const configuredUrl = new URL('../../theme/lib/markdown.ts', import.meta.url)
    configuredUrl.searchParams.set('preset-matrix', 'configured')
    const configured = (await import(configuredUrl.href)).renderMarkdown
    const globalHtml = await configured('SSG [+preset]')
    assert.match(globalHtml, /aria-label="Configured generator"/)
    assert.match(globalHtml, /aria-label="preset"[^>]*data-annotation-total="2"/)
    const localHtml = await configured(`SSG [+preset]

*[SSG]: Local generator

[+preset]: Local annotation`)
    assert.match(localHtml, /aria-label="Local generator"/)
    assert.match(localHtml, /aria-label="preset"[^>]*data-annotation-total="1"/)

    markdown.abbr = false
    markdown.annotation = false
    const disabledUrl = new URL('../../theme/lib/markdown.ts', import.meta.url)
    disabledUrl.searchParams.set('preset-matrix', 'disabled')
    const disabled = (await import(disabledUrl.href)).renderMarkdown
    const disabledHtml = await disabled(`SSG [+preset]

*[SSG]: Local generator

[+preset]: Local annotation`)
    assert.doesNotMatch(disabledHtml, /vp-abbr|vp-annotation/)
  } finally {
    markdown.abbr = previousAbbr
    markdown.annotation = previousAnnotation
  }
})

test('Plot defaults follow page options while explicit syntax and component classes win', async () => {
  const html = await renderMarkdown(`Default !!hidden!!.

Explicit !!visible!!{.hover .mask}.

<Plot>component default</Plot>

<Plot trigger="hover" effect="mask">component props</Plot>

<Plot class="hover mask custom">component classes</Plot>`, { plot: { trigger: 'click', effect: 'blur' } })
  assert.match(html, /class="click blur vp-plot" data-plot-default-trigger="true">hidden<\/span>/)
  assert.match(html, /class="hover mask vp-plot">visible<\/span>/)
  assert.match(html, /class="vp-plot click blur" data-plot-default-trigger="true">component default<\/span>/)
  assert.match(html, /class="vp-plot hover mask">component props<\/span>/)
  assert.match(html, /class="vp-plot hover mask custom">component classes<\/span>/)
})

test('global Plot settings can configure or disable the syntax', async () => {
  const markdown = siteConfig.markdown
  const previous = markdown.plot
  try {
    markdown.plot = { trigger: 'click', effect: 'blur' }
    const configuredUrl = new URL('../../theme/lib/markdown.ts', import.meta.url)
    configuredUrl.searchParams.set('plot-matrix', 'configured')
    const configured = (await import(configuredUrl.href)).renderMarkdown
    assert.match(await configured('!!configured!!'), /class="click blur vp-plot"/)
    assert.match(await configured('!!page!!', { plot: { trigger: 'hover' } }), /class="hover blur vp-plot"/)

    markdown.plot = false
    const disabledUrl = new URL('../../theme/lib/markdown.ts', import.meta.url)
    disabledUrl.searchParams.set('plot-matrix', 'disabled')
    const disabled = (await import(disabledUrl.href)).renderMarkdown
    assert.doesNotMatch(await disabled('!!disabled!!'), /vp-plot/)
  } finally {
    markdown.plot = previous
  }
})

test('field, timeline, steps, flex, and window containers preserve Plume options', async () => {
  const html = await renderMarkdown(`:::: field-group
::: field name="legacy" type="string" optional
Before
@unknown keep
@description explicit **text**
after
@type \`number | string\`
@default \`42\`
@required
Tail
:::
::::

::: timeline horizontal=false card=true placement=between line=dashed
- First title
  time="First quarter" TYPE=success icon=mdi:bookmark placement=right card=false

  Body

  - Nested item
- Second
  time=Q2 type=warning card=true
:::

::: timeline horizontal card=false line=dotted
- Horizontal
  time=Q3 type=danger card=true color=#b00
:::

::: steps
1. First
2. Second
:::

::: flex center=true wrap=false gap="calc(1rem + 2px)"
content
:::

::: flex end around column gap=2em
column
:::

::: demo-wrapper title="Legacy" height=100
![x](/img/logo.svg)
:::`)
  assert.match(html, /class="vp-field required optional"[\s\S]*<span class="name">legacy<\/span>[\s\S]*<code>number \| string<\/code>[\s\S]*<code>42<\/code>/)
  assert.match(html, /Before\s+@unknown keep\s+explicit <strong>text<\/strong>\s+after/)
  assert.match(html, /after\s+Tail/)
  assert.match(html, /class="vp-timeline-item success line-dashed between between-right" data-timeline-between="right"/)
  assert.match(html, /class="has-icon vp-timeline-line"[\s\S]*data-iconify-remote="mdi:bookmark"/)
  assert.match(html, /class="vp-timeline-item card warning line-dashed between between-left" data-timeline-between="left"/)
  assert.match(html, /<ul>[\s\S]*Nested item[\s\S]*<\/ul>/)
  assert.match(html, /class="vp-timeline-item card horizontal danger line-dotted" style="--vp-timeline-c-line:#b00;--vp-timeline-c-point:#b00"/)
  assert.match(html, /class="vp-steps"[\s\S]*<ol>[\s\S]*First[\s\S]*Second/)
  assert.match(html, /style="margin:16px 0;display:flex;align-items:center;justify-content:center;gap:calc\(1rem \+ 2px\)"/)
  assert.match(html, /style="margin:16px 0;display:flex;align-items:flex-end;justify-content:space-around;flex-direction:column;gap:2em"/)
  assert.match(html, /class="window-wrapper has-title"[\s\S]*--window-gap:0;--window-height:100px[\s\S]*<img/)
})

test('relative and absolute Markdown links resolve to Astro permalinks', async () => {
  const html = await renderMarkdown(`[Relative](./configuration.md#公告板)

[Absolute](/docs/index.md)

[Route](/docs/)

[Email](mailto:author@example.com)

[Hash](#local)`, { sourcePath: path.resolve('content/docs/guide/content.md') })
  assert.match(html, /href="\/docs\/guide\/configuration\/#%E5%85%AC%E5%91%8A%E6%9D%BF" class="vp-link link">Relative<\/a>/)
  assert.match(html, /href="\/docs\/" class="vp-link link">Absolute<\/a>/)
  assert.match(html, /href="\/docs\/" class="vp-link link">Route<\/a>/)
  assert.match(html, /href="mailto:author@example\.com" target="_blank" rel="noopener noreferrer">Email<\/a>/)
  assert.match(html, /href="#local">Hash<\/a>/)
})

test('Obsidian links, embeds, callouts, and comments match the frozen syntax', async () => {
  const sourcePath = path.resolve('content/docs/guide/content.md')
  const html = await renderMarkdown(`[[docs/guide/configuration]]

[[docs/guide/configuration#公告板|配置别名]]

[[https://example.com|外部链接]]

当前页 [[#提示容器]]

![[/img/logo.svg|20x30]]

行内 ![[docs/guide/configuration#公告板]] 引用

![[docs/guide/configuration#页面过渡]]

![[/media/demo.mp3]]

![[/files/guide.pdf#page=2#height=300]]

![[/media/demo.mp4]]

> [!bug] **自定义**标题
> 错误正文
>
> > [!hint]
> > 嵌套正文

> [!details]
> 折叠正文

注释前 %%不会显示%% 注释后

%%
块注释不会显示
%%

\`\`\`md
[[保留在代码块]]
> [!tip] 不转换
%% 不移除 %%
\`\`\``, { sourcePath })
  assert.match(html, /class="vp-link link" href="\/docs\/guide\/configuration\/">站点配置<\/a>/)
  assert.match(html, /href="\/docs\/guide\/configuration\/#公告板">配置别名<\/a>/)
  assert.match(html, /href="https:\/\/example\.com" target="_blank" rel="noopener noreferrer">外部链接<\/a>/)
  assert.match(html, /href="#提示容器">内容能力 &gt; 提示容器<\/a>/)
  assert.match(html, /<img src="\/img\/logo\.svg" alt="\/img\/logo\.svg" style="width:20px;height:30px"/)
  assert.match(html, /行内 <a class="vp-link link" href="\/docs\/guide\/configuration\/#公告板">站点配置 &gt; 公告板<\/a> 引用/)
  assert.match(html, /<code>transition\.page<\/code> 在完整页面导航时对内容区域执行与 Plume 一致的/)
  assert.match(html, /<audio controls="true" preload="metadata" aria-label="\/media\/demo\.mp3"><source src="\/media\/demo\.mp3"><\/audio>/)
  assert.match(html, /data-pdf-page="2"[\s\S]*data-pdf-height="300px"/)
  assert.match(html, /data-artplayer data-artplayer-src="\/media\/demo\.mp4"/)
  assert.match(html, /class="hint-container caution bug">[\s\S]*<strong>自定义<\/strong>标题[\s\S]*错误正文/)
  assert.match(html, /class="hint-container tip hint">[\s\S]*技巧[\s\S]*嵌套正文/)
  assert.match(html, /<details class="hint-container details">[\s\S]*<summary>详情<\/summary>[\s\S]*折叠正文/)
  assert.match(html, /注释前  注释后/)
  assert.doesNotMatch(html, /块注释不会显示/)
  assert.match(html, /class="language-md"[\s\S]*保留在代码块[\s\S]*不转换[\s\S]*不移除/)
})

test('Obsidian images resolve from the vault root before the current directory', async () => {
  const original = process.cwd()
  const fixture = mkdtempSync(path.join(tmpdir(), 'ermaozi-obsidian-'))
  const sourcePath = path.join(fixture, 'content/docs/page.md')
  try {
    mkdirSync(path.join(fixture, 'content/images'), { recursive: true })
    mkdirSync(path.dirname(sourcePath), { recursive: true })
    writeFileSync(path.join(fixture, 'content/images/root.png'), '')
    writeFileSync(sourcePath, '# Page')
    process.chdir(fixture)
    assert.match(await renderMarkdown('![[images/root.png]]', { sourcePath }), /src="\.\.\/images\/root\.png"/)
  } finally {
    process.chdir(original)
    rmSync(fixture, { recursive: true, force: true })
  }
})

test('Obsidian callouts keep the frozen alias, locale, and custom renderer matrices', async () => {
  const groups = {
    note: ['note', 'quote', 'cite'], tip: ['tip', 'hint'], info: ['info', 'todo'], success: ['success', 'check', 'done'],
    warning: ['warning', 'question', 'help', 'faq'], caution: ['caution', 'attention', 'failure', 'fail', 'missing', 'danger', 'error', 'bug'],
    important: ['important', 'example'], details: ['details', 'abstract', 'summary', 'tldr'],
  }
  const types = Object.values(groups).flat()
  const source = types.map(type => `> [!${type}]\n> body`).join('\n\n')
  const html = await renderMarkdown(source, { sourcePath: path.resolve('content/docs/callouts.md') })
  for (const [actual, aliases] of Object.entries(groups)) {
    for (const type of aliases) assert.match(html, new RegExp(`hint-container ${actual}(?: ${type})?`))
  }
  assert.equal((html.match(/hint-container-title|<summary>/g) ?? []).length, types.length)

  const presets = {
    'zh-TW': ['info', '資訊'],
    'de-DE': ['cite', 'Quellenangabe'],
    'fr-FR': ['tldr', 'En bref'],
    'ru-RU': ['faq', 'ЧаВо'],
    'ja-JP': ['hint', '助言'],
    'ko-KR': ['summary', '정리'],
  }
  try {
    for (const [language, [type, title]] of Object.entries(presets)) {
      const slug = language.toLowerCase()
      siteConfig.locales[language] = { home: `/${slug}/` }
      const localized = await renderMarkdown(`> [!${type}]\n> body`, { sourcePath: path.resolve(`content/${slug}/callout.md`) })
      assert.match(localized, new RegExp(`(?:hint-container-title">|<summary>)${title}<`))
    }
  } finally {
    for (const language of Object.keys(presets)) delete siteConfig.locales[language]
  }

  const markdown = siteConfig.markdown
  const previous = markdown.obsidian
  try {
    markdown.obsidian = { callout: { locales: { '/': { tip: 'Root title' }, '/en/': { tip: 'Route title' } } } }
    const localeUrl = new URL('../../theme/lib/markdown.ts', import.meta.url)
    localeUrl.searchParams.set('obsidian-matrix', 'locales')
    const localeRenderer = (await import(localeUrl.href)).renderMarkdown
    assert.match(await localeRenderer('> [!tip]\n> body', { sourcePath: path.resolve('content/en/callout.md') }), />Route title</)

    markdown.obsidian = { callout: {
      openRender: (tokens, index) => `<aside data-open="${tokens[index].markup}">\n`,
      titleRender: (tokens, index) => `<h6 data-type="${tokens[index].meta.type}">${tokens[index].meta.content}</h6>\n`,
      closeRender: (tokens, index) => `</aside><!--${tokens[index].markup}-->\n`,
    } }
    const callbackUrl = new URL('../../theme/lib/markdown.ts', import.meta.url)
    callbackUrl.searchParams.set('obsidian-matrix', 'callbacks')
    const callbackRenderer = (await import(callbackUrl.href)).renderMarkdown
    assert.match(await callbackRenderer('> [!bug] **Custom**\n> body'), /<aside data-open="bug">[\s\S]*<h6 data-type="bug">\*\*Custom\*\*<\/h6>[\s\S]*<\/aside><!--bug-->/)
  } finally {
    markdown.obsidian = previous
  }
})

test('language REPL containers preserve Plume titles, editors, languages, and output controls', async () => {
  const html = await renderMarkdown(`::: go-repl editable title="Custom Go"
\`\`\`go
package main
\`\`\`
:::

::: kotlin-repl
\`\`\`kotlin
fun main() {}
\`\`\`
:::

::: rust-repl
\`\`\`rust
fn main() {}
\`\`\`
:::

::: python-repl editable
\`\`\`python
print('ok')
\`\`\`
:::`)
  assert.match(html, /data-repl-lang="go" data-repl-editable="true"[\s\S]*<h4>Custom Go<\/h4>/)
  assert.match(html, /data-repl-lang="kotlin"[\s\S]*<h4>kotlin playground<\/h4>/)
  assert.match(html, /data-repl-lang="rust"[\s\S]*language-rust/)
  assert.match(html, /data-repl-lang="python" data-repl-editable="true"[\s\S]*language-python/)
  assert.equal((html.match(/class="icon-run"/g) ?? []).length, 4)
  assert.equal((html.match(/class="code-repl-output" hidden/g) ?? []).length, 4)
})

test('Can I Use preserves frozen enablement, mode, version, and invalid-input defaults', async () => {
  const previous = siteConfig.markdown.caniuse
  try {
    siteConfig.markdown.caniuse = true
    let html = await renderMarkdown('@[caniuse{-8,-5,-2,0,3,8,nope}](css__grid)\n\n@[caniuse]()')
    assert.match(html, /data-feature="css_grid" data-past="5" data-future="3"/)
    assert.equal((html.match(/data-caniuse/g) ?? []).length, 1)

    siteConfig.markdown.caniuse = { mode: 'baseline' }
    html = await renderMarkdown('@[caniuse](css-grid)\n\n::: caniuse css-grid\n:::')
    assert.equal((html.match(/class="ciu_embed baseline"/g) ?? []).length, 2)

    siteConfig.markdown.caniuse = { mode: 'image' }
    html = await renderMarkdown('@[caniuse](css-grid)')
    assert.match(html, /<picture><source type="image\/webp" srcset="https:\/\/caniuse\.bitsofco\.de\/image\/css-grid\.webp">/)

    siteConfig.markdown.caniuse = { mode: 'invalid' }
    html = await renderMarkdown('@[caniuse](css-grid)\n\n::: caniuse css-grid\n:::')
    assert.match(html, /data-caniuse/)
    assert.match(html, /<picture>/)

    siteConfig.markdown.caniuse = false
    html = await renderMarkdown('@[caniuse](css-grid)\n\n::: caniuse css-grid\n:::')
    assert.doesNotMatch(html, /data-caniuse|caniuse\.bitsofco\.de/)
  } finally {
    siteConfig.markdown.caniuse = previous
  }
})

test('trusted Chart.js and ECharts scripts require an exact Markdown allowlist match', async () => {
  const markdown = siteConfig.markdown
  const enabled = markdown.DANGEROUS_ALLOW_SCRIPT_EXECUTION
  const allowlist = markdown.DANGEROUS_SCRIPT_EXECUTION_ALLOWLIST
  markdown.DANGEROUS_ALLOW_SCRIPT_EXECUTION = true
  markdown.DANGEROUS_SCRIPT_EXECUTION_ALLOWLIST = ['docs/guide/trusted.md']
  try {
    const source = `::: chartjs\n\`\`\`js\nconfig = { type: 'bar' }\n\`\`\`\n:::\n\n::: echarts\n\`\`\`js\noption = { series: [] }\n\`\`\`\n:::`
    const trusted = await renderMarkdown(source, { sourcePath: path.resolve('content/docs/guide/trusted.md') })
    assert.match(trusted, /data-chartjs[\s\S]*data-chart-type="js"/)
    assert.match(trusted, /data-echarts[\s\S]*data-chart-type="js"/)
    assert.equal(await renderMarkdown(source, { sourcePath: path.resolve('content/docs/guide/untrusted.md') }), '')
  } finally {
    markdown.DANGEROUS_ALLOW_SCRIPT_EXECUTION = enabled
    markdown.DANGEROUS_SCRIPT_EXECUTION_ALLOWLIST = allowlist
  }
})

test('chart feature switches and Flowchart preset fallback match Plume', async () => {
  const markdown = siteConfig.markdown
  const keys = ['chartjs', 'echarts', 'flowchart', 'markmap', 'plantuml', 'mermaid']
  const previous = Object.fromEntries(keys.map(key => [key, markdown[key]]))
  const source = `::: chartjs
\`\`\`json
{"type":"bar"}
\`\`\`
:::

\`\`\`echarts
{"series":[]}
\`\`\`

@startuml
A -> B
@enduml

\`\`\`flow:unknown
st=>start: Start
e=>end: End
st->e
\`\`\`

\`\`\`markmap
# Root
\`\`\`

\`\`\`mermaid
flowchart LR
A --> B
\`\`\``
  try {
    Object.assign(markdown, Object.fromEntries(keys.map(key => [key, false])))
    const disabled = await renderMarkdown(source)
    assert.doesNotMatch(disabled, /data-(?:chartjs|echarts|flowchart|markmap)|PlantUML Diagram|data-mermaid-source/)

    Object.assign(markdown, previous)
    const enabled = await renderMarkdown(source)
    assert.match(enabled, /data-chartjs/)
    assert.match(enabled, /data-echarts/)
    assert.match(enabled, /class="chartjs-loading"[\s\S]*class="chartjs-wrapper" style="display:none"/)
    assert.match(enabled, /class="echarts-loading"/)
    assert.match(enabled, /class="flowchart-wrapper vue"/)
    assert.match(enabled, /class="flowchart-loading"[\s\S]*class="flowchart-wrapper vue" style="display:none"/)
    assert.match(enabled, /data-markmap/)
    assert.match(enabled, /class="markmap-loading"/)
    assert.match(enabled, /alt="PlantUML Diagram"/)
    assert.match(enabled, /data-mermaid-source/)
  } finally {
    Object.assign(markdown, previous)
  }
})

test('PlantUML accepts custom option arrays', async () => {
  const markdown = siteConfig.markdown
  const previous = markdown.plantuml
  markdown.plantuml = [{ name: 'uml', server: 'https://example.com/plantuml' }]
  try {
    const html = await renderMarkdown('@startuml\nA -> B\n@enduml\n\n@startjson\n{}\n@endjson')
    assert.match(html, /src="https:\/\/example\.com\/plantuml\/svg\//)
    assert.doesNotMatch(html, /alt="PlantUML JSON Diagram"/)
  } finally {
    markdown.plantuml = previous
  }
})

test('media embeds preserve Plume switches, options, and safe inline audio', async () => {
  const markdown = siteConfig.markdown
  const keys = ['acfun', 'bilibili', 'youtube', 'pdf', 'audioReader', 'artPlayer']
  const previous = Object.fromEntries(keys.map(key => [key, markdown[key]]))
  const source = `@[acfun](ac123)

@[bilibili p2 autoplay time="1:05"](BV123 12 34)

@[youtube loop start="40" end="1:20"](video)

@[pdf 2 no-toolbar width="90%" ratio="1:1"](/guide.pdf)

word @[audioReader type="audio/mpeg" start-time="0" end-time="2" volume="0.5"](/word.mp3)

@[audioReader](javascript:alert(1))

@[artPlayer autoplay type="mov"](/movie)

<ArtPlayer src="/direct.mp4" screenshot mini-progress-bar :layers='[{"name":"caption"}]' volume="0.25" />

![[obsidian.mp4]]

![[obsidian.pdf#page=3#height=240]]`
  try {
    Object.assign(markdown, Object.fromEntries(keys.map(key => [key, false])))
    const disabled = await renderMarkdown(source)
    assert.doesNotMatch(disabled, /data-(?:video-embed|pdf-viewer|audio-reader|artplayer)/)
    assert.match(disabled, /<ArtPlayer src="\/obsidian\.mp4" \/>/)
    assert.match(disabled, /<PDFViewer src="\/obsidian\.pdf" width="100%" page="3" height="240" \/>/)

    Object.assign(markdown, previous, { pdf: { pdfjsUrl: '/vendor/pdfjs/' } })
    const enabled = await renderMarkdown(source)
    assert.match(enabled, /https:\/\/www\.acfun\.cn\/player\/ac123/)
    assert.match(enabled, /bvid=BV123&amp;aid=12&amp;cid=34&amp;p=2&amp;t=65&amp;autoplay=1&amp;high_quality=1/)
    assert.match(enabled, /youtube\.com\/embed\/\/video\?loop=1&amp;start=40&amp;end=80/)
    assert.match(enabled, /data-pdf-page="2"[\s\S]*data-pdf-toolbar="0"[\s\S]*data-pdf-ratio="1:1"[\s\S]*data-pdfjs-url="\/vendor\/pdfjs\/"/)
    assert.match(enabled, /data-audio-type="audio\/mpeg"[\s\S]*data-audio-start="0"[\s\S]*data-audio-volume="0\.5"/)
    assert.doesNotMatch(enabled, /data-audio-src="javascript:/)
    assert.match(enabled, /class="md-power-loading absolute"[\s\S]*<animateTransform/)
    const options = [...enabled.matchAll(/data-artplayer-options="([^"]+)"/g)].map(match => JSON.parse(Buffer.from(match[1], 'base64').toString()))
    assert.deepEqual(options[0], {
      type: 'mov', volume: 0.75, autoplay: true, muted: true, autoMini: false, loop: false,
      fullscreen: true, flip: true, playbackRate: true, aspectRatio: true, setting: true, pip: true,
    })
    assert.deepEqual(options[1], { type: 'mp4', volume: 0.25, layers: [{ name: 'caption' }], screenshot: true, miniProgressBar: true })
    assert.deepEqual(options[2], {
      type: 'mp4', volume: 0.75, autoplay: false, muted: false, autoMini: false, loop: false,
      fullscreen: true, flip: true, playbackRate: true, aspectRatio: true, setting: true, pip: true,
    })
    assert.match(enabled, /data-pdf-src="\/obsidian\.pdf"[\s\S]*data-pdf-page="3"[\s\S]*data-pdf-height="240px"/)
  } finally {
    Object.assign(markdown, previous)
  }
})
