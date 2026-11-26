---
title: Deploying to Netlify
description: Step-by-step instructions for deploying your small business website to Netlify for free.
author: Team
date: 2026-02-15
tags: [guide, deployment]
draft: false
---

This template is pre-configured for Netlify deployment. The `netlify.toml` file in the project root handles the build command, publish directory, and security headers automatically.

## Step-by-Step Deployment

### 1. Push to GitHub

If you have not already, create a GitHub repository and push your project:

```bash
git init
git add -A
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 2. Connect to Netlify

1. Sign in to [Netlify](https://app.netlify.com)
2. Click **Add new site** then **Import an existing project**
3. Select your GitHub repository
4. Netlify will auto-detect the build settings from `netlify.toml`
5. Click **Deploy site**

### 3. Set Your Custom Domain

Once deployed, go to **Domain management** in your Netlify dashboard and add your custom domain. Netlify provides free HTTPS certificates automatically.

### 4. Update Your Site URL

After setting your domain, update the `site` field in `astro.config.mjs` and the `url` field in `src/data/siteData.ts` to match your production URL. This ensures sitemaps, canonical URLs, and structured data all point to the right place.

## Contact Form

The contact form uses Netlify Forms, which works automatically when you deploy to Netlify. No extra configuration needed — submissions appear in your Netlify dashboard under **Forms**.

## Continuous Deployment

Every time you push to your main branch, Netlify will automatically rebuild and deploy your site. Typical build times are under 5 seconds.

That is it — your site is live!
