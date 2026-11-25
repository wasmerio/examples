# Wasmer-side failures in the Astro run

## anybuild: pnpm workspace + @astrojs/node server build loses `dist` (rank 6, BroadcastChannel)

- Error: `pnpm dlx optimize-deps@0.1.2 dist --replace` → `Input does not exist: dist`.
- Cause seen in the generated Dockerfile: for a folder with `pnpm-workspace.yaml`, Anybuild runs `pnpm deploy --filter broadcast-channel --prod` into `/app` and then runs `optimize-deps dist` there, but the `pnpm deploy` output has no `dist/` (build output is not part of the deployed package files).
- Repro: `deployViaAutobuild` with repoUrl `https://github.com/wasmerio/examples`, rootDir `js-astro-broadcast-channel`, a branch holding that folder (pnpm 11.13.0 declared, `output: "server"`, `@astrojs/node` 11.1.2 standalone). The same folder builds locally with `pnpm install --frozen-lockfile && pnpm run build` and produces `dist/server/entry.mjs`.
- Build: e0257310-3d4c-473e-ae73-ae9c993d6129.
