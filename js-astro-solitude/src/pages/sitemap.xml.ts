import { getRoutes } from '@/lib/routing';
import { xml } from '@/lib/content/feeds';
import { absolute } from '@/lib/site';
export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${(
      await getRoutes()
    )
      .filter((r) => r.kind !== 'redirect')
      .map((r) => `<url><loc>${xml(absolute(r.path))}</loc></url>`)
      .join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
}
