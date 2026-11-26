# 🚀 Site Personalization & Onboarding Guide (`ONBOARDING.md`)

Follow this itemized roadmap to convert the starter template into your personal academic website.

> ⚠️ **One-Time Lifecycle**: This onboarding guide and [`.agents/skills/onboarding/`](../.agents/skills/onboarding/SKILL.md) are intended solely for initial site setup. Once onboarding and verification are complete, follow [Section 5.E](#e-retire-onboarding-tooling) to delete them while retaining [`docs/CONFIG.md`](CONFIG.md), [`docs/CONTENT.md`](CONTENT.md), [`docs/MARKDOWN.md`](MARKDOWN.md), and [`docs/SYNC.md`](SYNC.md) for ongoing site maintenance.

---

## 1. Site Identity & Author Profile

- [ ] **Site Configuration**: Edit `src/data/siteConfig.ts` to update `title`, `description`, `url`, choose your `theme.light` and `theme.dark` presets, and remove `picker: true` (see [`docs/CONFIG.md`](CONFIG.md))
- [ ] **Author Bio & Details**: In `src/data/siteConfig.ts`, update `author.name`, `author.bio`, `author.location`, `author.employer`, and `author.email`
- [ ] **Academic & Social Handles**: In `src/data/siteConfig.ts`, add your usernames or profile URLs for `googlescholar`, `orcid`, `github`, `linkedin`, `x`, etc.
- [ ] **Profile Photo**: Replace `public/images/profile.png` with your personal square headshot (~500x500px)
- [ ] **Favicon & Logo**: Replace `public/favicon.svg` with your personal or institution logo, then run `pnpm generate:favicons` to regenerate PNG and ICO formats (requires `resvg` CLI: `cargo install resvg` or package manager)
- [ ] **License & Copyright**: In `LICENSE`, add your copyright notice (`Copyright (c) [Year] [Your Name]`) while preserving upstream attribution lines
- [ ] **Preserve Footer Attribution**: Keep the template attribution credit in `src/components/Footer.astro` and global footer linking back to Academic Pages Astro (never remove, hide, or comment it out)

---

## 2. Content Migration & Demo Purge

- [ ] **Publications**: Delete demo files in `src/content/publications/` and add your research papers (see [`docs/CONTENT.md`](CONTENT.md))
- [ ] **Talks & Presentations**: Delete demo files in `src/content/talks/` or populate with your presentations
- [ ] **Teaching**: Delete demo files in `src/content/teaching/` or populate with your courses
- [ ] **Portfolio Projects**: Delete demo files in `src/content/portfolio/` or populate with your software/research projects
- [ ] **Blog Posts**: Delete demo files in `src/content/blog/` or populate with your posts
- [ ] **Markdown Guide**: Delete demo content `src/content/pages/markdown.md` and its route `src/pages/markdown.astro`
- [ ] **Homepage Bio**: Update `src/content/pages/about.md` with your biography and research interests (rendered on `/` by `src/pages/index.astro`)
- [ ] **CV**: Update `src/pages/cv.astro` (education, appointments, awards, service)
- [ ] **Terms & Privacy Policy**: Review and customize `src/content/pages/terms.md` (institutional disclaimers, course reuse licensing, and hosting infrastructure references if deploying to platforms other than GitHub Pages such as Cloudflare Pages, Vercel, Netlify)

---

## 3. Demo Assets Cleanup

- [ ] **Sample PDFs & Slides**: Delete starter files in `public/files/`:
  - `paper1.pdf`, `paper2.pdf`, `paper3.pdf`, `paper4.pdf`
  - `slides1.pdf`, `slides2.pdf`, `slides3.pdf`, `slides4.pdf`
- [ ] **Sample Images**: Replace sample project visuals in `public/images/project-1.svg` and `public/images/project-2.svg` with your own project screenshots or diagrams

---

## 4. Navigation & Route Pruning

- [ ] **Remove Guide Link**: Delete `{ title: 'Guide', url: '/markdown/' }` from `src/data/navigation.ts` and remove the Guide link from `src/pages/sitemap.astro`
- [ ] **Prune Unused Sections**: In `src/data/navigation.ts`, remove links to any collections you do not use (e.g. remove `Teaching` or `Talks`)
- [ ] **Clean Legacy Redirects**: In `astro.config.ts`, remove demo redirects (`/guide`, `/md`) unless you are porting an existing Jekyll site with live inbound links (see [`docs/CONFIG.md`](CONFIG.md#4-route--legacy-redirects-astroconfigts))

---

## 5. Starter Scaffolding & Template Files Retirement

Once your site is personalized and verified, remove starter tooling to keep your personal repository lean:

> ⚠️ **Template Attribution**: When personalizing the website or retiring starter files, the footer attribution credit in `src/components/Footer.astro` linking back to [Academic Pages Astro](https://github.com/arghyadipchak/academicpages-astro) must remain intact.

### A. Retire Favicon Generator (Optional)

Once your custom icons are generated in `public/`:

- [ ] **Delete Script Directory**:

  ```bash
  rm -rf scripts/
  ```

- [ ] **Remove Generator Dependency & Script**: In `package.json`, remove `"generate:favicons": "node --experimental-strip-types scripts/generate-favicons.ts"`

### B. Retire Starter Tests & Test Scaffolding

Because the starter browser tests in `tests/` assert against template demo routes (`/markdown/`, `/posts/blog-post-1/`, `/publications/paper-1/`) and `'Your Name'`, either update `tests/` to match your content or retire the starter test suite before pushing to GitHub Pages:

- [ ] **Delete Test Directory**:

  ```bash
  rm -rf tests/
  rm playwright.config.ts
  ```

- [ ] **Remove Test Scripts & Dependencies**: In `package.json`, remove `"test": "playwright test"` and `@playwright/test` from `devDependencies`
- [ ] **Update CI Workflow**: In `.github/workflows/ci.yml`, remove the `Install Playwright browsers` and `Run tests` steps so GitHub Pages deployments run `pnpm verify` and `pnpm build` directly

### C. Retire Template Governance & Release Tooling (Optional)

Starter template maintenance files, issue templates, and changelog tooling can be safely deleted from a personal website repo:

- [ ] **Delete Template Governance Files**:

  ```bash
  rm -f cliff.toml CONTRIBUTING.md SECURITY.md
  rm -rf .github/ISSUE_TEMPLATE/ .github/pull_request_template.md .github/FUNDING.yml .github/workflows/release.yml .github/workflows/pr-lint.yml
  ```

### D. Clean Up Documentation & README

Replace the starter template `README.md` with a clean personal website README:

- [ ] **Update `README.md`**: Replace template documentation with your personal profile, live deployment URL, and basic development commands:

  ````markdown
  # [Your Name] — Academic Website

  Source code for my personal academic portfolio website, hosted at [yourdomain.com](https://yourdomain.com)

  Built with [Astro 7](https://astro.build), [Tailwind CSS v4](https://tailwindcss.com), and [TypeScript](https://www.typescriptlang.org/), based on the [Academic Pages Astro](https://github.com/arghyadipchak/academicpages-astro) template.

  ## 🚀 Local Development

  ```bash
  # Install dependencies
  pnpm install

  # Start local dev server
  pnpm dev

  # Build static production site
  pnpm build

  # Quality gate check
  pnpm verify
  ```

  ## 📄 License

  Content © [Year] [Your Name]. Code based on [Academic Pages Astro](https://github.com/arghyadipchak/academicpages-astro) (MIT License)
  ````

### E. Retire Onboarding Tooling

Once all steps are verified with `pnpm verify` and `pnpm build`:

- [ ] **Delete Onboarding Artifacts**:

  ```bash
  rm docs/ONBOARDING.md
  rm -rf .agents/skills/onboarding/
  ```

- [ ] **Retain Ongoing Maintenance Guides**: Keep [`AGENTS.md`](../AGENTS.md), [`docs/CONFIG.md`](CONFIG.md), [`docs/CONTENT.md`](CONTENT.md), [`docs/MARKDOWN.md`](MARKDOWN.md), [`docs/SYNC.md`](SYNC.md), [`.agents/skills/content-operations/`](../.agents/skills/content-operations/SKILL.md), and [`.agents/skills/template-sync/`](../.agents/skills/template-sync/SKILL.md) for long-term site authoring and template upgrades
