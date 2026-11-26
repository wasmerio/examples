import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../lib/config';

export const GET: APIRoute = async () => {
  const [posts, docs] = await Promise.all([
    getCollection('posts', ({ data }: any) => !data.draft),
    getCollection('docs'),
  ]);
  const url = String((site as any).url ?? '').replace(/\/$/, '');
  const line = (p: string, t: string, d?: string) => `- [${t}](${url}${p})${d ? `: ${d}` : ''}`;
  const body = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    'Static editorial Astro theme. Pages are plain HTML; everything below is public.',
    '',
    '## Core pages',
    line('/', 'Home'),
    line('/posts/', 'Posts'),
    line('/docs/', 'Documentation'),
    line('/about/', 'About'),
    line('/log/', 'Ship log'),
    '',
    '## Documentation',
    ...docs.map((d: any) => line(`/docs/${String(d.id).replace(/^docs\//, '').replace(/\.md$/, '')}/`, d.data.title)),
    '',
    '## Writing',
    ...posts.map((p: any) => line(`/posts/${String(p.id).replace(/^posts\//, '').replace(/\.md$/, '')}/`, p.data.title, p.data.description)),
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
