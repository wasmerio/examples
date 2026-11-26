import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { navigation } from '@data/navigation';
import { siteConfig } from '@data/siteConfig';
import { sortByDateDesc, sortTeaching } from '@utils/date';
import {
  getPortfolioUrl,
  getPostUrl,
  getPublicationUrl,
  getTalkUrl,
  getTeachingUrl,
  resolveExternalUrl,
  resolveUrl,
} from '@utils/url';

// Default descriptive summaries for standard navigation sections
const navDescriptions: Record<string, string> = {
  '/': 'Homepage, research bio, and academic overview',
  '/publications/':
    'Peer-reviewed research papers, conference proceedings, and preprints',
  '/talks/': 'Invited talks, conference presentations, and academic workshops',
  '/teaching/': 'University courses, syllabus outlines, and teaching materials',
  '/portfolio/': 'Open-source software projects, datasets, and research tools',
  '/posts/': 'Academic blog posts, research notes, and announcements',
  '/cv/':
    'Academic curriculum vitae covering education, appointments, and awards',
};

export const GET: APIRoute = async ({ site }) => {
  const origin = site ? site.origin : siteConfig.url.replace(/\/+$/, '');

  const lines: string[] = [
    `# ${siteConfig.title}`,
    '',
    `> ${siteConfig.description}`,
    '',
    `Author: ${siteConfig.author.name}`,
  ];

  if (siteConfig.author.bio) lines.push(`Bio: ${siteConfig.author.bio}`);

  if (siteConfig.author.location)
    lines.push(`Location: ${siteConfig.author.location}`);

  if (siteConfig.author.employer)
    lines.push(`Affiliation: ${siteConfig.author.employer}`);

  lines.push('', '## Core Pages', '');
  lines.push(`- [Home](${origin}${resolveUrl('/')}): ${navDescriptions['/']}`);

  for (const item of navigation) {
    if (item.url === '/' || item.url === '') continue;
    const desc = navDescriptions[item.url] || `${item.title} section`;
    lines.push(`- [${item.title}](${origin}${resolveUrl(item.url)}): ${desc}`);
  }

  const publications = await getCollection('publications');
  if (publications.length > 0) {
    lines.push('', '## Publications', '');
    const sorted = sortByDateDesc(publications).slice(0, 10);
    for (const pub of sorted) {
      const url = `${origin}${getPublicationUrl(pub)}`;
      const year = new Date(pub.data.date).getFullYear();
      const venue = pub.data.venue ? `${pub.data.venue}, ` : '';
      lines.push(`- [${pub.data.title}](${url}): ${venue}${year}`);
    }
  }

  const talks = await getCollection('talks');
  if (talks.length > 0) {
    lines.push('', '## Talks & Presentations', '');
    const sorted = sortByDateDesc(talks).slice(0, 10);
    for (const talk of sorted) {
      const url = `${origin}${getTalkUrl(talk)}`;
      const year = new Date(talk.data.date).getFullYear();
      const venue = talk.data.venue ? `${talk.data.venue}, ` : '';
      lines.push(`- [${talk.data.title}](${url}): ${venue}${year}`);
    }
  }

  const teaching = await getCollection('teaching');
  if (teaching.length > 0) {
    lines.push('', '## Teaching & Courses', '');
    const sorted = sortTeaching(teaching).slice(0, 10);
    for (const course of sorted) {
      const url = `${origin}${getTeachingUrl(course)}`;
      const type = course.data.type ? `${course.data.type}, ` : '';
      const venue = course.data.venue || '';
      lines.push(`- [${course.data.title}](${url}): ${type}${venue}`);
    }
  }

  const portfolio = await getCollection('portfolio');
  if (portfolio.length > 0) {
    lines.push('', '## Portfolio & Projects', '');
    const sorted = sortByDateDesc(portfolio).slice(0, 10);
    for (const project of sorted) {
      const url = `${origin}${getPortfolioUrl(project)}`;
      const desc = project.data.description || '';
      lines.push(`- [${project.data.title}](${url}): ${desc}`);
    }
  }

  const posts = await getCollection('blog', ({ data }) => !data.draft);
  if (posts.length > 0) {
    lines.push('', '## Blog Posts', '');
    const sorted = sortByDateDesc(posts).slice(0, 10);
    for (const post of sorted) {
      const url = `${origin}${getPostUrl(post)}`;
      const year = new Date(post.data.date).getFullYear();
      lines.push(`- [${post.data.title}](${url}): Published ${year}`);
    }
  }

  // Optional section per llmstxt.org specification
  lines.push('', '## Optional', '');
  lines.push(
    `- [Sitemap](${origin}${resolveUrl('/sitemap/')}): Full site index`
  );
  lines.push(
    `- [RSS Feed](${origin}${resolveUrl('/rss.xml')}): RSS publication and article feed`
  );

  if (siteConfig.author.googlescholar) {
    lines.push(
      `- [Google Scholar](${resolveExternalUrl(
        siteConfig.author.googlescholar,
        'https://scholar.google.com/citations?user='
      )}): Author citation index`
    );
  }
  if (siteConfig.author.orcid) {
    lines.push(
      `- [ORCID](${resolveExternalUrl(
        siteConfig.author.orcid,
        'https://orcid.org/'
      )}): Verified author identity record`
    );
  }
  if (siteConfig.author.github) {
    lines.push(
      `- [GitHub](${resolveExternalUrl(
        siteConfig.author.github,
        'https://github.com/'
      )}): Open-source repositories and code`
    );
  }
  if (siteConfig.author.linkedin) {
    lines.push(
      `- [LinkedIn](${resolveExternalUrl(
        siteConfig.author.linkedin,
        'https://www.linkedin.com/in/'
      )}): Professional academic profile`
    );
  }

  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
