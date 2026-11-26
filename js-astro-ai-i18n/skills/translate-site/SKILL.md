---
name: translate-site
description: Translate this Astro site into its other languages with AI Glot. Use when English copy or a journal post has changed, when a locale has fallen behind, when a new language is added, or when the user asks what is untranslated, what it would cost, or to set AI Glot up.
---

# Translating this site

The procedure. The reasoning behind it is in `AGENTS.md`; read that before
changing anything structural.

## 1. Look before sending

```bash
npm run i18n:status
```

It prints, per locale and per surface:

- `+ missing` — never translated.
- `~ out of date` — the English changed after the translation was made. The
  lock files store the hash of the English each translation came from, so this
  is a fact, not a guess.
- an estimate in source words, and in credits for both quality tiers.

**Show the user this output before spending anything**, especially the credit
line. If the number is larger than they expect, that is the moment to find out
why: usually a reformatted English file marked everything stale.

## 2. Check the credential

```bash
aiglot auth status
```

Not authenticated, or no `aiglot` on the machine? Walk them through **Setting
AI Glot up** in `AGENTS.md`: account, workspace API key, `.env`, and CLI versus
API transport. Do not paste a key into a command line, a file the repository
tracks, or the conversation.

## 3. Price it without paying

```bash
npm run i18n:translate -- --dry-run
```

Creates the batch and reads its priced plan, then stops. Creating and planning
cost nothing and can be repeated as often as you like; only `approve` spends
credits, and `--dry-run` never reaches it.

## 4. Send it

```bash
npm run i18n:translate                  # everything behind, every locale, one batch
npm run i18n:translate -- fr de         # only these locales
npm run i18n:translate -- --only blog   # only the journal
npm run i18n:translate -- --all         # retranslate everything, ignoring the locks
```

One batch carries every locale and both surfaces. Do not loop over locales:
that pays for the analysis several times and lets a term drift between a menu
label and the post that uses it.

`--all` is a deliberate, paid decision. Reach for it only when the rules or the
glossary changed and the existing translations need to be redone.

## 5. Review

```bash
git diff
npm test
```

Reading the diff is the review step this workflow keeps for a person, and it is
the reason machine translation is acceptable here. Commit the translations
**and** the two `.i18n-lock.json` files together: a translation without its
lock entry reports as out of date forever.

## When a translation is wrong

Never edit the generated file. The next run overwrites it.

| The problem | The fix |
| --- | --- |
| The English was ambiguous | fix `en.json` or the English post, translate again |
| A term should always be translated the same way | a glossary term in AI Glot: it reaches every language and every future run |
| A whole class of string comes back wrong (placeholders, code spans, length) | a rule in `scripts/lib/aiglot.mjs` |
| A field should never be translated at all | add its key to `NOT_COPY` in `scripts/i18n.mjs` |

## What not to do

- Do not run `npm run i18n:bless` to make `status` quiet. It records existing
  translations as current without translating, and on a real gap it hides the
  gap permanently. It is for translations that predate the lock file.
- Do not hand-write a translated string, even a one-word one.
- Do not translate `date`, `author`, `glyph`, `name`, `value`, `href` or
  `slug`. They are data, and all of them fail silently.
- Do not add a locale to `astro.config.ts` by hand. `src/i18n/config.ts` is the
  list; the config reads it.
