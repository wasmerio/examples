---
name: docs-content-authoring
description: Use when writing or editing a documentation page — frontmatter, sidebar placement, callouts, code blocks and tabs, annotated code, tables, definition lists, diagrams, figures, API parameter lists, or changelog releases. Start here for "add a docs page" or "how do I put X in a docs page".
---

# Writing a documentation page

A documentation page is one `.mdx` file under `src/content/docs/`. Its file path is its URL, its frontmatter places it in the sidebar, and its body is Markdown plus a small set of components exposed to MDX.

## When to use

- Adding or editing a page under `src/content/docs/`.
- Putting a callout, code sample, diagram, figure or parameter list into prose.
- Adding a release to the changelog.
- Working out why a page isn't in the sidebar.

## When not to use

| Situation                                                  | Go instead to                                                |
| ---------------------------------------------------------- | ------------------------------------------------------------ |
| Building the overview / a landing page from page sections  | [page-content-authoring](../page-content-authoring/SKILL.md) |
| Ordering sidebar groups, header, footer, SEO               | [site-data-navigation](../site-data-navigation/SKILL.md)     |
| Adding a new component to the library                      | [create-component](../create-component/SKILL.md)             |
| A page renders blank, or a component is missing in the CMS | [debug-cloudcannon](../debug-cloudcannon/SKILL.md)           |

## The file

```
src/content/docs/installation.mdx             →  /installation/
src/content/docs/theming.mdx                  →  /theming/
src/content/docs/theming/token-reference.mdx  →  /theming/token-reference/
```

The path is the URL, and it is also what **nests** a page: `theming/token-reference.mdx` is a
child of `theming.mdx` in the sidebar because that page exists. A child inherits its parent's
`group`, so the two levels can't disagree — and moving the file is the only thing that changes
the nesting.

A folder with no page at its own path nests nothing; its pages are grouped by `group` like any
other. Two levels is the practical limit for a sidebar — past that a reader can't see where
they are — so `docsNav.ts` builds two and no more.

## Frontmatter

Validated by `docSchema` in `src/content.config.ts`; an unknown key is a build error.

| Key                   | Type     | Default | Effect                                                                      |
| --------------------- | -------- | ------- | --------------------------------------------------------------------------- |
| `title`               | string   | —       | Required. Page heading, browser title, sidebar label, search result.        |
| `description`         | string   | —       | The lede under the title, and the meta description.                         |
| `group`               | string   | —       | Sidebar group. **No group means no sidebar entry** — the page still builds. |
| `order`               | number   | `0`     | Position within the group. Ties break alphabetically by title.              |
| `keywords`            | string[] | —       | Meta keywords.                                                              |
| `image`               | string   | —       | Social share image.                                                         |
| `noindex`             | boolean  | `false` | Keeps the page out of search engines and the site's own search.             |
| `showTableOfContents` | boolean  | `true`  | The on-this-page rail, built from the page's `h2`/`h3`.                     |
| `showFeedback`        | boolean  | `true`  | The helpful vote at the foot of the page.                                   |
| `showCopyPage`        | boolean  | `true`  | The Copy page menu beside the title.                                        |
| `showPager`           | boolean  | `true`  | Previous/next links across the sidebar's reading order.                     |

`group` must match a `navGroups` entry in `src/data/sidebar.json` to be ordered deliberately; an unlisted group is appended rather than dropped.

There is no `updated` key. The date in the meta line is the file's last commit, read at build time by `src/utils/gitDates.mjs`, so an edit dates itself.

## Body: plain Markdown

Headings, lists, tables, blockquotes, links and inline code all work and are styled by `src/styles/base/_prose.css`. That file owns the page rhythm, and it is three numbers: **8px** under a heading, **24px** around a block (callout, code, diagram, table, figure, parameter list), **44px** before the next heading. Nothing in content should need to adjust it — if a page looks wrong, the rule is wrong. Use `h2` for sections and `h3` beneath — those are what the on-this-page rail lists, and each gets a copyable `#` anchor on hover.

Link internally by URL: `[Configuration](/configuration/)`. `npm run lint:links` (part of `npm run check`) fails on an internal link that resolves to no page, so a renamed page can't quietly rot. It also warns on an orphan page — one no other page links to, which for a page with no `group` means only search reaches it.

Footnotes are GFM: `text.[^1]` in the sentence, `[^1]: note` on its own line anywhere in the file. **The id must be a number** — the Content Editor's footnote snippets only match `[^1]`, and on save it escapes a word id (`[^order]`) to `\[^order\]`, which then renders as literal text. They render numbered in marker order at the foot of the page, and the Content Editor round-trips them through the `python_markdown_footnote` snippet imports in `cloudcannon.config.yml`. The generated "Footnotes" heading is kept out of the on-this-page rail by the filter in `src/pages/[...slug].astro`.

### No code fences

Code goes in a `CodeBlock`, never a bare Markdown fence. The fence inside a code component or `Diagram` (below) is the exception: it belongs to that component's snippet, not to the rich text. The fence pipeline still exists — `fenceMetaTransformer` in `src/utils/markdown.mjs` reads `title=` and `{2,5-7}` off the meta string — but nothing in `src/content/` uses it, and the Content Editor's code-block control is off (`code_block: false`), because a fence cannot survive CloudCannon:

- Its `title=` and `{2,5-7}` meta have nowhere to live; the editor models a language and nothing else.
- CloudCannon draws it with its own chrome, so the same sample looks like two different components either side of a save.
- A fence holding a fence — four backticks around three, the only way to document fence syntax — breaks the parse for **the rest of the file**, and every component below it renders as plain text. `code_block_fences` is three backticks and there is no second level.

## Body: components

These are available in any `.mdx` page with no import, and each has a CloudCannon snippet so an editor can insert it from the Content Editor's `+` menu. The component name is the key in `src/components/utils/mdxComponents.ts` — renaming a component's file renames the tag.

| Tag               | For                                                                   | Key props                                                                |
| ----------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `Alert`           | A callout: note, tip, warning, danger                                 | `variant`, `title`, `text` (markdown)                                    |
| `CodeBlock`       | One code sample, in a fence between the tags                          | the fence, `language`, `filename`, `highlight`, `showCopy`               |
| `CodeTabs`        | One sample in several languages, choice remembered site-wide          | `<CodeTab label language highlight>` children, `filename`, `showCopy`    |
| `CodeAnnotations` | Code with numbered notes underneath                                   | the fence, `language`, `filename`, `notes[]` of `{ line, text }`         |
| `CodeDiff`        | A sample with changed lines marked, still highlighted in its language | the fence, `language`, `filename`, `added`, `removed`, `highlight`       |
| `FileTree`        | A directory tree drawn from an indented list of paths                 | the fence (the paths), `title`, `added`, `removed`, `highlight`          |
| `ParamList`       | API reference entries where descriptions run long                     | `params[]` of `{ name, type, required, defaultValue, description }`      |
| `DefinitionList`  | Glossaries and field terminology                                      | `items[]` of `{ title, text }`, `layout` (`stacked`/`grid`)              |
| `Diagram`         | A Mermaid diagram                                                     | the fence (the definition), `caption`                                    |
| `Figure`          | A captioned screenshot with a dark variant and click-to-zoom          | `source`, `alternateSource`, `alt`, `caption`, `zoom`                    |
| `Changelog`       | Every release in the changelog collection, newest first               | `limit`                                                                  |
| `Accordion`       | Optional depth in a disclosure                                        | `items[]` of `{ title, contentSections[] }`                              |
| `ContentSelector` | Tabs whose panels hold prose and other components                     | `<ContentSelectorPanel title>` children, `navigationPosition`, `variant` |
| `Form`            | Any form. Posts to the site by default, which CloudCannon captures    | `action`, `formBlocks[]`                                                 |
| `Video`           | A YouTube or Vimeo embed, or a local file                             | `type`, `videoId` (embeds), `source` (local), `title`                    |
| `Embed`           | Raw HTML in a fixed aspect ratio — a sandbox, a map, another service  | children (the HTML), `aspectRatio`                                       |
| `Badge`           | A status pill: Beta, Deprecated, a version marker                     | `text`, `variant`, `iconName`, `showDot`, `link`                         |
| `Steps`           | A numbered walkthrough                                                | `items[]` of `{ contentSections[] }`, `orientation`                      |
| `FaqSection`      | Questions and answers in an accordion                                 | `items[]` of `{ title, contentSections[] }`, `heading`                   |

`FaqSection` is a page section: write its heading as a Markdown `##` (which the on-this-page rail reads) and pass `heading=""` so it isn't printed twice. Pass only the props a component's snippet declares — the Content Editor can't parse a snippet with an extra one. `/installation/` does this.

Every building block in the library can be used the same way — the table lists the ones a documentation page usually reaches for. The full catalog is in [page-content-authoring/component-catalog.md](../page-content-authoring/component-catalog.md).

### Writing a component into prose

```mdx
<Alert
  variant="warning"
  title="Rotating a key revokes the old one"
  text="Existing clients fail on the next request. Deploy the new key before rotating."
/>
```

**MDX quoting bites here.** A prop value in double quotes cannot contain a double quote — the parser reads it as the end of the attribute and then fails on the next character. Avoid quoted words inside prop text.

**Multi-line text goes in a fence between the tags** — `CodeBlock`, `CodeDiff` and `CodeAnnotations` (`code`), `FileTree` (`paths`), `Diagram` (`definition`) and each `CodeTab`; never the prop. CloudCannon saves a multi-line string prop with raw newlines, which breaks the MDX build, so the code lives in a fence and `src/utils/codeFencePlugin.mjs` turns it back into the prop. Put `language` on the tag, leave the fence bare, and use a longer fence when the sample itself contains three backticks.

````mdx
<CodeBlock language="js" filename="astro.config.mjs">

```
export default {
  search: { provider: 'local' },
}
```

</CodeBlock>
````

`CodeTabs` takes one `<CodeTab>` per language, each holding its own fence:

````mdx
<CodeTabs>
<CodeTab label="npm" language="bash">

```
npm install stratus
```

</CodeTab>
<CodeTab label="pnpm" language="bash">

```
pnpm add stratus
```

</CodeTab>
</CodeTabs>
````

**Array and object props take unquoted keys** — `params={[{ name: "x", type: "string" }]}`, not `"name":`. CloudCannon keeps the quotes as part of the field name, so the item's `_inputs` never match: every field falls back to plain text.

**Never an `export const`, and never a bare `{identifier}`.** CloudCannon has no expression to evaluate: the export renders as plain text in the Content Editor, and the component whose prop reads it fails to parse as a snippet, so it renders as plain text too. The value has to sit in the attribute.

## Changelog releases

This collection is the project's **only** changelog — there is no root
`CHANGELOG.md`. A release is not written into `changelog.mdx` either: each one is
its own file in `src/content/changelog/`, and `<Changelog />` on the page renders
the whole collection, newest `date` first:

```yaml
# src/content/changelog/2.5.0.md
---
version: 2.5.0
date: 2026-09-10
changes:
  - tag: Added
    text: What shipped, in one line. Markdown works here.
  - tag: Breaking
    text: '`oldThing` is replaced by `newThing`.'
---
```

`tag` comes from the `changelogChanges` structure — Added, Changed, Deprecated,
Removed, Fixed, Security, Breaking. Breaking and Added are color-coded; the
rest render neutral. The file has no body and no URL of its own; the version is
an anchor on the changelog page.

`<Changelog limit={3} />` renders only the most recent three, for a release-notes
teaser on another page.

**MUST NOT:** add a file for work that has not been released, or keep a running
"unreleased" entry. Everything in the collection is published on `/changelog/`,
so a placeholder version shows readers a release that does not exist. Describe
day-to-day changes in the commit message and the pull request; write the file
when the version is actually cut. Full rule: [`.agents/rules/changelog.md`](../../rules/changelog.md).

## Choosing a code component

| You have                             | Use               |
| ------------------------------------ | ----------------- |
| One sample                           | `CodeBlock`       |
| The same sample in several languages | `CodeTabs`        |
| Lines that need explaining           | `CodeAnnotations` |
| Before/after of the same file        | `CodeDiff`        |
| A directory layout                   | `FileTree`        |

All five hold their code in a fence between the tags, which their snippet exposes as a code field, so an editor can change it and the sample renders identically in Git, in the Content Editor and in the Visual Editor.

### Marked lines are always named by number

Every one of them names a line the same way — `highlight="2"`, `added="3,7-9"`, `removed="1-2"`, or `CodeAnnotations`' `notes[].line`. Nothing is marked by a character inside the code, so the fence is always the literal sample: copy-pasteable, and free of the collision where a YAML list item or a leading unary minus reads as a marker.

The cost is that line numbers don't move when the sample does. After adding or removing a line, re-check the ranges — nothing validates them, and an out-of-range number marks nothing rather than failing.

## Diagrams

`Diagram` renders Mermaid in the browser: the source ships in the page inside a `<pre>` and the SVG replaces it once the library loads, which happens only on pages that contain one. Consequences worth knowing:

- With JavaScript off, and in a printout, the reader gets the source rather than an empty box.
- The source is what the search index holds, not the rendered labels.
- A diagram that won't parse leaves the source visible instead of failing the build.

## Verify your work

- `npm run dev` and read the page. Check the sidebar entry, the on-this-page rail, and prev/next.
- `npm run check` — `lint:links` catches a dead internal link, `lint:cms` catches snippet drift.
- In CloudCannon's Content Editor, confirm each component you used appears in the `+` menu and round-trips: insert it, save, and check the MDX still parses.
