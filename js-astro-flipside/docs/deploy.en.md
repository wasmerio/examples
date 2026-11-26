# Deploy

## GitHub Pages

On every push to `main`, `.github/workflows/deploy.yml` runs `npm run check && npm run build`. Then it publishes with the native GitHub Pages Actions deploy (`actions/deploy-pages`). The first time, open **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.

The first two fields at the top of `src/config.ts` must match how you publish. `site` is the URL. `base` is the sub-path.

| Deployment                | Repo name          | First field                  | `base`           | Result                                  |
| ------------------------- | ------------------ | ---------------------------- | ---------------- | --------------------------------------- |
| Project page              | any                | `"https://<user>.github.io"` | `"/<repo-name>"` | `https://<user>.github.io/<repo-name>/` |
| User or organization page | `<user>.github.io` | `"https://<user>.github.io"` | `""`             | `https://<user>.github.io/`             |

If the page has no styles or images, check `base` first.

## Vercel

Import the repo. You do not need to change any setting.

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Select **Add New → Project** and import the repo.
3. Select **Deploy**.

Every push to `main` deploys again, and each PR gets a preview URL. The output is static files, so the free Hobby plan is enough. You need no adapter.

## Other hosts

Netlify and Cloudflare Pages also work. See the [Astro deployment guide](https://docs.astro.build/en/guides/deploy/).
