# Compliance Statement

This starter template is designed to satisfy the following federal standards
out of the box. Adopting teams are responsible for verifying compliance after
adding agency-specific content.

---

## Section 508 / WCAG 2.1 AA

| Requirement | Status | Implementation |
|---|---|---|
| Text alternatives for non-text content (1.1.1) | ✅ Included | All images have `alt` attributes; decorative images use `alt=""` |
| Captions for video (1.2.2) | ⬜ Stub | No video components in v0.1; add captions when embedding media |
| Keyboard navigable (2.1.1) | ✅ Included | Skip nav link, logical tab order, USWDS focus styles |
| Focus visible (2.4.7) | ✅ Included | USWDS default focus ring; enhanced in `globals.css` |
| Language of page (3.1.1) | ✅ Included | `lang` attribute set on `<html>` from i18n locale |
| Language of parts (3.1.2) | ✅ Included | `lang` and `hreflang` on language-toggle links |
| Error identification (3.3.1) | ⬜ Stub | Form patterns scaffolded in M2; requires agency content |
| Name, role, value (4.1.2) | ✅ Included | USWDS components provide correct ARIA; `aria-current` on nav |

Automated testing via `@axe-core/cli` is wired in CI (M3). Manual screen
reader testing with VoiceOver/NVDA is required before production launch.

---

## 21st Century IDEA Act

| Requirement | Status | Notes |
|---|---|---|
| Mobile-friendly | ✅ Included | USWDS responsive grid; Astro static output |
| Accessible | ✅ Included | See Section 508 above |
| Discoverable | ✅ Included | `sitemap-index.xml` generated at build by `@astrojs/sitemap` |
| Secure (HTTPS) | ✅ By host | All recommended hosts enforce HTTPS |
| Plain language | ✅ Seed content | Seed copy targets ≤ grade 8; verified by plain-language gate |
| No broken links | ✅ CI gate | lychee link checker in CI (M3) |
| Customizable | ✅ Included | `src/config/site.ts` for agency name, domain, links |

---

## U.S. Web Design System (USWDS)

- **USWDS version:** 3.x (see `package.json` for exact pin)
- **Required components present on every page:**
  - `usa-banner` — official government website identification
  - `usa-identifier` — agency identifier with required links
  - `usa-skipnav` — skip navigation for keyboard users
- **Customization:** USWDS tokens are the source of truth for color, spacing,
  and typography. Tailwind CSS utilities are scoped to non-USWDS areas.

---

## Privacy

- **No analytics by default.** No tracking scripts are included.
- **DAP (Digital Analytics Program):** Not included. To add DAP, insert the
  script tag in `BaseLayout.astro` per [DAP documentation](https://digital.gov/guides/dap/).
- **No cookies by default.** Static output sets no server-side cookies.
- **Third-party requests:** The only external URL in default output is
  `https://www.usa.gov/` (USA Identifier link). No external scripts or fonts
  are loaded.

---

## Adopting teams must verify

1. All agency-specific content meets WCAG 2.1 AA after replacement.
2. Any forms added have proper error handling and accessible labels.
3. Any third-party scripts (analytics, chat, maps) are assessed for privacy impact.
4. The privacy page (`/privacy/`) reflects actual agency data practices.
5. The accessibility statement (`/accessibility/`) is updated with agency contact info.
