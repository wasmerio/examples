import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'
import { cv } from '../helpers/cv'
import { waitForScrollReady } from './scroll-helpers'

async function swipeGlobe(page: Page, dx: number, dy: number): Promise<void> {
  const canvas = page.locator('[data-globe-canvas]')
  await expect(canvas).toBeInViewport()
  const box = await canvas.boundingBox()
  expect(box).not.toBeNull()
  const x = box!.x + box!.width / 2
  const y = box!.y + box!.height / 2
  const session = await page.context().newCDPSession(page)
  try {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [
        { x, y, id: 1 },
      ],
    })
    for (let step = 1; step <= 8; step++) {
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [
          { x: x + dx * step / 8, y: y + dy * step / 8, id: 1 },
        ],
      })
      await page.waitForTimeout(20)
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  }
  finally {
    await session.detach()
  }
}

test.describe('configurable hero', () => {
  test('type remix changes the arrangement without changing the name or character widths', async ({ page }) => {
    test.skip(!cv.hero.typography.mixed || !cv.hero.typography.shuffle, 'Type remix is disabled in configuration')
    await page.goto('./')
    await waitForScrollReady(page)
    const heading = page.locator('[data-type-mix]')
    const glyphs = heading.locator('[data-type-glyph]')
    await expect(heading).toHaveAccessibleName(cv.basics.name)
    await expect.poll(() => heading.locator('[data-hero-letter]').evaluateAll(elements => elements.every((element) => {
      const style = getComputedStyle(element)
      const transform = style.transform === 'none'
        ? undefined
        : style.transform
      return Number(style.opacity) === 1 && new DOMMatrixReadOnly(transform).isIdentity
    }))).toBe(true)
    const before = await glyphs.evaluateAll(elements => elements.map(element => element.getAttribute('data-type-variant')))
    const text = await heading.textContent()
    const widths = await heading.locator('[data-hero-letter]').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().width))

    await page.locator('[data-type-remix]').click()
    await expect.poll(async () => JSON.stringify(await glyphs.evaluateAll(elements => elements.map(element => element.getAttribute('data-type-variant')))) !== JSON.stringify(before)).toBe(true)
    expect(await heading.textContent()).toBe(text)
    expect(await heading.locator('[data-hero-letter]').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().width))).toEqual(widths)
    await expect(heading).toHaveAccessibleName(cv.basics.name)
  })

  test('pixel globe paints, pauses and resumes real canvas animation', async ({ page }) => {
    test.skip(!cv.hero.globe.enabled || cv.hero.globe.speed === 0, 'Rotating globe is disabled in configuration')
    await page.goto('./')
    await waitForScrollReady(page)
    const globe = page.locator('[data-pixel-globe]')
    const canvas = page.locator('[data-globe-canvas]')
    const toggle = page.locator('[data-globe-toggle]')
    await expect(globe).toHaveAttribute('data-globe-ready', '')
    await expect(canvas).toHaveCSS('opacity', '1')
    await expect(globe).toContainText(cv.hero.globe.label)
    await expect(toggle).toHaveAttribute('aria-pressed', String(!cv.hero.globe.autoRotate))
    if (!cv.hero.globe.autoRotate)
      await toggle.click()
    const initial = await canvas.evaluate(element => (element as HTMLCanvasElement).toDataURL())
    await expect.poll(async () => await canvas.evaluate(element => (element as HTMLCanvasElement).toDataURL()) !== initial).toBe(true)

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    const paused = await canvas.evaluate(element => (element as HTMLCanvasElement).toDataURL())
    await page.waitForTimeout(250)
    expect(await canvas.evaluate(element => (element as HTMLCanvasElement).toDataURL()) === paused).toBe(true)

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await expect.poll(async () => await canvas.evaluate(element => (element as HTMLCanvasElement).toDataURL()) !== paused).toBe(true)
  })

  test('reduced motion keeps the globe static and the full name accessible', async ({ page }) => {
    test.skip(!cv.hero.globe.enabled, 'Globe is disabled in configuration')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('./')
    await waitForScrollReady(page)
    const canvas = page.locator('[data-globe-canvas]')
    await expect(page.locator('[data-globe-toggle]')).toBeHidden()
    const initial = await canvas.evaluate(element => (element as HTMLCanvasElement).toDataURL())
    await page.waitForTimeout(250)
    expect(await canvas.evaluate(element => (element as HTMLCanvasElement).toDataURL()) === initial).toBe(true)
    await expect(page.locator('#hero-title')).toHaveAccessibleName(cv.basics.name)
    if (cv.hero.typography.mixed && cv.hero.typography.shuffle) {
      await page.locator('[data-type-remix]').click()
      await expect(page.locator('[data-type-mix]')).toHaveAttribute('data-type-iteration', String(cv.hero.typography.seed + 1))
      expect(await page.locator('[data-type-glyph]').evaluateAll(elements => elements.flatMap(element => element.getAnimations()).length)).toBe(0)
    }
  })

  test('horizontal touch drag rotates a paused globe without scrolling the page', async ({ page, isMobile }) => {
    test.skip(!isMobile || !cv.hero.globe.enabled, 'Needs a touch viewport and an enabled globe')
    await page.goto('./')
    await waitForScrollReady(page)
    await expect(page.locator('.hero__foot')).toHaveCSS('opacity', '1')
    const toggle = page.locator('[data-globe-toggle]')
    if (cv.hero.globe.autoRotate)
      await toggle.tap()
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    const canvas = page.locator('[data-globe-canvas]')
    const before = await canvas.evaluate(element => (element as HTMLCanvasElement).toDataURL())
    const beforeY = await page.evaluate(() => window.scrollY)
    await swipeGlobe(page, 60, 0)
    await expect.poll(async () => await canvas.evaluate(element => (element as HTMLCanvasElement).toDataURL()) !== before).toBe(true)
    expect(Math.abs(await page.evaluate(() => window.scrollY) - beforeY)).toBeLessThanOrEqual(1)
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })

  test('vertical touch on the globe preserves native page scrolling', async ({ page, isMobile }) => {
    test.skip(!isMobile || !cv.hero.globe.enabled, 'Needs a touch viewport and an enabled globe')
    await page.goto('./')
    await waitForScrollReady(page)
    await expect(page.locator('.hero__foot')).toHaveCSS('opacity', '1')
    if (cv.hero.globe.autoRotate)
      await page.locator('[data-globe-toggle]').tap()
    const beforeY = await page.evaluate(() => window.scrollY)
    await swipeGlobe(page, 0, -140)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(beforeY + 30)
  })
})
