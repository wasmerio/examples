# Add Structured Data (JSON-LD)

Out of the box the template emits `BlogPosting` and `BreadcrumbList` on every blog post (`src/pages/[...blog]/index.astro`, `src/components/common/Breadcrumbs.astro`) and `FAQPage` from the `FAQs` widget when it receives `schema`. `src/components/common/Metadata.astro` handles title, description, canonical, robots, Open Graph (including `article:*`) and Twitter through `astro-seo`. Anything else (Organization, Product, HowTo…) is added as described below.

## What the home page ships

`src/pages/index.astro` emits `WebSite` and `Organization` JSON-LD through the layout's `head` slot, built only from `src/config.yaml` (`site.name`, `site.site`, the X handle in `metadata.twitter`), so nothing there needs replacing. Extend the `structuredData` array in that file to add a description, a logo of your own, more `sameAs` profiles or contact data.

## Site-wide (Organization / WebSite)

The home page already emits `WebSite` (with an `Organization` publisher) from `site.name` and `site.site`. To add an `Organization` with logo, social profiles or contact data, extend the `structuredData` array in `src/pages/index.astro`; to emit something on every page, render `StructuredData` inside `src/layouts/Layout.astro` next to the `head` slot.

## Per page

`src/components/common/StructuredData.astro` takes a `schema` object (or an array of them) and prints it as JSON-LD. Pass it through the `head` slot that `Layout.astro` and `PageLayout.astro` expose:

```astro
---
import Layout from '~/layouts/PageLayout.astro';
import StructuredData from '~/components/common/StructuredData.astro';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Acme',
  url: 'https://acme.example',
  logo: 'https://acme.example/logo.png',
};
---

<Layout metadata={metadata}>
  <StructuredData slot="head" schema={schema} />
  …
</Layout>
```

JSON-LD is also valid anywhere in the body if a slot is not available (widgets like `FAQs` do that).

## Blog posts (Article)

Already done: `src/pages/[...blog]/index.astro` builds this object from the front matter (`publishDate`, `updateDate`, `author`, `category`, `tags`, `image`). Extend it there if you need more properties:

```ts
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.excerpt,
  datePublished: post.publishDate.toISOString(),
  dateModified: (post.updateDate ?? post.publishDate).toISOString(),
  author: post.author ? { '@type': 'Person', name: post.author } : undefined,
  image: typeof image === 'string' ? image : image?.src,
  mainEntityOfPage: String(url),
};
```

Render it with `<script type="application/ld+json" set:html={JSON.stringify(articleSchema)} />`.

## Notes

- Always use `set:html` with `JSON.stringify`; never interpolate user content directly.
- Validate with https://validator.schema.org/ or Google's Rich Results Test.
- `astro-compress` minifies HTML but leaves `application/ld+json` scripts intact.
