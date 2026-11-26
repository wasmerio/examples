# Astro Template Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce configuration drift, move layout behavior into testable modules, and harden section/filter behavior for the Astro Scholars template.

**Architecture:** Keep the site static and config-driven. Move repeated URL, filter, section-id, and layout-browser behavior into small TypeScript helpers, then wire Astro pages to those helpers without changing the public content model. Extend unit and generated-site checks so regressions are caught by `pnpm verify`.

**Tech Stack:** Astro 5, TypeScript, Vitest, UnoCSS, astro-seo, @astrojs/sitemap, pnpm.

---

## File Structure

- Rename: `astro.config.mjs` -> `astro.config.ts`
- Modify: `README.md`
- Modify: `README.zh-CN.md`
- Modify: `scripts/assert-built-site.mjs`
- Modify: `src/components/FilterBar.astro`
- Modify: `src/layouts/Layout.astro`
- Modify: `src/lib/filter-state.ts`
- Create: `src/lib/section-id.ts`
- Create: `src/lib/site-url.ts`
- Create: `src/scripts/layout-ui.ts`
- Modify: `src/scripts/ui.ts`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/researches.astro`
- Create: `tests/layout-ui.test.ts`
- Modify: `tests/filter-state.test.ts`
- Create: `tests/section-id.test.ts`
- Create: `tests/site-url.test.ts`

---

### Task 1: Use `siteConfig.siteUrl` As The Single Site URL Source

**Files:**
- Rename: `astro.config.mjs` -> `astro.config.ts`
- Create: `src/lib/site-url.ts`
- Modify: `src/layouts/Layout.astro`
- Modify: `README.md`
- Modify: `README.zh-CN.md`
- Create: `tests/site-url.test.ts`

- [ ] **Step 1: Write URL helper tests**

Create `tests/site-url.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildAbsoluteUrl, normalizeSiteUrl, withTrailingSlash } from "../src/lib/site-url";

describe("site URL helpers", () => {
	it("normalizes a configured site URL without a trailing slash", () => {
		expect(normalizeSiteUrl("https://example.edu/")).toBe("https://example.edu");
		expect(normalizeSiteUrl("https://example.edu////")).toBe("https://example.edu");
	});

	it("returns a site URL with exactly one trailing slash for Astro config", () => {
		expect(withTrailingSlash("https://example.edu")).toBe("https://example.edu/");
		expect(withTrailingSlash("https://example.edu/")).toBe("https://example.edu/");
	});

	it("builds absolute URLs for public paths and relative paths", () => {
		expect(buildAbsoluteUrl("/profile.svg", "https://example.edu/")).toBe("https://example.edu/profile.svg");
		expect(buildAbsoluteUrl("profile.svg", "https://example.edu/")).toBe("https://example.edu/profile.svg");
	});

	it("keeps external URLs unchanged", () => {
		expect(buildAbsoluteUrl("https://cdn.example.edu/profile.png", "https://example.edu/")).toBe(
			"https://cdn.example.edu/profile.png",
		);
	});
});
```

- [ ] **Step 2: Run the URL helper tests and confirm the expected failure**

Run:

```bash
pnpm test tests/site-url.test.ts
```

Expected: FAIL because `src/lib/site-url.ts` does not exist.

- [ ] **Step 3: Implement the shared URL helper**

Create `src/lib/site-url.ts`:

```ts
const absoluteUrlPattern = /^https?:\/\//i;

export function normalizeSiteUrl(siteUrl: string): string {
	const trimmed = siteUrl.trim();
	if (!trimmed) {
		throw new Error("siteConfig.siteUrl must not be empty");
	}

	return trimmed.replace(/\/+$/, "");
}

export function withTrailingSlash(siteUrl: string): string {
	return `${normalizeSiteUrl(siteUrl)}/`;
}

export function buildAbsoluteUrl(pathOrUrl: string, siteUrl: string): string {
	const value = pathOrUrl.trim();
	if (absoluteUrlPattern.test(value)) {
		return value;
	}

	const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
	const normalizedPath = value.startsWith("/") ? value : `/${value}`;
	return `${normalizedSiteUrl}${normalizedPath}`;
}
```

- [ ] **Step 4: Rename the Astro config and import the shared site URL**

Run:

```bash
git mv astro.config.mjs astro.config.ts
```

Replace `astro.config.ts` with:

```ts
// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import UnoCSS from "unocss/vite";
import icon from "astro-icon";
import siteConfig from "./src/side.config";
import { withTrailingSlash } from "./src/lib/site-url";

export default defineConfig({
	site: withTrailingSlash(siteConfig.siteUrl),
	integrations: [icon(), sitemap()],
	vite: {
		plugins: [UnoCSS()],
	},
	prefetch: true,
});
```

- [ ] **Step 5: Use the URL helper in the layout**

In `src/layouts/Layout.astro`, add the import:

```astro
import { buildAbsoluteUrl } from "../lib/site-url";
```

Replace the OG image calculation:

```astro
const rawOgImage = image || siteConfig.ogImage || "/profile.svg";
const ogImage = buildAbsoluteUrl(rawOgImage, siteConfig.siteUrl);
```

- [ ] **Step 6: Update README file tree references**

In `README.md`, replace:

```text
├── astro.config.mjs           # Astro configuration
```

with:

```text
├── astro.config.ts            # Astro configuration
```

In `README.zh-CN.md`, replace:

```text
├── astro.config.mjs           # Astro 配置
```

with:

```text
├── astro.config.ts            # Astro 配置
```

- [ ] **Step 7: Verify and commit**

Run:

```bash
pnpm test tests/site-url.test.ts
pnpm verify
```

Expected: both commands pass, and `astro check` reports 0 errors.

Commit:

```bash
git add astro.config.ts README.md README.zh-CN.md src/lib/site-url.ts src/layouts/Layout.astro tests/site-url.test.ts
git commit -m "refactor(config): share site URL helpers"
```

---

### Task 2: Move Layout Browser Behavior Into A Reusable Script Module

**Files:**
- Modify: `src/layouts/Layout.astro`
- Create: `src/scripts/layout-ui.ts`
- Create: `tests/layout-ui.test.ts`
- Modify: `scripts/assert-built-site.mjs`

- [ ] **Step 1: Write tests for reduced-motion scroll behavior**

Create `tests/layout-ui.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getBackToTopScrollBehavior } from "../src/scripts/layout-ui";

describe("layout UI helpers", () => {
	it("uses instant scroll when reduced motion is requested", () => {
		expect(getBackToTopScrollBehavior(true)).toBe("auto");
	});

	it("uses smooth scroll when reduced motion is not requested", () => {
		expect(getBackToTopScrollBehavior(false)).toBe("smooth");
	});
});
```

- [ ] **Step 2: Run the layout UI tests and confirm the expected failure**

Run:

```bash
pnpm test tests/layout-ui.test.ts
```

Expected: FAIL because `src/scripts/layout-ui.ts` does not exist.

- [ ] **Step 3: Create the layout UI module**

Create `src/scripts/layout-ui.ts`:

```ts
const STORAGE_KEY = "site-theme";

type ThemeMode = "dark" | "light";

export function getBackToTopScrollBehavior(prefersReducedMotion: boolean): ScrollBehavior {
	return prefersReducedMotion ? "auto" : "smooth";
}

function getStoredTheme(): ThemeMode | null {
	try {
		const value = localStorage.getItem(STORAGE_KEY);
		return value === "dark" || value === "light" ? value : null;
	} catch {
		return null;
	}
}

function applyTheme(mode: ThemeMode) {
	document.documentElement.classList.toggle("dark", mode === "dark");
}

function setupThemeToggles(root: ParentNode = document) {
	root.querySelectorAll("[data-theme-toggle]").forEach((button) => {
		button.addEventListener("click", () => {
			const isDark = document.documentElement.classList.toggle("dark");
			try {
				localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
			} catch {
				return;
			}
		});
	});
}

function setupSystemThemeListener() {
	if (!window.matchMedia) return;

	window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
		if (!getStoredTheme()) {
			applyTheme(event.matches ? "dark" : "light");
		}
	});
}

function setupMobileMenu() {
	const menuBtn = document.getElementById("mobile-menu-toggle");
	const menu = document.getElementById("mobile-menu");
	const iconMenu = document.getElementById("icon-menu");
	const iconClose = document.getElementById("icon-close");

	if (!menuBtn || !menu || !iconMenu || !iconClose) return;

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

	menuBtn.addEventListener("click", (event) => {
		event.stopPropagation();
		menuBtn.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu();
	});

	document.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Node)) return;

		if (
			menuBtn.getAttribute("aria-expanded") === "true" &&
			!menu.contains(target) &&
			!menuBtn.contains(target)
		) {
			closeMenu();
		}
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
			closeMenu();
			menuBtn.focus();
		}
	});
}

function setupBackToTop() {
	const backToTopBtn = document.getElementById("back-to-top");
	if (!backToTopBtn) return;

	const toggleBackToTop = () => {
		backToTopBtn.setAttribute("data-visible", String(window.scrollY > 300));
	};

	window.addEventListener("scroll", toggleBackToTop, { passive: true });
	backToTopBtn.addEventListener("click", () => {
		const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
		window.scrollTo({
			top: 0,
			behavior: getBackToTopScrollBehavior(prefersReducedMotion),
		});
	});
	toggleBackToTop();
}

export function setupLayoutUi() {
	document.addEventListener("DOMContentLoaded", () => {
		setupMobileMenu();
		setupThemeToggles();
		setupSystemThemeListener();
		setupBackToTop();
	});
}
```

- [ ] **Step 4: Keep only the pre-paint theme snippet inline**

In `src/layouts/Layout.astro`, replace the current large inline `<script is:inline>` block with:

```astro
    <script is:inline>
      (() => {
        const STORAGE_KEY = "site-theme";
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
          if (stored === "dark" || (!stored && prefersDark)) {
            document.documentElement.classList.add("dark");
          }
        } catch {
          // Keep the default light theme when storage is unavailable.
        }
      })();
    </script>
    <script>
      import { setupLayoutUi } from "../scripts/layout-ui";

      setupLayoutUi();
    </script>
```

- [ ] **Step 5: Add a generated-site check for the split script**

In `scripts/assert-built-site.mjs`, after the reduced-motion CSS assertion, add:

```js
assert(
	index.includes("_astro/") && index.includes('type="module"'),
	"home page should load external module scripts for layout behavior",
);
```

- [ ] **Step 6: Verify and commit**

Run:

```bash
pnpm test tests/layout-ui.test.ts
pnpm verify
```

Expected: both commands pass.

Commit:

```bash
git add src/layouts/Layout.astro src/scripts/layout-ui.ts tests/layout-ui.test.ts scripts/assert-built-site.mjs
git commit -m "refactor(layout): extract browser UI setup"
```

---

### Task 3: Make Filter UI State Less Dependent On Span Order

**Files:**
- Modify: `src/components/FilterBar.astro`
- Modify: `src/lib/filter-state.ts`
- Modify: `src/scripts/ui.ts`
- Modify: `tests/filter-state.test.ts`
- Modify: `scripts/assert-built-site.mjs`

- [ ] **Step 1: Extend filter helper tests**

Append to `tests/filter-state.test.ts`:

```ts
	it("checks whether a section should be visible for the active filter", () => {
		expect(isFilterSectionVisible("all", "current")).toBe(true);
		expect(isFilterSectionVisible("current", "current")).toBe(true);
		expect(isFilterSectionVisible("past", "current")).toBe(false);
		expect(isFilterSectionVisible("current", undefined)).toBe(false);
	});
```

Update the import:

```ts
import {
	buildFilterSearch,
	isFilterSectionVisible,
	readFilterFromSearch,
} from "../src/lib/filter-state";
```

- [ ] **Step 2: Run the filter helper tests and confirm the expected failure**

Run:

```bash
pnpm test tests/filter-state.test.ts
```

Expected: FAIL because `isFilterSectionVisible` is not exported.

- [ ] **Step 3: Export the section visibility helper**

Add to `src/lib/filter-state.ts`:

```ts
export function isFilterSectionVisible(
	activeFilter: string,
	sectionFilter: string | undefined,
): boolean {
	return activeFilter === "all" || sectionFilter === activeFilter;
}
```

- [ ] **Step 4: Add semantic marker attributes to filter spans**

In `src/components/FilterBar.astro`, change the active button spans to:

```astro
        <span data-filter-icon class={`${allIcon} text-base text-accent-600 dark:text-accent-400`} aria-hidden="true"></span>
        <span data-filter-count class="font-medium text-accent-700 dark:text-accent-300">{total}</span>
        <span data-filter-label class="text-accent-600 dark:text-accent-400">all</span>
```

Change item button spans to:

```astro
            <span data-filter-icon class={`${item.icon} text-base text-gray-500 dark:text-gray-400`} aria-hidden="true"></span>
            <span data-filter-count class="font-medium text-gray-700 dark:text-gray-300">{item.count}</span>
            <span data-filter-label class="text-gray-500 dark:text-gray-500">{item.label}</span>
```

- [ ] **Step 5: Update filter control setup to use marker attributes**

In `src/scripts/ui.ts`, update the import:

```ts
import {
	buildFilterSearch,
	isFilterSectionVisible,
	readFilterFromSearch,
} from "../lib/filter-state";
```

Replace `setActiveButton` with:

```ts
function setActiveButton(buttons: NodeListOf<HTMLElement>, activeButton: HTMLElement) {
	buttons.forEach((button) => {
		const isActive = button === activeButton;
		const icon = button.querySelector("[data-filter-icon]");
		const count = button.querySelector("[data-filter-count]");
		const label = button.querySelector("[data-filter-label]");

		button.dataset.active = String(isActive);
		button.setAttribute("aria-pressed", String(isActive));
		button.classList.toggle("active", isActive);
		toggleClasses(button, isActive, ["bg-accent-100", "dark:bg-accent-900/30"]);
		toggleClasses(button, !isActive, ["bg-gray-100", "dark:bg-gray-800"]);

		if (icon) {
			toggleClasses(icon, isActive, ["text-accent-600", "dark:text-accent-400"]);
			toggleClasses(icon, !isActive, ["text-gray-500", "dark:text-gray-400"]);
		}
		if (count) {
			toggleClasses(count, isActive, ["text-accent-700", "dark:text-accent-300"]);
			toggleClasses(count, !isActive, ["text-gray-700", "dark:text-gray-300"]);
		}
		if (label) {
			toggleClasses(label, isActive, ["text-accent-600", "dark:text-accent-400"]);
			toggleClasses(label, !isActive, ["text-gray-500", "dark:text-gray-400"]);
		}
	});
}
```

Replace both visibility calculations with:

```ts
const visible = isFilterSectionVisible(initialFilter ?? "all", section.dataset.filterSection);
```

and:

```ts
const visible = isFilterSectionVisible(filter, section.dataset.filterSection);
```

- [ ] **Step 6: Add generated HTML assertions for marker attributes**

In `scripts/assert-built-site.mjs`, inside `assertFilterToolbar`, add:

```js
assert(
	html.includes("data-filter-icon") &&
		html.includes("data-filter-count") &&
		html.includes("data-filter-label"),
	`${pageName} page should render semantic filter button markers`,
);
```

- [ ] **Step 7: Verify and commit**

Run:

```bash
pnpm test tests/filter-state.test.ts
pnpm verify
```

Expected: both commands pass.

Commit:

```bash
git add src/components/FilterBar.astro src/lib/filter-state.ts src/scripts/ui.ts tests/filter-state.test.ts scripts/assert-built-site.mjs
git commit -m "refactor(filters): avoid span-order state updates"
```

---

### Task 4: Share Section ID Generation Across Pages

**Files:**
- Create: `src/lib/section-id.ts`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/researches.astro`
- Create: `tests/section-id.test.ts`
- Modify: `scripts/assert-built-site.mjs`

- [ ] **Step 1: Write section ID tests**

Create `tests/section-id.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createUniqueSectionId, slugifySectionId } from "../src/lib/section-id";

describe("section ID helpers", () => {
	it("slugifies labels for anchor IDs", () => {
		expect(slugifySectionId("Working Paper")).toBe("working-paper");
		expect(slugifySectionId("Work & Progress!")).toBe("work-progress");
	});

	it("uses a fallback when a label has no ASCII slug", () => {
		expect(slugifySectionId("!!!", "section-1")).toBe("section-1");
	});

	it("keeps generated IDs unique against fixed IDs", () => {
		const used = new Set(["profile"]);
		expect(createUniqueSectionId("Profile", used, "section-1")).toBe("profile-2");
		expect(createUniqueSectionId("Profile", used, "section-2")).toBe("profile-3");
	});
});
```

- [ ] **Step 2: Run section ID tests and confirm the expected failure**

Run:

```bash
pnpm test tests/section-id.test.ts
```

Expected: FAIL because `src/lib/section-id.ts` does not exist.

- [ ] **Step 3: Implement shared section ID helpers**

Create `src/lib/section-id.ts`:

```ts
export function slugifySectionId(label = "", fallback = "section"): string {
	const slug = label
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

	return slug || fallback;
}

export function createUniqueSectionId(
	label: string | undefined,
	usedIds: Set<string>,
	fallback: string,
): string {
	const base = slugifySectionId(label, fallback);
	let id = base;
	let suffix = 2;

	while (usedIds.has(id)) {
		id = `${base}-${suffix}`;
		suffix += 1;
	}

	usedIds.add(id);
	return id;
}
```

- [ ] **Step 4: Use shared IDs on the About page**

In `src/pages/about.astro`, add:

```astro
import { createUniqueSectionId } from "../lib/section-id";
```

Delete the local `slugSectionTitle` function and keep:

```astro
const fixedSectionIds = new Set(["profile", "education", "experience", "service"]);
const usedSectionIds = new Set(fixedSectionIds);

const customSections = sections.map((section, index) => ({
  ...section,
  id: createUniqueSectionId(section.title, usedSectionIds, `section-${index + 1}`),
  label: section.title?.trim() || `Section ${index + 1}`,
}));
```

- [ ] **Step 5: Use shared IDs on the Research page**

In `src/pages/researches.astro`, add:

```astro
import { slugifySectionId } from "../lib/section-id";
```

Replace each category slug expression:

```astro
category.toLowerCase().replace(/\s+/g, "-")
```

with:

```astro
slugifySectionId(category)
```

- [ ] **Step 6: Add generated-site coverage for working-paper anchors**

In `scripts/assert-built-site.mjs`, extend the research jump-link assertion:

```js
assert(
	research.includes('aria-label="Page sections"') &&
		research.includes('href="#publication"') &&
		research.includes('id="publication"') &&
		research.includes('href="#working-paper"') &&
		research.includes('id="working-paper"'),
	"research page should render section jump links with matching anchors",
);
```

- [ ] **Step 7: Verify and commit**

Run:

```bash
pnpm test tests/section-id.test.ts
pnpm verify
```

Expected: both commands pass.

Commit:

```bash
git add src/lib/section-id.ts src/pages/about.astro src/pages/researches.astro tests/section-id.test.ts scripts/assert-built-site.mjs
git commit -m "refactor(sections): share anchor id generation"
```

---

### Task 5: Final Template Verification And Release-Readiness Notes

**Files:**
- Modify: `README.md`
- Modify: `README.zh-CN.md`
- Modify: `scripts/assert-built-site.mjs`

- [ ] **Step 1: Document the verification expectation**

In `README.md`, under `Run pnpm verify before deployment.`, add:

```md
`siteUrl` is the single source for canonical URLs, Open Graph image URLs, and
the Astro sitemap integration. Update it before publishing a copied site.
```

In `README.zh-CN.md`, under the matching deployment verification sentence, add:

```md
`siteUrl` 是 canonical URL、Open Graph 图片 URL 和 Astro sitemap 集成的唯一来源。
复制模板后发布前请先更新它。
```

- [ ] **Step 2: Add final generated-site assertions for canonical consistency**

In `scripts/assert-built-site.mjs`, add:

```js
const aboutCanonical = 'link rel="canonical" href="https://astro-theme-scholars.pages.dev/about/"';
const researchCanonical = 'link rel="canonical" href="https://astro-theme-scholars.pages.dev/researches/"';

assert(about.includes(aboutCanonical), "about page canonical should use siteConfig.siteUrl");
assert(research.includes(researchCanonical), "research page canonical should use siteConfig.siteUrl");
```

- [ ] **Step 3: Run the complete verification harness**

Run:

```bash
pnpm verify
```

Expected:

```text
Test Files  10 passed
Result (... files):
- 0 errors
- 0 warnings
- 0 hints
[build] Complete!
```

- [ ] **Step 4: Review changed files before the final commit**

Run:

```bash
git diff --stat
git status --short
```

Expected: only files from this plan are modified, plus any pre-existing untracked plan file that was present before this plan.

- [ ] **Step 5: Commit**

```bash
git add README.md README.zh-CN.md scripts/assert-built-site.mjs
git commit -m "docs(template): clarify site URL verification"
```

---

## Self-Review

- Scope is limited to template maintainability, accessibility, SEO consistency, and verification. It does not change user content formats.
- Each task has a focused test target before implementation and a full `pnpm verify` gate before commit.
- The plan avoids touching the pre-existing untracked `docs/superpowers/plans/2026-05-24-academic-homepage-optimization.md` file.
- The highest-risk change is renaming `astro.config.mjs` to `astro.config.ts`; Task 1 verifies this through `pnpm verify` immediately after the rename.
