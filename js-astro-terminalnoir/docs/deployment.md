# Deployment

The site is a static build. Any host that can serve files from a directory is enough. A Firebase account is not
required.

```sh
npm run build
```

The output directory is `dist`.

## Site root

Leave `SITE_BASE` unset, or set it to `/`. `src/config/site.ts` `url` must be the public origin, for example
`https://example.com`. Canonical links, the sitemap and `robots.txt` use that origin.

## Project-site base

For a GitHub Pages project site, set the base before building:

```sh
SITE_BASE=/toolkit/ npm run build
```

`SITE_BASE` must start and end with `/` when it is not the root. Internal links, the favicon, screenshots, the sitemap
and robots all include that prefix once. Do not also hard-code the prefix in `site.nav`.

Preview the same base with:

```sh
SITE_BASE=/toolkit/ npm run preview -- --host 127.0.0.1 --port 4321
```

## Maintainer demo origin

The committed origin stays `https://example.com`. A maintainer can point one build at a verified Hosting URL without
changing the starter default:

```sh
SITE_URL=https://demo.example SITE_BASE=/ npm run build
```

`SITE_URL` must be an `http` or `https` URL. Any other value fails the build. People who install the template can leave
it unset.
