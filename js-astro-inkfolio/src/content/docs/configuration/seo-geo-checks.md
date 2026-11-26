---
title: SEO and GEO checks
order: 6
description: What `npm run seo` verifies after a build, and why the build runs it.
---

After `npm run build` the theme checks its own output. It is not a ranking tool; it catches the structural mistakes that silently cost pages their metadata.

```bash
npm run seo          # against the existing dist/
```

It walks every built HTML file and reports:

- pages missing `<link rel="canonical">`
- pages with no JSON-LD, or JSON-LD that does not parse
- `hreflang` that only lists one language (an alternates set must be reciprocal)
- a missing `llms.txt` or `sitemap.xml`
- duplicate `<title>` across pages

Missing canonical, unreliable JSON-LD or broken hreflang fails the check; the build prints the report and keeps going rather than blocking a content fix.

`llms.txt` is generated at build time from the post and doc collections, so it cannot drift from what is actually published. Its `description` lines come from each entry's frontmatter — empty descriptions produce shorter entries, not broken ones.
