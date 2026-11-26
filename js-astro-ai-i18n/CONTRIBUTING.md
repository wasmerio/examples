# Contributing

Thanks for looking. This is a one-person project maintained on a best-effort
basis, so the most useful thing you can do before writing code is open an issue.
A small fix is always welcome; a large one is worth agreeing on first.

## Getting set up

Node 22.18 or newer. Astro itself asks only for 22.12, but `scripts/i18n.mjs`
and the tests import `src/i18n/config.ts` directly and rely on Node stripping
the types, which is unflagged from 22.18. `.nvmrc` pins the major, so `nvm use`
gets you the version CI runs.

```bash
npm install
npm run dev     # http://localhost:4321
npm test        # assertions, then a real build and a typecheck
```

`npm test` passes on a fresh clone with no key, no network and no AI Glot
account. If it does not, that is a bug worth reporting on its own.

## Sign your commits off

Every commit needs a `Signed-off-by` line, which certifies that you wrote the
patch or otherwise have the right to submit it under the MIT licence. This is
the [Developer Certificate of Origin](https://developercertificate.org): one
line, no paperwork, no copyright assignment.

```bash
git commit -s -m "Your message"
```

Pull requests without it will be asked for an amend.

## What makes a change likely to be merged

**Behaviour belongs in `src/i18n/config.ts`.** If a site has to edit a
component, a route or a script to change its languages, its URL shape or what
an untranslated page does, that is a gap in the config surface. Closing it
there beats documenting the workaround.

**One source, one answer.** The locale list lives in one file. Whether a page
is translated is answered in one function. Whether a translation is out of date
is answered by the lock file. Adding a second place that answers any of those
three is the failure this repository is arranged to prevent.

**Generated files stay generated.** `src/i18n/strings/{fr,de,es}.json`,
everything under `src/content/blog/{fr,de,es}/` and both `.i18n-lock.json`
files are output. A pull request that hand-edits one is fixing the symptom: the
fix belongs in the English, in a rule in `scripts/lib/aiglot.mjs`, or in a
glossary.

**Mismatches should fail.** A translated file with no English source, a locale
key English does not have, a lock entry for a file that is not there: these are
test failures that name the file, not warnings.

**Comments explain why, not what.** The existing ones are long on purpose: they
record the reasoning and, where it matters, what went wrong before. A comment
restating the line below it is noise.

**No em dashes in the site's copy**: `src/i18n/strings/en.json` and the posts
under `src/content/blog/en/`. That copy is the source every translation
inherits from, in three languages at once, and an em dash is one of the
clearest tells that a sentence was written by a machine. Prose in comments,
documentation and pull requests is yours to punctuate.

## Changes that need a conversation first

- A new dependency. The whole point of the current list is how short it is.
- A change to a published URL shape. Somebody's links depend on it.
- A change to the lock file format, which would mark every translation on every
  fork as out of date and cost real money to clear.

## Reporting a bug

Include the commit, what you expected, what happened, and the smallest content
and config that reproduces it. For the translation scripts, the output of
`npm run i18n:status` is usually the whole story.

Anything with security implications goes to [SECURITY.md](./SECURITY.md)
instead of a public issue.
