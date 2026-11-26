<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Astrolore](https://github.com/ravvio/astrolore) Astro theme by ravvio, copied from commit `0dc52a97ced5b5daf5f028e50d22b02aaf971f6b` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-astrolore.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [ravvio](https://github.com/ravvio), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Lore

A static worldbuilding wiki built with Astro, Svelte 5, Tailwind CSS v4 and
shadcn-svelte.

Author your fictional worlds in markdown and get a fully navigable wiki with
articles, interactive maps, documents, handouts, custom calendars, and
full-text search.

## Prerequisites

- Node.js >= 24.16.0
- pnpm

## Getting Started

```
git clone https://github.com/ravvio
cd
pnpm install
pnpm dev
```

## Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production wiki to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## Deployment

The output is fully static. After `pnpm build`, serve `./dist/` with any static
host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, nginx).

Otherwise a `Dockerfile` and `nginx/nginx.conf` are included for self-hosted
container deployments:

```sh
docker build -t my-wiki .
docker run -p 8080:80 my-wiki
```

## Creating a World

Each fictional world is a **project**. To add one, create a `<your-world>.(json|yaml)`
file inside `src/content` to contain your project metadata:

```json
{
    "title": "My World",
    "language": "en",
    "description": "A short description shown on the homepage.",
    "pinned": ["john-smith", "new-city"]
}
```

or

```yaml
title: My World
language: en
description: A short description shown on the homepage.
pinned:
    - john-smith
    - new-city
```

`language` accepts `"en"` or `"it"`. `pinned` lists article slugs to feature
on the project's homepage. `preferredGameSystem` picks which system a
statblock's system-switcher defaults to when a statblock defines stats for
more than one (see "Statblocks" below for supported systems).

Then create the following directory structure (you can omit some if you don't
need them):

```
src/content/
└── <your-world>/
    ├── articles/
    ├── categories/
    ├── documents/
    ├── handouts/
    ├── maps/
    ├── statblocks/
    ├── tables/
    └── timelines/
```

The `<your-world>.(json|yaml)` file and the directory `<your-world>` **must** be named
the same. All content (other than the project metadata) follows the naming
convention `src/content/<project>/<collection>/<slug>`.

### References and Slugs

References are always resolved inside the project and are made using the slug.

When using slugs (and ids) **lowercase should always be used** even if the
project files contain uppercase letters.

### Custom Calendar

Add a `calendar` object to your project JSON/YAML to define an in-world calendar.
Dates in article frontmatter and `:date[]` directives will render using it.

```json
{
  "title": "My World",
  ...,
  "calendar": {
    "splits": {
      "pre":  { "name": "Before", "short": "BF" },
      "post": { "name": "After",  "short": "AF" }
    },
    "year": {
      "months": [
        { "name": "Firstmonth", "days": 30 },
        { "name": "Secondmonth", "days": 30 }
      ],
      "seasons": [
        { "name": "Winter", "start": "1/1" },
        { "name": "Summer", "start": "2/1" }
      ]
    }
  }
}
```

`splits.pre` / `splits.post` define the epoch labels around year 0 (analogous
to BC/AD).

## Authoring Content

### Articles

Articles are the main content of your worlds encyclopedia. MDX files
in `articles/`:

```
src/content/my-world/articles/the-great-war.mdx
```

**Minimal frontmatter:**

```mdx
---
title: "The Great War"
---

The **Great War** ...
```

**Full frontmatter:**

```yaml
---
title: "The Great War"
aliases: [great-war, war-of-fires] # alternative slugs for cross-links
tags: [war, history]
parent: age-of-conflict # parent article slug (creates hierarchy)
category: history # category slug
meta:
    type: historic # type of article
    kind: conflict # kind of historic event
    image: ../images/great-war.jpeg # path to a local image or a remote url
    date: "3/15/412" # in-world date (day/month/year)
    timelines: [my-timeline] # array of timelines the event is part of
---
```

#### Meta Types (and Kinds)

The `meta` block requires a `type` field, this determines the other available
fields in the block.

The `kind` field, is sometimes used to further extend the meta block, like in
the case of `type: organization` where setting `kind: country` adds relevant
fields (like `capital`).

- `character`
    - `image`
    - `titles`, `epithets`
    - `family`
    - `cultures`
    - `organizations`, `organizationsFormer`
    - `birth`, `death` (in-world dates)
    - `bornIn`, `diedIn`
    - `parents`, `spouses`, `children` (used to populate family trees)
    - `creature`
    - `kind`: `divinity`
- `location`
    - `image`
    - `parentLocation`
    - `founders`
    - `kind`: `cosmic` | `continent` | `region` | `landmark` | `temple` | `ocean` | `sea` | `lake` | `river` | `forest`
        - `settlement`: adds `founders`, `founding`, `destruction`
- `historic`
    - `image`
    - `timelines`
    - `date` (in-world date or period object `{ start, end }`)
    - `kind`: `generic` | `celestial` | `natural` | `settlement` | `political` | `conflict`
- `organization`
    - `symbol`
    - `founders`, `leaders`, `formerLeaders`
    - `founding`, `termination`
    - `kind`:
        - `country` adds `capital`, `cultures`, `languages`
- `creature`
    - `image`
    - `parentCreature`
    - `locations`
    - `kind`: `aberration` | `celestial` | `construct` | `fae` | `humanoid`
- `family`
    - `emblem`
    - `head`
- `culture`
    - `parentCulture`
    - `kind`: `urban` | `rural` | `nomadic` | `primitive`
- `language`
    - `kind`: `major` | `regional` | `secret` | `dead`
- `title`
    - `relatedOrganization`

String fields that reference other articles can use `(slug)` syntax to create a
link (`family: (house-veran)`, in lists `organizations: [(the-white-rose),
(the-black-rose)]`).

Image fields (`image`, `symbol`, etc) can be paths to local images or remote
URLs.

Date fields are rendered as in-world dates if a calendar is defined for the
projects and have the syntax (`<year>/<month>/<day>`).

#### Cross-linking

In MDX body text, link to other articles with standard markdown:

```md
The [Great War](the-great-war) began when ...
```

Slugs are resolved relative to the current project. Aliases defined in
frontmatter also work as link targets.

You can also use wiki style links (like in Obsidian):

```md
[[The Great War]] began when ...
```

where the slug (the-great-war) is automatically generated.

If the referenced value is a valid URL, the link is flagged as external and
opens the page in a new tab:

```
[Example](https://example.com)
```

#### In-World Date

```md
:date[3/15/412]
```

Renders the date using the project's custom calendar (if defined), otherwise
falls back to a plain display.

#### Navigation Links

```md
::goto{#article-slug}
```

Renders a styled navigation link to another article.

#### Embedded Abstract

```md
::abstractOf{#article-slug}
```

Embeds the first paragraph of another article as a pull-quote summary.

#### Embedded Timeline

```md
::timeline[Label]{#timeline-slug}
```

Embeds a timeline component. The timeline slug corresponds to the `timelines`
array in `historic` article meta.

#### Embedded Tables

```md
::table{#table-slug}
```

Embeds a table component defined in the `tables` collection.

#### Embedded Maps

```md
::map{#map-slug}
```

Embeds an interactive Leaflet map. The `map-slug` references an entry in the
maps collection.

#### Embedded Family Trees

```md
::familyTree{#main-character-slug}
```

Embeds an interactive family tree starting from the character specified. The
family tree is automatically populated by using the `parents`, `spouses` and
`children` properties in the character metadata.

#### Embedded Statblocks

```md
::statblock{#big-monster}
```

Embeds a creature statblock defined in the `statblocks` collection. If a
statblock defines stats for more than one game system, a selector is shown to
switch between them.

### Categories

Categories group articles. MDX files in `categories/`:

```
src/content/my-world/categories/history.mdx
```

**Frontmatter:**

```yaml
---
title: "History"
---
```

Reference a category from an article with `category: history` in frontmatter.

### Documents

Documents are in-world prose documents (letters, texts, lore books). MDX files in `documents/`:

```
src/content/my-world/categories/history.mdx
```

**Frontmatter:**

```yaml
---
title: "The Treaty of Ash"
---

*Signed in the third month of the year 412 AR...*
```

### Maps

Interactive Leaflet maps. JSON/YAML files in `maps/`:

```
src/content/my-world/handouts/sealed-letter.(json|yaml)
```

```json
{
  "name": "World Map (400 AR)",
  "description": "A Map of the World drawn by Jhon Smith",
  "caption": "The known world, circa 400 AR",                             # Caption to display under the embedded map
  "image": "./world-map.jpg",                                             # Relative path to the map image or remote URL
  "markers": [
    { "x": 540, "y": 320, "label": "The Capital", "link": "the-capital" }
  ]
}
```

Markers display pins on the map (`x` / `y` are pixel coordinates), and can be
used to reference articles (`link` is an article slug).

### Timelines

Standalone timelines for important sequences of events. Work like embedded
timelines, where the slug used is the filename. JSON/YAML files in `timelines/`:

```
src/content/my-world/timelines/world-history.(json|yaml)
```

```json
{
    "name": "History of the World",
    "description": "The most important events of the World"
}
```

This will show all historic articles that include `world-history` in
the `timelines` metadata array.

### Handouts

Handouts are player-facing files (PDFs, images). JSON/YAML files in `handouts/`:

```
src/content/my-world/handouts/sealed-letter.(json|yaml)
```

**Data:**

```json
{
  "title": "The Sealed Letter",
  "description": "A letter found in the ruins of Ur.", # Short description of the document
  "file": "./sealed-letter.pdf"                        # Relative path to the file or remote URL
}
```

Place the referenced file alongside the JSON/YAML.

### Tables

Tables are lists of items to be used for random generation. JSON/YAML files in `tables/`:

```
src/content/my-world/tables/big-folk-names.(json|yaml)
```

**Data:**

```json
{
  "title": "Big Folk Names",
  "caption": "Common names among Big Folks", # Caption of the table
  "header": "Name",
  "items": [
    {
      "value": "Jhon",
      "weight": 2
    },
    {
      "value": "Jhonny"
    },
  ]                                          # List of items of the table with an optional weight
}
```

Embed tables in your articles using the `:table` directive.

### Statblocks

Creature statblocks for tabletop encounters. JSON/YAML files in `statblocks/`:

```
src/content/my-world/statblocks/big-monster.(json|yaml)
```

**Data:**

```yaml
name: Big Monster
description: An evil creature that lives near New City.
image: https://placehold.co/600x400
systems:
    # stats for various systems
```

A statblock can define stats for multiple systems under `systems` at once the
embedded component lets readers switch between them.

Supported systems:

- D&D 5e
- Shadowdark
- Pathfinder 1e

Embed statblocks in your articles using the `::statblock` directive.
