import assert from 'node:assert/strict'
import test from 'node:test'
import { getPostAliases, getSeriesNavigation } from '../src/utils/post-navigation.ts'

const entry = (id, data = {}) => ({ id, data })

test('post aliases normalize trailing slashes and URL encoding, and retain the canonical entry id', () => {
  const post = entry('library/index', { aliases: ['/blog/old/', '/%E4%B9%A6'] })
  assert.deepEqual(getPostAliases([post]), [
    { alias: 'blog/old', postId: 'library/index' },
    { alias: '书', postId: 'library/index' }
  ])
  assert.deepEqual(getPostAliases([entry('other')]), [])
})

test('aliases reject duplicate paths, canonical posts, external URLs and ambiguous segments', () => {
  const post = entry('library/index', { aliases: ['/past'] })
  for (const alias of [
    '/past/',
    '/Past',
    '/blog/library',
    'elsewhere',
    '//host',
    '/',
    '/%2e%2e',
    '/one%2ftwo',
    '/a?b',
    '/#c'
  ]) {
    assert.throws(
      () => getPostAliases([post, entry('other', { aliases: [alias] })]),
      /alias/i,
      alias
    )
  }
})

test('series respect author order, gaps, endpoints and publication visibility', () => {
  const first = entry('basics', { series: { name: 'Spike', order: 10 } })
  const second = entry('mechanics', { series: { name: 'Spike', order: 20 } })
  const other = entry('standalone')
  const published = [second, other, first]
  assert.deepEqual(getSeriesNavigation(first, published), {
    name: 'Spike',
    position: 1,
    total: 2,
    previous: undefined,
    next: second
  })
  assert.equal(getSeriesNavigation(second, published).previous, first)
  assert.equal(getSeriesNavigation(second, published).next, undefined)
  assert.equal(getSeriesNavigation(first, [second, other]), undefined)
  assert.equal(getSeriesNavigation(first, [first, other]), undefined)
  assert.equal(getSeriesNavigation(other, published), undefined)
  assert.throws(
    () => getSeriesNavigation(first, [...published, entry('another', first.data)]),
    /Duplicate order/
  )
})
