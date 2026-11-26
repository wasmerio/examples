<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Local Business](https://github.com/RelayStack/astro-local-business) Astro theme by RelayStack, copied from commit `f516b3b98a1d04928689e0d1a5e628bf930d8013` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-local-business.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Set `site` in astro.config.mjs to the Wasmer demo URL, because 2 home page links pointed at example.ch.
- **Environment variables:** None.
- **Credit:** theme by [RelayStack](https://github.com/RelayStack), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Local Business

**A starter for local service businesses** — tradespeople, studios, clinics, any business that
serves a city and lives or dies on being found in it.

Services and locations are Markdown. Schema, sitemap, `robots.txt` and `llms.txt` are generated at
build time. Ships **zero JavaScript** and one small CSS file, so the Core Web Vitals score that
actually matters (the one Google measures) is not something you have to chase.

```
7 pages · 0 KB JS · 5.6 KB CSS · one config file to edit
```

## Why this exists

Most "Astro + SEO" starters give you a `<head>` component and call it done. Local businesses need
four things that a `<head>` component doesn't provide:

1. **One page per service and per city.** A single "Leistungen" section can't rank for
   "Sanitär-Notdienst" and "Badsanierung" and "Sanitär in <city>" at the same time.
2. **A correct `LocalBusiness` graph.** Name, address and phone that match the Google Business
   Profile exactly. Mismatches cost local rankings, and they're invisible until you check.
3. **A sitemap that matches reality.** Generated from the same collections the pages come from, so
   it can't list deleted URLs.
4. **`llms.txt`.** Not for Google — for ChatGPT, Claude and Perplexity, which is where an
   increasing share of "who should I call for this" questions get answered.

## Quick start

```bash
npm create astro@latest -- --template RelayStack/astro-local-business
# or
git clone https://github.com/RelayStack/astro-local-business
cd astro-local-business && npm install
npm run dev
```

Then edit **`src/config.ts`**. It is the only file you have to touch to make this someone's site:
business name, address, phone, opening hours, price range, service area. The layout, footer,
schema and `llms.txt` all read from it, so they cannot contradict each other.

```ts
export const site = {
  name: "Muster Sanitär AG",
  url: "https://example.ch",      // ← must match the real domain
  phone: "+41 00 000 00 00",
  address: { street: "Musterstrasse 1", zip: "0000", city: "Musterstadt", country: "CH" },
  hours: [{ days: ["Monday", "Tuesday"], opens: "07:30", closes: "17:00" }],
  areaServed: ["Musterstadt", "Beispieldorf"],
  // ...
};
```

`src/config.ts` also drives `astro.config.mjs`'s `site`, which drives every canonical URL. Set it
before you deploy, not after.

## Adding a service or a location

Drop a Markdown file in `src/content/services/` or `src/content/locations/`. The filename becomes
the URL.

```md
---
title: Sanitär-Notdienst
description: 120–160 characters. Becomes the meta description and the llms.txt line.
from: "CHF 180 Pauschale"
order: 1
faqs:
  - q: Was kostet ein Notdienst-Einsatz?
    a: A short, self-contained answer. This is what gets quoted back to you.
---

Your content. Written for a person, not a crawler.
```

The FAQ frontmatter is emitted as `FAQPage` schema *and* rendered as a `<details>` block, from one
source. Editing an answer in the Markdown updates both.

## What's generated

| File | Source | Notes |
| --- | --- | --- |
| `/sitemap.xml` | services + locations collections | Native endpoint, no `@astrojs/sitemap` dependency |
| `/robots.txt` | `src/pages/robots.txt.ts` | Allows AI crawlers on purpose |
| `/llms.txt` | `src/config.ts` + collections | Contact details, services, service area |
| JSON-LD | `src/lib/schema.ts` | `LocalBusiness`, `Service`, `FAQPage`, `BreadcrumbList` |

A note on `llms.txt`: **Google ignores it entirely.** It exists for AI assistants. If someone tells
you it helps you rank, they're wrong, and this template won't pretend otherwise.

## Schema rules this template follows

These are the mistakes that quietly cost local sites their rich results:

- **One `LocalBusiness` node per page, never several.** Competing nodes are worse than none.
- **One `@id` per business.** Service pages reference the business by `@id` instead of re-declaring
  a second business with a slightly different name.
- **Location pages state `areaServed`, not a second address.** Two addresses for one business reads
  as two businesses.
- **`geo` is omitted unless you set it.** A wrong coordinate is worse than no coordinate.

## Deploying

Static output — any host works. `npm run build` produces `dist/`.

- **Cloudflare Pages**: build `npm run build`, output `dist`
- **Netlify**: build `npm run build`, publish `dist`
- **Vercel**: detected automatically

Whichever you pick, add the custom domain and check that `https://your-domain/sitemap.xml` resolves
before you submit it anywhere.

## After you deploy

1. Submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
2. Create or claim the Google Business Profile. Business name, address and phone must match
   `src/config.ts` character for character — that consistency is most of local SEO.
3. Check one page in the [Rich Results Test](https://search.google.com/test/rich-results).
4. Fetch `/robots.txt` and confirm it points at the right sitemap.

## Writing content that isn't a doorway page

Location pages only help if each one says something true about that place. A page that swaps the
city name into identical paragraphs is a doorway page, and search engines have filtered those for
years. Write what's genuinely different: which neighbourhoods, which building stock, how long the
drive is, what's common there. This template gives you the structure; it can't give you the facts.

## Companion project

If you generate the SEO files from a Markdown directory outside Astro, or you want `IndexNow`
submission and a pre-deploy validator, see
[`astro-seo-toolkit`](https://github.com/RelayStack/astro-seo-toolkit). This template intentionally
uses native Astro endpoints so it has no extra dependency.

## License

MIT — see [LICENSE](LICENSE).
