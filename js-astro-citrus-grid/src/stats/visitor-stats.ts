// ============================================================
// 统计插件：visitor-stats（Cloudflare Worker 统计服务示例实现）
// 接口契约详见同目录《使用规则.md》
// 启用方式：site.config.ts 中 statsScript: 'visitor-stats'
//
// 查询统一走 /total：一次请求返回全站累计 + 全部文章累计列表，
// 插件内部做「模块级 in-flight 去重 + localStorage TTL 缓存」，
// 数据写入 localStorage（跨标签页/新窗口共享）：页面切换、预取、新开标签
// 都直接读缓存，0 请求；过期或不存在才发 1 次请求并回写缓存，
// 彻底避免频繁换页/预取导致的限流（429）。
// 服务端另有 Cache-Control: public, max-age=60 边缘缓存，双层减压。
// ====================================================

interface ArticleEntry {
  path: string
  articleTotal: number
  articleUnique: number
  articleLastUpdated: number
}

interface TotalResponse {
  siteTotal: number
  siteUnique: number
  siteLastUpdated: number
  articles: ArticleEntry[]
}

const STATS_BASE = ''

// 统计服务 API 密钥，不用担心泄露， worker 增加域名识别，仅在当前域名下有效
const STATS_API_KEY = ''

interface RealtimeStatsResponse {
  total: number
  unique: number
  period: 'today'
  path?: string
}

// /total 客户端缓存 TTL（插件仅生产环境注入）
const TOTAL_CACHE_TTL = 5 * 60_000
const TOTAL_CACHE_KEY = 'visitor-stats:total'

// /total 获取（in-flight 去重 + localStorage TTL 缓存）

let totalPromise: Promise<TotalResponse> | null = null

function fetchTotal(): Promise<TotalResponse> {
  totalPromise ??= (async () => {
    // 1. TTL 内直接用 localStorage 缓存（跨标签页共享，换页/新开标签均 0 请求）
    try {
      const raw = localStorage.getItem(TOTAL_CACHE_KEY)
      if (raw) {
        const hit = JSON.parse(raw) as { t: number; data: TotalResponse }
        if (
          typeof hit.t === 'number' &&
          typeof hit.data?.siteTotal === 'number' &&
          Date.now() - hit.t <= TOTAL_CACHE_TTL
        ) {
          return hit.data
        }
      }
    } catch {
      /* 缓存读取失败（隐私模式等）忽略，直接请求 */
    }

    // 2. 请求 /total（服务端 60s 边缘缓存）
    const res = await fetch(`${STATS_BASE}/total`)
    const data = (await res.json()) as TotalResponse
    if (!res.ok) {
      throw new Error(
        `请求失败 (${res.status}): ${(data as unknown as { error?: string }).error ?? 'unknown'}`,
      )
    }

    // 3. 回写缓存
    try {
      localStorage.setItem(TOTAL_CACHE_KEY, JSON.stringify({ t: Date.now(), data }))
    } catch {
      /* 写入失败（容量满等）可忽略 */
    }
    return data
  })()
  // 失败时清空 in-flight，允许后续重试（client.ts 的负缓存另有一层保护）
  totalPromise.catch(() => {
    totalPromise = null
  })
  return totalPromise
}

// ---------- 插件契约实现 ----------

// 路径归一化：去掉尾斜杠（根路径除外）。页面 URL 与统计服务的 path 键
// 必须一致——托管平台（如 Cloudflare Pages）会把 /posts/x 重定向到 /posts/x/，
// location.pathname 带斜杠而 data-stats-path 不带，不归一化会导致统计失配。
function normalizePath(p: string): string {
  return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p
}

export function trackVisit(path: string = location.pathname): void {
  fetch(`${STATS_BASE}/log?path=${encodeURIComponent(normalizePath(path))}`, {
    keepalive: true,
    referrerPolicy: 'no-referrer-when-downgrade',
  }).catch(() => {
    /* 埋点失败静默，不影响页面 */
  })
}

export async function getSiteTotal(): Promise<{
  siteTotal: number
  siteUnique: number
}> {
  const total = await fetchTotal()
  return { siteTotal: total.siteTotal, siteUnique: total.siteUnique }
}

export async function getArticleStats(path: string): Promise<{
  articleTotal: number
  articleUnique: number
  siteTotal: number
  siteUnique: number
}> {
  const total = await fetchTotal()
  // 未收录的文章（如刚发布还没被 /log 埋点过）统一显示 0，不视为错误
  const article = total.articles?.find((a) => a.path === normalizePath(path))
  return {
    articleTotal: article?.articleTotal ?? 0,
    articleUnique: article?.articleUnique ?? 0,
    siteTotal: total.siteTotal,
    siteUnique: total.siteUnique,
  }
}

export async function getRealtimeStats(
  opts: { path?: string; period?: 'today' | 'all' } = {},
): Promise<RealtimeStatsResponse> {
  if (!STATS_API_KEY) {
    throw new Error('未配置 STATS_API_KEY，/stats 接口需要 Authorization: Bearer <API_KEY> 鉴权')
  }
  const params = new URLSearchParams({ period: opts.period ?? 'today' })
  if (opts.path) params.set('path', opts.path)
  const res = await fetch(`${STATS_BASE}/stats?${params}`, {
    headers: { Authorization: `Bearer ${STATS_API_KEY}` },
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`请求失败 (${res.status}): ${(data as { error?: string }).error ?? 'unknown'}`)
  }
  return data as RealtimeStatsResponse
}
