# Regenerating the OG image

`public/og-image.png` (1200×630) is a screenshot of `og.html`, rendered with the
site's own tokens and fonts.

1. Edit the text in `og.html`.
2. `pnpm run build`, then copy `og.html` and `og.css` into `dist/`.
3. In the copied `og.html`, point the last `<link>` at the real
   `dist/_astro/Base.*.css` filename.
4. `pnpm run preview`, then screenshot `http://localhost:4321/og.html` at
   1200×630, e.g. `pnpm dlx playwright screenshot --viewport-size=1200,630 http://localhost:4321/og.html public/og-image.png`.

Keep the styles in `og.css`: an inline `<style>` is blocked by the CSP.
