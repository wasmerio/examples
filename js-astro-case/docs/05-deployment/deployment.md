# Deployment

This theme generates a static site that can be deployed to any static hosting service.

## Build

```bash
npm run build    # Generate production build in dist/
npm run preview  # Preview build locally
```

## Deployment Platforms

### Netlify

1. Push repository to GitHub/GitLab/Bitbucket
2. Connect to [Netlify](https://netlify.com)
3. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in dashboard

**netlify.toml** (optional):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

### Vercel

1. Push repository to GitHub/GitLab/Bitbucket
2. Import to [Vercel](https://vercel.com)
3. Configure:
   - Framework Preset: Astro
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variables in dashboard

### Cloudflare Pages

1. Push repository to GitHub/GitLab
2. Connect to [Cloudflare Pages](https://pages.cloudflare.com)
3. Configure:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Add environment variables in dashboard

### GitHub Pages

1. Update `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://username.github.io',
  base: '/repository-name',  // Remove if using custom domain
});
```

2. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          SITE_URL: ${{ vars.SITE_URL }}
          SITE_AUTHOR_NAME: ${{ vars.SITE_AUTHOR_NAME }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

3. Enable GitHub Pages: Settings → Pages → Source: GitHub Actions

### Self-Hosted (VPS / Shared Hosting)

For Virtual Private Server or traditional shared hosting.

**Step 1: Build locally**

```bash
npm run build
```

This creates a `dist/` folder with all static files.

**Step 2: Upload files**

Upload the contents of `dist/` to your server's web root.

**Via rsync (VPS):**

```bash
rsync -avz --delete dist/ user@your-server:/var/www/your-site/
```

**Via SCP (VPS):**

```bash
scp -r dist/* user@your-server:/var/www/your-site/
```

**Via FTP/SFTP (Shared Hosting):**

Use your hosting's File Manager to upload `dist/` contents to `public_html/` or your web root.

**Step 3: Configure web server (VPS only)**

For nginx, create a config file:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/your-site;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Note:** Environment variables are baked in at build time. Set them in `.env` before running `npm run build`.

## Environment Variables

Set these in your hosting platform:

**Required:**
- `SITE_URL`
- `SITE_AUTHOR_NAME`
- `SITE_AUTHOR_TITLE`
- `SITE_AUTHOR_EMAIL`

**Optional:**
- `SITE_LANGUAGE`
- `SITE_AUTHOR_BIO`
- `SITE_AUTHOR_LOCATION`
- `SOCIAL_GITHUB`
- `SOCIAL_LINKEDIN`
- `SOCIAL_TWITTER`

## Custom Domain

1. Add domain in hosting platform dashboard
2. Update DNS records:
   - Apex domain: A record → platform's IP
   - Subdomain: CNAME → platform's domain
3. Update `SITE_URL` environment variable
4. Enable HTTPS (usually automatic)

## Pre-Deployment Checklist

- [ ] `npm run build` succeeds
- [ ] `npm run preview` works correctly
- [ ] All environment variables set
- [ ] Images optimized
- [ ] Mobile tested
- [ ] Meta tags verified
- [ ] All links working
