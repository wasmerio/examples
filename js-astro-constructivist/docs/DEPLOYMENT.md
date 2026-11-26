# Deploy Constructa

Constructa builds to a static `dist/` directory. There is no account service,
database, React hydration layer, or application server to configure.

Use Node.js 24 LTS and pnpm 12.16.1. Keep the lockfile in your repository and use
`pnpm install --frozen-lockfile` in CI.

The default build reads `cv.site.url` and `cv.site.base`. A deployment origin
must be an HTTP(S) origin without a pathname, query, fragment, or credentials;
the pathname belongs in `site.base`.

## Before deploying

```bash
pnpm run ci
pnpm build
pnpm preview
```

Replace example content and set the actual public address in `cv.json`.
`site.url` and `site.base` are deployment settings; `basics.url` is a profile
link and should not be used as a substitute.

## GitHub Pages

The intended upstream demo is:

```text
https://mirahikari.github.io/astro-constructivist/
```

For your own repository, configure:

```json
{
  "site": {
    "url": "https://your-name.github.io",
    "base": "/your-repository/"
  }
}
```

This is a fragment to merge into `cv.json`, not a full replacement.

1. Create your own copy using the GitHub template or Astro's `--template` option.
2. Commit your configuration and lockfile.
3. In **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
4. Run the repository's Pages deployment workflow or push to its configured
   deployment branch.
5. Wait for the deployment job to succeed and check its returned URL.

The workflow requires `contents: read`, `pages: write`, and `id-token: write`.
Its deployment job uses the `github-pages` environment. Depending on repository
policy, environment approval may be required; a successful local build does not
mean that this approval or deployment has happened.

`.github/workflows/pages.yml` runs on pushes to `main` and manual dispatch. It
first calls the reusable CI workflow, then builds the configured public site
and deploys its artifact. `.github/workflows/ci.yml` also checks pull requests
without deploying them. Quality gates and production-browser tests must succeed
before the Pages build proceeds. The browser matrix tests both `/` and
`/astro-constructivist/` with the static preview server, not only the dev server.

CI sets `SKIP_INSTALL_SIMPLE_GIT_HOOKS=1`; it does not install local Git hooks or
run an external auto-commit workflow. Native build dependencies still run their
normal permitted installation steps.

Astro's [official Pages guide](https://docs.astro.build/en/guides/deploy/github/)
describes `withastro/action` for build/upload and `actions/deploy-pages` for the
deployment. Use the versions pinned by the repository workflow, not an
unreviewed update merely to follow this prose.

### User or organization site

For a repository named exactly `your-name.github.io`, set `site.base` to `/`.
The origin is still `https://your-name.github.io`.

### Custom domain

Configure your DNS and the domain in GitHub Pages settings. Set `site.url` to
the HTTPS custom origin and `site.base` to `/`. If your chosen deployment setup
uses `public/CNAME`, it must contain only your real custom domain, not the
upstream demo's domain. Follow GitHub's domain-verification guidance to reduce
takeover risk.

### Base-path checklist

Do not stop after the homepage returns 200. On the deployed subpath, verify:

- CSS, scripts, fonts, the globe, and local project/gallery images load.
- Favicon, touch icon, Open Graph image, and poster assets resolve.
- Section and project anchors remain inside your site.
- Canonical, Open Graph URL, sitemap, and robots metadata use your public URL.
- SVG/PNG poster export and browser print still work.
- A refreshed deep link, such as `#projects`, opens the correct content.

Local public paths in configuration should not contain your repository name;
the theme's asset resolver adds the configured base once.

### Build-time overrides for CI and previews

These environment variables override the deployment fields without editing
content. Ordinary personalization still belongs in `cv.json`.

| Variable | Meaning |
| --- | --- |
| `SITE_URL` | HTTP(S) public origin overriding `cv.site.url`. |
| `BASE_PATH` | Slash-prefixed deployment path overriding `cv.site.base`. |
| `PLAYWRIGHT_BASE_URL` | Full test-server URL including the base pathname. |
| `PLAYWRIGHT_SERVER_COMMAND` | Test server command; CI selects Astro's production preview. |

For example, in a POSIX shell:

```bash
SITE_URL=https://example.com BASE_PATH=/ pnpm build
BASE_PATH=/ PLAYWRIGHT_BASE_URL=http://127.0.0.1:4321/ \
  PLAYWRIGHT_SERVER_COMMAND="pnpm preview --host 127.0.0.1 --port 4321" \
  pnpm test:e2e
```

Use the same base for the build, preview, and test run. Do not publish a CI build
whose `SITE_URL` intentionally points at `example.com`; the Pages workflow
builds again from the deployment values in `cv.json`.

### Robots and web manifest

`robots.txt` and `manifest.webmanifest` are generated static endpoints. Robots
output includes the effective base-aware sitemap URL, or `Disallow: /` when
`site.seo.noIndex` is enabled. The manifest uses the configured name, language,
description, local favicon, and base-aware start/scope. It is a browser manifest,
not a service worker or a promise of offline operation.

On a GitHub Pages project, a file at `/your-repository/robots.txt` does not control
the whole `your-name.github.io` origin: crawlers normally request `/robots.txt`
at the origin root. Use the page's `noindex` metadata for a no-index deployment
and manage origin-root crawler policy separately when necessary.

## Other static hosts

The common settings are:

| Setting | Value |
| --- | --- |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm build` |
| Publish/output directory | `dist` |
| Node | 24 LTS |
| Package manager | pnpm 12.16.1 |

For a root-domain deployment, use that public origin and `site.base: "/"`.
Vercel and Netlify can use the included host configuration files. Cloudflare
Pages can build and publish `dist` as a static site. Configure provider projects,
permissions, and domains in the provider's own account; the theme does not do
that automatically.

Do not add an SPA catch-all merely because this is a JavaScript project. Astro
has already emitted the pages. Host-specific security headers and caching rules
do not automatically carry over to GitHub Pages.

## Troubleshooting

**Blank styles or broken images:** compare `site.base` with the public pathname
and inspect requests in browser developer tools. Remove duplicated repository
prefixes from image fields.

**Metadata still points at the demo:** update `site`, including SEO fields, and
rebuild. Social platforms may cache previews; inspect the generated HTML before
assuming a caching issue.

**The workflow cannot deploy:** confirm Pages uses GitHub Actions, workflow
permissions are allowed, and the `github-pages` environment is not awaiting
approval. Never paste a personal access token into `cv.json`.

**Wrong pnpm version:** the project pins 12.16.1. Fix the executable/version
selection instead of accepting a destructive dependency-tree replacement from
an unrelated package-manager version.

**Remote image fails:** use a public HTTPS image with a stable URL, or host a
licensed copy under `public/`. URLs that require cookies, expire, or reject
hotlinks are not reliable portfolio assets.
