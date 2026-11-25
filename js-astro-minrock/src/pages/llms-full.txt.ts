// src/pages/llms-full.txt.ts
// Full markdown context feed for LLMs and RAG systems
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteConfig } from '../config/site';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.toString().replace(/\/$/, '') || siteConfig.siteUrl;

  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const projects = (await getCollection('projects'))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const lines: string[] = [
    `# ${siteConfig.title} — Full Knowledge Context`,
    `> Complete compilation of published technical articles and documentation.`,
    `> Website: ${baseUrl}`,
    '',
    'This document is prepared for LLMs and AI agents requiring full-corpus context in a single request.',
    '',
    '---',
    '',
  ];

  for (const post of posts) {
    const postUrl = `${baseUrl}/blog/${post.id}`;
    const dateFormatted = post.data.pubDate.toISOString().split('T')[0];
    const tagsStr = post.data.tags?.join(', ') || 'N/A';

    lines.push(`## Article: ${post.data.title}`);
    lines.push(`- **URL:** ${postUrl}`);
    lines.push(`- **Date:** ${dateFormatted}`);
    lines.push(`- **Author:** ${siteConfig.author}`);
    lines.push(`- **Tags:** ${tagsStr}`);
    lines.push(`- **Description:** ${post.data.description}`);
    lines.push('');
    lines.push('### Content:');
    lines.push('');
    lines.push(post.body || post.data.description);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  for (const proj of projects) {
    const projUrl = `${baseUrl}/projects/${proj.id}`;
    const dateFormatted = proj.data.date.toISOString().split('T')[0];
    const tagsStr = proj.data.tags?.join(', ') || 'N/A';

    lines.push(`## Project: ${proj.data.title}`);
    lines.push(`- **URL:** ${projUrl}`);
    lines.push(`- **Date:** ${dateFormatted}`);
    lines.push(`- **Category:** ${proj.data.category}`);
    lines.push(`- **Tags:** ${tagsStr}`);
    lines.push(`- **Description:** ${proj.data.description}`);
    if (proj.data.repoUrl) lines.push(`- **Repository:** ${proj.data.repoUrl}`);
    if (proj.data.demoUrl) lines.push(`- **Live Demo:** ${proj.data.demoUrl}`);
    lines.push('');
    lines.push('### Content:');
    lines.push('');
    lines.push(proj.body || proj.data.description);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
