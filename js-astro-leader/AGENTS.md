# Leader — guide for AI agents

The first file an agent (Claude Code, Cursor, Copilot) should read before editing this
theme. People can read it too; the sentences are written so an agent can act on them
without guessing.

Leader is a contents page: a shelf of small products, one ruled row each, with a leader
rule running from the product name out to its category in that category's colour. The
notes are filed under the same categories. Decisions in this theme follow from that — the
row is printed matter, not a card, and colour means category and nothing else.

## Commands

```sh
pnpm install
pnpm dev             # http://localhost:4321, /styleguide included
pnpm build           # static output into dist/
pnpm preview         # serve dist/
pnpm check           # astro check — types and templates
pnpm check:contrast  # WCAG AA over every colour pair, both modes
pnpm lint
pnpm format
```

After any change, `pnpm check && pnpm build` must pass. After any colour change, also
`pnpm check:contrast`.

## Where to edit

| To change                                                                                    | Edit                                                                   | Notes                                                                                                                                             |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Site name, URL, author, navigation, social links, SEO defaults, pagination, feature switches | `src/config.ts`                                                        | Nothing site-specific is hardcoded elsewhere                                                                                                      |
| Categories, their slugs and their accents                                                    | `categories` in `src/config.ts`                                        | Four is the ceiling — `--accent-1…4` is all there is. The schema enum is built from this list, so a rename is a build error, not a colourless row |
| The signature                                                                                | `work.leaderRule` in `src/config.ts`, `src/components/LeaderRow.astro` | `'none'` drops the rule and leaves the two ends of the row. Every list on the site is this one component                                          |
| Colours, type, layout                                                                        | `src/styles/theme.css`                                                 | Overrides the defaults in `src/styles/tokens.css`; never edit that file. Preview at `/styleguide`                                                 |
| Webfonts                                                                                     | `fonts:` in `astro.config.mjs`                                         | Bound to `--font-sans-face` / `--font-mono-face`. Self-hosted by the font provider; never add an external font link                               |
| Favicon                                                                                      | `public/favicon.svg`, `public/favicon.ico`                             | There is no logo image; the nameplate is `site.name` set in the display face                                                                      |
| Home                                                                                         | `src/pages/index.astro`                                                | The shelf and the recent notes, nothing else                                                                                                      |
| The shelf                                                                                    | `src/pages/work/index.astro`                                           | The same rows as the home band, with the archived products in a group at the foot                                                                 |
| Product page                                                                                 | `src/pages/work/[...slug].astro`                                       | Header, body, the notes filed under it                                                                                                            |
| Notes list, note                                                                             | `src/pages/notes/[...page].astro`, `[...slug].astro`                   | The foot of a note is the previous/next pair                                                                                                      |
| Category pages                                                                               | `src/pages/category/[slug].astro`                                      | Every row here is already one colour, so the far end of the leader carries status or reading time instead                                         |
| Add a product                                                                                | `src/content/work/<slug>.md`                                           | Schema below                                                                                                                                      |
| Add a note                                                                                   | `src/content/notes/<slug>.md` or `.mdx`                                | `.mdx` only when it imports a component of your own                                                                                               |
| Schema fields                                                                                | `src/content.config.ts`                                                | Never remove a field; new fields must be optional or have a default                                                                               |
| Content queries, dates, reading time                                                         | `src/lib/content.ts`                                                   | The only place that calls `getCollection()`. Draft and `showBuilding` filtering live here                                                         |
| The theme's own words (UI strings)                                                           | `src/i18n/en.ts`, `ko.ts`; `useT()` in `src/i18n/t.ts`                 | Never write a word the theme prints straight into a component. `ko.ts` is typed against `en.ts`, so a new key goes in both                        |
| Header, footer, theme credit                                                                 | `src/components/common/Header.astro`, `Footer.astro`                   | Link lists come from `config.ts`. The header holds three items; a fourth breaks 360px                                                             |
| `<head>` meta                                                                                | `src/components/common/SEO.astro`                                      | Pages pass `title`, `description`, and `ogImage`/`jsonLd` when needed                                                                             |
| Body copy styles                                                                             | the `.prose` block in `src/styles/global.css`                          | No typography plugin. Anything that keeps its own look is wrapped in `.not-prose`                                                                 |
| Add a page                                                                                   | `src/pages/<name>.astro` using `Base`                                  | Link it from `nav` in `config.ts`                                                                                                                 |

## Do not

- Edit `src/styles/tokens.css` to retheme. Override in `src/styles/theme.css`.
- Write a `dark:` variant. Colours are `light-dark()` pairs; the switcher only changes
  `color-scheme` through `<html data-theme>`. There is no second palette to keep in sync.
- Remove `vite.build.cssTarget` from `astro.config.mjs`. Without it Lightning CSS lowers
  `light-dark()` into `prefers-color-scheme` blocks and the theme switcher stops working.
- Use a colour for anything that is not a category. The four accents mean group membership;
  a coloured button, badge or callout breaks the one thing the right-hand edge is for.
- Add a fifth category accent. Four is the ceiling the palette and the contrast gate hold.
- Turn the product and note routes back into `[slug]`. A content id carries its folders,
  so `notes/2026/04/one-tab.md` is `/notes/2026/04/one-tab`, and a plain `[slug]` fails the
  build with `Missing parameter: slug` the first time anyone files a note in a folder.
- Parse the colour tokens anywhere but `src/lib/palette.js`. The contrast gate reads it, and
  a second parser is how the gate and the stylesheets end up disagreeing.
- Call `getCollection()` from a page. Use `src/lib/content.ts`.
- Set numbers in the sans face when they have to line up. Hanken Grotesk ships without
  `tnum`; dates, years and counts are set in the mono face for that reason.
- Add a weight above 400, or a heading heavier than `--weight-display` (200). Hierarchy in
  this theme is size, colour and case.
- Add rounded corners, gradients, pill buttons, glass or drop shadows. `--radius` is `0`
  and the shape language is a rule.
- Add a client-side framework, or a dependency for something CSS already does. The theme
  toggle is the only script the theme ships.
- Link an external CDN for fonts, scripts or icons.
- Add a key image to a list or a card. The theme is finished without artwork; body images
  inside a note are the author's business.
- Remove the skip link, focus rings, alt text or `aria-label`s.
- Add a third-party asset that is not in `THIRD-PARTY-NOTICES.md`. Adding one means adding
  the notice in the same change.
- Write comments, strings or documentation in any language other than English. The one
  exception is a dictionary in `src/i18n/`, which is the translation itself.

## Content schema (`src/content.config.ts`)

```
work:
  title: string          # required
  category: enum         # required; a slug from `categories` in config.ts
  summary: string        # required, max 160; the line under the row
  status: live | building | archived    # default live
  started: date          # required; only the year is printed
  url?: string           # the product itself
  repo?: string
  order?: integer        # shelf order; files without one follow, newest first
  draft: boolean         # default false; true excludes from the build

notes:
  title: string          # required
  category: enum         # required, same list
  pubDate: date          # required
  updatedDate?: date
  description?: string   # max 160; without it the first paragraph is used
  work?: reference       # the id of a file in content/work
  author?: string        # falls back to site.author
  draft: boolean         # default false
```

The body of a work file is the product page; the body of a note is the note. Footnotes are
ordinary GFM. `status: building` dims a row rather than hiding it, unless
`work.showBuilding` is off.

## Conventions

- Components take props and nothing else. The page does the querying.
- Every list on the site is `LeaderRow`. Before writing a new list component, check whether
  what you want is a prop on that one.
- Colours come from tokens, exposed to Tailwind as `text-muted`, `border-border`,
  `bg-surface` and so on. No arbitrary hex values in classes; accents are read as
  `var(--accent-N)` from the category.
- Mobile first. Breaking at 360px is a bug, and the header is the first thing to break.
- Metadata — dates, years, counts, labels — is set in the mono face at small sizes.
- One component per file. No barrel files.
- Copy is plain and specific, in the voice of someone who ships small things and writes
  down what happened.

## Workflow

1. Find the file in the table above. If the request is not covered, say which file you
   intend to touch before touching it.
2. Make the change.
3. Run `pnpm check && pnpm build` — plus `pnpm check:contrast` for colours — and report
   what they said.
4. For layout or colour work, run `pnpm dev`, and ask the person to look at `/styleguide`,
   the shelf and a note in both modes at 360px.
