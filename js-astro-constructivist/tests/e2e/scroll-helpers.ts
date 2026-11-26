import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { cv } from '../helpers/cv'

export const SECTION_IDS = cv.sections.filter(section => section.enabled).map(section => section.id)

export async function waitForScrollReady(page: Page): Promise<void> {
  await expect(page.locator('html')).toHaveAttribute('data-loader-ready', 'true', { timeout: 15_000 })
  await expect(page.locator('html')).toHaveClass(/\bscroll-ready\b/, { timeout: 15_000 })
  await expect(page.locator('html')).toHaveAttribute('data-scroll-ready', 'true', { timeout: 15_000 })
  await expect(page.locator('#main > [data-scroll-section]')).toHaveCount(SECTION_IDS.length)
}

async function clickStickyControl(page: Page, control: Locator): Promise<void> {
  await expect(control).toBeInViewport()
  const box = await control.boundingBox()
  expect(box).not.toBeNull()
  // Playwright auto-scroll moves even visible sticky controls to their flow box.
  await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2)
}

export async function goToSection(page: Page, section: (typeof SECTION_IDS)[number]): Promise<void> {
  const topbarLink = page.locator(`.topbar a[href="#${section}"]`)
  if (await topbarLink.isVisible()) {
    await clickStickyControl(page, topbarLink)
  }
  else {
    await clickStickyControl(page, page.locator('[data-index-open]'))
    await page.locator(`#indexDialog [data-index-link][href="#${section}"]`).click()
    await expect(page.locator('#indexDialog')).toBeHidden()
  }

  await expect(page.locator('html')).toHaveAttribute('data-active-section', section)
  await expect(page).toHaveURL(new RegExp(`#${section}$`))
  await expect(page.locator(`#${section === 'top'
    ? 'hero'
    : section}-title`)).toBeInViewport()
  await expect(page.locator(`#${section}`)).toBeFocused()
}

export async function goToProject(page: Page, number: number): Promise<void> {
  await goToSection(page, 'projects')
  await page.locator(`#projects a[href="#project-${number}"]`).first().click()
  await expect(page).toHaveURL(new RegExp(`#project-${number}$`))
  await expect(page.locator(`#project-title-${number}`)).toBeInViewport()
  await expect(page.locator('html')).toHaveAttribute('data-active-section', 'projects')
  await expect(page.locator(`#project-${number}`)).toBeFocused()
}
