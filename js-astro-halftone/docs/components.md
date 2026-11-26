# Components

Every component in `src/components/` takes props and prints. None of them fetches content: the
page gathers the data and hands it over. That is what keeps a page readable as a page — you can
see what is on it by reading one file.

Two groups: `common/` (the chrome and the plate) and `article/` (listing and reading).

## The plate

The cover plate is the theme. It is two components, not one, so the same photograph can carry
different type: a photograph with `Plate`, the type on it with `PlateHead`, and — on the home page
and the desk fronts — a column of teasers with `CoverLines`.

| Component    | Props                                                          | What it is                                                                                                    |
| ------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `Plate`      | `image` `alt` `credit?` `focus?` `priority?` `class?`          | The photograph, its crop, its credit, and whether it loads eagerly. Whatever sits on it is passed as children |
| `PlateHead`  | `kicker?` `spot?` `title` `deck?` `href?` `as?` `id?` `class?` | The type laid on a plate: label box, headline, deck. `spot` puts the label in the spot colour                 |
| `CoverLines` | `items` `omitKicker?` `as?` `class?`                           | The signature column of teasers. How it is set comes from `coverLines` in `config.ts`, not from props         |

`CoverLines` reads `config.ts` rather than taking the arrangement as a prop, because how the column
is set is a property of the magazine and not of the page.

`Plate` only handles the photograph. The scrim and the type colours are the `.plate` block in
`global.css`, and the column on a plate stays inside 32rem — the comment there says why the scrim
depends on it.

`priority` belongs to exactly one plate per page, the one above the fold. On the home page that is
the cover; everywhere else it waits.

## The chrome

| Component     | Props                                                         | What it is                                                                                                 |
| ------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `PageHead`    | `kicker` `title` `lede` `folio?` `class?`                     | The standing head on a page that is all type. The colophon opens with it, and so should a page of your own |
| `SEO`         | `title?` `description?` `image?` `type?` `jsonLd?` `noindex?` | All `<head>` meta. The only file that writes it. Pages pass it through `Base`                              |
| `Author`      | `author` `role?` `links?` `href?`                             | A contributor: portrait, name, role, bio. At the foot of an article and down the colophon masthead         |
| `ThemeToggle` | –                                                             | Light/dark. The value lands on `<html data-theme>`, which flips `color-scheme`                             |
| `Analytics`   | –                                                             | The analytics tag. Emits nothing until `analytics.provider` is named                                       |

`PageHead`'s `folio` is the mono count line under the lede — "19 stories · 4 desks". Omit it where
there is nothing to count.

`Author` takes `role` rather than reading it off the entry, because the colophon masthead already
groups by title and prints only the qualifier after it.

## The article

| Component | Props                                                           | What it is                                                                                                                      |
| --------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `Card`    | `item` `layout?` `size?` `kicker?` `deck?` `priority?` `class?` | One article with its photograph. `layout: 'row'` sets the picture beside the type; `size: 'lead'` gives it the weight of a lead |
| `Rundown` | `items` `numbered?` `desk?` `class?`                            | A column of small pictures and headlines. The related reading at the foot of a piece                                            |
| `Rail`    | `blocks?` `more` `desk` `deskHref` `beside?`                    | The column beside the body: the blocks the piece asked for, then what else the desk has filed                                   |

`Card` always prints in the same order — picture, label, headline, deck, folio — because that is
the order a reader scans them. `kicker: false` and `deck: false` are for the places where the label
would only repeat the desk bar or the heading above it.

`Rail` is a column beside the body only from 64rem up, and only where the page asked for one with
`beside`. Everywhere else it prints under the body, which is why the figures are a description list
and not a boxed sidebar.

## Share cards

`src/lib/content.ts` holds `shareCard()`, which is the whole of it here: an article's card is its
own photograph, cropped to 1200×630 and baked to JPEG at build. A page with no photograph of its
own shares `site.defaultOgImage`, the import at the top of `config.ts`.

## Writing a component of your own

- Props only. If it needs content, the page fetches it and passes it down.
- No client-side framework. A `<script>` tag and CSS, the way `ThemeToggle` does it.
- Colours come from the tokens. No hex value in a class.
- Images go through `<Image>` from `astro:assets`, out of `src/assets/`. Never a raw `<img>`.
- Words the theme prints belong in `src/i18n/<locale>.ts`, not in the component.
- One component per file. No barrel files.
