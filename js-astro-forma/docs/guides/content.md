# Content guide

The homepage composition is defined in `src/pages/index.astro` for English and `src/pages/pl/index.astro` for Polish. The `/en/` alias has its own composition in `src/pages/en/index.astro`; keep it aligned when changing the English homepage. The main English homepage is `/`; the Polish homepage is `/pl/`.

Edit the matching JSON file in `src/data/` for site details, navigation, SEO and section content. Some labels or composition settings are defined in Astro components; check the component when a JSON-only edit does not change what appears on screen.

All company information, project descriptions, service areas and testimonials are fictional demo content. Replace them with accurate information for the actual business. The contact form performs browser-side validation and shows a demo confirmation. It does not send or store form entries.

The public production build includes the homepages and example privacy pages. Development and QA routes are excluded. The default SEO configuration is `noindex, nofollow` until you change it.
