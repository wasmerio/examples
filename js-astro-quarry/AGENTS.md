# Quarry — guide for AI agents

Read this before editing the theme. It is the map of edit points: find the file here first, change
that file, then run the checks at the bottom.

Quarry is a static Astro theme. No CMS, no server output, no database: Markdown and JSON in
`src/content/`, built to HTML in `dist/`.

## Commands

```bash
pnpm install
pnpm dev              # http://localhost:4321, styleguide at /styleguide (dev only)
pnpm build            # static output to dist/
pnpm preview          # serves dist/
pnpm check            # astro check (types). Use `pnpm check 2>&1 | head -40`
pnpm lint
pnpm format           # skips src/content/**/*.mdx on purpose, see below
pnpm check:contrast   # WCAG AA for every colour token, light and dark

# What CI also runs, after the build (no dependency of their own):
pnpm dlx @lhci/cli@0.15.1 autorun                    # Lighthouse, mobile, 95+ on four categories
pnpm dlx linkinator@8.1.0 dist --recurse --skip '^https?://(?!(localhost|127\.0\.0\.1|\[::1\])[:/])'
```

`pnpm check && pnpm build` must pass after any change. Change a colour and `pnpm check:contrast`
must pass too.

## This theme

A marketing site for a developer tool. The discipline is a printed technical reference: rules and
numbers, not cards and shadows.

The signature is the **marginal index**: a numbered label that stays in the left margin while its
section scrolls, on the home page and on pricing. It is pure CSS — the number is a counter, so it
is never typed — and `features.marginalIndex` drops it inline above the heading instead.

One measure (38rem) carries the hero, the pricing and the posts alike; that the typesetting does
not break from one page to the next is the thing this theme is for. One accent colour, on the
numbers, the current position and the focus ring, and nothing else. `--radius` is `3px`.

This is the free (MIT) edition. Quarry Pro adds the documentation site, search, the changelog,
long-form MDX components, the pricing switch and matrix, series and author blocks, drawn share
cards and three more colour presets. Do not reimplement any of them here.

## Where to edit

| To change                                                       | Edit                                                                     | Notes                                                                                         |
| --------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Site name, description, URL, locale, author, default share card | `src/config.ts` (`site`)                                                 | Never hardcode any of it in a component                                                       |
| Header links, the one CTA, footer groups, social links          | `src/config.ts` (`nav`)                                                  | Social icons are Lucide names; your own SVG goes in `src/icons/`                              |
| Every word the theme prints around content                      | `src/config.ts` (`ui`)                                                   | Marketing pages keep their copy in their own `.astro` files                                   |
| Title template, Twitter handle, JSON-LD publisher               | `src/config.ts` (`seo`)                                                  | The share card for every page is `site.defaultOgImage`                                        |
| Posts per page, reading time                                    | `src/config.ts` (`blog`)                                                 | Reading time is minutes at 230 words, computed from the body                                  |
| Contact form endpoint, address, response time                   | `src/config.ts` (`contact`)                                              | A plain form POST; any service that accepts one works                                         |
| Dark-mode toggle, the marginal index                            | `src/config.ts` (`features`)                                             | A flag lands here only when something reads it                                                |
| Analytics provider and id                                       | `src/config.ts` (`analytics`), `src/components/common/Analytics.astro`   | `provider: null` renders nothing. Plausible, GA4 or Umami; `host` for a self-hosted one       |
| Colours, measures, spacing, radius                              | `src/styles/theme.css`                                                   | Override tokens from `src/styles/tokens.css`; do not edit that file. Preview at `/styleguide` |
| Webfonts                                                        | `fonts:` in `astro.config.mjs`                                           | Public Sans on `--font-body`, JetBrains Mono on `--font-mono`. Self-hosted; no font CDN       |
| Syntax colours                                                  | `--code-*` in `src/styles/tokens.css`, `codeTheme` in `astro.config.mjs` | The Shiki theme is the site's own tokens, which is why contrast can be measured               |
| `<head>`, meta, JSON-LD                                         | `src/components/common/SEO.astro`                                        | Pages pass `title` and `description`; the rest is derived                                     |
| Page shell, skip link, fonts, theme script                      | `src/layouts/Base.astro`                                                 | One container for header, page and footer, so the body column never moves                     |
| A plain prose page (about, contact, legal)                      | `src/layouts/Page.astro`                                                 | Heading, optional lead, `.prose`                                                              |
| A numbered section on a marketing page                          | `src/components/common/Section.astro`                                    | `label`, `note`, `flag`, `numbered`, `as`. Wrap a run of them in `.rail`                      |
| Home page sections and their order                              | `src/pages/index.astro`                                                  | The data for each section is a `const` at the top of the file                                 |
| Pricing page                                                    | `src/pages/pricing.astro`, `src/content/plans.json`                      | The plans are content; the page only sets them                                                |
| The footer theme credit                                         | `src/components/common/Footer.astro`                                     | Free edition only. `docs/customization.md` says how to remove it                              |
| Posts                                                           | `src/content/blog/<slug>.md` or `.mdx`                                   | The filename is the URL. `author` is the printed name                                         |
| Content fields and validation                                   | `src/content.config.ts`                                                  | zod. A new field must be optional or have a default, or every existing file fails             |
| Collection reads, sorting, dates, money, reading time           | `src/lib/content.ts`                                                     | The one place that calls `getCollection`. Add a new list here, not in a page                  |
| The feed, `robots.txt`                                          | `src/pages/rss.xml.ts`, `robots.txt.ts`                                  | `robots.txt` is a route, not a static file: the sitemap line has to be absolute               |
| The product drawing on the home page                            | `src/components/sections/ProductFrame.astro`                             | Rules and mono text, no image to license. Swap the rows or replace the file                   |
| Which tokens are contrast-checked                               | The two lists at the top of `scripts/check-contrast.mjs`                 | Add a token there when you add one                                                            |
| What CI runs, the Lighthouse pages                              | `.github/workflows/ci.yml`, `lighthouserc.cjs`                           | The page list filters itself against `dist/`                                                  |
| The documentation for buyers                                    | `docs/customization.md`, `docs/content.md`, `docs/deploy.md`             | Every config group and content field is named in one of the three. Change one, change the doc |

## Content model

Two collections, defined in `src/content.config.ts`:

- **plans** (`src/content/plans.json`) — one object per plan, `order` top to bottom. `featured`
  marks one of them; the page reads nothing else about them.
- **blog** (`src/content/blog/*.md`, `.mdx`) — the filename is the slug. `author` is the printed
  name, a plain string rather than a reference.

Computed, and therefore not fields: reading time, the tag counts, the tag slugs, the pagination,
every URL. Do not add a field for any of them.

## Do not

- Add a second accent colour, or a coloured section background. One accent, on the numbers, the
  current position and the focus ring.
- Replace rules with shadows, gradients, glass, pills or rounded cards. `--radius` stays `3px`,
  and the same-width three-card grid is the shape this theme exists to avoid.
- Set a label in small uppercase sans with wide tracking. Labels here are mono, 11px, `--faint`;
  that is what `.rail-label` is.
- Give a new block its own colour, tint or border style. `--surface` behind a block and a hairline
  beside it is the whole vocabulary.
- Add a client-side framework, or link a CDN for a font, script or icon. The only third-party
  script is the analytics tag, behind a config switch and off by default.
- Add client JavaScript for something CSS does. Nothing on this site ships any but the theme
  toggle; a `<fieldset>` used as a switch needs `min-inline-size: 0`, or its widest child pushes
  the page wider than a phone.
- Remove `cssTarget` in `astro.config.mjs`. Lightning CSS then lowers `light-dark()` into
  `prefers-color-scheme` blocks and the theme toggle stops working.
- Reformat `src/content/**/*.mdx`. Prettier's Markdown printer flattens a fenced block inside a
  JSX element; `.prettierignore` holds the line that prevents it.
- Use a raw `<img>`. Use `astro:assets`. There are no bitmap assets in this theme, and a drawing
  in rules and mono text is usually the right answer here.
- Remove the skip link, focus rings, alt text or aria-labels. Breaking at 360px is a bug, and a
  scrollable box needs `tabindex="0"` or it cannot be reached from the keyboard.
- Leave a link inside a sentence without an underline. Colour alone fails WCAG 1.4.1, and
  Lighthouse catches it as `link-in-text-block`. Standalone links (nav, list rows) may stay bare.
- Write stock copy. The demo content is a tool's own voice: plain, specific, and about what the
  thing does and does not do.
- Write the theme's own comments, strings or docs in any language other than English.

## Workflow

1. Find the file in the table above. If the request is not covered by it, say which file you
   intend to touch before touching it.
2. Make the change.
3. Run `pnpm check && pnpm build`, plus `pnpm check:contrast` for colour, and report the result.
4. For layout or colour work, check the page in the browser at 360px as well as desktop.
