// @env browser
let initialized = false

function framePositions(scroller: HTMLElement, frames: HTMLElement[]): number[] {
  const origin = scroller.getBoundingClientRect().left
  return frames.map(frame => frame.getBoundingClientRect().left - origin + scroller.scrollLeft)
}

function nearestFrame(scroller: HTMLElement, positions: number[]): number {
  let best = 0
  let distance = Number.POSITIVE_INFINITY
  for (const [index, position] of positions.entries()) {
    const nextDistance = Math.abs(position - scroller.scrollLeft)
    if (nextDistance < distance) {
      distance = nextDistance
      best = index
    }
  }
  return best
}

/**
 * Horizontal contact sheet: arrow buttons advance one frame, drag-to-pan is
 * armed only after a threshold so clicking a frame opens the lightbox, and a
 * live counter/progress bar tracks the nearest frame.
 */
export function initStrips(): void {
  if (initialized)
    return
  initialized = true
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  for (const strip of document.querySelectorAll<HTMLElement>('[data-strip]')) {
    const scroller = strip.querySelector<HTMLElement>('.gallery__scroller')
    if (!scroller)
      continue

    const frames = [
      ...strip.querySelectorAll<HTMLElement>('[data-strip-frame]'),
    ]
    const current = strip.querySelector<HTMLElement>('[data-strip-current]')
    const total = strip.querySelector<HTMLElement>('[data-strip-total]')
    const progress = strip.querySelector<HTMLElement>('[data-strip-progress]')
    let raf = 0

    const update = () => {
      const max = scroller.scrollWidth - scroller.clientWidth
      const ratio = max > 0
        ? Math.min(1, Math.max(0, scroller.scrollLeft / max))
        : 0
      const positions = framePositions(scroller, frames)
      const index = nearestFrame(scroller, positions)

      if (current)
        current.textContent = String(index + 1).padStart(2, '0')
      if (total)
        total.textContent = String(frames.length).padStart(2, '0')
      if (progress)
        progress.style.transform = `scaleX(${Math.max(0.04, ratio).toFixed(4)})`
      raf = 0
    }

    const schedule = () => {
      if (!raf)
        raf = requestAnimationFrame(update)
    }

    const go = (direction: 1 | -1) => {
      const positions = framePositions(scroller, frames)
      const index = nearestFrame(scroller, positions)
      const target = Math.min(frames.length - 1, Math.max(0, index + direction))
      const left = positions[target]
      if (left === undefined)
        return
      scroller.scrollTo({
        left,
        behavior: reducedMotion.matches ? 'instant' : 'smooth',
      })
    }

    scroller.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    update()

    strip.querySelector('[data-strip-prev]')?.addEventListener('click', () => go(-1))
    strip.querySelector('[data-strip-next]')?.addEventListener('click', () => go(1))

    scroller.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
        return
      event.preventDefault()
      go(event.key === 'ArrowRight'
        ? 1
        : -1)
    })

    let dragging = false
    let startX = 0
    let startScroll = 0
    let moved = false

    scroller.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0)
        return
      dragging = true
      moved = false
      startX = event.clientX
      startScroll = scroller.scrollLeft
    })

    scroller.addEventListener('pointermove', (event) => {
      if (!dragging)
        return
      const delta = event.clientX - startX
      if (!moved && Math.abs(delta) < 6)
        return
      if (!moved) {
        moved = true
        scroller.classList.add('is-dragging')
        scroller.setPointerCapture(event.pointerId)
      }
      scroller.scrollLeft = startScroll - delta
    })

    const endDrag = (event: PointerEvent) => {
      if (!dragging)
        return
      dragging = false
      scroller.classList.remove('is-dragging')
      if (scroller.hasPointerCapture(event.pointerId))
        scroller.releasePointerCapture(event.pointerId)
    }

    scroller.addEventListener('pointerup', endDrag)
    scroller.addEventListener('pointercancel', endDrag)

    // The click that follows a drag must not open the lightbox.
    scroller.addEventListener('click', (event) => {
      if (!moved)
        return
      event.preventDefault()
      event.stopPropagation()
      moved = false
    }, true)
  }
}
