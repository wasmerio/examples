/** @env browser */
let initialized = false

export function initCursor(): void {
  if (initialized)
    return

  const dot = document.querySelector<HTMLElement>('[data-cursor-dot]')
  const ring = document.querySelector<HTMLElement>('[data-cursor-ring]')
  const label = document.querySelector<HTMLElement>('[data-cursor-label]')
  const root = document.querySelector<HTMLElement>('.cursor')
  if (!dot || !ring || !root || !label)
    return
  initialized = true

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  let pointerX = window.innerWidth / 2
  let pointerY = window.innerHeight / 2
  let ringX = pointerX
  let ringY = pointerY
  let frame = 0
  let visible = false
  let enabled = false

  const hide = () => {
    visible = false
    root.classList.remove('is-visible', 'is-active', 'has-label')
    document.documentElement.classList.remove('cursor-enabled')
    label.textContent = ''
    cancelAnimationFrame(frame)
    frame = 0
  }

  const syncAvailability = () => {
    enabled = finePointer.matches
      && !reduceMotion.matches
      && !document.hidden
      && !document.querySelector('dialog[open]')
    if (!enabled)
      hide()
  }

  const paintRing = () => {
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
  }

  const render = () => {
    frame = 0
    if (!enabled || !visible)
      return

    ringX += (pointerX - ringX) * 0.2
    ringY += (pointerY - ringY) * 0.2
    const settled = Math.abs(pointerX - ringX) < 0.1 && Math.abs(pointerY - ringY) < 0.1
    if (settled) {
      ringX = pointerX
      ringY = pointerY
    }
    paintRing()
    if (!settled)
      frame = requestAnimationFrame(render)
  }

  const move = (event: PointerEvent) => {
    const target = event.target instanceof Element
      ? event.target
      : null
    const nativeTarget = target?.closest('input, textarea, select, [contenteditable], iframe, dialog[open]')
    if (!enabled || nativeTarget || (event.pointerType && event.pointerType !== 'mouse')) {
      hide()
      return
    }

    pointerX = event.clientX
    pointerY = event.clientY
    dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`

    if (!visible) {
      visible = true
      ringX = pointerX
      ringY = pointerY
      paintRing()
      root.classList.add('is-visible')
      document.documentElement.classList.add('cursor-enabled')
    }

    const trigger = target?.closest<HTMLElement>('[data-cursor]')
    const interactive = target?.closest('a, button, [data-lightbox], summary')
    const text = trigger?.dataset.cursor ?? ''

    root.classList.toggle('is-active', Boolean(interactive || trigger))
    root.classList.toggle('has-label', Boolean(text))
    label.textContent = text

    if (!frame)
      frame = requestAnimationFrame(render)
  }

  document.addEventListener('pointermove', move, { passive: true })
  document.addEventListener('mouseleave', hide)
  document.addEventListener('visibilitychange', syncAvailability)
  window.addEventListener('blur', hide)
  window.addEventListener('pagehide', hide)
  window.addEventListener('pageshow', syncAvailability)
  finePointer.addEventListener('change', syncAvailability)
  reduceMotion.addEventListener('change', syncAvailability)

  // Modal dialogs render above the custom cursor; leave their pointer native.
  const dialogs = new MutationObserver(syncAvailability)
  dialogs.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ['open'],
  })
  syncAvailability()
}
