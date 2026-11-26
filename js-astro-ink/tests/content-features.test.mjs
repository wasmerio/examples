import assert from 'node:assert/strict'
import test from 'node:test'
import rehypeContentFeatures from '../src/plugins/rehype-content-features.ts'

test('only rendered KaTeX enables math styles, not code samples containing dollars', () => {
  const run = rehypeContentFeatures()
  const file = { data: { astro: { frontmatter: {} } } }
  run(
    {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'code',
          properties: {},
          children: [{ type: 'text', value: '$E=mc^2$' }]
        }
      ]
    },
    file
  )
  assert.equal(file.data.astro.frontmatter.hasMath, false)
  run(
    {
      type: 'root',
      children: [
        { type: 'element', tagName: 'span', properties: { className: ['katex'] }, children: [] }
      ]
    },
    file
  )
  assert.equal(file.data.astro.frontmatter.hasMath, true)
})
