# FORMA, customization guide

This guide explains how to adapt FORMA for a construction or renovation business. The English homepage is at `/`; the Polish homepage is at `/pl/`.

## Start here

```bash
npm ci
npm run dev
```

The homepage is assembled from JSON data. Change content in `src/data`, not directly in Astro components.

## Brand and company data

Update:

```text
src/data/global/company.json
src/data/global/seo.json
src/data/navigation/header.json
src/data/navigation/footer.json
site.config.mjs
```

Use `company.json` for company details, branding and social links. Use `seo.json` for page titles, descriptions and indexing settings.

## Homepage content

The FORMA homepage uses the following data files:

```text
src/data/global/site.json
src/data/global/company.json
src/data/global/seo.json
src/data/navigation/header.json
src/data/navigation/footer.json
src/data/sections/hero.json
src/data/sections/services.json
src/data/sections/projects-section.json
src/data/sections/why-section.json
src/data/sections/process-section.json
src/data/sections/testimonials-section.json
src/data/sections/area-section.json
src/data/sections/faq-section.json
src/data/sections/contact-section.json
```

Update the relevant JSON files when changing site content. Some labels, service actions and footer text are currently in `src/components/ui/organisms/` and `src/components/ui/molecules/SiteNavbar.astro`. The homepage composition is in `src/pages/index.astro`.

## Service area map

Edit the single `location` object in `src/data/sections/area-section.json` to change the map. It owns the latitude, longitude, full and short labels, city zoom and district zoom. The area section and every map variant derive their tile coordinates, marker position, embed bounds, titles and OpenStreetMap or Google Maps links from this object. Keep coordinates within latitude `-90` to `90` and longitude `-180` to `180`; zoom values must be integers from `0` to `19`.

The contact form validates locally and shows a demo confirmation. It does not send messages. Connect and test your own backend before using it to collect inquiries.

Company details, reviews, project descriptions and service coverage are demonstration material. Replace them with verified business information before publishing a real business website. Check `src/data/global/company.json` as well as section data.

## Images

The homepage uses neutral SVG placeholders in `public/assets/placeholders/`. Replace their references in components and JSON with your own cleared images. Place source photographs in `src/assets/raw/` and run `npm run assets:img` when using the asset pipeline; generated photographs are written to `public/assets/images/`.

Use descriptive `alt` text for every image. Do not put private client assets into the repository.

## Colors and typography

Review the design tokens in `design/`, `src/styles/themes.css` and `src/styles/global.css`. Keep token names stable so existing components continue to work.

## Validation

```bash
npm run ai:check
npm run build
```

Open the generated site on desktop and mobile before publishing.

## Deployment

Set `PUBLIC_SITE_URL` and `PUBLIC_BASE_PATH` using `.env.example`, then run `npm run build`. Review `src/data/global/seo.json` before enabling indexing. The demo ships with indexing disabled. See [the deployment guide](deployment.md) for the full process.
