# Customization Guide

Use this guide when adapting Payday for a real product site.

## Site Settings

Edit [src/config/site.ts](./src/config/site.ts) first.

| Key           | What it controls                                                             |
| ------------- | ---------------------------------------------------------------------------- |
| `name`        | Page title suffixes, the logo's accessible name, and the footer copyright    |
| `title`       | The home page `<title>` and the default social title                         |
| `description` | The default meta description                                                 |
| `siteUrl`     | Canonical URLs, social image URLs, the sitemap, `robots.txt`, and JSON-LD    |
| `language`    | The `lang` attribute                                                         |
| `socialImage` | The Open Graph and Twitter/X image, a path in `public/`                      |
| `cta`         | The button in the header, the hero, the closing band, and the mobile menu    |
| `signIn`      | The "Log in" link in the header and the mobile menu                          |
| `contact`     | The contact form; it stays disabled until `enabled` is true and `action` set |
| `socials`     | The icon links in the footer                                                 |

## Navigation

`navigation` in the same file is the header and mobile menu. `footerNavigation` is the list of links in the footer. Both are flat lists of `{ label, href }`.

## Home Page

Every section reads from [src/config/home.ts](./src/config/home.ts), in page order:

| Export      | Section                                                   |
| ----------- | --------------------------------------------------------- |
| `hero`      | The headline and the sentence under it                    |
| `companies` | The logo marquee and the customer story logos             |
| `product`   | The tabbed section; each tab has an icon, title, and body |
| `global`    | The heading and line above the country table              |
| `stats`     | The three large numbers                                   |
| `quote`     | The customer quote and portrait                           |
| `bento`     | The feature grid                                          |
| `pricing`   | The plans; `monthly` and `yearly` are per person a month  |
| `stories`   | The customer story cards; `tone` picks the gradient       |
| `faq`       | The questions and answers                                 |
| `security`  | The security copy and the points beside the seals         |
| `closing`   | The heading in the closing band                           |

A `subtitle` becomes a second, muted line of the section heading.

The product mockups live in [src/components/product](./src/components/product), with their sample data at the top of each file. The tab panels are listed in order in [src/components/home/Product.astro](./src/components/home/Product.astro).

The home page passes `overlay` to the layout, which starts the header transparent over the dark hero. Leave it off on pages without a dark full-bleed section at the top.

The company logos are SVGs in [src/assets/logos](./src/assets/logos), named after the company in lowercase. To add one, drop in the SVG and add the name to `companies`.

The integration marks come from [src/config/integrations.ts](./src/config/integrations.ts); each `icon` matches a file in [src/assets/integrations](./src/assets/integrations).

## About Page

[src/config/about.ts](./src/config/about.ts) holds the page title and lead, the team photo, the story, the four facts, the principles, the milestones, and the team. Team portraits live in [src/assets/images/people](./src/assets/images/people). The page ends with the same closing band as the home page.

## Contact Page

[src/config/contact.ts](./src/config/contact.ts) holds the title and lead, the topics in the "I'd like to" menu, the form labels, the team inboxes, and the offices. Link to `/contact/?topic=<value>` to preselect a topic.

The form stays disabled until `siteConfig.contact.enabled` is `true` and `siteConfig.contact.action` points at your form endpoint. It posts `topic`, `name`, `email`, `company`, `company_size`, and `message`.

## Logo and Favicon

The logo is [src/assets/brand/logo.svg](./src/assets/brand/logo.svg) and the mark is [src/assets/brand/logomark.svg](./src/assets/brand/logomark.svg). Both use `fill="currentColor"`, so they follow the text colour. The wordmark is set in Geist. The favicon is [public/favicon.svg](./public/favicon.svg). Right-clicking the logo offers to copy or download it as SVG.

## Gradients

Two page gradients live in [src/styles/global.css](./src/styles/global.css): `dusk`, a dark sunset under white text for the heroes and the closing band, and `dawn`, a light pastel behind the global payroll section. The page heroes come from [src/components/ui/PageHero.astro](./src/components/ui/PageHero.astro). The story cards use their own gradients in [src/components/home/Stories.astro](./src/components/home/Stories.astro).

Add the `grain` class to any element with `position: relative` and `isolation: isolate` to lay film grain over it, and `grain-light` as well on a light background.

## Theme Tokens

Colours, type sizes, and radii are CSS custom properties at the top of [src/styles/global.css](./src/styles/global.css). `--accent` is the focus ring and highlight colour.

## Motion

Sections fade up as they scroll into view. Add the `reveal` class to animate an element in, with `style="--i:1"` to stagger it. All motion is switched off for visitors who prefer reduced motion.

## Fonts

Libre Franklin and Geist Mono are self-hosted in [public/fonts](./public/fonts) and declared at the top of `global.css`. To change a font, replace the files, update the `@font-face` rules and `--font-sans` or `--font-mono`, and update the preload in [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro).

## Icons

Outline icons are Lucide SVGs in [src/icons/lucide](./src/icons/lucide), used by file name: `<Icon name="globe" />`. To add one, copy its SVG from [lucide.dev](https://lucide.dev/) into that folder. Social icons come from [src/icons/bootstrap](./src/icons/bootstrap).

## Deployment

Run `npm run build` and serve the `dist` folder from any static host. `wrangler.jsonc` is included for Cloudflare Workers.
