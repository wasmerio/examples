<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Spaceship](https://github.com/aitorllj93/astro-theme-spaceship) Astro theme by aitorllj93, copied from commit `8faa728c12632ccf982dcdd5d9a2b5cebd64a1da` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-spaceship.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [aitorllj93](https://github.com/aitorllj93), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# 🌌 Spaceship

**Astro Spaceship** is a powerful, minimal, and flexible theme designed for turning your Obsidian vault into a beautiful, static website using Astro and TailwindCSS. Whether you're sharing your digital garden, notes, or a Zettelkasten, this theme helps bring your knowledge to the web with elegance and ease.

---

## ✨ Features

- 🔗 **Obsidian Link and Image Resolution**  
  Seamlessly supports `[[wiki-links]]` and embeds like `![[image.png]]`, just like in Obsidian. No need to manually convert links or media.

- 📝 **Frontmatter Metadata for Publishing**  
  Control visibility, titles, descriptions, tags, and more with simple frontmatter options. Choose what gets published and how it appears.

- 🌲 **Tree Navigation Bar**  
  Navigate your notes with a collapsible file tree that mirrors your vault structure. Makes exploring content intuitive and fast.

- 🗂 **Table of Contents (ToC)**  
  Auto-generated ToC for every page, based on headings in your notes. Helps readers easily jump to sections.

- 🔁 **Links and Backlinks**  
  Display outgoing links and backlinks at the bottom of each note, making your web of notes as interconnected as your vault.

- 🔌 **Plugins**
  - [Banners/Covers](https://github.com/jparkerweb/pixel-banner)
  - [Spoilers](https://github.com/jacobtread/obsidian-spoilers)
  - [Timeline](https://github.com/George-debug/obsidian-timeline)
  - [Sorting](https://github.com/shu307/obsidian-nav-weight)

---

## 🚀 Built With

- **[Astro](https://astro.build/)** – Lightning-fast static site generation.
- **[TailwindCSS](https://tailwindcss.com/)** – Utility-first CSS for rapid UI styling.
- **[Markdown](https://www.markdownguide.org/)** – Your content stays in plain text, easy to version and manage.

---

## 📁 Use Cases

- Publish a second brain or digital garden
- Share your research notes and knowledge base
- Create a personal wiki
- Document creative projects or coursework

---

## 📸 Screenshots

![](src/content/vault/Assets/Screenshots/001.jpg)
![](src/content/vault/Assets/Screenshots/002.jpg)
![](src/content/vault/Assets/Screenshots/003.jpg)
![](src/content/vault/Assets/Screenshots/004.jpg)

---

## 🛠 Setup & Usage

1. Start a new project with `create spaceship`, `create astro`, or just clone this repo.
```sh
npm create spaceship@latest
# or
npm create astro@latest -- --template aitorllj93/astro-theme-spaceship
# or
degit aitorllj93/astro-theme-spaceship
```
2. Drop your Obsidian vault into the `content/` folder.
3. Customize your config (navigation, theme colors, etc.)
4. Run `npm install && npm run dev` to get started!

###  Customization

* `website.config.mjs`: Global settings such as the Website name and default author
* `styles/global.css`: Tailwind CSS configuration
* `content.config.ts`: Your collections config, including the Obsidian one. Be careful while applying changes here.
* `content`: Your Obsidian Vault + some metadata collections: Authors and Tags

---

## 🧠 Notes

- Internal links work only for files within the vault structure.
- Uses YAML frontmatter for publishing logic.
- Markdown rendering includes code highlighting, math support (optional), and responsive design out-of-the-box.

---

## 🧪 Future Improvements

- Search functionality
- Dark mode toggle
- Custom plugin support
- Tag pages and graph view
- Configuration script

---

## 📄 License

MIT – Free to use, modify, and share.
