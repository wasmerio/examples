# Getting started with starglow

starglow is an Astro theme for a personal site with a blog, short notes and a project list. This guide takes you from an empty folder to a built site.

## Requirements

- Node.js 22.18 or later. The exact version used in CI is in `.node-version`.
- pnpm. The version is pinned in the `packageManager` field of `package.json`.
- Git. Note dates come from git history, so the site should live in a repository.

## Create the site

Clone starglow and keep it as a remote named `starglow`, so you can merge theme updates later:

```bash
git clone https://github.com/glowing-space/starglow.git my-site
cd my-site
git remote rename origin starglow
```

`npm create astro@latest -- --template glowing-space/starglow` and GitHub's "Use this template" button also work, but they copy the files without starglow's history, so every later update starts with a large merge.

## Run it locally

```bash
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:4321/`. Drafts are visible there with a Draft badge, and they never reach a production build.

### With Docker instead

If you prefer not to install Node on the host, `./dev.sh` runs every command in a container. It needs Docker with the compose plugin.

```bash
./dev.sh          # dev server on port 4321
./dev.sh build    # production build into dist/
./dev.sh ci       # the full check set that CI runs
```

`./dev.sh pnpm <args>` runs any pnpm command in the same container.

## Set your site URL

The site origin has exactly one source: the `SITE_URL` environment variable, read by `astro.config.ts`. Canonical links, the sitemap, RSS and social images all use it.

```bash
SITE_URL=https://example.com pnpm build
```

You can also put `SITE_URL=https://example.com` in a local `.env` file. For the included GitHub Pages workflow, add a repository variable named `SITE_URL` (Settings, Secrets and variables, Actions, Variables). When the variable is not set anywhere, the default at the top of `astro.config.ts` is used. The value must be an origin only: no path, query or hash. starglow does not support an Astro `base` path, so host it at the root of a domain or subdomain.

## Make it yours

1. Edit `starglow.config.ts`: title, author, description, timezone, socials. See [Configuring starglow](./02-configuration.md).
2. Replace the pages in `src/content/pages/` (home intro, about, contact).
3. Delete the example posts, notes and projects, then add your own. See [The content model](./03-content-model.md).

## Build and deploy

```bash
pnpm build
```

The build runs `astro check`, the Astro build, the search index and a placeholder check. The output in `dist/` is plain static files. Any static host works: GitHub Pages, Cloudflare Pages, Netlify or your own server.

The repository ships two GitHub Actions workflows in `.github/workflows/`: `checks.yml` for pull requests and `deploy.yml`, which publishes to GitHub Pages on a push to `main`. The deploy runs the placeholder check in strict mode, so it fails while any placeholder marker is left in your content.
