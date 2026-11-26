# FORMA Design Rules

Read this guide before visual work. `design/default.md` is the source of truth for FORMA's visual direction and token values. Keep the shared rules here aligned with that file and with the current components.

## Visual direction

FORMA draws on contemporary architecture, natural materials and considered editorial layouts. Build clear hierarchy through proportion, typography, imagery and spacing. Sections may use distinct, asymmetric compositions when they support the content. Avoid generic repeated card grids and decorative elements without a purpose.

The FORMA mark includes a copper dot. It may remain part of the logo or appear as a restrained brand accent. Avoid adding unrelated decorative dots or pulsing indicators. Do not use `animate-pulse`.

## Typography and colors

- Use the self-hosted Instrument Sans Variable font through `--font-sans` and `--font-heading`. Do not introduce another font family or an external font CDN.
- Use Tailwind's existing theme utilities and CSS variables for brand colors, spacing, radii and surfaces. Do not hardcode brand colors in components or one-off CSS.
- The palette supports white, warm neutral, copper and graphite surfaces. Dark graphite sections and the selected `graphite-quiet` footer are valid parts of the design. Keep text and controls legible against each surface.
- `design/default.md` owns token values. Synchronize token changes with `npm run design:sync` rather than editing generated theme values by hand.

## Components and layout

- Work Tailwind-first. Prefer responsive utility classes and existing layout primitives for spacing, grids and alignment. Keep component CSS for complex, repeated patterns and interaction details that do not fit cleanly in utilities.
- Reuse `Button.astro`, `Heading.astro`, `Text.astro`, `Section.astro` and `Container.astro` when their contracts fit. Use semantic HTML where no existing primitive fits; do not force every text element through an atom.
- Keep spacing decisions with the layout or section that owns them. Follow mobile-first behavior and preserve a deliberate composition on small screens.
- Use the shared button behavior when it fits. Keep custom navigation and footer controls consistent with their existing component patterns.
- Apply `ui-card-interactive` only to cards that are interactive. Do not add one-off hover lifts, shadows or borders to cards.
- Keep internal links on trailing-slash routes.

## Motion and accessibility

- Use the existing reveal system in `src/scripts/motion.ts` and `src/styles/motion.css` for section and viewport reveals. Keep content visible by default and avoid animating every element.
- Respect `prefers-reduced-motion` for motion and transitions. Prefer restrained opacity, small translations and purposeful control feedback.
- Keep keyboard focus visible, controls understandable and text readable across light and graphite surfaces.

## Images and composition

Use relevant architectural photography and material details with descriptive alternative text. Treat demonstration assets and claims as examples that must be replaced with verified material before a business site is published. Preserve a clear heading hierarchy and one primary action per section where possible.
