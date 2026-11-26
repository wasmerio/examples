import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeAssetRules, replaceAssetUrl, replaceAssetsIntegration, transformAssetUrls } from '../../theme/lib/replace-assets.mjs'

test('asset replacement matches the frozen Plume rules without changing source files', () => {
  const rules = normalizeAssetRules({
    image: 'https://image.example.com/',
    media: url => `https://media.example.com${url}`,
    rules: { find: '/downloads/', replacement: 'https://files.example.com' },
  })

  assert.equal(replaceAssetUrl(rules, '/images/logo.svg'), 'https://image.example.com/images/logo.svg')
  assert.equal(replaceAssetUrl(rules, '/medias/demo.mp4?raw=1'), 'https://media.example.com/medias/demo.mp4?raw=1')
  assert.equal(replaceAssetUrl(rules, '/downloads/file.zip'), 'https://files.example.com/downloads/file.zip')
  assert.equal(replaceAssetUrl(rules, '/img/logo.svg'), undefined)

  const source = `const image = '/images/logo.svg'; const untouched = '/img/logo.svg'; .hero { background: url('/images/hero.webp') }`
  const transformed = transformAssetUrls(source, rules)
  assert.match(transformed, /https:\/\/image\.example\.com\/images\/logo\.svg/)
  assert.match(transformed, /url\("https:\/\/image\.example\.com\/images\/hero\.webp"\)/)
  assert.match(transformed, /'\/img\/logo\.svg'/)

  let viteConfig
  replaceAssetsIntegration({ find: '/images/', replacement: 'https://cdn.example.com' }).hooks['astro:config:setup']({
    updateConfig: config => { viteConfig = config },
  })
  const plugin = viteConfig.vite.plugins[0]
  assert.equal(plugin.enforce, 'pre')
  assert.match(plugin.transform(`const image = '/images/logo.svg'`, '/src/example.js'), /https:\/\/cdn\.example\.com\/images\/logo\.svg/)
  assert.equal(plugin.transform(`{"image":"/images/logo.svg"}`, '/src/example.json'), undefined)
  assert.equal(plugin.transform(`return "![image](/images/logo.svg)"`, '/src/example.md'), undefined)
  assert.equal(plugin.transform(`export default "\\\"/images/logo.svg\\\""`, '\0astro:data-layer-content'), undefined)
})
