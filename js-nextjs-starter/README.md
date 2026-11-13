# Next.js starter for Wasmer Edge

A Next.js 16 App Router project exported to static HTML (`output: "export"`). Pages, layouts and client components work as usual; Wasmer Edge serves the exported files.

[Deploy this template](https://wasmer.io/templates/nextjs-starter) from the Wasmer templates page.

## How it works

- `app/page.tsx` and `app/about/page.tsx` are the two routes; `app/counter.tsx` is a client component.
- `next.config.ts` sets `output: "export"`, so `npm run build` writes the site to `out/`.
- Wasmer detects the export and serves `out/` as a static site.

Need server rendering, API routes or middleware? Start from the [Next.js server components template](https://wasmer.io/templates/next-react-server-components) instead.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000/.

To check the production build, run `npm run build` and look in `out/`.
