# Font Awesome Free, vendored

Version **7.3.1**, from `@fortawesome/fontawesome-free` on npm. Do not edit
these by hand; replace the directory wholesale when upgrading.

Served from the site itself rather than from a CDN, so a Popular site works
offline, keeps working when a third party has an outage or changes a URL, and
does not hand every visitor's IP address to someone the community never chose.
The same files ship in `astro-theme-popular/public/fontawesome/` (PARITY.md).

Only `.woff2` is here because that is all 7.x ships; there is no `.ttf`
fallback to leave out. Every browser released since 2016 supports it.

## Licence

`(CC-BY-4.0 AND OFL-1.1 AND MIT)`, per the package: icons are CC BY 4.0, fonts
are SIL OFL 1.1, code is MIT. Self-hosting is explicitly permitted, and CC BY
requires attribution, which is why `LICENSE.txt` sits beside the files and
should stay there in any site that copies them.

## Upgrading

```bash
npm pack @fortawesome/fontawesome-free@<version>
# then replace css/all.min.css, webfonts/*.woff2 and LICENSE.txt from the tarball
```

Before raising the version, check that every icon the theme uses still exists
in the new release. The helper tests do not cover this; the icons are named as
strings in layouts, demo content, and adopters' own config, so a removed icon
fails as a blank square rather than as an error.
