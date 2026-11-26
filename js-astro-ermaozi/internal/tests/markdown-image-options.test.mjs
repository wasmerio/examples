import assert from 'node:assert/strict'
import test from 'node:test'
import { siteConfig } from '../../site.config.mjs'

const renderer = async (name, image) => {
  siteConfig.markdown.image = image
  const url = new URL('../../theme/lib/markdown.ts', import.meta.url)
  url.searchParams.set('markdown-image', name)
  return (await import(url.href)).renderMarkdown
}

test('Markdown image options preserve Plume figure, loading, mark, and size syntaxes', async () => {
  const previous = siteConfig.markdown.image
  try {
    const enhanced = await renderer('enhanced', { figure: true, lazyload: true, mark: true })
    const figure = await enhanced('![Caption](/img/logo.svg#dark)')
    assert.match(figure, /^<figure><img src="\/img\/logo\.svg" alt="Caption" tabindex="0" decoding="async" loading="lazy" data-mode="darkmode-only"><figcaption>Caption<\/figcaption><\/figure>/)
    assert.doesNotMatch(figure, /fetchpriority/)

    const legacy = await renderer('legacy', { legacySize: true })
    assert.match(await legacy('![Legacy](/img/logo.svg =50%x25%)'), /alt="Legacy" width="50%" height="25%"/)

    const obsidian = await renderer('obsidian', { obsidianSize: true })
    assert.match(await obsidian('![Obsidian|90x45](/img/logo.svg)'), /alt="Obsidian" width="90" height="45"/)
  } finally {
    siteConfig.markdown.image = previous
  }
})
