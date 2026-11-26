import assert from 'node:assert/strict'
import test from 'node:test'
import { siteConfig } from '../../site.config.mjs'

siteConfig.markdown.math = { type: 'mathjax', output: 'chtml', delimiters: 'brackets', a11y: false, chtml: { scale: 1.1, displayAlign: 'right' } }
const { renderMarkdown } = await import('../../theme/lib/markdown.ts?renderer=mathjax-chtml')

test('MathJax supports CHTML, bracket delimiters, and optional assistive MathML', async () => {
  const html = await renderMarkdown('Inline \\(x^2\\)\n\n\\[\\frac{a}{b}\\]')
  assert.match(html, /class="mathjax-output-style"/)
  assert.match(html, /<mjx-container[^>]*class="MathJax"/)
  assert.match(html, /<mjx-mfrac/)
  assert.match(html, /style="font-size: 110%/)
  assert.match(html, /justify="right"/)
  assert.doesNotMatch(html, /<svg/)
  assert.doesNotMatch(html, /mjx-assistive-mml/)
  assert.doesNotMatch(html, /class="katex"/)
})
