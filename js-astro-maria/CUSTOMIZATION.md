# Customization Guide

Use this guide when adapting Maria for your own portfolio.

## Site Settings

Edit [src/config/site.ts](./src/config/site.ts) first. It holds your name and role, the default metadata, the canonical domain, the header button, the availability badge, the cookie banner switch, and your social links.

Set `siteConfig.siteUrl` before building for production. Canonical URLs, social image URLs, `robots.txt`, the sitemap, and JSON-LD all derive from it.

| Key             | What it controls                                                                                   |
| --------------- | -------------------------------------------------------------------------------------------------- |
| `name`          | The wordmark in the header and footer, and the `<title>` suffix on every page                      |
| `title`         | The homepage `<title>` and the default social title                                                |
| `description`   | The default meta description                                                                       |
| `siteUrl`       | The production domain, without a trailing slash                                                    |
| `language`      | The `lang` attribute and the language in structured data                                           |
| `locale`        | The Open Graph locale, for example `en_US`                                                         |
| `dateLocale`    | How dates on the legal pages are written, for example `en-US` or `en-GB`                           |
| `socialImage`   | The default Open Graph and Twitter/X image, a path in `public/`                                    |
| `author`        | Your name, role, location, and email, used in the footer, CTAs, and JSON-LD                        |
| `availability`  | The pill above the homepage headline; set `enabled: false` to remove it                            |
| `action`        | The button at the end of the header and in the mobile menu                                         |
| `resumePdf`     | A PDF in `public/` offered on the resume page; leave empty to hide the button                      |
| `cookieConsent` | Set `enabled: false` to remove the cookie banner, dialog, and footer button                        |
| `socials`       | The links in the footer; LinkedIn, Dribbble, Behance, Instagram, GitHub, and X get their own icons |

`navigation` in the same file is the header and mobile menu, and `legalLinks` is the footer's Legal column.

The logo mark is [src/components/ui/Logomark.astro](./src/components/ui/Logomark.astro), an inline SVG used in the header, mobile menu, and footer. Replace its contents with your own mark. The favicon is [public/favicon.svg](./public/favicon.svg).

## Homepage

The homepage is assembled in [src/pages/index.astro](./src/pages/index.astro) from sections in [src/components/home](./src/components/home), with copy in [src/config/home.ts](./src/config/home.ts):

| Section        | Component                               | Config key     |
| -------------- | --------------------------------------- | -------------- |
| Hero and facts | `Hero.astro`                            | `hero`         |
| Case studies   | `index.astro`, `work/ProjectCard.astro` | `work`         |
| Services       | `Services.astro`                        | `services`     |
| Testimonials   | `Testimonials.astro`                    | `testimonials` |
| Closing panel  | `chrome/SiteFooter.astro`               | `closing`      |

The hero headline is `greeting`, `title`, then `highlight`, which is set in the serif italic. `work.limit` sets how many case studies appear; projects with `featured: true` come first. Service icons are file names from [src/icons/lucide](./src/icons/lucide). Remove a component from `index.astro` to drop its section.

The closing panel appears above the footer on every page except the legal pages and the 404. Pass `closing={false}` to `BaseLayout` to hide it on any other page.

## Case Studies

Each case study is a folder in [src/content/work](./src/content/work) holding an `index.mdx` and the images it uses:

```text
src/content/work/nextpoint/
|-- index.mdx
|-- cover.webp
`-- transcript-viewer.webp
```

The folder name is the URL: `src/content/work/nextpoint/` becomes `/work/nextpoint/`. Frontmatter is validated by [src/content.config.ts](./src/content.config.ts):

```yaml
---
title: Making legal transcripts easier to scan, summarize, and act on with AI
client: Nextpoint
summary: Nextpoint needed a calmer way to surface transcript activity and AI summaries.
year: 2026
role: Lead product designer
services: [UX audit, Dashboard redesign, Design system]
duration: 14 weeks
team: 1 PM, 4 engineers
cover: ./cover.webp
coverAlt: Nextpoint dashboard with transcript counts and an AI summary
tint: '#dff59a'
order: 1
featured: true
url: https://example.com
---
```

| Field      | Notes                                                                            |
| ---------- | -------------------------------------------------------------------------------- |
| `title`    | Required. The card headline and the case study's `<h1>`                          |
| `client`   | Required. Shown on cards, in the breadcrumb, and in the page title               |
| `summary`  | Required. The lede under the heading and the meta description                    |
| `year`     | Required. Shown on cards and in the details row                                  |
| `role`     | Required. Shown in the details row                                               |
| `services` | Chips on the case study; the first three also appear on cards                    |
| `duration` | Optional, shown in the details row                                               |
| `team`     | Optional, shown in the details row                                               |
| `cover`    | Required. The card image, the case study hero, and the source of its social card |
| `coverAlt` | Required. Alt text for the cover                                                 |
| `tint`     | The panel color behind the cover and figures, as a six-digit hex color           |
| `order`    | Position on the homepage and work index; lower comes first. Defaults to `100`    |
| `featured` | Featured projects come first on the homepage                                     |
| `draft`    | `true` keeps the case study out of every page, listing, and the sitemap          |
| `url`      | Optional link to the live product, shown as a button in the details row          |

Covers work best at 16:10, around 3200x2000 pixels. Cards crop them from the top left, so put the most important part of the screen there. In dark mode the tint is mixed into the dark surface automatically.

The work index lists six case studies per page; change `workPageSize` in [src/lib/work.ts](./src/lib/work.ts). Extra pages live at `/work/page/2/` and so on.

### Writing the body

The body is regular Markdown with two extra components available without an import:

```mdx
import transcriptViewer from './transcript-viewer.webp';

## What I did

<Figure
  src={transcriptViewer}
  alt="Transcript viewer with an AI summary panel"
  caption="Every key moment links back to the testimony."
/>

<Stats
  items={[
    { value: '38%', label: 'faster first review' },
    { value: '2.4x', label: 'more summaries opened' },
    { value: '91%', label: 'of contradictions reviewed' },
  ]}
/>
```

- `Figure` frames an image in the project's tint, full width. Add `plain` to drop the frame.
- `Stats` shows two or three outcome numbers in a row.
- A plain Markdown image, `![Alt text](./image.webp)`, is shown full width with rounded corners.
- A blockquote is set as a large serif pull quote.
- The first paragraph is styled as an introduction.

The components live in [src/components/mdx](./src/components/mdx). To add your own, create an `.astro` component there and add it to [src/components/mdx/index.ts](./src/components/mdx/index.ts).

## About and Resume

The About page copy lives in [src/config/about.ts](./src/config/about.ts): the headline, intro, the editorial sections, and the principles. Replace the portrait at [src/assets/images/maria.webp](./src/assets/images/maria.webp), which is also used in the homepage availability badge, and update `portraitAlt`.

The Resume page reads [src/config/resume.ts](./src/config/resume.ts): the snapshot, experience, capabilities, education, and tools. Tool logos are SVG files in [src/assets/logos](./src/assets/logos); set `dark: true` for a logo that needs a dark tile. To offer a PDF, put it in `public/` and set `siteConfig.resumePdf` to its path, for example `/maria-resume.pdf`.

## Legal Pages

Privacy, Terms, and Cookie Policy are MDX pages in [src/pages](./src/pages) that share [src/layouts/LegalLayout.astro](./src/layouts/LegalLayout.astro). Edit the text directly, and set `updated` in the frontmatter whenever you change one. They are marked `noindex` and left out of the sitemap.

The bundled text is a starting point, not legal advice. Have it reviewed for your situation.

## Cookie Consent

The banner and preferences dialog live in [src/components/chrome/CookieConsent.astro](./src/components/chrome/CookieConsent.astro). Choices are saved in `localStorage` under `maria-cookie-consent`; the color theme is saved under `maria-theme`. Analytics and marketing are off until a visitor allows them.

Load optional scripts only after checking consent:

```html
<script>
  if (window.mariaCookieConsent?.canUse('analytics')) {
    // load analytics
  }

  window.addEventListener('maria:cookieConsentChanged', (event) => {
    if (event.detail.analytics) {
      // load analytics
    }
  });
</script>
```

`window.mariaCookieConsent` also has `getConsent()`, `hasConsent()`, and `openPreferences()`. Any element with a `data-cookie-preferences` attribute opens the dialog, like the footer button. When you connect a real tool, describe it on the Cookie Policy and Privacy pages. If you do not use any optional tools, set `cookieConsent.enabled` to `false`.

## Theme Tokens

Colors, shadows, the header height, and the page width are CSS custom properties at the top of [src/styles/global.css](./src/styles/global.css), defined once in `:root` and again for dark mode in `:root.dark`:

```css
:root {
  --canvas: #fafaf7;
  --surface: #ffffff;
  --sunken: #f2f2ed;
  --line: #e6e5df;
  --ink: #121211;
  --body: #3b3b38;
  --muted: #6a6964;
  --accent: #d4f84a;
  --on-accent: #121211;
  /* ... */
}
```

To rebrand, change `--accent` and `--accent-strong`, its hover state. `--on-accent` is the text color on top of the accent and needs enough contrast against it. The `--night` tokens color the closing panel, which stays dark in both modes.

The tokens are also Tailwind colors, so `bg-sunken`, `text-muted`, `border-line`, and `bg-accent` work in markup. The type scale (`text-display`, `text-headline`, `text-section`, `text-title`, `text-lead`) is defined in the `@theme` block of the same file.

Shared pieces such as `.btn`, `.eyebrow`, `.serif`, `.chip`, and the case study `.prose` styles are in the components layer of `global.css`.

## Light and Dark Mode

Maria follows the visitor's system setting until they press the theme toggle; their choice is then remembered. The script in [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro) applies the mode before the first paint, so there is no flash.

Dark mode is the `dark` class on `<html>`. Use the `dark:` variant in markup, or `.dark` in CSS.

## Fonts

Hanken Grotesk and Instrument Serif are self-hosted in [public/fonts](./public/fonts) and declared at the top of `global.css`. Only the serif italic is bundled, since it is only used for accents. To change them, replace the files, update the `@font-face` rules, set `--font-sans` and `--font-serif` in the `@theme` block, and update the preloaded file in `BaseLayout.astro`.

## Icons

Interface icons are SVG files in [src/icons/lucide](./src/icons/lucide) (Lucide) and brand marks in [src/icons/bootstrap](./src/icons/bootstrap) (Bootstrap Icons), rendered by [src/components/ui/Icon.astro](./src/components/ui/Icon.astro):

```astro
<Icon name="arrow-right" class="size-4" />
<Icon name="social-linkedin" class="size-4" />
```

To add an icon, save its SVG from [lucide.dev](https://lucide.dev/) into `src/icons/lucide` and use its file name. To give a new social link its own icon, add the Bootstrap SVG and map its label in [src/lib/socials.ts](./src/lib/socials.ts).

## Motion

Headlines rise in on load and sections fade up as they scroll into view, both in CSS. Scroll reveals use scroll-driven animations and are skipped in browsers without them. Everything is off when the visitor prefers reduced motion. Add `rise` or `reveal` to an element to opt it in; `style="--rise-step: 2"` staggers a `rise`.

## SEO

- Every page has a canonical URL, Open Graph and Twitter/X tags, and JSON-LD: `WebSite` and `Person` on most pages, `ProfilePage` on About and Resume, and `CreativeWork` with `BreadcrumbList` on case studies.
- Case studies use a 1200x630 crop of their cover as the social image. Other pages use [public/og-image.png](./public/og-image.png).
- `/sitemap-index.xml` is generated by `@astrojs/sitemap`, and `/robots.txt` points to it.
- URLs end with a trailing slash; keep internal links in that form.

## Deployment

`npm run build` writes the static site to `dist/`. [vercel.json](./vercel.json) configures Vercel and [wrangler.jsonc](./wrangler.jsonc) deploys to Cloudflare Workers with `npx wrangler deploy`. Any other static host works with `dist/` as the output directory and `npm run build` as the build command. Delete the config files for hosts you do not use.
