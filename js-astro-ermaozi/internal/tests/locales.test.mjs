import assert from 'node:assert/strict'
import test from 'node:test'
import { configuredLanguages, licenseName, localeOf, localePath, readingTimeOf, searchLocaleOf } from '../../theme/lib/locales.ts'
import { siteConfig } from '../../site.config.mjs'

test('all frozen Plume locale presets remain available behind configured locale routes', () => {
  const names = {
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'en-US': 'English',
    'de-DE': 'Deutsch',
    'fr-FR': 'Français',
    'ru-RU': 'Русский',
    'ja-JP': '日本語',
    'ko-KR': '한국어',
  }
  for (const [lang, name] of Object.entries(names)) assert.equal(localeOf(lang).selectLanguageName, name)
  assert.deepEqual(configuredLanguages(), ['zh-CN', 'en-US'])
  assert.equal(localePath('zh-CN'), '/')
  assert.equal(localePath('en-US'), '/en/')
  assert.equal(licenseName('ja-JP', 'CC-BY-NC-SA-4.0'), '表示-非営利-継承 4.0 国際')
  assert.equal(licenseName('de-DE', 'custom'), 'custom')
})

test('search and reading-time locale presets match frozen Plume strings', () => {
  const searchPlaceholders = { 'en-US': 'Search', 'zh-CN': '搜索文档', 'zh-TW': '搜尋文件', 'de-DE': 'Dokumente durchsuchen', 'fr-FR': 'Rechercher dans la documentation', 'ru-RU': 'Поиск по документации', 'ja-JP': 'ドキュメントを検索', 'ko-KR': 'Search' }
  for (const [lang, placeholder] of Object.entries(searchPlaceholders)) assert.equal(searchLocaleOf(lang).placeholder, placeholder)
  assert.equal(searchLocaleOf('de-DE').footer.navigateText, 'Wechseln')
  const custom = searchLocaleOf('en-US', { '/en/': { placeholder: 'Find docs', footer: { closeText: 'Dismiss' } } })
  assert.equal(custom.placeholder, 'Find docs')
  assert.equal(custom.footer.closeText, 'Dismiss')
  assert.equal(custom.footer.navigateText, 'to navigate')

  assert.deepEqual(readingTimeOf('en-US', 120), { words: 'About 120 words', time: 'Less than 1 minute' })
  assert.deepEqual(readingTimeOf('zh-CN', 600), { words: '约 600 字', time: '大约 2 分钟' })
  assert.deepEqual(readingTimeOf('zh-TW', 600), { words: '約 600 字', time: '大約 2 分鐘' })
  assert.deepEqual(readingTimeOf('de-DE', 600), { words: 'Ungefähr 600 Wörter', time: 'Ungefähr 2 min' })
  assert.deepEqual(readingTimeOf('fr-FR', 600), { words: 'Environ 600 mots', time: 'Environ 2 min' })
  assert.deepEqual(readingTimeOf('ru-RU', 600), { words: 'Около 600 слов', time: 'Около 2 мин' })
  assert.deepEqual(readingTimeOf('ja-JP', 600), { words: '600字程度', time: '約2分' })
  assert.deepEqual(readingTimeOf('ko-KR', 120), { words: '약 120 단어', time: '1분 미만' })

  const original = siteConfig.readingTime
  try {
    siteConfig.readingTime = { wordPerMinute: 120, locales: { '/en/': { word: '$word tokens', less1Minute: 'quick', time: '$time minutes' } } }
    assert.deepEqual(readingTimeOf('en-US', 180), { words: '180 tokens', time: '2 minutes' })
    siteConfig.readingTime = false
    assert.equal(readingTimeOf('en-US', 180), null)
  } finally {
    siteConfig.readingTime = original
  }
})

test('locale options follow Plume global then current-locale precedence without leaking the root locale', () => {
  const originalLogoDark = siteConfig.logoDark
  const originalProfile = siteConfig.profile
  const originalExternalLinkIcon = siteConfig.externalLinkIcon
  const originalChinese = siteConfig.locales['zh-CN']
  const originalEnglish = siteConfig.locales['en-US']
  try {
    siteConfig.logoDark = '/global-dark.svg'
    siteConfig.profile = { name: 'Global profile' }
    siteConfig.externalLinkIcon = true
    siteConfig.locales['zh-CN'] = { ...originalChinese, logoDark: '/zh-dark.svg', externalLinkIcon: false }
    siteConfig.locales['en-US'] = { ...originalEnglish, profile: { name: 'English profile' } }

    assert.equal(localeOf('zh-CN').logoDark, '/zh-dark.svg')
    assert.equal(localeOf('zh-CN').externalLinkIcon, false)
    assert.equal(localeOf('en-US').logoDark, '/global-dark.svg')
    assert.equal(localeOf('en-US').externalLinkIcon, true)
    assert.equal(localeOf('en-US').profile.name, 'English profile')
  } finally {
    siteConfig.logoDark = originalLogoDark
    siteConfig.profile = originalProfile
    siteConfig.externalLinkIcon = originalExternalLinkIcon
    siteConfig.locales['zh-CN'] = originalChinese
    siteConfig.locales['en-US'] = originalEnglish
  }
})
