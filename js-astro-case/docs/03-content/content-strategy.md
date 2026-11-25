# Content Strategy

Best practices for organizing and presenting your portfolio content.

## Featured Content

The `featured` field controls which items appear on your homepage.

### Projects

```yaml
featured: true   # Shows on homepage
order: 1         # Lower number = appears first
```

**Recommendations:**
- Feature 2-4 projects maximum
- Choose projects that demonstrate range
- Prioritize recent work
- Lead with your strongest case study (`order: 1`)

**Selection criteria:**
- Clear, measurable impact
- Interesting technical challenges
- Projects you can discuss confidently
- Work that represents your career direction

### Testimonials

- Feature 2-3 testimonials on homepage
- Choose different relationship types (manager, peer, report)
- Prioritize specific praise over generic endorsements

### Speaking

- Feature talks with recordings or slides available
- Prioritize larger events or well-known conferences

## Ordering Content

The `order` field determines display sequence. Lower numbers appear first.

```yaml
order: 1   # First position
order: 3   # Second position
order: 5   # Third position
```

**Tips:**
- Use gaps (1, 3, 5) to make reordering easier later
- For projects: lead with impact, not chronology

## Content Volume Guidelines

| Content Type | Minimum | Recommended | Maximum |
|--------------|---------|-------------|---------|
| Projects | 3 | 5-8 | 12 |
| Decisions | 2 | 4-6 | 10 |
| Journey | 3 | 5-10 | 15 |
| Writing | 0 | 3-5 | No limit |
| Speaking | 0 | 2-4 | No limit |
| Testimonials | 2 | 3-5 | 8 |
| Uses | 1 | 1 | 1 |

**Quality over quantity.** 4 excellent case studies beats 12 mediocre ones.

## Content Refresh Cadence

- **Projects:** Add within 1-2 months of completion
- **Journey:** Update quarterly or after milestones
- **Writing:** 1-2 posts per quarter if blogging
- **Uses:** Review annually
- **Testimonials:** Request after successful projects

## Writing Effective Case Studies

### The Narrative Arc

1. **Problem** — What was broken or missing?
2. **Constraints** — What made this hard?
3. **Approach** — How did you tackle it?
4. **Decisions** — What trade-offs did you make?
5. **Impact** — What changed because of your work?
6. **Learnings** — What would you do differently?

### Metrics That Matter

Good metrics are:
- **Specific:** "60% reduction" not "significant improvement"
- **Contextual:** "from 2.5s to 1s" shows before/after
- **Business-relevant:** Connect technical wins to outcomes

```yaml
metrics:
  - label: "Processing Time"
    value: "60% reduction (from 2.5s to 1s)"
  - label: "Error Rate"
    value: "0.1% (down from 2.3%)"
```

### Decisions Section

The `keyDecisions` field separates a portfolio from a resume:

```yaml
keyDecisions:
  - decision: "Use event sourcing for payment state"
    reasoning: "Complete audit trail, easier debugging"
    alternatives:
      - "Traditional CRUD with audit logs"
      - "State machine with database transactions"
```

**Tips:**
- Include 2-4 key decisions per project
- Always list alternatives considered
- It's okay to mention decisions that didn't work out

## Draft Mode

Use `draft: true` for work-in-progress:

```yaml
---
title: "My New Article"
draft: true   # Won't appear in production
---
```

- Visible in development (`npm run dev`)
- Hidden in production builds
