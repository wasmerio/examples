import { type FocusTrap, trapFocus } from '@/lib/focusTrap'
import { findAnchorTarget, HEADING_SCROLL_OFFSET, smoothScrollToHeading } from '@/lib/postActions'

const TOC_SNAP_RANGE = 80

let postBody: HTMLElement | null = null
// 标题集合在一次页面生命周期内不变：initToc 时缓存，
// 滚动回调（rAF 节流）只做测量，不再每帧 querySelectorAll
let headingEls: HTMLElement[] = []
let activeHeading = ''
let tocModal: HTMLElement | null = null
let tocCloseTimer: number | undefined
let tocCollapsed = false
let tocTrap: FocusTrap | null = null

function tocScrollDelta(list: HTMLElement, active: HTMLElement): number {
  const listRect = list.getBoundingClientRect()
  const activeRect = active.getBoundingClientRect()
  const pad = 12
  if (activeRect.top < listRect.top + pad) return activeRect.top - listRect.top - pad
  if (activeRect.bottom > listRect.bottom - pad) return activeRect.bottom - listRect.bottom + pad
  return 0
}

function updateActiveToc() {
  // isConnected 防护换页窗口期：swup 替换 DOM 后、initToc 刷新缓存前
  // 触发的滚动事件不应使用已脱离文档的旧标题
  if (!headingEls.length || !headingEls[0].isConnected) return
  const threshold = HEADING_SCROLL_OFFSET + 16
  let currentByPassed: string | null = null
  let snapId: string | null = null
  let snapDist = Number.POSITIVE_INFINITY
  for (const el of headingEls) {
    const top = el.getBoundingClientRect().top
    if (top <= threshold) currentByPassed = el.id
    if (top >= threshold && top <= threshold + TOC_SNAP_RANGE) {
      const dist = top - threshold
      if (dist < snapDist) {
        snapDist = dist
        snapId = el.id
      }
    }
  }
  const chosen = snapId || currentByPassed || headingEls[0].id
  if (chosen === activeHeading) return
  const affixList = document.querySelector<HTMLElement>('.toc-affix-list')
  const affixActive = affixList?.querySelector<HTMLElement>(
    `.toc-link[data-toc-target="${chosen}"]`,
  )
  const affixDelta = affixList && affixActive ? tocScrollDelta(affixList, affixActive) : 0
  const modalVisible = tocModal && !tocModal.classList.contains('hidden')
  const modalList = modalVisible
    ? (tocModal?.querySelector<HTMLElement>('.overflow-y-auto') ?? null)
    : null
  const modalActive = modalList?.querySelector<HTMLElement>(
    `.toc-link[data-toc-target="${chosen}"]`,
  )
  const modalDelta = modalList && modalActive ? tocScrollDelta(modalList, modalActive) : 0
  activeHeading = chosen
  document.querySelectorAll<HTMLAnchorElement>('.toc-link').forEach((a) => {
    a.classList.toggle('toc-active', a.dataset.tocTarget === chosen)
  })
  if (affixList && affixDelta) affixList.scrollTop += affixDelta
  if (modalList && modalDelta) modalList.scrollTop += modalDelta
}

function scrollTocListToActive(list: HTMLElement, active: HTMLElement) {
  const delta = tocScrollDelta(list, active)
  if (delta) list.scrollTop += delta
}

function openTocModal() {
  if (!tocModal) return
  window.clearTimeout(tocCloseTimer)
  tocModal.classList.remove('wp-closing')
  tocModal.classList.remove('hidden')
  tocModal.classList.add('flex')
  tocTrap = trapFocus(tocModal)
  requestAnimationFrame(() => {
    if (!tocModal) return
    const modalList = tocModal.querySelector<HTMLElement>('.overflow-y-auto')
    const active = modalList?.querySelector<HTMLElement>('.toc-active')
    if (modalList && active)
      scrollTocListToActive(modalList, active)
      // 焦点移入当前/首个目录项，键盘用户打开后可直接 Tab 浏览
    ;(active ?? modalList?.querySelector<HTMLElement>('.toc-link'))?.focus({
      preventScroll: true,
    })
  })
}

function closeTocModal(animated = true) {
  if (!tocModal || tocModal.classList.contains('hidden')) return
  window.clearTimeout(tocCloseTimer)
  tocTrap?.release()
  tocTrap = null
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const done = () => {
    if (!tocModal) return
    tocModal.classList.add('hidden')
    tocModal.classList.remove('flex', 'wp-closing')
  }
  if (!animated || reduce) return done()
  tocModal.classList.add('wp-closing')
  tocCloseTimer = window.setTimeout(done, 160)
}

function positionTocExpandFab() {
  const fab = document.getElementById('toc-expand')
  if (!fab || fab.hidden) return
  const menuBtn = document.querySelector<HTMLElement>('.scroll-control-nav [data-scroll-menu]')
  if (menuBtn) {
    const rect = menuBtn.getBoundingClientRect()
    fab.style.right = `${window.innerWidth - rect.right}px`
    fab.style.bottom = `${window.innerHeight - rect.top + 8}px`
  } else {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    fab.style.right = `${isMobile ? 12 : 20}px`
    fab.style.bottom = `${(isMobile ? 64 : 32) + 48}px`
  }
}

function setTocCollapsed(collapsed: boolean) {
  tocCollapsed = collapsed
  const affixEl = document.getElementById('toc-affix')
  const panel = affixEl?.querySelector<HTMLElement>('.toc-affix')
  const collapseBtn = document.getElementById('toc-collapse')
  const expandFab = document.getElementById('toc-expand')
  if (!panel || !expandFab) return
  panel.style.opacity = collapsed ? '0' : ''
  panel.style.visibility = collapsed ? 'hidden' : ''
  panel.style.pointerEvents = collapsed ? 'none' : ''
  expandFab.hidden = !collapsed
  collapseBtn?.setAttribute('aria-expanded', collapsed ? 'false' : 'true')
  expandFab.setAttribute('aria-expanded', collapsed ? 'true' : 'false')
  if (collapsed) positionTocExpandFab()
}

let scrollRaf = 0
window.addEventListener(
  'scroll',
  () => {
    cancelAnimationFrame(scrollRaf)
    scrollRaf = requestAnimationFrame(updateActiveToc)
  },
  { passive: true },
)

document.addEventListener('click', (ev) => {
  const link = (ev.target as HTMLElement)?.closest<HTMLAnchorElement>('.toc-link')
  if (!link) return
  const id = link.dataset.tocTarget || link.getAttribute('href')?.slice(1)
  if (!id) return
  const el = findAnchorTarget(id)
  if (!el) return
  ev.preventDefault()
  smoothScrollToHeading(el.id)
  history.replaceState(history.state, '', `#${el.id}`)
  closeTocModal()
})

window.addEventListener('resize', () => {
  if (tocCollapsed) positionTocExpandFab()
})

export function initToc() {
  // 换页后旧弹层元素已被移除，残留的 trap 直接释放
  // （归还焦点对已脱离文档的旧元素是空操作，无副作用）
  tocTrap?.release()
  tocTrap = null
  postBody = document.querySelector<HTMLElement>('.post-content')
  headingEls = postBody
    ? Array.from(postBody.querySelectorAll<HTMLElement>('h1,h2,h3,h4,h5,h6'))
    : []
  activeHeading = ''
  document.querySelectorAll('body > #toc-modal').forEach((el) => {
    el.remove()
  })
  tocModal = document.getElementById('toc-modal')
  if (tocModal) document.body.appendChild(tocModal)

  const tocFab = document.getElementById('toc-fab')
  if (tocFab && !tocFab.dataset.bound) {
    tocFab.dataset.bound = '1'
    tocFab.addEventListener('click', openTocModal)
  }
  document.getElementById('toc-close')?.addEventListener('click', () => closeTocModal())
  tocModal?.addEventListener('click', (e) => {
    if (e.target === tocModal) closeTocModal()
  })

  document.querySelectorAll('#toc-affix').forEach((el) => {
    if (!el.closest('#swup-container')) el.remove()
  })
  const affix = document.getElementById('toc-affix')
  if (affix) {
    document.body.appendChild(affix)
    window.setTimeout(() => affix.classList.remove('opacity-0'), 150)
    document.getElementById('toc-collapse')?.addEventListener('click', () => setTocCollapsed(true))
    document.getElementById('toc-expand')?.addEventListener('click', () => setTocCollapsed(false))
    setTocCollapsed(tocCollapsed)
  }

  if (postBody) setTimeout(updateActiveToc, 150)
}
