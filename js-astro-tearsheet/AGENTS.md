# Tearsheet — guide for AI agents

Read this before editing the theme. It is the map of edit points: find the file here first, change
that file, then run the checks at the bottom.

Tearsheet is a static Astro theme for a paid newsletter. No CMS, no server output, no database:
Markdown and MDX in `src/content/issues/`, built to HTML in `dist/`.

## Commands

```bash
pnpm install
pnpm dev              # http://localhost:4321, styleguide at /styleguide (dev only)
pnpm build            # outputs dist/
pnpm preview          # serves dist/
pnpm check            # astro check (types). Use `pnpm check 2>&1 | head -40`
pnpm lint
pnpm format
pnpm test             # word counts, the cut, week labels
pnpm check:contrast   # WCAG AA for every colour token, light and dark
pnpm check:cut        # after a build: no members text anywhere in dist/

# What CI also runs, after the build:
pnpm dlx @lhci/cli@0.15.1 autorun                    # Lighthouse, mobile, 95+ on four categories
pnpm dlx linkinator@8.1.0 dist --recurse --skip '^https?://(?!(localhost|127\.0\.0\.1|\[::1\])[:/])'
```

`pnpm check && pnpm build && pnpm check:cut` must pass after any change. Change a colour and
`pnpm check:contrast` must pass too. Touch `src/lib/cut*.ts` and `pnpm test` too.

## This theme

A newsletter site with the manners of a trade journal: heavy rules, not cards; issue numbers hung
in the margin; an archive set like a ledger. One accent, the ledger green, on issue numbers, the
current nav item, the members button and focus. `--radius` is `0`.

The signature is **The Cut**. A members issue has a marker (`<!-- cut -->`, or `{/* cut */}` in
MDX) where the free part ends. `src/lib/cut-plugin.ts` removes everything after it from the
Markdown tree before rendering, so the members part is never in the HTML or the RSS feed. `src/components/issue/TheCut.astro` prints the 6px rule, the words-read meter and
the form in its place. Word counts come from the source in `src/lib/cut.ts`, which is not shipped.
This is the thing the theme sells; treat any change that could leak members text as a bug.

## Where to edit

| To change                                                        | Edit                                                                               | Notes                                                                                         |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Site name, description, URL, locale, author, default share image | `src/config.ts` (`site`)                                                           | Never hardcode any of it in a component                                                       |
| Header links, footer groups, social links                        | `src/config.ts` (`nav`)                                                            | Social icons are Lucide names; your own SVG goes in `src/icons/`                              |
| Every word the theme prints, the `/subscribe` pitch              | `src/config.ts` (`ui`)                                                             | Counts are functions for plurals; `site.locale` sets dates and numbers                        |
| Cadence, first issue number, The Cut switch, price, home rows    | `src/config.ts` (`newsletter`)                                                     | `theCut: false` changes what prints, not what is removed                                      |
| Plans on `/subscribe`                                            | `src/config.ts` (`plans`)                                                          | Prices are text, printed as written                                                           |
| Subscribe provider                                               | `src/config.ts` (`newsletter.username`), `src/lib/subscribe-target.ts`             | Buttondown. Another provider: return its action and email field name there                    |
| Title template, Twitter handle, JSON-LD publisher                | `src/config.ts` (`seo`)                                                            |                                                                                               |
| Dark-mode toggle                                                 | `src/config.ts` (`features`)                                                       |                                                                                               |
| Webfonts                                                         | `fonts` in `astro.config.mjs`                                                      | Fill `--font-body` and `--font-heading`. Self-hosted; no font CDN                             |
| Analytics provider and id                                        | `src/config.ts` (`analytics`), `src/components/common/Analytics.astro`             | `provider: null` renders nothing                                                              |
| Colours, widths, radius                                          | `src/styles/theme.css`                                                             | Override tokens from `src/styles/tokens.css`; do not edit that file. Preview at `/styleguide` |
| `<head>`, meta, JSON-LD                                          | `src/components/common/SEO.astro`                                                  | Pages pass `title` and `description`; the rest is derived                                     |
| Page shell, skip link, fonts, theme script                       | `src/layouts/Base.astro`                                                           |                                                                                               |
| A plain prose page (about, privacy, terms)                       | `src/pages/<name>.md` with `layout: ../layouts/Page.astro`                         |                                                                                               |
| Home page                                                        | `src/pages/index.astro`                                                            | Masthead, latest issue with its meter, the ledger                                             |
| Issue page                                                       | `src/pages/issues/[slug].astro`, `src/components/issue/IssueHead.astro`            | `IssueHead` hangs the number in the margin above 640px                                        |
| The Cut                                                          | `src/components/issue/TheCut.astro`, `src/lib/cut.ts`, `src/lib/cut-plugin.ts`     | Component prints; `cut.ts` counts; the plugin removes. Keep all three                         |
| Archive rows, the year groups                                    | `src/components/issue/Ledger.astro`, `YearLedger.astro`, `src/pages/archive.astro` |                                                                                               |
| The subscribe form                                               | `src/components/issue/SubscribeForm.astro`                                         | Plain HTML, no script. Pass a unique `id` when a page has two                                 |
| Topic pages                                                      | `src/pages/topics/[topic].astro`                                                   | One per topic in use                                                                          |
| Thank-you page                                                   | `src/pages/subscribed.astro`                                                       | Not in the sitemap, `noindex`                                                                 |
| Start here reading list                                          | `src/pages/start-here.astro`                                                       | `shelves` at the top: headings and issue ids. An id that no longer exists is skipped          |
| Sponsor and corrections pages                                    | `src/pages/sponsor.md`, `src/pages/corrections.md`                                 | Plain Markdown with `layout: ../layouts/Page.astro`                                           |
| Issues                                                           | `src/content/issues/<slug>.md` or `.mdx`                                           | The filename is the URL                                                                       |
| Issue fields and validation                                      | `src/content.config.ts`                                                            | A new field must be optional or have a default                                                |
| Issue list, numbers, dates, topic slugs                          | `src/lib/issues.ts`                                                                | The one place that calls `getCollection`. Pages use `getIssues()`                             |
| Feed, `robots.txt`                                               | `src/pages/rss.xml.ts`, `robots.txt.ts`                                            | The feed carries the free part only                                                           |
| Which tokens are contrast-checked                                | The lists at the top of `scripts/check-contrast.mjs`                               | Add a token there when you add one                                                            |
| What CI runs, the Lighthouse pages                               | `.github/workflows/ci.yml`, `lighthouserc.cjs`                                     | The page list filters itself against `dist/`                                                  |
| The documentation for users                                      | `docs/customization.md`, `docs/content.md`, `docs/deploy.md`                       | Change a config key or a field, change the doc                                                |

## Content model

One collection, **issues** (`src/content/issues/*.md`, `.mdx`): `title`, `dek`, `date`, optional
`updated`, `topics`, `ogImage`, `draft`. Full table in `docs/content.md`.

Computed, and therefore not fields: the issue number (date order from `newsletter.firstIssue`),
the ISO week label, members-only (a cut marker is present), word counts, the free share, the
minutes left, topic pages, every URL. Do not add a field for any of them.

## Do not

- Render, import or index an issue body anywhere except through the normal Markdown/MDX pipeline.
  `entry.body` holds the members text; printing it, putting it in the feed, a JSON file, a
  `data-` attribute or a script ships the members part. Use `issue.cut.free` for source text.
- Put an issue picture in `public/`. Files there ship whether or not anything links to them, so a
  members picture would be published. Issue pictures live in `src/content/issues/images/`.
- `import` a picture in an MDX issue for use after the cut. The import sits above the cut, so the
  file is built and published. After the cut use Markdown image syntax, which is removed with the
  text and checked by `pnpm check:cut`.
- Move a cut marker inside a list, quote or table. The build stops on it, by design.
- Disable or bypass `cutPlugin` in `astro.config.mjs`, or remove `pnpm check:cut` from CI.
- Upload a `dist/` from a failed build. `dist/.prerender/` can hold every issue in full.
- Add a second accent colour or a coloured section background. Retheme by replacing that one accent.
- Replace rules with shadows, gradients, glass, pills or rounded cards. `--radius` stays `0`.
- Set a label in small uppercase with wide tracking. Labels here are the heading face, mixed case.
- Draw a meter with a gradient. It is a `::before` whose width is `var(--read)`.
- Give an input a fixed colour such as `#fff`. Use `var(--background)`; dark mode depends on it.
- Add a client-side framework, or link a CDN for a font, script or icon. The only third-party
  script is the analytics tag, behind a config switch and off by default.
- Add client JavaScript for something CSS does. The archive filter is radios and `:has()`.
- Remove `cssTarget` in `astro.config.mjs`. Lightning CSS then lowers `light-dark()` into
  `prefers-color-scheme` blocks and the theme toggle stops working.
- Call `getCollection('issues')` in a page. Use `getIssues()`, or drafts leak and numbers shift.
- Use a raw `<img>`. Use `astro:assets`.
- Remove the skip link, focus rings, alt text or aria-labels. Breaking at 360px is a bug, and a
  scrollable box needs `tabindex="0"` or it cannot be reached from the keyboard.
- Leave a link inside a sentence without an underline. Colour alone fails WCAG 1.4.1.
- Run `prettier --write` on `pnpm-lock.yaml`. `.prettierignore` holds the line that prevents it.
- Write the theme's own comments, strings or docs in any language other than English.

## Workflow

1. Find the file in the table above. If the request is not covered by it, say which file you
   intend to touch before touching it.
2. Make the change.
3. Run `pnpm check && pnpm build && pnpm check:cut`, plus `pnpm check:contrast` for colour, and
   report the result.
4. For layout or colour work, check the page in the browser at 360px as well as desktop.
