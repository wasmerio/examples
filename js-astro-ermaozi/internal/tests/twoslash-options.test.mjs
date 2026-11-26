import assert from 'node:assert/strict'
import test from 'node:test'
import { siteConfig } from '../../site.config.mjs'

siteConfig.codeHighlighter = {
  twoslash: {
    explicitTrigger: false,
    langs: ['ts'],
    twoslashOptions: { compilerOptions: { strict: true } },
  },
}
const { renderMarkdown } = await import('../../theme/lib/markdown.ts?renderer=twoslash-options')

test('Twoslash forwards frozen transformer and compiler options', async () => {
  const html = await renderMarkdown('```ts\nconst value = 1\n```\n\n```ts notwoslash\nconst plain = 2\n```')
  assert.equal((html.match(/twoslash lsp/g) ?? []).length, 1)
  assert.match(html, /<pre class="vp-code [^"]*twoslash lsp/)
  assert.match(html, />plain<\/span>/)
})
