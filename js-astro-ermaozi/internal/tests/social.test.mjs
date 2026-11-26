import assert from 'node:assert/strict'
import test from 'node:test'
import { navbarSocialLinksFor, socialIconName, socialLabel, socialLinksFor, socialSvg, twitterHandleOf } from '../../theme/lib/social.ts'
import { siteConfig } from '../../site.config.mjs'

test('social icons preserve aliases, arbitrary Iconify collections, custom SVG, and labels', () => {
  assert.equal(socialIconName('twitter'), 'simple-icons:x')
  assert.equal(socialIconName('mdi:email'), 'mdi:email')
  assert.match(socialSvg('github'), /<svg[^>]+viewBox="0 0 24 24"/)
  assert.equal(socialSvg('mdi:email'), '')
  assert.equal(socialSvg({ svg: '<svg></svg>', name: 'custom' }), '<svg></svg>')
  assert.equal(socialLabel({ icon: 'mdi:email', link: '#' }), 'email')
  assert.equal(socialLabel({ icon: 'github', link: '#', ariaLabel: 'Source' }), 'Source')
})

test('Twitter metadata handle comes from the social profile URL', () => {
  assert.equal(twitterHandleOf([{ icon: 'twitter', link: 'https://twitter.com/example' }]), '@example')
  assert.equal(twitterHandleOf([{ icon: 'x', link: 'https://x.com/example/' }]), '@example')
  assert.equal(twitterHandleOf([{ icon: 'github', link: 'https://github.com/example' }]), '')
})

test('social links and navbar inclusion can be overridden per locale', () => {
  const original = siteConfig.locales['en-US']
  try {
    siteConfig.locales['en-US'] = {
      ...original,
      social: [{ icon: 'github', link: 'https://github.com/english' }, { icon: 'twitter', link: 'https://x.com/english' }],
      navbarSocialInclude: ['twitter'],
    }
    assert.equal(socialLinksFor('en-US').length, 2)
    assert.deepEqual(navbarSocialLinksFor('en-US').map(item => item.icon), ['twitter'])
    siteConfig.locales['en-US'] = { ...original, social: false }
    assert.deepEqual(socialLinksFor('en-US'), [])
  } finally {
    siteConfig.locales['en-US'] = original
  }
})
