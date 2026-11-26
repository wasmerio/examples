# WCAG 2.2 AA checklist (project-specific)

## Perceivable

### Text alternatives (1.1)

- [ ] Every informative image has accurate `alt` (honest description, not SEO).
- [ ] Decorative images use `alt=""`.
- [ ] Icons with meaning have accessible name (`alt`, `aria-label`, or visible text).
- [ ] Complex charts have text alternative or longer description nearby.

### Adaptable (1.3)

- [ ] Single `<h1>` per page; logical heading order.
- [ ] Landmarks: `header`, `main`, `footer` (via layout components).
- [ ] Form inputs associated with `<label>` or `aria-labelledby`.
- [ ] Lists use `ul`/`ol`/`li`; tables use `th` with `scope` when tabular data.

### Distinguishable (1.4)

- [ ] Text contrast ≥ 4.5:1 (normal) or ≥ 3:1 (large text 18px+ / 14px bold).
- [ ] UI component and graphic contrast ≥ 3:1 against adjacent colors.
- [ ] Focus indicator visible and ≥ 3:1 contrast.
- [ ] No information conveyed by color alone (add icon, text, or pattern).
- [ ] `prefers-reduced-motion`: respect for animations (CSS `@media (prefers-reduced-motion: reduce)`).

## Operable

### Keyboard (2.1)

- [ ] All functionality available via keyboard.
- [ ] No keyboard traps (modals/drawers must Escape to close).
- [ ] Skip link (`SkipToContent`) visible on focus and moves focus to `#main`.

### Enough time (2.2)

- [ ] No auto-advancing carousels without pause control.
- [ ] Session timeouts warn users if applicable.

### Seizures (2.3)

- [ ] No flashing content > 3 times per second.

### Navigable (2.4)

- [ ] Page `<title>` unique and descriptive (via layout `title` prop).
- [ ] Focus order matches visual order.
- [ ] Link purpose clear from text or context.
- [ ] Multiple ways to find pages if site grows (nav, search, sitemap).

### Input modalities (2.5)

- [ ] Touch targets ≥ 24×24 CSS px (44×44 recommended for mobile).
- [ ] Drag actions have keyboard alternative.

## Understandable

### Readable (3.1)

- [ ] `html lang={getLocale()}` set in `BaseLayout.astro`.
- [ ] Language changes in content marked with `lang` attribute if mixed.

### Predictable (3.2)

- [ ] Focus does not unexpectedly change context on input.
- [ ] Consistent navigation across pages (`Header.astro`).

### Input assistance (3.3)

- [ ] Errors identified in text (not color alone).
- [ ] Labels and instructions for required fields.
- [ ] Error suggestions when format is known (e.g. email).

## Robust (4.1)

- [ ] Valid HTML semantics (no duplicate IDs).
- [ ] Custom components expose name, role, state to assistive tech.
- [ ] Status messages use `role="status"` or `aria-live` where appropriate.

## daisyUI-specific

| Component            | Check                                                                   |
| -------------------- | ----------------------------------------------------------------------- |
| `btn`                | Use `<button>` or `<a>`; not `<div onclick>`                            |
| `modal`              | Focus trap + restore focus on close; Escape closes                      |
| `dropdown`           | Keyboard open/close; `aria-expanded` on trigger                         |
| `checkbox` / `radio` | Native input inside label or explicit `for`/`id`                        |
| `toggle`             | Associated label; state announced                                       |
| `menu`               | Arrow key navigation if custom; else native `<select>` for simple cases |

## Svelte interactive components

- Prefer `<button type="button">` over clickable `<div>`.
- `tabindex="0"` only when no semantic element fits.
- Announce dynamic updates (`aria-live="polite"` for non-urgent, `assertive` for errors).
- On destroy, remove listeners and restore focus if modal-like.

## Quick manual test

1. Tab from page load — skip link appears and works.
2. Tab through all interactive elements — logical order, visible focus.
3. Activate buttons/links with Enter/Space.
4. Close any overlay with Escape.
5. Zoom to 200% — content reflows, no horizontal scroll on main content.
6. Screen reader spot-check (optional): page title, h1, main landmark announced.
