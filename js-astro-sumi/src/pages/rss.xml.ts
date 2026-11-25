import rss from "@astrojs/rss";
import type { APIRoute } from "astro";

import { AUTHOR, SITE } from "../config";
import { getPublishedPosts } from "../utils/posts";

export const GET: APIRoute = async (context) => {
  const posts = await getPublishedPosts();

  return rss({
    title: SITE.title,
    description: SITE.description,
    // Guaranteed by `site` in astro.config.ts.
    site: context.site!,
    // RSS 2.0 reserves <author> for an email address, so the byline goes in
    // Dublin Core instead. Feed readers understand both.
    xmlns: { dc: "http://purl.org/dc/elements/1.1/" },
    items: posts.map((post) => ({
      title: post.data.title,
      // Summaries only. Rendering MDX bodies into the feed needs the container
      // API and pulls the whole component runtime into the build.
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
      customData: `<dc:creator><![CDATA[${AUTHOR.name}]]></dc:creator>`,
    })),
    customData: `<language>${SITE.lang}</language>`,
  });
};
