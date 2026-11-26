<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Notion-Like Bento Blog](https://github.com/dgddgd314/astro-bento-blog-template) Astro theme by dgddgd314, copied from commit `8405747cf53905c9a23e5059921478db48664293` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-bento-blog.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [dgddgd314](https://github.com/dgddgd314), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Bento Blog Template

A free, open-source Astro blog theme with a bento archive, list and network views, a block-based post format, dark mode, and a browser-based post editor.

- Demo: [dgddgd314.github.io/astro-bento-blog-template](https://dgddgd314.github.io/astro-bento-blog-template/)
- Repository: [github.com/dgddgd314/astro-bento-blog-template](https://github.com/dgddgd314/astro-bento-blog-template)

## Features

- Responsive bento, list, and post-network archive layouts
- Astro Content Collections backed by portable JSON documents
- Categories, tags, search, RSS, and automatic related-post links
- Notion-inspired block renderer with rich text, tables, equations, callouts, bookmarks, and covers
- Built-in `/editor/` for creating and exporting Post JSON v2 files
- Google Drive image upload directly from the editor
- Light and dark themes with View Transitions
- GitHub Pages deployment workflow included
- TypeScript and Tailwind CSS 4

## Quick start

Use GitHub's **Use this template** button, or create a new Astro project from the repository:

```bash
npm create astro@latest my-blog -- --template dgddgd314/astro-bento-blog-template
cd my-blog
npm install
npm run dev
```

Node.js 22.12.0 or newer is required. The local site runs at `http://localhost:4321` by default.

## Customize the site

Edit `src/config.ts`. This is the main configuration surface for:

- `title`, `description`, and `author`
- document `language` and date `locale`
- deployment `url` and `basePath`
- the two-part wordmark under `brand`
- GitHub, RSS, and other `socialLinks`
- the browser-storage namespace
- View Transitions

For a GitHub Pages project site such as `https://username.github.io/my-blog/`, use:

```ts
url: "https://username.github.io",
basePath: "/my-blog",
```

For a custom domain or a repository named `username.github.io`, use `basePath: "/"`.

UI copy is kept close to the relevant components: the archive is in `src/components/blog/BlogArchive.astro`, and the editor shell is in `src/pages/editor/index.astro`.

## Write posts

Posts are Post JSON v2 documents stored anywhere below `src/content/blog/`. The collection reads `*.json` files recursively.

```json
{
  "version": 2,
  "meta": {
    "title": "Post title",
    "slug": "post-slug",
    "description": "A short summary for the archive and RSS feed.",
    "pubDate": "2026-08-15",
    "category": "engineering",
    "tags": ["astro", "notes"],
    "status": ["published"]
  },
  "page": {
    "icon": "📝",
    "cover": { "type": "color", "value": "#eaf4ff", "position": 50 }
  },
  "blocks": []
}
```

If `meta.category` is omitted or empty, the folder path becomes the category. For example, `src/content/blog/engineering/post.json` belongs to `engineering`.

### Browser editor

Open `/editor/` during local development. Create or import a document, then use **JSON 저장** to download it. Move the exported file into `src/content/blog/` and rebuild the site.

The editor keeps drafts, recent emoji, and non-secret Drive settings only in the current browser. No account profile or Google access token is persisted. The complete Post JSON contract is available from the editor as `public/editor.md`.

## Google Drive image upload

Drive upload is a built-in editor feature. The rest of the blog works without configuring it; setup begins only when a user chooses **Drive settings** or **Upload to Drive**.

1. Create a Google Drive folder for blog images.
2. Enable the Google Drive API in a Google Cloud project.
3. Create a Web application OAuth client ID.
4. Add the local and deployed origins to **Authorized JavaScript origins**.
5. In `/editor/`, enter the public OAuth client ID and Drive folder ID under **Drive settings**.

The editor requests the narrow `drive.file` scope, stores the access token only in memory, and makes newly uploaded images publicly readable. Never enter a client secret, and do not upload private images. See `public/drive-image-upload.md` for the full setup guide.

## Post network

Posts sharing tags are linked automatically in the network view. Add curated relationships in `src/data/post-network.json`:

```json
{
  "source": "first-post-slug",
  "target": "second-post-slug",
  "type": "reference",
  "label": "reference",
  "weight": 2
}
```

Both `source` and `target` must match post slugs.

## Deploy to GitHub Pages

1. Update `SITE.url` and `SITE.basePath` in `src/config.ts`.
2. Push the project to a GitHub repository using the `main` branch.
3. Open **Settings → Pages** in GitHub.
4. Select **GitHub Actions** as the deployment source.
5. Run the included workflow or push another commit.

The workflow uses Node.js 22.12, installs from `package-lock.json`, builds the site, and publishes `dist/`.

If you use Drive uploads on GitHub Pages, add only the origin, such as `https://username.github.io`, to the OAuth client's Authorized JavaScript origins. URL paths are not valid origins.

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Build the production site into `dist/` |
| `npm run preview` | Preview the production build locally |

## Project structure

```text
src/
  components/        Archive and block components
  content/blog/      Post JSON files
  data/              Post-network configuration
  layouts/           Shared and post layouts
  pages/             Blog, tag, editor, RSS, and 404 routes
  scripts/           Editor and Google Drive upload logic
  styles/            Theme, archive, editor, and block styles
  config.ts          Main user configuration
```

## License

MIT © dgddgd314. See [LICENSE](./LICENSE).
