# Changelog

All notable changes to Maria are documented here.

## 3.0.1 - 2026-10-21

- Updated Astro to 7.4.1 and other dependencies.
- Updated `AGENTS.md` for Astro 7.

## 3.0.0 - 2026-10-08

- Redesigned the theme with a warm neutral palette, a lime accent, larger editorial type, and refined light and dark modes.
- Replaced Manrope with self-hosted Hanken Grotesk and Instrument Serif.
- Added a new logo mark and favicon.
- Redesigned the homepage with an availability badge, a serif-accented headline, key facts, services, and testimonials.
- Case studies are now MDX files in a content collection, with a page for every project.
- Added new case studies and product screenshots for Nextpoint, b.combs, Nestara, and BoardSpeak.
- Case study pages show the client, year, role, duration, team, services, and a "Next case study" card.
- Added `Figure` and `Stats` components for case studies.
- Project cards are tinted per project, with a cropped cover and a hover zoom.
- Redesigned the work index, About, Resume, and 404 pages.
- Added principles to the About page and education and an optional PDF download to the Resume page.
- Added a closing "Let's talk" panel above the footer.
- Redesigned the footer with page, social, and legal columns.
- Privacy, Terms, and Cookie Policy are now MDX pages with a shared layout.
- Rebuilt the cookie banner and preferences dialog on the native dialog element.
- Replaced the mobile menu with a full-screen dialog.
- Added entrance and scroll-reveal motion in CSS.
- Case studies use a crop of their cover as the social image.
- Added JSON-LD for profile pages, case studies, and breadcrumbs.
- Added a new preview image and Open Graph image.
- Moved site settings to `src/config/site.ts` and page copy to `src/config/home.ts`, `about.ts`, and `resume.ts`.
- Moved styles to `src/styles/global.css` with design tokens for color, type, and shadows.
- Added a local icon set and `Icon` component.
- Added `CUSTOMIZATION.md`, `CONTRIBUTING.md`, `wrangler.jsonc`, Prettier, and `check` and `release:check` scripts.
- Updated Astro to 7.3, MDX to 8, and all other dependencies.
- Removed the `SITE_URL` and `PUBLIC_SITE_URL` environment variables in favor of `siteConfig.siteUrl`.
- Removed the "Other" header menu, `netlify.toml`, and the Manrope font package.

## 2.0.0 - 2026-07-02

- Upgraded the theme to Astro 7.
- Updated the Astro MDX integration, Tailwind CSS packages, Sharp, Vite, and related dependencies.
- Equalized homepage project card heights.

## 1.0.0 - 2026-07-02

- Initial release.
- Homepage, work listing, case study, about, resume, privacy, terms, cookies, and 404 pages.
- Shared site configuration, SEO defaults, structured data, sitemap generation, and `robots.txt`.
- Persistent light and dark mode, cookie consent, responsive portfolio images, and self-hosted Manrope.
