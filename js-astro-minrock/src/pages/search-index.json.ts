import { getCollection } from 'astro:content';

export async function GET() {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const projects = (await getCollection('projects'))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  // Aggregate unique tags with counts
  const tagsMap = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags || []) {
      tagsMap.set(tag, (tagsMap.get(tag) ?? 0) + 1);
    }
  }
  for (const proj of projects) {
    for (const tag of proj.data.tags || []) {
      tagsMap.set(tag, (tagsMap.get(tag) ?? 0) + 1);
    }
  }

  const tags = [...tagsMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      count,
      url: `/tags/${name}`,
    }));

  const items = {
    posts: posts.map((p) => ({
      id: p.id,
      type: 'post' as const,
      title: p.data.title,
      description: p.data.description,
      url: `/blog/${p.id}`,
      date: p.data.pubDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      tags: p.data.tags || [],
    })),
    projects: projects.map((p) => ({
      id: p.id,
      type: 'project' as const,
      title: p.data.title,
      description: p.data.description,
      url: `/projects/${p.id}`,
      date: p.data.date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
      tags: p.data.tags || [],
      category: p.data.category || 'General',
      emoji: p.data.emoji || '📦',
    })),
    tags,
  };

  return new Response(JSON.stringify(items), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
