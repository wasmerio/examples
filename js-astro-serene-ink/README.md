<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Serene Ink](https://github.com/jiseeeh/serene-ink) Astro theme by jiseeeh, copied from commit `c415fc30cae29fed77062e16a24edf9701271b6a` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-serene-ink.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [jiseeeh](https://github.com/jiseeeh), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Serene Ink

Serene Ink is a minimalist, elegant, and blazing-fast Astro blog template designed for developers, writers, and creators. It features a clean UI, dark/light mode toggle, and MDX support out of the box, ensuring you can focus entirely on your writing.

## 🚀 Features

- **Modern Stack:** Built with Astro, MDX, and Tailwind CSS v4 for ultimate developer experience and performance (100/100 Lighthouse scores).
- **Rich Blogging:** Includes tags, pagination, related posts, draft support, expressive code snippets, and a variety of custom MDX components out of the box.
- **Premium UX/UI:** Dark/light mode toggle with view transitions, Cmd+K search, smooth custom cursor, reading progress bar, and a dynamic Table of Contents.
- **SEO & Analytics:** Fully configured with RSS, canonical URLs, Open Graph, sitemaps, structured data, and a ready-to-use Umami analytics integration.
- **Centralized Config:** Easily personalize the entire site from a single `src/config.ts` file without digging into component code.

## 🧞 Setting Up

1. **Clone the repository** (or use the template):
   ```sh
   git clone https://github.com/your-username/serene-ink.git my-blog
   cd my-blog
   ```

2. **Install dependencies**:
   ```sh
   pnpm install
   ```

3. **Start the local development server**:
   ```sh
   pnpm dev
   ```
   Open `localhost:4321` in your browser.

## ✍️ Personalization

### Quick Start — `src/config.ts`

This is the **primary configuration file**. Open it and update these values to make the template yours:

```ts
export const siteConfig = {
  title: "Your Blog Name",
  description: "Your blog description.",
  siteUrl: "https://your-domain.com",
  author: {
    name: "Your Name",
    bio: "A short bio about yourself.",
  },
  nav: [
    { label: "Writing", href: "/" },
    { label: "About", href: "/about" },
  ],
  socials: {
    github: "https://github.com/your-username",
    twitter: "",     // leave empty to hide
    linkedin: "",    // leave empty to hide
  },
  postsPerPage: 5,
  analytics: {
    umami: {
      websiteId: "", // e.g., "a1b2c3d4-..."
      src: "",       // e.g., "https://cloud.umami.is/script.js"
    },
  },
  rss: {
    title: "Your Blog",
    description: "Your RSS feed description.",
  },
};
```

### Additional Personalization

1. **Domain config:** Open `astro.config.mjs` and update `site` to match your production URL.
2. **Author Profile & Projects:** Open `src/components/Author.astro` to customize the About page — timeline, projects, activity cards, and introductory text.
3. **Favicon:** Replace `/public/favicon.svg` and `/public/favicon.ico` with your brand's icon.

## 📝 Adding New Blogs

All content lives in the `src/posts/` folder.
To create a new blog post, use the built-in command:

```sh
pnpm run new-post "Your Awesome Catchy Title"
```

Alternatively, create a new `.mdx` file and include the following frontmatter:

```mdx
---
title: "Your Awesome Catchy Title"
date: "03/12/2024"
frontmatter: "A short description or summary of your post."
tags: ["astro", "learning", "random"]
draft: false
image: ""
---

Your content goes here...
```

### Frontmatter Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | ✅ | The post title |
| `date` | string | ✅ | Publish date in `MM/DD/YYYY` format |
| `frontmatter` | string | ✅ | Short summary (used on listing, RSS, and search) |
| `tags` | string[] | ✅ | Array of tags for categorization |
| `draft` | boolean | ❌ | Set to `true` to hide from all listings (default: `false`) |
| `updatedDate` | string | ❌ | Last updated date in `MM/DD/YYYY` format |
| `image` | string | ❌ | Path to a cover image (relative to `src/assets/`) |

### Organizing Posts

You can organize your posts into subdirectories inside `src/posts/` (e.g., `src/posts/2024/tutorials/my-post.mdx`). Astro will automatically generate the corresponding URL structure (`/posts/2024/tutorials/my-post`).

When nesting posts, use the `@/` alias to comfortably import out-of-the-box components without worrying about relative path depths:

```mdx
import Callout from '@/components/ui/Callout.astro';
```

*(Note that the `image` frontmatter property still requires relative paths like `../../../assets/images/cover.webp` when deeply nested.)*

## 📊 Analytics

Serene Ink supports [Umami](https://umami.is/) analytics out of the box. To enable it:

1. Create a free account at [umami.is](https://umami.is/) (or self-host).
2. Add your website and get your **Website ID** and **Script URL**.
3. Update `src/config.ts`:
   ```ts
   analytics: {
     umami: {
       websiteId: "your-website-id",
       src: "https://cloud.umami.is/script.js",
     },
   },
   ```

When both fields are empty, no analytics script is injected.

## 🌐 Deployment

This template is configured as a static site, compatible with hosts like **Cloudflare Pages**, **Vercel**, and **Netlify**.

**Deploying to Cloudflare Pages:**
1. Push your code to a GitHub or GitLab repository.
2. Log in to your Cloudflare dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select your repository and configure:
   - **Framework preset:** Astro
   - **Build command:** `pnpm run build`
   - **Build output directory:** `dist`
4. Click **Save and Deploy**.

*(Don't forget to update your `site` URL in `astro.config.mjs` once deployed!)*

## 📜 License

This project is open-source and released under the [MIT License](LICENSE). Feel free to use it for personal or commercial projects.
