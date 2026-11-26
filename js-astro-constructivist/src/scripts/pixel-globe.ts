// @env browser
import { globePoints } from '../utils/globe'
import { uiText } from './ui'

export function initPixelGlobe(): void {
  const element = document.querySelector<HTMLElement>('[data-pixel-globe]')
  const canvas = element?.querySelector<HTMLCanvasElement>('[data-globe-canvas]')
  const context = canvas?.getContext('2d')
  if (!element || !canvas || !context)
    return
  const toggle = element.querySelector<HTMLButtonElement>('[data-globe-toggle]')!
  const symbol = element.querySelector<HTMLElement>('[data-globe-symbol]')!
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  const speed = Number(element.dataset.speed) || 0
  const size = Number(element.dataset.dotSize) || 2.2
  const latitude = Number(element.dataset.latitude) * Math.PI / 180
  const longitude = Number(element.dataset.longitude) * Math.PI / 180
  let rotation = -Number(element.dataset.longitude) * Math.PI / 180
  let visible = false
  let paused = element.dataset.autoRotate !== 'true'
  let frame = 0
  let previous = 0
  let dragX: number | undefined
  let pointer: { id: number, x: number, y: number, touch: boolean } | undefined
  let ink = getComputedStyle(element).color

  const paint = () => {
    context.clearRect(0, 0, 320, 320)
    context.strokeStyle = ink
    context.globalAlpha = 0.24
    context.beginPath()
    context.arc(160, 160, 141, 0, Math.PI * 2)
    context.stroke()
    context.fillStyle = ink
    const cosine = Math.cos(rotation)
    const sine = Math.sin(rotation)
    for (const point of globePoints) {
      const x = point.x * cosine + point.z * sine
      const depth = point.z * cosine - point.x * sine
      if (depth < 0)
        continue
      context.globalAlpha = point.land
        ? 0.65 + depth * 0.35
        : 0.07 + depth * 0.09
      const pixel = point.land ? size : 1
      context.fillRect(Math.round(160 + x * 138), Math.round(160 + point.y * 138), pixel, pixel)
    }
    const markerX = Math.cos(latitude) * Math.sin(longitude + rotation)
    const markerDepth = Math.cos(latitude) * Math.cos(longitude + rotation)
    if (markerDepth > 0) {
      context.globalAlpha = 1
      context.fillRect(Math.round(160 + markerX * 138) - 2, Math.round(160 - Math.sin(latitude) * 138) - 2, 5, 5)
      context.strokeRect(Math.round(160 + markerX * 138) - 5, Math.round(160 - Math.sin(latitude) * 138) - 5, 11, 11)
    }
    context.globalAlpha = 1
    element.setAttribute('data-globe-ready', '')
  }
  const render = (time: number) => {
    frame = 0
    if (!visible || paused || reduced.matches || document.hidden || dragX !== undefined || speed === 0)
      return
    const elapsed = previous
      ? Math.min((time - previous) / 1000, 0.05)
      : 0
    previous = time
    rotation += elapsed * speed
    paint()
    frame = requestAnimationFrame(render)
  }
  const sync = () => {
    cancelAnimationFrame(frame)
    frame = 0
    previous = 0
    toggle.setAttribute('aria-pressed', String(paused))
    toggle.setAttribute('aria-label', uiText(paused ? 'hero.play' : 'hero.pause'))
    symbol.textContent = paused ? '▶' : 'Ⅱ'
    paint()
    if (visible && !paused && !reduced.matches && !document.hidden && speed > 0)
      frame = requestAnimationFrame(render)
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false
    sync()
  })
  observer.observe(element)
  const theme = new MutationObserver(() => {
    ink = getComputedStyle(element).color
    paint()
  })
  theme.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme'],
  })
  toggle.addEventListener('click', () => {
    paused = !paused
    sync()
  })
  canvas.addEventListener('pointerdown', (event) => {
    if (reduced.matches || (event.pointerType === 'mouse' && event.button !== 0))
      return
    pointer = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      touch: event.pointerType !== 'mouse',
    }
    if (!pointer.touch) {
      dragX = event.clientX
      canvas.setPointerCapture(event.pointerId)
    }
  })
  canvas.addEventListener('pointermove', (event) => {
    if (!pointer || pointer.id !== event.pointerId)
      return
    if (pointer.touch && dragX === undefined) {
      const x = Math.abs(event.clientX - pointer.x)
      const y = Math.abs(event.clientY - pointer.y)
      if (y > x && y > 8) {
        pointer = undefined
        return
      }
      if (x < 8 || x < y)
        return
      dragX = pointer.x
      canvas.setPointerCapture(event.pointerId)
    }
    if (dragX === undefined)
      return
    rotation += (event.clientX - dragX) * 0.012
    dragX = event.clientX
    paint()
  })
  const release = () => {
    pointer = undefined
    dragX = undefined
    sync()
  }
  canvas.addEventListener('pointerup', release)
  canvas.addEventListener('pointercancel', release)
  reduced.addEventListener('change', sync)
  document.addEventListener('visibilitychange', sync)
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame)
    frame = 0
  })
  window.addEventListener('pageshow', sync)
  sync()
}
