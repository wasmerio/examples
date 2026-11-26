# Notes for coding agents

Craftline is a static Astro 7 theme (Tailwind CSS 4, TypeScript). Read `README.md` first.

## Commands

- `npm run dev` (use `astro dev --background` if you need it to keep running; manage it with `astro dev stop|status|logs`)
- `npm run build` and `npm run check` must both pass with 0 errors and 0 warnings.

## Where things live

- Rebranding: `src/config.ts` only. Don't hard-code the business name, phone or email in components.
- Content: `src/content/` (services as Markdown, testimonials and FAQ as JSON). Schemas in `src/content.config.ts`.
- Home page story: `src/components/story/` and `src/styles/story.css`.

## The quote form (`src/components/QuoteForm.astro`)

- Show the success state only when the server's JSON has `success === true`. Never on a network error, never on a non-JSON reply.
- Keep the `botcheck` honeypot input exactly as it is, inside its `aria-hidden` wrapper. Never fill it.
- Keep the no-JavaScript path working: real `action`, `method="POST"`, hidden `_redirect` to `/thanks/`.
- Don't add an API route, server or database for the form. Formgong (or another POST form backend) stores and delivers submissions.

## CSS rules that are easy to break

- Scroll-driven animations: use longhands (`animation-name`, `animation-timeline`, `animation-range`, …). The minifier can merge a shorthand plus `animation-timeline` into a declaration Chrome rejects.
- Use `overflow: clip` (not `hidden`) on wrappers around revealed content; `hidden` creates a scroll container that view timelines then track.
- Astro component `<style>` blocks are unlayered and beat Tailwind utilities. Don't set `display` in a component style on an element that also uses responsive display utilities.
- Default (non-animated) styles must show the content. Motion goes inside `@media (prefers-reduced-motion: no-preference)`.
- The 3D house (`House3D.astro`) is static on purpose: don't animate `.h3d`, `.h3d-pose` or any face, on a clock or on the scroll (turning a preserve-3d subtree on the pinned stage reads as jumping). Animate only the sc-* parts inside the front SVG. Every wrapper between `.h3d` and the faces keeps `transform-style: preserve-3d`. Don't put opacity, filter, clip-path, overflow or isolation on those wrappers; any of them flattens the house. Position anything new in canvas units (`var(--u)`), never in percentages of the frame.
- Playwright WebKit screenshots flatten 3D transforms; check 3D in WebKit with a recorded video instead.

## Docs

https://docs.astro.build
