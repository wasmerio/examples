# Architecture map

```text
src/data/
  global/       site, company and SEO data
  navigation/   header and footer data
  sections/     reusable section content
src/components/
  starwind/     source owned Starwind UI components
  ui/           FORMA UI and shared layout components
src/layouts/    document and page layouts
src/pages/      routes
src/styles/     tokens, foundations, motion and component styles
src/scripts/    asset and build pipeline
```

Astro is the default rendering layer. Starwind supplies accessible interactive components. Lenis is available for intentional smooth scrolling. Keep client side JavaScript limited to real interaction needs.
