# The content model

Everything you write is Markdown in `src/content/`. There are four collections. Their schemas are in `src/content.config.ts`, and they are strict: an unknown or misspelled frontmatter key fails `astro check`.

## Posts

Posts are the long-form writing. They live in a year folder:

```text
src/content/blog/2026/my-first-post.md   →   /blog/2026/my-first-post/
```

The filename must be lowercase kebab-case, and the folder year must match the year of `pubDatetime` in the site timezone. That rule keeps the URL year honest.

### Required post fields

| Field         | Type   | Notes                                                    |
| :------------ | :----- | :------------------------------------------------------- |
| `title`       | string | Page heading, list title and browser tab.                |
| `description` | string | One sentence. List summary and meta description.         |
| `pubDatetime` | date   | With an offset, for example `2026-11-09T10:00:00+01:00`. |

### Optional post fields

| Field          | Notes                                                             |
| :------------- | :---------------------------------------------------------------- |
| `modDatetime`  | Shown as "Updated" when later than `pubDatetime`.                 |
| `tags`         | Free labels. Each tag gets a page under `/tags/`.                 |
| `draft`        | `true` keeps the post out of production builds.                   |
| `hideToc`      | Hides the table of contents on the post.                          |
| `hideEditPost` | Hides the edit link when `features.editPost` is enabled.          |
| `ogImage`      | A custom social image next to the post. Default: a generated one. |
| `canonicalUrl` | Where the post was first published.                               |
| `syndication`  | Other places the post was published, shown as an "Also on" line.  |
| `timezone`     | IANA zone for the post's dates.                                   |
| `author`       | Defaults to `site.author`.                                        |

A post with a `pubDatetime` in the future is built only from that day on.

## Notes

Notes are short, self-contained pieces: a command, a fix, a finding. They also live in year folders and are served at `/notes/<year>/<slug>/`.

Notes have no date field. Their dates come from the file's git history, so a note shows when it was first committed and last changed. An optional `updated` date overrides the git date. Other fields: `description`, `tags`, `canonicalUrl`, `syndication` and `draft`. Only `title` is required.

## Projects

Projects are one Markdown file each, directly in `src/content/projects/`, and they are served at `/projects/<slug>/`. A project page is built from frontmatter only, so the file has no body. A body fails the build.

| Field                                | Notes                                                         |
| :----------------------------------- | :------------------------------------------------------------ |
| `title`, `description`               | Required.                                                     |
| `status`                             | Required: `active`, `maintained`, `archived` or `experiment`. |
| `stack`                              | Technologies shown as chips.                                  |
| `githubUrl`, `docsUrl`, `websiteUrl` | Optional links.                                               |
| `featured`                           | Lists the project on the homepage and sorts it first.         |
| `relatedPosts`                       | Post ids as `YYYY/slug`, linked from the project page.        |

Projects with `status: experiment` are listed on `/lab/` instead of `/projects/`.

## Pages

`src/content/pages/` holds the text of three pages: `home.md` (the homepage intro and an optional `specialties` list), `about.md` and `contact.md`. Edit them in place.

## Creating content

`templates/` holds a commented starting file for each type. Every optional key is listed there with an explanation, so you can uncomment what you need. With Docker set up, one command copies a template:

```bash
./dev.sh new post my-first-post
./dev.sh new note a-handy-command
./dev.sh new project my-tool
```

It sets the date to now in the site timezone and marks the entry as a draft. It needs GNU `date`.

### Drafts

`draft: true` entries are visible on the dev server with a Draft badge, and they never reach a production build. Images that only drafts use are removed from the build as well. Files and folders whose name starts with `_` are never loaded at all, which is handy for assets such as `_assets/`.

### Placeholder markers

The templates mark the text you still have to write with a placeholder marker:

```md
[[TODO: one-sentence summary]]
```

In a page body a marker renders as a highlighted `TODO:` note, so you can spot it while writing. `pnpm markers` lists every remaining marker. A normal build only warns. The deploy workflow runs the check in strict mode and fails until every marker is gone.

#### Showing the syntax

Markers inside code spans and code blocks are ignored.
