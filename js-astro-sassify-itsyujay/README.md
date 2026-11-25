<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Sassify Itsyujay](https://github.com/itsyujay/astro-sassify-template) Astro theme by itsyujay, copied from commit `6fbe959a8360cce7d59a0f75485dc3664c97e919` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-sassify-itsyujay.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed lockfiles of other package managers: package-lock.json; kept pnpm-lock.yaml.
- **Environment variables:** None.
- **Credit:** theme by [itsyujay](https://github.com/itsyujay), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Sassify Template

A modern, responsive Astro template with Tailwind CSS and Alpine.js integration. This template provides a solid foundation for building fast, SEO-friendly websites with a clean design system.

> **Building an AI agent product?** [Astroloop](https://github.com/lx-themes/astroloop) is a
> landing template aimed at exactly that — an agent-loop diagram with a human handoff gate, a
> per-tool permission matrix, and usage-based pricing instead of seats. Also MIT.

## 🚀 Features

- [Astro](https://astro.build/) - The web framework for content-driven websites
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Alpine.js](https://alpinejs.dev/) - Lightweight JavaScript framework for interactivity
- Responsive design system with custom color palette
- Dark mode support
- Smooth page transitions
- Performance optimized
- SEO-friendly

## 💼 Commercial Use

This template is **MIT** — use it for client work, invoice for it, ship it. No strings, no gated "pro" version.

If you're shipping paid projects on it, there are three ways to support the work: a one-time
**$75 commercial sponsorship**, a **$199 ship-assist** if you're stuck, and a **$499/yr agency plan**.

**→ [Commercial use & support](./COMMERCIAL.md)**

## 📦 Project Structure

```text
/
├── public/             # Static assets
│   └── favicon.svg
├── src/
│   ├── assets/         # Images and other assets
│   ├── components/     # Reusable UI components
│   ├── layouts/        # Page layouts
│   ├── pages/          # Page routes
│   ├── scripts/        # JavaScript utilities
│   └── styles/         # Global styles
│       ├── global.css
│       └── transitions.css
├── astro.config.mjs    # Astro configuration
└── package.json        # Project dependencies
```

## 🧞 Commands

Requires Node.js 22.12 or later. All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run check`           | Runs Astro diagnostics and type checks           |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🎨 Customization

### Colors

The template includes a custom color palette defined in `src/styles/global.css`:

- Primary: Purple-based color scheme
- Secondary: Slate-based color scheme
- Accent: Lime-based color scheme
- Warning: Yellow-based color scheme

You can customize these colors by editing the `src/styles/global.css` file.

### Typography

The template uses the following font families:

- Sans: Inter (with system fallbacks)
- Display: Lexend (with system fallbacks)

### Animations

Custom animations are included:
- Fade In
- Slide Up
- Slide Down

## 🚀 Getting Started

There are two ways to use this template:

### Option 1: Using Astro CLI (Recommended)

Create a project directly with Astro's official CLI tool:

```bash
npm create astro@latest -- --template itsyujay/astro-sassify-template
```

### Option 2: Manual Clone

1. Clone this repository
   ```bash
   git clone https://github.com/itsyujay/astro-sassify-template.git my-project
   cd my-project
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run checks
   ```bash
   npm run check
   npm run build
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Visit `http://localhost:4321` in your browser to see your site

## 🧩 More Astro templates

- **[Astroloop](https://github.com/lx-themes/astroloop)** — a landing page for AI agent products: an agent-loop diagram with a human handoff gate, and a per-tool permission matrix. [Demo](https://astroloop.yujay.dev)
- [Astro Zen Blog](https://github.com/itsyujay/astro-zen-blog) — a minimal blog, with typography tuned for long-form reading. [Demo](https://astro-zen-blog.yujay.dev/)
- [Apple-Style Portfolio](https://github.com/itsyujay/apple-style-portfolio) — a minimalist portfolio with GSAP motion and a Three.js accent. [Demo](https://apple-style-portfolio.yujay.dev)
- [Quiet Bar](https://github.com/itsyujay/quiet-bar) — a one-pager for a bar or restaurant. No CSS framework, no JavaScript libraries. [Demo](https://quiet-bar-theme.yujay.dev)

All MIT, all free for commercial use.

## 📝 License

MIT

Using it commercially? See [COMMERCIAL.md](./COMMERCIAL.md) — MIT means you owe nothing, but there is a button if you'd rather not.

## 👀 Learn More

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Alpine.js Documentation](https://alpinejs.dev/start-here)
