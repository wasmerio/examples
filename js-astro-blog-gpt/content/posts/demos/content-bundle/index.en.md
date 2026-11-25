---
title: 'Content organization: files, languages and assets'
slug: 'content-bundle'
date: 2026-09-28
description: 'Manage articles, pages, categories, tags and attachments with files and bundles.'
categories: ['guide']
tags: ['content', 'i18n']
image: '/images/covers/getting-started.webp'
---

Articles, standalone pages, categories and tags live in `content/`. Organize them in folders and use frontmatter for titles, addresses and other details.

## Four content types

| Directory             | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| `content/posts/`      | Articles                                        |
| `content/pages/`      | Standalone pages and builtin page introductions |
| `content/categories/` | Category names, descriptions, covers and bodies |
| `content/tags/`       | Tag names, descriptions, covers and bodies      |

Each type supports Markdown, MDX and nested folders.

## Files and addresses

Use `hello.md` or `hello.mdx` for a standalone file. For images and attachments, create a folder with `index.md` or `index.mdx` as the bundle entry.

`slug` determines the content address. For example, `slug: content-bundle` produces `/en/posts/content-bundle/` under the default language prefix policy. An explicit slug stays the same when you move management folders.

## Article details

```yaml
title: An example article
slug: example
date: 2026-01-01
description: Introduce the article in one sentence.
categories: [guide]
tags: [astro, content]
image: ./cover.webp
featured: true
```

`categories` and `tags` refer to category and tag slugs. `featured: true` places an article in the sidebar’s pinned section. Dates and publication states are covered in [Publishing and migration](../migration/).

## Images and attachments

Reference bundle images and files with relative paths:

![A soft blue and cyan gradient](./cover.webp)

Example attachments: [plain text](./resources/readme.txt), [Python code](./resources/example.py), [an HTML page](./example.html), [a Markdown attachment](./resources/notes.md) and [an archive](./resources/example.zip). They are published with the bundle during a build.

## Multilingual content

Use language-suffixed files such as `index.zh.mdx` and `index.en.md` in the same folder to provide translations of an entry. Standalone files support the same naming pattern, such as `hello.zh.md` and `hello.en.mdx`.

The language menu opens the corresponding content. See [Languages and translations](https://bloggpt.reincarnatey.net/en/content/languages) to configure and add more languages.

## Writing templates

```sh title="Terminal"
pnpm new post my-first-post --title "My first article"
pnpm new post a-bundle --use bundle --title "An article with attachments"
pnpm new page contact --use bundle
```

Choose a content type with `post`, `page`, `category` or `tag`, set the title with `--title`, and select a template with `--use`. Templates live in `archetypes/` and can be adapted to your writing workflow.
