import { getCollection } from 'astro:content';
import { entryLocale, localizedEntryPath } from '../../lib/content/entries';

export async function GET() {
  const collections = ['posts', 'pages'] as const;
  const items = [];

  for (const collection of collections) {
    const entries = await getCollection(collection, ({ data }) => !data.draft);
    for (const entry of entries) {
      items.push({
        title: entry.data.title,
        description: entry.data.description || '',
        url: localizedEntryPath(collection, entry),
        lang: entryLocale(entry),
        type: collection,
        tags: 'tags' in entry.data ? entry.data.tags : [],
        date: entry.data.date?.toISOString?.() || '',
        content: (entry.body || '').slice(0, 8000)
      });
    }
  }

  return new Response(JSON.stringify(items), {
    headers: {
      'content-type': 'application/json; charset=utf-8'
    }
  });
}
