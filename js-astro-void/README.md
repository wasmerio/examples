<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Void](https://github.com/JorgeRosbel/void) Astro theme by JorgeRosbel, copied from commit `fca5804375e7a1bb905e6edbd4c31c03be4be00f` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-void.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [JorgeRosbel](https://github.com/JorgeRosbel), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Void - Minimalist Multilingual Portfolio Template

A clean, minimalist portfolio template built with Astro and TailwindCSS, featuring full internationalization support using `@ariaskit/astro-i18n`.

![Hero](.github/571_1x_shots_so.png)

## ✨ Features

- **🌍 Multilingual Support** - Built-in i18n with English, Spanish, and Portuguese
- **⚡ Astro 5** - Fast, modern static site generation
- **🎨 TailwindCSS 4** - Utility-first styling with dark mode
- **📱 Responsive Design** - Mobile-first approach
- **🔍 SEO Optimized** - Sitemap, meta tags
- **🚀 Zero JS by Default** - Minimal JavaScript for optimal performance
- **📝 TypeScript** - Full type safety throughout

## 🛠 Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Icons**: [Lucide](https://lucide.dev/)
- **Internationalization**: [@ariaskit/astro-i18n](https://github.com/JorgeRosbel/astro-i18n)
- **Package Manager**: pnpm

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/JorgeRosbel/void.git
cd void

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Your site will be available at `http://localhost:4321`.

### Build & Deploy

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🌐 Internationalization

This template uses `@ariaskit/astro-i18n` for seamless multilingual support. The i18n system is configured for:

- **English** (`en`) - Default locale
- **Spanish** (`es`)
- **Portuguese** (`pt`)

### Adding New Languages

1. Create a new JSON file in `/i18n/` (e.g., `fr.json`)
2. Copy the structure from `en.json`
3. Add the new locale to `src/pages/[lang]/index.astro` in the `getStaticPaths` function
4. Update the i18n library configuration if needed

### Translation Files

All translations are stored in `/i18n/`:
- `en.json` - English translations
- `es.json` - Spanish translations  
- `pt.json` - Portuguese translations

Each file contains the same structure with keys for:
- Navigation items
- Hero section content
- Project descriptions
- Experience details
- Contact information

## 📁 Project Structure

```
void/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images and static files
│   ├── components/     # Astro components
│   │   ├── Hero.astro
│   │   ├── Projects.astro
│   │   ├── Experience.astro
│   │   └── ...
│   ├── layouts/        # Page layouts
│   ├── pages/          # Route pages
│   │   ├── index.astro      # Root redirect
│   │   └── [lang]/          # Localized pages
│   └── styles/         # Global styles
├── i18n/               # Translation files
├── astro.config.mjs    # Astro configuration
└── package.json        # Dependencies
```

## 🎨 Customization

### Personal Information

Edit the translation files in `/i18n/` to update:
- Personal name and title
- Project descriptions
- Experience details
- Contact information

### Styling

The template uses TailwindCSS with a dark theme. Customize colors and styles in:
- Global CSS classes in components
- Tailwind configuration (if needed)

### Adding New Sections

1. Create new components in `/src/components/`
2. Add translation keys to all i18n files
3. Import and use components in `/src/pages/[lang]/index.astro`

## 🔧 Configuration

### Site Configuration

Update `astro.config.mjs` to change:
- Site URL (`site` property)
- Add/remove integrations

### Package Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production (includes i18n validation)
- `pnpm preview` - Preview production build

## 🌍 Deployment

This template works great with:

- **Vercel** - Zero-config deployment
- **Netlify** - Simple static site hosting
- **GitHub Pages** - Free static hosting
- **Cloudflare Pages** - Global CDN


## 📝 License

MIT License - feel free to use this template for your projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📚 Learn More

- [Astro Documentation](https://docs.astro.build/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [@ariaskit/astro-i18n Documentation](https://github.com/JorgeRosbel/astro-i18n)

---

**Built with ❤️ using Astro and TailwindCSS**