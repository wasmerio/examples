import assert from 'node:assert/strict'
import test from 'node:test'
import { hasRobotsDirective, headMetaContent, serializeHeadItems } from '../../theme/lib/head.ts'
import { llmMarkdownSource, normalMarkdownSource } from '../../theme/lib/llm-markdown.ts'

test('frozen browser-only and LLM-only tags keep their source contracts', () => {
  const source = 'Visible <llm-exclude>browser only</llm-exclude>\n<llm-only>model only</llm-only>'
  assert.equal(normalMarkdownSource(source), 'Visible browser only\n')
  assert.equal(llmMarkdownSource(source), 'Visible \nmodel only')
})

test('page head items are validated, escaped, and marked for partial navigation', () => {
  const items = [
    ['meta', { name: 'theme-layout', content: 'custom & safe' }],
    ['META', { name: 'ROBOTS', content: 'Follow, NOINDEX' }],
    ['script', { async: true, defer: false, nonce: null }, 'run()'],
    ['p', {}, '<unsafe>'],
    ['bad tag', {}, 'ignored'],
  ]
  assert.equal(headMetaContent(items, 'robots'), 'Follow, NOINDEX')
  assert.equal(hasRobotsDirective(items, 'noindex'), true)
  assert.equal(serializeHeadItems(items), '<meta data-ermaozi-managed-head name="theme-layout" content="custom &amp; safe"><meta data-ermaozi-managed-head name="ROBOTS" content="Follow, NOINDEX"><script data-ermaozi-managed-head async>run()</script><p data-ermaozi-managed-head>&lt;unsafe></p>')
})
