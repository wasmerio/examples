# Deployment

The site builds to plain static files in `dist/`. There is no server code, so any static host works: Cloudflare Pages, Netlify, Vercel, GitHub Pages, or your own web server.

Whatever the host, use these settings:

- Build command: `pnpm verify`
- Output directory: `dist`
- Node version: 24 (`NODE_VERSION=24` on most hosts)
- pnpm version: 11.9.0 (`PNPM_VERSION=11.9.0` where the host reads it)

`pnpm verify` runs the checks and then the build, so a broken site never publishes. A fresh clone still passes with the starter content; `pnpm check-content` (without flags) is what tells you when you have replaced everything.

Set `site.url` in `content/site.ts` to the address the site will live at, because canonical links, feeds and the sitemap are built from it.

For a preview or demo deploy on another address, set the `SITE_URL` environment variable on the host (for example `SITE_URL=https://my-portfolio.pages.dev`). It overrides `site.url` for that build only, so the links point at the deploy itself.

## Cloudflare Pages or Netlify

Import the repo, then use the settings above. Both hosts read `dist/_redirects`, which the build writes from the `aliases` field of renamed posts, and `_headers` (from `content/public/`), which lets browsers cache the hashed files in `/_astro/` for a year.

## Other hosts

Vercel, GitHub Pages and plain web servers ignore `_redirects` and `_headers`. Everything else works as is. If you rename a post, add the old URL as a redirect in your host's own config.

Pages are built as `blog.html`, `blog/hello-world.html` and so on, linked without the extension (`/blog`). Most hosts serve that automatically. On a plain web server, turn on extensionless `.html` lookups (for nginx: `try_files $uri $uri.html $uri/ =404;`).

## By hand

```sh
pnpm install
pnpm verify
```

Upload the contents of `dist/` to your host.

## Analytics (optional)

Create a Cloudflare Web Analytics site (it works on any host) and paste its beacon token into `analyticsToken` in `content/site.ts`. It is cookie-free. Leave it empty to turn analytics off.
