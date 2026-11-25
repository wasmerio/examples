---
title: "Getting Started with Minrock"
description: "A quickstart guide to spinning up your blog, writing in Obsidian out of the box, and publishing in minutes."
pubDate: 2026-09-15
tags: ["minrock", "astro", "quickstart", "obsidian"]
draft: false
---

Welcome to **Minrock**! This theme was engineered from the ground up for technical writers, software architects, and developers who seek maximum clarity, performance, and typographic fidelity without framework bloat.

Whether you are an experienced developer or a non-technical writer, Minrock makes desktop writing and static publishing completely effortless.

---

## The 3-Step Quickstart (Plug & Play)

Minrock follows a **batteries-included** philosophy: everything you need to run the site and write notes is already pre-configured.

### Step 1: Spin Up the Dev Server

Clone the repository and start the local development server:

```bash
# 1. Clone your Minrock blog
git clone https://github.com/rnt-rez/minrock.git
cd minrock

# 2. Install dependencies & start dev server
npm install
npm run dev
```

Open your browser at `http://localhost:4321`. Your blog is now running locally with instant hot reloading!

---

### Step 2: Open Your Obsidian Vault (Zero Setup Required)

Minrock comes with a **pre-configured Obsidian vault** located right inside `src/content/`. You do not need to run complex wizards or configure schemas manually:

1. Launch [Obsidian](https://obsidian.md).
2. Click **"Open folder as vault"** (or **"Open"**).
3. Select the **`src/content`** folder inside your Minrock project.
4. Trust the author and enable community plugins when prompted.

**That's it!** The vault opens with Vault CMS and the Blog collection already calibrated.

* **Create a Post:** Press `Ctrl / Cmd + N` (or click **+ New** in the Blog view).
* **Paste Images:** Copy any screenshot to your clipboard and paste it (`Ctrl + V`) directly inside your note. The image is automatically saved right beside your article in `src/content/blog/<slug>/`.
* **Instant Preview:** Save your note, and the local dev server updates `http://localhost:4321` instantly.

---

### Step 3: Publish to the Web (1-Click Automagic via Obsidian)

Whenever you save a post in Obsidian, Minrock lets you publish directly to the web without touching a terminal and without typing commit messages:

1. **The 1-Click Button**: In Obsidian's bottom status bar, simply click the **Git Push / Up Arrow (`↑`)** icon (or press `Ctrl / Cmd + P` and select `Git: Push`).
2. **Automagic Commit**: Obsidian automatically drafts the commit message (e.g. `Blog update 9/16/2026: 2 file(s) changed.`) and pushes the changes straight to your GitHub repository.
3. **Continuous Deployment**: Your connected hosting provider (**Vercel**, **Cloudflare Pages**, or **Netlify**) detects the push and publishes your new article worldwide in seconds.

*(Prefer the terminal? Run `git add . && git commit -m "feat: my post" && git push origin main` as usual).*

* **Build Command:** `npm run build`
* **Output Directory:** `dist`

---

## Keeping Plugins Up to Date

Because Minrock bundles the Obsidian configuration in `src/content/.obsidian/`, you might wonder: *“Will these plugins become outdated over time?”*

Updating them is effortless and happens directly inside Obsidian with 1 click:

1. In Obsidian, open **Settings** (`Ctrl + ,` or `Cmd + ,`).
2. Go to **Community plugins**.
3. Click **"Check for updates"** and then **"Update all"**.

Obsidian updates all plugins to their latest releases while preserving your Minrock mapping settings.

---

## Exploring the 4 Calibrated Themes

Minrock includes four hand-tuned color palettes accessible from the switcher in the header:

1. **Clean White:** Crisp editorial aesthetic designed for daytime writing.
2. **Warm Paper (Cream):** Soft, low-contrast background inspired by classic books.
3. **Slate Navy:** Deep navy tones tailored for developers used to modern CLI and IDE interfaces.
4. **Midnight OLED:** True black (`#000000`) optimized for OLED displays with subtle neon highlights.

Try switching themes using the buttons in the top navigation bar to see the typography instantly adapt.

---

## Deep Dive: Want to Learn the Under-the-Hood Architecture?

If you want to understand how Vault CMS maps Astro content collections, learn how to configure the wizard from scratch, or watch the video walkthrough:

👉 **[Read the Full Technical Guide: Connecting Your Obsidian Vault to Minrock →](/blog/obsidian-vault-guide)**
