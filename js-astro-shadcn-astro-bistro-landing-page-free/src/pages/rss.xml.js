import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { SITE_TITLE, SITE_DESCRIPTION } from '@/consts'

export async function GET(context) {
  let posts = []

  try {
    posts = await getCollection('blog')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Collection is empty or doesn't exist
    console.log('No blog posts found, generating empty RSS feed')
  }

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.data.slug}/`,
      author: post.data.author,
      categories: post.data.tags || []
    })),
    customData: `<language>en-us</language>`,
    stylesheet: '/rss-styles.xsl'
  })
}
