# Changelog

All notable changes to the Volks-Typo Astro theme will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2025-11-06

### Fixed
- **URL Trailing Slash Issues**: Removed double slashes in URLs caused by extra trailing slash after `${base}` ([#17](https://github.com/jdrhyne/volks-typo/issues/17), [#18](https://github.com/jdrhyne/volks-typo/issues/18))
- **Category URL Slugification**: Fixed category links with slashes and spaces to properly generate URL-safe slugs ([#19](https://github.com/jdrhyne/volks-typo/issues/19))
  - Categories like "UI/UX" now generate `/categories/ui-ux` instead of `/categories/ui/ux`
  - Categories like "Web Development" now generate `/categories/web-development` instead of broken space-containing URLs

### Changed
- Updated Sidebar.astro: Fixed blog post links and category links
- Updated blog.astro: Fixed blog post links
- Updated [...slug].astro: Fixed "Back to Blog" link and category tag links

### Technical Details
- Applied `.replace(/[\/\s]+/g, '-')` to category slugification for proper URL formatting
- Standardized `${base}` usage across all components to prevent double slashes
- Ensured consistency between category page routing and category link generation

### Credits
Special thanks to @frank-kirgis for reporting all three issues with detailed information!

## [1.1.3] - 2025-08-04

### Fixed
- **MDX Category Support**: MDX files now properly appear in category listings and sidebar categories
- **Theme-aware Tag Colors**: Blog post tags now use CSS variables instead of hardcoded colors for proper theme support

### Technical Details
- Added `.mdx` file support to category page queries alongside existing `.md` support
- Changed tag text color from hardcoded `white` to `var(--color-surface)` for theme compatibility
- Updated file extension removal regex to handle both `.md` and `.mdx` extensions in category URLs

### Credits
Thanks to @cswwww for this contribution!

## [1.1.2] - 2025-07-15

### Fixed
- **Removed misplaced markdown file** from `src/pages/blog/` directory that was causing the sample blog post to render without layout and styling ([#11](https://github.com/jdrhyne/volks-typo/issues/11))
- Blog posts now correctly render with the theme's full layout system

### Testing
- Added automated test to prevent markdown files from being placed in the pages directory
- Test suite ensures blog posts always render with proper styling

### Credits
Special thanks to @jdrhyne for reporting this issue with detailed information!

## [1.1.1] - 2025-07-13

### Fixed
- **Dark Mode Category Tags**: Fixed poor contrast issue where category tags had white text on light gray backgrounds in dark mode
- **Homepage Category Visibility**: Added dark mode styles for `.demo-category` tags on homepage
- **Button Hover States**: Improved secondary button hover states for better contrast in dark mode
- **Consistent Dark Mode Styling**: Ensured all category tag variations have proper dark mode support

### Improved
- **Dark Mode Contrast**: All UI elements now meet WCAG accessibility standards in both light and dark themes
- **Visual Consistency**: Category tags now have consistent styling across homepage, blog, sidebar, and search
- **Button Interactions**: Secondary buttons now use accent color on hover in dark mode for better visibility

## [1.1.0] - 2025-07-12

### Added
- **Dark Mode Toggle**: Complete theme switching system with localStorage persistence and FOUC prevention
- **MDX Support**: Full integration allowing both .md and .mdx files for blog content with enhanced JavaScript capabilities
- **Reading Time Calculation**: Automatic reading time estimation displayed on blog posts and listings based on ~200 WPM
- **Table of Contents**: Auto-generated, scroll-spying TOC component for improved navigation on blog posts
- **Comprehensive Testing**: Playwright test suite with automated browser testing and visual regression testing
- **Modern Import System**: Migrated from deprecated Astro.glob() to import.meta.glob() for future compatibility (internal change, no user action required)

### Changed
- Updated from "Zero JavaScript" to minimal JavaScript for enhanced interactive features
- Improved content collection handling for better MDX and Markdown integration
- Enhanced blog post template with TOC integration and reading time display

### Technical Improvements
- Added @astrojs/mdx integration to astro.config.mjs
- Created reusable TableOfContents.astro component with IntersectionObserver scroll spy
- Implemented theme-init.js for flash-of-unstyled-content prevention
- Added comprehensive Playwright test configuration with cross-browser testing
- Created utility functions for reading time calculation and heading extraction

## [1.0.2] - 2025-07-12

### Fixed
- Fixed double slash in navigation URLs when using base path ([#5](https://github.com/jdrhyne/volks-typo/issues/5))
- Fixed static assets 404 errors on Netlify/Vercel deployments ([#6](https://github.com/jdrhyne/volks-typo/issues/6))

### Added
- Environment-based configuration for deployment flexibility
- `.env.example` file with deployment configuration examples
- Enhanced deployment documentation for Netlify, Vercel, and GitHub Pages

### Changed
- Made `site` and `base` configuration dynamic via environment variables
- Navigation and asset paths now adapt based on deployment target

## [1.0.1] - 2025-06-10

### Added
- Enhanced avatar system with SVG placeholders and realistic headshot appearance
- Dynamic author information integration in About page
- Improved mobile header alignment and responsive design

### Fixed
- Mobile header title centering and alignment issues
- RSS icon color consistency
- Avatar SVG blending within circular borders
- Mobile navigation layout improvements

## [1.0.0] - 2025-06-10

### Added
- **Initial release** of Volks-Typo Astro theme
- Complete theme implementation exploring Bauhaus modernism and WW2-era monumental design
- Responsive layout with mobile-first design approach
- Comprehensive color palette with primary Bauhaus colors and secondary WW2-era accents
- Typography system featuring Cormorant Garamond, Playfair Display, and Inter fonts
- Custom SVG site title with German institutional signage inspiration
- Full Astro integration with TypeScript support
- SEO optimization with meta descriptions and structured data
- RSS feed generation and sitemap support
- Search functionality with live results
- Categories system with compact card layout
- Syntax highlighting with German flag-inspired color scheme using Prism
- Mobile hamburger navigation menu
- Social media integration (GitHub, X, Instagram, LinkedIn, Email)
- About page with author bio and social links
- Sample blog content exploring design principles
- MIT License for open-source distribution
- Comprehensive README with installation and usage instructions
- GitHub Pages deployment workflow
- Automated screenshot generation with Playwright
- Professional package.json metadata for Astro theme submission

### Technical Features
- **Layout System**: CSS Grid-based responsive architecture
- **Component Structure**: Modular Astro components (Layout, Header, Sidebar, Footer)
- **Content Management**: Astro Content Collections for blog posts
- **Styling**: Scoped CSS with CSS variables for theme consistency
- **Fonts**: Self-hosted via @fontsource packages
- **Build Tools**: ESLint, Prettier, TypeScript checking
- **Development**: Hot reload and modern development server

### Design Philosophy
- **Form Follows Function**: Bauhaus functionalism with monumental design counterpoints
- **Minimalism as Base**: Clean, uncluttered aesthetic with generous white space
- **Constructivist Influence**: Strong 8-point grid system for structural order
- **Dissonant Harmony**: Visual tension between modernist and monumental aesthetics

### Color Palette
- **Primary (Bauhaus)**: Parchment White (#f0e9d6), Charcoal Black (#2c2c2c), Muted Red (#c13127), Deep Blue (#005a8d), Ochre Yellow (#e8a100)
- **Secondary (WW2-Era)**: Blood Red (#8b0000), Stone Beige (#d4c8a0), Steel Gray (#3d3d3d)

### Content
- Five thematic blog posts exploring design principles:
  - Bauhaus Design Principles
  - Color Theory in Industrial Design
  - CSS Grid and Modernist Layouts
  - Evolution of Typography
  - Minimalist Architecture and Digital Design

## [0.9.0-alpha] - 2025-06-09

### Added
- Theme variations system (later simplified to single default theme)
- Multiple design iterations and experimental approaches
- GitHub Pages deployment infrastructure
- Mobile navigation improvements
- Search functionality enhancements
- Blog post routing and navigation fixes

### Development Milestones
- **June 8, 2025**: Initial theme concept and core implementation
- **June 9, 2025**: Major feature additions, mobile optimizations, and content creation
- **June 10, 2025**: Final polish, Astro submission preparation, and production release

---

## Development Notes

This theme was developed with a focus on creating a unique aesthetic that explores the tension between Bauhaus modernist principles and WW2-era monumental design. The development process involved extensive iteration on typography, color schemes, and layout systems to achieve the desired "dissonant harmony" effect.

The project evolved from experimental multi-theme variations to a focused single-theme implementation optimized for the Astro ecosystem and theme submission requirements.

### Attribution

Theme created by [@jdrhyne](https://github.com/jdrhyne) with assistance from Claude Code.
Generated with [Claude Code](https://claude.ai/code)