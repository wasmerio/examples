import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { render } from 'astro:content'

import { config } from '@/site-config'
import { withBase } from '@/utils'
import { feedContent } from '@/utils/rss-content'
import { getBlogCollection, postUrl, sortMDByDate } from '@/utils/server'

export async function GET(context: APIContext) {
  const posts = sortMDByDate(await getBlogCollection())
  const site = new URL(withBase('/'), context.site ?? context.url)
  const container = await AstroContainer.create({ astroConfig: { site: site.href } })
  const items = []
  for (const post of posts) {
    const article = new URL(postUrl(post.id) + '/', site)
    const { Content } = await render(post)
    const html = await container.renderToString(Content, { request: new Request(article) })
    items.push({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: article.href,
      categories: post.data.tags,
      content: feedContent(html, article, site)
    })
  }

  return rss({
    title: config.site.title,
    description: config.site.description,
    site,
    items,
    customData: `<language>${config.site.lang}</language>`
  })
}
