# Customize the Header

Files: `src/components/widgets/Header.astro` (markup + `aw-header` web component), `src/navigation.ts` (links and actions), `src/components/common/ToggleMenu.astro`, `src/components/common/ToggleTheme.astro`, `src/components/Logo.astro`, header rules in `src/assets/styles/tailwind.css`.

## Props (`<Header />`)

| Prop              | Default    | Effect                                             |
| ----------------- | ---------- | -------------------------------------------------- |
| `links`           | `[]`       | Menu; items with `links: [...]` become dropdowns   |
| `actions`         | `[]`       | Buttons on the right (`Button` props)              |
| `isSticky`        | `false`    | Sticky header; gets the `scroll` class after 60 px |
| `isDark`          | `false`    | Force dark styles                                  |
| `isFullWidth`     | `false`    | Drop the `max-w-7xl` container                     |
| `showToggleTheme` | `false`    | Light/dark switch                                  |
| `showRssFeed`     | `false`    | RSS icon (`/rss.xml`)                              |
| `position`        | `'center'` | `'left'`, `'center'` (3-column grid) or `'right'`  |

`PageLayout.astro` renders `<Header {...headerData} isSticky showRssFeed showToggleTheme />`; `LandingLayout.astro` shows how to pass a reduced menu.

## Breakpoints

- Mobile/tablet (< 1024 px): hamburger (`ToggleMenu`), full-screen menu (`#header.expanded nav` in `tailwind.css`), actions pinned to the bottom.
- Desktop (`lg`, ≥ 1024 px): inline menu with hover/focus dropdowns.
- The announcement bar (`Announcement.astro`) uses the same `lg` breakpoint.

To change the breakpoint, replace every `lg:` in `Header.astro` and the two `#header.scroll` rules in `tailwind.css`, and update `matchMedia('(max-width: 1023px)')` in the component script. Keep them in sync or the menu will not close when resizing.

## Menu width

Five top-level items at ~0.94 rem need about 470 px. If you add items, either shorten labels, reduce `px-4` on the links, or keep the hamburger up to `xl`.

## Active link

- Server side: `isActive(href)` compares paths without trailing slashes (works with `trailingSlash: true` and `base`).
- Client side: `updateActiveLinks()` re-applies `aw-link-active` after view transitions and ignores anchor-only links (`#`, `/#features`).
- Colour: `#header nav .aw-link-active` uses the `link` token → `--aw-color-link` (defaults to `--aw-color-primary`). Set `--aw-color-link` in `src/components/CustomStyles.astro` to change it.

## Dropdown surface

Light: `lg:bg-white/90` + blur + shadow. Dark: `dark:lg:bg-slate-900` + `border-slate-700/50`. Edit the `<ul class="dropdown-menu …">` in `Header.astro`.

## Sticky background

`#header.scroll > div:first-child` in `tailwind.css`: solid `bg-page` below `lg`, translucent + `backdrop-blur` from `lg`. Before scrolling the header is transparent over the hero on purpose (`Hero.astro` pulls content up with `md:-mt-[76px]`).

## Notes

- The header is `transition:persist`ed across view transitions; state lives in the `aw-header` custom element, not in global scripts.
- RTL is supported through `rtl:` utilities; keep them when editing classes.
