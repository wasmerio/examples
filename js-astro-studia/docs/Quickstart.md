# Quickstart

Node 22 or newer (`.nvmrc` pins it, and `.devcontainer/devcontainer.json` pins
the same version for GitHub Codespaces and VS Code dev containers). Nothing
else: the build needs no network and no token.

```bash
npx degit dfuchss/astro-studia my-site   # or "Use this template" on GitHub
cd my-site
npm install
npm run dev                              # http://localhost:4321 → /astro-studia/
```

Put the upstream commit you started from (`git ls-remote
https://github.com/dfuchss/astro-studia.git main`) into your first commit's
message. Then, if you later want upstream fixes, [Updating](Updating.md) is two
commands instead of a search.

`/` redirects to `/astro-studia/` because the template ships configured for a
project page and `base` is derived from `SITE.url`. Hand-written links, `public/`
assets, the favicon and the brand mark then resolve in dev exactly as they do in
the build.

What you are looking at is demo content — the works of Cicero, cited as a
classicist would. It is **meant to be deleted**, and every feature ships on
for a reason: a feature that is switched off is still on disk and still
type-checked, but a feature that is commented out is not, so the demo is also
the test suite.

Do the five steps below in order.

## 1. Set `SITE.url`, and look at both entry-page shapes

**Set `SITE.url` in `src/consts.ts` first: it is the only edit here that fails
silently.** `astro.config.ts` derives `base` from its path, and
`scripts/audit-site.mjs` derives the base it _expects_ from the same value. Left
as shipped, the site builds with `/astro-studia` in front of every link,
canonical and sitemap entry and **`npm run audit` passes** — the links and the
audit agree with each other — and every one of those URLs is a 404 the moment it
is deployed anywhere else. Put the full address you will publish at in that one
field, path included.

The template carries two front pages and shows you both:

- `/` is the **profile** shape — a portrait, a role line, counted stats,
  selected publications, recent posts.
- `/demo/project/` is the **project** shape — a centred logo, a pitch, sub-projects,
  a people roster.

Both shapes live in the same file, `src/pages/index.astro`, always — which one
renders at `/` is `HOME_SHAPE` in `src/features.ts`. The switcher above the
hero links the two. Decide which one you want now: step 3 sets `HOME_SHAPE`
for you, and with the `demo` feature off there is no switcher to compare them
with afterwards.

## 2. Set the eight things that are yours

Nothing here is a code change; all of it is one file each.

| #   | Edit                       | For                                                                                                                |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 1   | `src/consts.ts`            | The rest of it: `email`, `repo`, `SELF`, `brandLogo`. Set `demoNotice: false` when done.                           |
| 2   | `src/styles/tokens.css`    | One base hex per accent family. See [Theming](Theming.md).                                                         |
| 3   | `src/data/`                | `papers.bib`, `venues.yml`, `cv.yml`, `contact.yml`, `socials.yml`.                                                |
| 4   | `src/content/`             | Your paper pages, projects and posts.                                                                              |
| 5   | `src/assets/portrait.*`    | Your photo. The filename is the whole setting.                                                                     |
| 6   | `public/assets/img/og.png` | The link-preview card. The shipped one says "replace this".                                                        |
| 7   | `public/*.png` icons       | The three icon PNGs from one square image: `npm run icons -- path/to/square.png`.                                  |
| 8   | `src/content/pages/`       | Every word the site prints: `site/` for the title, brand, tagline, nav and footer; one file per page for the rest. |

Row 5 only matters for the **profile** shape. The project shape renders no
portrait, but nothing deletes `src/lib/portrait.ts` or the file underneath it
if you add one anyway — it just sits unreferenced, same as any other feature
you leave off.

[Configuration](Configuration.md) walks the whole of `src/consts.ts` and every
file in `src/data/`. [Content](Content.md) is the collections and their front
matter, and [Page text](Content.md#page-text) the files in `src/content/pages/`; the eight rows above are what matters first, and
[Replacing the demo content](Content.md#replacing-the-demo-content) is every
remaining file that still holds Cicero's bytes.

## 3. Pick your features

```bash
npm run init
```

Every feature ships on, as a boolean in `src/features.ts`. Turning one off is
editing that boolean — nothing is deleted, the code stays on disk, and
`astro check` still type-checks it. `npm run init` is the fast way to set them
all at once; it writes exactly three files, `src/features.ts`,
`src/consts.ts` and `src/content/pages/site/site.md`, and nothing else. It offers two starting selections and then
lets you tick and untick freely:

```
Presets
  1) profile  12 features: publications, papers, projects, blog, feed, cv, repositories, …
  2) project  8 features: publications, papers, projects, feed, people, authors, …
  3) custom   start from everything and untick
```

A preset is a _starting selection, not a mode_. Nothing in the built site
branches on which one you chose, and afterwards there is no preset any longer —
only booleans.

Non-interactively — note the `--`, which is how `npm run` passes arguments
through to the script rather than eating them itself:

```bash
npm run init -- --help                        # or -h: the flags, and every feature id
npm run init -- --preset profile
npm run init -- --preset project --dry-run    # print the plan, write nothing
npm run init -- --features cv,imprint         # turn on exactly these, nothing else
npm run init -- --preset profile --yes        # or -y: keep every current string, no prompts
```

A selection that cannot build is refused, not repaired: `papers` without
`authors` is a choice between two features, and `npm run init` will not guess
which one you meant — it names the offender and stops, the same check
`src/features.ts` runs at build time.

Interactively, after the feature list it also asks for `HOME_SHAPE` (which
entry-page shape renders at `/`), `FEED_SOURCE` (what `/feed.xml` is a feed of,
when more than one answer is still possible), and the six strings that say who
the site is about — `SITE.url`, `SITE.email`, `SELF.first` and `SELF.last` in
`src/consts.ts`, the `title` and `brand` in `src/content/pages/site/site.md` —
each defaulting to the value already there. The title may say `{name}`, which
is filled from the first and last name. It then runs `prettier` on the files it
wrote, and offers to run `check`,
`build` and `audit`, reporting which one failed if any did.

There is no confirmation gate and nothing to say no to: running it twice is a
no-op, and running it again later to turn a feature back on is the same
command, not an undo. [Features](Features.md) is the same choice made by
hand, plus the full table of what each feature owns and what still needs a
human edit when you turn it off.

One difference between `npm run dev` and `npm run build`: visiting a
switched-off route in dev gets you a real 404, rendered from `404.astro`,
because nothing is written for the request to hit. In a build the route is
simply absent from `dist/` — there is no file to 404 on, because nothing
asked for it.

## 4. Build it, then check it

```bash
npm run check      # astro check + prettier --check
npm run build      # → dist/
npm run audit      # every check over dist/
```

`audit` is the one to read. It resolves every internal link, canonical, sitemap
entry and feed link to a file on disk by its exact shape, and prints a line per
check:

```
✓ links: 549 internal links and 37 fragments resolve
✓ urls: 54 canonical, og:url, Scholar and JSON-LD URLs each name their own file
✓ sitemap: robots.txt → sitemap-index.xml → 1 file(s), 24 URLs, every one names a file on disk
```

[Verification](Verification.md) says what each of those lines asserts.

## 5. Deploy

`.github/workflows/deploy.yml` is already there. It installs, checks, builds and
**audits before it publishes**, then pushes `dist/` to the `gh-pages` branch on
a non-PR push to `main`.

1. Settings → Pages → deploy from the `gh-pages` branch.
2. `SITE.url` in `src/consts.ts` — step 1, and the only place the address is
   written down: `astro.config.ts`, `src/pages/robots.txt.ts` and
   `scripts/audit-site.mjs` all read it.
3. For a custom domain, add `public/CNAME` containing the bare hostname.
4. Deploying to `https://<user>.github.io/<repo>/` instead? Still that one edit:
   put the whole address, path and all, in `SITE.url`. There is no `base` to set.
   `astro.config.ts` derives it from that path, so writing it out by hand gives
   you exactly the second copy of one fact the derivation exists to prevent.

[Deploying](Deploying.md) covers all of it, plus the URL policy, another host,
your own 404 page and the two opt-in data-refresh workflows.

One more workflow, `docs.yml`, publishes `docs/` to the repository's wiki. It is
**pinned to the upstream repository and does nothing in yours** until you change
one line — see
[Publishing the docs to the wiki](Deploying.md#publishing-the-docs-to-the-wiki).

## When something fails

Almost every failure in this template names the file that caused it. In rough
order of how often you will see them:

| It said                                             | It means                                                                    |
| --------------------------------------------------- | --------------------------------------------------------------------------- |
| `Invalid content reference: … references "X"`       | a slug, venue `abbr` or BibTeX key with no entry behind it                  |
| `page = {…} is not a /papers/<slug>/ path`          | a `page` field in `papers.bib` that does not match the route                |
| `pdf`/`page` points at a file that is not there     | the .bib entry outlived a rename                                            |
| `contact.yml row N (label): …`                      | a row with neither or both of `value` and `email`, or an address in `value` |
| `portrait: no src/assets/portrait.<ext> found`      | or two of them, which is equally an error                                   |
| `link /x/ does not resolve — expected x/index.html` | a link whose shape disagrees with the file the URL policy emitted           |
| `dist/.nojekyll is missing`                         | `public/.nojekyll` was deleted; without it Pages serves no CSS              |
| `section 'x' … has no [data-section='x'] block`     | a new `Section` member without its accent block in `tokens.css`             |
