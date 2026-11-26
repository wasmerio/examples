<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [AstroRise](https://github.com/dyskinmel/astro-rise-open) Astro theme by dyskinmel, copied from commit `18ea388b517b90110a4ade0fdd4dab6c0655bd0f` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-rise-open.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Resized 1 image over 300 KB to at most 1600 px wide, keeping file names and formats.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [dyskinmel](https://github.com/dyskinmel), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# AstroRise

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

# 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm run dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm run build`           | Build your production site to `./dist/`          |
| `pnpm run preview`         | Preview your build locally, before deploying     |
| `pnpm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm run astro -- --help` | Get help using the Astro CLI                     |

# How to use this template

## 🚀 Quick Start Guide

### 🔧 Minimum Setup

Before running your site, update a couple of key configuration files:

1. **Update your site URL**  
   Open `astro.config.mjs` and set the correct site URL:

   ```js
   site: 'https://<your-domain.com>',
   ```

2. **Update sitemap reference**  
   Open `public/robots.txt` and update the sitemap line to point to your domain:

   ```txt
   Sitemap: https://<your-domain.com>/sitemap-index.xml
   ```

### 🛠 Build and Run Your Site

From the root directory of your project, run the following commands in your terminal:

```bash
pnpm install       # Install all dependencies
pnpm build         # Build your site (necessary for search functionality on the blog page)
pnpm dev           # Start the development server at http://localhost:4321
```

## 📄 How to Add a New Page

To add a new page to the site, follow these steps:

1. **Create a new folder** under the `src/pages/[lang]/` directory with the desired page name.  
   - Example:  
     ```text
     src/pages/[lang]/new_folder/
     ```

2. **Inside the newly created folder, create an `index.astro` file** and follow these steps to structure the page:

    2-1.  Import necessary UI components

      Import the required UI components from the `src/components/` directory. 
      These components help structure the page and ensure consistency across the site.

      ```astro
      import BaseLayout from "../../layouts/BaseLayout.astro";
      import Hero from "../../components/Hero/index.astro";
      ```

    2-2. Import translation data

      Each page should support multiple languages. Import the necessary translation utilities.

      ```astro
      import { loadpageContent, LANG_LIST, DEFAULT_LANG } from "../../i18n/utils";
      ```

    2-3. Load translation data

      Define a script block to determine the current language and load the corresponding translations.

      ```astro
      const locale = Astro.params.lang || DEFAULT_LANG;
      let pageContent = {};
      try {
      pageContent = await loadpageContent(locale, "new_folder");
      } catch (error) {
      console.error("Translation loading failed:", error);
      }
      ```

    2-4. Define `getStaticPaths()`

      This ensures the page is generated for each supported language.

      ```astro
      export async function getStaticPaths() {
      return LANG_LIST.map((lang) => ({ params: { lang } }));
      }
      ```

    2-5. Structure the page with `<BaseLayout>`

      All content should be wrapped inside `<BaseLayout>`, and the necessary UI components should be placed within it.

      ```astro
      <BaseLayout pageContent={pageContent}>
          <Hero pageContent={pageContent.page.hero} />
          <!-- Add other components here -->
      </BaseLayout>
      ```

3. **Define translation data** for the new page:
   - Create a corresponding translation file at:  
     ```text
     i18n/[lang]/new_folder.ts
     ```
   - Write the required text data in **JSON format**.
   - ⚠️ **Important:** The required translation format is documented as comments in each component’s `index.astro` file, so refer to them as needed.

4. **Run the following command to ensure the site functions correctly:**

   ```bash
   pnpm build
   ```

## 🧩 How to Add a New Component

### Adding a New Variant to an Existing Component

If you want to add a new type to an existing component, follow these steps:

1. **Create a new `.astro` file** inside the corresponding component folder. 

   Example:
   ```text
   src/components/sections/hero/NewHero.astro
   ```

2. **Update the `index.astro` file** in the same folder to include the new component:
   ```astro
   import SimpleHero from "./SimpleHero.astro";
   import SplitHero from "./SplitHero.astro";
   import NewHero from "./NewHero.astro"; // Add the new component

   const components = {
     simple: SimpleHero,
     split: SplitHero,
     new: NewHero, // Register the new component
   };
   ```

3. **Use the new component in a page** by specifying the `type` key:
   ```astro
   <BaseLayout pageContent={pageContent}>
     <Hero pageContent={pageContent.page.hero} type="new" />
   </BaseLayout>
   ```

### Creating a Completely New Component

If you need to create an entirely new component, you can either:

- **Create a new `.astro` file** inside the `src/components/` directory.  
  Example:
  ```text
  src/components/sections/NewComponent.astro
  ```

- **Or create a new folder** to enhance modularity and flexibility:
  ```text
  src/components/sections/NewComponent/index.astro
  ```
  This approach allows adding additional supporting files within the same directory.

Once created, import and use the component in the necessary page.

## 🎨 Styling Guide

This project uses **Tailwind CSS v4** for styling.

### Customizing Colors

The color palette is defined in the `/src/styles/global.css` file. You can update the color scheme by modifying the relevant section in `global.css` to match your desired palette.

Since this project adopts Shadcn's color configuration, you can easily change the theme by applying your favorite theme—created using a Shadcn-compatible theme generator —such as, teakcn- to the `@layer base` in `global.css`.

### Component-level Styling

If further customization is required, you can modify styles directly within the corresponding component files inside the `src/components/` directory.

By following these guidelines, you can efficiently manage and customize the styles of your Astro project.

