# Deployment Guide

This guide covers deploying your Astro Starter site to various hosting platforms.

## Quick Deploy Options

### One-Click Deployments

[![Deploy to Netlify](https://img.shields.io/badge/Deploy%20to-Netlify-00C7B7?logo=netlify)](https://app.netlify.com/start/deploy?repository=https://github.com/mnyorba/astro-starter)
[![Deploy to Vercel](https://img.shields.io/badge/Deploy%20to-Vercel-000000?logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/mnyorba/astro-starter)

## Static Deployment

### Netlify

**Option 1: One-Click Deploy**
Use the deploy button above for instant setup.

**Option 2: Manual Setup**

1. **Connect Repository:**
   - Login to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Connect your repository

2. **Build Settings:**

   ```
   Build command: npm run build
   Publish directory: dist
   ```

### Vercel

**Option 1: One-Click Deploy**
Use the deploy button above.

**Option 2: Manual Setup**

1. **Import Project:**
   - Login to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import from Git

2. **Settings:**
   - Framework: Astro
   - Build command: `npm run build`
   - Output directory: `dist`

### GitHub Pages

[![Use this template](https://img.shields.io/badge/Use%20this%20template-2088FF?logo=github)](https://github.com/mnyorba/astro-starter/generate)

1. **[Use this template](https://github.com/mnyorba/astro-starter/generate)** to create a new repository
2. **Update** `config.base` in `src/consts.ts` with your repository name
3. **Go to Repository Settings** → Pages
4. **Set Source** to "GitHub Actions"
5. **Push to main branch** - automatic deployment starts

   ```

   ```

### Cloudflare Pages

1. **Connect Repository:**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Create a new project
   - Connect your Git repository

2. **Build Settings:**
   - Framework preset: Astro
   - Build command: `npm run build`
   - Build output directory: `dist`

## Server-Side Rendering (SSR)

For dynamic features, you can deploy with [SSR](https://docs.astro.build/en/guides/deploy/#server-side-rendering) enabled.

## Environment Variables (if needed)

### Production Configuration

Create environment-specific configurations:

**`.env.production`:**

```bash
# Analytics
PUBLIC_ANALYTICS_ID=GTM-XXXXXXX // Google Tag Manager ID

# Contact Form
FORMSPREE_ID=your-production-formspree-id // Formspree form ID

# API Keys
API_KEY=your-production-api-key // Your API key
```

### Redirects

For SPAs, add `_redirects` file to `public/`:

```
/*    /index.html   200
```
