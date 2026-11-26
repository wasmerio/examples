# Deploy to Cloudflare

A step-by-step guide to creating a personal website from the astro-whoami template and publishing it on Cloudflare.

## Prerequisites

- [Node.js](https://nodejs.org) 18 or later
- npm (included with Node.js)
- A [GitHub](https://github.com) account
- A [Cloudflare](https://dash.cloudflare.com/sign-up) account (free plan works)

## Step 1: Create Your Site

There are two ways to start from the template.

### Option A: Astro CLI (recommended)

```bash
npm create astro@latest -- --template asivura/astro-whoami my-site
cd my-site
npm install
```

### Option B: GitHub Template

1. Go to [github.com/asivura/astro-whoami](https://github.com/asivura/astro-whoami)
2. Click **Use this template** > **Create a new repository**
3. Clone your new repository and install dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/my-site.git
cd my-site
npm install
```

Verify everything works:

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321). You should see the template with placeholder content.

## Step 2: Personalize

All personalization lives in a single file: `src/site.config.ts`.

Open it and update the following fields:

| Field               | What to change                                           |
| ------------------- | -------------------------------------------------------- |
| `name`              | Your full name                                           |
| `title`             | Page title (usually your name)                           |
| `description`       | One-line tagline for SEO and social cards                |
| `url`               | Your production URL (update after deploying)             |
| `author.email`      | Your email address                                       |
| `author.avatar`     | Path to your avatar image (place it in `public/images/`) |
| `social.github`     | Your GitHub profile URL                                  |
| `social.linkedin`   | Your LinkedIn profile URL                                |
| `social.twitter`    | Your X/Twitter profile URL                               |
| `homepage.greeting` | The greeting shown on the homepage                       |
| `homepage.intro`    | A short bio paragraph                                    |
| `homepage.featured` | Links to blog posts you want to highlight                |
| `jsonLd.jobTitle`   | Your job title for structured data                       |
| `jsonLd.worksFor`   | Your employer name and URL                               |

### Add your avatar

Replace the placeholder avatar with your own image:

```bash
cp /path/to/your-photo.jpg public/images/avatar.jpg
```

### Add your content

- **Blog posts**: create markdown files in `src/data/blog/`
- **Projects**: create markdown files in `src/data/projects/`

See the existing sample files for the frontmatter format.

### Verify the build

```bash
npm run build
```

If the build succeeds, your site is ready to deploy.

## Step 3: Push to GitHub

If you used the Astro CLI (Option A), create a GitHub repository and push:

```bash
git init
git add .
git commit -m "feat: initial site from astro-whoami template"
git remote add origin https://github.com/YOUR_USERNAME/my-site.git
git branch -M main
git push -u origin main
```

If you used the GitHub template (Option B), your repository already exists. Commit and push your changes:

```bash
git add .
git commit -m "feat: personalize site config and content"
git push
```

## Step 4: Connect to Cloudflare

1. Go to the [Cloudflare dashboard](https://dash.cloudflare.com)
2. In the sidebar, click **Workers & Pages**
3. Click **Create**
4. Select the **Pages** tab, then click **Connect to Git**
5. Authorize Cloudflare to access your GitHub account if prompted
6. Select your repository from the list
7. Configure the build settings:

| Setting                | Value           |
| ---------------------- | --------------- |
| Production branch      | `main`          |
| Build command          | `npm run build` |
| Build output directory | `dist`          |

1. Click **Save and Deploy**

Cloudflare will clone your repository, run the build, and deploy the output. The first build takes about a minute. When it finishes, you get a live URL at:

```text
https://<project-name>.<account-name>.workers.dev
```

Visit the URL to confirm your site is live.

## Step 5: Update Your Site URL

Now that you have a live URL, update `src/site.config.ts`:

```typescript
url: "https://your-project.your-account.workers.dev",
```

Also update the `site` field in `astro.config.ts`:

```typescript
export default defineConfig({
  site: "https://your-project.your-account.workers.dev",
  // ...
})
```

And update the sitemap URL in `public/robots.txt`:

```text
Sitemap: https://your-project.your-account.workers.dev/sitemap-index.xml
```

Commit and push these changes. Cloudflare will automatically rebuild and redeploy.

## Step 6: Add a Custom Domain (Optional)

To use your own domain (e.g., `yourname.com`) instead of the `.workers.dev` URL:

### If your domain is already on Cloudflare DNS

1. Go to **Workers & Pages** in the Cloudflare dashboard
2. Click on your project
3. Go to **Settings** > **Domains & Routes**
4. Click **Add** > **Custom domain**
5. Enter your domain (e.g., `yourname.com` or `site.yourname.com`)
6. Cloudflare will automatically create the DNS record

### If your domain is on another DNS provider

Your domain's DNS must be managed by Cloudflare for custom domains on Workers & Pages. You have two options:

1. **Transfer DNS to Cloudflare** (free): Add your domain as a zone in Cloudflare, import your existing DNS records, then update your domain registrar's nameservers to the ones Cloudflare provides. Nameserver changes can take up to 24 hours to propagate.

2. **Use the `.workers.dev` URL**: Skip the custom domain and use the default URL. You can always add a custom domain later.

### After adding a custom domain

Update the three URL references to use your custom domain:

- `src/site.config.ts` > `url`
- `astro.config.ts` > `site`
- `public/robots.txt` > `Sitemap`

Commit and push.

## Step 7: Verify

Once your site is deployed, check that everything works:

- [ ] Homepage loads with your name, bio, and featured posts
- [ ] Blog listing page shows your posts at `/blog`
- [ ] Individual blog posts render correctly
- [ ] Projects page shows your projects at `/projects`
- [ ] About page loads at `/about`
- [ ] RSS feed is accessible at `/rss.xml`
- [ ] Sitemap is accessible at `/sitemap-index.xml`
- [ ] Theme toggle switches between light and dark mode
- [ ] Run a [Lighthouse](https://pagespeed.web.dev) audit and confirm high scores

## Updating Your Site

Cloudflare automatically rebuilds and deploys your site whenever you push to the `main` branch. The typical workflow:

```bash
# Edit content or code
npm run dev          # Preview locally
npm run build        # Verify the build
git add .
git commit -m "feat: add new blog post"
git push
```

The new version goes live within about a minute of pushing.

### Preview deployments

Cloudflare creates a preview deployment for every pull request. This lets you review changes at a temporary URL before merging to `main`.

## Troubleshooting

### Build fails on Cloudflare

- Check the build logs in **Workers & Pages** > your project > **Deployments**
- Ensure `npm run build` passes locally before pushing
- Verify your Node.js version is compatible (Cloudflare uses Node 18 by default)

### 404 on page routes

- Astro generates static HTML files. Ensure the page exists in `src/pages/`
- Blog posts must be in `src/data/blog/` with valid frontmatter
- Run `npm run build` locally and check the `dist/` folder for the expected files

### Custom domain not resolving

- DNS changes can take up to 24 hours to propagate
- Verify the domain shows as **Active** in your Cloudflare dashboard
- Check that the custom domain appears under your project's **Settings** > **Domains & Routes**

### Sitemap or RSS returning old URL

- Make sure `site` in `astro.config.ts` matches your production URL
- Make sure `url` in `src/site.config.ts` matches as well
- Rebuild and redeploy after updating
