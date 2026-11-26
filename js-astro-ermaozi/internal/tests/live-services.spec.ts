import { expect, test } from '@playwright/test'
import { readdirSync } from 'node:fs'

test.setTimeout(180_000)

test('real code embeds load their public examples in a browser', async ({ page, context }) => {
  test.skip(process.env.LIVE_EMBED_SERVICES !== '1', 'set LIVE_EMBED_SERVICES=1 for the third-party availability diagnostic')
  await page.route(/https:\/\/(?:codepen\.io|jsfiddle\.net|codesandbox\.io|replit\.com)\//, route => route.abort())
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })

  for (const [selector, host] of [
    ['[data-code-embed="codepen"]', 'codepen.io'],
    ['[data-code-embed="jsfiddle"]', 'jsfiddle.net'],
    ['.code-sandbox-iframe', 'codesandbox.io'],
    ['[data-code-embed="replit"]', 'replit.com'],
  ] as const) {
    const iframe = page.locator(selector)
    await expect(iframe).toHaveAttribute('src', new RegExp(host.replace('.', '\\.')))
    const src = await iframe.getAttribute('src')
    const live = await context.newPage()
    let response
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        response = await live.goto(src!, { waitUntil: 'domcontentloaded', timeout: 60_000 })
        break
      } catch (error) {
        if (attempt) throw error
      }
    }
    const status = response?.status() ?? 0
    if ([401, 403, 429].includes(status)) test.info().annotations.push({ type: 'external-service', description: `${host} blocked automated access with HTTP ${status}` })
    else expect(status, `${host} response`).toBeLessThan(400)
    if (host === 'jsfiddle.net' && !live.url().includes('/embedded/')) test.info().annotations.push({ type: 'external-service', description: 'JSFiddle redirected its documented embed URL to the editor' })
    await expect(live.locator('body')).toBeAttached()
    await live.close()
  }
})

test('every real REPL backend completes through the browser UI', async ({ page }) => {
  test.skip(process.env.LIVE_PLUME_SERVICES !== '1', 'set LIVE_PLUME_SERVICES=1 for the release-gate network check')
  await page.route(/https:\/\/(?:codepen\.io|jsfiddle\.net|codesandbox\.io|replit\.com)\//, route => route.abort())
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  const repls = page.locator('[data-code-repl]')
  for (const [language, output] of [
    ['go', 'Hello Go'],
    ['kotlin', 'Hello Kotlin'],
    ['rust', 'Hello Rust'],
    ['python', 'Hello Python'],
  ]) {
    const repl = repls.filter({ has: page.locator(`[class*="language-${language}"]`) })
    await repl.locator('.icon-run').click()
    await expect(repl.locator('.output-content')).toContainText(output, { timeout: language === 'python' ? 120_000 : 45_000 })
    await expect(repl.locator('.output-content .error')).toHaveCount(0)
  }
})

test('the public VitePress Algolia index returns normalized DocSearch results through the browser UI', async ({ page }) => {
  test.skip(process.env.LIVE_PLUME_SERVICES !== '1', 'set LIVE_PLUME_SERVICES=1 for the release-gate network check')
  const assets = readdirSync('dist/_astro')
  const algoliaModule = assets.find(file => /^AlgoliaSearch\..+\.js$/.test(file))!
  const runtimeModule = assets.find(file => /^runtime-dom\.esm-bundler\..+\.js$/.test(file))!
  await page.route('https://8j64vvrp8k-dsn.algolia.net/**', route => route.abort())
  await page.goto('/about/', { waitUntil: 'domcontentloaded' })
  await page.evaluate(async ({ algoliaModule, runtimeModule }) => {
    const [{ default: AlgoliaSearch }, runtime] = await Promise.all([
      import(`/_astro/${algoliaModule}`),
      import(`/_astro/${runtimeModule}`),
    ])
    const createApp = Object.values(runtime).find(value => typeof value === 'function' && value.toString().includes('.createApp(')) as (component: unknown, props: Record<string, unknown>) => { mount: (element: Element) => void }
    const host = document.body.appendChild(document.createElement('div'))
    createApp(AlgoliaSearch, {
      lang: 'en-US',
      localePath: '/en/',
      options: {
        appId: '8J64VVRP8K',
        apiKey: '52f578a92b88ad6abde815aae2b0ad7c',
        indexName: 'vitepress',
        indexBase: 'https://vitepress.dev/',
      },
    }).mount(host)
  }, { algoliaModule, runtimeModule })

  await page.locator('.docsearch-placeholder .DocSearch-Button').click()
  await page.locator('.DocSearch-Input').fill('Markdown')
  const hit = page.locator('.DocSearch-Hit a').first()
  await expect(hit).toBeVisible({ timeout: 45_000 })
  await expect(hit).toHaveAttribute('href', /^\/guide\//)
  await expect(page.locator('.DocSearch-Hit')).not.toHaveCount(0)
})
