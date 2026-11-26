/* The notes feed. Work has no feed: a product is not an entry in a timeline. */
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { categoryOf, excerpt, getNotes, notePath } from '../lib/content';
import { site } from '../config';

export const GET: APIRoute = async (context) => {
  const notes = await getNotes();
  return rss({
    title: site.name,
    description: site.description,
    site: context.site ?? site.url,
    items: notes.map((note) => ({
      title: note.data.title,
      pubDate: note.data.pubDate,
      description: note.data.description ?? excerpt(note.body),
      link: notePath(note.id),
      categories: [categoryOf(note.data.category).name],
    })),
    customData: `<language>${site.locale}</language>`,
  });
};
