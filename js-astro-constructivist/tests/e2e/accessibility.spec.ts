import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { SECTION_IDS, waitForScrollReady } from './scroll-helpers'

async function assertNoSevereViolations(page: Parameters<typeof waitForScrollReady>[0], selectors: string[] = []): Promise<void> {
  const builder = new AxeBuilder({ page })
    .withTags([
      'wcag2a',
      'wcag2aa',
      'wcag21a',
      'wcag21aa',
      'wcag22aa',
    ])
    .exclude('astro-dev-toolbar')
    .exclude('vite-error-overlay')
  for (const selector of selectors)
    builder.include(selector)
  const results = await builder.analyze()

  const severe = results.violations.filter(
    violation => violation.impact === 'serious' || violation.impact === 'critical',
  )
  const details = severe
    .flatMap(violation => violation.nodes.map(node => `${violation.id} (${violation.impact}) ${node.target.join(' ')}`))
    .join('\n')

  expect(severe.length, details).toBe(0)
}

async function exposeClippedControls(page: Parameters<typeof waitForScrollReady>[0], id: string): Promise<void> {
  const controls = page.locator(`#${id} a, #${id} button, #${id} input, #${id} select`)
  let previous = ''
  await expect.poll(async () => {
    const positions = await controls.evaluateAll(elements => JSON.stringify(elements.map(element => Math.round(element.getBoundingClientRect().top * 10))))
    const settled = previous === positions
    previous = positions
    return settled
  }, {
    intervals: [100],
  }).toBe(true)

  await controls.evaluateAll((elements) => {
    const header = document.querySelector('.topbar')?.getBoundingClientRect().bottom ?? 0
    const clipped = elements.map(element => element.getBoundingClientRect()).find((rect) => {
      const visible = Math.min(innerHeight, rect.bottom) - Math.max(header, rect.top)
      return rect.width >= 24 && rect.height >= 24 && rect.left < innerWidth && rect.right > 0
        && visible > 0 && visible < 24
    })
    // Expose a scrollable control rather than audit only its viewport-edge sliver.
    if (clipped) {
      window.scrollBy({
        top: clipped.top < header
          ? clipped.top - header - 16
          : clipped.bottom - innerHeight + 16,
        behavior: 'instant',
      })
    }
  })
}

test.describe('accessibility', () => {
  test('document and section midpoints have no serious or critical WCAG 2.2 A/AA violations', async ({ page }) => {
    test.setTimeout(90_000)
    await page.goto('./')
    await waitForScrollReady(page)
    await expect(page.locator('.hero__annotation')).toHaveCSS('opacity', '1')
    await expect(page.locator('.hero__foot')).toHaveCSS('opacity', '1')
    await assertNoSevereViolations(page)

    for (const id of SECTION_IDS.slice(1)) {
      const section = page.locator(`#${id}`)
      await section.evaluate((element) => {
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY + Math.max(0, (element.getBoundingClientRect().height - window.innerHeight) / 2),
          behavior: 'instant',
        })
      })
      await expect(page.locator('html')).toHaveAttribute('data-active-section', id)
      await expect.poll(() => section.locator('[data-scroll], [data-reveal], [data-ink-word], [data-project-title], [data-contact-line], [data-skill-item]').evaluateAll(elements =>
        elements.filter(element => element.checkVisibility() && Number(getComputedStyle(element).opacity) < 0.999)
          .map(element => element.className),
      )).toEqual([])
      await exposeClippedControls(page, id)
      await assertNoSevereViolations(page, [`#${id}`, '.topbar', '.rail'])
    }
  })

  test('reduced-motion document has no serious or critical WCAG 2.2 A/AA violations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('./')
    await waitForScrollReady(page)
    await assertNoSevereViolations(page)
  })
})
