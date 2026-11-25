export interface PointerPreviewHover {
  selector: string
  className: string
}

export interface PointerPreviewOptions {
  previewSelector?: string
  prepareClone?: (clone: HTMLElement) => void
  syncClone?: (clone: HTMLElement, source: HTMLElement, preview: HTMLElement) => void
  resetOnDetach?: boolean
  hover?: PointerPreviewHover
  resyncEvents?: string[]
}

export function attachPointerPreview(source: HTMLElement, options: PointerPreviewOptions = {}) {
  const preview = source.querySelector<HTMLElement>(
    options.previewSelector ?? '[data-card-preview]',
  )
  if (!preview) return

  const { prepareClone, syncClone, resetOnDetach = false, hover, resyncEvents } = options
  const hoverSel = hover?.selector ?? ''
  const hoverClass = hover?.className ?? ''

  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  let frame = 0
  let syncTimer = 0
  let active = false
  let pointerX = 0
  let pointerY = 0
  let originLeft = 0
  let originTop = 0
  let clone: HTMLElement | null = null
  let hoverIndex = -1
  let cloneHoverables: HTMLElement[] = []

  preview.inert = true

  const hoverables = hover
    ? [...source.querySelectorAll<HTMLElement>(hoverSel)].filter((el) => !preview.contains(el))
    : []

  const build = () => {
    const dark = document.documentElement.classList.contains('dark')
    const next = source.cloneNode(true) as HTMLElement
    prepareClone?.(next)
    next.classList.add('card-preview-clone')
    next.classList.add(dark ? 'light' : 'dark')
    next.setAttribute('aria-hidden', 'true')
    preview.replaceChildren(next)
    clone = next
    if (hover) cloneHoverables = [...next.querySelectorAll<HTMLElement>(hoverSel)]
  }

  const measure = () => {
    const rect = preview.getBoundingClientRect()
    originLeft = rect.left
    originTop = rect.top
  }

  const render = () => {
    preview.style.setProperty('--preview-x', `${pointerX - originLeft}px`)
    preview.style.setProperty('--preview-y', `${pointerY - originTop}px`)
  }

  const reset = () => {
    active = false
    preview.classList.remove('is-on')
    window.clearInterval(syncTimer)
    syncTimer = 0
    if (hoverIndex >= 0) cloneHoverables[hoverIndex]?.classList.remove(hoverClass)
    hoverIndex = -1
  }

  const sync = () => {
    const root = clone
    if (!root) return
    if (resetOnDetach && !source.isConnected) {
      reset()
      return
    }
    const dark = document.documentElement.classList.contains('dark')
    const wantClass = `${source.className} card-preview-clone ${dark ? 'light' : 'dark'}`
    if (root.className !== wantClass) root.className = wantClass
    syncClone?.(root, source, preview)
  }

  const syncHover = (target: EventTarget | null) => {
    if (!hover) return
    const hit = target instanceof Element ? target.closest<HTMLElement>(hoverSel) : null
    const idx = hit && !preview.contains(hit) ? hoverables.indexOf(hit) : -1
    if (idx === hoverIndex) return
    if (hoverIndex >= 0) cloneHoverables[hoverIndex]?.classList.remove(hoverClass)
    if (idx >= 0) cloneHoverables[idx]?.classList.add(hoverClass)
    hoverIndex = idx
  }

  const move = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || reduceQuery.matches) return
    pointerX = e.clientX
    pointerY = e.clientY
    if (!active) {
      active = true
      measure()
      sync()
      render()
      syncHover(e.target)
      preview.classList.add('is-on')
      window.clearInterval(syncTimer)
      syncTimer = window.setInterval(() => {
        if (active) sync()
      }, 250)
      return
    }
    syncHover(e.target)
    if (!frame) {
      frame = requestAnimationFrame(() => {
        frame = 0
        if (!active) return
        render()
        sync()
      })
    }
  }

  const leave = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    reset()
  }

  const refresh = () => {
    if (!active) return
    if (!preview.isConnected || !preview.offsetWidth) {
      reset()
      return
    }
    measure()
    render()
  }

  const onThemeChange = () => {
    if (!active) return
    sync()
    render()
  }

  const onResync = () => {
    if (active) sync()
  }

  build()
  source.addEventListener('pointermove', move, { passive: true })
  source.addEventListener('pointerleave', leave)
  window.addEventListener('scroll', refresh, { passive: true })
  window.addEventListener('resize', refresh)
  document.addEventListener('theme-change', onThemeChange)
  for (const name of resyncEvents ?? []) {
    source.addEventListener(name, onResync)
  }

  // 解绑全部监听器并释放定时器/动画帧，供 swup 换页等场景回收旧卡片引用
  const dispose = () => {
    source.removeEventListener('pointermove', move)
    source.removeEventListener('pointerleave', leave)
    window.removeEventListener('scroll', refresh)
    window.removeEventListener('resize', refresh)
    document.removeEventListener('theme-change', onThemeChange)
    for (const name of resyncEvents ?? []) {
      source.removeEventListener(name, onResync)
    }
    window.clearInterval(syncTimer)
    if (frame) window.cancelAnimationFrame(frame)
    reset()
    disposers.delete(entry)
  }

  const entry = { source, dispose }
  disposers.add(entry)
  return dispose
}

// 卡片随 swup 换页被替换，但挂到 window/document 上的监听器闭包会持有
// 整棵脱离文档的 DOM 子树；换页开始时回收 swup 容器内的实例。
// 容器外的持久元素（如 ProfileCard）不在被替换之列，予以保留。
const disposers = new Set<{ source: HTMLElement; dispose: () => void }>()
let swapCleanupBound = false

function bindSwapCleanup() {
  if (swapCleanupBound) return
  swapCleanupBound = true
  document.addEventListener('astro:before-swap', () => {
    const container = document.getElementById('swup-container')
    if (!container) return
    for (const entry of [...disposers]) {
      if (container.contains(entry.source)) entry.dispose()
    }
  })
}
bindSwapCleanup()
