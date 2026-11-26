---
title: Migrate an existing blog
order: 4
description: Bring posts, images and URLs over from WordPress, Ghost, Hugo or another Astro theme.
---

Moving an existing blog is four jobs: posts, assets, taxonomy and URLs. Do them in
that order — the last one only makes sense once the other three are stable.

## 1. Posts

Copy your Markdown (or exported HTML converted to Markdown) into
`src/content/posts/`. One file per post, filename becomes the URL slug.

Map the frontmatter:

| Your old field | Inkfolio |
| --- | --- |
| `title` | `title` |
| `date` / `published_at` | `date` (ISO `YYYY-MM-DD`) |
| `excerpt` / `summary` | `description` |
| `cover` / `featured_image` | `cover` (path under `public/`) |
| `tags` | `tags: []` |
| `category` | `categories: []` |
| `draft: true` | keep it — drafts are excluded from the build output |

Anything else is ignored, so you can leave extra keys in place while you migrate.

```bash
# A quick sanity check: every post must parse before you build
npm run build
```

## 2. Assets

Images belong in `public/`, referenced by absolute path: `/img/hello.jpg`.

If your old blog served `wp-content/uploads/2024/05/photo.jpg`, either keep that
path (copy the folder as-is into `public/wp-content/uploads/...`) so old links keep
working, or rewrite the references in one pass:

```bash
grep -rl 'wp-content/uploads' src/content/posts | while read f; do
  sed -i 's#/wp-content/uploads/2024/05/#/img/#g' "$f"
done
```

## 3. Categories and tags

Posts declare them in frontmatter; pages are generated from that data, so there is
nothing to register:

```yaml
categories: ['Tech']
tags: ['cloudflare', 'self-hosting']
```

Category covers and blurbs are optional. Add them to `src/data/taxonomy.ts` when you
want a specific image instead of the first post's cover:

```ts
export const categoryMeta = {
  Tech: { cover: '/img/tech.jpg', description: 'Infrastructure and tooling.' },
};
```

## 4. URLs

Three things decide whether old links survive:

1. `trailingSlash: 'always'` in `astro.config.mjs` — links are `/posts/hello/`, not
   `/posts/hello`.
2. The file name in `src/content/posts/` — `hello.md` becomes `/posts/hello/`.
3. Redirects for anything that moved. On Cloudflare Pages put a `_redirects` file in
   `public/`:

```
/2024/05/old-post/   /posts/old-post/   301
/feed/               /rss.xml           301
```

Vercel and Netlify use the same file format.

Keep a list of your ten most-linked URLs and check them by hand after the first
deploy — that is where 404 traffic comes from.

## 5. Checklist before you switch DNS

- [ ] `npm run build` passes (it runs `astro check` first)
- [ ] `dist/sitemap-index.xml` lists every post
- [ ] `site.config.yaml` has the real domain and language list
- [ ] One post per language opens, with the language switch only where a
      counterpart exists
- [ ] Old URLs either still resolve or 301 to their new home
- [ ] Search finds an old post's title (the index is built at deploy time)
