import assert from 'node:assert/strict'
import test from 'node:test'
import { defineSiteConfig } from '../../theme/config.mjs'
import { isPageSearchable } from '../../theme/lib/search-options.ts'

const page = { path: '/private/', pathLocale: '/private/', lang: 'en-US', title: 'Private', frontmatter: {}, data: {} }

test('Plume local-search switches control Pagefind eligibility', () => {
  assert.equal(isPageSearchable(false, page), false)
  assert.equal(isPageSearchable({ isSearchable: current => current.path !== '/private/' }, page), false)
  assert.equal(isPageSearchable({}, page, false), false)
  const config = defineSiteConfig({ origin: 'https://example.com', logo: '/logo.svg', locales: { en: { siteName: 'Site', home: '/' } }, plugins: { search: false } })
  assert.equal(config.search, false)
})
