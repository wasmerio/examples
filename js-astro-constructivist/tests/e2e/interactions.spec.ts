import { expect, test } from '@playwright/test'
import { cv, uiText } from '../helpers/cv'
import { goToSection, waitForScrollReady } from './scroll-helpers'

test.describe('section interactions', () => {
  test('index dialog opens, navigates and closes', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)

    await page.locator('[data-index-open]').click()
    const dialog = page.locator('#indexDialog')
    await expect(dialog).toBeVisible()

    await dialog.locator('[data-index-link][href="#projects"]').click()
    await expect(dialog).toBeHidden()
    await expect(page).toHaveURL(/#projects$/)
    await expect(page.locator('html')).toHaveAttribute('data-active-section', 'projects')
    await expect(page.locator('#projects-title')).toBeInViewport()
  })

  test('menu motion closes cleanly when interrupted by Escape and reduced motion', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    const trigger = page.locator('[data-index-open]')
    const dialog = page.locator('#indexDialog')
    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Escape')
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(dialog).toHaveAttribute('data-menu-state', 'closed')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toBeFocused()

    await page.keyboard.press('ControlOrMeta+k')
    await expect(dialog).toBeVisible()
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(dialog).toHaveAttribute('data-menu-state', 'open')
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(page.locator('html')).not.toHaveClass(/\bindex-open\b/)
  })

  test('skills filtering updates its announcement and subsequent section geometry', async ({ page }) => {
    const categories = [
      ...new Set(cv.skills.map(skill => skill.category ?? 'Core')),
    ]
    test.skip(categories.length < 2, 'Needs two configured categories to verify filtering')
    const category = categories[0]!
    const filter = `[data-skill-filter=${JSON.stringify(category)}]`
    await page.goto('./')
    await waitForScrollReady(page)
    await goToSection(page, 'skills')
    await page.locator(filter).click()

    await expect(page.locator(filter)).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('[data-skill-filter="all"]')).toHaveAttribute('aria-pressed', 'false')
    const count = cv.skills.filter(skill => (skill.category ?? 'Core') === category).length
    await expect(page.locator('[data-skill-status]')).toHaveText(uiText('skills.status', {
      count: String(count).padStart(2, '0'),
      category: uiText('skills.categoryStatus', { category }),
    }))

    const otherGroup = page.locator('[data-skill-group]').filter({
      has: page.getByRole('heading', { name: categories[1]!, exact: true }),
    })
    await expect(otherGroup).toBeHidden()
    await expect(page.locator(`[data-skill-item][data-category=${JSON.stringify(category)}]:visible`)).toHaveCount(count)

    await page.locator('[data-skill-filter="all"]').click()
    await expect(page.locator('[data-skill-status]')).toHaveText(uiText('skills.status', {
      count: String(cv.skills.length).padStart(2, '0'),
      category: uiText('skills.allCategories'),
    }))
    await expect(otherGroup).toBeVisible()
    await goToSection(page, 'gallery')
    await expect(page.locator('#gallery-title')).toBeInViewport()
  })

  test('gallery strip buttons and keyboard advance the native horizontal scroller', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    await goToSection(page, 'gallery')
    await page.locator('[data-gallery-mode="strip"]').click()
    await expect(page.locator('#gallery-board')).toBeHidden()
    await expect(page.locator('#gallery-board')).toHaveAttribute('inert', '')
    await expect(page.locator('#gallery-strip')).toBeVisible()
    await expect(page.locator('[data-gallery-mode="strip"]')).toHaveAttribute('aria-pressed', 'true')

    const current = page.locator('[data-strip-current]')
    await expect(current).toHaveText('01')

    await page.locator('[data-strip-next]').click()
    await expect.poll(async () => current.textContent()).toBe('02')
    expect(await page.locator('.gallery__scroller').evaluate(element => element.scrollLeft)).toBeGreaterThan(0)

    await page.locator('.gallery__scroller').focus()
    await page.keyboard.press('ArrowLeft')
    await expect.poll(async () => current.textContent()).toBe('01')
  })

  test('switching gallery modes changes the accessible lightbox group', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    await goToSection(page, 'gallery')
    await page.locator('[data-gallery-mode="board"]').click()
    await expect(page.locator('#gallery-board')).toBeVisible()
    await expect(page.locator('#gallery-strip')).toBeHidden()
    await expect(page.locator('#gallery-strip')).toHaveAttribute('inert', '')
    await expect(page.locator('#gallery-strip [data-lightbox]')).toHaveCount(0)
    await expect(page.locator('#gallery-board [data-lightbox="gallery"]')).toHaveCount(Math.min(4, cv.images?.list.length ?? 0))

    await page.locator('[data-gallery-mode="strip"]').click()
    await expect(page.locator('#gallery-board [data-lightbox]')).toHaveCount(0)
    await expect(page.locator('#gallery-strip [data-lightbox="gallery"]')).toHaveCount(cv.images?.list.length ?? 0)
  })

  test('dragging a board print does not open the lightbox and reset restores it', async ({ page, isMobile }) => {
    test.skip(isMobile, 'The board drag uses a fine pointer')
    await page.goto('./')
    await waitForScrollReady(page)
    await goToSection(page, 'gallery')
    const print = page.locator('[data-board-print]').first()
    await print.scrollIntoViewIfNeeded()
    const box = await print.boundingBox()
    expect(box).not.toBeNull()
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.mouse.down()
    await page.mouse.move(box!.x + box!.width / 2 + 60, box!.y + box!.height / 2 + 30, { steps: 8 })
    await page.mouse.up()

    await expect(page.locator('#lightbox')).toBeHidden()
    expect(await print.evaluate(element => element.style.getPropertyValue('--dx'))).not.toBe('')
    await page.locator('[data-board-reset]').click()
    await expect(page.locator('[data-board-status]')).toHaveText(uiText('gallery.resetStatus'))
    expect(await print.evaluate(element => element.style.getPropertyValue('--dx'))).toBe('')
  })

  test('denied clipboard access selects the actual email for manual copying', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async () => {
            throw new DOMException('Clipboard access denied', 'NotAllowedError')
          },
        },
      })
    })
    await page.goto('./')
    await waitForScrollReady(page)
    await goToSection(page, 'contact')
    const email = (await page.locator('.contact__email').textContent())!.trim()
    await page.locator('[data-copy-email]').click()
    await expect.poll(() => page.evaluate(() => window.getSelection()?.toString().trim())).toBe(email)
  })
})
