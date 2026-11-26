# Component catalog

## FORMA UI

- `src/components/ui/atoms/` contains buttons, headings, text, labels, inputs, icons and logos.
- `src/components/ui/layout/` contains containers, sections, grids, stacks and reveal helpers.
- `src/components/ui/molecules/` contains navigation, footer, section headers and reusable content groups.

## FORMA homepage

The homepage uses `SiteNavbar.astro` from `ui/molecules/` and these components from `ui/organisms/`: `HeroSection`, `ServicesSection`, `ProjectsSection`, `WhySection`, `ProcessSection`, `TestimonialsSection`, `AreaSection`, `FaqSection`, `ContactSection` and `FooterSection`. `ProjectGallery.tsx` and `TestimonialSlider.tsx` provide the React interactions.

`src/pages/index.astro` selects the production variants. Development variant controls do not ship in the production build. Read [content-map.md](content-map.md) for the corresponding JSON files.

## Starwind component source

All source owned Starwind components are in `src/components/starwind/`. The repository includes the complete installed Astro component set. Prefer these components for dialogs, menus, forms, tabs, selects, accordions, tooltips and other interactive patterns.

Do not add another visual component library to the project without a documented architectural decision.
