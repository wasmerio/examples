<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Notion](https://github.com/yickminglee/astro-notion-theme) Astro theme by yickminglee, copied from commit `6e746af15a1af51a5998720fe5b8164bdfbf4522` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-notion.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [yickminglee](https://github.com/yickminglee), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# astro-notion-theme

An [Astro](https://astro.build) starter that looks like a Notion page.

Notion's typography, callouts, columns, toggles and block colours — as **static HTML with
no client-side JavaScript**. Fast, accessible, and readable by search engines and AI
crawlers on first request.

**[Use this template](https://github.com/yickminglee/astro-notion-theme/generate)** →
edit → deploy anywhere static.

MIT licensed. *Unofficial — not affiliated with or endorsed by Notion Labs, Inc.*

---

## Why

Notion's reading experience is hard to beat: generous line height, a warm near-black
instead of pure black, quiet colour, and blocks that never shout. But a Notion page is a
slow, JavaScript-heavy app that search engines struggle with.

This theme takes the look and drops the runtime. **No framework JS ships to the browser** —
the built pages contain no `<script>` tags at all.

---

## Quick start

```bash
npm create astro@latest -- --template yickminglee/astro-notion-theme
cd astro-notion-theme
npm install
npm run dev
```

Or click **Use this template** on GitHub.

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Preview the build |

`dist/` is plain static files — deploy to Netlify, Vercel, Cloudflare Pages, GitHub
Pages, Railway, or any web server.

Set `SITE_URL` before building so canonical URLs and `sitemap.xml` are correct:

```bash
SITE_URL=https://example.com npm run build
```

---

## What's in the box

The home page **is** the documentation — it renders every component and shows the source
for each. Start there, then delete it and write your own.

| Component | Notion equivalent |
| --- | --- |
| `<Callout>` | Callout block, 9 colours, optional icon |
| `<Columns>` / `<Column>` | Column layout, weighted with `ratio` |
| `<Toggle>` | Toggle list |
| `<Quote>` | Quote block, optional attribution |
| `<Button>` | Button block |
| `<Bookmark>` | Bookmark card |
| `<Checklist>` | To-do list |
| `<PageHeader>` | Cover image, page icon, title, description |

Plus `NotionPage.astro`, the layout that provides the page shell and `<head>` metadata.

### Example

```astro
---
import NotionPage from '../layouts/NotionPage.astro';
import Callout from '../components/Callout.astro';
import Columns from '../components/Columns.astro';
import Column from '../components/Column.astro';
---

<NotionPage title="Handbook" icon="📘" description="How we work.">
  <Callout icon="💡" color="blue">Start here.</Callout>

  <Columns>
    <Column ratio={2}><p>Wide column.</p></Column>
    <Column><p>Narrow column.</p></Column>
  </Columns>
</NotionPage>
```

### Markdown

Point a Markdown file at the layout and its prose is styled automatically — see
[`src/pages/example.md`](src/pages/example.md):

```markdown
---
layout: ../layouts/NotionPage.astro
title: Writing in Markdown
icon: 📝
width: default
---

Write normally. Headings, lists, tables, quotes and code blocks are all styled.
```

Add [`@astrojs/mdx`](https://docs.astro.build/en/guides/integrations-guide/mdx/) if you
want the components inside Markdown too.

---

## Making it yours

Every value is a CSS custom property at the top of
[`src/styles/notion.css`](src/styles/notion.css). Change the tokens and the whole site
follows — you should not need to edit a component to rebrand.

```css
:root {
  --nt-fg: rgb(55, 53, 47);   /* body text */
  --nt-bg: #ffffff;           /* page background */
  --nt-surface: rgb(247, 246, 243);
  --nt-blue: rgb(0, 117, 211); /* buttons, focus rings */

  --nt-radius: 10px;   /* callouts */
  --nt-gap: 46px;      /* column spacing */
  --nt-width: 900px;   /* page width */
  --nt-font: var(--nt-font-sans);
}
```

Notion's three page fonts are included: set `--nt-font` to `--nt-font-serif` or
`--nt-font-mono`, or add `class="nt-serif"` to a single page.

Pass `width="default"` to the layout for Notion's narrower 708px page instead of
full width.

### Dark mode

Follows the OS automatically via `prefers-color-scheme`, with every block colour
remapped rather than just inverted. Force one mode with `data-theme` on `<html>`:

```html
<html data-theme="dark">
```

---

## Accessibility

- Toggles are `<details>`/`<summary>`, so they work with no JavaScript and their
  contents remain in the HTML — readable by crawlers even when collapsed.
- Button text is white on `rgb(0, 117, 211)` = **4.68:1**, passing WCAG AA for normal
  text. Notion's lighter default blue is only 3.88:1, which fails.
- Links are underlined rather than distinguished by colour alone (WCAG 1.4.1).
- A skip link, visible focus rings, and `prefers-reduced-motion` support are included.

---

## Design values

Taken from Notion's own HTML export rather than eyeballed:

| | |
| --- | --- |
| Body text | `rgb(55, 53, 47)` |
| Line height | `1.5` |
| Headings | `600`, `-0.01em` letter-spacing, `1.2` line-height |
| Page title | `2.5rem`, `700` |
| Callout | `10px` radius, `1rem` padding |
| Column gap | `46px` |
| Quote | `3px` left rule |
| Block colours | 9 backgrounds + 9 text colours, light and dark |

---

## Related

Building a site whose content lives in Notion? See
**[notion-to-site](https://github.com/yickminglee/notion-to-site)** — it pulls pages and
databases through the Notion API and renders them with this same look, so the content
stays editable in Notion.

## Licence

MIT — use it for anything, commercial included. Attribution appreciated but not required.

Notion is a trademark of Notion Labs, Inc. This project is an independent tribute to
their design and is not affiliated with, endorsed by, or sponsored by Notion Labs, Inc.
