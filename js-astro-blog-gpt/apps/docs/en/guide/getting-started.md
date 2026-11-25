# Install and Preview

This guide walks you through setting up a new BlogGPT site on your machine, writing your first post, and previewing the production build.

## Requirements

Make sure you have the following installed before starting:

- **Node.js**: `24.x` for the starter (the main repository also supports `>= 22.12.0`)
- **pnpm**: Use the version pinned in `package.json`

Check your installed versions in the terminal:

```bash
node --version
pnpm --version
```

## Initial Setup

The fastest way to start is with the official [BlogGPT Starter Template](https://github.com/Raincarnator/astro-theme-BlogGPT-starter), which includes a clean directory structure and sample content:

```bash
git clone https://github.com/Raincarnator/astro-theme-BlogGPT-starter.git my-blog
cd my-blog
corepack enable
corepack install
pnpm install --frozen-lockfile
pnpm dev
```

Once the development server starts, open `http://localhost:4321` in your browser.

### Personalize Your Site

Before writing, you will usually want to update a few basics:

1. **`blog.config.ts`**: Change `site.title`, `site.baseUrl`, and `author` (your name, bio, avatar, and social links).
2. **`friends.config.ts`**: The initial blogroll links only to the official documentation site; add or clear links as you prefer.
3. **`content/pages/`**: Update the built-in `about` page with your own introduction.

## Write Your First Post

You can create Markdown files manually under `content/posts/`, or use the `pnpm new` CLI command to generate a post from an archetype template:

```bash
# Create a single-file post at content/posts/hello.mdx
pnpm new post hello --title "My First Post"

# Create a folder bundle at content/posts/travel/index.mdx (great for posts with local images)
pnpm new post travel --use bundle --title "Travel Post"
```

Open the generated file, write your Markdown content, and save—the browser preview updates automatically. Templates set `draft: true`; change it to `draft: false` and choose a publication date no later than the build time before publishing.

## Preview Release Output

Development mode provides full-text search through JSON data. Production builds generate the Pagefind search index and Open Graph cover images. To test everything locally before deploying:

```bash
pnpm build
pnpm preview
```

## Common Commands

| Command                  | Description                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `pnpm dev`               | Start the local development server with hot reload (draft posts are visible by default) |
| `pnpm new <kind> <slug>` | Scaffold a new `post`, `page`, `category`, or `tag` from `archetypes/`                  |
| `pnpm build`             | Build static production assets and search indexes into `dist/`                          |
| `pnpm preview`           | Serve the compiled `dist/` directory locally to test production behavior                |
| `pnpm astro sync`        | Regenerate Astro Content Collection TypeScript types                                    |
