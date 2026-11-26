# Featured Projects & Categories

## Featured (`featured: true`)

Featured projects get priority in all listings.

### Behavior

| Location           | Effect                                                     |
|--------------------|------------------------------------------------------------|
| `/projects` grid   | Featured projects appear **first**, then non-featured by pid |
| Homepage           | Featured projects appear **first** in "Last Project" and "Recent Projects" |
| Card visual        | Gold ★ "Featured" badge in top-right corner of card         |
| Card border        | Subtle gold accent border                                   |

### Usage

```yaml
featured: true   # Highlights this project
featured: false  # Normal project (default)
```

Set `featured: true` on your best 1–3 projects. There's no limit, but too many dilutes the signal.

### Sorting Logic

1. Featured projects first (sorted by pid within featured group)
2. Non-featured projects second (sorted by pid)

On the homepage, sorting uses **date** instead of pid within each group.

---

## Category

Every project has a `category` that describes its type.

### Available Categories

| Value          | English Label | German Label     |
|----------------|---------------|------------------|
| `automation`   | Automation    | Automatisierung  |
| `tooling`      | Tooling       | Tooling          |
| `open-source`  | Open Source   | Open Source       |
| `integration`  | Integration   | Integration      |
| `research`     | Research      | Forschung        |
| `self-hosted`  | Self-Hosted   | Self-Hosted      |
| `other`        | Other         | Sonstiges        |

### Usage

```yaml
category: "open-source"   # Set the project's category
category: "other"         # Default if omitted
```

### What It Does

1. **Category chip** — Small label displayed on each project card, below the title
2. **Filter bar** — Pill buttons at the top of `/projects` page:
   - "All" button (default) shows everything
   - Clicking a category shows only matching projects
3. **URL filter** — Works with `?tag=` query parameter for tag-based filtering

### Adding a New Category

1. Add the value to the enum in `src/content.config.ts`:
   ```typescript
   category: z.enum([
     "automation",
     "tooling",
     "open-source",
     "integration",
     "research",
     "self-hosted",
     "your-new-category",  // ← add here
     "other",
   ]).default("other"),
   ```

2. Add labels in `src/pages/[...locale]/projects/index.astro`:
   ```typescript
   const categoryLabels = {
     // ...existing...
     "your-new-category": { en: "Your Label", de: "Dein Label" },
   };
   ```

3. Use it in any project's frontmatter:
   ```yaml
   category: "your-new-category"
   ```

### Tags vs Category

- **Tags** — Multiple keywords per project (e.g. "Docker", "n8n", "PostgreSQL"). Displayed as subtle text on cards.
- **Category** — Single classification per project (e.g. "open-source"). Used for filtering and displayed as a chip. Think of it as the project's "type".
