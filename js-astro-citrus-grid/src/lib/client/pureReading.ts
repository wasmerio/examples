import { onPageLoad } from '@/lib/pageLifecycle'

// 纯净阅读模式：隐藏头部 / 底部 / 侧栏目录 / 评论 / 宠物 / 音乐播放器等，
// 只保留文章本体；右下角菜单触发器变身为书本退出按钮。可见性规则见 styles/pure-reading.css。
//
// 入口仅存在于文章阅读页（.post-content）：ScrollControls 按 seoType 服务端渲染，
// swup 换页后组件不重渲染，这里按当前页面内容再同步显隐。
//
// 状态仅存于 <html> 的 pure-reading 类，不写任何存储：
// 只对当前文章页生效，swup 换页（含前进 / 后退）前主动摘掉，新页面以正常状态渲染。
function isPure() {
  return document.documentElement.classList.contains('pure-reading')
}

// 同步按钮状态：弹出组菜单项显隐、aria-pressed / 提示文案、触发器图标配套文案
function syncButton() {
  const pure = isPure()
  const btn = document.querySelector<HTMLButtonElement>('[data-reading-toggle]')
  if (btn) {
    btn.setAttribute('aria-pressed', pure ? 'true' : 'false')
    const title = pure ? btn.dataset.titleExit : btn.dataset.titleEnter
    if (title) btn.title = title
    btn.hidden = !document.querySelector('.post-content')
  }
  const trigger = document.querySelector<HTMLButtonElement>('[data-scroll-menu]')
  if (trigger) {
    const title = pure ? trigger.dataset.titleExit : trigger.dataset.titleMenu
    if (title) trigger.title = title
  }
}

function setPure(pure: boolean) {
  document.documentElement.classList.toggle('pure-reading', pure)
  // 播放器 UI 被隐藏后无法再操作，进入时顺手暂停音乐
  if (pure) document.querySelector<HTMLAudioElement>('.music-player audio')?.pause()
  syncButton()
}

export function bindPureReading() {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (target.closest('[data-reading-toggle]')) setPure(!isPure())
    // 纯净模式下触发器即退出按钮（菜单展开由 pageBindings 守卫跳过）
    if (isPure() && target.closest('[data-scroll-menu]')) setPure(false)
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isPure()) setPure(false)
  })
  // 纯净阅读只针对当前文章页：任何换页（swup 换页 / 前进 / 后退）立即恢复常态
  document.addEventListener('astro:before-swap', () => setPure(false))
  // 换页后按新页面内容同步入口显隐（与 bindTocFab 同款模式）
  document.addEventListener('astro:after-swap', syncButton)
  onPageLoad(syncButton)
}
