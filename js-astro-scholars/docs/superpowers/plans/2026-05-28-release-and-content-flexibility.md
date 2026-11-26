# Release And Content Flexibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add tag-based release tracking, downstream template update PR automation, and backward-compatible YAML extension fields.

**Architecture:** Keep the repository template-first. Add small Node scripts for version validation and template sync logic, GitHub Actions workflows for tag releases and downstream PR updates, and TypeScript normalization helpers so Astro pages render optional YAML fields without duplicating fallback logic.

**Tech Stack:** Astro 5, TypeScript, Vitest, pnpm, GitHub Actions, Node.js scripts, YAML.

---

## File Structure

- Create `.template-version`: stores the current template version.
- Create `.template-sync.json`: downstream update policy and protected paths.
- Create `.github/workflows/release.yml`: validates pushed release tags and creates GitHub releases.
- Create `.github/workflows/template-update.yml`: copied downstream workflow that opens template bump PRs.
- Create `scripts/lib/release-version.mjs`: SemVer/tag parsing and release file validation helpers.
- Create `scripts/check-release.mjs`: CLI used by release workflow.
- Create `scripts/template-latest-version.mjs`: CLI used by template update workflow to find newer upstream tags.
- Create `scripts/sync-template-release.mjs`: CLI that overlays upstream template files while respecting protected paths.
- Modify `package.json`: align version with changelog and expose release check script.
- Modify `CHANGELOG.md`: add this optimization release entry.
- Modify `src/lib/projects.ts`: add shared link/badge/metadata types and project normalization.
- Create `src/lib/teaching.ts`: add teaching module normalization.
- Modify `src/pages/projects.astro`: render optional project fields through normalized data.
- Modify `src/pages/teaching.astro`: render optional teaching fields through normalized data.
- Modify `src/pages/about.astro`: render richer custom section fields.
- Modify `src/data/projects.yml`, `src/data/teaching.yml`, `src/data/about.yml`: add minimal examples for optional fields.
- Create `tests/release-version.test.ts`: tests version/tag parsing and validation.
- Create `tests/template-sync.test.ts`: tests protected path matching.
- Create `tests/content-normalization.test.ts`: tests project/teaching fallback normalization.
- Modify `README.md` and `README.zh-CN.md`: document release tags, template update bot, and enhanced YAML fields.

---

### Task 1: Add Release Version Tests

**Files:**
- Create: `tests/release-version.test.ts`
- Create: `tests/template-sync.test.ts`

- [ ] **Step 1: Write failing release helper tests**

```ts
import { describe, expect, test } from "vitest";
import {
	parseSemverTag,
	selectLatestSemverTag,
	versionsMatch,
} from "../scripts/lib/release-version.mjs";

describe("release version helpers", () => {
	test("parses v-prefixed semver tags", () => {
		expect(parseSemverTag("v1.2.3")).toEqual({
			major: 1,
			minor: 2,
			patch: 3,
			version: "1.2.3",
			tag: "v1.2.3",
		});
	});

	test("rejects non-release tags", () => {
		expect(parseSemverTag("1.2.3")).toBeNull();
		expect(parseSemverTag("v1.2")).toBeNull();
	});

	test("selects the highest semver tag", () => {
		expect(selectLatestSemverTag(["v0.2.0", "v0.10.0", "v0.3.2"])?.tag).toBe(
			"v0.10.0",
		);
	});

	test("compares package, template, changelog, and tag versions", () => {
		expect(
			versionsMatch({
				packageVersion: "0.3.0",
				templateVersion: "0.3.0",
				changelogVersion: "0.3.0",
				tagName: "v0.3.0",
			}),
		).toEqual({ ok: true, errors: [] });
	});
});
```

- [ ] **Step 2: Write failing template sync tests**

```ts
import { describe, expect, test } from "vitest";
import { isProtectedPath } from "../scripts/sync-template-release.mjs";

describe("template sync path protection", () => {
	test("protects user-owned content paths", () => {
		const patterns = ["src/data/**", "src/side.config.ts", "public/profile.*"];

		expect(isProtectedPath("src/data/about.yml", patterns)).toBe(true);
		expect(isProtectedPath("src/side.config.ts", patterns)).toBe(true);
		expect(isProtectedPath("public/profile.svg", patterns)).toBe(true);
	});

	test("allows template-owned source paths", () => {
		const patterns = ["src/data/**", "src/side.config.ts", "public/profile.*"];

		expect(isProtectedPath("src/pages/projects.astro", patterns)).toBe(false);
		expect(isProtectedPath("src/lib/projects.ts", patterns)).toBe(false);
	});
});
```

- [ ] **Step 3: Run tests and verify expected failure**

Run: `pnpm exec vitest run tests/release-version.test.ts tests/template-sync.test.ts`

Expected: fail because the helper modules do not exist yet.

---

### Task 2: Implement Release And Template Sync Scripts

**Files:**
- Create: `scripts/lib/release-version.mjs`
- Create: `scripts/check-release.mjs`
- Create: `scripts/template-latest-version.mjs`
- Create: `scripts/sync-template-release.mjs`

- [ ] **Step 1: Implement release helpers**

Add functions matching the tests:

```js
export function parseSemverTag(tag) {
	const match = /^v(\d+)\.(\d+)\.(\d+)$/.exec(tag.trim());
	if (!match) return null;
	const [, major, minor, patch] = match;
	return {
		major: Number(major),
		minor: Number(minor),
		patch: Number(patch),
		version: `${Number(major)}.${Number(minor)}.${Number(patch)}`,
		tag: `v${Number(major)}.${Number(minor)}.${Number(patch)}`,
	};
}
```

- [ ] **Step 2: Implement release check CLI**

`scripts/check-release.mjs` reads `package.json`, `.template-version`, and
`CHANGELOG.md`, then exits non-zero when versions do not match the current tag.

- [ ] **Step 3: Implement latest tag CLI**

`scripts/template-latest-version.mjs` runs `git ls-remote --tags`, selects the
highest SemVer tag, compares it with `.template-version`, and writes
`current_version`, `latest_version`, `latest_tag`, and `update_available` to
`GITHUB_OUTPUT` when present.

- [ ] **Step 4: Implement sync script**

`scripts/sync-template-release.mjs` exports `isProtectedPath()` and copies files
from an upstream checkout to the current repo unless the path is excluded or
protected by `.template-sync.json`.

- [ ] **Step 5: Run release/template tests**

Run: `pnpm exec vitest run tests/release-version.test.ts tests/template-sync.test.ts`

Expected: pass.

---

### Task 3: Add GitHub Actions And Version Files

**Files:**
- Create: `.template-version`
- Create: `.template-sync.json`
- Create: `.github/workflows/release.yml`
- Create: `.github/workflows/template-update.yml`
- Modify: `package.json`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Align project version**

Set `package.json.version` to `0.4.0` and create `.template-version` with:

```text
0.4.0
```

- [ ] **Step 2: Add template sync policy**

Create `.template-sync.json` with protected personal content paths:

```json
{
  "upstream": "jxpeng98/astro-theme-scholars",
  "protected": [
    "src/side.config.ts",
    "src/data/**",
    "src/content/posts/**",
    "public/profile.*",
    "public/favicon.svg",
    ".env*",
    ".env.*"
  ],
  "exclude": [
    ".git/**",
    ".astro/**",
    "dist/**",
    "node_modules/**",
    ".pnpm-store/**"
  ]
}
```

- [ ] **Step 3: Add release workflow**

Release workflow runs on `v*.*.*` tag pushes, executes `pnpm verify`, runs
`node scripts/check-release.mjs --tag "$GITHUB_REF_NAME"`, and creates a GitHub
release.

- [ ] **Step 4: Add template update workflow**

Template workflow runs weekly or manually in downstream repositories, calls the
latest-tag script, clones the upstream tag, syncs files, commits to a branch,
pushes it, and creates or updates a PR using `gh pr create`.

- [ ] **Step 5: Run release check locally**

Run: `node scripts/check-release.mjs --tag v0.4.0`

Expected: pass.

---

### Task 4: Add Content Normalization Tests

**Files:**
- Create: `tests/content-normalization.test.ts`

- [ ] **Step 1: Write failing project normalization tests**

```ts
import { describe, expect, test } from "vitest";
import { normalizeProject } from "../src/lib/projects";
import { normalizeTeachingModule } from "../src/lib/teaching";

describe("content normalization", () => {
	test("turns a project url into a default link", () => {
		const project = normalizeProject({
			title: "Portal",
			description: "A project",
			tech: ["Astro"],
			url: "https://example.com",
		});

		expect(project.links).toEqual([{ label: "View Project", href: "https://example.com" }]);
	});

	test("keeps explicit project links ahead of url fallback", () => {
		const project = normalizeProject({
			title: "Portal",
			description: "A project",
			tech: [],
			url: "https://fallback.example.com",
			links: [{ label: "Demo", href: "https://demo.example.com" }],
		});

		expect(project.links).toEqual([{ label: "Demo", href: "https://demo.example.com" }]);
	});

	test("turns a teaching link into normalized links", () => {
		const module = normalizeTeachingModule({
			title: "Studio",
			link: { label: "Syllabus", href: "https://example.edu" },
		});

		expect(module.links).toEqual([{ label: "Syllabus", href: "https://example.edu" }]);
	});
});
```

- [ ] **Step 2: Run test and verify expected failure**

Run: `pnpm exec vitest run tests/content-normalization.test.ts`

Expected: fail because `normalizeProject` and `src/lib/teaching.ts` do not exist yet.

---

### Task 5: Implement Content Normalization And Rendering

**Files:**
- Modify: `src/lib/projects.ts`
- Create: `src/lib/teaching.ts`
- Modify: `src/pages/projects.astro`
- Modify: `src/pages/teaching.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/data/projects.yml`
- Modify: `src/data/teaching.yml`
- Modify: `src/data/about.yml`

- [ ] **Step 1: Add shared optional content types**

Add `ContentLink`, `ContentMetadata`, and optional arrays to project and teaching
types.

- [ ] **Step 2: Implement normalization helpers**

`normalizeProject()` and `normalizeTeachingModule()` return array-safe values
for links, badges, highlights, and metadata.

- [ ] **Step 3: Render richer Projects cards**

Project cards display subtitle, badges, highlights, metadata rows, and multiple
links when present. Existing `url` behavior remains valid.

- [ ] **Step 4: Render richer Teaching cards**

Teaching cards display badges, highlights, and multiple links when present.
Existing `link` behavior remains valid.

- [ ] **Step 5: Render richer About custom sections**

Custom section items support `badges`, `highlights`, and multiple `links`, while
string items still render exactly as before.

- [ ] **Step 6: Add minimal sample YAML**

Add one optional-field example per YAML file without making sample content noisy.

- [ ] **Step 7: Run content tests**

Run: `pnpm exec vitest run tests/content-normalization.test.ts tests/project-status.test.ts`

Expected: pass.

---

### Task 6: Update Documentation

**Files:**
- Modify: `README.md`
- Modify: `README.zh-CN.md`

- [ ] **Step 1: Document release tags**

Add a section explaining SemVer tags, `.template-version`, and the release
check command.

- [ ] **Step 2: Document template update bot**

Add a section explaining how downstream users enable the copied workflow, what
paths are protected, and how update PRs should be reviewed.

- [ ] **Step 3: Document flexible YAML fields**

Add examples for project links/badges/highlights/metadata, teaching links, and
About custom sections.

---

### Task 7: Verify And Tag

**Files:**
- All modified files.

- [ ] **Step 1: Run full verification**

Run: `pnpm verify`

Expected: tests, Astro check, build, and built-site assertions pass.

- [ ] **Step 2: Review git diff**

Run: `git diff --stat` and inspect relevant diffs.

- [ ] **Step 3: Commit changes**

Commit message:

```text
feat(release): add template update automation
```

- [ ] **Step 4: Create release tag**

Run:

```bash
git tag -a v0.4.0 -m "Release v0.4.0"
```

Expected: local annotated release tag exists.
