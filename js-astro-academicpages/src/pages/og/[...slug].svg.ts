import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { siteConfig } from '@data/siteConfig';
import { resolveThemes } from '@data/themes';
import { formatDate } from '@utils/date';
import { buildCollectionPaths, getFileSlug } from '@utils/url';

interface OgItem {
  title: string;
  category?: string;
  date?: Date;
  venue?: string;
}

export async function getStaticPaths() {
  const [blog, publications, talks, teaching, portfolio, pages] =
    await Promise.all([
      getCollection('blog', ({ data }) => !data.draft),
      getCollection('publications'),
      getCollection('talks'),
      getCollection('teaching'),
      getCollection('portfolio'),
      getCollection('pages'),
    ]);

  const items: { params: { slug: string }; props: { item: OgItem } }[] = [];

  const staticRoutes: { slug: string; title: string; category: string }[] = [
    {
      slug: 'default',
      title: siteConfig.title,
      category: 'Academic Portfolio',
    },
    {
      slug: 'publications',
      title: 'Publications',
      category: 'Academic Portfolio',
    },
    {
      slug: 'talks',
      title: 'Talks and Presentations',
      category: 'Academic Portfolio',
    },
    { slug: 'teaching', title: 'Teaching', category: 'Academic Portfolio' },
    { slug: 'portfolio', title: 'Portfolio', category: 'Academic Portfolio' },
    { slug: 'posts', title: 'Blog Posts', category: 'Academic Portfolio' },
    { slug: 'cv', title: 'CV', category: 'Curriculum Vitae' },
    { slug: 'sitemap', title: 'Sitemap', category: 'Page' },
    { slug: '404', title: 'Page Not Found', category: 'Page' },
  ];

  for (const route of staticRoutes) {
    items.push({
      params: { slug: route.slug },
      props: {
        item: {
          title: route.title,
          category: route.category,
          venue: siteConfig.author.name,
        },
      },
    });
  }

  for (const { slug, item: post } of buildCollectionPaths('posts', blog)) {
    items.push({
      params: { slug: `posts/${slug}` },
      props: {
        item: {
          title: post.data.title,
          category: 'Blog Post',
          date: post.data.date,
        },
      },
    });
  }

  for (const { slug, item: pub } of buildCollectionPaths(
    'publications',
    publications
  )) {
    items.push({
      params: { slug: `publications/${slug}` },
      props: {
        item: {
          title: pub.data.title,
          category: pub.data.category || 'Publication',
          date: pub.data.date,
          venue: pub.data.venue,
        },
      },
    });
  }

  for (const { slug, item: talk } of buildCollectionPaths('talks', talks)) {
    items.push({
      params: { slug: `talks/${slug}` },
      props: {
        item: {
          title: talk.data.title,
          category: talk.data.type || 'Talk',
          date: talk.data.date,
          venue: talk.data.venue,
        },
      },
    });
  }

  for (const { slug, item: course } of buildCollectionPaths(
    'teaching',
    teaching
  )) {
    items.push({
      params: { slug: `teaching/${slug}` },
      props: {
        item: {
          title: course.data.title,
          category: course.data.type || 'Teaching',
          venue: course.data.venue,
        },
      },
    });
  }

  for (const { slug, item: project } of buildCollectionPaths(
    'portfolio',
    portfolio
  )) {
    items.push({
      params: { slug: `portfolio/${slug}` },
      props: {
        item: {
          title: project.data.title,
          category: 'Project',
          date: project.data.date,
          venue: project.data.venue,
        },
      },
    });
  }

  for (const page of pages) {
    const pageSlug = getFileSlug(page.id);
    if (pageSlug !== 'about') {
      items.push({
        params: { slug: pageSlug },
        props: {
          item: {
            title: page.data.title,
            category: 'Page',
            venue: siteConfig.author.name,
          },
        },
      });
    }
    items.push({
      params: { slug: `pages/${pageSlug}` },
      props: { item: { title: page.data.title, category: 'Page' } },
    });
  }

  return items;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine)
      currentLine = (currentLine + ' ' + word).trim();
    else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines.slice(0, 3);
}

export const GET: APIRoute = async ({ props }) => {
  const item = (props as { item: OgItem }).item;
  const lines = wrapText(item.title, 42);
  const formattedDate = item.date ? formatDate(item.date) : '';
  const subtitle = [item.venue, formattedDate].filter(Boolean).join(' • ');

  const titleTspans = lines
    .map(
      (line, i) =>
        `<tspan x="80" dy="${i === 0 ? '0' : '1.25em'}">${escapeXml(line)}</tspan>`
    )
    .join('');

  const { light, dark } = resolveThemes(siteConfig.theme);

  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${dark.bg}"/>
      <stop offset="100%" stop-color="${dark.surface}"/>
    </linearGradient>
    <linearGradient id="brand-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${dark.base}"/>
      <stop offset="100%" stop-color="${light.base}"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg-grad)"/>

  <rect x="0" y="0" width="1200" height="8" fill="url(#brand-grad)"/>

  <circle cx="1080" cy="120" r="300" fill="${dark.base}" opacity="0.08" filter="blur(80px)"/>
  <circle cx="100" cy="530" r="250" fill="${light.base}" opacity="0.06" filter="blur(60px)"/>

  ${
    item.category
      ? `
  <rect x="80" y="80" width="${item.category.length * 12 + 32}" height="36" rx="18" fill="${light.base}" opacity="0.25"/>
  <text x="96" y="103" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="${dark.base}" letter-spacing="0.05em">${escapeXml(item.category.toUpperCase())}</text>
  `
      : ''
  }

  <text x="80" y="220" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="800" fill="${dark.text}" letter-spacing="-0.02em">
    ${titleTspans}
  </text>

  ${
    subtitle
      ? `
  <text x="80" y="440" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="500" fill="${dark.textLight}">
    ${escapeXml(subtitle)}
  </text>
  `
      : ''
  }

  <line x1="80" y1="480" x2="1120" y2="480" stroke="${dark.textLight}" stroke-opacity="0.25" stroke-width="1"/>

  <text x="80" y="540" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700" fill="${dark.text}">
    ${escapeXml(siteConfig.author.name)}
  </text>
  <text x="80" y="568" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="400" fill="${dark.textLight}">
    ${escapeXml(siteConfig.title)}
  </text>
</svg>
  `.trim();

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
