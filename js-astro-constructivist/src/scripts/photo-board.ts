// @env browser
import { uiText } from './ui'

const BREAKPOINT = '(min-width: 64rem)'
const DRAG_THRESHOLD = 6

type Mode = 'board' | 'strip'

interface Offset {
  x: number
  y: number
}

interface Drag {
  print: HTMLElement
  pointerId: number
  startX: number
  startY: number
  lastX: number
  lastY: number
  moved: boolean
}

interface LightboxLink {
  link: HTMLAnchorElement
  group: string
}

let initialized = false
// Viewers keep their explicit choice for this page session only.
let preferred: Mode | null = null

/**
 * Gallery modes. The board pins four prints on a paper surface and lets them
 * be dragged inside its bounds; the strip stays the original horizontal contact
 * sheet. Only the active mode is exposed to assistive tech, keyboard order and
 * the lightbox group, and a drag past a small threshold never opens a print.
 */
export function initPhotoBoard(): void {
  if (initialized)
    return
  initialized = true

  const gallery = document.querySelector<HTMLElement>('[data-gallery]')
  if (!gallery)
    return

  const board = gallery.querySelector<HTMLElement>('[data-board]')
  const boardPanel = gallery.querySelector<HTMLElement>('[data-gallery-mode-panel="board"]')
  const stripPanel = gallery.querySelector<HTMLElement>('[data-gallery-mode-panel="strip"]')
  const stripTools = gallery.querySelector<HTMLElement>('[data-strip-tools]')
  const scroller = gallery.querySelector<HTMLElement>('.gallery__scroller')
  const reset = gallery.querySelector<HTMLButtonElement>('[data-board-reset]')
  const status = gallery.querySelector<HTMLElement>('[data-board-status]')
  const modeButtons = [
    ...gallery.querySelectorAll<HTMLButtonElement>('[data-gallery-mode]'),
  ]
  const prints = [
    ...gallery.querySelectorAll<HTMLElement>('[data-board-print]'),
  ]

  if (!board || !boardPanel || !stripPanel || modeButtons.length === 0)
    return

  const boardLinks: LightboxLink[] = [
    ...boardPanel.querySelectorAll<HTMLAnchorElement>('[data-lightbox]'),
  ].map(link => ({ link, group: link.dataset.lightbox ?? 'gallery' }))
  const stripLinks: LightboxLink[] = [
    ...stripPanel.querySelectorAll<HTMLAnchorElement>('[data-lightbox]'),
  ].map(link => ({ link, group: link.dataset.lightbox ?? 'gallery' }))
  const offsets = new Map<HTMLElement, Offset>()

  const setLightboxGroup = (links: LightboxLink[], enabled: boolean) => {
    for (const { link, group } of links) {
      if (enabled)
        link.setAttribute('data-lightbox', group)
      else
        link.removeAttribute('data-lightbox')
    }
  }

  const boardBounds = () => {
    const rect = board.getBoundingClientRect()
    return {
      left: rect.left + board.clientLeft,
      top: rect.top + board.clientTop,
      right: rect.left + board.clientLeft + board.clientWidth,
      bottom: rect.top + board.clientTop + board.clientHeight,
    }
  }

  const place = (print: HTMLElement, x: number, y: number) => {
    const offset = {
      x: Math.round(x),
      y: Math.round(y),
    }
    offsets.set(print, offset)
    print.style.setProperty('--dx', `${offset.x}px`)
    print.style.setProperty('--dy', `${offset.y}px`)
  }

  const keepInside = (print: HTMLElement) => {
    const offset = offsets.get(print)
    if (!offset)
      return

    const bounds = boardBounds()
    const rect = print.getBoundingClientRect()
    let x = offset.x
    let y = offset.y

    if (rect.left < bounds.left)
      x += bounds.left - rect.left
    else if (rect.right > bounds.right)
      x -= rect.right - bounds.right
    if (rect.top < bounds.top)
      y += bounds.top - rect.top
    else if (rect.bottom > bounds.bottom)
      y -= rect.bottom - bounds.bottom

    if (x !== offset.x || y !== offset.y)
      place(print, x, y)
  }

  const keepAllInside = () => {
    if (boardPanel.hidden)
      return
    for (const print of prints)
      keepInside(print)
  }

  const applyMode = (mode: Mode) => {
    const boardActive = mode === 'board'
    gallery.dataset.galleryView = mode

    boardPanel.hidden = !boardActive
    boardPanel.toggleAttribute('inert', !boardActive)
    stripPanel.hidden = boardActive
    stripPanel.toggleAttribute('inert', boardActive)

    if (stripTools) {
      stripTools.hidden = boardActive
      stripTools.toggleAttribute('inert', boardActive)
    }

    for (const button of modeButtons)
      button.setAttribute('aria-pressed', String(button.dataset.galleryMode === mode))

    setLightboxGroup(boardLinks, boardActive)
    setLightboxGroup(stripLinks, !boardActive)

    if (!boardActive && scroller) {
      // The strip measured itself while the other panel was on top; ask
      // initStrips to recompute frame positions for the newly painted layout.
      scroller.dispatchEvent(new Event('scroll'))
    }
  }

  const media = window.matchMedia(BREAKPOINT)

  for (const button of modeButtons) {
    button.addEventListener('click', () => {
      const mode: Mode = button.dataset.galleryMode === 'strip'
        ? 'strip'
        : 'board'
      preferred = mode
      applyMode(mode)
    })
  }

  media.addEventListener('change', () => {
    if (!preferred)
      applyMode(media.matches ? 'board' : 'strip')
  })

  applyMode(preferred ?? (media.matches ? 'board' : 'strip'))

  let drag: Drag | null = null
  let suppressClick = false

  board.addEventListener('dragstart', (event) => {
    event.preventDefault()
  })

  board.addEventListener('pointerdown', (event) => {
    if (drag || (event.pointerType === 'mouse' && event.button !== 0))
      return

    const target = event.target as Element | null
    const print = target?.closest<HTMLElement>('[data-board-print]')
    if (!print || !board.contains(print))
      return

    drag = {
      print,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      moved: false,
    }
    suppressClick = false
  })

  board.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.pointerId)
      return

    if (!drag.moved) {
      const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY)
      if (distance < DRAG_THRESHOLD)
        return

      drag.moved = true
      drag.lastX = drag.startX
      drag.lastY = drag.startY
      board.classList.add('is-dragging')
      drag.print.classList.add('is-dragging')
      drag.print.setPointerCapture(event.pointerId)
    }

    const stepX = event.clientX - drag.lastX
    const stepY = event.clientY - drag.lastY
    drag.lastX = event.clientX
    drag.lastY = event.clientY

    const offset = offsets.get(drag.print) ?? { x: 0, y: 0 }
    place(drag.print, offset.x + stepX, offset.y + stepY)
    keepInside(drag.print)
  })

  const endDrag = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointerId)
      return

    const { print, moved } = drag
    if (print.hasPointerCapture(event.pointerId))
      print.releasePointerCapture(event.pointerId)
    print.classList.remove('is-dragging')
    board.classList.remove('is-dragging')
    drag = null

    // The click that follows a drag must not open the lightbox.
    suppressClick = moved
  }

  window.addEventListener('pointerup', endDrag)
  window.addEventListener('pointercancel', endDrag)

  board.addEventListener('click', (event) => {
    if (!suppressClick)
      return
    suppressClick = false

    // Only pointer clicks are leftovers from a drag; keyboard and assistive
    // activations report detail 0 and must keep opening the lightbox.
    if (event.detail === 0)
      return

    event.preventDefault()
    event.stopPropagation()
  }, true)

  reset?.addEventListener('click', () => {
    for (const print of prints) {
      print.style.removeProperty('--dx')
      print.style.removeProperty('--dy')
      offsets.delete(print)
    }

    if (!status)
      return
    status.textContent = ''
    requestAnimationFrame(() => {
      status.textContent = uiText('gallery.resetStatus')
    })
  })

  // Re-clamp when the board box changes (viewport, drawer, mode switch).
  const boardObserver = new ResizeObserver(keepAllInside)
  boardObserver.observe(board)
}
