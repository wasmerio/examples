<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Pawstronaut](https://github.com/wpinfusion/pawstronaut) Astro theme by wpinfusion, copied from commit `319a7c43c48ff0d8923fac10fdbf8abca0e28eff` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-pawstronaut.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Resized 1 image over 300 KB to at most 1600 px wide, keeping file names and formats.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [wpinfusion](https://github.com/wpinfusion), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Pawstronaut

Pawstronaut is a free theme for the Astro framework, designed specifically for animal shelters. It provides a beautiful and functional starting point for your next animal shelter website. Whether you're running a cat shelter, dog shelter, or any other type of animal rescue organization, Pawstronaut has you covered with its clean design and easy-to-use components.

## 🌟 About Pawstronaut

Pawstronaut is perfect for animal shelter owners, developers, and designers who want to quickly set up a stylish and responsive website. It leverages modern web technologies to ensure a smooth and performant user experience.

## 🛠️ Technologies Used

-   **Astro**: The core framework for building fast, content-focused websites.
-   **TailwindCSS**: A utility-first CSS framework for rapid UI development.
-   **Alpine.js**: A lightweight JavaScript framework for adding interactivity.

## 🚀 Installation and Deployment

To get started with Pawstronaut, follow these steps:

1. **Clone Pawstronaut**:

    ```sh
    git clone https://github.com/your-repo/Pawstronaut.git
    ```

2. **Install Dependencies**:

    ```sh
    npm install
    ```

3. **Run Development Server**:

    ```sh
    npm run dev
    ```

4. **Build for Production**:

    ```sh
    npm run build
    ```

## 📂 Project Structure

Inside of your Pawstronaut project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about-us.astro
│   │   ├── blog/
│   │   ├── cats/
│   │   ├── contact.astro
│   │   └── privacy-policy.mdx
│   └── styles/
└── package.json
```

## 📄 Premade Pages

-   Home
-   About Us
-   Blog
-   Cats
-   Contact
-   Privacy Policy

## 🧩 Available Components

-   Article
-   Badge
-   Button
-   Card
-   CardBlogPost
-   CardCat
-   CardMember
-   CallToAction
-   Container
-   Faq
-   Footer
-   FormAdoption
-   FormContactastro
-   Header
-   Heading
-   Hero
-   LogoContainer
-   Map
-   Members
-   Section
-   ShowBlogs
-   ShowCats
-   SocialMediaIcons
-   TableHours
-   WideImage

## 👀 Stuck?

If you have any questions or need help with Pawstronaut, feel free to reach out to me at info@wpinfusion.com, or open an issue on the [Pawstronaut GitHub repository](https://github.com/wpinfusion/pawstronaut)
