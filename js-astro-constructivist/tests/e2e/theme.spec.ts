import { expect, test } from '@playwright/test'
import { cv, uiText } from '../helpers/cv'
import { waitForScrollReady } from './scroll-helpers'

test.describe('theme controls', () => {
  test('theme switch toggles dark mode and persists after reload', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)

    const html = page.locator('html')
    await expect(html).not.toHaveClass(/\bdark\b/)

    await page.locator('#themeSwitch').click()

    await expect(html).toHaveClass(/\bdark\b/)
    await expect(page.locator('#themeSwitch')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('#themeSwitch')).toHaveAccessibleName(uiText('theme.lightLabel'))
    await expect.poll(() => page.evaluate(() => localStorage.getItem('theme'))).toBe('dark')

    await page.reload()

    await expect(html).toHaveClass(/\bdark\b/)
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark')
  })

  test('palette selection updates data-theme and persists after reload', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)

    const html = page.locator('html')
    await expect(html).toHaveAttribute('data-theme', cv.basics.theme)

    await page.selectOption('#themeSelect', 'blue')

    await expect(html).toHaveAttribute('data-theme', 'blue')
    await expect.poll(() => page.evaluate(() => localStorage.getItem('data-theme'))).toBe('blue')

    await page.reload()

    await expect(html).toHaveAttribute('data-theme', 'blue')
    expect(await page.evaluate(() => localStorage.getItem('data-theme'))).toBe('blue')
  })

  test('palette transitions keep the mode control clickable', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    test.skip(!await page.evaluate(() => typeof document.startViewTransition === 'function'), 'The browser does not provide View Transitions')
    const control = page.locator('#themeSwitch')
    const bounds = await control.boundingBox()
    expect(bounds).not.toBeNull()

    await page.selectOption('#themeSelect', 'blue')
    await page.waitForFunction(() => document.getAnimations().some(animation =>
      (animation.effect as KeyframeEffect | null)?.pseudoElement?.startsWith('::view-transition'),
    ))
    await page.mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2)

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'blue')
    await expect(page.locator('html')).toHaveClass(/\bdark\b/)
    await expect(control).toHaveAttribute('aria-pressed', 'true')
  })

  test('reducing motion ends an in-progress theme transition', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    test.skip(!await page.evaluate(() => typeof document.startViewTransition === 'function'), 'The browser does not provide View Transitions')
    await page.locator('#themeSwitch').click()
    await page.waitForFunction(() => document.getAnimations().some(animation =>
      (animation.effect as KeyframeEffect | null)?.pseudoElement?.startsWith('::view-transition'),
    ))
    await page.emulateMedia({ reducedMotion: 'reduce' })

    await expect(page.locator('html')).toHaveClass(/\bdark\b/)
    await expect.poll(() => page.evaluate(() => document.getAnimations().some(animation =>
      (animation.effect as KeyframeEffect | null)?.pseudoElement?.startsWith('::view-transition'),
    )), {
      timeout: 250,
      intervals: [0, 25, 50],
    }).toBe(false)
    await expect(page.locator('#themeSwitch')).toHaveAttribute('aria-pressed', 'true')
  })

  test('blocked storage does not break theme controls or accessible state', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.addInitScript(() => {
      Storage.prototype.getItem = () => {
        throw new DOMException('Storage is blocked', 'SecurityError')
      }
      Storage.prototype.setItem = () => {
        throw new DOMException('Storage is blocked', 'SecurityError')
      }
    })
    await page.goto('./')
    await waitForScrollReady(page)
    await page.locator('#themeSwitch').click()
    await expect(page.locator('html')).toHaveClass(/\bdark\b/)
    await expect(page.locator('#themeSwitch')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('#themeSwitch')).toHaveAccessibleName(uiText('theme.lightLabel'))

    await page.selectOption('#themeSelect', 'green')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'green')
    await expect(page.locator('#themeSelect')).toHaveValue('green')
    await page.locator('#themeSwitch').click()
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/)
    await expect(page.locator('#themeSwitch')).toHaveAttribute('aria-pressed', 'false')
    expect(errors).toEqual([])
  })

  test('follows repeated system changes until the user chooses a mode', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    const html = page.locator('html')
    await expect(html).not.toHaveClass(/\bdark\b/)
    await page.emulateMedia({ colorScheme: 'dark' })
    await expect(html).toHaveClass(/\bdark\b/)
    await expect(page.locator('#themeSwitch')).toHaveAttribute('aria-pressed', 'true')
    await page.emulateMedia({ colorScheme: 'light' })
    await expect(html).not.toHaveClass(/\bdark\b/)

    await page.locator('#themeSwitch').click()
    await expect(html).toHaveClass(/\bdark\b/)
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.emulateMedia({ colorScheme: 'light' })
    await expect(html).toHaveClass(/\bdark\b/)
    await expect(page.locator('#themeSwitch')).toHaveAccessibleName(uiText('theme.lightLabel'))
  })
})
