# JSON-LD with `schema-dts`

Type-safe pattern for authoring JSON-LD payloads with [`schema-dts`](https://www.npmjs.com/package/schema-dts) and rendering them with [`JsonLd`](../components/json-ld.md).

## Install

```bash
pnpm add -D schema-dts
```

## Pattern

```astro
---
import { JsonLd } from "eminence-astro-suite/components";
import type { WithContext, Thing } from "schema-dts";

// Replace `Thing` with the specific schema type you need (e.g. `Article`, `Organization`).
const schema: WithContext<Thing> = {
  "@context": "https://schema.org",
  "@type": "Thing",
  // typed fields
};
---

<JsonLd jsonLd={schema} />
```

`JsonLd` accepts a typed object directly (serializes and escapes internally) or a pre-serialized string.

## Example 1 — Organization + WebSite graph (homepage)

```astro
---
import { JsonLd } from "eminence-astro-suite/components";
import type { Organization, WebSite, WithContext } from "schema-dts";

const organization: Organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Acme Studio",
  url: "https://acme.example",
  logo: "https://acme.example/logo.png",
  sameAs: ["https://github.com/acme", "https://www.linkedin.com/company/acme"],
};

const website: WebSite = {
  "@type": "WebSite",
  name: "Acme Studio",
  url: "https://acme.example",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://acme.example/search?q={query}",
    "query-input": "required name=query",
  },
};

const graph: WithContext<{ "@graph": [Organization, WebSite] }> = {
  "@context": "https://schema.org",
  "@graph": [organization, website],
};
---

<JsonLd jsonLd={graph} />
```

## Example 2 — `BlogPosting` (content pages)

```astro
---
import { JsonLd } from "eminence-astro-suite/components";
import type { BlogPosting, WithContext } from "schema-dts";

const article: WithContext<BlogPosting> = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "How We Cut Build Times by 40%",
  description: "A practical breakdown of profiling, caching, and CI tuning.",
  datePublished: "2026-04-21",
  dateModified: "2026-04-25",
  author: { "@type": "Person", name: "Sam Rivera" },
  publisher: {
    "@type": "Organization",
    name: "Acme Studio",
    logo: { "@type": "ImageObject", url: "https://acme.example/logo.png" },
  },
  image: ["https://acme.example/images/build-times-cover.jpg"],
  mainEntityOfPage: "https://acme.example/blog/cut-build-times",
};
---

<JsonLd jsonLd={article} />
```

## Example 3 — `Product` (commerce pages)

```astro
---
import { JsonLd } from "eminence-astro-suite/components";
import type { Product, WithContext } from "schema-dts";

const product: WithContext<Product> = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Noise-Canceling Headphones X200",
  image: ["https://acme.example/images/x200.jpg"],
  description: "Wireless over-ear headphones with adaptive ANC.",
  sku: "X200-BLK",
  brand: { "@type": "Brand", name: "Acme Audio" },
  offers: {
    "@type": "Offer",
    url: "https://acme.example/products/x200",
    priceCurrency: "USD",
    price: "199.00",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.7",
    reviewCount: "128",
  },
};
---

<JsonLd jsonLd={product} />
```

## Tips

- Prefer a single `JsonLd` block per page; combine multiple entities with `@graph` (Example 1).
- Use canonical URLs in `url`, `mainEntityOfPage`, `offers.url`, etc.
- Generate values from real page data — do not hardcode dates or prices that drift from the rendered content.
- Pass typed objects, not hand-built strings. `JsonLd` escapes `<`, `>`, `&` automatically.

## Cross-references

- Component: [../components/json-ld.md](../components/json-ld.md).
- `schema-dts`: <https://www.npmjs.com/package/schema-dts>.
- Schema.org: <https://schema.org/>.
