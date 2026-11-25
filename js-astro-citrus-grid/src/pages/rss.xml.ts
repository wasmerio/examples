import { render } from 'astro:content'
import mdxRenderer from '@astrojs/mdx/server.js'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { defaultLang } from '@/i18n/ui'
import { renderMarkdownHtml } from '@/lib/md/pipeline'
import { siteConfig } from '@/lib/mergedSiteConfig'
import { getPublishedPosts, type Post } from '@/lib/posts'

let mdxContainer: AstroContainer | null = null

async function getMdxContainer(): Promise<AstroContainer> {
  if (!mdxContainer) {
    const container = await AstroContainer.create()
    container.addServerRenderer({ name: 'astro:jsx', renderer: mdxRenderer })
    mdxContainer = container
  }
  return mdxContainer
}

async function renderContent(post: Post, site: string): Promise<string> {
  if (/\.mdx$/i.test(post.filePath ?? '')) {
    try {
      const { Content } = await render(post)
      const container = await getMdxContainer()
      return await container.renderToString(Content)
    } catch (err) {
      console.warn(`[rss] MDX 渲染失败，回退为源码直出：${post.id}`, err)
    }
  }
  return renderMarkdownHtml(post.body ?? '', { filePath: post.filePath, site })
}

function absolutize(html: string, post: Post, site: string): string {
  const base = `${site.replace(/\/+$/, '')}/posts/${post.id}/`
  return html.replace(/\b(src|href)="([^"]*)"/g, (match, attr: string, url: string) => {
    if (!url || /^(?:https?:|data:|#|mailto:|\/\/)/i.test(url)) return match
    try {
      return `${attr}="${new URL(url, base).href}"`
    } catch {
      return match
    }
  })
}

const XML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
}

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => XML_ESCAPES[ch])
}

function cdata(html: string): string {
  return `<![CDATA[${html.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
}

function itemXml(post: Post, content: string, site: string): string {
  const link = `${site.replace(/\/+$/, '')}/posts/${post.id}/`
  const categories = [post.data.category, ...post.data.tags]
  return [
    '<item>',
    `<title>${escapeXml(post.data.title)}</title>`,
    `<link>${escapeXml(link)}</link>`,
    `<guid isPermaLink="true">${escapeXml(link)}</guid>`,
    `<description>${escapeXml(post.data.description)}</description>`,
    `<pubDate>${post.data.published.toUTCString()}</pubDate>`,
    ...categories.map((name) => `<category>${escapeXml(name)}</category>`),
    `<content:encoded>${cdata(content)}</content:encoded>`,
    '</item>',
  ].join('')
}

export async function GET() {
  const posts = await getPublishedPosts()
  const site = siteConfig.url
  const items = await Promise.all(
    posts.map(async (post) => {
      const html = absolutize(await renderContent(post, site), post, site)
      return itemXml(post, html, site)
    }),
  )
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    '<channel>',
    `<title>${escapeXml(siteConfig.title)}</title>`,
    `<description>${escapeXml(siteConfig.description)}</description>`,
    `<link>${escapeXml(site)}</link>`,
    `<language>${escapeXml(defaultLang)}</language>`,
    ...items,
    '</channel>',
    '</rss>',
  ].join('')
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
