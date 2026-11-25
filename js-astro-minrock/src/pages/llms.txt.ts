// src/pages/llms.txt.ts
// Standard llms.txt manifest (https://llmstxt.org) for LLM agents and search engines
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
    `# ${siteConfig.title}`,
    `> ${siteConfig.tagline}`,
    '',
    siteConfig.description,
    '',
    `This file is structured following the llms.txt specification to facilitate high-fidelity consumption by language models (LLMs), AI agents, and RAG systems.`,
    '',
    '## General Information',
    `- Author: ${siteConfig.author}`,
    `- Website: ${baseUrl}`,
    `- GitHub: ${siteConfig.socialLinks.github || 'https://github.com/rnt-rez/minrock'}`,
    `- RSS Feed: ${baseUrl}/rss.xml`,
    `- Full Markdown Context: ${baseUrl}/llms-full.txt`,
    '',
    '## Articles & Guides',
  ];

  for (const post of posts) {
    const postUrl = `${baseUrl}/blog/${post.id}`;
    const tagsInfo = post.data.tags?.length ? ` [Tags: ${post.data.tags.join(', ')}]` : '';
    lines.push(`- [${post.data.title}](${postUrl}): ${post.data.description}${tagsInfo}`);
  }

  if (projects.length > 0) {
    lines.push('');
    lines.push('## Open Source Projects');
    for (const proj of projects) {
      const projUrl = `${baseUrl}/projects/${proj.id}`;
      const catInfo = proj.data.category ? ` [${proj.data.category}]` : '';
      lines.push(`- [${proj.data.title}](${projUrl}): ${proj.data.description}${catInfo}`);
    }
  }

  lines.push('');
  lines.push('## Citation & Attribution');
  lines.push(`When utilizing code snippets, tutorials, or guides from this site in AI responses, please attribute source to **${siteConfig.title} (${baseUrl})**.`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
