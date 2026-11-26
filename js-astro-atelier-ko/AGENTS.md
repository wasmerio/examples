# Instructions for Astro Theme Development

These instructions apply to all Astro theme work. Prioritize clean, reusable, accessible, fast, SEO-friendly code. Treat the theme as something that may be reused across multiple websites, not as a one-off implementation.

## General Principles

* Prefer simple, maintainable Astro components over unnecessary abstractions.
* Keep the default Astro advantage: mostly static HTML, minimal JavaScript, and hydration only where needed.
* Do not add client-side JavaScript unless there is a clear user-facing reason.
* Avoid unnecessary dependencies. Before adding a package, check whether the same result can be achieved with Astro, HTML, CSS, or a small utility.
* Keep components reusable, documented, and easy to override.
* Use TypeScript where helpful, especially for props, content schemas, config objects, and reusable utilities.
* Favor progressive enhancement. The site should remain usable even if JavaScript fails.
* Keep markup clean, semantic, and easy to crawl.
* Never solve layout or behavior problems in a way that harms accessibility, SEO, or performance.
* Follow README layout as here https://github.com/andreialba/maria must include the title, preview image with a link to the preview URL, those cards with versions, preview link, short description of the theme, list of features, and how to set things up.
* Add MIT license under Andrei Alba

## Astro-Specific Guidelines

* Use `.astro` components for static and content-focused UI.
* Use islands/client hydration only when interactivity is required.
* Avoid `client:load` unless the component truly needs to run immediately.
* Prefer `client:visible`, `client:idle`, or no hydration when possible.
* Keep layout components responsible for page structure, shared metadata, global slots, and theme-level wrappers.
* Keep UI components small and focused.
* Use `Astro.props` with typed props where possible.
* Use content collections for structured content like posts, pages, projects, docs, testimonials, FAQs, and changelogs.
* Validate frontmatter with schemas instead of relying on loose optional fields.
* Keep route structure clean and predictable.
* Do not hardcode production URLs inside components. Use site config, constants, or environment-aware helpers.
* Make sure the theme works with a configurable `site` value in `astro.config.*`.

## Accessibility Requirements

* Use semantic HTML first. Do not use ARIA when a native HTML element solves the problem.
* Use landmarks properly: `header`, `nav`, `main`, `section`, `article`, `aside`, and `footer` where appropriate.
* Each page should have one clear `h1`.
* Preserve logical heading order. Do not skip heading levels for visual styling.
* All interactive elements must be keyboard accessible.
* Use real buttons for actions and real links for navigation.
* Every form control must have an associated label.
* Inputs, errors, help text, and validation states must be understandable to screen readers.
* Add visible focus styles. Never remove outlines without replacing them with an accessible focus state.
* Provide a skip link for keyboard users when the layout has repeated navigation.
* Use descriptive link text. Avoid vague text like “click here” or “read more” without context.
* Images must have useful `alt` text when meaningful.
* Decorative images should use empty alt text.
* Icons used as buttons or links must have accessible names.
* Ensure sufficient color contrast for text, icons, borders, and states.
* Do not rely on color alone to communicate meaning.
* Respect `prefers-reduced-motion`.
* Avoid auto-playing motion, carousels, or animations unless they are user-controlled and accessible.
* Modals, menus, accordions, tabs, dropdowns, and mobile navigation must handle focus, keyboard interaction, and escape/close behavior correctly.
* Test important templates with keyboard navigation and screen reader-friendly markup in mind.

## SEO Requirements

* Every page should have a unique, descriptive `<title>`.
* Every indexable page should have a useful meta description.
* Use a reusable SEO or Head component for metadata.
* Include canonical URLs where appropriate.
* Support Open Graph metadata for social sharing.
* Support Twitter/X card metadata where appropriate.
* Use absolute URLs for canonical and social image URLs.
* Configure `site` in `astro.config.*` so canonical URLs and sitemap generation work correctly.
* Include sitemap support for production themes.
* Include sensible robots handling.
* Avoid duplicate metadata across pages.
* Avoid duplicate content caused by inconsistent trailing slashes, canonical paths, or pagination.
* Use clean, descriptive URLs.
* Add structured data where useful, such as `WebSite`, `Organization`, `Article`, `BreadcrumbList`, `Product`, `FAQPage`, or `LocalBusiness`, depending on the theme.
* Do not add fake schema data. Structured data must match visible page content.
* Use proper heading structure to reflect the content hierarchy.
* Ensure important content is present in the HTML, not hidden behind client-only rendering.
* Use descriptive image filenames where possible.
* Add alt text and dimensions for content images.
* Include pagination metadata where relevant.
* Support multilingual SEO only when the theme actually supports multiple languages. If it does, include proper `lang`, canonical, and alternate/hreflang handling.
* Keep internal links crawlable with real `<a href="">` links.
* Avoid JavaScript-only navigation for normal pages.

## Performance Requirements

* Keep JavaScript minimal.
* Avoid shipping framework runtime code unless needed.
* Hydrate components selectively.
* Prefer static rendering where possible.
* Avoid large global scripts.
* Avoid large CSS bundles.
* Keep CSS scoped, layered, or organized in a predictable way.
* Remove unused CSS and unused components.
* Optimize images with Astro’s image tools where appropriate.
* Always include image width and height to reduce layout shift.
* Use responsive images for large visual assets.
* Lazy-load below-the-fold images.
* Do not lazy-load critical above-the-fold hero images unless there is a good reason.
* Use modern image formats when appropriate.
* Avoid layout shifts from images, ads, embeds, cookie banners, and late-loading UI.
* Keep third-party scripts optional and documented.
* Load analytics, embeds, chat widgets, and marketing scripts only when explicitly enabled.
* Avoid blocking render with unnecessary scripts or styles.
* Keep Core Web Vitals in mind, especially LCP, CLS, and INP.

## Font Optimization

* Prefer self-hosted fonts for production themes.
* Use only the font families actually needed by the theme.
* Include only the font weights and styles actually used.
* Prefer modern formats such as `woff2`.
* Use `font-display: swap` or another intentional rendering strategy.
* Preload only critical fonts used above the fold.
* Do not preload every font file.
* Define fallback font stacks that closely match the custom font metrics.
* Avoid layout shift caused by late-loading fonts.
* Do not load fonts from external providers by default unless the user explicitly chooses that option.
* Keep font configuration centralized so users can replace or disable custom fonts easily.

## CSS and Design System Guidelines

* Use design tokens or CSS custom properties for colors, spacing, typography, radii, shadows, and layout values.
* Keep theme customization simple.
* Avoid scattering hardcoded colors and spacing values throughout components.
* Support light and dark modes only if the theme is designed for both.
* Respect user system preference when dark mode is supported.
* Ensure color tokens meet accessibility contrast requirements.
* Keep responsive behavior consistent across components.
* Use fluid and responsive typography where appropriate.
* Avoid unnecessary wrappers and deeply nested markup.
* Keep animations subtle, optional, and respectful of reduced-motion preferences.

## Content and Markdown Guidelines

* Content should be easy to manage through Markdown, MDX, or content collections.
* Validate required frontmatter fields.
* Provide sensible defaults for optional metadata.
* Avoid requiring users to duplicate the same SEO fields in many places when defaults can be generated safely.
* Support draft or unpublished content only when the theme explicitly needs it.
* Make dates, authors, categories, tags, and excerpts consistent.
* Make sure generated archive, tag, category, author, and pagination pages have useful metadata.
* Avoid rendering empty UI sections when content is missing.

## Image and Media Guidelines

* Use optimized local images where possible.
* Provide responsive sizes for theme-controlled images.
* Include `alt` text fields in content schemas where images are user-provided.
* Do not use background images for meaningful content unless an accessible text alternative exists.
* Avoid enormous default hero images.
* Provide predictable aspect ratios to prevent layout shift.
* Lazy-load media that is not immediately visible.
* Make video/audio embeds accessible with labels, captions, transcripts, or surrounding explanatory content when relevant.

## Component Guidelines

* Components should have clear responsibilities.
* Props should be typed and documented when not obvious.
* Use sensible defaults.
* Avoid components that silently fail or render broken markup when required props are missing.
* Avoid coupling generic components to one specific page.
* Keep class names predictable.
* Make components easy to copy, remove, or override.
* Do not introduce global side effects from small components.
* For interactive components, document keyboard behavior and accessibility expectations.

## Forms

* Use semantic form markup.
* Every input must have a label.
* Required fields must be indicated accessibly.
* Error messages must be connected to the relevant fields.
* Success and error states should be announced or clearly visible.
* Do not rely only on placeholder text as a label.
* Use appropriate input types such as `email`, `tel`, `url`, `search`, and `number`.
* Keep forms usable without unnecessary JavaScript where possible.
* Do not include a form provider by default unless it is configurable.

## Navigation

* Use real links for navigation.
* Mark the current page or section when possible.
* Ensure mobile navigation works with keyboard and screen readers.
* Trap focus only when appropriate, such as inside an open modal menu.
* Restore focus after closing menus or dialogs when relevant.
* Make dropdowns and submenus accessible.
* Do not hide navigation from assistive technology unless it is truly inactive.

## Build, Config, and DX

* Keep configuration centralized and documented.
* Provide clear theme constants for site name, default title, description, social links, navigation, and footer data.
* Avoid requiring users to edit many files for common changes.
* Use environment variables only where they are actually needed.
* Do not expose secrets in client-side code.
* Keep the README accurate.
* Include setup, development, build, preview, customization, and deployment instructions.
* Add comments only where they clarify non-obvious decisions.
* Keep generated examples realistic and production-friendly.
* Make sure the theme builds cleanly without warnings or broken links.

## Testing and QA Checklist

Before considering work complete, verify:

* The project builds successfully.
* Pages render without console errors.
* No unnecessary client JavaScript is shipped.
* Navigation works with keyboard only.
* Focus states are visible.
* Forms have labels and accessible states.
* Images have correct alt text and dimensions.
* Metadata is present and unique per page.
* Canonical URLs are correct.
* Sitemap generation works.
* Social preview metadata is valid.
* The layout is responsive.
* Dark mode works if supported.
* Reduced motion is respected.
* Lighthouse or similar checks do not reveal obvious accessibility, SEO, or performance issues.
* There are no broken internal links.
* There is no placeholder content left in production-facing defaults.

## Things to Avoid

* Do not use `<div>` and `<span>` for everything when semantic HTML exists.
* Do not add ARIA roles to elements that already have correct native semantics.
* Do not remove focus outlines without accessible replacements.
* Do not add heavy animation libraries for simple transitions.
* Do not add global JavaScript for isolated UI behavior.
* Do not load all font weights “just in case.”
* Do not load external fonts by default.
* Do not use client-only rendering for content that should be crawlable.
* Do not hide important content behind JavaScript.
* Do not hardcode metadata across every page.
* Do not ship large demo assets as required production assets.
* Do not introduce dependencies without a clear reason.
* Do not sacrifice accessibility for visual polish.

## Preferred Outcome

The final Astro theme should be fast, accessible, SEO-ready, easy to customize, and pleasant to maintain. It should provide strong defaults while staying lightweight and flexible.
