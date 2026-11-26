import assert from 'node:assert/strict'
import test from 'node:test'
import { siteConfig } from '../../site.config.mjs'
import { navbarFor } from '../../theme/lib/navbar.ts'

test('navbar uses the Plume field, supports the legacy alias, and generates the default entries', () => {
  const original = siteConfig.locales['en-US']
  try {
    siteConfig.locales['en-US'] = { ...original, navbar: [{ text: 'Canonical', link: '/canonical/' }], navigation: [{ text: 'Legacy', link: '/legacy/' }] }
    assert.equal(navbarFor('en-US')[0].text, 'Canonical')

    siteConfig.locales['en-US'] = { ...original, navbar: undefined, navigation: [{ text: 'Legacy', link: '/legacy/' }] }
    assert.equal(navbarFor('en-US')[0].text, 'Legacy')

    siteConfig.locales['en-US'] = { ...original, navbar: undefined, navigation: undefined }
    assert.deepEqual(navbarFor('en-US').map(item => item.link), ['/en/', '/en/blog/', '/en/blog/tags/', '/en/blog/archives/'])
  } finally {
    siteConfig.locales['en-US'] = original
  }
})
