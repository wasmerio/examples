import { validateSiteConfig } from '@/lib/siteConfigGuard'

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

export const siteConfig = {
  // 站点地址，用于 sitemap 、 RSS 等地方
  // Site URL used for sitemap, RSS, etc.
  // 例 e.g. https://example.com
  url: 'https://citrusgrid.pages.dev',

  // 站点信息 Site info
  title: 'CitrusGrid',
  subtitle: 'A pure static Astro blog theme',
  description: '这是一个基于 Astro 架构和 CitrusGrid主题的轻量级静态博客。',

  // 首页卡片的头像和网站图标 Logo ， public/ 下的静态路径，以 / 开头
  // Avatar and site logo for the home profile card. Static paths under public/, starting with /
  // 例 e.g. /avatar.webp 、 /logo.webp
  avatar: '/avatar.webp',
  logo: '/logo.webp',

  // 作者 Author name
  author: 'example name',

  // 默认语言： zh 、 ja 、 en
  // Default language: zh, ja, en
  defaultLang: 'zh' as 'zh' | 'ja' | 'en',

  // 默认主题： auto 、 light 、 dark
  // Default theme: auto, light, dark
  defaultTheme: 'auto' as 'auto' | 'light' | 'dark',

  // 首页每页文章数 Posts per page on the home page
  postsPerPage: 10,

  // 顶栏导航项，按数组顺序显示；首页 '/' 固定在第一项、不可移除，无需在此配置
  // Header nav items, shown in array order. Home '/' is pinned first and must not be listed here
  // 可选 Available: '/archive' 、 '/categories' 、 '/tags' 、 '/series' 、 '/friends' 、 '/about'
  nav: ['/archive', '/categories', '/tags', '/series', '/friends', '/about'],

  // 个人名片社交按钮，改为空数组 [] 则不显示社交按钮
  // Social buttons on the profile card. Set to an empty array [] to hide them
  // 支持 Supported: github 、 twitter 、 linkedin 、 youtube 、 instagram 、 facebook 、 devto 、 medium 、 rss 、 email 、 website
  // 没有独立设置图标的使用通用链接图标
  // Platforms without a dedicated icon fall back to a generic link icon
  socials: [
    { platform: 'github', url: 'https://github.com' },
    { platform: 'rss', url: '/rss.xml' },
  ] as SocialLink[],

  // 统计脚本，脚本位于 src/stats/ 目录，契约详见 src/stats/使用规则.md ，留空不启用
  // Statistics script. Scripts live in src/stats/, see src/stats/usageRules.md for the plugin contract. Leave empty to disable
  statsScript: 'random-visitor',

  // 友链，改为空数组 [] 显示空状态页。icon 放在 public/friends/ 下，引用以 /friends/文件名.后缀
  // Friend links. Set to an empty array [] to show an empty state. Icons go under public/friends/ and are referenced as /friends/filename.ext
  friends: [
    {
      url: 'https://example.com',
      name: 'test',
      desc: 'a desc',
      icon: '/friends/logo.webp',
    },
  ] as FriendLinkRaw[],

  // 评论脚本，脚本位于 src/comments/ 目录，契约详见 src/comments/使用规则.md ，留空不启用评论区
  // Comment script. Scripts live in src/comments/, see src/comments/usageRules.md for the adapter contract. Leave empty to disable the comment section
  commentScript: '',

  // 根据文件保存时间自动更新文章的 updated 字段，仅在启动和构建时更新
  // Auto-update each post's `updated` field from its file save time only updated during startup and build
  autoUpdatePostUpdated: false,

  // 右下角磁铁音乐播放器
  // Magnet-style music player floating at the bottom-right corner
  // enabled: 是否启用（默认开启）。playlist 为播放列表，仅读取封面/名称/时长，不含歌词
  // playlist 留空 [] 时，构建期自动扫描 public/music/ 下的音频文件生成播放列表（推荐），
  // 封面自动从音频元数据中提取；如需自定义标题/封面/顺序，可显式填写 playlist
  //
  // 显式指定示例（title/src 必填，cover 可选；不填 cover 时同样会从音频元数据提取封面）：
  //   playlist: [
  //     { title: 'name', src: '/music/name.flac', cover: '/music/name.webp' },
  //     { title: 'test', src: '/music/test.flac' },
  //   ] as MusicTrack[],
  musicPlayer: {
    enabled: false,
    playlist: [] as MusicTrack[],
  },

  // 左下角宠物
  // Bottom-left pet widget
  pet: {
    enabled: true,
  },

  // 文章页页脚的「相关文章」区块，enabled 为 false 时不渲染（也跳过打分）
  // Related posts block in the post footer. Set enabled to false to hide it and skip scoring
  relatedPosts: {
    enabled: true,
  },

  // 文章页页脚的「N 篇文章引用本文」区块，enabled 为 false 时不渲染
  // Backlinks block in the post footer. Set enabled to false to hide it
  backlinks: {
    enabled: true,
  },
}

// 配置兜底校验：实现见 lib/siteConfigGuard.ts，此处只调用（校验只做告警 / 报错）
validateSiteConfig(siteConfig)
