# Content Is Read at Build Time (Docker, SSR, volumes)

Blog posts are an Astro **Content Collection** (`src/content.config.ts`, `glob()` loader over `src/data/post`). The collection is compiled during `astro build` and baked into `dist/`. Nothing re-reads `src/data/post` afterwards — not the static output, and not SSR either.

## Consequences

- Mounting a Docker volume on `src/data/post` and adding files at runtime does **not** publish them. A rebuild is required.
- The shipped `Dockerfile` builds once and serves `dist/` with nginx (`nginx/nginx.conf`), which is the intended model.
- The folder is `src/data/post`; `src/content/post` no longer exists (Astro 5 migration).

## Ways to publish new posts

| Approach                        | How                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| Rebuild on commit (recommended) | Push posts to Git; Netlify/Vercel/Cloudflare/GitHub Actions rebuild automatically    |
| Rebuild on demand               | Trigger `npm run build` (CI job, deploy hook or webhook from your CMS/editor)        |
| Docker                          | Rebuild the image (or run `npm run build` in a build stage) whenever content changes |
| Remote content                  | Replace the `glob()` loader with a loader that fetches from a CMS/API at build time  |

## Example: rebuild in Docker

```bash
docker build -t my-site .        # runs npm run build inside
docker run -p 8080:8080 my-site
```

Adding a post = commit the file, run `docker build` again.

## Notes

- `getCollection('post')` is wrapped by `fetchPosts()` in `src/utils/blog.ts`, which caches the result for the whole build.
- Drafts (`draft: true`) are filtered out in `fetchPosts()`.
- AstroWind v1 is a static template and does not support SSR (on-demand rendering); SSR support is planned for AstroWind v2. If you need runtime content today, use a rebuild trigger or a custom build-time loader.
