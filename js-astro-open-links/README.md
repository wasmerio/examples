<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [OpenLInks](https://github.com/E10YDEV/OpenLinks) Astro theme by E10YDEV, copied from commit `6341999224010954aac79af7085840e720f7aa7e` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-open-links.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [E10YDEV](https://github.com/E10YDEV), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# OpenLinks 🚀

**OpenLinks** is a free, open-source Astro template for creating customizable link-in-bio pages. All configuration is handled via a single JSON file, making it extremely easy to personalize and deploy.

![OpenLinks Screenshot](/OpenLinks.png)

---

## ✨ Features

⭐ **100% JSON-driven:** Configure your profile, links, theme, and more via [`OpenLinks.json`](OpenLinks.json).  
⭐ **Customizable themes:** Switch between built-in themes or create your own in [`themes.ts`](themes.ts).  
⭐ **Responsive design:** Looks great on mobile and desktop.  
⭐ **Custom icons support:** Add SVG icons to your links.  
⭐ **TailwindCSS integration:** Modern, easily editable styles.  
⭐ **Adult content warning:** Optional +18 warning banner.  
⭐ **SEO & social meta:** Optimized for sharing on social media.  
⭐ **Easy deployment:** Works with Vercel, Netlify, GitHub Pages, and more.

---

## 📦 Project Structure

```text
/
├── OpenLinks.json         # Main config (profile, links, theme, etc)
├── themes.ts              # Available themes
├── src/
│   ├── components/        # Reusable Astro components
│   ├── layouts/           # Main layout
│   ├── lib/               # Utilities (e.g. getTheme)
│   ├── pages/             # Astro pages
│   └── styles/            # Global styles and Tailwind
├── public/                # Static files (icons, fonts, avatar)
├── astro.config.mjs       # Astro + Tailwind config
├── package.json           # Dependencies and scripts
└── README.md
```

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/E10YDEV/OpenLinks.git
   cd OpenLinks
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Customize your page:**
   - Edit [`OpenLinks.json`](OpenLinks.json) to change your profile, links, theme, etc.
   - (Optional) Edit [`themes.ts`](themes.ts) to add or modify themes.

4. **Start the development server:**
   ```sh
   npm run dev
   ```
   Open [http://localhost:4321](http://localhost:4321) in your browser.

5. **Build for production:**
   ```sh
   npm run build
   ```

6. **Preview the production build:**
   ```sh
   npm run preview
   ```

---

## ⚙ Configuration

- **Profile & links:** All managed in [`OpenLinks.json`](OpenLinks.json).
- **Themes:** Set the `"theme"` value in the JSON to any available in [`themes.ts`](themes.ts): `default`, `ocean`, `forest`, `sunrise`, `ness`, `arctic`, `cherry`, `brutalism`.
- **Icons:** Place your SVGs in `public/icons/` and reference the path in each link.

---
## 📝 How to Edit `OpenLinks.json`

All your profile information, links, and theme settings are managed in the `OpenLinks.json` file at the root of the project. Here’s how to customize it:

### Example Structure

```json
{
  "name": "Your Name",
  "description": "Short bio or description.",
  "avatar": "/avatar.png",
  "theme": "ocean",
  "links": [
    {
      "title": "GitHub",
      "url": "https://github.com/yourusername",
      "icon": "/icons/github.svg"
    },
    {
      "title": "Twitter",
      "url": "https://twitter.com/yourusername",
      "icon": "/icons/twitter.svg"
    }
  ],
  "adultContent": false
}
```

### Fields

- **name:** Your display name.
- **description:** A short description or tagline.
- **avatar:** Path to your profile image (place it in the `public/` folder).
- **theme:** Choose a theme from those available in `themes.ts`.
- **links:** An array of your links. Each link can have:
  - `title`: The label shown on your page.
  - `url`: The destination URL.
  - `icon`: Path to an SVG icon (place SVGs in `public/icons/`).
- **adultContent:** Set to `true` to show a +18 warning banner.

### Customizing

- Add, remove, or edit links as needed.
- Change the theme by updating the `"theme"` value.
- Update your avatar or bio at any time.

After saving changes to `OpenLinks.json`, your site will update automatically in development mode.

---

## 🛠 Available Scripts

| Command            | Action                                         |
|--------------------|------------------------------------------------|
| `npm run dev`      | Start the development server                   |
| `npm run build`    | Build the site for production in `/dist`       |
| `npm run preview`  | Preview the production build locally           |
| `npm run astro`    | Run Astro CLI commands                         |

---

## 🛣 Upcoming Features

OpenLinks is actively developed! Here’s what’s coming soon:

- **Link sharing system:** Easily share and manage your links with others.
- **Advanced customization:** More options to personalize layouts and components.
- **SVG icon color support:** Change the color of your SVG icons directly from your configuration.
- **More themes:** A wider variety of built-in themes to choose from.

Stay tuned for updates and feel free to suggest features or contribute!

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for new features, improvements, or bug fixes, feel free to open an issue or submit a pull request.

**How to contribute:**
1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Make your changes and commit them.
4. Open a pull request describing your changes.

Please follow the existing code style and include clear commit messages. Thank you for helping make OpenLinks better!

---

## 📄 License

MIT. Made with ❤ by [E10Y](https://github.com/E10YDEV).

---

Customize, deploy, and share your link-in-bio page in minutes!
