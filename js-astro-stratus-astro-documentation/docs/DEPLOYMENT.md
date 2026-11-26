# Deploying to CloudCannon

This starter is preconfigured for [CloudCannon](https://cloudcannon.com/). Connecting a
repository gives you a built site plus the visual editing the components are designed for —
no build settings to fill in by hand.

## What's already configured

| File                                      | What it does                                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `.cloudcannon/initial-site-settings.json` | Build defaults CloudCannon reads on first sync: SSG `astro`, `npm i`, `npm run build`, output `dist`, Node 24.      |
| `cloudcannon.config.yml`                  | Collections, data editing, the icon picker, and the globs that pull in every component's schema.                    |
| `.cloudcannon/structures/`                | One file per picker (page sections, card contents, form fields…), each gathering its components' schemas by glob.   |
| `.cloudcannon/routing.json`               | 404 handling, security headers (HSTS, nosniff, framing, referrer, permissions), and `X-Robots-Tag` on the 404 page. |
| `.cloudcannon/schemas/`                   | Templates for new files: a documentation page, a reference page, a page-builder page and a changelog release.       |

Because component schemas are aggregated by glob, a component you add is registered with the
editor automatically — there is no separate CloudCannon-side registration step.

## Create the site

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In CloudCannon, go to **Create a Site** and pick your Git provider from the **File source**
   dropdown, then choose your repository and branch under **Repository** / **Branch Setup**.
   Each CloudCannon site tracks one branch.
3. Set the **Static Site Generator** dropdown to **Astro**. Leave **Source** at the repository
   root unless you've nested the project in a subdirectory.
4. Build. CloudCannon picks up the settings above, runs `npm run build`, and serves `dist`.

CloudCannon's own [documentation](https://cloudcannon.com/documentation/) is the reference for
the account-side details — organizations, permissions, custom domains, and staging branches.

## Set your production URL

This is the one thing a fresh clone will get wrong, and it fails silently. `site` in
`astro.config.mjs` is the base for every absolute URL Astro emits — canonical tags, the
sitemap, the changelog's RSS feed, and the JSON-LD `@id` graph. Left at `https://example.com` the build
still succeeds and the pages still look right, while every one of those URLs points at a
domain you don't own.

```bash
npm run reset:starter    # prompts for it, along with the rest of the demo cleanup
```

Or set it by hand in two places: `site` in `astro.config.mjs`, and `url` in
`src/data/seo.json`. `npm run check` warns while either is still a placeholder; add
`npm run check:placeholders -- --strict` to your own CI to make it an error.

Use your custom domain here, not the CloudCannon testing domain, so the canonical URLs
you publish stay correct after you attach the domain.

## Search

Search is [Pagefind](https://pagefind.app/), indexed from the built output. `npm run build`
chains `npm run search:index` explicitly, so the index is generated wherever the site is
built — including locally:

```bash
npm run build && npm run preview   # ⌘K search works
```

On the dev server there is no index, so the overlay shows its unavailable notice.
`npm run search:dev` builds one you can search locally.

It's chained into the build command rather than left to npm's implicit `postbuild` lifecycle
hook, because `ignore-scripts=true` — a common hardening setting on build machines and in
developers' own npm configs — suppresses lifecycle hooks while leaving an explicit
`npm run search:index` working. A skipped index is invisible: the build succeeds and
`/search/` renders, it just never returns a result.

Pagefind ships platform binaries as optional dependencies, so `@pagefind/linux-x64` is pinned
in `optionalDependencies` alongside the equivalent `sharp` and `rollup` packages. Keep using
`npm run deps:sync` rather than bare `npm install` when changing dependencies — see the README.

## Before you go live

- `npm run check` — the full gate, including the placeholder warning.
- `npm run build && npm run preview` — production build with search indexed.
- Replace the template's branding. `npm run check:placeholders` lists what is still unset:
  - `src/data/seo.json` — your name, description, logo and favicons.
  - `src/data/header.json` — your logo, not the one in `src/assets/images/logo/`.
  - `src/data/pageTools.json` — your `repositoryUrl`.
  - `src/content/changelog/` — your releases, not the template's (the header badge shows the newest).
- `npm run lint:links` — a page renamed late in the project leaves dead links behind, and
  nothing else notices. Read its orphan warnings too: a page nothing links to is only
  reachable through search.

`npm run build` emits only the site. The `/preview-renders/<component key>/` routes the smoke
tests drive components through are added by `COMPONENT_PREVIEWS=true`, and are never part of a
production build.
