---
title: "Setting up Your Academic Portfolio"
date: "2026-04-28"
description: "A comprehensive guide on how to clone, configure, and deploy your new academic portfolio."
author: "Claude Shannon"
tags:
  - "Documentation"
  - "Setup"
  - "Astro"
  - "Portfolio"
---

# Setting up Your Academic Portfolio

Welcome to your new academic portfolio! This template is built with Astro and designed specifically for academics, researchers, and professionals who need a clean, highly performant, and customizable website to showcase their work, publications, and thoughts.

In this guide, I will walk you through everything you need to know to get your portfolio up and running—from cloning the repository to configuring your site and writing your first piece of content.

## 1. Cloning the Repository

First, you'll need to clone the repository to your local machine. You can do this using standard Git or the GitHub CLI.

**Option A: Using Git**
Open your terminal and run the following command:

```bash
git clone https://github.com/rubzip/academic-portfolio-astro.git my-portfolio
cd my-portfolio
```

**Option B: Using GitHub CLI (Recommended)**
If you want to create your own remote repository immediately using this one as a template, the GitHub CLI makes it very easy:

```bash
gh repo create my-portfolio --template="rubzip/academic-portfolio-astro" --clone
cd my-portfolio
```

Next, install the project dependencies. This project uses `npm` (ensure you have Node.js >= 22.12.0 installed):

```bash
npm install
```

Once the dependencies are installed, you can start the local development server:

```bash
npm run dev
```

Your site should now be running at `http://localhost:4321`. Any changes you make will automatically hot-reload in the browser.

## 2. Global Configuration

The core configuration for your portfolio is centralized in the `src/config/site.ts` file. This is the very first file you should edit.

```typescript
// src/config/site.ts
export const SITE: SiteConfig = {
    website: "https://your-domain.com/",
    author: "Your Name",
    desc: "Your personal academic portfolio.",
    title: "Your Name",
    ogImage: "your-image.webp",
    postPerPage: 5,
    favicon: "/favicon.svg",
    lang: "en",
};
```

Make sure to update the `website`, `author`, `desc`, `title` fields to match your personal details. 

### Analytics configuration

If you want to track page views, you can configure Google Analytics 4 or Umami analytics right in the same file:

```typescript
export const ANALYTICS: AnalyticsConfig = {
    ga4Id: "G-XXXXXXXXXX", // Add your Google Analytics 4 Measurement ID
    umami: {
        websiteId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        src: "https://cloud.umami.is/script.js", 
    }
};
```
Analytics are lazy-loaded by default, ensuring they have zero impact on your Core Web Vitals!

## 3. Theming and Aesthetics

This template is built to look stunning right out of the box. We use a centralized theming engine, configured in `src/config/site.ts` and `src/config/themes.ts`.

In `site.ts`, you can toggle whether you want dark mode enabled, and choose your preferred light and dark themes:

```typescript
export const THEME_CONFIG: ThemeConfig = {
    lightAndDark: true, // Enable the moon/sun toggle
    themeLight: "light_notepad", 
    themeDark: "dark_notepad",
};
```

You can preview all the available color palettes by visiting the built-in Developer Tools at `http://localhost:4321/dev-tools` while your local server is running! If you wish to create your own color scheme, simply add a new entry to `THEMES` in `src/config/themes.ts`.

## 4. Managing Content

Your portfolio is fully driven by Markdown (`.md`) files. This makes it extremely easy to version control your content and write freely. All of your collections are located in `src/content/`.

Here are the primary collections you'll work with:
- **`posts/`**: Your blog posts (like this one!).
- **`projects/`**: Showcase your software, hardware, or research projects.
- **`publications/`**: List your academic papers. 
- **`talks/`**: Archive your conference presentations and slides.
- **`teaching/`**: List the courses you teach or have taught.

### Disabling Pages

If you don't want to use all the content collections provided by default, you can disable them in `src/config/pages.ts`.

For example, if you don't want to use the `talks` collection, you can set the following in `src/config/pages.ts`:

```typescript
export const PAGES: PagesConfig = {
    // Default configuration for pages, you can override any property of the objects
    talks: {
        title: "Talks & Presentations", // Title for the page
        subtitle: "Public lectures, colloquia, and conference presentations.", // Subtitle for the page
        isActive: false, // Enable the talks collection
    },
    ...
};
```
This configuration will disable the talks page in the navigation bar and the content collection.

### Writing a new post

To create a new post, just add a new `.md` file inside the `src/content/posts` directory. You have a md example for every collection on `src/example_contents/`. Here's what the frontmatter should look like and the possible values for each field:

```yaml
---
title: "My New Research Idea"
date: "2026-05-01"
description: "A brief exploration of a novel concept."
author: "Your Name"
tags:
  - "Research"
  - "Theory"
---
```

You can even use $\LaTeX$ math equations inside your markdown files out-of-the-box, powered by KaTeX!

$$ E = mc^2 $$

## 5. Navigation and Social Links

If you want to add or remove links in the navigation bar, or update your social media icons in the left sidebar, head over to:

- `src/config/navigation.ts`: Controls the top navigation bar.
- `src/config/social.ts`: Controls the icons in your left profile sidebar.

## 6. Building and Deploying

Once you're happy with your content and configuration, you can build the site for production:

```bash
npm run build
```

This will generate a highly optimized set of static HTML files in the `dist/` directory. You can host this directory on GitHub Pages, Vercel, Netlify, or any other static hosting provider of your choice.

---

That's it! You are now ready to start publishing your academic journey to the world.
