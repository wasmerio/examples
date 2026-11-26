# Content map

| Content | File or directory |
| --- | --- |
| Site metadata | `src/data/global/site.json` |
| Company details | `src/data/global/company.json` |
| SEO defaults | `src/data/global/seo.json` |
| Header navigation | `src/data/navigation/header.json` |
| Footer navigation | `src/data/navigation/footer.json` |
| Hero content | `src/data/sections/hero.json` |
| Services content | `src/data/sections/services.json` |
| Projects | `src/data/sections/projects-section.json` |
| Collaboration principles | `src/data/sections/why-section.json` |
| Process | `src/data/sections/process-section.json` |
| Demo testimonials | `src/data/sections/testimonials-section.json` |
| Service area copy and map location | `src/data/sections/area-section.json` |
| FAQ | `src/data/sections/faq-section.json` |
| Demo contact form | `src/data/sections/contact-section.json` |
| Site URL and build scope | `site.config.mjs` |

Change JSON data first when the request concerns visible text, links, metadata or section order.

Some labels and footer links are defined in the homepage organisms and `SiteNavbar.astro`. Homepage order and production variants are selected in `src/pages/index.astro`. Generic footer JSON applies to shared subpages, while the homepage uses `FooterSection.astro`.

The `location` object in `area-section.json` is the single source for map coordinates, labels and zoom levels. Map tiles, marker placement, iframe bounds, titles and location links are derived from it.
