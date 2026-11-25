# Disable the Blog

Use this when the site does not need a blog (corporate site, landing page, portfolio).

## Steps

1. In `src/config.yaml` set:

```yaml
apps:
  blog:
    isEnabled: false
```

2. Remove the blog entries from `headerData.links` in `src/navigation.ts` (the "Blog" dropdown) and any blog link in `footerData`.
3. Remove `<BlogLatestPosts />` (and `<BlogHighlightedPosts />` if used) from `src/pages/index.astro` and any other page; with the blog disabled they render nothing, so they are just dead code.
4. Run `npm run build` and confirm no `/blog`, `/category/*`, `/tag/*` or post pages are emitted in `dist/`.

## What changes

| Route / file                                | With `isEnabled: false`                              |
| ------------------------------------------- | ---------------------------------------------------- |
| `/blog`, `/blog/2`, `/category/*`, `/tag/*` | Not generated (`getStaticPaths()` returns `[]`)      |
| Post URLs (`/%slug%`)                       | Not generated                                        |
| `/rss.xml`                                  | Returns 404 (`src/pages/rss.xml.ts` checks the flag) |
| `src/data/post/*.md(x)`                     | Ignored at build; safe to delete                     |
| `src/pages/[...blog]/`                      | Can stay; it produces no routes                      |

## Partial disabling

Each section can be switched off separately under `apps.blog`: `post.isEnabled`, `list.isEnabled`, `category.isEnabled`, `tag.isEnabled`. For example, keep posts but drop the category and tag pages:

```yaml
apps:
  blog:
    isEnabled: true
    category:
      isEnabled: false
    tag:
      isEnabled: false
```

## Notes

- The flags are read through the `astrowind:config` virtual module (`APP_BLOG` in `src/utils/blog.ts`). Do not hard-code them elsewhere.
- Deleting `src/pages/[...blog]/` is optional. If you delete it, also delete `src/utils/blog.ts` imports that reference it, or keep both to re-enable the blog later.
- Historical note: on Astro 5.0.x the dev server crashed with `Cannot read properties of undefined (reading 'currentPage')` when the blog was disabled. That was an Astro dev-server bug; current Astro returns a plain 404 for those routes.
