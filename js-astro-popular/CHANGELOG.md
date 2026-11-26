# Changelog

One theme, two implementations: versions are tagged in lockstep in
[hugo-theme-popular](https://github.com/Mariatta/hugo-theme-popular) and
[astro-theme-popular](https://github.com/Mariatta/astro-theme-popular), and this
file ships identically in both (PARITY.md Tier 1). Format follows
[Keep a Changelog](https://keepachangelog.com/); versions follow
[semver](https://semver.org/). During 0.x, minor versions may contain breaking
changes; they will be called out here.

To hear about new releases: watch either repo on GitHub (Watch → Custom →
Releases) or subscribe to the releases feed
(`https://github.com/Mariatta/hugo-theme-popular/releases.atom`).

## [0.14.3] - 2026-11-10

### Fixed

- **No stray comma in the home page title.** The home page `<title>` is the
  site title and the tagline joined by a comma, and the comma was written even
  when the title was empty, so a site with only a tagline showed `, Tagline`
  in the browser tab. The Astro twin also wrote `Title, undefined` when the
  tagline was unset. The title now joins only the parts that are set, and
  inner pages no longer end in ` · ` when the site title is empty. In Hugo,
  `title` belongs at the top level of `hugo.toml`, not under `[params]`; the
  build now warns when it is empty, and the configuration docs show it in the
  example. Reported by Viorel Alexandrescu for kobudei.org
  ([hugo-theme-popular#88](https://github.com/Mariatta/hugo-theme-popular/issues/88)).
- **No empty Open Graph site name.** A site with no title wrote
  `og:site_name` with empty content, and the home page `og:title` was empty
  too, so a link preview showed no name at all. `og:site_name` is now left out
  when the title is empty, and the home `og:title` falls back to the tagline,
  the same way the home page `<title>` does. Setting `title` is still the fix.
  Found while fixing
  [hugo-theme-popular#88](https://github.com/Mariatta/hugo-theme-popular/issues/88).

## [0.14.2] - 2026-11-05

### Fixed

- **Markdown tables are styled.** A pipe table in any markdown body (a page,
  a docs page, a post, an event description) rendered with browser defaults:
  no borders and no padding, so cells holding several sentences ran into each
  other. Every cell now has a thin border and the header row a wash, and the
  theme wraps each table in a `g-table-scroll` div that scrolls sideways when
  the table is wider than the screen, so a wide table no longer stretches a
  phone page. The wrapper comes from the theme, not from your content: Hugo's
  `render-table` hook and Astro's markdown hook add it. The meeting-formats
  section of the handbook is now a table in the starter and in the three
  community demos, so each of those palettes renders one.
  Reported by the PyCon Maintainer Summit, whose terms of service page carries
  an override until it picks up this release.

## [0.14.1] - 2026-11-04

### Fixed

- **iCalendar feed: the calendar name and product id are now escaped.** Both
  `PRODID` and `X-WR-CALNAME` are built from the site title, and neither
  template ran it through the escape helper, so a title such as
  "PyLadies Vancouver, BC" shipped a bare comma in a TEXT value (RFC 5545
  section 3.3.11). `scripts/check-ics.py` now checks those two properties as
  well. It is also registered in `scripts/sync-shared.sh`, together with
  `check-jsonld.py` and `check-image-alt.py`, so the shared CI checkers can
  no longer drift between the two repos unnoticed.

## [0.14.0] - 2026-11-04

### Added

- **Section permalinks.** Every `##`-`######` heading in a markdown body (docs
  pages, blog posts, event descriptions, any page) ends in a `#` anchor that
  appears on hover and links to that section, so a reader can copy a URL to
  "Submitting a proposal" instead of to the whole page. Headings already had
  ids; what was missing was a visible way to grab them. Fragment targets on
  every prose heading now stop clear of the sticky header (previously only
  docs pages did). New class `g-anchor`. Hugo: a `render-heading` hook; Astro:
  the theme's markdown hook, which slugs with the same `github-slugger` Astro
  uses so the docs sidebar keeps matching.

### Fixed

- **Astro: iCalendar feed now escapes semicolons.** `icsEscape` in
  `src/lib/ical.ts` used the string literal `'\;'`, which JavaScript reads as a
  plain `;`, so semicolons in an event title, venue or description reached the
  `.ics` output unescaped (RFC 5545 section 3.3.11 requires `\;`). Backslashes,
  commas and newlines were already escaped correctly. Found while porting the
  builder for the PyCon US Maintainer Summit site
  (pycon-maintainer-summit.github.io#36).
- **`scripts/check-ics.py` now checks text escaping.** Its docstring claimed
  it validated escaping, but it only checked line endings, folding, required
  properties and UIDs, which is how an unescaped semicolon in the Astro feed
  reached a release. It now reads `SUMMARY`, `LOCATION` and `DESCRIPTION`
  after unfolding and fails on a bare `;` or `,` or a stray backslash
  (RFC 5545 section 3.3.11). Covered by `scripts/tests/test_check_ics.py`.

## [0.13.0] - 2026-10-05

### Changed

- **"Subscribe to calendar" now actually subscribes.** The events list and the
  no-upcoming-events empty state replace the single feed link (which every
  browser treated as a one-time .ics download: a snapshot that never updates)
  with three options: a `webcal://` link that opens Apple Calendar, Outlook or
  Thunderbird already subscribed to the live feed, an "Add to Google Calendar"
  deep link (Google registers no webcal handler on the web or Android), and
  the plain `.ics` download kept as the universal "add calendar from URL"
  fallback. The feed itself gains `REFRESH-INTERVAL`/`X-PUBLISHED-TTL` (12
  hour) hints for clients that honor them; Google refreshes subscribed feeds
  on its own schedule, typically within a day. New UI strings
  `subscribeGoogle`, `downloadCalendar`.

## [0.12.0] - 2026-09-04

### Added

- **`planning = true` on an event**, for one that is on the calendar but not
  settled yet. It shows a neutral "Planning" badge where the row would
  otherwise claim "Confirmed", and hides the RSVP button on the event row, the
  event page, and the home page's "Next meetup", so `rsvp` can be filled in
  ahead of time and appears the moment the flag comes off. It outranks the
  "Venue wanted" badge, which is inferred from a missing venue rather than
  declared, and is presentation only: schema.org has no status for an event
  still being planned, so the JSON-LD and the `.ics` feed are untouched.

## [0.11.0] - 2026-08-16

### Added

- **Every page says which generator built it**, via `<meta name="generator">`
  (`hugo.Generator` on Hugo, `Astro.generator` on Astro). Astro does not inject
  this itself, and it is what the Astro theme catalogue's reviewers look for
  when verifying that a demo really is an Astro site.
- **`[module.hugoVersion]` in the Hugo theme's `hugo.toml`,** declaring the
  0.146.0 floor where themes.gohugo.io's build actually reads it. `theme.toml`'s
  `min_version` is the older field, from the retired `hugoThemes` repo; both are
  kept in step. A site built with an older Hugo now says so, rather than the
  floor being a claim nothing checked.
- **`npm create popular-site@latest`**, a scaffolder for Astro sites (packaging
  phase 3). It writes a small project that *depends on* the theme rather than
  containing a copy of it, so the site updates with `npm update` instead of by
  diffing tags and re-copying files. Pick the neutral starter or any of the
  four demos as a fuller example to edit down.
  - The templates are collected from `demos/*` at pack time, so the demos stay
    the single source of truth and there is no committed copy to drift. The
    demo switcher bar is stripped on the way, and CI fails if it ever reaches
    a scaffolded site.
  - A project-page URL like `https://you.github.io/my-community/` is split into
    Astro's `site` and `base` for you, the same split `scripts/setup.py` does.
  - Releases now publish two npm packages: `astro-theme-popular` and
    `create-popular-site`, versioned in lockstep so a scaffolded site always pins
    the theme release that shipped with it.

### Changed

- **A Popular deployment now loads nothing from a third party at all.** The
  superfan demo was the last exception: it pulled Cinzel from Google Fonts
  through `customCSS` for its display face. It uses the bundled Quantico like
  the other demos now, so no page of the theme, its demos or its docs sends a
  visitor's IP anywhere. `customCSS` itself is unchanged and still takes any
  stylesheet URL you want, including a CDN.
- **`npm create popular-site@latest` renders the same project templates the
  setup wizard does** (`scripts/templates/`), instead of carrying its own copies
  of `astro.config.mjs`, `package.json` and `content.config.ts`. Two generators
  writing the same file two ways is how they drift, and one had already started:
  the wizard's template still defaulted to an older theme version.
- **The release smoke-tests what it published**: after both packages reach the
  registry it scaffolds a site from them and builds it. The scaffolder's own CI
  installs the theme from the checkout, which is right for a pull request but
  cannot catch a mismatch between two published versions. That gap is exactly
  what broke `create-popular-site@0.10.0`, whose templates needed a newer theme
  than it pinned; it is deprecated.
- **The Astro README and the quick start lead with the scaffolder.** The README
  still described `npm run demo:aquarium` as switching the active demo set into
  `src/`, which stopped being true when the demos became workspaces, and the
  quick start still told Astro users to use the repo as a template.
- **The Astro demo deployment serves the neutral starter at its root**, with the
  four flavored demos still at their subpaths and the gallery landing page moved
  to `/demos/`. The root used to be the gallery, a hand-written HTML page that is
  not an Astro build at all, so the URL people are given demonstrated nothing and
  could not be verified as an Astro site. It is now exactly what
  `npm create popular-site@latest` writes.
  - The gallery gets its icons and fonts from the deployment instead of cdnjs and
    Google Fonts, so the landing page stops being the one page that loads a third
    party.


- **Astro: the demos are now real consumers of the npm package** (packaging
  phase 3). The repo is an npm workspace, and each of the five demos is a
  project with its own `package.json`, `astro.config.mjs`, `popular.config.ts`,
  `src/content/` and `public/images/`, installing the theme the way an adopter
  does. `scripts/use-demo.mjs` and the copy-a-demo-into-`src/` step are gone;
  `npm run dev --workspace demos/aquarium` replaces activation.
  - **The demo deployment and the image-alt job became integration tests.**
    Both now build five real consumers against the packaged theme instead of
    one copied-together site, so a package regression fails CI rather than
    surfacing after publish.
  - Nothing changes for anyone using the theme. The template model (`src/`)
    keeps working until the cutover, and the Hugo side is untouched.
- **Web fonts are served by the site itself,** not fetched from
  `fonts.googleapis.com`. Inter and Quantico now ship in the theme
  (`static/fonts/` ⇄ `src/styles/fonts/`), 716KB of woff2 under their SIL Open
  Font Licences. Nothing about the rendering changes: the vendored files are
  exactly the subsets and weight ranges Google was serving.
  - **This removes a GDPR exposure.** Embedding Google Fonts sends every
    visitor's IP address to Google, which a German court held to violate the
    GDPR (LG München I, 3 O 17493/20). A community site should not have to
    think about that.
  - It is also faster, not slower. The partitioned browser cache has meant no
    cross-site reuse since 2020, and the old `@import` added a DNS lookup, a
    TLS handshake and a round trip before any font could start downloading.
  - Every face keeps its `unicode-range`, so all seven Inter subsets ship but a
    latin-only page still downloads about 150KB of them. Greek, Cyrillic and
    Vietnamese sites now render in Inter instead of falling back.
  - Sites that prefer a CDN, or a different family entirely, override
    `fonts.css` the same way as before.
- **Font Awesome is served by the site itself,** not fetched from cdnjs. A
  Popular site now renders its icons offline, keeps working when a CDN has an
  outage or changes a URL, and no longer hands every visitor's IP address to a
  third party the community never chose. Font Awesome Free **7.3.1** ships in
  the theme (`static/fontawesome/` ⇄ `public/fontawesome/`), about 364KB of
  woff2 and one stylesheet, under its own `LICENSE.txt`.
  - `params.fontAwesome` / `SITE.fontAwesome` is now **optional**: leave it
    unset for the bundled copy, or set it to a URL to use a CDN as before.
    Existing sites that set it keep working unchanged.
  - The version moves from 6.5.2 to 7.3.1. Every icon the theme and its demos
    use exists in 7.3.1 in the same style, but an adopter naming an icon that
    7.x removed would see a blank square, so check any icon you named yourself.
  - Sites generated by `scripts/setup.py` no longer pin the CDN URL in their
    config, so they follow the theme.

### Fixed

- **Astro package model: an adopter's `SITE.fontAwesome` now resolves against
  the base**, so a site-relative path survives a subpath install. It was
  written to the page raw, unlike every other URL the theme emits. The subpath
  guard in CI could not see it because leaving the key unset renders no link at
  all; a smoke variant now sets it.
- **The demo configs no longer pin `fontAwesome` to `/fontawesome/…`.** That
  path is the template model's default and does not exist in the package model,
  which bundles the stylesheet instead, so every page of every demo requested a
  stylesheet that 404'd. Icons rendered anyway, from the bundled copy, which is
  why it went unnoticed. Leaving the key unset is and was the correct setting.

## [0.10.0] - 2026-08-10

### Added

- **`scripts/starter-content.py`**, the companion to the setup wizard: it copies
  the theme's starter content (a post, an event, an organizer, a speaker, a
  venue, the handbook and runbooks) into a new site, never overwriting anything
  that is already there.
- **The wizard can write an Astro site that consumes the npm package**, not only
  one that vendors this repo: `--astro-model package` writes
  `popular.config.ts`, a `package.json` pinned to the current release, a
  one-line `src/content.config.ts`, and an `astro.config.mjs` using the
  integration. The result is a small repo that updates with `npm update` rather
  than by re-copying files. `--astro-model template` (the default, and what an
  existing site detects as) is unchanged.
- **The setup wizard asks for a brand colour**, optionally. One hex is enough:
  the theme derives badges, tags, hovers and link states from it, so answering
  `#fa023c` writes `[params.brand].primary` (Hugo) or `BRAND.primary` (Astro)
  and the whole site follows. Skipping it writes nothing at all and leaves the
  default palette in place, which keeps a first run adoptable without `--force`.
  Answers are validated as `#rgb` or `#rrggbb`, a new `color` question type in
  the shared schema.
- **A preview banner for generators** (`partials/preview-bar.html` ⇄
  `components/PreviewBar.astro`). Set `params.previewMode` / `SITE.previewMode`
  and the page carries a fixed "this is a preview" bar, with an optional `note`
  for things like an expiry. It is meant for a tool that renders a site on
  someone's behalf and shows it in an iframe. Nothing the setup wizard writes
  into a real site's config sets the flag, and CI in both repos fails if the
  banner turns up in a build that did not ask for it.
- **The setup wizard now writes everything a GitHub Pages deployment needs.**
  Answer the site-URL question with a project-page URL
  (`https://you.github.io/my-community/`) and `scripts/setup.py` writes a site
  that works there:
  - Astro gains a generated `astro.config.mjs` carrying `site` and `base`.
    Astro needs the origin and the subpath as separate keys and nothing wrote
    `base` before, so a project-page site 404'd every internal link. They are
    derived from the single `base_url` answer, so the schema is unchanged and
    no one is asked the same thing twice.
  - Both frameworks gain `.github/workflows/deploy.yml`, a parameterless
    GitHub Pages workflow (everything that varies lives in the config the
    wizard already wrote). It is skipped when the site already has workflows
    of its own, so it never fights an existing deployment. Set Settings ->
    Pages -> Source: GitHub Actions once, and pushes to `main` publish.
- **Astro: `popular-markdown.mjs`,** the markdown hooks (lazy images, base-aware
  links) as a proper integration in the template model, matching what the npm
  package already does. Because an integration receives the resolved config,
  `astro build --base /elsewhere/` now applies to markdown bodies too, where the
  old config-file hook silently kept the old base.

### Changed

- **The Astro demo deployment builds each demo with Astro's `base`** instead of
  rewriting the built HTML with `sed`. The rewrite predated base support and
  could never reach the absolute URLs, so a deployed demo's canonical,
  `og:image` and JSON-LD all pointed at the site root. Both the Pages workflow
  and the Netlify preview build now run `scripts/build-sites.mjs`, so a preview
  cannot differ from production.
- **The preview banner can be switched on from the environment**, for a
  generator that owns the build but not the config: `HUGO_PARAMS_PREVIEWMODE_NOTE`
  (Hugo) or `POPULAR_PREVIEW_NOTE` (Astro). Setting either enables the banner and
  supplies its note.

## [0.9.1] - 2026-08-05

### Fixed

- **The docs sidebar scrolls when it outgrows the window.** On a long page the
  current entry nests every heading beneath it, which makes the sticky sidebar
  taller than the viewport, and a sticky element taller than the viewport
  cannot be scrolled: the entries below the fold, including the links to the
  other docs pages, were unreachable until you had scrolled through the whole
  article. The sidebar now stops at the bottom of the window and scrolls on its
  own, and the scroll-spy keeps the highlighted entry in view as you read.

## [0.9.0] - 2026-08-05

### Added

- **Base-aware URL helpers, as public surface.** Astro: `withBase()` and
  `absoluteUrl()` from `src/lib/url.ts`, exported by the package as
  `astro-theme-popular/url`. Hugo: `rel-src.html` (images and assets) and
  `abs-url.html` (absolute URLs) join the existing `rel-href.html`. Use them
  for any URL your own components, overrides or templates emit, and a subpath
  install keeps working. The Astro template repo's `astro.config.mjs` gained a
  `base` constant at the top: leave it `'/'` for a site at a domain root.

### Fixed

- **Sites served from a subpath now work in both themes.** A site deployed to
  `user.github.io/repo/` (Astro `base`, Hugo `baseURL` with a path) built and
  styled correctly but every internal link and image stayed at the server root
  and 404'd. Both frameworks rewrite the asset URLs they generate themselves,
  and neither touches the paths a template writes, so those had to be resolved
  explicitly.
  - Astro: new `withBase()` / `absoluteUrl()` helpers (`lib/url.ts`, exported
    from the package as `astro-theme-popular/url`) now resolve every URL the
    theme emits: navigation, cards, tags, pagination, the brand link, images
    from config and front matter, the shared behaviour scripts, and the
    absolute URLs in canonical, `og:image`, JSON-LD, RSS, `llms.txt`,
    `robots.txt` and the iCalendar feed. Markdown bodies are handled by a hook
    the integration registers on the active Markdown processor.
  - Hugo: `rel-href.html` now has a sibling, `rel-src.html`, for images and
    assets, plus `abs-url.html` for absolute URLs. Front matter written the
    Astro way (`image = "/images/x.png"`) previously lost the subpath, because
    `relURL`/`absURL` treat a leading slash as the server root. Card, hero,
    logo, favicon, avatar and body images, the JSON-LD `url`/`logo`/`image`
    fields and `og:image` all go through them now.
  - Adopter configs and content need no changes: the helpers pass external
    URLs, `mailto:`, `tel:` and `#fragment` through untouched, and accept
    paths written with or without a leading slash.
  - Both repos build a subpath site in CI and fail on any internal `href` or
    `src` left at the root (`PARITY.md`, "Subpath deployments").
- **Astro package: markdown images regained `loading="lazy" decoding="async"`.**
  Astro 7's default Markdown processor does not run rehype plugins, and a
  plugin added by an integration after config validation was dropped silently
  (Astro warned on every build). The theme's hooks are now registered on the
  active processor, in that processor's own plugin shape.

## [0.8.1] - 2026-08-04

### Changed

- The setup wizard now adopts an unedited starter file automatically. On a fresh
  site (copied from `exampleSite` or a demo, or the Astro template), it writes
  the config and Code of Conduct seed page without `--force`, because their bytes
  still match what the theme shipped. The moment you hand-edit either one, the
  wizard protects it again and asks for `--force`. First-time setup no longer
  needs a flag.

## [0.8.0] - 2026-08-04

### Added

- Setup wizard (`scripts/setup.py`): a stdlib, zero-dependency script that reads
  the shared question schema (`setup-questions.json`) and writes a site's config,
  a Code of Conduct seed page, a `DECISIONS.md` audit trail (what was decided,
  with handbook citations, and what is still open) and a `.popular-setup.json`
  answer record. Sugar, never a gate: skip every question and you get the clean
  starter config. Runs interactively or non-interactively (`--answers file.json`)
  for the agent and CI paths, detects Hugo vs Astro, and never overwrites an
  existing file without `--force` (`--dry-run` shows the diff). Works by
  placeholder substitution on templates, so it never parses or re-serializes
  your config.
- "Before you build" worksheet (`/docs/before-you-build/`): a docs page that
  renders the same question schema as a persistent checklist (decisions to
  settle first, then values to have ready), so the worksheet cannot drift from
  the wizard. The quick-start is rewritten around the wizard, and both repos'
  `AGENTS.md` gain a "Setting up a new site for a user" interview protocol.

## [0.7.0] - 2026-07-31

### Changed

- The footer shows the theme version (e.g. `v0.7.0`) next to the Popular
  credit, on the demos and the docs site.

### Fixed

- The "no upcoming events" empty state no longer renders on event-less sites
  such as the docs site; it appears only on a community that has an events
  section but nothing upcoming.

### Added

- Recaps toolkit: `gallery` + `photo` and `pullquote` shortcodes (Hugo) /
  `Gallery` + `Photo` and `Pullquote` components (Astro). The gallery is a
  CSS-grid figure list with no JavaScript and no lightbox (each photo links to
  its full-size image); `alt` is required and a missing one fails the build.
  A recap is a blog post tagged `recap` that uses both, with a worked example
  in the KDrama demo.
- `llms.txt`: a build-time plain-text summary for AI agents at `/llms.txt`,
  naming the next upcoming event, how to join, and links to the key pages and
  the calendar feed. Always generated on Astro; on Hugo the site adds `LLMS`
  to its home outputs (the demos, exampleSite, and docs site do).
- Docs: the deliberate non-features list (job board, member directory,
  comments, photo lightbox) and the stats strip as the social-proof pattern.

### Added

- Talk archive. Events gain optional `recording` / `slides` (single-talk
  meetups) and a `talks[]` array (`title` required; `speaker`, `recording`,
  `slides` optional); when `talks[]` is present it wins over the event-level
  fields. The event page renders a Talks section (or inline links for the
  simple case), and past-event rows show a recording cue. An opt-in `/talks/`
  archive aggregates every talk newest-first, filterable by the parent event's
  tags: enable it with `content/talks/_index.md` (Hugo) or `SITE.talks = true`
  (Astro). New UI strings `watchRecording`, `viewSlides`, `hasRecording`,
  `talks`, `talksLead`.

### Changed

- Speaker, organizer, and author profile pages no longer repeat the bio: the
  page hero is now a compact banner (eyebrow, name, back link) and the bio
  lives only in the persona card below it.

### Added

- Community chat bridge and speaker pipeline. `params.community.chat =
  { url, label }` adds a "Join the chat" CTA to the home hero, the footer, and
  the no-events empty state (platform-agnostic: Discord, Slack, Matrix, Zulip).
  The starter ships a "Start here" first-timer page (`/start/`) and a "Speak
  with us" call-for-speakers page (`/speak/`). `params.speakers.invite = true`
  appends a "Your name here?" card to the speakers list (new strings
  `speakerInviteTitle`, `speakerInviteBody`), off by default.

### Fixed

- Astro: the speakers and venues list pages (`/speakers/`, `/venues/`) were
  missing, so the "All speakers" / "All venues" back links on detail pages led
  to 404s. Both list pages now exist, mirroring the Hugo templates.

### Added

- Notice banner and designed empty states. `params.notice = { text, url? }`
  renders a static, non-dismissible banner above the header (inline-markdown
  text, an optional link, no JavaScript). When there are no upcoming events,
  the home page and the events list now render a designed empty state (a
  message, the community chat CTA if configured, and the calendar-subscribe
  link) instead of a blank section. New UI strings `learnMore`, `joinChat`.

### Added

- Venue access & logistics fields: `wheelchair` (a badge on the venue and on
  events held there), `transit`, `parking`, and a freeform `access` note,
  shown as a "Getting there & access" section. Inclusion as a data-model
  concern. Matching spreadsheet-importer columns. New UI strings
  `gettingThere`, `wheelchairAccessible`, `transit`, `parking`.

### Added

- Calendar feed: an iCalendar (`.ics`) feed of events at
  `/events/calendar.ics`, so members subscribe once and every future meetup
  appears in their calendar app. Reuses the event `time` parsing (so the feed
  and the Event structured data agree), marks cancelled events, and adds a
  "Subscribe to calendar" link to the events list. `scripts/check-ics.py`
  validates it in CI. Hugo: add `Calendar` to the events section outputs.

### Fixed

- Speaker, venue and organizer profile pages now show a back link to their
  list (matching blog posts and events); the organizer link follows the
  renamed team section. New UI strings `allSpeakers`, `allVenues`,
  `allOrganizers`.

### Added

- Astro package: component overrides. `popular({ overrides: { Header:
  './src/overrides/Header.astro' } })` replaces any of Header, Footer, Hero,
  EventRow, PostCard, OrganizerCard, AuthorBox, PageHero without forking the
  theme. (Hugo adopters already override via native template lookup.)

## [0.6.0] - 2026-07-23

Search-engine optimisation: structured data, crawl plumbing, Core Web Vitals,
and an FAQ block. Zero client JavaScript added.

### Added

- Structured data (JSON-LD, byte-identical across both frameworks):
  `schema.org/Event` on event pages (rich-result eligible, with best-effort
  `time` parsing; see PARITY.md for the contract), `Organization` on home
  pages, `BlogPosting` on blog posts, and `FAQPage` from FAQ blocks.
- New event fields: `cancelled` (a visible danger badge **and** the structured
  status, so they never disagree), `online` (virtual location), and
  `price`/`currency`/`cost` (paid-event offers).
- FAQ block: `{{< faq >}}`/`{{< question >}}` shortcodes (Astro `<FAQ>`/
  `<FAQItem>`), native `<details>` with zero JavaScript, answers in the DOM
  for indexing and AI answer engines. Gated FAQPage JSON-LD via
  `seo.faqJsonLd` (default true).
- Crawl plumbing: `robots.txt` advertising the sitemap, `og:locale`,
  `og:image:alt` (optional `imageAlt` field), and an opt-in `noindex` on
  taxonomy pages (`seo.noindexTaxonomies`). Astro adds `@astrojs/sitemap`.
- Core Web Vitals: markdown and card/list images lazy-load with async
  decoding (hero and event lead stay eager); a `preconnect` to the Font
  Awesome CDN when the default URL is used.
- New SEO and FAQ documentation pages; `scripts/check-jsonld.py` validates
  every built JSON-LD block in CI.

## [0.5.0] - 2026-07-21

### Added

- Computed home-page stats: `@count:<section>` (and `@count:<section>:rounded`)
  render a live entry count for any section, generalizing `@pastEventCount`.
  Factored into a reusable resolver (Hugo `partials/stat-value.html`, Astro
  `src/lib/stats.ts`).
- Organizer profile pages: each organizer entry renders a bio-card profile
  page (Hugo `organizers/single.html`, Astro `organizers/[slug]`), and
  organizer cards link to it. New `eyebrowOrganizer` UI string.
- Back link to the parent section on nested pages, labeled by the parent's
  optional `shortTitle` front-matter field or its title. Astro serves pages
  through a rest-param route to support nested page ids.
- Renameable content sections: `[params.sections]` (Hugo) / `SECTIONS_MAP`
  (Astro) point post-author bylines (`authors`) and the homepage team grid
  (`team`) at differently-named sections, for communities whose people are
  not "organizers" or whose blog is not written by "authors". No template
  overrides needed.

### Fixed

- Post cards on date-less pages no longer render "Jan 0001" or a stray
  eyebrow separator (affects sections of static pages rendered through the
  default list).

## [0.4.0] - 2026-07-14

### Added

- Astro package: `popular({ routes: { speakers: false, ... } })` disables
  any injected route group, the supported way to replace part of the
  content model or provide your own `/` or `/rss.xml`.
- Astro package: injected slug routes use rest params, so folder-organized
  content ids (`2019-pycon-us/cooper-lees`) build.

### Changed

- Astro: theme pages tolerate undefined or empty collections, rendering no
  pages instead of failing the build.
- Theme-only CI workflows (deploys, releases, parity checks and reminders)
  no longer run in forks of either repo.

## [0.3.0] - 2026-07-09

### Added

- Older/newer post navigation on blog posts, with the cross-framework
  ordering contract pinned in PARITY.md (date descending, then title, then
  slug; `weight` on posts is unsupported). New UI string keys:
  `postNavigation`, `newerPost`, `olderPost`.
- The Sessionize importer can store a site's endpoint: `--id <embed-id>`
  shorthand, or persist it in `popular-import.toml` (`[sessionize]` with
  `id` or `url`) and run with just `--site .`.
- An updating guide at /docs/updating/: release discovery, per-install-method
  update steps, and which customization hooks survive updates.
- Astro: phase 1 of npm packaging (PACKAGING.md): the theme as an installable
  Astro integration under `package/`, with a smoke consumer built in CI.
  Experimental; the copy-this-repo model is unchanged and remains canonical.

## [0.2.0] - 2026-07-08

### Fixed

- Query-string URLs no longer double-escape (`&` became `&amp;amp;`, breaking
  links) in buttons, footer and header links, social icons, and markdown
  links. CI now fails on any double-escaped ampersand in built output.
- Markdown links no longer render a stray space before following punctuation.
- Astro: the RSS `<link rel="alternate">` resolves against the configured
  site instead of hardcoding `/rss.xml`, fixing subpath deployments.

### Changed

- The footer theme credit in demos and starters now links to the project
  site (mariatta.ca/hugo-theme-popular) instead of the author's personal
  site. Adopters control their own credit via footer config.

### Added

- `g-btn--accent` button variant, with an `accentHover` brand key (defaults
  to a darkened accent).
- `--gold-100` (card image placeholder tint) now derives from `brand.primary`
  like its sibling tints, instead of staying champagne on re-branded sites.
- Hugo: a `head-extra.html` hook for analytics or any other head markup,
  overridable per site without replacing the whole head partial.
- Astro: optional `SITE.rssTitle` for the feed link title.

## [0.1.0] - 2026-07-08

First public release.

### Added

- The theme, in Hugo and Astro parity: events (upcoming/past, venues,
  speakers, check-in and arrival notes, RSVP, "venue wanted"), multi-author
  blog with tag filtering and pagination, organizers, sponsors, and a docs
  area with scroll-tracking TOC and persistent checklists.
- Config-first branding: one `brand` block recolors and retypes the whole
  site, dark palettes included, plus `customCSS` for anything further.
- Content importers (stdlib-only Python): Sessionize (`sessionize-import.py`)
  and spreadsheet (`spreadsheet-import.py`, with `--make-sample` starter
  workbook). Unicode-safe slugs, never overwrite, Hugo and Astro output.
- Four fictional demos (Rocky Cove Aquarium Club, Lucky Town Foodie Club,
  KDrama Fan Club, Truly Madly Riley) plus the neutral "Your Community"
  starter (Hugo `exampleSite/`, Astro `demos/starter/`).
- Accessibility groundwork: required alt text enforced in CI, keyboard
  navigable menus, checklist checkboxes announce state, skip link, WCAG
  link underlines.
- CI: helper-script tests, image-alt checks (Hugo 0.146 floor + latest),
  cross-repo parity check, base-path escape scan on deploys.
- Hugo Modules support (`go.mod`): import as
  `github.com/Mariatta/hugo-theme-popular`.
