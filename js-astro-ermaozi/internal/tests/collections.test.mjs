import assert from 'node:assert/strict'
import test from 'node:test'
import { collectionForEntry, collectionsFor, defineCollection, defineCollections, defineNavbarConfig, defineThemeConfig, docCollectionForSidebar } from '../../theme/lib/collections.ts'
import { configuredSidebarFor, resolveSidebar, sidebarGroups } from '../../theme/lib/sidebar.ts'

const config = {
  locales: {
    'zh-CN': { home: '/', collections: [{ type: 'post', dir: 'news', title: '新闻', link: '/updates/', tagsLink: '/topics/', tagsText: '主题', categoriesText: '栏目', archivesText: '时间线', include: ['**/*.md', '!private/**'], exclude: ['draft/**'] }] },
    'en-US': { home: '/en/', collections: [{ type: 'post', dir: 'notes', title: 'Notes' }, { type: 'doc', dir: 'manual', title: 'Manual', sidebar: 'auto', sidebarCollapsed: true }] },
  },
}

test('multiple locale collections resolve frozen Plume routes, filters, and identity helpers', () => {
  assert.deepEqual(collectionsFor('en-US', { locales: { 'en-US': { home: '/en/' } } }), [])
  assert.deepEqual(collectionsFor('en-US', { locales: { 'en-US': { home: '/en/', collections: [] } } }), [])

  const [news] = collectionsFor('zh-CN', config)
  assert.equal(news.link, '/updates/')
  assert.equal(news.tagsLink, '/topics/')
  assert.equal(news.categoriesLink, '/updates/categories/')
  assert.equal(news.tagsText, '主题')
  assert.equal(news.categoriesText, '栏目')
  assert.equal(news.archivesText, '时间线')
  assert.equal(collectionForEntry('news/post', 'zh-CN', config)?.key, 'zh-CN:news')
  assert.equal(collectionForEntry('news/draft/post', 'zh-CN', config), undefined)
  assert.equal(collectionForEntry('news/private/post', 'zh-CN', config), undefined)

  const nested = {
    locales: { 'zh-CN': { home: '/', collections: [
      { type: 'post', dir: '/', title: 'All posts' },
      { type: 'post', dir: 'news', title: 'News', exclude: ['private/**'] },
    ] } },
  }
  assert.equal(collectionForEntry('news/public/post', 'zh-CN', nested)?.title, 'News')
  assert.equal(collectionForEntry('news/private/post', 'zh-CN', nested)?.title, 'All posts')

  const [notes, manual] = collectionsFor('en-US', config)
  assert.equal(notes.link, '/en/notes/')
  assert.equal(notes.archivesLink, '/en/notes/archives/')
  assert.equal(manual.linkPrefix, '/en/manual/')
  assert.equal(docCollectionForSidebar('en-US', 'manual', config)?.key, 'en-US:manual')
  assert.equal(docCollectionForSidebar('en-US', '/en/manual/', config)?.key, 'en-US:manual')
  assert.equal(docCollectionForSidebar('en-US', 'en-US:manual', config)?.key, 'en-US:manual')

  const [localized] = collectionsFor('en-US', {
    locales: { 'en-US': { home: '/en/', collections: [{ type: 'post', dir: 'notes', title: 'Notes', link: '/en/updates/', linkPrefix: '/en/articles/', tagsLink: '/en/topics/' }] } },
  })
  assert.equal(localized.link, '/en/updates/')
  assert.equal(localized.linkPrefix, '/en/articles/')
  assert.equal(localized.tagsLink, '/en/topics/')
  assert.equal(localized.archivesLink, '/en/articles/archives/')
  const [disabled] = collectionsFor('en-US', {
    locales: { 'en-US': { home: '/en/', collections: [{ type: 'post', dir: 'notes', title: 'Notes', tags: false, categories: false, archives: false }] } },
  })
  assert.deepEqual([disabled.tagsLink, disabled.categoriesLink, disabled.archivesLink], ['', '', ''])
  for (const helper of [defineThemeConfig, defineNavbarConfig, defineCollections, defineCollection]) {
    const value = {}
    assert.equal(helper(value), value)
  }
})

test('auto and manual doc sidebars retain hierarchy, ordering, badges, prefixes, and active routes', () => {
  const collection = collectionsFor('en-US', config)[1]
  const entries = [
    { id: 'en/manual/02.guide/02.install', data: { title: 'Install', order: 2, tags: [], description: '', permalink: '/en/manual/install/' } },
    { id: 'en/manual/02.guide/01.intro', data: { title: 'Intro', order: 1, group: 'Guide', icon: 'rocket', badge: { text: 'New', type: 'tip' }, tags: [], description: '', permalink: '/en/manual/intro/' } },
    { id: 'en/manual/02.guide/index', data: { title: 'Guide home', icon: 'home-icon', badge: 'Home', tags: [], description: '', permalink: '/en/manual/guide/' } },
    { id: 'en/manual/index', data: { title: 'Manual', tags: [], description: '', permalink: '/en/manual/' } },
  ]
  const [guide] = resolveSidebar(entries, 'en-US', collection)
  assert.equal(guide.text, 'Guide')
  assert.equal(guide.link, '/en/manual/guide/')
  assert.equal(guide.entryId, 'en/manual/02.guide/index')
  assert.equal(guide.collapsed, true)
  assert.deepEqual(guide.items.map(item => item.text), ['Intro', 'Install'])
  assert.deepEqual(guide.items[0].badge, { text: 'New', type: 'tip' })
  assert.equal(guide.items[0].icon, 'rocket')

  const configured = configuredSidebarFor(entries, 'en-US', '/en/manual/intro/', {
    ...config,
    sidebar: { '/manual/': [{ text: 'Start', link: '02.guide/01.intro', target: '_blank', rel: 'help' }] },
  })
  assert.equal(configured.collection.linkPrefix, '/en/manual/')
  assert.deepEqual(configured.items[0], { text: 'Start', link: '/en/manual/intro/', target: '_blank', rel: 'help', icon: 'rocket', badge: { text: 'New', type: 'tip' }, items: undefined, collapsed: undefined, entryId: 'en/manual/02.guide/01.intro' })

  const manual = { ...collection, sidebar: [{ text: 'Start', prefix: '02.guide', items: ['01.intro', { text: 'Install now', link: '02.install' }] }] }
  const [start] = resolveSidebar(entries, 'en-US', manual)
  assert.equal(start.items[0].link, '/en/manual/intro/')
  assert.equal(start.items[1].link, '/en/manual/install/')

  const [autoGroup] = resolveSidebar(entries, 'en-US', { ...collection, sidebar: [{ text: 'Guide', prefix: '02.guide', items: 'auto' }] })
  assert.equal(autoGroup.link, '/en/manual/guide/')
  assert.deepEqual(autoGroup.items.map(item => item.text), ['Intro', 'Install'])

  const [linkedGroup] = resolveSidebar(entries, 'en-US', {
    ...collection,
    sidebar: [{ text: 'Guide', link: '02.guide/01.intro', icon: 'configured', badge: 'Configured', prefix: '02.guide', items: ['02.install'] }],
  })
  assert.equal(linkedGroup.link, '/en/manual/intro/')
  assert.equal(linkedGroup.icon, 'rocket')
  assert.deepEqual(linkedGroup.badge, { text: 'New', type: 'tip' })
  assert.equal(linkedGroup.items[0].link, '/en/manual/install/')

  const [autoHomeGroup] = resolveSidebar(entries, 'en-US', {
    ...collection,
    sidebar: [{ text: 'Guide', icon: 'configured', badge: 'Configured', prefix: '02.guide', items: 'auto' }],
  })
  assert.equal(autoHomeGroup.icon, 'home-icon')
  assert.equal(autoHomeGroup.badge, 'Home')

  const [leaves] = sidebarGroups(resolveSidebar(entries, 'en-US', { ...collection, sidebar: ['02.guide/01.intro', { text: 'Astro', link: 'https://astro.build/' }] }))
  assert.deepEqual(leaves.items.map(item => item.link), ['/en/manual/intro/', 'https://astro.build/'])
})
