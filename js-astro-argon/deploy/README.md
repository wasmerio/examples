# Deployment Cache Templates

This folder provides cache header templates for common targets.

## Included Templates

- `deploy/vercel/vercel.json`
- `deploy/cloudflare-pages/_headers`
- `deploy/nginx/astro-static-cache.conf`

## Recommended Cache Policy

- `/_astro/*`: `public, max-age=31536000, immutable`
- `/pagefind/*`: `public, max-age=86400, stale-while-revalidate=604800`
- HTML pages: `public, max-age=0, must-revalidate`

## Notes

- Astro fingerprinted files in `/_astro/` are safe for long immutable caching.
- Keep HTML revalidatable so content updates are visible quickly.
- If you use EdgeOne in front of self-hosted origin, keep the same origin headers and let the edge honor them.
