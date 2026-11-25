<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Astro Sidey](https://github.com/odhyp/astro-sidey) Astro theme by odhyp, copied from commit `11265aa99a2564d017a2021700aef6bb927766e5` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-sidey.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [odhyp](https://github.com/odhyp), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Sidey

A content-focused, side-anchored minimalist theme designed for developers,
writers, and digital gardeners. Built on Astro. Nothing in the way, just your
words on a clean, fast canvas.

**[Live Demo](https://sidey.odhyp.com)** · **[Getting Started](https://sidey.odhyp.com/writings/1-getting-started)**

---

## Features

- **Minimal by design** — few files, little styling, easy to modify
- **Typography first** — set in [Geist](https://vercel.com/font) with a clean, readable prose layout
- **Flexoki color scheme** — a warm, paper-like palette for comfortable reading in light/dark mode
- **Expressive Code** — syntax highlighting with line numbers and collapsible sections
- **Image lightbox** — click any image to open it full screen
- **Auto-generated routes** — folder structure maps directly to URLs
- **Single config file** — everything lives in `sidey.config.ts`
- **View Transitions** — smooth client-side navigation
- **RSS Feed & Sitemap** — generated automatically from your content
- **MDX support** — use components inside your markdown

## Quick Start

Click **Use this template** on GitHub to create a new repository, then:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
npm run dev
```

Open `sidey.config.ts` and fill in your details. That is the whole setup.

## Content Structure

| File                               | URL                 |
| ---------------------------------- | ------------------- |
| `src/content/pages/home.mdx`       | `/`                 |
| `src/content/pages/about.mdx`      | `/about`            |
| `src/content/writings/my-post.mdx` | `/writings/my-post` |

Read more about content structure at [sidey.odhyp.com/writings/2-content-structure](https://sidey.odhyp.com/writings/2-content-structure).

## Built With

- [Astro](https://astro.build)
- [Tailwind CSS](https://tailwindcss.com)
- [Expressive Code](https://expressive-code.com)
- [Geist](https://vercel.com/font)
- [Flexoki](https://stephango.com/flexoki)

## License

MIT License. See [LICENSE](./LICENSE) for details.
