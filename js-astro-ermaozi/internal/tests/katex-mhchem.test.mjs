import assert from 'node:assert/strict'
import test from 'node:test'
import { siteConfig } from '../../site.config.mjs'

siteConfig.markdown.math = { type: 'katex', delimiters: 'all', mhchem: true, mathFence: true, allowInlineWithSpace: true, macros: { '\\RR': '\\mathbb{R}' } }
const { renderMarkdown } = await import('../../theme/lib/markdown.ts?renderer=katex-mhchem')

test('KaTeX supports mhchem, bracket delimiters, and renderer options', async () => {
  const html = await renderMarkdown('Chemistry \\(\\ce{H2O}\\), \\(\\RR\\), and $ x + 1 $.\n\n```math\n\\frac{1}{2}\n```')
  assert.match(html, /class="katex"/)
  assert.match(html, /mord mathrm">H/)
  assert.match(html, /mathbb">R/)
  assert.match(html, /class="katex-display"/)
  assert.match(html, /class="mfrac"/)
  assert.equal((html.match(/class="katex"/g) ?? []).length, 4)
  assert.doesNotMatch(html, /katex-error/)
})
