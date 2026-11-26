# Monoline — guide for AI agents

Read this before editing the theme. It is the map of edit points: find the file here first, change that file, then run the checks at the bottom.

Monoline is a static Astro theme for a personal notebook of short notes. No CMS, no server output, no database: Markdown and MDX in `src/content/notes/`, built to HTML in `dist/`.

## Commands

```bash
pnpm install
pnpm dev              # http://localhost:4321, styleguide at /styleguide (dev only)
pnpm build
pnpm preview          # serves dist/
pnpm check            # astro check (types). Use `pnpm check 2>&1 | head -40`
pnpm lint
pnpm format
pnpm test             # the gutter plugin, word counts, excerpts, dates
pnpm check:contrast   # WCAG AA for every colour token, light and dark

# What CI also runs, after the build:
pnpm dlx @lhci/cli@0.15.1 autorun                    # Lighthouse, mobile, 95+ on four categories
pnpm dlx linkinator@8.1.0 dist --recurse --skip '^https?://(?!(localhost|127\.0\.0\.1|\[::1\])[:/])'
```

`pnpm check && pnpm build` must pass after any change. Change a colour and `pnpm check:contrast` must pass too. Touch `src/lib/` and `pnpm test` too.

## This theme

A well-kept plain-text file, as a website. Structure (navigation, paths, dates, titles, headings, code) is set in a monospace face; reading text in a legible sans. Lists of notes are dense tables, one line per note. One accent (`--primary`) for links in text and focus rings. No cards, no shadows, no filled buttons; `--radius` is `0`.

The signature is **the source gutter**. `src/lib/monoline-plugin.ts` (a Sätteri **hast** plugin, `sourceGutter`) writes onto each block the Markdown that made it, as a `data-md` attribute: `h2`–`h6` get `##`…, `blockquote` `>`, `hr` `---`, `pre` a fence, `ul > li` `-`, `ol > li` its real number, a footnote `li` `[^n]` by its displayed number, a table (wrapped in `div.table-block` for the marker and `div.table-scroll` inside it, so it scrolls without losing its table semantics or clipping the marker) `|`, a paragraph that is only a picture `![]`. Other paragraphs get nothing. `src/styles/monoline.css` draws `attr(data-md)` with `::before`: hung in a `4rem` gutter left of `.note-column` from 48rem up, folded into a prefix below. It runs on notes and Markdown pages.

Before it, `src/lib/note-links.ts` (an **mdast** plugin, `noteLinks`) turns `[[wikilinks]]` and relative `./note.md` links into `/notes/<id>`; a target that is not a note file prints as text.

## Where to edit

| To change                                              | Edit                                                                                      | Notes                                                                                         |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Every word the theme prints (other languages)          | `src/config.ts` (`ui`)                                                                    | Never hardcode a visible word in a component; add it to `ui`                                  |
| Links between notes                                    | `src/lib/note-links.ts`                                                                   | Pure and tested. Site paths, `./note.md` links and `[[wikilinks]]`                            |
| Site name, description, URL, locale, author, home line | `src/config.ts` (`site`)                                                                  | `lede` is the line above the home table. Never hardcode any of it in a component              |
| Header links                                           | `src/config.ts` (`nav.header`)                                                            | Labels print as paths (`/notes`). Three fit at 360px                                          |
| Footer, the credit, the light/dark switch              | `src/components/common/Footer.astro`, `ThemeToggle.astro`                                 | The credit may be removed. The switch is in the footer: the header has no room at 360px       |
| Gutter on or off, rows on the home page                | `src/config.ts` (`monoline`)                                                              | `gutter: false` only hides markers (`.no-gutter`); the attributes stay                        |
| Fonts                                                  | `fonts` in `astro.config.mjs`                                                             | Two variables: `--font-body`, `--font-heading` (keep it monospace). Self-hosted               |
| Dark-mode switch                                       | `src/config.ts` (`features`)                                                              |                                                                                               |
| Analytics provider and id                              | `src/config.ts` (`analytics`), `src/components/common/Analytics.astro`                    | `provider: null` renders nothing                                                              |
| Colours, widths, radius                                | `src/styles/theme.css`                                                                    | Override tokens from `src/styles/tokens.css`; do not edit that file. Preview at `/styleguide` |
| Code block colours                                     | `shikiConfig` in `astro.config.mjs`                                                       | Both themes as variables (`defaultColor: false`), drawn on `--surface` in `monoline.css`      |
| Note body, the gutter, footnotes, code blocks          | `src/styles/monoline.css`                                                                 | The only place a note's body is styled. No typography plugin                                  |
| Which blocks get which marker                          | `src/lib/monoline-plugin.ts`                                                              | Tested in `src/lib/monoline.check.ts`                                                         |
| Tables of notes (home, index)                          | `src/components/notes/NotesTable.astro`                                                   | One component for every list. `years` groups by year                                          |
| `<head>`, meta, JSON-LD                                | `src/components/common/SEO.astro`                                                         | Pages pass `title` and `description`; the rest is derived                                     |
| Page shell, skip link, fonts, theme script             | `src/layouts/Base.astro`                                                                  | `home` makes the header name the page's h1. Preloads both faces at 400 only                   |
| Header                                                 | `src/components/common/Header.astro`                                                      | Name and paths, one line                                                                      |
| A plain page (about)                                   | `src/pages/<name>.md` with `layout: ../layouts/Page.astro`                                | `updated` in front matter prints a date. The gutter applies                                   |
| Home, index, note                                      | `src/pages/index.astro`, `src/pages/notes/index.astro`, `src/pages/notes/[...slug].astro` |                                                                                               |
| Notes                                                  | `src/content/notes/<slug>.md` or `.mdx`                                                   | The filename is the URL                                                                       |
| Note fields and validation                             | `src/content.config.ts`                                                                   | A new field must be optional or have a default                                                |
| Note list, drafts, word counts, summaries              | `src/lib/notes.ts`, `src/lib/text.ts`                                                     | `getNotes()` is the one place that filters drafts. `text.ts` is pure and tested               |
| Feed, `robots.txt`                                     | `src/pages/rss.xml.ts`, `robots.txt.ts`                                                   | Titles and summaries only                                                                     |
| Which tokens are contrast-checked                      | The lists at the top of `scripts/check-contrast.mjs`                                      | Add a token there when you add one                                                            |
| What CI runs, the Lighthouse pages                     | `.github/workflows/ci.yml`, `lighthouserc.cjs`                                            | The page list filters itself against `dist/`                                                  |
| The documentation for buyers                           | `docs/customization.md`, `docs/content.md`, `docs/deploy.md`                              | Change a config key or a field, change the doc                                                |

## Content model

**notes** (`src/content/notes/*.md`, `.mdx`): `title`, `date`, optional `updated`, `description`, `tags` (default `[]`), `draft` (default `false`). Full table in `docs/content.md`.

Computed, and therefore not fields: word count, reading time, summary (the first paragraph when there is no `description`), year groups, every URL, every gutter marker. Do not add a field for any of them.

## Do not

- Put the gutter markers into the Markdown or the HTML by hand. They come from `data-md`, set by the plugin, drawn by CSS.
- Let a `pre` or `hr` in a note clip its overflow. The marker hangs outside the box; Shiki's inline `overflow-x: auto` is overridden with `!important` on purpose, and the code scrolls inside `code`.
- Use a proportional face for `--font-heading`. The tables, the paths and the gutter are measured in `ch`.
- Add a field, a column or a label that repeats what the row or the heading above it already says (the year in `/notes`).
- Put another item in the header without checking 360px. The header is one line.
- Add a second accent colour or a coloured section background.
- Replace rules with shadows, gradients, glass, pills, rounded cards or filled buttons. `--radius` stays `0`.
- Set a label in small uppercase with wide tracking. Labels here are lowercase mono.
- Dress the site up as a terminal (prompts, `~/`, blinking cursors). It is a text file, not a shell.
- Give an input a fixed colour such as `#fff`. Use `var(--background)`.
- Add a client-side framework, or link a CDN for a font, script or icon. The only third-party script is analytics, behind config and off by default.
- Remove `cssTarget` in `astro.config.mjs`. Lightning CSS then lowers `light-dark()` into `prefers-color-scheme` blocks and the theme toggle stops working.
- Call `getCollection('notes')` in a page. Use `getNotes()`, or drafts leak.
- Remove the skip link, focus rings or aria-labels. Breaking at 360px is a bug.
- Leave a link inside a sentence without an underline. Colour alone fails WCAG 1.4.1.
- Run `prettier --write` on `pnpm-lock.yaml`. `.prettierignore` holds the line that prevents it.
- Write the theme's own comments, strings or docs in any language other than English.

## Workflow

1. Find the file in the table above. If the request is not covered by it, say which file you intend to touch before touching it.
2. Make the change.
3. Run `pnpm check && pnpm build`, plus `pnpm check:contrast` for colour and `pnpm test` for `src/lib/`, and report the result.
4. For layout or colour work, check a long note in the browser at 360px and at 1280px, where the markers move into the gutter.
