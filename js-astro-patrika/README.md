<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Patrika](https://github.com/thelocalhoststudio/patrika) Astro theme by thelocalhoststudio, copied from commit `322b907954bf85fde0a6cd9d2d57eee14d5e34bf` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-patrika.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [thelocalhoststudio](https://github.com/thelocalhoststudio), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Patrika

A notebook-inspired personal publishing theme built with Astro. Not a blog
theme — it draws on commonplace books, field notebooks, literary journals,
and printed magazines, favoring typography and whitespace over decoration.

See [AGENTS.md](AGENTS.md) for the full design philosophy and current
implementation reference.

## Features

- **Content collections** for essays, notes, and standalone pages, plus a
  config-as-content `siteConfig` collection.
- **Obsidian-flavored markdown** — wikilinks (`[[Page]]`, `[[Page#Heading]]`),
  image embeds, `%%comments%%`, `==highlights==`, and `:::aside`/`:::annotation`
  directives, powered by a native [Sätteri](https://www.npmjs.com/package/satteri)
  markdown pipeline (not remark/unified).
- **Backlinks** between notes, computed from wikilinks.
- **Inline image galleries** with a lightbox (GLightbox) for consecutive
  images in a post or note.
- **A generic browse system** (`/browse`) driven entirely by an optional
  `meta` object in frontmatter and a `browse` config block — no hardcoded
  metadata keys.
- **Search** via [Pagefind](https://pagefind.app)'s native Component UI.
- **RSS and sitemap** out of the box.

## Quickstart

```sh
pnpm install
pnpm dev
```

Then:

1. Edit [src/content/siteConfig/config.yaml](src/content/siteConfig/config.yaml)
   — set your real domain (`url`), author, navigation, and social links.
2. Set the matching `site` value in [astro.config.mjs](astro.config.mjs)
   (required for RSS/sitemap to generate correct absolute URLs).
3. Add your own writing under `src/content/posts/`, `src/content/notes/`,
   and `src/content/pages/`, replacing the sample entries there.

## Commands

| Command        | Action                                                                 |
| :------------- | :---------------------------------------------------------------------|
| `pnpm install` | Install dependencies                                                  |
| `pnpm dev`     | Start the dev server at `localhost:4321`                               |
| `pnpm build`   | Build to `./dist/`, then build the Pagefind search index and copy it into `public/` |
| `pnpm preview` | Preview the production build locally                                   |
| `pnpm astro …` | Run any Astro CLI command (`astro check`, `astro add`, …)              |

## Customization

- **Fonts** — the `fonts` array in `astro.config.mjs`.
- **Colors and typography** — `src/styles/`.
- **Browse dimensions** (e.g. places, trips) — the `browse` key in
  `config.yaml`; each entry turns a `meta.<key>` frontmatter field into a
  browsable index at `/browse/<slug>`.

## Learn more

[Astro documentation](https://docs.astro.build)
