import { expect, test } from '@playwright/test'
import { goToSection, waitForScrollReady } from './scroll-helpers'

test.describe('detail expanders', () => {
  test('toggles aria-expanded and inert while keeping the record in its section', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    await goToSection(page, 'experience')

    const toggle = page.locator('.expander__toggle').first()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')

    const controls = await toggle.getAttribute('aria-controls')
    expect(controls).toBeTruthy()
    const body = page.locator(`#${controls}`)
    await expect(body).toHaveAttribute('inert', '')

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(body).not.toHaveAttribute('inert', '')
    await expect(body).toHaveAttribute('aria-hidden', 'false')

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(body).toHaveAttribute('inert', '')
    await expect(body).toHaveAttribute('aria-hidden', 'true')
    await expect(page.locator('#main #experience')).toHaveCount(1)
    await goToSection(page, 'projects')
    await expect(page.locator('#projects-title')).toBeInViewport()
  })
})
