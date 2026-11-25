import { getPublishedWriting, writingPath } from '../lib/content';

export async function GET() {
  const entries = await getPublishedWriting();
  return new Response(JSON.stringify(entries.map((entry) => ({
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    tags: entry.data.tags,
    locale: entry.data.locale,
    url: writingPath(entry),
    text: entry.body ?? '',
  }))), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
