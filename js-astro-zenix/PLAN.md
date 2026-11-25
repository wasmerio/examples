# Zenix: Astro Micro-SaaS Theme Plan

**Zenix** is a high-converting, performance-focused Astro theme designed for Micro-SaaS products, indie hackers, and software startups. It leverages Astro's static site generation and component-driven architecture to deliver a blazing-fast user experience with minimal client-side JavaScript.

**Target Audience:** SaaS founders, developers launching products.
**Core Philosophy:** Speed, conversion, and ease of customization.
**Tech Stack:**
*   **Framework:** Astro (v4+)
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide Icons (or similar lightweight SVG library)
*   **Interactivity:** Vanilla JS or lightweight Alpine.js (for mobile menus/toggles)
*   **Content Management:** Astro Content Collections (for blog/docs)

## 2. Key Features & Pages

### Core Pages
1.  **Landing Page (`/`)**
    *   **Hero Section:** High-impact headline, subheadline, clear CTA (Call to Action) buttons (Primary/Secondary), and product screenshot/mockup.
    *   **Social Proof / Logos:** "Trusted by" section.
    *   **Features Grid:** Highlighting key benefits with icons.
    *   **How it Works:** Step-by-step process.
    *   **Testimonials:** User reviews in a grid or carousel.
    *   **Pricing:** Monthly/Yearly toggle, tiered plans.
    *   **FAQ:** Accordion style.
    *   **Final CTA:** Bottom section to capture leads before footer.
2.  **Pricing (`/pricing`)**
    *   Detailed pricing tables.
    *   Feature comparison matrix (optional).
    *   FAQ related to billing.
3.  **Blog (`/blog`)**
    *   Blog index with pagination.
    *   Individual blog post pages (MDX support for rich content).
    *   Author components.
4.  **Changelog / Updates (`/changelog`)**
    *   Timeline view of product updates.
5.  **Legal Pages (`/terms`, `/privacy`)**
    *   Standard text-heavy pages.
6.  **404 Error Page (`/404`)**
    *   Helpful routing back to home.

### UI Components (Reusable)
*   `Navbar` (Sticky, responsive with mobile menu)
*   `Footer` (Links, newsletter signup, social icons)
*   `Button` (Variants: Primary, Secondary, Outline, Ghost)
*   `Card` (For features, pricing, blog posts)
*   `Badge` / `Tag` (For status, categories)
*   `Accordion` (For FAQs)

## 3. Development Phases

### Phase 1: Setup & Scaffolding
*   [ ] Initialize Astro project (`npm create astro@latest`).
*   [ ] Install and configure Tailwind CSS (`npx astro add tailwind`).
*   [ ] Set up basic folder structure (`src/components`, `src/layouts`, `src/pages`, `src/content`).
*   [ ] Define global CSS variables (colors, typography) in Tailwind config to allow easy theming.

### Phase 2: Core Components & Layout
*   [ ] Build `BaseLayout` and `MDXLayout`.
*   [ ] Develop the `Navbar` and `Footer`.
*   [ ] Create basic UI primitives (`Button`, `Badge`).

### Phase 3: The Landing Page
*   [ ] Build `Hero` component.
*   [ ] Build `Features` section.
*   [ ] Build `Testimonials` section.
*   [ ] Build `Pricing` component (with toggle logic).
*   [ ] Build `FAQ` accordion.

### Phase 4: Content Collections (Blog & Changelog)
*   [ ] Configure `src/content/config.ts` for blog posts and changelog entries.
*   [ ] Create sample Markdown/MDX content.
*   [ ] Build blog listing and individual post pages.

### Phase 5: Polish & Optimization
*   [ ] Ensure fully responsive design across all devices.
*   [ ] Audit SEO (meta tags, open graph images, semantic HTML).
*   [ ] Check accessibility (a11y) - contrast, ARIA labels.
*   [ ] Add simple animations/transitions (optional, keep it light).

## 4. Design System (Initial Draft)
*   **Colors:**
    *   Primary: Deep indigo/purple (e.g., `#4F46E5` to `#312E81`) - conveys trust and tech.
    *   Background: Very light gray or pure white (`#FAFAFA` or `#FFFFFF`).
    *   Text: Dark slate/gray (`#1E293B` or `#0F172A`).
    *   Accent: A vibrant color for highlights (e.g., Teal or Amber).
*   **Typography:**
    *   Headings: A clean, modern sans-serif (e.g., Inter, Plus Jakarta Sans, or standard system fonts).
    *   Body: Highly legible sans-serif.

## Next Steps
Execute Phase 1: Initialize the Astro project within this directory.