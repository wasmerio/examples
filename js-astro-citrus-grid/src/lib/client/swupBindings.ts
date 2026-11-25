import { onPageLoad } from '@/lib/pageLifecycle'
import { syncPet } from './pet'

interface SwupVisit {
  to: { url: string }
}

interface SwupLike {
  hooks: { on: (event: string, callback: (visit: SwupVisit) => void) => void }
  navigate?: (url: string) => void
}

interface SwupWindow {
  swup?: SwupLike
  __pendingScrollHash?: string | null
  __scrollToHeadingAnchor?: (id: string) => void
}

const swupWindow = () => window as unknown as SwupWindow

export function syncNavState(path: string = window.location.pathname) {
  const current = path
  let anyActive = false
  document.querySelectorAll<HTMLAnchorElement>('a[data-nav-path]').forEach((a) => {
    if (a.dataset.navPath === '__fallback__') {
      a.classList.toggle('text-accent', !anyActive)
      a.classList.toggle('text-ink-2', anyActive)
      return
    }
    const full = a.dataset.navPath || '/'
    const active =
      full === '/'
        ? current === full || current === `${full}/` || /^\/\d+(\/|$)/.test(current)
        : current.startsWith(full)
    if (active) anyActive = true
    a.classList.toggle('text-accent', active)
    a.classList.toggle('text-ink-2', !active)
    if (a.hasAttribute('data-nav-mobile')) a.classList.toggle('bg-surface-hover', active)
  })
  document.querySelectorAll<HTMLDetailsElement>('header details[open]').forEach((d) => {
    d.removeAttribute('open')
  })
}

export function bindNavStartSync(attempt = 0) {
  const swup = swupWindow().swup
  if (swup?.hooks) {
    swup.hooks.on('visit:start', (visit) => {
      try {
        syncNavState(new URL(visit.to.url, window.location.href).pathname)
      } catch {}
    })
  } else if (attempt < 100) {
    window.setTimeout(() => bindNavStartSync(attempt + 1), 100)
  }
}

export function bindSwapHooks() {
  document.addEventListener('astro:before-swap', () => {
    document.querySelectorAll('#toc-affix').forEach((el) => {
      if (!el.closest('#swup-container')) el.remove()
    })
    document.querySelectorAll('body > #toc-modal').forEach((el) => {
      el.remove()
    })
    syncNavState()
  })
  onPageLoad(() => syncNavState())
}

export function bindPetToSwup(attempt = 0) {
  const swup = swupWindow().swup
  if (swup?.hooks) {
    swup.hooks.on('content:replace', syncPet)
    swup.hooks.on('page:view', syncPet)
    return
  }
  if (attempt < 100) {
    window.setTimeout(() => bindPetToSwup(attempt + 1), 100)
  }
}

const HEADING_SCROLL_OFFSET = 80

function smoothScrollToHeadingAnchor(id: string) {
  let el = document.getElementById(id)
  if (!el) {
    try {
      el = document.getElementById(decodeURIComponent(id))
    } catch {}
  }
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - HEADING_SCROLL_OFFSET
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
}

export function bindCrossPageAnchors() {
  swupWindow().__scrollToHeadingAnchor = smoothScrollToHeadingAnchor

  function consumePendingScrollHash() {
    const pending = swupWindow().__pendingScrollHash
    if (!pending) return
    swupWindow().__pendingScrollHash = null
    // replaceState 需带上 search，否则跨页锚点跳转会把原 query 丢掉
    history.replaceState(
      history.state,
      '',
      `${window.location.pathname}${window.location.search}#${pending}`,
    )
    window.setTimeout(() => smoothScrollToHeadingAnchor(pending), 120)
  }
  onPageLoad(consumePendingScrollHash)

  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement)?.closest<HTMLAnchorElement>('a')
    if (!link || link.hasAttribute('data-no-swup')) return
    if (link.target === '_blank' || link.hasAttribute('download')) return
    const raw = link.getAttribute('href') || ''
    let url: URL
    try {
      url = new URL(raw, window.location.href)
    } catch {
      return
    }
    if (url.origin !== window.location.origin || !url.hash) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    const stripSlash = (p: string) => p.replace(/\/+$/, '') || '/'
    if (stripSlash(url.pathname) === stripSlash(window.location.pathname)) return
    e.preventDefault()
    swupWindow().__pendingScrollHash = url.hash.slice(1)
    const swup = swupWindow().swup
    if (swup?.navigate) swup.navigate(`${url.origin}${url.pathname}${url.search}`)
    else window.location.assign(raw)
  })
}
