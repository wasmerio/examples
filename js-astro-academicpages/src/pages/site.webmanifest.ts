import type { APIRoute } from 'astro';

import { siteConfig } from '@data/siteConfig';
import { resolveThemes } from '@data/themes';
import { resolveUrl } from '@utils/url';

export const GET: APIRoute = () => {
  const { light } = resolveThemes(siteConfig.theme);
  const manifest = {
    name: siteConfig.title,
    short_name: siteConfig.author.name || siteConfig.title,
    description: siteConfig.description,
    start_url: resolveUrl('/'),
    display: 'standalone',
    background_color: light.bg,
    theme_color: light.base,
    lang: siteConfig.locale,
    icons: [
      { src: resolveUrl('/icon-192.png'), sizes: '192x192', type: 'image/png' },
      { src: resolveUrl('/icon-512.png'), sizes: '512x512', type: 'image/png' },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
};
