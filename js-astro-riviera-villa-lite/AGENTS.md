# AGENTS.md

Guide for AI coding assistants working on this project: a direct-booking website for one holiday rental, built with the Riviera Villa theme (Astro 7, Tailwind CSS 4, TypeScript strict).

## Where things live

- **All content and settings: `villa.config.ts`.** Name, address, capacity, texts in every language, photos, rates, reviews, FAQ, rules, contact, colours, fonts, legal details. Change content there, never in components.
- Validation rules of that file: `src/config/schema.ts` (zod). The build runs them with readable messages (`src/config/validate.ts`).
- Interface texts (menu, form, calendar): `src/i18n/ui/<language>.ts`, typed by `src/i18n/ui/types.ts`.
- Legal notice and privacy templates: `src/i18n/legal.ts`.
- Page order of the home page: `src/views/home-page.astro`. One component per section in `src/components/` (`house-section.astro`, `gallery-section.astro`...).
- Photos: `src/assets/photos/`, referenced by file name in `villa.config.ts`.
- Styles: Tailwind utilities plus the tokens of `src/styles/global.css`.

## Replace the demo villa with a real property

1. Photos: copy them into `src/assets/photos/` (landscape, 1800 px wide or more; `hero.jpg` 2400 px). Remove unused demo files.
2. In `villa.config.ts`, rewrite every block. Keep one line per language in translated texts (`{ fr: '...', en: '...' }`), and only the languages of `languages.active`.
3. `site.url`: the final address. `site.demoNotice`: delete it.
4. `property.geo`: latitude and longitude with at least 5 decimals (write `'43.22130'` as a string when it ends with 0). `property.id`: a stable slug, never changed afterwards.
5. `property.registrationNumber`: the tourist rental number (France: required and shown in the footer), or `''`.
6. `gallery`: at least 8 photos with `category` set; at least one `bedroom`, one `bathroom` and one `common`. Write a real description in `alt` for each language.
7. `rates.seasons[].ranges`: month-day pairs (`['07-01', '08-31']`), used to warn about the minimum stay. A range may cross New Year (`['12-20', '01-03']`).
8. `reviews`: keep the text as the guest wrote it and set `lang`. Set `source` honestly: only `'direct'` reviews may go into Google structured data.
9. `booking`: `provider` and `key` (Web3Forms access key, a UUID; or Formspree form ID, the end of `https://formspree.io/f/...`), or `provider: 'none'`.
10. `legal`: the publisher's real details, or `noticeUrl` pointing to a legal notice the owner already publishes.
11. Run the checks below.

## Checks to run after every change

```sh
npm run check   # astro check: must report 0 errors
npm test        # vitest: must pass
npm run build   # must end with "Complete!"
```

## Code rules

- TypeScript strict. Never `any`: use `unknown` and narrow it.
- Named exports. Component files in kebab-case (`booking-bar.astro`), one component per file.
- Logic in `src/lib/` (pure, unit-tested) or `src/scripts/` (browser code), markup in components.
- Write text through the config or `src/i18n/`; a component never contains a sentence in one language.
- Use the theme tokens rather than raw colours: `bg-cream`, `bg-surface`, `bg-sand`, `text-ink`, `text-muted`, `border-line`, `border-line-strong`, `bg-accent`, `text-accent-ink`, `bg-accent-soft`, `font-serif`, `font-sans`.
- Keep the design language: cream background, generous spacing, thin rules, numbered items (`01`, `02`), large rounded photos, one accent colour. No dark section backgrounds.
- Accessibility: every image has a translated `alt`, every field a `<label>`, every icon-only button an `aria-label`; keyboard access and visible focus; respect `prefers-reduced-motion`.
- JavaScript: plain TypeScript in `<script>` tags, no UI framework, no heavy library.
- Privacy is a feature: no cookie, no analytics, no font or map loaded from a third party. Fonts are self-hosted with Fontsource (`src/styles/fonts.css`).

