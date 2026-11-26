// @env browser
import { gsap } from 'gsap'
import { uiText } from './ui'

let initialized: Promise<void> | undefined

export function initSiteLoader(): Promise<void> {
  if (initialized)
    return initialized

  initialized = new Promise<void>((resolve) => {
    const root = document.documentElement
    const loader = document.querySelector<HTMLElement>('[data-site-loader]')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const plates = loader
      ? [
          ...loader.querySelectorAll<HTMLElement>('[data-loader-plate]'),
        ]
      : []
    const status = loader?.querySelector<HTMLElement>('[data-loader-status]')
    const skip = loader?.querySelector<HTMLButtonElement>('[data-loader-skip]')
    let assembling: gsap.core.Timeline | undefined
    let exit: gsap.core.Timeline | undefined
    let resolved = false
    let completed = false
    let resourcesReady = false
    let releaseTimer = 0
    let readinessTimer = 0
    let revealTimer = 0
    const listeners = new AbortController()
    const started = performance.now()

    const allowEntrance = () => {
      if (resolved)
        return
      resolved = true
      document.dispatchEvent(new Event('portfolio:enter'))
      resolve()
    }
    const release = (result: string) => {
      if (completed)
        return
      completed = true
      assembling?.kill()
      exit?.kill()
      window.clearTimeout(releaseTimer)
      window.clearTimeout(readinessTimer)
      window.clearTimeout(revealTimer)
      listeners.abort()
      const focusWasInLoader = loader?.contains(document.activeElement)
      root.classList.remove('loader-active')
      root.dataset.loaderState = 'complete'
      root.dataset.loaderReady = 'true'
      root.dataset.loaderResult = result
      for (const element of document.querySelectorAll<HTMLElement>('[data-loader-inert]')) {
        element.inert = false
        delete element.dataset.loaderInert
      }
      if (loader) {
        loader.hidden = true
        loader.setAttribute('aria-hidden', 'true')
      }
      if (focusWasInLoader)
        document.querySelector<HTMLElement>('#main')?.focus({ preventScroll: true })
      allowEntrance()
      document.dispatchEvent(new CustomEvent('portfolio:ready', {
        detail: { result, resourcesReady },
      }))
    }

    if (!loader || !root.classList.contains('loader-active') || reduced.matches || !window.matchMedia('screen').matches) {
      release('bypassed')
      return
    }

    const minimum = Number(loader.dataset.loaderMinimum) || 0
    const maxWait = Number(loader.dataset.loaderMaxWait) || 6000
    root.dataset.loaderState = 'assembling'
    for (const element of document.querySelectorAll<HTMLElement>('.topbar, #main, .rail, [data-blueprint-toggle]')) {
      if (!element.inert) {
        element.inert = true
        element.dataset.loaderInert = ''
      }
    }

    const entrance = new Promise<void>((done) => {
      assembling = gsap.timeline({ onComplete: done })
      assembling.set(plates, { xPercent: -50, yPercent: -50 })
      for (const [index, plate] of plates.entries()) {
        const angle = Number(plate.dataset.loaderAngle)
        assembling.fromTo(plate, {
          opacity: 0,
          y: index % 2
            ? -90
            : 90,
          x: index % 2
            ? 45
            : -45,
          scale: 0.72,
          rotation: angle + (index % 2
            ? 9
            : -9),
        }, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: angle,
          duration: 0.55,
          ease: 'back.out(1.15)',
        }, index * 0.1)
      }
    })

    const ready = new Promise<void>((done) => {
      if (status)
        status.textContent = uiText('loader.fonts')
      const fonts = document.fonts.ready.then(() => {
        resourcesReady = true
      }, () => {})
      readinessTimer = window.setTimeout(done, maxWait)
      void fonts.then(() => {
        window.clearTimeout(readinessTimer)
        done()
      })
    })

    const reveal = () => {
      if (completed)
        return
      root.dataset.loaderState = 'merging'
      if (status) {
        status.textContent = resourcesReady
          ? uiText('loader.ready')
          : uiText('loader.enter')
      }
      exit = gsap.timeline({
        onComplete: () => release(resourcesReady ? 'ready' : 'timeout'),
      })
      exit.to(plates, {
        left: '50%',
        top: '50%',
        width: '110vw',
        height: '110dvh',
        rotation: 0,
        scale: 1,
        duration: 0.48,
        stagger: 0.035,
        ease: 'power3.inOut',
      }, 0)
      exit.to(loader.querySelector('.site-loader__wordmark'), { opacity: 1, duration: 0.24 }, 0.3)
      exit.call(() => {
        root.dataset.loaderState = 'revealing'
        allowEntrance()
      }, [], 0.58)
      exit.to(loader, {
        clipPath: 'polygon(110% 0%, 100% 0%, 100% 100%, 100% 100%)',
        duration: 0.62,
        ease: 'power3.inOut',
      }, 0.58)
    }

    // Readiness is font-backed, while the visual sequence has a bounded minimum.
    void Promise.all([entrance, ready]).then(() => {
      if (completed)
        return
      const remaining = Math.max(0, minimum - 1200 - (performance.now() - started))
      revealTimer = window.setTimeout(reveal, remaining)
    }).catch(() => release('failed-open'))

    releaseTimer = window.setTimeout(release, maxWait + 1500, 'failed-open')
    skip?.addEventListener('click', () => release('skipped'), { signal: listeners.signal })
    document.querySelector('.skip-link')?.addEventListener('click', () => release('skipped'), { once: true, signal: listeners.signal })
    reduced.addEventListener('change', (event) => {
      if (event.matches)
        release('reduced-motion')
    }, { signal: listeners.signal })
    window.addEventListener('beforeprint', () => release('print'), { once: true, signal: listeners.signal })
    window.addEventListener('pageshow', (event) => {
      if (event.persisted)
        release('restored')
    }, { signal: listeners.signal })
    window.addEventListener('pagehide', () => release('departed'), { once: true, signal: listeners.signal })
    const failOpen = new MutationObserver(() => {
      if (!root.classList.contains('loader-active'))
        release('failed-open')
      if (completed)
        failOpen.disconnect()
    })
    failOpen.observe(root, {
      attributes: true,
      attributeFilter: ['class'],
    })
  })
  return initialized
}
