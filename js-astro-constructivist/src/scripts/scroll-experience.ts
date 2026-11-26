// @env browser
import type { ProjectScroll } from './project-scroll'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { initProjectScroll } from './project-scroll'
import { initHeroTimeline, initReveals, initSectionTimelines } from './section-motion'

interface SectionGeometry {
  element: HTMLElement
  id: string
  index: string
  label: string
  top: number
  height: number
}

interface ScrollContext {
  root: HTMLElement
  main: HTMLElement
  sections: SectionGeometry[]
  links: HTMLAnchorElement[]
  lenis?: Lenis
  projects?: ProjectScroll
  resumeTarget?: HTMLElement
  readingPosition?: { element: HTMLElement, fraction: number, atTop: boolean }
  navigationTarget?: string
  retargetNavigation?: () => void
  navigationTimer: ReturnType<typeof setTimeout> | undefined
  navigationFrame: number
  navigationId: number
  scrollY: number
  activeId: string
  frame: number
  refreshFrame: number
  refreshTimer: ReturnType<typeof setTimeout> | undefined
}

let initialized = false

function headerHeight(): number {
  return document.querySelector('.topbar')?.getBoundingClientRect().bottom ?? 72
}

function measure(context: ScrollContext): void {
  for (const section of context.sections) {
    const rect = section.element.getBoundingClientRect()
    section.top = rect.top + window.scrollY
    section.height = rect.height
  }
}

function syncNavigation(context: ScrollContext, id: string): void {
  if (context.activeId === id)
    return
  context.activeId = id
  for (const link of context.links) {
    if (link.hash === `#${id}`)
      link.setAttribute('aria-current', 'location')
    else
      link.removeAttribute('aria-current')
  }
  const hashSection = hashTarget(window.location.hash)?.closest('[data-scroll-section]')?.id
  if (!context.navigationTarget && hashSection !== id && (id !== 'top' || window.location.hash))
    window.history.replaceState(window.history.state, '', `#${id}`)
}

function updateSectionState(context: ScrollContext): void {
  context.frame = 0
  if (document.querySelector('dialog[open]'))
    return
  context.scrollY = window.scrollY
  const marker = window.scrollY + window.innerHeight * 0.34
  let active = context.sections[0]!
  for (const section of context.sections) {
    if (section.top <= marker)
      active = section
    const progress = gsap.utils.clamp(0, 1, (marker - section.top) / Math.max(1, section.height))
    section.element.style.setProperty('--section-progress', progress.toFixed(4))
  }

  const progress = gsap.utils.clamp(0, 1, (marker - active.top) / Math.max(1, active.height))
  const pageProgress = gsap.utils.clamp(0, 1, window.scrollY / Math.max(1, context.root.scrollHeight - window.innerHeight))
  context.root.dataset.activeSection = active.id
  context.root.style.setProperty('--page-progress', String(pageProgress))

  syncNavigation(context, active.id)

  const bar = document.querySelector<HTMLElement>('.scroll-progress')
  if (bar)
    bar.style.transform = `scaleX(${pageProgress})`

  const footer = document.querySelector<HTMLElement>('.footer')
  context.root.classList.toggle('rail-hidden', Boolean(footer && footer.getBoundingClientRect().top < window.innerHeight * 0.85))
  document.dispatchEvent(new CustomEvent('portfolio:section', {
    detail: {
      id: active.id,
      index: active.index,
      label: active.label,
      progress,
    },
  }))
}

function schedule(context: ScrollContext): void {
  if (!context.frame)
    context.frame = requestAnimationFrame(() => updateSectionState(context))
}

function cancelNavigation(context: ScrollContext): void {
  if (!context.navigationTarget)
    return
  context.navigationId++
  clearTimeout(context.navigationTimer)
  cancelAnimationFrame(context.navigationFrame)
  context.navigationFrame = 0
  context.navigationTarget = undefined
  context.retargetNavigation = undefined
}

function rememberReadingPosition(context: ScrollContext): void {
  if (!context.root.dataset.scrollReady || context.resumeTarget || context.readingPosition)
    return
  const section = context.sections.find(item => item.id === context.activeId)
  if (!section)
    return
  cancelNavigation(context)
  if (section.id === 'projects') {
    const panels = [
      ...context.main.querySelectorAll<HTMLElement>('[data-project]'),
    ]
    const marker = headerHeight() + window.innerHeight * 0.3
    context.resumeTarget = context.projects?.readingTarget()
      ?? panels.findLast(panel => panel.getBoundingClientRect().top <= marker)
      ?? panels[0]
  }
  else {
    context.readingPosition = {
      element: section.element,
      fraction: (context.scrollY - section.top) / Math.max(1, section.height),
      atTop: context.scrollY < 1,
    }
  }
  context.navigationTarget = section.id
}

function refreshNow(context: ScrollContext): void {
  clearTimeout(context.refreshTimer)
  context.refreshFrame = 0
  context.lenis?.resize()
  ScrollTrigger.refresh()
  measure(context)
  if (context.resumeTarget && window.matchMedia('screen').matches) {
    scrollToHash(context, `#${context.resumeTarget.id}`, true)
    context.resumeTarget = undefined
  }
  else if (context.readingPosition && window.matchMedia('screen').matches) {
    const { element, fraction, atTop } = context.readingPosition
    const rect = element.getBoundingClientRect()
    const top = atTop
      ? 0
      : Math.max(0, rect.top + window.scrollY + rect.height * fraction)
    if (context.lenis)
      context.lenis.scrollTo(top, { immediate: true, force: true })
    else
      window.scrollTo({ top, behavior: 'instant' })
    context.readingPosition = undefined
    context.navigationTarget = undefined
    ScrollTrigger.update()
  }
  else {
    // Refreshing geometry interrupts native smooth scroll; preserve its target.
    context.retargetNavigation?.()
  }
  schedule(context)
}

function refresh(context: ScrollContext, immediate = false): void {
  clearTimeout(context.refreshTimer)
  if (context.refreshFrame)
    return
  if (immediate)
    context.refreshFrame = requestAnimationFrame(() => refreshNow(context))
  else
    context.refreshTimer = setTimeout(refreshNow, 120, context)
}

function hashTarget(hash: string): HTMLElement | null {
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)))
  }
  catch {
    return null
  }
}

function focusTarget(target: HTMLElement): void {
  const temporary = !target.hasAttribute('tabindex') && target.tabIndex < 0
  if (temporary)
    target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
  if (temporary)
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true })
}

function scrollToHash(context: ScrollContext, hash: string, immediate = false, focus = false): void {
  const target = hashTarget(hash)
  if (!target)
    return
  context.navigationTarget = target.id
  const navigationId = ++context.navigationId
  clearTimeout(context.navigationTimer)
  cancelAnimationFrame(context.navigationFrame)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const destination = () => context.projects?.targetY(target)
    ?? Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight() - 24)
  let completed = false
  const done = () => {
    if (completed || navigationId !== context.navigationId)
      return
    completed = true
    clearTimeout(context.navigationTimer)
    const top = destination()
    if (Math.abs(window.scrollY - top) > 1) {
      if (context.lenis)
        context.lenis.scrollTo(top, { immediate: true, force: true })
      else
        window.scrollTo({ top, behavior: 'instant' })
    }
    ScrollTrigger.update()
    context.projects?.sync()
    if (focus)
      focusTarget(target)
    context.navigationTarget = undefined
    context.retargetNavigation = undefined
    schedule(context)
  }
  context.retargetNavigation = () => scrollToHash(context, hash, immediate, focus)

  // Modal close handlers unlock scrolling and reset Lenis before this frame.
  context.navigationFrame = requestAnimationFrame(() => {
    context.navigationFrame = 0
    if (navigationId !== context.navigationId)
      return
    const top = destination()
    context.navigationTimer = setTimeout(done, immediate || reduced
      ? 50
      : 1400)
    if (context.lenis) {
      context.lenis.scrollTo(top, {
        immediate,
        force: true,
        duration: 1.05,
        onComplete: done,
      })
    }
    else {
      window.scrollTo({
        top,
        behavior: reduced || immediate
          ? 'instant'
          : 'smooth',
      })
    }
  })
}

function initNavigation(context: ScrollContext): void {
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
      return
    const anchor = event.target instanceof Element
      ? event.target.closest<HTMLAnchorElement>('a[href^="#"]')
      : null
    if (!anchor || anchor.hash === '#main' || anchor.hasAttribute('download') || anchor.target === '_blank')
      return
    if (!hashTarget(anchor.hash))
      return
    event.preventDefault()
    if (window.location.hash !== anchor.hash)
      window.history.pushState(window.history.state, '', anchor.hash)
    scrollToHash(context, anchor.hash, false, true)
  })

  const followHistory = () => scrollToHash(context, window.location.hash || '#top')
  // popstate precedes native scroll restoration and its active-section update.
  window.addEventListener('popstate', followHistory)
  window.addEventListener('hashchange', followHistory)

  document.addEventListener('focusin', (event) => {
    if (event.target instanceof HTMLElement && !context.navigationTarget && !event.target.closest('dialog')) {
      const top = context.projects?.focusedY(event.target)
      if (top !== undefined) {
        if (context.lenis)
          context.lenis.scrollTo(top, { immediate: true })
        else
          window.scrollTo({ top, behavior: 'instant' })
        ScrollTrigger.update()
        context.projects?.sync()
      }
    }
    schedule(context)
  })
  document.addEventListener('close', () => schedule(context), true)

  window.addEventListener('wheel', () => cancelNavigation(context), { passive: true })
  window.addEventListener('touchstart', () => cancelNavigation(context), { passive: true })
  document.addEventListener('keydown', (event) => {
    if ([
      'Tab',
      'ArrowUp',
      'ArrowDown',
      'PageUp',
      'PageDown',
      'Home',
      'End',
    ].includes(event.key)) {
      cancelNavigation(context)
    }
  })
}

function initSmoothing(context: ScrollContext): () => void {
  const lenis = new Lenis({
    smoothWheel: true,
    syncTouch: false,
    duration: 0.95,
    wheelMultiplier: 0.85,
    prevent: node => Boolean(node.closest('dialog, [data-lenis-prevent], .gallery__scroller')),
  })
  context.lenis = lenis
  const tick = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  lenis.on('scroll', ScrollTrigger.update)
  context.root.dataset.smoothScroll = 'true'

  const dialogs = [
    ...document.querySelectorAll<HTMLDialogElement>('dialog'),
  ]
  const syncDialogs = () => {
    if (dialogs.some(dialog => dialog.open))
      lenis.stop()
    else
      lenis.start()
  }
  const observer = new MutationObserver(syncDialogs)
  for (const dialog of dialogs) {
    dialog.setAttribute('data-lenis-prevent', '')
    observer.observe(dialog, {
      attributes: true,
      attributeFilter: ['open'],
    })
  }
  syncDialogs()

  return () => {
    observer.disconnect()
    gsap.ticker.remove(tick)
    lenis.destroy()
    context.lenis = undefined
    delete context.root.dataset.smoothScroll
  }
}

export function initScrollExperience(): void {
  const main = document.querySelector<HTMLElement>('#main')
  if (!main || initialized)
    return
  const sections = [
    ...main.querySelectorAll<HTMLElement>('[data-scroll-section]'),
  ]
  if (!sections.length)
    return
  initialized = true
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.config({ ignoreMobileResize: true })
  const initialHash = window.location.hash

  const context: ScrollContext = {
    root: document.documentElement,
    main,
    sections: sections.map(element => ({
      element,
      id: element.id,
      index: element.dataset.sectionIndex ?? '00',
      label: element.dataset.sectionLabel ?? '',
      top: 0,
      height: 0,
    })),
    links: [
      ...document.querySelectorAll<HTMLAnchorElement>('.topbar__nav a, [data-rail-link]'),
    ],
    navigationTarget: hashTarget(initialHash)?.id,
    navigationTimer: undefined,
    navigationFrame: 0,
    navigationId: 0,
    scrollY: window.scrollY,
    activeId: '',
    frame: 0,
    refreshFrame: 0,
    refreshTimer: undefined,
  }
  context.root.classList.add('scroll-ready')
  initNavigation(context)

  const media = gsap.matchMedia()
  media.add({
    all: 'all',
    motion: 'screen and (prefers-reduced-motion: no-preference)',
    desktop: 'screen and (min-width: 64rem)',
    spacious: 'screen and (min-width: 64rem) and (min-height: 45rem)',
    finePointer: '(pointer: fine)',
  }, (match) => {
    const { motion: prefersMotion, desktop, spacious, finePointer } = match.conditions!
    const motion = prefersMotion && context.root.dataset.scrollMotion !== 'false'
    context.root.dataset.motion = motion ? 'full' : 'reduced'
    if (!motion) {
      refresh(context, true)
      return () => rememberReadingPosition(context)
    }
    const stopSmoothing = desktop && finePointer && context.root.dataset.smoothScrollEnabled !== 'false'
      ? initSmoothing(context)
      : undefined
    const projects = spacious && context.root.dataset.projectExhibitionEnabled !== 'false'
      ? initProjectScroll(main, headerHeight)
      : undefined
    context.projects = projects
    initReveals(main)
    initHeroTimeline(Boolean(spacious), headerHeight)
    initSectionTimelines(main)
    refresh(context, true)
    return () => {
      rememberReadingPosition(context)
      projects?.destroy()
      context.projects = undefined
      stopSmoothing?.()
      refresh(context, true)
    }
  })

  measure(context)
  updateSectionState(context)
  window.addEventListener('scroll', () => schedule(context), { passive: true })
  window.addEventListener('resize', () => refresh(context), { passive: true })
  document.addEventListener('portfolio:layout', () => refresh(context))
  const resizeObserver = new ResizeObserver(() => refresh(context))
  resizeObserver.observe(main)

  const loaded = document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise<void>(resolve => window.addEventListener('load', () => resolve(), { once: true }))

  let ready = false
  let readyTimer = 0
  const finish = () => {
    if (ready) {
      refresh(context, true)
      return
    }
    ready = true
    window.clearTimeout(readyTimer)
    ScrollTrigger.refresh()
    measure(context)
    if (context.navigationId === 0) {
      if (initialHash)
        scrollToHash(context, initialHash, true)
      else
        context.navigationTarget = undefined
    }
    schedule(context)
    context.root.dataset.scrollReady = 'true'
  }
  // Wait for the native fragment jump when possible, but keep slow resources
  // from blocking navigation. Refresh again when their final geometry arrives.
  readyTimer = window.setTimeout(finish, 1500)
  void Promise.allSettled([loaded, document.fonts.ready]).then(finish)
}
