import homeData from '../data/home.json';

export async function GET() {
  const siteUrl = (homeData.siteUrl || '').replace(/\/$/, '');

  const sitemapLine = siteUrl ? `\nSitemap: ${siteUrl}/sitemap-index.xml\n` : '';

  const body = `User-agent: *
Allow: /${sitemapLine}`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
