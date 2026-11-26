import { expect, test } from '@playwright/test'
import { goToSection, waitForScrollReady } from './scroll-helpers'

test.describe('section navigation', () => {
  test('section navigation updates the URL and the active document section', async ({ page, isMobile }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    await goToSection(page, 'experience')
    await expect(page.locator('#main #experience')).toBeVisible()
    if (!isMobile)
      await expect(page.locator('.topbar__nav a[href="#experience"]')).toHaveAttribute('aria-current', 'location')
  })

  test('the top bar uses real anchors with reduced motion', async ({ page, isMobile }) => {
    test.skip(isMobile, 'The desktop section nav is hidden on mobile')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('./')
    await waitForScrollReady(page)

    const link = page.locator('.topbar__nav a[href="#experience"]')
    await expect(link).toBeVisible()

    await link.click()

    await expect(page).toHaveURL(/#experience$/)
    await expect(page.locator('#experience-title')).toBeInViewport()
  })

  test('a section deep link survives initialization and reload', async ({ page }) => {
    await page.goto('./#skills')
    await waitForScrollReady(page)
    await expect(page).toHaveURL(/#skills$/)
    await expect(page.locator('html')).toHaveAttribute('data-active-section', 'skills')
    await expect(page.locator('#skills-title')).toBeInViewport()

    await page.reload()
    await waitForScrollReady(page)
    await expect(page).toHaveURL(/#skills$/)
    await expect(page.locator('#skills-title')).toBeInViewport()
  })

  test('browser back and forward restore section navigation', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    await goToSection(page, 'about')
    await goToSection(page, 'contact')

    await page.goBack()
    await expect(page).toHaveURL(/#about$/)
    await expect(page.locator('#about-title')).toBeInViewport()
    await expect(page.locator('html')).toHaveAttribute('data-active-section', 'about')

    await page.goForward()
    await expect(page).toHaveURL(/#contact$/)
    await expect(page.locator('#contact-title')).toBeInViewport()
    await expect(page.locator('html')).toHaveAttribute('data-active-section', 'contact')
  })

  test('the skip link moves keyboard focus into the main landmark', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    await page.keyboard.press('Tab')
    await expect(page.locator('.skip-link')).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('#main')).toBeFocused()
  })
})
