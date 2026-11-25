<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [AgenceX](https://github.com/Johnkat-Mj/agencex-astro) Astro theme by Johnkat-Mj, copied from commit `2727b8790ea6fcbae9e179174c0438c7e1723517` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-agencex.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [Johnkat-Mj](https://github.com/Johnkat-Mj), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

<h1>AgenceX Landing page</h1>

A simple landing page for a digital agency

![AgenceX light Theme](./screens/demoLight.webp)
![AgenceX Dark Theme](./screens/demoDark.webp)


## Tools
- TailwindCSS v4
- AstroJs v5


## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── public/
│   ├── images/
│   ├── logos/*
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── blocks/*
│   │   ├── cards/*
│   │   ├── elements/*
│   │   ├── sections/*
│   │   ├── shared/*
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
│   └── styles/
│       └── global.css
└── package.json
```


## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:4321`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |


