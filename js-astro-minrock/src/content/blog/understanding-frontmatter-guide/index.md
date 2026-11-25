---
title: "Understanding Frontmatter in Minrock: The Complete Metadata Reference"
description: "A deep-dive explanation of all YAML frontmatter options available when creating notes in Obsidian for Minrock."
pubDate: 2026-09-16
tags: ["frontmatter", "obsidian", "astro", "guide"]
draft: false
---

Every article published in **Minrock** starts with a block of structured metadata at the very top of the file called **YAML Frontmatter**. 

Enclosed between two sets of triple hyphens (`---`), frontmatter provides the Astro static compiler with essential attributes—such as title, publication date, taxonomy tags, and OpenGraph social previews—without cluttering the article's prose.

---

## The Standard Minrock Frontmatter Template

When creating a new note inside Obsidian (or typing `Ctrl + N` inside `src/content/blog/`), your note starts with this schema:

```yaml
---
title: "Your Article Title Here"
description: "A concise 1-2 sentence summary for search engines, cards, and RSS."
pubDate: 2026-09-16
updatedDate: 2026-09-17
tags: ["engineering", "architecture", "astro"]
draft: false
image: "/images/custom-cover.jpg"
audio: true
---
```

---

## Field-by-Field Reference

Here is what each property does, its data type, and why it matters to your blog:

| Property | Type | Required? | Purpose & Impact |
| :--- | :--- | :--- | :--- |
| **`title`** | `string` | **Yes** | The main heading of your article. Used for `<title>` tags, H1 headings, cards, and JSON-LD structured data. |
| **`description`** | `string` | **Yes** | Crucial for SEO and social sharing. Appears in Twitter/LinkedIn OpenGraph previews, RSS descriptions, and search indexing. |
| **`pubDate`** | `date` | **Yes** | The initial publication timestamp (`YYYY-MM-DD`). Articles on the home page and `/blog` are sorted chronologically by this date. |
| **`updatedDate`** | `date` | Optional | Displays a subtle *"Updated on [date]"* notice when revising an existing piece. |
| **`tags`** | `array` | Optional | Categorization tags (`["astro", "obsidian"]`). Automatically populates the tag cloud on `/tags` and enables live topic filtering. |
| **`draft`** | `boolean` | Optional (default `false`) | If set to `draft: true`, the post remains visible during local development (`npm run dev`), but is completely excluded from production builds (`npm run build`). |
| **`image`** | `string` | Optional | Path to a cover image or vector diagram (e.g. `cover.png` in the local bundle or `/images/hero.svg`). |
| **`audio`** | `boolean` | Optional (default `true`) | Controls whether the synthesized voice reader widget appears below the article title. |

---

## Practical Examples

### 1. Minimal Quick Note

When you simply want to jot down an insight quickly from Obsidian:

```markdown
---
title: "Zero-Latency Caching Patterns"
description: "Quick notes on in-memory LRU cache implementations."
pubDate: 2026-09-16
tags: ["systems", "performance"]
---

Here are my thoughts on memory limits...
```

### 2. Work-in-Progress Draft

If you are drafting an extensive technical whitepaper and want to preview it locally without accidentally publishing it to production:

```markdown
---
title: "Deep Dive into Distributed Consensus"
description: "Drafting notes on Raft election timeouts and log replication."
pubDate: 2026-09-16
tags: ["distributed-systems"]
draft: true
---
```

> [!TIP]
> When `draft: true` is set, Minrock's build engine ignores the file during `npm run build`, ensuring incomplete thoughts never leak to the public web.

---

## Enhancing Frontmatter with Obsidian Plugins

Because Minrock's content folder is a native Obsidian vault, you can take advantage of powerful visual tools:

1. **Obsidian Properties Core Plugin**: Enable Obsidian's native *"Properties"* view in settings to edit your frontmatter using clean input fields, tag pickers, and calendar widgets instead of typing raw YAML.
2. **Vault CMS Setup**: Vault CMS automatically maps the fields declared in `src/content.config.ts`, so when you click *"New Post"*, all fields are filled with sensible defaults.
3. **Automatic Slugs**: The folder name in `src/content/blog/<slug>/index.md` becomes your permanent URL route (`/blog/<slug>`), keeping filenames decoupled from the title.

---

## Type Safety with Astro & Zod

Minrock defines its content schema using **Zod** in `src/content.config.ts`:

```typescript
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    image: z.string().optional(),
    audio: z.boolean().default(true),
  })
});
```

If you accidentally format a date incorrectly or forget a required field, Astro will halt the build and print the exact file and line number where the issue occurred. This guarantees that your live static blog will never encounter broken pages or runtime crashes.
