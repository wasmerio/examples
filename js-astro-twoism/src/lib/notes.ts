import { getCollection } from 'astro:content';

async function getNotes() {
  // Drafts are only visible in dev
  const notes = await getCollection('notes', ({ data }) => data.published || import.meta.env.DEV);

  // Newest first
  return notes.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export { getNotes };
