# Inter and Quantico, vendored

The woff2 files Google Fonts serves for the two families named in
`assets/css/tokens/fonts.css`, downloaded once and committed. Do not edit them
by hand; replace the directory wholesale when upgrading.

Served from the site itself rather than from `fonts.googleapis.com`, so a
Popular site works offline, keeps working when a third party has an outage or
changes a URL, and does not hand every visitor's IP address to someone the
community never chose. That last one is not only a preference: a German court
(LG München I, 3 O 17493/20) held that embedding Google Fonts without consent
violates the GDPR, and Popular is aimed at community organizers who should not
have to think about that. The same files ship in
`astro-theme-popular/src/styles/fonts/` and `package/src/styles/fonts/`
(PARITY.md).

Self-hosting is also no slower. Browsers have partitioned the HTTP cache by
top-level site since 2020, so a visitor who loaded Inter from Google elsewhere
gets no cache hit here, and an `@import` from a bundled stylesheet costs an
extra DNS lookup, TLS handshake and round trip before the font files even start.

## What is here

18 files: Inter as a variable font (weights 200-800 roman, 400-600 italic)
across seven subsets, and Quantico in four static styles, latin only. Every
face carries a `unicode-range`, so a browser downloads only the subsets a page
actually needs: a latin-only site fetches about 150KB of the 716KB here.

The axes and weight ranges are exactly those the theme requested from Google
before vendoring, so nothing about the rendering changed.

## Licence

Both families are under the SIL Open Font License 1.1, which explicitly permits
self-hosting and redistribution as part of a larger work. `OFL-Inter.txt` and
`OFL-Quantico.txt` sit beside the files and should stay there in any site that
copies them. Inter is © The Inter Project Authors; Quantico is © Matthew
Desmond, with Quantico as a Reserved Font Name, so a modified copy must be
renamed.

## Upgrading

Refetch the same stylesheet the theme used to `@import`, with a browser user
agent so Google serves woff2 rather than ttf:

```bash
curl -A 'Mozilla/5.0 ... Chrome/120.0.0.0 ...' \
  'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,200..800;1,14..32,400..600&family=Quantico:ital,wght@0,400;0,700;1,400;1,700&display=swap'
```

Then download each `src:` URL, keep the file names below, and copy the
`unicode-range` values into `fonts.css` unchanged. Google reslices its subsets
from time to time, so the ranges must come from the same fetch as the files.
Refresh all three copies together, or the package drift guard fails.