import process from 'node:process'
import { expect, test } from '@playwright/test'
import { cv } from '../helpers/cv'
import { SECTION_IDS, waitForScrollReady } from './scroll-helpers'

test.describe('single-file configuration', () => {
  test('SEO and structured data use the configured identity and effective deployment base', async ({ page, baseURL }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    const base = new URL(baseURL!).pathname
    const canonical = new URL(base, process.env.SITE_URL ?? cv.site.url).href
    const description = cv.site.seo.description || cv.basics.summary || `${cv.basics.name} - ${cv.basics.label}`
    const image = /^(?:https?:|data:)/i.test(cv.site.seo.image)
      ? cv.site.seo.image
      : new URL(`${base}${cv.site.seo.image.replace(/^\//, '')}`, process.env.SITE_URL ?? cv.site.url).href

    expect(new URL(page.url()).pathname).toBe(base)
    await expect(page.locator('html')).toHaveAttribute('lang', cv.site.lang)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical)
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description)
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description)
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', image)
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', image)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', cv.site.seo.noIndex ? /noindex/ : /^index,/)
    const structured = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)
    const person = structured['@graph'].find((entry: { '@type': string }) => entry['@type'] === 'Person')
    const website = structured['@graph'].find((entry: { '@type': string }) => entry['@type'] === 'WebSite')
    expect(person.name).toBe(cv.basics.name)
    expect(person.url).toBe(canonical)
    expect(website.url).toBe(canonical)
    expect(website.inLanguage).toBe(cv.site.lang)
  })

  test('sections, feature switches and hero copy are rendered from cv.json', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    expect(await page.locator('#main > [data-scroll-section]').evaluateAll(sections => sections.map(section => section.id))).toEqual(SECTION_IDS)
    await expect(page.locator('html')).toHaveAttribute('data-scroll-motion', String(cv.site.features.scrollMotion))
    await expect(page.locator('html')).toHaveAttribute('data-smooth-scroll-enabled', String(cv.site.features.smoothScroll))
    await expect(page.locator('html')).toHaveAttribute('data-project-exhibition-enabled', String(cv.site.features.projectExhibition))
    await expect(page.locator('.hero__role')).toHaveText(cv.hero.role || cv.basics.label)
    await expect(page.locator('.hero__description')).toHaveText(cv.hero.description)
    await expect(page.locator('.hero__coordinates')).toContainText(cv.hero.location)
    await expect(page.locator('.hero__explore')).toHaveText(cv.hero.cta.label)
    await expect(page.locator('.hero__explore')).toHaveAttribute('href', cv.hero.cta.href)
    await expect(page.locator('[data-project]')).toHaveCount(cv.projects.length)
    await expect(page.locator('[data-skill-item]')).toHaveCount(cv.skills.length)
    const copy = JSON.parse((await page.locator('#ui-copy').textContent())!)
    for (const [key, value] of Object.entries(cv.ui))
      expect(copy[key], key).toBe(value)
  })

  test('local images and metadata assets remain under the deployed base', async ({ page, baseURL, request }) => {
    const failures: string[] = []
    page.on('response', (response) => {
      if (response.status() >= 400 && [
        'image',
        'stylesheet',
        'font',
        'script',
      ].includes(response.request().resourceType())) {
        failures.push(`${response.status()} ${response.url()}`)
      }
    })
    await page.goto('./')
    await waitForScrollReady(page)
    const root = new URL(baseURL!)
    const images = await page.locator('img').evaluateAll(elements => elements
      .filter((image): image is HTMLImageElement => image instanceof HTMLImageElement)
      .map(image => ({
        source: image.currentSrc || image.src,
        dormantViewer: image.matches('#lightbox .lightbox__image') && !image.checkVisibility(),
      })))
    for (const { source, dormantViewer } of images) {
      if (!source && dormantViewer)
        continue
      expect(source, 'Every image except the closed lightbox must have a source').not.toBe('')
      const url = new URL(source)
      if (url.origin === root.origin)
        expect(url.pathname.startsWith(root.pathname), source).toBe(true)
    }
    for (const selector of ['link[rel="icon"]', 'link[rel="apple-touch-icon"]', 'link[rel="manifest"]']) {
      const url = new URL((await page.locator(selector).getAttribute('href'))!, page.url())
      if (url.origin !== root.origin)
        continue
      expect(url.pathname.startsWith(root.pathname), url.href).toBe(true)
      const response = await request.get(url.href)
      expect(response.ok(), `${response.status()} ${url.href}`).toBe(true)
    }
    const fonts = await page.evaluate(() => [...document.fonts].map(font => ({ family: font.family, status: font.status })))
    expect(fonts.filter(font => font.status === 'error')).toEqual([])
    for (const family of [
      'Anton',
      'Space Grotesk Variable',
      'JetBrains Mono Variable',
      'Instrument Serif',
    ])
      expect(fonts.some(font => font.family.replaceAll('"', '') === family && font.status === 'loaded'), `${family} must load, not silently fall back`).toBe(true)
    expect(failures).toEqual([])
  })
})
