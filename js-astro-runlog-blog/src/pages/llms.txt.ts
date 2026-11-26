import { getCollection } from 'astro:content';
import { site, basePath } from '../config';

// llms.txt: a plain-text map of the site for AI assistants and agents.
export async function GET({ site: base }: { site: URL }) {
  const posts = await getCollection('posts');
  const siteOrigin = base ? base.origin : 'https://dxer.github.io';
  const siteRoot = `${siteOrigin}${basePath}`;
  const body = [
    `# ${site.name}`, '', `> ${site.description}`, '',
    '## Posts', ...posts.map((b) => `- [${b.data.title}](${siteRoot}/posts/${b.id}): ${b.data.excerpt}`), '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
