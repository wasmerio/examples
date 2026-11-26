---
name: academicpages-template-sync
description: Tag-to-tag upstream template upgrade, ephemeral patch generation, dependency synchronization, and verification runbook for Academic Pages Astro
---

# Academic Pages Astro Template Sync Skill 🔄

Operational runbook for AI coding assistants upgrading personalized websites with upstream template improvements from `arghyadipchak/academicpages-astro` without Git remote pollution.

> 📚 **Canonical Reference Guide**: [`docs/SYNC.md`](../../../docs/SYNC.md)

---

## 1. Upgrade Protocol & Rules

Follow the 4-step protocol defined in [`docs/SYNC.md`](../../../docs/SYNC.md):

### Step 1: Detect Current Version Tag

Read `"version"` from `package.json` to identify the base version tag (e.g. `"version": "0.2.0"` $\rightarrow$ `v0.2.0`).

### Step 2: Generate Ephemeral Patch

Execute the patch generation commands in [`docs/SYNC.md#2-step-1-clone-ephemeral-template--check-tags`](../../../docs/SYNC.md#2-step-1-clone-ephemeral-template--check-tags) and [`docs/SYNC.md#3-step-2-generate-whole-codebase-patch`](../../../docs/SYNC.md#3-step-2-generate-whole-codebase-patch) to produce `template-update.patch`.

### Step 3: Intelligent Semantic Merging

Apply `template-update.patch` across repository layers with these strict rules:

- **Port Upstream Improvements**: Merge updates to UI components, layouts, Tailwind styles, utilities, agent skills, documentation, and tooling
- **Preserve User Content**: Never overwrite or delete user files in `src/content/`, `public/files/`, or `public/images/`
- **Preserve Identity**: Retain user profile details in `src/data/siteConfig.ts` and custom navigation in `src/data/navigation.ts`
- **Dependencies**: Upgrade core packages in `package.json` while preserving any additional user-installed packages

### Step 4: Version Bump & Verification

Follow [`docs/SYNC.md#5-step-4-bump-version--verify`](../../../docs/SYNC.md#5-step-4-bump-version--verify):

1. Update `"version"` in `package.json` to match the target release
2. Delete `template-update.patch`
3. Run verification quality gate:

   ```bash
   pnpm install
   pnpm verify
   pnpm build
   ```
