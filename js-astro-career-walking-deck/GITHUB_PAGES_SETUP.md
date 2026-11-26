# GitHub Pages Deployment Setup

This repository is configured to automatically deploy to GitHub Pages when you push to the `main` branch.

## Initial Setup

1. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save the changes

2. **Base URL Configuration:**
   
   ✅ **Automatic Configuration**: The workflow automatically detects your repository name and sets the correct `BASE_URL`:
   - If your repo is `username.github.io` → uses `/`
   - Otherwise → uses `/<repository-name>/`
   
   **Manual Override (optional):**
   - If you need to override the automatic detection, go to **Settings** → **Secrets and variables** → **Actions**
   - Add secret: `BASE_URL` with your custom value

3. **Optional: Set Custom Site URL:**
   - If you want to set a custom `PUBLIC_SITE_URL`, add it as a secret:
     - Name: `PUBLIC_SITE_URL`
     - Value: `https://your-username.github.io` (or your custom domain)

## How It Works

- The workflow (`.github/workflows/deploy.yml`) automatically:
  1. Builds your Astro site when you push to `main`
  2. Deploys it to GitHub Pages
  3. Makes it available at `https://<username>.github.io/<repository-name>/`

## Manual Deployment

You can also trigger a manual deployment:
- Go to **Actions** tab in your repository
- Select **Deploy to GitHub Pages** workflow
- Click **Run workflow** → **Run workflow**

## Troubleshooting

- **404 errors**: The workflow automatically sets `BASE_URL` based on your repository name. If you see 404s, check that GitHub Pages is enabled and the deployment completed successfully.
- **Assets not loading / No styling**: This usually means the `BASE_URL` wasn't set correctly during build. The workflow now auto-detects this, but you can verify in the Actions logs that `BASE_URL is: /<your-repo-name>/` appears in the build step.
- **Build failures**: Check the **Actions** tab for error messages

## Local Testing

To test the build locally:
```bash
pnpm build
pnpm preview
```

This will build and preview your site with the same configuration as production.

