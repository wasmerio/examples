import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { getCollection, render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import mdxRenderer from "@astrojs/mdx/server.js";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../consts";
import { getDescription, getPostUrl, isPublished } from "../lib/content";

export const GET = (async (context) => {
  const posts = (await getCollection("blog"))
    .filter(isPublished)
    .sort((b, a) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());

  const site = context.site ?? SITE_URL;
  const container = await AstroContainer.create();
  container.addServerRenderer({ name: "astro:jsx", renderer: mdxRenderer });

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site,
    trailingSlash: true,
    items: await Promise.all(
      posts.map(async (post) => {
        const { Content } = await render(post);

        return {
          title: post.data.title,
          description: getDescription(post),
          pubDate: post.data.pubDate,
          categories: post.data.tags,
          content: await container.renderToString(Content, {
            request: new Request(new URL(getPostUrl(post), site)),
          }),
          link: getPostUrl(post),
        };
      }),
    ),
  });
}) satisfies APIRoute;
