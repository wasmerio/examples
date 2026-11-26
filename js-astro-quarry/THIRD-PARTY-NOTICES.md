# Third-Party Notices

This theme bundles the following third-party assets. Each is used under its own license.
Update this file whenever an asset is added or removed.

| Asset          | Type                  | Source                                           | License | Notice / attribution                                        |
| -------------- | --------------------- | ------------------------------------------------ | ------- | ----------------------------------------------------------- |
| Public Sans    | Font                  | https://fonts.google.com/specimen/Public+Sans    | OFL 1.1 | Copyright The Public Sans Project Authors                   |
| JetBrains Mono | Font                  | https://fonts.google.com/specimen/JetBrains+Mono | OFL 1.1 | Copyright The JetBrains Mono Project Authors                |
| KaTeX          | Math rendering, fonts | https://katex.org                                | MIT     | Copyright (c) 2013-2020 Khan Academy and other contributors |
| Lucide         | Icons                 | https://lucide.dev                               | ISC     | Copyright (c) Lucide Contributors                           |

Both faces are served by the Astro fontsource provider at build time (`fonts:` in
`astro.config.mjs`), latin subset, from the `@fontsource` packages in `package.json`.

The syntax colouring is Shiki with a theme built from this theme's own tokens
(`codeTheme` in `astro.config.mjs`); no third-party colour scheme is bundled.

Sample content — the product, its releases, the plans and the two people who write the posts —
is fictional. The theme ships no photographs or illustrations: the drawing on the home page is
rules and text, and `public/og-default.png` is set in the theme's own faces.
