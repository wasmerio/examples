import rss, { type RSSFeedItem } from "@astrojs/rss";
import { getContainerRenderer as mdxRenderer } from "@astrojs/mdx";
import type { APIContext } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { render } from "astro:content";
import { config } from "@/config";
import { getPosts, postUrl } from "@/utils/posts";

function absolute(html: string, site: URL): string {
  return html.replace(/(src|href)="\/(?!\/)/g, `$1="${site.origin}/`);
}

export async function GET(context: APIContext) {
  const site = context.site ?? new URL(config.url);
  const renderers = await loadRenderers([mdxRenderer()]);
  const container = await AstroContainer.create({ renderers });
  const posts = await getPosts();
  const items: RSSFeedItem[] = [];

  for (const post of posts) {
    const { Content } = await render(post);
    const html = await container.renderToString(Content);
    items.push({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postUrl(post),
      categories: post.data.tags,
      content: absolute(html, site),
    });
  }

  return rss({
    title: config.title,
    description: config.description,
    site,
    items,
    customData: `<language>${config.lang}</language>`,
  });
}
