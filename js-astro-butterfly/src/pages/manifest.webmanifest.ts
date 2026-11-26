import type { APIRoute } from 'astro';
import { site } from '@/config';
import { url } from '@/lib/url';

/** Web app manifest generated from the site config (name, icon, colours). */
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: site.title,
      short_name: site.title,
      description: site.description,
      lang: site.lang,
      start_url: url('/'),
      scope: url('/'),
      display: 'standalone',
      theme_color: '#49b1f5',
      background_color: '#f6f1f7',
      icons: [{ src: url(site.logo), sizes: 'any', type: site.logo.endsWith('.svg') ? 'image/svg+xml' : 'image/png' }],
    }),
    { headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' } },
  );
