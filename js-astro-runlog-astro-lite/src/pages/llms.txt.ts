import { getCollection } from 'astro:content';
import { site } from '../data/site';

// llms.txt: a plain-text map of the site for AI assistants and agents.
export async function GET({ site: base }: { site: URL }) {
  const blog = await getCollection('blog');
  const u = (p: string) => new URL(p, base).href;
  const body = [
    `# ${site.name}`, '', `> ${site.description}`, '',
    '## Blog', ...blog.map((b) => `- [${b.data.title}](${u(`/blog/${b.id}`)}): ${b.data.excerpt}`), '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
