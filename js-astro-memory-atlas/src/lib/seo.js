import { getConfiguredBasePath } from '../config/site.js';

export const PUBLIC_ROUTES = [
  { path: '', priority: '1.0' },
  { path: 'journey/', priority: '0.8' },
  { path: 'album/', priority: '0.8' },
  { path: 'annual/', priority: '0.7' },
  { path: 'places/', priority: '0.7' },
  { path: 'future/', priority: '0.6' },
];

function siteBase(siteUrl, basePath) {
  const path = getConfiguredBasePath(basePath);
  const normalized = path === '/' ? '/' : `${path}/`;
  return new URL(normalized, siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`);
}

export function socialImageUrl(siteUrl = '', basePath = '/') {
  if (!siteUrl) return '';
  return new URL('og.jpg', siteBase(siteUrl, basePath)).href;
}

export function renderRobots(siteUrl = '', basePath = '/') {
  const lines = ['User-agent: *', 'Allow: /'];
  if (siteUrl) lines.push(`Sitemap: ${new URL('sitemap.xml', siteBase(siteUrl, basePath)).href}`);
  return `${lines.join('\n')}\n`;
}

export function renderSitemap(siteUrl = '', basePath = '/') {
  const urls = siteUrl
    ? PUBLIC_ROUTES.map(({ path, priority }) => {
        const location = new URL(path, siteBase(siteUrl, basePath)).href;
        const alternates = ['en', 'zh-CN', 'x-default']
          .map((hreflang) => `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${location}"/>`)
          .join('\n');
        return `  <url>\n    <loc>${location}</loc>\n${alternates}\n    <priority>${priority}</priority>\n  </url>`;
      })
    : [];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}${urls.length ? '\n' : ''}</urlset>\n`;
}
