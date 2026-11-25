# AI Guide for Astro SEO Theme

If you are using an AI coding assistant (like Cursor, GitHub Copilot, or Claude) to customize this theme, please provide them with the following instructions to ensure they follow the architectural patterns of this project.

## Core Principles

1. **0 KB JavaScript by Default**: This theme relies on Astro's static generation. Do not add React/Vue/Svelte islands unless absolutely necessary for complex interactivity.
2. **Tailwind CSS v4**: Styling is strictly done via Tailwind CSS utility classes. Do not use styled-components, CSS modules, or plain CSS files unless instructed.
3. **i18n Architecture**: This theme uses native Astro file-based routing for internationalization (`/es/`, `/en/`).
   - All UI text must be extracted to `src/i18n/ui.ts`.
   - Never hardcode text strings inside `.astro` components if they appear on pages that need translation.
   - Use `const t = useTranslations(lang);` to fetch strings.

## Directory Structure

- `src/components/`: Reusable Astro components (UI and layout).
- `src/i18n/`: Translation dictionaries and helper functions.
- `src/layouts/`: Base layouts (where `hreflang` and `canonical` SEO tags are managed).
- `src/pages/`: File-based routing. English pages are at the root, Spanish pages are inside `src/pages/es/`.
- `public/`: Static assets like favicons and images.

## SEO Best Practices (DO NOT BREAK)

- The `BaseLayout.astro` file automatically generates `canonical` URLs and `hreflang` tags based on the current language and path. Do not override this behavior.
- Every page must pass a `title` and `description` to `BaseLayout`.

## Modifying the Navigation

- The navigation megamenu is defined in `src/components/layout/Header.astro` inside the `navItems` array.
- It uses pure CSS for desktop hover states and minimal Vanilla JS for the mobile accordion.

## Modifying the Footer

- The footer is located in `src/components/layout/Footer.astro`. Links and text are pulled from `src/i18n/ui.ts`.
