<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Casper](https://github.com/AntonyLeons/casper) Astro theme by AntonyLeons, copied from commit `28a3f21e5a9eedce8a6e938f954abe1bbcbb540a` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-casper.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [AntonyLeons](https://github.com/AntonyLeons), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Casper Astro ⚡ [![Netlify Status](https://api.netlify.com/api/v1/badges/8150a992-e702-4ebe-927f-8729c808a5b6/deploy-status)](https://app.netlify.com/projects/casperastro/deploys) [![Deploy to GitHub Pages](https://github.com/AntonyLeons/casper/actions/workflows/deploy.yml/badge.svg)](https://github.com/AntonyLeons/casper/actions/workflows/deploy.yml)
<img width="1598" height="900" alt="image" src="https://github.com/user-attachments/assets/22234be6-057b-4a36-b4dd-5d19c009b834" />

A modernized, high-performance port of Ghost's default theme [Casper 2.0](https://github.com/tryghost/casper) built on top of **Astro 7**.

This port replaces the original Jekyll setup (`jasper2`), offering incredibly fast builds, type-safe content validation, server-side pre-rendering, and client-side page load times.

Deploy your own copy of this blog template to the cloud with a single click:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/AntonyLeons/casper) &nbsp;&nbsp;
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AntonyLeons/casper) &nbsp;&nbsp;
[![Use this template](https://img.shields.io/badge/Use_this_template-2ea44f?style=for-the-badge&logo=github)](https://github.com/AntonyLeons/casper/generate)

## 🚀 Key Features

- **Astro 7 & TypeScript**: Full TypeScript configuration and strict schema validations.
- **Type-Safe Content Schema**: Powered by Astro Content Collections and Zod to validate posts, tags, and authors.
- **Modern Asset Pipeline**: Stylesheets are bundled, minified, and optimized via Vite out of the box.
- **Zero-Dependency Vanilla JS Interactivity**: Ported jQuery scripts (infinite scrolling, scroll progress bar, and floating headers) to clean, performant **Vanilla JS**, and replaced FitVids with a native, zero-JS **CSS aspect-ratio** solution.
- **100% SEO Compliance**: Automatic metadata, canonical URLs, Open Graph images, Twitter cards, and Schema.org JSON-LD data pre-rendered on the server.
- **Compliance Feeds**: Auto-generated Atom XML RSS feeds matching the original Jekyll feeds exactly (`/feed.xml`, `/tag/[tag]/feed.xml`, `/author/[author]/feed.xml`).
- **Disqus & Subscribe Forms**: Out-of-the-box toggleable Disqus comments and location-aware email newsletter subscription forms.

---

## 🛠️ Local Development

### 1. Installation
Install the project dependencies using `pnpm` (recommended) or `npm`:

```bash
pnpm install
# or
npm install
```

### 2. Development Server
Start the local hot-reloading development server:

```bash
pnpm run dev
# or
npm run dev
```

Your blog will be accessible locally at `http://localhost:4321/casper/` (matching the configured subpath).

### 3. Static Build
Compile the blog into optimized static HTML files:

```bash
pnpm run build
# or
npm run build
```

The output will be generated inside the `dist/` directory.

---

## 📂 Project Structure

- `src/content.config.ts`: Configuration file defining content validation schemas and loaders for Astro 7.
- `src/content/posts/`: Contains all Markdown (`.md`) articles. Add new blog posts here.
- `src/content/authors/`: Contains JSON files for each author (e.g. `ghost.json` defining name, bio, location, and social profiles).
- `src/content/tags/`: Contains JSON files for tags (e.g. `fables.json` defining name, description, and cover images).
- `src/layouts/`: Base design frames:
  - `Layout.astro`: Standard page shell containing head SEO elements, footers, and theme toggler scripts.
  - `PostLayout.astro`: Article rendering frame with progress bars, Disqus comments lazy-loading, and next/prev suggestions.
  - `PageLayout.astro`: Framework for static pages (like `/about/`).
- `src/components/`: Sub-components like navigation bars (`SiteNav.astro`), search overlays (`AlgoliaSearch.astro`), post preview cards (`PostCard.astro`), or sharing tools (`FloatingHeader.astro`).
- `public/assets/images/`: Stores all static graphics, icons, avatars, and cover photos.
- `public/admin/`: Decap CMS dashboard files (`index.html` and `config.yml`) to manage content directly from the browser.

---

## ⚙️ Configuration & Integration

### 1. Algolia Search Setup

The theme includes a lightweight, pre-configured **Algolia InstantSearch** overlay. To configure search:

1. Create an index on [Algolia](https://www.algolia.com/).
2. Index your site posts. You can index them using Algolia's web crawler or upload your post list JSON feed.
3. Open [config.ts](file:///c:/Users/anton/Documents/Github/casper/src/config.ts) and add your Algolia credentials to the `SITE_CONFIG` object:
   ```typescript
   algolia: {
     applicationId: 'YOUR_APP_ID',
     indexName: 'YOUR_INDEX_NAME',
     searchOnlyApiKey: 'YOUR_SEARCH_ONLY_API_KEY',
   }
   ```
4. If the `algolia` configuration block is removed or undefined, the search icons and widget will automatically disable.

---

### 2. Decap CMS (Netlify CMS) Integration

A fully configured Decap CMS admin dashboard is built into the template under `public/admin/` to manage posts, authors, and tags directly from your browser.

#### Setup Instructions:
1. **Host on Netlify**: Connect your GitHub repository to Netlify.
2. **Enable Netlify Identity**:
   - Navigate to **Site Configuration** > **Identity** > **Enable Identity**.
   - Under **Identity** > **Registration preferences**, change registration from **Public** to **Invite only** to restrict access to yourself.
3. **Enable Git Gateway**:
   - Under **Identity** > **Services** > **Git Gateway**, click **Enable Git Gateway** to authorize repository read/write access.
4. **Log in**:
   - Send yourself an invite under the **Identity** tab in Netlify.
   - Click the validation link in the email, create your credentials, and visit `https://yourdomain.com/admin/` to log in and start writing!

---

## ☁️ Deployment

Since Casper Astro compiles to standard static HTML/CSS files, it can be deployed to any major hosting provider.

### 1. Netlify

#### Easy Deploy
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/AntonyLeons/casper)

#### Manual Setup
1. Connect your repository in the Netlify Dashboard.
2. Configure the following build settings:
   - **Build command:** `pnpm build` or `npm run build`
   - **Publish directory:** `dist`
3. If using the CMS admin panel (`/admin/`), enable **Netlify Identity**:
   - Go to **Site Configuration** > **Identity** > **Enable Identity**.
   - Under **Identity** > **Services** > **Git Gateway**, click **Enable Git Gateway** to authorize access to your repository.
   - Go to the **Identity** tab at the top of your site management overview, invite yourself, and use Netlify Identity to log in at `https://casper.leons.dev/admin/`.

---

### 2. Vercel

1. Connect your repository in the Vercel Dashboard.
2. Vercel will automatically detect **Astro** and pre-configure:
   - **Build Command:** `npm run build` or `pnpm build`
   - **Output Directory:** `dist`
3. Click **Deploy**.

---

### 3. Cloudflare Pages

1. In the Cloudflare Dashboard, navigate to **Workers & Pages** > **Create Application** > **Pages** > **Connect to Git**.
2. Select your repository.
3. Configure the build settings:
   - **Framework preset:** `Astro`
   - **Build command:** `pnpm build` or `npm run build`
   - **Build output directory:** `dist`
4. Under **Environment variables**, set `NODE_VERSION` to `24` or higher.
5. Click **Save and Deploy**.

---

### 4. GitHub Pages

A ready-to-use GitHub Actions workflow is included in `.github/workflows/deploy.yml`. 

To deploy:
1. Push your changes to the `main` branch.
2. In your GitHub repository settings, navigate to **Pages**.
3. Under **Build and deployment**, set the **Source** to **GitHub Actions**.
4. The workflow will automatically trigger, build the Astro application, and publish it directly to GitHub Pages.

---

## 🔄 Keeping Your Blog Updated

If you created your blog by **forking** or **cloning** this repository, you can pull upstream updates, fixes, and performance optimizations (like code refactoring or package upgrades) into your personal repository using Git.

### 1. Add Upstream Remote
Inside your local blog repository directory, link this template repository as an `upstream` remote:
```bash
git remote add upstream https://github.com/AntonyLeons/casper.git
```

### 2. Fetch and Merge Changes
To pull the latest template updates and merge them:
```bash
# Fetch changes from the template repo
git fetch upstream

# Merge upstream main branch into your current branch
git merge upstream/main
```
If you customized configurations (e.g., in `src/config.ts`) or added custom content, resolve any merge conflicts that arise, and then commit and push to your remote repository.

---

## 📝 License

Distributed under the MIT License. Same license as original Casper theme by the Ghost Foundation.
