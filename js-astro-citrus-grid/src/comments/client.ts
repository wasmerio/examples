/**
  评论客户端运行时（由 Comments.astro 在 site.config.ts commentScript 启用时注入）。

  工作方式：每次页面加载（首次整页 + Swup 导航，经 onPageLoad）查找评论区挂载点
  （[data-comment-script]），用 IntersectionObserver 监听评论区临近视口时才动态
  加载指名的适配器并挂载评论。评论在首屏之下时，首屏加载完全不请求任何评论资源。

  性能四件套：
  1. 懒加载：IntersectionObserver 提前 rootMargin 预载，不支持 IO 的环境降级为立即加载；
  2. 代码拆分：import.meta.glob 让每个适配器成为独立 chunk，只拉取被指名的那一个，
     模块会话级缓存，Swup 换页不重复拉取；
  3. 预留占位：挂载区由服务端渲染（最小高度 + shimmer 骨架），适配器渲染出首个
     非 script 子节点后撤掉骨架，全程无布局跳动；
  4. 异步加载：适配器加载与第三方脚本注入均为异步，任何失败都只 console.warn
     并隐藏评论区（is-error），不影响页面其余部分。

  挂载点与适配器契约详见同目录《使用规则.md》。
 */
import { onPageLoad } from '@/lib/pageLifecycle'

// 评论适配器必须导出的接口（mountComment 必选，其余可选，按需导出）
export interface CommentAdapter {
  // 把评论挂载进容器；抛错 = 挂载失败（运行时隐藏整个评论区）
  mountComment: (container: HTMLElement) => void | Promise<void>
  // 主题切换回调（dark = 是否深色），由运行时监听全局 theme-change 事件转发
  onThemeChange?: (dark: boolean) => void
  // Swup 换页、评论区即将随旧 DOM 销毁前的清理钩子（定时器/监听器等，一般无需）
  unmountComment?: () => void
}

// 提前预载距离：评论区距视口多近时开始加载适配器
const LOAD_MARGIN = '300px 0px'
// 骨架兜底超时（毫秒）：适配器已挂载但迟迟渲染不出内容时，超时撤掉骨架防卡死
const SKELETON_TIMEOUT = 8000

// ---------- 适配器加载（相对路径 glob，名字对不上即取不到，天然免疫路径穿越） ----------

const adapterModules = import.meta.glob<CommentAdapter>(['./*.ts', '!./client.ts'])
// 会话级缓存：同一适配器只加载一次，Swup 换页直接复用
const adapterCache = new Map<string, Promise<CommentAdapter | null>>()

function loadAdapter(name: string): Promise<CommentAdapter | null> {
  let cached = adapterCache.get(name)
  if (!cached) {
    cached = (async () => {
      const importer = adapterModules[`./${name}.ts`]
      if (!importer) {
        console.warn(`[comments] 未找到评论适配器 src/comments/${name}.ts，评论区已停用`)
        return null
      }
      try {
        const adapter = await importer()
        if (typeof adapter.mountComment !== 'function') {
          console.warn(`[comments] 评论适配器 ${name}.ts 未导出 mountComment，评论区已停用`)
          return null
        }
        return adapter
      } catch (err) {
        console.warn(`[comments] 加载评论适配器 ${name}.ts 失败：`, err)
        return null
      }
    })()
    adapterCache.set(name, cached)
  }
  return cached
}

// ---------- 占位状态机：适配器渲染出内容（非 script 子节点）后撤掉骨架 ----------

function watchContent(container: HTMLElement, onContent: () => void) {
  const done = () => {
    observer.disconnect()
    clearTimeout(timer)
    onContent()
  }
  const observer = new MutationObserver(() => {
    // script 标签只是引导代码（如 utterances 注入的 client.js），不算渲染完成
    if (Array.from(container.children).some((el) => el.tagName !== 'SCRIPT')) done()
  })
  const timer = setTimeout(done, SKELETON_TIMEOUT)
  observer.observe(container, { childList: true })
  return () => {
    observer.disconnect()
    clearTimeout(timer)
  }
}

// ---------- 每次页面加载：临近视口才加载适配器并挂载 ----------

let currentAdapter: CommentAdapter | null = null

async function mount(section: HTMLElement) {
  const name = (section.dataset.commentScript || '').trim()
  const container = section.querySelector<HTMLElement>('.comment-mount')
  if (!name || !container) return

  const stopWatching = watchContent(container, () => section.classList.add('is-loaded'))

  const adapter = await loadAdapter(name)
  // 等待期间发生 swup 换页：当前节点已脱离文档，放弃挂载，
  // 否则会把评论挂进已销毁的旧 DOM，并污染下一页的 currentAdapter 状态
  if (!section.isConnected) {
    stopWatching()
    return
  }
  if (!adapter) {
    stopWatching()
    section.classList.add('is-error')
    return
  }
  currentAdapter = adapter

  try {
    await adapter.mountComment(container)
    // 挂载期间发生换页：对已脱离文档的容器做一次清理，
    // 避免 utterances 的脚本、twikoo 的渲染残留在死节点里
    if (!section.isConnected) {
      adapter.unmountComment?.()
      currentAdapter = null
    }
  } catch (err) {
    stopWatching()
    currentAdapter = null
    console.warn(`[comments] 挂载评论适配器 ${name}.ts 失败：`, err)
    section.classList.add('is-error')
  }
}

function init() {
  const section = document.querySelector<HTMLElement>('[data-comment-script]')
  if (!section || section.dataset.commentInit) return
  section.dataset.commentInit = '1'

  if (typeof IntersectionObserver === 'function') {
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        io.disconnect()
        mount(section).catch(() => {})
      },
      { rootMargin: LOAD_MARGIN },
    )
    io.observe(section)
  } else {
    mount(section).catch(() => {})
  }
}

// ---------- 全局事件：主题转发 + 换页清理 ----------

document.addEventListener('theme-change', (e) => {
  currentAdapter?.onThemeChange?.((e as CustomEvent<string>).detail === 'dark')
})

document.addEventListener('astro:before-swap', () => {
  currentAdapter?.unmountComment?.()
  currentAdapter = null
})

onPageLoad(() => {
  init()
})
