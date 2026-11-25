# DESIGN-GUIDE.md

## Design Philosophy

Follows this core aesthetic principles: **clean, minimal, content-first**. The design should never compete with the content-everything exists to serve readability.

Inspired by [AstroPaper](https://github.com/satnaing/astro-paper).

---

## Unified CSS Class System

All styles are defined in `@src/styles/global.css`. No inline `<style>` allowed in components.

### Typography Classes
| Class | Description |
|-------|-------------|
| `title-xl` | Page title (1.5rem, 800) |
| `title-lg` | Section title (1.25rem, 700) |
| `title-md` | Subsection (1.1rem, 700) |
| `body` | Body text (0.95rem, 1.65 line-height) |
| `body-sm` | Small text (0.85rem) |
| `body-xs` | Tiny text (0.75rem) |
| `mono` | Code/text (JetBrains Mono) |

### Layout Classes
| Class | Description |
|-------|-------------|
| `container-narrow` | Max-width 800px |
| `space-y-1` to `space-y-4` | Margin bottom scale (0.5-2rem) |
| `gap-1` to `gap-4` | Gap scale |

### Component Classes
| Class | Description |
|-------|-------------|
| `card` | List item container with border-bottom |
| `card-title` | Title link with hover effect |
| `card-meta` | Metadata row with opacity |
| `card-desc` | Description with 2-line clamp |
| `card-link` | External link button |
| `tag` | Minimal accent-colored badge |
| `btn` | Standard button |
| `btn-sm` | Small button |
| `btn-icon` | Icon-only circular button |
| `icon-btn` | Social/share buttons |
| `social-link` | Social icon links |
| `link` | Text link with underline |

### Layout Section Classes
| Class | Description |
|-------|-------------|
| `sidebar` | 280px sticky profile sidebar |
| `sidebar-avatar` | 112px circular avatar |
| `sidebar-name` | Name heading |
| `sidebar-info` | Institution/info text |
| `sidebar-bio` | Short bio text |
| `navbar` | Top navigation bar |
| `nav-links` | Nav link list |
| `nav-link` | Nav link with active indicator |
| `main-content` | Right content area wrapper |
| `main-body` | Content padding container |
| `footer` | Site footer |

### Prose Classes
| Class | Description |
|-------|-------------|
| `prose` | Main content wrapper |
| `prose h1/h2/h3` | Heading styles |
| `prose p` | Paragraph styling |
| `prose ul/ol` | List styling with accent markers |
| `prose code` | Inline code styling |
| `prose pre` | Code block with border |
| `prose img` | Image styling |
| `prose blockquote` | Quote styling |
| `prose hr` | Horizontal divider |

---

## Layout

### 2-Column Structure (Primary)
- **Left Sidebar:** Sticky profile with name, institution, social links, short bio. Width 280px desktop.
- **Right Main:** Scrollable content area. Max-width 800px for optimal reading line length.
- **Responsive:** Sidebar collapses to top header + border on mobile.

### Spacing (Compact)
- Vertical whitespace between sections: 2rem
- Items in lists separated by 2rem gaps
- Paragraphs use tighter line-height (1.65-1.7)

---

## Color

### Principles (AstroPaper-inspired)
- **Monochromatic base:** Let content breathe. No competing colors.
- **Accent = function:** Use accent only for hover states, active links, and subtle highlights.
- **One accent color per theme:** Never use multiple accent colors together.

### Theme System
- Themes configured in `src/config/themes.ts` - unified THEMES object with `isDark` flag
- Each theme defines 6 tokens: `background`, `foreground`, `accent`, `muted`, `border`, `surface`
- All CSS variables injected into `src/styles/global.css`
- Users select active light/dark themes via `src/config/site.ts` (`THEME_CONFIG.themeLight`, `THEME_CONFIG.themeDark`)

### Contrast (non-negotiable)
- Text must pass WCAG AAA contrast in both light and dark modes.
- Minimum 7:1 contrast ratio for body text.

---

## Typography

### Font Stack
- **Body/Headings:** Inter (via @fontsource/inter)
- **Code/Tags/Metadata:** JetBrains Mono (via @fontsource/jetbrains-mono)
- No external web fonts—self-host via fontsource packages

### Hierarchy
- **Page title:** 1.5rem, font-weight 800, letter-spacing -0.02em, line-height 1.2
- **Section heading (h2):** 1.25rem, font-weight 700, border-bottom 1px solid border
- **Body text:** 0.95rem, line-height 1.65, opacity 0.92

---

## UI Components

### Flat Design
- **NO drop shadows.** Ever.
- **NO glassmorphism.**
- NO heavy gradients.
- Separation = 1px solid border OR subtle background variation.
- **Subtle border-radius:** 0.25rem on cards and code blocks

### Links
- Underline with 4px offset.
- Hover: color shifts to accent, full opacity.
- Transition: 0.2s ease.

### Buttons
- Flat, no shadows.
- Hover: subtle border/color change.
- Icon buttons use 50% border-radius.

### Icons
- Outline style (Lucide/Tabler style).
- stroke-width: 1.5px.
- Sizes: 24px (standard).

---

## Accessibility

- **Focus rings:** Visible dashed outline for keyboard navigation.
- **Reduced motion:** Respect `prefers-reduced-motion` media query.
- **Alt text:** Required for all images.

---

## Implementation Notes

- **No `<style>` in `.astro` files.** All styles in global.css or via Tailwind classes.
- **Tailwind v4:** Uses `@tailwindcss/vite` plugin (no `tailwind.config.js`).
- Tailwind utilities allowed for layout, but prefer unified CSS classes.
- Use CSS variables (e.g., `var(--foreground)`, `var(--accent)`) for theming.

---

## File Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── LeftSidebar.astro   (uses .sidebar, .sidebar-avatar, .sidebar-name, .social-link)
│   │   ├── Navbar.astro        (uses .navbar, .nav-links, .nav-link, .btn-icon)
│   │   ├── RightMain.astro     (uses .main-content, .main-body)
│   │   └── Footer.astro        (uses .footer)
│   ├── content/
│   │   └── ContentLinks.astro
│   └── ui/
│       ├── BaseItemCard.astro  (uses .card, .card-title, .card-meta, .card-desc)
│       ├── Tag.astro          (uses .tag)
│       ├── BackLink.astro    (uses .back-link)
│       ├── ShareButtons.astro (uses .icon-btn)
│       └── Icon.astro
├── layouts/
│   ├── BaseLayout.astro
│   ├── BaseDetail.astro       (uses .prose, .page-title, .card-meta)
│   ├── BaseListing.astro      (uses .item-list, .page-header)
│   └── DevToolsLayout.astro
└── styles/
    └── global.css             (all unified classes)
```