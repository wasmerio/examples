# Astronomic Vesper

This file tells a coding agent (Claude Code, Cursor, or another coding agent) how this project works. Read it before you change anything. `README.md` has the full setup notes, and the online docs are at https://astronomic.dev/docs/vesper.

Claude Code reads this file when the project has no `CLAUDE.md`. If you also want a `CLAUDE.md`, make its first line `@AGENTS.md` so this file still loads.

## What this is

A free (MIT) Astro 7 theme for a personal site: a blog and a portfolio in one. It has a home page with a photo collage, articles (with categories, tags and series), projects, speaking, uses, a Now page, an about page with a work history, search and a privacy page. Styling is Tailwind CSS v4. Content comes from Markdown files by default, or from EmDash (a CMS built on Astro, with an admin UI). Pages read content only through one content model, so both sources give the same site. The theme has no backend and runs no analytics.

## Commands

Use pnpm. Node version: `.nvmrc`.

```sh
pnpm install
pnpm dev             # dev server at http://localhost:4321 (Markdown source)
pnpm build           # Markdown: a static site in dist/ (then Pagefind indexes it)
pnpm preview         # serve the build (site search works here, not in dev)
pnpm check           # astro check: type-check
pnpm seed:emdash     # EmDash: load the schema, SEO values and demo images into ./data.db (--reset starts over)
pnpm start           # EmDash: run the server build (node ./dist/server/entry.mjs)
pnpm test:units      # the theme's unit tests
pnpm test:adapter    # build the selected source and check its content and pages
pnpm test:parity     # build every source and compare content and pages
pnpm test:no-emdash  # a Markdown build needs no EmDash package
pnpm test:skins      # each accent's values and contrast in every look
pnpm test:system     # the /system pages: off in a build by default, on with ASTRONOMIC_SYSTEM=1
```

## Folder map

Most of the layout you can read from the project. These are the parts that are easy to get wrong:

| Path | What it holds |
| --- | --- |
| `content/site.json` | Your profile and settings in the Markdown source: name, role, avatar, socials, Now line, newsletter form, `cvFile`, `sampleContent`. The look is in `src/theme.config.ts` |
| `seed/` | EmDash's schema and demo content, used by `pnpm seed:emdash`. It shares only the images in `content/media/` with `content/`: a text change in one does not reach the other |
| `src/theme.strings.ts` | Every word the theme writes itself |

`packages/ui`, `packages/content` and `packages/theme-core` are part of this repo. You may change them, but prefer changes in the theme's own files.

## Content: Markdown or EmDash

- **Markdown (default).** Edit the files in `content/`. Images go in `content/media/`. The build is a static site.
- **EmDash.** Run `pnpm seed:emdash` once. Then change `"markdown"` to `"emdash"` in the `contentSource(...)` line of `astro.config.mjs` (or use `CONTENT_SOURCE=emdash` for one run), then `pnpm dev`. The admin is at `http://localhost:4321/_emdash/admin`. The site title and tagline are EmDash's site settings; the rest are in the one-entry "Profile" collection. Setting names there are snake case (`now_status`, `cv_file`). Data lives in `data.db` and `uploads/`. The build is a Node server app; run it with `pnpm start`.
- To add a field, change `src/content/model.ts` first, then map it in every source in `src/content/sources/`, then run `pnpm test:adapter` and `pnpm test:parity`.

Set the public URL with `SITE_URL` (or the `site` line in `astro.config.mjs`) before a real build. The feed, sitemap, robots.txt, share images and the newsletter form's hidden links use it. On EmDash, set it when the server runs too (`SITE_URL=https://<your-domain> pnpm start`): without it, links use the address the server sees for each request (`http://localhost:<port>` unless `security.allowedDomains` names the domain) and the log has one line.

## Settings, looks and colors

- **The look** is `src/theme.config.ts`, for both sources. An unknown id stops `pnpm check`, `pnpm dev` and every build.
- **Look** (colors, fonts and photo treatment): `clear`, `field`, `trail`, each in `src/styles/looks/`. **Accent** (links, buttons, focus ring, small accent text): `glacier`, `moss`, `alpenglow`, `dusk`, each in `src/styles/accents/`. Run `pnpm test:skins` after any change there.
- **Pages:** `pages` turns `projects`, `speaking`, `uses` and `now` on or off everywhere (nav, footer, sitemap, search, feed).
- **The setup check** runs on `pnpm build` (Markdown) and `pnpm dev`. It stops on a collage of the wrong size (0, 4, 5 or 6 photos), bad links, unsafe form fields, an empty alt text, placeholder addresses unless `sampleContent` is on and `SITE_URL` is not a real address, and `[[fill in: …]]` markers in the text of a page, post, project, talk, uses item, job or collage photo unless `sampleContent` is on. With it on, the build warns about each marker, whatever `SITE_URL` says. Placeholder addresses are an address on `example.com`, its subdomains or `.example` (settings, menus, and the links of projects, talks, uses items, jobs and collage photos), and a profile site's home page as a social link (`https://github.com`, with no username). Fix the setting; do not turn the check off.
- **Own name, sample addresses.** Once `name` in `content/site.json` is no longer the sample's (Rowan Ellery), a static build or `astro dev` stops on any placeholder address or `[[fill in: …]]` marker left, even with `sampleContent` on, with or without `SITE_URL`. `ASTRONOMIC_ALLOW_PLACEHOLDERS=1` lets a private preview build, with a warning that the newsletter form and email reach no one. Never set it for a live build or as a default. A production EmDash server runs no check: it hides the form and email on placeholder addresses instead.
- **The newsletter form.** A `newsletterAction` on a placeholder address sends nothing on a site that is not live: it says "This is a demo, so nothing was sent." A real `SITE_URL` stops a static build on that address. A production EmDash server always counts as live, so that form does not show: the card becomes "Follow by RSS", and the server log names the setting. Set a real address before launch.

## Rules to keep

- Keep the site accessible: real headings in order, a visible focus ring, labels on form fields and buttons, and the skip link. Every accent must pass 4.5:1 as text in every look, light and dark. Under reduced motion, nothing moves.
- Every content photo needs alt text. In Markdown that is the key beside the photo (`thumbnailAlt`, `imageAlt`, `groupImageAlt`, `alt` on a collage photo); in EmDash it is the media item's alt text. Logos are decorative.
- Style with the design tokens (`--ui-*` and the theme's `--v-*` variables) and token-based classes. Do not hard-code colors, and do not use Tailwind's `dark:` variant: dark mode swaps the token values.
- Use the components in `packages/ui` and `src/components/` before writing new markup. Components take plain props, never CMS objects.
- Pages read content only through `src/content/`. Never import EmDash in pages or components, so the Markdown build keeps working.
- Links in settings and content must be `https:` URLs or site paths (`#`, `mailto:` and `tel:` also work in content links).
- The privacy page (`content/pages/privacy.md`) is a template. Fill each `[[fill in: …]]` marker with the owner's real facts; never invent them.

## Check your work

1. `pnpm check`, `pnpm test:units` and `pnpm build` pass.
2. After content or model changes: `pnpm test:adapter` and `pnpm test:parity`.
3. After look or color changes: `pnpm test:skins`.
4. Open the changed pages in `pnpm dev` in light and dark mode, at phone width, and with reduced motion on.
