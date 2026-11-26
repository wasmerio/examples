<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Muhammad Fiaz Github Io](https://github.com/muhammad-fiaz/muhammad-fiaz.github.io) Astro theme by muhammad-fiaz, copied from commit `700d7e3bbccd85828cc91eb5fa649b418b0b6485` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-muhammad-fiaz-github-io.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed lockfiles of other package managers: bun.lock; kept package-lock.json.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [muhammad-fiaz](https://github.com/muhammad-fiaz), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

<div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; text-align: center;">
  <h1 style="text-align: center;">🌐 muhammad-fiaz.github.io</h1>
</div>





<br>

> Make sure to ⭐ the repo if you found it helpful!


## 🚀 Getting Started

Clone the repo:

```bash
git clone https://github.com/muhammad-fiaz/muhammad-fiaz.github.io.git
cd muhammad-fiaz.github.io
npm install
```

### 📌 Development

```bash
npm run dev
```

### 📌 Production Build

```bash
npm run build
```

### 📌 Preview Build

```bash
npm run preview
```

## 🌍 Deployment

This project is optimized for deployment on [Netlify](https://www.netlify.com/) or [GitHub Pages](https://pages.github.com/). To deploy on GitHub Pages:

- Create a new repo named: `<your-github-username>.github.io`
- Push the build output (`dist` folder) to the root of that repo
- Or configure Netlify to deploy the `dist/` folder directly from your main branch

## 🔧 Configuration

Make changes in:

- `src/pages/index.astro` – main homepage content
- `src/assets/` – for images and static content
- `astro.config.mjs` – modify integrations or base settings

## 🧠 Linting & Type Checking

```bash
npm run check   # Type check with Astro
npm run eslint  # Lint source files
```

## 📬 Contact

If you have any questions or feedback, feel free to reach out at [contact@muhammadfiaz.com](mailto:contact@muhammadfiaz.com)

## 🤝 Contributing

1. Fork this repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Made with ❤️ by **Muhammad Fiaz**