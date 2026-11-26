---
title: "Getting Started"
description: "Create a new Vite project and run the dev server."
order: 1
---

Scaffold a new project with your preferred framework:

```bash
npm create vite@latest
```

Then install dependencies and start the dev server:

```bash
cd your-project
npm install
npm run dev
```

Vite serves the app over native ES modules, so edits appear instantly without a
full reload of unchanged modules.

Build for production with:

```bash
npm run build
```

The output goes to `dist/`, ready to deploy as static files.
