import { expect, test } from '@playwright/test'
import { readdirSync } from 'node:fs'
import { expectHoveredCss } from './browser-helpers'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('vuepress-theme-appearance')) {
      localStorage.setItem('vuepress-theme-appearance', 'light')
    }
  })
})

test('navigation, language, theme, and mobile menu work', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const groups = page.locator('.nav-group')
  await expect(groups).toHaveCount(2)

  await groups.first().locator('.flyout-button').hover()
  await expect(groups.first().locator('.flyout-button')).toHaveAttribute('aria-expanded', 'true')
  await expect(groups.first().locator('.vp-menu-group > .title')).toContainText('指南')
  const menuLink = groups.first().locator('a[href="/docs/guide/content/"]')
  await expect(menuLink).toContainText('New')
  await expect(menuLink).toHaveCSS('display', 'block')
  await expect(menuLink.locator('.nav-menu-icon')).toHaveCSS('margin-right', '4.2px')
  await groups.nth(1).locator('.flyout-button').hover()
  await expect(groups.first().locator('.flyout-button')).toHaveAttribute('aria-expanded', 'false')
  await page.locator('#VPContent').hover()
  await expect(groups.nth(1).locator('.flyout-button')).toHaveAttribute('aria-expanded', 'false')
  await groups.first().locator('.flyout-button').click()
  await expect(groups.first().locator('.flyout-button')).toHaveAttribute('aria-expanded', 'true')
  await page.locator('body').dispatchEvent('pointerdown')
  await expect(groups.first().locator('.flyout-button')).toHaveAttribute('aria-expanded', 'false')
  await page.locator('.vp-navbar-title a').focus()
  await groups.first().locator('.flyout-button').focus()
  await expect(groups.first().locator('.flyout-button')).toHaveAttribute('aria-expanded', 'true')
  await page.locator('.vp-navbar-title a').focus()
  await expect(groups.first().locator('.flyout-button')).toHaveAttribute('aria-expanded', 'false')

  await expect(page.locator('.vp-navbar-translations')).toHaveCount(1)

  await page.goto('/effects/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(2)
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/img/logo.svg')
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  const appearance = page.locator('.vp-navbar-appearance .vp-switch')
  await appearance.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  await page.setViewportSize({ width: 390, height: 900 })
  const hamburger = page.locator('.vp-navbar-hamburger')
  const mobileMenu = page.locator('.vp-nav-screen')
  await expect(hamburger).toHaveAttribute('aria-controls', 'nav-screen')
  await hamburger.click()
  await expect(mobileMenu).toHaveAttribute('id', 'navScreen')
  await expect(mobileMenu).toHaveClass(/fade-in-enter-active/)
  await expect(mobileMenu).toBeVisible()
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')
  await expect(mobileMenu).toHaveCSS('padding', '0px 32px')
  await expect(page.locator('.vp-nav-screen-menu-link')).toHaveCSS('padding', '12px 0px 11px')
  await expect(page.locator('.vp-nav-screen-menu-link')).toHaveCSS('font-size', '14px')
  await expect(page.locator('.mobile-nav-group')).toHaveCount(2)
  const mobileGroupButton = page.locator('.mobile-nav-group').first().locator(':scope > .button')
  const mobileGroupContainer = page.locator('.mobile-nav-group').first().locator('.vp-nav-screen-menu-group-container')
  await expect(mobileGroupButton).toHaveCSS('padding', '12px 4px 11px 0px')
  await mobileGroupButton.evaluate(element => (element as HTMLButtonElement).click())
  await expect(mobileGroupContainer).toHaveClass(/fade-in-height-expand-enter-active/)
  await expect(page.locator('.mobile-nav-group').first().locator('.vp-nav-screen-menu-group-section > .title')).toContainText('指南')
  const mobileGroupLink = page.locator('.mobile-nav-group').first().locator('a[href="/docs/guide/configuration/"]')
  await expect(mobileGroupLink).toBeVisible()
  await expect(mobileGroupLink).toHaveCSS('margin-left', '12px')
  await expect(mobileGroupLink).toHaveCSS('line-height', '32px')
  await expect.poll(() => mobileGroupContainer.evaluate(element => element.className)).not.toContain('fade-in-height-expand-enter-active')
  await mobileGroupButton.evaluate(element => (element as HTMLButtonElement).click())
  await expect(mobileGroupContainer).toHaveClass(/fade-in-height-expand-leave-active/)
  await expect(mobileGroupContainer).toBeHidden()
  await mobileGroupButton.click()
  await expect(mobileGroupContainer).toBeVisible()
  await expect(page.locator('.mobile-translations')).toHaveCount(1)
  await expect(page.locator('.mobile-appearance')).toHaveCSS('padding', '12px 14px 12px 16px')
  await hamburger.click()
  await expect(mobileMenu).toHaveClass(/fade-in-leave-active/)
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')
  await expect(mobileMenu).toBeHidden()
  await expect(page.locator('body')).toHaveCSS('overflow', 'visible')
  await hamburger.click()
  await expect(mobileGroupButton).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('.mobile-nav-group').first().locator('.vp-nav-screen-menu-group-container')).toBeHidden()
})

test('desktop navigation resolves every official link, badge, active, and external variant', async ({ page }) => {
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.vp-navbar-translations')).toHaveCount(1)
  await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(3)
  await expect(page.locator('.vp-navbar-menu')).toHaveAttribute('aria-labelledby', 'main-nav-aria-label')
  await expect(page.locator('#main-nav-aria-label')).toHaveText('Main Navigation')

  const docs = page.locator('.vp-navbar-menu-group').first()
  await expect(docs).toHaveClass(/\bactive\b/)
  await docs.locator('.flyout-button').click()
  const pageLink = docs.locator('a[href="/docs/"]')
  await expect(pageLink).toContainText('文档中心')
  await expect(pageLink.locator('.vp-icon.is-svg svg')).toBeVisible()
  await expect(pageLink.locator('.vp-icon')).toHaveAttribute('data-provider', 'iconify')
  await expect(docs.locator('.flyout-button .vp-icon svg')).toBeVisible()
  await expect(docs.locator('.vp-menu-group > .title .vp-icon svg')).toBeVisible()
  await expect(pageLink.locator('.vp-menu-badge')).toHaveClass(/\btip\b/)
  await expect(pageLink.locator('.vp-menu-badge')).toHaveText('开始')

  const content = docs.locator('a[href="/docs/guide/content/"]')
  await expect(content).toHaveClass(/\bactive\b/)
  await expect(content.locator('.vp-menu-badge')).toHaveClass(/\bwarning\b/)
  await expect(content.locator('.vp-menu-badge')).toHaveCSS('background-color', 'rgba(234, 179, 8, 0.14)')

  const external = docs.locator('a[href="https://astro.build/"]')
  await expect(external).toHaveClass(/\bvp-external-link-icon\b/)
  await expect(external).not.toHaveClass(/\bno-icon\b/)
  await expect(external).toHaveAttribute('target', '_blank')
  await expect(external).toHaveAttribute('rel', 'noopener noreferrer')
  await expect(external.locator('.visually-hidden')).toContainText('在新窗口打开')

  await page.goto('/blog/categories/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.navbar-menu-link[href="/blog/"]')).toHaveClass(/\bactive\b/)
  const more = page.locator('.vp-navbar-menu-group').nth(1)
  await more.locator('.flyout-button').click()
  await expect(more.locator('a[href="/blog/categories/"] .vp-icon-img img')).toHaveAttribute('src', '/img/logo.svg')
  await expect(more.locator('a[href="/blog/tags/"] .vp-icon.is-svg svg path')).toHaveAttribute('fill', 'currentColor')
})

test('tablet extra menu and automatic system appearance match Plume behavior', async ({ page, context }) => {
  await page.setViewportSize({ width: 820, height: 900 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.vp-navbar-translations')).toBeHidden()
  await expect(page.locator('.vp-navbar-appearance')).toBeHidden()
  await expect(page.locator('.vp-navbar-extra')).toBeVisible()
  await page.locator('.vp-navbar-extra .flyout-button').click()
  await expect(page.locator('.vp-navbar-extra .group.appearance .item.appearance')).toBeVisible()

  await page.evaluate(() => localStorage.setItem('vuepress-theme-appearance', 'auto'))
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.emulateMedia({ colorScheme: 'light' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

  const peer = await context.newPage()
  await peer.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  await peer.evaluate(() => localStorage.setItem('vuepress-theme-appearance', 'dark'))
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await peer.evaluate(() => localStorage.setItem('vuepress-theme-appearance', 'auto'))
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await peer.close()

  await page.locator('.vp-navbar-extra .flyout-button').click()
  await page.locator('.vp-navbar-extra .vp-switch-appearance').click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.evaluate(() => dispatchEvent(new Event('beforeprint')))
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.evaluate(() => dispatchEvent(new Event('afterprint')))
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/hero/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveClass(/force-dark/)
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('.vp-navbar-appearance')).toBeHidden()
  await page.evaluate(() => dispatchEvent(new Event('beforeprint')))
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.evaluate(() => dispatchEvent(new Event('afterprint')))
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('appearance view transitions and reduced-motion fallback match Plume', async ({ page }) => {
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => {
    const probe = { starts: 0, animations: [] as Array<{ keyframes: PropertyIndexedKeyframes, options: KeyframeAnimationOptions, active: boolean }> }
    ;(window as any).__appearanceProbe = probe
    ;(document as any).startViewTransition = (callback: () => void) => {
      probe.starts += 1
      callback()
      return { ready: Promise.resolve(), finished: new Promise(resolve => setTimeout(resolve, 50)), updateCallbackDone: Promise.resolve(), skipTransition() {} }
    }
    ;(document.documentElement as any).animate = (keyframes: PropertyIndexedKeyframes, options: KeyframeAnimationOptions) => {
      probe.animations.push({ keyframes, options, active: document.documentElement.classList.contains('appearance-transition') })
      return { finished: Promise.resolve() }
    }
  })
  const switcher = page.locator('.vp-navbar-appearance .vp-switch-appearance')
  await switcher.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark')
  await expect(switcher).toHaveAttribute('aria-checked', 'true')
  await expect(switcher).toHaveAttribute('title', '切换为浅色主题')
  await expect.poll(() => page.evaluate(() => (window as any).__appearanceProbe.animations.length)).toBe(1)
  const probe = await page.evaluate(() => (window as any).__appearanceProbe)
  expect(probe.starts).toBe(1)
  expect(probe.animations[0].keyframes.opacity).toEqual(['1', '0'])
  expect(probe.animations[0].options).toMatchObject({ duration: 300, easing: 'ease-in', fill: 'forwards', pseudoElement: '::view-transition-old(root)' })
  expect(probe.animations[0].active).toBe(true)
  await expect(page.locator('html')).not.toHaveClass(/appearance-transition/)

  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' })
  await page.evaluate(() => { (window as any).__appearanceProbe = { starts: 0, animations: [] } })
  await switcher.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'light')
  await expect(page.locator('.vp-doc div[class*="language-"]').first()).toHaveCSS('color-scheme', 'light')
  expect(await page.evaluate(() => (window as any).__appearanceProbe)).toEqual({ starts: 0, animations: [] })
  await expect(switcher.locator('.check')).toHaveCSS('transition-property', 'none')

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.evaluate(() => { (document as any).startViewTransition = undefined })
  await switcher.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('page transitions keep Plume timing without whole-page snapshots', async ({ page }) => {
  await page.goto('/about/', { waitUntil: 'domcontentloaded' })
  const content = page.locator('#VPContent')
  await page.locator('a[href="/blog/"]').first().click({ noWaitAfter: true })
  await expect(content).toHaveClass(/fade-slide-y-leave-active/)
  await expect(content).toHaveClass(/fade-slide-y-leave-to/)
  await page.waitForURL('**/blog/', { waitUntil: 'commit' })
  await expect(page.locator('#VPContent')).toHaveClass(/fade-slide-y-enter-active/)
  await expect(page.locator('#VPContent')).not.toHaveClass(/fade-slide-y-enter-active/, { timeout: 500 })

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await Promise.all([
    page.waitForURL(url => url.pathname === '/', { waitUntil: 'commit' }),
    page.locator('.vp-navbar-title a[href="/"]').click({ noWaitAfter: true }),
  ])
  await expect(page.locator('#VPContent')).not.toHaveClass(/fade-slide-y-enter-active/)
})

test('document sidebar navigation keeps the shell mounted', async ({ page }) => {
  await page.goto('/docs/guide/configuration/', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveTitle('站点配置 | 文档中心 | ermaozi')
  const documentRequests: string[] = []
  let resumeRequest: (() => void) | undefined
  await page.route('**/docs/guide/api/', async route => {
    await new Promise<void>(resolve => { resumeRequest = resolve })
    await route.continue()
  }, { times: 1 })
  page.on('request', request => { if (request.resourceType() === 'document' && request.frame() === page.mainFrame()) documentRequests.push(request.url()) })
  await page.evaluate(() => {
    ;(window as any).__ERMAOZI_HEADER__ = document.querySelector('.vp-navbar')
    ;(window as any).__ERMAOZI_SIDEBAR__ = document.querySelector('.vp-sidebar')
  })
  const shellGeometry = await page.evaluate(() => ['.vp-navbar', '.vp-sidebar'].map(selector => {
    const { x, y, width, height } = document.querySelector(selector)!.getBoundingClientRect()
    return { x, y, width, height }
  }))
  const navigation = page.locator('.vp-sidebar a[href="/docs/guide/api/"]').click()
  const progress = page.locator('#nprogress')
  await expect(progress).not.toHaveAttribute('hidden', '')
  await expect(progress.locator('.bar')).toBeVisible()
  await expect(progress.locator('.bar')).not.toHaveCSS('transform', 'none')
  await expect.poll(() => Boolean(resumeRequest)).toBe(true)
  resumeRequest!()
  await navigation
  await expect(page).toHaveURL(/\/docs\/guide\/api\/$/)
  await expect(progress).toHaveAttribute('hidden', '')
  await expect(page.locator('h1.page-title')).toHaveText('公共 API 与样式定制')
  await expect(page).toHaveTitle('公共 API 与样式定制 | 文档中心 | ermaozi')
  const articleJsonLd = page.locator('head script[type="application/ld+json"]').first()
  const jsonLd = await articleJsonLd.textContent()
  expect(jsonLd).toContain('公共 API 与样式定制')
  expect(jsonLd).not.toContain('站点配置')
  await expect(page.locator('.vp-sidebar a[href="/docs/guide/api/"]')).toHaveAttribute('aria-current', 'page')
  expect(await page.evaluate(() => (window as any).__ERMAOZI_HEADER__ === document.querySelector('.vp-navbar'))).toBe(true)
  expect(await page.evaluate(() => (window as any).__ERMAOZI_SIDEBAR__ === document.querySelector('.vp-sidebar'))).toBe(true)
  expect(await page.evaluate(() => ['.vp-navbar', '.vp-sidebar'].map(selector => {
    const { x, y, width, height } = document.querySelector(selector)!.getBoundingClientRect()
    return { x, y, width, height }
  }))).toEqual(shellGeometry)
  expect(documentRequests).toEqual([])
  await page.locator('.page-context-toggle').click()
  await expect(page.locator('.page-context-menu')).toBeVisible()

  await page.locator('.vp-sidebar a[href="/docs/guide/content/"]').click()
  await expect(page).toHaveURL(/\/docs\/guide\/content\/$/)
  await expect(page.locator('h1.page-title')).toHaveText('内容能力')
  await expect(page).toHaveTitle('内容能力 | 文档中心 | ermaozi')
  const collapsedCode = page.locator('.has-collapsed-lines').first()
  await collapsedCode.locator('.collapsed-lines').click()
  await expect(collapsedCode).not.toHaveClass(/(?:^|\s)collapsed(?:\s|$)/)
  expect(documentRequests).toEqual([])

  await page.goBack()
  await expect(page).toHaveURL(/\/docs\/guide\/api\/$/)
  await expect(page.locator('h1.page-title')).toHaveText('公共 API 与样式定制')
  await expect(page).toHaveTitle('公共 API 与样式定制 | 文档中心 | ermaozi')
  expect(await page.evaluate(() => (window as any).__ERMAOZI_SIDEBAR__ === document.querySelector('.vp-sidebar'))).toBe(true)
})

test('partial navigation falls back to a full document when the target shell changes', async ({ page }) => {
  await page.goto('/docs/guide/configuration/', { waitUntil: 'domcontentloaded' })
  let documentRequests = 0
  await page.route('**/docs/guide/api/', async route => {
    if (route.request().resourceType() === 'fetch') {
      const response = await route.fetch()
      const body = (await response.text()).replace(/data-page-shell="[^"]+"/, 'data-page-shell="different-shell"')
      await route.fulfill({ response, body })
      return
    }
    if (route.request().resourceType() === 'document') documentRequests += 1
    await route.continue()
  })
  await page.locator('.vp-sidebar a[href="/docs/guide/api/"]').click()
  await expect(page).toHaveURL(/\/docs\/guide\/api\/$/)
  await expect(page).toHaveTitle('公共 API 与样式定制 | 文档中心 | ermaozi')
  expect(documentRequests).toBe(1)
})

test('all Plume hero effect canvases mount and survive theme changes', async ({ page }) => {
  test.setTimeout(180_000)
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/effects/', { waitUntil: 'domcontentloaded' })

  const effects = ['prism', 'pixel-blast', 'hyper-speed', 'liquid-ether', 'dot-grid', 'iridescence', 'orb', 'beams', 'lightning', 'dark-veil']
  for (const effect of effects) {
    const section = page.locator(`.vp-home-hero.${effect}`)
    await expect(section).toHaveCount(1)
    await section.scrollIntoViewIfNeeded()
    const canvas = section.locator('canvas')
    await expect(canvas).toHaveCount(1, { timeout: 15_000 })
    await expect.poll(() => canvas.evaluate(element => (element as HTMLCanvasElement).width), { message: `${effect} canvas width`, timeout: 15_000 }).toBeGreaterThan(0)
    await expect.poll(() => canvas.evaluate(element => (element as HTMLCanvasElement).height), { message: `${effect} canvas height`, timeout: 15_000 }).toBeGreaterThan(0)
    if (effect === 'pixel-blast')
      await expect(section.locator('.effect-config-pixel')).toHaveCSS('opacity', '0.96')
    if (effect === 'liquid-ether')
      await expect(section.locator('.effect-config-liquid')).toHaveCSS('opacity', '0.97')
    if (effect === 'dot-grid')
      await expect(section.locator('.effect-config-dot')).toHaveCSS('opacity', '0.98')
    if (effect === 'orb')
      await expect(section.locator('.effect-config-orb')).toHaveCount(1)
  }

  for (const theme of ['light', 'dark'] as const) {
    await page.evaluate(value => {
      localStorage.setItem('vuepress-theme-appearance', value)
      document.documentElement.dataset.theme = value
      document.documentElement.classList.toggle('dark', value === 'dark')
      document.dispatchEvent(new CustomEvent('theme-change'))
    }, theme)
    for (const width of [1440, 820, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await expect(page.locator('.vp-home-hero .hero-name').first()).toHaveCSS('font-size', width >= 960 ? '72px' : width >= 768 ? '64px' : '48px')
      for (const effect of effects) {
        const section = page.locator(`.vp-home-hero.${effect}`)
        await section.scrollIntoViewIfNeeded()
        await expect.poll(() => section.evaluate((element, viewportWidth) => {
          const sectionRect = element.getBoundingClientRect()
          const islandRect = element.querySelector('astro-island')?.getBoundingClientRect()
          const canvas = element.querySelector('canvas') as HTMLCanvasElement | null
          const canvasRect = canvas?.getBoundingClientRect()
          return Math.abs(sectionRect.width - viewportWidth) < 1
            && sectionRect.height > 200
            && !!islandRect && Math.abs(islandRect.width - sectionRect.width) < 1 && Math.abs(islandRect.height - sectionRect.height) < 1
            && !!canvas && canvas.width > 0 && canvas.height > 0
            && !!canvasRect && canvasRect.width > 0 && canvasRect.height > 0
        }, width), { message: `${theme} ${width}px ${effect} geometry`, timeout: 15_000 }).toBe(true)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    }
  }

  await page.setViewportSize({ width: 820, height: 900 })
  for (const effect of ['pixel-blast', 'dot-grid', 'iridescence', 'orb']) {
    const section = page.locator(`.vp-home-hero.${effect}`)
    await section.scrollIntoViewIfNeeded()
    await section.hover({ position: { x: 24, y: 100 } })
    await section.click({ position: { x: 24, y: 100 } })
  }
  await expect(page.locator('.vp-home-hero canvas[tabindex], .vp-home-hero [role="button"]')).toHaveCount(0)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload({ waitUntil: 'domcontentloaded' })
  for (const effect of effects) {
    const section = page.locator(`.vp-home-hero.${effect}`)
    await section.scrollIntoViewIfNeeded()
    const canvas = section.locator('canvas')
    await expect(canvas).toHaveCount(1, { timeout: 15_000 })
    await expect.poll(() => canvas.evaluate(element => (element as HTMLCanvasElement).width > 0 && (element as HTMLCanvasElement).height > 0), { message: `${effect} remains mounted under reduced motion`, timeout: 15_000 }).toBe(true)
  }
  expect(errors).toEqual([])
})

test('enhanced Markdown controls work with pointer and keyboard', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.route('https://api.iconify.design/mdi/home.svg', route => route.fulfill({
    contentType: 'image/svg+xml',
    body: '<svg viewBox="0 0 24 24" onload="globalThis.unsafeIcon=true"><script>globalThis.unsafeIcon=true</script><path fill="currentColor" d="M3 11 12 3l9 8v10h-6v-6H9v6H3Z"/></svg>',
  }))
  await page.goto('/blog/markdown-showcase/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('mark')).toHaveText('重点标记')
  await expect(page.locator('.vp-doc .vp-icon.iconify:not([data-iconify-remote]) svg').first()).toBeVisible()
  const remoteIcon = page.locator('[data-iconify-remote="mdi:home"]')
  await expect(remoteIcon).toHaveAttribute('data-iconify-state', 'ready')
  await expect(remoteIcon.locator('svg')).toBeVisible()
  expect(await remoteIcon.evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(0)
  await expect(remoteIcon.locator('script')).toHaveCount(0)
  await expect(remoteIcon.locator('svg')).not.toHaveAttribute('onload')
  expect(await page.evaluate(() => (globalThis as any).unsafeIcon)).toBeUndefined()
  await expect(page.locator('.vp-doc .vp-icon.iconify[style*="width:24px"]:not(.provider-icon) svg')).toBeVisible()

  const collapse = page.locator('.vp-collapse-item').nth(1)
  const collapseContent = collapse.locator('.vp-collapse-content')
  const initiallyOpenCollapse = page.locator('.vp-collapse-item').first()
  await expect(collapseContent).toBeHidden()
  await collapse.locator('.vp-collapse-header').click()
  await expect(collapseContent).toBeVisible()
  await expect(collapseContent).toHaveClass(/fade-in-height-expand-enter-active/)
  await expect(collapseContent).toHaveCSS('transition-property', 'max-height, opacity, margin-top, margin-bottom, padding-top, padding-bottom')
  await expect(initiallyOpenCollapse.locator('.vp-collapse-content')).toHaveClass(/fade-in-height-expand-leave-active/)
  await expect(initiallyOpenCollapse.locator('.vp-collapse-header')).toHaveAttribute('aria-expanded', 'false')
  await expect(initiallyOpenCollapse.locator('.vp-collapse-content')).toBeHidden({ timeout: 1000 })
  await expect(collapseContent).not.toHaveClass(/fade-in-height-expand-enter-active/, { timeout: 1000 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await collapse.locator('.vp-collapse-header').press('Space')
  await expect(collapseContent).toBeHidden()
  await expect(collapseContent).not.toHaveClass(/fade-in-height-expand-(?:enter|leave)-active/)
  await page.emulateMedia({ reducedMotion: 'no-preference' })

  const tabs = page.locator('.vp-tab-nav')
  await tabs.first().focus()
  await page.keyboard.press('ArrowRight')
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.vp-tab').nth(1)).toBeVisible()
  await expect(page.locator('.vp-tabs').nth(1).locator('.vp-tab-nav').nth(1)).toHaveAttribute('aria-selected', 'true')
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('VUEPRESS_TAB_STORE') || '{}')['package-manager'])).toBe('npm')
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('.vp-tabs').first().locator('.vp-tab-nav').nth(1)).toHaveAttribute('aria-selected', 'true')

  const codeTabs = page.locator('.vp-code-tabs[data-tab-id="install-command"]')
  await expect(codeTabs.locator('.vp-code-tab-nav')).toHaveCount(3)
  await expect(codeTabs.locator('.vp-code-tab-nav').nth(1)).toHaveAttribute('aria-selected', 'true')
  await expect(codeTabs.locator('.vp-code-tab').nth(1)).toBeVisible()
  await expect(codeTabs.locator('.vp-code-tab').nth(0)).toBeHidden()
  await expect(codeTabs.locator('.vp-code-tab-nav .vp-icon svg')).toHaveCount(3)
  await codeTabs.locator('.vp-code-tab-nav').nth(2).click()
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('VUEPRESS_CODE_TAB_STORE') || '{}')['install-command'])).toBe('yarn')
  const copyCode = codeTabs.locator('.vp-code-tab.active [data-copy-code]')
  await expect(copyCode).toHaveAttribute('aria-label', '复制代码')
  await expect(copyCode).toHaveAttribute('data-copied', '已复制')
  const copyMask = await copyCode.evaluate(element => getComputedStyle(element, '::before').maskImage)
  await copyCode.click()
  await expect(copyCode).toHaveClass(/copied/)
  await expect.poll(() => copyCode.evaluate(element => getComputedStyle(element, '::before').maskImage)).not.toBe(copyMask)
  await expect.poll(() => copyCode.evaluate(element => getComputedStyle(element, '::before').maskSize)).toBe('13.3333px')
  expect(await copyCode.evaluate(element => getComputedStyle(element, '::before').maskImage)).toContain('v12a2 2 0 0 0 2 2h10')
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('yarn install')

  const mermaid = page.locator('.mermaid-wrapper')
  await expect(mermaid.locator('svg')).toBeVisible()
  const lightDiagram = await mermaid.locator('svg').innerHTML()
  await page.locator('.vp-navbar-appearance .vp-switch').click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect.poll(() => mermaid.locator('svg').innerHTML()).not.toBe(lightDiagram)
  for (const button of await page.locator('.mermaid-actions button').all()) {
    const { buttonBox, iconBox } = await button.evaluate((element) => {
      const icon = element.querySelector('svg')!
      const buttonBounds = element.getBoundingClientRect()
      const iconBounds = icon.getBoundingClientRect()
      return {
        buttonBox: { width: buttonBounds.width, height: buttonBounds.height },
        iconBox: {
          centerX: iconBounds.left + iconBounds.width / 2 - buttonBounds.left,
          centerY: iconBounds.top + iconBounds.height / 2 - buttonBounds.top,
        },
      }
    })
    expect(buttonBox).toEqual({ width: 32, height: 32 })
    expect(iconBox.centerX).toBeCloseTo(16, 1)
    expect(iconBox.centerY).toBeCloseTo(16, 1)
  }
  await page.locator('.mermaid-actions .preview-button').click()
  await expect(page.locator('.mermaid-preview')).toBeVisible()
  await page.locator('.mermaid-preview').click()
  await expect(page.locator('.mermaid-preview')).toHaveCount(0)
  const downloadPromise = page.waitForEvent('download')
  await page.locator('.mermaid-actions .download-button').click()
  expect((await downloadPromise).suggestedFilename()).toBe('markdown-flow.svg')

  const annotation = page.locator('.vp-annotation').first()
  await annotation.click()
  await expect(annotation).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('.vp-annotation-popover')).toContainText('访问时无需持续运行应用服务器')
  await page.keyboard.press('Escape')
  await expect(page.locator('.vp-annotation-popover')).toBeHidden()

  const masonry = page.locator('.vp-card-masonry')
  await expect(masonry.locator(':scope > .card-masonry-item')).toHaveCount(3)
  await expect(masonry.locator('.vp-card-wrapper')).toHaveCount(3)
  await expect(masonry.locator(':scope > .card-masonry-item').first().locator('.vp-card-wrapper')).toHaveCount(1)

  const cardGrid = page.locator('[data-card-grid-cols]').first()
  await expect(cardGrid).toHaveClass(/\bcols-3\b/)
  const dynamicCard = page.locator('.vp-image-card', { hasText: '动态图片卡片' })
  await expect(dynamicCard).toBeVisible()
  await expect(dynamicCard).toHaveClass(/\bcenter\b/)
  await expect(dynamicCard).toHaveCSS('width', '240px')
  await expect(dynamicCard.locator('img')).toHaveAttribute('src', '/img/logo.svg')
  const customTitle = page.locator('[data-card-custom-title]')
  await expect(customTitle).toHaveText('自定义标题插槽')
  await expect(customTitle.locator('xpath=ancestor::article[1]').locator('.body')).toContainText('任意标题插槽内容仍保留 Markdown 正文')
  await page.setViewportSize({ width: 820, height: 900 })
  await expect(cardGrid).toHaveClass(/\bcols-2\b/)
  await expect(masonry.locator(':scope > .card-masonry-item')).toHaveCount(2)
  await page.setViewportSize({ width: 390, height: 900 })
  await expect(cardGrid).toHaveClass(/\bcols-1\b/)
  await expect(masonry.locator(':scope > .card-masonry-item')).toHaveCount(1)
  await page.setViewportSize({ width: 1440, height: 900 })

  const codeTree = page.locator('.vp-code-tree').first()
  await expect(codeTree.locator('.code-block-title.active')).toHaveAttribute('data-title', 'src/index.ts')
  await expect(codeTree.locator('[data-code-file="src/index.ts"]')).toHaveClass(/\bactive\b/)
  await expect(codeTree.locator('.code-block-title.active .title .vp-icon svg')).toBeVisible()
  const configFile = codeTree.locator('[data-code-file="src/config.ts"]')
  await configFile.focus()
  await page.keyboard.press('Enter')
  await expect(codeTree.locator('.code-block-title.active')).toHaveAttribute('data-title', 'src/config.ts')

  const importedTree = page.locator('.vp-code-tree').nth(1)
  await expect(importedTree.locator('.code-block-title.active')).toHaveAttribute('data-title', 'src/index.ts')
  await importedTree.locator('[data-code-file="src/locale.ts"]').click()
  await expect(importedTree.locator('.code-block-title.active')).toHaveAttribute('data-title', 'src/locale.ts')

  await configFile.evaluate(element => {
    element.dataset.codeFile = 'missing.bin'
    ;(element as HTMLElement).click()
  })
  await expect(codeTree.locator('.code-block-title.active')).toHaveCount(0)
  await expect(codeTree.locator('.code-tree-empty')).toBeVisible()

  const qrCode = page.locator('.vp-qrcode .qrcode-img').first()
  await expect(qrCode).toBeVisible()
  await expect(qrCode).toHaveAttribute('src', /^data:image\/png;base64,/)
  const qrCenter = await qrCode.evaluate(async element => {
    const image = element as HTMLImageElement
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext('2d')!
    context.drawImage(image, 0, 0)
    return [...context.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1).data]
  })
  expect(qrCenter[2]).toBeGreaterThan(qrCenter[0])
})

test('lazy mark preset follows the frozen intersection contract', async ({ page }) => {
  await page.goto('/blog/markdown-showcase/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveAttribute('data-mark-mode', 'lazy')
  const mark = page.locator('.vp-doc mark').first()
  await expect(mark).toHaveClass(/\bvp-mark-visible\b/)
  await expect(mark).not.toHaveAttribute('data-vp-mark-bound', '1')
})

test('QR codes preserve routes, options, links, logos, and multiline cards', async ({ page }) => {
  await page.goto('/blog/markdown-showcase/', { waitUntil: 'domcontentloaded' })
  const codes = page.locator('.vp-qrcode')
  await expect(codes).toHaveCount(4)
  await expect(codes.locator('.qrcode-img')).toHaveCount(4)
  for (const image of await codes.locator('.qrcode-img').all()) {
    await expect(image).toBeVisible()
    await expect(image).toHaveAttribute('src', /^data:image\/png;base64,/)
  }

  const current = codes.nth(1)
  await expect(current.locator('.qrcode-img')).toHaveCSS('width', '96px')
  await expect(current.locator('.qrcode-img')).toHaveAttribute('alt', 'http://127.0.0.1:4321/blog/markdown-showcase/')
  await expect(current.locator('.qrcode-label')).toHaveText('当前页面')

  const docs = codes.nth(2)
  await expect(docs.locator('.qrcode-img')).toHaveAttribute('alt', 'http://127.0.0.1:4321/docs/')

  const multiline = codes.nth(3)
  await expect(multiline).toHaveClass(/\breverse\b/)
  await expect(multiline.locator('[data-qrcode-link]')).toBeHidden()
  await expect(multiline.locator('[data-qrcode-value]')).toHaveText('第一行第二行')
  await expect(multiline.locator('[data-qrcode-value] br')).toHaveCount(1)
})

test('documentation navigation and content tools work', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })

  const sidebar = page.locator('.vp-sidebar')
  await expect(sidebar).toBeVisible()
  await expect(sidebar.locator('section a')).toHaveCount(6)
  await expect(sidebar.locator('.is-active a')).toHaveText('内容能力')
  await expect(sidebar.locator('.group.no-transition')).toHaveCount(0)
  await expect(sidebar.locator('.level-0 > .item > h2.text')).toHaveText('指南')
  await expect(sidebar.locator('.level-1 > .item > h3.text')).toContainText('基础')
  await expect(sidebar.locator('.vp-menu-badge.warning')).toHaveText('New')
  await expect(sidebar.locator('.text.separator')).toHaveText('参考')
  await expect(sidebar.locator('a[href="https://astro.build/"]')).toHaveAttribute('target', '_blank')

  const nestedGroup = sidebar.locator('.vp-sidebar-item.level-1', { has: page.getByText('基础', { exact: true }) })
  const nestedItem = nestedGroup.locator(':scope > .item')
  const nestedItems = nestedGroup.locator(':scope > .items-wrapper')
  await nestedItem.click()
  await expect(nestedGroup).toHaveClass(/\bcollapsed\b/)
  await expect(nestedItems).toBeHidden()
  await nestedItem.focus()
  await page.keyboard.press('Enter')
  await expect(nestedGroup).not.toHaveClass(/\bcollapsed\b/)
  await expect(nestedItems).toBeVisible()
  const configuredCode = page.locator('.code-block-title[data-title="site.config.mjs"]')
  await expect(configuredCode.locator('.title')).toHaveText('site.config.mjs')
  await expect(configuredCode.locator('.line.highlighted')).toHaveCount(2)
  await expect(configuredCode.locator('.indent').first()).toHaveCSS('position', 'relative')
  expect(await configuredCode.locator('.indent').first().evaluate(element => getComputedStyle(element, '::before').opacity)).toBe('0.15')
  await expect(configuredCode.locator('span[style*="--shiki-light:#2993a3"]').first()).toBeVisible()
  await configuredCode.locator('code').evaluate(element => element.insertAdjacentHTML('beforeend', '<span class="space"> </span><span class="tab">\t</span>'))
  expect(await configuredCode.locator('.space').evaluate(element => getComputedStyle(element, '::before').content)).toBe('"·"')
  expect(await configuredCode.locator('.tab').evaluate(element => getComputedStyle(element, '::before').content)).toBe('"⇥"')
  await expect(page.locator('.footnotes')).toBeVisible()
  await expect(page.locator('.table-of-contents')).toBeVisible()
  await expect(page.locator('.table-of-contents a[href="#代码块"]')).toHaveText('代码块')

  const notations = page.locator('.code-block-title[data-title="notations.ts"]')
  await expect(notations.locator('.line.has-focus')).toHaveCount(1)
  await expect(notations.locator('.line.diff')).toHaveCount(2)
  await expect(notations.locator('.line.highlighted.warning')).toHaveCount(1)
  await expect(notations.locator('.line.highlighted.error')).toHaveCount(1)
  await expect(notations.locator('.highlighted-word')).toHaveCount(2)
  const unfocused = notations.locator('.line:not(.has-focus)').first()
  await expect(unfocused).toHaveCSS('opacity', '0.7')
  await notations.locator('.has-focused-lines').hover()
  await expect(unfocused).toHaveCSS('opacity', '1')
  await notations.locator('[data-copy-code]').click()
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).not.toContain("const removed = false")
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain("const added = true")

  const collapsedCode = page.locator('.language-css.has-collapsed-lines')
  const collapsedControl = collapsedCode.locator('.collapsed-lines')
  await expect(collapsedCode).toHaveClass(/(?:^|\s)collapsed(?:\s|$)/)
  const collapsedHeight = await collapsedCode.evaluate(element => element.getBoundingClientRect().height)
  await collapsedControl.click()
  await expect(collapsedCode).not.toHaveClass(/(?:^|\s)collapsed(?:\s|$)/)
  await expect.poll(() => collapsedCode.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThan(collapsedHeight)
  await collapsedControl.focus()
  await page.keyboard.press('Enter')
  await expect(collapsedCode).toHaveClass(/(?:^|\s)collapsed(?:\s|$)/)

  const tableCopy = page.locator('[data-copy-table="md"]')
  await tableCopy.click()
  await expect(tableCopy.locator('.vpi-table-copied')).toBeVisible()
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('| 能力 | 默认状态 |')
  const tableHtmlCopy = page.locator('[data-copy-table="html"]')
  await tableHtmlCopy.click()
  await expect(tableHtmlCopy.locator('.vpi-table-copied')).toBeVisible()
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('<table>')

  const source = await page.request.get('/docs/guide/content/index.md')
  expect(source.ok()).toBeTruthy()
  expect(await source.text()).toContain('# 内容能力')

  const pageMenu = page.locator('.vp-page-context-menu')
  const pageContextDropdown = pageMenu.locator('.page-context-menu')
  await expect(pageMenu.locator('.page-context-copy')).toHaveJSProperty('tagName', 'SPAN')
  await expect(pageMenu.locator('.page-context-toggle')).toHaveJSProperty('tagName', 'SPAN')
  await page.locator('.page-title').dispatchEvent('pointerdown')
  expect(await pageContextDropdown.evaluate(element => (element as HTMLElement).hidden)).toBe(true)
  await pageMenu.locator('.page-context-toggle').focus()
  await page.keyboard.press('Enter')
  await expect(pageContextDropdown).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(pageContextDropdown).toBeHidden()
  await pageMenu.locator('.page-context-toggle').click()
  const aiLinks = pageMenu.locator('[data-ai-url]')
  await expect(aiLinks).toHaveCount(3)
  for (const link of await aiLinks.all()) {
    const href = await link.getAttribute('href')
    expect(decodeURIComponent(href || '')).toContain(`${new URL(page.url()).origin}/docs/guide/content/index.md`)
    expect(href).not.toContain('%7Blink%7D')
  }
  await page.locator('.page-title').click()
  await expect(pageContextDropdown).toBeHidden()
  await pageMenu.locator('.page-context-copy').click()
  await expect(pageMenu.locator('.page-context-copy .text')).toHaveText('复制成功')
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('# 内容能力')

  await page.setViewportSize({ width: 390, height: 900 })
  await expect.poll(() => sidebar.evaluate(element => element.getBoundingClientRect().right)).toBeLessThanOrEqual(0)
  const backdrop = page.locator('.vp-backdrop')
  await expect(backdrop).toBeHidden()
  await page.locator('.vp-local-nav .menu').click()
  await expect.poll(() => sidebar.evaluate(element => element.getBoundingClientRect().left)).toBe(0)
  await expect(sidebar.locator('.is-active a')).toBeVisible()
  await expect(backdrop).toBeVisible()
  await expect.poll(() => backdrop.evaluate(element => getComputedStyle(element).opacity)).toBe('1')
  await backdrop.click({ position: { x: 380, y: 450 } })
  await expect.poll(() => sidebar.evaluate(element => element.getBoundingClientRect().right)).toBeLessThanOrEqual(0)
  await expect(backdrop).toBeHidden()
})

test('document outlines follow scrolling in desktop and local navigation', async ({ page }) => {
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.vp-doc-aside-outline .outline-title .vpi-print')).toHaveJSProperty('tagName', 'SPAN')
  await expect(page.locator('.vp-doc-aside-outline .root > li:has(> a[href="#代码演示"]) > .nested > li > a[href="#普通演示文件与外部资源"]')).toBeVisible()
  await expect(page.locator('.outline-link[href="#embedded-markdown"], .outline-link[href="#markdown-渲染结果"]')).toHaveCount(0)
  const focusLink = page.locator('.vp-doc-aside-outline .outline-link[href="#代码演示"]')
  await focusLink.click()
  await expect.poll(() => page.locator('h2#代码演示').evaluate(element => element === document.activeElement)).toBe(true)
  const heading = page.locator('h2#脚注和表格')
  await heading.evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY - 79))
  const asideLink = page.locator('.vp-doc-aside-outline .outline-link[href="#脚注和表格"]')
  await expect(page.locator('.vp-local-nav')).toHaveClass(/reached-top/)
  await expect(asideLink).toHaveClass(/active/)
  await page.setViewportSize({ width: 820, height: 900 })
  await heading.evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY - 79))
  await page.locator('.vp-local-nav-outline-dropdown .outline-toggle').click()
  await expect(page.locator('.vp-local-nav-outline-dropdown .outline-link.active')).toHaveCount(0)
  await expect(page.locator('.vp-doc-aside-outline .outline-marker')).toHaveCSS('opacity', '1')
  await expect.poll(() => decodeURIComponent(new URL(page.url()).hash)).toBe('#脚注和表格')
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.evaluate(() => scrollTo(0, 0))
  await expect(page.locator('.vp-local-nav')).not.toHaveClass(/reached-top/)
  await expect(asideLink).not.toHaveClass(/active/)
  await expect(page.locator('.vp-doc-aside-outline .outline-marker')).toHaveCSS('opacity', '0')

  await page.goto('/docs/guide/configuration/', { waitUntil: 'domcontentloaded' })
  for (const hash of ['#markdown-图标', '#项目结构']) {
    const clicked = page.locator(`.vp-doc-aside-outline .outline-link[href="${hash}"]`)
    await clicked.click()
    await expect(clicked).toHaveClass(/active/)
    await expect.poll(() => decodeURIComponent(new URL(page.url()).hash)).toBe(hash)
  }
  await page.setViewportSize({ width: 1522, height: 1118 })
  const nearBottom = page.locator('.vp-doc-aside-outline .outline-link[href="#页面字段"]')
  await nearBottom.click()
  await expect(nearBottom).toHaveClass(/active/)
  await expect.poll(() => decodeURIComponent(new URL(page.url()).hash)).toBe('#页面字段')
  const last = page.locator('.vp-doc-aside-outline .outline-link[href="#doc-copyright"]')
  await last.click()
  await expect(last).toHaveClass(/active/)
  await expect.poll(() => decodeURIComponent(new URL(page.url()).hash)).toBe('#doc-copyright')
})

test('partial and full-page encryption keep plaintext out until a valid unlock', async ({ page }) => {
  await page.goto('/blog/markdown-showcase/', { waitUntil: 'domcontentloaded' })
  const snippet = page.locator('[data-encrypt-snippet]')
  await expect(snippet).toBeVisible()
  await expect(page.locator('.outline-link[href="#加密片段标题"]')).toHaveCount(0)
  await snippet.locator('input').fill('wrong')
  await snippet.locator('button').evaluate(button => new Promise<void>(resolve => {
    const control = button as HTMLButtonElement
    const observer = new MutationObserver(() => {
      if (control.querySelector('.vpi-loading')) {
        observer.disconnect()
        resolve()
      }
    })
    observer.observe(control, { childList: true, subtree: true })
    control.click()
  }))
  await expect(snippet.locator('.snippet-error')).toBeVisible()
  await snippet.locator('input').fill('246810')
  await snippet.locator('button').click()
  await expect(page.getByText('局部加密验证内容：只有成功解密后才会进入页面 DOM。')).toBeVisible()
  await expect(page.locator('.decrypted-content')).toHaveCSS('animation-name', 'fade-scale')
  await expect(page.locator('.vp-doc-aside-outline .outline-link[href="#加密片段标题"]')).toBeVisible()

  await page.setViewportSize({ width: 820, height: 900 })
  await page.goto('/blog/encrypted-example/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.vp-footer')).toHaveCount(0)
  await expect(page.locator('.vp-local-nav, .vp-doc-container > .container > .aside')).toHaveCount(0)
  const pageEncrypt = page.locator('[data-page-encrypt]')
  await expect(pageEncrypt).toBeVisible()
  const pageInput = pageEncrypt.locator('input')
  await pageInput.fill('wrong')
  await pageInput.press('Enter')
  await expect(pageEncrypt).toHaveClass(/animation/)
  await expect(pageInput).toHaveClass(/error/)
  await expect(pageInput).toHaveAttribute('aria-invalid', 'true')
  await expect(pageInput).toHaveAttribute('aria-describedby', 'encrypt-error')
  await pageInput.fill('ermaozi-demo')
  await expect(pageInput).toHaveAttribute('aria-invalid', 'false')
  await expect(pageInput).not.toHaveAttribute('aria-describedby', /.+/)
  await pageEncrypt.locator('input').fill('ermaozi-demo')
  await pageEncrypt.locator('button').evaluate(button => new Promise<void>(resolve => {
    const control = button as HTMLButtonElement
    const observer = new MutationObserver(() => {
      if (control.querySelector('.vpi-loading')) {
        observer.disconnect()
        resolve()
      }
    })
    observer.observe(control, { childList: true, subtree: true })
    control.click()
  }))
  await expect(page.getByText('整页加密验证内容：这段文字不会以明文写入构建后的 HTML。')).toBeVisible()
  const unlockedLocal = page.locator('.vp-local-nav.is-posts')
  await expect(unlockedLocal).toBeVisible()
  await unlockedLocal.locator('.outline-toggle').click()
  await expect(unlockedLocal.locator('.outline-link[href="#解锁之后"]')).toBeVisible()
  await page.keyboard.press('Escape')
  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(page.locator('.vp-doc-container')).toHaveClass(/has-aside/)
  await expect(page.locator('.vp-doc-container')).not.toHaveClass(/with-encrypt/)
  await expect(page.locator('.vp-doc-aside-outline .outline-link[href="#解锁之后"]')).toBeVisible()
  await page.reload()
  await expect(page.getByText('整页加密验证内容：这段文字不会以明文写入构建后的 HTML。')).toBeVisible()
  await expect(page.locator('[data-page-encrypt]')).toHaveCount(0)
  await expect(page.locator('.vp-doc-aside-outline .outline-link[href="#解锁之后"]')).toBeVisible()

  await page.evaluate(() => sessionStorage.clear())
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.locator('[data-page-encrypt] input').fill('rule-demo')
  await page.locator('[data-page-encrypt] button').click()
  await expect(page.getByText('整页加密验证内容：这段文字不会以明文写入构建后的 HTML。')).toBeVisible()

  await page.evaluate(() => sessionStorage.clear())
  await page.goto('/blog/markdown-showcase/', { waitUntil: 'domcontentloaded' })
  const adminSnippet = page.locator('[data-encrypt-snippet]')
  await adminSnippet.locator('input').fill('plume-admin')
  await adminSnippet.locator('button').click()
  await expect(page.getByText('局部加密验证内容：只有成功解密后才会进入页面 DOM。')).toBeVisible()
  await page.goto('/blog/encrypted-example/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('[data-page-encrypt]')).toHaveCount(0)
  await expect(page.getByText('整页加密验证内容：这段文字不会以明文写入构建后的 HTML。')).toBeVisible()

  await page.evaluate(() => sessionStorage.clear())
  await page.goto('/en/blog/encrypted-example/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.encrypt-text')).toHaveText('The demo password is ermaozi-demo')
  await expect(page.locator('.encrypt-input')).toHaveAttribute('placeholder', 'Enter password')
  await expect(page.locator('.encrypt-button')).toHaveText('Confirm')
})

test('file trees expand with pointer and keyboard and copy their source shape', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/docs/guide/configuration/')
  const folder = page.locator('.vp-file-tree-info.folder').first()
  await expect(folder).toHaveAttribute('aria-expanded', 'true')
  await folder.click()
  await expect(folder).toHaveAttribute('aria-expanded', 'false')
  await folder.press('Enter')
  await expect(folder).toHaveAttribute('aria-expanded', 'true')
  const commentedFolder = page.locator('.vp-file-tree-info.folder:has(.comment)').first()
  await expect(commentedFolder.locator('.comment strong')).toHaveText('静态资源')
  await commentedFolder.locator('.comment').click()
  await expect(commentedFolder).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('.vp-file-tree .file-tree-icon.vp-icon.is-svg > svg').first()).toBeVisible()
  await page.locator('[data-copy-tree]').first().click()
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('content')
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).not.toContain('…')
  await page.locator('[data-copy-tree]').nth(1).click()
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('├── content')
})

test('abbreviations and annotations use Plume floating interactions', async ({ page }) => {
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  const abbreviation = page.locator('.vp-abbr').first()
  const tooltip = page.locator('body > .vp-abbr-tooltip')
  await expect(tooltip).toHaveCount(0)
  await abbreviation.hover()
  await expect(tooltip).toBeVisible()
  await expect(tooltip).toHaveCSS('position', 'absolute')
  await expect(tooltip).toHaveCSS('max-width', '360px')
  await tooltip.hover()
  await expect(tooltip).toBeVisible()
  await page.mouse.move(1, 1)
  await expect(tooltip).toHaveCount(0)
  await abbreviation.focus()
  await expect(tooltip).toBeVisible()
  await page.locator('h1').first().click()
  await expect(tooltip).toHaveCount(0)

  await page.setViewportSize({ width: 390, height: 900 })
  await abbreviation.click()
  await expect(tooltip).toBeVisible()
  await abbreviation.click()
  await expect(tooltip).toHaveCount(0)
  await abbreviation.evaluate(element => Object.assign((element as HTMLElement).style, { position: 'fixed', left: '0', top: '100px' }))
  await abbreviation.click()
  await expect(tooltip.locator('.tooltip-arrow')).toHaveCSS('left', '4px')
  await page.locator('h1').first().click()
  await expect(tooltip).toHaveCount(0)

  await page.goto('/blog/markdown-showcase/', { waitUntil: 'domcontentloaded' })
  await page.setViewportSize({ width: 390, height: 200 })
  const annotation = page.locator('.vp-annotation').first()
  const popover = page.locator('body > .vp-annotation-popover')
  await expect(annotation).toHaveAttribute('aria-expanded', 'false')
  expect(await annotation.evaluate(element => element.parentElement?.tagName)).toBe('P')
  await annotation.evaluate(element => Object.assign((element as HTMLElement).style, { position: 'fixed', left: '180px', top: '105px' }))
  await annotation.click()
  await expect(annotation).toHaveClass(/\bactive\b/)
  await expect(annotation).toHaveClass(/\btop\b/)
  await expect(annotation.locator('.vpi-annotation')).toHaveCSS('transform', 'matrix(-0.707107, 0.707107, -0.707107, -0.707107, 0, 0)')
  await expect(popover).toBeVisible()
  expect(Math.round((await popover.boundingBox())!.y)).toBe(31)
  await page.keyboard.press('Escape')
  await expect(popover).toHaveCount(0)
  await expect(annotation).toHaveAttribute('aria-expanded', 'false')

  await annotation.evaluate(element => {
    const html = '<div class="annotation"><p>First</p></div><div class="annotation"><p>Second</p></div>'
    const bytes = new TextEncoder().encode(html)
    element.dataset.annotationContent = btoa(String.fromCharCode(...bytes))
    element.dataset.annotationTotal = '2'
  })
  await annotation.click()
  await expect(popover).toHaveClass(/\bgroup\b/)
  await expect(popover.locator(':scope > .annotation')).toHaveCount(2)
  await page.locator('h1').first().click()
  await expect(popover).toHaveCount(0)
})

test('hint containers preserve Plume types, nesting, titles, and details behavior', async ({ page }) => {
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.hint-container.info .hint-container-title')).toHaveText('相关信息')
  await expect(page.locator('.hint-container.note')).toHaveCount(2)
  await expect(page.locator('.hint-container.tip .hint-container-title strong')).toHaveText('自定义标题')
  await expect(page.locator('.hint-container.warning > .hint-container.important')).toBeVisible()
  await expect(page.locator('.hint-container.caution')).toHaveCount(3)

  const details = page.locator('details.hint-container.details')
  await expect(details).not.toHaveAttribute('open', '')
  await details.locator('summary').click()
  await expect(details).toHaveAttribute('open', '')
  await expect(details).toContainText('这是可折叠的详细内容')
  await details.locator('summary').focus()
  await page.keyboard.press('Enter')
  await expect(details).not.toHaveAttribute('open', '')
  await page.keyboard.press('Space')
  await expect(details).toHaveAttribute('open', '')
})

test('basic Markdown preserves the frozen preset in the rendered browser', async ({ page }) => {
  await page.goto('/blog/markdown-showcase/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.vp-doc mark')).toContainText('重点标记')
  const tasks = page.locator('.vp-doc .task-list-container input[type="checkbox"]')
  await expect(tasks).toHaveCount(3)
  await expect(tasks.nth(0)).toBeChecked()
  await expect(tasks.nth(1)).toBeChecked()
  await expect(tasks.nth(2)).not.toBeChecked()
  await expect(tasks.nth(2)).toBeDisabled()

  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.table-of-contents a[href="#代码块"]')).toHaveText('代码块')
  await expect(page.locator('.footnotes')).toContainText('所有页面在构建阶段生成')
  await expect(page.locator('.vp-doc')).toContainText('🎉 💯')
  await expect(page.locator('.vp-doc sup:not(.footnote-ref)')).toContainText('2')
  await expect(page.locator('.vp-doc sub')).toContainText('2')
})

test('Obsidian syntax renders links, embeds, aliases, comments, and locales', async ({ page }) => {
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.vp-doc')).toContainText('🎉 💯')
  await expect(page.locator('.vp-doc sup:not(.footnote-ref)')).toContainText('2')
  await expect(page.locator('.vp-doc sub')).toContainText('2')
  await expect(page.locator('.vp-doc a[href="https://astro.build/"][title="Astro"]')).toBeVisible()
  await expect(page.locator('.vp-doc a[href="/docs/guide/configuration/"]').filter({ hasText: '站点配置' }).first()).toBeVisible()
  await expect(page.locator('.vp-abbr[aria-label="Static Site Generator"]')).toContainText('SSG')
  const presetAnnotation = page.locator('p:has(a[href="https://astro.build/"]) .vp-annotation')
  await presetAnnotation.click()
  await expect(page.locator('.vp-annotation-popover')).toContainText('configured once in site.config.mjs')
  await page.keyboard.press('Escape')
  await expect(page.locator('.vp-doc a[href="/docs/guide/configuration/"]').filter({ hasText: '查看站点配置' })).toBeVisible()
  await expect(page.locator('.hint-container.caution.bug .hint-container-title')).toContainText('自定义 Callout 标题')
  await expect(page.locator('.vp-doc img[src="/img/logo.svg"][style*="width:48px"]')).toBeVisible()
  await expect(page.locator('.vp-doc')).toContainText('对内容区域执行与 Plume 一致的')
  await expect(page.locator('.vp-doc')).not.toContainText('仅编辑时可见的注释')

  await page.goto('/en/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.vp-doc a[href="/en/docs/guide/configuration/"]').filter({ hasText: 'View site configuration' })).toBeVisible()
  await expect(page.locator('.hint-container.caution.bug .hint-container-title')).toContainText('Custom callout title')
  await expect(page.locator('.vp-doc')).toContainText('Plume-compatible content transition')
  await expect(page.locator('.vp-doc')).not.toContainText('editor-only comment')
})

test('page watermark uses the configured content scope', async ({ page }) => {
  await page.goto('/about/', { waitUntil: 'domcontentloaded' })
  const watermark = page.locator('.vp-doc > div[style*="2147483647"]')
  await expect(watermark).toBeVisible()
  await expect(watermark).toHaveCSS('position', 'absolute')
  await expect(watermark).toHaveCSS('pointer-events', 'none')
  await expect(watermark.locator(':scope > div')).toHaveCSS('background-size', '240px 180px')
  await watermark.locator(':scope > div').evaluate(element => element.remove())
  await expect(watermark.locator(':scope > div')).toBeVisible()

  await page.evaluate(async () => {
    const watermark = [...document.querySelectorAll<HTMLElement>('.vp-doc > div')]
      .find(element => Object.hasOwn(element, '__WATERMARK__')) as HTMLElement & {
        __WATERMARK__INSTANCE__?: { changeOptions: (options: unknown) => Promise<void> }
      }
    await watermark.__WATERMARK__INSTANCE__?.changeOptions({
      contentType: 'image',
      image: '/img/logo.svg',
      imageWidth: 100,
      imageHeight: 100,
      width: 200,
      height: 200,
      parent: 'body',
    })
  })
  const fullPage = page.locator('body > div[style*="2147483647"]')
  await expect(fullPage).toHaveCount(1)
  await expect(fullPage).toHaveCSS('position', 'relative')
  await expect(fullPage.locator(':scope > div')).toBeVisible()
  await expect(fullPage.locator(':scope > div')).toHaveCSS('position', 'fixed')
  await expect(fullPage.locator(':scope > div')).toHaveCSS('background-size', '200px 200px')
})

test('custom home sections remain responsive and navigable', async ({ page }) => {
  await page.goto('/landing/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.vp-home-doc-hero')).toBeVisible()
  await expect(page.locator('.vp-home-doc-hero')).toHaveJSProperty('tagName', 'DIV')
  await expect(page.locator('.vp-home-doc-hero .actions > .action')).toHaveCount(1)
  await expect(page.locator('.vp-home-features .icon').first().locator('img')).toHaveAttribute('alt', 'ermaozi')
  await expect(page.locator('.vp-home-features .icon').first().locator('img')).toHaveCSS('width', '48px')
  await expect(page.locator('.vp-home-feature').nth(1).locator('[data-provider="iconify"]')).toHaveAttribute('data-iconify-remote', 'material-symbols:search')
  await expect(page.locator('.vp-home-feature').nth(2).locator('[aria-hidden="true"]')).toContainText('🌐')
  await expect(page.locator('.vp-home-feature')).toHaveCount(3)
  await expect(page.locator('.vp-home-feature').first()).toHaveClass('vp-link link no-icon vp-home-feature')
  await expect(page.locator('.vp-home-feature').first().locator('ul.details > li')).toHaveCount(2)
  await expect(page.locator('.vp-home-feature').first().locator('.link-text')).toContainText('了解更多')
  await expect(page.locator('.vp-home-feature .title').first()).toHaveCSS('margin-bottom', '0px')
  await expect(page.locator('.vp-home-feature .title').first()).toHaveCSS('text-align', 'start')
  await expect(page.locator('[data-user-home-component]')).toContainText('可扩展首页区域')
  await expect(page.locator('.vp-posts.home-posts .vp-post-item')).not.toHaveCount(0)
  await expect(page.getByRole('link', { name: '开始使用 →' })).toHaveAttribute('href', '/docs/')
  await expect(page.locator('.vp-home-hero .home-hero-bg')).toHaveCSS('background-attachment', 'fixed')
  await expect(page.locator('.vp-home-hero .home-hero-bg')).toHaveCSS('filter', 'opacity(0.14) blur(1px)')
  await expect(page.locator('.vp-home-text-image')).toHaveCount(2)
  await page.setViewportSize({ width: 820, height: 900 })
  await expect(page.locator('.vp-home-text-image .content-text').first()).toHaveCSS('margin-left', '0px')
  await page.setViewportSize({ width: 390, height: 900 })
  await expect(page.locator('.vp-home-text-image .container').first()).toHaveCSS('flex-direction', 'column')
  const feature = page.locator('.vp-home-feature').first()
  await expectHoveredCss(feature, 'border-top-color', 'rgb(80, 134, 161)')
  await feature.focus()
  await expect(feature).toBeFocused()
  await Promise.all([
    page.waitForURL(url => url.pathname === '/docs/'),
    page.keyboard.press('Enter'),
  ])
})

test('bulletin preserves all layouts and always, session, and once lifetimes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.vp-bulletin')).toHaveCount(0)
  await page.goto('/landing/', { waitUntil: 'domcontentloaded' })
  const bulletin = page.locator('.vp-bulletin')
  await expect(bulletin).toBeVisible()
  await expect(bulletin).toHaveClass(/\btop-right\b/)
  await expect(bulletin).toHaveClass(/\bborder\b/)
  await expect(bulletin).toHaveAttribute('data-bulletin-id', /^[a-f0-9]{8}$/)
  await expect(bulletin).toContainText('Configure or disable this bulletin')
  await expect(bulletin).toHaveCSS('scale', 'none')
  await expect(bulletin).toHaveCSS('transform', 'none')

  const position = async (layout: string) => {
    await bulletin.evaluate((element, next) => {
      element.classList.remove('top-left', 'top-right', 'bottom-left', 'bottom-right', 'center')
      element.classList.add(next)
    }, layout)
    return bulletin.evaluate(element => {
      const rect = element.getBoundingClientRect()
      return { top: Math.round(rect.top), right: Math.round(innerWidth - rect.right), bottom: Math.round(innerHeight - rect.bottom), left: Math.round(rect.left), center: Math.round(rect.left + rect.width / 2) }
    })
  }
  expect(await position('top-left')).toMatchObject({ top: 88, left: 24 })
  expect(await position('top-right')).toMatchObject({ top: 88, right: 24 })
  expect(await position('bottom-left')).toMatchObject({ bottom: 24, left: 24 })
  expect(await position('bottom-right')).toMatchObject({ bottom: 24, right: 24 })
  expect((await position('center')).center).toBe(720)

  const close = async () => {
    await bulletin.locator('.close').click()
    await expect(bulletin).toHaveClass(/fade-in-scale-up-leave-active/)
    await expect(bulletin).toHaveClass(/fade-in-scale-up-leave-to/)
  }
  const id = await bulletin.getAttribute('data-bulletin-id')
  await close()
  await expect(bulletin).toBeHidden()
  expect(await page.evaluate(() => sessionStorage.getItem('plume:bulletin'))).toBe(id)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(bulletin).toBeHidden()
  await page.evaluate(() => sessionStorage.clear())
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(bulletin).toBeVisible()

  let lifetime = 'always'
  await page.route('**/landing/', async route => {
    const response = await route.fetch()
    const body = (await response.text()).replace('data-bulletin-lifetime="session"', `data-bulletin-lifetime="${lifetime}"`)
    await route.fulfill({ response, body })
  })
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear() })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await close()
  await expect(bulletin).toBeHidden()
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(bulletin).toBeVisible()

  lifetime = 'once'
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear() })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await close()
  await expect(bulletin).toBeHidden()
  expect(await page.evaluate(() => localStorage.getItem('plume:bulletin'))).toBe(id)
  await page.evaluate(() => sessionStorage.clear())
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(bulletin).toBeHidden()
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(bulletin).toBeVisible()
})

test('full-screen home sign-down reaches the next section', async ({ page }) => {
  await page.goto('/hero/')
  await expect(page.locator('#VPContent')).toHaveClass(/\bis-home\b/)
  await expect(page.locator('#VPContent > .vp-home')).toHaveCSS('padding-top', '0px')
  await expect(page.locator('.vp-home-hero.tint-plate canvas')).toBeVisible()
  await expect(page.locator('html')).toHaveClass(/\bforce-dark\b/)
  await expect(page.locator('html')).toHaveClass(/\beffect-tint-plate\b/)
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('.vp-navbar-appearance')).toBeHidden()
  const signDown = page.getByRole('button', { name: '滚动到下一区域' })
  await expect(signDown).toHaveJSProperty('tagName', 'svg')
  await expect(signDown).toBeVisible()
  await signDown.click()
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(300)
})

test('back-to-top reports progress and returns to the page start', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/docs/guide/configuration/')
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight))
  const button = page.locator('.vp-back-to-top')
  await expect(button).toBeVisible()
  await expect(button).toHaveCSS('transition-property', 'background-color, box-shadow')
  await expect(button.locator('circle')).toHaveCSS('r', '22px')
  await expect(button.locator('.percent')).toContainText('%')
  await button.click()
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
})

test('search and taxonomy pages work without application errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', message => {
    if (message.type() === 'error' && !/^Failed to load resource: net::ERR_/.test(message.text())) errors.push(message.text())
  })
  page.on('response', response => {
    if (response.status() >= 400 && response.url().startsWith('http://127.0.0.1:4321')) errors.push(`${response.status()} ${response.url()}`)
  })

  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.vp-post-item')).toHaveCount(5)
  await expect(page.locator('.vp-post-item').first().locator('.reading-time > span').nth(1)).toHaveText(/^约 \d+ 字$/)
  await expect(page.locator('.vp-post-item').first().locator('.reading-time > span').nth(2)).toHaveText(/^(?:小于 1 分钟|大约 \d+ 分钟)$/)
  await page.keyboard.press('Control+k')
  const searchBox = page.locator('.VPLocalSearchBox')
  await expect(searchBox).toBeVisible()
  await expect(searchBox).toHaveJSProperty('tagName', 'DIV')
  await expect(searchBox).toHaveClass('VPLocalSearchBox')
  await expect(searchBox).toHaveAttribute('role', 'button')
  await expect(searchBox).toHaveAttribute('aria-expanded', 'true')
  await expect(searchBox).toHaveAttribute('aria-haspopup', 'listbox')
  await expect(searchBox).toHaveAttribute('aria-labelledby', 'mini-search-label')
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')
  await expect(page.locator('.search-keyboard-shortcuts')).toContainText('切换')
  await page.locator('.search-input').fill('Markdown')
  await expect(page.locator('.results .result').first()).toBeVisible()
  await expect(page.locator('.results .result').first()).toHaveClass(/\bselected\b/)
  const groupedResult = page.locator('.results .result:has(.title:not(.main))').first()
  await expect(groupedResult).toBeVisible()
  await expect(groupedResult.locator('.title').first()).not.toHaveClass(/\bmain\b/)
  await expect(groupedResult.locator('.title').last()).toHaveClass(/\bmain\b/)
  await expect(groupedResult).toHaveAttribute('aria-label', />/)
  await expect(page.locator('.results .result mark').first()).toHaveText(/Markdown/i)
  expect(await page.locator('.results .result').count()).toBeLessThanOrEqual(16)
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('vuepress-plume:mini-search-filter'))).toBe('Markdown')
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.results .result').nth(1)).toHaveClass(/\bselected\b/)
  await page.evaluate(() => document.documentElement.classList.add('mac'))
  await page.keyboard.press('Control+p')
  await expect(page.locator('.results .result').first()).toHaveClass(/\bselected\b/)
  await page.keyboard.press('Control+n')
  await expect(page.locator('.results .result').nth(1)).toHaveClass(/\bselected\b/)
  await page.keyboard.press('Escape')
  await expect(searchBox).toBeHidden()
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('')
  await page.keyboard.press('/')
  await expect(searchBox).toBeVisible()
  await expect(page.locator('.search-input')).toBeFocused()
  await page.goBack()
  await expect(searchBox).toBeHidden()
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('')
  await page.keyboard.press('Control+k')
  await expect(page.locator('.search-input')).toHaveValue('Markdown')
  await page.locator('.clear-button').click()
  await expect(page.locator('.search-input')).toHaveValue('')
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('vuepress-plume:mini-search-filter'))).toBeNull()
  await page.keyboard.press('Escape')

  await page.goto('/en/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.search-button')).toContainText('Search')
  await expect(page.locator('.vp-post-item').first().locator('.reading-time > span').nth(1)).toHaveText(/^About \d+ words$/)
  await expect(page.locator('.vp-post-item').first().locator('.reading-time > span').nth(2)).toHaveText(/^(?:Less than 1 minute|About \d+ min)$/)
  await page.locator('.search-button').click()
  await expect(page.locator('.search-keyboard-shortcuts')).toContainText('to navigate')
  await page.locator('.search-input').fill('Markdown')
  await expect(page.locator('.results .result').first()).toBeVisible()
  expect(await page.locator('.results .result').evaluateAll(links => links.every(link => link.getAttribute('href')?.startsWith('/en/')))).toBe(true)
  await page.keyboard.press('Escape')

  await page.goto('/blog/categories/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('[data-category-group]')).toHaveCount(4)
  await expect(page.locator('[data-category-id="e760f2"] > .folder')).toContainText('写作')
  await expect(page.locator('[data-category-id="3e30c5"] > .folder')).toContainText('基础')
  await expect(page.locator('.vp-post-categories')).not.toContainText('02.写作')
  await page.locator('[data-category-id="0941aa"] > .folder').click()
  await expect(page.locator('[data-category-id="3e30c5"]')).toBeHidden()
  await page.goto('/blog/categories/?id=3e30c5')
  await expect(page.locator('[data-category-id="0941aa"] > .folder')).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('[data-category-id="e760f2"] > .folder')).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('[data-category-id="3e30c5"] > .folder')).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('.vp-categories-item .post .vp-link.link').first()).toBeVisible()
  await expect(page.locator('.vp-posts-nav .vpi-chevron-right')).toHaveCount(3)
  await expect(page.locator('.vp-posts-nav .nav-link.active')).toHaveAttribute('href', '/blog/categories/')
  await expect(page.locator('.vp-posts-nav .nav-link').first()).toHaveClass(/\bvp-link\b.*\blink\b.*\bnav-link\b/)
  await expect(page.locator('.vp-posts-nav .icon-logo').first()).not.toHaveClass(/aside-nav-icon/)
  await page.goto('/blog/tags/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.tags-container')).toHaveCount(0)
  const markdownTag = page.locator('[data-tag="Markdown"]')
  const tagBackground = await markdownTag.evaluate(element => getComputedStyle(element).backgroundColor)
  await markdownTag.hover()
  await expect.poll(() => markdownTag.evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe(tagBackground)
  await markdownTag.click()
  await expect(page.locator('.tags-container')).toBeVisible()
  await expect(page.locator('.tag-title')).toHaveText('Markdown')
  await expect(page.locator('.tags-container .post-link').first()).toHaveClass(/\bvp-link\b.*\blink\b.*\bpost-link\b/)
  await page.goto('/blog/archives/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.archive-title').first()).toContainText('2026')
  await expect(page.locator('.archive .post-link').first()).toHaveClass(/\bvp-link\b.*\blink\b.*\bpost-link\b/)
  await page.waitForTimeout(500)
  expect(errors).toEqual([])
})

test('blog collection navigation keeps the shared profile aside mounted', async ({ page }) => {
  await page.goto('/blog/', { waitUntil: 'domcontentloaded' })
  const documentRequests: string[] = []
  page.on('request', request => { if (request.resourceType() === 'document' && request.frame() === page.mainFrame()) documentRequests.push(request.url()) })
  await page.evaluate(() => {
    ;(window as any).__ERMAOZI_HEADER__ = document.querySelector('.vp-navbar')
    ;(window as any).__ERMAOZI_PROFILE__ = document.querySelector('.vp-posts-aside')
  })
  const profileGeometry = await page.locator('.vp-posts-aside').evaluate(element => {
    const { x, y, width, height } = element.getBoundingClientRect()
    return { x, y, width, height }
  })

  await page.locator('.vp-posts-aside a[href="/blog/categories/"]').click()
  await expect(page).toHaveURL(/\/blog\/categories\/$/)
  await expect(page.locator('.vp-post-categories')).toBeVisible()
  await expect(page.locator('.vp-posts-aside a[href="/blog/categories/"]')).toHaveClass(/\bactive\b/)
  expect(await page.evaluate(() => (window as any).__ERMAOZI_HEADER__ === document.querySelector('.vp-navbar'))).toBe(true)
  expect(await page.evaluate(() => (window as any).__ERMAOZI_PROFILE__ === document.querySelector('.vp-posts-aside'))).toBe(true)
  expect(await page.locator('.vp-posts-aside').evaluate(element => {
    const { x, y, width, height } = element.getBoundingClientRect()
    return { x, y, width, height }
  })).toEqual(profileGeometry)
  expect(documentRequests).toEqual([])

  await page.locator('.vp-posts-aside a[href="/blog/tags/"]').click()
  await expect(page).toHaveURL(/\/blog\/tags\/$/)
  await page.locator('[data-tag="Markdown"]').click()
  await expect(page.locator('.tags-container')).toBeVisible()
  expect(documentRequests).toEqual([])

  await page.goBack()
  await expect(page).toHaveURL(/\/blog\/tags\/$/)
  await expect(page.locator('.tags-container')).toHaveCount(0)
  await page.goBack()
  await expect(page).toHaveURL(/\/blog\/categories\/$/)
  await expect(page.locator('.vp-post-categories')).toBeVisible()
  expect(await page.evaluate(() => (window as any).__ERMAOZI_PROFILE__ === document.querySelector('.vp-posts-aside'))).toBe(true)
})

test('blog collection navigation synchronizes desktop and mobile navbar active states', async ({ page }) => {
  await page.goto('/blog/archives/', { waitUntil: 'domcontentloaded' })
  const more = page.locator('.vp-navbar-menu-group').nth(1)
  const archives = more.locator('a[href="/blog/archives/"]')
  const blog = page.locator('.navbar-menu-link[href="/blog/"]')
  await expect(more).toHaveClass(/\bactive\b/)
  await expect(archives).toHaveClass(/\bactive\b/)

  await blog.click()
  await expect(page).toHaveURL(/\/blog\/$/)
  await expect(blog).toHaveClass(/\bactive\b/)
  await expect(more).not.toHaveClass(/\bactive\b/)
  await expect(archives).not.toHaveClass(/\bactive\b/)

  await page.goBack()
  await expect(page).toHaveURL(/\/blog\/archives\/$/)
  await expect(blog).toHaveClass(/\bactive\b/)
  await expect(more).toHaveClass(/\bactive\b/)
  await expect(archives).toHaveClass(/\bactive\b/)

  await page.setViewportSize({ width: 390, height: 900 })
  await page.locator('.vp-navbar-hamburger').click()
  const mobileBlog = page.locator('.vp-nav-screen-menu-link[href="/blog/"]')
  const mobileArchives = page.locator('.vp-nav-screen-menu-group-link[href="/blog/archives/"]')
  await expect(mobileArchives).toHaveClass(/\bactive\b/)
  await mobileBlog.click()
  await expect(page).toHaveURL(/\/blog\/$/)
  await expect(mobileBlog).toHaveClass(/\bactive\b/)
  await expect(mobileArchives).not.toHaveClass(/\bactive\b/)

  await page.goBack()
  await expect(page).toHaveURL(/\/blog\/archives\/$/)
  await expect(mobileBlog).toHaveClass(/\bactive\b/)
  await expect(mobileArchives).toHaveClass(/\bactive\b/)
})

test('post breadcrumbs preserve the complete category path', async ({ page }) => {
  await page.goto('/blog/content-guide/')
  const categoryLinks = page.locator('.vp-breadcrumb a[href*="/blog/categories/?id="]')
  await expect(categoryLinks).toHaveCount(3)
  await expect(categoryLinks).toHaveText(['指南', '写作', '基础'])
})

test('page reading-time frontmatter override preserves the remaining metadata', async ({ page }) => {
  await page.goto('/about/')
  await expect(page.locator('.vp-breadcrumb')).toHaveCount(0)
  await expect(page.locator('.vp-doc-aside')).toBeVisible()
  await expect(page.locator('.vp-doc-container > .container > .aside')).toHaveClass(/\bleft-aside\b/)
  await expect(page.locator('.vp-doc-container > .container > .aside')).toHaveCSS('order', '1')
  await expect(page.locator('.vp-doc-container > .container > .aside')).toHaveCSS('padding-right', '32px')
  await expect(page.locator('.vp-doc-aside-outline .root > li:has(> a[href="#设计目标"]) .outline-link[href="#适用场景"]')).toBeVisible()
  const columns = await page.evaluate(() => ({
    aside: document.querySelector('.vp-doc-container .aside')!.getBoundingClientRect().left,
    content: document.querySelector('.vp-doc-container > .container > .content')!.getBoundingClientRect().left,
  }))
  expect(columns.aside).toBeLessThan(columns.content)
  await expect(page.locator('.vp-doc-meta .reading-time')).toHaveCount(0)
  await expect(page.locator('.vp-doc-meta .tag')).toHaveCount(2)
  await expect(page.locator('.vp-doc-meta .tag').first()).toHaveJSProperty('tagName', 'SPAN')
  await expect(page.locator('.vp-doc-meta .vpi-tag.icon')).toHaveCount(1)
  await expect(page.locator('.vp-doc-meta .vpi-clock.icon')).toHaveCount(1)
  await expect(page.locator('.vp-doc-meta .create-time')).toBeVisible()
})

test('copyright preserves Plume licenses, locale labels, and live original URL', async ({ page }) => {
  await page.goto('/blog/getting-started/?giscus=callback&keep=1', { waitUntil: 'domcontentloaded' })
  const copyright = page.locator('.vp-doc-copyright')
  const source = copyright.locator('[data-copyright-original]')
  await expect(copyright).toContainText('版权归属：')
  await expect(copyright).toContainText('许可证：')
  await expect(source).toHaveText('http://127.0.0.1:4321/blog/getting-started/?keep=1')
  await expect(source).toHaveAttribute('href', 'http://127.0.0.1:4321/blog/getting-started/?keep=1')
  await expect(source).toHaveAttribute('target', '_blank')
  await expect(copyright.locator('.vpi-license-cc')).toHaveCount(1)
  await expect(copyright.locator('.vpi-license-by')).toHaveCount(1)

  await page.goto('/en/blog/getting-started/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.vp-doc-copyright')).toContainText('Copyright Ownership:')
  await expect(page.locator('.vp-doc-copyright')).toContainText('License under')
})

test('document footer follows sidebar order and browser date locale', async ({ page }) => {
  await page.goto('/docs/')
  await expect(page.locator('.vp-doc-footer .prev-next')).toHaveCount(0)

  await page.goto('/docs/guide/configuration/')
  await expect(page.locator('.pager-link.prev')).toHaveAttribute('href', '/docs/guide/getting-started/')
  await expect(page.locator('.pager-link.next')).toHaveAttribute('href', '/docs/guide/deployment/')

  await page.goto('/docs/guide/api/')
  await expect(page.locator('.pager-link.prev')).toHaveAttribute('href', '/docs/guide/deployment/')
  await expect(page.locator('.pager-link.next')).toHaveAttribute('href', '/docs/guide/content/')
  await expect(page.locator('.pager-link.next .vp-icon')).toBeVisible()

  await page.goto('/docs/guide/content/')
  await expect(page.locator('.pager-link.next')).toHaveAttribute('href', 'https://astro.build/')
  await expect(page.locator('.last-updated-time')).toHaveText('8/5/26, 8:00 AM')
})

test('article local outline matches Plume tablet and mobile behavior', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 900 })
  await page.goto('/blog/markdown-showcase/', { waitUntil: 'domcontentloaded' })
  const local = page.locator('.vp-local-nav.is-posts')
  await expect(local).toBeVisible()
  await expect(local.locator('.menu')).toBeHidden()
  await expect(local.locator('.menu')).toBeDisabled()
  await local.locator('.outline-toggle').click()
  await expect(local.locator('.items')).toBeVisible()
  await expect(local.locator('.outline-link[href="#文本与任务"]')).toHaveCount(1)
  await page.keyboard.press('Escape')
  await expect(local.locator('.items')).toBeHidden()
  await page.setViewportSize({ width: 1120, height: 900 })
  await expect(local).toBeHidden()
})

test('friends page preserves Plume groups, fields, themes, and responsive columns', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/friends/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveClass(/\blayout-friends\b/)
  await expect(page.locator('.vp-breadcrumb, .vp-doc-title, .vp-doc-aside')).toHaveCount(0)
  await expect(page.locator('.vp-friend')).toHaveCount(5)
  await expect(page.locator('.vp-friends-group > .title')).toHaveText('推荐项目')
  await expect(page.locator('.vp-friend .location')).toContainText('互联网')
  await expect(page.locator('.vp-friend .organization')).toContainText('开源社区')
  await expect(page.locator('.vp-friend .vp-social-link')).toHaveCount(1)
  await expect(page.locator('.vp-friend .title').first()).toHaveClass(/\bvp-link\b.*\blink\b.*\bno-icon\b.*\bvp-external-link-icon\b.*\btitle\b/)
  await expect(page.locator('.vp-friend .title').first()).toHaveCSS('font-size', '20px')
  await expect(page.locator('.vp-friend .title').first()).toHaveCSS('font-weight', '700')
  await expect(page.locator('.friends-list').first()).toHaveCSS('grid-template-columns', /.+ .+ .+/)
  const content = page.locator('.vp-doc.before')
  await expect(content).toContainText('申请友链')
  expect(await content.evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(await page.locator('.vp-friends > .title').evaluate(element => element.getBoundingClientRect().top))

  const themed = page.locator('.vp-friends-group .vp-friend').first()
  await expect(themed).toHaveCSS('background-color', 'rgb(234, 245, 248)')
  await page.locator('.vp-navbar-appearance .vp-switch').click()
  await expect(themed).toHaveCSS('background-color', 'rgb(24, 52, 63)')

  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('.friends-list').first()).toHaveCSS('grid-template-columns', /\d+(?:\.\d+)?px/)

  await page.goto('/en/friends/', { waitUntil: 'domcontentloaded' })
  const englishContent = page.locator('.vp-doc.after')
  expect(await englishContent.evaluate(element => element.getBoundingClientRect().top)).toBeGreaterThan(await page.locator('.vp-friends-group').evaluate(element => element.getBoundingClientRect().top))
})

test('page layout renders only the frozen standalone content shell', async ({ page }) => {
  for (const width of [1440, 820, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/page-layout/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('html')).toHaveClass(/\blayout-page\b/)
    await expect(page.locator('#VPContent > .vp-page > .vp-doc.plume-content')).toHaveCount(1)
    await expect(page.locator('.vp-page h1')).toHaveText('专页布局示例')
    await expect(page.locator('.vp-page h1')).toHaveCount(1)
    await expect(page.locator('.vp-doc-container, .vp-doc-title, .vp-doc-meta, .vp-breadcrumb, .vp-doc-aside, .vp-page-context-menu, [data-comment-provider]')).toHaveCount(0)
    await page.locator('.vp-navbar-appearance .vp-switch').first().evaluate(button => (button as HTMLButtonElement).click())
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(page.locator('.vp-page h1')).toHaveCSS('color', 'rgba(255, 255, 245, 0.86)')
    await page.locator('.vp-navbar-appearance .vp-switch').first().evaluate(button => (button as HTMLButtonElement).click())
  }
  await page.goto('/en/page-layout/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.vp-page h1')).toHaveText('Page layout example')
})

test('named page layouts render inside the Plume shell', async ({ page }) => {
  await page.goto('/custom-layout/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveClass(/\blayout-Minimal\b/)
  await expect(page.locator('.theme-plume.vp-layout > .global-protected > .vp-nav')).toBeVisible()
  await expect(page.locator('#VPContent > .custom-layout-example')).toContainText('自定义布局示例')
  await expect(page.locator('.vp-footer')).toBeVisible()
  await expect(page.locator('.vp-doc-container, .vp-doc-title, .vp-doc-meta, .vp-breadcrumb')).toHaveCount(0)
})

test('comment adapters lazy-load every frozen provider and provider stylesheet', async ({ page }) => {
  const assets = readdirSync('dist/_astro')
  const commentsModule = assets.find(file => /^Comments\..+\.js$/.test(file))!
  const runtimeModule = assets.find(file => /^runtime-dom\.esm-bundler\..+\.js$/.test(file))!
  const requested = new Set<string>()
  page.on('request', request => requested.add(new URL(request.url()).pathname))
  await page.route('https://comments.example/**', route => route.fulfill({ contentType: 'application/json', body: '{}' }))
  await page.route('https://giscus.app/**', route => route.abort())
  await page.goto('/about/', { waitUntil: 'domcontentloaded' })
  expect([...requested].some(path => /\/(?:waline|Artalk)\..+\.css$/.test(path))).toBe(false)
  await page.evaluate(async ({ commentsModule, runtimeModule }) => {
    const [{ default: Comments }, runtime] = await Promise.all([
      import(`/_astro/${commentsModule}`),
      import(`/_astro/${runtimeModule}`),
    ])
    const createApp = Object.values(runtime).find(value => typeof value === 'function' && value.toString().includes('.createApp(')) as (component: unknown, props: Record<string, unknown>) => { mount: (element: Element) => void }
    const configs = [
      { lang: 'en-US', config: { provider: 'Giscus', repo: 'owner/repo', repoId: 'repo-id', category: 'General', categoryId: 'category-id' } },
      { lang: 'en-US', config: { provider: 'Waline', serverURL: 'https://comments.example/waline', delay: 0 } },
      { lang: 'en-US', config: { provider: 'Waline', serverURL: 'https://comments.example/waline-off', pageview: false, delay: 0 } },
      { lang: 'en-US', config: { provider: 'Twikoo', envId: 'https://comments.example/twikoo', delay: 0 } },
      { lang: 'en-US', config: { provider: 'Artalk', server: 'https://comments.example/artalk', delay: 0 } },
      { lang: 'zh-TW', config: { provider: 'Giscus', repo: 'owner/repo', repoId: 'repo-id', category: 'General', categoryId: 'category-id' } },
    ]
    for (const { config, lang } of configs) {
      const host = document.body.appendChild(document.createElement('div'))
      createApp(Comments, { config, identifier: '/test-comments/', lang, site: 'ermaozi', title: 'Comments' }).mount(host)
    }
  }, { commentsModule, runtimeModule })

  await expect(page.locator('[data-comment-provider]')).toHaveCount(6)
  for (const provider of ['Giscus', 'Waline', 'Twikoo', 'Artalk']) {
    await expect(page.locator(`[data-comment-provider="${provider}"]`).first()).toBeVisible()
    await expect(page.locator(`[data-comment-provider="${provider}"]`).first()).toHaveCSS('margin-top', '80px')
  }
  for (const provider of ['Giscus', 'Waline', 'Twikoo']) {
    await expect(page.locator(`[data-comment-provider="${provider}"]`).first()).toHaveAttribute('id', 'comment')
  }
  await expect(page.locator('[data-comment-provider="Artalk"]')).not.toHaveAttribute('id', /.+/)
  await expect(page.locator('[data-comment-provider="Giscus"]').first()).toHaveClass('giscus-wrapper input-top vp-comment')
  await expect(page.locator('[data-comment-provider="Giscus"] giscus-widget')).toHaveCount(2)
  await expect.poll(() => page.locator('giscus-widget').first().evaluate(element => (element as HTMLElement & { lang?: string }).lang)).toBe('en')
  await expect.poll(() => page.locator('giscus-widget').first().evaluate(element => (element as HTMLElement & { theme?: string }).theme)).toBe('light')
  await expect.poll(() => page.locator('giscus-widget').nth(1).evaluate(element => (element as HTMLElement & { lang?: string }).lang)).toBe('zh-TW')
  await page.locator('.vp-navbar-appearance .vp-switch').click()
  await expect.poll(() => page.locator('giscus-widget').first().evaluate(element => (element as HTMLElement & { theme?: string }).theme)).toBe('dark')
  await expect.poll(() => [...requested].some(path => /\/giscus\..+\.js$/.test(path))).toBe(true)
  await expect.poll(() => [...requested].some(path => /\/slim\..+\.js$/.test(path))).toBe(true)
  await expect.poll(() => [...requested].some(path => /\/twikoo\.all\.min\..+\.js$/.test(path))).toBe(true)
  await expect.poll(() => [...requested].some(path => /\/Artalk\..+\.js$/.test(path))).toBe(true)
  await expect.poll(() => [...requested].some(path => /\/waline\..+\.css$/.test(path))).toBe(true)
  await expect.poll(() => [...requested].some(path => /\/Artalk\..+\.css$/.test(path))).toBe(true)
  await expect.poll(() => [...requested].some(path => path === '/waline/api/article')).toBe(true)
  expect([...requested].some(path => path === '/waline-off/api/article')).toBe(false)
})

test('Algolia DocSearch preserves Plume lazy loading, locale facets, and keyboard UI', async ({ page }) => {
  const assets = readdirSync('dist/_astro')
  const algoliaModule = assets.find(file => /^AlgoliaSearch\..+\.js$/.test(file))!
  const runtimeModule = assets.find(file => /^runtime-dom\.esm-bundler\..+\.js$/.test(file))!
  const moduleCode = await import('node:fs/promises').then(({ readFile }) => readFile(`dist/_astro/${algoliaModule}`, 'utf8'))
  const stylesheet = moduleCode.match(/\/(?:_astro\/)?[^`"']+\.css/)?.[0]
  const requested = new Set<string>()
  const searches: string[] = []
  page.on('request', request => requested.add(new URL(request.url()).pathname))
  await page.route(/https:\/\/[^/]*(?:algolia\.net|algolianet\.com)\//, async (route) => {
    const body = route.request().postDataJSON() as { requests?: unknown[] } | null
    if (body) searches.push(JSON.stringify(body))
    await route.fulfill({
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify({
        results: Array.from({ length: body?.requests?.length ?? 1 }, () => ({
          hits: [], nbHits: 0, page: 0, nbPages: 0, hitsPerPage: 5, processingTimeMS: 1, query: '', params: '',
        })),
      }),
    })
  })
  await page.goto('/about/', { waitUntil: 'domcontentloaded' })
  if (stylesheet) expect(requested.has(stylesheet)).toBe(false)

  await page.evaluate(async ({ algoliaModule, runtimeModule }) => {
    const [{ default: AlgoliaSearch }, runtime] = await Promise.all([
      import(`/_astro/${algoliaModule}`),
      import(`/_astro/${runtimeModule}`),
    ])
    const createApp = Object.values(runtime).find(value => typeof value === 'function' && value.toString().includes('.createApp(')) as (component: unknown, props: Record<string, unknown>) => { mount: (element: Element) => void }
    const host = document.body.appendChild(document.createElement('div'))
    createApp(AlgoliaSearch, {
      lang: 'en-US',
      localePath: '/en/',
      options: {
        appId: 'test',
        apiKey: 'public-search-key',
        indexName: 'docs',
        locales: { '/en/': { translations: { button: { buttonText: 'Search docs', buttonAriaLabel: 'Search documentation' } } } },
      },
    }).mount(host)
  }, { algoliaModule, runtimeModule })

  const placeholder = page.locator('.docsearch-placeholder .DocSearch-Button')
  await expect(placeholder).toHaveText(/Search docs/)
  await expect(placeholder).toHaveAttribute('aria-label', 'Search documentation')
  if (stylesheet) await expect.poll(() => requested.has(stylesheet)).toBe(true)
  await placeholder.click()
  await expect(page.locator('.DocSearch-Modal')).toBeVisible()
  await page.locator('.DocSearch-Input').fill('Astro')
  await expect.poll(() => searches.some(body => body.includes('lang:en-US'))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(page.locator('.DocSearch-Modal')).toBeHidden()
})

test('mobile posts profile opens, locks scrolling, and closes from the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/blog/')
  const button = page.locator('.vp-posts-extract')
  const modal = page.locator('.posts-modal')
  await expect(button).toBeVisible()
  await expect(button).toHaveJSProperty('tagName', 'DIV')
  await expect(button.locator('.vpi-posts-ext')).toHaveClass(/\bicon\b/)
  await expect(modal).toBeHidden()
  await button.click()
  await expect(button).toHaveAttribute('aria-expanded', 'true')
  await expect(modal).toBeVisible()
  await expect(modal.locator('.posts-modal-container')).toHaveClass(/\bopen\b/)
  await expect(modal.locator('.profile h3')).toHaveText('ermaozi')
  await expect(modal.locator('.profile-location')).toContainText('Internet')
  await expect(modal.locator('.profile-organization')).toContainText('Open source community')
  await expect(modal.locator('.posts-nav .nav-link')).toHaveCount(3)
  await expect(modal.locator('.posts-nav')).toHaveJSProperty('tagName', 'DIV')
  await expect(modal.locator('.posts-nav .nav-link').first()).toHaveClass(/\bvp-link\b.*\blink\b.*\bno-icon\b.*\bnav-link\b/)
  await expect(modal.locator('.posts-nav .nav-link .icon')).toHaveCount(3)
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')
  await page.keyboard.press('Escape')
  await expect(modal).toBeHidden()
  await expect(button).toHaveAttribute('aria-expanded', 'false')
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('')
  await button.focus()
  await page.keyboard.press('Space')
  await expect(modal).toBeVisible()
  await page.keyboard.press('Escape')

  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(button).toBeHidden()
  await expect(page.locator('.vp-posts-aside .vp-profile')).toBeVisible()
  await expect(page.locator('.vp-profile > p')).toHaveClass(/\bcircle\b/)
  await expect(page.locator('.vp-profile > p img')).toHaveCSS('border-radius', '50%')
})

test('home navbar leaves the top state after scrolling', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const navbar = page.locator('.vp-navbar')
  await expect(navbar).toHaveClass(/\btop\b/)
  await page.evaluate(() => scrollTo(0, 400))
  await expect(navbar).not.toHaveClass(/\btop\b/)
})

test('homepage and blog default to 15 posts per page', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.vp-post-list > .vp-post-item')).toHaveCount(5)
  await expect(page.locator('.vp-pagination')).toHaveCount(0)

  await page.goto('/blog/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.vp-post-list > .vp-post-item')).toHaveCount(5)
  await expect(page.locator('.vp-pagination')).toHaveCount(0)
  await expect(page.locator('.vp-post-item h3 .vp-link').first()).toHaveClass('vp-link link')
  await expect(page.locator('.vp-post-item .reading-time .icon').first()).toHaveClass('vpi-books icon')
  await expect(page.locator('.vp-post-item .tag-list .tag').first()).toHaveClass(/^vp-link link tag \S+$/)
  const item = page.locator('.vp-post-item:has(a[href="/blog/web-performance-basics/"])')
  await expect(item).toHaveCount(1)
  await expect(item.locator('h3 a')).toHaveText('静态站点性能检查清单')
  await expect(item.locator('.post-cover')).toBeVisible()
  await expect(item.locator('.post-meta > .category-list')).toBeVisible()
  await expect(item.locator('.post-meta > .reading-time')).toBeVisible()
  await expect(item.locator('.post-meta > .tag-list .tag')).toHaveCount(3)
  await expect(item.locator('.post-meta > .create-time')).toBeVisible()
  await expect(item).toHaveClass('vp-post-item has-cover right')
  await expect(item.locator('.post-cover > .vp-link')).toHaveClass('vp-link link')
  await expect(item.locator('h3 .vp-link')).toHaveClass('vp-link link')
  await expect(item.locator('.reading-time .icon')).toHaveClass('vpi-books icon')
  await expect(item.locator('.tag-list .tag').first()).toHaveClass(/^vp-link link tag \S+$/)
})

test('repository cards render provider data and reuse the Plume cache', async ({ page }) => {
  const endpoint = 'https://api.pengzhanbo.cn/github/repo/pengzhanbo/vuepress-theme-plume'
  const giteeEndpoint = 'https://api.pengzhanbo.cn/gitee/repo/example/theme'
  await page.route(endpoint, route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({
      name: 'vuepress-theme-plume',
      fullName: 'pengzhanbo/vuepress-theme-plume',
      description: 'A feature-rich VuePress theme.',
      url: 'https://github.com/pengzhanbo/vuepress-theme-plume',
      stars: 1840,
      forks: 126,
      language: 'TypeScript',
      languageColor: '#3178c6',
      archived: false,
      visibility: 'Public',
      template: false,
      ownerType: 'User',
      license: { name: 'MIT', url: 'https://opensource.org/license/mit' },
    }),
  }))
  await page.route(giteeEndpoint, route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({
      name: 'theme',
      fullName: 'example/theme',
      description: 'An archived template.',
      url: 'https://gitee.com/example/theme',
      stars: 999,
      forks: 1000,
      language: '',
      languageColor: '',
      archived: true,
      visibility: 'Public',
      template: true,
      ownerType: 'Organization',
      license: null,
    }),
  }))
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  const card = page.locator('[data-repo-card]')
  await expect(card).toBeVisible()
  await expect(card.locator('.repo-link')).toHaveText('vuepress-theme-plume')
  await expect(card.locator('.repo-visibility')).toHaveText('Public')
  await expect(card.locator('.repo-info p')).toHaveCount(4)
  await expect(card.locator('.vpi-github-star + span')).toHaveText('1.8k')

  await page.evaluate(() => {
    const group = document.createElement('div')
    group.innerHTML = '<div class="vp-repo-card" data-repo-card data-repo="example/theme" data-provider="gitee" hidden></div><div class="vp-repo-card" data-repo-card data-repo="example/theme" data-provider="gitee" data-fullname="false" hidden></div>'
    document.querySelector('.vp-doc')?.append(group)
    group.dispatchEvent(new CustomEvent('plume-content-updated', { bubbles: true }))
  })
  const gitee = page.locator('[data-repo="example/theme"]')
  await expect(gitee).toHaveCount(2)
  await expect(gitee.first()).toBeVisible()
  await expect(gitee.first().locator('.repo-link')).toHaveText('example/theme')
  await expect(gitee.nth(1).locator('.repo-link')).toHaveText('theme')
  await expect(gitee.first().locator('.repo-name > span').first()).toHaveClass('vpi-gitee-repo')
  await expect(gitee.first().locator('.repo-visibility')).toHaveText('Public Template archive')
  await expect(gitee.first().locator('.repo-visibility')).toHaveClass('repo-visibility archived')
  await expect(gitee.first().locator('.repo-info p')).toHaveCount(2)
  await expect(gitee.first().locator('.vpi-github-fork + span')).toHaveText('1.0k')

  await page.unroute(endpoint)
  await page.route(endpoint, route => route.abort())
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('[data-repo-card] .repo-link')).toHaveText('vuepress-theme-plume')
})

test('caniuse embeds follow theme and trusted resize messages', async ({ page }) => {
  await page.route('https://caniuse.pengzhanbo.cn/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Can I Use</title>' }))
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  const embed = page.locator('[data-caniuse]').first()
  const frame = embed.locator('iframe')
  const legacy = page.locator('[data-caniuse]').nth(1)
  await expect(embed).toHaveClass(/\bbaseline\b/)
  await expect(frame).toHaveAttribute('src', /css-matches-pseudo\/baseline#meta=.*theme=light$/)
  await expect(legacy.locator('iframe')).toHaveAttribute('src', /css-container-queries#past=2&future=1&meta=.*theme=light$/)
  const payload = await embed.evaluate(element => ({ feature: element.dataset.feature, meta: element.dataset.meta, height: 221.2 }))
  await page.evaluate(payload => dispatchEvent(new MessageEvent('message', {
    origin: 'https://caniuse.pengzhanbo.cn',
    data: { type: 'ciu-embed', payload },
  })), payload)
  await expect(frame).toHaveCSS('height', '222px')

  await page.locator('.vp-navbar-appearance .vp-switch').click()
  await expect(frame).toHaveAttribute('src', /theme=dark$/)
})

test('image preview preserves the frozen PhotoSwipe gallery and controls', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(document, 'fullscreenEnabled', { configurable: true, value: true })
    Element.prototype.requestFullscreen = function () { this.setAttribute('data-fullscreen-requested', 'true'); return Promise.resolve() }
    document.exitFullscreen = () => Promise.resolve()
  })
  await page.goto('/docs/guide/api/', { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => {
    const gallery = document.createElement('div')
    gallery.innerHTML = [
      '<img data-photo-matrix="red" alt="Red" src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2220%22%3E%3Crect width=%2240%22 height=%2220%22 fill=%22red%22/%3E%3C/svg%3E">',
      '<img data-photo-matrix="blue" alt="Blue" src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2220%22%3E%3Crect width=%2240%22 height=%2220%22 fill=%22blue%22/%3E%3C/svg%3E">',
      '<img data-photo-matrix="ignored" class="ignore" alt="Ignored" src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2220%22%3E%3Crect width=%2240%22 height=%2220%22 fill=%22gray%22/%3E%3C/svg%3E">',
    ].join('')
    document.querySelector('.vp-doc')?.append(gallery)
  })
  const red = page.locator('[data-photo-matrix="red"]')
  const blue = page.locator('[data-photo-matrix="blue"]')
  const ignored = page.locator('[data-photo-matrix="ignored"]')
  await expect(ignored).toHaveCSS('cursor', 'auto')
  await red.click()
  const viewer = page.locator('.pswp')
  await expect(viewer).toBeVisible()
  await expect(viewer.locator('.pswp__button--close')).toHaveAttribute('aria-label', '关闭')
  await expect(viewer.locator('.pswp__button--zoom')).toHaveAttribute('aria-label', '缩放')
  const eligible = await page.locator('.vp-doc :not(a) > img:not([no-view],.no-view,.ignore)').count()
  await expect(viewer.locator('.photo-swipe-bullet')).toHaveCount(eligible)
  const download = viewer.locator('.pswp__button--download')
  await expect(download).toHaveAttribute('download', '')
  await expect(download).toHaveAttribute('href', await red.getAttribute('src') ?? '')
  await viewer.locator('.pswp__button--arrow--next').click()
  await expect(viewer.locator('.pswp__counter')).toContainText('2 /')
  await expect(download).toHaveAttribute('href', await blue.getAttribute('src') ?? '')
  const fullscreen = viewer.locator('.pswp__button--fullscreen')
  await fullscreen.click()
  await expect(viewer).toHaveAttribute('data-fullscreen-requested', 'true')
  await page.waitForTimeout(500)
  await page.mouse.wheel(0, 120)
  await expect(viewer).toHaveCount(0)
  await ignored.click()
  await expect(page.locator('.pswp')).toHaveCount(0)
  await red.click()
  await expect(page.locator('.pswp')).toBeVisible()
  await page.waitForTimeout(500)
  await page.keyboard.press('Escape')
  await expect(page.locator('.pswp')).toHaveCount(0)
})

test('swiper keeps every Plume effect, mode, control, and theme behavior', async ({ page }) => {
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  const swiper = page.locator('.vp-swiper').first()
  await expect(swiper).toHaveAttribute('data-swiper-ready', 'true')
  await expect(swiper.locator('.swiper-slide')).toHaveCount(3)
  await expect(swiper).toHaveClass(/swiper-fade/)
  await expect(swiper.locator('.swiper-pagination-bullet')).toHaveCount(3)
  await expect(swiper.locator('.swiper-slide-active img')).toHaveAttribute('src', /slide=1/)
  await swiper.locator('.swiper-button-next').click()
  await expect(swiper.locator('.swiper-slide-active img')).toHaveAttribute('src', /slide=2/)

  await page.evaluate(() => {
    const root = document.createElement('section')
    root.dataset.swiperMatrix = 'true'
    const base = {
      mode: 'banner', effect: 'slide', navigation: true, delay: 3000, speed: 300, loop: true,
      pauseOnMouseEnter: false, swipe: true, mousewheel: false, slidesPerView: 1, spaceBetween: 0,
    }
    const cases = [
      ...['slide', 'cube', 'coverflow', 'flip', 'cards'].map(effect => ({ name: effect, ...base, effect })),
      { name: 'creative', ...base, effect: 'creative', creativeEffect: { prev: { shadow: true, translate: [0, 0, -400] }, next: { translate: ['100%', 0, 0] } } },
      { name: 'carousel', ...base, mode: 'carousel', speed: 5500, slidesPerView: 3, spaceBetween: 20 },
      { name: 'carousel-pause', ...base, mode: 'carousel', pauseOnMouseEnter: true, slidesPerView: 3, spaceBetween: 20 },
      { name: 'broadcast', ...base, mode: 'broadcast', mousewheel: true, slidesPerView: 3, spaceBetween: 20 },
    ]
    root.innerHTML = cases.map(options => {
      const controls = options.mode === 'carousel' ? '' : '<div class="swiper-button-prev"></div><div class="swiper-button-next"></div><div class="swiper-pagination"></div>'
      const slides = [1, 2, 3, 4, 5, 6, 7].map(index => `<div class="swiper-slide"><img class="swiper-slide-img" src="/img/logo.svg?matrix=${options.name}-${index}" alt="${options.name} ${index}" loading="lazy"></div>`).join('')
      return `<div class="swiper vp-swiper${options.mode === 'carousel' ? ' swiper-no-swiping' : ''}" style="width:100%;height:200px" data-swiper-case="${options.name}" data-swiper-options='${JSON.stringify(options)}'><div class="swiper-wrapper">${slides}</div>${controls}</div>`
    }).join('')
    document.querySelector('.vp-doc')?.append(root)
    root.dispatchEvent(new CustomEvent('plume-content-updated', { bubbles: true }))
  })
  const matrix = page.locator('[data-swiper-matrix] [data-swiper-case]')
  await expect(matrix).toHaveCount(9)
  await expect.poll(() => matrix.evaluateAll(elements => elements.every(element => (element as HTMLElement).dataset.swiperReady === 'true'))).toBe(true)
  const state = await matrix.evaluateAll(elements => elements.map(element => {
    const node = element as HTMLElement & { swiper?: any }
    const instance = node.swiper
    return {
      name: node.dataset.swiperCase,
      effect: instance?.params.effect,
      slidesPerView: instance?.params.slidesPerView,
      spaceBetween: instance?.params.spaceBetween,
      speed: instance?.params.speed,
      allowTouchMove: instance?.params.allowTouchMove,
      autoplay: Boolean(instance?.autoplay?.running),
      mousewheel: Boolean(instance?.mousewheel?.enabled),
      bullets: node.querySelectorAll('.swiper-pagination-bullet').length,
      navigation: Boolean(node.querySelector('.swiper-button-next')),
      creativeTranslate: instance?.params.creativeEffect?.next?.translate,
      classes: node.className,
    }
  }))
  for (const effect of ['slide', 'cube', 'coverflow', 'flip', 'cards', 'creative']) {
    const item = state.find(entry => entry.name === effect)
    expect(item?.effect).toBe(effect)
    expect(item?.classes).toContain(effect === 'slide' ? 'swiper-initialized' : `swiper-${effect}`)
    expect(item?.bullets).toBe(7)
    expect(item?.navigation).toBe(true)
    expect(item?.autoplay).toBe(true)
  }
  expect(state.find(entry => entry.name === 'creative')?.creativeTranslate).toEqual(['100%', 0, 0])
  expect(state.find(entry => entry.name === 'carousel')).toMatchObject({ effect: 'slide', slidesPerView: 3, spaceBetween: 20, speed: 5500, allowTouchMove: true, bullets: 0, navigation: false, autoplay: true })
  expect(state.find(entry => entry.name === 'broadcast')).toMatchObject({ effect: 'slide', slidesPerView: 3, spaceBetween: 20, allowTouchMove: true, bullets: 7, navigation: true, autoplay: false, mousewheel: true })

  const pausedCase = page.locator('[data-swiper-case="carousel-pause"]')
  await pausedCase.dispatchEvent('mouseenter')
  await expect.poll(() => pausedCase.evaluate((element: HTMLElement & { swiper?: any }) => Boolean(element.swiper?.autoplay?.running))).toBe(false)
  await pausedCase.dispatchEvent('mouseleave')
  await expect.poll(() => pausedCase.evaluate((element: HTMLElement & { swiper?: any }) => Boolean(element.swiper?.autoplay?.running))).toBe(true)

  const carousel = page.locator('[data-swiper-case="carousel"]')
  expect(await carousel.evaluate((element: HTMLElement & { swiper?: any }) => new Promise<boolean>(resolve => {
    const wrapper = element.swiper?.wrapperEl as HTMLElement | undefined
    element.swiper?.autoplay?.stop()
    if (!wrapper) return resolve(false)
    wrapper.style.transform = 'translate3d(-123px, 0px, 0px)'
    const observer = new MutationObserver(() => {
      if (wrapper.style.transform === 'translate3d(0px, 0px, 0px)') {
        observer.disconnect()
        resolve(true)
      }
    })
    observer.observe(wrapper, { attributes: true, attributeFilter: ['style'] })
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    setTimeout(() => { observer.disconnect(); resolve(false) }, 2000)
  }))).toBe(true)
})

test('chat containers preserve senders, dates, self messages, and Markdown', async ({ page }) => {
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  const chat = page.locator('.vp-chat')
  await expect(chat.locator('.vp-chat-title')).toHaveText('主题讨论')
  await expect(chat.locator('.vp-chat-date')).toHaveCount(2)
  await expect(chat.locator('.vp-chat-message')).toHaveCount(3)
  await expect(chat.locator('.vp-chat-message.self')).toHaveCount(1)
  await expect(chat.locator('.vp-chat-username')).toHaveText(['访客', '访客'])
  await expect(chat.locator('.message-content strong')).toHaveText('Markdown')
})

test('normal code demos isolate output and toggle source tabs', async ({ page }) => {
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  const demo = page.locator('[data-demo]').first()
  await expect(demo).toHaveAttribute('data-demo-ready', 'true')
  const frame = demo.locator('iframe').contentFrame()
  const button = frame.locator('#demo-button')
  await expect(button).toHaveText('点击 0')
  await expect(button).toHaveCSS('background-color', 'rgb(51, 111, 135)')
  await button.click()
  await expect(button).toHaveText('点击 1')
  const toggle = demo.locator('[aria-label="Toggle Code"]')
  await expect(demo.locator('.demo-code')).toBeHidden()
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(demo.locator('.demo-code')).toBeVisible()
  await expect(demo.locator('.vp-tab-nav')).toHaveCount(3)
})

test('demo matrix supports files, resources, Vue SFCs, Markdown, and playground forms', async ({ page }) => {
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })

  const normal = page.locator('[data-demo]').nth(1)
  await expect(normal).toHaveAttribute('data-demo-ready', 'true')
  await expect(normal.locator('form[action="https://codepen.io/pen/define"]')).toHaveCount(1)
  await expect(normal.locator('form[action="https://jsfiddle.net/api/post/library/pure/"] input[name="panel_js"]')).toHaveValue('4')
  const codepen = JSON.parse(await normal.locator('input[name="data"]').inputValue())
  expect(codepen.js_pre_processor).toBe('typescript')
  expect(codepen.js_external).toBe('/demo/demo-lib.js')
  const resourcesButton = normal.locator('.demo-resources-toggle')
  await expect(normal.locator('.demo-resources-container')).toBeHidden()
  await resourcesButton.click()
  await expect(resourcesButton).toHaveAttribute('aria-expanded', 'true')
  await expect(normal.locator('.demo-resources-container a')).toHaveText(['demo-lib.js', 'demo-lib.css'])
  const normalFrame = normal.locator('iframe').contentFrame()
  await expect(normalFrame.locator('#demo-resource-value')).toHaveText('yes')
  await expect(normalFrame.locator('#embedded-normal-demo')).toHaveCSS('box-shadow', /rgb\(51, 111, 135\)/)

  const vueDemos = page.locator('[data-vue-demo]')
  await expect(vueDemos).toHaveCount(2)
  await expect(vueDemos.first()).toHaveAttribute('data-demo-ready', 'true')
  await expect(vueDemos.nth(1)).toHaveAttribute('data-demo-ready', 'true')
  const inlineCounter = vueDemos.first().locator('#inline-vue-count')
  await expect(inlineCounter).toHaveText('内联计数 0')
  await expect(inlineCounter).toHaveCSS('border-top-color', 'rgb(51, 111, 135)')
  await expect(inlineCounter).toHaveCSS('border-top-width', '2px')
  expect(await inlineCounter.evaluate(element => [...element.attributes].some(attribute => attribute.name.startsWith('data-v-')))).toBe(true)
  await inlineCounter.click()
  await expect(inlineCounter).toHaveText('内联计数 1')
  const embeddedCounter = vueDemos.nth(1).locator('#embedded-vue-count')
  await expect(embeddedCounter.locator('#nested-vue-count')).toHaveText('Vue count 0')
  await embeddedCounter.click()
  await expect(embeddedCounter).toHaveText('Vue count 1')

  const markdownDemos = page.locator('[data-basic-demo]')
  await expect(markdownDemos).toHaveCount(2)
  await expect(markdownDemos.first().locator('.demo-draw h4')).toHaveText('Markdown 渲染结果')
  await expect(markdownDemos.nth(1).locator('.demo-draw strong')).toHaveText('Markdown demo')
  const markdownToggle = markdownDemos.first().locator('[aria-label="Toggle Code"]')
  await markdownToggle.click()
  await expect(markdownDemos.first().locator('.demo-code')).toBeVisible()
  await expect(markdownDemos.first().locator('.demo-code .language-md')).toHaveCount(1)
})

test('math uses Plume default KaTeX output for inline and display formulas', async ({ page }) => {
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.katex')).toHaveCount(2)
  await expect(page.locator('.katex-display')).toHaveCount(1)
  await expect(page.locator('.katex .katex-mathml math')).toHaveCount(2)
  await expect(page.locator('.katex-display .mfrac').first()).toBeVisible()
  const twoslash = page.locator('pre.twoslash')
  await expect(twoslash).toHaveCount(1)
  await expect(twoslash.locator('.twoslash-query-persisted')).toHaveCount(1)
  await expect(twoslash.locator('.twoslash-popup-code').first()).toContainText('readonly')
  const persisted = twoslash.locator('.twoslash-query-persisted .twoslash-popup-container')
  await expect(persisted).toHaveCSS('position', 'absolute')
  await expect(persisted).toHaveCSS('opacity', '1')
  await expect(persisted).toHaveCSS('pointer-events', 'auto')
  const hover = twoslash.locator('.twoslash-hover:not(.twoslash-query-persisted)').first()
  const popup = hover.locator('.twoslash-popup-container')
  await expect(popup).toHaveCSS('opacity', '0')
  await expect(popup).toHaveCSS('pointer-events', 'none')
  await persisted.evaluate(element => { (element as HTMLElement).style.display = 'none' })
  await expectHoveredCss(hover, 'opacity', '1')
  await expectHoveredCss(hover, 'pointer-events', 'auto')
})

test('include, imported code, and npm-to keep the frozen rendered contracts', async ({ page }) => {
  await page.goto('/blog/markdown-showcase/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('#被引入的-markdown')).toBeVisible()
  await expect(page.locator('.vp-doc')).not.toContainText('include-env')

  const imported = page.locator('#文件引入与代码导入').locator('xpath=following-sibling::div[contains(@class,"language-javascript")][1]')
  await expect(imported).toBeVisible()
  await expect(imported.locator('.line')).toHaveCount(4)
  await expect(imported.locator('.line.highlighted')).toHaveCount(1)
  await expect(imported).toContainText("export const theme = 'ermaozi'")
  await expect(imported).toContainText("export const output = 'dist'")
  await expect(imported.locator('xpath=parent::*')).not.toHaveClass(/code-block-title/)

  const npmTo = page.locator('.vp-code-tabs[data-tab-id="npm-to-pnpm-yarn-npm"]')
  const tabs = npmTo.locator('.vp-code-tab-nav')
  await expect(tabs).toHaveCount(3)
  expect(await tabs.evaluateAll(elements => elements.map(element => element.getAttribute('data-tab-value')))).toEqual(['pnpm', 'yarn', 'npm'])
  await expect(tabs.locator('.vp-icon svg')).toHaveCount(3)
  await expect(npmTo.locator('.vp-code-tab.active')).toContainText('pnpm add --save-dev astro')
  await tabs.nth(2).click()
  await expect(npmTo.locator('.vp-code-tab.active')).toContainText('npm install astro --save-dev')
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('VUEPRESS_CODE_TAB_STORE') || '{}')['npm-to-pnpm-yarn-npm'])).toBe('npm')
})

test('KaTeX copy mode writes the selected TeX source', async ({ page }) => {
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  const copied = await page.locator('.katex').first().evaluate(element => {
    const range = document.createRange()
    range.selectNode(element)
    const selection = getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
    const clipboard = new DataTransfer()
    document.dispatchEvent(new ClipboardEvent('copy', { bubbles: true, cancelable: true, clipboardData: clipboard }))
    selection?.removeAllRanges()
    return clipboard.getData('text/plain')
  })
  expect(copied).toContain('$e^{i\\pi}+1=0$')
})

test('external code embeds preserve Plume URLs, options, theme sync, and sandboxing', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('vuepress-theme-appearance', 'light'))
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  const codepen = page.locator('[data-code-embed="codepen"]')
  const fiddle = page.locator('[data-code-embed="jsfiddle"]')
  const sandbox = page.locator('.code-sandbox-iframe')
  const replit = page.locator('[data-code-embed="replit"]')
  await expect(codepen).toHaveAttribute('src', /codepen\.io\/leimapapa\/embed\/RwOZQOW\?.*default-tab=html%2Cresult.*theme-id=light/)
  await expect(fiddle).toHaveAttribute('src', /jsfiddle\.net\/zalun\/NmudS\/embedded\/result,js\/$/)
  await expect(sandbox).toHaveAttribute('src', /codesandbox\.io\/embed\/5wyzu\?.*module=src%252Findex\.js.*view=Editor%2BPreview.*hidenavigation=1/)
  await expect(sandbox).toHaveAttribute('sandbox', /allow-scripts/)
  await expect(page.locator('.code-sandbox-link')).toHaveAttribute('href', /codesandbox\.io\/p\/sandbox\/reaction-5wyzu\?from-embed=/)
  await expect(replit).toHaveAttribute('src', /replit\.com\/%40TechPandaPro\/Cursor-Hangout\?.*theme=light.*file=package\.json/)
  await page.locator('.vp-navbar-appearance .vp-switch').click()
  await expect(codepen).toHaveAttribute('src', /theme-id=dark/)
  await expect(fiddle).toHaveAttribute('src', /\/dark\/$/)
  await expect(replit).toHaveAttribute('src', /theme=dark/)
})

test('Go, Kotlin, Rust, and Python REPLs preserve Plume execution contracts', async ({ page }) => {
  let goCode = ''
  let kotlinCode = ''
  let rustCode = ''
  await page.route('https://api.pengzhanbo.cn/repl/golang/run', async route => {
    goCode = JSON.parse(route.request().postData() ?? '{}').code
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ version: '1.24', events: [{ kind: 'stdout', message: 'Hello Go\n', delay: 0 }] }) })
  })
  await page.route('https://api.pengzhanbo.cn/repl/kotlin/run', async route => {
    kotlinCode = JSON.parse(route.request().postData() ?? '{}').files?.[0]?.text
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ version: '2.2', text: 'Hello Kotlin\n', errors: {} }) })
  })
  await page.route('https://cdn.jsdelivr.net/pyodide/v314.0.2/full/pyodide.js', route => route.fulfill({
    contentType: 'text/javascript',
    body: `globalThis.loadPyodide = async () => ({
      setStdout(options) { this.stdout = options.batched },
      runPython(code) { this.stdout('Hello Python'); return code.includes('result') ? '42' : '' }
    })`,
  }))
  await page.routeWebSocket('wss://play.rust-lang.org/websocket', socket => {
    socket.onMessage(raw => {
      const message = JSON.parse(String(raw))
      if (message.type === 'websocket/connected') socket.send(JSON.stringify({ type: 'websocket/connected' }))
      if (message.type === 'output/execute/wsExecuteRequest') {
        rustCode = message.payload.code
        const meta = { sequenceNumber: message.meta.sequenceNumber }
        socket.send(JSON.stringify({ type: 'output/execute/wsExecuteBegin', meta, payload: {} }))
        socket.send(JSON.stringify({ type: 'output/execute/wsExecuteStdout', meta, payload: 'Hello Rust\n' }))
        socket.send(JSON.stringify({ type: 'output/execute/wsExecuteEnd', meta, payload: { success: true } }))
      }
    })
  })

  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  const repls = page.locator('[data-code-repl]')
  await expect(repls).toHaveCount(4)
  expect(await repls.evaluateAll(elements => elements.map(element => element.getAttribute('data-repl-ready')))).toEqual(['true', 'true', 'true', 'true'])
  expect(JSON.parse(await page.locator('html').getAttribute('data-repl-theme') || '{}')).toEqual({ light: 'github-light', dark: 'github-dark' })

  const go = repls.filter({ has: page.locator('[class*="language-go"]') })
  await go.locator('textarea').fill('package main\nfunc main() {}')
  await expect.poll(() => go.locator('code').innerHTML(), { timeout: 15_000 }).toContain('--shiki-light')
  await expect(go.locator('code')).toContainText('func main() {}')
  await go.locator('.icon-run').click()
  await expect(go.locator('.code-repl-output')).toBeVisible()
  await expect(go.locator('.output-content')).toContainText('Hello Go')
  await expect(go.locator('.output-version')).toContainText('go v1.24')
  expect(goCode).toContain('func main()')
  await go.locator('.icon-close').click()
  await expect(go.locator('.code-repl-output')).toBeHidden()

  const kotlin = repls.filter({ has: page.locator('[class*="language-kotlin"]') })
  await kotlin.locator('.icon-run').click()
  await expect(kotlin.locator('.output-content')).toContainText('Hello Kotlin')
  expect(kotlinCode).toContain('fun main()')

  const rust = repls.filter({ has: page.locator('[class*="language-rust"]') })
  await rust.locator('.icon-run').click()
  await expect(rust.locator('.output-content')).toContainText('Hello Rust')
  expect(rustCode).toContain('fn main()')

  const python = repls.filter({ has: page.locator('[class*="language-python"]') })
  await python.locator('textarea').fill('print("result")')
  await python.locator('.icon-run').click()
  await expect(python.locator('.output-content')).toContainText('Hello Python')
  await expect(python.locator('.output-content')).toContainText('42')
})

test('hidden Plot text supports hover defaults, click variants, components, and mobile behavior', async ({ page }) => {
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  const plots = page.locator('.vp-plot')
  await expect(plots).toHaveCount(3)
  await expect(plots.nth(0)).toHaveClass(/\bhover\b/)
  await expect(plots.nth(0)).toHaveClass(/\bmask\b/)
  await expect(plots.nth(0)).toHaveCSS('padding', '0px 2px')
  await expect(plots.nth(0)).toHaveCSS('color', 'rgba(0, 0, 0, 0)')
  await expect(plots.nth(0)).toHaveCSS('background-color', 'rgb(60, 60, 67)')
  await expectHoveredCss(plots.nth(0), 'color', 'rgb(255, 255, 255)')
  await expect(plots.nth(1)).toHaveClass(/\bclick\b/)
  await expect(plots.nth(1)).toHaveClass(/\bblur\b/)
  await expect(plots.nth(1)).toHaveCSS('filter', 'blur(3.2px)')
  await plots.nth(1).press('Enter')
  await expect(plots.nth(1)).toHaveClass(/\bactive\b/)
  await expect(plots.nth(1)).toHaveCSS('filter', 'blur(0px)')
  await page.locator('h2').filter({ hasText: '隐秘文本' }).click()
  await expect(plots.nth(1)).not.toHaveClass(/\bactive\b/)
  await plots.nth(2).click()
  await expect(plots.nth(2)).toHaveClass(/\bactive\b/)
  await page.setViewportSize({ width: 390, height: 900 })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('.vp-plot').nth(0)).toHaveClass(/\bclick\b/)
  await expect(page.locator('.vp-plot').nth(0)).toHaveAttribute('tabindex', '0')
  await page.locator('.vp-plot').nth(0).click()
  await expect(page.locator('.vp-plot').nth(0)).toHaveClass(/\bactive\b/)
  await page.locator('h2').filter({ hasText: '隐秘文本' }).click()
  await expect(page.locator('.vp-plot').nth(0)).not.toHaveClass(/\bactive\b/)
})

test('timeline options and between placement follow the frozen responsive contract', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/blog/markdown-showcase/', { waitUntil: 'domcontentloaded' })
  const items = page.locator('.vp-timeline-item')
  await expect(items).toHaveCount(3)
  await expect(items.nth(0)).toHaveClass(/\bbetween-right\b/)
  await expect(items.nth(0)).not.toHaveClass(/\bcard\b/)
  await expect(items.nth(1)).toHaveClass(/\bcard\b/)
  await expect(items.nth(0).locator('.vp-timeline-line')).toHaveClass(/\bhas-icon\b/)
  await expect(items.nth(0).locator('.vp-icon')).toHaveAttribute('data-provider', 'iconify')

  await page.setViewportSize({ width: 390, height: 900 })
  await expect(items.nth(0)).toHaveClass(/\bplacement-left\b/)
  await expect(items.nth(0)).not.toHaveClass(/\bbetween\b/)
  await expect(items.nth(1)).toHaveClass(/\bplacement-left\b/)

  await page.setViewportSize({ width: 820, height: 900 })
  await expect(items.nth(0)).toHaveClass(/\bbetween-right\b/)
  await expect(items.nth(1)).toHaveClass(/\bbetween-left\b/)
})

test('Chart.js and ECharts preserve JSON, trusted script, and deny-by-default behavior', async ({ page }) => {
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  const chart = page.locator('[data-chartjs]')
  const echarts = page.locator('[data-echarts]')
  await expect(chart).toHaveAttribute('data-chart-ready', 'true')
  await expect(chart.locator('canvas')).toHaveAttribute('width', /\d+/)
  await expect(page.locator('.chartjs-title')).toHaveText('月度趋势')
  await expect(page.locator('.chartjs-loading')).toHaveCount(0)
  await expect(chart).toHaveCSS('display', 'block')
  await expect(echarts).toHaveAttribute('data-chart-ready', 'true')
  await expect(echarts.locator('.echarts-loading')).toHaveCount(0)
  await expect(echarts.locator('.echarts-container canvas')).toBeVisible()
  await expect(page.locator('.echarts-title')).toHaveText('分类占比')
  await expect(echarts.locator('.echarts-container')).toHaveCSS('min-height', '360px')
  await expect(page.getByText('未授权脚本不应执行')).toHaveCount(0)

  await page.evaluate(() => {
    const encode = (value: string) => btoa(value)
    const host = document.createElement('div')
    host.innerHTML = `<div class="chartjs-wrapper" data-chartjs data-chart-type="js" data-chart-config="${encode("config = { type: 'bar', data: { labels: ['A'], datasets: [{ data: [2] }] } }")}"><canvas height="400"></canvas></div><div class="echarts-wrapper" data-echarts data-chart-type="js" data-chart-config="${encode("width = 320; height = 200; option = { xAxis: { type: 'category', data: ['A'] }, yAxis: {}, series: [{ type: 'bar', data: [2] }] }")}"><div class="echarts-container"></div></div>`
    document.querySelector('.vp-doc')?.append(host)
    host.dispatchEvent(new Event('plume-content-updated', { bubbles: true }))
  })
  const scriptChart = page.locator('[data-chartjs]').nth(1)
  const scriptEcharts = page.locator('[data-echarts]').nth(1)
  await expect(scriptChart).toHaveAttribute('data-chart-ready', 'true')
  expect(await scriptChart.evaluate(element => (element as any).__chart.config.type)).toBe('bar')
  await expect(scriptEcharts).toHaveAttribute('data-chart-ready', 'true')
  expect(await scriptEcharts.evaluate(element => (element as any).__chart.getWidth())).toBe(320)
  expect(await scriptEcharts.evaluate(element => (element as any).__chart.getHeight())).toBe(200)
})

test('PlantUML blocks use Plume build-time encoding and the official renderer URL', async ({ page }) => {
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  const diagram = page.locator('img[alt="PlantUML Diagram"]')
  await expect(diagram).toHaveCount(1)
  await expect(diagram).toHaveAttribute('src', /^https:\/\/www\.plantuml\.com\/plantuml\/svg\/[A-Za-z0-9_-]+$/)
})

test('Flowchart fences render with Plume presets and responsive scale', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 900 })
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  const flowchart = page.locator('[data-flowchart]')
  await expect(flowchart).toHaveAttribute('data-flowchart-ready', 'true')
  await expect(page.locator('.flowchart-loading')).toHaveCount(0)
  await expect(flowchart).toHaveCSS('display', 'block')
  await expect(flowchart).toHaveClass(/\bvue\b/)
  await expect(flowchart).toHaveAttribute('data-flowchart-scale', '0.9')
  await expect(flowchart.locator('svg')).toBeVisible()
  await expect(flowchart.locator('.start-element')).toHaveCount(1)
  await expect(flowchart.locator('.operation-element')).toHaveCount(1)
  await expect(flowchart.locator('.end-element')).toHaveCount(1)
  await page.setViewportSize({ width: 390, height: 900 })
  await expect(flowchart).toHaveAttribute('data-flowchart-scale', '0.8')

  await page.setViewportSize({ width: 1000, height: 900 })
  await page.evaluate(() => {
    const code = btoa('st=>start: Start\nop=>operation: Process\ne=>end: End\nst->op->e')
    const host = document.createElement('div')
    host.innerHTML = `<div class="flowchart-wrapper ant" id="flowchart-ant-test" data-flowchart data-flow-code="${code}" data-flow-preset="ant"></div><div class="flowchart-wrapper pie" id="flowchart-pie-test" data-flowchart data-flow-code="${code}" data-flow-preset="pie"></div>`
    document.querySelector('.vp-doc')?.append(host)
    host.dispatchEvent(new Event('plume-content-updated', { bubbles: true }))
  })
  const ant = page.locator('#flowchart-ant-test')
  const pie = page.locator('#flowchart-pie-test')
  await expect(ant).toHaveAttribute('data-flowchart-ready', 'true')
  await expect(pie).toHaveAttribute('data-flowchart-ready', 'true')
  await expect(ant.locator('.operation-element')).toHaveAttribute('fill', '#1890ff')
  await expect(pie.locator('.operation-element')).toHaveAttribute('fill', '#f1f1f1')
})

test('Markmap fences render frontmatter options, nodes, and the Plume toolbar', async ({ page }) => {
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  const markmap = page.locator('[data-markmap]')
  await expect(markmap).toHaveAttribute('data-markmap-ready', 'true')
  await expect(markmap.locator('.markmap-loading')).toHaveCount(0)
  await expect(markmap.locator('.markmap-svg')).toBeVisible()
  await expect(markmap.locator('.markmap-node')).not.toHaveCount(0)
  await expect(markmap.locator('.mm-toolbar')).toBeVisible()
  await expect(markmap.locator('.mm-toolbar-brand')).toBeHidden()
  await expect(markmap).toContainText('ermaozi')
  await expect(markmap).toContainText('Markdown')
  await expect(markmap).toContainText('Astro')
})

test('AudioReader and ArtPlayer preserve Plume controls, options, and keyboard behavior', async ({ page }) => {
  await page.route(/\/media\/engine-\d+\./, route => route.fulfill({ body: '' }))
  await page.route('**/media/demo.m3u8', route => route.fulfill({
    contentType: 'application/vnd.apple.mpegurl',
    body: '#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-ENDLIST\n',
  }))
  await page.addInitScript(() => {
    const playing = new WeakSet<HTMLMediaElement>()
    Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
      configurable: true,
      get() { return !playing.has(this) },
    })
    HTMLMediaElement.prototype.play = function () {
      playing.add(this)
      this.dispatchEvent(new Event('play'))
      return Promise.resolve()
    }
    HTMLMediaElement.prototype.pause = function () {
      playing.delete(this)
      this.dispatchEvent(new Event('pause'))
    }
  })
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  const reader = page.locator('[data-audio-reader]')
  await expect(reader).toHaveAttribute('data-audio-ready', 'true')
  await expect(reader).toContainText('[ˈɔːdioʊ]')
  await expect(reader.locator('.icon-audio svg')).toBeVisible()
  const audio = page.locator('body > audio.audio-player')
  await expect(audio).toHaveAttribute('src', 'https://sensearch.baidu.com/gettts?lan=en&spd=3&source=alading&text=audio')
  await expect(audio).toHaveAttribute('preload', 'none')
  expect(await audio.evaluate(element => (element as HTMLAudioElement).volume)).toBe(0.7)
  await audio.dispatchEvent('canplay')
  expect(await audio.evaluate(element => (element as HTMLAudioElement).currentTime)).toBe(1)
  await reader.press('Enter')
  await expect(reader).toHaveClass(/\bplaying\b/)
  await audio.evaluate(element => {
    ;(element as HTMLAudioElement).currentTime = 4
    element.dispatchEvent(new Event('timeupdate'))
  })
  await expect(reader).not.toHaveClass(/\bplaying\b/)
  expect(await audio.evaluate(element => (element as HTMLAudioElement).currentTime)).toBe(1)

  const art = page.locator('[data-artplayer]').first()
  await expect(art).toHaveAttribute('data-artplayer-ready', 'true')
  await expect(art.locator('.md-power-loading')).toHaveCount(0)
  await expect(art.locator('.art-video-player')).toBeVisible()
  await expect(art.locator('.vp-artplayer')).toHaveCSS('border-radius', '8px')
  await expect(art.locator('.art-control-fullscreen')).toBeVisible()

  await page.evaluate(() => {
    const host = document.createElement('div')
    const options = btoa(JSON.stringify({ type: 'hls', muted: true, fullscreen: true }))
    host.innerHTML = `<div class="vp-artplayer-wrapper" data-artplayer data-artplayer-src="/media/demo.m3u8" data-artplayer-options="${options}" data-artplayer-ratio="16:9" data-artplayer-height="180px"><div class="vp-artplayer" style="width:100%"></div></div>`
    document.querySelector('.vp-doc')?.append(host)
    host.dispatchEvent(new Event('plume-content-updated', { bubbles: true }))
  })
  const hls = page.locator('[data-artplayer]').nth(1)
  await expect(hls).toHaveAttribute('data-artplayer-ready', 'true')
  await expect(hls.locator('.vp-artplayer')).toHaveCSS('height', '180px')
  expect(await hls.evaluate(element => typeof (element as any).__artplayer.option.customType.hls)).toBe('function')

  await page.evaluate(() => {
    const host = document.createElement('div')
    host.innerHTML = ['dash', 'ts', 'flv', 'mov', 'mkv', 'ogv'].map((type, index) => {
      const options = btoa(JSON.stringify({ type, muted: true }))
      return `<div class="vp-artplayer-wrapper" data-artplayer data-artplayer-src="/media/engine-${index}.${type}" data-artplayer-options="${options}" data-artplayer-ratio="16:9" data-artplayer-height="120px"><div class="vp-artplayer" style="width:100%"></div></div>`
    }).join('')
    document.querySelector('.vp-doc')?.append(host)
    host.dispatchEvent(new Event('plume-content-updated', { bubbles: true }))
  })
  for (const [index, type] of ['dash', 'ts', 'flv'].entries()) {
    const engine = page.locator('[data-artplayer]').nth(index + 2)
    await expect(engine).toHaveAttribute('data-artplayer-ready', 'true')
    expect(await engine.evaluate((element, type) => typeof (element as any).__artplayer.option.customType[type], type)).toBe('function')
  }
  for (let index = 5; index < 8; index++) await expect(page.locator('[data-artplayer]').nth(index)).toHaveAttribute('data-artplayer-ready', 'true')
})

test('video and PDF embeds preserve Plume option matrices and responsive DOM', async ({ page }) => {
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })

  const youtube = page.locator('[data-video-embed].youtube')
  await expect(youtube).toHaveAttribute('data-video-ready', 'true')
  await expect(youtube).toHaveAttribute('src', /youtube\.com\/embed\/\/video-id\?autoplay=1&loop=1&start=62&end=90$/)
  await expect(youtube).toHaveAttribute('title', 'YouTube 参数示例')
  await expect(youtube).toHaveCSS('width', /px$/)
  await expect(youtube).toHaveCSS('border-radius', '5px')

  const bilibili = page.locator('[data-video-embed].bilibili')
  await expect(bilibili).toHaveAttribute('src', /player\.bilibili\.com\/player\.html\?bvid=BV1EZ42187Hg&aid=123&cid=456&p=2&t=65&autoplay=1&high_quality=1$/)
  await expect(bilibili).toHaveCSS('height', '180px')

  const acfun = page.locator('[data-video-embed].acfun')
  await expect(acfun).toHaveAttribute('src', 'https://www.acfun.cn/player/ac47431669')
  await expect(acfun).toHaveAttribute('data-video-ratio', '16:10')

  const pdf = page.locator('[data-pdf-viewer]')
  await expect(pdf).toHaveAttribute('data-pdf-ready', 'true')
  await expect(pdf).toHaveCSS('height', '180px')
  const viewer = pdf.locator('embed.pdf-viewer')
  await expect(viewer).toHaveAttribute('type', 'application/pdf')
  await expect(viewer).toHaveAttribute('src', 'https://plume.pengzhanbo.cn/files/sample-1.pdf#page=2&toolbar=0&zoom=95')

  await page.evaluate(() => {
    Object.defineProperty(navigator, 'userAgent', { configurable: true, value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15' })
    const host = document.createElement('div')
    const wrapper = document.createElement('div')
    wrapper.dataset.pdfViewer = ''
    wrapper.dataset.pdfSrc = '/files/guide.pdf'
    wrapper.dataset.pdfPage = '1'
    wrapper.dataset.pdfToolbar = '1'
    wrapper.dataset.pdfZoom = '50'
    wrapper.dataset.pdfRatio = '16:9'
    wrapper.dataset.pdfjsUrl = 'https://static.pengzhanbo.cn/pdfjs/'
    host.append(wrapper)
    document.querySelector('.vp-doc')?.append(host)
    host.dispatchEvent(new Event('plume-content-updated', { bubbles: true }))
  })
  const safari = page.locator('[data-pdf-viewer]').nth(1)
  await expect(safari).toHaveAttribute('data-pdf-ready', 'true')
  await expect(safari.locator('iframe.pdf-viewer')).toHaveAttribute('src', /\/files\/guide\.pdf#page=1&toolbar=1&zoom=50$/)
})

test('mobile PDF embeds use the Plume PDF.js fallback', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'userAgent', {
    configurable: true,
    value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
  }))
  await page.goto('/docs/guide/content/', { waitUntil: 'domcontentloaded' })
  const pdf = page.locator('[data-pdf-viewer]')
  await expect(pdf).toHaveAttribute('data-pdf-ready', 'true')
  const viewer = pdf.locator('iframe.pdf-viewer')
  await expect(viewer).toHaveAttribute('allow', 'fullscreen')
  await expect(viewer).toHaveAttribute('src', 'https://static.pengzhanbo.cn/pdfjs/web/viewer.html?file=https://plume.pengzhanbo.cn/files/sample-1.pdf#page=2&toolbar=0&zoom=95')

  await page.evaluate(() => {
    const host = document.createElement('div')
    const wrapper = document.createElement('div')
    Object.assign(wrapper.dataset, {
      pdfViewer: '', pdfSrc: '/files/guide.pdf', pdfPage: '3', pdfToolbar: '1', pdfZoom: '80', pdfRatio: '1:1', pdfjsUrl: '/vendor/pdfjs/',
    })
    host.append(wrapper)
    document.querySelector('.vp-doc')?.append(host)
    host.dispatchEvent(new Event('plume-content-updated', { bubbles: true }))
  })
  const custom = page.locator('[data-pdf-viewer]').nth(1)
  await expect(custom).toHaveAttribute('data-pdf-ready', 'true')
  await expect(custom.locator('iframe.pdf-viewer')).toHaveAttribute('src', /\/vendor\/pdfjs\/web\/viewer\.html\?file=.*\/files\/guide\.pdf#page=3&toolbar=1&zoom=80$/)
})


test('demo switches between translated pages on desktop and mobile', async ({ page }) => {
  await page.goto('/about/')
  await page.locator('.vp-navbar-translations button').click()
  await page.locator('.vp-navbar-translations a[href="/en/about/"]').click()
  await expect(page).toHaveURL(/\/en\/about\/$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US')
  await expect(page.locator('#VPContent')).toContainText('About this theme')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.locator('.vp-navbar-hamburger').click()
  await page.locator('.mobile-translations button').click()
  await page.locator('.mobile-translations a[href="/about/"]').click()
  await expect(page).toHaveURL(/\/about\/$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN')
})
