import { describe, expect, it } from 'vitest'
import { assetSchema, heroSchema, httpUrlSchema, sectionsSchema, siteSchema } from './config-schema'
import { cvSchema } from './schema'

const basics = { name: 'Example', label: 'Designer' }
const section = { id: 'about', label: 'About', title: 'A longer title' }

describe('configuration validation', () => {
  it('provides complete defaults without requiring decorative metadata', () => {
    const result = cvSchema.parse({
      basics: {
        ...basics,
        about: {
          traits: [
            { text: 'Curious' },
          ],
        },
      },
    })
    expect(result.basics.about?.traits[0]?.text).toBe('Curious')
    expect(result.site.timeZone).toBe('UTC')
    expect(result.site.appleTouchIcon).toBe('/apple-touch-icon.png')
    expect(result.sections.some(item => item.enabled)).toBe(true)
  })

  it('accepts one enabled section with every feature disabled and empty content', () => {
    const defaults = siteSchema.parse({})
    const features = Object.fromEntries(Object.keys(defaults.features).map(key => [key, false]))
    const result = cvSchema.parse({
      basics,
      sections: [section],
      site: { features },
    })
    expect(result.sections).toHaveLength(1)
    expect(Object.values(result.site.features).every(value => !value)).toBe(true)
    expect(result.projects).toEqual([])
  })

  it.each([
    { sections: [] },
    {
      sections: [
        { ...section, enabled: false },
      ],
    },
    {
      sections: [section, section],
    },
    {
      sections: [
        { ...section, id: 'unknown' },
      ],
    },
    {
      sections: [
        { ...section, enable: false },
      ],
    },
  ])('rejects empty, duplicate, unknown or misspelled section configuration %#', ({ sections }) => {
    expect(sectionsSchema.safeParse(sections).success).toBe(false)
  })

  it('rejects unknown configuration keys at every settings boundary', () => {
    expect(siteSchema.safeParse({ timeZome: 'UTC' }).success).toBe(false)
    expect(siteSchema.safeParse({
      features: { smoothScrolling: true },
    }).success).toBe(false)
    expect(heroSchema.safeParse({
      typography: { shufle: true },
    }).success).toBe(false)
    expect(siteSchema.safeParse({ appleTouchIcon: '/images/touch.png' }).success).toBe(true)
    expect(siteSchema.safeParse({ appleTouchIcon: 'javascript:alert(1)' }).success).toBe(false)
    expect(cvSchema.safeParse({ basics, analyticsCode: '' }).success).toBe(false)
    expect(cvSchema.safeParse({
      basics: { ...basics, summmary: 'Typo' },
    }).success).toBe(false)
  })

  it.each([
    'UTC',
    'Europe/London',
    'Asia/Shanghai',
    'America/New_York',
  ])('accepts valid time zone %s', (timeZone) => {
    expect(siteSchema.safeParse({ timeZone }).success).toBe(true)
  })

  it.each(['', 'Not/A_Zone', 'UTC+broken'])('rejects invalid time zone %s', (timeZone) => {
    expect(siteSchema.safeParse({ timeZone }).success).toBe(false)
  })

  it.each(['en', 'en-GB', 'zh-Hans-CN'])('accepts valid language %s', (lang) => {
    expect(siteSchema.safeParse({ lang }).success).toBe(true)
  })

  it('validates both HTML language and Open Graph locale forms', () => {
    expect(siteSchema.safeParse({ lang: 'en_US' }).success).toBe(false)
    expect(siteSchema.safeParse({ locale: 'en_GB' }).success).toBe(true)
    expect(siteSchema.safeParse({ locale: 'not a locale' }).success).toBe(false)
  })

  it.each([
    '/../',
    '/portfolio/./',
    '//remote/',
    'portfolio',
    '/bad path/',
  ])('rejects invalid deployment base %s', (base) => {
    expect(siteSchema.safeParse({ base }).success).toBe(false)
  })

  it.each([
    'not a URL',
    'https://example.com/path/',
    'https://example.com/?q=1',
    'https://example.com/#a',
  ])('rejects non-origin site URL %s without throwing', (url) => {
    expect(siteSchema.safeParse({ url }).success).toBe(false)
  })
})

describe('uRL and asset safety', () => {
  it.each([
    'javascript:alert(1)',
    'data:text/html,test',
    'file:///tmp/image.png',
    'ftp://example.com/file',
    'https://user:pass@example.com',
  ])('rejects unsafe external link %s', (url) => {
    expect(httpUrlSchema.safeParse(url).success).toBe(false)
    expect(cvSchema.safeParse({
      basics: { ...basics, url },
    }).success).toBe(false)
    expect(cvSchema.safeParse({
      basics: {
        ...basics,
        profiles: [
          {
            network: 'Example',
            icon: 'mdi:web',
            username: 'example',
            url,
          },
        ],
      },
    }).success).toBe(false)
  })

  it('preserves blank optional links as absent and valid HTTP(S) links', () => {
    expect(cvSchema.parse({
      basics: { ...basics, url: '   ' },
    }).basics.url).toBeUndefined()
    expect(httpUrlSchema.safeParse('https://example.com/a?b=1#c').success).toBe(true)
    expect(httpUrlSchema.safeParse('http://localhost:4321/').success).toBe(true)
  })

  it.each(['/images/a.svg', 'images/a b.png', 'https://cdn.example.com/photo.jpg'])('accepts safe image %s', (path) => {
    expect(assetSchema.safeParse(path).success).toBe(true)
  })

  it.each([
    '//evil.example/a.png',
    '../a.png',
    '/%2e%2e/a.png',
    'javascript:alert(1)',
    'data:image/svg+xml,test',
    'images\\photo.png',
  ])('rejects unsafe image %s', (path) => {
    expect(assetSchema.safeParse(path).success).toBe(false)
  })

  it.each([
    '#projects',
    '/resume.pdf',
    'downloads/resume.pdf',
    'https://example.com/work',
    'mailto:hello@example.com',
    'tel:+12025550123',
  ])('accepts safe hero action %s', (href) => {
    expect(heroSchema.safeParse({
      cta: { href },
    }).success).toBe(true)
  })

  it.each([
    'javascript:alert(1)',
    'data:text/html,test',
    '//evil.example',
    'mailto:',
  ])('rejects unsafe hero action %s', (href) => {
    expect(heroSchema.safeParse({
      cta: { href },
    }).success).toBe(false)
  })
})
