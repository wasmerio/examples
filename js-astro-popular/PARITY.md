# PARITY.md: the Hugo ⇄ Astro contract

**Popular** ships in two implementations that must stay in sync:

- `hugo-theme-popular`: Hugo theme (canonical for shared assets)
- `astro-theme-popular`: Astro theme

This document is the contract. Any PR that changes one side must either port the
change to the other side, or open an issue labelled `parity` describing what's
pending. CI enforces the reminder (see `.github/workflows/parity-reminder.yml`).

---

## Tier 1: shared, byte-identical files (never fork these)

The design system and behaviour JS are framework-agnostic and must be **identical**
in both repos. The Hugo repo is the canonical source; copy Hugo → Astro.

| Hugo (canonical)                     | Astro                        |
|--------------------------------------|------------------------------|
| `assets/css/tokens/*.css`            | `src/styles/tokens/*.css`    |
| `assets/css/base.css`                | `src/styles/base.css`        |
| `assets/css/components.css`          | `src/styles/components.css`  |
| `assets/js/checklist.js`             | `public/scripts/checklist.js`|
| `assets/js/toc.js`                   | `public/scripts/toc.js`      |
| `assets/js/blog-filter.js`           | `public/scripts/blog-filter.js` |
| `assets/js/copy-code.js`             | `public/scripts/copy-code.js` |
| `assets/js/nav.js`                   | `public/scripts/nav.js`      |
| `scripts/sessionize-import.py`       | `scripts/sessionize-import.py` |
| `scripts/spreadsheet-import.py`      | `scripts/spreadsheet-import.py` |
| `scripts/sample-community.xlsx`      | `scripts/sample-community.xlsx` |
| `data/setup-questions.json`          | `src/data/setup-questions.json` |
| `scripts/setup.py`                   | `scripts/setup.py`           |
| `scripts/templates/`                 | `scripts/templates/`         |
| `scripts/tests/`                     | `scripts/tests/`             |
| `scripts/check-ics.py`               | `scripts/check-ics.py`       |
| `scripts/check-jsonld.py`            | `scripts/check-jsonld.py`    |
| `scripts/check-image-alt.py`         | `scripts/check-image-alt.py` |
| `CHANGELOG.md`                       | `CHANGELOG.md`               |
| `RELEASING.md`                       | `RELEASING.md`               |

Use `scripts/sync-shared.sh` to copy or verify (`--check` diffs and fails on drift).
Demo images are *not* in this tier: Astro's `public/images/` is an activation
copy of whichever demo is active, and per-demo imagery may drift.

**Shared invariants inside these files:**
- CSS class names (`g-*`) are the API. Renaming a class is a breaking change on BOTH sides.
- `checklist.js` localStorage key format: `popular-check:<id>`.
- JS hooks: `data-key` (checklist), `data-filterbar`/`data-filter`/`data-tags` (blog filter), `.g-doc-toc` (scroll-spy), `.g-nav__toggle`/`.g-navlinks` (nav).

## Tier 2: parallel implementations (port by hand)

Same behaviour, different language. When you change one, port the other.

| Feature            | Hugo                                   | Astro                                  |
|--------------------|----------------------------------------|----------------------------------------|
| Base shell         | `layouts/_default/baseof.html`         | `src/layouts/BaseLayout.astro`          |
| Brand token overrides | `partials/brand-vars.html`          | brand block in `BaseLayout.astro`       |
| Header / footer    | `partials/header.html`, `footer.html`  | `components/Header.astro`, `Footer.astro` |
| Notice banner      | `partials/notice.html`                 | `components/Notice.astro`               |
| Empty state (no upcoming events) | `partials/events-empty.html` | `components/EventsEmpty.astro`        |
| Calendar subscribe buttons | `partials/calendar-subscribe.html`     | `components/CalendarSubscribe.astro`    |
| Home               | `layouts/index.html`                   | `pages/index.astro`                     |
| Blog list / post   | `layouts/blog/*`                       | `pages/blog/*`                          |
| Events list / page | `layouts/events/*`                     | `pages/events/*`                        |
| Talk archive index | `layouts/talks/list.html`              | `pages/talks/[...page].astro`           |
| Organizers         | `layouts/organizers/list.html`         | `pages/organizers/[...page].astro`      |
| Docs (TOC)         | `layouts/docs/single.html`             | `pages/[slug].astro` (kind `doc`)       |
| Tag pages          | `layouts/_default/term.html`           | `pages/tags/[tag]/[...page].astro`      |
| List pagination    | `partials/pagination.html`             | `components/Pagination.astro`           |
| Cards / rows       | `partials/post-card.html`, `event-row.html`, `organizer-card.html` | `components/PostCard.astro`, `EventRow.astro`, `OrganizerCard.astro` |
| Callout            | `shortcodes/callout.html`              | `components/Callout.astro`              |
| Photo gallery      | `shortcodes/{gallery,photo}.html`      | `components/{Gallery,Photo}.astro`      |
| Pull-quote         | `shortcodes/pullquote.html`            | `components/Pullquote.astro`            |
| llms.txt           | `layouts/index.llms.txt` (`LLMS` output) | `pages/llms.txt.ts`                   |
| Author box / pages | `partials/author-box.html`, `author-line.html`, `layouts/authors/*` | `components/AuthorBox.astro`, `pages/authors/[slug].astro` |
| Speaker list / pages | `layouts/speakers/{list,single}.html` | `pages/speakers/{index,[slug]}.astro` (AuthorBox with `base`) |
| Venue list / pages | `layouts/venues/{list,single}.html`    | `pages/venues/{index,[slug]}.astro`     |
| Speaker invite card | `partials/speaker-invite.html`        | `components/SpeakerInvite.astro`        |
| Preview banner     | `partials/preview-bar.html`            | `components/PreviewBar.astro`           |
| Checklist          | `shortcodes/checklist.html`            | `components/Checklist.astro`            |
| Site configuration | `exampleSite/hugo.toml` `[params]`     | `src/config.ts`                         |

**Config invariant:** the `[params.brand]` keys in Hugo and the `BRAND` keys in
`src/config.ts` must stay identical (`primary`, `primaryHover`, `primaryActive`,
`link`, `linkHover`, `secondary`, `accent`, `accentHover`, `ink`, `surfaceWash`,
`surfaceWashSoft`, `surfaceInk`, `fontSans`, `fontDisplay`, `radiusCard`,
`containerMax`, plus the dark-palette keys `surfacePage`, `surfaceCard`,
`surfaceTertiary`, `textBody`, `textMuted`, `textOnBrand`, `borderSubtle`). `params.favicon` ⇄
`SITE.favicon`, falling back to the logo on both sides. `params.customCSS` ⇄
`SITE.customCSS` (extra stylesheet URLs, e.g. web fonts).

**Notice banner invariant:** `params.notice = { text, url? }` (Hugo) ⇄
`SITE.notice = { text, url? }` (Astro). `text` is inline-markdown rendered:
Hugo uses `.RenderString` (inline), Astro uses `src/lib/inline-md.ts`
(`inlineMarkdown`), which supports links, bold, emphasis, and inline code and
HTML-escapes the rest. Both are unset by default (no banner). The empty state
for zero upcoming events reads the same `params.community.chat = { url, label }`
⇄ `SITE.community.chat` as §4 and the `/events/calendar.ics` feed from §1.

**Community chat invariant:** `params.community.chat = { url, label }` (Hugo) ⇄
`SITE.community.chat` (Astro). When set, a "Join the chat" CTA appears in the
home hero and a link in the footer (plus the empty-state CTA above); `rel-href`
rules apply, external URLs get `rel="noopener" target="_blank"`. Unset by
default. The starter/exampleSite ship a `/start/` ("Start here") first-timer
page and a `/speak/` ("Speak with us") CFP page.

**Speaker invite invariant:** `params.speakers.invite = true` (Hugo) ⇄
`SITE.speakers.invite === true` (Astro) appends a "Your name here?" card
(strings `speakerInviteTitle`, `speakerInviteBody`) to the speakers list,
linking to `/speak/`. Off by default. The speakers and venues **list** pages
(`/speakers/`, `/venues/`) exist on both sides; on Astro they are static
`index.astro` routes whose section header text comes from `SECTIONS.speakers`
/ `SECTIONS.venues` (mirroring the Hugo sections' `_index.md`).

**Talk archive invariant:** event front matter gains optional `recording` /
`slides` (single-talk meetups) and a `talks[]` array (`title` required,
`speaker` / `recording` / `slides` optional); when `talks[]` is present it
wins and event-level `recording` / `slides` are ignored (not merged). The
event page renders a Talks section for `talks[]` or inline recording/slides
links for the simple case; event rows with any recording show a cue
(`hasRecording`). The `/talks/` index aggregates every talk newest-first,
filterable by the parent event's tags via the shared `blog-filter.js`
(`[data-filterbar]` + `[data-tags]`). It is opt-in: Hugo enables it by adding
`content/talks/_index.md`, Astro by `SITE.talks = true`. Strings
`watchRecording`, `viewSlides`, `hasRecording`, `talks`, `talksLead`.

**Gallery / pull-quote invariant:** the `gallery` + `photo` shortcodes (Hugo)
⇄ `Gallery` + `Photo` components (Astro) render a CSS-grid figure list with no
JS and no lightbox (each photo links to its full-size image). `alt` is
**required**: a missing `alt` fails the build (`errorf` / thrown error), which
keeps the image-alt CI green by construction. `pullquote` (Hugo) ⇄ `Pullquote`
(Astro) is a styled blockquote with an optional `cite`. A recap is a blog post
tagged `recap` that uses both; the KDrama demo carries the worked example.

**llms.txt invariant:** a plain-text summary at `/llms.txt` (Hugo
`layouts/index.llms.txt` via the theme's `LLMS` home output format ⇄ Astro
`pages/llms.txt.ts`), naming the next upcoming event (regenerated each build),
the chat URL if set, and links to Start here / About / events / the calendar
feed / the talks archive when those exist. Always generated on Astro; on Hugo
the site adds `LLMS` to its home `[outputs]` (the demos, exampleSite, and docs
site do).

**Pagination invariant:** list pages paginate with `/…/page/N/` URLs on both
sides (page 1 is the section root). Page size comes from Hugo's standard
`[pagination] pagerSize` ⇄ `PAGINATION.pageSize` in `config.ts`; the demo
sites set both to 3. Blog, tag, and organizer lists paginate their full set;
the events list paginates past events only (upcoming always shows in full).
Both event sections group rows under `.g-year` year headings.

**Setup wizard invariant:** one schema (`data/setup-questions.json` ⇄
`src/data/setup-questions.json`, Tier 1) feeds three surfaces. (1) `scripts/setup.py`
+ `scripts/templates/` + `scripts/tests/` are Tier 1 (byte-identical, synced).
(2) The **agent-interview protocol** (`AGENTS.md` "Setting up a new site for a
user") is Tier 2: same five steps in both repos, wording and paths per repo
(`hugo.toml` / build-and-serve ⇄ `src/config.ts` / `npm run build`). (3) The
**"Before you build" worksheet** (`site/layouts/shortcodes/setup-worksheet.html`,
rendered on `/docs/before-you-build/`) is a Hugo-docs-only surface: the canonical
docs site has no Astro twin, so it has no parity counterpart. It renders the
schema via `hugo.Data` (not the deprecated `site.Data`) as a persistent
checklist. Discipline rule shared by all three: **if something is not a schema
question, it belongs in the handbook, not on any of these surfaces**, so adding
a question to the schema updates the wizard, the worksheet, and the interview
with no template edit.

**What the wizard writes** (`build_outputs()` returns `{relpath: content}`, the
integration seam for any front end, CLI or web):

| File | Hugo | Astro |
|---|---|---|
| Theme config | `hugo.toml` | `src/config.ts` |
| Framework config | (same file: `baseURL`) | `astro.config.mjs` (`site` + `base`) |
| Code of Conduct seed | `content/code-of-conduct.md` | `src/content/pages/code-of-conduct.mdx` |
| Deploy workflow | `.github/workflows/deploy.yml` | `.github/workflows/deploy.yml` |
| Audit trail | `DECISIONS.md` | `DECISIONS.md` |
| Answer record | `.popular-setup.json` | `.popular-setup.json` |

Two asymmetries are deliberate. Hugo carries origin and subpath in one
`baseURL`; Astro needs them split, so `split_site_base()` derives
`site` + `base` from the same single `base_url` answer rather than asking twice
(PARITY: one schema question, two framework spellings). And the workflows differ
by build command only: both are parameterless, because everything that varies
lives in the config the wizard already wrote. The workflow is skipped when the
site already has a `.github/workflows/` directory, so it never fights an
existing deployment.

The starter scaffold a generator copies from is `exampleSite/` (Hugo) and
`demos/starter/` (Astro), per Tier 3½ below. `scripts/starter-content.py`
copies it without overwriting anything that already exists.

**Astro ships two shapes, and the wizard writes either** (PACKAGING.md). The
answers, the schema and the content model are identical; only the layout differs:

| | template model (`--astro-model template`) | package model (`--astro-model package`) |
|---|---|---|
| Theme config | `src/config.ts` | `popular.config.ts` |
| Framework config | `astro.config.mjs` importing `./popular-markdown.mjs` | `astro.config.mjs` with `integrations: [mdx(), popular()]` |
| Theme code | vendored: the adopter copied this repo | `astro-theme-popular` in `package.json`, pinned to the current release |
| Content model | `src/content.config.ts` from the repo | `export { collections } from 'astro-theme-popular/schemas'` |
| Starter MDX imports | `../../components/Callout.astro` | `astro-theme-popular/components/Callout.astro`, rewritten on copy |

The last row is the one that bites: a consumer has no `src/components/`, so
copying starter MDX verbatim fails its first build. `starter-content.py`
rewrites those specifiers in package mode, which is why content copying belongs
to the theme rather than to whoever is generating the site.

## Tier 2¾: UI strings (i18n)

Every user-facing string in templates comes from a named key, never hardcoded.
The key set must stay identical on both sides:

| Hugo | Astro |
|---|---|
| `i18n/en.toml` (`{{ i18n "key" }}`) | `STRINGS` in `config.ts` (`STRINGS.key`) |

Rules:

- Adding a template string means adding the same key to BOTH files, with the
  same English value.
- Dates go through the site locale: Hugo `time.Format` (localizes via the
  site's `languageCode`), Astro `toLocaleDateString(SITE.locale, ...)`.
- Shared JS must stay language-free: any text it renders is read from
  `data-*` attributes on `<body>` (`data-copy-label`, `data-checklist-done`),
  emitted by `baseof.html` / `BaseLayout.astro`, with English fallbacks.
- Keys used by only one side are allowed but must exist in both files and be
  commented (currently: `eyebrowTag`, `taggedCount`, Astro tag pages).

## Tier 3: content model (schema contract)

Front-matter fields must accept the same names on both sides
(Hugo: TOML front matter; Astro: YAML + zod schema in `src/content.config.ts`):

- **blog**: `title, date, author, authors[], guestAuthors[{name,title,photo,bio,website,social[]}], description, image, tags[], speaker{name,title,photo,bio}`
- **authors**: `title, role, photo, bio, website, social[{label,icon,url}]`
- **events**: `title, date (event start; upcoming/past pivot), description, image, tags[], time, venue, venueWanted, planning (event state badges, below), address, venueRef (venues slug; wins over flat venue fields), checkin, venueNotes (overrides the venue page's notes), speaker (one-liner fallback), speakers[] (speaker slugs), rsvp, meetupUrl (metadata only; not rendered), recording, slides, talks[{title, speaker, recording, slides}] (§3; talks[] wins over event-level recording/slides)`
- **speakers**: `title, role, photo, bio, website, social[{label,icon,url}]` (same shape as authors)
- **venues**: `title, address, photo, notes (arrival notes, inherited by events), accessibility, website`
- **organizers**: `title, weight, role, photo, description, social[{label,icon,url}]`
- **docs / pages**: `title, eyebrow, lead`

Adding a field = update Hugo templates + Astro schema & components + this doc.

---

## Tier 3½: demo sets

Both repos ship the same four fictional demos: three communities (Rocky Cove
Aquarium Club / Lucky Town Foodie Club / KDrama Fan Club) and one personal
site (Truly Madly Riley: a superfan's site with the blog as a news feed,
events as an influencer's appearances, and no organizers). Demo *content and
config values* must stay equivalent across repos: Hugo `demos/*` ⇄ Astro
`demos/*` (slugs `aquarium`, `foodie`, `kdrama`, `superfan`; Hugo dirs use
full names, so `demos/truly-madly-riley` ⇄ `demos/superfan`). The demo
switcher bar is `params.demoBar` (Hugo) ⇄ `DEMO_BAR` in `popular.config.ts`
(Astro) with identical slugs/labels/icons.

The two sides hold a demo differently, which is a shape difference and not a
content one. A Hugo demo is a Hugo site (`demos/<name>/hugo.toml` + `content/`
+ `static/`). Since packaging phase 3 an Astro demo is an npm workspace that
*consumes* the package: `demos/<slug>/popular.config.ts` + `src/content/` +
`public/images/`, with its own `package.json` and `astro.config.mjs`. Its MDX
therefore imports theme components by package specifier
(`astro-theme-popular/components/Callout.astro`) where Hugo uses a shortcode.
Content, config values and imagery still have to match.

The neutral "Your Community" starter ships on both sides: Hugo
`exampleSite/` ⇄ Astro `demos/starter/` (a workspace consumer like the others;
the Astro repo's `src/` keeps a template-model copy until the cutover). The starter never sets the demo bar. It *is* the root of
the Astro repo's deployed demo tree, and therefore the URL submitted to the
Astro theme catalogue, but it reaches that state through
`demos/starter/astro.deploy.config.mjs`, which adds one notice linking to the
gallery. That override deliberately lives outside `popular.config.ts`, because
that file is what `create-popular-site` templates from: a real community's site
must never carry a link to this project's demos. CI asserts both.

## Release checklist

1. `scripts/sync-shared.sh --check` passes.
2. Tier-2 changes ported (or a `parity` issue exists).
3. Both example sites build: `hugo server` / `npm run build`.
4. Bump versions together; note cross-repo changes in both changelogs.

## Venue access fields (Tier 2)

Venue front matter `wheelchair` (bool), `transit`, `parking`, `access` render
a "Getting there & access" section (omitted when empty) and put a wheelchair
badge + access link on referencing event pages. Astro schema in
`content.config.ts`; spreadsheet importer has matching columns (Tier 1).
`access` renders as markdown on Hugo, plain text on Astro.

## Event state badges (Tier 2)

An event row carries exactly one state badge (Hugo `partials/event-row.html`,
Astro `EventRow.astro`), decided in this order:

| Condition | Badge | i18n key | Tone |
|---|---|---|---|
| `cancelled = true` | Cancelled | `eventCancelled` | danger, soft |
| `planning = true` | Planning | `eventPlanning` | default, soft |
| `venueWanted = true`, or no `venue` and no resolvable `venueRef` | Venue wanted | `venueWanted` | warning, soft |
| otherwise | Confirmed | `confirmed` | success, soft |

`planning` beats the venue-wanted badge because it is set deliberately while
that one is also inferred from a missing venue. It additionally suppresses the
RSVP button in all three places one is rendered (event row, event page, home
page "Next meetup"), so `rsvp` can be filled in early and stays hidden until
the flag comes off. The event page repeats Cancelled and Planning next to the
`<h1>`. Presentation only: it changes no JSON-LD and no `.ics` output, since
schema.org has no equivalent status.

## iCalendar feed (Tier 2)

`/events/calendar.ics` (Hugo `events/list.calendar.ics` + a `Calendar` output
format; Astro `events/calendar.ics.ts`). Upcoming events plus the last 90
days, CRLF, 75-octet folded, escaped; UID = permalink; DTSTART reuses the
`time` parse (`parse-time.html` / `parseEventTime`) so it agrees with the
Event JSON-LD; `cancelled` -> `STATUS:CANCELLED`. `scripts/check-ics.py`
validates built feeds. Hugo folds rune-based (octet-exact for ASCII); Astro
folds byte-exact. Hugo requires the section opt-in; Astro emits it always.

The feed carries `REFRESH-INTERVAL`/`X-PUBLISHED-TTL` (PT12H) subscription
hints. The events list and the empty state render the subscribe buttons
(`partials/calendar-subscribe.html` / `components/CalendarSubscribe.astro`):
a `webcal://` link (absolute feed URL with the scheme swapped), a Google
Calendar `render?cid=` deep link, and the plain `.ics` download as the
"add calendar from URL" fallback. Strings `subscribeCalendar`,
`subscribeGoogle`, `downloadCalendar`.

## Event JSON-LD (schema.org/Event)

Event pages emit `schema.org/Event` JSON-LD (Hugo `partials/jsonld-event.html`,
Astro `src/lib/eventld.ts`), keys sorted so the two are byte-identical. Only
resolvable keys are emitted (no empty strings/arrays/null).

**The `time` → `startDate` contract** (both implementations and
`scripts/tests/test_event_time.py` must agree):

| `time` value | startDate suffix |
|---|---|
| `6:00 PM` | `T18:00` |
| `18:30` | `T18:30` |
| `12:00 AM` | `T00:00` |
| `12:00 PM` | `T12:00` |
| `6:00 PM · doors 5:30` | `T18:00` |
| `doors at 5:30` | date-only |
| *(absent)* | date-only |
| `25:00` / `9:99` (out of range) | date-only |

Only a leading `HH:MM[am|pm]` token is parsed; put the true start time first.
The date part is the `date` field's calendar day, so write `date` as a plain
date (no time/offset) and the clock time in `time`. Fields: `cancelled`
(EventCancelled + visible danger badge, i18n `eventCancelled`), `online`
(OnlineEventAttendanceMode + VirtualLocation), `price`/`currency`/`cost`
(paid-event offers). `scripts/check-jsonld.py` validates every built block.

## Component overrides (Astro package only)

The Astro package lets adopters override theme components via
`popular({ overrides: { Header: './...' } })`, resolved through
`popular:component/<Name>` virtual imports. Overridable: Header, Footer, Hero,
EventRow, PostCard, OrganizerCard, AuthorBox, PageHero. The Hugo equivalent is
Hugo's native template lookup (drop a matching file in your site's `layouts/`)
plus the `head-extra.html` hook; no config needed.

## FAQ block (Tier 2)

`{{< faq >}}`/`{{< question >}}` (Hugo shortcodes) ⇄ `<FAQ>`/`<FAQItem>`
(Astro components). Native `<details>`, zero JS, answers in the DOM. Both emit
FAQPage JSON-LD (gated on `seo.faqJsonLd`, default true), byte-identical.
Divergence: Hugo auto-collects Q&A via nested-shortcode scratch; Astro parses
its own rendered slot (`Astro.slots.render`). No FAQ rich results expected.

## Core Web Vitals (Tier 2)

Markdown and card/list images carry `loading="lazy" decoding="async"` (Hugo
render hook + card partials; Astro components + a dependency-free rehype
plugin). The home hero and event lead image stay eager (above the fold).
A `preconnect` to cdnjs is emitted only when `fontAwesome` is explicitly set to
the old cdnjs URL, which is no longer the default.

## Icons: self-hosted Font Awesome (Tier 1)

Font Awesome Free 7.3.1 ships in the theme, not from a CDN:
`static/fontawesome/` (Hugo) ⇄ `public/fontawesome/` (Astro), plus
`package/fontawesome/` for the npm distribution. Keep the three copies at the
same version; they are the same files.

`params.fontAwesome` (Hugo) ⇄ `SITE.fontAwesome` (Astro) is **optional**, and
unset means "use the theme's own copy". Set it to a URL to use a CDN instead.
The local default is base-aware through `rel-href.html` ⇄ `withBase()`, so a
subpath install resolves; an external value passes through untouched.

The two Astro models differ here by necessity, and it is the one divergence
`package-smoke.yml` excludes from the drift guard: the template model links
`/fontawesome/css/all.min.css` from `public/`, while a package consumer has no
such directory, so `package/src/layouts/BaseLayout.astro` imports the
stylesheet and lets Vite emit the woff2 files as build assets. A package
consumer therefore gets **no** `<link>` unless it opts into a CDN.

Nothing the setup wizard writes pins a version: `config.ts.tmpl` deliberately
omits the key so generated sites inherit whichever copy the theme ships.

## Web fonts: self-hosted Inter and Quantico (Tier 1)

Same reasoning as the icons above, one tier further in: `fonts.css` is itself a
Tier-1 byte-identical file, so the two repos cannot each point at their own
copy. They point at the same **relative** path, and each repo puts the woff2
files where that path lands:

| Hugo                              | Astro                                            |
|-----------------------------------|--------------------------------------------------|
| `static/fonts/*.woff2`            | `src/styles/fonts/*.woff2` + `package/src/styles/fonts/*.woff2` |
| published at `/fonts/`            | emitted by Vite into `_astro/`, hashed           |
| resolved from `/css/popular.css`  | resolved from the bundled stylesheet             |

`url('../fonts/…')` works in both because it resolves against the stylesheet
rather than the host root: Hugo concatenates `fonts.css` into `/css/popular.css`
(one level down, so `../fonts/` is `/fonts/`), and Vite resolves the same string
against `src/styles/tokens/fonts.css` at build time and rewrites it. This is
what makes a subpath install work with no `rel-href.html` ⇄ `withBase()` on
either side. **Never rewrite these as `/fonts/…`**: `image-alt.yml` and
`package-smoke.yml`'s `--base /sub` build both catch it, but the failure looks
like missing glyphs rather than a broken link.

Unlike the icons, the Astro copies are **not** a divergence: `src/styles/` and
`package/src/styles/` are compared recursively by the drift guard, so the fonts
directory must be identical in both. `sync-shared.sh` does not carry them (its
pair is `assets/css/tokens` ⇄ `src/styles/tokens`, and the fonts sit beside it,
not inside), so refresh all three homes by hand when upgrading.

Every face carries a `unicode-range`, so shipping all seven Inter subsets costs
repo size and no bandwidth. See `static/fonts/README.md` for what is vendored,
the licence position, and how to refetch.

## Organization & BlogPosting JSON-LD (Tier 2)

Home pages emit `schema.org/Organization` (Hugo `jsonld-org.html`, Astro
`buildOrgLd`), with `sameAs` = the social config's URLs verbatim (so the RSS
URL differs by framework by design). Blog singles emit `BlogPosting` (Hugo
`jsonld-blogpost.html`, Astro `buildBlogPostingLd`): authors resolve through
the renameable authors section, falling back to the Organization; dates are
RFC3339 without milliseconds. Both use the shared key-sorted `jsonld()`.

## SEO: robots, sitemap, meta (Tier 2)

Both emit `robots.txt` advertising the sitemap (Hugo `enableRobotsTXT` +
`layouts/robots.txt`; Astro `robots.txt.ts` endpoint + `@astrojs/sitemap`),
plus `og:locale`, `og:image:alt` (from optional `imageAlt`), and a
`noindex,follow` on taxonomy pages when `seo.noindexTaxonomies` is set.
Sitemap URLs are absolute and subpath-safe. Astro-only dependency:
`@astrojs/sitemap` (config-only, no client JS).

## Subpath deployments: base-aware URLs (Tier 2)

A site can be served from a path rather than a domain root (`user.github.io/repo/`,
the default free host). Both implementations must emit every internal URL with
that prefix; neither framework does it for hand-written paths.

| Concern | Hugo | Astro |
|---|---|---|
| Configure it | `baseURL = "https://x.dev/repo/"` | `base: '/repo'` in `astro.config.mjs` (adopters of the npm package set it in their own config) |
| Relative URL helper | `partials/rel-href.html` (hrefs), `partials/rel-src.html` (images and assets) | `withBase()` in `lib/url.ts` |
| Absolute URL helper | `partials/abs-url.html` | `absoluteUrl()` in `lib/url.ts` |
| Markdown bodies | `_markup/render-link.html`, `_markup/render-image.html` (and `render-heading.html`, `render-table.html` for the anchors and table wrapper below) | hast/rehype hook registered by the integration (package) or `astro.config.mjs` (template copy) |

Rules that keep the two in step:

- **Every URL a template writes by hand goes through a helper.** That includes
  paths built from content ids (`/events/{id}/`), adopter-authored config values
  (nav, CTAs, socials, footer links) and content front matter (`image`, `photo`,
  `logo`, `rsvp`, `website`). The helpers pass external URLs, `mailto:`, `tel:`
  and `#fragment` through untouched, so applying one is never wrong.
- **Both leading-slash and bare paths must work.** The content model is shared,
  so `/images/x.png` (Astro's convention) and `images/x.png` (Hugo's) appear in
  the same front-matter field. Hugo's `relURL`/`absURL` drop the subpath on the
  first spelling, which is the trap `rel-src.html`/`abs-url.html` exist to close.
- **Absolute URLs are origin + base + path.** Canonical, `og:image`, JSON-LD,
  `llms.txt`, the iCalendar feed, RSS and the robots `Sitemap:` line all include
  the subpath. In Astro, `Astro.site` is the bare origin and does not; only
  `Astro.url.pathname` already carries the base.
- **CI runs a subpath build in both repos** and fails on any `href`/`src` left at
  the server root (Hugo: `image-alt.yml`; Astro: `package-smoke.yml` builds
  `smoke/astro.base.config.mjs`). The check deliberately does not exempt
  `href="/"`: the header brand link is exactly that.

## Heading anchors (Tier 2)

Every markdown h2-h6 ends in `<a class="g-anchor" href="#<id>" aria-hidden="true"
tabindex="-1"></a>`, styled in `base.css` (Tier 1) to show a `#` on hover. The
anchor is empty and the glyph is CSS generated content, so `.Summary`, feeds and
plain-text excerpts of a body never pick up a stray `#`. Hugo:
`layouts/_default/_markup/render-heading.html`, which keeps Goldmark's `.Anchor`.
Astro: the markdown hook (`popular-markdown.mjs` ⇄ `package/index.mjs`). Astro
assigns heading ids *after* user plugins, so the hook slugs the heading itself
with `github-slugger` (the library Astro uses) and sets the id; Astro keeps an
id that is already present and reports it in `headings`, which is what keeps
the docs sidebar pointing at the same fragments. The anchor is deliberately
hidden from assistive tech and the tab order: a labelled link inside a heading
becomes part of the heading's accessible name, and the docs sidebar already
exposes the same fragments as real links. h1 gets no anchor on either side.

## Markdown tables (Tier 2)

Every markdown table is wrapped in `<div class="g-table-scroll">`, styled in
`base.css` (Tier 1, with the `.g-prose table` rules) to scroll sideways when the
table is wider than its column, so the table itself keeps its semantics
(`display: block` on a `<table>` drops them for screen readers). Hugo:
`layouts/_default/_markup/render-table.html`, Goldmark's default markup inside
the wrapper. Astro: the markdown hook (`popular-markdown.mjs` ⇄
`package/index.mjs`), in both its Sätteri and its rehype shape. Column
alignment written in markdown (`:---:`) reaches the HTML as an inline style
from Goldmark and Sätteri, and as an `align` attribute from the unified/rehype
pipeline; `base.css` honours both over its start default. The handbook's
"Meeting cadence & format" section carries a table in the starter and in the
three community demos (the personal-site demo has no handbook), so each of
those palettes renders one.

## Preview banner (Tier 2)

A generator that renders a site it does not own (the web wizard's throwaway
preview, shown in an iframe) sets `params.previewMode` (Hugo) ⇄ `SITE.previewMode`
(Astro), and gets a fixed banner saying the page is a preview. Both accept `true`
or a table/object with an optional `note`, and both read their text from the
shared string keys `previewLabel` and `previewBanner`.

Three properties are the point, and a change that breaks one breaks the feature:

- **It cannot ship by accident.** Nothing the setup wizard writes into an
  adopter's config sets the param, so a real site has no way to show it. CI in
  both repos builds with the flag and without, and fails if the banner appears in
  a build that did not ask for it.
- **It is informational only.** A preview is served with `sandbox="allow-scripts"`
  and no `allow-same-origin`, so a control inside the iframe cannot drive the page
  around it. Actions belong in the surrounding chrome. Do not add links or buttons.
- **It reserves footer space** with the same `.g-footer__bottom { padding-bottom:
  72px }` the demo bar uses, so it never covers the credit line.

Unlike the demo bar it renders in dev too (`hugo server`, `astro dev`): someone
running a preview config locally is previewing as well.

**Switching it on without touching the config.** A generator often owns the
build but not the config it builds, so both sides take the flag from the
environment: `HUGO_PARAMS_PREVIEWMODE_NOTE` (Hugo reads params from the
environment natively) ⇄ `POPULAR_PREVIEW_NOTE` (Astro's config is TypeScript, so
`PreviewBar.astro` reads the variable itself). Setting either one both enables
the banner and supplies its note. Neither is set in any build a normal site
runs, so the "cannot ship by accident" property is unchanged.

**Why the two variable names differ, and why they cannot be unified.** Only one
of them is a name this theme chose. Hugo maps any `HUGO_PARAMS_<KEY>` onto
`params.<key>` itself, so the theme named the param and Hugo dictated the
variable. Astro has no such mechanism (its config is TypeScript evaluated at
build time), so `PreviewBar.astro` reads a variable explicitly, and a theme
picking its own name should namespace it: `ASTRO_…` would imply framework
support that does not exist.

The reverse symmetry is impossible rather than merely unidiomatic. Hugo's
`security.funcs.getenv` allowlist defaults to `["^HUGO_", "^CI$"]`, so a
template cannot read `POPULAR_PREVIEW_NOTE` at all unless every adopter loosens
their site's security configuration, which a theme has no business requiring.
If you find yourself renaming one to match the other, this is why not.

## Computed stat values

Home-page stat `value`s: `@pastEventCount` and `@count:<section>[:rounded]`
resolve to live counts. Hugo: `partials/stat-value.html`. Astro: `formatStat`
in `src/lib/stats.ts`. Drafts are excluded, matching Hugo's RegularPages.

## Organizer profile pages

Organizer entries render a profile page (bio card + page body), linked from
their card, mirroring speakers. Hugo: `organizers/single.html`. Astro:
`organizers/[slug].astro` (injected under the `organizers` opt-out key in the
package). Eyebrow string `eyebrowOrganizer`. AuthorBox/author-box render the
organizer's `description` as the bio.

## Nested-page back link

A page nested in a section renders a back link to its parent, labeled by the
parent's `shortTitle` (optional front-matter) or title. Hugo derives the
parent via `.Parent`; Astro derives it from a slashed page id and serves
pages through `[...slug]`. `shortTitle` is in the pages schema
(`content.config.ts`) on the Astro side.

## Renameable sections

`[params.sections]` (Hugo) ⇄ `SECTIONS_MAP` (Astro) rename the sections the
theme reads: `authors` (post-author byline resolution and link base) and
`team` (homepage team grid and button). Defaults `authors` / `organizers`.
On Astro the value names a collection that must exist in `content.config.ts`.

## Blog post ordering (the post-navigation contract)

Older/newer navigation on blog singles orders posts by **date descending,
then title ascending, then slug/path ascending**; "next" is the newer post.
Hugo gets this from `.NextInSection` (its native section order); Astro sorts
explicitly with the same keys. Setting `weight` on a blog post is
unsupported: it would reorder Hugo but not Astro.

## Allowed asymmetries (by design)

- `head-extra.html` hook is Hugo-only: Hugo sites override a partial, Astro
  sites vendor the repo and edit `BaseLayout.astro` directly.
- `SITE.rssTitle` is Astro-only: Hugo's feed link title comes from the RSS
  output format and site title.
