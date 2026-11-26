
import rss from '@astrojs/rss'
import type { APIContext, APIRoute } from 'astro'
import { type CollectionEntry, getCollection } from 'astro:content'

import { SITE } from '@src/consts'
import { filterDrafts } from '@src/utils/blog'

export const GET: APIRoute = async (context: APIContext) => {
	const posts = (await getCollection('blog', filterDrafts)).sort((
    a: CollectionEntry<'blog'>,
    b: CollectionEntry<'blog'>
  ) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())

	return rss({
		title: SITE.TITLE,
		description: SITE.DESCRIPTION,
		site: context.site as URL,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.id}/`,
		})),
	})
}
