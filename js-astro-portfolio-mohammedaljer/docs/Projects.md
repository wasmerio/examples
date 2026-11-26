# How Projects Work

Projects are Markdown files in `src/content/projects/`. Each file becomes a page at `/projects/<slug>/`.

## Content Collection

Astro's content collection system validates every project against the schema in `src/content.config.ts`. Invalid frontmatter will fail at build time.

## Frontmatter Fields

| Field           | Type              | Required | Default   | Description                                             |
|-----------------|-------------------|----------|-----------|---------------------------------------------------------|
| `pid`           | number            | yes      | —         | Unique project ID. Increment from highest existing pid  |
| `title`         | string            | yes      | —         | Project title (English)                                 |
| `title_de`      | string            | no       | —         | German title. Falls back to `title`                     |
| `description`   | string            | yes      | —         | One-sentence summary (120–180 chars)                    |
| `description_de`| string            | no       | —         | German description. Falls back to `description`         |
| `date`          | date (ISO)        | yes      | —         | Completion/publish date (`YYYY-MM-DD`)                  |
| `slug`          | string            | no       | filename  | URL-safe slug for `/projects/<slug>/`                   |
| `tags`          | string[]          | no       | `[]`      | 3–6 tags. Use title case. E.g. `["Docker", "n8n"]`     |
| `category`      | enum              | no       | `"other"` | See [README-featured.md](README-featured.md) for values |
| `image`         | string            | no       | —         | Path to logo. E.g. `/images/projects/<slug>/logo.png`   |
| `coverImage`    | string            | no       | —         | Path to primary screenshot for cards + hero             |
| `gallery`       | string[]          | no       | `[]`      | Paths to additional screenshots/GIFs                    |
| `links`         | `{label, url}[]`  | no       | `[]`      | External links (GitHub, live demo, etc.)                |
| `ready`         | boolean           | no       | `true`    | Set `false` to hide from all listings                   |
| `featured`      | boolean           | no       | `false`   | See [README-featured.md](README-featured.md)            |

## Bilingual Content

Content uses CSS-based language toggling. Wrap English and German sections:

```html
<div class="lang-en">
  ## Context
  ...
</div>

<div class="lang-de">
  ## Kontext
  ...
</div>
```

The site's language toggle controls which `<div>` is visible.

## Recommended Sections

Every project should have at minimum:
- **Context** — What is this? 2–4 sentences.
- **Problem** — What challenge does it solve?
- **Solution** — What you built and how.
- **Outcome** — Impact, results, adoption.
- **Tech Stack** — Comma-separated list.

Optional: Architecture, Screenshots, Deployment, Security, Monitoring, Lessons Learned.

## Adding a New Project

1. Copy `src/content/projects/_template.md` → `your-project-name.md`
2. Fill in all required frontmatter fields
3. Set `pid` to the next available number
4. Create media folder: `public/images/projects/<slug>/`
5. Add logo, cover, screenshots as needed
6. Write EN + DE content
7. Set `ready: true`
8. Run `npm run build` to verify

## File Naming

Use **kebab-case** for file names: `my-cool-project.md`

The `slug` field in frontmatter determines the URL. If omitted, Astro uses the filename (without `.md`).
