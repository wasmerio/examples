import assert from 'node:assert/strict'
import test from 'node:test'
import rehypeBaseLinks from '../src/plugins/rehype-base-links.ts'

test('Markdown links keep their site paths when a deployment prefix is added', () => {
  const hrefs = [
    '/blog/features?from=welcome#details',
    '/',
    '#details',
    '../reference',
    'https://example.com/a',
    '//example.com/b',
    'mailto:hello@example.com'
  ]
  for (const [base, prefix] of [
    ['', ''],
    ['/', ''],
    ['/astro-theme-ink/', '/astro-theme-ink'],
    ['/blog', '/blog']
  ]) {
    const children = hrefs.map((href) => ({
      type: 'element',
      tagName: 'a',
      properties: { href },
      children: []
    }))
    rehypeBaseLinks(base)({ type: 'root', children })
    assert.deepEqual(
      children.map((link) => link.properties.href),
      [`${prefix}${hrefs[0]}`, `${prefix}/`, ...hrefs.slice(2)]
    )
  }
})
