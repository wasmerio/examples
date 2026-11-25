<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Storyteller](https://github.com/hasinhayder/storyteller-astro) Astro theme by hasinhayder, copied from commit `ee0326890dc084edb219fe45bbf01ee176fdeff3` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-storyteller.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [hasinhayder](https://github.com/hasinhayder), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Storyteller - Minimal Astro Blog Theme

<div align="center">
  <img src="https://res.cloudinary.com/roxlox/image/upload/v1749266794/storyteller/storyteller_zcihgf.png" alt="Storyteller Monochrome Blog Theme Preview" />
  
  <p align="center">
    <strong>A beautiful, minimal, and highly functional blog theme built with Astro</strong>
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/Astro-5.9.0-FF5D01?style=flat-square&logo=astro" alt="Astro" />
    <img src="https://img.shields.io/badge/TailwindCSS-4.1.8-38B2AC?style=flat-square&logo=tailwind-css" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
  </p>
</div>

---

## ✨ Features

### 🎨 **Design Philosophy**

- **Monochrome Elegance**: Clean black and white design that puts content first
- **Minimal Aesthetic**: Less is more - every element serves a purpose
- **Typography-Focused**: Beautiful typography hierarchy for excellent readability

### 🌓 **Theme System**

- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Persistent Settings**: Theme choice saved in localStorage
- **Smooth Transitions**: Elegant animations between theme changes

### 📱 **Responsive Design**

- **Mobile-First**: Optimized for all screen sizes
- **Max-Width Design**: 1000px container for optimal reading experience
- **Touch-Friendly**: Perfect interaction on mobile devices

### 📝 **Content Management**

- **Astro Content Collections**: Type-safe content management with schema validation
- **Markdown Support**: Write your posts in Markdown with frontmatter
- **Rich Metadata**: Support for categories, tags, publication dates, and featured posts

### 🗂️ **Organization Features**

- **Categories System**: Organize posts by categories with dedicated pages
- **Tags System**: Flexible tagging with tag-specific pages
- **Featured Posts**: Highlight your best content on the homepage
- **Multi-Author Support**: Full multi-author blog support with author pages and filtering

### 📄 **Advanced Pagination**

- **Smart Pagination**: Navigate through posts with numbered pagination
- **SEO-Friendly URLs**: Clean URLs for all paginated pages
- **Page Info**: Clear indication of current page and total posts
- **Responsive Controls**: Touch-friendly pagination on mobile

### 🖼️ **Image Support**

- **Thumbnail Images**: Featured post thumbnails for visual appeal
- **Large Images**: Full-size images for detailed article views
- **Lazy Loading**: Optimized image loading for better performance
- **Responsive Images**: Adaptive image sizing for different screens

### 🚀 **Performance**

- **Static Generation**: Lightning-fast loading with pre-built pages
- **Minimal Dependencies**: Clean codebase with essential dependencies only
- **Optimized Assets**: Compressed and optimized for web delivery
- **SEO Ready**: Meta tags and OpenGraph support

### 👥 **Multi-Author Support**

- **Author Pages**: Dedicated pages for each author with their post listings
- **Author Navigation**: Browse all authors with post counts on `/authors`
- **Clickable Author Links**: Author names link to their individual pages
- **Flexible Attribution**: Easy author assignment via frontmatter
- **Multiple Authors**: Support for any number of blog contributors

### 🔗 **Rich Embeds**

- **Rich Embeds** — Easily embed YouTube, Vimeo, Wistia, Google Maps, PDFs, Gists, Asciinema, SoundCloud, and more using simple markdown shortcodes

---

## 🎯 Demo

<div align="center">
  <img src="https://res.cloudinary.com/roxlox/image/upload/v1749266607/storyteller/storyteller-light_a5xcvw.jpg" alt="Homepage - Light" />
  <img src="https://res.cloudinary.com/roxlox/image/upload/v1749266607/storyteller/storyteller-dark_cqkugu.jpg" alt="Homepage - Dark" />
</div>

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/hasinhayder/storyteller-astro.git
cd storyteller-astro

# Install dependencies
bun install
# or
npm install
# or
pnpm install

# Start development server
bun dev
# or
npm run dev
# or
pnpm dev
```

Your blog will be available at `http://localhost:4321`

---

## 📁 Project Structure

```
📦 Storyteller/
├── 📁 public/
│   ├── 🖼️ images/           # Static images
│   ├── 📄 favicon.svg       # Site favicon
│   └── 📜 scripts/          # Client-side scripts
├── 📁 src/
│   ├── 📁 components/       # Reusable Astro components
│   │   ├── 🧩 Header.astro        # Navigation & theme toggle
│   │   ├── 🧩 PostCard.astro      # Blog post preview
│   │   ├── 🧩 FeaturedCard.astro  # Featured post card
│   │   └── 🧩 Pagination.astro    # Pagination component
│   ├── 📁 content/          # Content collections
│   │   ├── 📄 config.ts           # Content schema
│   │   └── 📁 article/            # Blog posts (Markdown)
│   ├── 📁 layouts/          # Page layouts
│   │   └── 🎨 BlogLayout.astro    # Main blog layout
│   ├── 📁 pages/            # Astro pages
│   │   ├── 🏠 index.astro         # Homepage
│   │   ├── 📁 blog/               # Paginated blog pages
│   │   ├── 📁 article/            # Individual articles
│   │   ├── 📁 author/             # Author pages
│   │   ├── 📁 category/           # Category pages
│   │   └── 📁 tag/                # Tag pages
│   └── 📁 styles/           # Global styles
└── 📄 package.json          # Dependencies & scripts
```

---

## 📝 Content Creation

### Creating a New Blog Post

Create a new `.md` file in `src/content/article/`:

```markdown
---
title: "Your Amazing Post Title"
description: "A compelling description of your post"
pubDate: 2025-01-15
author: "Your Name" # Author name (defaults to "Hasin Hayder")
category: "Technology"
tags: ["astro", "web development", "javascript"]
featured: true # Optional: mark as featured
thumb: "https://images.unsplash.com/photo-example?w=400" # Thumbnail
large: "https://images.unsplash.com/photo-example?w=1200" # Large image
---

Your amazing content goes here! Write in Markdown format.

## Subheading

You can use all standard Markdown features...
```

### Content Schema

| Field         | Type    | Required | Description                              |
| ------------- | ------- | -------- | ---------------------------------------- |
| `title`       | String  | ✅       | Post title                               |
| `description` | String  | ✅       | SEO description                          |
| `pubDate`     | Date    | ✅       | Publication date                         |
| `author`      | String  | ❌       | Author name (defaults to "Hasin Hayder") |
| `category`    | String  | ✅       | Post category                            |
| `tags`        | Array   | ✅       | Post tags                                |
| `featured`    | Boolean | ❌       | Mark as featured                         |
| `thumb`       | String  | ❌       | Thumbnail image URL                      |
| `large`       | String  | ❌       | Large image URL                          |

---

## 🎨 Customization

### Styling

The theme uses Tailwind CSS for styling. Key customization areas:

- **Colors**: Modify the monochrome palette in `src/layouts/BlogLayout.astro`
- **Typography**: Adjust font sizes and weights in Tailwind classes
- **Spacing**: Customize margins and padding throughout components

### Theme Toggle

The dark/light mode system is powered by:

- `public/scripts/theme-toggle.js` - Client-side theme logic
- CSS variables for color switching
- localStorage for persistence

### Navigation

Customize the navigation in `src/components/Header.astro`:

- Add/remove menu items
- Modify the profile section
- Adjust the theme toggle button

---

## 🛠️ Available Commands

### Bun

| Command           | Action                                       |
| ----------------- | -------------------------------------------- |
| `bun install`     | Install dependencies                         |
| `bun run dev`     | Start development server at `localhost:4321` |
| `bun run build`   | Build production site to `./dist/`           |
| `bun run preview` | Preview build locally                        |

### npm

| Command           | Action                                       |
| ----------------- | -------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Start development server at `localhost:4321` |
| `npm run build`   | Build production site to `./dist/`           |
| `npm run preview` | Preview build locally                        |

### pnpm

| Command        | Action                                       |
| -------------- | -------------------------------------------- |
| `pnpm install` | Install dependencies                         |
| `pnpm dev`     | Start development server at `localhost:4321` |
| `pnpm build`   | Build production site to `./dist/`           |
| `pnpm preview` | Preview build locally                        |

---

## 🔧 Configuration

### Site Configuration

Edit `src/site.config.mjs` for global settings:

```javascript
export default {
  // Basic Site Information
  siteTitle: "The Storyteller", // Main site title
  siteSubTitle: "Minimal musings on code, design, and life", // Subtitle/tagline
  copyright: "© 2025 The Storyteller. All Rights Reserved.", // Footer copyright text

  // Homepage Display Options
  showAuthorsOnHomePage: false, // Show author info on homepage
  showFeaturrdPostsOnHomePage: true, // Display featured posts section
  showCategoryOnPosts: true, // Display categories on posts in homepage
  numberOfLatestPostsPerPage: 6, // Number of latest posts on homepage
  numberOfBlogPostsPerPage: 8, // Number of posts per paginated blog page

  // UI Labels (Customizable Text)
  labels: {
    featuredPosts: "Featured Posts", // Featured section title
    latestPosts: "Latest Posts", // Latest posts section title
    viewAllPosts: "View All Posts", // Link text to paginated blog
    backToHome: "Back to Home", // Back navigation text
    youMightAlsoLike: "You Might Also Like", // Similar posts section title
    postedIn: "Posted in", // Category prefix text
    noArticlesFound: "No articles found.", // Empty state message
    allCategories: "All Categories", // Categories page title
    allTags: "All Tags", // Tags page title
    allAuthors: "All Authors", // Authors page title
    exploreArticlesByTags: "Explore articles organized by topics", // Tags page description
    exploreArticlesByCategories: "Explore articles organized by topics", // Categories page description
    exploreArticlesByAuthors: "Explore articles organized by authors", // Authors page description
  },

  // Pagination Configuration
  pagination: {
    showPrevNext: true, // Show Previous/Next navigation buttons
    prevText: "Previous", // Text for previous page button
    nextText: "Next", // Text for next page button
    postLabel: "posts", // Label used in pagination info (e.g., "8 posts")
  },

  // Default Author Settings
  defaultAuthorName: "Hasin Hayder", // Default author name for posts without explicit author

  // Footer Navigation
  showCategoriesLinkOnFooter: true, // Show Categories link in footer
  showTagsLinkOnFooter: true, // Show Tags link in footer
  showAuthorsLinkOnFooter: true, // Show Authors link in footer

  // Post Display Options
  showSimilarPosts: true, // Show similar posts on article pages
  showReadMoreLinkOnFeaturedPosts: true, // Show "Read More" on featured cards
  showThumbnailOnFeaturedPosts: true, // Display thumbnails on featured posts

  // Analytics
  gTag: "G-V5QHDKBFP", // Google Analytics tracking ID
}
```

#### Configuration Options

| Option                               | Type    | Default               | Description                                  |
| ------------------------------------ | ------- | --------------------- | -------------------------------------------- |
| **Basic Site Information**           |
| `siteTitle`                          | String  | "The Storyteller"     | Main site title displayed in header          |
| `siteSubTitle`                       | String  | "Minimal musings..."  | Subtitle/tagline shown under title           |
| `copyright`                          | String  | "© 2025..."           | Copyright text in footer                     |
| **Homepage Display**                 |
| `showAuthorsOnHomePage`              | Boolean | `false`               | Display author information on homepage       |
| `showFeaturrdPostsOnHomePage`        | Boolean | `true`                | Show featured posts section on homepage      |
| `showCategoryOnPosts`                | Boolean | `true`                | Display category labels on posts in homepage |
| `numberOfLatestPostsPerPage`         | Number  | `6`                   | Number of latest posts displayed on homepage |
| `numberOfBlogPostsPerPage`           | Number  | `8`                   | Number of posts per paginated blog page      |
| **UI Labels & Text**                 |
| `labels.featuredPosts`               | String  | "Featured Posts"      | Title for featured posts section             |
| `labels.latestPosts`                 | String  | "Latest Posts"        | Title for latest posts section               |
| `labels.viewAllPosts`                | String  | "View All Posts"      | Text for pagination link                     |
| `labels.backToHome`                  | String  | "Back to Home"        | Back navigation text                         |
| `labels.youMightAlsoLike`            | String  | "You Might Also Like" | Similar posts section title                  |
| `labels.postedIn`                    | String  | "Posted in"           | Category prefix text in articles             |
| `labels.noArticlesFound`             | String  | "No articles found."  | Empty state message                          |
| `labels.allCategories`               | String  | "All Categories"      | Categories page main title                   |
| `labels.allTags`                     | String  | "All Tags"            | Tags page main title                         |
| `labels.allAuthors`                  | String  | "All Authors"         | Authors page main title                      |
| `labels.exploreArticlesByTags`       | String  | "Explore articles..." | Tags page description                        |
| `labels.exploreArticlesByCategories` | String  | "Explore articles..." | Categories page description                  |
| `labels.exploreArticlesByAuthors`    | String  | "Explore articles..." | Authors page description                     |
| **Pagination Settings**              |
| `pagination.showPrevNext`            | Boolean | `true`                | Show Previous/Next navigation buttons        |
| `pagination.prevText`                | String  | "Previous"            | Text for previous page button                |
| `pagination.nextText`                | String  | "Next"                | Text for next page button                    |
| `pagination.postLabel`               | String  | "posts"               | Label used in pagination info display        |
| **Navigation & Footer**              |
| `showCategoriesLinkOnFooter`         | Boolean | `true`                | Show Categories link in footer               |
| `showTagsLinkOnFooter`               | Boolean | `true`                | Show Tags link in footer                     |
| `showAuthorsLinkOnFooter`            | Boolean | `true`                | Show Authors link in footer                  |
| **Post Display Options**             |
| `showSimilarPosts`                   | Boolean | `true`                | Display similar posts on article pages       |

| `showReadMoreLinkOnFeaturedPosts` | Boolean | `true` | Show "Read More" link on featured cards |
| `showThumbnailOnFeaturedPosts` | Boolean | `true` | Display thumbnail images on featured posts |
| **Analytics** |
| `gTag` | String | "G-V5QHDKBFP" | Google Analytics tracking ID (optional) |

### Pagination Settings

Adjust pagination in `src/pages/blog/[...page].astro`:

```javascript
return paginate(sortedPosts, {
  pageSize: 8, // Posts per page
})
```

---

## 📊 Google Analytics Setup

### Adding Google Analytics

To enable Google Analytics tracking on your blog:

1. **Get your Google Analytics Tracking ID:**

   - Go to [Google Analytics](https://analytics.google.com)
   - Create a new property for your website
   - Copy your Measurement ID (format: `G-XXXXXXXXXX`)

2. **Update Site Configuration:**

   Edit `src/site.config.mjs` and add your tracking ID:

   ```javascript
   export default {
     // ... other config options

     // Analytics
     gTag: "G-YOUR-TRACKING-ID", // Replace with your actual tracking ID
   }
   ```

3. **Verify Installation:**
   - Build and deploy your site
   - Visit your website and check the browser's Network tab
   - Look for requests to `gtag` or `googletagmanager.com`
   - Check your Google Analytics dashboard for real-time data

### Privacy Considerations

The theme implements Google Analytics with privacy in mind:

- **No Personal Data Collection**: Only anonymous usage statistics are tracked
- **Respects DNT**: Honors Do Not Track browser settings
- **GDPR Compliant**: No cookies are set without user consent
- **Minimal Tracking**: Only essential page views and navigation are tracked

### Disabling Analytics

To disable Google Analytics completely:

```javascript
export default {
  // ... other config options

  // Analytics
  gTag: "", // Set to empty string or remove the line
}
```

Or comment out the line:

```javascript
export default {
  // ... other config options
  // Analytics
  // gTag: "G-YOUR-TRACKING-ID"  // Commented out
}
```

---

## Embedding Content

You can embed rich content in your markdown using simple shortcodes:

- `#youtube <id>` — Embed a YouTube video
- `#vimeo <id>` — Embed a Vimeo video
- `#wistia <id>` — Embed a Wistia video
- `#googlemaps <query or url>` — Embed a Google Map
- `#iframe <url>` — Embed any URL in an iframe
- `#pdf <url>` — Embed a PDF
- `#embed <url>` — Embed Notion, Figma, CodePen, etc.
- `#gist <gist-id or gist-url>` — Embed a GitHub Gist
- `#asciinema <id>` — Embed an Asciinema cast
- `#soundcloud <url>` — Embed a SoundCloud track

## 📈 SEO Features

- **Meta Tags**: Automatic generation for all pages
- **OpenGraph**: Social media preview support
- **Sitemap**: Auto-generated XML sitemap
- **RSS Feed**: Built-in RSS feed generation

---

## 🚀 Deployment

### Netlify

1. Connect your GitHub repository
2. Build command: `bun build` or `npm run build` or `pnpm build`
3. Publish directory: `dist`

### Vercel

1. Import your GitHub repository
2. Framework preset: Astro
3. Deploy!

### Static Hosting

After running `bun run build`, upload the `dist/` folder to any static hosting service.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Astro](https://astro.build) 🚀
- Styled with [Tailwind CSS](https://tailwindcss.com) 💨
- Icons from [Lucide](https://lucide.dev) ✨
- Images from [Unsplash](https://unsplash.com) 📸

---

<div align="center">
<p>Made with ❤️ by <strong>Hasin Hayder</strong></p>
    <p>
        <a href="https://github.com/hasinhayder/storyteller-astro">⭐ Star this project</a> |
        <a href="https://github.com/hasinhayder/storyteller-astro/issues">🐛 Report Bug</a> |
        <a href="https://github.com/hasinhayder/storyteller-astro/issues">💡 Request Feature</a>
    </p>
</div>
