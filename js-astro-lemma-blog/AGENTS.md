# Agent rules for this repo

## The About page content belongs to its author

`src/content/about/` holds the real About page (its text and any file it links to). Do not open, read, search, fetch or change it, or the built About pages, unless the author asks you to.

- For work on the About page's layout or code (`src/components/AboutPage.astro`, `plugins/about.mjs`, the About CSS), use the fictitious profile in `src/about.sample/`: `bun run dev:sample` serves it on port 4399, and `LEMMA_ABOUT=sample bun run build` builds with it. `scripts/deploy.mjs` refuses to deploy a sample build.
- Search with `rg`: `.ignore` makes it skip the folder. `.gitattributes` keeps the folder's text out of `git diff`.

## Other

- Writing posts: see `WRITING.md`. Site settings: `lemma.config.mjs`. Visual rules: `DESIGN.md`.
- Commit messages follow Conventional Commits; a commit-msg hook checks them.
