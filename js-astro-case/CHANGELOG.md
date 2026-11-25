# Changelog

All notable changes to this project are documented here.
This project follows Semantic Versioning.

## [1.1.0] - 2026-01-10

### Added

- **Cross-referencing system**: Link related projects and decisions for improved navigation and discoverability
- **Project status indicators**: Visual badges for project status (completed, ongoing, archived) with color-coded styling
- **Impact metrics display**: New ImpactMetrics component for showcasing project outcomes
- **Project metadata**: Duration and team size fields for project case studies
- **Centralized page metadata**: New `pages.config.ts` for managing SEO metadata across all static pages
- **Scroll-to-top**: Added scroll-to-top functionality to decision pages for better UX on long content

### Changed

- **SEO architecture**: Migrated to component-based slot system for cleaner SEO management
- **Documentation overhaul**: Reorganized into structured sections (Getting Started, Configuration, Content, Customization, Deployment, Reference)
- **README improvements**: Streamlined features section with clearer, more scannable descriptions

### Removed

- **Analytics configuration**: Removed unused analytics integrations to simplify configuration

### Documentation

- Added installation guide with prerequisites and setup options
- Added quick start tutorial for rapid onboarding
- Added project structure documentation
- Added content strategy guide for featured content
- Added image handling and optimization guide
- Added advanced customization documentation
- Added technical features deep dive (reading time, View Transitions, theme system, SEO, pagination)
- Updated troubleshooting guide with additional solutions

## [1.0.0] - 2026-01-08

### Initial Release

First public release of **Case**, a case-study-first portfolio theme for Astro.

#### Highlights
- Case-study-driven project structure focused on decisions and outcomes
- Dedicated decision log inspired by architectural decision records (ADRs)
- Multiple content types for professional portfolios (projects, decisions, writing, journey, uses, and more)
- Editorial, content-first layouts with minimal design
- Dark and light mode with system preference support
- Zero JavaScript by default with minimal JS where needed
- SEO-ready with Open Graph, structured data, and sitemap
- MDX support with content validation
- Fully responsive and accessible by default

#### Developer Experience
- Built with Astro 5 and TypeScript
- Modern CSS with custom properties (no Tailwind dependency)
- Structured content collections with schema validation
- Environment-based configuration
- Clean, maintainable component architecture
