<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Astro Resume Minimal Template](https://github.com/kanadgupta/astro-resume-minimal-template) Astro theme by kanadgupta, copied from commit `85df9e78ee4688c6203a0ac4ccf3c4778f2cfccc` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-resume-minimal.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [kanadgupta](https://github.com/kanadgupta), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Resume Minimal Template

A minimal print-friendly resume template with GitHub Markdown-inspired styling. Built with [Astro](https://astro.build/) and styled primarily with [`github-markdown-css`](https://github.com/sindresorhus/github-markdown-css) and [GitHub Octicons](https://primer.style/octicons/).

> [!IMPORTANT]
> **Disclaimer:** The example resume shipped with this template is placeholder content built around a fictional character. This project is not affiliated with, endorsed by, or sponsored by the series or any of its respective rights holders, and the character's name is used here only to illustrate how the template renders. All employers, schools, dates, accomplishments, contact details, and links in the example are invented, and every placeholder URL and email address points at `example.com`. Replace all of it with your own information before publishing your resume.

## Getting Started

1. Check out the [Astro docs](https://docs.astro.build/en/install-and-setup/#prerequisites) for prerequisites (e.g., Node.js requirements)

2. Edit the content in the `src/content` directory. The Zod schemas in `src/content.config.ts` describe the frontmatter for the Markdown files in `src/content/projects` and `src/content/work`.

> [!NOTE]
> The `src/content/projects` directory corresponds to the "Selected Projects" section of your resume. When Astro scans for Markdown files in this directory, the files are sorted by file name prior to rendering.
>
> The `src/content/work` directory corresponds to the "Experience" section of your resume. When Astro scans for Markdown files in this directory, the files are sorted by the `period` field in the frontmatter prior to rendering. The file name has **no** impact on how these files are rendered in the final output.

3. Install the dependencies and run the development server to preview your content:

```sh
npm install
npm run dev
```

4. That's it! All of the main markup and styling is in `src/pages/index.astro` — feel free to tweak it as you see fit.

## Generating a PDF Export

To generate a PDF export of your resume:

1. (Optional, but recommended) Commit any changes so your branch is clean. The current commit SHA will be appended to the file name (e.g., `pdf-exports/resume-2026-07-06-3d5e64f.pdf`), so this is a good way to ensure that the file name corresponds to your actual changes.

2. Serve the website at `localhost:4321` (either via the dev or build preview server)

3. Run the following command:

```
npm run build:pdf
```

A new PDF will be created in the `pdf-exports` directory.

## Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:4321`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally, before deploying |
| `npm run check`   | Check for formatting/type/etc. errors        |

## License

[MIT](LICENSE)
