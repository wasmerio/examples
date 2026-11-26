---
version: 1
slug: 'src-layouts-post-astro'
primary_target: 'src/layouts/Post.astro'
related_targets: ['src/routes/index.astro']
---

# Surface brief: Wisp post reading surface (theme-wide frame)

Scope: astro-wisp theme — post page (primary), plus header, footer, home, archive/series lists that share the frame. Mode: Read.
Audience/job: engineers following numbered technical series (reference site infra-note), desktop-first, reading prose beside code, formulas and diagrams. Owner's failure condition: rough, careless details.

## Direction contract

THESIS: Every post is a chapter of a bound technical reference manual. Position comes from numbering, running heads and hanging section numbers, not from cards, shadows and chips; it refuses the generic rounded-card Tailwind blog.

OWN-WORLD: Cool paper white / graphite ink, hairline rules (no shadows, radius ≤ 4px), one teal accent used as the manual's second ink (section numbers, active rail mark, links). Running head strip, hanging §-numbers in the left margin, tabular figures, fixed-format Note / 注意 admonitions, code set as listings with a caption line ("清单 05-2 · python"), figures numbered "图 05-1".

STORY: The reader sees which manual (series) and which chapter they are in, reads the chapter, and moves to the next chapter without hunting.

FIRST VIEWPORT: Running head across the top (site · series · chapter 05/23). Left: series contents as a numbered chapter list with the current chapter marked by a teal rule. Center: chapter number set large and quiet above the title, meta line, 38rem column; h2 carry hanging §-numbers in the margin. Right: section contents keyed to the same §-numbers.

FORM: Reference manual, candidate 1 of 7 (IMPECCABLE'S PICK, chosen over assigned 6, drawing sheet). seed:a55806f57be685db

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
