import type { ThemeName } from '@/constants'
import { DARK_STORAGE_KEY, PALETTE_STORAGE_KEY, THEMES } from '@/constants'
// @env browser
import { uiText } from './ui'

const DARK_QUERY = '(prefers-color-scheme: dark)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
let activeTransition: ViewTransition | undefined

function readPreference(key: string): string | null {
  try {
    return localStorage.getItem(key)
  }
  catch {
    return null
  }
}

function writePreference(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  }
  catch {
    // Keep the current page usable when storage is blocked or full.
  }
}

function isThemeName(value: string | undefined): value is ThemeName {
  return value !== undefined && (THEMES as readonly string[]).includes(value)
}

function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function startThemeTransition(apply: () => void): ViewTransition {
  const root = document.documentElement
  activeTransition?.skipTransition()
  root.dataset.themeTransition = ''
  const transition = document.startViewTransition(apply)
  activeTransition = transition
  const cleanup = () => {
    if (activeTransition !== transition)
      return
    delete root.dataset.themeTransition
    activeTransition = undefined
  }
  void transition.finished.then(cleanup, cleanup)
  return transition
}

function revealClip(origin?: { x: number, y: number }): string[] {
  const viewportX = origin?.x ?? window.innerWidth / 2
  const viewportY = origin?.y ?? 0
  const bounds = document.getElementById('main')?.getBoundingClientRect()
  const x = viewportX - (bounds?.left ?? 0)
  const y = viewportY - (bounds?.top ?? 0)
  const radius = Math.hypot(Math.max(viewportX, window.innerWidth - viewportX), Math.max(viewportY, window.innerHeight - viewportY))
  return [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]
}

function setDark(dark: boolean, animate: boolean, origin?: { x: number, y: number }): void {
  const root = document.documentElement
  const apply = () => {
    root.classList.toggle('dark', dark)
  }

  if (!animate || !document.startViewTransition || prefersReducedMotion()) {
    activeTransition?.skipTransition()
    apply()
    return
  }

  const clipPath = revealClip(origin)
  const transition = startThemeTransition(apply)
  void transition.ready.then(() => {
    root.animate(
      {
        clipPath: dark
          ? [...clipPath].reverse()
          : clipPath,
      },
      {
        duration: 420,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        pseudoElement: dark
          ? '::view-transition-old(theme-page)'
          : '::view-transition-new(theme-page)',
      },
    )
  }).catch(() => {
    // A superseded transition still applies its theme without the animation.
  })
}

function setPalette(theme: ThemeName, animate: boolean, origin?: { x: number, y: number }): void {
  const root = document.documentElement
  const apply = () => {
    root.dataset.theme = theme
  }

  if (!animate || !document.startViewTransition || prefersReducedMotion()) {
    activeTransition?.skipTransition()
    apply()
    return
  }

  const clipPath = revealClip(origin)
  const transition = startThemeTransition(apply)
  void transition.ready.then(() => {
    root.animate(
      {
        clipPath,
      },
      {
        duration: 420,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        pseudoElement: '::view-transition-new(theme-page)',
      },
    )
  }).catch(() => {
    // A superseded transition still applies its palette without the animation.
  })
}

/**
 * Single theme entry point: dark mode and palette are written to <html>,
 * sharing storage keys with the inline pre-paint script.
 */
export function initTheme(): void {
  const root = document.documentElement
  const toggle = document.getElementById('themeSwitch')
  const select = document.getElementById('themeSelect') as HTMLSelectElement | null
  const storedMode = readPreference(DARK_STORAGE_KEY)
  let hasExplicitMode = storedMode === 'dark' || storedMode === 'light'
  let wasDark = false

  const syncChrome = () => {
    const dark = root.classList.contains('dark')
    toggle?.setAttribute('aria-pressed', String(dark))
    toggle?.setAttribute('aria-label', dark
      ? uiText('theme.lightLabel')
      : uiText('theme.darkLabel'))

    const palette = root.dataset.theme
    if (select && isThemeName(palette))
      select.value = palette

    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (meta) {
      const bg = getComputedStyle(root).getPropertyValue('--bg').trim()
      if (bg)
        meta.content = bg
    }
  }

  syncChrome()
  const observer = new MutationObserver(syncChrome)
  observer.observe(root, {
    attributes: true,
    attributeFilter: ['class', 'data-theme'],
  })

  toggle?.addEventListener('click', (event) => {
    const dark = !root.classList.contains('dark')
    hasExplicitMode = true
    writePreference(DARK_STORAGE_KEY, dark ? 'dark' : 'light')
    setDark(dark, true, { x: event.clientX, y: event.clientY })
  })

  select?.addEventListener('change', () => {
    if (!isThemeName(select.value))
      return
    const rect = select.getBoundingClientRect()
    writePreference(PALETTE_STORAGE_KEY, select.value)
    setPalette(select.value, true, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
  })

  window.matchMedia(DARK_QUERY).addEventListener('change', (event) => {
    if (!hasExplicitMode)
      setDark(event.matches, false)
  })

  window.matchMedia(REDUCED_MOTION_QUERY).addEventListener('change', (event) => {
    if (event.matches)
      activeTransition?.skipTransition()
  })

  window.addEventListener('beforeprint', () => {
    activeTransition?.skipTransition()
    wasDark = root.classList.contains('dark')
    root.classList.remove('dark')
  })

  window.addEventListener('afterprint', () => {
    root.classList.toggle('dark', wasDark)
    syncChrome()
  })
}
