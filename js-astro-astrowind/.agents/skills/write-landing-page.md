# Write a Landing Page

The six pages in `src/pages/landing/` are worked examples of the six common landing page types. Copy the closest one rather than starting from a blank file.

| Type            | File                    | Job of the page                               | Sections that matter most                                |
| --------------- | ----------------------- | --------------------------------------------- | -------------------------------------------------------- |
| Lead generation | `lead-generation.astro` | Get an email in exchange for something        | offer, proof, short form, FAQ                            |
| Sales           | `sales.astro`           | Sell one product on one page                  | promise, features, proof, price, guarantee               |
| Click-through   | `click-through.astro`   | Warm up before a signup or checkout elsewhere | message match, benefit, one repeated button              |
| Product details | `product.astro`         | Show one product in depth                     | overview, features, specs, gallery, price                |
| Pre-launch      | `pre-launch.astro`      | Build a waitlist before launch                | form first, countdown, roadmap, teaser                   |
| Subscription    | `subscription.astro`    | Sell recurring value                          | trust strip, plan cards, retention practices, newsletter |

## Steps

1. Copy the landing page of the same type to a new file in `src/pages/landing/` (or `src/pages/` if it should not be listed under the "Landing" menu).
2. Set `metadata`: `title` with the main keyword, `description` of at most 155 characters, `openGraph.type: 'website'`.
3. Keep the layout `LandingLayout` (light header with the "Landing" menu) or switch to `PageLayout` for the full site header.
4. Replace the copy section by section. Keep one `<h1>` (the hero) and give every section an `id` so buttons can link to it (`href: '#pricing'`).
5. Point every button at a real destination: an anchor, a page, the repository. No `href="#"`.
6. If the page has a form (`Contact` or `Newsletter`), connect it: see `configure-contact-form.md`.
7. Add structured data where it earns a rich result: `schema` on `FAQs`; `add-structured-data.md` for anything else.
8. Run `npm run build && npm run check`, then look at the page at 375 px and 1280 px in light and dark mode.

## Choosing sections

- Hero: `Hero` (centred) or `Hero2` (split). `HeroText` when there is no image worth showing.
- What it is: `Content` (text + image + list), `Features`/`Features2`/`Features3`, `FeatureTabs` for a product with screenshots, `Bento` for a broad overview.
- How it works: `Steps` (with image) or `Steps2`; `Timeline` when dates matter.
- Proof: `Testimonials` or a single `Quote`; `Brands` for logos; `SocialProof` for ratings and counts; `Stats` for numbers you can back; `Projects` for case studies.
- Price: `Pricing`, and `Comparison` when plans differ in many details.
- Objections: `FAQs` with `schema`.
- Close: `CallToAction` (`layout="banner"` for a strong finish), `StickyCTA` on pages whose only job is a click.

Do not repeat the same sequence on every page: a reader who has seen one landing page should not recognise the skeleton on the next. See `use-widgets.md` for the full catalogue and props.

## Copy rules that convert

- The headline repeats the promise of the ad, email or link that brought the visitor.
- One primary action per page, repeated in the hero, after the proof and at the end, always with the same label.
- Numbers and quotes must be real. Sample content in the demos is marked as such; replace it or remove the section.
- Say what happens after the click or the submit: what arrives, when, and how to undo it.
