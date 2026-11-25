# Customization Guide

Use this guide when adapting Monograph for a real blog.

## Site Settings

Edit [src/config/site.ts](./src/config/site.ts) first. It holds the wordmark, default metadata,
canonical domain, language and date locale, the sidebar about blurb, social links, and the
newsletter and contact form settings.

Set `siteConfig.siteUrl` before building for production. Canonical URLs, social image URLs, RSS,
`robots.txt`, the sitemap, and JSON-LD all derive from it.

The header shows `siteConfig.name` as plain text. There is no logo slot by design — if you want an
image mark, replace the `.wordmark` anchor in
[src/components/SiteHeader.astro](./src/components/SiteHeader.astro) and the matching one in
[src/components/SiteFooter.astro](./src/components/SiteFooter.astro).

## Navigation

Two arrays in the same config file drive every menu:

```ts
export const navigation = [
  { label: "Archive", href: "/posts/" },
  { label: "Categories", href: "/categories/" },
  { label: "About", href: "/about/" },
];

export const footerNavigation = [
  { label: "Contact", href: "/contact/" },
  { label: "Privacy", href: "/privacy/" },
  { label: "RSS", href: "/rss.xml" },
];
```

`navigation` renders in the desktop header and the mobile menu; `footerNavigation` renders under the
social icons in the footer. The current page is marked with `aria-current="page"` automatically, which
also leaves its hairline underline in place. Add a category link here to promote one to the top level,
for example `{ label: "Engineering", href: "/category/engineering/" }`.

## Categories

Categories are the only taxonomy, and every post belongs to exactly one. The list lives in
[src/config/categories.ts](./src/config/categories.ts):

```ts
export const categories = [
  "Engineering",
  "Reliability",
  "Cloud",
  "Security",
  "AI",
  "Design Systems",
] as const;
```

Keep it short — six is the practical ceiling before the sidebar stops reading as a menu. To change
the set, edit that array, update the matching `categoryDescriptions` entry, and change the `category`
value in any affected post. The category is a typed enum, so a mismatch fails the build rather than
shipping a broken archive.

From there the theme handles the rest:

- `/categories/` lists every category with its description and post count, in configured order.
- `/category/<slug>/` is generated for each category that has at least one post.
- The home sidebar lists the same categories with counts.
- The post byline reads "By Author in Category", linking to both.

Slugs are derived from the name (`"Design Systems"` becomes `design-systems`).

## Authors

Authors come from post frontmatter — there is no separate author file. Each post carries a `name` and
a short `role`, and the theme groups posts by name to build `/author/` and `/author/<name>/`. Keep the
`role` string identical across a given author's posts, since the listing uses the value it last saw.
The demo content ships with three authors.

## Featured Posts

Set `featured: true` in a post's frontmatter to list it in the home sidebar's "Featured" section.
The sidebar shows up to four, newest first, and skips the post already shown as the latest.

## Feature Images

Covers are optional and intentionally never appear in a feed — that text-only list is the point of
the layout. When a post has a `cover`, it renders full-width above the article body, capped at
`32rem` tall so an unusually tall image cannot push the first paragraph off screen. Credits are
optional but recommended: `creditName` alone renders as plain text, and adding `creditUrl` turns it
into a link.

Images live next to the post's Markdown file and are optimized by Astro at build time. Still keep
source files reasonably sized.

## Read Time

Read time is computed from the post body at 220 words per minute in
[src/lib/posts.ts](./src/lib/posts.ts) — there is no frontmatter field. Change `readingMinutes` there
if your readers move at a different pace.

## Newsletter and Contact Forms

Both forms are provider-neutral and share the same three states:

| `enabled` | `action`               | Behavior                                                                                   |
| --------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `true`    | endpoint URL           | Submits to your provider                                                                   |
| `true`    | `""` (shipped default) | Fully interactive demo; a script confirms the submit, clears the fields, and sends nothing |
| `false`   | anything               | Every control is disabled with an explanatory note                                         |

Configure them in `siteConfig.newsletter` and `siteConfig.contact`:

```ts
newsletter: {
  enabled: true,
  action: "https://example.com/newsletter",
  method: "post",
  emailFieldName: "email",
  title: "Get new posts by email",
  description: "One email when something new goes up. No spam, unsubscribe anytime.",
}
```

## Search

Monograph ships static, client-side search — no database and no hosted search service.

The header button in [src/components/SiteHeader.astro](./src/components/SiteHeader.astro) opens a
command palette, and [src/pages/search.astro](./src/pages/search.astro) serves the full
`/search/?q=...` results page.

At build time [src/pages/search-index.json.ts](./src/pages/search-index.json.ts) generates
`/search-index.json` from every published post. The index holds the title, excerpt, category, author,
date, read time, and URL — never the article body. The palette fetches it the first time a query is
typed, so pages nobody searches from pay nothing for the feature. Results are ranked in tiers: titles
starting with the query, then titles containing it, then category matches, then excerpt and author
matches, capped at seven. The full page renders every match.

Neither surface lists anything before the first keystroke — the palette collapses to just its input,
and the search page shows only its field. Browsing belongs to the archive and the category pages.

Open search from the header button, with `Ctrl + K` (Windows and Linux) or `⌘ + K` (macOS), or with
`/` while focus is outside a form control. Arrow keys move through results, `Enter` opens the
focused result, and `Escape` closes the palette. Each page also inlines its twelve most recent posts
as a fallback, so the palette still returns results if the index request fails.

This scales comfortably to a few hundred posts and stays usable around a thousand. For a larger
archive, paginate or cap the full search page, since a broad query renders every match at once. For
several thousand pages, full-body search, or multilingual search, swap the index for
[Pagefind](https://pagefind.app/), which indexes the generated `dist` HTML after `astro build`. It
is intentionally not a default dependency.

Because the index is generated statically, new and edited posts become searchable after the next
build.

## Light and Dark Mode

The header control is a real switch — a `<button role="switch">` whose knob slides between the two
ends and carries the icon for the current mode. The inline script in
[src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro) applies the mode before first paint, so
there is no flash, and keeps `aria-checked` and the button's label in sync. It follows the system
preference until the reader flips the switch, then stores the choice in `localStorage` under
`monograph-theme` and stops following the system.

To ship a fixed default instead, change the `data-theme` attribute on `<html>` in the same file and
remove the switch from the header. Any element can respond to the mode with
`:root[data-theme="dark"] .your-class { ... }`.

## Motion and Hover States

Every transition draws on three tokens so hovers feel like one system rather than a pile of one-offs:

```css
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
--duration-fast: 0.18s;
--duration: 0.28s;
```

The reusable hover classes are:

| Class                                             | Effect                                                              | Used by                                                          |
| ------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `.link-title` + `.link-title__text`               | The heading picks up the accent while the excerpt and meta stay put | Feed entries, sidebar rows, category and author lists, prev/next |
| `.link-sweep`                                     | Underline wipes in from the left                                    | Post byline links                                                |
| `.nav-link`                                       | Hairline wipes in underneath; stays for the current page            | Header and footer navigation, pagination                         |
| `.link-nudge` + `.link-nudge__arrow`              | Arrow leans toward its destination                                  | Pagination, prev/next                                            |
| `.icon-btn`, `.pill`, `.share-btn`, `.social-btn` | Accent tint, and a 2px lift on the round buttons                    | Header controls, category pills, share and social rows           |

Nothing fades out on hover — a hovered item gains emphasis rather than the page losing it. All of it
collapses to near-instant under `prefers-reduced-motion: reduce`.

The header uses the same easing: it sticks to the top, hides itself once you scroll down past a small
threshold, and slides back in as soon as you scroll up. It never hides while something inside it has
focus. Adjust or remove the behavior in the scroll handler in
[src/components/SiteHeader.astro](./src/components/SiteHeader.astro).

## MDX and Content Components

Posts can be `.md` or `.mdx`; the loader in [src/content.config.ts](./src/content.config.ts) picks
up both, and nothing else about a post changes.

Two components are available in every post without an import, wired through the `components` prop
passed to `<Content />` in [src/pages/post/\[slug\].astro](./src/pages/post/[slug].astro):

- `<Callout type="note" | "tip" | "warning" | "danger" title="Optional label">` — see
  [src/components/mdx/Callout.astro](./src/components/mdx/Callout.astro).
- `<CodeGroup>` with `<CodeGroupItem label="npm">` children — tabbed code samples for showing the
  same step across variants. See [src/components/mdx/CodeGroup.astro](./src/components/mdx/CodeGroup.astro)
  and [CodeGroupItem.astro](./src/components/mdx/CodeGroupItem.astro). Fenced code blocks inside
  `<CodeGroupItem>` need a blank line before and after, since MDX only parses Markdown inside JSX
  when it is separated by blank lines.

[src/content/posts/writing-richer-tutorials-with-mdx-components](./src/content/posts/writing-richer-tutorials-with-mdx-components/index.mdx)
demonstrates both. To add your own, build it in `src/components/mdx`, import it in `[slug].astro`,
and add it to the `mdxComponents` object there.

## Theme Tokens

Colors, typography, layout widths, spacing, radii, and motion live in one block at the top of
[src/styles/global.css](./src/styles/global.css). Editing those custom properties is usually enough
to restyle the whole theme:

| Token                                           | Controls                                |
| ----------------------------------------------- | --------------------------------------- |
| `--accent` / `--accent-strong`                  | Links, dates, hover states, focus rings |
| `--accent-foreground`                           | Text on an accent-filled surface        |
| `--foreground` / `--muted-foreground`           | Body text and secondary text            |
| `--background` / `--card` / `--muted`           | Page, panel, and code surfaces          |
| `--border` / `--border-strong`                  | Hairlines, buttons, pills               |
| `--layout-wide` / `--layout-content`            | Page width and reading column width     |
| `--gutter`                                      | Shared page side padding                |
| `--space-section`                               | Vertical rhythm between major sections  |
| `--ease-out` / `--duration` / `--duration-fast` | Every hover and header transition       |

The dark palette overrides the same names under `:root[data-theme="dark"]`. Note that
`--accent-foreground` flips to a near-black in dark mode, because the dark accent is a light blue —
keep that relationship if you swap the accent hue.

A small `@theme inline` block above the palette is what turns tokens into Tailwind utilities such as
`text-accent`, `border-border`, and `bg-muted`. It maps only the six tokens the theme itself uses in
markup; add a line there when you want another token available as a utility.

### Cascade layers

Theme classes (`.outer`, `.feed`, `.prose`, `.btn`, and so on) are declared inside
`@layer components`, and base element rules inside `@layer base`. That ordering matters: it lets a
Tailwind utility in markup override a theme class — `class="icon-btn md:hidden"` really hides the
button — and lets a component's scoped styles override both. If you add a theme class, add it inside
`@layer components` for the same behavior.

## Reading Column

Articles and the static pages use `.canvas` (`--layout-content`, 45rem) inside `.outer`, while the
header, footer, home grid, and feature images use `.inner` (`--layout-wide`, 75rem). Widen the
reading column by changing `--layout-content` rather than editing individual pages.

## Fonts

Monograph self-hosts [Geist](https://vercel.com/font) (variable weight, OFL) from
`public/fonts/geist`, with Geist Mono for code. No font is fetched from a third party.

For an editorial serif look, point the display font at the bundled system-serif stack:

```css
--font-display: var(--font-serif);
```

That switches the wordmark, post titles, and article headings to a serif while body copy and UI stay
sans. To use a specific typeface instead, drop the `woff2` files in `public/fonts`, replace the
`@font-face` rules at the top of [src/styles/global.css](./src/styles/global.css), and update the
`--font-sans`, `--font-display`, or `--font-serif` tokens. Update the preload in
[src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro) too, and keep the bundled font
license file if you keep the font.

## Icons

Social and share icons are local SVGs in [src/icons/bootstrap](./src/icons/bootstrap), rendered
through [src/components/LocalIcon.astro](./src/components/LocalIcon.astro). To add a network, drop
its SVG in that folder, register it in `LocalIcon.astro`, and map the label in
`socialIconByLabel` in [src/components/SiteFooter.astro](./src/components/SiteFooter.astro). The
bundled icons come from Bootstrap Icons and keep their MIT license notice in the icon folder.

## Pages

Starter pages live in [src/pages](./src/pages): `about.astro`, `contact.astro`, and `privacy.astro`.
Replace their copy before going live — the privacy text in particular is a starting point, not legal
advice. They use `.prose` inside `.canvas`, so new pages can copy either as a template.

## Demo Content

The fourteen demo posts and their Unsplash covers are placeholders. Delete
`src/content/posts/*` and add your own before launching; the build fails loudly if any frontmatter
stops matching the schema.
