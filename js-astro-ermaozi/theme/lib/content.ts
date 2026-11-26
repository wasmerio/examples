import type { CollectionEntry } from 'astro:content'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { configuredLanguages, localePath, localePrefix, rootLanguage, type Lang } from './locales.ts'
import { collectionForEntry, collectionForPath, relativeContentId, type ResolvedDocCollection, type ResolvedPostCollection } from './collections.ts'

export type ContentEntry = CollectionEntry<'content'>
export type { Lang } from './locales.ts'
export interface PostMetaConfig {
  tags?: boolean
  readingTime?: boolean
  wordCount?: boolean
  createTime?: 'short' | 'long' | boolean
}

const hiddenPostMeta = { tags: false, readingTime: false, wordCount: false, createTime: false } satisfies PostMetaConfig
export const postMetaConfigOf = (global: PostMetaConfig | false | undefined, collection?: PostMetaConfig): PostMetaConfig => ({
  ...(global === false ? hiddenPostMeta : global ?? {}),
  ...(collection ?? {}),
})

export const routeOf = (entry: ContentEntry) => {
  if (entry.data.permalink) return entry.data.permalink
  const path = entry.id.replace(/(^|\/)\d+\./g, '$1')
  if (path === 'index') return '/'
  return path.endsWith('/index') ? `/${path.slice(0, -'/index'.length)}/`.replace('//', '/') : `/${path}/`
}

export const langOf = (entry: ContentEntry): Lang => {
  if (entry.data.lang) return entry.data.lang
  return configuredLanguages()
    .filter(lang => localePath(lang) !== '/')
    .sort((left, right) => localePath(right).length - localePath(left).length)
    .find(lang => entry.id.startsWith(`${localePath(lang).replace(/^\//u, '').replace(/\/$/u, '')}/`)) ?? rootLanguage()
}

const contentType = (entry: ContentEntry) => {
  const collection = collectionForPath(entry.id, langOf(entry))
  if (collection) return collectionForEntry(entry.id, langOf(entry))?.type
  return entry.data.type ?? (entry.id.split('/').includes('blog') ? 'post' : entry.id.split('/').includes('docs') ? 'doc' : undefined)
}

export const isPost = (entry: ContentEntry) => contentType(entry) === 'post'

export const isDoc = (entry: ContentEntry) => contentType(entry) === 'doc'

export const categoryListOf = (entry: ContentEntry, config?: any) => {
  const lang = langOf(entry)
  const collection = collectionForEntry(entry.id, lang, config)
  if (collection?.type !== 'post' || collection.categories === false) return []
  const relative = relativeContentId(entry.id, lang)
  const categories = relative.slice(collection.dir.length).replace(/^\//u, '').split('/').slice(0, -1)
  const list = categories.map((category, index) => {
    const match = category.match(/^(?:(\d+)\.)?([\s\S]+)$/)!
    return {
      id: createHash('md5').update(categories.slice(0, index + 1).join('-')).digest('hex').slice(0, 6),
      name: match[2],
      sort: match[1] ? Number(match[1]) : Number.MAX_SAFE_INTEGER,
    }
  })
  return collection.categoriesTransform?.(list) ?? list
}

export const categoriesOf = (entry: ContentEntry) => categoryListOf(entry).map(category => category.name)

export const publishedDateOf = (entry: ContentEntry) => {
  const value = entry.data.createTime ?? entry.data.date
  if (!value) return new Date(0)
  const date = value instanceof Date ? value : new Date(String(value).replaceAll('/', '-'))
  return Number.isNaN(date.getTime()) ? new Date(0) : date
}

export const updatedDateOf = (entry: ContentEntry) => {
  const value = entry.data.updateTime
  if (!value) return new Date(0)
  const date = value instanceof Date ? value : new Date(String(value).replaceAll('/', '-'))
  return Number.isNaN(date.getTime()) ? new Date(0) : date
}

const stickyRank = (value: boolean | number | undefined) => value === true ? 1 : typeof value === 'number' ? value : undefined

export const showsStickyBadge = (value: boolean | number | undefined) => typeof value === 'boolean' ? value : typeof value === 'number' && value >= 0

export const postsFor = (entries: ContentEntry[], lang: Lang, collection?: ResolvedPostCollection | string, includeDrafts = false) => entries
  .filter(entry => isPost(entry) && entry.data.article !== false && langOf(entry) === lang && (includeDrafts || !entry.data.draft) && (!collection || collectionForEntry(entry.id, lang)?.key === (typeof collection === 'string' ? collection : collection.key)))
  .sort((a, b) => {
    const left = stickyRank(a.data.sticky)
    const right = stickyRank(b.data.sticky)
    if (left === undefined && right !== undefined) return 1
    if (left !== undefined && right === undefined) return -1
    return (right ?? 0) - (left ?? 0) || publishedDateOf(b).getTime() - publishedDateOf(a).getTime()
  })

export const docsFor = (entries: ContentEntry[], lang: Lang, collection?: ResolvedDocCollection | string, includeDrafts = false) => entries
  .filter(entry => isDoc(entry) && langOf(entry) === lang && (includeDrafts || !entry.data.draft) && (!collection || collectionForEntry(entry.id, lang)?.key === (typeof collection === 'string' ? collection : collection.key)))
  .sort((a, b) => Number(a.data.order ?? Number.MAX_SAFE_INTEGER) - Number(b.data.order ?? Number.MAX_SAFE_INTEGER)
    || a.id.localeCompare(b.id, lang))

export const sectionOf = (entry: ContentEntry) => {
  return categoryListOf(entry)[0]?.name ?? ''
}

export const tagClassOf = (tag: string, theme: 'colored' | 'gray' | 'brand' = 'colored') => theme === 'colored'
  ? `vp-tag-color-${[...tag.toLowerCase()].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 18}`
  : `tag-${theme}`

export const findTranslation = (entry: ContentEntry, entries: ContentEntry[]) => {
  const route = routeOf(entry)
  if (entry.data.translationOf) return entries.find(candidate => routeOf(candidate) === entry.data.translationOf)
  return entries.find(candidate => candidate.data.translationOf === route)
}

export const relativeRouteOf = (entry: ContentEntry) => {
  const route = routeOf(entry)
  const prefix = localePrefix(langOf(entry))
  return prefix && route.startsWith(`${prefix}/`) ? route.slice(prefix.length) : route
}

export const translationsOf = (entry: ContentEntry, entries: ContentEntry[]) => entries.filter(candidate => {
  if (candidate.id === entry.id) return true
  const route = routeOf(entry)
  const candidateRoute = routeOf(candidate)
  return candidate.data.translationOf === (entry.data.translationOf ?? route)
    || entry.data.translationOf === candidateRoute
    || relativeRouteOf(candidate) === relativeRouteOf(entry)
})

export const formatDate = (date: Date, _lang: Lang) => date.getTime()
  ? [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
  : ''

export const createTimeTextOf = (entry: ContentEntry, format: 'short' | 'long' | true = 'short') => {
  const value = entry.data.createTime ?? entry.data.date
  if (!value) return ''
  if (value instanceof Date) {
    const date = formatDate(value, langOf(entry))
    if (format === 'short' || format === true) return date
    return `${date} ${[value.getHours(), value.getMinutes(), value.getSeconds()].map(part => String(part).padStart(2, '0')).join(':')}`
  }
  const normalized = String(value).replaceAll('/', '-').replace('T', ' ')
  return format === 'short' || format === true ? normalized.split(/\s/)[0] : normalized
}

export const wordCountOf = (entry: ContentEntry) => {
  const source = entry.filePath ? readFileSync(entry.filePath, 'utf8') : entry.body ?? ''
  const words = source.match(/[\w\d\s\u00C0-\u024F\u0400-\u04FF.@/]+/giu)
  const cjk = source.match(/[\u4E00-\u9FD5]/gu)
  return (words?.reduce((total, part) => total + (part.trim() ? part.trim().split(/\s+/u).length : 0), 0) ?? 0) + (cjk?.length ?? 0)
}
