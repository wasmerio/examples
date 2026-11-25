# Working in this codebase

Astro Rocket is a starter theme. You are almost certainly here to help someone
build **their** website on top of it, not to develop the theme itself. This file
tells you where everything lives and which conventions to follow, so you can
make changes that fit rather than changes that merely work.

## The shape of the project

```
src/config/          Site settings — start here for almost any request
src/content/         The site's content (Markdown/MDX/JSON collections)
src/i18n/            All user-facing interface text, per language
src/components/      44 components, grouped by purpose
src/pages/           Routes; a file here is a URL
src/layouts/         Page shells the routes render into
src/lib/             Helpers for blog, projects, tags, SEO, themes
src/styles/          Design tokens and the eight colour themes
component-registry.json   Machine-readable catalogue of every component
```

**Read `component-registry.json` first.** It lists every component with its
category, purpose and props. It is the fastest way to find out whether the
thing you are about to build already exists — it usually does.

It is also the only source for the component count. Every number in the
README and in the site copy is derived from it, and
`src/__tests__/component-count.test.ts` fails if they drift apart. The figure
used to be 57, taken from another theme's documentation; nothing checked it,
so it survived in six places while the showcase page's own badge said 50+.
Do not write a component count you have not counted from this file.

## Where to make a change

| The request | The file |
|---|---|
| Site name, logo, social links, contact details | `src/config/site.config.ts` |
| Navigation menus | `src/config/nav.config.ts` |
| Languages | `src/config/i18n.config.ts` |
| Cookie-consent behaviour | `src/config/consent.config.ts` |
| Any interface text, including `aria-label`, `alt`, `placeholder` and `title` | `src/i18n/en.json` (and other locales) |
| A blog post | a new `.mdx` file in `src/content/blog/<locale>/` |
| A project | a new `.mdx` file in `src/content/projects/<locale>/` |
| Colours | `src/styles/themes/*.css` — eight themes, tokens only |

**Page copy is not in the page files.** Text lives in `src/i18n/en.json` and is
read through `t()`. Editing a heading usually means editing JSON, not `.astro`.
If a page appears to have hard-coded text, check the locale file first.

## Before a feature goes in

**Two questions, before the merge and not after.** Does a general user of this
theme need it? Does the theme need it? A working contribution answers neither,
and a feature merged on the strength of working code arrives with a
maintenance surface nobody agreed to carry.

Answering no is not a rejection of the contributor. It is cheaper for everyone
than a feature the theme carries and nobody maintains.

## Conventions worth keeping

- **Use existing components.** Check the registry before writing a new one.
  Components share one design language; a bespoke element breaks it.
- **Use the design tokens.** Colours come from CSS custom properties defined in
  `src/styles/`. Never hard-code a hex value — it will not follow the colour
  theme, and it will fail the contrast checks.
- **Every locale file stays in step.** Adding a key to `en.json` means adding it
  to every other locale, or that language falls back mid-page.
- **Motion respects `prefers-reduced-motion`.** Anything animated must stop for
  visitors who ask it to.
- **Images go through `astro:assets`.** Use the `<Image>` component so sizes and
  formats are generated at build time.
- **Zero JavaScript unless it earns its place.** Astro ships none by default;
  reach for a `<script>` only when the interaction genuinely needs one.

## Commit messages

This repository is public. Its history is read by people deciding whether to
trust the theme, so a commit message is part of the product.

- **Describe the change and why the design is what it is.** A maintainer
  reading this in a year needs the reasoning behind a decision, not an account
  of how it was reached.
- **Never narrate the process.** No first-person account of what was tried,
  what was missed, or what was learned. "The gate is scoped to the demo
  deployment" belongs here; "I only tested two states" does not.
- **Assistant trailers stay.** A commit written with an assistant ends with a
  `Co-Authored-By` line naming it and a `Claude-Session` link to the session
  that produced it. The tooling adds both and they are kept, so the authorship
  recorded on a commit matches who wrote it. This file asked for them to be
  stripped until 2026-09-05, while 218 commits on `main` carried them; the rule
  now says what the history does.
- **Present tense, describing the code after the change.** "Scope demo content
  to the demo deployment", not "Fixed the demo leaking".
- **The subject names the change; it does not argue for it.** "Rewrite the
  README overview", not "Say what Astro Rocket is before saying what is inside
  it". No comparisons, no "not X but Y", no reasoning in the title — that is
  what the body is for. Somebody scanning the history wants to know what each
  commit did.
- **Keep the subject line to 72 characters, and prefer 50.** GitHub builds a
  pull request's title from the subject and cuts it at that length, moving what
  is left into the description — so an over-long subject opens the pull request
  with a fragment like "…arsing". The body is where detail belongs; it has no
  limit.

## Checks

- **A check is not finished until it has failed once on purpose.** Write it,
  run it against the broken state it exists to catch, watch it go red, then fix
  the code and watch it go green. A check only ever run against working code is
  an assumption with a green tick on it.
- **Verify the path that fails, not only the path that works.** A container CI
  job whose readiness loop ended in `sleep` passed while the container was
  dead, and an export service with no `SITE_URL` argument shipped localhost
  canonical tags with both build-time guards silent. Both were tested only in
  the state where everything works.

## Commands

```bash
pnpm dev          # development server
pnpm build        # production build — run before declaring work finished
pnpm check        # astro check, TypeScript, ESLint and Prettier
pnpm test         # Vitest unit tests
pnpm fix          # apply ESLint and Prettier fixes
```

`pnpm build` is the real test. It runs `astro check`, the content-collection
schemas and the link validation, and it fails on problems a dev server hides.

## Things that are easy to get wrong

- **Content collections are schema-checked.** Frontmatter that does not match
  `src/content.config.ts` fails the build. Read the schema before adding fields.
- **Drafts are filtered in production only.** `draft: true` still renders in
  `pnpm dev`, so verify with a build.
- **A draft is unreachable.** Linking to a drafted post or project produces a
  404 in production. Check inbound links before drafting something.
- **The theme supports multiple languages.** Locale-prefixed routes are
  generated automatically; do not create `src/pages/<locale>/` files by hand.

## Before you finish

Run `pnpm build`. Then confirm what you changed is actually visible on the page
you changed it on — not merely that the command exited without an error.
