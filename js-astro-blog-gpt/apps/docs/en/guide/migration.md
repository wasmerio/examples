# Migrate an Existing Blog

Moving an existing blog from **Hugo**, **Hexo**, **Jekyll**, or another Astro theme to BlogGPT is straightforward because BlogGPT uses standard Markdown and YAML frontmatter. Follow the five steps below for a clean migration.

## 1. Organize Articles

Copy your existing `.md` or `.mdx` posts into `content/posts/`. You can keep them in a flat list or organize them into subfolders by year or topic—BlogGPT recursively scans `content/posts/`.

Next, check the frontmatter at the top of each post:

- **`title`** _(Required)_: Every post must have a string `title`.
- **Required publication date**: BlogGPT natively recognizes `date`, `published`, or `pubDatetime` for the publication date, and `updated`, `modDatetime`, or `lastmod` for the last modified date—so most Hugo, Hexo, and Astro posts work without renaming date fields. Every post must provide one of the supported publication date fields.
- **`draft`**: Set `draft: true` on unfinished posts.

## 2. Manage Assets

Depending on how your previous blog stored images and downloads, pick one of two approaches:

- **Co-located assets (Content Bundles)**: If a post has its own folder containing `index.md` and images (just like Hugo Page Bundles), place the entire folder inside `content/posts/<post-folder>/` and reference files using relative paths (`./image.png`). See [Bundles and Attachments](../content/bundles.md).
- **Global static assets (`public/`)**: If your posts reference root-relative paths like `/images/cover.jpg`, move your static folder into `public/images/` so `/images/cover.jpg` continues to resolve unchanged.

## 3. Categories and Tags

In BlogGPT, categories and tags are explicitly defined in `content/categories/` and `content/tags/` (or referenced by slug in post frontmatter):

1. In your posts, ensure `categories` and `tags` use clean slugs (for example, `categories: [frontend]` and `tags: [astro, typescript]`). Single strings (`category: frontend`) are also supported.
2. Create matching metadata files in `content/categories/<slug>.md` and `content/tags/<slug>.md` to give each category or tag a human-readable display title, description, and optional cover image. See [Categories, Tags, and Pages](../content/taxonomy.md).

## 4. Preserve Existing URLs

If you want to keep your old post URLs intact so external links and search engine rankings don't break:

- **Custom per-post slug**: Set `slug` in a post's frontmatter to override its filename. Slugs accept only lowercase ASCII letters, digits, and hyphens, starting with a letter or digit; an old path containing slashes cannot be used as a slug.
- **Date-based URL prefixes**: If your old blog used URLs like `/posts/2026/my-post` or `/posts/2026/03/my-post`, configure `posts.pathPrefix` in `blog.config.ts` (for example, `pathPrefix: '[year]'` or `pathPrefix: '[year]/[month]'`). See [Structure and URLs](../content/organization.md).

## 5. Check and Publish

Run a full production build locally to validate all frontmatter schemas and internal links:

```bash
pnpm build
pnpm preview
```

Fix any schema validation warnings printed in the terminal, test a few migrated posts and images in your browser, and then deploy!
