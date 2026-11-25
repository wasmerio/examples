<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [AJ](https://github.com/Anmol-TheDev/potfolio2.0) Astro theme by Anmol-TheDev, copied from commit `951da23db139179053c99cd1682f65665fbd63b5` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-potfolio2-0.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and runs the `@astrojs/node` standalone server on Wasmer Edge.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: netlify.toml.
  - Removed lockfiles of other package managers: package-lock.json; kept pnpm-lock.yaml.
  - Replaced the @astrojs/vercel adapter with @astrojs/node 9.4.5 in standalone mode, because some pages render on the server. Added @astrojs/node to package.json and the lockfile.
- **Environment variables:** None.
- **Credit:** theme by [Anmol-TheDev](https://github.com/Anmol-TheDev), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Portfolio.dev

This is a personal portfolio website built with Astro, TypeScript, and Tailwind CSS. It features a unique Neovim-inspired theme and includes sections for About, Experience, Education, Skills, and Projects.

## Features

*   **Neovim-inspired theme:** A unique theme that mimics the look and feel of the Neovim editor.
*   **Multiple Sections:** Includes sections for About, Experience, Education, Skills, and Projects.
*   **Responsive Design:** The website is designed to be responsive and work on all devices.
*   **Live CV:** The portfolio data is sourced from a `cv.json` file, making it easy to update.

## Tech Stack

*   **Astro:** The web framework for building the website.
*   **TypeScript:** For type safety and improved developer experience.
*   **Tailwind CSS:** For styling the website.
*   **React:** Used for some interactive components.
*   **Vercel:** For deployment.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v22.x or later)
*   npm

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/Anmol-TheDev/potfolio2.0
    ```
2.  Install NPM packages
    ```sh
    pnpm install
    ```

### Running the Development Server

To run the development server, use the following command:

```sh
pnpm run dev
```

This will start the development server at `http://localhost:4321`.

## License

Distributed under the MIT License. See `LICENSE` for more information.
