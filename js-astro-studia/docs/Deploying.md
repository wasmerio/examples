# Deploying

`.github/workflows/deploy.yml` runs on every push and pull request to `main`, and on demand:
install, `prettier --check`, `astro check`, `docs:check`, `build`, `audit`, then
publish `dist/` to the `gh-pages` branch — the last step only on a non-PR push to
`main`. `docs:check` runs `scripts/gen-docs.mjs --check`, which fails the build
if the generated regions in `src/features.ts` and `docs/Features.md` have
drifted from `scripts/features.mjs` — see [Features](Features.md).

A second workflow, `docs.yml`, copies `docs/` into the repository's wiki. It
needs one secret and one thing done by hand first — see
[Publishing the docs to the wiki](#publishing-the-docs-to-the-wiki) at the
bottom.

The audit runs **before** the publish. That ordering is the entire point: a
broken link or a missing `.nojekyll` fails the workflow instead of reaching the
site.

## GitHub Pages

1. Settings → Pages → deploy from the `gh-pages` branch.
2. Set `SITE.url` in `src/consts.ts`. `astro.config.ts`,
   `src/pages/robots.txt.ts` and `scripts/audit-site.mjs` all read it — including
   the base, which comes from its path — so that is the only place the address is
   written down.
3. For a custom domain, add `public/CNAME` containing the bare hostname.

`public/.nojekyll` is already there and must stay. Without it Pages runs Jekyll
over the output, and Jekyll ignores directories beginning with an underscore —
which is where Astro puts every hashed asset. The failure mode is a live site
with no CSS, so `npm run audit` checks for it.

The audit also checks that `dist/CNAME` exists whenever `public/CNAME` does. The
deploy replaces the branch wholesale, so a CNAME that stops being emitted is a
domain that stops resolving, and nothing else would notice.

### A project page rather than a domain

Deploying to `https://<user>.github.io/<repo>/` needs a base path. One edit:

```ts
// src/consts.ts
url: 'https://<user>.github.io/my-repo',
```

**There is no `base` to set.** `astro.config.ts` reads it off that URL's own path
— `base: new URL(siteUrl).pathname`, where `siteUrl` is `SITE.url` unless the
`SITE_URL` environment variable overrides it (see [Another host](#another-host))
— so the path is not written down twice, and `scripts/audit-site.mjs` takes it
from the same place. A hand-written `base` is the second copy the derivation
exists to prevent.

The dev server follows it. `http://localhost:4321/` answers with a 302 to
`/my-repo/`, and `src/integrations/base-paths.ts` runs as dev middleware as well
as over the build, so the two serve identical URLs. Typing an unprefixed
`public/` path by hand — `/favicon-32.png` — still 404s, which is exactly what the
deployed site does.

That is genuinely all, but it is worth knowing why, because Astro's own
documentation warns that it is not:

> When using this option, all of your static asset imports and URLs should add
> the base as a prefix.

Astro prefixes the URLs it generates itself — hashed assets, imported images —
but not a `/cv/` you wrote by hand, and it will not guess: given `/something`
it cannot tell whether you meant it relative to the base or to the server root.
There is no built-in option that changes this.

The usual workaround is a `withBase()` helper called everywhere a path is
emitted. This template does not use one, because that approach cannot reach
the cases that break most often — an image path in `people.yml`, a slides link
in a paper's front matter, a plain `![](/assets/…)` in a post. Those are
strings in content, not expressions in a component.

Instead `src/integrations/base-paths.ts` rewrites the bytes: once over the build
output, and again on the way out of `astro dev`. You write `/cv/` everywhere, and
it is correct at the root, in a subdirectory and locally, because dev and the
build now serve identical URLs. (Starlight's ecosystem arrived at the same answer
for the same reason.) It is a no-op when no base is set.

Dev used to be the exception — every hand-written link unprefixed and `/` a 404 —
which is both the version of the site most of the work is looked at in and the
first thing a forwarded port hands a Codespaces user.

`npm run audit` then proves it worked: with a base configured, any internal link
or subresource on a page, and any URL in the web app manifest, that does not
carry it fails the build. So this cannot regress quietly into a site whose every
link is broken.

What gets rewritten is what gets audited: `.html`, `.xml` and `.webmanifest`.
**Any other file under `public/` carrying URLs of its own is neither rewritten
nor checked**, so prefix those yourself. `site.webmanifest` was that bug — its
three icon URLs shipped unprefixed and all three 404ed on a project page, and no
page links to them, so nothing noticed.

**Two cases the rewrite cannot reach**, both because the URL is not an attribute:

- a client-side script building a path at runtime. `src/pages/blog/index.astro`
  has one, and reads `import.meta.env.BASE_URL` directly. Do the same if you add
  another.
- `src/pages/feed.xml.ts`: an RSS `<link>` is an element body, so the endpoint
  puts the base on each item link itself.

**A note on `robots.txt`.** Crawlers only read `/robots.txt` at the origin
root, so on a project page yours is at a path nothing will fetch. That is a
property of GitHub Pages, not of this template — the `sitemap-index.xml` URL
in it is still correct, and submitting the sitemap directly to Search Console
works regardless.

## Serving your own 404

GitHub Pages serves `/404.html` for a miss automatically, so nothing is needed
there. Other hosts do not: Apache hands a miss to whatever `ErrorDocument` says,
which by default is the hosting panel's generic page rather than yours. Put this
in `public/.htaccess` and it is copied into the build verbatim:

```apache
ErrorDocument 404 /404.html
```

`ErrorDocument` needs `AllowOverride FileInfo`, so check that is on before
assuming it worked — a silently ignored directive looks exactly like a working
one until someone mistypes a URL.

## Another host

Nothing here needs GitHub. The build is a directory of static files with no
server-side anything.

Under the default URL policy every route is `<route>/index.html`, which every
static host serves correctly without configuration. Point the host at `dist/`
— or, as fuchss.org does, have a web server pull the `gh-pages` branch.

### A second host for the same build

`SITE.url` is where the site lives, and editing it is the normal way to move.
But a preview host serves the same commit at a different origin, and you cannot
edit a file per deploy. So one environment variable overrides that one value:

```bash
SITE_URL=https://astro-studia.netlify.app npm run build
```

`astro.config.ts` reads it for `site`, for `base` and for the PDF list;
`BaseHead.astro` and `pub/ScholarMeta.astro` take it from `Astro.site`, so
canonicals, `og:` tags and the Scholar metadata follow; `robots.txt.ts` names it
in the `Sitemap:` line; and `scripts/audit-site.mjs` honours it too, so you can
audit a build made for another origin. Unset — which is every normal build —
nothing changes, and `SITE.url` remains the only thing a site owner edits.

On Netlify the build command is

```
SITE_URL=$DEPLOY_PRIME_URL npm run build
```

with `dist` as the publish directory. `DEPLOY_PRIME_URL` is Netlify's own
per-deploy variable: the site URL for a production deploy, the
`deploy-preview-<n>--…` URL for a pull request, so one command covers both.
It has to go in the command and not in `netlify.toml`'s `[build.environment]`,
whose values are literal and would pass `$DEPLOY_PRIME_URL` through unexpanded.
Node comes from `.nvmrc`, which Netlify reads before its own default.

Such a host is a copy, not the original, so give it
`X-Robots-Tag: noindex` — Netlify sends that on deploy previews by itself, but
not on the production `*.netlify.app` URL.

## The URL policy

`URL_POLICY` in `src/lib/paths.ts` is the one place this is decided, and it
has two values:

- **`'directory'`** (the default): every page is `<route>/index.html` and
  every URL ends in a slash — `/papers/de-officiis/`. This is Astro's
  `trailingSlash: 'always'` with `build.format: 'directory'`.
- **`'preserve'`**: a page's file mirrors its source file. Every route in this
  template is an `index.astro` in a directory and keeps its slash — except
  the paper pages, which are `src/pages/papers/[slug].astro` and so become
  flat files published as `/papers/de-officiis`, no slash, no extension.
  This is `trailingSlash: 'ignore'` with `build.format: 'preserve'`.

The second exists for a site that cannot move. ardoco.de published its paper
pages as `/c/icse25` for years; they are indexed, cited and linked that way,
and a template that could only emit `/c/icse25/` would be asking it to break
every one of those links. Flip the constant and nothing else needs an edit:

- `astro.config.ts` derives both Astro settings from it.
- `paperPath()` is the one link helper whose shape differs.
- `routePath()` turns `Astro.url.pathname` — which under `'preserve'` is the
  **file** path, `/papers/de-officiis.html` — back into the address, for the
  canonical link, `og:url` and the Scholar/JSON-LD URLs. Only `BaseHead.astro`
  and `ScholarMeta.astro` build a page URL, and both go through it.
- `src/pages/feed.xml.ts` emits every item link as a full URL, because
  `@astrojs/rss` re-shapes a relative one: its `trailingSlash` option appends
  a slash to every link by default and strips one from every link when false,
  and a feed that can carry both blog posts and flat paper pages needs
  neither. ardoco.de shipped that bug — every link in its feed 404ed.
- `src/integrations/sitemap-shape.ts` rewrites each sitemap entry to the file
  that was actually emitted, because `@astrojs/sitemap` keys its trailing
  slash on `build.format === 'directory'` and under `'preserve'` publishes
  `/people` for a page that is `people/index.html`.

`npm run audit` is what makes the policy enforceable: every internal link,
canonical, sitemap entry and feed link is resolved to a file **by its exact
shape** — `/a/b/` is `a/b/index.html` and nothing else, `/a/b` is `a/b.html`
and nothing else — so a link and a file that disagree fail the build instead
of becoming a 404 on the host. The check used to accept either spelling,
which is precisely how a build under the wrong pairing passed every check
while linking to files that did not exist.

Want a different mix — flat project pages, say? Move that route between
`<name>.astro` and `<name>/index.astro`, teach its helper in `paths.ts` what
`paperPath()` knows, and the audit tells you about anything you missed.

## What stays in `public/`

`public/` is copied verbatim, so everything in it is a URL you have promised to
keep. That is the test for putting a file there, and the reason the list is
short:

| Path                                                                         | Why it needs a fixed URL                                        |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png`, `site.webmanifest` | browsers and app installers fetch these by name                 |
| `.nojekyll`                                                                  | the host reads it, not a page                                   |
| `assets/img/og.png`                                                          | named by an absolute URL in a `<meta>` tag                      |
| `assets/img/brand-mark.svg`                                                  | a configured path, `SITE.brandLogo` — see [Theming](Theming.md) |
| `assets/pdf/**`                                                              | linked from papers, and fed to the sitemap's `customPages`      |
| `assets/pgp-key/*.asc`                                                       | downloaded, and read at build time by `src/lib/pgp.ts`          |
| the images a post links to at full size                                      | an `<a href>` to an image is a URL like any other               |

Everything else is an image, and every image a collection schema names lives in
`src/assets/` and goes through Astro's pipeline instead: hashed filename,
intrinsic dimensions from the build, and `1x`/`2x` variants where a component
asks for them. See [Content](Content.md), "Where images live".

A PDF you have published is cited in other people's papers and indexed by Google
Scholar, DBLP and your institutional repository, so treat `public/assets/pdf/`
as append-only: replacing a file there in place changes what a citation resolves
to.

## Sitemap and robots

`@astrojs/sitemap` emits `/sitemap-index.xml`, which points at `/sitemap-0.xml`
and any further pages. `src/pages/robots.txt.ts` is generated from `SITE.url`
and points at the index, so the two cannot drift apart.

`npm run audit` asserts that linkage rather than the filename: it reads the
`Sitemap:` line out of the built `robots.txt`, requires that file to exist in
`dist/`, follows it to every sitemap it lists, and resolves every URL in them
to a file on disk. A crawler learns the sitemap's address from `robots.txt`
and nowhere else, so a sitemap under a name `robots.txt` does not point at is
one nothing will read — and a `robots.txt` pointing at a file that was not
emitted is a 404 handed to every crawler. Rename the sitemap however you like,
as long as `robots.txt` still names it.

The integration lists pages Astro builds and nothing else, and a file in
`public/` is not one — so `astro.config.ts` walks `public/assets/pdf/`
(recursively, since PDFs are usually filed by year) and feeds the result to
`customPages`. Adding a paper needs no upkeep there.

That matters more on an academic site than it sounds: those PDFs are the single
highest-value thing to have indexed, because Google Scholar and DBLP find papers
that way. Both sites this template came from hand-rolled their entire sitemap
for this one capability.

## The og:image

`public/assets/img/og.png` is the card a link to your site renders with, and the
shipped one says "replace this" in 76px type so you notice. It is 1200×630,
which is what every platform crops from.

`SITE.ogImage` points at it, as a root-absolute path. `BaseHead.astro` makes it
absolute by concatenating the origin rather than with `new URL()`, which would
resolve `/assets/…` against `https://user.github.io/repo` and silently drop the
`/repo` — a card image that 404s on exactly the hosts that need a base.

Set `SITE.ogImage` to `null` and `BaseHead.astro` falls back
to `twitter:card: summary` — the small text-only card — because
`summary_large_image` with no image is a blank rectangle, which is worse than
the card it replaced.

For a per-page image, take an optional `image` prop through `BaseHead` the way
`title` and `description` already work.

## The two opt-in workflows

`update-github-metadata.yml` and `update-citations.yml` refresh
`src/data/github-metadata.json` and `src/data/citations.yml` and commit the
result. Neither ships on a schedule; uncomment the `schedule:` block to give one
a cadence. `update-citations.yml` is otherwise on demand only, but
`update-github-metadata.yml` **also runs on a push to `main` touching
`src/data/repositories.yml`**.

Neither needs a secret. Both push with the built-in `GITHUB_TOKEN`, and since a
push made with it triggers no other workflow, each then starts `deploy.yml`
itself with `gh workflow run` — which is why they ask for `actions: write`. That
step has no fallback, because the failure that matters here is a green job whose
result silently never ships. Each rebases before pushing, so the two can run
close together.

The Scholar one additionally tolerates its own timeout. Scholar rate-limits
hard and has no API, so a run that cannot finish is routine — the counts stay
as they are until next time. `scholar_userid` must be set in
`src/data/socials.yml` or the script exits saying so.

Neither is needed to build. Both output files are committed, which is what lets
a fresh clone build with no network, no token and nothing to rate-limit.

## Publishing the docs to the wiki

`docs/` in this repository is the source of these pages, and
`.github/workflows/docs.yml` copies it into the repository's GitHub wiki on every
push to `main` that touches `docs/**` or the workflow file itself — plus on
demand from the Actions tab.

Four steps, once:

1. **Initialise the wiki.** Open the repository's **Wiki** tab and create one page
   by hand, with any content at all. The `<repo>.wiki.git` repository does not
   exist until somebody does this, and nothing can create it from the API — so
   before it exists the workflow's checkout fails with "repository not found".
   Whatever you write is overwritten on the first run.

2. **Create a CLASSIC personal access token.** Settings → Developer settings →
   Personal access tokens → **Tokens (classic)** → Generate new token (classic).
   Tick **`repo`** for a private or organisation repository; **`public_repo`** is
   enough for a public one.

   It has to be a classic token. GitHub's fine-grained permission list has **no
   wiki entry** — go through "Permissions required for fine-grained personal
   access tokens" and there is nothing to grant — so a fine-grained token that
   looks correctly scoped, `Contents: Read and write` and all, still cannot push
   to a wiki. Neither can the built-in `GITHUB_TOKEN`, for the same reason.

3. **Add it as the repository secret `PAT`.** Settings → Secrets and variables →
   Actions → New repository secret, named exactly `PAT`. Only this workflow
   reads it; the two data-refresh workflows above use the built-in token.

4. **Push to `main`.** Or run "Publish the wiki" from the Actions tab.

The workflow checks for steps 1 and 3 before it does anything, and says which one
is missing. It has to, because they otherwise produce the same "repository not
found" from `actions/checkout` while wanting opposite fixes: one is "go and make a
wiki page", the other is "the token is the wrong kind".

One case those guards cannot catch, on a **public** repository: anonymous read of
the wiki is allowed, so a token with no write access clears both of them and fails
at the commit step with git's own "Write access to repository not granted". That is
still step 2 — a fine-grained token, most likely.

### What it does, and the one transformation

It **replaces** the wiki wholesale: everything but `.git` is removed, then
`docs/*.md` is copied in. `docs/` is the source of truth, so a page deleted there
has to disappear from the wiki, and a page somebody typed into the web UI is not
something to preserve. `_Footer.md` says so on every page.

The filenames are already wiki page names — flat, `Title-Case-With-Hyphens.md`,
which GitHub renders as "Title Case With Hyphens" — so there is nothing to
generate and no index to maintain. `_Sidebar.md` and `_Footer.md` are the wiki's
own conventions for the navigation column and the footer.

One `sed` reconciles the two readers. Inside `docs/` a link is written
`[Deploying](Deploying.md)`, because browsing `docs/` on GitHub is where most
people will read these pages and there a bare `](Deploying)` resolves to nothing.
On the wiki it is the other way round: `](Deploying.md)` opens a raw file view
rather than the page. So the `.md` comes off on the way in, and neither reader has
to be broken for the other.

The rewrite is deliberately narrow — the basename must start with an uppercase
letter and contain no slash — so a link that reaches outside the page set, such as
one to `../README.md`, is left exactly as written. An `#anchor` survives.

### If you adopted this template

**The workflow is pinned to the upstream repository and does nothing in yours.**
Its job carries

```yaml
if: github.repository == 'dfuchss/astro-studia'
```

so in a fork, or in a repository made with "Use this template" or `degit`, the job
is skipped cleanly: it never tries to push to somebody else's wiki and never fails
on a `PAT` secret you had no reason to set. `github.repository` rather than a fork
check, because an adopted copy of a template is not a fork and a fork check would
let it straight through.

A skipped job with no explanation reads like a broken one, so: that is the whole
reason. **To publish your own wiki**, change that one line to your own
`owner/repo` and follow the four steps above. Nothing else in the file needs an
edit.

`docs/` and the workflow are both yours now, and `npm run init` does not offer to
remove any of it. These pages document code you now own and still have to
operate — the URL policy, the contrast floor, the contact schema, the feature
flags, the checks your CI runs — and the workflow publishes whatever is in
`docs/`, so replacing the prose leaves you a working documentation pipeline
rather than one to rebuild. Inert with a comment saying how to switch it on is
a better default than gone: a file you did not ask for costs one `if` line to
read, whereas a pipeline you have to rebuild from scratch costs an afternoon
and is the thing people therefore never do.

[Features](Features.md) is no different. Its table is generated from
`scripts/features.mjs` by `scripts/gen-docs.mjs`, and `npm run docs:check` is
what keeps the two from drifting apart. Nothing offers to delete either
script, so that check stays valid for as long as the page does.
