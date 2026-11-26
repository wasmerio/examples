<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Ctros](https://github.com/aglabsid/ctros) Astro theme by aglabsid, copied from commit `40d99ec4124321f0170325fece6b19173ab5046c` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-ctros.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** The theme's example env file lists `PUBLIC_GISCUS_REPOSITORY_NAME`, `PUBLIC_GISCUS_REPOSITORY_ID`, `PUBLIC_GISCUS_CATEGORY_NAME`, `PUBLIC_GISCUS_CATEGORY_ID`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [aglabsid](https://github.com/aglabsid), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Ctros

Minimal personal website template built with [Astro](https://astro.build).

## Features

- ⚡ **Fast & Lightweight** - Static site generation with Astro
- 🖼️ **Dynamic Open Graph Images** - Auto-generated OG images for social sharing
- 📝 **JSON & MDX Content** - Easy content management with JSON data and MDX for blog posts
- 💬 **Post Comments** - Integrated commenting system powered by [Giscus](https://giscus.app/)
- 🔔 **Discord Notifications** - Optional GitHub Action that announces new posts to Discord
- 📊 **Analytics** - Privacy-friendly analytics with [Umami](https://umami.is/)
- 🎨 **View Transitions** - Smooth page transitions with shared element animations
- 🌙 **Dark Theme** - Beautiful dark mode design
- 📱 **Responsive** - Mobile-first responsive layout
- 🔍 **SEO Optimized** - Meta tags and structured data support

## Tech Stack

- [Astro](https://astro.build) - Static Site Generator
- [React](https://react.dev) - UI Components
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [MDX](https://mdxjs.com) - Content authoring
- [Shiki](https://shiki.style) - Syntax highlighting
- [Giscus](https://giscus.app) - Comments
- [Umami](https://umami.is) - Analytics

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm 12.14+ (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone git@github.com:aglabsid/ctros.git
cd ctros
```

2. Install dependencies:

```bash
pnpm install
```

3. Create environment variables:

```bash
cp .env.example .env
```

4. Configure your environment variables (see [Configuration](#configuration))

5. Start the development server:

```bash
pnpm dev
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Giscus Configuration
PUBLIC_GISCUS_REPOSITORY_NAME=your-username/your-repo
PUBLIC_GISCUS_REPOSITORY_ID=your-repo-id
PUBLIC_GISCUS_CATEGORY_NAME=Announcements
PUBLIC_GISCUS_CATEGORY_ID=your-category-id
```

### Setting up Umami Analytics

[Umami](https://umami.is/) is a simple, fast, privacy-focused analytics alternative to Google Analytics.

This project uses [@yeskunall/astro-umami](https://github.com/yeskunall/astro-umami) integration.

1. **Create an Umami account**:
   - Sign up at [cloud.umami.is](https://cloud.umami.is/) (hosted) or self-host your own instance

2. **Add your website**:
   - Go to Settings → Websites → Add website
   - Enter your website name and domain

3. **Get your Website ID**:
   - Click on your website in the dashboard
   - Copy the Website ID from the tracking code

4. **Update `astro.config.mjs`**:

   ```js
   import yeskunallumami from '@yeskunall/astro-umami'

   export default defineConfig({
   	integrations: [
   		// ...other integrations
   		yeskunallumami({
   			id: 'your-website-id',
   			hostUrl: 'https://cloud.umami.is', // or your self-hosted URL
   		}),
   	],
   })
   ```

For more details, see the [Umami documentation](https://umami.is/docs).

### Setting up Giscus

[Giscus](https://giscus.app/) is a comments system powered by GitHub Discussions.

1. **Enable GitHub Discussions** on your repository:
   - Go to your repository → Settings → General
   - Scroll to "Features" section
   - Check "Discussions"

2. **Install the Giscus app**:
   - Visit [github.com/apps/giscus](https://github.com/apps/giscus)
   - Click "Install" and select your repository

3. **Get your configuration values**:
   - Go to [giscus.app](https://giscus.app/)
   - Enter your repository name
   - Choose your preferred settings
   - Copy the `data-repo-id` and `data-category-id` values

4. **Update your `.env` file** with the values from step 3

For more details, see the [Giscus documentation](https://giscus.app/).

### Setting up Discord Notifications

`.github/workflows/discord-notify.yml` posts a message to Discord whenever a new post is pushed to `main`. It is disabled by default.

1. **Create a webhook**: Discord channel → Edit Channel → Integrations → Webhooks → New Webhook, then copy the URL

2. **Add repository settings** (Settings → Secrets and variables → Actions):
   - Secret `DISCORD_WEBHOOK_URL` - the webhook URL
   - Variable `SITE_URL` - your site URL, e.g. `https://example.com`
   - Variable `DISCORD_ROLE_ID` (optional) - role to mention

3. **Enable the trigger** by uncommenting the `push` block in the workflow:

   ```yaml
   on:
     workflow_dispatch:
     push:
       branches: [main]
       paths: ['src/content/post/**/index.mdx']
   ```

## Project Structure

```
ctros/
├── public/              # Static assets
├── src/
│   ├── components/      # UI components
│   │   └── mdx/         # MDX components
│   ├── content/         # Content collections
│   │   ├── post/        # Blog posts (MDX)
│   │   └── project/     # Projects (MDX)
│   ├── data/            # JSON data files
│   ├── layouts/         # Page layouts
│   ├── lib/             # Utility functions
│   ├── pages/           # Page routes
│   └── styles/          # Global styles
├── astro.config.mjs     # Astro configuration
└── package.json
```

## Content Management

### Blog Posts

Create a new folder in `src/content/post/` with an `index.mdx` file:

```mdx
---
title: My Post Title
thumbnail: ./thumbnail.png
thumbnailCredit: Photo by Someone
summary: A brief summary of the post
tags:
  - tag1
  - tag2
author: Your Name
createdAt: 2025-01-01T10:00:00+00:00
updatedAt: 2025-01-01T10:00:00+00:00
---

Your content here...
```

### Projects

Create a new folder in `src/content/project/` with an `index.mdx` file:

```mdx
---
title: Project Name
thumbnail: ./thumbnail.png
description: Project description
category: web
github: https://github.com/...
demo: https://...
---

Project details here...
```

### Site Data

Edit the JSON files in `src/data/` to customize:

- `about.json` - Personal information (`firstName`, `lastName`, `headline`, `email`, `cv`, bio, skills, social links)
- `software.json` - Software/tools you use
- `hardware.json` - Hardware/equipment
- `project-categories.json` - Project categories

## Commands

| Command        | Description               |
| -------------- | ------------------------- |
| `pnpm dev`     | Start development server  |
| `pnpm build`   | Build for production      |
| `pnpm preview` | Preview production build  |
| `pnpm format`  | Format code with Prettier |

## License

MIT License
