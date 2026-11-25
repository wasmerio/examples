# What is BlogGPT?

**BlogGPT** is a static blog theme built with [Astro](https://astro.build/) and modeled after ChatGPT's clean, distraction-free interface. It pairs a collapsible, resizable sidebar with a focused reading pane—making it a great fit for technical blogs, personal essays, and multi-language notes.

All content lives in plain Markdown or MDX files inside your repository, with no database or external CMS required.

## Documentation Map

Use this table to jump straight to what you need:

| What you want to do                                 | Where to look                                              |
| --------------------------------------------------- | ---------------------------------------------------------- |
| Set up a new blog locally                           | [Install and Preview](./getting-started.md)                |
| Set your blog title, domain, and color theme        | [Site and Appearance](../config/site.md)                   |
| Understand post metadata fields                     | [Frontmatter Reference](../content/frontmatter.md)         |
| Scaffold new posts from the command line            | [Archetype Templates](../content/archetypes.md)            |
| Publish in multiple languages                       | [Languages and Translations](../content/languages.md)      |
| Keep images and attachments next to a post          | [Bundles and Attachments](../content/bundles.md)           |
| Customize the sidebar, author card, and blogroll    | [Navigation, Author, and Friends](../config/navigation.md) |
| Add categories, tags, or standalone pages           | [Categories, Tags, and Pages](../content/taxonomy.md)      |
| Configure math, diagrams, callouts, and OG cards    | [Article Enhancements](../config/enhancements.md)          |
| Adjust reading stats, share buttons, and pagination | [Reading UI, Sharing, and Stats](../config/reading.md)     |
| Inject custom CSS, scripts, or `<head>` tags        | [Custom Hooks and Extensions](../customization/hooks.md)   |
| Deploy to Vercel, Netlify, or GitHub Pages          | [Build and Deploy](./deployment.md)                        |
| Move posts over from Hugo, Hexo, or Jekyll          | [Migrate an Existing Blog](./migration.md)                 |
| Look up every option in `blog.config.ts`            | [Configuration Reference](../config/reference.md)          |

## Project Structure

When you create a blog from the [BlogGPT Starter Template](https://github.com/Raincarnator/astro-theme-BlogGPT-starter), you will mainly work with these files and folders:

```text
.
├── blog.config.ts       # Main site, theme, navigation, and feature settings
├── friends.config.ts    # Blogroll / friends link groups
├── content/             # All Markdown and MDX content
│   ├── posts/           # Blog posts
│   ├── pages/           # Standalone pages (e.g., About)
│   ├── categories/      # Category definitions
│   └── tags/            # Tag definitions
├── archetypes/          # Templates used by `pnpm new`
├── custom/              # Custom <head> tags, CSS overrides, and client hooks
└── public/              # Static files served at the site root (favicons, global assets)
```

## Live Demo

Want to see how BlogGPT looks and feels in action? Check out the [Live Demo](https://demo.bloggpt.reincarnatey.net).
