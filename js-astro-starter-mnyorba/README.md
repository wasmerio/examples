<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Astro Starter Theme](https://github.com/mnyorba/astro-starter) Astro theme by mnyorba, copied from commit `e22d883853c2a67f9ad97995538ce83b6bbfe381` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-starter-mnyorba.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [mnyorba](https://github.com/mnyorba), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Starter Theme

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with Astro](https://img.shields.io/badge/Made%20with-Astro-blueviolet?logo=astro)](https://astro.build)
[![Styled with Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Powered by daisyUI](https://img.shields.io/badge/Powered%20by-daisyUI-green?logo=daisyui)](https://daisyui.com/)

---

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/s/github/mnyorba/astro-starter)
[![Open in Gitpod](https://img.shields.io/badge/Open%20in-Gitpod-blue?logo=gitpod)](https://gitpod.io/#https://github.com/mnyorba/astro-starter)
[![Open in StackBlitz](https://img.shields.io/badge/Open%20in-StackBlitz-blue?logo=stackblitz)](https://stackblitz.com/github/mnyorba/astro-starter)

A modern, feature-rich Astro starter template powered by the latest web technologies. Built with Astro 5, Tailwind CSS 4, and DaisyUI for creating fast, beautiful, and accessible websites.

Perfect for blogs, portfolios, business sites, and personal projects with comprehensive documentation and multiple deployment options.

**Live Demo:** [https://mnyorba.github.io/astro-starter/](https://mnyorba.github.io/astro-starter/)

---

## Key Features

### Framework & Styling
- **Astro 5** - Latest web framework with optimal performance
- **Tailwind CSS 4** - Modern utility-first CSS framework
- **DaisyUI** - Beautiful, accessible component library
- **Dark/Light Mode** - Automatic theme switching with user preference

### Search
- **Pagefind Integration** - Static site search powered by Pagefind — the build generates an index that must be deployed with your site.

### Content Management
- **MDX & Markdown Support** - Write content in `.md` or `.mdx` files
- **Content Collections** - Type-safe blog posts with frontmatter validation
- **Categories & Tags** - Organized content with dedicated archive pages
- **Table of Contents** - Auto-generated TOC for long-form content
- **Pagination** - SEO-friendly blog pagination

### Contact & Communication
- **Flexible Contact Forms** - Multiple integration options:
  - Formspree (recommended for static sites)
  - Netlify Forms
  - EmailJS client-side sending
  - Server-side processing with validation
- **Contact Data Management** - JSON-based contact information with flexible formatting
- **Social Media Integration** - Automatic icon detection and links

### SEO & Performance
- **SEO Optimized** - Meta tags, Open Graph, Twitter Cards
- **Automatic Sitemap** - Generated on build
- **RSS Feed** - Automatic blog feed generation
- **Performance Optimized** - Image optimization, lazy loading
- **Analytics Ready** - Google Analytics & Tag Manager via Partytown

### Developer Experience
- **TypeScript Support** - Full type safety throughout
- **Accessible & Semantic** - WCAG compliant components
- **Mobile Responsive** - Mobile-first design approach
- **Custom 404 Page** - Better user experience
- **Prettier Integration** - Consistent code formatting
- **GitHub Actions CI/CD** - Pre-configured deployment workflow

## Quick Start

### Installation

```bash
# Create from template
npm create astro@latest -- --template mnyorba/astro-starter

# Install dependencies
cd your-new-project
npm install

# Start development server
npm run dev
```

Your site will be available at `http://localhost:4321`.

### Essential Configuration

1. **Update site settings** in `src/consts.ts`:
```typescript
export const metadata = {
  title: "Your Site Title",
  description: "Your site description",
  author: "Your Name",
};

export const config = {
  url: "https://your-domain.com",
  base: "/", // or "/repo-name/" for GitHub Pages
};
```

2. **Configure contact information** in `src/data/contacts.json`:
```json
{
  "general": {
    "email": ["email", "your@email.com", "Contact Email"],
    "phone": ["phone", "tel:+1234567890", "+1 234 567 890"]
  },
  "social": {
    "github": ["https://github.com/username", "GitHub"],
    "linkedin": ["https://linkedin.com/in/username", "LinkedIn"]
  }
}
```

3. **Customize navigation** in `src/components/navigation/NavbarMenuItems.astro`:
```astro
const mainMenu = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact/" }
];
```

## Available Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview build locally |
| `npm run format` | Format code with Prettier |
| `npm run astro ...` | Run Astro CLI commands |

## Project Structure

```text
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components
│   ├── contact/        # Contact form components
│   └── navigation/     # Header, navigation components
├── data/               # Content collections & contact data
│   ├── blog/          # Blog posts (markdown)
│   └── contacts.json  # Contact information
├── layouts/            # Page layouts
├── pages/              # Routes and API endpoints
├── styles/             # Global styles
└── consts.ts          # Site configuration

docs/                   # Comprehensive documentation
├── index.md           # Getting started guide
├── configuration.md   # Configuration options
├── contact-form.md    # Contact form setup
├── components.md      # Component documentation
└── deployment.md      # Deployment guide
```

## Deployment Options

### One-Click Deployment

[![Deploy to Netlify](https://img.shields.io/badge/Deploy%20to-Netlify-00C7B7?logo=netlify)](https://app.netlify.com/start/deploy?repository=https://github.com/mnyorba/astro-starter)
[![Deploy to Vercel](https://img.shields.io/badge/Deploy%20to-Vercel-000000?logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/mnyorba/astro-starter)

### GitHub Pages (Pre-configured)

[![Use this template](https://img.shields.io/badge/Use%20this%20template-2088FF?logo=github)](https://github.com/mnyorba/astro-starter/generate)

1. [Use this template](https://github.com/mnyorba/astro-starter/generate) to create a new repository
2. Update `config.base` in `src/consts.ts` with your repository name
3. Go to Repository Settings → Pages
4. Set Source to "GitHub Actions"
5. Push to main branch - automatic deployment starts

[![GitHub Pages Setup](https://img.shields.io/badge/Pages%20Setup-Guide-blue?logo=github)](./docs/deployment.md#github-pages-pre-configured)

### Other Platforms

The starter supports deployment to:
- Cloudflare Pages
- AWS Amplify
- Railway
- DigitalOcean App Platform
- Custom VPS/servers

## Documentation

Comprehensive documentation is available in the `/docs` directory:

| Guide | Description |
|-------|-------------|
| **[Getting Started](./docs/index.md)** | Quick start and overview |
| **[Configuration](./docs/configuration.md)** | Complete setup and customization |
| **[Contact Form](./docs/contact-form.md)** | Form integration options |
| **[Components](./docs/components.md)** | Component API and usage |
| **[Deployment](./docs/deployment.md)** | Deployment to various platforms |
| **[Search](./docs/search.md)** | How to configure the search functionality |

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Ready to build something amazing?** Start with the [documentation](./docs/index.md) and deploy in minutes!

**Built with modern web technologies for optimal performance and developer experience.**