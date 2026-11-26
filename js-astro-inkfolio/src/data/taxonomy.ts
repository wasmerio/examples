// Hand-written taxonomy metadata: the cover and blurb shown on /categories and
// /tags. Names are matched exactly as they appear in post frontmatter, so a
// Chinese post can use 配置 while the English one uses Setup.
export interface TermMeta {
  cover?: string;
  description?: string;
}

export const categoryMeta: Record<string, TermMeta> = {
  Setup: { cover: '/og/posts/en/getting-started.png', description: 'Install, wire analytics, publish the first post.' },
  配置: { cover: '/og/posts/en/getting-started.png', description: '安装、接分析、发第一篇。' },
  Writing: { cover: '/og/posts/en/write-a-post.png', description: 'Frontmatter, drafts and publishing.' },
  写作: { cover: '/og/posts/en/write-a-post.png', description: 'Frontmatter、草稿与发布。' },
  Design: { cover: '/og/posts/en/customize-the-look.png', description: 'Colour, type and layout overrides.' },
  设计: { cover: '/og/posts/en/customize-the-look.png', description: '配色、字体与布局覆盖。' },
  Extend: { cover: '/og/posts/en/mcp-page.png', description: 'Extra pages, MCP and integrations.' },
  扩展: { cover: '/og/posts/en/mcp-page.png', description: '加页面、接 MCP 和外部服务。' },
};

export const tagMeta: Record<string, TermMeta> = {
  analytics: { cover: '/og/posts/en/analytics-and-seo.png' },
  configuration: { cover: '/og/posts/en/site-config.png' },
  deploy: { cover: '/og/posts/en/turn-off-the-banner.png' },
};

// Same category under a different name per language: the language toggle should
// treat 配置 and Setup as the same place.
export const categoryAliases: Record<string, string[]> = {
  Setup: ['配置'],
  配置: ['Setup'],
  Writing: ['写作'],
  写作: ['Writing'],
  Design: ['设计'],
  设计: ['Design'],
  Extend: ['扩展'],
  扩展: ['Extend'],
};
