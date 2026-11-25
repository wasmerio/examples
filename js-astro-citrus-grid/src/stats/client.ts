/**
  统计客户端运行时（由 BaseLayout 在 site.config.ts statsScript 启用时注入）。

  工作方式：每次页面加载（首次整页 + Swup 导航，经 onPageLoad）先调用插件的trackVisit（若导出）记录一次访问，再收集当前页的统计挂载点（[data-stats]），按需向统计插件请求数据并填充数字。因此数字随每次访问实时更新，不再烙印在构建产物里。

  节约请求的三层设计：
  1. 缓存：sessionStorage + TTL（生产 5 分钟；dev 1 分钟），成功与失败都会缓存，失败为负缓存：TTL 内刷新/换页既不重试也不重画，避免失败请求风暴。
  2. 复用：文章接口响应附带全站数据时直接复用，省掉 /total 请求。
  3. 限速：串行队列 + 最小请求间隔，避免瞬时并发打爆统计服务。

  挂载点与插件契约详见同目录《使用规则.md》。
  statsScript 启用时挂载点随页面渲染（占位「-」），获取成功填充数字，失败保留「-」。
 */
import { onPageLoad } from '@/lib/pageLifecycle'

// 统计插件必须导出的接口（均为可选，按需导出）
interface StatsPlugin {
  // 埋点上报（可选）：客户端在每次页面加载时调用一次，向统计服务记录一次访问
  trackVisit?: (path?: string) => void
  getSiteTotal?: () => Promise<{ siteTotal: number; siteUnique: number }>
  getArticleStats?: (path: string) => Promise<{
    articleTotal: number
    articleUnique: number
    // 可选：附带的全站数据（有则免去 /total 请求）
    siteTotal?: number
    siteUnique?: number
  }>
}

// 统计脚本名（BaseLayout 写在 <html data-stats-script> 上）
const SCRIPT_NAME = document.documentElement.dataset.statsScript || ''

// 缓存 TTL（毫秒）：生产 5 分钟；dev 1 分钟短缓存，兼顾调试新鲜度与请求频率
const CACHE_TTL = import.meta.env.DEV ? 60_000 : 5 * 60_000
// 速率限制：相邻两次请求的最小间隔（毫秒）
const REQUEST_GAP = 150

// ---------- 插件加载（相对路径 glob，名字对不上即取不到，天然免疫路径穿越） ----------

const pluginModules = import.meta.glob<StatsPlugin>('./*.ts')
let pluginPromise: Promise<StatsPlugin | null> | null = null

function loadPlugin(): Promise<StatsPlugin | null> {
  pluginPromise ??= (async () => {
    if (!SCRIPT_NAME) return null
    const importer = pluginModules[`./${SCRIPT_NAME}.ts`]
    if (!importer) {
      console.warn(`[stats] 未找到统计脚本 src/stats/${SCRIPT_NAME}.ts，统计已停用`)
      return null
    }
    try {
      const plugin = await importer()
      if (
        typeof plugin.trackVisit !== 'function' &&
        typeof plugin.getSiteTotal !== 'function' &&
        typeof plugin.getArticleStats !== 'function'
      ) {
        console.warn(`[stats] 统计脚本 ${SCRIPT_NAME}.ts 未导出任何插件接口，统计已停用`)
        return null
      }
      return plugin
    } catch (err) {
      console.warn(`[stats] 加载统计脚本 ${SCRIPT_NAME}.ts 失败：`, err)
      return null
    }
  })()
  return pluginPromise
}

// ---------- sessionStorage 缓存（TTL 内同一浏览器会话不重复请求，失败也缓存） ----------

interface CachedData {
  pv: number
  uv: number
  t: number
}

// 负缓存：请求失败的记录，TTL 内不重试
interface CachedError {
  err: true
  t: number
}

type CacheEntry = CachedData | CachedError

function readCache(key: string): CacheEntry | null {
  if (CACHE_TTL <= 0) return null
  try {
    const raw = sessionStorage.getItem(`stats:${key}`)
    if (!raw) return null
    const hit = JSON.parse(raw) as CacheEntry
    if (typeof hit.t !== 'number' || Date.now() - hit.t > CACHE_TTL) return null
    return hit
  } catch {
    return null
  }
}

function writeCache(key: string, data: CacheEntry) {
  try {
    sessionStorage.setItem(`stats:${key}`, JSON.stringify(data))
  } catch {
    // 隐私模式等场景写入失败可忽略
  }
}

// ---------- 串行队列（速率限制） ----------

let chain: Promise<unknown> = Promise.resolve()
let lastStart = 0

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = chain.then(async () => {
    const wait = lastStart + REQUEST_GAP - Date.now()
    if (wait > 0) await new Promise((r) => setTimeout(r, wait))
    lastStart = Date.now()
    return task()
  })
  chain = run.catch(() => undefined)
  return run
}

// ---------- 挂载点收集与填充 ----------

interface MountGroup {
  pv: HTMLElement[]
  uv: HTMLElement[]
}

// 收集当前页挂载点：site = 全站统计；articles = 按路径分组的文章统计
function collect() {
  const site: MountGroup = { pv: [], uv: [] }
  const articles = new Map<string, MountGroup>()
  document.querySelectorAll<HTMLElement>('[data-stats]').forEach((el) => {
    const path = el.closest<HTMLElement>('[data-stats-path]')?.dataset.statsPath
    switch (el.dataset.stats) {
      case 'site-pv':
        site.pv.push(el)
        break
      case 'site-uv':
        site.uv.push(el)
        break
      case 'article-pv':
      case 'article-uv': {
        if (!path) return
        let group = articles.get(path)
        if (!group) {
          group = { pv: [], uv: [] }
          articles.set(path, group)
        }
        ;(el.dataset.stats === 'article-pv' ? group.pv : group.uv).push(el)
        break
      }
    }
  })
  return { site, articles }
}

// 按文档语言本地化数字
const fmt = (n: number) => n.toLocaleString(document.documentElement.lang || undefined)

// 填充数字（成功时调用；失败时挂载点保留初始「-」占位）
function fill(group: MountGroup, data: { pv: number; uv: number }) {
  const pv = fmt(data.pv)
  const uv = fmt(data.uv)
  group.pv.forEach((el) => {
    el.textContent = pv
  })
  group.uv.forEach((el) => {
    el.textContent = uv
  })
}

// 失败占位：显式写回「-」
function fillPlaceholder(group: MountGroup) {
  group.pv.forEach((el) => {
    el.textContent = '-'
  })
  group.uv.forEach((el) => {
    el.textContent = '-'
  })
}

// ---------- 每次页面加载的刷新流程 ----------

async function refresh() {
  if (!SCRIPT_NAME) return
  const plugin = await loadPlugin()
  if (!plugin) return

  // 0. 埋点上报：每次页面加载（首次整页 + Swup 导航）调用一次，记录一次访问。
  //    fire-and-forget：不缓存、不限速（每次真实访问都应记录）；
  //    实现须内部静默失败，这里也不再捕获，避免影响后续数字展示。
  plugin.trackVisit?.(location.pathname)

  const { site, articles } = collect()
  const needSite = site.pv.length > 0 || site.uv.length > 0
  if (!needSite && articles.size === 0) return

  // 1. 全站统计：缓存命中（成功/失败）直接按缓存显示，不再请求
  let siteData: CachedData | null = null
  let siteCached = false
  if (needSite) {
    const cached = readCache('site')
    if (cached) {
      siteCached = true
      if ('err' in cached) fillPlaceholder(site)
      else {
        siteData = cached
        fill(site, cached)
      }
    }
  }

  // 2. 文章统计：缓存优先（成功填数字 / 失败填「-」），未命中进串行队列
  const getArticle = plugin.getArticleStats
  if (typeof getArticle === 'function') {
    for (const [path, group] of articles) {
      const cached = readCache(`art:${path}`)
      if (cached) {
        if ('err' in cached) fillPlaceholder(group)
        else fill(group, cached)
        continue
      }
      enqueue(async () => {
        try {
          const res = await getArticle(path)
          const data: CachedData = { pv: res.articleTotal, uv: res.articleUnique, t: Date.now() }
          fill(group, data)
          writeCache(`art:${path}`, data)
          if (typeof res.siteTotal === 'number' && typeof res.siteUnique === 'number') {
            const s: CachedData = { pv: res.siteTotal, uv: res.siteUnique, t: Date.now() }
            writeCache('site', s)
            if (needSite && !siteData) {
              siteData = s
              fill(site, s)
            }
          }
        } catch (err) {
          console.warn(`[stats] 获取文章统计失败（${path}）：`, err)
          // 失败也写负缓存：TTL 内刷新/换页不重试
          writeCache(`art:${path}`, { err: true, t: Date.now() })
          fillPlaceholder(group)
        }
      })
    }
  }

  // 3. 全站统计兜底：无任何缓存时才请求 /total（队列尾执行，若文章响应已顺带填充则跳过）
  const getSite = plugin.getSiteTotal
  if (needSite && !siteCached && !siteData && typeof getSite === 'function') {
    enqueue(async () => {
      if (siteData) return
      try {
        const res = await getSite()
        const s: CachedData = { pv: res.siteTotal, uv: res.siteUnique, t: Date.now() }
        fill(site, s)
        writeCache('site', s)
      } catch (err) {
        console.warn('[stats] 获取全站统计失败：', err)
        writeCache('site', { err: true, t: Date.now() })
        fillPlaceholder(site)
      }
    })
  }
}

onPageLoad(() => {
  // 空闲期再刷新，避免与首屏渲染争主线程；统计缓存 TTL 与「切页先查缓存、过期才请求」的链路不变
  const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200))
  idle(() => refresh().catch(() => {}), { timeout: 2000 })
})
