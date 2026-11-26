import { getCollection } from 'astro:content'
import type { APIRoute, GetStaticPaths } from 'astro'
import { isPost, langOf, routeOf, type Lang } from '../lib/content'
import { siteLocale } from '../lib/seo'
import { localeOf, localePath, localePrefix } from '../lib/locales'
import { siteConfig } from '../../site.config.mjs'
import { withBase } from '../lib/client-utils'
import { llmsMarkdown, llmsPageOf, llmstxtEnabled, llmstxtEntryEnabled, llmstxtLanguages, llmstxtOptions } from '../lib/raw-markdown'

const paths = llmstxtLanguages().flatMap(lang => {
  const prefix = localePrefix(lang).replace(/^\//u, '')
  return [
    ...(llmstxtEnabled('toc') ? [{ route: [prefix, 'llms'].filter(Boolean).join('/'), lang, full: false }] : []),
    ...(llmstxtEnabled('full') ? [{ route: [prefix, 'llms-full'].filter(Boolean).join('/'), lang, full: true }] : []),
  ]
})

export const getStaticPaths = (() => paths.map(page => ({ params: { llms: page.route }, props: page }))) satisfies GetStaticPaths

const outputUrl = (route: string, extension: '.html' | '.md', domain = '') => {
  const pathname = extension === '.html'
    ? withBase(route, import.meta.env.BASE_URL)
    : withBase(`${route}${route.endsWith('/') ? '' : '/'}index.md`, import.meta.env.BASE_URL)
  return domain ? new URL(pathname, domain).toString() : pathname
}

const expandTemplate = (template: string, variables: Record<string, string>) => template.replace(/\{(\w+)\}/gu, (_match, name: string) => variables[name] ?? '')

export const GET: APIRoute = async ({ props }) => {
  const { lang, full } = props as { lang: Lang, full: boolean }
  const options = llmstxtOptions() || {}
  const en = !lang.startsWith('zh')
  const entries = (await getCollection('content'))
    .filter(entry => langOf(entry) === lang && llmstxtEntryEnabled(entry))
    .sort((a, b) => routeOf(a).localeCompare(routeOf(b)))
  const { siteName, description: siteDescription } = siteLocale(lang)
  const linkExtension = options.linkExtension ?? '.md'
  const tocLink = (route: string) => outputUrl(route, linkExtension, options.domain)
  const alternates = siteConfig.multilingual === false ? '' : llmstxtLanguages().filter(item => item !== lang).map(item => `- [${localeOf(item).selectLanguageName}](${options.domain ? new URL(withBase(`${localePrefix(item)}/llms.txt`, import.meta.env.BASE_URL), options.domain).toString() : withBase(`${localePrefix(item)}/llms.txt`, import.meta.env.BASE_URL)})`).join('\n')
  const pages = entries.map(entry => ({ ...llmsPageOf(entry), markdown: llmsMarkdown(entry), excerpt: entry.data.description }))
  const body = full
    ? entries.map((entry, index) => `---\nurl: ${tocLink(routeOf(entry))}\ndescription: ${entry.data.description.replaceAll('\n', ' ')}\n---\n# ${entry.data.title}\n\n${pages[index].markdown?.trim() ?? ''}\n`).join('\n')
    : [
        ['Pages', entries.filter(entry => !isPost(entry))],
        [en ? 'Blog' : '博客', entries.filter(isPost)],
      ].map(([label, items]) => `### ${label}\n\n${(items as typeof entries).map(entry => `- [${entry.data.title}](${tocLink(routeOf(entry))}): ${entry.data.description}`).join('\n')}`).join('\n\n')
  const state = { base: import.meta.env.BASE_URL, domain: options.domain, linkExtension, currentLocale: localePath(lang), siteLocale: siteLocale(lang), allLocales: options.locale === 'all' }
  const defaults = {
    title: siteName,
    description: `> ${siteDescription}`,
    alternateLinks: alternates ? `## Alternate Language Versions\n\n${alternates}\n\n` : '',
    details: en ? 'This file contains links to all documentation sections.' : '此文件包含所有文档分区的链接。',
    toc: body,
  }
  const variables = Object.fromEntries(Object.entries({ ...defaults, ...options.llmsTxtTemplateGetter }).map(([name, value]) => [name, typeof value === 'function' ? value(pages, state) : String(value)])) as Record<string, string>
  const template = options.llmsTxtTemplate ?? '# {title}\n\n{description}\n\n{alternateLinks}{details}\n\n## Table of Contents\n\n{toc}'
  return new Response(`${full ? body : expandTemplate(template, variables)}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
