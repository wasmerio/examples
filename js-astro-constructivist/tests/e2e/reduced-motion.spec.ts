import { expect, test } from '@playwright/test'
import { goToSection, waitForScrollReady } from './scroll-helpers'

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('scroll and reveal content is visible without scrolling', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)

    expect(await page.evaluate(() => window.scrollY)).toBe(0)

    const items = await page.evaluate(() => {
      const elements = [
        ...document.querySelectorAll<HTMLElement>('[data-scroll], [data-reveal]'),
      ]

      return elements.map((element) => {
        const style = getComputedStyle(element)
        return {
          className: typeof element.className === 'string'
            ? element.className
            : '',
          display: style.display,
          visibility: style.visibility,
          opacity: Number(style.opacity),
        }
      })
    })

    expect(items.length).toBeGreaterThan(0)

    const hidden = items.filter(item =>
      item.opacity === 0 || item.display === 'none' || item.visibility === 'hidden',
    )
    expect(hidden, JSON.stringify(hidden, null, 2)).toEqual([])
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced')
    await expect(page.locator('html')).not.toHaveAttribute('data-smooth-scroll', 'true')
    await expect(page.locator('[data-project-exhibition]')).not.toHaveAttribute('data-project-scroll', 'true')
    const first = await page.locator('#project-1').boundingBox()
    const second = await page.locator('#project-2').boundingBox()
    expect(second!.y).toBeGreaterThanOrEqual(first!.y + first!.height)
  })

  test('changing the system preference tears down and restores scroll effects', async ({ page, isMobile }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('./')
    await waitForScrollReady(page)
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'full')
    if (!isMobile) {
      await expect(page.locator('[data-project-exhibition]')).toHaveAttribute('data-project-scroll', 'true')
      await page.mouse.move(360, 240)
      await expect(page.locator('.cursor')).toHaveClass(/\bis-visible\b/)
      await expect(page.locator('html')).toHaveClass(/\bcursor-enabled\b/)
    }

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced')
    await expect(page.locator('html')).not.toHaveAttribute('data-smooth-scroll', 'true')
    await expect(page.locator('[data-project-exhibition]')).not.toHaveAttribute('data-project-scroll', 'true')
    await expect(page.locator('.hero__pin')).toHaveCSS('position', 'static')
    await expect(page.locator('#about [data-ink-word]').first()).toHaveCSS('opacity', '1')
    await expect(page.locator('#about [data-title] .char').first()).toHaveCSS('transform', 'none')
    await expect(page.locator('.cursor')).not.toHaveClass(/\bis-visible\b/)
    await expect(page.locator('html')).not.toHaveClass(/\bcursor-enabled\b/)
    await expect(page.locator('body')).not.toHaveCSS('cursor', 'none')

    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'full')
    if (!isMobile) {
      await expect(page.locator('[data-project-exhibition]')).toHaveAttribute('data-project-scroll', 'true')
      await page.mouse.move(400, 260)
      await expect(page.locator('.cursor')).toHaveClass(/\bis-visible\b/)
      await expect(page.locator('html')).toHaveClass(/\bcursor-enabled\b/)
    }
  })

  test('gallery strip navigation avoids smooth scrolling with reduced motion', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    await goToSection(page, 'gallery')
    await page.locator('[data-gallery-mode="strip"]').click()
    const scroller = page.locator('.gallery__scroller')
    await scroller.evaluate((element) => {
      const scrollTo = element.scrollTo.bind(element)
      element.scrollTo = (options?: number | ScrollToOptions, y?: number) => {
        if (typeof options === 'number') {
          element.dataset.requestedScrollBehavior = 'auto'
          scrollTo(options, y ?? 0)
        }
        else {
          element.dataset.requestedScrollBehavior = options?.behavior ?? 'auto'
          scrollTo(options)
        }
      }
    })
    await page.locator('[data-strip-next]').click()
    await expect(scroller).toHaveAttribute('data-requested-scroll-behavior', /^(auto|instant)$/)
    await expect(page.locator('[data-strip-current]')).toHaveText('02')
    expect(await scroller.evaluate(element => element.scrollLeft)).toBeGreaterThan(0)
  })
})
