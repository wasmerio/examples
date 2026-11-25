# Content Guide

All content is managed through MDX files in `src/content/`. Each content type has its own collection with schema validation.

## General Workflow

1. Navigate to the appropriate content directory
2. Create a new `.mdx` file
3. Add frontmatter with required fields
4. Write your content in Markdown/MDX
5. Run `npm run build` to validate

If your content doesn't match the schema, the build will fail with clear error messages.

## File Naming

Use kebab-case for file names:
- ✅ `payment-system-rebuild.mdx`
- ❌ `Payment System Rebuild.mdx`

The filename becomes the URL slug (e.g., `/projects/payment-system-rebuild`).

---

## Projects (Case Studies)

Location: `src/content/projects/`

Case studies follow a structured narrative: Problem → Constraints → Approach → Decisions → Impact → Learnings.

```yaml
---
title: "Project Title"
role: "Your Role"
year: 2024
duration: "3 months"   # Optional - project duration
teamSize: 4            # Optional - team size
outcomeSummary: "Brief impact summary (1-2 sentences)"
overview: "High-level project overview"
problem: "What problem were you solving?"
constraints:
  - "Constraint 1"
  - "Constraint 2"
approach: "How did you approach the solution?"
keyDecisions:
  - decision: "What you decided"
    reasoning: "Why you made this decision"
    alternatives:
      - "Alternative 1"
      - "Alternative 2"
techStack:
  - "Technology 1"
  - "Technology 2"
impact:
  metrics:
    - label: "Metric Name"
      value: "Metric Value"
  qualitative: "Broader impact description"
learnings:
  - "Key learning 1"
  - "Key learning 2"
featured: false    # Show on homepage
status: completed  # Options: completed, ongoing, archived
order: 10          # Sort order (lower = first)
relatedProjects:   # Optional - slugs of related projects
  - "other-project-slug"
relatedDecisions:  # Optional - slugs of related decisions
  - "related-decision-slug"
---
```

**Status Options:**
- `completed` (default) — Finished projects, no badge shown
- `ongoing` — Active projects, shows green "Ongoing" badge
- `archived` — Historical projects, shows gray "Archived" badge

**Cross-Referencing:** Use `relatedProjects` and `relatedDecisions` to link related content. The slug is the filename without `.mdx` (e.g., `payment-system-rebuild.mdx` → `"payment-system-rebuild"`). Related content appears at the bottom of the detail page.

---

## Decisions

Location: `src/content/decisions/`

Document architectural and technical decisions with context and reasoning.

```yaml
---
title: "Decision Title"
date: 2024-01-15
context: "What situation required this decision?"
decision: "What did you decide?"
alternatives:
  - option: "Alternative 1"
    pros:
      - "Pro 1"
    cons:
      - "Con 1"
  - option: "Alternative 2"
    pros:
      - "Pro 1"
    cons:
      - "Con 1"
reasoning: "Why did you make this decision?"
tags:              # Optional
  - "architecture"
relatedProjects:   # Optional - slugs of related projects
  - "project-slug"
relatedDecisions:  # Optional - slugs of related decisions
  - "other-decision-slug"
---
```

**Cross-Referencing:** Same as Projects — use `relatedProjects` and `relatedDecisions` to show connections between your decisions and the projects they influenced.

---

## Journey

Location: `src/content/journey/`

Career timeline entries showing milestones, learnings, and transitions.

```yaml
---
date: 2024-01-15
title: "Entry Title"
type: "milestone"  # Options: milestone, learning, transition
description: "What happened and what you learned"
skills:            # Optional
  - "Skill 1"
---
```

**Entry Types:**
- `milestone` — Career achievements, promotions
- `learning` — Skills learned, certifications
- `transition` — Role changes, career pivots

---

## Writing (Blog)

Location: `src/content/writing/`

Blog posts and technical articles with full MDX support.

```yaml
---
title: "Article Title"
description: "Brief description for SEO"
publishDate: 2024-01-15
updatedDate: 2024-02-01  # Optional
tags:                     # Optional
  - "topic1"
draft: false              # Set true to hide from production
---
```

**Features:**
- Articles with 3+ headings automatically get a Table of Contents
- Draft articles (`draft: true`) won't appear in production builds

---

## Speaking

Location: `src/content/speaking/`

Conference talks, meetup presentations, podcast appearances.

```yaml
---
title: "Talk Title"
description: "Talk description"
event: "Event Name"
date: 2024-01-15
location: "City, Country"  # or "Online"
type: "conference"         # Options: conference, meetup, podcast, workshop, webinar
eventUrl: ""               # Optional
slides: ""                 # Optional
video: ""                  # Optional
duration: "45 min"         # Optional
topics:                    # Optional
  - "Topic 1"
featured: false
---
```

---

## Uses

Location: `src/content/uses/`

Document your tools, tech stack, and development environment.

```yaml
---
category: "tools"  # Options: tools, stack, environment
items:
  - name: "Tool Name"
    description: "What you use it for"
    url: "https://..."  # Optional
order: 1
---
```

**Categories:**
- `tools` — Software tools, editors, apps
- `stack` — Programming languages, frameworks
- `environment` — Hardware, desk setup

---

## Testimonials

Location: `src/content/testimonials/`

Endorsements and recommendations from colleagues and clients.

```yaml
---
name: "Person's Name"
role: "Their Role"
company: "Their Company"
relationship: "How you worked together"
quote: "Their testimonial text"
date: 2024-01-15
linkedin: ""       # Optional
featured: false    # Show on homepage
---
```

---

## Content Validation

Run `npm run build` to validate all content against schemas. Errors will show:
- Which file has the error
- Which field is invalid
- What was expected vs. provided

## MDX Features

All content files support MDX:
- Standard Markdown syntax
- Import and use Astro components
- Add interactive elements

## Related Guides

- [Content Templates](./templates.md) — Copy-paste templates
- [Content Strategy](./content-strategy.md) — Best practices for featured content and ordering
- [Images](./images.md) — How to add and optimize images
