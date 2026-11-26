---
# ╔══════════════════════════════════════════════════════════════╗
# ║  PROJECT TEMPLATE — duplicate this file for new projects    ║
# ║  Filename: use kebab-case, e.g. my-cool-project.md          ║
# ╚══════════════════════════════════════════════════════════════╝

# ── Required ────────────────────────────────────────────────────
title: "Project Title"
description: "One sentence (120–180 chars). Start with an action verb. Summarize what you built and why it matters."
pid: 99                       # Unique project ID — increment from the highest existing pid
date: 2026-01-01              # ISO date — when the project was completed or published

# ── Bilingual (optional but recommended) ───────────────────────
title_de: "Projekttitel"
description_de: "Ein Satz (120–180 Zeichen). Mit einem Verb beginnen. Zusammenfassen, was gebaut wurde und warum es relevant ist."

# ── Slug & display ─────────────────────────────────────────────
slug: "project-title"         # URL-safe slug — used in /projects/<slug>/
ready: false                  # Set to true when content is complete and ready to publish
featured: false               # Set to true to highlight this project (future use)

# ── Classification ─────────────────────────────────────────────
tags: ["Tag1", "Tag2", "Tag3"]
# Keep 3–6 tags. Use title case. Good tags: technology names, concepts, domains.
# Examples: "Docker", "n8n", "Open Source", "PostgreSQL", "RBAC", "Automation"

category: "other"
# One of: automation | tooling | open-source | integration | research | self-hosted | other

# ── Images ─────────────────────────────────────────────────────
# ALL project media goes in: public/images/projects/<slug>/
#
# image:      Logo or icon (transparent PNG works best)
#             → Path: /images/projects/<slug>/logo.png
#             → Used when no coverImage exists — shown centered on a gradient bg
#
# coverImage: Primary screenshot (the main visual for cards and hero)
#             → Path: /images/projects/<slug>/cover.png
#             → Shown edge-to-edge on cards and as the detail page hero
#             → Best format: 1400×900 or similar 16:10 / 16:9 ratio, PNG or JPG
#
# gallery:    Additional screenshots, GIFs, or demo recordings
#             → Path: /images/projects/<slug>/screenshot-1.png, demo.gif, etc.
#             → Shown as a scrollable strip on the detail page
#             → GIFs are served as-is (no animation stripping)

image: "/images/projects/<slug>/logo.png"
# coverImage: "/images/projects/<slug>/cover.png"
# gallery:
#   - "/images/projects/<slug>/screenshot-1.png"
#   - "/images/projects/<slug>/demo.gif"

# ── Links ──────────────────────────────────────────────────────
links: []
# links:
#   - label: "GitHub"
#     url: "https://github.com/username/repo"
#   - label: "Live Demo"
#     url: "https://example.com"
#   - label: "Docker Hub"
#     url: "https://hub.docker.com/r/username/image"
#   - label: "npm"
#     url: "https://www.npmjs.com/package/name"
---

<!-- ════════════════════════════════════════════════════════════
     ENGLISH CONTENT
     ════════════════════════════════════════════════════════════ -->
<div class="lang-en">

## Context
<!-- 2–4 sentences. What is this project? What environment or need does it address?
     Set the scene so someone unfamiliar with the domain understands the purpose. -->



## Problem
<!-- What specific challenge or gap does this project solve?
     Be concrete: mention pain points, limitations of existing solutions,
     or operational needs that motivated the work. -->



## Solution
<!-- Describe what you built and how. Use bullet points for clarity.
     Focus on:
     - Architecture decisions and why you made them
     - Key features you implemented
     - Technical approach (not just a feature list)
     - What makes your approach different or effective -->

I designed and built **Project Name** to solve this:
-
-
-

## Outcome
<!-- What was the result? Focus on impact, not just completion.
     Good outcomes: adoption, measurable improvement, published artifact,
     operational benefit, community response. Use bullet points. -->

-
-
-

## Tech Stack
<!-- Comma-separated list of key technologies.
     Keep it scannable — 6–10 items max. -->



<!-- ┌──────────────────────────────────────────────────────────┐
     │  OPTIONAL SECTIONS — include any that add real value     │
     │  Delete the ones you don't need.                         │
     └──────────────────────────────────────────────────────────┘ -->

<!-- ## Architecture
     Brief architecture overview if the system has interesting structure.
     Mention components, data flow, or deployment topology. -->

<!-- ## Screenshots
     Use for inline screenshots within the content body.
     For card/hero images, use the frontmatter coverImage field instead.

     Standard image (place in public/images/projects/<slug>/):
     ![Description](/images/projects/<slug>/my-screenshot.png)

     Animated GIF (place in public/images/projects/<slug>/):
     ![Demo walkthrough](/images/projects/<slug>/my-demo.gif)

     Image with caption (HTML figure):
     <figure>
       <img src="/images/projects/<slug>/my-screenshot.png" alt="Dashboard overview" />
       <figcaption>The main dashboard showing execution metrics</figcaption>
     </figure>
-->

<!-- ## Deployment
     How is this deployed? Docker Compose? CI/CD? Helm?
     Mention if it's self-hosted, cloud, or hybrid. -->

<!-- ## Security & Access Control
     RBAC, auth, audit logging, secrets management, etc.
     Only include if it's a meaningful part of the project. -->

<!-- ## Monitoring & Observability
     Metrics, alerting, dashboards, log aggregation.
     Relevant for infrastructure and platform projects. -->

<!-- ## Lessons Learned
     1–3 key takeaways. What would you do differently?
     What surprised you? What was the hardest part? -->

</div>

<!-- ════════════════════════════════════════════════════════════
     GERMAN CONTENT
     ════════════════════════════════════════════════════════════ -->
<div class="lang-de">

## Kontext
<!-- 2–4 Sätze. Was ist dieses Projekt? Welches Umfeld oder Bedürfnis adressiert es? -->



## Problem
<!-- Welche konkrete Herausforderung oder Lücke löst dieses Projekt? -->



## Lösung
<!-- Beschreibe, was du gebaut hast und wie. Aufzählungspunkte für Klarheit. -->

Ich habe **Projektname** konzipiert und entwickelt:
-
-
-

## Ergebnis
<!-- Was war das Ergebnis? Fokus auf Wirkung, nicht nur Fertigstellung. -->

-
-
-

## Tech Stack



<!-- ┌──────────────────────────────────────────────────────────┐
     │  OPTIONALE ABSCHNITTE — nur einfügen, wenn sie          │
     │  echten Mehrwert bieten. Rest löschen.                   │
     └──────────────────────────────────────────────────────────┘ -->

<!-- ## Architektur -->

<!-- ## Screenshots
     ![Beschreibung](/images/projects/<slug>/my-screenshot.png)

     <figure>
       <img src="/images/projects/<slug>/dashboard.png" alt="Dashboard-Übersicht" />
       <figcaption>Das Haupt-Dashboard mit Ausführungsmetriken</figcaption>
     </figure>
-->

<!-- ## Deployment -->

<!-- ## Sicherheit & Zugriffskontrolle -->

<!-- ## Monitoring & Observability -->

<!-- ## Erkenntnisse -->

</div>

<!-- ════════════════════════════════════════════════════════════
     QUICK REFERENCE — delete this block after first use
     ════════════════════════════════════════════════════════════

     FILE CHECKLIST:
     □  Rename this file to your-project-name.md (kebab-case)
     □  Fill in all required frontmatter fields
     □  Set pid to the next available number
     □  Set slug to a URL-safe version of the project name
     □  Write EN and DE content (at minimum: Context, Problem, Solution, Outcome)
     □  Add at least one image (logo or screenshot)
     □  Set ready: true when done

     IMAGE PLACEMENT:
     All media goes in ONE folder: public/images/projects/<slug>/
     ┌─────────────────┬─────────────────────────────────────────┬──────────────────────────┐
     │ Field           │ Path pattern                            │ Best for                 │
     ├─────────────────┼─────────────────────────────────────────┼──────────────────────────┤
     │ image           │ /images/projects/<slug>/logo.png        │ Logo, icon (transparent) │
     │ coverImage      │ /images/projects/<slug>/cover.png       │ Screenshot (1400×900)    │
     │ gallery         │ /images/projects/<slug>/screenshot-*.png│ GIFs, extra screenshots  │
     │ inline ![](…)   │ /images/projects/<slug>/filename.ext    │ In-content screenshots   │
     └─────────────────┴─────────────────────────────────────────┴──────────────────────────┘

     WRITING TIPS:
     • Description: start with a verb ("Built", "Designed", "Developed")
     • Context: set the stage in 2–4 sentences — assume no domain knowledge
     • Problem: be specific — what was broken, missing, or painful?
     • Solution: focus on YOUR decisions, not just features
     • Outcome: mention impact — adoption, improvement, publication
     • Keep each section 3–6 bullet points or 2–4 paragraphs max
     • Avoid: generic filler, buzzword-heavy language, vague claims
     • Strong signal: concrete numbers, real tradeoffs, honest scope

     ════════════════════════════════════════════════════════════ -->
