# Constructa architecture

The site is a static document with progressively enhanced, section-local motion.

## Data flow

`cv.json` → `src/data/cv.ts` (`cvSchema.parse`) → typed configuration → Astro components.

`src/data/schema.ts` owns the Zod schema, defaults, and inferred types.
`cv.schema.json` exposes the configuration to editors. Parsing runs at module
load, so invalid content fails development/build with an issue path rather than
silently rendering a different data shape. Components import validated data;
there is no browser-side content API or React island.

The public configuration boundary includes `site`, `hero`, `sections`, `ui`,
and the CV content lists. `site` owns public URL/base, language, timezone, SEO,
the entrance loader, feature switches, and footer settings. `hero` owns presentation and explicit
metric values. `sections` controls the enabled document order and navigation.
`ui` contains flat string overrides. See [CONFIGURATION.md](CONFIGURATION.md).

Configuration-only requests must not create alternate data constants or rewrite
components. New capabilities may extend the schema, rendering, and tests together.

## Theming

`src/globals.css` imports the shared foundations. `src/styles/foundations/foundation.css` defines each palette as CSS variables under `:root[data-theme="..."]` and `:root.dark[data-theme="..."]`. `src/layouts/Layout.astro` writes `basics.theme` as `data-theme` on `<html>`, and an inline script restores saved preferences before first paint. Blocked storage falls back to the configured palette and operating-system color scheme. `ThemeSwitch.astro` and `src/scripts/theme.ts` update `<html>` and use circular View Transitions of `main` when supported. Navigation stays outside the snapshot so its controls remain clickable during the transition. New input supersedes an unfinished theme transition, and reduced-motion changes or printing end it immediately. The controls stay usable if persistence fails, and system color changes remain automatic until the user chooses a mode. A root-attribute observer synchronizes the accessible state and browser theme color after asynchronous transitions.

The `@theme inline` block exposes variables as Tailwind utilities. Typography is Anton for display, Space Grotesk for body copy, Instrument Serif for editorial accents, and JetBrains Mono for annotations.

## Document and navigation

`src/pages/index.astro` composes enabled sections in configuration order from
the eight supported IDs: `top`, `about`, `experience`, `projects`, `education`,
`skills`, `gallery`, and `contact`. Each rendered chapter has
`data-scroll-section`, an index, and a label. `Section.astro` supplies the common
heading and local progress rule. `Layout.astro` mounts the real document alongside
enabled navigation, inspection controls, and native dialogs. The optional
`SiteLoader.astro` covers only the entrance; it does not replace the document
with a screen stage or move any section into a drawer.

`src/scripts/scroll-experience.ts` measures these sections and owns shared active-section state. It writes `data-active-section`, `--page-progress`, and each section's `--section-progress`, sets navigation `aria-current`, and broadcasts `portfolio:section`. The top bar, section rail, compact HUD, and blueprint inspector read this same document state.

The top bar consists of independent brand, chapter, appearance, and Index tiles.
`floating-nav.ts` reads the same
active-section state and coordinates its indicator with hover and keyboard
focus; it does not own a separate scroll position. `floating-nav.css` supplies
the dock, layered labels, and motion-aware transitions. The custom cursor is
mounted as a direct body child in `Layout.astro`, outside `main`'s stacking
context, so it can paint above the dock. Native pointers remain available for
editable controls, reduced motion, and native dialogs.

Section links, command search, project deep links, browser history, and keyboard focus target the original DOM elements. `#project-N` identifies a real article in both the horizontal and stacked layouts; navigation resolves it to the corresponding vertical document offset when the exhibition is enabled.

## Entrance and code organization

`site-loader.ts` assembles the configured color plates, merges them into a
single field, and reveals the page. Readiness uses the real font-loading
promise, a configured deadline, and an independent inline watchdog in the
document head. Exiting releases inert controls and hands keyboard focus from
the overlay to `main`. Skip, reduced-motion changes, printing, and page hiding
all release the entrance. The `portfolio:enter` event starts the navigation
and hero entrance while the final field reveals them.

The scroll controller bounds its own initial load/font wait to 1500 ms, so
navigation and project fragments stay available after an entrance timeout.
Late resources refresh measurements without replaying the initial fragment.

| Layer | Responsibility |
| --- | --- |
| `styles/foundations/` | Tokens, type, shared primitives, document chrome, and base print rules. |
| `styles/components/` | Dialogs, inspection controls, poster studio, and A4 composition. |
| `styles/sections/` | Each chapter's base composition, imported by its Astro component. |
| `styles/experience/` | Shared document-flow, exhibition, responsive, motion, and print overrides. |
| `scripts/scroll-experience.ts` | Shared section state, geometry, navigation, history, and motion lifecycle. |
| `scripts/section-motion.ts` | Hero and chapter-specific visual timelines. |
| `components/projects/`, `components/gallery/`, `components/index/` | Reusable media, links, records, and search-result markup. |

`globals.css` and `scroll-experience.css` are import entry points. The override
order is deliberate: foundation, chapter composition, then document-experience
rules. Component extraction still reads the same validated CV data.

## Motion

GSAP ScrollTrigger owns the active visual timelines. Lenis provides desktop fine-pointer wheel smoothing using real document scrolling; touch is native. `src/styles/scroll-experience.css` contains the section layout and disables competing legacy reveal rules once `scroll-ready` is set. `src/scripts/motion.ts` handles expanders, print-mode selection, and magnetic actions, not a second scroll controller.

The hero combines oversized seeded, interleaved typography, a diagonal accent
plane, a shared original `ConstructionMark`, and secondary pixel-globe artwork. The config controls name lines, copy,
typography, and globe options. There is no React runtime or vendored React Bits
component. Decorative motion must not alter the semantic heading or require
animation before content can be read. The short local pin applies only to
sufficiently large, motion-enabled viewports.

`SectionTransition.astro` adds a configured thought line and a chapter-specific
arrangement of that same mark before subsequent sections. `section-motion.ts`
drives its local progress; reduced motion leaves it static and print omits it.

The project exhibition uses `[data-project-exhibition]`, a sticky `[data-project-pin]`, and a `[data-project-track]` holding the original articles. The controller enables `data-project-scroll="true"` for sufficiently large motion-enabled viewports and derives `--project-travel` from the row's overflow. Vertical scroll translates the row; active-project state and the readout follow its progress. Mobile, short viewports, reduced-motion, no-JS, and print keep stacked content rather than clipped slides.

Skill filtering, expanded records, gallery view changes, fonts, and resize events
can change document geometry. Components dispatch `portfolio:layout` when
appropriate so the controller can refresh measurements. Native dialogs pause
background smoothing while leaving internal scrolling native. Runtime
reduced-motion changes tear down animation and smoothing; visual effects never
make content a separate data source. Feature switches may disable enhancements
without removing the underlying document.

## Lightbox

`Lightbox.astro` is a native `<dialog>`, driven by `src/scripts/lightbox.ts` from any `[data-lightbox]` trigger. With View Transitions available, the thumbnail gets `view-transition-name: lightbox-media`, the dialog image carries the same name, and the browser morphs between the two; otherwise the dialog opens instantly. The viewer closes from the close button, a backdrop click, or Escape, and returns focus to the trigger. Reduced-motion users always get the instant path.

## Dialogs and gallery

`IndexDialog` is a searchable native command palette over the build-time CV index; `Cmd/Ctrl+K` or `/` opens it. `ProjectCase` renders full case records from the same CV data in a native dialog with previous/next navigation. `PosterStudio` is independent. No dialog moves a document section out of its place.

`Images.astro` provides the draggable PhotoBoard and a native horizontally
scrolling strip. `photo-board.ts` and `strip.ts` control those presentations;
the shared lightbox uses their image sources and captions. Reduced-motion strip
navigation is instant. Lightbox close-event cleanup also releases page locks
when printing closes the dialog from outside its ordinary UI.

The shipped demo assets are original SVG illustrations for neutral example
content, not fictional screenshots presented as real client projects. Users can
reference their own public assets or remote image URLs through configuration.

## Poster studio and print

`PosterStudio.astro` composes a seeded 1200x1600 SVG from CV data and theme tokens, then downloads it as SVG or PNG with fonts inlined. `PrintPoster.astro` is a separate A4 composition. Compact print is the default; poster mode is selected by `data-print-mode="poster"`. Because the global print stylesheet defines 11/12/13 mm page margins, `motion.ts` injects a zero-margin A4 `@page` rule while poster mode is active. Without it, Chromium pushes the poster footer onto a second page.

Print styles reset sticky positioning, exhibition translation, and reveal
transforms. Compact print uses the same document with a dedicated masthead;
poster mode hides it for the A4 composition. The 1200x1600 studio export is not
the A4 print surface. Hidden skill groups need explicit print overrides in the
same base layer as the important `[hidden]` rule; an unlayered `revert` rule does
not beat important-layer precedence. Printing must not clear a visitor's filter
when they return to the screen.

## URLs and static deployment

The deployment origin and base path come from `site`, not hardcoded personal
URLs. Public asset resolution must prepend the base once; absolute remote URLs
remain absolute. Canonical, Open Graph, sitemap, robots, favicon, and print/export
assets should be checked against the same deployment contract. GitHub Pages
repository subpaths are a supported target, not a development-only special case.

## Verification

The Playwright suite targets real document sections through
`tests/e2e/scroll-helpers.ts`. Regression areas include local progress, project
anchors and keyboard access, dialogs, no-JS content, runtime reduced-motion,
filtering, palette persistence, responsive overflow, accessibility, and print.
Run tests against the current theme configuration and deployment base. Prior
results from the personal-portfolio source are not proof that a theme release
passed. Use [RELEASE.md](RELEASE.md) to collect current release evidence.
