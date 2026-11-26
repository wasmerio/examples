import type { ContentEntry } from './content.ts'
import { langOf, routeOf } from './content.ts'
import { relativeContentId, type ResolvedDocCollection, type SidebarBadge, type SidebarItem } from './collections.ts'
import { localeOf, localePath, localePrefix, type Lang } from './locales.ts'
import { siteConfig } from '../../site.config.mjs'

export type ResolvedSidebarItem = {
  text: string
  link?: string
  icon?: string | { svg: string }
  badge?: SidebarBadge
  items?: ResolvedSidebarItem[]
  collapsed?: boolean
  rel?: string
  target?: string
  entryId?: string
  separator?: boolean
  sort?: number
}

export type SidebarLink = { href: string, title: string, icon?: string | { svg: string } }

const clean = (value = '') => value.replaceAll('\\', '/').replace(/^\.\//u, '').replace(/^\/+|\/+$/gu, '').replace(/\.(?:md|html)$/iu, '')
const label = (value: string) => value.replace(/^\d+\./u, '')
const order = (value: string) => Number(value.match(/^(\d+)\./u)?.[1] ?? Number.MAX_SAFE_INTEGER)
const relativeToCollection = (entry: ContentEntry, lang: Lang, collection: ResolvedDocCollection) => relativeContentId(entry.id, lang).slice(collection.dir.length).replace(/^\//u, '')

const sorted = (items: ResolvedSidebarItem[]) => items.sort((left, right) => (left.sort ?? Number.MAX_SAFE_INTEGER) - (right.sort ?? Number.MAX_SAFE_INTEGER) || left.text.localeCompare(right.text))

function autoItems(entries: ContentEntry[], lang: Lang, collection: ResolvedDocCollection, prefix = ''): ResolvedSidebarItem[] {
  const direct: ResolvedSidebarItem[] = []
  const directories = new Map<string, ContentEntry[]>()
  for (const entry of entries) {
    const relative = relativeToCollection(entry, lang, collection)
    if (!relative) continue
    const scoped = prefix ? relative.startsWith(`${clean(prefix)}/`) ? relative.slice(clean(prefix).length + 1) : '' : relative
    if (!scoped || /^(?:index|readme)$/iu.test(scoped)) continue
    const [head, ...tail] = scoped.split('/')
    if (tail.length) directories.set(head, [...(directories.get(head) ?? []), entry])
    else direct.push({
      text: entry.data.title,
      link: routeOf(entry),
      icon: entry.data.icon,
      badge: entry.data.badge,
      entryId: entry.id,
      sort: Number(entry.data.order ?? order(head)),
    })
  }
  const groups = [...directories].map(([directory, children]) => {
    const childPrefix = [prefix, directory].filter(Boolean).join('/')
    const home = findEntry(entries, lang, collection, childPrefix)
    return {
      text: children.find(entry => entry.data.group)?.data.group ?? label(directory),
      link: home ? routeOf(home) : undefined,
      entryId: home?.id,
      items: autoItems(entries, lang, collection, childPrefix),
      collapsed: collection.sidebarCollapsed ?? false,
      sort: order(directory),
    }
  })
  return sorted([...direct, ...groups])
}

const protocolLink = (value: string) => /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/iu.test(value)
const join = (prefix: string, value: string) => protocolLink(value) ? value : clean(value.startsWith('/') ? value : `${clean(prefix)}/${value}`)

function findEntry(entries: ContentEntry[], lang: Lang, collection: ResolvedDocCollection, value: string) {
  const target = clean(value)
  return entries.find(entry => routeOf(entry).replace(/^\/+|\/+$/gu, '') === target)
    ?? entries.find(entry => {
      const relative = relativeToCollection(entry, lang, collection).replace(/\/(?:index|readme)$/iu, '')
      return clean(relative) === target || clean(`${collection.dir}/${relative}`) === target
    })
}

function manualItems(items: SidebarItem[], entries: ContentEntry[], lang: Lang, collection: ResolvedDocCollection, parentPrefix = ''): ResolvedSidebarItem[] {
  return items.flatMap<ResolvedSidebarItem>(item => {
    const option = typeof item === 'string' ? { link: item } : item
    const prefix = option.prefix === undefined && option.dir === undefined ? parentPrefix : join(parentPrefix, option.prefix ?? option.dir ?? '')
    const link = option.link ? join(parentPrefix, option.link) : ''
    if (/^-{3,}$/u.test(option.link ?? '')) return [{ text: option.text ?? '', link: option.link, separator: true, icon: option.icon }]
    const entry = link ? findEntry(entries, lang, collection, link) : undefined
    const autoHome = !link && option.items === 'auto' ? findEntry(entries, lang, collection, prefix) : undefined
    const children = option.items === 'auto'
      ? autoItems(entries, lang, collection, prefix)
      : option.items?.length ? manualItems(option.items, entries, lang, collection, prefix) : undefined
    if (!entry && !children?.length && !option.text) return []
    return [{
      text: option.text ?? entry?.data.title ?? label(link.split('/').at(-1) ?? ''),
      link: entry ? routeOf(entry) : autoHome ? routeOf(autoHome) : option.link ? protocolLink(link) ? link : `/${link}/`.replace(/\/{2,}/gu, '/') : undefined,
      icon: entry?.data.icon ?? autoHome?.data.icon ?? option.icon,
      badge: entry?.data.badge ?? autoHome?.data.badge ?? option.badge,
      items: children,
      collapsed: option.collapsed ?? (children?.length ? collection.sidebarCollapsed ?? false : undefined),
      rel: option.rel,
      target: option.target,
      entryId: entry?.id ?? autoHome?.id,
    }]
  })
}

export function resolveSidebar(entries: ContentEntry[], lang: Lang, collection: ResolvedDocCollection) {
  const docs = entries.filter(entry => !collection.dir || relativeContentId(entry.id, lang) === collection.dir || relativeContentId(entry.id, lang).startsWith(`${collection.dir}/`))
  const configured = collection.sidebar
  return Array.isArray(configured) ? manualItems(configured, docs, lang, collection) : autoItems(docs, lang, collection)
}

const routePath = (value = '') => `/${clean(value)}/`.replace(/\/{2,}/gu, '/')
const localizedPath = (lang: Lang, value: string) => {
  const prefix = clean(localePrefix(lang))
  const path = clean(value)
  return routePath(prefix && path !== prefix && !path.startsWith(`${prefix}/`) ? `${prefix}/${path}` : path)
}
const contentDir = (lang: Lang, value: string) => {
  const prefix = clean(localePrefix(lang))
  const path = clean(value)
  return prefix && (path === prefix || path.startsWith(`${prefix}/`)) ? path.slice(prefix.length).replace(/^\//u, '') : path
}

export function configuredSidebarFor(entries: ContentEntry[], lang: Lang, selector: string, config: any = siteConfig) {
  type SidebarValue = 'auto' | SidebarItem[] | { items: 'auto' | SidebarItem[], prefix?: string }
  type SidebarConfig = false | 'auto' | SidebarItem[] | Record<string, SidebarValue>
  const localeConfig = config.locales?.[lang] ?? {}
  const configured = (localeConfig.sidebar ?? config.sidebar) as SidebarConfig | undefined
  if (!configured) return undefined

  let key = (localeConfig.path ?? localePath(lang)) as string
  let value: SidebarValue
  if (typeof configured === 'object' && !Array.isArray(configured)) {
    const path = localizedPath(lang, selector)
    const match = Object.keys(configured)
      .map(raw => ({ raw, path: localizedPath(lang, raw) }))
      .filter(item => path.startsWith(item.path))
      .sort((left, right) => right.path.length - left.path.length)[0]
    if (!match) return undefined
    key = match.path
    value = configured[match.raw]
  }
  else value = configured

  const option = typeof value === 'object' && !Array.isArray(value) ? value : undefined
  const items: 'auto' | SidebarItem[] = option ? option.items : value as 'auto' | SidebarItem[]
  const prefix = option?.prefix ?? key
  const collection: ResolvedDocCollection = {
    type: 'doc',
    dir: contentDir(lang, prefix),
    key: `${lang}:sidebar:${clean(key)}`,
    title: localeConfig.docsName ?? localeOf(lang).docsName,
    linkPrefix: routePath(key),
    sidebar: items,
    sidebarScrollbar: localeConfig.sidebarScrollbar ?? config.sidebarScrollbar,
  }
  const localeEntries = entries.filter(entry => langOf(entry) === lang)
  return { collection, items: resolveSidebar(localeEntries, lang, collection) }
}

export function sidebarGroups(items: ResolvedSidebarItem[]) {
  const groups: ResolvedSidebarItem[] = []
  let leafGroup = 0
  for (const item of items) {
    if (item.items) {
      leafGroup = groups.push(item)
      continue
    }
    if (!groups[leafGroup]) groups.push({ text: '', items: [] })
    groups[leafGroup].items!.push(item)
  }
  return groups
}

export function flatSidebarLinks(items: ResolvedSidebarItem[], links: SidebarLink[] = []) {
  for (const item of items) {
    if (item.link && !item.separator) links.push({ href: item.link, title: item.text, icon: item.icon })
    if (item.items) flatSidebarLinks(item.items, links)
  }
  return links
}
