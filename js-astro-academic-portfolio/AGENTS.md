# AGENTS.md

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run preview` - Preview build

## Requirements
- Node.js >= 22.12.0

## Architecture
- **Barrel files:** `src/config/index.ts`, `src/types/index.ts`
- **Content:** `src/content/` - Add `.md` files to subdirectories (posts/, publications/, projects/, talks/, teaching/)
- **Config:** `src/config/` - site.ts (SITE, THEME_CONFIG, SETTINGS, ANALYTICS), pages.ts (PAGES), navigation.ts (NAV_LINKS), social.ts (SOCIALS), themes.ts
- **Types:** `src/types/` - content.ts (Bio, CVItem, etc.), display.ts (ListingItem, DetailItem), config.ts, themes.ts
- **Styles:** `src/styles/global.css` - Theme colors, base styles
- **Assets:** `src/assets/icons.ts` - Icon definitions

## Key Constraints
- **No `<style>` in `.astro` files** - Use global.css and Tailwind classes in components
- **Two-column layout:** Left sidebar (sticky profile), Right main (scrollable content)
- **Markdown-driven:** All content in `.md` files with YAML frontmatter
- **Theme config:** Use `THEME_CONFIG` for theme settings (lightAndDark, themeLight, themeDark)

## Notes
- Tailwind CSS v4 uses `@tailwindcss/vite` plugin (no tailwind.config.js)
- LaTeX math rendering via remark-math/rehype-katex
- Analytics supported via GA4 (`ga4Id`) and Umami (`umami.websiteId`) — configure in `src/config/site.ts`
- No lint/typecheck scripts configured