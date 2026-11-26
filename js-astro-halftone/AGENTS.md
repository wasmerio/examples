# Halftone — guide for AI agents

Read this before editing the theme. It is the map of edit points: find the file here first, change
that file, then run the checks at the bottom.

Halftone is a static Astro theme. No CMS, no server output, no database: Markdown and JSON in
`src/content/`, built to HTML.

## Commands

```bash
pnpm install
pnpm dev              # http://localhost:4321, styleguide at /styleguide (dev only)
pnpm build            # static output in dist/, share cards included
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

A photo-led newsmagazine. The other themes in this family make hierarchy out of type; Halftone
makes it out of a photograph. The lead is always one large picture, and the wordmark, the headline
and the cover lines are set **inside** it.

The signature is the **cover line**: a labelled teaser on a cover plate — kicker box, headline,
short deck — one under the next. It repeats on the home cover and on every desk front.

The axis is the **desk**, not the issue: the magazine publishes continuously and there is no issue
number anywhere. Density is pushed into the **rail** beside an article (figures, more from the
desk); inside the body the page opens up, the pictures get larger and the measure stays at
one column.

Cold paper, real black ink, and one spot colour printed as a field — the wordmark and the kicker
boxes — not as dots on labels. `--radius` is `0`.

## Where to edit

| To change                                             | Edit                                                           | Notes                                                                                            |
| ----------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Site name, description, URL, locale, editor, OG image | `src/config.ts` (`site`)                                       | Never hardcode any of this in a component                                                        |
| Desk bar, footer groups, social icons                 | `src/config.ts` (`nav`)                                        | Social icons are Lucide names. A footer group with no links does not print                       |
| Cover lines: overlay, divider, count                  | `src/config.ts` (`coverLines`)                                 | The signature. `overlay: false` drops the column onto its own panel under the picture            |
| Desk page size, related count, reading time           | `src/config.ts` (`blog`)                                       | `postsPerPage: 4` is chosen so a five-piece desk actually paginates                              |
| Feature switches                                      | `src/config.ts` (`features`)                                   | `darkMode`                                                                                       |
| Analytics                                             | `src/config.ts` (`analytics`)                                  | `provider` + `id`; `host` only for a self-hosted Plausible or Umami                              |
| Title pattern, structured data                        | `src/config.ts` (`seo`)                                        | Per-page JSON-LD is added by the page through `SEO.astro`                                        |
| Colours, rules, spacing, type scale                   | `src/styles/theme.css`                                         | Overrides `src/styles/tokens.css`; do not edit that file. Preview at `/styleguide`               |
| The webfonts themselves                               | `fonts:` in `astro.config.mjs`                                 | Bound to `--font-body` / `--font-heading` / `--font-mono`. Self-hosted; never link a CDN         |
| Header, footer, page shell, theme script              | `src/layouts/Base.astro`                                       |                                                                                                  |
| `<head>`, meta tags, JSON-LD                          | `src/components/common/SEO.astro`                              | The only file that writes head meta                                                              |
| Content fields and validation                         | `src/content.config.ts`                                        | zod. A new required field invalidates every existing file. See below                             |
| Add an article                                        | `src/content/articles/<slug>.md` or `.mdx`                     | The filename is the slug; the route is `/<desk>/<slug>`                                          |
| Add a desk or a contributor                           | `src/content/desks.json`, `authors.json`                       | The `id` is the route segment and the reference value. There is no second slug field             |
| A rail block kind                                     | `rail` union in `src/content.config.ts` + `article/Rail.astro` | A second field beside `rail` would lose the author's ordering                                    |
| Words the theme prints (labels, counts, nav)          | `src/i18n/<locale>.ts`                                         | `ko.ts` is checked against `en.ts`. Standing page prose is not here — it is in the page          |
| Add a language                                        | `src/i18n/<code>.ts` + `strings` in `src/i18n/index.ts`        | Set `site.locale` to its code. The type fails the build on a key the new module has not answered |
| Add a page                                            | `src/pages/<name>.astro` with `Base` + `PageHead`              | And a row in `nav.footer`. With no photograph of its own it shares `site.defaultOgImage`         |
| Lighthouse pages and thresholds                       | `lighthouserc.cjs`                                             | The list filters itself against `dist/`, so a deleted demo page drops out instead of failing     |
| Sample photographs                                    | `scripts/make-sample-plates.mjs`                               | They are drawn, not stock. Seeded by slug, so a regenerated file is byte-stable                  |

What each component takes is in [docs/components.md](docs/components.md); every config group is in
[docs/customization.md](docs/customization.md); the schema is in [docs/content.md](docs/content.md).

## Content model

Three collections. `desks` uses its `id` as both the route segment and the reference value, so
there is never a slug to keep in sync.

```
articles:  title deck desk byline date hero heroAlt heroCredit      # required
           standfirst? kicker? heroCaption? heroFocus? format?
           featured? rail? tags? draft?
desks:     id name order, blurb?
authors:   id name order, role? bio? portrait? links?
```

`hero`, `heroAlt` and `heroCredit` are required and should stay that way. The picture leads in this
theme, and a photograph that ships without alt text or a source is a liability.

`format` is the only thing the article layout branches on. `report` runs the rail beside the body,
`brief` runs it under the body, `photoessay` carries no rail and gives the page to the picture.

Reading time, related pieces and the desk date span are **computed**, not fields. Do not add a
frontmatter field for something already derived.

## Do not

- Break the plate. The photograph is the hierarchy: do not replace a cover plate with a coloured
  block, and do not put a second plate above the fold.
- Set type on a plate outside 32rem. The scrim in `global.css` is sized for that column; wider and
  the contrast the scrim is buying disappears. The comment there says so.
- Add a second accent colour or a coloured section background. One spot colour, printed as a field.
- Replace rules with shadows, gradients, glass, rounded cards or pills. `--radius` stays `0`.
- Put a three-up card grid on any screen. Sequences stack, or run as rows with the picture beside.
- Justify body text, or set it in more than one column. Left-aligned, one column, at the text
  measure. Multi-column prose was the first thing this theme dropped from its reference.
- Rely on small caps or old-style figures. Neither Spectral, Schibsted Grotesk nor IBM Plex Mono
  ships `smcp` or `onum`, and the browser's synthetic version is visible. Kickers and folios are
  real capitals in the mono face. `tnum` is present and is what the rail figures use.
- Set a section label in small uppercase with wide tracking. The mono face at a small size does it.
- Add a client-side framework, or link a CDN for a font, script or icon. Webfonts are fetched at
  build time and served from your own origin. The one exception is the analytics snippet, which is
  off until you name a provider.
- Use a raw `<img>`. `<Image>` / `<Picture>` from `astro:assets`, out of `src/assets/`. Only the
  favicons belong in `public/`.
- Remove the skip link, focus rings, alt text or aria-labels. Breaking at 360px is a bug.
- Leave a link inside a sentence without an underline. Colour alone fails WCAG 1.4.1, and
  Lighthouse catches it as `link-in-text-block`. Standalone links (nav, rows) may stay bare.
- Change a colour without running `pnpm check:contrast`. It checks every pair, in both modes.
- Fetch content inside a component. The page gathers it and passes props down.
- Hardcode a word the theme prints. It belongs in `src/i18n/<locale>.ts`, and every dictionary
  needs the same keys.
- Write stock copy. The demo content is in the magazine's voice: reported, plain, specific.
- Write the theme's own comments, strings and docs in any language other than English. Your content
  is yours: a second language lives in `src/i18n/<locale>.ts`.
- Delete `vite.build.cssTarget` from `astro.config.mjs`. Lightning CSS would lower `light-dark()`
  into `prefers-color-scheme` blocks, and the theme toggle would stop working.

## Workflow

1. Find the file in the table above. If the request is not covered by it, say which file you intend
   to touch before touching it.
2. Make the change.
3. Run `pnpm check && pnpm build`, plus `pnpm check:contrast` for colour, and report the result.
4. For layout or colour work, check the page in the browser at 360px as well as desktop.
