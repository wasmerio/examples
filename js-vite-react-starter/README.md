# Vite + React starter for Wasmer Edge

A React 19 single-page app built with Vite and TypeScript. Wasmer Edge serves the built files, so there is no server to run or scale.

[Deploy this template](https://wasmer.io/templates/vite-react-starter) from the Wasmer templates page.

## How it works

- `src/App.tsx` is the page you see; `src/main.tsx` mounts it.
- `npm run build` type-checks and writes the site to `dist/`.
- Wasmer detects the Vite build and serves `dist/` as a static site.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173/.

To check the production build, run `npm run build` and look in `dist/`.
