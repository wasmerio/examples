---
title: Hello world
description: A first post that doubles as the authoring guide for this site. Replace it with your own writing.
published: 2025-03-04
tags: [meta, writing]
projects: [notegrep]
cover: /images/demo/blog/hello-world.jpg
---

This is the starter post. It shows what a post can do, and the source of this file is the reference. When you write your own first post, delete this one (or keep it as a draft with `draft: true`).

## Create a post

```sh
pnpm new:post "My first post" --description "One sentence about it." --tags notes --publish
```

That creates `content/posts/my-first-post.md`. The file name is the URL: `/blog/my-first-post`. Without `--publish` the post is a hidden draft, so you can write in peace and publish later.

## Frontmatter

Every post starts with a block between `---` lines:

- `title`, `description` and `published` are required. The description is used on cards, in search results and in feeds.
- `published` can be a date (`2026-11-10`) or a date with a time (`2026-11-10T14:30`). Posts are listed newest first, and the time orders posts from the same day.
- `tags` become topic pages and filter chips.
- `projects` lists project names from `content/github-projects.ts`; the post then shows them as "where I use this" cards.
- `cover` is optional: a finished 1200x630 JPEG under `content/public/`, with the title already on it.
- `aliases` lists former slugs. If you rename a post, put the old name here and the old link redirects.
- `draft: true` hides the post everywhere.

## Callouts

> [!TIP] Callouts
> GitHub alert syntax works: NOTE, TIP, IMPORTANT, WARNING, CAUTION and TLDR. Add a title after the type, as in this one.

## Code

Fenced code is syntax highlighted:

```ts title="greet.ts"
export const greet = (name: string) => `Hello, ${name}!`;
```

A `prompt` block is a prompt readers can copy or open in Claude or ChatGPT:

```prompt title="Try it with your agent"
Explain what a callout is and when to use one in a blog post.
```

When readers need the same thing in different flavours, group the fences into tabs. Each label goes in brackets after the language:

::: code-group

```sh [npm]
npm install zod
```

```sh [pnpm]
pnpm add zod
```

```sh [bun]
bun add zod
```

:::

Feeds show every block under its label, and the Markdown copy keeps this source. See the [rehype-code-group docs](https://www.npmjs.com/package/rehype-code-group) for rich tabs, vertical tabs and syncing.

## Figures

A figure is a small Astro component whose script plays it while it is on screen. This one is registered in `content/figures/index.ts`:

::figure example

To add your own, create a component next to `ExampleFigure.astro`, register it in that index with a caption and a text description, and put `::figure your-id` on a line of its own. Feeds and the Markdown copy use the caption and description instead of the component.

## Images

![Bar chart of pages per week falling from 31 to 9](/images/demo/blog/pages-per-week.webp "A titled image becomes a captioned figure")

Put image files in `content/public/images/` and reference them with a path starting with `/images/`.

## Before you publish

Run `pnpm check-content`. It tells you what is missing or still a starter value.
