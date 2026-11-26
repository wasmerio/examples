import assert from 'node:assert/strict'
import test from 'node:test'
import { siteConfig } from '../../site.config.mjs'

siteConfig.markdown.math = { type: 'mathjax', output: 'svg', delimiters: 'all', a11y: true, tex: { tags: 'all' }, svg: { scale: 1.25, displayAlign: 'left' } }
const { renderMarkdown } = await import('../../theme/lib/markdown.ts?renderer=mathjax')

test('MathJax can replace KaTeX and emit accessible SVG plus collected styles', async () => {
  const html = await renderMarkdown('Inline \\(x^2\\)\n\n$$\\frac{a}{b}\\tag{A}$$')
  assert.match(html, /class="mathjax-output-style"/)
  assert.match(html, /<mjx-container[^>]*><svg/)
  assert.match(html, /data-mml-node="mfrac"/)
  assert.match(html, /mjx-assistive-mml/)
  assert.match(html, /style="font-size: 125%/)
  assert.match(html, /justify="left"/)
  assert.match(html, /id="mjx-eqn:A"/)
  assert.doesNotMatch(html, /class="katex"/)
})
