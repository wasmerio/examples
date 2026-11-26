# Lighting Wiki

## Objective
Create a separate `/wiki/iluminacion/` knowledge surface that uses the current site's visual language, explains lighting terms with original or authorized explanatory images, connects terms to related articles, and connects existing/future articles back to relevant terms.

## Problem
The site currently stores editorial posts in one `blog` collection. It has no structured glossary/wiki model, term-specific routes, term search, image conventions, or controlled bidirectional linking between reference terms and articles.

## Why
A dedicated lighting wiki should serve both high-intent practical searches and professional technical vocabulary without mixing reference entries into the editorial blog taxonomy. It should become a durable internal-linking and topical-authority layer.

## Scope
- Add a separate lighting wiki content model and `/wiki/iluminacion/` routes.
- Reuse the current editorial shell and visual system.
- Add term index, categories, alphabetical navigation, search, related terms, and related articles.
- Add documented image conventions for local original diagrams and authorized DiSano assets.
- Seed the first core lighting terms with explanatory visuals.
- Add a controlled, explicit linking convention for articles and update existing articles after the wiki foundation exists.
- Document authoring, SEO, linking, image, and review workflows.

## Constraints
- Keep wiki content separate from `blog` collection and `/blog/:slug/` routes.
- Preserve existing article routes and visual behavior.
- Avoid automatic linking of every lexical match; use controlled links or an explicit authoring mechanism.
- Store images locally with descriptive alt text and source/rights metadata.
- Prefer Codex-generated explanatory diagrams for abstract concepts; use authorized DiSano assets for real product examples when they add value.
- Technical artifacts and repository documentation use English unless project conventions require otherwise; public wiki copy follows the site's Spanish editorial language.
- Do not copy external imagery without verified permission; DiSano assets may be used when covered by the user's stated rights.

## Tasks

### WIKI-001 — Document the wiki contract and authoring workflow
- [x] Define content schema, route structure, categories, term template, image metadata, source citation, SEO fields, and related-article conventions.
- [x] Document how future terms and article links are created and reviewed.
- [x] Add a project-facing implementation guide and maintain this feature document.

Evidence: `docs/lighting-wiki.md` documents the standalone route model, term contract, category taxonomy, Codex/DiSano image policy, controlled bidirectional linking, source policy, SEO, migration workflow, and contributor checklist.

### WIKI-002 — Build the independent wiki foundation
- [x] Add a separate collection/model for lighting terms.
- [x] Add `/wiki/iluminacion/` index and term routes.
- [x] Reuse the current editorial layout and add scoped wiki components/styles.
- [x] Add breadcrumbs, alphabet/category navigation, canonical metadata, and structured data.

Evidence: `src/content.config.ts`, `src/pages/wiki/iluminacion/`, `src/components/LightingWiki*.astro`, `src/utils/lightingWiki.ts`, `src/styles/redesign.css`, and `src/components/Sidebar.astro`. `pnpm build` passed with only the expected empty-collection warnings; `git diff --check` passed.

### WIKI-003 — Add term discovery and relationships
- [x] Add wiki search and index data without regressing blog search.
- [x] Render related terms and related articles from explicit metadata.
- [x] Add stable relationship utilities and empty-state behavior.

Evidence: `src/pages/api/wiki-search.json.ts`, `src/utils/lightingWiki.ts`, the wiki index, and term route. `pnpm build` passed with 64 pages and expected empty-collection warnings; `git diff --check` passed.

### WIKI-004 — Seed the initial lighting dictionary
- [x] Add the initial core terms: luz, iluminación, lámpara, bombilla, luminaria, LED, lumen, lux, candela, luminancia, temperatura de color, CRI, UGR, IP, DALI, and fotometría.
- [x] Add clear Spanish definitions, units, examples, distinctions, sources, FAQs where useful, and explanatory images.
- [x] Generate conceptual diagrams with the Codex worker where appropriate; use authorized DiSano imagery for product/context examples where appropriate.
- [x] Record image origin, rights basis, alt text, and captions for each asset.

Evidence: 16 Spanish term entries under `src/content/wiki/iluminacion/` and 16 original local SVG diagrams under `public/images/wiki/iluminacion/`. No external images or hotlinks were added. `pnpm build` passed with 80 pages; `git diff --check` passed; a parent audit confirmed 16 terms, 16 SVGs, and required image metadata.

### WIKI-005 — Link and revise existing articles
- [x] Detect relevant term occurrences in existing articles.
- [x] Add controlled contextual links without overlinking generic words.
- [x] Add related-article metadata to wiki entries.
- [x] Document the convention for future articles.

Evidence: 18 controlled canonical wiki links were added across the 11 Spanish lighting-category articles. Wiki `relatedArticles` metadata was corrected to exact Astro IDs and reciprocal validity; parent normalized two missing trailing slashes in photometry links. Relationship audit found 0 invalid term/article references; `pnpm build` and `git diff --check` passed.

### WIKI-017 — Spanish lighting regulations cornerstone article
- [x] Create the original article with a national regulatory map, project-type workflow, source links, and clear legal disclaimers.
- [x] Link the article to the new wiki terms and relevant existing articles with descriptive anchors.
- [x] Validate official sources, SEO metadata, FAQs, build, and internal links.
- [x] Set the editorial date to 2026-09-18, add the article-specific WebP hero, and verify canonical, Open Graph, JSON-LD, image, title, and description output.

### WIKI-016 — Expose wiki in the home navigation
- [x] Add a visible `WIKI ILUMINACIÓN` entry to the home index menu.
- [x] Add the wiki entry to the legacy header menu for consistency.
- [x] Build and verify the generated home route contains the canonical wiki link.

### WIKI-015 — Complete new-term imagery and SEO audit
- [x] Generate realistic raster images for the 18 new terms previously without image metadata.
- [x] Optimize them to WebP, update term metadata, and verify social previews.
- [x] Rerun the deep SEO audit and prepare the complete change for commit/push.

### WIKI-014 — Expand the mixed lighting vocabulary
- [x] Add the selected professional and practical terms with stable slugs, definitions, aliases, units where relevant, sources, FAQs, and SEO metadata.
- [x] Connect the new terms to existing terms and relevant articles with controlled links.
- [x] Provide valid local image metadata, build, and audit all term relationships and routes.

### WIKI-013 — Wiki SEO metadata and sharing audit
- [x] Pass each term's ficha image and alt text into the page SEO/Open Graph/Twitter metadata.
- [x] Validate canonical URLs, descriptions, structured data, sitemap inclusion, and indexability on generated wiki pages.
- [x] Run build and an automated SEO audit for all 16 terms and the wiki index.

### WIKI-012 — Refresh weak article visuals
- [x] Generate replacement hero/internal raster images for the prioritized legacy article visuals.
- [x] Update article frontmatters and inline image references, preserving strong diagrams and historical assets.
- [x] Optimize generated article images to WebP and verify visual quality, weight, build, and links.

### WIKI-011 — Optimize ficha assets for web delivery
- [x] Convert the 16 generated PNG fichas to appropriately compressed WebP assets while preserving visual quality and text legibility.
- [x] Update all wiki frontmatters and remove oversized PNG delivery assets if no longer referenced.
- [x] Verify total weight, dimensions, build output, and zero broken image paths.

### WIKI-010 — Codex-generated realistic lighting fichas
- [x] Generate 16 realistic raster ficha images through the Codex image-generation worker.
- [x] Add concise, accurate Spanish explanatory text inside each ficha and update frontmatter metadata.
- [x] Remove the rejected provisional composites and keep zero SVG assets.
- [x] Run build and focused image audit.

### WIKI-009 — Raster photo composites with explanatory text
- [x] Create realistic raster/WebP composites from real local or authorized photographs, with readable Spanish explanatory labels.
- [x] Point each term to its raster composite and remove any remaining SVG reference or file.
- [x] Verify image legibility, build output, and metadata accuracy.

### WIKI-008 — Replace diagrams with real photography
- [x] Replace all generated SVG term visuals with real local or authorized DiSano/site photography.
- [x] Match each image to the term and record accurate credit, rights, alt text, and caption metadata.
- [x] Remove unused placeholder/diagram assets from the wiki.
- [x] Rebuild and verify the local wiki routes after deployment.

### WIKI-007 — Professional visual and editorial correction
- [x] Fix wiki body contrast and typography against the dark editorial background.
- [x] Replace placeholder-like SVGs with polished, legible Codex-generated explanatory diagrams.
- [x] Review Spanish term copy, headings, captions, and image metadata for professional clarity.
- [x] Rebuild and recheck the rendered production-facing routes before redeploying.

Evidence: scoped wiki prose styles now use high-contrast paper/gold colors; all 16 SVGs were replaced with structured diagrams containing accessible `<title>`/`<desc>`; image credits are rendered; the content audit found stable slugs and local image references. `pnpm build` passed with 80 pages and `git diff --check` passed. An accidental empty `./ ` path was removed before staging.

### WIKI-006 — Verify and close
- [x] Run the configured build and focused structural checks.
- [x] Verify routes, search, sitemap/canonical output, images, links, and no broken blog behavior.
- [x] Record all observed checks, failures, skips, and remaining follow-ups.

Evidence: final read-only verification passed `pnpm build` (80 pages), `git diff --check`, the structural audit (16 entries, 16 SVGs, 0 invalid IDs, 11 migrated articles, 0 non-canonical wiki URLs), and generated-route checks (wiki index, 16 term routes, both search APIs). Browser/accessibility and semantic editorial review were not run.

## Acceptance criteria
- `/wiki/iluminacion/` is discoverable from the site's main navigation and visually belongs to the current design.
- Every seeded term has a stable URL, definition, related terms/articles, sources, and accessible image treatment where applicable.
- Wiki content is not incorrectly treated as a blog post, tag, or draft.
- Blog articles can link to terms using the documented convention, and term pages expose related articles.
- Search and navigation work for wiki terms without breaking existing article search.
- `pnpm build` succeeds and generated routes/assets contain no broken references.
- Documentation is sufficient for another contributor to add a term and update article links without reverse-engineering implementation details.

## Verification evidence
- WIKI-001: `docs/lighting-wiki.md` created and reviewed.
- WIKI-002: `pnpm build` passed; `git diff --check` passed; parent spot-checked collection schema, index route, term route, and wiki utilities.
- WIKI-003: `pnpm build` passed with 64 pages; `git diff --check` passed; parent spot-checked search API, relationship utilities, and term route.
- WIKI-004: `pnpm build` passed with 80 pages; `git diff --check` passed; parent audited 16 term files, 16 SVGs, source links, and required image metadata.
- WIKI-005: `pnpm build` passed with 80 pages; `git diff --check` passed; parent audited 18 canonical article links and 0 invalid relationship references.
- WIKI-006: final structural verification passed; browser/accessibility and semantic editorial review remain skipped.
- WIKI-007: `pnpm build` passed with 80 pages; `git diff --check` passed; 16 SVG accessibility/content references audited successfully.

## Progress
- Exploration complete: existing Astro layouts, blog collection, search API, SEO components, image conventions, and integration constraints mapped.
- Product decisions confirmed: separate wiki surface; route prefix `/wiki/iluminacion/`; local explanatory images allowed; Codex-generated diagrams preferred for concepts; DiSano assets may be used under user-provided rights.
- WIKI-001 complete: the authoring and implementation contract is documented in `docs/lighting-wiki.md`.
- WIKI-002 complete: the independent empty wiki foundation builds and is linked from the sidebar.
- WIKI-003 complete: isolated wiki search and explicit term/article relationship rendering are implemented.
- WIKI-004 complete: the first 16 terms and original explanatory SVG visuals are published in the content tree.
- WIKI-005 complete: selected lighting articles now link contextually to canonical wiki terms and term metadata is reciprocal.
- WIKI-006 complete: final build, route, image, search, relationship, and regression checks passed.
- WIKI-007 complete: the screenshot findings were addressed with scoped contrast fixes, professional SVG infographics, visible credits, and a content/accessibility audit.
- WIKI-008 opened from the user's second visual review: replace generated diagrams with real authorized photography that matches the site's editorial style.
- WIKI-008 complete locally; production deployment remains pending the user's normal `main`/GitHub Actions flow.
- WIKI-009 superseded: the provisional photo composites were rejected by the user.
- WIKI-010 opened: Codex image generation created 16 realistic raster ficha assets with integrated Spanish technical text.
- WIKI-011 complete locally: 16 generated fichas are now optimized WebP assets; PNG delivery files were removed.
- WIKI-012 opened: replace the weak legacy visuals in the related lighting articles with Codex-generated realistic raster images, then optimize delivery.
- WIKI-012 complete locally: generated 8 article images with the local Codex image-generation capability, converted them to optimized WebP, and updated four articles without changing strong diagrams or historical assets.
- WIKI-013 complete locally: term pages now expose their optimized ficha WebP as social preview images with alt text and keywords; generated SEO audit passes.
- WIKI-014 complete locally: added 24 broad mixed terms, bringing the wiki to 40 valid terms and 104 generated pages.
- WIKI-015 complete locally: generated and optimized 18 missing term images, attached them to all term pages, and completed the deep SEO audit.
- WIKI-016 complete locally: added the wiki entry to the home index menu and legacy header navigation.
- WIKI-017 complete locally: created the original Spanish lighting regulations cornerstone article with official sources, project workflow, norm categories, PDF distribution guidance, and internal wiki links; scheduled for 2026-09-18, added a dedicated WebP hero image, and completed the SEO audit.
- Current task: none.
- Review the deployed 40-term wiki in desktop and mobile browsers, including image legibility and social preview cards.
- Monitor Search Console for indexing, impressions, queries, and duplicate/cannibalized intent before adding another large batch.
- Add the next terms in focused batches, prioritizing: deslumbramiento, óptica, difusor, reflector, curva fotométrica, eficiencia energética, consumo energético, factor de potencia, THD, sobretensiones, HCL, KNX, Casambi, Bluetooth Mesh, iluminación industrial, iluminación comercial, iluminación deportiva, tunable white, mantenimiento y vida útil de la luminaria.
- Keep each new term tied to at least one relevant blog article and one authoritative source; generate/optimize a dedicated WebP only when the existing visual cannot explain it honestly.
- Re-run the deep SEO audit after every batch: title/description, canonical, social image, JSON-LD, sitemap, internal links, image weight, and no broken relations.
