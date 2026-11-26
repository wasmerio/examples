import { expect, test } from '@playwright/test'
import { cv } from '../helpers/cv'

test.describe('site loader', () => {
  test('overlapping color plates resolve into the page and release interaction', async ({ page }) => {
    test.skip(!cv.site.loader.enabled, 'Loader is disabled in configuration')
    await page.addInitScript(() => {
      const states: string[] = []
      Object.defineProperty(window, 'loaderPhases', { value: states })
      const observer = new MutationObserver(() => {
        const state = document.documentElement.dataset.loaderState
        if (state && states.at(-1) !== state)
          states.push(state)
      })
      observer.observe(document, {
        subtree: true,
        attributes: true,
        attributeFilter: ['data-loader-state'],
      })
    })
    await page.goto('./', { waitUntil: 'domcontentloaded' })
    const loader = page.locator('[data-site-loader]')
    await expect(loader.locator('[data-loader-plate]')).toHaveCount(cv.site.loader.colors.length)
    await expect(page.locator('html')).toHaveAttribute('data-loader-ready', 'true', { timeout: 12_000 })
    await expect(page.locator('html')).toHaveAttribute('data-loader-result', 'ready')
    await expect(loader).toBeHidden()
    await expect(page.locator('[data-loader-inert]')).toHaveCount(0)
    await expect(page.locator('#main')).not.toHaveAttribute('inert', '')
    const states = await page.evaluate(() => Reflect.get(window, 'loaderPhases') as string[])
    expect(states).toEqual(expect.arrayContaining([
      'assembling',
      'merging',
      'revealing',
      'complete',
    ]))
    await expect(page.locator('html')).toHaveAttribute('data-scroll-ready', 'true')
  })

  test('Enter site skips the animation without leaving an interaction lock or losing keyboard focus', async ({ page }) => {
    test.skip(!cv.site.loader.enabled, 'Loader is disabled in configuration')
    await page.goto('./', { waitUntil: 'domcontentloaded' })
    await page.keyboard.press('Tab')
    await expect(page.locator('.skip-link')).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-loader-skip]')).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('html')).toHaveAttribute('data-loader-result', 'skipped')
    await expect(page.locator('html')).toHaveAttribute('data-loader-ready', 'true')
    await expect(page.locator('html')).not.toHaveClass(/\bloader-active\b/)
    await expect(page.locator('[data-loader-inert]')).toHaveCount(0)
    await expect(page.locator('#main')).toBeVisible()
    await expect(page.locator('#main')).toBeFocused()
  })

  test('changing to reduced motion immediately releases the page', async ({ page }) => {
    test.skip(!cv.site.loader.enabled, 'Loader is disabled in configuration')
    await page.goto('./', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('html')).toHaveAttribute('data-loader-state', 'assembling')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(page.locator('html')).toHaveAttribute('data-loader-ready', 'true')
    await expect(page.locator('html')).toHaveAttribute('data-loader-result', 'reduced-motion')
    await expect(page.locator('[data-site-loader]')).toBeHidden()
    await expect(page.locator('[data-loader-inert]')).toHaveCount(0)
  })

  test('reduced motion bypasses the loader at startup', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('./')
    await expect(page.locator('html')).toHaveAttribute('data-loader-ready', 'true')
    await expect(page.locator('html')).not.toHaveClass(/\bloader-active\b/)
    await expect(page.locator('[data-site-loader]')).toBeHidden()
    await expect(page.locator('#main')).not.toHaveAttribute('inert', '')
  })

  for (const [event, result] of [
    ['beforeprint', 'print'],
    ['pagehide', 'departed'],
  ] as const) {
    test(`${event} releases the overlay and its interaction lock`, async ({ page }) => {
      test.skip(!cv.site.loader.enabled, 'Loader is disabled in configuration')
      await page.goto('./', { waitUntil: 'domcontentloaded' })
      await expect(page.locator('html')).toHaveAttribute('data-loader-state', 'assembling')
      await page.evaluate(eventName => window.dispatchEvent(new Event(eventName)), event)
      await expect(page.locator('html')).toHaveAttribute('data-loader-result', result)
      await expect(page.locator('[data-site-loader]')).toBeHidden()
      await expect(page.locator('[data-loader-inert]')).toHaveCount(0)
      await expect(page.locator('#main')).not.toHaveAttribute('inert', '')
      await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })))
      await expect(page.locator('html')).toHaveAttribute('data-loader-result', result)
      await expect(page.locator('#main')).toBeVisible()
    })
  }

  test('stalled fonts time out without blocking the document or its project fragment', async ({ page, isMobile }) => {
    test.skip(isMobile || !cv.site.loader.enabled || cv.projects.length < 2, 'One desktop check covers shared font readiness and a project fragment')
    let releaseFonts!: () => void
    const fonts = new Promise<void>((resolve) => {
      releaseFonts = resolve
    })
    await page.route('**/*', async (route) => {
      if (route.request().resourceType() === 'font')
        await fonts
      await route.continue()
    })
    try {
      await page.goto('./#project-2', { waitUntil: 'domcontentloaded' })
      await expect(page.locator('html')).toHaveAttribute('data-loader-ready', 'true', { timeout: cv.site.loader.maxWait + 3500 })
      await expect(page.locator('html')).toHaveAttribute('data-loader-result', /^(?:timeout|failed-open)$/)
      await expect(page.locator('[data-site-loader]')).toBeHidden()
      await expect(page.locator('[data-loader-inert]')).toHaveCount(0)
      await expect(page.locator('#main')).toBeVisible()
      await expect(page.locator('html')).toHaveAttribute('data-scroll-ready', 'true')
      await expect(page.locator('#project-title-2')).toBeInViewport()
      await expect(page).toHaveURL(/#project-2$/)
    }
    finally {
      releaseFonts()
    }
  })

  test('project fragments survive the loader and resolve to the correct content', async ({ page }) => {
    test.skip(cv.projects.length < 2, 'Deep-link coverage requires a second project')
    await page.goto('./#project-2')
    await expect(page.locator('html')).toHaveAttribute('data-loader-ready', 'true', { timeout: 12_000 })
    await expect(page.locator('html')).toHaveAttribute('data-scroll-ready', 'true')
    await expect(page).toHaveURL(/#project-2$/)
    await expect(page.locator('#project-title-2')).toBeInViewport()
    await expect(page.locator('html')).toHaveAttribute('data-active-section', 'projects')
  })

  test('the document stays readable without JavaScript', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    await page.goto(baseURL!)
    await expect(page.locator('[data-site-loader]')).toBeHidden()
    await expect(page.locator('#main')).toBeVisible()
    await expect(page.locator('#main')).not.toHaveAttribute('inert', '')
    await context.close()
  })

  test('the independent watchdog releases the document if scripts fail to load', async ({ page, isMobile }) => {
    test.skip(isMobile || !cv.site.loader.enabled, 'One desktop failure-path check covers the shared boot code')
    await page.route('**/*', route => route.request().resourceType() === 'script'
      ? route.abort()
      : route.continue())
    await page.goto('./')
    await expect(page.locator('html')).toHaveAttribute('data-loader-ready', 'true', { timeout: cv.site.loader.maxWait + 3500 })
    await expect(page.locator('html')).toHaveAttribute('data-loader-result', 'failed-open')
    await expect(page.locator('[data-site-loader]')).toBeHidden()
    await expect(page.locator('#main')).not.toHaveAttribute('inert', '')
  })
})
