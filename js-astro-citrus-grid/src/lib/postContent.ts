export function initImageFrames() {
  document
    .querySelectorAll<HTMLElement>('.post-content .img-frame:not(.is-loaded):not(.is-error)')
    .forEach((frame) => {
      const img = frame.querySelector<HTMLImageElement>('img')
      if (!img) {
        frame.classList.add('is-loaded')
        return
      }
      if (img.complete && img.naturalWidth > 0) {
        frame.classList.add('is-loaded')
        return
      }
      // 已加载失败且来自缓存：load/error 都不会再触发，直接标记错误，
      // 否则 frame 永远停在中间态
      if (img.complete && img.naturalWidth === 0) {
        frame.classList.add('is-error')
        return
      }
      img.addEventListener('load', () => frame.classList.add('is-loaded'), { once: true })
      img.addEventListener('error', () => frame.classList.add('is-error'), { once: true })
    })
}

interface TableLabels {
  wrap: string
  scroll: string
  aria: string
}

// 表格表头栏的 i18n 文案与可访问名称由 PostPage 注入（与代码块复制按钮同款模式），
// 这里按开关状态回填右侧状态文案，并补上 checkbox 的 aria-label。
// 开关本身的换行 / 滚动切换是纯 CSS（:has），本函数不参与行为。
export function bindTableModes() {
  const labels = (window as unknown as { __blogTableLabels?: TableLabels }).__blogTableLabels
  if (!labels) return
  document.querySelectorAll('.md-table').forEach((table) => {
    const input = table.querySelector<HTMLInputElement>('.md-table-toggle')
    const state = table.querySelector<HTMLElement>('.md-table-state')
    if (!input || !state) return
    input.setAttribute('aria-label', labels.aria)
    const apply = () => {
      state.textContent = input.checked ? labels.scroll : labels.wrap
    }
    apply()
    input.addEventListener('change', apply)
  })
}

export function initReadingReveal() {
  const body = document.querySelector<HTMLElement>('.post-content')
  if (!body) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!('IntersectionObserver' in window)) return
  const blocks = Array.from(body.children).filter(
    (el): el is HTMLElement => el instanceof HTMLElement && !el.classList.contains('img-frame'),
  )
  if (!blocks.length) return
  body.classList.add('reading-reveal')
  const vh = window.innerHeight
  let stagger = 0
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        // 一次性 reveal：只播放一次淡入，不因滚出视口而重新隐藏，
        // 否则来回滚动时已读内容会反复闪烁
        const t = entry.target as HTMLElement
        t.classList.add('reveal-in')
        io.unobserve(t)
      }
    },
    { rootMargin: '0px 0px -4% 0px', threshold: 0.01 },
  )
  for (const el of blocks) {
    const top = el.getBoundingClientRect().top
    if (top < vh * 0.92) {
      el.style.transitionDelay = `${Math.min(stagger * 70, 480)}ms`
      stagger++
    }
    io.observe(el)
  }
}
