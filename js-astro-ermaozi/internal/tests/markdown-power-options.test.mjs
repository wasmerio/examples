import assert from 'node:assert/strict'
import test from 'node:test'
import { siteConfig } from '../../site.config.mjs'

test('plugins.markdownPower false disables its syntax without disabling independent Markdown plugins', async () => {
  const previous = siteConfig.plugins.markdownPower
  try {
    siteConfig.plugins.markdownPower = false
    const url = new URL('../../theme/lib/markdown.ts', import.meta.url)
    url.searchParams.set('markdown-power', 'disabled')
    const { renderMarkdown } = await import(url.href)
    const html = await renderMarkdown(`==hidden== ::simple-icons:astro::

@[codepen](user/example)

::: steps
1. Disabled
:::

::: tip
Independent hint
:::

::: chartjs
\`\`\`json
{"type":"bar","data":{"labels":[],"datasets":[]}}
\`\`\`
:::`)
    assert.match(html, /==hidden== ::simple-icons:astro::/)
    assert.doesNotMatch(html, /vp-steps|vp-icon/)
    assert.match(html, /<a href="user\/example"[^>]*>codepen<\/a>/)
    assert.match(html, /class="hint-container tip"/)
    assert.match(html, /data-chartjs/)
  } finally {
    siteConfig.plugins.markdownPower = previous
  }
})

test('external code embeds honor their individual Plume switches', async () => {
  const names = ['codepen', 'codeSandbox', 'jsfiddle', 'replit']
  const previous = Object.fromEntries(names.map(name => [name, siteConfig.markdown[name]]))
  try {
    for (const name of names) siteConfig.markdown[name] = false
    const url = new URL('../../theme/lib/markdown.ts', import.meta.url)
    url.searchParams.set('code-embeds', 'disabled')
    const { renderMarkdown } = await import(url.href)
    const source = '@[codepen](user/example)\n\n@[jsfiddle](user/example)\n\n@[codesandbox](example)\n\n@[replit](user/example)'
    const html = await renderMarkdown(source)
    assert.doesNotMatch(html, /data-code-embed=/)
    for (const name of ['codepen', 'jsfiddle', 'codesandbox', 'replit']) assert.match(html, new RegExp(`>${name}<\\/a>`))
  } finally {
    Object.assign(siteConfig.markdown, previous)
  }
})

test('block embeds keep working inside blockquotes and lists', async () => {
  const { renderMarkdown } = await import('../../theme/lib/markdown.ts')
  const html = await renderMarkdown(`> @[codepen](user/example)

- @[youtube](video)

> @[pdf](https://example.com/example.pdf)`, { sourcePath: 'content/embed-context.md' })
  assert.match(html, /<blockquote>\s*<iframe[^>]+data-code-embed="codepen"/)
  assert.match(html, /<li>\s*<iframe[^>]+class="video-iframe youtube"/)
  assert.match(html, /<blockquote>\s*<div[^>]+data-pdf-viewer/)
})

test('block embeds use Plume strict line syntax', async () => {
  const { renderMarkdown } = await import('../../theme/lib/markdown.ts')
  const valid = await renderMarkdown(`@[codepen   preview](  user/example  )

@[youtube](first)
@[youtube](second)

@[qrcode](  plain text  )`, { sourcePath: 'content/embed-syntax.md' })
  assert.match(valid, /data-code-embed="codepen"/)
  assert.match(valid, /src="https:\/\/codepen\.io\/user\/embed\/preview\/example\?default-tab=result/)
  assert.equal((valid.match(/class="video-iframe youtube"/g) ?? []).length, 2)
  assert.match(valid, /data-qrcode-text="plain text"/)

  const invalid = await renderMarkdown(`@[codepenpreview](user/example)

@[codepen](user/example)extra)

@[youtube](video) suffix

@[YouTube](video)

@[artplayer](/video.mp4)`, { sourcePath: 'content/embed-syntax.md' })
  assert.doesNotMatch(invalid, /data-code-embed=|class="video-iframe youtube"/)
  assert.match(invalid, /codepenpreview/)
  assert.match(invalid, /extra/)
  assert.match(invalid, /suffix/)
  assert.match(invalid, /YouTube/)
  assert.match(invalid, /artplayer/)
})

test('demo embeds use strict syntax inside blockquotes and lists', async () => {
  const { renderMarkdown } = await import('../../theme/lib/markdown.ts')
  const html = await renderMarkdown(`> @[demo markdown title="Quoted"](/snippets/demo/example.md.txt)

- @[demo markdown title="Listed"](/snippets/demo/example.md.txt)

> \`\`\`md
> @[demo markdown](/snippets/demo/example.md.txt)
> \`\`\`

@[demo markdown](/snippets/demo/example.md.txt) suffix`, { sourcePath: 'content/embed-syntax.md' })
  assert.equal((html.match(/class="vp-demo-wrapper markdown"/g) ?? []).length, 2)
  assert.match(html, /<blockquote>[\s\S]*class="vp-demo-wrapper markdown"/)
  assert.match(html, /<ul>[\s\S]*class="vp-demo-wrapper markdown"/)
  assert.match(html, /class="language-md" data-highlighter="shiki"/)
  assert.match(html, /suffix/)
})

test('codeTree object options provide overridable global defaults', async () => {
  const previous = siteConfig.markdown.codeTree
  try {
    siteConfig.markdown.codeTree = { height: 480, icon: 'simple' }
    const url = new URL('../../theme/lib/markdown.ts', import.meta.url)
    url.searchParams.set('code-tree-options', 'defaults')
    const { renderMarkdown } = await import(url.href)
    const source = `::: code-tree
\`\`\`ts title="src/index.ts"
export {}
\`\`\`
:::`
    const defaults = await renderMarkdown(source)
    const tree = defaults.slice(0, defaults.indexOf('<div class="code-panel"'))
    assert.match(defaults, /code-tree-panel" style="max-height:480px"/)
    assert.match(defaults, /code-panel" style="height:480px"/)
    assert.match(tree, /fill="#c5c5c5"/)
    assert.doesNotMatch(tree, /fill="#007acc"/)

    const local = await renderMarkdown(source.replace('::: code-tree', '::: code-tree height="240" icon="colored"'))
    assert.match(local, /code-tree-panel" style="max-height:240px"/)
    assert.match(local.slice(0, local.indexOf('<div class="code-panel"')), /fill="#007acc"/)
  } finally {
    siteConfig.markdown.codeTree = previous
  }
})

test('encrypt object supplies the frozen default snippet password', async () => {
  const previous = siteConfig.markdown.encrypt
  try {
    siteConfig.markdown.encrypt = { password: 'default-password' }
    const url = new URL('../../theme/lib/markdown.ts', import.meta.url)
    url.searchParams.set('snippet-password', 'default')
    const { renderMarkdown } = await import(url.href)
    const html = await renderMarkdown('::: encrypt\nprivate default content\n:::', { sourcePath: 'content/default-encrypt.md' })
    assert.match(html, /data-encrypt-snippet/)
    assert.match(html, /data-encrypt-ciphertext="[^"]+"/)
    assert.doesNotMatch(html, /private default content/)
  } finally {
    siteConfig.markdown.encrypt = previous
  }
})

test('Markdown Power locales override common, encryption, and Obsidian text by path', async () => {
  const previous = siteConfig.markdown.locales
  try {
    siteConfig.markdown.locales = {
      '/en/': {
        common: { copy: 'Copy tree now', copied: 'Tree copied' },
        encrypt: { incPwd: 'Try another password' },
        obsidian: { tip: 'Custom tip' },
      },
      '/en/private/': {
        common: { copy: 'Copy private tree', copied: 'Private tree copied' },
        encrypt: { incPwd: 'Try the private password' },
        obsidian: { tip: 'Private tip' },
      },
    }
    const url = new URL('../../theme/lib/markdown.ts', import.meta.url)
    url.searchParams.set('encrypt-locale', 'english')
    const { renderMarkdown } = await import(url.href)
    const html = await renderMarkdown('::: file-tree\n- file.txt\n:::\n\n> [!tip]\n> body\n\n::: encrypt password="test"\nsecret\n:::', { sourcePath: 'content/en/private/example.md' })
    assert.match(html, /aria-label="Copy private tree" data-copied="Private tree copied"/)
    assert.match(html, />Private tip<\/p>/)
    assert.match(html, /The content is encrypted, please unlock to view\./)
    assert.match(html, /placeholder="Enter password"/)
    assert.match(html, />Try the private password<\/p>/)
    assert.doesNotMatch(html, />secret</)
  } finally {
    siteConfig.markdown.locales = previous
  }
})

test('hint and alert switches disable their independent Plume parsers', async () => {
  const markdown = siteConfig.markdown
  const previous = { hint: markdown.hint, alert: markdown.alert, obsidian: markdown.obsidian }
  try {
    Object.assign(markdown, { hint: false, alert: false, obsidian: false })
    const url = new URL('../../theme/lib/markdown.ts', import.meta.url)
    url.searchParams.set('hints', 'disabled')
    const { renderMarkdown } = await import(url.href)
    const html = await renderMarkdown('::: tip\ncontainer\n:::\n\n> [!TIP]\n> alert')
    assert.doesNotMatch(html, /hint-container/)
    assert.match(html, /::: tip/)
    assert.match(html, /\[!TIP\]/)
  } finally {
    Object.assign(markdown, previous)
  }
})

test('codeTabs icon filters match the frozen Plume option contract', async () => {
  const previous = siteConfig.markdown.codeTabs
  const source = `::: code-tabs
@tab pnpm

\`\`\`sh
pnpm install
\`\`\`

@tab index.ts

\`\`\`ts
export {}
\`\`\`

@tab README.md

\`\`\`md
# Readme
\`\`\`
:::`
  try {
    siteConfig.markdown.codeTabs = { icon: false }
    const url = new URL('../../theme/lib/markdown.ts', import.meta.url)
    url.searchParams.set('code-tabs-icons', 'filtered')
    const { renderMarkdown } = await import(url.href)
    assert.doesNotMatch(await renderMarkdown(source), /class="vp-icon is-svg"/)

    siteConfig.markdown.codeTabs = { icon: { named: ['pnpm'], extensions: ['.ts'] } }
    const filtered = await renderMarkdown(source)
    assert.match(filtered, /data-tab-value="pnpm"[^>]*>\s*<span class="vp-icon is-svg"/)
    assert.match(filtered, /data-tab-value="index\.ts"[^>]*>\s*<span class="vp-icon is-svg"/)
    assert.doesNotMatch(filtered, /data-tab-value="README\.md"[^>]*>\s*<span class="vp-icon is-svg"/)
  } finally {
    if (previous === undefined) delete siteConfig.markdown.codeTabs
    else siteConfig.markdown.codeTabs = previous
  }
})
