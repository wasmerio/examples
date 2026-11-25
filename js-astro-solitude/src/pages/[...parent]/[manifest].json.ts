import { cfg, config, url } from '@/lib/site';
export function getStaticPaths() {
  return cfg.pwa.enable && cfg.pwa.manifest.endsWith('.json')
    ? [
        {
          params: {
            parent:
              cfg.pwa.manifest.slice(1).split('/').slice(0, -1).join('/') ||
              undefined,
            manifest: cfg.pwa.manifest
              .split('/')
              .pop()!
              .replace(/\.json$/, ''),
          },
        },
      ]
    : [];
}
export function GET() {
  return Response.json({
    name: config.title,
    short_name: config.title,
    start_url: url('/'),
    scope: config.base,
    display: 'standalone',
    theme_color: cfg.pwa.theme_color,
    background_color: cfg.theme_color.light,
    icons: [
      {
        src: url(cfg.pwa.apple_touch_icon),
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  });
}
