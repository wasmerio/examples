<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Ai I18n](https://github.com/DuvInc/astro-ai-i18n) Astro theme by DuvInc, copied from commit `dbe03df67aa427cc37bb83bdd5c09e0a513f000f` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-ai-i18n.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** The theme's example env file lists `AIGLOT_API_KEY`, `AIGLOT_TRANSPORT`, `AIGLOT_QUALITY`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [DuvInc](https://github.com/DuvInc), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# astro-ai-i18n

![astro-ai-i18n: a dithered banner with the project name and its one-line summary](docs/hero.png)

An Astro site in four languages. You write English. A command translates the
rest through [AI Glot](https://ai-glot.com), writes the result back as files,
and tells you which translations have fallen behind.

```bash
npm install
npm run dev              # http://localhost:4321
npm run i18n:status      # what is missing, what is out of date, what it costs
```

A fresh clone builds and serves in four languages. It needs no account, no key
and no network. Every translation it ships is a committed file. You only need
an AI Glot account to produce new ones.

The demo site documents this workflow. It is published in the four languages
the workflow produced.

## What you get

- A status command. It separates *never translated* from *translated, then the
  English changed*.
- A translate command. It sends only what is behind, for every language, in one
  batch.
- Two behaviours for an untranslated page, chosen with one word in a config
  file.
- A language picker in the navbar. No JavaScript. It keeps the reader on the
  same page.
- `AGENTS.md` and a skill, so an AI agent can run the whole workflow.

The site itself is small on purpose: a home page, an about page, a Markdown
journal, four SVGs, no colour. The parts worth copying are `scripts/`,
`src/i18n/` and `AGENTS.md`.

## Translation debt is a number

A lock file stores the hash of the English text each translation was made from.
The tooling compares the current English against that hash. So "out of date" is
a fact, not a guess.

```text
UI copy: src/i18n/strings/en.json, 64 strings

  fr   64 current     0 missing     0 out of date
  de   64 current     0 missing     0 out of date
  es   45 current    19 missing     0 out of date

Journal: src/content/blog/en/, 4 posts

  fr    4 current     0 missing     0 out of date
  de    4 current     0 missing     0 out of date
  es    3 current     1 missing     0 out of date   +typography-notes

~585 source words behind (~195 credits in Lite, ~585 in Standard).

  + missing    ~ English changed since the translation was made
```

That is a real clone. Edit one English sentence and run the command again. That
string moves to `out of date` in all three languages.

## One command translates what is behind

```bash
npm run i18n:translate -- --dry-run   # price it, spend nothing
npm run i18n:translate                # send it, write the files back
git diff                              # review it
```

```text
  src/i18n/strings/en.json          written by hand. The only files that
  src/content/blog/en/*.md          define which strings exist
          │
          │  npm run i18n:status
          │     compares each English string against the hash in the lock file
          ▼
  ┌────────────────────────────────────────────────────────────────────┐
  │  fr  current        de  ~ out of date        es  + missing          │
  └────────────────────────────────────────────────────────────────────┘
          │
          │  npm run i18n:translate
          │     sends what is behind, every locale in ONE AI Glot batch
          ▼
  ┌──────────────┐   create ──▶ plan ──▶ approve ──▶ poll ──▶ download
  │   AI Glot    │              (free)   (the only call that spends credits)
  └──────────────┘
          │
          │  writes the results back as ordinary files
          ▼
  src/i18n/strings/{fr,de,es}.json      generated. Never edited by hand
  src/content/blog/{fr,de,es}/*.md
  .i18n-lock.json                       stores the English hash for each
          │                             translation
          ▼
       git diff                         a person reviews the diff
```

One batch carries every language. That means one analysis, one plan, one
approval. It also means the translator sees the whole site at once, which keeps
a term consistent between a menu label and the page it opens.

Machine translation is acceptable here because a person reads the diff before
it ships.

## An untranslated page is a decision

One word in `src/i18n/config.ts`:

```ts
export const untranslated: 'fallback' | 'redirect' = 'fallback';
```

```text
  a reader opens /de/blog/typography-notes, which German has not translated

  untranslated: 'fallback'               untranslated: 'redirect'
  ───────────────────────────            ───────────────────────────
  200, the English body                  sent to /blog/typography-notes
  a notice saying it is not translated    nothing is served under /de/
  robots: noindex, follow                the shared link stops working
  canonical points at /blog/…
  not listed as the German alternate     the locale stays honestly small
    in hreflang

  right once a locale is substantial     right while a locale is thin
```

In both modes the page canonicalises to the English URL. Neither mode lists it
as the German alternate. That is what stops four URLs competing for one page's
ranking.

## How the languages work

| | |
| :--- | :--- |
| URL shape | `/about` is English. `/fr/about` is French. The default locale has no prefix, so adding a language later moves no existing URL |
| Translation key | the path after the locale. `fr/blog/quiet-tools` is the French `blog/quiet-tools` because the paths match. There is no mapping table |
| Missing string | falls back to English, key by key. `i18n:status` still counts it |
| Missing page | `fallback` or `redirect`, per the section above |
| Adding a language | one entry in `src/i18n/config.ts`, then `npm run i18n:translate` |

Every French, German and Spanish string in this repository was produced by AI
Glot. None were written by hand.

One gap is deliberate. Spanish has no About page and is missing one journal
post. This keeps `i18n:status`, the fallback notice and the picker's `EN` mark
visible on a fresh clone. `npm run i18n:translate` fills them in for about 141
credits.

## What is in the repository

```
src/
  i18n/config.ts          locales, URL shape, untranslated page behaviour
  i18n/strings/en.json    the site's copy. Written by hand. The only source
  i18n/strings/*.json     generated. Never edited by hand
  i18n/ui.ts              loads them, falls back to English key by key
  i18n/blog.ts            resolves a post: the translation, or the English original
  content/blog/{en,fr,de,es}/   the Markdown CMS, one folder per language
  pages/[...locale]/      four route files that answer for every locale
  components/, layouts/, styles/global.css
scripts/
  i18n.mjs                status · translate · bless · check
  lib/aiglot.mjs          the only file that talks to AI Glot
skills/
  translate-site/         the workflow as a skill
test/                     assertions that need no network and no key
```

## Set up AI Glot

1. Create a key at [app.ai-glot.com/developer](https://app.ai-glot.com/developer).
2. Run `cp .env.example .env` and set `AIGLOT_API_KEY`.
3. Run `npm i -g @ai-glot/cli && aiglot auth login`. Or set
   `AIGLOT_TRANSPORT=api` and use no CLI.
4. Run `npm run i18n:translate -- --dry-run`.

Creating a translation and planning it are free. You can repeat them as often
as you like. Only approval spends credits, and `--dry-run` stops before it.

[AGENTS.md](./AGENTS.md) has the full walkthrough, the REST endpoint table and
the cost model.

## Deploying

The build is static. Any host that serves files works: Cloudflare, Netlify,
Vercel, GitHub Pages, S3, your own nginx. Nothing calls an API at runtime. The
translations are committed files.

I use Cloudflare. The shortest path is Workers with static assets:

```bash
npm run build
npx wrangler deploy      # after adding a wrangler.jsonc pointing at ./dist
```

Cloudflare Pages, Netlify and Vercel work the same way. Build command
`npm run build`, output directory `dist`.

One decision depends on your host, and only if you chose
`untranslated: 'redirect'`. A static build has no server to answer with a 301,
so that mode renders a meta-refresh page (`src/layouts/Redirect.astro`). It
works everywhere. It is not what you want in production.

| Host | Better answer |
| :--- | :--- |
| Cloudflare | a Redirect Rule, or `_redirects` on Pages |
| Netlify | `public/_redirects` |
| Vercel | `redirects` in `vercel.json` |
| nginx | `return 301` in the location block |

Move it to a rule and delete that layout. A rule answers before any HTML is
sent. It is faster, and the reader sees no blank page.

The default mode needs none of this. Every locale serves a real page at a real
URL.

## Make it yours

1. Replace `src/i18n/strings/en.json` with your copy and `src/content/blog/en/`
   with your posts. Delete the other locale folders and both
   `.i18n-lock.json` files.
2. Set your languages in `src/i18n/config.ts` and your origin in
   `astro.config.ts`.
3. Update the URLs in `SECURITY.md`, `CODE_OF_CONDUCT.md` and
   `.github/ISSUE_TEMPLATE/config.yml`, or delete those files. They point at
   this project's maintainer.
4. Run `npm run i18n:translate`.

Nothing in `src/` or `scripts/` needs editing to change language, copy or
behaviour. If you find something that does, open an issue.

## Status and licence

A working example. One person maintains it, on a best-effort basis. It is not a
published package. Fork it and take what you need.

MIT. See [LICENSE](./LICENSE), [CONTRIBUTING.md](./CONTRIBUTING.md) and
[SECURITY.md](./SECURITY.md).

AI Glot is a paid product. This repository calls its public CLI and API and is
not otherwise affiliated with your use of it.

If you run Astro sites for clients and would rather not host them yourself, I
also build [Atelier201](https://atelier201.com): managed Astro sites that their
owners edit in a form or by asking an assistant, with extra languages built in.
