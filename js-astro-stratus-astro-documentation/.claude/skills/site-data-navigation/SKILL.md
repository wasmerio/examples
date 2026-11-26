---
name: site-data-navigation
description: Use when editing the site header, sidebar grouping, page tools, footer, or SEO defaults — header.json, sidebar.json, pageTools.json, footer.json, seo.json, announcementBar.json, breadcrumbs.json under src/data/ — or figuring out how those files reach the topbar, sidebar, footer and meta tags.
---

# Site data & navigation

Five JSON files under `src/data/` drive every page's chrome. They are plain data imported by layouts — not content collections — and CloudCannon edits them through its "Data" collection.

The one thing that is **not** in a data file is the documentation sidebar's contents: those come from page frontmatter. `sidebar.json` only orders the groups.

## When to use

- Changing the header: brand, version badge, search, theme toggle, top-level links.
- Ordering or collapsing sidebar groups.
- Adding a footer link or a social media link.
- Updating the site name, production URL, default description, or title template.
- Pointing the "Edit this page" link or the feedback endpoint somewhere else.

## When not to use

| Situation                                                          | Go instead to                                                                                          |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Adding a page to the sidebar                                       | [docs-content-authoring](../docs-content-authoring/SKILL.md) — it is `group` + `order` in frontmatter  |
| Changing how the header, sidebar, or footer _look_                 | [create-component](../create-component/SKILL.md) styling rules + [theming](../theming/SKILL.md) tokens |
| Composing a page-builder page, choosing which page sections to use | [page-content-authoring](../page-content-authoring/SKILL.md)                                           |
| Wiring new `data-prop` / editable bindings on a chrome component   | [editable-regions](../editable-regions/SKILL.md)                                                       |

## Data files overview

| File                            | Controls                                                    | Read by                                                                   |
| ------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------- |
| `src/data/header.json`          | Brand, version badge, search, theme toggle, top links       | `src/layouts/Docs.astro` → `DocsTopbar.astro`                             |
| `src/data/sidebar.json`         | The sidebar's lead link, group order and collapsed state    | `src/utils/docsNav.ts`                                                    |
| `src/data/pageTools.json`       | Edit link, Copy page menu, feedback block                   | `src/pages/[...slug].astro`; `src/utils/repository.ts`                    |
| `src/data/footer.json`          | Footer legal text, links, socials                           | `src/layouts/Docs.astro` → `Footer.astro`                                 |
| `src/data/seo.json`             | Site name/URL/description, default OG image, title template | `src/layouts/BaseLayout.astro` → `SeoHead.astro` + `StructuredData.astro` |
| `src/data/announcementBar.json` | The dismissible bar above the header                        | `src/layouts/Docs.astro` → `AnnouncementBar.astro`                        |
| `src/data/breadcrumbs.json`     | Label for the leading crumb                                 | `Breadcrumbs.astro`                                                       |

Editing the JSON file is what changes the rendered output — there is no other place these values come from.

---

## The header (`header.json`)

```json
{
  "logoSource": "/src/assets/images/logo/logo-light.svg",
  "logoAlternateSource": "/src/assets/images/logo/logo-dark.svg",
  "logoAlt": "Stratus",
  "showVersionNumber": true,
  "themeToggle": true,
  "search": true,
  "topbarLinks": [{ "name": "GitHub", "path": "https://github.com/CloudCannon/stratus" }]
}
```

- **Logo.** `logoSource` is the header logo; `logoAlternateSource` swaps it in dark mode, and `logoAlt` is its alt text. The files live in `src/assets/images/logo/`. There is no text fallback — an empty `logoSource` renders no brand. The favicons are set in `seo.json` (below); `siteicon.png` in the repo root is the CloudCannon Site Icon.
- **The version badge** is a label, not a switcher. Its text is the newest entry in `src/content/changelog/` (by `date`, via `getReleases()` in `src/utils/releases.ts`), not a value in `header.json`. `showVersionNumber: false` hides it, and so does an empty changelog.
- **`topbarLinks`** are flat — no dropdowns. They are hidden below 640px, so nothing essential should live only there.
- **`defaultTheme`** lives in `theme.json`, not here. It is `dark`, `light` or `system`. It is the scheme before a reader chooses one; `system` is the only value that consults the operating system. A reader's stored choice always wins. Hiding `themeToggle` doesn't change the resolution, only the control.

## Sidebar order (`sidebar.json`)

The sidebar's _contents_ are derived in `src/utils/docsNav.ts` from each page's `group` and `order` frontmatter. `navGroups` only decides the order the groups appear in, and whether a group renders collapsed.

**The coupling that nothing enforces:** a `navGroups` entry's `name` must match a page's `group` string exactly. A group named in frontmatter but missing from `navGroups` is appended after the listed ones rather than dropped — so a typo shows up as a group in the wrong place, not a missing one.

A page with no `group` still builds and is searchable; it just has no sidebar entry.

## The "Edit this page" link (`pageTools.json`)

`repositoryUrl` is the only URL to set. `src/utils/repository.ts` builds the link as `<repo>/edit/<branch>/<the page's file path>`, taking the branch from a `/tree/<branch>` suffix and defaulting to `main`:

```
"repositoryUrl": "https://github.com/acme/docs/tree/main"
```

Empty hides the link. `editPageLabel` sets the link's text.

The date beside it is the page file's last commit, read at build time by `src/utils/gitDates.mjs`. There is no frontmatter field for it. A shallow clone has no per-file history, so the date is omitted rather than wrong.

## Feedback

`feedback.action` is where the helpful vote is posted. The default (`/`) posts to the site itself, which CloudCannon Forms captures with no extra setup. See the `/feedback-and-forms/` documentation page for the payload and the alternatives.

## Footer (`footer.json`)

`links` is a flat array of `{ name, path }`. `socials` entries need an `icon` that is a `social/<name>` id with a matching SVG in `src/icons/social/`, and a full profile URL as `link`.

## SEO (`seo.json`)

Set `siteName`, `url` (must match `site` in `astro.config.mjs`), `description`, `titleFormat` (include `{title}`), and the favicons: `faviconSource` (SVG) and `faviconIcoSource` (ICO), paths under `public/` written from the site root (`/favicon.svg`). Their CloudCannon inputs upload into `public/`; an empty value drops that `<link>`. `npm run check:placeholders` warns while these hold the template's values.

---

## CloudCannon editing

- The `data` collection globs `src/data/**/*.json`, `disable_url: true`, `_enabled_editors: [data]`, grouped under "Data".
- Data files have no schema — each is a singleton, so there is nothing to create from a template. Per-file inputs and `comment:` text live under the root `file_config`, one `glob:` entry per file. Keep them there rather than in the collection's `_inputs`: keys like `homeLabel` mean different things in `sidebar.json` and `breadcrumbs.json`, and a collection-level input applies to every file.
- Array fields get their shape from **global structures matched by field name**, loaded by the root `_structures_from_glob`. `topbarLinks` and `footer.links` use `linkItems`, `socials` uses `socialItems` (both in `footerItems.cloudcannon.structures.yml`), and `navGroups` uses `docsNavGroups.cloudcannon.structures.yml`.
- Renaming a field in a data file means renaming it in the matching structure file too, or the editor shows the raw key.

## Editing site chrome on canvas

An editable region can bind **across files**: a `data-prop` beginning `@file[path]`, `@data[key]` or `@collections[key]` resolves against that source instead of the open page (`parseSource` in `@cloudcannon/editable-regions/nodes/editable.ts`). Both directions work — such a region reads back on change and writes through `set` / `add-array-item` / `move-array-item`.

**MUST:** use `@data[<key>]` for a `src/data` file, and declare the key under `data_config`. `@file[<path>]` goes through `CloudCannon.file()`, which does not answer to these paths — every region bound that way renders an error card instead.

A dataset resolves through `items()`, typed `File[] | File`. On the **array** branch the next path segment is consumed as an index, so `@data[header].searchPlaceholder` would look up `searchPlaceholder` on an array and error. In practice a single-file `data_config` entry resolves to one `File` and the plain path is right — but that is the shape to check first if a whole file's worth of regions errors at once.

So anything **stored in one file** is a plain region, not JavaScript:

| Chrome                      | Binding                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------- |
| Topbar links (the main nav) | `@data[header].topbarLinks` — an `array` region, so add/remove/reorder work on canvas |
| Footer text, links, socials | `@data[footer].footerText` / `.links` / `.socials`                                    |
| The Home crumb              | `@data[breadcrumbs].homeLabel`                                                        |
| The current crumb           | `title` on the open page — editing it renames the page                                |

**MUST:** pass the source in as a prop for a component that is _both_ site chrome and a page-builder block. `Footer.astro` and `AnnouncementBar.astro` take `editableSource`, which `Docs.astro` sets to `@data[footer]` / `@data[announcementBar]`; placed in a page builder the prop is absent and the bindings fall back to the page's own frontmatter. Hardcoding either one breaks the other use.

## What regions still cannot reach

`getDocsNav()` _derives_ the sidebar tree and the crumb trail by joining the whole `docs` collection with `sidebar.json`. No single path holds "where this page sits", so there is nothing to bind. `src/components/utils/siteChrome.ts` patches those through the JavaScript API instead, registered in `editor-live-sync.js`:

| Edit                | What moves                                                                      |
| ------------------- | ------------------------------------------------------------------------------- |
| A page's `group`    | Its sidebar entry between groups (creating or pruning one), and the group crumb |
| A page's `order`    | Its position among its siblings                                                 |
| A page's `title`    | Its sidebar link (the crumb is a region)                                        |
| `sidebar.homeLabel` | The sidebar's lead link                                                         |
| `sidebar.navGroups` | Group order and collapsed state                                                 |

**MUST:** derive the nav through `buildDocsNav` in `src/utils/docsNavModel.ts`. It is the whole shape — nesting, group inheritance, ordering — with no idea how the pages were loaded. `docsNav.ts` feeds it from `getCollection("docs")` at build time; `siteChrome.ts` feeds it from `CloudCannon.collection("documentation")` in the editor, where the answer includes edits that have not been built yet. A second copy puts a page in one place on canvas and another after the rebuild.

**MUST:** re-derive from the **collection**, not from `currentFile()`. An edit to page A's `group` has to survive navigating to page B — and B is served exactly as it was built, with A's edit nowhere in it. Reading only the open file makes every cross-page change vanish on navigation.

**MUST NOT:** re-derive group _membership_ or page nesting client-side. Both need every doc's frontmatter, not the open file's — reimplementing `getDocsNav()` against the API gives the sidebar a second ordering that nothing keeps in sync.

**MUST NOT:** put a text region on a sidebar group label. It would write `navGroups[i].name`, but membership comes from each page's `group` frontmatter — so the rename shows as taking on canvas and the rebuild undoes it, orphaning the old name into the alphabetical tail. Group names are renamed in the data panel, and every page in the group re-tagged.

## Switches

A boolean has no region type — `text`, `image`, `array`, `array-item`, `component` and `source` are the whole list — but the JavaScript API shows and hides them fine. The catch is build-time gating: `{showCopyPage && <CopyPage/>}` leaves the editor **no element to reveal** when the switch goes back on.

**MUST:** read a page switch as **on when absent**. `file.data.get()` returns raw frontmatter, not the Zod-parsed entry the build sees, and `content.config.ts` defaults `showTableOfContents` / `showFeedback` / `showCopyPage` / `showPager` to `true`. Only one shipped page writes them out, so treating absent as "off" hides the control on nearly every page. Site switches in `header.json` and `pageTools.json` are the opposite — absent is off, matching the `.astro` destructure defaults the build uses.

**MUST:** wait for a handle before applying the switch it feeds. An unread handle and a switched-off control are indistinguishable, so a control gated by both a page and a site switch must not be written until both have answered.

**MUST:** render an editor-switchable control always, and mark it `data-toggle-hidden` when off (`src/styles/base/_html-elements.css` hides it with `display: none !important`). Never gate it out of the markup. `siteChrome.ts` then flips the attribute live. This covers `showCopyPage`, `showFeedback`, `showPager`, `showTableOfContents`, `header.search` / `themeToggle`, `pageTools.copyPage.enabled` / `feedback.enabled`, and `announcementBar.enabled`.

**MUST NOT:** put `data-toggle-hidden` on the root of a component that has CloudCannon YAML. It is prop-driven, and `lint:roots` fails it — CloudCannon's re-render keeps a region root and swaps its contents, so the attribute goes stale. Put it on a direct child and hoist it back with `:has()`, the way `AnnouncementBar.astro` hides the whole bar from a marker on its `<p>`.

**MUST NOT:** use `hidden` for this. Several components already use `hidden` as their own JS-reveal mechanism (`CopyPage` ships hidden and `setup.ts` reveals it), so a switch riding the same attribute fights them.

A control gated by both a page switch and a site switch is the AND of the two, so both handles feed one pass in `applyToggles()`. Anything whose layout depends on a control being present — the table of contents holds a grid column — needs the dependent rule keyed off the same attribute (`.docs-toc-rail:has(> .toc:not([data-toggle-hidden]))`), not off `:empty`.

The sidebar markup carries `data-group`, `data-href` and `data-order` purely so the patcher can find and place things.

## Verify your work

- `npm run check` — exit 0, no drift. `lint:schema` validates `file_config` against CloudCannon's own schema.
- `npm run dev`: confirm the header, sidebar order and footer reflect the change.
- If you edited `seo.json`, view source and confirm `<title>`, `og:*` and the `application/ld+json` script.
- In CloudCannon, open Data → Docs Site and confirm every field renders with a label. An unlabeled raw JSON field usually means a structure file's key no longer matches the data field name.
- In the Visual Editor, change a page's **Group** and confirm the sidebar entry and the group crumb move without a reload. Nothing moving means `siteChrome.ts` did not resolve its handle — check the console for its warning.
