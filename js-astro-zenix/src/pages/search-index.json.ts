import { getCollection } from 'astro:content';

export async function GET() {
  const blog = await getCollection('blog');
  const changelog = await getCollection('changelog');

  const searchIndex = [
    ...blog.map(post => ({
      title: post.data.title,
      description: post.data.description,
      slug: `/blog/${post.id}`,
      type: 'Blog Post'
    })),
    ...changelog.map(entry => ({
      title: `${entry.data.version}: ${entry.data.title}`,
      description: 'Product update and changelog entry.',
      slug: '/changelog',
      type: 'Changelog'
    }))
  ];

  return new Response(JSON.stringify(searchIndex), {
    headers: { 'Content-Type': 'application/json' }
  });
}
