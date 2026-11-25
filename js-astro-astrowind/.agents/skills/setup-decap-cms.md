# Set Up Decap CMS (Netlify)

The template ships a Decap CMS admin at `/decapcms/` (`public/decapcms/index.html` + `config.yml`). It needs a Git-based backend; the shipped config uses Netlify's `git-gateway`.

## Steps

1. Deploy the site to Netlify from your Git repository.
2. In Netlify: enable **Identity** and **Git Gateway** (Site settings → Identity → Services). Invite yourself as a user.
3. Check `public/decapcms/config.yml`:

```yaml
backend:
  name: git-gateway
  branch: main # your production branch

media_folder: 'src/assets/images'
public_folder: '/_astro'

collections:
  - name: 'post'
    label: 'Post'
    folder: 'src/data/post' # posts live here (not src/content/post)
    create: true
```

4. If Decap shows a 404 loading `config.yml`, set in `netlify.toml`:

```toml
[build.processing.html]
  pretty_urls = true
```

This is safe: Astro already emits one `index.html` per folder, so Netlify has nothing to rewrite.

5. Open `https://your-site/decapcms/`, log in with Netlify Identity and create a post.

## Fields vs. frontmatter

The `fields` in `config.yml` must match the schema in `src/content.config.ts` (`title` required; `excerpt`, `image`, `category`, `tags`, `publishDate`, `author`, `draft`, `metadata` optional). Add a field to both places when extending posts.

## Notes

- Posts saved by Decap are committed to the repository; Netlify rebuilds the site. Content is read at build time (see `content-at-build-time.md`).
- `image` is a string in the schema; with `media_folder: src/assets/images` Decap writes `/_astro/...`. Prefer writing `~/assets/images/<file>` so `findImage()` optimises it, or change `public_folder` to `~/assets/images`.
- For other hosts use a different backend (`github`, `gitlab`, `gitea`) in `config.yml`; see the Decap docs.
