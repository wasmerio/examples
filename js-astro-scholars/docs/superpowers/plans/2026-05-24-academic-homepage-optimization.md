# Academic Homepage Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the current academic homepage framework's SEO, content correctness, data parsing, interaction consistency, and mobile polish without changing the public content model more than necessary.

**Architecture:** Keep Astro pages static and data-driven. Move fragile repeated client behavior into small shared utilities, add pure TypeScript helpers for testable content logic, and verify generated HTML after build for SEO regressions.

**Tech Stack:** Astro 5, TypeScript, UnoCSS, Bun test runner, YAML, BibTeX source data.

---

## File Structure

- Modify `package.json`: add `test` and `verify` scripts.
- Create `tests/bibtex.test.ts`: unit tests for BibTeX parsing, nested values, quoted values, author normalization, and categories.
- Create `tests/project-status.test.ts`: unit tests for project status classification.
- Create `tests/reading-time.test.ts`: unit tests for shared reading time calculation.
- Create `scripts/assert-built-site.mjs`: post-build checks for generated HTML titles, meta descriptions, draft exclusion, and empty-state safety.
- Modify `src/layouts/Layout.astro`: remove duplicate title, expose correct SEO props, add active nav state, improve mobile menu accessibility.
- Modify `src/pages/index.astro`: pass page description to Layout, use shared publication card behavior, improve empty states.
- Modify `src/pages/posts/[slug].astro`: filter drafts, pass post metadata to Layout, use shared reading time helper.
- Modify `src/pages/posts/index.astro`: handle zero posts and use shared reading time helper.
- Modify `src/pages/researches.astro`: use shared filter and abstract behavior, expose `aria-pressed`.
- Modify `src/pages/projects.astro`: replace `period.includes("Present")` status logic with a tested helper.
- Modify `src/pages/about.astro`: render `profile` data and hide empty sections.
- Modify `src/pages/teaching.astro`: use shared filter behavior and expose `aria-pressed`.
- Modify `src/lib/bibtex.ts`: replace regex-only field parsing with balanced field parsing and author formatting.
- Create `src/lib/projects.ts`: project status helper and types.
- Create `src/lib/reading-time.ts`: shared reading time helper.
- Create `src/scripts/ui.ts`: shared browser-side setup for abstract toggles and filter controls.
- Modify `README.md` and `README.zh-CN.md`: document required personalization fields and verification commands.

---

### Task 1: Add A Verification Harness

**Files:**
- Modify: `package.json`
- Create: `tests/reading-time.test.ts`
- Create: `scripts/assert-built-site.mjs`

- [ ] **Step 1: Add scripts to `package.json`**

Update the `scripts` block to include:

```json
{
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro",
  "test": "bun test",
  "verify": "bun test && bun run astro check && bun run build && node scripts/assert-built-site.mjs"
}
```

- [ ] **Step 2: Create `src/lib/reading-time.ts`**

```ts
export function getReadingTimeMinutes(text: string, wordsPerMinute = 200): number {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return Math.max(1, Math.ceil(words.length / wordsPerMinute));
}
```

- [ ] **Step 3: Create `tests/reading-time.test.ts`**

```ts
import { describe, expect, test } from "bun:test";
import { getReadingTimeMinutes } from "../src/lib/reading-time";

describe("getReadingTimeMinutes", () => {
  test("returns at least one minute for short content", () => {
    expect(getReadingTimeMinutes("short note")).toBe(1);
  });

  test("rounds up long content", () => {
    const text = Array.from({ length: 201 }, (_, index) => `word${index}`).join(" ");
    expect(getReadingTimeMinutes(text)).toBe(2);
  });

  test("handles whitespace-only content", () => {
    expect(getReadingTimeMinutes("   \n\t  ")).toBe(1);
  });
});
```

- [ ] **Step 4: Create `scripts/assert-built-site.mjs`**

```js
import { readFile, access } from "node:fs/promises";

const root = new URL("../dist/", import.meta.url);

async function readDist(path) {
  return readFile(new URL(path, root), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function titles(html) {
  return [...html.matchAll(/<title>(.*?)<\/title>/g)].map((match) => match[1]);
}

const research = await readDist("researches/index.html");
assert(titles(research).length === 1, "research page should emit one <title>");
assert(
  titles(research)[0] === "Publications | Your Name | Academic Portfolio",
  "research page title should include page title"
);

const post = await readDist("posts/astro-overview/index.html");
assert(titles(post).length === 1, "post page should emit one <title>");
assert(
  titles(post)[0] === "Launching the Scholars Site | Your Name | Academic Portfolio",
  "post page title should use post title"
);
assert(
  post.includes('meta name="description" content="Lessons learned while bootstrapping a personal academic website with Astro.'),
  "post page should use post description metadata"
);

try {
  await access(new URL("posts/draft-only/index.html", root));
  throw new Error("draft post route should not be generated");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
```

- [ ] **Step 5: Run the harness and capture expected failures**

Run:

```bash
bun test
bun run build
node scripts/assert-built-site.mjs
```

Expected before fixes: `bun test` passes after `reading-time.ts` exists; `assert-built-site.mjs` fails because generated pages currently emit duplicate or incorrect titles.

- [ ] **Step 6: Commit**

```bash
git add package.json src/lib/reading-time.ts tests/reading-time.test.ts scripts/assert-built-site.mjs
git commit -m "test: add site verification harness"
```

---

### Task 2: Fix Layout SEO And Page Metadata

**Files:**
- Modify: `src/layouts/Layout.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/researches.astro`
- Modify: `src/pages/projects.astro`
- Modify: `src/pages/teaching.astro`
- Modify: `src/pages/posts/index.astro`
- Modify: `src/pages/posts/[slug].astro`

- [ ] **Step 1: Update `Layout.astro` SEO**

Remove the manual `<title>{siteConfig.title}</title>` line and keep a single SEO title source. Keep:

```astro
const seoTitle = title ? `${title} | ${siteConfig.title}` : siteConfig.title;
const seoDesc = description || siteConfig.description;
const ogImage = image || "/profile.svg";
```

Then make the SEO component responsible for the title:

```astro
<SEO
  title={seoTitle}
  description={seoDesc}
  openGraph={{
    basic: {
      title: seoTitle,
      type: "website",
      image: ogImage,
    },
  }}
  extend={{
    link: [{ rel: "icon", href: siteConfig.favicon }],
    meta: [{ name: "keywords", content: siteConfig.keywords.join(", ") }],
  }}
/>
```

- [ ] **Step 2: Remove dead Layout state**

Delete the unused `inlineLinkClasses` constant from `src/layouts/Layout.astro`.

- [ ] **Step 3: Pass page descriptions**

Update each page Layout invocation:

```astro
<Layout title={pageTitle} description={pageDescription}>
```

For home:

```astro
<Layout title="Home" description={siteConfig.hero.subheadline}>
```

- [ ] **Step 4: Fix article page metadata and draft publishing**

In `src/pages/posts/[slug].astro`, filter drafts:

```ts
export async function getStaticPaths() {
  const posts = (await getCollection("posts")).filter((post) => !post.data.draft);
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
```

Use the shared reading time helper:

```ts
import { getReadingTimeMinutes } from "../../lib/reading-time";

const readingTime = getReadingTimeMinutes(post.body);
```

Pass metadata to Layout:

```astro
<Layout title={post.data.title} description={post.data.description}>
```

Delete the unused fragment:

```astro
<Fragment slot="title">{post.data.title} · {siteConfig.author}</Fragment>
```

- [ ] **Step 5: Use shared reading time in `posts/index.astro`**

Add:

```ts
import { getReadingTimeMinutes } from "../../lib/reading-time";
```

Replace the current estimate:

```astro
{getReadingTimeMinutes(post.body)} min read
```

- [ ] **Step 6: Verify**

Run:

```bash
bun run verify
```

Expected: tests pass, Astro check has no new errors, build passes, and `scripts/assert-built-site.mjs` passes for research and article titles.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/Layout.astro src/pages package.json src/lib/reading-time.ts tests scripts
git commit -m "fix(seo): emit correct page metadata"
```

---

### Task 3: Harden BibTeX Parsing

**Files:**
- Modify: `src/lib/bibtex.ts`
- Create: `tests/bibtex.test.ts`

- [ ] **Step 1: Write parser tests**

Create `tests/bibtex.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { parseBibtex } from "../src/lib/bibtex";

describe("parseBibtex", () => {
  test("parses nested braces in titles and abstracts", () => {
    const entries = parseBibtex(`
      @article{smith2025nested,
        title = {Keeping {AI} and {HCI} Capitalized},
        author = {Smith, Ada and Lee, Bo},
        journal = {Journal of Tests},
        year = {2025},
        abstract = {A study with {nested {brace}} content.},
        public = {yes}
      }
    `);

    expect(entries[0].title).toBe("Keeping AI and HCI Capitalized");
    expect(entries[0].abstract).toBe("A study with nested brace content.");
    expect(entries[0].authors).toEqual(["Ada Smith", "Bo Lee"]);
    expect(entries[0].category).toBe("Publication");
  });

  test("parses quoted values and working paper category", () => {
    const entries = parseBibtex(`
      @misc{doe2024quoted,
        title = "Quoted Field Paper",
        author = "Doe, Jane and Public, John Q.",
        year = "2024",
        public = "wp",
        url = "https://example.com/paper"
      }
    `);

    expect(entries[0].title).toBe("Quoted Field Paper");
    expect(entries[0].authors).toEqual(["Jane Doe", "John Q. Public"]);
    expect(entries[0].category).toBe("Working Paper");
    expect(entries[0].url).toBe("https://example.com/paper");
  });

  test("sorts entries by year descending", () => {
    const entries = parseBibtex(`
      @misc{old, title = {Old}, year = {2020}}
      @misc{new, title = {New}, year = {2026}}
    `);

    expect(entries.map((entry) => entry.id)).toEqual(["new", "old"]);
  });
});
```

- [ ] **Step 2: Replace field parsing with balanced parsing**

In `src/lib/bibtex.ts`, add these helpers above `parseBibtex`:

```ts
function stripOuterBraces(value: string): string {
  return value.replace(/[{}]/g, "").replace(/\s+/g, " ").trim();
}

function formatAuthor(name: string): string {
  const trimmed = name.replace(/\s+/g, " ").trim();
  if (!trimmed.includes(",")) return trimmed;

  const [family, ...givenParts] = trimmed.split(",").map((part) => part.trim());
  const given = givenParts.join(" ");
  return [given, family].filter(Boolean).join(" ");
}

function splitAuthors(value: string): string[] {
  return value
    .split(/\s+and\s+/i)
    .map(formatAuthor)
    .filter(Boolean);
}

function parseFields(body: string): Record<string, string> {
  const fields: Record<string, string> = {};
  let index = 0;

  while (index < body.length) {
    const keyMatch = body.slice(index).match(/\s*([A-Za-z][\w-]*)\s*=\s*/);
    if (!keyMatch) break;

    const key = keyMatch[1].toLowerCase();
    index += keyMatch.index ?? 0;
    index += keyMatch[0].length;

    const opener = body[index];
    let value = "";

    if (opener === "{") {
      let depth = 0;
      const start = index + 1;
      for (; index < body.length; index++) {
        const char = body[index];
        if (char === "{") depth += 1;
        if (char === "}") depth -= 1;
        if (depth === 0) {
          value = body.slice(start, index);
          index += 1;
          break;
        }
      }
    } else if (opener === '"') {
      const start = index + 1;
      index += 1;
      for (; index < body.length; index++) {
        if (body[index] === '"' && body[index - 1] !== "\\") {
          value = body.slice(start, index);
          index += 1;
          break;
        }
      }
    } else {
      const end = body.indexOf(",", index);
      value = body.slice(index, end === -1 ? body.length : end);
      index = end === -1 ? body.length : end + 1;
    }

    fields[key] = stripOuterBraces(value);
    while (body[index] === "," || /\s/.test(body[index] ?? "")) index += 1;
  }

  return fields;
}
```

- [ ] **Step 3: Use `parseFields` and author formatting**

Replace the current `fieldRegex` loop and author split with:

```ts
const fields = parseFields(body);

if (!fields.title) continue;

const authors = fields.author ? splitAuthors(fields.author) : [];
```

- [ ] **Step 4: Verify**

Run:

```bash
bun test tests/bibtex.test.ts
bun run verify
```

Expected: BibTeX tests pass and generated publication pages still build.

- [ ] **Step 5: Commit**

```bash
git add src/lib/bibtex.ts tests/bibtex.test.ts
git commit -m "fix(bibtex): parse common academic fields robustly"
```

---

### Task 4: Fix Project Status Semantics

**Files:**
- Create: `src/lib/projects.ts`
- Modify: `src/components/projects.ts`
- Modify: `src/pages/projects.astro`
- Create: `tests/project-status.test.ts`
- Modify: `src/data/projects.yml`

- [ ] **Step 1: Create `tests/project-status.test.ts`**

```ts
import { describe, expect, test } from "bun:test";
import { getProjectStatus } from "../src/lib/projects";

describe("getProjectStatus", () => {
  test("uses explicit status first", () => {
    expect(getProjectStatus({ title: "A", description: "", tech: [], period: "2020", status: "active" })).toBe("active");
  });

  test("infers active from present period", () => {
    expect(getProjectStatus({ title: "A", description: "", tech: [], period: "2023 — Present" })).toBe("active");
  });

  test("treats missing period as unspecified", () => {
    expect(getProjectStatus({ title: "A", description: "", tech: [] })).toBe("unspecified");
  });

  test("treats historical period as past", () => {
    expect(getProjectStatus({ title: "A", description: "", tech: [], period: "2021 — 2022" })).toBe("past");
  });
});
```

- [ ] **Step 2: Create `src/lib/projects.ts`**

```ts
export type ProjectStatus = "active" | "past" | "unspecified";

export interface ProjectEntry {
  title: string;
  period?: string;
  description: string;
  tech: string[];
  url?: string;
  status?: ProjectStatus;
}

export function getProjectStatus(project: ProjectEntry): ProjectStatus {
  if (project.status) return project.status;
  if (!project.period) return "unspecified";
  return /\bpresent\b/i.test(project.period) ? "active" : "past";
}
```

- [ ] **Step 3: Update `src/components/projects.ts`**

```ts
import projectsRaw from "../data/projects.yml?raw";
import { parse } from "yaml";
import type { ProjectEntry } from "../lib/projects";

export const projects = parse(projectsRaw) as ProjectEntry[];
```

- [ ] **Step 4: Update project grouping in `projects.astro`**

Replace the current status arrays with:

```ts
import { getProjectStatus } from "../lib/projects";

const activeProjects = projects.filter((project) => getProjectStatus(project) === "active");
const pastProjects = projects.filter((project) => getProjectStatus(project) === "past");
const unspecifiedProjects = projects.filter((project) => getProjectStatus(project) === "unspecified");
```

Render `unspecifiedProjects` in the fallback grid instead of relying on both active and past being empty.

- [ ] **Step 5: Add explicit status to sample data**

Update each item in `src/data/projects.yml`:

```yaml
- title: Scholars Portal
  status: active
  period: 2023 — Present
  description: Source-available portal that aggregates publications, talks, and teaching materials into a single academic profile with analytics.
  tech:
    - Astro
    - TypeScript
    - Content Collections
  url: https://github.com/jxpeng98/
```

- [ ] **Step 6: Verify**

Run:

```bash
bun test tests/project-status.test.ts
bun run verify
```

Expected: project status tests pass and projects page still renders all projects exactly once.

- [ ] **Step 7: Commit**

```bash
git add src/lib/projects.ts src/components/projects.ts src/pages/projects.astro src/data/projects.yml tests/project-status.test.ts
git commit -m "fix(projects): classify project status explicitly"
```

---

### Task 5: Render About Profile Data And Empty States

**Files:**
- Modify: `src/pages/about.astro`
- Modify: `scripts/assert-built-site.mjs`

- [ ] **Step 1: Render profile fields**

After the About page header, add:

```astro
{
  profile.length > 0 && (
    <section class="grid gap-3 sm:grid-cols-3">
      {profile.map((item) => (
        <div class="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800/50">
          <p class="m-0 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {item.label}
          </p>
          <p class="m-0 mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
            {item.value}
          </p>
        </div>
      ))}
    </section>
  )
}
```

- [ ] **Step 2: Hide empty Experience and Service headings**

Wrap the Experience section:

```astro
{
  experience.length > 0 && (
    <section class="space-y-3">
      <!-- existing Experience content -->
    </section>
  )
}
```

Wrap the Academic Service section:

```astro
{
  service.length > 0 && (
    <section class="space-y-3">
      <!-- existing Academic Service content -->
    </section>
  )
}
```

- [ ] **Step 3: Add build assertion**

Add to `scripts/assert-built-site.mjs`:

```js
const about = await readDist("about/index.html");
assert(about.includes("Current Role"), "about page should render profile data");
assert(about.includes("Research Areas"), "about page should render research areas profile data");
```

- [ ] **Step 4: Verify**

Run:

```bash
bun run verify
```

Expected: generated About page contains profile fields from `about.yml`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/about.astro scripts/assert-built-site.mjs
git commit -m "fix(about): render configured profile details"
```

---

### Task 6: Centralize Filter And Abstract Interactions

**Files:**
- Create: `src/scripts/ui.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/researches.astro`
- Modify: `src/pages/projects.astro`
- Modify: `src/pages/teaching.astro`

- [ ] **Step 1: Create shared UI script**

```ts
function setActiveButton(buttons: NodeListOf<HTMLElement>, activeButton: HTMLElement) {
  buttons.forEach((button) => {
    const isActive = button === activeButton;
    button.dataset.active = String(isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

export function setupFilterControls(root = document) {
  const buttons = root.querySelectorAll<HTMLElement>("[data-filter]");
  const sections = root.querySelectorAll<HTMLElement>("[data-filter-section]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      if (!filter) return;

      setActiveButton(buttons, button);

      sections.forEach((section) => {
        const visible = filter === "all" || section.dataset.filterSection === filter;
        section.hidden = !visible;
        section.classList.toggle("hidden", !visible);
      });
    });
  });
}

export function setupAbstractToggles(root = document) {
  root.querySelectorAll<HTMLButtonElement>("[data-abstract-toggle]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const targetId = toggle.dataset.target;
      if (!targetId) return;

      const abstract = document.getElementById(targetId);
      if (!abstract) return;

      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      abstract.hidden = expanded;
      abstract.classList.toggle("hidden", expanded);
      toggle.querySelector("[data-abstract-icon]")?.classList.toggle("rotate-180", !expanded);
    });
  });
}
```

- [ ] **Step 2: Update filter markup**

For filter buttons, add `aria-pressed` and data-active:

```astro
<button type="button" data-filter="all" data-active="true" aria-pressed="true" class="filter-btn ...">
```

For sections, replace `data-category` with:

```astro
<section class="space-y-3 paper-section" data-filter-section={categorySlug}>
```

- [ ] **Step 3: Update abstract buttons**

Replace `.toggle-abstract` with:

```astro
<button
  type="button"
  data-abstract-toggle
  data-target={abstractId}
  aria-controls={abstractId}
  aria-expanded="false"
  class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold ..."
>
  <span data-abstract-icon class="i-mdi:chevron-down text-base transition-transform duration-200"></span>
  Abstract
</button>
```

Set abstract panels to:

```astro
<div hidden class="hidden mt-3 p-4 ..." id={abstractId}>
```

- [ ] **Step 4: Import shared script in pages**

On pages with both abstract and filters:

```astro
<script>
  import { setupAbstractToggles, setupFilterControls } from "../scripts/ui";

  setupAbstractToggles();
  setupFilterControls();
</script>
```

On home:

```astro
<script>
  import { setupAbstractToggles } from "../scripts/ui";

  setupAbstractToggles();
</script>
```

On nested posts pages do not import this script unless controls are present.

- [ ] **Step 5: Verify interactions manually**

Run:

```bash
bun run dev -- --host 127.0.0.1 --port 4321
```

Check:

- `/` first abstract expands and collapses.
- `/researches` category filter hides other sections and updates `aria-pressed`.
- `/projects` active/past filter hides other sections.
- `/teaching` current/past filter hides other sections.

- [ ] **Step 6: Run automated verification**

Run:

```bash
bun run verify
```

Expected: no build errors from bundled client script imports.

- [ ] **Step 7: Commit**

```bash
git add src/scripts/ui.ts src/pages/index.astro src/pages/researches.astro src/pages/projects.astro src/pages/teaching.astro
git commit -m "refactor(ui): share filter and abstract interactions"
```

---

### Task 7: Improve Navigation And Mobile Polish

**Files:**
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: Add active nav detection**

In the Layout frontmatter:

```ts
const currentPath = Astro.url.pathname.replace(/\/$/, "") || "/";

function isActiveNav(href: string): boolean {
  const normalizedHref = href.replace(/\/$/, "") || "/";
  return normalizedHref === "/"
    ? currentPath === "/"
    : currentPath === normalizedHref || currentPath.startsWith(`${normalizedHref}/`);
}
```

- [ ] **Step 2: Use active nav state**

For each nav link:

```astro
<a
  class:list={[
    "block px-3 py-1.5 text-sm font-medium no-underline transition-all rounded-full",
    isActiveNav(link.href)
      ? "bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-200"
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800",
  ]}
  href={link.href}
  aria-current={isActiveNav(link.href) ? "page" : undefined}
>
  {link.label}
</a>
```

- [ ] **Step 3: Improve mobile menu controls**

Add `aria-controls`:

```astro
<button
  type="button"
  id="mobile-menu-toggle"
  aria-label="Toggle menu"
  aria-controls="mobile-menu"
  aria-expanded="false"
>
```

Add `hidden` to the initial menu:

```astro
<div id="mobile-menu" hidden class="absolute top-full right-0 ... opacity-0 scale-95 invisible">
```

Update the menu script so it toggles `hidden`:

```js
const closeMenu = () => {
  menuBtn.setAttribute("aria-expanded", "false");
  menu.hidden = true;
  menu.classList.add("opacity-0", "scale-95", "invisible");
  menu.classList.remove("opacity-100", "scale-100", "visible");
  iconMenu.classList.remove("hidden");
  iconClose.classList.add("hidden");
};

const openMenu = () => {
  menuBtn.setAttribute("aria-expanded", "true");
  menu.hidden = false;
  menu.classList.remove("opacity-0", "scale-95", "invisible");
  menu.classList.add("opacity-100", "scale-100", "visible");
  iconMenu.classList.add("hidden");
  iconClose.classList.remove("hidden");
};
```

- [ ] **Step 4: Add Escape key close**

Inside `DOMContentLoaded` after click handlers:

```js
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuBtn.focus();
  }
});
```

- [ ] **Step 5: Verify**

Run:

```bash
bun run verify
```

Then manually check mobile menu at 390px width:

- menu opens with `aria-expanded="true"`;
- Escape closes the menu;
- active nav item is visually marked and has `aria-current="page"`.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "fix(nav): mark active routes and improve mobile menu"
```

---

### Task 8: Documentation And Personalization Guardrails

**Files:**
- Modify: `README.md`
- Modify: `README.zh-CN.md`
- Modify: `src/side.config.ts`

- [ ] **Step 1: Add required personalization checklist to README**

Add this section:

```md
## Personalization Checklist

Before publishing, replace every placeholder in:

- `src/side.config.ts`: name, title, affiliation, social links, keywords, status badge, profile image.
- `src/data/publications.bib`: publication metadata, URLs, abstracts, and `public` category.
- `src/data/about.yml`: profile, education, experience, service, and awards.
- `src/data/projects.yml`: project title, status, period, description, technology tags, and URL.
- `src/data/teaching.yml`: current and past course records.
- `src/content/posts`: remove sample posts or mark drafts with `draft: true`.

Run `bun run verify` before deployment.
```

- [ ] **Step 2: Add the same checklist in Chinese**

Add this section to `README.zh-CN.md`:

```md
## 个性化发布前检查

发布前请替换以下文件中的示例内容：

- `src/side.config.ts`：姓名、标题、单位、社交链接、关键词、状态徽标和头像。
- `src/data/publications.bib`：论文元数据、链接、摘要和 `public` 分类。
- `src/data/about.yml`：个人资料、教育经历、工作经历、学术服务和奖项。
- `src/data/projects.yml`：项目标题、状态、时间、简介、技术标签和链接。
- `src/data/teaching.yml`：当前和过往课程。
- `src/content/posts`：删除示例文章，或使用 `draft: true` 标记为草稿。

部署前运行 `bun run verify`。
```

- [ ] **Step 3: Remove emoji from default status badge**

In `src/side.config.ts`, change:

```ts
statusBadge: 'Open to collaboration',
```

This avoids rendering a tiny broken-looking emoji in the status badge on platforms with limited emoji support.

- [ ] **Step 4: Verify docs and build**

Run:

```bash
bun run verify
```

- [ ] **Step 5: Commit**

```bash
git add README.md README.zh-CN.md src/side.config.ts
git commit -m "docs: document homepage personalization checklist"
```

---

## Final Verification

- [ ] Run the full verification command:

```bash
bun run verify
```

- [ ] Start the local site:

```bash
bun run dev -- --host 127.0.0.1 --port 4321
```

- [ ] Browser-check these routes:

```text
http://127.0.0.1:4321/
http://127.0.0.1:4321/researches
http://127.0.0.1:4321/projects
http://127.0.0.1:4321/teaching
http://127.0.0.1:4321/about
http://127.0.0.1:4321/posts
http://127.0.0.1:4321/posts/astro-overview/
```

- [ ] Confirm generated HTML:

```bash
node scripts/assert-built-site.mjs
```

- [ ] Confirm no unexpected worktree changes:

```bash
git status --short
```

---

## Review Focus

- SEO output should have one `<title>` per page and page-specific descriptions.
- Draft posts should not appear in lists or generated routes.
- Publication parsing should handle common BibTeX exported from Google Scholar, Zotero, ACM, IEEE, and arXiv.
- Project status should not depend only on English text inside `period`.
- About page should render every documented data block or hide the section cleanly.
- Shared UI behavior should improve accessibility without changing visible content unexpectedly.
- Mobile menu should be keyboard-dismissable and not leave invisible focusable links.

## Residual Risk

- A fully compliant BibTeX parser is a large dependency decision. This plan improves common real-world cases without adding a package. If the site needs complete BibTeX support, replace the custom parser with a maintained parser in a later, separate task.
- The framework still ships sample content. The documentation task makes this explicit, but a production instance should replace or remove all example records before deployment.
