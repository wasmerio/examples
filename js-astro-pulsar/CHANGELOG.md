# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.0](https://github.com/amirdaraee/astro-pulsar/compare/v0.5.0...v0.6.0) (2026-09-15)


### Features

* open external markdown links in a new tab ([e969026](https://github.com/amirdaraee/astro-pulsar/commit/e969026c177c3017f653b66c3047342f736bcbb5))
* show related posts by shared tags on blog posts ([c194684](https://github.com/amirdaraee/astro-pulsar/commit/c194684a4c2a083a6ef813de217113e0a7f1b350))


### Bug Fixes

* **deps:** update dependencies and resolve security advisories ([1839214](https://github.com/amirdaraee/astro-pulsar/commit/1839214f4bbaf02bbea262c760c2ad7641abdd19))
* overlay the mobile menu instead of pushing page content down ([4ced27d](https://github.com/amirdaraee/astro-pulsar/commit/4ced27d3cffa85323187038c68e8ab03cc28fc1a))

## [0.5.0](https://github.com/amirdaraee/astro-pulsar/compare/v0.4.1...v0.5.0) (2026-07-03)


### Features

* add copy-to-clipboard button on code blocks ([0000136](https://github.com/amirdaraee/astro-pulsar/commit/000013622ab774fd8cdc6da4500588bb33dd94d1))
* use an always-visible icon for the code copy button ([ba5a6c3](https://github.com/amirdaraee/astro-pulsar/commit/ba5a6c3570c463412df70fde0c177fb36fbfbf76))


### Bug Fixes

* give light mode code blocks a subtle gray background ([47f3153](https://github.com/amirdaraee/astro-pulsar/commit/47f3153753a0bcdfdabe4aaf70697cb031e6e426))

## [0.4.1](https://github.com/amirdaraee/astro-pulsar/compare/v0.4.0...v0.4.1) (2026-07-03)


### Bug Fixes

* normalize demo cover images to real photos at consistent size and weight ([8662fb1](https://github.com/amirdaraee/astro-pulsar/commit/8662fb1dd0b53c8ac7aad57945092757dff01019))
* show copyright in the homepage footer ([d98b34d](https://github.com/amirdaraee/astro-pulsar/commit/d98b34dccbd2bd224a668bb955fe4a989ce2c35f))

## [0.4.0](https://github.com/amirdaraee/astro-pulsar/compare/v0.3.0...v0.4.0) (2026-07-03)


### ⚠ BREAKING CHANGES

* theme now requires Astro 7 and Node 22+.

### Features

* add GitHub Pages deploy workflow and fix base path handling for Astro 6 ([9b761df](https://github.com/amirdaraee/astro-pulsar/commit/9b761df54905f35245968cb913205a21bc0e60b9))
* add portfolio page ([208e093](https://github.com/amirdaraee/astro-pulsar/commit/208e09359d9ee7afb46ea9a43f4231470b279286))
* add production-only GA4 analytics with content dimensions and engagement events ([b4085ca](https://github.com/amirdaraee/astro-pulsar/commit/b4085cadc38f43f85cc902377c4642f38437af04))
* add reading time estimate and previous/next post navigation ([974f318](https://github.com/amirdaraee/astro-pulsar/commit/974f318179f7c84146fcf80c0798ba89d642265c))
* add RSS feed with autodiscovery link and footer icon ([a6cfa35](https://github.com/amirdaraee/astro-pulsar/commit/a6cfa35b4c394a918f04005f47add8b6f8cc5557))
* add tag index and per-tag listing pages from post keywords ([e13c3c9](https://github.com/amirdaraee/astro-pulsar/commit/e13c3c923a98d8a7b2c2be516e02394d89904a9a))
* align footer social icons left and copyright right in a single row ([46cd184](https://github.com/amirdaraee/astro-pulsar/commit/46cd18498967e649d3fa4795d2db13fe84494363))
* deploy Astro 6 live demo via GitHub Pages Actions workflow ([da47aeb](https://github.com/amirdaraee/astro-pulsar/commit/da47aeb25495c4702ad21399da2ce994099676c5))
* link footer socials to platform home pages, swap Twitter bird for X logo, shrink icons ([2f70a17](https://github.com/amirdaraee/astro-pulsar/commit/2f70a171ebe6f653b5dd45ade16b7e5f3faa681f))
* syntax highlighting via Shiki with GitHub light/dark themes following site theme ([9da4494](https://github.com/amirdaraee/astro-pulsar/commit/9da44940c01fec761cd31daf96d7b6e61b32bf2d))
* upgrade to Astro 7, Tailwind 4.3.2; drop obsolete dependency overrides ([c11775b](https://github.com/amirdaraee/astro-pulsar/commit/c11775b0c093f9d593b4e6cb7197b59f764de305))


### Bug Fixes

* add missing space in footer copyright and show social icons without heading ([b4b0123](https://github.com/amirdaraee/astro-pulsar/commit/b4b01232176a0d82d4ce3dd54106eebd87554c08))
* dedupe tag slugs per post to prevent duplicate listings and inflated counts ([da720b6](https://github.com/amirdaraee/astro-pulsar/commit/da720b60a17b769c614d0a5a41a9b68f999f5572))
* drop Twitter and email lines from the about page contact list ([ad7876f](https://github.com/amirdaraee/astro-pulsar/commit/ad7876f7b8717d3b380264fc700c5ba1ffe3c1ac))
* give every demo post a distinct cover image, refresh README screenshot ([e3edf52](https://github.com/amirdaraee/astro-pulsar/commit/e3edf526bf9df8a8a2153ad572f3b0f2c53635f8))
* remove tags link from the navigation menu ([1bbf118](https://github.com/amirdaraee/astro-pulsar/commit/1bbf11862d7ec04dffdb6417e28616770b7c253f))
* render dark mode toggle icon via CSS to prevent flash and wire all toggle instances ([bf6ea6e](https://github.com/amirdaraee/astro-pulsar/commit/bf6ea6ec5532e3f738d3eb0f93c745bfb01b7a65))
* repair broken demo post image and add missing README screenshot ([915382d](https://github.com/amirdaraee/astro-pulsar/commit/915382da46e7098ca2187ef57ae1774e3818e7e5))
* reserve scrollbar gutter to prevent layout shift between pages ([529b17c](https://github.com/amirdaraee/astro-pulsar/commit/529b17cd572512c0a449970941ffd62b8f8cca3a))
* tighten footer padding, refresh about page copy, point portfolio samples at GitHub ([625308c](https://github.com/amirdaraee/astro-pulsar/commit/625308ca590f3105527c6dafc988fbf2e013c186))
* use placeholder projects on the portfolio page ([01825c3](https://github.com/amirdaraee/astro-pulsar/commit/01825c3967edeb752689b2b36957a70c7fe03acf))

## [0.3.0] - 2026-04-13

### Added
- CI workflow that runs type checking and build on every push to `main` and every pull request
- `Footer` component `showCopyright` and `compact` props to control copyright visibility and padding
- `Layout` component `compactFooter` prop, forwarded to `Footer`

### Changed
- Upgraded to Astro 6 with the new loader-based content collections API (`src/content.config.ts`, `glob()` loader)
- Upgraded to Tailwind CSS v4, configured via `@tailwindcss/vite` Vite plugin — no config file needed; dark mode now uses `@custom-variant` in CSS
- Replaced `standard-version` with plain `npm version` for releases — changelog is now maintained manually in Keep a Changelog format
- Simplified release workflow: replaced `softprops/action-gh-release` with built-in `gh release create`; build artifact is shared between jobs via `actions/upload-artifact` to avoid a double build
- Release pipeline now uses `env:` blocks for all dynamic values to eliminate injection risk

### Fixed
- Changelog extraction `awk` pattern in release workflow now correctly handles Keep a Changelog format

## [0.2.2] - 2025-11-11

### Fixed
- Fixed GitHub Actions build failures
- Resolved TypeScript errors in Layout.astro
- Corrected Footer component prop interface

### Changed
- Improved GitHub release notes workflow to extract full changelog content
- Updated release automation to handle both standard-version and Keep a Changelog formats

## [0.2.1] - 2025-11-11

### Fixed
- Fixed build errors caused by `showCopyright` prop references
- Removed unused `showCopyright` from Layout.astro Props interface
- Updated index.astro to remove `showCopyright` prop

## [0.2.0] - 2024-11-11

### Added
- WebP image support with automatic conversion for optimized performance
- Sample blog post images (sample-1.jpg, sample-2.jpg) with WebP versions
- Logo WebP version with 98% size reduction (17KB vs 829KB)
- Custom favicon set (16x16, 32x32, Apple touch icon, Android chrome icons)

### Changed
- Updated author information to "amirdaraee" throughout the project
- Updated GitHub repository URLs to amirdaraee/astro-pulsar
- Updated email to amirdaraee@gmail.com
- Blog post images now use sample-1.jpg and sample-2.jpg with image credits
- All blog post authors updated to "amirdaraee"

### Fixed
- Fixed double slash bug in blog image paths (was //sample-1.webp, now /sample-1.webp)
- Fixed image loading issues in blog listing and individual post pages
- Corrected image path handling in blog templates

### Removed
- Copyright notice from footer (keeping only social links)

## [0.1.0] - 2024-11-10

### Added
- Initial release of Astro Pulsar theme
- Dark mode support with localStorage persistence
- SEO optimization (meta tags, Open Graph, Twitter Cards, JSON-LD)
- Responsive design with pure Tailwind CSS
- Blog functionality with Astro Content Collections
- Syntax highlighting with Prism (GitHub Dark theme)
- Automatic sitemap generation
- Google Analytics 4 integration (optional)
- Accessible design with ARIA labels and semantic HTML
- Mobile-responsive navigation with hamburger menu
- Font Awesome 4.7 icons integration
- Custom 404 error page
- Print-friendly styles for blog posts
- Skip-to-content link for accessibility
- Layout system with customizable header and footer
- SEO component for meta tags
- Dark mode toggle component
- Responsive header with mobile menu
- Social links footer
- Homepage, blog listing, individual post, about, and 404 pages
