# SEO integrity rules

Hard rules for honest-seo-expert. When in doubt, leave it out.

## Allowed

| Pattern                 | Rule                                                                |
| ----------------------- | ------------------------------------------------------------------- |
| `title` / `description` | Accurate, concise, unique per page; from Paraglide messages         |
| `canonical`             | Points to the authoritative URL for this content (locale-aware)     |
| `openGraph`             | Matches title, description, and a real page image                   |
| `languageAlternates`    | Every published locale gets a correct hreflang entry                |
| `jsonLd`                | Types justified by visible content; typed with `schema-dts`         |
| `robots`                | Reflects real intent (index/noindex); no hiding user-facing content |
| Image `alt`             | Describes the image for a user who cannot see it                    |

## Forbidden

| Pattern                                                    | Why                                               |
| ---------------------------------------------------------- | ------------------------------------------------- |
| Keyword-stuffed titles                                     | Misleading; hurts trust and can trigger penalties |
| Duplicate titles/descriptions across pages                 | Hides unique value of each page                   |
| `AggregateRating` without real reviews on the page         | Fabricated social proof                           |
| `Review` schema for testimonials not shown to users        | Hidden structured data                            |
| `Offer` with wrong price, currency, or availability        | Mismatch with visible price                       |
| `FAQPage` for questions not on the page                    | Invisible FAQ rich results                        |
| Hidden H1/H2 or off-screen keyword blocks                  | Cloaking                                          |
| `alt` with comma-separated keywords                        | SEO spam; harms screen reader UX                  |
| `alt` duplicating the surrounding paragraph                | Redundant noise for assistive tech                |
| Hand-written `<meta>` tags bypassing eminence-astro-suite  | Breaks single source of truth                     |
| `sameAs` URLs that are not real profiles                   | False entity graph                                |
| `dateModified` / `datePublished` that do not match content | Stale or false freshness signals                  |

## JSON-LD type selection

| Page type      | Typical `@type`                       | Requirement                                   |
| -------------- | ------------------------------------- | --------------------------------------------- |
| Homepage       | `Organization` + `WebSite` (`@graph`) | Org name/logo must match site branding        |
| Article / blog | `BlogPosting` or `Article`            | Headline, author, dates match visible article |
| About          | `AboutPage` + `Organization`          | Content describes the real organization       |
| Contact        | `ContactPage`                         | Real contact methods shown on page            |
| Product        | `Product` + `Offer`                   | Price, SKU, availability match UI             |

Do not add schema types "for SEO" if the page does not substantiate them.

## Alt text examples

**Product photo** — Good: `Black wireless headphones on a white desk`. Bad: `best wireless headphones buy cheap audio ANC 2026`.

**Team photo** — Good: `Three team members collaborating at a conference table`. Bad: `SEO agency experts digital marketing Barcelona`.

**Decorative border** — Good: `alt=""`. Bad: omitting alt or `alt="decorative image divider line"`.

**Logo linked to home** — Good: `alt="Acme Studio home"`. Bad: `alt="Acme Studio best web design company"`.

## i18n SEO

- Each locale is a real translation, not machine-gibberish for ranking.
- `hreflang` pairs must be reciprocal (es page links en, en links es).
- Base locale (`es`) has no URL prefix; `en` uses `/en/...` — canonicals must respect this.

## Integration config vs page props

| Scope                                                          | Where                                                   |
| -------------------------------------------------------------- | ------------------------------------------------------- |
| Site name, title template, default robots, verification tokens | `eminence({ headTags: { ... } })` in `astro.config.mjs` |
| Page-specific title, description, OG image, JSON-LD            | Layout props on each page                               |
| Suppress a tag on one page                                     | Pass `false` for that prop (see usage SKILL)            |

When passing any object prop (e.g. `verification`, `robots`), integration defaults for that component are **not merged** — pass complete values or configure at integration level.
