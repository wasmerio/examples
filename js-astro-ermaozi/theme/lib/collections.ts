import { matchesGlob } from 'node:path'
import { siteConfig } from '../../site.config.mjs'
import type { AutoFrontmatterOptions, ProfileOptions, SocialLink } from '../config-types.ts'
import { localePrefix, type Lang } from './locales.ts'

export type SidebarBadge = string | { text?: string, type?: string, color?: string, bgColor?: string, borderColor?: string }
export type PostCoverLayout = 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'
export type PostCoverOptions = PostCoverLayout | { layout?: PostCoverLayout, ratio?: number | `${number}:${number}` | `${number}/${number}`, width?: number, compact?: boolean }
export type PostsCategoryItem = { id: string, name: string, sort: number }

export type SidebarItem = string | {
  text?: string
  link?: string
  icon?: string | { svg: string }
  badge?: SidebarBadge
  prefix?: string
  dir?: string
  items?: 'auto' | SidebarItem[]
  collapsed?: boolean
  rel?: string
  target?: string
}

export type BaseCollection = {
  type: 'post' | 'doc'
  dir: string
  title?: string
  linkPrefix?: string
  tagsTheme?: 'colored' | 'gray' | 'brand'
  autoFrontmatter?: false | AutoFrontmatterOptions
  meta?: { tags?: boolean, readingTime?: boolean, wordCount?: boolean, createTime?: boolean | 'short' | 'long' }
}

export type PostCollection = BaseCollection & {
  type: 'post'
  include?: string[]
  exclude?: string[]
  pagination?: false | number | { perPage?: number }
  link?: string
  postList?: boolean
  tags?: boolean
  tagsLink?: string
  tagsText?: string
  archives?: boolean
  archivesLink?: string
  archivesText?: string
  categories?: boolean
  categoriesLink?: string
  categoriesText?: string
  categoriesExpand?: number | 'deep'
  categoriesTransform?: (categories: PostsCategoryItem[]) => PostsCategoryItem[]
  postCover?: PostCoverOptions
  profile?: ProfileOptions | false
  social?: SocialLink[] | false
}

export type DocCollection = BaseCollection & {
  type: 'doc'
  sidebar?: 'auto' | SidebarItem[]
  sidebarScrollbar?: boolean
  sidebarCollapsed?: boolean
}

export type Collection = PostCollection | DocCollection
export type ResolvedPostCollection = PostCollection & {
  key: string
  title: string
  link: string
  linkPrefix: string
  tagsLink: string
  archivesLink: string
  categoriesLink: string
}
export type ResolvedDocCollection = DocCollection & { key: string, title: string, linkPrefix: string }
export type ResolvedCollection = ResolvedPostCollection | ResolvedDocCollection

const clean = (value = '') => value.replaceAll('\\', '/').replace(/^\.\//u, '').replace(/^\/+|\/+$/gu, '')
const route = (value = '') => `/${clean(value)}/`.replace(/\/{2,}/gu, '/')
const withLocale = (lang: Lang, value: string) => {
  const prefix = clean(localePrefix(lang))
  const path = clean(value)
  return route(prefix && path !== prefix && !path.startsWith(`${prefix}/`) ? `${prefix}/${path}` : path)
}

export function collectionsFor(lang: Lang, config: any = siteConfig): ResolvedCollection[] {
  const localeConfig = config.locales?.[lang] ?? {}
  const configured = localeConfig.collections ?? config.collections
  return ((configured ?? []) as Collection[]).map(collection => {
    const dir = clean(collection.dir)
    const title = collection.title || dir.split('/').at(-1) || collection.type
    const key = `${lang}:${dir}`
    if (collection.type === 'doc') return {
      ...collection,
      dir,
      key,
      title,
      linkPrefix: withLocale(lang, collection.linkPrefix ?? dir),
    }
    const link = withLocale(lang, collection.link ?? dir)
    const linkPrefix = withLocale(lang, collection.linkPrefix ?? collection.link ?? dir)
    const tags = collection.tags ?? true
    const archives = collection.archives ?? true
    const categories = collection.categories ?? true
    return {
      ...collection,
      dir,
      key,
      title,
      link,
      linkPrefix,
      tags,
      archives,
      categories,
      tagsLink: tags ? withLocale(lang, collection.tagsLink ?? `${clean(collection.linkPrefix ?? collection.link ?? dir)}/tags`) : '',
      archivesLink: archives ? withLocale(lang, collection.archivesLink ?? `${clean(collection.linkPrefix ?? collection.link ?? dir)}/archives`) : '',
      categoriesLink: categories ? withLocale(lang, collection.categoriesLink ?? `${clean(collection.linkPrefix ?? collection.link ?? dir)}/categories`) : '',
    }
  })
}

export const relativeContentId = (id: string, lang: Lang) => {
  const prefix = clean(localePrefix(lang))
  return prefix && clean(id).startsWith(`${prefix}/`) ? clean(id).slice(prefix.length + 1) : clean(id)
}

const included = (relative: string, collection: Collection) => {
  const file = relative.slice(clean(collection.dir).length).replace(/^\//u, '') + '.md'
  if (collection.type !== 'post') return true
  const includes = collection.include ?? []
  const patterns = includes.filter(pattern => !pattern.startsWith('!'))
  if (includes.length && !patterns.some(pattern => matchesGlob(file, pattern))) return false
  const ignores = [...includes.filter(pattern => pattern.startsWith('!')).map(pattern => pattern.slice(1)), ...(collection.exclude ?? [])]
  return !ignores.some(pattern => matchesGlob(file, pattern))
}

const collectionCandidates = (id: string, lang: Lang, config: any) => {
  const relative = relativeContentId(id, lang)
  return collectionsFor(lang, config)
    .filter(collection => !collection.dir || relative === collection.dir || relative.startsWith(`${collection.dir}/`))
    .sort((left, right) => right.dir.length - left.dir.length)
}

export function collectionForPath(id: string, lang: Lang, config: any = siteConfig): ResolvedCollection | undefined {
  return collectionCandidates(id, lang, config)[0]
}

export function collectionForEntry(id: string, lang: Lang, config: any = siteConfig): ResolvedCollection | undefined {
  const relative = relativeContentId(id, lang)
  return collectionCandidates(id, lang, config).find(collection => included(relative, collection))
}

export const postCollectionsFor = (lang: Lang, config?: any) => collectionsFor(lang, config).filter((collection): collection is ResolvedPostCollection => collection.type === 'post')
export const docCollectionsFor = (lang: Lang, config?: any) => collectionsFor(lang, config).filter((collection): collection is ResolvedDocCollection => collection.type === 'doc')
export const docCollectionForSidebar = (lang: Lang, selector: string, config?: any) => {
  const target = clean(selector)
  return docCollectionsFor(lang, config).find(collection =>
    collection.key === selector || collection.dir === target || clean(collection.linkPrefix) === target)
}

export const defineThemeConfig = <T>(options: T): T => options
export const defineNavbarConfig = <T>(options: T): T => options
export const defineCollections = <T extends Collection[]>(options: T): T => options
export const defineCollection = <T extends Collection>(options: T): T => options
/** @deprecated Use defineCollections instead. */
export const defineNotesConfig = <T>(options: T): T => options
/** @deprecated Use defineCollection instead. */
export const defineNoteConfig = <T>(options: T): T => options
