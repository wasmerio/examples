# Replacing the placeholders with real photos

The theme ships with SVG placeholders so the repo stays tiny. For a
convincing demo (and for the Astro Themes catalog screenshot), drop in real
photos — here is the 10-minute recipe used for the bakery demo.

## Where to find free photos

[Pexels](https://www.pexels.com) — free for commercial use, modification
allowed, **no attribution required**, and photos may be redistributed inside
a free template like this one (you just can't resell the photos themselves).
[Unsplash](https://unsplash.com) works too (credit appreciated).

Suggested searches for the bakery demo (pick warm, amber-toned shots — they
sit naturally on the theme's espresso/amber palette):

| File to create | Pexels search | What to look for |
|---|---|---|
| `hero.jpg` | [sourdough bread](https://www.pexels.com/search/sourdough%20bread/) | Rustic loaves, dark/warm background, landscape |
| `about.jpg` | [baker kneading dough](https://www.pexels.com/search/baker%20kneading%20dough/) | Hands at work, bakehouse feel |
| `gallery-1.jpg` | [bakery display](https://www.pexels.com/search/bakery%20display/) | Counter full of breads (featured 2×2 tile) |
| `gallery-2.jpg` | [croissants](https://www.pexels.com/search/croissants/) | Golden, close-up |
| `gallery-3.jpg` | [french pastry](https://www.pexels.com/search/french%20pastry/) | One signature dessert |
| `gallery-4.jpg` | [bakery storefront](https://www.pexels.com/search/bakery%20storefront/) | The shop from outside |
| `gallery-5.jpg` | [baker hands bread](https://www.pexels.com/search/baker%20hands%20bread/) | Human moment over the counter |

## Steps

1. Download each photo ("Large" size is plenty), rename as above.
2. Optional but recommended: compress to WebP ≤ 200 KB each with
   [squoosh.app](https://squoosh.app) (then use `.webp` extensions below).
3. Put the files in `public/images/`.
4. In `src/config/site.ts`, update the image paths (`.svg` → `.jpg`/`.webp`)
   and rewrite each `alt` text to describe the actual photo.
5. `npm run build` — done.

Keep (or delete) the SVG placeholders: buyers of the theme may prefer to
start from neutral placeholders, so leaving them in `public/images/` next to
your demo photos is fine — just make sure `site.ts` points at the real ones
for the deployed demo.

## Credits

The demo photos shipped in `public/images/` (`.webp`, optimized) come from
Pexels — free to use, attribution not required but appreciated:

| File | Photographer | Source |
|---|---|---|
| `hero.webp` | Skyler Ewing | [pexels.com/photo/10024751](https://www.pexels.com/photo/10024751/) |
| `about.webp` | Liz Earl | [pexels.com/photo/28183472](https://www.pexels.com/photo/28183472/) |
| `gallery-1.webp` | wal_172619 | [pexels.com/photo/35993723](https://www.pexels.com/photo/35993723/) |
| `gallery-2.webp` | bynamnamnam | [pexels.com/photo/35095957](https://www.pexels.com/photo/35095957/) |
| `gallery-3.webp` | Valeria Boltneva | [pexels.com/photo/29380152](https://www.pexels.com/photo/29380152/) |
| `gallery-4.webp` | Pexels contributor | [pexels.com/photo/11418477](https://www.pexels.com/photo/11418477/) |
| `gallery-5.webp` | hello aesthe | [pexels.com/photo/30927893](https://www.pexels.com/photo/30927893/) |

The neutral SVG placeholders remain alongside them, so you can start a client
site from a clean slate: point `site.ts` back to the `.svg` files.
