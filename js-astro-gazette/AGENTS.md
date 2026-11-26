# Gazette — guide for AI agents

Read this before editing the theme. It is the map of edit points: find the file here first,
change that file, then run the checks at the bottom.

Gazette is a static Astro theme. No CMS, no server output, no database: Markdown and JSON in
`src/content/`, built to HTML.

## Commands

```bash
pnpm install
pnpm dev              # http://localhost:4321, styleguide at /styleguide (dev only)
pnpm build            # static output in dist/
pnpm check            # astro check (types). Use `pnpm check 2>&1 | head -40`
pnpm lint
pnpm format
pnpm check:contrast   # WCAG AA for every colour token, light and dark

# What CI also runs, after the build (no dependency of their own):
pnpm dlx @lhci/cli@0.15.1 autorun                    # Lighthouse, mobile, 95+ on four categories
pnpm dlx linkinator@8.1.0 dist --recurse --skip '^https?://(?!(localhost|127\.0\.0\.1|\[::1\])[:/])'
```

`pnpm check && pnpm build` must pass after any change. Change a colour and `pnpm check:contrast`
must pass too.

## This theme

A weekly magazine published in issues: a cover, a contents page, and room for the long pieces.
Sister to Masthead (the daily paper), same family, different unit: the unit here is the **issue**,
not the article. The home page is not a scannable front page. It is this issue's cover and its
contents.

The signature is the **leader contents row**: the number hangs in the left margin, a dotted leader
joins the title to the byline, the way a printed contents page joins a piece to its folio. It
repeats on the home page, the issue page, the archive and the foot of an article. Density lives in
the contents only; inside a feature the page opens up.

Ink, paper, and one petrol spot colour. The spot colour goes on the cover and the issue markers as
a broad field, not as dots on labels. `--radius` is `0`: structure is drawn with rules, never with
rounded cards or shadows.

## Where to edit

| To change                                        | Edit                                                                   | Notes                                                                                         |
| ------------------------------------------------ | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Site name, description, URL, locale, editor, OG  | `src/config.ts` (`site`)                                               | Never hardcode any of this in a component                                                     |
| Navigation, footer, social links                 | `src/config.ts` (`nav`)                                                | Social icons are Lucide names                                                                 |
| Contents rows: dotted leaders on/off, numbering  | `src/config.ts` (`contents`)                                           | `style: 'plain'` drops the fill span, and the dots with it                                    |
| Folio line, articles per issue, drop cap default | `src/config.ts` (`issues`)                                             | A single article opts into a drop cap with `dropCap: true`                                    |
| Archive page size, reading time                  | `src/config.ts` (`archive`)                                            |                                                                                               |
| Colours, rules, spacing, type scale              | `src/styles/theme.css`                                                 | Override tokens from `src/styles/tokens.css`; do not edit that file. Preview at `/styleguide` |
| The dotted leader itself                         | `.leaders` / `.leaders__fill` in `src/styles/global.css`               | One `border-block-end: dotted`. A gradient here is the wrong instrument                       |
| Webfonts                                         | `fonts:` in `astro.config.mjs`                                         | Bound to `--font-body` / `--font-heading` / `--font-display`                                  |
| Header, footer, page shell, theme script         | `src/layouts/Base.astro`                                               |                                                                                               |
| `<head>`, meta tags, JSON-LD                     | `src/components/common/SEO.astro`                                      |                                                                                               |
| Content fields and validation                    | `src/content.config.ts`                                                | zod. Adding a required field invalidates every existing file. See below                       |
| Issues (cover line, date, editor's note)         | `src/content/issues.json`                                              | Keyed by issue id. `coverArticle` is an article slug                                          |
| Articles                                         | `src/content/articles/<slug>.md` or `.mdx`                             | Filename is the URL. `order` is the contents position and the folio numerator                 |
| Bylines                                          | `src/content/authors.json`                                             | Keyed by author id, the value articles reference                                              |
| The masthead page (`/about`) and its prose       | `src/pages/about.astro`                                                | Contributor rows come from `authors.json`; the address is `site.email`                        |
| UI strings the theme prints                      | `src/i18n/<locale>.ts`                                                 | Components read them with `useT()`. Never hardcode a word in a component                      |
| The feed                                         | `src/pages/rss.xml.ts`                                                 | Every published piece of the default language, newest issue first                             |
| `robots.txt`                                     | `src/pages/robots.txt.ts`                                              | A route, not a static file: the sitemap line has to be absolute                               |
| Analytics provider and id                        | `src/config.ts` (`analytics`), `src/components/common/Analytics.astro` | `provider: null` renders nothing. Plausible, GA4 or Umami; `host` for a self-hosted one       |
| The documentation                                | `docs/customization.md`, `docs/content.md`, `docs/deploy.md`           | Every config group and content field is named in one of the three. Change one, change the doc |
| What CI runs                                     | `.github/workflows/ci.yml`, `lighthouserc.json`                        | Lighthouse pages and the 95+ thresholds live in `lighthouserc.json`                           |

## Content model

Three collections, defined in `src/content.config.ts`:

- **issues** (`src/content/issues.json`) — `number` is both the URL (`/issues/4`) and the folio
  number; the JSON key is only an id. No `coverImage`: the cover falls back to a spot-colour panel,
  which is the designed default, not a placeholder. No `editorsNote`: the note block is not
  rendered at all.
- **articles** (`src/content/articles/*.md`, or `.mdx`) — one file per piece, the filename is the
  slug. Every article belongs to exactly one issue and carries an `order` within it. `pullQuote` in
  the frontmatter prints as an epigraph above the text.
- **authors** (`src/content/authors.json`) — an article has at least one, and may have several.
  Values that are computed and are therefore not fields: reading time (from the body), the folio
  (`order` and the issue's article count), the article count, the URLs, and the previous and next
  issue (`number` ± 1). Do not add a field for any of them.

`department` is an enum: `Feature`, `Essay`, `Report`, `Interview`, `Dispatch`. Renaming a value is
a content migration; every article using the old value fails validation until it is edited.

## Do not

- Add a second accent colour, or a coloured section background. Ink, paper, one spot colour.
- Replace rules with shadows, gradients, glass, rounded cards, or pills. `--radius` stays `0`.
- Justify body text. Left-aligned, 65ch, `hyphens: auto`.
- Set a section label in small uppercase with wide tracking. Archivo at a small size, with weight
  and colour, does that job.
- Rely on small caps or old-style figures. Neither Bodoni Moda, Archivo nor Literata ships them.
  `tnum` is present, so numbers in contents rows, folios and dates use `tabular-nums`.
- Put a three-up card grid on any screen. Sequences stack as rows.
- Add a client-side framework, or link a CDN for a font, script or icon. The one exception is the
  analytics snippet, which stays behind a config switch and is off by default.
- Remove the skip link, focus rings, alt text or aria-labels. Breaking at 360px is a bug.
- Leave a link inside a sentence without an underline. Colour alone fails WCAG 1.4.1, and
  Lighthouse catches it as `link-in-text-block`. Standalone links (nav, rows) may stay bare.
- Write stock copy. The demo content is in the magazine's voice: reported, plain, specific.
- Hardcode a word the theme prints. It belongs in `src/i18n/<locale>.ts`, and every dictionary
  needs the same keys.
- Write the theme's own comments, strings and docs in any language other than English. Your
  content is yours: to publish in another language, copy `src/i18n/en.ts`, translate the values,
  and set `site.locale`.

## Workflow

1. Find the file in the table above. If the request is not covered by it, say which file you intend
   to touch before touching it.
2. Make the change.
3. Run `pnpm check && pnpm build`, plus `pnpm check:contrast` for colour, and report the result.
4. For layout or colour work, check the page in the browser at 360px as well as desktop.
