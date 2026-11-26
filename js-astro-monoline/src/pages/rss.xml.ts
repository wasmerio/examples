import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { site } from '../config';
import { getNotes, notePath } from '../lib/notes';

export const GET: APIRoute = async (context) =>
  rss({
    title: site.name,
    description: site.description,
    site: context.site ?? site.url,
    items: (await getNotes()).map((note) => ({
      title: note.data.title,
      pubDate: note.data.date,
      description: note.summary,
      link: notePath(note),
      categories: note.data.tags,
    })),
    customData: `<language>${site.locale}</language>`,
  });
