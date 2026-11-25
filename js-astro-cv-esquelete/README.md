<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Esquelete CV](https://github.com/mmouzo/astro-cv-esquelete) Astro theme by mmouzo, copied from commit `b62ae28c8c4ca670dceb7a124080931242342f23` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-cv-esquelete.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and runs the `@astrojs/node` standalone server on Wasmer Edge.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: vercel.json.
  - Replaced the @astrojs/vercel adapter with @astrojs/node 9.5.3 in standalone mode, because some pages render on the server. Added @astrojs/node to package.json and the lockfile.
- **Environment variables:** None.
- **Credit:** theme by [mmouzo](https://github.com/mmouzo), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro-CV-Esquelete

Astro-CV-Esquelete is a free, easy-to-use CV template with a clean design. Just fill in your details and you're ready to go!

## Project Structure

     ┣ 📂public
     ┃ ┣ 📜cv-20240219.pdf
     ┃ ┣ 📜favicon.webp
     ┃ ┣ 📜gl_flag_128x.png
     ┃ ┣ 📜profile.webp
     ┃ ┣ 📜snap-md.png
     ┃ ┣ 📜snap_laptop.webp
     ┃ ┗ 📜snap_mobile.webp
     ┣ 📂src
     ┃ ┣ 📂components
     ┃ ┃ ┣ 📜Card.astro
     ┃ ┃ ┣ 📜ContactCard.astro
     ┃ ┃ ┣ 📜Container.astro
     ┃ ┃ ┣ 📜Footer.astro
     ┃ ┃ ┗ 📜Header.astro
     ┃ ┣ 📂layouts
     ┃ ┃ ┣ 📜AccordionLayout.astro
     ┃ ┃ ┗ 📜BaseLayout.astro
     ┃ ┣ 📂pages
     ┃ ┃ ┣ 📂about
     ┃ ┃ ┃ ┗ 📜about.md
     ┃ ┃ ┣ 📂blogs
     ┃ ┃ ┃ ┗ 📜home-mmouzo.md
     ┃ ┃ ┣ 📂certificates
     ┃ ┃ ┃ ┗ 📜backend2022.md
     ┃ ┃ ┣ 📂contact
     ┃ ┃ ┃ ┣ 📜email.md
     ┃ ┃ ┃ ┣ 📜github.md
     ┃ ┃ ┃ ┣ 📜linkedin.md
     ┃ ┃ ┃ ┗ 📜telegram.md
     ┃ ┃ ┣ 📂projects
     ┃ ┃ ┃ ┗ 📜spotfilm.md
     ┃ ┃ ┣ 📂studies
     ┃ ┃ ┃ ┣ 📜dam.md
     ┃ ┃ ┃ ┗ 📜smr.md
     ┃ ┃ ┣ 📂works
     ┃ ┃ ┃ ┣ 📜work1.md
     ┃ ┃ ┃ ┗ 📜work2.md
     ┃ ┃ ┗ 📜index.astro
     ┃ ┗ 📜env.d.ts
     ┣ 📜.gitattributes
     ┣ 📜.gitignore
     ┣ 📜LICENSE
     ┣ 📜README.md
     ┣ 📜astro.config.mjs
     ┣ 📜package-lock.json
     ┣ 📜package.json
     ┣ 📜tailwind.config.mjs
     ┗ 📜tsconfig.json

## Installation

#### Commands

All commands are run from the root of the project, from a terminal:

| Command         | Action                                      |
| :-------------- | :------------------------------------------ |
| `npm install`   | Installs dependencies                       |
| `npm run dev`   | Starts local dev server at `localhost:4321` |
| `npm run build` | Build your production site to `./dist/`     |

## Tech Stack

**JAVASCRIPT FRAMEWORKS**

- [Astro](https://astro.build/ "Astro")

**UI FRAMEWORKS**

- [TailwindCSS](https://tailwindcss.com/ "TailwindCSS")
- [daisyUI](https://daisyui.com/ "daisyUI")

## Use and editing of content

All content is in Markdown files classified in directories in `/src/pages`

![alt text](https://github.com/mmouzo/astro-cv-esquelete/blob/main/public/snap-md.png?raw=true)

To edit the content simply add, delete or modify the .md files.

### Adding or Removing a field

**Add a new field:**

Go to `Container.astro` in` src/components/`.

To add a new field, add a new `<AccordionLayout />` component with the appropriate properties and the corresponding child component.

**Remove an existing field:**

To remove an existing field, simply comment out the `<AccordionLayout />` component of that particular field or delete it.

![alt text](https://github.com/mmouzo/astro-cv-esquelete/blob/main/public/snap-items.png?raw=true)

## Demo

[astro-cv-esquelete](https://astro-cv-esquelete.vercel.app/ "astro-cv-esquelete")

 ![alt text](https://github.com/mmouzo/astro-cv-esquelete/blob/main/public/snap_project.webp?raw=true)

## Acknowledgments

I want to thank [@USKhokhar](https://github.com/USKhokhar "@USKhokhar") who did [Astro-Vitae](https://github.com/USKhokhar/astro-vitae "Astro-Vitae") that served as the basis for this project.
