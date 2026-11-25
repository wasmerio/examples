import type { MetadataRoute } from 'next';
import { getPosts } from '@/lib/blog';

export const dynamic = 'force-static';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://lapse-next.startfrom.co';

/** Hand-written: every page except the 404, like @astrojs/sitemap in the Astro build. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ['/', '/about/', '/blog/', '/contact/', '/pricing/', '/privacy/', '/terms/'];
  const posts = (await getPosts()).map((p) => `/blog/${p.id}/`);
  return [...pages, ...posts].sort().map((p) => ({ url: new URL(p, SITE).href }));
}
