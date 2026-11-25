<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Nagare](https://github.com/angine04/nagare) Astro theme by angine04, copied from commit `67e182e6e7efcbed9d60e27cbcd55955ddb2d8bf` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-nagare.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with bun, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Resized 1 image over 300 KB to at most 1600 px wide, keeping file names and formats.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [angine04](https://github.com/angine04), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->



# Nagare - Personal Portfolio Website

<p align="center">
  <img src="https://github.com/angine04/nagare/blob/main/public/images/projects/nagare.png?raw=true" alt="Nagare Project Screenshot" width="600"/>
</p>

A modern personal portfolio website built with the [Astro](https://astro.build/) framework. It offers a clean, responsive interface to showcase your projects, experience, and contact information.

_A portfolio website template, featuring simplicity, beauty and clarity._

**Live Demo:** [nagare.angine.tech](https://nagare.angine.tech)

## Note

We're currently working on **refactoring** this template for better performance and ease of use.

## Features

- Responsive Design
- Project Showcase Page
- Timeline/Resume Page
- Contact Information Page
- Resume Page

## Dependencies

- [Astro](https://astro.build/) - Static Site Generator
- [GSAP](https://greensock.com/gsap/) - Animation Library
- [Astro Icon](https://github.com/natemoo-re/astro-icon) - Icon Component

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or bun

### Installation

1.  Clone this repository:

    ```bash
    git clone https://github.com/angine04/nagare.git
    cd nagare
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or using bun
    bun install
    ```

### Development

Start the development server:

```bash
npm run dev
# or using bun
bun run dev
```

Visit `http://localhost:4321` to see the website.

### Build

Build for production:

```bash
npm run build
# or using bun
bun run build
```

Preview the build:

```bash
npm run preview
# or using bun
bun run preview
```

## Customization

You can customize the website by editing the following:

- `src/components/` - Component directory
- `src/pages/` - Page content
- `src/styles/` - Style files
- `src/data/` - Data files

## License

This project is licensed under the MIT license specified in the [LICENSE](LICENSE) file.
