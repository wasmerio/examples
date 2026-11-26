import { expect, test } from '@playwright/test'
import { goToSection, SECTION_IDS, waitForScrollReady } from './scroll-helpers'

test.describe('responsive layout', () => {
  test('hero stays readable across six viewport sizes', async ({ page, isMobile }) => {
    test.skip(isMobile, 'The dedicated mobile project covers touch; this test sweeps window sizes')
    const sizes = [
      { width: 320, height: 844 },
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1280, height: 720 },
      { width: 1440, height: 900 },
    ]
    for (const viewport of sizes) {
      await test.step(`${viewport.width}x${viewport.height}`, async () => {
        await page.setViewportSize(viewport)
        await page.goto('./')
        await waitForScrollReady(page)
        await expect(page.locator('.hero__foot')).toHaveCSS('opacity', '1')
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
        const lines = await page.locator('.hero__line').evaluateAll(elements => elements.map(element => ({
          left: element.getBoundingClientRect().left,
          right: element.getBoundingClientRect().right,
        })))
        for (const line of lines) {
          expect(line.left).toBeGreaterThanOrEqual(-1)
          expect(line.right).toBeLessThanOrEqual(viewport.width + 1)
        }
        const pin = page.locator('.hero__pin')
        const bottom = await page.locator('.hero__foot').evaluate(element => element.getBoundingClientRect().bottom)
        const pinBottom = await pin.evaluate(element => element.getBoundingClientRect().bottom)
        expect(bottom).toBeLessThanOrEqual(pinBottom + 1)
        if (await pin.evaluate(element => getComputedStyle(element).position === 'sticky'))
          expect(bottom).toBeLessThanOrEqual(viewport.height + 1)
      })
    }
  })

  test('mobile keeps its hero readable and every section inside the viewport', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only viewport assertion')

    await page.goto('./')
    await waitForScrollReady(page)

    await expect(page.locator('.topbar__nav')).toBeHidden()
    await expect(page.locator('#hero-title')).toBeInViewport()
    await expect(page.locator('.hero__explore')).toBeInViewport()
    await expect(page.locator('[data-index-open]')).toBeVisible()
    await expect(page.locator('[data-project-exhibition]')).not.toHaveAttribute('data-project-scroll', 'true')

    for (const section of SECTION_IDS) {
      await goToSection(page, section)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow, `Horizontal overflow at #${section}`).toBeLessThanOrEqual(1)
    }
  })

  test('short desktop viewports keep projects stacked and controls reachable', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Uses a short desktop viewport')
    await page.setViewportSize({ width: 1280, height: 640 })
    await page.goto('./')
    await waitForScrollReady(page)
    await expect(page.locator('[data-project-exhibition]')).not.toHaveAttribute('data-project-scroll', 'true')
    await goToSection(page, 'projects')
    const first = await page.locator('#project-1').boundingBox()
    const second = await page.locator('#project-2').boundingBox()
    expect(second!.y).toBeGreaterThanOrEqual(first!.y + first!.height)
    const trigger = page.locator('#project-1 [data-case-open]')
    await trigger.click()
    await expect(page.locator('#projectCase')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1)
  })
})
