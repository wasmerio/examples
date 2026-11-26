import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import { renderMarkdown } from '../../theme/lib/markdown.ts'
import { siteConfig } from '../../site.config.mjs'

test('copy-code keeps every frozen locale preset and route override', async () => {
  const presets = {
    'zh-Hant': ['複製代碼', '已複製'], 'de-AT': ['Kopiere den Code.', 'Kopiert'], 'vi-VN': ['Sao chép code', 'Đã sao chép'],
    uk: ['Скопіюйте код', 'Скопійовано'], 'ru-RU': ['Скопировать код', 'Скопировано'], br: ['Copiar o código', 'Copiado'],
    'pl-PL': ['Skopiuj kod', 'Skopiowane'], 'sk-SK': ['Skopíruj kód', 'Skopírované'], 'fr-FR': ['Copier le code', 'Copié'],
    'es-ES': ['Copiar código', 'Copiado'], 'ja-JP': ['コードをコピー', 'コピーしました'], 'tr-TR': ['Kodu kopyala', 'Kopyalandı'],
    'ko-KO': ['코드 복사', '복사됨'], 'fi-FI': ['Kopioi koodi', 'Kopioitu'], 'hu-HU': ['Kód másolása', 'Másolva'],
    'id-ID': ['Salin kode', 'Disalin'], 'nl-NL': ['Kopieer code', 'Gekopieerd'],
  }
  try {
    for (const [language, [copy, copied]] of Object.entries(presets)) {
      const slug = language.toLowerCase()
      siteConfig.locales[language] = { home: `/${slug}/` }
      const html = await renderMarkdown('```js\nconst value = 1\n```', { sourcePath: path.resolve(`content/${slug}/copy.md`) })
      assert.match(html, new RegExp(`aria-label="${copy}" data-copied="${copied}"`))
    }
  } finally {
    for (const language of Object.keys(presets)) delete siteConfig.locales[language]
  }

  const previous = siteConfig.copyCode
  try {
    siteConfig.copyCode = { duration: 7, showInMobile: true, locales: { '/': { copy: 'Root copy' }, '/en/': { copy: 'Route copy', copied: 'Route copied' } } }
    const url = new URL('../../theme/lib/markdown.ts', import.meta.url)
    url.searchParams.set('copy-code-options', 'route')
    const configured = (await import(url.href)).renderMarkdown
    const html = await configured('```js\n1\n```', { sourcePath: 'content/en/copy.md' })
    assert.match(html, /data-copy-duration="7" data-copy-mobile="true" aria-label="Route copy" data-copied="Route copied"/)
  } finally {
    siteConfig.copyCode = previous
  }
})
