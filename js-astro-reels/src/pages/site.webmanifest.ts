import type { APIRoute } from 'astro';
import { SITE_NAME } from '../lib/seo.ts';

export const GET: APIRoute = () => {
  const manifest = {
    name: SITE_NAME,
    short_name: SITE_NAME,
    start_url: '/',
    theme_color: '#101210',
    background_color: '#101210',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
  return new Response(`${JSON.stringify(manifest, null, 2)}\n`, { headers: { 'Content-Type': 'application/manifest+json' } });
};
