# Lapse: code template

Two builds of the same site, a support agent product called Lapse. Pick one. They are visually identical, and that is checked element by element on every page at desktop, tablet and phone widths.

| Folder | Stack | Use it when |
| --- | --- | --- |
| `astro/` | Astro 7, static output | You want components and almost no JavaScript. |
| `next/` | Next.js 16, App Router, static export | You already work in React. |

Each folder has its own README with commands and the files to edit.

## Pages

Home, About, Pricing, Blog, one page per post, Contact, Terms, Privacy and a 404.

## Content

- Blog posts are Markdown files in `src/content/blog/`. Add a file to add a post: it shows up on /blog, in the latest posts on the home page and in "Related reading" on its own. The file name is the URL.
- Each page's copy is in `src/content/pages/<page>.json`. The menu, the closing call to action and the footer are in `src/content/site.json`. Plans and prices (monthly and annual) are in `src/content/plans.json`, shared by the home and pricing pages.
- Colours and the type scale are CSS custom properties in `src/styles/tokens.css` (Next: `src/styles/site.css`, top of the file).

## Motion

Every effect is a small module in `src/scripts/fx/`, with no animation library. An element opts in with `data-fx="<name>"`. The pinned "What changes" track, the "How it works" step cards, the testimonial ticker over a WebGL line field, the 45,000-particle image in the closing call to action, the logo ticker and pinned rules on About, the team switcher, the blog hover accordion and category tabs, the FAQ, the billing toggle and the WebGL shard field on the 404 are all ported from the original Framer components.

- **Reduced motion**: every effect stands still.
- **No JavaScript**: every section renders complete at its resting state.

## Contact form

Set the form endpoint (Formspree, Basin, Getform or your own) in `PUBLIC_FORM_ENDPOINT` (Astro) or `NEXT_PUBLIC_FORM_ENDPOINT` (Next). The form posts `FormData` and shows the sending, sent and error states. With it empty, the form only plays its states, so the demo works.

## Demo content

Every name, company, quote, statistic and photograph is for demonstration only. The privacy policy and terms are sample text, not legal advice. Replace all of it before you go live.

## Licence

MIT, see `LICENSE`. Fonts and other third-party resources are listed in `LICENSES.txt`.
