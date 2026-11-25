import { onPageLoad } from '@/lib/pageLifecycle'
import { initTheme } from '@/stores/theme'

const scrollControlNav = document.querySelector<HTMLElement>('.scroll-control-nav')

function setSideMenuOpen(open: boolean) {
  if (!scrollControlNav) return
  scrollControlNav.classList.toggle('is-open', open)
  scrollControlNav
    .querySelector<HTMLElement>('[data-scroll-menu]')
    ?.setAttribute('aria-expanded', open ? 'true' : 'false')
}

export function initPageFlags() {
  document.addEventListener('astro:page-load', () => {
    ;(window as unknown as { __pageLoadFired?: boolean }).__pageLoadFired = true
  })
  document.addEventListener('astro:before-swap', () => {
    ;(window as unknown as { __pageLoadFired?: boolean }).__pageLoadFired = false
  })
  initTheme()
}

export function bindTocFab() {
  function syncTocFab() {
    const fab = document.getElementById('toc-fab')
    if (!fab) return
    fab.hidden = !document.getElementById('toc-affix')
  }
  document.addEventListener('astro:after-swap', syncTocFab)
  onPageLoad(syncTocFab)
}

export function bindScrollControls() {
  document.addEventListener('astro:before-swap', () => setSideMenuOpen(false))
  window.addEventListener(
    'scroll',
    () => {
      if (scrollControlNav?.classList.contains('is-open')) setSideMenuOpen(false)
    },
    { passive: true },
  )
  document.addEventListener('pointerdown', (e) => {
    if (!scrollControlNav?.classList.contains('is-open')) return
    if (!scrollControlNav.contains(e.target as Node)) setSideMenuOpen(false)
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setSideMenuOpen(false)
  })
  document
    .querySelector<HTMLElement>('.scroll-control-pop')
    ?.addEventListener('click', () => setSideMenuOpen(false))
}

export function bindControlClicks() {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const backBtn = target.closest('[data-backtop]')
    if (backBtn) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    const menuBtn = target.closest('[data-scroll-menu]')
    // 纯净阅读模式下触发器已变身为退出按钮，交给 pureReading.ts 处理，不再展开菜单
    if (menuBtn && !document.documentElement.classList.contains('pure-reading')) {
      setSideMenuOpen(!scrollControlNav?.classList.contains('is-open'))
    }
    const searchBtn = target.closest('[data-open-search]')
    if (searchBtn) {
      document.dispatchEvent(new CustomEvent('open-search'))
    }
    const details = target.closest<HTMLDetailsElement>('details.md-container-details')
    const summary = target.closest('summary')
    if (details && summary === details.querySelector(':scope > summary')) {
      const body = details.querySelector<HTMLElement>('.md-container-body')
      if (!details.open) {
        if (body) body.style.height = ''
        return
      }
      if (!body || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      e.preventDefault()
      const from = body.scrollHeight
      body
        .animate(
          [
            { height: `${from}px`, opacity: 1 },
            { height: '0px', opacity: 0 },
          ],
          {
            duration: 300,
            easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
          },
        )
        .addEventListener(
          'finish',
          () => {
            body.style.height = '0px'
            details.removeAttribute('open')
          },
          { once: true },
        )
    }
  })
}
