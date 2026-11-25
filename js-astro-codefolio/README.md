<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Codefolio](https://github.com/danielunited/codefolio) Astro theme by danielunited, copied from commit `a0a87dc92fae7017f52fb9444d11cdbf5de5c69d` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-codefolio.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with yarn, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [danielunited](https://github.com/danielunited), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Codefolio
An open-source portfolio for developers to showcase their projects, coding skills, and personal story.

## Quick Start

```bash
npm create astro@latest -- --template danielunited/codefolio

# Follow the interactive prompts to create your project

cd <your-project-name>
npm run dev     # Starts the local development server at http://localhost:4321
```

## Deployment
The current branch can be fully static built and deployed on any static hosting platform.

For deployment methods on various platforms, refer to the [Astro Official Deployment Guide](https://docs.astro.build/en/guides/deploy/).

## License
This project is licensed under the MIT License. See the LICENSE file for more details.


