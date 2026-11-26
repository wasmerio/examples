# UX heuristics (Nielsen + project patterns)

## Nielsen's 10 heuristics (applied)

1. **Visibility of system status** — Show progress, loading, saved state. Never leave a blank screen after an action.
2. **Match real world** — User language in Paraglide messages, not developer terms ("404" → "Page not found").
3. **User control** — Cancel, back, undo where destructive. Language switcher preserves current page context.
4. **Consistency** — Header/footer on every page via `DefaultLayout`. Same button labels for same actions.
5. **Error prevention** — Confirm destructive actions; constrain inputs (date pickers, selects).
6. **Recognition over recall** — Show options; don't make users remember codes or paths.
7. **Flexibility** — Shortcuts for power users optional; defaults must work for novices.
8. **Aesthetic and minimalist** — Remove fields and copy that don't serve the task (ux scope: content, not visual trim).
9. **Help recover from errors** — Error text says what went wrong and what to do next.
10. **Help and documentation** — Link to support or FAQ when tasks are complex.

## Cognitive load

- One primary action per screen section.
- Chunk long forms (contact: name → message → send, not 15 fields at once).
- Progressive disclosure: show advanced options only when needed.
- Avoid walls of text — use headings and short paragraphs.

## Forms (when `src/forms/` grows)

| Element         | UX rule                                                           |
| --------------- | ----------------------------------------------------------------- |
| Labels          | Always visible; placeholder is not a label                        |
| Required fields | Mark required; don't mark optional fields as required by omission |
| Errors          | Inline, next to field, in `messages/*.json`                       |
| Success         | Clear confirmation; what happens next ("We'll reply within 24h")  |
| Submit          | Disable during submit + loading indicator; prevent double submit  |

## Navigation

- Current page indicated in nav (aria-current="page" or visual + accessible).
- Logo/home link is obvious.
- Footer repeats key links for users who scroll past content.
- Locale switcher: show current language; switching keeps user on equivalent page (`localizeHref`).

## Mobile

- Primary actions in thumb zone (bottom half of screen when possible).
- No hover-only interactions — everything works on tap.
- Adequate spacing between tappable items (min 8px gap; 44px targets ideal).
- Forms use appropriate `inputmode` and `type` (`email`, `tel`, `url`).

## Copy guidelines (Paraglide keys)

- **Buttons**: verb-first — `contact_form_submit` → "Send message"
- **Headings**: describe the section benefit, not "Welcome to section 2"
- **Errors**: `[What happened]. [What to do].` — "Enter a valid email address."
- **Empty states**: explain value + next step, not "No data"

## Anti-patterns

- "Click here" link text
- Generic "Something went wrong" without recovery path
- Silent form failure (no UI change on error)
- Modal on every page load
- Forcing account creation before showing value
- English error strings in Spanish locale pages

## Handoff to other experts

| If you find…                                | Hand off to          |
| ------------------------------------------- | -------------------- |
| Low contrast, missing labels, keyboard trap | accessibility-expert |
| Weak hero visual, poor CTA prominence       | conversion-designer  |
| Missing page title, bad meta description    | honest-seo-expert    |
| Slow form submission (network)              | performance-expert   |
