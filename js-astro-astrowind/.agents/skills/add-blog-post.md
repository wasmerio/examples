# Add a Blog Post

## Steps

1. Create a new `.md` or `.mdx` file in `src/data/post/`
2. Add required frontmatter:

```yaml
---
publishDate: 2026-01-15T00:00:00Z
title: 'Your Post Title'
excerpt: 'One or two sentences, at most 155 characters: it is the meta description and the card text.'
image: '~/assets/images/your-image.png'
imageAlt: 'What the cover image shows'
category: 'tutorials'
tags:
  - astro
  - tailwind
author: 'Author Name'
---
```

3. Write content in Markdown (or MDX for component embedding)
4. Run `npm run build` to verify the post renders correctly

## Frontmatter Fields

| Field         | Required | Description                                                                                                                           |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | Yes      | Post title                                                                                                                            |
| `publishDate` | No       | ISO 8601 date                                                                                                                         |
| `updateDate`  | No       | ISO 8601 date; shown as "Updated" next to the publish date and sent as `article:modified_time` / `dateModified`                       |
| `draft`       | No       | Set `true` to hide from listing                                                                                                       |
| `excerpt`     | No       | Summary for listing pages and the meta description (keep it ≤ 155 characters; longer text is cut at a word boundary for the meta tag) |
| `image`       | No       | Path to hero image (use `~/` prefix for local)                                                                                        |
| `imageAlt`    | No       | Alt text of the hero image; leave empty for decorative stock photos                                                                   |
| `category`    | No       | Single category string                                                                                                                |
| `tags`        | No       | Array of tag strings                                                                                                                  |
| `author`      | No       | Author name                                                                                                                           |
| `metadata`    | No       | Override SEO metadata                                                                                                                 |

## URL Pattern

The slug is derived from the filename and the URL follows `apps.blog.post.permalink` in `src/config.yaml` (`/%slug%` by default, so `/your-post`; `/blog/%slug%`, `%year%/%month%`, `%category%` are also available).

## What every post gets automatically

- `<title>` with the site template, meta description from `excerpt`, canonical URL, Open Graph and Twitter tags with the cover image, `article:published_time` / `article:modified_time` / `article:section` / `article:tag`.
- `BlogPosting` and `BreadcrumbList` JSON-LD, a breadcrumb trail, reading time, related posts.
- A place in the blog list, the category and tag pages, the RSS feed and the sitemap. To keep a post out of search results (a demo or an internal note), add `metadata: { robots: { index: false } }`; the sitemap still lists every page and search engines honour the robots meta tag.

## Notes

- Reading time is calculated automatically via remark plugin
- Images referenced with `~/` are optimized at build time
- Use `.mdx` extension to embed Astro components in posts
