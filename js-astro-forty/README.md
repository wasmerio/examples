<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Forty](https://github.com/DarekRepos/forty-astro-theme) Astro theme by DarekRepos, copied from commit `997c61ec8059494a98baf5c7718032ad6361ce0e` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-forty.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [DarekRepos](https://github.com/DarekRepos), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Forty Theme 🚀

A modern, high-performance port of the classic **Forty** template by [HTML5 UP](https://html5up.net), rebuilt from the ground up using **Astro 5.0**, **Dart Sass**, and **Astro Icon**.



## ✨ Key Features

* **Astro 5.0 Framework**: Ultra-fast performance with zero-JavaScript by default.
* **Content Collections**: Manage your portfolio and blog posts easily using Markdown (`.md`).
* **Modern SCSS**: Rebuilt styling logic using `@use` modules and CSS Grid for better maintainability.
* **Astro Icon**: High-performance SVG icon system (integrated with Iconify).
* **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.
* **Type Safe**: Built with TypeScript for a better developer experience.

## 🛠️ Tech Stack

* **Framework:** [Astro](https://astro.build/)
* **Styling:** [Sass (SCSS)](https://sass-lang.com/)
* **Icons:** [Astro Icon](https://github.com/natemoo-re/astro-icon)
* **Content:** Markdown / Content Collections

## 🚀 Getting Started

### 1. Use as Template
Click the green **"Use this template"** button at the top of this repository to create your own copy.

### 2. Install Dependencies
Clone your new repository and run:
```bash
npm install
```
### 3. Start Developing
```bash
npm run dev
```
Open http://localhost:4321 in your browser to see the magic.
## ⚙️ Configuration

No coding required! To change the site name, contact info, or social links:
1. Open `src/content/config/site.md`.
2. Update the values in the top section (the YAML frontmatter).
3. Save, and the site updates automatically.

## 📝 Adding Content (Tiles)

Your homepage tiles are driven by Markdown files:
1. Go to `src/content/posts/`.
2. Create a new file (e.g., `my-project.md`).
3. Fill in the title and image path in the frontmatter:
   ```markdown
   ---
   title: "Blueberry Project"
   description: "A fresh look at design"
   image: "/src/assets/pic01.jpg"
   ---
   Your post content goes here!