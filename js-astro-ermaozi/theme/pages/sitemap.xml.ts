import { getCollection } from 'astro:content'
import type { APIRoute } from 'astro'
import { langOf, routeOf, translationsOf } from '../lib/content'
import { modifiedTimeOf } from '../lib/seo'
import { configuredLanguages } from '../lib/locales'
import { postCollectionsFor } from '../lib/collections'
import { siteConfig } from '../../site.config.mjs'
import { withBase } from '../lib/client-utils'
import { sitemapOptions, sitemapOutputNames } from '../lib/sitemap-options.mjs'
import { hasRobotsDirective, type HeadItem } from '../lib/head'
import type { SitemapOptions, SitemapPage } from '../config-types'

const xml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const node = (name: string, value: unknown) => value === undefined || value === null || value === '' ? '' : `<${name}>${xml(String(value instanceof Date ? value.toISOString() : value))}</${name}>`
const options = sitemapOptions(siteConfig) as SitemapOptions | false
const outputNames = sitemapOutputNames(siteConfig)
const hostname = import.meta.env.DEV && options && options.devHostname ? options.devHostname : options && options.hostname || import.meta.env.SITE || siteConfig.origin
const sitemapUrl = (route: string) => new URL(withBase(route, import.meta.env.BASE_URL), hostname).toString()
const assetUrl = (value: string) => /^https?:\/\//u.test(value) ? value : sitemapUrl(value)

const imageNodes = (items: any[] = []) => items.map(item => `<image:image>${node('image:loc', assetUrl(item.url))}${node('image:caption', item.caption)}${node('image:title', item.title)}${node('image:geo_location', item.geoLocation)}${node('image:license', item.license)}</image:image>`).join('')
const videoNodes = (items: any[] = []) => items.map(item => `<video:video>${Object.entries(item).filter(([key]) => key !== 'id').map(([key, value]) => key === 'player_loc:autoplay'
  ? ''
  : Array.isArray(value)
    ? value.map(part => node(`video:${key}`, part)).join('')
    : node(`video:${key}`, value)).join('')}</video:video>`).join('')
const newsNodes = (items: any[] = []) => items.map(item => {
  const publication = item.publication ?? {}
  return `<news:news>${node('news:access', item.access)}<news:publication>${node('news:name', publication.name)}${node('news:language', publication.language)}</news:publication>${['genres', 'publication_date', 'title', 'keywords', 'stock_tickers'].map(key => node(`news:${key}`, item[key] ?? publication[key])).join('')}</news:news>`
}).join('')

export const GET: APIRoute = async () => {
  if (!options || import.meta.env.DEV && options.devServer !== true) return new Response('Not Found', { status: 404 })
  const excludePaths = options.excludePaths ?? ['/404.html']
  const changefreq = options.changefreq ?? 'daily'
  const entries = (await getCollection('content')).filter(entry => {
    const noindex = hasRobotsDirective((entry.data.head ?? []).filter(Array.isArray) as HeadItem[], 'noindex')
    return entry.data.sitemap !== false && !entry.data.draft && !noindex && !excludePaths.includes(routeOf(entry))
  })
  const urls = entries.map(entry => {
    const route = routeOf(entry)
    const alternates = siteConfig.multilingual === false ? [] : translationsOf(entry, entries)
    const page: SitemapPage = { path: route, pathLocale: route, lang: langOf(entry), filePathRelative: entry.id, frontmatter: entry.data, data: { git: { updatedTime: modifiedTimeOf(entry) } } }
    const modified = entry.data.home ? undefined : options.modifyTimeGetter?.(page, { base: import.meta.env.BASE_URL, siteConfig }) ?? modifiedTimeOf(entry)
    const pageOptions = typeof entry.data.sitemap === 'object' ? entry.data.sitemap : {}
    return `<url><loc>${xml(sitemapUrl(route))}</loc>${modified ? `<lastmod>${xml(modified)}</lastmod>` : ''}${node('changefreq', pageOptions.changefreq ?? changefreq)}${node('priority', pageOptions.priority)}${imageNodes(pageOptions.img)}${videoNodes(pageOptions.video)}${newsNodes(pageOptions.news)}${alternates.map(item => `<xhtml:link rel="alternate" hreflang="${xml(langOf(item))}" href="${xml(sitemapUrl(routeOf(item)))}"/>`).join('')}</url>`
  })
  configuredLanguages().forEach(lang => postCollectionsFor(lang).forEach(collection => [
    collection.postList === false ? '' : collection.link,
    collection.tags === false ? '' : collection.tagsLink,
    collection.categories === false ? '' : collection.categoriesLink,
    collection.archives === false ? '' : collection.archivesLink,
  ].filter(Boolean).filter(route => !excludePaths.includes(route)).forEach(route => urls.push(`<url><loc>${xml(sitemapUrl(route))}</loc><changefreq>${changefreq}</changefreq></url>`))))
  options.extraUrls?.forEach(route => urls.push(`<url><loc>${xml(/^https?:\/\//u.test(route) ? route : sitemapUrl(route))}</loc></url>`))
  const namespaces = options.xmlNameSpace ?? { news: true, video: true, xhtml: true, image: true }
  const namespaceAttributes = [
    namespaces.news && 'xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"',
    namespaces.xhtml && 'xmlns:xhtml="http://www.w3.org/1999/xhtml"',
    namespaces.image && 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"',
    namespaces.video && 'xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"',
    ...(namespaces.custom ?? []).filter(value => /^xmlns:[\w-]+="[^"]+"$/u.test(value)),
  ].filter(Boolean).join(' ')
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="${withBase(`/${outputNames.xsl}`, import.meta.env.BASE_URL)}"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${namespaceAttributes ? ` ${namespaceAttributes}` : ''}>${urls.join('')}</urlset>`
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
