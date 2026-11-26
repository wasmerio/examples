<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Popular](https://github.com/mariatta/astro-theme-popular) Astro theme by mariatta, copied from commit `83fb4f13fdc81d49ae518eb12e231f11d26876c3` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-popular.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
  - Set `site` in astro.config.mjs to the Wasmer demo URL, because 8 home page links pointed at example.com.
- **Environment variables:** None.
- **Credit:** theme by [mariatta](https://github.com/mariatta), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Popular: an Astro theme for meetups & communities

> *Built to make your community seen and famous.*

> **AI agents / automated contributors:** read [AGENTS.md](AGENTS.md) before making changes. It covers the repo layout, build commands, the Hugo-Astro parity contract, and content conventions.

> **Something not working as described?** Please [open an issue](https://github.com/Mariatta/astro-theme-popular/issues/new) as you hit it, while it's fresh: a command that errors, a step that's out of date, a sentence you had to read three times. Setup friction is a bug. Reporting it here gets it fixed upstream, so the next person doesn't hit the same wall. Fixes to the wording are welcome as pull requests too.

**Popular** is a warm, community-first [Astro](https://astro.build) theme for meetups, user
groups and small events. Named after the song *Pop!ular* by Darren Hayes, it is the Astro
twin of [`hugo-theme-popular`](https://github.com/Mariatta/hugo-theme-popular). Both share the same design tokens, CSS,
behaviour JS and content model; see **PARITY.md** for the cross-repo contract.

- Composable **home page** (hero, stats, features, auto next-event, latest posts, organizers, testimonials, CTA)
- **Blog** with tag filtering, tag pages, RSS, and per-post speaker bios
- **Events** that split into *upcoming* and *past* automatically, with speaker profiles, venue pages (address, buzz-code arrival notes, accessibility) and check-in instructions
- **Organizers / team** page
- **Docs** (handbook & runbooks) with scroll-spy TOC and **checklists that remember progress**
- Dark footer with **land-acknowledgement** slot and social links
- **Alt text, required**: CI builds every site and fails if any image lacks alt text
- **One-command imports**: populate events, speakers and venues from Sessionize or a spreadsheet (`scripts/`), cross-referenced and dependency-free
- **Agent & human friendly**: ships [`AGENTS.md`](AGENTS.md) so AI coding agents follow the same rules as human contributors
- **Translatable UI**: every template string lives in one place (Hugo `i18n/`, Astro `STRINGS` config), so a site can run in any language
- Re-brand the whole theme from `src/config.ts`, no CSS edits needed

**Full documentation** lives on the theme's project site (deployed from the Hugo
repo): start at `/docs/quick-start/?fw=astro`. This README covers the essentials.

**Multi-author blogging:** posts support `authors: ["slug"]` (profiles in
`src/content/authors/` with bio, photo, socials, website → linked profile pages)
and inline `guestAuthors` for one-off guest writers, plus a plain `author` string fallback.

## Quick start

Start a site with the scaffolder. You get a small project that **depends on**
the theme, so updating is `npm update astro-theme-popular` rather than diffing
tags and re-copying files:

```bash
npm create popular-site@latest my-community
cd my-community
npm install
npm run dev          # http://localhost:4321
```

Pick the neutral **"Your Community" starter** (the default) or any of the four
fictional demos as a fuller example to edit down: **Rocky Cove Aquarium Club**
(teal), **Lucky Town Foodie Club** (copper), **KDrama Fan Club** (indigo) and
**Truly Madly Riley** (gold, a personal site for one fictional superfan). All
communities and venues in them are made up for demonstration.

Live: the [starter](https://mariatta.ca/astro-theme-popular/) is the deployment
root, and the [demo gallery](https://mariatta.ca/astro-theme-popular/demos/)
links the other four.

### Working in this repo

Each demo is its own workspace consuming the package, so there is no activation
step: build or serve one where it lives.

```bash
npm install                              # one install for every workspace member
npm run dev --workspace demos/aquarium   # or: npm run demo:aquarium
npm run build --workspaces               # build everything
```

`DEMO_BAR` in a demo's `popular.config.ts` drives the in-page switcher; it is
`null` on the starter and on anything the scaffolder writes, so it never
appears on a real site.

## Make it yours

| What | Where |
|---|---|
| Site name, logo, tagline, land acknowledgement | `src/config.ts` → `SITE` |
| Colours, fonts, radii (design tokens) | `src/config.ts` → `BRAND` (deep changes: `src/styles/tokens/`) |
| Navigation, header CTA, footer, socials | `src/config.ts` → `NAV`, `CTA`, `FOOTER`, `SOCIAL` |
| Home page sections | `src/config.ts` → `HOME` |
| Blog posts / events / organizers | `src/content/{blog,events,organizers}/*.md` |
| About, Code of Conduct, Get involved | `src/content/pages/*.mdx` |
| Handbook & runbooks | `src/content/docs/*.mdx` (use `<Callout>` and `<Checklist>`); sidebar ordered by `weight`, set it on every docs page |

Front-matter schemas live in `src/content.config.ts` (zod-validated) and are kept
1:1 compatible with the Hugo theme, so content moves between the two freely.

### MDX components

```mdx
import Callout from '../../components/Callout.astro';
import Checklist from '../../components/Checklist.astro';

<Callout tone="tip" title="Two-deep rule">
  Aim for **two** organizers at every event.
</Callout>

<Checklist id="rb-venue" items={[
  'Shortlist 2–3 venues',
  'Confirm step-free access',
]} />
```

`Checklist` progress persists in the visitor's browser (`localStorage`), using the same
key format as the Hugo theme.

## Helper scripts

- `scripts/sessionize-import.py`: populate `src/content/events/` and `src/content/speakers/`
  from a [Sessionize](https://sessionize.com) event's public "API / Embeds" endpoint:

  ```bash
  python3 scripts/sessionize-import.py --url https://sessionize.com/api/v2/<embed-id>/view/All --site .
  ```

  Existing files are never overwritten, so edit freely after importing.

- `scripts/spreadsheet-import.py`: the same import from one spreadsheet with tabs for
  Speakers, Venues, Organizers and Events (dependency-free .xlsx or per-tab CSVs).
  `--make-sample community.xlsx` writes a starter workbook (one ships at
  `scripts/sample-community.xlsx`); import it with
  `--xlsx community.xlsx --site .`.

The helper scripts have a dependency-free test suite: `python3 -m unittest discover -s scripts/tests` (also run in CI).

## Deploying

Static output: deploy `dist/` to Netlify, GitHub Pages, Cloudflare Pages, etc.
Set `site` in `astro.config.mjs` for correct RSS/OG URLs.

**Serving from a subpath** (a GitHub project page lives at `user.github.io/repo/`)
is supported: set `site` and `base` in `astro.config.mjs`, and every link, image
and feed URL picks it up. Your config and content need no changes, paths keep
their leading slash.

```js
export default defineConfig({
  site: 'https://you.github.io',
  base: '/my-community',
  integrations: [mdx(), sitemap(), popularMarkdown()],
});
```

`scripts/setup.py` writes both from your `base_url` answer, along with a
ready-to-run GitHub Pages workflow at `.github/workflows/deploy.yml` (only when
the site has no workflows of its own). If you write your own components or
pages, wrap the URLs you emit: `import { withBase } from './lib/url'` (npm
consumers: `from 'astro-theme-popular/url'`), then `href={withBase('/about/')}`.

## Support the theme

Popular is free and MIT licensed. If it made your community site easier, there are three
ways to support the work:

- **Star the repo** so other organizers can find it
- **Tell others about it**: share it with another meetup, club or community, or use it
  yourself for your next community site
- **[Sponsor on GitHub](https://github.com/sponsors/Mariatta)**

## Credits & license

Typography: **Inter** & **Quantico** (Google Fonts). Icons: **Font Awesome 6**.
MIT: see `LICENSE`. Fork it, adapt it, and share your community's version.

## Versioning & staying up to date

Releases are tagged `v0.x` (semver, in lockstep with
[`hugo-theme-popular`](https://github.com/Mariatta/hugo-theme-popular)); the
1.0 release will mark the content model and brand keys as stable. Changes are
documented in [CHANGELOG.md](CHANGELOG.md). To hear about updates, watch this
repo (Watch → Custom → Releases) or subscribe to the
[releases feed](https://github.com/Mariatta/astro-theme-popular/releases.atom).
Since Astro sites vendor the theme (you copy this repo), updating means
re-copying the files you haven't customized; the changelog tells you which
areas moved, and the full guide is at
[/docs/updating/](https://popular.mariatta.ca/docs/updating/).

Releases are cut by the Release workflow after the CHANGELOG entry is merged:
`gh workflow run release.yml -f version=X.Y.Z`, run in **both** repos. It
validates the CHANGELOG section and cross-repo parity, then tags `vX.Y.Z` and
publishes the GitHub Release with that section as the notes. On this repo it also checks that
`package.json` matches the version.

