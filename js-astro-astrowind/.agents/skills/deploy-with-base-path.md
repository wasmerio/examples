# Deploy Under a Base Path (GitHub Pages, sub-folders) and Trailing Slashes

Use this when the site lives at `https://example.com/my-site/` instead of the domain root, or when you need URLs to end with `/`.

## Steps

1. In `src/config.yaml`:

```yaml
site:
  site: 'https://username.github.io'
  base: '/my-site' # no trailing slash
  trailingSlash: false # or true if your host requires /path/
```

2. Build: `npm run build`. Output still goes to `dist/`; only the URLs get the prefix.
3. Deploy `dist/` so it is served at `/my-site/`.

## How links are built

All internal links must go through `src/utils/permalinks.ts`:

| Helper                                                        | Use for            |
| ------------------------------------------------------------- | ------------------ |
| `getPermalink('/about')`                                      | Pages              |
| `getPermalink(slug, 'post')`                                  | Blog posts         |
| `getPermalink(slug, 'category')`, `getPermalink(slug, 'tag')` | Taxonomies         |
| `getBlogPermalink()`, `getHomePermalink()`                    | Blog index, home   |
| `getAsset('/rss.xml')`                                        | Files in `public/` |

They prepend `base` and apply `trailingSlash`. The integration in `vendor/integration/index.ts` also feeds `base`, `site` and `trailingSlash` to Astro's own config, so `Astro.url`, `page.url.*` (pagination) and `<a href>` written by Astro already include them.

## Do not double-prefix

Values that already come from Astro **must not** be passed through `getPermalink()` again:

- `page.url.prev` / `page.url.next` from `paginate()` (see `src/components/blog/Pagination.astro`).
- `Astro.url.pathname`.
- `import.meta.env.BASE_URL`.

## Comparing paths (active links, canonicals)

Compare without trailing slashes, e.g. `trimSlash(a) === trimSlash(b)` (`trimSlash` from `src/utils/permalinks.ts`). `Header.astro` does this for the active menu item.

## Verify

```bash
npm run build
grep -r "/my-site/my-site" dist && echo "double prefix found"
```

Also open `dist/index.html` and check `href`, `src` and `srcset` values start with `/my-site/`.

## Notes

- Images imported from `src/assets` are prefixed automatically by Astro. Files referenced from `public/` in Markdown need the prefix or `getAsset()`.
- `robots.txt` gets the sitemap URL rewritten with `base` at build (`vendor/integration/index.ts`).
