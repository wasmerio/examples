# Verification

```bash
npm run audit    # node scripts/audit-site.mjs
```

One gate, one script. Every check in `scripts/audit-site.mjs` is an independent
block, plus one at the end that only reports, and each prints a `✓` line — the
sitemap check prints two, and a `public/CNAME` adds one more:

```
✓ css: 62 custom properties, all defined or defaulted
✓ css: dark-only, no theme toggle
✓ css: all 9 sections have an accent block
✓ a11y: 9 colour tokens all clear WCAG on --bg
✓ links: 549 internal links and 37 fragments resolve
✓ urls: 54 canonical, og:url, Scholar and JSON-LD URLs each name their own file
✓ manifest: 3 URLs across 1 .webmanifest name a file on disk, all carrying the base /astro-studia/
✓ html: 24 pages each have one h1, a title, a description and a canonical (or noindex)
✓ html: all 47 images have intrinsic dimensions
✓ html: no text runs into a link on 24 pages
✓ privacy: no third-party subresources
✓ privacy: no email address appears in the built output
✓ sitemap: robots.txt → sitemap-index.xml → 1 file(s), 24 URLs, every one names a file on disk
✓ feed.xml: 2 <item> entries, 3 links each name a file on disk
✓ dist/.nojekyll present
  bundle: 48.0 KB CSS across 3 file(s), 0.0 KB external JS; most inline JS on one page: 1.8 KB (/publications/index.html)
```

`.github/workflows/deploy.yml` runs this **before** it publishes. That ordering
is the whole point: a broken link or a missing `.nojekyll` fails the workflow
instead of reaching the site.

Everything runs against the built bytes in `dist/`, offline. Nothing here crawls
the live site, because a check that crawls the live site tells you about a problem
your readers found first.

## The design principle

From the header of `scripts/audit-site.mjs`:

> A note on the shape of these checks: several work by regex over built output,
> which is a technique with one characteristic failure — change the thing being
> matched and the regex silently matches nothing and reports success. Every check
> of that kind here therefore asserts a floor on how much it found. **A check that
> has stopped checking must fail, not pass.**

This is not hypothetical, and it is the reason to read the numbers in those `✓`
lines rather than the ticks. A regex-based check has two failure modes — the thing
it looks for is wrong, or the thing it looks _at_ has moved — and only the first
one is loud by default. So each such check names a minimum:

| Check             | Fails if it found fewer than                     |
| ----------------- | ------------------------------------------------ |
| custom properties | 20 `var()` reads — "the scan is broken"          |
| section contract  | 2 `data-section` values — "is this check stale?" |
| contrast          | 3 parsable colour tokens                         |
| internal links    | 1 internal link                                  |
| self-URLs         | one per page that is not a redirect stub         |
| sitemap           | one `<loc>` per page that carries a canonical    |
| manifest          | one URL in the manifest's JSON                   |
| feed              | one `<item>`                                     |

The same instinct applies to the scope of a check. Check 1 used to flag **every**
`var()` use, including the ones written with a fallback; it passed only because
one demo page happens to set `--ti` inline and the collector pools inline
definitions globally. Deleting three icons from that one page would have failed the
audit of an untouched template, and a real site whose prose never uses an inline
icon failed on day one. A check that passes for an accidental reason is worse than
no check, because it reports green for the wrong thing and nobody looks again.

## Resolving a URL to a file: strict, by shape

Several of the checks share one rule, and it is the most load-bearing thing in
the script. A published URL names **exactly one** file, and its shape says which:

```
/            index.html
/a/b/        a/b/index.html
/a/b         a/b.html
/a/b.ext     a/b.ext
```

Nothing else is tried. This used to accept `a/b.html` and `a/b/index.html` for one
another, and that leniency is precisely how a build under the wrong
[URL policy](Deploying.md) passed every check: `/projects/x/` was linked,
`projects/x.html` was emitted, the audit found the file by the other spelling and
reported green, and the deployed link was a 404. **A static host does not try the
other spelling.** So the shape _is_ the contract — and when the other spelling
does exist, the failure message says so, because "the link's shape does not match
the file the URL policy emitted" is a different bug from a dangling link and wants
a different fix.

With a `base` configured, `dist/` is still the root of what is deployed — the
subdirectory comes from where it is deployed _to_ — so the base is stripped before
anything is looked up on disk.

## `scripts/audit-site.mjs`

Checks 1, 2, 2b and 3 are contracts this template makes about itself; 4 to 10
are true of any site. Each block is independent — delete one you do not want,
add one you do.

Everything it needs from configuration is read out of `src/consts.ts` by regex
rather than imported, because this is a plain Node script with no TypeScript
loader: `SITE.url` — which gives the site's own host and, from its path, the base
— and `ALLOWED_THIRD_PARTY`. It does not open `astro.config.ts`. It used to,
grepping there for a `base: '…'` literal, which stopped matching the moment that
value became derived; the check then read an empty base and went on printing
green. Read the same single source the build reads.

Redirect stubs are excluded from the per-page checks: a stub is intentionally
minimal — no nav, no canonical, no `<h1>` — so demanding those of it would be
demanding it stop being a stub.

### 1. Every CSS custom property is defined

Every `var(--x)` **without a fallback** must have a `--x:` somewhere in the built
CSS, the inline `style=` attributes, or an inline `<style>`.

`var(--x, fallback)` is deliberately exempt: the fallback _is_ the definition, and
writing it that way is how a stylesheet says "callers may override this, and here
is what happens when they don't". `Prose.astro`'s `--ti` — an inline-icon colour a
page sets per icon — is exactly that, and is never defined in CSS on purpose.

Inline styles are collected too, because the venue badges pass their brand colour
that way.

### 2. Dark only

No `[data-theme` in any built stylesheet, and no `data-theme` or `light-toggle` in
any page. `color-scheme: dark` sits on bare `:root`, so every colour has exactly
one definition and there is no second palette to keep in step.

If you want a light theme this is the check to delete first — but note that every
`color-mix()` role in `tokens.css` assumes a dark ground, and check 3 compares
against `--bg` alone.

### 2b. Every section has an accent block

Every `data-section="x"` found in the built HTML must have a `[data-section='x']`
block in the built CSS.

`SECTIONS` in `src/consts.ts` and those blocks in `tokens.css` have to
agree, or a page renders with the wrong accent — or with the default one, which
looks deliberate and is the harder bug. Comparing built HTML against built CSS
catches it from the outside, without this script needing to parse TypeScript.

### 3. Contrast

Every token whose value is a bare six-digit hex is checked against `--bg`:
`--text*` at 4.5:1 (WCAG AA for body text), everything else at 3:1 (large text,
and non-text elements such as an icon or a rule that carries meaning). Surfaces
(`--bg*`), borders (`--border*`) and the neutral aliases (`--sec*`) are skipped —
what things sit on, and things that are not text.

**Derived, not listed.** The role tokens (`-strong`, `-line`, `-dim`, `-glow`) are
`color-mix()` expressions and so drop out automatically, which is right. Change the
palette and this follows it; add a sixth accent family and it is checked without
anyone remembering to add it here. The failure names the token, its ratio and the
threshold it missed.

### 4. Internal links and fragments resolve

Every site-relative `href` is resolved by the strict shape rule. Every `#fragment`
must have a target `id` or `name` — on the page it sits on, and on the page it
points at when the link crosses pages.

With a `base` configured this is also the base check: a link or an `src=` that
does not carry the base points at the domain root and 404s wherever the site
actually lives. `src/integrations/base-paths.ts` should have prefixed every one
during the build, and this is what says so if it ever stops working — which is the
failure that whole integration exists to make loud. Subresources are counted only
in that case, because an `<img>` pointing at the domain root is a broken image
rather than a broken link: quieter, and so easier to ship.

The summary line prints only when nothing in the block failed. It used to print
unconditionally, under a column of `✗`, and a reader skimming for ticks saw it.

### 4b. Every URL a page publishes about itself names that page's file

The canonical link, `og:url`, Scholar's `citation_abstract_html_url` and the
JSON-LD `url` all claim to be the address of the page they sit on. Each is
resolved by the strict rule and must land on **the very file it was read from** —
not merely on some file.

That is what catches a canonical built from `Astro.url.pathname` under a URL
policy where that is the _file_ path: `…/cv.html` resolves to nothing, and
`…/404/` never existed. Only `BaseHead.astro` and `ScholarMeta.astro` build a page
URL, and both go through `routePath()` in `src/lib/paths.ts`; a third caller that
forgot to would be told here rather than silently wrong.

Absolute rather than site-relative, because that is what these fields are: a
canonical on another origin is a statement that this page is a copy of something
elsewhere, and this template never makes one. `sourceOrganization.url` in the
JSON-LD is the site root and is deliberately not checked.

### 4c. The web app manifest's URLs carry the base and name real files

The page scan never hands this file over and check 4 reads attributes, so
`dist/site.webmanifest` shipped `"src": "/favicon-32.png"` and all three of its
icons 404ed on a project page. No page links an icon, so nothing else here would
have noticed.

```
✓ manifest: 3 URLs across 1 .webmanifest name a file on disk, all carrying the base /astro-studia/
```

**Every** root-absolute string in the parsed JSON counts as a URL — not only the
keys `src/integrations/base-paths.ts` knows how to rewrite. That asymmetry is the
point: a manifest key nobody has taught the rewriter fails here, loudly, rather
than shipping without a base. The `<link rel="manifest">` on the pages is
resolved by the strict shape rule too, so the manifest is whichever file the
pages actually name — the same rule as `robots.txt` and the sitemap. The trailing
clause about the base drops out when no base is set.

The whole block is **skipped when there is neither a manifest nor a
`<link rel="manifest">`**, because removing both is a supported subtraction and
an audit that then demanded one would be telling you off for it. The floor is one
URL: a manifest has icons, so none at all means the JSON walk has stopped
walking.

### 5. Per-page document basics

Exactly one `<h1>`, a non-empty `<title>`, a non-empty meta description, and
**exactly one** of a canonical link and `<meta name="robots" content="noindex">` —
never both, never neither.

The 404 page is the `noindex` case, and it is the reason the rule is phrased as an
exclusive or. `/404.html` is served for every URL that does not exist, so there is
no address a canonical could truthfully name; the one it used to carry, `/404/`,
was a URL that did not exist either.

### 6. Images carry intrinsic dimensions

Every `<img>` needs `width` and `height`. Without them the page reflows as each
image loads, which is both the worst of the layout-shift metrics and genuinely
unpleasant to read.

Every image a collection schema names comes from `src/assets/` through Astro's
`<Image>`, which supplies both attributes. The one image that does not is the
brand mark in `SITE.brandLogo`, which is a configured path under `public/`; that
one gets them from `intrinsic()` in `src/lib/images.ts`, which reads the SVG
`viewBox` or the PNG or JPEG header off disk. An `<img>` written by hand in
markdown gets them from you — which is why `.prose` documents the raw `<figure>`
form, since markdown's `![](…)` cannot carry either attribute. See
[Content](Content.md).

### 6b. Text does not run into a link

Astro strips the newline between a trailing word and a following `<a>`, so

```
written at the
<a href="...">institute</a>, <a href="...">somewhere</a>
```

renders as "written at theinstitute, somewhere". It reads fine in the source and is
easy to miss in review, so this checks the rendered bytes: a letter, digit, comma,
full stop, semicolon or colon immediately against a link boundary, with no space
between.

Chips, badges and icon links are exempt by class — `chip`, `venue`, `who`,
`title-link`, `brand`, `orcid`, `icon` — because they are spaced by CSS margin or
flex gap rather than by a text node, so a word sitting flush against their markup
is correct. `orcid` is on that list because an ORCID icon immediately after an
author's name is the standard academic pattern; without it, every author on every
paper page is reported.

### 7. Third-party subresources are only the ones you chose

Only **subresources** count: the things a browser fetches without being asked,
which are also the things that see your readers' IP addresses. `<img>`, `<script>`,
`<iframe>`, `<source>`, `<video>`, `<audio>` with an absolute `src`, plus `<link>`
with a `rel` that actually causes a request — `stylesheet`, `preload`, `prefetch`,
`preconnect`, `icon`, `apple-touch-icon`, `manifest`, `modulepreload`.

`<link>` is treated separately because most of them fetch nothing: `rel="canonical"`
and `rel="alternate"` are metadata and routinely point at another origin on
purpose.

Links to other sites are the whole point of an academic page and are never counted.
The allowlist is `ALLOWED_THIRD_PARTY` in `src/consts.ts`, and it ships empty.

One implementation detail worth not undoing: the **body** of an inline `<script>`
is blanked before matching, but its opening tag is kept. Stripping whole `<script>`
elements — the obvious way to write it — also removes every
`<script src="https://…">`, which is the single highest-risk subresource there is.
The bodies still have to go, because a URL in a string literal is not a
subresource.

### 8. No email address is in the served bytes

Every `.html` and `.xml` file in `dist/` is scanned for anything address-shaped,
**twice**: raw, and with HTML entities decoded first.

That second pass is the point. `&#64;` and `&commat;` are both an `@` to a browser
and to a scraper, so an address "protected" by writing the symbol as an entity is
not protected at all — it is just invisible to a naive grep. That is the exact
failure mode of the hand-rolled obfuscation every academic theme ships, and
checking the raw bytes alone would have declared it safe.

`Email.astro` splits an address across two rot13'd data attributes and assembles it
on load, so none of this should ever match. The check exists because the way that
protection is lost is not by breaking the component — it is by somebody writing a
plain `mailto:` into a page, which looks completely normal in review. Without JS
the component renders "name (at) example (dot) org", which is readable,
unambiguous and still not harvestable.

`src/lib/contact.ts` runs an anchored version of the same pattern at build time, so
a row written as `value: me@example.org` fails with the row's label rather than
later, from a script that can only say "an address is in the bytes".

### 9. `robots.txt` names a sitemap that exists; it and the feed are sound

All three of `robots.txt`, the sitemap and the feed are generated, easy to break
without noticing, and consumed by machines that will not tell you they stopped
working. A feed reader's click is the one link on the site that is never checked by
a human.

**The sitemap is whichever file `robots.txt` names.** Not a probe for the
integration's filename, and not a preference between an index and a single
`sitemap.xml`. A crawler learns the sitemap's address from `robots.txt` and nowhere
else, so that link is the thing to assert: a sitemap under any name `robots.txt`
does not point at is a sitemap nothing will read, and a `robots.txt` pointing at a
file that was not emitted is a 404 handed to every crawler. Rename the sitemap
however you like, as long as `robots.txt` still names it.

The chain, in order: `robots.txt` must exist and carry at least one `Sitemap:`
line; that file must exist in `dist/` and start with an XML declaration; if it is a
`<sitemapindex>` every `<loc>` in it must be a file that exists and is itself a
sitemap; and every `<loc>` in every leaf is resolved by the strict shape rule. The
floor is one entry per page that carries a canonical — fewer means a route the
integration did not see, or a filter that ate one. (The 404 page has no canonical
and is rightly absent.)

The feed is checked only when `FEATURES.feed` is `true` in `src/features.ts`.
`feed.xml.ts` is on disk either way — turning the feature off does not remove
the endpoint, it makes the endpoint answer empty — so the file's presence says
nothing, and the flag is what the audit reads instead. A feed that _should_
exist and does not is still a failure. It must have at least one `<item>`, and
every `<link>` in it must name a file on disk — which is why `feed.xml.ts`
emits every item link absolute rather than letting `@astrojs/rss` re-shape a
relative one.

### 10. The files that make the host serve the site correctly

`dist/.nojekyll` must exist, always. Without it GitHub Pages runs Jekyll over the
output, and Jekyll ignores directories beginning with an underscore — which is
where Astro puts every hashed asset. The failure mode is a live site with no CSS.

`dist/CNAME` must exist whenever `public/CNAME` does. Only then: not everyone has
a custom domain. The deploy replaces the `gh-pages` branch wholesale, so a CNAME
that stops being emitted is a domain that stops resolving, and nothing else in the
build would notice.

Both are about the **host** rather than the HTML, which is why they read files in
`dist/` and `public/` instead of parsing a page. They are also the two cheapest
checks here and the two with the largest blast radius.

### 11. Weight

Not a check: it prints and asserts nothing.

```
bundle: 48.0 KB CSS across 3 file(s), 0.0 KB external JS; most inline JS on one page: 1.8 KB (/publications/index.html)
```

Astro inlines scripts below a size threshold, so counting `.js` files alone reports
zero while the pages do ship behaviour. This measures the inline bytes instead, and
reports the **heaviest page** rather than a total nobody downloads. JSON-LD blocks
are excluded — they are data, not behaviour.

## Adding your own

`audit-site.mjs` is the whole gate, so a new check goes there — a structural rule
about the HTML, or a promise about _your_ site: a URL you have committed to
keeping, a file that must be published, a count that must not drop. Check 10 is
the pattern for the second kind.

Whichever you pick, give it a floor. If your check works by looking for something
and counting what it found, say out loud how little is too little — otherwise the
day it stops finding anything is the day it starts reporting success.
