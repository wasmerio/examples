// @env browser
import { uiText } from './ui'

let initialized = false

interface Viewer {
  dialog: HTMLDialogElement
  image: HTMLImageElement
  caption: HTMLElement
  current: HTMLElement | null
  total: HTMLElement | null
  series: HTMLElement | null
  prev: HTMLButtonElement | null
  next: HTMLButtonElement | null
}

let viewer: Viewer | null = null
let group: HTMLAnchorElement[] = []
let groupName = 'archive'
let index = 0
let lastTrigger: HTMLAnchorElement | null = null

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function canTransition(): boolean {
  return typeof document.startViewTransition === 'function' && !prefersReducedMotion()
}

function findSourceImage(trigger: HTMLAnchorElement): HTMLImageElement | null {
  const images = [
    ...trigger.querySelectorAll<HTMLImageElement>('img'),
  ]
  return images.find(image => image.offsetParent !== null) ?? images[0] ?? null
}

function getGroup(name: string): HTMLAnchorElement[] {
  return [
    ...document.querySelectorAll<HTMLAnchorElement>(`[data-lightbox="${name}"]`),
  ]
    .filter(trigger => Boolean(trigger.getAttribute('href')))
}

function paint(trigger: HTMLAnchorElement): void {
  if (!viewer)
    return

  const source = findSourceImage(trigger)
  const src = source?.currentSrc || source?.src || trigger.getAttribute('href') || ''
  const label = trigger.dataset.caption ?? source?.alt ?? ''

  viewer.image.src = src
  viewer.image.alt = source?.alt ?? ''
  viewer.caption.textContent = label

  if (viewer.current)
    viewer.current.textContent = String(index + 1).padStart(2, '0')
  if (viewer.total)
    viewer.total.textContent = String(group.length).padStart(2, '0')
  if (viewer.series) {
    viewer.series.textContent = groupName === 'gallery'
      ? uiText('lightbox.gallery')
      : groupName === 'projects'
        ? uiText('lightbox.projects')
        : uiText('lightbox.archive')
  }

  const single = group.length < 2
  if (viewer.prev) {
    viewer.prev.disabled = single
    viewer.prev.setAttribute('aria-disabled', String(single))
  }
  if (viewer.next) {
    viewer.next.disabled = single
    viewer.next.setAttribute('aria-disabled', String(single))
  }
}

function open(trigger: HTMLAnchorElement): void {
  if (!viewer)
    return

  groupName = trigger.dataset.lightbox ?? 'archive'
  group = getGroup(groupName)
  index = Math.max(0, group.indexOf(trigger))
  lastTrigger = trigger

  const source = findSourceImage(trigger)
  paint(trigger)

  if (viewer.dialog.open) {
    if (canTransition()) {
      document.startViewTransition(() => paint(trigger))
    }
    return
  }

  const show = () => {
    if (!viewer)
      return
    viewer.dialog.showModal()
    document.documentElement.classList.add('lightbox-open')
  }

  if (!canTransition() || !source) {
    show()
    return
  }

  source.style.viewTransitionName = 'lightbox-media'
  const transition = document.startViewTransition(() => {
    source.style.viewTransitionName = ''
    show()
  })
  const clearTransition = () => {
    source.style.viewTransitionName = ''
  }
  void transition.finished.then(clearTransition, clearTransition)
}

function step(direction: 1 | -1): void {
  if (!viewer || group.length < 2)
    return

  index = (index + direction + group.length) % group.length
  const next = group[index]
  lastTrigger = next

  if (canTransition()) {
    document.startViewTransition(() => {
      if (next)
        paint(next)
    })
  }
  else if (next) {
    paint(next)
  }
}

function hide(): void {
  if (!viewer || !viewer.dialog.open)
    return

  const source = lastTrigger
    ? findSourceImage(lastTrigger)
    : null
  const close = () => {
    if (!viewer)
      return
    viewer.dialog.close()
  }

  if (!canTransition() || !source) {
    close()
    return
  }

  const transition = document.startViewTransition(() => {
    source.style.viewTransitionName = 'lightbox-media'
    close()
  })
  const clearTransition = () => {
    source.style.viewTransitionName = ''
  }
  void transition.finished.then(clearTransition, clearTransition)
}

export function initLightbox(): void {
  if (initialized)
    return
  initialized = true

  const dialog = document.getElementById('lightbox') as HTMLDialogElement | null
  if (!dialog)
    return

  const image = dialog.querySelector<HTMLImageElement>('.lightbox__image')
  const caption = dialog.querySelector<HTMLElement>('[data-lightbox-caption]')
  if (!image || !caption)
    return

  viewer = {
    dialog,
    image,
    caption,
    current: dialog.querySelector<HTMLElement>('[data-lightbox-current]'),
    total: dialog.querySelector<HTMLElement>('[data-lightbox-total]'),
    series: dialog.querySelector<HTMLElement>('[data-lightbox-series]'),
    prev: dialog.querySelector<HTMLButtonElement>('[data-lightbox-prev]'),
    next: dialog.querySelector<HTMLButtonElement>('[data-lightbox-next]'),
  }

  dialog.addEventListener('close', () => {
    if (dialog.open)
      return
    document.documentElement.classList.remove('lightbox-open')
    lastTrigger?.focus({ preventScroll: true })
  })

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || event.button !== 0)
      return
    const target = event.target as Element | null
    if (!target)
      return

    const trigger = target.closest<HTMLAnchorElement>('[data-lightbox]')
    if (trigger) {
      event.preventDefault()
      open(trigger)
      return
    }

    if (target.closest('[data-lightbox-close]')) {
      hide()
      return
    }

    if (target.closest('[data-lightbox-prev]')) {
      step(-1)
      return
    }

    if (target.closest('[data-lightbox-next]')) {
      step(1)
      return
    }

    if (target === dialog)
      hide()
  })

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault()
    hide()
  })

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft')
      step(-1)
    else if (event.key === 'ArrowRight')
      step(1)
  })
}
