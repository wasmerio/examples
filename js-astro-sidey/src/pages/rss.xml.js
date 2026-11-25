import rss from "@astrojs/rss"

import { getWritings } from "@utils/getContent"
import { config } from "@parseConfig"

export async function GET(context) {
  const writings = await getWritings()

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: context.site,
    items: writings.map((writing) => ({
      title: writing.data.title,
      description: writing.data.description,
      link: writing.id,
      pubDate: writing.data.date,
    })),
    customData: `<language>${config.site.locale}</language>`,
  })
}
