import { iconSvg } from '@/lib/icons'

export type ThemeMode = 'light' | 'dark' | 'system'

function defaultMode(): ThemeMode {
  const configured = document.documentElement.dataset.defaultTheme
  return configured === 'light' || configured === 'dark' ? configured : 'system'
}

const media =
  typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : undefined

function resolve(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'light' || mode === 'dark') return mode
  return media?.matches ? 'dark' : 'light'
}

export const themeMode = {
  get(): ThemeMode {
    if (typeof localStorage === 'undefined') return defaultMode()
    const stored = localStorage.getItem('themeMode')
    return stored === 'light' || stored === 'dark' ? stored : defaultMode()
  },
  set(mode: ThemeMode) {
    if (typeof localStorage !== 'undefined') localStorage.setItem('themeMode', mode)
    applyTheme(resolve(mode))
  },
}

export const resolvedTheme = { get: () => resolve(themeMode.get()) }

let transitionTimer = 0

function setThemeClasses(mode: 'light' | 'dark') {
  const root = document.documentElement
  const changed = root.classList.contains('dark') !== (mode === 'dark')
  root.classList.toggle('dark', mode === 'dark')
  root.style.colorScheme = mode
  syncThemeButtons(mode)
  document.dispatchEvent(new CustomEvent('theme-change', { detail: mode }))
  return changed
}

function applyTheme(mode: 'light' | 'dark', animate = true) {
  if (typeof document === 'undefined') return
  const changed = setThemeClasses(mode)
  if (animate && changed) {
    const root = document.documentElement
    root.classList.add('is-theme-transitioning')
    clearTimeout(transitionTimer)
    transitionTimer = window.setTimeout(() => root.classList.remove('is-theme-transitioning'), 300)
  }
}

function viewTransitionTheme(mode: 'light' | 'dark', origin: HTMLElement): boolean {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => {
      ready: Promise<void>
      finished: Promise<void>
    }
  }
  if (typeof doc.startViewTransition !== 'function') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false

  const isMobile = window.matchMedia('(max-width: 768px)').matches
  const rect = origin.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

  const root = document.documentElement
  root.classList.add('is-theme-transitioning')
  const vt = doc.startViewTransition(() => {
    setThemeClasses(mode)
  })
  vt.ready
    .then(() => {
      if (isMobile) return
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' },
      )
    })
    .catch(() => {})
  vt.finished.finally(() => root.classList.remove('is-theme-transitioning')).catch(() => {})
  return true
}

function syncThemeButtons(mode: 'light' | 'dark') {
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    const icon = btn.querySelector('svg')
    if (icon) {
      icon.outerHTML = iconSvg(mode === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night')
    }
  })
}

export function toggleTheme(origin?: HTMLElement | null) {
  const next: 'light' | 'dark' = resolvedTheme.get() === 'dark' ? 'light' : 'dark'
  if (typeof localStorage !== 'undefined') localStorage.setItem('themeMode', next)
  if (origin && viewTransitionTheme(next, origin)) return
  applyTheme(next)
}

let initialized = false

export function initTheme() {
  if (initialized || typeof document === 'undefined') return
  initialized = true

  applyTheme(resolvedTheme.get(), false)

  media?.addEventListener('change', () => {
    if (themeMode.get() === 'system') applyTheme(media.matches ? 'dark' : 'light')
  })

  document.addEventListener('astro:after-swap', () => applyTheme(resolvedTheme.get(), false))

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const btn = target.closest<HTMLElement>('[data-theme-toggle]')
    if (btn) {
      e.preventDefault()
      toggleTheme(btn)
    }
  })
}
