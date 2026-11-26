# Deploy to Cloudflare or Vercel

[Back to README](../README.md) · [SEO and social sharing](seo.md)

Landpack builds to static HTML in `dist/`. Both alternatives below keep that architecture; no Astro server adapter is needed for the current template. Choose one provider.

Before deploying, commit your project to your own repository, use Node.js 22.12+ and npm 9.6.5+, and set `PUBLIC_SITE_URL` to the landing page’s final HTTPS origin. It is a **build-time variable**, not a Worker runtime secret. Regenerate the social card if you changed the content:

```sh
npm ci
npm run og:generate
npm run check
npm run build
npm run seo:check
```

The SEO check rejects the shipped example domain. Use `--allow-placeholder` only for a local structural check, not as a production fix.

## Cloudflare Workers

The included [wrangler.jsonc](../wrangler.jsonc) already serves `dist/` as static assets and selects `404-page` handling. This follows Cloudflare’s static-assets approach; Astro’s current deployment guide recommends Workers for new Cloudflare projects. [Astro guide](https://docs.astro.build/en/guides/deploy/cloudflare/), [Cloudflare static assets](https://developers.cloudflare.com/workers/static-assets/get-started/).

1. Change `name` in `wrangler.jsonc` to your Worker’s name. Keep `assets.directory: "./dist"`.
2. Set `PUBLIC_SITE_URL` in your local `.env` or build environment, then run the checks/build above.
3. Authenticate and deploy from your terminal:

```sh
npx wrangler login
npx wrangler deploy
```

`wrangler deploy` publishes the existing `dist/` directory with this configuration. Rebuild after content or URL changes. The result is available on your Worker’s `workers.dev` address; attach your own domain in Cloudflare and rebuild with that domain in `PUBLIC_SITE_URL`.

For Git-connected Workers Builds, import your repository and use `npm run build` as the build command and `npx wrangler deploy` as the deploy command. Set `PUBLIC_SITE_URL` as a build variable and choose a compatible Node version. Run validation before merging changes into the production branch.

## Vercel

Astro supports static Vercel deployment without adding an adapter. [Astro’s Vercel guide](https://docs.astro.build/en/guides/deploy/vercel/).

1. In Vercel, import your Git repository as a new project.
2. Select the Astro framework preset if it is not detected automatically.
3. Confirm installation `npm ci`, build `npm run build`, and output directory `dist`.
4. Select a supported Node version meeting the project requirement and set `PUBLIC_SITE_URL` in the Production build environment.
5. Deploy, then add your custom domain in the project settings. Rebuild if the origin changes.

No `vercel.json` is needed for the current static site. Git pushes create deployments according to Vercel’s branch configuration. Leave `wrangler.jsonc` unused when choosing Vercel.

## After publishing

Open the production homepage, `/og-image.jpg`, `/robots.txt`, and `/sitemap-index.xml`. Confirm the page source points to the production origin and an unknown route returns an HTTP 404. The provided commands do not configure your DNS or run a live deployment automatically.

For staging/preview deployments, keep canonical URLs pointed at your production site and use the provider’s preview protection or `X-Robots-Tag: noindex` controls as appropriate. A canonical is not an access-control or indexing prohibition. Public social crawlers must be able to fetch the production page and image without authentication.
