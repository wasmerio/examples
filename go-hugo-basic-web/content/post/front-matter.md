+++
title = "Front Matter Reference"
date = 2026-01-05T00:00:00Z
draft = false
tags = ["reference"]
SubTitle = "Every param the theme reads, in one place."
+++

Front matter is the block at the top of each content file, delimited by `+++` (TOML) or `---` (YAML). The theme reads the following params.

### Per-page params

| Param | Type | Effect |
|-------|------|--------|
| `title` | string | Rendered as `<h2>` above content on single pages; used as the post title in list views. |
| `date` | datetime | Controls sort order and date display. |
| `draft` | bool | `true` hides the page from production builds. |
| `description` | string | Populates `<meta name="description">`. |
| `SubTitle` | string | Rendered as `<em>` below the title. Good for a one-line lede. |
| `skipTitle` | any | If set, the layout skips the `<h2>` title entirely. |
| `tags` | list | Taxonomy. Rendered as linked tags at the bottom of the page. |
| `authors` | list | Taxonomy. Rendered as linked author names at the bottom of the page. |

### List page params

Set these in a section's `_index.md` front matter to control how the post list renders.

| Param | Type | Effect |
|-------|------|--------|
| `showdate` | bool | Show publish date next to each post title. |
| `bigtitle` | bool | Large `<h2>` link for each post (default). Set `false` for compact `<em>` style. |
| `previewfullcontent` | bool | Show full post content instead of truncating at 200 characters. |
| `randomorder` | bool | Shuffle the post order on each load. |

### Site params

Set these in `hugo.toml` under `[params]`.

| Param | Type | Effect |
|-------|------|--------|
