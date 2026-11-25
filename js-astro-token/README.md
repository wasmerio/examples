<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Token Template](https://github.com/ArnavK-09/token-template) Astro theme by ArnavK-09, copied from commit `94ae04ef8bee08848f8dce3a292e5749a966d495` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-token.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Resized 1 image over 300 KB to at most 1600 px wide, keeping file names and formats.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
  - The theme has no lockfile, so this folder adds a package-lock.json generated with npm.
- **Environment variables:** None.
- **Credit:** theme by [ArnavK-09](https://github.com/ArnavK-09), ISC. The theme's license file is kept unchanged.
<!-- wasmer:end -->

<h1 align="center">Token</h1>
<h2 align="center">Minimal Astro + Tailwind CSS Starter</h2>

<p align="center">
    <img alt="hero" width="450" src="public/image.png" />
</p>

> [!NOTE]
>
> `token-template` is a modern and minimalistic Astro + Tailwind CSS starter designed for developers and creators. With a sleek black-and-white terminal-inspired design, it features support for Markdown (MD), MDX, RSS feeds, sitemaps, and fully static content, making it perfect for personal portfolios and blogs.

## 🌟 Features

> **token-template** features intro:

- **Minimalist Design** – Black-and-white terminal-inspired aesthetics with custom fonts.
- **Astro + Tailwind CSS** – Built using Astro and styled with Tailwind CSS for easy customization.
- **Content Support** – Write blog posts or documentation in Markdown (MD) and MDX.
- **Static and Fast** – Fully static content optimized for performance.

## 💻 Installation

> [!TIP]
> Remember to update [`src/consts.ts`](https://github.com/ArnavK-09/token-template/blob/main/src/consts.ts)

###### terminal

```bash
# Clone the repository
git clone https://github.com/ArnavK-09/token-template.git my-portfolio
cd my-portfolio

# Install dependencies
npm install

# Run the development server
npm run dev
```

## 📷 Screenshots

> Here's a working and expected screenshot of **token-template**

| Landing Page                              |
| ----------------------------------------- |
| ![Demo](/public/screenshot.png) |

| [Lighthouse Results](https://pagespeed.web.dev/analysis/https-token-template-deno-dev/o4lgrcn8pd?form_factor=desktop)                              |
| ----------------------------------------- |
| ![results](/public/lighthouse.png) |

---

## 💻 Contributing

> [!TIP]  
> We welcome contributions to improve **token-template**! If you have suggestions, bug fixes, or new feature ideas, follow these steps:

1. **Fork the Repository**  
   Click the **Fork** button at the top-right of the repo page.

2. **Clone Your Fork**  
   Clone the repo locally:

   ```bash
   git clone https://github.com/ArnavK-09/token-template.git
   ```

3. **Create a Branch**  
   Create a new branch for your changes:

   ```bash
   git checkout -b your-feature-branch
   ```

4. **Make Changes**  
   Implement your changes (bug fixes, features, etc.).

5. **Commit and Push**  
   Commit your changes and push the branch:

   ```bash
   git commit -m "feat(scope): description"
   git push origin your-feature-branch
   ```

6. **Open a Pull Request**  
   Open a PR with a detailed description of your changes.

7. **Collaborate and Merge**  
   The maintainers will review your PR, request changes if needed, and merge it once approved.

## 🙋‍♂️ Issues

Found a bug or need help? Please create an issue on the [GitHub repository](https://github.com/ArnavK-09/token-template/issues) with a detailed description.

## 👤 Author

<table>
  <tbody>
    <tr>
        <td align="center" valign="top" width="14.28%"><a href="https://github.com/ArnavK-09"><img src="https://github.com/ArnavK-09.png?s=100" width="130px;" alt="Arnav K"/></a><br /><a href="https://github.com/ArnavK-09"<h4><b>Arnav K</b></h3></a></td>
    </tr>
  </tbody>
</table>

---

<h2 align="center">📄 License</h2>

<p align="center">
<strong>token-template</strong> is licensed under the <code>ISC</code> License. See the <a href="https://github.com/ArnavK-09/token-template/blob/main/LICENSE">LICENSE</a> file for more details.
</p>

---

<p align="center">
    <strong>🌟 If you find this project helpful, please give it a star on GitHub! 🌟</strong>
</p>
