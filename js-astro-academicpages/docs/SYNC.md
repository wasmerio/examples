# 🔄 Template Synchronization Guide (`SYNC.md`)

This guide explains how to pull new features, accessibility enhancements, performance optimizations, and framework upgrades from the upstream template repository ([`arghyadipchak/academicpages-astro`](https://github.com/arghyadipchak/academicpages-astro)) into your personalized website without requiring a Git fork or foreign remotes.

---

## 1. Synchronization Architecture

- **Version Authority**: The `"version"` field in `package.json` records the template release version your site was initialized with or last synced to (e.g. `"version": "0.2.0"`)
- **Tag-to-Tag Diffs**: Updates are computed strictly between version tags (e.g. `v0.2.0` $\rightarrow$ `v0.3.0`)
- **Ephemeral Bare Clone**: The template repository is cloned to `/tmp` solely to generate a patch file, and then deleted immediately
- **Clean Codebase Synchronization**: The patch captures all template improvements across UI components, layouts, utilities, styles, agent skills, documentation, and tooling while you preserve your personal content in `src/content/`

---

## 2. Step 1: Clone Ephemeral Template & Check Tags

Clone the template repository into `/tmp` and identify the latest release tag:

```bash
# Clone bare template repository to /tmp (downloads refs/objects only, fast & lightweight)
git clone --bare https://github.com/arghyadipchak/academicpages-astro.git /tmp/academicpages-template

# Inspect latest release tag
cd /tmp/academicpages-template
LATEST_TAG=$(git tag --sort=-v:refname | head -n 1)
echo "Latest template release: $LATEST_TAG"
```

---

## 3. Step 2: Generate Whole-Codebase Patch

Read your current version from `package.json` (e.g. `"version": "0.2.0"` $\rightarrow$ `v0.2.0`), then generate a patch file in your personal repository:

```bash
# Return to your website repository directory
cd /path/to/your-website

# Generate patch across template infrastructure (excluding demo content and one-time onboarding files)
git --git-dir=/tmp/academicpages-template diff v0.2.0 "$LATEST_TAG" -- . ':!src/content' ':!public/files' ':!docs/ONBOARDING.md' ':!.agents/skills/onboarding' > template-update.patch

# Delete ephemeral template clone immediately
rm -rf /tmp/academicpages-template
```

---

## 4. Step 3: Apply Patch & Merge Changes

You can apply the generated patch using an AI coding assistant or the Git CLI:

- **Intelligent Merging (AI Assistant)**: Prompt your AI assistant to apply `template-update.patch`. The assistant analyzes semantic changes across all layers (UI engine, styles, agent skills, documentation, configs, and dependencies) while preserving your custom content and profile identity
- **CLI 3-Way Apply**: Apply directly in your terminal (`--reject` skips any files you intentionally deleted during onboarding, such as `tests/` or governance files):

  ```bash
  git apply --3way --ignore-whitespace --reject template-update.patch
  rm template-update.patch
  ```

> 💡 **Tip**: When updating dependencies in `package.json`, keep any custom packages you added while accepting upstream version upgrades

---

## 5. Step 4: Bump Version & Verify

1. In `package.json`, update `"version"` to match the new template release (e.g. `"version": "0.3.0"`)
2. Run the verification pipeline to ensure zero type errors or regressions:

   ```bash
   # Install any new or updated dependencies
   pnpm install

   # Run code quality verification
   pnpm verify

   # Build static production site
   pnpm build
   ```

3. Commit the upgrade:

   ```bash
   git commit -am "chore(template): sync updates from upstream $LATEST_TAG"
   ```
