import { defineThemeConfig } from './lib/collections.ts'

export {
  defineCollection,
  defineCollections,
  defineNoteConfig,
  defineNotesConfig,
  defineNavbarConfig,
  defineThemeConfig,
} from './lib/collections.ts'
export { defineSiteConfig } from './config.mjs'
export type {
  BaseCollection,
  Collection,
  DocCollection,
  PostCoverLayout,
  PostCoverOptions,
  PostCollection,
  PostsCategoryItem,
  SidebarItem,
} from './lib/collections.ts'
export type { AppearanceTransition, AutoFrontmatterContext, AutoFrontmatterData, AutoFrontmatterOptions, BulletinOptions, ChangelogOptions, CodeHighlighterOptions, Contributor, ContributorsOptions, LastUpdatedOptions, LegacyBlogOptions, LegacyNotesOptions, LocaleConfig, LocaleTextOptions, MarkdownImageOptions, MarkdownIncludeOptions, MarkdownMathOptions, MarkdownOptions, NavigationItem, ProfileOptions, SiteConfig, SocialLink, ThemeIcon, TransitionOptions } from './config-types.ts'

export const plumeTheme = (config: Parameters<typeof defineThemeConfig>[0] = { locales: {} }) => defineThemeConfig(config)
export default plumeTheme
