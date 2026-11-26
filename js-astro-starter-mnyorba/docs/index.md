# Astro Starter Documentation

Welcome to the Astro Starter theme documentation. This modern template combines Astro 5, Tailwind CSS 4, and DaisyUI for building fast, beautiful websites.

## Documentation Sections

| Guide                                           | Description                                                                 |
| ----------------------------------------------- | --------------------------------------------------------------------------- |
| **[Configuration Guide](./configuration.md)**   | Complete site setup, contact data, navigation, and customization            |
| **[Contact Form Setup](./contact-form.md)**     | Form integration with Formspree, Netlify, EmailJS, and server-side handling |
| **[Components Documentation](./components.md)** | Component API, props, and customization examples                            |
| **[Deployment Guide](./deployment.md)**         | Deploy to GitHub Pages, Netlify, Vercel, and custom servers                 |
| **[Search Setup](./search.md)**                 | How to configure the search functionality                                   |

## Quick Start

### Installation

```bash
# Create from template
npm create astro@latest -- --template mnyorba/astro-starter

# Install dependencies
cd your-project-name
npm install

# Start development server
npm run dev
```

Open http://localhost:4321 in your browser.

### Essential Configuration

**1. Site settings** - Edit `src/consts.ts`:

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

**2. Contact information** - Update `src/data/contacts.json`:

```json
{
  "general": {
    "email": ["email", "your@email.com", "Contact Email"],
    "phone": ["phone", "tel:+1234567890", "+1 234 567 890"]
  }
}
```

**3. Navigation menu** - Customize `src/components/navigation/NavbarMenuItems.astro`:

```javascript
const mainMenu = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact/" },
];
```

> **Complete setup guide:** [Configuration Documentation](./configuration.md)

## Deploy in Minutes

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

> **Full deployment guide:** [Deployment Documentation](./deployment.md)

## Contact Form Integration

Choose your preferred contact form solution:

- **Formspree** - Easiest for static sites (recommended)
- **Netlify Forms** - Built into Netlify hosting
- **EmailJS** - Client-side email sending
- **Server-side** - Built-in validation and processing

> **Setup instructions:** [Contact Form Documentation](./contact-form.md)

## Built-in Features

- **Astro 5** - Latest web framework with optimal performance
- **Tailwind CSS 4** - Modern utility-first CSS
- **DaisyUI Components** - Beautiful, accessible UI components
- **Dark/Light Mode** - Automatic theme switching
- **SEO Ready** - Meta tags, sitemap, RSS feed
- **Content Collections** - Type-safe blog posts with frontmatter
- **Multi-level Navigation** - Unlimited menu nesting
- **Contact Forms** - Multiple integration options
- **Performance Optimized** - Image optimization, lazy loading
- **Mobile Responsive** - Mobile-first design
- **Accessibility** - WCAG compliant components

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
```

> **Component details:** [Components Documentation](./components.md)

## Need Help?

- **Documentation** - Comprehensive guides in this `/docs` directory
- **Issues** - [Report bugs](https://github.com/mnyorba/astro-starter/issues)
- **Discussions** - [Ask questions](https://github.com/mnyorba/astro-starter/discussions)
- **Contact** - Use the contact form for direct support

## Useful Resources

- **[Astro Documentation](https://docs.astro.build/)** - Official Astro framework docs
- **[Tailwind CSS](https://tailwindcss.com/docs)** - CSS framework documentation
- **[DaisyUI](https://daisyui.com/)** - Component library reference
- **[MDX Guide](https://mdxjs.com/)** - Enhanced markdown syntax

## Contributing

Contributions are welcome! Fork the repository, make your improvements, and submit a pull request.

## License

MIT License - free for personal and commercial use.

---

**Ready to start?** Follow the [Configuration Guide](./configuration.md) to customize your site, then check the [Deployment Guide](./deployment.md) to go live!

**Built with ❤️ using Astro, Tailwind CSS, and DaisyUI**
