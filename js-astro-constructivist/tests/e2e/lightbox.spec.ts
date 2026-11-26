import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'
import { goToProject, goToSection, waitForScrollReady } from './scroll-helpers'

async function assertLightbox(page: Page, group: 'projects' | 'gallery'): Promise<void> {
  const trigger = page.locator(`#${group === 'projects'
    ? 'project-1'
    : 'gallery'} [data-lightbox="${group}"]`).first()
  await expect(trigger).toBeVisible()
  const href = await trigger.getAttribute('href')
  expect(href, `The first [data-lightbox="${group}"] anchor needs an href`).toBeTruthy()

  const expectedSource = await trigger.locator('img:visible').first().evaluate(
    image => (image as HTMLImageElement).currentSrc || (image as HTMLImageElement).src,
  )
  expect(expectedSource).toBeTruthy()

  await trigger.click()

  const dialog = page.locator('dialog.lightbox[open]')
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('.lightbox__image')).toHaveAttribute('src', expectedSource)
  await expect.poll(
    () => dialog.locator('.lightbox__image').evaluate(image => (image as HTMLImageElement).naturalWidth),
    { timeout: 8_000 },
  ).toBeGreaterThan(0)

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
}

test.describe('image lightbox', () => {
  test('projects open the project image and close on Escape', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    await goToProject(page, 1)
    await assertLightbox(page, 'projects')
  })

  test('gallery opens the gallery image and closes on Escape', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    await goToSection(page, 'gallery')
    await assertLightbox(page, 'gallery')
  })
})
