# Search Guide (Pagefind)

This project uses Pagefind (https://pagefind.app/) for static, client-side search. Pagefind runs after the site build and produces a `pagefind` folder that must be deployed with your site.

## 1. Add indexable content

Add the attribute `data-pagefind-body` to the main container that holds the page content so Pagefind can find text to index:

```astro
// src/layouts/Layout.astro
<main data-pagefind-body class="prose max-w-full">
  <slot />
</main>
```

Notes:

- Pagefind indexes only static/SSR HTML. If content is rendered exclusively client-side, it will not be indexed.
- You can enable `data-pagefind-body` conditionally per page by passing a prop to your Layout (example below).

## 2. Exclude content or pages

- Exclude parts of a page using data-pagefind-ignore:

```html
<aside data-pagefind-ignore>Not indexed (widgets, ads, etc.)</aside>
```

- Exclude entire files or globs via a Pagefind config file (pagefind_config.json):

```json
// pagefind_config.json
{
  "exclude": ["**/404.html", "drafts/**", "private/**"]
}
```

Run Pagefind with the config:

```bash
npx pagefind --site ./dist --config ./pagefind_config.json --output-path ./dist/pagefind --verbose
```

### Excluding pages via Layout prop

You can exclude specific pages from indexing by passing `pagefind={false}` to your Layout when rendering a page:

```astro
// src/pages/index.astro
<Layout title={title} description={description} pagefind={false}>
  <!-- page content -->
</Layout>
```

The Layout should add `data-pagefind-body` only when `pagefind` is true (see Layout example below). This lets you control indexing per-page without changing your build or CI.

### Exclude entire files or globs via a Pagefind config file (`pagefind_config.json`):

```json
// pagefind_config.json
{
  "exclude": ["**/404.html", "drafts/**", "private/**"]
}
```

For more details and advanced configuration see the Pagefind docs: https://pagefind.app/docs/ .

**Notes:**

- Pagefind indexes only static/SSR HTML. If content is rendered exclusively client-side, it will not be indexed.

## 3. package.json script

Add Pagefind to the build pipeline so it runs automatically after build:

```json
// package.json (scripts)
{
  "scripts": {
    "build": "astro build && pagefind --site ./dist"
  }
}
```

Important: do not append extra CLI args to `npm run build` in CI (e.g. avoid `npm run build -- --site ...`) — npm will append them and may break the command.

## 4. GitHub Actions (CI)

Recommended: call the package.json build script (runs astro build + pagefind). Minimal example:

```yaml
# .github/workflows/astro.yml (snippet)
- name: Install dependencies
  run: npm ci

- name: Build (includes Pagefind)
  run: npm run build

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./dist
```

Alternative: run astro build with Pages outputs then run pagefind separately (useful when you must pass --site/--base to astro build):

```yaml
- name: Build then run pagefind
  run: |
    ${{ steps.detect-package-manager.outputs.runner }} astro build --site "${{ steps.pages.outputs.origin }}" --base "${{ steps.pages.outputs.base_path }}"

    SITE_DIR="./dist${{ steps.pages.outputs.base_path }}"
    if [ ! -d "$SITE_DIR" ]; then
      SITE_DIR="./dist"
    fi
    # run pagefind against the built site
    npx pagefind --site "$SITE_DIR" --verbose
```

## 5. Deployment

Ensure the generated dist/pagefind folder is included when deploying (GitHub Pages or other host).

## 6. Troubleshooting

- No pages indexed (Indexed 0 pages)
  - Check that built HTML files contain `data-pagefind-body`:
    grep -R "data-pagefind-body" dist -n || echo "no data-pagefind-body in dist"
  - Confirm content is SSR/static, not client-only.
  - Run Pagefind locally to see verbose logs:
    npx pagefind --site ./dist --output-path ./dist/pagefind --verbose

- CI errors when passing args to npm scripts
  - Do not pass CLI args to `npm run build` unless your script handles them. Use separate steps or wrapper scripts.

## 7. Tips

- Use `data-pagefind-ignore` liberally for UI chrome and widgets.
- Keep page metadata (titles, descriptions) as plain HTML inside `data-pagefind-body` to improve relevance.
- Use a pagefind_config.json to exclude drafts, private pages, or auto-generated routes.

For more details and advanced configuration see the Pagefind docs: https://pagefind.app/docs/ .
