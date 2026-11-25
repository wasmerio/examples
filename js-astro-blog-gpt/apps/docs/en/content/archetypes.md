# Archetype Templates

Instead of copying and pasting YAML frontmatter every time you start a new article, you can use BlogGPT's `pnpm new` command. It scaffolds new files from customizable templates stored in the `archetypes/` directory.

## Create Content via CLI

Run `pnpm new` from your project root:

```bash
pnpm new <post|page|category|tag> <slug> [--use <template>] [--title <title>]
```

### Common Examples

```bash
# 1. Create a standard post at content/posts/my-post.mdx
pnpm new post my-post --title "Hello World"

# 2. Create a folder-based post bundle at content/posts/photo-essay/index.mdx
pnpm new post photo-essay --use bundle --title "Photo Essay"

# 3. Create a standalone page at content/pages/uses.mdx
pnpm new page uses --title "What I Use"

# 4. Create a category definition at content/categories/notes.mdx
pnpm new category notes --title "Reading Notes"
```

## Template Directories (`archetypes/`)

The `archetypes/` folder in your project root defines what `pnpm new` generates. A typical layout looks like this:

```text
archetypes/
├── posts/
│   ├── default/
│   │   └── [slug].mdx
│   └── bundle/
│       └── [slug]/
│           └── index.mdx
├── pages/       # Also contains default/ and bundle/
├── categories/  # Also contains default/ and bundle/
└── tags/        # Also contains default/ and bundle/
```

- **Default template**: `pnpm new post <slug>` reads `archetypes/posts/default/` and generates `content/posts/<slug>.mdx`.
- **Bundle template**: Add `--use bundle` to select `archetypes/posts/bundle/` and generate `content/posts/<slug>/index.mdx`.
- **Custom templates**: Create a directory under the matching content type, such as `archetypes/posts/tutorial/`, then select it with `--use tutorial`. The command copies every file and replaces variables in paths and text; templates can include images, attachments, or translated files.

Default post templates set `draft: true`. To publish a post, change it to `draft: false` and choose a publication date no later than the build time.

## Template Variables

Inside any file under `archetypes/`, you can use `{{ variable }}` placeholders that are filled in automatically when `pnpm new` runs:

| Variable         | Example Output             | Description                                                      |
| ---------------- | -------------------------- | ---------------------------------------------------------------- |
| `{{ title }}`    | `Hello World`              | Value passed to `--title` (defaults to the unchanged `slug`).    |
| `{{ slug }}`     | `hello-world`              | The `<slug>` argument passed to `pnpm new`.                      |
| `{{ type }}`     | `post`                     | Content kind (`post`, `page`, `category`, or `tag`).             |
| `{{ template }}` | `bundle`                   | Template name passed via `--use` (or the default template name). |
| `{{ date }}`     | `2026-10-24`               | Current UTC date (`YYYY-MM-DD`).                                 |
| `{{ time }}`     | `08-00-00`                 | Current UTC time with hyphens (`HH-mm-ss`).                      |
| `{{ datetime }}` | `2026-10-24T08:00:00.000Z` | UTC ISO 8601 timestamp.                                          |
| `{{ year }}`     | `2026`                     | Four-digit current UTC year.                                     |
| `{{ month }}`    | `10`                       | Two-digit current UTC month (`01`–`12`).                         |
| `{{ day }}`      | `24`                       | Two-digit current UTC day (`01`–`31`).                           |
