# Credits and third-party licences

The theme's own source — components, layouts, pages, styles, TypeScript, demo
copy, the icon sprite, the project artwork and the monogram — is MIT licensed.
See [LICENSE](LICENSE).

Everything bundled from elsewhere is listed below with its own licence.

---

## Photographs

Fourteen of the sixteen files in `public/images/` are photographs, and all
fourteen are CC0. Twelve come from Pxhere and two from StockSnap. The other
two files are the brand logos, covered further down.

### Pxhere (12 photographs)

[Pxhere](https://pxhere.com/)'s
[licence page](https://pxhere.com/en/license) states that every photo on the
site is released under the
[Creative Commons Zero (CC0) licence](https://creativecommons.org/publicdomain/zero/1.0/):

> The pictures are free for personal and even for commercial use. You can
> modify, copy and distribute the photos. All without asking for permission or
> setting a link to the source. So, attribution is not required.

They are credited here anyway, so anyone can check a source for themselves.

The files shipped in this repository are not the originals. Each one was
cropped to the aspect ratio the layout needs and re-encoded as WebP.

| File | Used for | Source |
| --- | --- | --- |
| `public/images/hero-portrait.webp` | Hero portrait card | [pxhere.com/en/photo/868205](https://pxhere.com/en/photo/868205) |
| `public/images/about-studio.webp` | About (Background) section | [pxhere.com/en/photo/764675](https://pxhere.com/en/photo/764675) |
| `public/images/reel-poster.webp` | Studio reel poster frame; journal post cover | [pxhere.com/en/photo/764428](https://pxhere.com/en/photo/764428) |
| `public/images/project-console.webp` | Case study: Brightsill console | [pxhere.com/en/photo/758989](https://pxhere.com/en/photo/758989) |
| `public/images/project-site.webp` | Case study: Coalfield site; journal post cover | [pxhere.com/en/photo/1338927](https://pxhere.com/en/photo/1338927) |
| `public/images/project-print.webp` | Case study: Saltmarsh packaging; journal post cover | [pxhere.com/en/photo/457](https://pxhere.com/en/photo/457) |
| `public/images/avatar-01.webp` | Testimonial avatar; hero avatar stack | [pxhere.com/en/photo/764654](https://pxhere.com/en/photo/764654) |
| `public/images/avatar-02.webp` | Testimonial avatar; hero avatar stack | [pxhere.com/en/photo/1278242](https://pxhere.com/en/photo/1278242) |
| `public/images/avatar-03.webp` | Testimonial avatar; hero avatar stack | [pxhere.com/en/photo/635897](https://pxhere.com/en/photo/635897) |
| `public/images/journal-01.webp` | Journal post cover | [pxhere.com/en/photo/7630](https://pxhere.com/en/photo/7630) |
| `public/images/journal-02.webp` | Journal post cover | [pxhere.com/en/photo/1338928](https://pxhere.com/en/photo/1338928) |
| `public/images/journal-03.webp` | Journal post cover | [pxhere.com/en/photo/559565](https://pxhere.com/en/photo/559565) |

### StockSnap (2 photographs)

[StockSnap](https://stocksnap.io/)'s [licence page](https://stocksnap.io/license)
states that every image on the site is released under CC0:

> [You] can put StockSnap CC0 images to any of these usages without buying the
> right to do it, acquiring written permission from the image's creator, or
> attributing the work to the image creator.

Both were contributed by the photographer **directmedia**.

| File | Used for | Source |
| --- | --- | --- |
| `public/images/collab-team.webp` | "Working together" section, left image | [stocksnap.io/photo/business-people-HXDODYZKFS](https://stocksnap.io/photo/business-people-HXDODYZKFS) |
| `public/images/collab-meeting.webp` | "Working together" section, right image | [stocksnap.io/photo/business-people-HWLNQD65VR](https://stocksnap.io/photo/business-people-HWLNQD65VR) |

Both were cropped and re-encoded as WebP for this theme.

## Brand logos

`public/images/header-logo.webp` and `public/images/footer-logo.webp` are the
demo brand's own marks, supplied by the theme author. They are **not** covered
by the MIT grant over the rest of the theme — a logo is a trademark, and the
MIT licence does not transfer one.

If you are using this theme for your own site, replace both files with your own
logo and update `logo` in `src/config/site.ts`. See *Logo and favicon* in the
README.

If you keep the demo photographs, nothing is required of you. If you replace
them — which you should, for a real portfolio — delete the rows above and
record whatever your own images need.

> **A note on the people in these photographs.** Pxhere attaches one condition
> to its CC0 release: *"identifiable people may not appear in a bad light or in
> a way that they may find offensive, unless they give their consent."*
>
> Eight of the fourteen photographs show identifiable people. The demo content
> presents them as a fictional portfolio owner, colleagues and clients, in a
> neutral professional light — which stays inside that condition. Keep it that
> way if you keep the photographs.
>
> Separately, CC0 waives copyright; it is not a model release. Before using a
> photograph of an identifiable person in advertising, or in a way that implies
> a real person endorses you, make sure you have the rights you need.
> Replacing the demo photographs with your own avoids the question entirely.

## Fonts

Both families are bundled as self-hosted WOFF2 variable fonts in
`public/fonts/`, so no request ever leaves your domain for a font.

| Family | Files | Licence | Upstream |
| --- | --- | --- | --- |
| Space Grotesk | `space-grotesk-latin.woff2`, `space-grotesk-latin-ext.woff2` | [SIL Open Font License 1.1](public/fonts/OFL-SpaceGrotesk.txt) | [floriankarsten/space-grotesk](https://github.com/floriankarsten/space-grotesk) |
| Inter Tight | `inter-tight-latin.woff2`, `inter-tight-latin-ext.woff2` | [SIL Open Font License 1.1](public/fonts/OFL-InterTight.txt) | [rsms/inter-tight](https://github.com/rsms/inter-tight) |

The OFL permits bundling and redistribution with a project, including
commercially, provided the licence text travels with the fonts — which is why
`OFL-SpaceGrotesk.txt` and `OFL-InterTight.txt` sit beside them. Do not sell
the font files on their own, and do not rename the families.

Only the `latin` and `latin-ext` subsets are included. If you need Cyrillic,
Greek or Vietnamese, download those subsets from the upstream projects, drop
them in `public/fonts/`, and add matching `@font-face` blocks with the right
`unicode-range` in `src/styles/fonts.css`.

## Icons and artwork

Every icon and every piece of artwork in this theme was drawn for it. There is
no icon-library dependency.

| Asset | Where |
| --- | --- |
| 29-icon sprite | `src/components/icons/IconSprite.astro` |
| Booklet and tablet mockups (bundled, not rendered by default) | `src/components/art/BookletMock.astro`, `TabletMock.astro` |
| Project artwork (identity, dashboard, app screens) | `src/components/art/IdentityArt.astro`, `DashboardArt.astro`, `AppScreensArt.astro` |
| Signature mark | `src/components/art/Signature.astro` |
| Client wordmarks | `src/data/clients.ts` (inline SVG, fictional companies) |
| Monogram, favicon, app icons, OG image | `public/favicon.svg`, `public/apple-touch-icon.png`, `public/icon-192.png`, `public/icon-512.png`, `public/og-default.png` |
| README preview screenshot | `public/preview.png` (a render of this theme) |

All of it is MIT along with the rest of the theme: use it, change it, ship it.

## Dependencies

| Package | Licence |
| --- | --- |
| [astro](https://github.com/withastro/astro) | MIT |
| [@astrojs/sitemap](https://github.com/withastro/astro) | MIT |
| [@astrojs/rss](https://github.com/withastro/astro) | MIT |
| [@astrojs/check](https://github.com/withastro/astro) | MIT |
| [typescript](https://github.com/microsoft/TypeScript) | Apache-2.0 |

## Demo content

Every name in the demo content is fictional: the portfolio owner (Robin Vale),
the clients (Brightsill, Tessellate, Coalfield, Petrichor, Saltmarsh,
Undergrove, Meridian), the people quoted in the testimonials, and the awards. The case-study figures are illustrative, not records of real
projects. The email address, phone number and postal details are placeholders.

Replace all of it before you publish. `src/config/site.ts` is the place to
start; the README has the full list.
