# Vitrine — guide for AI agents

The first file an agent (Claude Code, Cursor, Copilot) should read before editing this
theme. People can read it too; the sentences are written so an agent can act on them
without guessing.

Vitrine is a catalogue raisonné: an archive of objects, one plate per object, set in a 1px
rule grid with a museum wall label under each cell. Decisions in this theme follow from
that — the grid is printed matter, not a card layout.

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

| To change                                                                                                      | Edit                                                     | Notes                                                                                                        |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Site name, URL, author, navigation, social links, SEO defaults, contact endpoint, pagination, feature switches | `src/config.ts`                                          | Nothing site-specific is hardcoded elsewhere                                                                 |
| Every word the theme prints                                                                                    | `src/config.ts` (`ui`)                                   | Strings marked HTML carry a link. The colophon text is in `src/pages/colophon.astro`                         |
| Colours, type, plate metrics                                                                                   | `src/styles/theme.css`                                   | Overrides the defaults in `src/styles/tokens.css`; never edit that file. Preview at `/styleguide`            |
| Webfonts                                                                                                       | `fonts:` in `astro.config.mjs`                           | Bound to `--font-heading` / `--font-body`. Self-hosted by the font provider; never add an external font link |
| Favicon                                                                                                        | `public/favicon.svg`, `public/favicon.ico`               | There is no logo image; the nameplate is `site.name` in the heading face                                     |
| Home                                                                                                           | `src/pages/index.astro`                                  |                                                                                                              |
| Catalogue grid, pagination, column count                                                                       | `src/pages/catalogue/[...page].astro`                    | Column utilities are passed to `PlateGrid` as a `class`; the grid itself has no opinion                      |
| Object entry                                                                                                   | `src/pages/catalogue/[id].astro`                         | The plate at page size, the wall label, the note and the nearby entries                                      |
| Collections                                                                                                    | `src/pages/collections/index.astro`, `[id].astro`        |                                                                                                              |
| Add an object                                                                                                  | `src/content/objects/<slug>.mdx`                         | Schema below; images go in `src/assets/objects/`. Not ready to be seen: `_drafts/` (see `draft`)             |
| Add a collection                                                                                               | `src/content/collections/<slug>.md`                      | `description` is the paragraph above the plates; the body is not rendered                                    |
| Schema fields                                                                                                  | `src/content.config.ts`                                  | Never remove a field; new fields must be optional or have a default                                          |
| Content queries                                                                                                | `src/lib/content.ts`                                     | The only place that calls `getCollection()`. Draft filtering and catalogue numbering live here               |
| Header, footer                                                                                                 | `src/components/common/Header.astro`, `Footer.astro`     | Link lists come from `config.ts`                                                                             |
| `<head>` meta                                                                                                  | `src/components/common/SEO.astro`                        | Pages pass only `title`, `description`, and `image`/`jsonLd` when needed                                     |
| Body copy styles                                                                                               | the `.prose` block at the end of `src/styles/global.css` | No typography plugin. Anything that keeps its own look is wrapped in `.not-prose`                            |
| Add a page                                                                                                     | `src/pages/<name>.astro` using `PageLayout`              | Link it from `nav` in `config.ts`                                                                            |

## Do not

- Edit `src/styles/tokens.css` to retheme. Override in `src/styles/theme.css`.
- Write a `dark:` variant. Colours are `light-dark()` pairs; the switcher only changes
  `color-scheme` through `<html data-theme>`. There is no second palette to keep in sync.
- Remove `vite.build.cssTarget` from `astro.config.mjs`. Without it Lightning CSS lowers
  `light-dark()` into `prefers-color-scheme` blocks and the theme switcher stops working.
- Call `getCollection()` from a page. Use `src/lib/content.ts`.
- Use a raw `<img>`. Use `<Image>` from `astro:assets`, and keep images in `src/assets/`
  rather than `public/`.
- Add a client-side framework, or a dependency for something CSS already does. The theme
  ships the theme switcher and nothing else.
- Link an external CDN for fonts, scripts or icons.
- Add rounded corners, gradients, pill buttons, glass or drop shadows. The shape language
  is a ruled rectangle; `.btn` is the only button and it inverts rather than glows.
- Set section labels in small wide-tracked uppercase.
- Take `--caption-size` below `0.78rem`, or remove the skip link, focus rings, alt text or
  `aria-label`s.
- Add a third-party asset that is not in `THIRD-PARTY-NOTICES.md`. Adding one means adding
  the notice in the same change.
- Write comments, strings or documentation in any language other than English.

## Content schema (`src/content.config.ts`)

```
objects:
  title: string          # required; also the plate's alt text
  image: image           # required; relative path, resolved by astro:assets
  caption: string        # required; the label above the cell — "Glass", not a sentence
  dateText: string       # required; printed as written — "ca. 1600", "1893–96"
  year?: number          # sorting only
  medium: string         # required; first line of the cartellino
  dimensions?: string
  accession?: string     # falls back to the position — collection 02, entry 03 → "02-03"
  collection: reference  # required; the id of a file in content/collections
  credit?: string
  span: 1 | 2            # default 1; 2 takes a double-width cell
  featured: boolean      # default false; eligible for the home grid
  draft: boolean         # default false; true keeps the entry off every page, but its
                         # photograph is still built. A file under
                         # src/content/objects/_drafts/ is not read at all, which is
                         # what keeps the image out of dist/ as well.

collections:
  title: string          # required
  description: string    # required; one paragraph above the plates
  order?: number         # positive integer; unordered files follow, by title
  cover?: image
```

The body of an object file is its note. A collection file's body is not rendered here.

## What the Pro edition adds

Vitrine Pro is the same theme with the rest of the printed catalogue: index terms as a
second axis (`/index/`), a Pagefind search page and a finder on the grids, further plates
per object with an enlargement dialog, the provenance / exhibition / literature registers,
footnotes, section essays, three more colour presets and a share card drawn per object.
Nothing here is a cut-down version of them — the features are separate files in Pro — so a
request for one of them is a request for a feature this edition does not have.

## Conventions

- Components take props and nothing else. The page does the querying.
- Colours come from tokens, exposed to Tailwind as `text-muted`, `border-rule`,
  `bg-plate` and so on. No arbitrary hex values in classes.
- Mobile first. Breaking at 360px is a bug.
- Editorial decisions belong with the content (`span`, `featured`, `order`), layout
  decisions with the page (column counts), and neither belongs in a component.
- One component per file. No barrel files.
- Copy is plain and specific, in the voice of someone who keeps an archive.

## Workflow

1. Find the file in the table above. If the request is not covered, say which file you
   intend to touch before touching it.
2. Make the change.
3. Run `pnpm check && pnpm build` — plus `pnpm check:contrast` for colours — and report
   what they said.
4. For layout or colour work, run `pnpm dev`, and ask the person to look at
   `/styleguide` and the catalogue in both modes at 360px.
