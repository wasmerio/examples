# Agent guidelines

- This starter is a work in progress, not production-ready.
- Use Node 24 and pnpm.
- Rigel configuration: `astro.config.mjs`; schema: `src/content/schema.ts`; content: `src/content/`; site: `src/pages/`, `src/components/`, and `src/layouts/`.
- Read related code and tests first. Keep changes small and preserve unrelated work, content, and media uploads.
- Reuse existing components and styles. Do not add dependencies without approval or edit installed packages in `node_modules/`.
- Preserve explicit Save, unsaved-change guards, input validation, and production draft exclusion.
- Run `pnpm test`, `pnpm typecheck`, and `pnpm build` for code changes. Browser tests require a local dev server; run `pnpm test:browser` separately. Report failed or skipped checks.
- Keep temporary files in gitignored `_temp/`. Never include credentials or private notes.
- For agent-assisted work, commit only when the user explicitly says `yolo`. Push, publish, deploy, and history changes require separate explicit approval.
