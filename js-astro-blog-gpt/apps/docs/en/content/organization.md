# Structure and URLs

BlogGPT organizes all site content under the `content/` directory using Astro Content Collections. You don't need to configure routes manually—file paths and frontmatter determine every page's URL.

## Four Content Types

Everything you write belongs to one of four folders under `content/`:

| Folder                | Purpose                                               | Generated URL Pattern                        |
| --------------------- | ----------------------------------------------------- | -------------------------------------------- |
| `content/posts/`      | Blog posts and articles                               | `/posts/<slug>` (or with `posts.pathPrefix`) |
| `content/pages/`      | Standalone pages (e.g., About, Now, Uses)             | `/<slug>`                                    |
| `content/categories/` | Category metadata (display title, description, cover) | `/categories/<slug>`                         |
| `content/tags/`       | Tag metadata (display title, description)             | `/tags/<slug>`                               |

## Files and Slugs

BlogGPT derives each entry's URL **slug** in the following priority order:

1. **Explicit `slug` in frontmatter**: If you set `slug: custom-url` in the file's frontmatter, BlogGPT uses that exact value.
2. **File or folder name**:
   - For a single file like `content/posts/hello-world.md` (or `hello-world.en.md`), the default slug is `hello-world`.
   - For a [content bundle](./bundles.md) like `content/posts/2026-trip/index.md` (or `index.en.md`), the default slug is the folder name (`2026-trip`).

You can nest posts inside arbitrary subdirectories under `content/posts/` (for example, `content/posts/notes/2026/my-post.md`) to keep your workspace tidy. By default, only the final slug (`my-post`) is used in the URL. Slugs accept lowercase ASCII letters, digits, and hyphens, starting with a letter or digit; slashes are not allowed. For date-based directories, use `posts.pathPrefix` below.

## URL Rules

### Custom Post URL Prefixes (`posts.pathPrefix`)

By default, posts live at `/posts/<slug>`. If you prefer date-based URLs (useful when migrating from Hugo, Hexo, or WordPress), set `posts.pathPrefix` in `blog.config.ts`:

```ts
export default {
  posts: {
    // Supported placeholders: [year], [month], [day]
    pathPrefix: '[year]/[month]',
  },
};
```

With `pathPrefix: '[year]/[month]'`, a post dated `2026-03-29` with slug `hello-world` resolves to `/posts/2026/03/hello-world`.

### Language Prefixes

In multi-language sites, URLs may also include a locale prefix (such as `/en/posts/hello-world`) depending on your `site.localePrefixPolicy` setting in `blog.config.ts`. See [Languages and Translations](./languages.md) for details.
