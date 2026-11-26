import type { Collection, PostCollection, PostCoverOptions, SidebarBadge, SidebarItem } from './lib/collections.ts'
import type { RenderRule } from 'markdown-it/lib/renderer.mjs'
import type { BundledTheme } from 'shiki'

export type ThemeIcon = string | { svg: string, name?: string }
export type SocialLink = { icon: ThemeIcon, link: string, ariaLabel?: string }
export type ProfileOptions = {
  avatar?: string
  /** @deprecated Use avatar. */
  url?: string
  name?: string
  description?: string
  circle?: boolean
  location?: string
  organization?: string
  layout?: 'left' | 'right'
}
export type FooterOptions = { message?: string, copyright?: string }
export type AppearanceTransition = boolean | 'fade' | 'circle-clip' | 'horizontal-clip' | 'vertical-clip' | 'skew-clip' | 'blinds-vertical' | 'blinds-horizontal' | 'soft-blur-fade' | 'diamond-reveal'
export type TransitionOptions = { appearance?: AppearanceTransition, page?: boolean, postList?: boolean }
export type Contributor = { name: string, username: string, email: string, commits: number, avatar?: string, url?: string }
export type ContributorsOptions = {
  mode?: 'inline' | 'block'
  info?: Array<{ username: string, name?: string, alias?: string | string[], email?: string, emailAlias?: string | string[], avatar?: string, url?: string }>
  avatar?: boolean
  avatarPattern?: string
  transform?: (contributors: Contributor[]) => Contributor[]
}
export type ChangelogOptions = { maxCount?: number, repoUrl?: string, commitUrlPattern?: string, issueUrlPattern?: string, tagUrlPattern?: string }
export type LastUpdatedOptions = { formatOptions?: Intl.DateTimeFormatOptions & { forceLocale?: boolean } }
export type BulletinOptions = {
  enabled?: boolean
  id?: string
  layout?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  border?: boolean
  enablePage?: boolean | ((page: { path: string }) => boolean)
  lifetime?: 'always' | 'session' | 'once'
  title?: string
  contentType?: 'text' | 'html' | 'markdown'
  content?: string
  contentFile?: string
  [key: string]: unknown
}
export type LocaleTextOptions = {
  appearanceText?: string
  lightModeSwitchTitle?: string
  darkModeSwitchTitle?: string
  copyrightText?: string
  copyrightAuthorText?: string
  copyrightCreationOriginalText?: string
  copyrightCreationTranslateText?: string
  copyrightCreationReprintText?: string
  copyrightLicenseText?: string
  selectLanguageText?: string
  selectLanguageAriaLabel?: string
  selectLanguageName?: string
  editLinkText?: string
  lastUpdatedText?: string
  contributorsText?: string
  changelogText?: string
  changelogOnText?: string
  changelogButtonText?: string
  sidebarMenuLabel?: string
  returnToTopLabel?: string
  outlineLabel?: string
  prevPageLabel?: string
  nextPageLabel?: string
  openNewWindowText?: string
  notFound?: { code?: string | number, title?: string, quote?: string, linkLabel?: string, linkText?: string }
  homeText?: string
  postsText?: string
  tagText?: string
  archiveText?: string
  categoryText?: string
  archiveTotalText?: string
  encryptGlobalText?: string
  encryptPageText?: string
  encryptButtonText?: string
  encryptPlaceholder?: string
  copyPageText?: string
  copiedPageText?: string
  copingPageText?: string
  copyTagline?: string
  viewMarkdown?: string
  viewMarkdownTagline?: string
  askAIText?: string
  askAITagline?: string
  askAIMessage?: string
}
export type LegacyBlogOptions = Omit<Partial<PostCollection>, 'type' | 'exclude'> & { exclude?: string | string[] }
export type LegacyNotesOptions = {
  dir: string
  link: string
  notes: Array<{ dir: string, link: string, text?: string, sidebar?: 'auto' | SidebarItem[] }>
}
export type SidebarOptions = false | 'auto' | SidebarItem[] | Record<string, 'auto' | SidebarItem[] | { items: 'auto' | SidebarItem[], prefix?: string }>
export type MarkdownImageOptions = {
  figure?: boolean | { focusable?: boolean, linkImage?: boolean }
  lazyload?: boolean
  mark?: boolean | { light?: string[], dark?: string[] }
  size?: boolean
  legacySize?: boolean
  obsidianSize?: boolean
}
export type MarkdownIncludeOptions = {
  resolvePath?: (reference: string, cwd: string | null) => string
  deep?: boolean
  useComment?: boolean
  resolveImagePath?: boolean
  resolveLinkPath?: boolean
}
export type MarkdownMathOptions = Record<string, unknown> & {
  type?: 'katex' | 'mathjax'
  delimiters?: 'all' | 'brackets' | 'dollars'
  copy?: boolean
  mhchem?: boolean
  output?: 'chtml' | 'svg'
  tex?: Record<string, unknown>
  chtml?: Record<string, unknown>
  svg?: Record<string, unknown>
}
export type MarkdownIconOptions = {
  provider?: 'iconify' | 'iconfont' | 'fontawesome'
  prefix?: string
  size?: string | number
  color?: string
  assets?: string | string[]
  preload?: string[] | Record<string, string[]>
}
export type MarkdownReplTheme = BundledTheme | { light: BundledTheme, dark: BundledTheme }
export type MarkdownReplOptions = {
  theme?: MarkdownReplTheme
  go?: boolean
  kotlin?: boolean
  rust?: boolean
  python?: boolean
}
export type MarkdownCodeTreeOptions = {
  icon?: 'simple' | 'colored'
  height?: string | number
}
export type MarkdownObsidianCalloutOptions = {
  locales?: Record<string, Record<string, string>>
  openRender?: RenderRule
  closeRender?: RenderRule
  titleRender?: RenderRule
}
export type MarkdownObsidianOptions = {
  wikiLink?: boolean
  embedLink?: boolean
  callout?: boolean | MarkdownObsidianCalloutOptions
  comment?: boolean
}
export type MarkdownOptions = {
  alert?: boolean | Record<string, unknown>
  hint?: boolean | Record<string, unknown>
  image?: false | MarkdownImageOptions
  imageSize?: false | true | 'local' | 'all'
  include?: false | true | MarkdownIncludeOptions
  math?: false | MarkdownMathOptions
  mark?: 'eager' | 'lazy'
  icon?: boolean | MarkdownIconOptions
  /** @deprecated Use icon. */
  icons?: boolean | MarkdownIconOptions
  codeTabs?: { icon?: boolean | { named?: false | string[], extensions?: false | string[] } }
  repl?: false | MarkdownReplOptions
  codepen?: boolean
  codeSandbox?: boolean
  jsfiddle?: boolean
  /** @deprecated Replit no longer supports embeds reliably. */
  replit?: boolean
  table?: boolean | { align?: 'left' | 'center' | 'right', copy?: boolean | 'all' | 'html' | 'md', maxContent?: boolean, fullWidth?: boolean }
  demo?: boolean | Record<string, unknown>
  encrypt?: boolean | { password?: string }
  codeTree?: boolean | MarkdownCodeTreeOptions
  collapse?: boolean
  timeline?: boolean
  chat?: boolean
  field?: boolean
  obsidian?: boolean | MarkdownObsidianOptions
  abbr?: boolean | Record<string, string>
  annotation?: boolean | Record<string, string | string[]>
  plot?: boolean | { trigger?: 'hover' | 'click', effect?: 'mask' | 'blur' }
  qrcode?: boolean
  caniuse?: boolean | { mode?: 'embed' | 'baseline' | 'image' | string }
  chartjs?: boolean
  echarts?: boolean
  flowchart?: boolean
  markmap?: boolean
  plantuml?: boolean | Array<Record<string, unknown>>
  mermaid?: boolean
  acfun?: boolean
  bilibili?: boolean
  youtube?: boolean
  pdf?: boolean | { pdfjsUrl?: string }
  audioReader?: boolean
  artPlayer?: boolean
  npmTo?: boolean | Array<'npm' | 'pnpm' | 'yarn' | 'bun' | 'deno'> | { tabs?: Array<'npm' | 'pnpm' | 'yarn' | 'bun' | 'deno'> }
  env?: {
    references?: Record<string, string | { href: string, title?: string }>
    abbreviations?: Record<string, string>
    annotations?: Record<string, string | string[]>
  }
  locales?: Record<string, {
    common?: { copy?: string, copied?: string }
    encrypt?: Partial<{ hint: string, placeholder: string, incPwd: string, noContent: string, warningTitle: string, warningText: string }>
    obsidian?: Record<string, string>
  }>
  /** @deprecated Use encrypt.password. */
  encryptPassword?: string
  fileTree?: boolean | { icon?: false | 'simple' | 'colored', [key: string]: unknown }
  DANGEROUS_ALLOW_SCRIPT_EXECUTION?: boolean
  DANGEROUS_SCRIPT_EXECUTION_ALLOWLIST?: '*' | string[]
  /** @deprecated Use demo. */
  oldDemo?: never
  [key: string]: unknown
}
export type CodeHighlighterOptions = Record<string, unknown> & {
  twoslash?: boolean | Record<string, unknown>
  whitespace?: boolean | 'all' | 'boundary' | 'leading' | 'trailing'
  renderIndentGuides?: boolean | { indent?: number | false }
  colorizedBrackets?: boolean | Record<string, unknown>
  lineNumbers?: boolean | number | 'disable'
}
export type AutoFrontmatterData = Record<string, unknown> & { title?: string, createTime?: string | false, permalink?: string }
export type AutoFrontmatterContext = { filepath: string, relativePath: string, content: string }
export type AutoFrontmatterOptions = {
  permalink?: boolean | 'filepath'
  createTime?: boolean
  title?: boolean
  transform?: (data: AutoFrontmatterData, context: AutoFrontmatterContext, locale: string) => AutoFrontmatterData | Promise<AutoFrontmatterData>
}
export type LlmsPage = { path: string, title: string, lang: string, filePathRelative?: string, frontmatter: Record<string, unknown>, markdown?: string, excerpt?: string }
export type LlmsOptions = {
  domain?: string
  linkExtension?: '.html' | '.md'
  llmsTxt?: boolean
  llmsFullTxt?: boolean
  llmsPageTxt?: boolean
  stripHTML?: boolean
  locale?: string | 'all'
  filter?: (page: LlmsPage) => boolean
  transformMarkdown?: (markdown: string, page: LlmsPage) => string
  llmsTxtTemplate?: string
  llmsTxtTemplateGetter?: Record<string, string | ((pages: LlmsPage[], state: Record<string, unknown>) => string)>
}
export type SitemapPage = { path: string, pathLocale: string, lang: string, filePathRelative?: string, frontmatter: Record<string, unknown>, data: Record<string, unknown> }
export type SitemapOptions = {
  hostname?: string
  extraUrls?: string[]
  excludePaths?: string[]
  sitemapFilename?: string
  sitemapXSLFilename?: string
  sitemapXSLTemplate?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  modifyTimeGetter?: (page: SitemapPage, app: Record<string, unknown>) => string
  devServer?: boolean
  devHostname?: string
  xmlNameSpace?: { news: boolean, video: boolean, xhtml: boolean, image: boolean, custom?: string[] }
}
export type SeoAuthor = string | { name: string, url?: string, email?: string } | Array<string | { name: string, url?: string, email?: string }>
export type SeoPage = { path: string, pathLocale: string, lang: string, title: string, filePathRelative?: string, frontmatter: Record<string, unknown>, data: Record<string, unknown>, content?: string }
export type SeoHeadItem = [string, Record<string, string>, string?]
export type SeoOptions = {
  hostname?: string
  author?: SeoAuthor
  restrictions?: string
  autoDescription?: boolean
  fallBackImage?: string
  twitterID?: string
  isArticle?: (page: SeoPage) => boolean
  ogp?: (ogp: Record<string, unknown>, page: SeoPage, app: Record<string, unknown>) => Record<string, unknown>
  jsonLd?: (jsonLd: Record<string, unknown>, page: SeoPage, app: Record<string, unknown>) => Record<string, unknown>
  customHead?: (head: SeoHeadItem[], page: SeoPage, app: Record<string, unknown>) => void
  canonical?: string | ((page: SeoPage) => string | null)
}
export type PhotoSwipeLocale = { close: string, download: string, fullscreen: string, zoom: string, arrowPrev: string, arrowNext: string }
export type PhotoSwipeOptions = {
  selector?: string | string[]
  download?: boolean
  fullscreen?: boolean
  scrollToClose?: boolean
  locales?: Record<string, Partial<PhotoSwipeLocale>>
}
export type SearchOptions = {
  provider?: 'local' | 'algolia'
  appId?: string
  apiKey?: string
  indexName?: string
  indices?: Array<Record<string, unknown>>
  locales?: Record<string, unknown>
  disableQueryPersistence?: boolean
  isSearchable?: (page: SeoPage) => boolean
  miniSearch?: { options?: Record<string, unknown>, searchOptions?: Record<string, unknown> }
  [key: string]: unknown
}
export type BuiltinPluginOptions = {
  search?: false | SearchOptions
  docsearch?: false | Record<string, unknown>
  copyCode?: false | Record<string, unknown>
  shiki?: false | Record<string, unknown>
  git?: boolean
  nprogress?: boolean
  photoSwipe?: false | PhotoSwipeOptions
  markdownEnhance?: never
  markdownPower?: false | MarkdownOptions
  markdownImage?: false | MarkdownImageOptions
  markdownMath?: false | MarkdownMathOptions
  markdownInclude?: boolean | MarkdownIncludeOptions
  markdownChart?: false | MarkdownOptions
  comment?: false | Record<string, unknown>
  sitemap?: false | SitemapOptions
  seo?: false | SeoOptions
  cache?: false | Record<string, unknown>
  readingTime?: false | Record<string, unknown>
  watermark?: boolean | Record<string, unknown>
  replaceAssets?: false | Record<string, unknown>
  llmstxt?: boolean | LlmsOptions
  [key: string]: unknown
}

export type NavigationItem = string | {
  text?: string
  link?: string
  label?: string
  href?: string
  icon?: ThemeIcon
  badge?: SidebarBadge
  activeMatch?: string
  prefix?: string
  items?: NavigationItem[]
  target?: string
  rel?: string
  noIcon?: boolean
}

export interface LocaleConfig extends LocaleTextOptions {
  siteName: string
  /** Locale route prefix. Defaults to a string home for backward compatibility. */
  path?: string
  home?: false | string
  logo?: false | string
  logoDark?: false | string
  description?: string
  authorName?: string
  authorDescription?: string
  profileTagline?: string
  keywords?: string
  blogName?: string
  docsName?: string
  navigation?: false | NavigationItem[]
  navbar?: false | NavigationItem[]
  collections?: Collection[]
  /** @deprecated Use collections. Converted at startup for Plume migrations. */
  notes?: LegacyNotesOptions
  sidebar?: SidebarOptions
  sidebarScrollbar?: boolean
  outline?: false | number | [number, number] | 'deep'
  aside?: boolean | 'left'
  appearance?: boolean | 'dark' | 'force-dark'
  profile?: false | ProfileOptions
  /** @deprecated Use profile. */
  avatar?: false | ProfileOptions
  social?: false | SocialLink[]
  navbarSocialInclude?: string[]
  bulletin?: true | BulletinOptions
  footer?: false | FooterOptions
  externalLinkIcon?: boolean
  prevPage?: boolean
  nextPage?: boolean
  createTime?: boolean | 'only-posts'
  transition?: boolean | TransitionOptions
  contributors?: boolean | ContributorsOptions
  changelog?: boolean | ChangelogOptions
  lastUpdated?: false | LastUpdatedOptions
  editLink?: boolean
  editLinkPattern?: string
  copyright?: boolean | string | Record<string, unknown>
  [key: string]: unknown
}

export interface SiteConfig extends LocaleTextOptions {
  origin?: string
  hostname?: string
  base?: string
  /** Default-locale home link, matching Plume's top-level home option. */
  home?: false | string
  logo?: false | string
  logoDark?: false | string
  multilingual?: boolean
  locales: Record<string, LocaleConfig>
  /** @deprecated Use collections. Converted at startup for Plume migrations. */
  blog?: LegacyBlogOptions
  /** @deprecated Use collections. Converted at startup for Plume migrations. */
  notes?: LegacyNotesOptions
  /** @deprecated Legacy post link prefix used by blog. */
  article?: string
  collections?: Collection[]
  appearance?: boolean | 'dark' | 'force-dark'
  namespace?: string
  mediaOrigin?: string
  replaceAssets?: boolean | Record<string, unknown>
  autoFrontmatter?: boolean | AutoFrontmatterOptions
  social?: SocialLink[]
  navbarSocialInclude?: string[]
  navigation?: false | NavigationItem[]
  navbar?: false | NavigationItem[]
  sidebar?: SidebarOptions
  sidebarScrollbar?: boolean
  footer?: false | FooterOptions
  profile?: false | ProfileOptions
  /** @deprecated Use profile. */
  avatar?: false | ProfileOptions
  /** VuePress-only migration shim; Astro does not use this value. */
  cache?: false | 'memory' | 'filesystem'
  /** VuePress-only migration shim; site.config.mjs is Astro's fixed entrypoint. */
  configFile?: string
  externalLinkIcon?: boolean
  outline?: false | number | [number, number] | 'deep'
  aside?: boolean | 'left'
  prevPage?: boolean
  nextPage?: boolean
  createTime?: boolean | 'only-posts'
  editLink?: boolean
  editLinkPattern?: string
  tagsTheme?: 'colored' | 'gray' | 'brand'
  meta?: false | { tags?: boolean, readingTime?: boolean, wordCount?: boolean, createTime?: boolean | 'short' | 'long' }
  readingTime?: false | { wordPerMinute?: number, locales?: Record<string, unknown> }
  postCover?: false | PostCoverOptions
  pagination?: false | number | { perPage?: number }
  categoriesExpand?: number | 'deep'
  transition?: boolean | TransitionOptions
  search?: boolean | SearchOptions
  features?: { engagement?: boolean, popularPosts?: boolean, comments?: boolean }
  repository?: { url?: string, branch?: string, contentDir?: string, editLinkPattern?: string }
  docsRepo?: string
  docsBranch?: string
  docsDir?: string
  copyright?: boolean | string | Record<string, unknown>
  lastUpdated?: false | LastUpdatedOptions
  contributors?: boolean | ContributorsOptions
  changelog?: boolean | ChangelogOptions
  encrypt?: false | Record<string, unknown>
  markdown?: MarkdownOptions
  llmstxt?: boolean | LlmsOptions
  pageContextMenu?: { chatgpt?: boolean, claude?: boolean, perplexity?: boolean }
  copyCode?: boolean | Record<string, unknown>
  codeHighlighter?: false | CodeHighlighterOptions
  plugins?: BuiltinPluginOptions
  watermark?: boolean | Record<string, unknown>
  bulletin?: false | BulletinOptions
  services?: Record<string, unknown>
  comment?: false | Record<string, unknown>
  verification?: Record<string, string>
  [key: string]: unknown
}

export interface SiteConfigDefaults {
  origin: string
  hostname: string
  base: string
  logo: false | string
  multilingual: boolean
  appearance: boolean | 'dark' | 'force-dark'
  namespace: string
  social: SocialLink[]
  navbarSocialInclude: string[]
  aside: boolean | 'left'
  outline: false | number | [number, number] | 'deep'
  externalLinkIcon: boolean
  editLink: boolean
  contributors: boolean | ContributorsOptions
  changelog: boolean | ChangelogOptions
  prevPage: boolean
  nextPage: boolean
  footer: false | FooterOptions
  features: { engagement: boolean, popularPosts: boolean, comments: boolean }
  repository: { url?: string, branch?: string, contentDir?: string, editLinkPattern?: string }
  encrypt: false | Record<string, unknown>
  markdown: MarkdownOptions & { math: false | MarkdownMathOptions }
  codeHighlighter: false | CodeHighlighterOptions
  plugins: BuiltinPluginOptions
  services: Record<string, unknown> & { statsBase: string, statsVisitorHeader: string }
  comment: false | (Record<string, unknown> & { provider: string })
  verification: Record<string, string>
  [key: string]: unknown
}
