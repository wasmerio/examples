# Changelog

## [1.2.0] - 2025-10-06

### Features
- Added Pagefind static search integration — build generates `dist/_pagefind` index.
- Per-page control: `pagefind={false}` prop for Layout to opt-out of indexing.
- Support for excluding fragments via `data-pagefind-ignore` and files/globs via `pagefind_config.json`.

### Fixes
- CI: avoid errors when passing CLI args to `npm run build`; recommend running package `build` script or running `astro build` and `pagefind` in separate steps.
- Accessibility: fixed label → id associations in contact form for better autofill and screen-reader support.

### Documentation
- Added `docs/search.md` with setup, exclusion examples, local checks and GitHub Actions snippets.
- README updated with concise Pagefind summary and usage notes.

### Notes
- Ensure `dist/_pagefind` is deployed with the site.
- If passing `--site`/`--base` in CI, run `astro build` and `pagefind` as separate steps or create dedicated npm scripts.

## [1.1.0] - 2025-01-02

### Features
- Added comprehensive contact form with DaisyUI validation
- Implemented contact page with dynamic contact information display
- Added native HTML5 form validation without JavaScript
- Integrated DaisyUI Validator components
- Added contact form demo functionality with success messages
- Enhanced fieldset structure with proper legends
- Added privacy consent checkbox with link to privacy policy
- Implemented optional newsletter subscription checkbox

### Documentation
- Added comprehensive contact form implementation guide
- Created DaisyUI validation integration documentation
- Added TypeScript type safety examples for contact data
- Documented HTML5 validation patterns and best practices
- Added form accessibility guidelines and ARIA attributes usage
- Created troubleshooting guide for common form validation issues

### Improvements  
- Updated contact page layout with responsive design
- Enhanced form accessibility with proper labels and ARIA attributes
- Added proper TypeScript typing for contact data structures
- Improved error handling and validation messages
- Added smooth scrolling for form result messages

### Technical
- Fixed TypeScript type conflicts in contact data processing
- Removed React-specific attributes (key) from Astro components
- Added proper type assertions for string/array data handling
- Enhanced contact value component integration

## [1.0.0](https://github.com/mnyorba/astro-starter/releases/tag/v1.0.0) - 2024-09-18

### Features
- Initial release of Astro Starter project
- Blog structure with Markdown support
- Responsive navigation menu with multi-level support
- Table of Contents (TOC) for articles
- RSS feed generation and link component
- 404 error page with consistent styles
- Footer with current year and copyright
- Integrated [DaisyUI](https://daisyui.com/) for UI components and styling

### Fixes
- Correct TOC anchor links in markdown
- Fix mobile menu toggle bug

### Chores
- Update dependencies
- Add prettier and Tailwind plugins