import type { ContentEntry, Lang } from './content'
import { isPost, langOf, routeOf, sectionOf } from './content'
import modifiedTimes from '../data/modified-times.json'
import { socialLinksFor } from './social'
import { siteConfig } from '../../site.config.mjs'
import { localeOf, localePath } from './locales'
import { withBase } from './client-utils'

export const hostname = import.meta.env.SITE || siteConfig.origin

export const siteLocale = (lang: Lang) => localeOf(lang)
export const absoluteUrl = (route: string) => new URL(withBase(route, import.meta.env.BASE_URL), hostname).toString()

export const modifiedTimeOf = (entry: ContentEntry) => modifiedTimes[routeOf(entry) as keyof typeof modifiedTimes]
  ?? iso(entry.data.updateTime ?? entry.data.createTime ?? entry.data.date)

export const publishedTimeOf = (entry: ContentEntry) => iso(entry.data.createTime ?? entry.data.date ?? entry.data.time)

export const iso = (value: unknown) => {
  if (!value) return undefined
  const date = value instanceof Date ? value : new Date(String(value).replaceAll('/', '-'))
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

export const imagesOf = (entry?: ContentEntry) => entry
  ? [...(entry.body ?? '').matchAll(/(?:!\[[^\]]*\]\(|<img\s+[^>]*src=["'])([^\s)"']+)/g)]
      .map(match => match[1])
      .filter(url => url.startsWith('/') || /^https?:\/\//u.test(url))
      .map(url => url.startsWith('/') ? absoluteUrl(url) : url)
  : []

export const authorsOf = (value: unknown, fallback: unknown = '') => {
  const source = value || fallback
  const authors = (Array.isArray(source) ? source : source ? [source] : []) as Array<string | { name?: string, url?: string, email?: string }>
  return authors.map(author => typeof author === 'string' ? { name: author } : author).filter(author => author.name)
}

const siteData = (lang: Lang, url = absoluteUrl) => {
  const page = localeOf(lang)
  const home = localePath(lang)
  const logo = page.logo ?? siteConfig.logo
  const authorId = `${url(`${home}about/`)}#person`
  const websiteId = `${url(home)}#website`
  const site = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: url(home),
        name: page.siteName,
        description: page.description,
        inLanguage: lang,
        publisher: { '@id': authorId },
      },
      {
        '@type': 'Person',
        '@id': authorId,
        name: page.authorName,
        url: url(`${home}about/`),
        ...(typeof logo === 'string' && logo ? { image: url(logo) } : {}),
        description: page.authorDescription,
        sameAs: socialLinksFor(lang).map(({ link }) => link).filter(link => /^https?:\/\//.test(link)),
      },
    ],
  }

  return { page, authorId, websiteId, site }
}

export const structuredPageData = (title: string, description: string, lang: Lang, route: string, entry?: ContentEntry, articleOverride?: boolean, defaultAuthor?: unknown, hostnameOverride?: string, pageBreadcrumbs?: Array<{ text: string, href?: string }>) => {
  const url = hostnameOverride ? (path: string) => new URL(withBase(path, import.meta.env.BASE_URL), hostnameOverride).toString() : absoluteUrl
  const { page, authorId, websiteId, site } = siteData(lang, url)
  const post = entry ? isPost(entry) : false
  const home = localePath(lang)
  const fallbackBreadcrumbs = [
    { text: page.homeText, href: home },
    ...(post ? [{ text: page.postsText, href: `${home}blog/` }] : []),
    { text: title, href: route },
  ]
  const items = (pageBreadcrumbs?.length ? pageBreadcrumbs : fallbackBreadcrumbs).map(({ text, href }, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: text,
    ...(href ? { item: url(href) } : {}),
  }))

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }

  const images = imagesOf(entry)
  const cover = entry?.data.banner ?? entry?.data.cover
  const articleImages = cover ? [cover.startsWith('/') ? url(cover) : cover] : images
  const logo = page.logo ?? siteConfig.logo
  const authors = authorsOf(entry?.data.author, defaultAuthor ?? page.authorName)
  const article = entry && (articleOverride ?? post) ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    image: articleImages.length ? articleImages : typeof logo === 'string' && logo ? [url(logo)] : [],
    datePublished: publishedTimeOf(entry),
    dateModified: modifiedTimeOf(entry),
    author: authors.map(author => ({ '@type': 'Person', ...author })),
    '@id': `${url(route)}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url(route) },
    inLanguage: lang,
    articleSection: sectionOf(entry) || (post ? page.postsText : page.docsName ?? 'Docs'),
    keywords: entry.data.tags.join(', '),
    publisher: { '@id': authorId },
    isPartOf: { '@id': websiteId },
  } : null

  const webPage = { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description }
  return article ? [article, site, breadcrumb] : entry ? [webPage, site, breadcrumb] : [site, breadcrumb]
}

export const structuredData = (entry: ContentEntry) => structuredPageData(
  entry.data.title,
  entry.data.description,
  langOf(entry),
  routeOf(entry),
  entry,
)
