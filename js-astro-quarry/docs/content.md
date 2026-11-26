# Content

Two collections, both defined and validated in `src/content.config.ts`: a folder of Markdown and
a JSON file. There is no CMS and no database: the site is these files, built to HTML.

Every page reads its collection through `src/lib/content.ts` rather than calling `getCollection`
itself, which is where the draft filter, the sort orders and the date format live. If you need a
new list of something, add the function there.

## plans

`src/content/plans.json`, an array. Each object is a block on `/pricing` and a row on the home
page.

| Field          | Type              | Required | Meaning                                                                                     |
| -------------- | ----------------- | -------- | ------------------------------------------------------------------------------------------- |
| `id`           | string            | yes      | The key. Not printed                                                                        |
| `name`         | string            | yes      | Plan name                                                                                   |
| `tagline`      | string            | yes      | One line under the name                                                                     |
| `priceMonthly` | number            | yes      | Per month, in `currency`                                                                    |
| `currency`     | string            | no       | ISO code, `USD` by default. Formatted with `Intl` for `site.locale`                         |
| `features`     | string[]          | yes      | Printed under the tagline. At least one                                                     |
| `cta`          | `{ label, href }` | yes      | The button                                                                                  |
| `featured`     | boolean           | no       | Prints "Most bought" beside the name and makes its button the solid one. Set it on one plan |
| `order`        | integer > 0       | yes      | Top to bottom                                                                               |

## blog

`src/content/blog/<slug>.md` or `.mdx`. The filename is the URL: `/blog/<slug>`.

| Field         | Type     | Required | Meaning                                                                      |
| ------------- | -------- | -------- | ---------------------------------------------------------------------------- |
| `title`       | string   | yes      |                                                                              |
| `description` | string   | yes      | The row on the index, the meta description, the feed                         |
| `pubDate`     | date     | yes      | Sort order, newest first                                                     |
| `updatedDate` | date     | no       | A second line under the byline                                               |
| `tags`        | string[] | no       | Each tag gets a page at `/blog/tag/<tag>`; the slug is generated             |
| `author`      | string   | no       | The name as it should be printed. Falls back to `site.author` in the JSON-LD |
| `draft`       | boolean  | no       | `true` keeps the post out of the build, in dev as well                       |

`author` is a plain string rather than a reference: it is the name the byline prints, and there is
no second file to keep in step with it.

## What is computed, and therefore not a field

Reading time (from the body), the tag counts, the tag slugs, the pagination and every URL. Do not
add a field for any of them.

## Math

`$…$` sets a formula inline and `$$…$$` on its own lines, in `.md` and `.mdx` alike. KaTeX turns
it into HTML at build time, so the page ships no script for it, and only a page with math loads the
KaTeX stylesheet. Chemical equations use mhchem: `$\ce{2H2 + O2 -> 2H2O}$`.

Two dollar signs in one paragraph (`$20 and $30`) read as a formula between them. Write `\$` for a
literal dollar sign.

## MDX

A `.md` file is prose. Use `.mdx` when a post needs a component of your own, imported at the top
of the file. Two things to know before you write one:

- `pnpm format` skips `src/content/**/*.mdx`. Prettier's Markdown printer reflows a fenced block
  that sits inside a JSX element, which turns a block full of shell into one line of it.
- A fence inside a JSX element keeps its indentation. Indent it with the element; it reads better
  and nothing breaks.

## Adding a field

Edit the zod schema in `src/content.config.ts`. A new field must be `.optional()` or carry a
`.default()`, or every existing file in that collection fails validation until it is edited.
`pnpm check` is what tells you.
