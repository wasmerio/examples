import { expect, test } from '@playwright/test'
import { expectHoveredCss } from './browser-helpers'

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 820, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  test(`layout remains usable on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('.vp-navbar-title')).toBeVisible()
    await expect(page.locator('.vp-post-item h3').first()).toHaveCSS('font-weight', '600')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    if (viewport.width < 768) {
      await expect(page.locator('.vp-navbar-hamburger')).toBeVisible()
      await expect(page.locator('.vp-navbar-hamburger')).toHaveCSS('border-radius', '0px')
      await expect(page.locator('.vp-navbar-menu')).toBeHidden()
      await expect(page.locator('.vp-navbar-social-links')).toBeHidden()
      expect(await page.locator('.vp-navbar-hamburger').evaluate(element => element.getBoundingClientRect().right <= innerWidth)).toBe(true)
    } else {
      await expect(page.locator('.vp-navbar-menu')).toBeVisible()
    }
  })
}

test('desktop navigation keeps the frozen light and dark responsive matrix', async ({ page }) => {
  const colors = {
    light: { text: 'rgb(60, 60, 67)', panel: 'rgb(255, 255, 255)', border: 'rgb(226, 226, 227)', warning: 'rgba(234, 179, 8, 0.14)' },
    dark: { text: 'rgba(255, 255, 245, 0.86)', panel: 'rgb(32, 33, 39)', border: 'rgb(46, 46, 50)', warning: 'rgba(234, 179, 8, 0.16)' },
  }
  for (const theme of ['light', 'dark'] as const) {
    for (const width of [1440, 820, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
      await page.evaluate(value => localStorage.setItem('vuepress-theme-appearance', value), theme)
      await page.reload({ waitUntil: 'domcontentloaded' })
      const menu = page.locator('.vp-navbar-menu')
      if (width === 390) {
        await expect(menu).toBeHidden()
        await expect(page.locator('.vp-navbar-hamburger')).toBeVisible()
        continue
      }

      await expect(menu).toHaveCSS('display', 'flex')
      const blog = menu.locator('.navbar-menu-link[href="/blog/"]')
      await expect(blog).toHaveCSS('height', '64px')
      await expect(blog).toHaveCSS('font-size', '14px')
      await expect(blog).toHaveCSS('font-weight', '500')
      await expect(blog).toHaveCSS('line-height', '64px')
      await expect(blog).toHaveCSS('color', colors[theme].text)
      await expect(blog).toHaveCSS('transition-property', 'color')
      const icon = blog.locator('.vp-icon')
      await expect(icon).toHaveCSS('width', '14px')
      await expect(icon).toHaveCSS('height', '14px')
      await expect(icon).toHaveCSS('margin-left', '4.2px')
      await expect(icon).toHaveCSS('margin-right', '4.2px')

      const group = menu.locator('.vp-navbar-menu-group').first()
      const button = group.locator(':scope > .button')
      await expect(button).toHaveCSS('height', '64px')
      await expect(button).toHaveCSS('padding', '0px 10px')
      await expect(button).toHaveCSS('border-radius', '0px')
      await button.hover()
      await page.waitForTimeout(300)
      await expect(button).toHaveAttribute('aria-expanded', 'true')
      await expect(button.locator('.text')).toHaveCSS('color', 'rgb(106, 161, 183)')

      const panel = group.locator('.vp-menu')
      await expect(panel).toHaveCSS('min-width', '128px')
      await expect(panel).toHaveCSS('padding', '12px')
      await expect(panel).toHaveCSS('border-radius', '12px')
      await expect(panel).toHaveCSS('background-color', colors[theme].panel)
      await expect(panel).toHaveCSS('border-top-color', colors[theme].border)
      await expect(panel).not.toHaveCSS('box-shadow', 'none')
      const content = group.locator('a[href="/docs/guide/content/"]')
      await expect(content).toHaveClass(/\bactive\b/)
      await expect(content).toHaveCSS('line-height', '32px')
      await expect(content).toHaveCSS('border-radius', '6px')
      await expect(content).toHaveCSS('transition-property', 'background-color, color')

      const badge = content.locator('.vp-menu-badge')
      await expect(badge).toHaveCSS('padding', '0px 10px')
      await expect(badge).toHaveCSS('margin-left', '2px')
      await expect(badge).toHaveCSS('border-radius', '12px')
      await expect(badge).toHaveCSS('font-size', '12px')
      await expect(badge).toHaveCSS('line-height', '22px')
      await expect(badge).toHaveCSS('background-color', colors[theme].warning)
      await expect(badge).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -2)')

      const external = group.locator('a[href="https://astro.build/"]')
      expect(await external.evaluate(element => getComputedStyle(element, '::after').content)).toBe('""')
      expect(await menu.locator(':scope > a, :scope > .vp-flyout').evaluateAll(items => items.every(item => item.getBoundingClientRect().height === 64))).toBe(true)
    }
  }
})

test('mobile navigation and local document navigation keep the frozen matrix', async ({ page }) => {
  test.setTimeout(120_000)
  const colors = {
    light: { text: 'rgb(60, 60, 67)', muted: 'rgba(60, 60, 67, 0.78)', bg: 'rgb(255, 255, 255)', soft: 'rgb(246, 246, 247)', border: 'rgb(226, 226, 227)' },
    dark: { text: 'rgba(255, 255, 245, 0.86)', muted: 'rgba(235, 235, 245, 0.6)', bg: 'rgb(27, 27, 31)', soft: 'rgb(32, 33, 39)', border: 'rgb(0, 0, 0)' },
  }
  for (const theme of ['light', 'dark'] as const) {
    for (const width of [390, 639, 767]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
      await page.evaluate(value => localStorage.setItem('vuepress-theme-appearance', value), theme)
      await page.reload({ waitUntil: 'domcontentloaded' })
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))

      const hamburger = page.locator('.vp-navbar-hamburger')
      const screen = page.locator('.vp-nav-screen')
      await hamburger.click()
      await expect(screen).toBeVisible()
      await expect(screen).toHaveCSS('top', '64px')
      await expect(screen).toHaveCSS('width', `${width}px`)
      await expect(screen).toHaveCSS('padding', '0px 32px')
      await expect(screen).toHaveCSS('background-color', colors[theme].bg)
      await expect(screen.locator(':scope > .container')).toHaveCSS('max-width', '288px')
      await expect(screen.locator(':scope > .container')).toHaveCSS('padding', '24px 0px 96px')

      const group = screen.locator('.vp-nav-screen-menu-group').first()
      await group.locator(':scope > .button').click()
      await expect(group.locator(':scope > .button')).toHaveCSS('padding', '12px 4px 11px 0px')
      await expect(group.locator(':scope > .button')).toHaveCSS('font-weight', '500')
      await expect(group.locator('.vp-nav-screen-menu-group-link').first()).toHaveCSS('margin-left', '12px')
      await expect(group.locator('.vp-nav-screen-menu-group-link').first()).toHaveCSS('line-height', '32px')
      await expect(group.locator('.vp-nav-screen-menu-group-section > .title')).toHaveCSS('color', colors[theme].muted)
      await expect(page.locator('.vp-nav-screen-translations')).toHaveCount(1)
      await expect(page.locator('.vp-nav-screen-appearance')).toHaveCSS('padding', '12px 14px 12px 16px')
      await expect(page.locator('.vp-nav-screen-appearance')).toHaveCSS('background-color', colors[theme].soft)
      expect(await screen.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)

      await hamburger.click()
      await expect(screen).toBeHidden()
      const local = page.locator('.vp-local-nav')
      await expect(local).toHaveCSS('height', '49px')
      await expect(local).toHaveCSS('background-color', colors[theme].bg)
      await expect(local).toHaveCSS('border-top-color', colors[theme].border)
      await expect(local.locator(':scope > .menu')).toHaveCSS('padding', '12px 24px 11px')
      await expect(local.locator(':scope > .menu')).toHaveCSS('transition-property', 'color')

      const outlineButton = local.locator('.vp-local-nav-outline-dropdown > button')
      const outlineItems = local.locator('.vp-local-nav-outline-dropdown .items')
      const entering = await outlineButton.evaluate(button => {
        (button as HTMLButtonElement).click()
        const dropdown = button.parentElement!
        const mask = dropdown.querySelector<HTMLElement>('.outline-mask')!
        const items = dropdown.querySelector<HTMLElement>('.items')!
        return {
          maskClass: mask.className,
          itemsClass: items.className,
          transitionProperty: getComputedStyle(items).transitionProperty,
        }
      })
      expect(entering.maskClass).toContain('fade-in-enter-active')
      expect(entering.itemsClass).toContain('fade-in-scale-up-enter-active')
      expect(entering.transitionProperty).toBe('opacity, transform')
      await expect(outlineButton).toHaveCSS('position', 'relative')
      await expect(outlineButton).toHaveCSS('color', colors[theme].text)
      await expect(outlineItems).toHaveCSS('display', 'grid')
      await expect(outlineItems).toHaveCSS('gap', '1px')
      await expect(outlineItems).toHaveCSS('max-height', '750px')
      await expect(outlineItems.locator('.outline-link').first()).toHaveCSS('padding', '2px 0px')
      await expect.poll(() => outlineItems.evaluate(element => element.className)).not.toContain('fade-in-scale-up-enter-active')
      await expect(outlineItems).toHaveCSS('transition-property', 'background-color, border, box-shadow')

      await outlineButton.click()
      await expect(outlineItems).toHaveClass(/fade-in-scale-up-leave-active/)
      await expect(outlineItems).toBeHidden()
      await page.evaluate(() => scrollTo({ top: 100, behavior: 'instant' }))
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(100)
      await expect(local).toHaveClass(/reached-top/)
      await expect(local).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)')
    }
  }
})

test('appearance switch keeps the frozen responsive light and dark matrix', async ({ page }) => {
  const colors = {
    light: { border: 'rgb(194, 194, 196)', bg: 'rgba(142, 150, 170, 0.14)', check: 'rgb(255, 255, 255)', icon: 'rgba(60, 60, 67, 0.78)' },
    dark: { border: 'rgb(60, 63, 68)', bg: 'rgba(101, 117, 133, 0.16)', check: 'rgb(0, 0, 0)', icon: 'rgba(255, 255, 245, 0.86)' },
  }
  for (const theme of ['light', 'dark'] as const) {
    for (const width of [1440, 820, 390]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
      await page.evaluate(value => localStorage.setItem('vuepress-theme-appearance', value), theme)
      await page.reload({ waitUntil: 'domcontentloaded' })
      let scope = page.locator('.vp-navbar-appearance')
      if (width < 768) {
        await page.locator('.vp-navbar-hamburger').click()
        scope = page.locator('.vp-nav-screen-appearance')
      } else if (width < 1280) {
        await page.locator('.vp-navbar-extra .flyout-button').click()
        scope = page.locator('.vp-navbar-extra')
      }

      const switcher = scope.locator('.vp-switch-appearance')
      const check = switcher.locator(':scope > .check')
      await expect(switcher).toBeVisible()
      await expect(switcher).toHaveCSS('width', '40px')
      await expect(switcher).toHaveCSS('height', '22px')
      await expect(switcher).toHaveCSS('border-color', colors[theme].border)
      await expect(switcher).toHaveCSS('border-radius', '11px')
      await expect(switcher).toHaveCSS('background-color', colors[theme].bg)
      await expect(switcher).toHaveCSS('transition-property', 'border-color, background-color')
      await expect(switcher).toHaveAttribute('aria-checked', String(theme === 'dark'))
      await expect(switcher).toHaveAttribute('title', theme === 'dark' ? '切换为浅色主题' : '切换为深色主题')
      await expect(check).toHaveCSS('width', '18px')
      await expect(check).toHaveCSS('height', '18px')
      await expect(check).toHaveCSS('background-color', colors[theme].check)
      await expect(check).toHaveCSS('transform', theme === 'dark' ? 'matrix(1, 0, 0, 1, 18, 0)' : 'none')
      await expect(check.locator(':scope > .icon')).toHaveCSS('overflow', 'hidden')
      await expect(check.locator('.sun')).toHaveCSS('color', colors[theme].icon)
      await expect(check.locator('.sun')).toHaveCSS('opacity', theme === 'dark' ? '0' : '1')
      await expect(check.locator('.moon')).toHaveCSS('opacity', theme === 'dark' ? '1' : '0')
      await expect(check.locator('.sun')).toHaveCSS('transition-property', theme === 'dark' ? 'opacity' : 'all')
      if (theme === 'light' && width === 1440) {
        for (let step = 0; step < 20 && !await switcher.evaluate(element => element === document.activeElement); step += 1) await page.keyboard.press('Tab')
        await expect(switcher).toBeFocused()
        expect(await switcher.evaluate(element => element.matches(':focus-visible'))).toBe(true)
        await expect(switcher).toHaveCSS('outline-offset', '4px')
      }
    }
  }
})

test('Plume root, page state, and desktop shell geometry stay aligned', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/blog/', { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.fonts.check('14px Inter4CJK'))).toBe(true)
  await expect(page.locator('html')).toHaveClass(/\blayout-posts\b/)
  await expect(page.locator('html')).toHaveClass(/\bbg-gray\b/)
  await expect(page.locator('#app > .theme-plume.vp-layout')).toHaveCount(1)
  await expect(page.locator('.vp-navbar')).toHaveCSS('border-bottom-color', 'rgb(226, 226, 227)')

  const edges = await page.evaluate(() => {
    const container = document.querySelector('.vp-navbar > .wrapper > .container')!.getBoundingClientRect()
    const content = document.querySelector('.vp-navbar .content-body')!.getBoundingClientRect()
    return { containerRight: container.right, contentRight: content.right }
  })
  expect(Math.abs(edges.containerRight - edges.contentRight)).toBeLessThan(0.5)
  await expect(page.locator('.vp-navbar-social-links.vp-social-links')).toHaveCount(1)
  await expect(page.locator('.vp-navbar-social-links .vp-social-link')).toHaveAttribute('aria-label', 'github')
  await expect(page.locator('.vp-navbar-social-links .vp-social-link')).toHaveCSS('transition-property', 'color')
  await expect(page.locator('.vp-navbar-social-links .vp-icon.is-svg > svg')).toHaveAttribute('viewBox', '0 0 24 24')
  await expect(page.locator('.vp-posts-nav')).toHaveCSS('display', 'block')
  await expect(page.locator('.vp-posts-nav .nav-link').first()).toHaveCSS('margin-bottom', '20px')
  await expect(page.locator('.vp-pagination')).toHaveCount(0)
  await expect(page.locator('.vp-footer .message')).toContainText('Powered by Astro & ermaozi')
  await expect(page.locator('.vp-footer .copyright')).toContainText('Copyright ©')
  await expect(page.locator('.vp-footer')).toHaveCSS('padding', '24px')
  await expect(page.locator('.vp-footer')).toHaveCSS('text-align', 'start')

  await page.locator('.vp-skip-link').focus()
  await expect(page.locator('.vp-skip-link')).toHaveCSS('position', 'absolute')
  await expect(page.locator('.vp-skip-link')).toHaveCSS('padding', '8px 16px')

  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveClass(/\blayout-doc\b/)
  await expect(page.locator('.vp-doc-aside-outline')).toHaveCSS('position', 'static')
  await expect(page.locator('.vp-doc-aside-outline .root')).toHaveCSS('position', 'relative')
  await expect(page.locator('.vp-sidebar .level-0 > .item > .text')).toHaveJSProperty('tagName', 'H2')
  await expect(page.locator('.vp-sidebar .level-1 > .item > .text').first()).toHaveJSProperty('tagName', 'H3')
  await expect(page.locator('.vp-sidebar .level-2 > .item > .link > .text').first()).toHaveJSProperty('tagName', 'P')
  await expect(page.locator('.vp-sidebar .caret').first()).toHaveCSS('width', '32px')
  await expect(page.locator('.vp-sidebar .caret').first()).toHaveCSS('height', '32px')
  await expect(page.locator('.vp-sidebar .caret-icon').first()).toHaveCSS('width', '18px')
  await expect(page.locator('.vp-sidebar .group + .group')).toHaveCSS('transition-property', 'border')
  await expect(page.locator('.vp-sidebar .text.separator')).toHaveCSS('border-bottom-width', '0px')
  await expect(page.locator('.vp-sidebar .vp-menu-badge.warning')).toHaveCSS('font-size', '10px')
  await expect(page.locator('.vp-breadcrumb')).toHaveCSS('display', 'block')
  await expect(page.locator('.vp-breadcrumb ol')).toHaveAttribute('typeof', 'BreadcrumbList')
  await expect(page.locator('.vp-breadcrumb li meta[property="name"]')).toHaveCount(4)
  await expect(page.locator('.vp-breadcrumb .current')).toHaveClass(/\bvp-link\b.*\blink\b.*\bno-icon\b.*\bbreadcrumb\b.*\bcurrent\b/)
  await expect(page.locator('.vp-doc-footer')).toHaveCSS('padding-top', '0px')
  await expect(page.locator('.vp-doc-footer')).toHaveCSS('border-top-width', '0px')
  await expect(page.locator('#VPContent')).toHaveCSS('transition-property', 'padding-left')
  await expect(page.locator('.vp-breadcrumb')).toHaveCSS('transition-property', 'border-left')
  await expect(page.locator('.outline-link').first()).toHaveCSS('transition-property', 'color')
  await expect(page.locator('.prev-next')).toHaveCSS('display', 'grid')
  await expect(page.locator('.prev-next')).toHaveCSS('justify-content', 'normal')
  await expect(page.locator('.prev-next')).toHaveCSS('transition-property', 'border-top')
  const pagerLinks = page.locator('.pager-link')
  await expect(pagerLinks).toHaveCount(2)
  await expect(pagerLinks.first()).toHaveClass('vp-link link pager-link prev')
  await expect(pagerLinks.locator('.title > span:first-child')).toHaveCount(2)
  await expect(pagerLinks.first()).toHaveCSS('text-decoration-line', 'none')
  await expect(pagerLinks.first()).toHaveCSS('transition-property', 'border-color')

  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('.vp-sidebar')).toHaveCSS('box-shadow', 'none')
  await expect(page.locator('.vp-sidebar')).toHaveCSS('scrollbar-width', 'thin')
  await expect(page.locator('.vp-sidebar')).toHaveCSS('transition-property', 'opacity, background-color, box-shadow, transform')
  await expect(page.locator('.vp-local-nav')).toHaveCSS('transition-property', 'border-color, background-color, border')
})

test('not-found content keeps the frozen Plume structure', async ({ page }) => {
  await page.goto('/404.html', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('#VPContent > .vp-not-found')).toHaveJSProperty('tagName', 'DIV')
  await expect(page.locator('#VPContent')).toHaveCSS('transition-property', 'all')
  await expect(page.locator('.vp-not-found .divider')).toHaveCSS('transition-property', 'background-color')
  await expect(page.locator('.vp-not-found .quote')).toHaveCSS('transition-property', 'color')
  await expect(page.locator('.vp-not-found .link')).toHaveCSS('transition-property', 'color, border-color')
  await expect(page.locator('.vp-not-found .link')).toHaveAttribute('aria-label', '返回站点首页')
})

test('local search keeps the frozen desktop, tablet, and mobile light/dark matrix', async ({ page }) => {
  const colors = {
    light: { text: 'rgb(60, 60, 67)', shell: 'rgb(255, 255, 255)' },
    dark: { text: 'rgba(255, 255, 245, 0.86)', shell: 'rgb(27, 27, 31)' },
  }
  for (const theme of ['light', 'dark'] as const) {
    for (const width of [1440, 820, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await page.goto('/', { waitUntil: 'domcontentloaded' })
      await page.evaluate(value => { localStorage.setItem('vuepress-theme-appearance', value); sessionStorage.clear() }, theme)
      await page.reload({ waitUntil: 'domcontentloaded' })
      const button = page.locator('.search-button')
      await expect(button).toHaveCSS('height', width < 768 ? '55px' : '40px')
      await expect(button).toHaveCSS('border-radius', width < 768 ? '0px' : '8px')
      await expect(page.locator('.mini-search-search-icon')).toHaveCSS('width', width < 768 ? '16px' : '14px')
      await button.click()
      await page.locator('.search-input').fill('Markdown')
      const result = page.locator('.result:has(.title:not(.main))').first()
      await expect(result).toBeVisible()
      const shell = page.locator('.shell')
      const shellWidth = width === 1440 ? 924 : width === 820 ? 784 : 390
      const contentWidth = width === 1440 ? 900 : width === 820 ? 760 : 366
      await expect(shell).toHaveCSS('background-color', colors[theme].shell)
      await expect(shell).toHaveCSS('color', colors[theme].text)
      await expect(shell).toHaveCSS('padding', '12px')
      await expect(shell).toHaveCSS('gap', '16px')
      await expect(shell).toHaveCSS('border-radius', width < 768 ? '0px' : '6px')
      await expect.poll(() => shell.evaluate(element => Math.round(element.getBoundingClientRect().width))).toBe(shellWidth)
      await expect.poll(() => page.locator('.search-bar').evaluate(element => Math.round(element.getBoundingClientRect().width))).toBe(contentWidth)
      await expect.poll(() => page.locator('.search-bar').evaluate(element => Math.round(element.getBoundingClientRect().height))).toBe(40)
      await expect.poll(() => result.evaluate(element => Math.round(element.getBoundingClientRect().width))).toBe(contentWidth)
      await expect.poll(() => result.evaluate(element => Math.round(element.getBoundingClientRect().height))).toBe(width < 768 ? 42 : 50)
      await expect(result).toHaveCSS('gap', '8px')
      await expect(result).toHaveCSS('border-radius', '4px')
      await expect(result.locator('.titles')).toHaveCSS('gap', '4px')
      await expect(page.locator('.result mark').first()).toHaveCSS('border-radius', '2px')
      if (width < 768) await expect(page.locator('.search-keyboard-shortcuts')).toBeHidden()
      else {
        await expect(page.locator('.search-keyboard-shortcuts')).toBeVisible()
        await expect.poll(() => page.locator('.search-keyboard-shortcuts kbd').first().evaluate(element => Math.round(element.getBoundingClientRect().height))).toBe(25)
      }
      await page.keyboard.press('Escape')
      await expect(page.locator('.VPLocalSearchBox')).toBeHidden()
    }
  }
})

test('post covers keep Plume layouts, aligned cards, and mobile-device geometry', async ({ page, browser }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/en/blog/', { waitUntil: 'domcontentloaded' })
  const topItem = page.locator('.vp-post-item:has(a[href="/en/blog/getting-started/"])')
  const topCover = topItem.locator('.post-cover')
  await expect(topItem).toHaveClass(/\btop\b/)
  await expect.poll(() => topCover.evaluate(element => (element as HTMLElement).style.height)).toBe('0px')
  await expect(topCover).toHaveCSS('padding-bottom', /\d+(?:\.\d+)?px/)

  await page.goto('/blog/', { waitUntil: 'domcontentloaded' })
  const encryptedItem = page.locator('.vp-post-item:has(a[href="/blog/encrypted-example/"])')
  const encryptedCover = encryptedItem.locator('.post-cover')
  const contentItem = page.locator('.vp-post-item:has(a[href="/blog/content-guide/"])')
  await expect(encryptedItem).toHaveClass(/\bleft\b/)
  await expect(encryptedCover).not.toHaveClass(/\bcompact\b/)
  await expect(encryptedCover).toHaveCSS('width', '180px')
  await expect(encryptedCover).toHaveCSS('height', '120px')
  await expect(contentItem).toHaveClass(/\bleft\b/)
  await expect(page.locator('.vp-post-item:has(a[href="/blog/markdown-showcase/"])')).toHaveClass(/\bleft\b/)
  await expect.poll(async () => ({
    cover: Math.round((await encryptedCover.boundingBox())!.x),
    content: Math.round((await encryptedItem.locator('.post-item-content').boundingBox())!.x),
  })).toEqual({
    cover: Math.round((await contentItem.locator('.post-cover').boundingBox())!.x),
    content: Math.round((await contentItem.locator('.post-item-content').boundingBox())!.x),
  })
  const item = page.locator('.vp-post-item:has(a[href="/blog/web-performance-basics/"])')
  const cover = item.locator('.post-cover')
  await expect(item).toHaveClass(/\bhas-cover\b/)
  await expect(item).toHaveClass(/\bright\b/)
  await expect(cover).toHaveCSS('width', '200px')
  await expect(cover).toHaveCSS('height', '150px')
  await expect(item).toHaveCSS('animation-duration', '0.25s')

  await page.setViewportSize({ width: 390, height: 900 })
  await expect.poll(() => cover.evaluate(element => {
    const rect = element.getBoundingClientRect()
    return { x: Math.round(rect.x), width: Math.round(rect.width), height: Math.round(rect.height) }
  })).toEqual({ x: 0, width: 390, height: 269 })

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(item).toHaveCSS('animation-name', 'none')

  const mobileContext = await browser.newContext({
    baseURL: 'http://127.0.0.1:4321',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 Chrome/132.0.0.0 Mobile Safari/537.36',
  })
  const mobilePage = await mobileContext.newPage()
  await mobilePage.goto('/blog/', { waitUntil: 'domcontentloaded' })
  const mobileCompact = mobilePage.locator('.vp-post-item:has(a[href="/blog/encrypted-example/"])')
  await expect(mobileCompact).toHaveClass(/\btop\b/)
  await expect(mobileCompact).not.toHaveClass(/\bleft\b/)
  await expect(mobileCompact.locator('.post-cover')).not.toHaveClass(/\bcompact\b/)
  await expect.poll(() => mobileCompact.locator('.post-cover').evaluate(element => (element as HTMLElement).style.height)).toBe('0px')
  await mobileContext.close()
})

test('taxonomy cards keep Plume desktop and mobile geometry', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/blog/categories/')
  const categories = page.locator('.vp-post-categories')
  await expect(page.locator('.vp-posts-aside')).toHaveJSProperty('tagName', 'DIV')
  await expect(page.locator('.vp-profile .vp-social-links')).toHaveClass('vp-social-links')
  await expect(page.locator('.vp-profile .vp-social-link')).toHaveCSS('width', '32px')
  await expect(categories).toHaveCSS('padding-left', '24px')
  await expect(categories).toHaveCSS('border-radius', '8px')
  await expect(page.locator('[data-category-id="3e30c5"]')).toBeVisible()

  await page.goto('/blog/tags/')
  await expect(page.locator('.tags-nav')).toHaveCSS('padding-left', '24px')
  await expect(page.locator('.tags .tag').first()).toHaveJSProperty('tagName', 'P')

  await page.goto('/blog/archives/')
  await expect(page.locator('.archives-title')).toBeHidden()
  await expect(page.locator('.archive').first()).toHaveCSS('border-radius', '8px')

  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('.archives-title')).toBeVisible()
  await expect(page.locator('.archive').first()).toHaveCSS('border-radius', '0px')
  await expect(page.locator('.vp-posts-aside')).toBeHidden()

  await page.goto('/blog/categories/')
  await expect(categories).toHaveCSS('padding-left', '16px')
  await expect(categories).toHaveCSS('border-radius', '0px')
  await expect(page.locator('[data-category-id="3e30c5"] > .folder')).toHaveCSS('font-size', '16px')

  await page.goto('/blog/tags/')
  await expect(page.locator('.tags-nav')).toHaveCSS('box-shadow', 'none')
  await page.locator('.tags .tag').first().click()
  await expect(page.locator('.tags-container')).toHaveCSS('margin-bottom', '0px')
  await expect(page.locator('.tags-container')).toHaveCSS('box-shadow', 'none')
})

test('cards, link cards, and badges keep the frozen component styles', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/blog/markdown-showcase/', { waitUntil: 'domcontentloaded' })

  const linkCard = page.locator('.vp-link-card').first()
  const card = page.locator('.vp-card-wrapper:has(> .title)').first()
  await page.locator('h2').first().evaluate(heading => {
    const element = document.createElement('span')
    element.className = 'vp-badge tip'
    element.dataset.parityBadge = ''
    element.textContent = 'stable'
    heading.append(element)
  })
  const badge = page.locator('[data-parity-badge]')
  const imageCard = page.locator('.vp-image-card').first()
  const masonry = page.locator('.vp-card-masonry')

  for (const theme of ['light', 'dark'] as const) {
    await page.evaluate(value => {
      document.documentElement.dataset.theme = value
      document.documentElement.classList.toggle('dark', value === 'dark')
      document.dispatchEvent(new CustomEvent('theme-change'))
    }, theme)
    for (const width of [1440, 820, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await expect(linkCard).toHaveCSS('display', 'flex')
      await expect(linkCard).toHaveCSS('padding', '16px 20px')
      await expect(linkCard).toHaveCSS('border-radius', '8px')
      await expect(linkCard).toHaveCSS('border-color', theme === 'dark' ? 'rgb(46, 46, 50)' : 'rgb(226, 226, 227)')
      await expect(linkCard).toHaveCSS('transition-property', 'border-color, box-shadow, background-color')
      await expect(linkCard.locator('.link')).toHaveCSS('font-size', '18px')
      await expect(linkCard.locator('.link')).toHaveCSS('font-weight', '700')
      await expect(linkCard.locator('.link')).toHaveCSS('transition-property', 'color')
      await expect(linkCard.locator('.vpi-arrow-right')).toHaveCSS('margin-top', '2px')

      await expect(card).toHaveCSS('padding', '16px 20px')
      await expect(card).toHaveCSS('gap', '16px')
      await expect(card).toHaveCSS('border-radius', '8px')
      await expect(card).toHaveCSS('border-color', theme === 'dark' ? 'rgb(46, 46, 50)' : 'rgb(226, 226, 227)')
      await expect(card).toHaveCSS('transition-property', 'border-color, box-shadow')
      await expect(card.locator(':scope > .title')).toHaveCSS('font-weight', '700')
      await expect(card.locator(':scope > .title')).toHaveCSS('transition-property', 'color')

      await expect(badge).toHaveCSS('padding', '0px 8px')
      await expect(badge).toHaveCSS('border-radius', '12px')
      await expect(badge).toHaveCSS('font-size', '12px')
      await expect(badge).toHaveCSS('line-height', '22px')
      await expect(badge).toHaveCSS('transition-property', 'color, background-color, border-color')

      await expect(imageCard).toHaveCSS('max-width', '100%')
      expect(await imageCard.evaluate(element => {
        const style = getComputedStyle(element)
        return style.marginTop === '16px' && style.marginBottom === '16px' && style.marginLeft === style.marginRight
      })).toBe(true)
      await expect(imageCard).toHaveCSS('border-radius', '8px')
      await expect(imageCard).toHaveCSS('transition-property', 'box-shadow')
      await expect(imageCard.locator('.image-container')).toHaveCSS('position', 'relative')
      await expect(imageCard.locator('.image-container')).toHaveCSS('overflow', 'hidden')
      await expect(imageCard.locator('.image-info')).toHaveCSS('position', 'absolute')
      await expect(imageCard.locator('.image-info')).toHaveCSS('transition-property', 'transform')

      const columns = width >= 960 ? 3 : width >= 640 ? 2 : 1
      await expect(masonry).toHaveClass(new RegExp(`\\bcols-${columns}\\b`))
      await expect(masonry).toHaveCSS('display', 'grid')
      await expect(masonry).toHaveCSS('gap', '16px')
      expect(await masonry.evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(columns)
      await expect(masonry.locator(':scope > .card-masonry-item')).toHaveCount(columns)
    }
  }

  await imageCard.locator('.image-info').hover()
  await expect(imageCard.locator('.image-info')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)')
})

test('chat and code demos keep the frozen responsive light and dark matrix', async ({ page }) => {
  for (const theme of ['light', 'dark'] as const) {
    for (const width of [1440, 820, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
      await page.evaluate(value => {
        document.documentElement.dataset.theme = value
        document.documentElement.classList.toggle('dark', value === 'dark')
        document.dispatchEvent(new CustomEvent('theme-change'))
      }, theme)

      const chat = page.locator('.vp-chat')
      await expect(chat).toHaveCSS('width', width >= 960 ? '480px' : width >= 768 ? '360px' : '342px')
      await expect(chat).toHaveCSS('border-radius', '6px')
      await expect(chat).toHaveCSS('background-color', theme === 'dark' ? 'rgb(32, 33, 39)' : 'rgb(246, 246, 247)')
      await expect(chat).toHaveCSS('transition-property', 'background-color')
      await expect(chat.locator('.vp-chat-header')).toHaveCSS('height', '44px')
      await expect(chat.locator('.vp-chat-content')).toHaveCSS('padding', '0px 16px 24px')
      await expect(chat.locator('.vp-chat-message:not(.self)').first().locator('.vp-chat-message-body')).toHaveCSS('padding-right', '32px')
      await expect(chat.locator('.vp-chat-message.self .vp-chat-message-body')).toHaveCSS('padding-left', '32px')
      await expect(chat.locator('.message-content').first()).toHaveCSS('padding', '8px 16px')
      await expect(chat.locator('.message-content').first()).toHaveCSS('border-radius', '6px')

      const demo = page.locator('.vp-demo-wrapper').first()
      await expect(demo).toHaveCSS('border-radius', '8px')
      await expect(demo).toHaveCSS('border-color', theme === 'dark' ? 'rgb(46, 46, 50)' : 'rgb(226, 226, 227)')
      await expect(demo).toHaveCSS('transition-property', 'border-color')
      await expect(demo.locator('.demo-draw')).toHaveCSS('padding', '24px')
      await expect(demo.locator('.demo-ctrl')).toHaveCSS('padding', '8px 24px')
      await expect(demo.locator('.demo-ctrl')).toHaveCSS('gap', '16px')
      await expect(demo.locator('.demo-ctrl')).toHaveCSS('border-top-style', 'dotted')
      await expect(demo.locator('.demo-ctrl')).toHaveCSS('transition-property', 'border-color')
      const toggle = demo.locator('[aria-label="Toggle Code"]')
      await expect(toggle.locator('.vpi-demo-code')).toHaveCSS('width', '20px')
      await expect(toggle.locator('.vpi-demo-code')).toHaveCSS('height', '20px')
    }
  }
})

test('collapse, tabs, and file tree keep the frozen color transitions', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/blog/markdown-showcase/', { waitUntil: 'domcontentloaded' })

  await expect(page.locator('.vp-collapse-title').first()).toHaveCSS('transition-property', 'color')
  await expect(page.locator('.vp-collapse-item').first()).toHaveCSS('padding-top', '16px')
  const collapseChevron = page.locator('.vp-collapse-header').first()
  expect(await collapseChevron.evaluate(element => {
    const style = getComputedStyle(element, '::after')
    return [style.borderRightWidth, style.borderRightStyle, style.borderBottomWidth, style.borderBottomStyle]
  })).toEqual(['0px', 'none', '0px', 'none'])

  const tabs = page.locator('.vp-tabs').first()
  await expect(tabs).toHaveCSS('transition-property', 'border')
  await expect(tabs.locator('.vp-tabs-nav')).toHaveCSS('transition-property', 'background-color, box-shadow')
  await expect(tabs.locator('.vp-tab-nav').first()).toHaveCSS('transition-property', 'color')
  expect(await tabs.locator('.vp-tab-nav').first().evaluate(element => getComputedStyle(element, '::after').transitionProperty)).toBe('background')

  const codeTabs = page.locator('.vp-code-tabs').first()
  await expect(codeTabs.locator('.vp-code-tabs-nav')).toHaveCSS('transition-property', 'background-color, box-shadow')
  await expect(codeTabs.locator('.vp-code-tab-nav').first()).toHaveCSS('transition-property', 'color')
  expect(await codeTabs.locator('.vp-code-tab-nav').first().evaluate(element => getComputedStyle(element, '::after').transitionProperty)).toBe('background')

  await page.goto('/docs/guide/configuration/', { waitUntil: 'domcontentloaded' })
  const tree = page.locator('.vp-file-tree').first()
  await expect(tree).toHaveCSS('margin', '0px')
  await expect(tree).toHaveCSS('transition-property', 'border, background-color')
  await expect(tree.locator('.vp-file-tree-title')).toHaveCSS('transition-property', 'color, border-color')
  const folder = tree.locator('.vp-file-tree-info.folder').first()
  expect(await folder.evaluate(element => getComputedStyle(element, '::before').transitionProperty)).toBe('color, transform')
  await expect(folder.locator('.name')).toHaveCSS('transition-property', 'color')
  await expect(tree.locator('.file-tree-icon').first()).toHaveCSS('flex', '0 1 auto')
})

test('chart integrations keep the frozen responsive geometry and theme colors', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  const chart = page.locator('[data-chartjs]')
  const echarts = page.locator('[data-echarts]')
  const flowchart = page.locator('[data-flowchart]')
  const markmap = page.locator('[data-markmap]')
  const plantuml = page.locator('img[alt="PlantUML Diagram"]')
  await expect(chart).toHaveAttribute('data-chart-ready', 'true')
  await expect(echarts).toHaveAttribute('data-chart-ready', 'true')
  await expect(flowchart).toHaveAttribute('data-flowchart-ready', 'true')
  await expect(markmap).toHaveAttribute('data-markmap-ready', 'true')

  for (const { width, scale, mobile } of [
    { width: 1440, scale: '1', mobile: false },
    { width: 820, scale: '0.9', mobile: false },
    { width: 390, scale: '0.8', mobile: true },
  ]) {
    await page.setViewportSize({ width, height: 900 })
    await expect.poll(() => flowchart.getAttribute('data-flowchart-scale')).toBe(scale)
    await expect(chart).toHaveCSS('transition-duration', '1s')
    await expect(chart).toHaveCSS('overflow-x', 'auto')
    await expect(chart).toHaveCSS('padding', mobile ? '9.6px 0px' : '9.6px 6.4px')
    await expect(chart).toHaveCSS('margin-left', mobile ? '-16px' : '0px')
    await expect(echarts).toHaveCSS('position', 'relative')
    await expect(echarts.locator('.echarts-container')).toHaveCSS('min-height', '360px')
    await expect(echarts).toHaveCSS('margin-left', mobile ? '-16px' : '0px')
    await expect(flowchart).toHaveCSS('direction', 'ltr')
    await expect(flowchart).toHaveCSS('padding', mobile ? '9.6px 0px' : '9.6px 6.4px')
    await expect(flowchart).toHaveCSS('margin-left', mobile ? '-24px' : '0px')
    await expect(markmap).toHaveCSS('position', 'relative')
    await expect(markmap).toHaveCSS('margin-left', mobile ? '-16px' : '0px')
    await expect(markmap.locator('.markmap-svg')).toHaveCSS('min-height', '360px')
    await expect(markmap.locator('.mm-toolbar')).toHaveCSS('right', '8px')
    await expect(markmap.locator('.mm-toolbar')).toHaveCSS('bottom', '8px')
    expect(await plantuml.evaluate(element => {
      const image = element.getBoundingClientRect()
      const article = element.closest('.vp-doc')!.getBoundingClientRect()
      return image.width <= article.width + 1 && image.right <= innerWidth + 1
    })).toBe(true)
  }

  const light = await markmap.locator('.mm-toolbar').evaluate(element => ({
    background: getComputedStyle(element).backgroundColor,
    color: getComputedStyle(element).color,
  }))
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'dark'
    document.documentElement.classList.add('dark')
    document.dispatchEvent(new CustomEvent('theme-change'))
  })
  const dark = await markmap.locator('.mm-toolbar').evaluate(element => ({
    background: getComputedStyle(element).backgroundColor,
    color: getComputedStyle(element).color,
  }))
  expect(dark).not.toEqual(light)
})

test('media embeds keep the frozen desktop, tablet, and mobile geometry', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  const youtube = page.locator('[data-video-embed].youtube')
  const bilibili = page.locator('[data-video-embed].bilibili')
  const acfun = page.locator('[data-video-embed].acfun')
  const pdf = page.locator('[data-pdf-viewer]')
  const reader = page.locator('[data-audio-reader]')
  const art = page.locator('[data-artplayer]').first().locator('.vp-artplayer')
  await expect(youtube).toHaveAttribute('data-video-ready', 'true')
  await expect(bilibili).toHaveAttribute('data-video-ready', 'true')
  await expect(acfun).toHaveAttribute('data-video-ready', 'true')
  await expect(pdf).toHaveAttribute('data-pdf-ready', 'true')
  await expect(reader).toHaveAttribute('data-audio-ready', 'true')
  await expect(page.locator('[data-artplayer]').first()).toHaveAttribute('data-artplayer-ready', 'true')

  for (const { width, rounded } of [
    { width: 1440, rounded: true },
    { width: 820, rounded: true },
    { width: 390, rounded: false },
  ]) {
    await page.setViewportSize({ width, height: 900 })
    await expect(youtube).toHaveCSS('margin-top', '16px')
    await expect(youtube).toHaveCSS('margin-bottom', '16px')
    await expect(youtube).toHaveCSS('border-width', '0px')
    await expect(youtube).toHaveCSS('border-radius', '5px')
    await expect(bilibili).toHaveCSS('height', '180px')
    await expect(pdf).toHaveCSS('height', '180px')
    await expect(pdf).toHaveCSS('border-radius', '4px')
    expect(await pdf.evaluate(element => Math.abs(element.querySelector<HTMLElement>('.pdf-viewer')!.getBoundingClientRect().width - element.getBoundingClientRect().width))).toBeLessThan(0.5)
    await expect(reader).toHaveCSS('display', 'inline-block')
    await expect(reader).toHaveCSS('cursor', 'pointer')
    expect(await reader.locator('.icon-audio').evaluate(element => Math.abs(Number.parseFloat(getComputedStyle(element).width) - 19.2))).toBeLessThan(0.02)
    expect(await reader.locator('.icon-audio').evaluate(element => Math.abs(Number.parseFloat(getComputedStyle(element).marginLeft) - 3.2))).toBeLessThan(0.02)
    await expect(art).toHaveCSS('margin-top', '16px')
    await expect(art).toHaveCSS('border-radius', rounded ? '8px' : '0px')
    await expect(art).toHaveCSS('box-shadow', rounded ? /rgba?\(/ : 'none')
    const geometry = await page.evaluate(() => {
      const youtube = document.querySelector<HTMLElement>('[data-video-embed].youtube')!.getBoundingClientRect()
      const acfun = document.querySelector<HTMLElement>('[data-video-embed].acfun')!.getBoundingClientRect()
      const art = document.querySelector<HTMLElement>('[data-artplayer] .vp-artplayer')!.getBoundingClientRect()
      return {
        youtubeRatio: youtube.width / youtube.height,
        acfunRatio: acfun.width / acfun.height,
        artRatio: art.width / art.height,
        fits: youtube.right <= innerWidth + 1 && acfun.right <= innerWidth + 1 && art.right <= innerWidth + 1,
      }
    })
    expect(Math.abs(geometry.youtubeRatio - 4 / 3)).toBeLessThan(0.02)
    expect(Math.abs(geometry.acfunRatio - 16 / 10)).toBeLessThan(0.02)
    expect(Math.abs(geometry.artRatio - 16 / 9)).toBeLessThan(0.02)
    expect(geometry.fits).toBe(true)
  }

  const normalColor = await reader.evaluate(element => getComputedStyle(element).color)
  await reader.hover()
  await expect(reader).not.toHaveCSS('color', normalColor)
})

test('code tree keeps the frozen responsive shell and code title bar', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/blog/markdown-showcase/', { waitUntil: 'domcontentloaded' })

  const tree = page.locator('.vp-code-tree').first()
  await expect(tree).toHaveCSS('display', 'grid')
  await expect(tree).toHaveCSS('grid-template-columns', /.+ .+ .+/)
  await expect(tree.locator('.code-tree-panel')).toHaveCSS('border-right-width', '1px')
  await expect(tree.locator('.code-tree-panel')).toHaveCSS('border-bottom-width', '0px')
  await expect(tree.locator('.code-tree-panel .vp-file-tree')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  await expect(tree.locator('.code-tree-panel .vp-file-tree')).toHaveCSS('border-top-width', '0px')
  await expect(tree.locator('.vp-file-tree-info').first()).toHaveAttribute('style', /--file-tree-level:-1/)
  await expect(tree.locator('.vp-file-tree-info.file.active')).toHaveCount(1)
  await expect(tree.locator('.code-block-title.active')).toHaveCSS('display', 'flex')
  await expect(tree.locator('.code-block-title:not(.active)').first()).toHaveCSS('display', 'none')

  const titleBar = tree.locator('.code-block-title.active .code-block-title-bar')
  await expect(titleBar).toHaveCSS('display', 'block')
  await expect(titleBar).toHaveCSS('padding', '8px 16px')
  await expect(titleBar).toHaveCSS('font-size', '14px')
  await expect(titleBar).toHaveCSS('font-weight', '500')
  await expect(titleBar).toHaveCSS('white-space', 'nowrap')
  await expect(titleBar).toHaveCSS('transition-property', 'background, color')
  await expect(titleBar.locator('.vp-icon')).toHaveCSS('width', '18px')
  await expect(titleBar.locator('.vp-icon')).toHaveCSS('height', '18px')

  await page.setViewportSize({ width: 820, height: 900 })
  await expect(tree).toHaveCSS('display', 'grid')
  await expect(tree.locator('.code-tree-panel')).toHaveCSS('border-right-width', '1px')

  await page.setViewportSize({ width: 390, height: 900 })
  await expect(tree).toHaveCSS('display', 'block')
  await expect(tree.locator('.code-tree-panel')).toHaveCSS('border-right-width', '0px')
  await expect(tree.locator('.code-tree-panel')).toHaveCSS('border-bottom-width', '1px')
  await expect(titleBar).toHaveCSS('margin-left', '-24px')
  await expect(titleBar).toHaveCSS('margin-right', '-24px')
})

test('hidden Plot text keeps the frozen responsive states and transitions', async ({ page }) => {
  for (const width of [1440, 820, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
    const mask = page.locator('.vp-plot').nth(0)
    const blur = page.locator('.vp-plot').nth(1)
    await expect(mask).toHaveClass(width <= 768 ? /\bclick\b/ : /\bhover\b/)
    await expect(mask).toHaveClass(/\bmask\b/)
    await expect(mask).toHaveCSS('padding', '0px 2px')
    await expect(mask).toHaveCSS('color', 'rgba(0, 0, 0, 0)')
    await expect(mask).toHaveCSS('background-color', 'rgb(60, 60, 67)')
    await expect(mask).toHaveCSS('transition-property', 'color, background-color')
    await expect(blur).toHaveCSS('filter', 'blur(3.2px)')
    await expect(blur).toHaveCSS('transition-property', 'filter')
    if (width <= 768) await mask.click()
    else await expectHoveredCss(mask, 'color', 'rgb(255, 255, 255)')
    if (width <= 768) await expect(mask).toHaveCSS('color', 'rgb(255, 255, 255)')
  }
})

test('field, timeline, steps, flex, and window keep frozen responsive styles', async ({ page }) => {
  for (const width of [1440, 820, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/blog/markdown-showcase/', { waitUntil: 'domcontentloaded' })
    const timeline = page.locator('.vp-timeline')
    const item = timeline.locator('.vp-timeline-item').first()
    await expect(timeline).toHaveCSS('margin', '32px 0px')
    await expect(timeline.locator('.vp-timeline-box')).toHaveCSS('row-gap', '24px')
    await expect(timeline.locator('.vp-timeline-box')).toHaveCSS('column-gap', '36px')
    await expect(item).toHaveCSS(width <= 639 ? 'padding-left' : 'padding-right', '36px')
    await expect(item.locator('.vp-timeline-point')).toHaveCSS('width', '24px')
    await expect(item.locator('.vp-timeline-point')).toHaveCSS('height', '24px')
    await expect(page.locator('.vp-steps')).toHaveCSS('margin', '16px 0px')
    await expect(page.locator('.window-wrapper')).toHaveCSS('border-radius', '8px')
    await expect(page.locator('.window-wrapper .window-content')).toHaveCSS('height', '180px')
  }

  await page.goto('/docs/guide/configuration/', { waitUntil: 'domcontentloaded' })
  const fieldGroup = page.locator('.vp-field-group')
  const field = fieldGroup.locator('.vp-field').first()
  await expect(fieldGroup).toHaveCSS('padding-left', '20px')
  await expect(fieldGroup).toHaveCSS('border-radius', '6px')
  await expect(field).toHaveCSS('margin', '16px 0px')
  await expect(field.locator('.field-meta')).toHaveCSS('display', 'flex')
})

test('QR codes and NPM badges keep frozen responsive styles', async ({ page }) => {
  for (const width of [1440, 820, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/blog/markdown-showcase/', { waitUntil: 'domcontentloaded' })
    const qr = page.locator('.vp-qrcode').first()
    const image = qr.locator('.qrcode-img')
    await expect(qr).toHaveCSS('margin', '16px 0px')
    await expect(qr).toHaveCSS('border-radius', '8px')
    await expect(qr).toHaveCSS('padding', '16px 20px')
    await expect(qr).toHaveCSS('flex-direction', width >= 960 ? 'row' : 'column')
    await expect(image).toHaveCSS('width', width >= 768 ? '150px' : '128px')
    await expect(image).toHaveCSS('aspect-ratio', '1 / 1')

    const group = page.locator('.vp-npm-badge-group').first()
    await expect(group).toHaveCSS('display', 'flex')
    await expect(group).toHaveCSS('flex-wrap', 'wrap')
    await expect(group).toHaveCSS('gap', '8px')
    await expect(group.locator('.vp-npm-badge').first()).toHaveCSS('display', 'flex')
    await expect(group.locator('.vp-npm-badge a').first()).toHaveCSS('text-decoration-line', 'none')
  }
})

test('RepoCard and Swiper keep frozen responsive component styles', async ({ page }) => {
  await page.route('https://api.pengzhanbo.cn/github/repo/pengzhanbo/vuepress-theme-plume', route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({
      name: 'vuepress-theme-plume', fullName: 'pengzhanbo/vuepress-theme-plume', description: 'Theme',
      url: 'https://github.com/pengzhanbo/vuepress-theme-plume', stars: 1800, forks: 120,
      language: 'TypeScript', languageColor: '#3178c6', archived: false, visibility: 'Public',
      template: false, ownerType: 'User', license: { name: 'MIT' },
    }),
  }))
  for (const width of [1440, 820, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
    const card = page.locator('.vp-repo-card')
    await expect(card).toBeVisible()
    await expect(card).toHaveCSS('display', 'flex')
    await expect(card).toHaveCSS('flex-direction', 'column')
    await expect(card).toHaveCSS('gap', '8px')
    await expect(card).toHaveCSS('padding', '16px 20px')
    await expect(card).toHaveCSS('margin', '16px 0px')
    await expect(card).toHaveCSS('border-radius', '8px')
    await expect(card.locator('.repo-name')).toHaveCSS('font-size', '14px')
    await expect(card.locator('.repo-name a')).toHaveCSS('font-weight', '600')
    await expect(card.locator('.repo-desc')).toHaveCSS('font-size', '12px')
    await expect(card.locator('.repo-desc')).toHaveCSS('line-height', '18px')
    await expect(card.locator('.repo-info')).toHaveCSS('row-gap', '8px')
    await expect(card.locator('.repo-info')).toHaveCSS('column-gap', '14px')
    await expect(card.locator('.vpi-github-repo')).toHaveCSS('transition-property', 'color')

    const swiper = page.locator('.vp-swiper')
    await expect(swiper).toHaveCSS('margin', '24px 0px')
    await expect(swiper).toHaveCSS('height', '240px')
    await expect(swiper.locator('.swiper-slide-img').first()).toHaveCSS('object-fit', 'cover')
    await expect(swiper.locator('.swiper-slide-img').first()).toHaveCSS('cursor', 'default')
    await expect(swiper.locator('.swiper-pagination-bullet').first()).toHaveCSS('width', '12px')
    await expect(swiper.locator('.swiper-pagination-bullet').first()).toHaveCSS('height', '12px')
    expect(await swiper.evaluate(element => element.getBoundingClientRect().right <= innerWidth)).toBe(true)
  }
})

test('KaTeX and Twoslash keep frozen responsive styles and reduced motion', async ({ page }) => {
  for (const width of [1440, 820, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
    const math = page.locator('.katex').first()
    const display = page.locator('.katex-display')
    await expect(math).toHaveCSS('direction', 'ltr')
    await expect(display).toHaveCSS('overflow-x', 'auto')
    await expect(display).toHaveCSS('overflow-y', 'hidden')
    await expect(display).toHaveCSS('scrollbar-width', 'thin')

    const twoslash = page.locator('pre.twoslash')
    const hover = twoslash.locator('.twoslash-hover:not(.twoslash-query-persisted)').first()
    const popup = hover.locator('.twoslash-popup-container')
    await expect(twoslash).toHaveCSS('position', 'relative')
    expect(await twoslash.evaluate(element => element.getBoundingClientRect().height)).toBeLessThan(120)
    await expect(hover).toHaveCSS('display', 'inline-block')
    await expect(hover).toHaveCSS('position', 'relative')
    await expect(hover).toHaveCSS('border-bottom-style', 'dotted')
    await expect(popup).toHaveCSS('position', 'absolute')
    await expect(popup).toHaveCSS('display', 'block')
    await expect(popup).toHaveCSS('border-width', '1px')
    await expect(popup).toHaveCSS('border-radius', '6px')
    await expect(popup).toHaveCSS('color', 'rgb(60, 60, 67)')
    await expect(popup).toHaveCSS('box-shadow', 'rgba(0, 0, 0, 0.1) 0px 6px 30px 0px')
    await expect(popup).toHaveCSS('z-index', '10')
    await expect(popup).toHaveCSS('opacity', '0')
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('pre.twoslash .twoslash-hover').first()).toHaveCSS('transition-duration', '0s')
})

test('included code and npm-to reuse the frozen responsive code shells', async ({ page }) => {
  for (const width of [1440, 820, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/blog/markdown-showcase/', { waitUntil: 'domcontentloaded' })
    const imported = page.locator('#文件引入与代码导入').locator('xpath=following-sibling::div[contains(@class,"language-javascript")][1]')
    const npmTo = page.locator('.vp-code-tabs[data-tab-id="npm-to-pnpm-yarn-npm"]')
    const nav = npmTo.locator('.vp-code-tabs-nav')
    await expect(imported).toHaveCSS('position', 'relative')
    await expect(nav).toHaveCSS('transition-property', 'background-color, box-shadow')
    await expect(nav).toHaveCSS('border-radius', width < 640 ? '0px' : '6px 6px 0px 0px')
    await expect(nav).toHaveCSS('margin-left', width < 640 ? '-24px' : '0px')
    expect(await npmTo.evaluate(element => element.getBoundingClientRect().right <= innerWidth)).toBe(true)
  }
})

test('Shiki code blocks keep the frozen responsive light and dark shell', async ({ page }) => {
  const backgrounds = { light: 'rgb(246, 248, 250)', dark: 'rgb(32, 33, 39)' }
  for (const theme of ['light', 'dark'] as const) {
    for (const width of [1440, 820, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
      await page.evaluate(value => localStorage.setItem('vuepress-theme-appearance', value), theme)
      await page.reload({ waitUntil: 'domcontentloaded' })
      const block = page.locator('.code-block-title[data-title="site.config.mjs"] > .language-ts')
      await expect(block).toHaveCSS('margin', width === 390 ? '16px -24px' : '16px 0px')
      await expect(block).toHaveCSS('border-radius', width === 390 ? '0px 0px 6px 6px' : '0px 0px 8px 8px')
      await expect(block).toHaveCSS('background-color', backgrounds[theme])
      await expect(block).toHaveCSS('overflow-y', 'hidden')
      await expect(block.locator('pre')).toHaveCSS('overflow-x', 'auto')
      await expect(block.locator('pre')).toHaveCSS('scrollbar-width', 'thin')
      await expect.poll(() => block.locator('pre').evaluate(element => getComputedStyle(element, '::-webkit-scrollbar').height)).toBe('8px')
      await expect.poll(() => block.locator('pre').evaluate(element => getComputedStyle(element, '::-webkit-scrollbar-thumb').borderRadius)).toBe('999px')
      await expect.poll(() => block.locator('pre').evaluate(element => getComputedStyle(element, '::-webkit-scrollbar-button').display)).toBe('none')
      await expect(block.locator('code')).toHaveCSS('padding', '0px 24px')
      await expect(block.locator('code')).toHaveCSS('font-size', '14px')
      await expect(block.locator('code')).toHaveCSS('line-height', '23.8px')
      await expect(block.locator('.indent').first()).toHaveCSS('display', 'inline-block')
      expect(Math.round((await block.boundingBox())!.width)).toBe(width === 1440 ? 784 : width === 820 ? 756 : 390)
    }
  }
})

test('code and table copy controls keep the frozen responsive light and dark matrix', async ({ page }) => {
  const colors = { light: 'rgba(60, 60, 67, 0.56)', dark: 'rgba(235, 235, 245, 0.38)' }
  for (const theme of ['light', 'dark'] as const) {
    for (const width of [1440, 820, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
      await page.evaluate(value => localStorage.setItem('vuepress-theme-appearance', value), theme)
      await page.reload({ waitUntil: 'domcontentloaded' })

      const block = page.locator('.code-block-title[data-title="site.config.mjs"] > .language-ts')
      const copy = block.locator(':scope > .vp-copy-code-button')
      if (width === 390) await expect(copy).toBeHidden()
      else {
        await block.hover()
        await expect(copy).toBeVisible()
        await expect(copy).toHaveCSS('width', '40px')
        await expect(copy).toHaveCSS('height', '40px')
        await expect(copy).toHaveCSS('border-radius', '8px')
        await expect(copy).toHaveCSS('opacity', '1')
        await expect(copy).toHaveCSS('transition-property', 'opacity, background-color')
      }

      const toolbar = page.locator('.vp-table .table-toolbar')
      const tableButton = toolbar.locator('button').first()
      await expect(toolbar).toHaveCSS('display', 'flex')
      await expect(toolbar).toHaveCSS('gap', '8px')
      await expect(toolbar).toHaveCSS('justify-content', 'flex-end')
      await expect(tableButton).toHaveCSS('display', 'flex')
      await expect(tableButton).toHaveCSS('gap', '4px')
      await expect(tableButton).toHaveCSS('height', '24px')
      await expect(tableButton).toHaveCSS('padding', '0px')
      await expect(tableButton).toHaveCSS('border-width', '0px')
      await expect(tableButton).toHaveCSS('font-size', '14px')
      await expect(tableButton).toHaveCSS('color', colors[theme])
    }
  }

  await page.setViewportSize({ width: 1100, height: 800 })
  await page.goto('/blog/content-guide/', { waitUntil: 'domcontentloaded' })
  const yaml = page.locator('.vp-doc .language-yaml').first()
  await expect(yaml.locator('button')).toHaveCount(1)
  await expect(yaml.locator('.code-copy')).toHaveCount(0)
  await expect.poll(() => yaml.evaluate(element => getComputedStyle(element, '::before').display)).toBe('block')
  await yaml.hover()
  const yamlCopy = yaml.locator(':scope > .vp-copy-code-button')
  await expect(yamlCopy).toHaveCSS('opacity', '1')
  await expect.poll(() => yamlCopy.evaluate(element => getComputedStyle(element, '::before').maskSize)).toBe('13.3333px')
  await expect.poll(() => yaml.evaluate(element => getComputedStyle(element, '::before').display)).toBe('block')
})

test('code embeds and REPL keep the frozen desktop, tablet, and mobile light/dark matrix', async ({ page }) => {
  await page.route(/https:\/\/(?:codepen\.io|jsfiddle\.net|codesandbox\.io|replit\.com)\//, route => route.abort())
  await page.route('https://api.pengzhanbo.cn/repl/golang/run', route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ version: '1.26', events: [{ kind: 'stdout', message: 'matrix-go\n', delay: 0 }] }),
  }))
  const colors = {
    light: { text: 'rgb(60, 60, 67)', muted: 'rgba(60, 60, 67, 0.56)', code: 'rgb(246, 248, 250)', divider: 'rgb(226, 226, 227)' },
    dark: { text: 'rgba(255, 255, 245, 0.86)', muted: 'rgba(235, 235, 245, 0.38)', code: 'rgb(32, 33, 39)', divider: 'rgb(46, 46, 50)' },
  }
  for (const theme of ['light', 'dark'] as const) {
    for (const width of [1440, 820, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
      await page.evaluate(value => localStorage.setItem('vuepress-theme-appearance', value), theme)
      await page.reload({ waitUntil: 'domcontentloaded' })

      for (const iframe of await page.locator('.code-pen-iframe,.js-fiddle-iframe,.code-sandbox-iframe,.replit-iframe-wrapper').all()) {
        await expect(iframe).toHaveCSS('height', '180px')
        await expect(iframe).toHaveCSS('border-left-width', '0px')
        expect(Math.round((await iframe.boundingBox())!.width)).toBe(width === 1440 ? 784 : width === 820 ? 756 : 342)
      }
      await expect(page.locator('.code-pen-iframe')).not.toHaveCSS('box-shadow', 'none')
      await expect(page.locator('.js-fiddle-iframe')).toHaveCSS('margin', '16px 0px')
      await expect(page.locator('.code-sandbox-iframe')).toHaveCSS('border-radius', '4px')
      await expect(page.locator('.replit-iframe-wrapper')).toHaveCSS('border-top-color', colors[theme].divider)
      await expect(page.locator('.replit-iframe-wrapper')).toHaveCSS('border-radius', '0px 0px 8px 8px')
      await expect(page.locator('.code-sandbox-link svg')).toHaveCSS('width', '165px')
      await expect(page.locator('.code-sandbox-link svg')).toHaveCSS('height', '32px')

      const repl = page.locator('[data-code-repl]').first()
      const title = repl.locator('.code-repl-title')
      const code = repl.locator('div[class*="language-"]')
      const run = repl.locator('.icon-run')
      await expect(title).toHaveCSS('height', '49px')
      await expect(title).toHaveCSS('margin', width === 390 ? '0px -24px' : '0px')
      await expect(title).toHaveCSS('border-radius', width === 390 ? '0px' : '6px 6px 0px 0px')
      await expect(title).toHaveCSS('background-color', colors[theme].code)
      await expect(title).toHaveCSS('transition-property', 'background, border')
      await expect(title.locator('h4')).toHaveCSS('font-size', '14px')
      await expect(title.locator('h4')).toHaveCSS('line-height', '48px')
      await expect(title.locator('h4')).toHaveCSS('color', colors[theme].text)
      await expect(title.locator('h4')).toHaveCSS('transition-property', 'color')
      await expect(run).toHaveCSS('width', '24px')
      await expect(run).toHaveCSS('height', '24px')
      await expect(run).toHaveCSS('font-size', '12px')
      await expect(run).toHaveCSS('color', colors[theme].muted)
      await expect(run).toHaveCSS('border-radius', '50%')
      await expect(run).toHaveCSS('transition-property', 'color, border')
      await expect(code).toHaveCSS('margin', width === 390 ? '0px -24px' : '0px')
      await expect(code).toHaveCSS('border-radius', width === 390 ? '0px 0px 6px 6px' : '0px 0px 8px 8px')

      await run.click()
      const output = repl.locator('.code-repl-output')
      await expect(output).toBeVisible()
      await expect(output.locator('.output-content')).toContainText('matrix-go')
      await expect(output).toHaveCSS('margin', width === 390 ? '0px -24px' : '0px')
      await expect(output).toHaveCSS('border-radius', width === 390 ? '0px' : '0px 0px 6px 6px')
      await expect(output).toHaveCSS('background-color', colors[theme].code)
      await expect(output).toHaveCSS('transition-property', 'background-color')
      await expect(output.locator('.output-head')).toHaveCSS('height', '34px')
      await expect(output.locator('.output-head')).toHaveCSS('padding', '4px 10px 4px 20px')
      await expect(output.locator('.output-head')).toHaveCSS('transition-property', 'border-color')
      await expect(output.locator('.icon-close')).toHaveCSS('width', '20px')
      await expect(output.locator('.icon-close')).toHaveCSS('height', '20px')
      await expect(output.locator('.icon-close')).toHaveCSS('color', colors[theme].muted)
      await expect(output.locator('.icon-close')).toHaveCSS('transition-property', 'color')
      await expect(output.locator('.output-content')).toHaveCSS('padding', '12px 20px 24px')
      expect(Math.round((await output.boundingBox())!.width)).toBe(width === 1440 ? 784 : width === 820 ? 756 : 390)
    }
  }
})

test('hint containers keep the frozen responsive light and dark shell', async ({ page }) => {
  const colors = {
    light: { text: 'rgb(60, 60, 67)', warning: 'rgba(234, 179, 8, 0.14)' },
    dark: { text: 'rgba(255, 255, 245, 0.86)', warning: 'rgba(234, 179, 8, 0.16)' },
  }
  for (const theme of ['light', 'dark'] as const) {
    for (const width of [1440, 820, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
      await page.evaluate(value => localStorage.setItem('vuepress-theme-appearance', value), theme)
      await page.reload({ waitUntil: 'domcontentloaded' })
      const hint = page.locator('.hint-container.warning')
      await expect(hint).toHaveCSS('padding', '16px 16px 8px')
      await expect(hint).toHaveCSS('margin', width === 390 ? '16px -16px' : '16px 0px')
      await expect(hint).toHaveCSS('font-size', '14px')
      await expect(hint).toHaveCSS('line-height', '24px')
      await expect(hint).toHaveCSS('color', colors[theme].text)
      await expect(hint).toHaveCSS('background-color', colors[theme].warning)
      await expect(hint).toHaveCSS('border', '1px solid rgba(0, 0, 0, 0)')
      await expect(hint).toHaveCSS('border-radius', '8px')
      await expect(hint.locator(':scope > .hint-container-title')).toHaveCSS('font-weight', '600')
      expect(await hint.evaluate(element => element.getBoundingClientRect().right <= innerWidth)).toBe(true)
    }
  }
})

test('Obsidian assets and embedded paths keep their rendered responsive geometry', async ({ page }) => {
  for (const width of [1440, 820, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
    await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
    const image = page.locator('.vp-doc img[src="/img/logo.svg"][style*="width:48px"]')
    await expect(image).toBeVisible()
    await expect(image).toHaveCSS('width', '48px')
    await expect(image).toHaveCSS('height', '48px')
    await expect.poll(() => image.evaluate(element => ({ complete: (element as HTMLImageElement).complete, path: new URL((element as HTMLImageElement).src).pathname }))).toEqual({ complete: true, path: '/img/logo.svg' })
    await expect(page.locator('.vp-doc')).toContainText('对内容区域执行与 Plume 一致的')
    await expect(page.locator('.vp-doc a[href="/docs/guide/configuration/"]').filter({ hasText: '查看站点配置' })).toBeVisible()
    expect(await image.evaluate(element => element.getBoundingClientRect().right <= innerWidth)).toBe(true)
  }
})

test('Iconify, IconFont, and Font Awesome keep frozen provider geometry', async ({ page }) => {
  for (const width of [1440, 820, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/blog/markdown-showcase/', { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'light'
      document.documentElement.classList.remove('dark')
    })
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    const matrix = page.locator('.icon-provider-matrix')
    const iconify = matrix.locator('#provider-iconify')
    const iconfont = matrix.locator('#provider-iconfont')
    const fontawesome = matrix.locator('#provider-fontawesome')
    const component = matrix.locator('#provider-component')
    await expect(matrix.locator('[data-provider]')).toHaveCount(4)
    await expect(iconify).toHaveCSS('width', '24px')
    await expect(iconify).toHaveCSS('height', '16px')
    await expect(iconify).toHaveCSS('color', 'rgb(188, 82, 238)')
    await expect(iconfont).toHaveCSS('font-size', '24px')
    await expect(iconfont).toHaveCSS('width', '24px')
    await expect(iconfont).toHaveCSS('height', '24px')
    await expect(iconfont).toHaveCSS('color', 'rgb(46, 125, 50)')
    await expect(fontawesome).toHaveClass(/fa-solid/)
    await expect(fontawesome).toHaveClass(/fa-border/)
    await expect(fontawesome).toHaveCSS('width', '24px')
    await expect(fontawesome).toHaveCSS('height', '16px')
    await expect(fontawesome).toHaveCSS('color', 'rgb(198, 40, 40)')
    await expect(component).toHaveClass(/fa-duotone/)
    await expect(component).toHaveClass(/fa-2xl/)
    await expect(component).toHaveCSS('width', '24px')
    await expect(component).toHaveCSS('height', '16px')
    await expect(component).toHaveCSS('color', 'rgb(21, 101, 192)')
    for (const icon of [iconify, iconfont, fontawesome, component]) {
      await expect(icon).toHaveCSS('display', 'inline-block')
      await expect(icon).toHaveCSS('vertical-align', 'middle')
      expect(await icon.evaluate(element => element.getBoundingClientRect().right <= innerWidth)).toBe(true)
    }
    expect(await fontawesome.evaluate(element => getComputedStyle(element).lineHeight === getComputedStyle(element.parentElement!).lineHeight)).toBe(true)
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'dark'
      document.documentElement.classList.add('dark')
      document.dispatchEvent(new CustomEvent('theme-change'))
    })
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(iconify).toHaveCSS('color', 'rgb(188, 82, 238)')
    await expect(iconfont).toHaveCSS('color', 'rgb(46, 125, 50)')
    await expect(fontawesome).toHaveCSS('color', 'rgb(198, 40, 40)')
    await expect(component).toHaveCSS('color', 'rgb(21, 101, 192)')
  }
})

test('forced-dark home paints the root and body backgrounds', async ({ page }) => {
  await page.goto('/hero/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveClass(/\bforce-dark\b/)
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(27, 27, 31)')
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(27, 27, 31)')
})

test('custom home props keep the desktop, tablet, and mobile light/dark matrix', async ({ page }) => {
  test.setTimeout(120_000)
  const colors = {
    light: { feature: 'rgb(246, 246, 247)', text: 'rgb(60, 60, 67)' },
    dark: { feature: 'rgb(32, 33, 39)', text: 'rgba(255, 255, 245, 0.86)' },
  }
  for (const theme of ['light', 'dark'] as const) {
    for (const width of [1440, 820, 390]) {
      const height = width === 390 ? 844 : 900
      await page.setViewportSize({ width, height })
      await page.goto('/landing/', { waitUntil: 'domcontentloaded' })
      await page.evaluate(value => localStorage.setItem('vuepress-theme-appearance', value), theme)
      await page.reload({ waitUntil: 'domcontentloaded' })
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)

      const box = page.locator('.vp-home-box').first()
      await expect(box).toHaveCSS('padding', width >= 960 ? '48px' : width >= 640 ? '32px 48px' : '24px')
      await expect(page.locator('.vp-home-doc-hero .doc-hero-container')).toHaveCSS('flex-direction', width >= 960 ? 'row' : 'column')
      await expect(page.locator('.vp-home-doc-hero .name')).toHaveCSS('font-size', width >= 960 ? '56px' : width >= 640 ? '48px' : '32px')

      const imageHero = page.locator('.vp-home-hero')
      await expect(imageHero.locator('.hero-name')).toHaveCSS('font-size', width >= 960 ? '72px' : width >= 768 ? '64px' : '48px')
      await expect(imageHero.locator('.home-hero-bg')).toHaveCSS('background-attachment', 'fixed')
      await expect(imageHero.locator('.home-hero-bg')).toHaveCSS('filter', 'opacity(0.14) blur(1px)')
      await expect(imageHero.locator('.home-hero-bg')).not.toHaveCSS('background-image', 'none')

      const features = page.locator('.vp-home-feature')
      await expect(features).toHaveCount(3)
      await expect(features.first()).toHaveCSS('background-color', colors[theme].feature)
      await expect(features.first().locator('.details')).toHaveCSS('color', theme === 'dark' ? 'rgba(235, 235, 245, 0.6)' : 'rgba(60, 60, 67, 0.78)')
      const itemWidths = await page.locator('.vp-home-features .item').evaluateAll(items => items.map(item => item.getBoundingClientRect().width))
      expect(Math.max(...itemWidths) - Math.min(...itemWidths)).toBeLessThan(1)
      expect(itemWidths[0]).toBeGreaterThan(width >= 768 ? 200 : 300)

      const textImages = page.locator('.vp-home-text-image')
      await expect(textImages).toHaveCount(2)
      await expect(textImages.nth(0).locator('.container')).toHaveCSS('flex-direction', width >= 960 ? 'row' : 'column')
      await expect(textImages.nth(1).locator('.container')).toHaveCSS('flex-direction', width >= 960 ? 'row-reverse' : 'column')
      await expect(textImages.nth(0).locator('.content-image .vp-image')).toHaveCSS('max-width', '210px')
      await expect(textImages.nth(1).locator('.content-image .vp-image').first()).toHaveCSS('max-width', '192px')
      await expect(textImages.nth(1)).toHaveCSS('background-attachment', theme === 'dark' ? 'local' : 'scroll')
      if (theme === 'dark') await expect(textImages.nth(1)).not.toHaveCSS('background-image', 'none')
      else await expect(textImages.nth(1)).toHaveCSS('background-image', 'none')

      const profile = page.locator('.vp-home-profile')
      await expect(profile.locator('img')).toHaveCSS('width', width >= 960 ? '96px' : '64px')
      await expect(profile.locator('h3')).toHaveCSS('color', colors[theme].text)
      await expect(page.locator('.vp-home-custom .vp-doc')).toContainText('custom 区域会渲染首页 Markdown 正文')

      await page.goto('/banner/', { waitUntil: 'domcontentloaded' })
      await page.evaluate(value => localStorage.setItem('vuepress-theme-appearance', value), theme)
      await page.reload({ waitUntil: 'domcontentloaded' })
      await expect(page.locator('.vp-layout')).toHaveClass(/\bfooter-no-border\b/)
      const banner = page.locator('.vp-home-banner')
      await expect(banner).toHaveCSS('min-height', `${height - 64}px`)
      await expect(banner).not.toHaveCSS('background-image', 'none')
      await expect(banner.locator('.banner-mask')).toHaveCSS('opacity', theme === 'dark' ? '0.65' : '0.15')
      await expect(banner.locator('.hero-name')).toHaveCSS('font-size', width >= 960 ? '100px' : '72px')
      await expect(banner.locator('.hero-tagline')).toHaveCSS('font-size', width >= 1440 ? '32px' : '24px')
      await expect(banner.locator('.vp-button')).toHaveCount(2)
      await expect(page.locator('.vp-footer')).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)')
      await expect(page.locator('.vp-footer')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
      await expect(page.locator('.vp-back-to-top')).toHaveCount(1)
      await expect(page.locator('.vp-back-to-top')).toBeHidden()
    }
  }

  await page.setViewportSize({ width: 820, height: 900 })
  await page.goto('/single-hero/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.vp-home-hero')).toHaveClass(/\bonce\b/)
  await expect(page.locator('.vp-sign-down')).toHaveCount(0)
  await expect(page.locator('.vp-back-to-top')).toHaveCount(1)
  await expect(page.locator('.vp-back-to-top')).toBeHidden()
  await expect.poll(() => page.evaluate(() => {
    const hero = document.querySelector('.vp-home-hero')!.getBoundingClientRect()
    const footer = document.querySelector('.vp-footer')!.getBoundingClientRect()
    const filter = document.querySelector('.bg-filter')!.getBoundingClientRect()
    return Math.abs(hero.height + footer.height - innerHeight) < 1 && Math.abs(filter.height - innerHeight) < 1
  }), { message: 'onlyOnce hero and TintPlate include the frozen footer height' }).toBe(true)

  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.vp-home > div > .vp-posts.home-posts')).toHaveCount(1)
  await expect(page.locator('.vp-layout')).toHaveClass(/\bfooter-no-border\b/)
  await expect(page.locator('.vp-back-to-top')).toHaveCount(0)
})

test('Astro home computed styles match the frozen rendered Plume reference', async ({ browser }) => {
  const frozenBase = process.env.FROZEN_PLUME_BASE_URL
  test.skip(!frozenBase, 'set FROZEN_PLUME_BASE_URL to the frozen dist server for the release-gate comparison')
  test.setTimeout(120_000)

  const context = await browser.newContext()
  const [frozen, targetHero, targetHome] = await Promise.all([context.newPage(), context.newPage(), context.newPage()])
  await Promise.all([
    frozen.goto(`${frozenBase}/`, { waitUntil: 'domcontentloaded' }),
    targetHero.goto('http://127.0.0.1:4321/hero/', { waitUntil: 'domcontentloaded' }),
    targetHome.goto('http://127.0.0.1:4321/landing/', { waitUntil: 'domcontentloaded' }),
  ])
  await Promise.all([
    frozen.locator('.vp-home-hero').waitFor(),
    targetHero.locator('.vp-home-hero').waitFor(),
    targetHome.locator('.vp-home-feature').first().waitFor(),
  ])
  await expect(frozen.locator('html')).toHaveClass(/\bforce-dark\b/)
  await expect(frozen.locator('html')).not.toHaveClass(/\bno-transition\b/)

  const forceTheme = (page: typeof frozen, theme: 'light' | 'dark') => page.evaluate(value => {
    const root = document.documentElement
    root.dataset.theme = value
    root.classList.toggle('dark', value === 'dark')
    root.classList.remove('force-dark')
    root.classList.add('no-transition')
    document.dispatchEvent(new CustomEvent('theme-change'))
  }, theme)
  const heroMatrix: Array<[string, string, string[]]> = [
    ['.vp-home-hero', '.vp-home-hero', ['position', 'width', 'height', 'margin-top']],
    ['.vp-home-hero .hero-container', '.vp-home-hero .hero-container', ['position', 'z-index', 'display', 'width', 'height', 'align-items', 'justify-content', 'padding-top', 'padding-bottom', 'pointer-events']],
    ['.vp-home-hero .hero-content', '.vp-home-hero .hero-content', ['max-width', 'padding-left', 'padding-right', 'margin-top', 'margin-bottom', 'text-align', 'pointer-events']],
    ['.vp-home-hero .hero-name', '.vp-home-hero .hero-name', ['max-width', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'pointer-events']],
    ['.vp-home-hero .hero-text', '.vp-home-hero .hero-text', ['margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'font-size', 'font-weight', 'color', 'white-space', 'pointer-events', 'transition-property']],
    ['.vp-home-hero .actions', '.vp-home-hero .actions', ['display', 'flex-wrap', 'justify-content', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left']],
  ]
  const homeMatrix: Array<[string, string, string[]]> = [
    ['.vp-home-features', '.vp-home-features', ['position', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left']],
    ['.vp-home-features > .container', '.vp-home-features > .container', ['width', 'max-width', 'margin-right', 'margin-left']],
    ['.vp-home-features .items', '.vp-home-features .items', ['display', 'flex-wrap', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left']],
    ['.vp-home-features .item', '.vp-home-features .item', ['width', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left']],
    ['.vp-home-feature', '.vp-home-feature', ['display', 'background-color', 'border-top-width', 'border-top-color', 'border-radius', 'transition-property']],
    ['.vp-home-feature .box', '.vp-home-feature .box', ['display', 'flex-direction', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left']],
    ['.vp-home-feature .icon', '.vp-home-feature .icon', ['display', 'align-items', 'justify-content', 'width', 'height', 'margin-bottom', 'font-size', 'background-color', 'border-radius', 'transition-property']],
    ['.vp-home-feature .title', '.vp-home-feature .title', ['font-size', 'font-weight', 'line-height']],
    ['.vp-home-feature .details', '.vp-home-feature .details', ['flex-grow', 'padding-top', 'font-size', 'font-weight', 'line-height', 'color']],
    ['.vp-home-text-image .container', '.vp-home-text-image .container', ['display', 'flex-direction', 'gap', 'align-items', 'justify-content', 'max-width', 'margin-right', 'margin-left']],
    ['.vp-home-text-image .content-text', '.vp-home-text-image .content-text', ['display', 'flex-grow', 'flex-shrink', 'justify-content', 'max-width']],
    ['.vp-home-custom', '.vp-home-custom', ['position', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left']],
    ['.vp-home-custom > .container', '.vp-home-custom > .container', ['width', 'max-width', 'margin-right', 'margin-left']],
  ]
  const snapshot = (page: typeof frozen, matrix: Array<[string, string, string[]]>, selectorIndex: 0 | 1) => page.evaluate(({ matrix, selectorIndex }) => matrix.map(row => {
    const css = getComputedStyle(document.querySelector(row[selectorIndex])!)
    return Object.fromEntries(row[2].map(name => [name, css.getPropertyValue(name)]))
  }), { matrix, selectorIndex })

  for (const theme of ['light', 'dark'] as const) {
    for (const width of [1440, 820, 390]) {
      const viewport = { width, height: width === 390 ? 844 : 900 }
      await Promise.all([frozen.setViewportSize(viewport), targetHero.setViewportSize(viewport), targetHome.setViewportSize(viewport)])
      await Promise.all([forceTheme(frozen, theme), forceTheme(targetHero, theme), forceTheme(targetHome, theme)])
      const [targetHeroStyles, frozenHeroStyles, targetHomeStyles, frozenHomeStyles] = await Promise.all([
        snapshot(targetHero, heroMatrix, 0),
        snapshot(frozen, heroMatrix, 1),
        snapshot(targetHome, homeMatrix, 0),
        snapshot(frozen, homeMatrix, 1),
      ])
      expect(targetHeroStyles).toEqual(frozenHeroStyles)
      expect(targetHomeStyles).toEqual(frozenHomeStyles)
    }
  }
  await context.close()
})

test('PhotoSwipe keeps the frozen desktop, tablet, and mobile light/dark shell', async ({ page }) => {
  for (const theme of ['light', 'dark'] as const) {
    for (const width of [1440, 820, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await page.goto('/docs/guide/api/', { waitUntil: 'load' })
      await page.evaluate(value => localStorage.setItem('vuepress-theme-appearance', value), theme)
      await page.reload({ waitUntil: 'load' })
      await page.evaluate(() => {
        const wrapper = document.createElement('div')
        const image = document.createElement('img')
        image.dataset.photoVisual = 'true'
        image.alt = 'Visual matrix'
        image.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22%3E%3Crect width=%22400%22 height=%22200%22 fill=%22%23336f87%22/%3E%3C/svg%3E'
        wrapper.append(image)
        document.querySelector('.vp-doc')?.append(wrapper)
      })
      await page.locator('[data-photo-visual]').click()
      const viewer = page.locator('.pswp')
      await expect(viewer).toBeVisible()
      await expect(viewer).toHaveCSS('position', 'fixed')
      await expect(viewer).toHaveCSS('inset', '0px')
      await expect(viewer.locator('.pswp__bg')).toHaveCSS('background-color', 'rgb(0, 0, 0)')
      await expect(viewer.locator('.pswp__top-bar')).toHaveCSS('height', '60px')
      const bounds = await viewer.evaluate(element => element.getBoundingClientRect().toJSON())
      expect(bounds.width).toBe(width)
      expect(bounds.height).toBe(width === 390 ? 844 : 900)
      await expect(viewer.locator('.photo-swipe-bullet.active')).toHaveCSS('width', '30px')
      await page.keyboard.press('Escape')
    }
  }
})
