import { expect, test } from '@playwright/test'
import { cv, cvBasics } from '../helpers/cv'
import { goToProject, goToSection, waitForScrollReady } from './scroll-helpers'

test.describe('print layout', () => {
  test('compact print shows the masthead and restores all project content', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)

    await page.emulateMedia({ media: 'print' })

    await expect(page.locator('.print-masthead')).toBeVisible()
    await expect(page.locator('.print-masthead__name')).toHaveText(cvBasics.name)
    await expect(page.locator('.topbar')).toBeHidden()
    await expect(page.locator('.rail')).toBeHidden()
    await expect(page.locator('.print-poster')).toBeHidden()
    await expect(page.locator('#main')).toBeVisible()
    for (const project of await page.locator('[data-project]').all()) {
      await expect(project).toBeVisible()
      await expect(project).toHaveCSS('transform', 'none')
    }
    await expect(page.locator('[data-project-track]')).toHaveCSS('transform', 'none')
    const bounds = await page.locator('[data-project]').evaluateAll(projects => projects.map(project => ({
      top: project.getBoundingClientRect().top,
      bottom: project.getBoundingClientRect().bottom,
    })))
    for (let index = 1; index < bounds.length; index++)
      expect(bounds[index]!.top).toBeGreaterThanOrEqual(bounds[index - 1]!.bottom - 1)
  })

  test('poster print produces one actual A4 PDF page', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    await page.evaluate(() => {
      window.print = () => {}
    })
    await page.locator('[data-index-open]').click()
    await page.locator('[data-print][data-print-mode="poster"]').click()
    await expect(page.locator('html')).toHaveAttribute('data-print-mode', 'poster')
    await expect(page.locator('#main')).toBeVisible()
    await expect(page.locator('#indexDialog')).toBeHidden()
    await page.emulateMedia({ media: 'print' })

    await expect(page.locator('.print-masthead')).toBeHidden()
    await expect(page.locator('#main')).toBeHidden()
    await expect(page.locator('.print-poster')).toBeVisible()
    const box = await page.locator('.print-poster').boundingBox()
    expect(box?.width).toBeCloseTo(793.7, 0)
    expect(box?.height).toBeLessThanOrEqual(1124)
    const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true })
    expect(pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)).toHaveLength(1)
  })

  test('poster printing installs zero margins and cleans its mode after printing', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    await page.evaluate(() => {
      window.print = () => {}
    })

    await page.locator('[data-index-open]').click()
    await page.locator('[data-print][data-print-mode="poster"]').click()

    await expect(page.locator('html')).toHaveAttribute('data-print-mode', 'poster')
    await expect(page.locator('#poster-page')).toHaveCount(1)
    expect(await page.locator('#poster-page').evaluate(node => node.textContent)).toContain('@page')

    await page.evaluate(() => window.dispatchEvent(new Event('afterprint')))
    await expect(page.locator('html')).not.toHaveAttribute('data-print-mode', 'poster')
    await expect(page.locator('#poster-page')).toHaveCount(0)
  })

  test('printing from an open lightbox releases the viewer scroll lock', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    await goToProject(page, 1)
    await page.locator('#project-1 [data-lightbox]').click()
    await expect(page.locator('#lightbox')).toBeVisible()
    await page.evaluate(() => {
      window.dispatchEvent(new Event('beforeprint'))
      window.dispatchEvent(new Event('afterprint'))
    })
    await expect(page.locator('#lightbox')).toBeHidden()
    await expect(page.locator('html')).not.toHaveClass(/\blightbox-open\b/)
    await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden')
    await goToSection(page, 'contact')
    await expect(page.locator('#contact-title')).toBeInViewport()
  })

  test('compact printing includes filtered-out skills without changing the screen filter', async ({ page }) => {
    const categories = [
      ...new Set(cv.skills.map(skill => skill.category ?? 'Core')),
    ]
    test.skip(categories.length < 2, 'Needs two configured categories to verify filtered printing')
    const category = categories[0]!
    const filter = `[data-skill-filter=${JSON.stringify(category)}]`
    await page.goto('./')
    await waitForScrollReady(page)
    await goToSection(page, 'skills')
    const total = await page.locator('[data-skill-item]').count()
    const selected = await page.locator(`[data-skill-item][data-category=${JSON.stringify(category)}]`).count()
    await page.locator(filter).click()
    await expect(page.locator('[data-skill-item]:visible')).toHaveCount(selected)

    await page.emulateMedia({ media: 'print' })
    await expect(page.locator('[data-skill-item]:visible')).toHaveCount(total)

    await page.emulateMedia({ media: 'screen' })
    await expect(page.locator(filter)).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('[data-skill-item]:visible')).toHaveCount(selected)
  })
})
