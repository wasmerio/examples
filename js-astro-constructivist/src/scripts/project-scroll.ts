// @env browser
import { gsap } from 'gsap'

export interface ProjectScroll {
  targetY: (target: HTMLElement) => number | undefined
  focusedY: (target: HTMLElement) => number | undefined
  readingTarget: () => HTMLElement | undefined
  sync: () => void
  destroy: () => void
}

export function initProjectScroll(main: HTMLElement, headerHeight: () => number): ProjectScroll | undefined {
  const exhibition = main.querySelector<HTMLElement>('[data-project-exhibition]')
  const pin = exhibition?.querySelector<HTMLElement>('[data-project-pin]')
  const track = exhibition?.querySelector<HTMLElement>('[data-project-track]')
  const panels = [
    ...(track?.querySelectorAll<HTMLElement>('[data-project]') ?? []),
  ]
  if (!exhibition || !pin || !track || panels.length < 2)
    return

  const counter = exhibition.querySelector<HTMLElement>('[data-project-current]')
  const links = [
    ...(exhibition.closest('section')?.querySelectorAll<HTMLAnchorElement>('a[href^="#project-"]') ?? []),
  ]
  const originalTransform = track.style.transform
  let travel = 0
  let activeIndex = -1

  const measure = () => {
    travel = Math.max(0, track.scrollWidth - pin.clientWidth)
    const value = `${travel}px`
    if (exhibition.style.getPropertyValue('--project-travel') !== value)
      exhibition.style.setProperty('--project-travel', value)
  }
  const offset = (panel: HTMLElement) => gsap.utils.clamp(0, travel, panel.offsetLeft - panels[0]!.offsetLeft)
  const update = (progress: number) => {
    exhibition.style.setProperty('--project-progress', progress.toFixed(4))
    const distance = progress * travel
    let next = 0
    for (const [index, panel] of panels.entries()) {
      if (distance >= offset(panel) - panel.offsetWidth / 2)
        next = index
    }
    if (next === activeIndex)
      return
    activeIndex = next
    const current = panels[next]!
    exhibition.dataset.activeProject = current.id
    if (counter)
      counter.textContent = String(next + 1).padStart(2, '0')
    for (const link of links) {
      if (link.hash === `#${current.id}`)
        link.setAttribute('aria-current', 'true')
      else
        link.removeAttribute('aria-current')
    }
  }
  const reset = () => {
    delete exhibition.dataset.projectScroll
    delete exhibition.dataset.activeProject
    exhibition.style.removeProperty('--project-travel')
    exhibition.style.removeProperty('--project-progress')
    for (const link of links)
      link.removeAttribute('aria-current')
    if (counter)
      counter.textContent = '01'
  }

  // The opt-in attribute establishes the flex geometry before it is measured.
  exhibition.dataset.projectScroll = 'true'
  measure()
  if (travel < 1) {
    reset()
    return
  }

  const tween = gsap.to(track, {
    x: () => -travel,
    ease: 'none',
    scrollTrigger: {
      trigger: exhibition,
      start: () => `top top+=${headerHeight()}`,
      end: () => `+=${Math.max(1, travel)}`,
      scrub: 0.65,
      invalidateOnRefresh: true,
      onRefreshInit: measure,
      onUpdate: self => update(self.progress),
      onRefresh: self => update(self.progress),
    },
  })
  const trigger = tween.scrollTrigger

  const targetY = (target: HTMLElement) => {
    const panel = target.closest<HTMLElement>('[data-project]')
    if (!panel || !panels.includes(panel))
      return
    const top = exhibition.getBoundingClientRect().top + window.scrollY - headerHeight()
    return Math.max(0, top + offset(panel))
  }

  update(trigger?.progress ?? 0)

  return {
    targetY,
    focusedY: (target) => {
      const destination = targetY(target)
      if (destination === undefined)
        return
      const bounds = target.getBoundingClientRect()
      const viewport = pin.getBoundingClientRect()
      if (bounds.left < viewport.left || bounds.right > viewport.right
        || bounds.top < headerHeight() || bounds.bottom > window.innerHeight) {
        return destination
      }
    },
    readingTarget: () => panels[Math.max(0, activeIndex)],
    sync: () => {
      trigger?.getTween()?.progress(1)
    },
    destroy: () => {
      trigger?.getTween()?.kill()
      trigger?.kill()
      tween.revert()
      gsap.set(track, { clearProps: 'transform' })
      if (originalTransform)
        track.style.transform = originalTransform
      reset()
    },
  }
}
