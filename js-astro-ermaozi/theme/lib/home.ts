export type HomeItem = Record<string, any> & { type: string }

const DEFAULT_HERO = {
  name: 'Theme Plume',
  tagline: 'VuePress Next Theme',
  text: '一个简约的，功能丰富的 vuepress 文档&博客 主题',
}

export function homeConfigOf(frontmatter: Record<string, any>): HomeItem[] {
  if (frontmatter.config?.length) return frontmatter.config
  if (frontmatter.banner) return [{ type: 'banner', banner: frontmatter.banner, bannerMask: frontmatter.bannerMask, hero: frontmatter.hero ?? DEFAULT_HERO }]
  return [{ type: 'hero', full: true, background: 'tint-plate', hero: frontmatter.hero ?? DEFAULT_HERO }]
}
