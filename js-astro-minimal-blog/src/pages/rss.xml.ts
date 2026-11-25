import type { RSSFeedItem } from '@astrojs/rss'
import type { APIRoute } from 'astro'
import rss from '@astrojs/rss'
import { SITE } from '@constants'
import { sortAsc } from '@utils'
import { getCollection } from 'astro:content'

function generateContent(description: string, link: string) {
	return `<p>${description}</p><div style="margin-top: 50px; font-style: italic;"><strong><a href="${SITE.url}/${link}">Keep reading</a>.</strong></div>`
}

export const GET: APIRoute = async () => {
	const items = (sortAsc(await getCollection('blog'))).map(entry => ({
		title: entry.data.title,
		description: entry.data.description,
		content: generateContent(entry.data.description, entry.data.slug),
		link: `/${entry.data.slug}/`,
		pubDate: entry.data.date,
	} satisfies RSSFeedItem))

	return rss({
		trailingSlash: true,
		title: SITE.titleDefault,
		description: SITE.description,
		site: SITE.url,
		items,
		customData: '<language>en-us</language>',
	})
}
