import type { APIRoute } from 'astro';
import { siteConfig } from '@/site.config';

// Generate a sitemap XML during build
export const GET: APIRoute = async () => {
  const baseUrl = siteConfig.url;
  
  const pages = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/works', changefreq: 'weekly', priority: '0.8' },
    { loc: '/projects', changefreq: 'weekly', priority: '0.8' },
    { loc: '/blog', changefreq: 'weekly', priority: '0.8' },
    { loc: '/about', changefreq: 'monthly', priority: '0.6' },
    { loc: '/privacy-policy', changefreq: 'monthly', priority: '0.3' },
    { loc: '/terms-of-service', changefreq: 'monthly', priority: '0.3' },
    { loc: '/cookie-policy', changefreq: 'monthly', priority: '0.3' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
