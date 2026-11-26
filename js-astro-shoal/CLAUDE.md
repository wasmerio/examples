# Notes for coding agents

Shoal is a static Astro 7 theme (plain CSS, TypeScript). Read `README.md` first.

## Commands

- `npm run dev`
- `npm run build` and `npm run check` must both pass with 0 errors and 0 warnings.

## Where things live

- Rebranding and all home-page content: `src/config.ts` only. Don't hard-code the agent's name, phone or email in components.
- Home page sections: `src/components/sections/`. Inner pages use `src/components/Prose.astro`.
- Shared styles and the entrance keyframes: `src/styles/global.css`. Behaviour: `src/scripts/site.ts` (entrances, header, dialogs). Keep it dependency-free.

## The contact form (`src/components/ContactForm.astro`)

- Show the success state only when the server's JSON has `success === true`. Never on a network error, never on a non-JSON reply.
- Keep the `botcheck` honeypot input exactly as it is, inside its `aria-hidden` wrapper. Never fill it.
- Keep the no-JavaScript path working: real `action`, `method="POST"`, hidden `_redirect` to `/thanks/`.
- Don't add an API route, server or database for the form. Formgong (or another POST form backend) stores and delivers submissions.

## Motion rules

- Entrances (`[data-reveal]`) are hidden only when the `js` class is on `<html>`, and `site.ts` adds `.is-in` when they enter the viewport. Without JavaScript everything simply shows.
- Timings (1 s, delays .1–.6 s, nav 1.0–1.5 s), the tile hover (title −51 px, image ×1.05 over .75 s, overlay to black) and the header behaviour were measured on the reference design. Change a value only after measuring again.
- `prefers-reduced-motion: reduce` turns entrances and the hero drift off.
- No animation libraries.

## Docs

https://docs.astro.build
