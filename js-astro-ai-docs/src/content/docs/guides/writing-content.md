---
title: Writing content
description: Where pages live, how the sidebar is built, and what makes a page easy for Ask AI to use.
---

Pages are Markdown or MDX files under `src/content/docs/`. The file path is the URL: `src/content/docs/guides/deploy.md` becomes `/guides/deploy/`.

## Frontmatter

Every page needs a `title`. A `description` is used in the page's meta tags and in the search index, so write one sentence that says what the page answers.

```md
---
title: Deploy
description: Publish the site to GitHub Pages, Vercel or Netlify.
---
```

## Sidebar

The sidebar is defined in `astro.config.mjs`. Astro AI Docs lists the guides by hand and auto-generates the reference section from the folder:

```js
sidebar: [
	{ label: 'Guides', items: [{ label: 'Getting started', slug: 'guides/getting-started' }] },
	{ label: 'Reference', items: [{ autogenerate: { directory: 'reference' } }] },
],
```

## Writing for Ask AI

The answer quality depends on the page text, because that is all the model sees.

- Put the answer to a likely question near a heading that names it. Pagefind ranks pages by the words in the question, and headings weigh more.
- One topic per page. A 300-word page about deploying to Netlify beats a 3,000-word page about everything.
- State facts plainly: version numbers, commands, file paths. The model quotes them back.
- Keep an FAQ page for the questions that do not fit anywhere else; it tends to match many questions.
