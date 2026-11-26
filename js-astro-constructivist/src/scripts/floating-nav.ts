/** @env browser */
import { gsap } from 'gsap'

export function initFloatingNav(): void {
  const dock = document.querySelector<HTMLElement>('[data-dock]')
  const nav = dock?.querySelector<HTMLElement>('[data-dock-nav]')
  const indicator = dock?.querySelector<HTMLElement>('[data-dock-indicator]')
  if (!dock || !nav || !indicator)
    return
  const links = [
    ...nav.querySelectorAll<HTMLAnchorElement>('[data-dock-link]'),
  ]
  let hovered: HTMLAnchorElement | undefined
  let focused: HTMLAnchorElement | undefined
  let frame = 0
  let entrance: gsap.core.Tween | undefined
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  const tiles = dock.querySelectorAll('.topbar__brand, [data-dock-link], .topbar__appearance, .topbar__index-tile')

  const paint = () => {
    frame = 0
    const active = links.find(link => link.getAttribute('aria-current') === 'location')
    const target = hovered ?? focused ?? active
    dock.dataset.dockState = window.scrollY > 32
      ? 'scrolled'
      : 'top'
    for (const link of links)
      link.toggleAttribute('data-dock-highlight', link === target)
    if (!target || nav.clientWidth === 0) {
      indicator.style.opacity = '0'
      delete dock.dataset.dockTarget
      return
    }
    indicator.style.width = `${target.offsetWidth}px`
    indicator.style.transform = `translate3d(${target.offsetLeft}px, 0, 0)`
    indicator.style.opacity = '1'
    dock.dataset.dockTarget = target.hash.slice(1)
  }
  const schedule = () => {
    if (!frame)
      frame = requestAnimationFrame(paint)
  }
  for (const link of links) {
    link.addEventListener('pointerenter', () => {
      hovered = link
      schedule()
    })
    link.addEventListener('pointerleave', () => {
      hovered = undefined
      schedule()
    })
    link.addEventListener('focus', () => {
      focused = link
      schedule()
    })
    link.addEventListener('blur', () => {
      focused = undefined
      schedule()
    })
  }
  const observer = new ResizeObserver(schedule)
  observer.observe(nav)
  document.addEventListener('portfolio:section', schedule)
  const mutation = new MutationObserver(schedule)
  mutation.observe(nav, {
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-current'],
  })
  window.addEventListener('scroll', schedule, { passive: true })
  void document.fonts.ready.then(schedule)
  const enter = () => {
    if (reduced.matches)
      return
    entrance = gsap.fromTo(tiles, { y: -22, rotation: -2 }, {
      y: 0,
      rotation: 0,
      duration: 0.65,
      stagger: 0.055,
      ease: 'power3.out',
      clearProps: 'transform',
    })
  }
  reduced.addEventListener('change', (event) => {
    if (!event.matches)
      return
    entrance?.kill()
    gsap.set(tiles, { clearProps: 'transform' })
  })
  if (document.documentElement.classList.contains('loader-active'))
    document.addEventListener('portfolio:enter', enter, { once: true })
  else
    enter()
  paint()
}
