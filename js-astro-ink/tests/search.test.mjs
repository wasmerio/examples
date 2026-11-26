import assert from 'node:assert/strict'
import test from 'node:test'
import { matchingSection, queryTerms, searchPosts } from '../src/utils/search.ts'
import { extractSearchContent } from '../src/utils/search-content.ts'

const post = (slug, fields = {}) => ({
  slug,
  title: 'An article',
  description: '',
  content: '',
  tags: [],
  date: '2026-01-01',
  ...fields
})

test('title relevance wins over newer body matches, followed by tags and descriptions', () => {
  const posts = [
    post('body', { content: 'Astro', date: '2026-09-01' }),
    post('description', { description: 'Astro' }),
    post('tags', { tags: ['Astro'] }),
    post('title', { title: 'Astro guide' })
  ]
  assert.deepEqual(
    searchPosts(posts, ' ASTRO ').map((p) => p.slug),
    ['title', 'tags', 'description', 'body']
  )
  assert.equal(posts[0].slug, 'body') // ranking does not reorder the original index
})

test('search finds text beyond 4000 characters and handles Chinese, empty and missing queries', () => {
  const posts = [post('long', { content: '正文内容'.repeat(1200) + '全文尾部标记' })]
  assert.equal(searchPosts(posts, '全文尾部标记')[0].slug, 'long')
  assert.deepEqual(searchPosts(posts, '   '), [])
  assert.deepEqual(searchPosts(posts, 'not present'), [])
})

test('equally relevant matches are ordered newest first', () => {
  const posts = [
    post('old', { title: 'Guide' }),
    post('new', { title: 'Guide', date: '2026-02-01' })
  ]
  assert.deepEqual(
    searchPosts(posts, 'guide').map((p) => p.slug),
    ['new', 'old']
  )
})

test('all search terms must match across fields; exact phrases break score ties', () => {
  const posts = [
    post('across', { title: 'Astro', tags: ['部署'] }),
    post('missing', { title: 'Astro only' }),
    post('separate', { content: 'Astro 构建与部署', date: '2026-09-01' }),
    post('phrase', { content: 'Astro 部署' })
  ]
  assert.deepEqual(queryTerms(' ASTRO  部署  astro '), ['astro', '部署'])
  assert.deepEqual(
    searchPosts(posts, 'Astro 部署').map((p) => p.slug),
    ['across', 'phrase', 'separate']
  )
})

test('heading targets use rendered IDs and match the most relevant section', () => {
  const indexed = extractSearchContent(`
    <p>Introduction only</p>
    <h2 id="部署">部署</h2><p>关于网站</p>
    <h2 id="部署-1"><em>部署</em></h2><p>Astro 的服务配置</p>
    <div class="astro-code"><pre><code>pnpm build</code></pre><button>Copy code</button></div>
  `)
  const item = post('test', indexed)
  const best = matchingSection(item, queryTerms('Astro 部署'))
  assert.equal(best.section.id, '部署-1')
  assert.equal(best.text, '部署 Astro 的服务配置 pnpm build')
  assert.equal(matchingSection(item, ['introduction']), undefined)
  assert.equal(item.content.includes('Copy code'), false)
  assert.equal(matchingSection(post('old-index'), ['text']), undefined)
})

test('a match spread across unrelated sections links to the article', () => {
  const body = extractSearchContent('<h2 id="one">Fonts</h2>Astro<h2 id="two">部署</h2>')
  const item = post('notes', body)
  assert.deepEqual(searchPosts([item], 'Astro 部署'), [item])
  assert.equal(matchingSection(item, ['astro', '部署']), undefined)
  assert.equal(matchingSection({ ...item, tags: ['Astro'] }, ['astro', '部署']).section.id, 'two')
})
