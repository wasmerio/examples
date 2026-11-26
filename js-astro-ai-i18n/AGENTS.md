# AGENTS.md

Instructions for any AI agent working in this repository. `CLAUDE.md` is a
symlink to this file, so Claude Code, Cursor, Codex and anything else reading
`AGENTS.md` get the same manual.

Read this before touching content, copy or configuration. The parts that look
like style preferences are not: a multilingual site fails by rendering a
correct-looking page in the wrong language, and most of the rules below exist to
make that failure impossible rather than unlikely.

## What this repository is

An Astro site in four languages, and the workflow that keeps the other three up
to date with the first one.

The site's content is this project's own documentation, so the demo is the thing
it documents: the pages explaining the workflow are published in the four
languages that workflow produced. Keep that property. A change to how
translation works that leaves the copy describing the old behaviour has broken
the demo, not just the docs.

The site itself stays deliberately thin: a home page, an about page, a Markdown
journal, four SVGs and no colour. The part worth copying is everything under
`scripts/`, `src/i18n/` and this file.

**English is the source. Everything else is generated and reviewed.** Nobody
hand-writes a French string, and no agent should either. The way to change the
French is to change the English and re-run the translation.

## Layout

| Path | What it is |
| --- | --- |
| `src/i18n/config.ts` | every decision about languages: the locale list, the URL shape, what an untranslated page does |
| `src/i18n/strings/en.json` | the site's copy. **Hand-written. The only file that defines which keys exist** |
| `src/i18n/strings/{fr,de,es}.json` | generated. Never edit by hand |
| `src/i18n/strings/.i18n-lock.json` | which English string each translation was made from |
| `src/i18n/ui.ts` | loads the above, falls back to English key by key |
| `src/i18n/blog.ts` | resolves a post for a locale: the translation, or the English original standing in |
| `src/content/blog/en/*.md` | the journal. Hand-written |
| `src/content/blog/{fr,de,es}/*.md` | generated. Never edit by hand |
| `src/content/blog/.i18n-lock.json` | same idea, per post |
| `src/pages/[...locale]/` | four route files that answer for every locale |
| `scripts/i18n.mjs` | status, translate, bless, check |
| `scripts/lib/aiglot.mjs` | the only file that talks to AI Glot |
| `skills/translate-site/SKILL.md` | the procedure, as a skill. Copy the folder into your agent's skills directory to use it |

## Commands

```bash
npm install
npm run dev              # http://localhost:4321
npm test                 # assertions, then a real build
npm run i18n:status      # what is missing, what is out of date, what it costs
npm run i18n:translate   # translate exactly that
npm run i18n:check       # what CI runs
```

Node 22.18 or newer. The scripts import `src/i18n/config.ts` directly and rely
on Node stripping the types, which is unflagged from 22.18. `.nvmrc` pins the
major.

## The language model, in five rules

1. **The default locale is not prefixed.** `/about` is English, `/fr/about` is
   French. Adopting a language later moves no existing URL.
2. **The path after the locale segment is the translation key.**
   `fr/blog/quiet-tools` is the French `blog/quiet-tools` because the paths
   match, and for no other reason. There is no mapping table, and adding one
   (to get localized slugs) means the picker, the `hreflang` set, the freshness
   check and the sitemap all start reading from it. Each of them is then one
   stale row away from being wrong.
3. **Every locale answers for every page.** `/de/blog/four-languages` exists
   whether or not the German file does. What it serves is
   `untranslated` in `src/i18n/config.ts`.
4. **A fallback page is never indexed as itself.** It carries
   `noindex, follow`, canonicalises to the English URL and is not advertised as
   that locale's alternate. Without this
   you have told search engines that one page exists at four URLs in four
   languages: rankings split and the wrong URL wins.
5. **A missing string falls back key by key, and is still reported.** The page
   never has a hole in it, and `npm run i18n:status` still counts the gap. Both
   halves matter: the first is for the reader, the second is so nobody forgets.

### The two behaviours for an untranslated page

One word in `src/i18n/config.ts`:

```ts
export const untranslated: 'fallback' | 'redirect' = 'fallback';
```

| | `fallback` (default) | `redirect` |
| --- | --- | --- |
| `/de/about`, untranslated | exists, serves English, shows a notice | sends the reader to `/about` |
| Canonical | `/about` | n/a |
| `hreflang` for `de` | not advertised | not advertised |
| Language picker | switches, marks the entry `EN` | same |
| Right when | the locale is substantial; a shared link must keep working | the locale is three pages old and you want it to stay honest |

**Start on `redirect`, move to `fallback`.** At three translated pages,
`fallback` publishes a lot of English duplicates; canonicalised, so not
harmful, but useful to nobody. Past a certain size the 404-or-duplicate trade
flips, because a documentation-shaped site is permanently half-translated: that
is the steady state, not a transitional one.

In a static build `redirect` is rendered as a meta refresh
(`src/layouts/Redirect.astro`). On a real host, move it to a redirect rule at
the edge and delete that file.

### If you are adapting this to a site whose pages are files

This repository routes every locale through `src/pages/[...locale]/` because
its pages are built from data. A site whose pages are literal files per locale
(`src/pages/fr/about.astro`) should use Astro's own `i18n.fallback` instead:

```ts
i18n: {
  locales: ['en', 'fr', 'de', 'es'],
  defaultLocale: 'en',
  fallback: { fr: 'en', de: 'en', es: 'en' },
  routing: { prefixDefaultLocale: false, fallbackType: 'rewrite' }, // or 'redirect'
}
```

`rewrite` is this repository's `fallback`; `redirect` is its `redirect`. Astro
will not do the canonical and `hreflang` half for you, so keep
`src/layouts/Base.astro`'s logic whichever route shape you pick.

## The translation workflow

```bash
npm run i18n:status               # read this first, every time
npm run i18n:translate -- --dry-run   # price it, spend nothing
npm run i18n:translate            # send it, write it back
git diff                          # the review step, which stays with a person
```

`status` is the whole point of the lock files. It separates two different
problems that look identical from the outside:

- **missing** (`+`): the locale has never had this string or post.
- **out of date** (`~`): it has one, but the English has changed since. The
  lock stores the hash of the English text each translation was made from, so
  this is a fact rather than a guess.

`translate` sends **only** what `status` reported, for every locale, **in one
batch**. Do not loop over locales calling it once each: one batch is one
analysis, one plan, one approval, one poll, and the translator sees the whole
site's vocabulary at once, which is what keeps a term consistent between a
navigation label and the post that uses it.

### What is never sent

`scripts/i18n.mjs` skips keys named `name`, `value`, `href`, `id`, `icon`,
`slug` and `image`, and takes `date`, `author` and `glyph` from the English
file every time. A translated `name` renames a person; a translated `value`
turns `2019` into a word; a translated `glyph` draws nothing. All three fail
silently, which is why this is a hard skip in the code and not a sentence in
the instructions given to the translator.

### Two kinds of instruction, and they are not interchangeable

This is the part that is easy to get wrong, and getting it wrong is silent.

**The plan instruction** is scope. It is read once, against the shape of the
file, and the priced plan is built from it. "Each top-level key is a language
code; translate the values; never touch the inner keys." It lives in
`translateBundle` in `scripts/lib/aiglot.mjs`.

**The rules** (`HOUSE_RULES`, `MARKDOWN_RULES`, `SEO_RULES`) are string-level.
They are applied while each individual string is written, so they can only
describe something visible *inside one string*: a placeholder, a product name,
a code span, a length limit.

| Wrong as a rule | Why | Where it belongs |
| --- | --- | --- |
| "Translate every value" | no file is in view at that point | the plan instruction |
| "Skip the first column" | same | the plan instruction |
| "Keep `{count}` verbatim" | visible inside the string | a rule ✓ |
| "A meta title must fit in 67 characters" | visible inside the string | a rule ✓ |

A file-shaped sentence in the rules does nothing at all, and nothing reports
it.

### After a run

- Read the diff. That is the review this workflow deliberately keeps for a
  person, and it is the reason machine translation is acceptable here.
- Check the lock files are committed with the translations. A translation
  without its lock entry reports as out of date forever.
- Never hand-fix a generated file. If a translation is wrong, fix the English,
  or add a rule to `scripts/lib/aiglot.mjs` so the fix survives the next run,
  or add a glossary term in AI Glot so it survives every run on every surface.

## Setting AI Glot up

The site builds, serves and tests with no account: every translation it ships
is a committed file. An account is needed only to **run** a translation.

Walk a user through it in this order, and stop at the first thing they have
already done.

**1. An account and a key.** [ai-glot.com](https://ai-glot.com) →
[app.ai-glot.com/developer](https://app.ai-glot.com/developer) → create a
workspace API key. Keys are workspace-scoped; make a separate one for CI with
the minimum scopes. Never print a key, never commit one, never pass it on a
command line where the shell records history.

```bash
cp .env.example .env
# put the key in AIGLOT_API_KEY
```

**2. Pick a transport.** Both do the same four calls.

| | CLI (default) | API (`AIGLOT_TRANSPORT=api`) |
| --- | --- | --- |
| Install | `npm i -g @ai-glot/cli` (0.4.0 or later), Node 20+ | nothing |
| Credentials | keychain, or `AIGLOT_API_KEY` | `AIGLOT_API_KEY` |
| Retries, backoff, `Retry-After` | handled | yours to write |
| Survives a REST shape change | yes | no |
| Right for | a laptop, most CI | an image you do not control, or a non-Node stack |

Recommend the CLI unless something rules it out.

```bash
npx @ai-glot/cli auth login          # browser
npx @ai-glot/cli auth login --device # over SSH
npx @ai-glot/cli auth login --key "$AIGLOT_API_KEY"   # CI
aiglot auth status && aiglot account && aiglot doctor
```

**3. Prove it works before spending anything.**

```bash
npm run i18n:status
npm run i18n:translate -- --dry-run
```

`--dry-run` creates the batch and reads its priced plan, then stops. Creating
and planning are free and repeatable as often as you like.

### The API, if that is the transport

Base URL `https://api.ai-glot.com/v1`, `Authorization: Bearer <key>`. Responses
carry `data` and `request_id`; list responses add `has_more` and `next_cursor`.

| Call | What it does | Spends credits |
| --- | --- | --- |
| `POST /v1/batches` | upload: `{ content, filename, instruction }`, or `file_url`, or multipart | no |
| `GET /v1/batches/{id}` | status, plan, progress, error | no |
| `POST /v1/batches/{id}/plan` | write (`instruction`) or edit (`refinement`) the plan | no |
| `POST /v1/batches/{id}/approve` | `{ quality, custom_instructions }` — **starts the work** | **yes** |
| `GET /v1/batches/{id}/result?format=content` | the translated file inline (≤ 2 MB); omit `format` for a signed link | no |
| `POST /v1/batches/{id}/cancel` | stop a running one; work already done is still charged | — |
| `GET /v1/account`, `/v1/credits`, `/v1/usage` | workspace, balance, consumption | no |
| `GET /v1/languages` | the language catalogue; the one call needing no credential | no |
| `GET/POST/PUT/PATCH/DELETE /v1/glossaries[/{pair}]` | terms that must always be translated the same way | no |

Statuses: `analyzing`, `awaiting_instructions`, `awaiting_approval`,
`translating`, `completed`, `failed`, `cancelled`. **Wait for a terminal status
(`completed`, `failed`, `cancelled`), never for one specific value** — a status
added later would otherwise read as "still running" forever.

Branch on the exit code or `error.code`, never on message text. CLI exit codes:
1 API error, 2 bad arguments, 3 auth, 4 not found, 5 rate limited, 6 conflict.

### Cost

`approve` is the only call that spends anything. Lite is one credit per three
words, Standard one per word. This repository defaults to Lite
(`AIGLOT_QUALITY`), which is right for copy that a person reads in a diff
before it ships. Use Standard for legal text and pricing pages.

`npm run i18n:status` prints the estimate in both tiers before you send
anything.

## Checklists

**Adding a language**

1. Add it to `localeConfig` and `translationLanguage` in `src/i18n/config.ts`.
2. `npm run i18n:status` — it now reports the whole site as missing.
3. `npm run i18n:translate -- <code>`.
4. `npm test`, read the diff, commit the translations and both lock files.

Nothing else. No second sidebar, no route file, no picker entry: they all read
the locale list.

**Changing English copy**

1. Edit `src/i18n/strings/en.json` or a file in `src/content/blog/en/`.
2. `npm run i18n:status` — the string or post is now `~ out of date`.
3. `npm run i18n:translate`.

**Adding a page**

1. Add a route under `src/pages/[...locale]/` with the same
   `getStaticPaths` shape as its neighbours.
2. Add its copy under a new top-level key in `en.json`.
3. Use `hasSection(locale, '<key>')` to decide `translated`, and pass it to
   `Base` so the canonical, the `hreflang` set and the notice stay correct.
4. Translate.

## Rules for agents

- **Never edit a generated file**: `src/i18n/strings/{fr,de,es}.json`, anything
  under `src/content/blog/{fr,de,es}/`, or a lock file. The next run overwrites
  it and the improvement is lost without a trace.
- **Never run `bless` to make `status` quiet.** It exists for translations that
  predate the lock file and whose English has not moved. Using it on a real gap
  hides the gap permanently.
- **Never hard-code a locale list** anywhere but `src/i18n/config.ts`.
- **Never let a link inside a translated page point at an English URL** when a
  translation of the target exists. Use `localizedPath`.
- **Ask before approving** when a run is larger than the user expects. `status`
  prints the estimate; show it.
- **Write English copy in the register of the existing copy**: direct,
  concrete, no marketing adjectives, and no em dashes in `en.json` or an
  English post. Translations inherit whatever the English does, in three
  languages at once, and an em dash is the clearest tell that a machine wrote
  the sentence. Comments and documentation are prose, not copy, and are yours
  to punctuate.
- **Do not add a dependency** without saying why in the pull request.

## Things that have bitten this shape of site before

- **Links inside a translated page.** The page renders, the link works, and it
  is in the wrong language. Nothing catches it but a reader.
- **A fallback page indexed as itself.** Four URLs competing for one page's
  ranking.
- **Position used as an identity.** Keying a translation by its index in the
  file means one inserted paragraph shifts every translation below it, silently
  and in every language at once. Key by the hash of the source text, which is
  what the lock files do.
- **A locale named in the config but empty.** Under `fallback` it would
  publish the whole site in English at URLs nothing links to. Here a locale
  exists from its first translated file, because both surfaces read the files
  rather than the config.
- **A translated file with no English source.** Looks like shipped work, is
  served to nobody. `npm run i18n:check` fails on it, and so does `npm test`.
- **German is a third longer than English.** Never size a button to its label.
