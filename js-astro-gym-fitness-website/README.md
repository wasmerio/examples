<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [FitZone Gym](https://github.com/sudeep2003/astro-gym-fitness-website) Astro theme by sudeep2003, copied from commit `b6d27aeabb5dbc3e9a536dc8f4f1b30ecef8bc54` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-gym-fitness-website.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Resized 9 images over 300 KB to at most 1600 px wide, keeping file names and formats.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [sudeep2003](https://github.com/sudeep2003), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# FitZone Gym - Fitness Website

A modern, responsive fitness gym website built with [Astro](https://astro.build), featuring a clean design and comprehensive information about gym facilities, classes, pricing, and more.

![Astro](https://img.shields.io/badge/Astro-5.15.3-FF5D01?logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.16-38B2AC?logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)

## 🖼️ Preview

### Website Screenshot
<img alt="AstroFlow Website Preview" src="./public/FitZone Gym - Fitness Astrojs Website Theme.png" />

## 🌟 Features

- **Modern Design**: Clean, responsive UI built with Tailwind CSS
- **Fast Performance**: Static site generation with Astro for optimal loading speeds
- **Comprehensive Content**:
  - Homepage with hero section, features, statistics, and testimonials
  - About page with gym history and trainer profiles
  - Classes page with detailed class information and schedules
  - Pricing page with membership plans
  - Contact page with form and location information
- **Responsive Layout**: Mobile-first design that works on all devices
- **Accessible**: Built with accessibility best practices
- **SEO Optimized**: Proper meta tags and semantic HTML

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/astro-gym-fitness-website.git
cd astro-gym-fitness-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:4321`

## 📜 Available Scripts

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:4321`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |

## 📁 Project Structure

```
/
├── public/
│   └── favicon.svg          # Site favicon
├── src/
│   ├── assets/              # Images and static assets
│   ├── components/          # Astro components
│   │   ├── Classes.astro
│   │   ├── ClassSchedule.astro
│   │   ├── ContactForm.astro
│   │   ├── Facilities.astro
│   │   ├── FAQ.astro
│   │   ├── Features.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── PricingPlans.astro
│   │   ├── Statistics.astro
│   │   ├── SuccessStories.astro
│   │   └── Testimonials.astro
│   ├── data/
│   │   └── siteData.ts      # Site configuration and data
│   ├── layouts/
│   │   └── Layout.astro     # Main layout component
│   ├── pages/               # Route pages
│   │   ├── index.astro      # Homepage
│   │   ├── about.astro      # About page
│   │   ├── classes.astro    # Classes page
│   │   ├── contact.astro    # Contact page
│   │   ├── pricing.astro    # Pricing page
│   │   └── 404.astro        # 404 error page
│   └── styles/
│       └── global.css       # Global styles
├── astro.config.mjs         # Astro configuration
├── package.json             # Project dependencies
└── tsconfig.json            # TypeScript configuration
```

## 🎨 Customization

### Updating Site Information

Edit `src/data/siteData.ts` to customize:
- Gym name and tagline
- Contact information (address, phone, email)
- Social media links
- Navigation menu
- Features, classes, pricing plans
- Testimonials and success stories
- FAQs and schedules

### Styling

The project uses Tailwind CSS for styling. You can:
- Modify `src/styles/global.css` for global styles
- Use Tailwind utility classes directly in components
- Customize Tailwind configuration (if needed)

### Adding New Pages

1. Create a new `.astro` file in `src/pages/`
2. The file name becomes the route (e.g., `services.astro` → `/services`)
3. Import and use the `Layout` component from `src/layouts/Layout.astro`

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with your static site ready for deployment.

### Deploy to Various Platforms

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Netlify:**
- Connect your repository to Netlify
- Set build command: `npm run build`
- Set publish directory: `dist`

**GitHub Pages:**
- Update `astro.config.mjs` with your base URL
- Use GitHub Actions or deploy manually

**Other Platforms:**
- Any static hosting service (Cloudflare Pages, AWS S3, etc.)

## 🛠️ Tech Stack

- **[Astro](https://astro.build)** - Web framework for building fast, content-focused websites
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org)** - Typed JavaScript
- **[Remix Icon](https://remixicon.com)** - Icon library

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Code of Conduct](CODE_OF_CONDUCT.md) first, then:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔒 Security

If you discover a security vulnerability, please see our [Security Policy](SECURITY.md) for information on how to report it.

## 📧 Contact

For questions or support, please contact:
- Email: info@fitzonegym.com
- Website: [Your Website URL]

## 🙏 Acknowledgments

- [Astro](https://astro.build) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Remix Icon](https://remixicon.com) for the beautiful icons
- All contributors and users of this project

---

Made with ❤️ for fitness enthusiasts
