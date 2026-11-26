// @env browser
import { uiText } from './ui'

interface SectionPointer {
  id: string
  index: string
  label: string
}

let initialized = false

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement))
    return false
  return target.isContentEditable
    || target.closest('input, textarea, select, [contenteditable]') !== null
}

function setText(element: HTMLElement | null, value: string): void {
  if (element)
    element.textContent = value
}

function paletteLabel(theme: string | undefined): string {
  if (!theme)
    return uiText('common.unavailable')
  const label = uiText(`theme.${theme}`)
  return label !== `theme.${theme}`
    ? `${label} / ${theme}`
    : theme
}

/** Reads the font tokens so the spec panel reports the real stack. */
function fontStack(): string {
  const styles = getComputedStyle(document.documentElement)
  return [
    '--font-display',
    '--font-sans',
    '--font-serif',
    '--font-mono',
  ]
    .map((token) => {
      const families = styles.getPropertyValue(token).split(',')
      return (families[0] ?? '')
        .replace(/["']/g, '')
        .replace(/\s+Variable$/i, '')
        .trim()
    })
    .filter(Boolean)
    .join(' / ')
}

/**
 * Design inspection mode. `html.blueprint` switches on the overlay and the
 * dashed block outlines (global CSS); this module only owns the tab, the
 * readout panel, and the live values. It never changes page layout.
 */
export function initBlueprint(): void {
  if (initialized)
    return

  const tab = document.querySelector<HTMLButtonElement>('[data-blueprint-toggle]')
  const panel = document.querySelector<HTMLElement>('[data-blueprint-panel]')
  if (!tab || !panel)
    return
  initialized = true

  const root = document.documentElement
  const sections: SectionPointer[] = [
    ...document.querySelectorAll<HTMLElement>('#main [data-scroll-section]'),
  ].map(element => ({
    id: element.id,
    index: element.dataset.sectionIndex ?? '00',
    label: element.dataset.sectionLabel ?? element.id,
  }))
  const closeButton = panel.querySelector<HTMLButtonElement>('[data-blueprint-close]')
  const probe = panel.querySelector<HTMLElement>('[data-bp-probe]')
  const viewportEl = panel.querySelector<HTMLElement>('[data-bp-viewport]')
  const scrollEl = panel.querySelector<HTMLElement>('[data-bp-scroll]')
  const sectionEl = panel.querySelector<HTMLElement>('[data-bp-section]')
  const gridEl = panel.querySelector<HTMLElement>('[data-bp-grid]')
  const paletteEl = panel.querySelector<HTMLElement>('[data-bp-palette]')
  const modeEl = panel.querySelector<HTMLElement>('[data-bp-mode]')
  const typeEl = panel.querySelector<HTMLElement>('[data-bp-type]')
  const breakpointEl = panel.querySelector<HTMLElement>('[data-bp-breakpoint]')

  const wide = window.matchMedia('(min-width: 80rem)')
  const desktop = window.matchMedia('(min-width: 64rem)')
  const tablet = window.matchMedia('(min-width: 48rem)')
  const stack = fontStack()

  let active = false
  let frame = 0

  const readBreakpoint = () => {
    if (wide.matches)
      return uiText('blueprint.breakpointWide')
    if (desktop.matches)
      return uiText('blueprint.breakpointDesktop')
    if (tablet.matches)
      return uiText('blueprint.breakpointTablet')
    return uiText('blueprint.breakpointMobile')
  }

  const readSection = (): SectionPointer => {
    const shared = sections.find(section => section.id === root.dataset.activeSection)
    if (shared)
      return shared

    const marker = window.innerHeight * 0.34
    let current: SectionPointer | null = null
    let fallback: SectionPointer | null = null

    for (const section of sections) {
      const element = document.getElementById(section.id)
      if (!element || element.getClientRects().length === 0)
        continue
      fallback ??= section
      if (element.getBoundingClientRect().top <= marker)
        current = section
    }

    return current ?? fallback ?? {
      id: '',
      index: uiText('common.unavailable'),
      label: uiText('blueprint.offPage'),
    }
  }

  const update = () => {
    frame = 0
    if (!active)
      return

    setText(viewportEl, `${Math.round(window.innerWidth)} × ${Math.round(window.innerHeight)}`)

    const limit = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const progress = limit > 0
      ? Math.min(100, Math.max(0, Math.round((window.scrollY / limit) * 100)))
      : 0
    setText(scrollEl, `${String(progress).padStart(3, '0')} %`)

    const section = readSection()
    setText(sectionEl, `${section.label} / ${section.index}`)

    const gutter = probe
      ? Math.round(probe.getBoundingClientRect().width)
      : 0
    const columns = document.querySelectorAll('.blueprint-overlay__col').length
    setText(gridEl, uiText('blueprint.gridReadout').replace('{columns}', String(columns)).replace('{gutter}', String(gutter)))

    setText(paletteEl, paletteLabel(root.dataset.theme))
    setText(modeEl, root.classList.contains('dark')
      ? uiText('blueprint.dark')
      : uiText('blueprint.light'))
    setText(typeEl, stack || uiText('common.unavailable'))
    setText(breakpointEl, readBreakpoint())
  }

  const schedule = () => {
    if (!active || frame)
      return
    frame = requestAnimationFrame(update)
  }

  const setActive = (next: boolean, returnFocus = false) => {
    if (active === next)
      return

    active = next
    root.classList.toggle('blueprint', active)
    tab.setAttribute('aria-pressed', String(active))
    panel.hidden = !active

    if (active) {
      update()
      return
    }

    if (frame) {
      cancelAnimationFrame(frame)
      frame = 0
    }
    if (returnFocus)
      tab.focus({ preventScroll: true })
  }

  tab.addEventListener('click', () => setActive(!active))
  closeButton?.addEventListener('click', () => setActive(false, true))

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  document.addEventListener('portfolio:section', schedule)

  const observer = new MutationObserver(schedule)
  observer.observe(root, {
    attributes: true,
    attributeFilter: ['class', 'data-theme', 'data-active-section'],
  })

  desktop.addEventListener('change', (event) => {
    if (!event.matches && active)
      setActive(false)
  })

  document.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || event.isComposing || event.metaKey || event.ctrlKey || event.altKey)
      return
    if (document.querySelector('dialog[open]'))
      return

    const focusInside = panel.contains(document.activeElement) || document.activeElement === tab

    if (event.key === 'Escape') {
      if (!active)
        return
      setActive(false, focusInside)
      return
    }

    if (event.shiftKey || event.repeat || event.key.toLowerCase() !== 'g')
      return
    if (!desktop.matches || isTypingTarget(event.target))
      return

    event.preventDefault()
    setActive(!active, active && focusInside)
  })
}
