# Adding content

Where the data for posts, projects and photos lives:

- Posts: `src/content/blog/`
- Projects: `src/data/projects.ts`
- Photos: `src/data/gallery.ts`

Save the file. `npm run dev` shows the change at once.

## Write a post

Add a `.md` or `.mdx` file under `src/content/blog/`. Keep its images next to the file and refer to them with relative paths. An `.mdx` file runs as JavaScript at build time, so review it like code (see [CONTRIBUTING.md](../CONTRIBUTING.md)).

```md
---
title: "Post title"
description: "Summary for the list and search results" # optional
pubDate: "2026-07-13"
updatedDate: "2026-07-20" # optional
heroImage: "./cover.jpg" # optional. Post hero and list thumbnail
tags: ["life", "music"] # optional
draft: true # drafts show in dev only and are left out of the build
---

The body is plain Markdown. A relative image such as `![alt](./photo.jpg)`
becomes responsive webp automatically. Code blocks, tables, the table of
contents and tags are built in.
```

The demo post "Kitchen sink" ([`kitchen-sink.md`](../src/content/blog/kitchen-sink.md)) shows every layout you can use.

## Add a project

Add an entry to `PROJECTS` in `src/data/projects.ts`:

```ts
{
  name: "Project name",
  description: "One line on what it is.",
  tech: ["Astro", "TypeScript"],       // shown as tech tags
  url: "https://github.com/you/repo",  // the whole block links here
  img: cover,                          // optional. An image imported at the top of the file, or an https URL
},
```

## Add a photo

Put the image file in `src/assets/gallery/`. Import it in `src/data/gallery.ts` and add an entry:

```ts
{
  src: photo,                        // an imported image or an https URL
  alt: "Description for screen readers and search",  // required
  caption: "Text under the photo and in the lightbox",  // optional
},
```

The array order is the display order.
