import assert from 'node:assert/strict'
import test from 'node:test'
import { siteConfig } from '../../site.config.mjs'

siteConfig.markdown.math = false
const { renderMarkdown } = await import('../../theme/lib/markdown.ts?renderer=math-disabled')

test('math rendering can be disabled like frozen Plume', async () => {
  const html = await renderMarkdown('Inline $x^2$ and \\(y^2\\).\n\n$$z^2$$')
  assert.match(html, /\$x\^2\$/)
  assert.match(html, /\$\$z\^2\$\$/)
  assert.doesNotMatch(html, /class="(?:katex|MathJax)|<mjx-container/)
})
