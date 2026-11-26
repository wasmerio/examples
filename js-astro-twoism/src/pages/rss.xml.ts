import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { render } from "astro:content";
import { experimental_AstroContainer } from "astro/container";
import mdxRenderer from "@astrojs/mdx/server.js";

import { SITE_DESCRIPTION, SITE_TITLE } from "@/consts";
import { getNotes } from "@/lib/notes";

const container = await experimental_AstroContainer.create();
container.addServerRenderer({ renderer: mdxRenderer, name: 'mdx' });

export const GET: APIRoute = async () => {
  const notes = await getNotes();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: import.meta.env.SITE,
    items: await Promise.all(
      notes.map(async (note) => {
        const { Content } = await render(note);
        const htmlContent = await container.renderToString(Content);

        return {
          link: `notes/${note.id}`,
          title: note.data.title,
          description: note.data.description,
          pubDate: note.data.pubDate,
          content: htmlContent
        };
      })
    ),
  });
};
