import { expect, test } from '@playwright/test'
import { cv } from '../helpers/cv'
import { goToProject, goToSection, waitForScrollReady } from './scroll-helpers'

test.describe('section-driven experience', () => {
  test('section progress follows actual document scrolling', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    await goToSection(page, 'about')

    const section = page.locator('#about')
    const before = await section.evaluate(element => Number(element.style.getPropertyValue('--section-progress')))
    const scrollBefore = await page.evaluate(() => window.scrollY)
    await page.evaluate(() => window.scrollBy({ top: window.innerHeight * 0.4, behavior: 'instant' }))

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollBefore + 100)
    await expect.poll(() => section.evaluate(element => Number(element.style.getPropertyValue('--section-progress')))).toBeGreaterThan(before)
    await expect(page.locator('#main #about')).toHaveCount(1)
    await expect(page.locator('html')).not.toHaveClass(/\bscreen-mode\b/)
  })

  test('desktop exhibition advances horizontally without trapping the next section', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Touch viewports use the stacked project document')
    await page.goto('./')
    await waitForScrollReady(page)
    await expect(page.locator('[data-project-exhibition]')).toHaveAttribute('data-project-scroll', 'true')
    await goToProject(page, 1)

    const first = page.locator('#project-1')
    const before = await first.evaluate(element => element.getBoundingClientRect().left)
    const scrollBefore = await page.evaluate(() => window.scrollY)
    await page.mouse.wheel(0, 650)

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollBefore + 300)
    await expect.poll(() => first.evaluate(element => element.getBoundingClientRect().left)).toBeLessThan(before - 150)
    await goToSection(page, 'education')
    await expect(page.locator('#education-title')).toBeInViewport()
  })

  test('project deep links reveal the requested case on load and reload', async ({ page }) => {
    await page.goto('./#project-3')
    await waitForScrollReady(page)
    await expect(page).toHaveURL(/#project-3$/)
    await expect(page.locator('#project-title-3')).toBeInViewport()
    await expect(page.locator('html')).toHaveAttribute('data-active-section', 'projects')

    await page.reload()
    await waitForScrollReady(page)
    await expect(page).toHaveURL(/#project-3$/)
    await expect(page.locator('#project-title-3')).toBeInViewport()
  })

  test('slow fonts do not block deep links or replay them after navigation', async ({ page }) => {
    let releaseFonts!: () => void
    const pendingFonts = new Promise<void>((resolve) => {
      releaseFonts = resolve
    })
    await page.route(/\.(?:woff2?|ttf)(?:\?|$)/, async (route) => {
      await pendingFonts
      await route.continue()
    })
    try {
      await page.goto('./#project-3', { waitUntil: 'domcontentloaded' })
      if (cv.site.loader.enabled)
        await page.locator('[data-loader-skip]').click()
      await waitForScrollReady(page)
      await expect(page).toHaveURL(/#project-3$/)
      await expect(page.locator('#project-title-3')).toBeInViewport()

      await goToSection(page, 'contact')
      releaseFonts()
      await page.waitForLoadState('load')
      await page.evaluate(() => document.fonts.ready.then(() => {}))
      await expect(page).toHaveURL(/#contact$/)
      await expect(page.locator('#contact-title')).toBeInViewport()
      await expect(page.locator('html')).toHaveAttribute('data-active-section', 'contact')
    }
    finally {
      releaseFonts()
    }
  })

  test('keyboard focus brings the next horizontal case into view', async ({ page, isMobile }) => {
    test.skip(isMobile, 'The horizontal keyboard bridge is desktop-only')
    await page.goto('./')
    await waitForScrollReady(page)
    await goToProject(page, 1)
    await page.locator('#project-1 a, #project-1 button').last().focus()
    await page.keyboard.press('Tab')

    const nextLink = page.locator('#project-2 a').first()
    await expect(nextLink).toBeFocused()
    await expect(nextLink).toBeInViewport()
    await expect(page.locator('[data-project-exhibition]')).toHaveAttribute('data-active-project', 'project-2')
    await expect(page.locator('[data-project-current]')).toHaveText('02')
  })

  test('case files browse with arrow keys and return focus to the document', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    await goToProject(page, 2)
    const trigger = page.locator('#project-2 [data-case-open]')
    await trigger.click()

    const dialog = page.locator('#projectCase')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('[data-case-panel]:visible')).toHaveAttribute('data-case-index', '1')
    await page.keyboard.press('ArrowRight')
    await expect(dialog.locator('[data-case-panel]:visible')).toHaveAttribute('data-case-index', '2')
    await expect(dialog.locator('#case-title-3')).toBeFocused()
    await page.keyboard.press('ArrowLeft')
    await expect(dialog.locator('[data-case-panel]:visible')).toHaveAttribute('data-case-index', '1')

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect(page.locator('#main #project-2')).toHaveCount(1)
  })

  test('blueprint mode toggles with G and closes with Escape', async ({ page, isMobile }) => {
    test.skip(isMobile, 'The spec overlay is desktop-only')
    await page.goto('./')
    await waitForScrollReady(page)

    await page.keyboard.press('g')
    await expect(page.locator('[data-blueprint-panel]')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.locator('html')).not.toHaveClass(/blueprint/)
    await expect(page.locator('[data-blueprint-panel]')).toBeHidden()
  })

  test('poster studio opens, reprints, downloads SVG and restores focus', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    await goToSection(page, 'contact')

    const trigger = page.locator('[data-poster-open]')
    await trigger.click()
    const dialog = page.locator('#posterStudio')
    await expect(dialog).toBeVisible()
    const poster = dialog.locator('[data-poster-canvas] svg')
    await expect(poster).toBeVisible()
    const before = await poster.innerHTML()

    await dialog.locator('[data-poster-reprint]').click()
    await expect.poll(async () => poster.innerHTML()).not.toBe(before)

    const downloadPromise = page.waitForEvent('download')
    await dialog.locator('[data-poster-svg]').click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/\.svg$/)
    expect(await download.failure()).toBeNull()

    await dialog.locator('[data-poster-close]').click()
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('command search follows a case deep link instead of a scene', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)

    await page.keyboard.press('ControlOrMeta+k')
    const dialog = page.locator('#indexDialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('[data-command-input]')).toBeFocused()
    const project = cv.projects[0]!
    await dialog.locator('[data-command-input]').fill(project.name)

    await expect(dialog.locator('[data-command-results]')).toBeVisible()
    const hit = dialog.locator('[data-command-item]:visible').first()
    await expect(hit).toContainText(project.name)
    const href = await hit.locator('a').getAttribute('href')
    expect(href).toMatch(/^#project-\d+$/)
    await page.keyboard.press('Enter')

    await expect(dialog).toBeHidden()
    await expect(page).toHaveURL(new RegExp(`${href}$`))
    await expect(page.locator(`${href} [data-project-title]`)).toBeInViewport()
    await expect(page.locator('html')).toHaveAttribute('data-active-section', 'projects')
  })
})
