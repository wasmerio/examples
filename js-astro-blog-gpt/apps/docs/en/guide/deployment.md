# Build and Deploy

BlogGPT compiles your site into static HTML, CSS, and JavaScript inside the `dist/` directory. You can host it on any static platform—including Vercel, Netlify, Cloudflare Pages, or GitHub Pages—without needing a Node.js runtime in production.

## One-Click Deployment (Starter)

If you haven't cloned the repo yet, you can create and deploy a new blog directly from the [BlogGPT Starter Template](https://github.com/Raincarnator/astro-theme-BlogGPT-starter):

[Use this template](https://github.com/Raincarnator/astro-theme-BlogGPT-starter/generate)

<div class="deploy-badges">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRaincarnator/astro-theme-BlogGPT-starter)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Raincarnator/astro-theme-BlogGPT-starter)

</div>

- **Vercel**: Click the **Deploy with Vercel** button on the starter README. Vercel automatically detects Astro (`pnpm build` and output directory `dist`).
- **Netlify**: Click the **Deploy to Netlify** button on the starter README. The included `netlify.toml` pre-configures the build settings.

## Production URL

Before deploying to production, set your canonical domain so that RSS feeds, Sitemaps, canonical links, and Open Graph cover URLs resolve properly.

You can set this in `blog.config.ts`:

```ts
export default {
  site: {
    baseUrl: 'https://blog.example.com',
    // ...
  },
};
```

With the default starter configuration, you can also set `SITE_URL` in your hosting dashboard, for example `SITE_URL=https://blog.example.com`. The starter reads it first, then falls back to the Vercel production domain or Netlify site URL. Set `SITE_URL` and rebuild after adding a custom domain. The main theme repository does not read this variable; edit `site.baseUrl` directly when using that repository or a fixed URL in your configuration.

> **Subpath deployments:** Addresses such as `https://example.com/blog/` are supported. Set `site.baseUrl` to the complete URL, including the deployment directory, so routes and asset paths use the correct base.

## Build Check

Always run a local build check before pushing to production to catch invalid frontmatter and broken resource references:

```bash
pnpm build
pnpm preview
```

Verify that:

1. `pnpm build` exits with code `0` and generates the Pagefind search index.
2. Draft posts (`draft: true`) are excluded from the production output.
3. Search, RSS (`/zh/rss.xml` with the default configuration; adjust for your language prefix policy), and Sitemap (`/sitemap-index.xml`) work as expected in `pnpm preview`.

## Manual Deployment & GitHub Pages

### Standard Static Hosting (Cloudflare Pages, Nginx, S3, etc.)

- **Install Command**: `pnpm install`
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Node.js Version**: `24.x` for the starter; the main repository also supports `22.12.0` or newer

### GitHub Pages

To deploy via GitHub Actions:

1. In your GitHub repository, go to **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
2. Set `site.baseUrl` to the public URL: `https://<username>.github.io/` for a user site, or a URL including the repository directory, such as `https://<username>.github.io/my-blog/`, for a project site.
3. Add an Astro GitHub Pages workflow under `.github/workflows/deploy.yml` using Node.js 24 and the pnpm version pinned in the repository.
