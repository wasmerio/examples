import { expect, test } from '@playwright/test'
import { cv, cvBasics } from '../helpers/cv'
import { SECTION_IDS, waitForScrollReady } from './scroll-helpers'

const CORE_SECTIONS = SECTION_IDS.filter(section => section !== 'top')

test.describe('page shell', () => {
  test('renders the CV identity and all sections in one real document', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('./')
    await waitForScrollReady(page)

    const name = cvBasics.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    await expect(page).toHaveTitle(cv.site.seo.title || new RegExp(name))
    await expect(page.locator('#main')).toBeVisible()
    await expect(page.locator('#hero-title')).toHaveAccessibleName(cvBasics.name)
    await expect(page.locator('html')).not.toHaveClass(/\bscreen-mode\b/)
    await expect(page.locator('.screen-scene, #screenDrawer')).toHaveCount(0)
    await expect(page.locator('astro-error-overlay, vite-error-overlay')).toHaveCount(0)
    expect(await page.locator('#main > [data-scroll-section]').evaluateAll(sections => sections.map(section => section.id))).toEqual([...SECTION_IDS])

    for (const id of CORE_SECTIONS)
      await expect(page.locator(`#main #${id}`)).toHaveCount(1)
    expect(errors).toEqual([])
  })

  test('keeps the same complete document for reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('./')
    await waitForScrollReady(page)

    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced')
    const heading = page.locator('#main h1')
    await expect(heading).toBeVisible()
    await expect(heading).toHaveAccessibleName(cvBasics.name)

    for (const id of CORE_SECTIONS)
      await expect(page.locator(`#${id}`)).toHaveCount(1)
  })

  test('without JavaScript the page stays readable with native anchors', async ({ browser, baseURL, viewport, isMobile }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      baseURL,
      viewport,
      isMobile,
      hasTouch: isMobile,
      colorScheme: 'light',
    })
    const page = await context.newPage()
    try {
      await page.goto('./')
      await expect(page.locator('#hero-title')).toBeVisible()
      await expect(page.locator('#hero-title')).toHaveAccessibleName(cvBasics.name)
      if (cv.hero.globe.enabled) {
        await expect(page.locator('.pixel-globe__fallback')).toBeVisible()
        await expect(page.locator('[data-globe-toggle]')).toBeHidden()
      }
      await expect(page.locator('#main > [data-scroll-section]')).toHaveCount(SECTION_IDS.length)
      await page.locator('.hero__explore').click()
      await expect(page).toHaveURL(/#projects$/)
      await expect(page.locator('#projects-title')).toBeInViewport()
      await expect(page.locator('[data-project-exhibition]')).not.toHaveAttribute('data-project-scroll', 'true')
      await expect(page.locator('#project-1')).toBeVisible()
    }
    finally {
      await context.close()
    }
  })
})
