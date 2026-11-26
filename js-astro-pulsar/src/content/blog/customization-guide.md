---
title: "Theme Customization Guide"
description: "Learn how to customize colors, fonts, and other aspects of your blog theme"
published: true
date: 2024-01-05
author: "amirdaraee"
keywords: ["customization", "theming", "configuration", "design"]
photo: "/sample-3.jpg"
language: "en"
---

# Theme Customization Guide

This guide will help you customize your blog theme to match your personal style and branding.

## Configuration File

The main configuration file is located at `src/config.ts`. This is where you can set:

- Site title and description
- Author information
- Social media links
- Google Analytics tracking ID
- Default language and locale

Example configuration:

```typescript
export const SITE_CONFIG = {
  title: "My Awesome Blog",
  description: "Thoughts on web development, design, and more",
  author: "amirdaraee",
  email: "amirdaraee@gmail.com",

  socialLinks: {
    github: "amirdaraee",
    twitter: "amirdaraee",
    linkedin: "amirdaraee",
    youtube: "yourchannel"
  },

  googleAnalyticsId: "G-XXXXXXXXXX", // Optional
  language: "en",
  locale: "en-US"
};
```

## Styling and Colors

### Tailwind Configuration

The theme uses Tailwind CSS for styling. You can customize colors, fonts, and more in `tailwind.config.mjs`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-color'
      },
      fontFamily: {
        sans: ['Your Font', 'sans-serif']
      }
    }
  }
}
```

### Dark Mode

Dark mode is enabled by default. The theme uses Tailwind's class-based dark mode strategy. You can customize dark mode colors using the `dark:` prefix in your classes.

## Custom Fonts

To add custom fonts:

1. Place font files in the `public/fonts/` directory
2. Update the `@font-face` rules in `src/layouts/Layout.astro`
3. Update the Tailwind config to use your font

Example:

```css
@font-face {
  font-family: 'Your Font';
  src: url('/fonts/your-font.woff2') format('woff2');
  font-display: swap;
}
```

## Navigation and Footer

### Navigation Links

Edit the navigation links in `src/components/Header.astro`:

```astro
const navItems = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];
```

### Social Links

Social links in the footer are configured through the `src/config.ts` file. The `Footer.astro` component will automatically render links based on your configuration.

## SEO and Meta Tags

The `src/components/SEO.astro` component handles all SEO meta tags. You can customize:

- Default meta description
- Open Graph images
- Twitter card type
- Structured data

## Google Analytics

To enable Google Analytics:

1. Add your GA tracking ID to `src/config.ts`
2. The tracking code in `Layout.astro` will automatically load

To disable analytics, simply remove or comment out the GA ID in your config.

## Images and Assets

- Place images in the `public/` directory
- Reference them in your markdown using absolute paths: `/images/photo.jpg`
- The theme supports WebP format for optimal performance
- Use the `photo` frontmatter field for blog post cover images

## Build Configuration

The `astro.config.mjs` file contains build settings:

- Update `site` with your production URL
- Modify `output` directory if needed
- Add or remove integrations

```javascript
export default defineConfig({
  site: 'https://yourdomain.com',
  integrations: [sitemap(), tailwind()],
});
```

## Further Customization

Feel free to modify any component in the `src/components/` directory to match your needs. The theme is built with simplicity and customization in mind!

Happy customizing! 🎨
