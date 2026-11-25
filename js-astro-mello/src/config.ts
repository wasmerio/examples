// 基础配置
export const BASE_CONFIG = {
  title: 'Mello',
  subtitle: 'Mello',
  description: '简约、高效、优雅。',
  author: 'Mello',
  favicon: '/favicon.svg',
  avatar: '/avatar.webp',
  site_url: 'https://example.com',
  create_time: '2024-01-23',
}

// 配色方案
export type PaletteName = 'paper' | 'mono' | 'normal'

export const THEME_CONFIG = {
  palette: 'paper',
} as const satisfies { palette: PaletteName }

// 文章页配置
export const POST_CONFIG = {
  toc: true,
}

// 导航栏配置
export const HEADER_CONFIG = {
  nav: [
    { label: '归档', href: '/archive' },
    { label: '分类', href: '/category' },
    { label: '朋友', href: '/link' },
    { label: '关于', href: '/about' },
  ],
}

// 页脚配置
export const FOOTER_CONFIG = {
  link: [
    { name: 'Astro', url: 'https://astro.build/'},
  ]
}

// 评论配置
export const COMMENT_CONFIG = {
  enable: false,
  provider: 'waline',
  waline: {
    serverURL: 'https://example.cn/',
  },
}
