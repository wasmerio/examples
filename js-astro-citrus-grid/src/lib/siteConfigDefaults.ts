// 完整站点配置类型与缺失字段兜底。
// 主题代码不要直接 import 用户可改的 src/site.config.ts，而应经由 @/lib/mergedSiteConfig 读取——
// 旧版本用户的配置文件可能缺少后来新增的字段，直接读取会同时炸掉 astro check（类型）与构建（运行时）。
//
// 注意：本文件不 import src/site.config（类型一律在此本地定义，结构与用户文件中的同名接口保持一致），
// 避免与 astro.config 的配置加载上下文形成模块环。

export interface SocialLink {
  platform: string
  url: string
}

export interface FriendLinkRaw {
  url: string
  name?: string
  desc?: string
  icon?: string
}

export interface MusicTrack {
  // 歌曲标题 Song title
  title: string
  // 音频地址：public/ 下的静态路径，或完整 http(s) URL
  // Audio source: static path under public/, or a full http(s) URL
  src: string
  // 封面地址
  // Cover art URL
  cover?: string
}

export interface SiteConfig {
  url: string
  title: string
  subtitle: string
  description: string
  avatar: string
  logo: string
  author: string
  defaultLang: 'zh' | 'ja' | 'en'
  defaultTheme: 'auto' | 'light' | 'dark'
  postsPerPage: number
  nav: string[]
  socials: SocialLink[]
  statsScript: string
  friends: FriendLinkRaw[]
  commentScript: string
  autoUpdatePostUpdated: boolean
  musicPlayer: { enabled: boolean; playlist: MusicTrack[] }
  pet: { enabled: boolean }
  relatedPosts: { enabled: boolean }
  backlinks: { enabled: boolean }
}

const SUPPORTED_DEFAULT_LANGS = ['zh', 'ja', 'en']

// 缺失字段的兜底原则：「保持升级前行为」，而不是替用户启用上游新特性。
// 上游推荐值写在告警文案里，由用户决定是否补进自己的 site.config.ts。
// 只覆盖「后来新增、旧配置会缺」的字段；url/title 等初始字段不设兜底。
const CANONICAL_NAV = ['/archive', '/categories', '/tags', '/series', '/friends', '/about']

function warnFilled(field: string, filled: string, upstream: string): void {
  // 中文：缺字段/非法值已保守兜底，告警里同时给出上游默认值供用户自行补配。
  console.warn(
    `[site.config] \`${field}\` is missing or invalid; filled with ${filled}. Upstream default: ${upstream}. Set it in src/site.config.ts to customize.`,
  )
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

// 就地补齐缺失字段（含节点内缺失的子字段），并对非法取值归一。
// asserts 让调用方拿到收窄后的完整类型，用户旧配置缺字段时 astro check 不再报错。
export function applyMissingDefaults(config: Partial<SiteConfig>): asserts config is SiteConfig {
  if (!SUPPORTED_DEFAULT_LANGS.includes(config.defaultLang as string)) {
    // 中文：defaultLang 缺失或非法时兜底为 zh（此前会直接 throw，导致旧配置无法升级）。
    const received = JSON.stringify(config.defaultLang)
    config.defaultLang = 'zh'
    warnFilled('defaultLang', `'zh'`, `"zh" / "ja" / "en" (received ${received})`)
  }

  if (config.defaultTheme === undefined) {
    config.defaultTheme = 'auto'
    warnFilled('defaultTheme', `'auto'`, `'auto' / 'light' / 'dark'`)
  }

  if (config.postsPerPage === undefined) {
    config.postsPerPage = 10
    warnFilled('postsPerPage', '10', 'a positive integer, e.g. 10')
  }

  if (!isStringArray(config.nav)) {
    // 中文：nav 缺失或非法时兜底为空数组（顶栏仅「首页」一项）。
    config.nav = []
    warnFilled('nav', '[] (header shows the home item only)', JSON.stringify(CANONICAL_NAV))
  }

  if (config.musicPlayer === undefined) {
    config.musicPlayer = { enabled: false, playlist: [] }
    warnFilled('musicPlayer', '{ enabled: false, playlist: [] }', 'the music player node')
  } else {
    if (config.musicPlayer.enabled === undefined) {
      config.musicPlayer.enabled = false
      warnFilled('musicPlayer.enabled', 'false', 'a boolean')
    }
    if (config.musicPlayer.playlist === undefined) {
      config.musicPlayer.playlist = []
      warnFilled('musicPlayer.playlist', '[]', 'an array (or [] to auto-scan public/music/)')
    }
  }

  for (const [node, fallback] of [
    ['pet', false],
    ['relatedPosts', true],
    ['backlinks', true],
  ] as const) {
    if (config[node] === undefined) {
      // 中文：节点整体缺失时兜底；pet 关闭、relatedPosts / backlinks 开启，均与旧配置缺字段时的实际行为一致。
      config[node] = { enabled: fallback }
      warnFilled(node, `{ enabled: ${fallback} }`, `the \`${node}\` node`)
    } else if (config[node].enabled === undefined) {
      config[node].enabled = fallback
      warnFilled(`${node}.enabled`, String(fallback), 'a boolean')
    }
  }
}
