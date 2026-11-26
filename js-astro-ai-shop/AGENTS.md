# AGENTS.md

Instructions for AI coding tools (Claude Code, Codex, Cursor and others) working on this store.

This is a static Astro site with no backend. Products are Markdown files, checkout is a plain link to a Stripe Payment Link, and the "Ask about this product" box calls OneTag AI from the browser. Do not add a cart, a server route, an API route, a database or a client framework: the theme exists to avoid them.

## Commands

```bash
npm install --registry https://registry.npmjs.org
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run check      # astro check: types and frontmatter
BASE_PATH=/astro-ai-shop npm run build   # same build for a GitHub project page
```

Node 22.23.4 or newer. Run `npm run build` and `npm run check` after every change; both must pass with 0 errors.

## Add a product

1. Create `src/content/products/<slug>.md`. The file name is the URL (`/products/<slug>/`) and the `client_reference_id` Stripe receives, so use lowercase letters, digits and dashes only.
2. Copy the frontmatter from an existing product, for example `src/content/products/bone-folder.md`. Required: `title`, `price` (a number in the main currency unit, `34` not `"$34"`), `currency` (three letters), `image`, `summary` (200 characters max), `category`. The schema is in `src/content.config.ts`; a wrong field fails the build with a clear message.
3. `category` must be an `id` from `store.categories` in `src/data/store.ts`. Add a new category there if needed.
4. Put the image in `public/products/` and write its path without the base path: `image: /products/<slug>.svg`. Square images look best. Add `imageAlt`.
5. Write `specs` and `faq`. The Ask box answers only from the product text, specs, FAQ and the store policies, so specific facts (sizes, materials, lead times) make better answers.
6. Optional: `badge: New`, `soldOut: true`, `featured: true` (shows on the home page), `order: 10` (lower comes first), `askPlaceholder` (example question in the Ask box).
7. Leave `paymentLink` and `paymentLinkTest` as `https://buy.stripe.com/REPLACE_ME` and `https://buy.stripe.com/test_REPLACE_ME` until the user gives you real links. The Buy button then shows "Checkout not connected yet" instead of a broken link.

Never invent a Payment Link. Only the user can create one in their Stripe dashboard.

## Set the Stripe links

Ask the user for each product's Payment Link (from Stripe: Payment Links, open the link, copy the URL). Test links start with `https://buy.stripe.com/test_`.

- Paste the test link into `paymentLinkTest` and the live link into `paymentLink`.
- `PUBLIC_STRIPE_MODE=test` (in `.env` and in `.github/workflows/deploy.yml`) uses `paymentLinkTest`; `live` uses `paymentLink`.
- Remind the user that the success redirect, quantity, shipping and stock limit are settings on each link in Stripe, not in this repo. The README section "Set up Stripe" lists them.
- Keep `price` in the Markdown equal to the price on the Stripe link. Stripe charges what the link says.

## Set the OneTag AI key

The key is public by design: it ends up in the built HTML, like an analytics ID.

1. Ask the user for their email address.
2. Run: `curl -X POST https://onetagai.com/api/signup -H "Content-Type: application/json" -d '{"email":"THEIR_EMAIL"}'`. The response is `{"ok": true}`; the key is emailed to them, never returned.
3. Ask them to paste the key (it starts with `ot_`). Put it in `.env` as `PUBLIC_ONETAG_KEY=ot_...`. For GitHub Pages, tell them to add it as a repository secret named `ONETAG_KEY`.

Never write a key into a committed file. On localhost the box works without a key (shared demo key); on a deployed site without a key it says Ask AI is not set up.

## Change the store name, copy and colors

- Name, tagline, email, location, navigation, categories, the checkout line and all shipping and returns text: `src/data/store.ts`.
- Colors and fonts: the six tokens at the top of `src/styles/global.css` (`--blotter`, `--ink`, `--cloth`, `--thread`, `--greyboard`, `--endpaper`) and their dark-mode values just below. Keep text contrast at 4.5:1 or more.
- Home page headline and the "Buying here" facts: `src/pages/index.astro`. About, contact, terms and privacy: the matching files in `src/pages/`.
- The Ask box rules (what the model may and may not say): `RULES` in `src/components/AskProduct.astro`. Keep the rule against inventing prices, stock and delivery dates.

## Rules for changes

- Internal links and image paths go through `url()` from `src/lib/shop.ts`, so the site works under a base path.
- Write model output with `textContent`, never `innerHTML`.
- Keep the OneTag script lazy (loaded on first use from `src/scripts/onetag.ts`).
- Copy is plain English in sentence case. Buttons say what happens ("Buy for $24").
