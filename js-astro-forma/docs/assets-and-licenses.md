# Assets and third-party licenses

## Demo graphics

The repository includes no project photography. The homepage uses original neutral SVG placeholders in `public/assets/placeholders/` so users can add images they have permission to use. The placeholder SVGs and `public/logo.svg` are included under the MIT License in `LICENSE.md`. The demo mark is not a claim about a real company or a grant of rights to any third-party trademark.

Replace placeholders and the demo mark with cleared materials before publishing a business website.

## Fonts

The site imports Instrument Sans from `@fontsource-variable/instrument-sans`. The font is distributed under the SIL Open Font License 1.1. Its full license file is available in that installed package after `npm ci`.

## Third-party code

`src/components/starwind/` contains Starwind UI Astro components distributed under MIT. The included [third-party notices](legal/third-party-notices.md) preserve its copyright and license terms. Other npm packages and icon libraries are downloaded from the dependencies in `package-lock.json` and remain under their own licenses; review the package metadata and license files in `node_modules/` before redistributing a built bundle.
