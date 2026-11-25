export const HEADING_SCROLL_OFFSET = 80

export function findAnchorTarget(id: string): HTMLElement | null {
  let el = document.getElementById(id)
  if (el) return el
  try {
    const decoded = decodeURIComponent(id)
    if (decoded !== id) {
      el = document.getElementById(decoded)
      if (el) return el
    }
  } catch {}
  const encoded = encodeURIComponent(id)
  if (encoded !== id) {
    el = document.getElementById(encoded)
    if (el) return el
  }
  return null
}

export function smoothScrollToHeading(id: string): HTMLElement | null {
  const el = findAnchorTarget(id)
  if (!el) return null
  const top = el.getBoundingClientRect().top + window.scrollY - HEADING_SCROLL_OFFSET
  // 与 swupBindings 的同款滚动一致：尊重 prefers-reduced-motion
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
  return el
}

type ExecCommandFn = (this: Document, commandId: string) => boolean

function execCopyFallback() {
  const execCommand = (document as unknown as { execCommand?: ExecCommandFn }).execCommand
  if (typeof execCommand !== 'function') return
  execCommand.call(document, 'copy')
}

function copyTextFallback(text: string) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px'
  document.body.appendChild(ta)
  ta.select()
  try {
    execCopyFallback()
  } catch {
    /* ignore */
  }
  document.body.removeChild(ta)
}

interface CopyWindow {
  __blogCopyIdleHtml?: string
  __blogCopyDoneHtml?: string
  __blogCopyCode?: (btn: HTMLElement) => void
  __blogToggleCodeWrap?: (btn: HTMLElement) => void
  __blogCodeWrapLabels?: { wrap: string; unwrap: string; aria: string }
}

// 换行 / 不换行切换：切换 code-block 的 is-wrapped 类（样式见 markdown.css：
// 折行时长代码行占多个视觉行，行号会错位，故同时隐藏行号栏）
function applyCodeWrapState(btn: HTMLElement, on: boolean) {
  const w = window as unknown as CopyWindow
  btn.setAttribute('aria-pressed', on ? 'true' : 'false')
  const labels = w.__blogCodeWrapLabels
  if (labels) btn.title = on ? labels.unwrap : labels.wrap
}

// 折行模式下把纯文本按逻辑行放进与 code 同宽、同排版属性的隐藏镜像里，
// 测得每行折行后的实际高度，再同步 gutter 行号的占位高度：
// 发生折行的逻辑行隐藏自己的行号（.is-folded），其余行号保持显示且仍逐行对齐。
function syncWrappedGutter(block: HTMLElement) {
  const pre = block.querySelector<HTMLElement>('.code-pre')
  const code = pre?.querySelector<HTMLElement>('code')
  const gutter = block.querySelector<HTMLElement>('.code-gutter')
  if (!pre || !code || !gutter) return

  const spans = gutter.querySelectorAll<HTMLElement>('span')
  if (!spans.length) return

  const cs = getComputedStyle(code)
  const preCs = getComputedStyle(pre)
  const lineHeight = Number.parseFloat(cs.lineHeight)
  const width =
    pre.clientWidth -
    Number.parseFloat(preCs.paddingLeft || '0') -
    Number.parseFloat(preCs.paddingRight || '0')
  if (!Number.isFinite(lineHeight) || lineHeight <= 0 || width <= 0) return

  // 行数口径与 rehypeCodeBlock.buildLineNumbers 一致：去掉末尾换行
  const lines = (code.textContent || '').replace(/\n$/, '').split('\n')
  const mirror = document.createElement('div')
  mirror.setAttribute('aria-hidden', 'true')
  const s = mirror.style
  s.position = 'fixed'
  s.left = '-99999px'
  s.top = '0'
  s.width = `${width}px`
  s.visibility = 'hidden'
  s.pointerEvents = 'none'
  s.boxSizing = 'content-box'
  s.whiteSpace = 'pre-wrap'
  s.overflowWrap = 'anywhere'
  s.wordBreak = 'break-word'
  s.fontFamily = cs.fontFamily
  s.fontSize = cs.fontSize
  s.fontWeight = cs.fontWeight
  s.lineHeight = cs.lineHeight
  s.letterSpacing = cs.letterSpacing
  s.setProperty('tab-size', cs.getPropertyValue('tab-size') || '4')

  const frag = document.createDocumentFragment()
  for (const line of lines) {
    const row = document.createElement('div')
    row.textContent = line
    row.style.minHeight = `${lineHeight}px`
    frag.appendChild(row)
  }
  mirror.appendChild(frag)
  document.body.appendChild(mirror)
  const heights = Array.from(mirror.children, (row) => row.getBoundingClientRect().height)
  mirror.remove()

  spans.forEach((span, i) => {
    const h = heights[i]
    if (h === undefined) return
    span.style.height = `${h}px`
    // 折行后一行占多个视觉行；留 0.5 行余量避开亚像素误差
    span.classList.toggle('is-folded', h > lineHeight * 1.5)
  })
}

function clearWrappedGutter(block: HTMLElement) {
  block.querySelectorAll<HTMLElement>('.code-gutter span').forEach((span) => {
    span.style.height = ''
    span.classList.remove('is-folded')
  })
}

// 容器宽度变化会改变折行位置，折行开启期间需要重新测量
function bindCodeWrapResize() {
  const w = window as unknown as { __blogCodeWrapResizeBound?: boolean }
  if (w.__blogCodeWrapResizeBound) return
  w.__blogCodeWrapResizeBound = true
  let raf = 0
  window.addEventListener('resize', () => {
    if (raf) cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      raf = 0
      document.querySelectorAll<HTMLElement>('.code-block.is-wrapped').forEach(syncWrappedGutter)
    })
  })
}

export function bindCopyCode() {
  const w = window as unknown as CopyWindow
  w.__blogCopyCode = (btn: HTMLElement) => {
    const block = btn.closest('.code-block, .diff-view')
    const code = block?.querySelector('code, .diff-view-lines')
    if (!code) return
    const text = code.textContent || ''
    const done = () => {
      btn.innerHTML = w.__blogCopyDoneHtml ?? ''
      btn.classList.add('is-success')
      setTimeout(() => {
        btn.innerHTML = w.__blogCopyIdleHtml ?? ''
        btn.classList.remove('is-success')
      }, 2000)
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(done)
        .catch(() => {
          copyTextFallback(text)
          done()
        })
    } else {
      copyTextFallback(text)
      done()
    }
  }
  bindCodeWrapResize()
  w.__blogToggleCodeWrap = (btn: HTMLElement) => {
    const block = btn.closest<HTMLElement>('.code-block')
    if (!block) return
    const on = block.classList.toggle('is-wrapped')
    applyCodeWrapState(btn, on)
    if (on) syncWrappedGutter(block)
    else clearWrappedGutter(block)
  }
}

// 代码块换行按钮的 aria-label 与初始提示文案由 PostPage 注入 i18n 后回填
export function bindCodeWrapLabels() {
  const w = window as unknown as CopyWindow
  const labels = w.__blogCodeWrapLabels
  if (!labels) return
  document.querySelectorAll<HTMLElement>('.code-wrap').forEach((btn) => {
    btn.setAttribute('aria-label', labels.aria)
    const on = !!btn.closest('.code-block')?.classList.contains('is-wrapped')
    applyCodeWrapState(btn, on)
  })
  document.querySelectorAll<HTMLElement>('.code-block.is-wrapped').forEach(syncWrappedGutter)
}

export function bindPostBodyAnchors(postBody: HTMLElement) {
  postBody.addEventListener('click', (ev) => {
    const target = ev.target as HTMLElement | null
    const link = target?.closest('a') as HTMLAnchorElement | null
    if (!link) return
    const href = link.getAttribute('href') || ''
    if (!href.startsWith('#')) return
    const raw = href.slice(1)
    if (!raw) return
    const el = findAnchorTarget(raw)
    if (!el) return
    ev.preventDefault()
    smoothScrollToHeading(el.id)
    history.replaceState(history.state, '', `#${el.id}`)
  })
}
