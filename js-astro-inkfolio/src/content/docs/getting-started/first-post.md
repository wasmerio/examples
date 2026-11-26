---
title: Write the first post
order: 3
description: One Markdown file is one post. The filename is the URL.
---

Create a file in `src/content/posts/`:

```bash
src/content/posts/my-first-post.md
```

It becomes `/posts/my-first-post/`. Renaming the file changes the URL, so pick a slug you can live with.

## Frontmatter

```yaml
---
title: My first post
description: One sentence for the index page and search results.
date: 2026-11-16
tags: [notes]
draft: false
---
```

`title` and `date` are required. `description` is strongly recommended — it becomes the meta description. `draft: true` keeps the file in the repository but out of every list, the RSS feed and the sitemap.

## Body

Ordinary Markdown. Code fences get syntax colours and a copy button in the docs; images use a root-relative path:

```markdown
![A caption](/images/photo.jpg)
```

> [!TIP]
> Put images in `public/`. There is no image pipeline in this theme on purpose — optimise before you commit.

Save the file and the dev server shows it. When the draft flag is off and the build is green, it is live.

Next: configure the site properly.
